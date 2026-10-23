'use strict';
/* ExamFlow on key-value / wide-column databases: Apache Cassandra (and ScyllaDB, DataStax Astra,
   Amazon Keyspaces, Azure Cosmos DB for Apache Cassandra), Amazon DynamoDB, Google Cloud Firestore.

   All three keep rows the same way: (t, p, s) → one text value "j".
     t = what it is (users, docs, audit …), p = a group of rows read together, s = the row's key
   in that group (rows of a group come back sorted by s). Values larger than CHUNK characters are
   split into "chunk" rows, so big exams fit DynamoDB's 400 KB item limit too.

   Every named statement of db-sql.js is written here in plain JavaScript on top of five
   operations each database provides: get, put, create (only if absent), del, list, plus a counter.
   These databases have no multi-row transactions: a group of changes is not undone together
   (db-check says so); everything else behaves as with SQL. Runs inside db-worker.js. */
const path = require('node:path');
const crypto = require('node:crypto');
const vendor = name => require(path.join(__dirname, '..', 'vendor', name + '.js'));

const CHUNK = 90000;               // characters per stored value (≤ 360 KB even if every character is 4 bytes)
const pad = (n, w = 16) => String(n).padStart(w, '0');
const INDEXED = ['examToken', 'teacherUid', 'switchCode'];
const COLS = {
  users: ['uid', 'email', 'name', 'pass_hash', 'source', 'oidc_sub', 'created', 'disabled'],
  codes: ['code_hash', 'email', 'purpose', 'created', 'expires', 'used'],
  logins: ['token_hash', 'uid', 'created', 'expires'],
  oidc_state: ['state', 'nonce', 'verifier', 'created'],
  allowlist: ['teacher_id', 'email', 'name', 'version'],
  allowlist_history: ['n', 't', 'package_id', 'package_version', 'list_version', 'added', 'removed', 'total'],
  audit: ['n', 't', 'actor', 'action', 'target', 'result', 'detail'],
  inbox: ['msg_id', 'email', 'delivered_at', 'read_at', 'archived_at']
};
const pick = (o, cols) => { if (!o) return undefined; const r = {}; for (const c of cols) r[c] = o[c] === undefined ? null : o[c]; return r; };

/** Adds big-value splitting and JSON on top of a raw adapter (which stores plain strings). */
function store(A) {
  const chunkP = (t, p, s) => t + '|' + p + '|' + s;
  async function readJ(t, p, s, raw) {
    if (raw === null || raw === undefined) return null;
    if (raw.startsWith('#chunks:')) {
      const n = Number(raw.slice(8)); const parts = await A.list('chunk', chunkP(t, p, s), {});
      if (parts.length < n) throw new Error(`A stored value is incomplete (${parts.length} of ${n} parts) in ${t}.`);
      return JSON.parse(parts.slice(0, n).map(x => x.j).join(''));
    }
    return JSON.parse(raw);
  }
  async function dropChunks(t, p, s, from) {
    for (const c of await A.list('chunk', chunkP(t, p, s), {})) if (Number(c.s) >= from) await A.del('chunk', chunkP(t, p, s), c.s);
  }
  async function writeJ(t, p, s, obj, onlyIfAbsent) {
    const j = JSON.stringify(obj);
    if (j.length <= CHUNK) {
      if (onlyIfAbsent) return A.create(t, p, s, j);
      const old = await A.get(t, p, s);
      await A.put(t, p, s, j);
      if (old && old.startsWith('#chunks:')) await dropChunks(t, p, s, 0);
      return true;
    }
    const n = Math.ceil(j.length / CHUNK);
    if (onlyIfAbsent && (await A.get(t, p, s)) !== null) return false;
    for (let i = 0; i < n; i++) await A.put('chunk', chunkP(t, p, s), pad(i, 6), j.slice(i * CHUNK, (i + 1) * CHUNK));
    const old = await A.get(t, p, s);
    await A.put(t, p, s, '#chunks:' + n);
    if (old && old.startsWith('#chunks:') && Number(old.slice(8)) > n) await dropChunks(t, p, s, n);
    return true;
  }
  return {
    get: async (t, p, s) => readJ(t, p, s, await A.get(t, p, s)),
    put: (t, p, s, obj) => writeJ(t, p, s, obj, false),
    create: (t, p, s, obj) => writeJ(t, p, s, obj, true),
    async del(t, p, s) { const old = await A.get(t, p, s); if (old === null) return false; await A.del(t, p, s); if (old.startsWith('#chunks:')) await dropChunks(t, p, s, 0); return true; },
    async list(t, p, o = {}) { const out = []; for (const r of await A.list(t, p, o)) out.push({ s: r.s, ...(await readJ(t, p, r.s, r.j)) }); return out; },
    incr: name => A.incr(name),
    A
  };
}

/** The named statements (same names and same row shapes as db-sql.js). */
function statements(S) {
  const changes = n => ({ rows: [], changes: n });
  const rows = list => ({ rows: list, changes: 0 });
  const one = r => ({ rows: r ? [r] : [], changes: 0 });
  const U = async () => (await S.list('users', '_')).map(r => pick(r, COLS.users));
  const docKey = (col, id) => col + '|' + id;
  const ixKey = (col, f, v) => col + '|' + f + '|' + JSON.stringify(v);
  async function audit(row) { const n = await S.incr('audit'); await S.put('audit', '_', pad(n), { ...row, n }); return changes(1); }
  const M = {
    'meta.get': async k => { const r = await S.get('meta', '_', k); return one(r ? { v: r.v === undefined ? null : r.v } : null); },
    'meta.set': async (k, v) => { await S.put('meta', '_', k, { v }); return changes(1); },
    'docs.get': async (col, id) => { const r = await S.get('doc', docKey(col, id), '_'); return one(r ? { data: r.data } : null); },
    async 'docs.put'(col, id, data, created, updated) {
      const old = await S.get('doc', docKey(col, id), '_');
      let fNew = {}; try { const d = JSON.parse(data); if (d && typeof d === 'object') for (const f of INDEXED) if (['string', 'number', 'boolean'].includes(typeof d[f])) fNew[f] = d[f]; } catch (e) {}
      const createdAt = old ? old.created : created;
      await S.put('doc', docKey(col, id), '_', { col, id, data, created: createdAt, updated, f: fNew });
      if (!old) { await S.put('doclist', col, pad(createdAt) + '|' + id, { id }); await S.put('cols', '_', col, { col }); }
      const fOld = (old && old.f) || {};
      for (const f of INDEXED) {
        if (fOld[f] !== undefined && fOld[f] !== fNew[f]) await S.del('docidx', ixKey(col, f, fOld[f]), id);
        if (fNew[f] !== undefined && fOld[f] !== fNew[f]) await S.put('docidx', ixKey(col, f, fNew[f]), id, { id });
      }
      return changes(1);
    },
    async 'docs.delete'(col, id) {
      const old = await S.get('doc', docKey(col, id), '_'); if (!old) return changes(0);
      for (const f of INDEXED) if (old.f && old.f[f] !== undefined) await S.del('docidx', ixKey(col, f, old.f[f]), id);
      await S.del('doclist', col, pad(old.created) + '|' + id);
      await S.del('doc', docKey(col, id), '_');
      return changes(1);
    },
    async 'docs.counts'() { const out = []; for (const c of await S.list('cols', '_')) { const n = (await S.A.list('doclist', c.col, {})).length; if (n) out.push({ col: c.col, n }); } return rows(out); },
    'audit.insert': (t, actor, action, target, result, detail) => audit({ t, actor, action, target, result, detail }),
    'logins.insert': async (token_hash, uid, created, expires) => { await S.put('logins', '_', token_hash, { token_hash, uid, created, expires }); return changes(1); },
    async 'logins.purge'(now) { let n = 0; for (const r of await S.list('logins', '_')) if (r.expires < now) { await S.del('logins', '_', r.s); n++; } return changes(n); },
    async 'logins.user'(hash, now) {
      const l = await S.get('logins', '_', hash); if (!l || !(l.expires > now)) return one(null);
      const u = await S.get('users', '_', l.uid); return one(u ? pick(u, ['uid', 'email', 'name', 'disabled']) : null);
    },
    'logins.delete': async hash => changes((await S.del('logins', '_', hash)) ? 1 : 0),
    async 'logins.deleteUser'(uid) { let n = 0; for (const r of await S.list('logins', '_')) if (r.uid === uid) { await S.del('logins', '_', r.s); n++; } return changes(n); },
    async 'allowlist.byEmail'(email) { const r = (await S.list('allowlist', '_')).find(a => a.email === email); return one(r ? pick(r, ['teacher_id', 'email', 'name']) : null); },
    'allowlist.byEmailAll': async email => rows((await S.list('allowlist', '_')).filter(a => a.email === email).map(a => pick(a, COLS.allowlist))),
    async 'allowlist.withoutAccount'() { const have = new Set((await U()).map(u => u.email)); return rows((await S.list('allowlist', '_')).filter(a => !have.has(a.email)).map(a => pick(a, COLS.allowlist))); },
    async 'allowlist.withAccountFlag'() { const uid = new Map((await U()).map(u => [u.email, u.uid])); return rows((await S.list('allowlist', '_')).map(a => ({ teacher_id: a.teacher_id, email: a.email, uid: uid.get(a.email) || null }))); },
    'allowlist.pairs': async () => rows((await S.list('allowlist', '_')).map(a => pick(a, ['teacher_id', 'email']))),
    'allowlist.emails': async () => rows((await S.list('allowlist', '_')).map(a => ({ email: a.email }))),
    async 'allowlist.clear'() { const all = await S.list('allowlist', '_'); for (const a of all) { await S.del('allowlist', '_', a.s); await S.del('allow_email', '_', a.email); } return changes(all.length); },
    async 'allowlist.insert'(teacher_id, email, name, version) {
      if (!(await S.create('allow_email', '_', email, { teacher_id }))) throw new Error('duplicate email in the teacher list (unique constraint): ' + email);
      if (!(await S.create('allowlist', '_', teacher_id, { teacher_id, email, name, version }))) { await S.del('allow_email', '_', email); throw new Error('duplicate teacher ID (unique constraint): ' + teacher_id); }
      return changes(1);
    },
    async 'allowHistory.insert'(t, package_id, package_version, list_version, added, removed, total) { const n = await S.incr('allowlist_history'); await S.put('allowhist', '_', pad(n), { n, t, package_id, package_version, list_version, added, removed, total }); return changes(1); },
    async 'codes.retire'(now, email, purpose) { let n = 0; for (const c of await S.list('codes', '_')) if (c.email === email && c.purpose === purpose && (c.used === null || c.used === undefined)) { await S.put('codes', '_', c.s, { ...pick(c, COLS.codes), used: now }); n++; } return changes(n); },
    'codes.insert': async (code_hash, email, purpose, created, expires) => { if (!(await S.create('codes', '_', code_hash, { code_hash, email, purpose, created, expires, used: null }))) throw new Error('duplicate code (unique constraint)'); return changes(1); },
    'codes.get': async hash => one(pick(await S.get('codes', '_', hash), COLS.codes)),
    async 'codes.use'(now, hash) { const c = await S.get('codes', '_', hash); if (!c) return changes(0); await S.put('codes', '_', hash, { ...pick(c, COLS.codes), used: now }); return changes(1); },
    async 'users.uidByEmail'(email) { const e = await S.get('user_email', '_', email); return one(e ? { uid: e.uid } : null); },
    async 'users.setPassword'(pass_hash, uid) { const u = await S.get('users', '_', uid); if (!u) return changes(0); await S.put('users', '_', uid, { ...pick(u, COLS.users), pass_hash, disabled: 0 }); return changes(1); },
    'users.insertLocal': (uid, email, name, pass_hash, source, created) => insertUser({ uid, email, name, pass_hash, source, oidc_sub: null, created, disabled: 0 }),
    async 'users.byEmail'(email) { const e = await S.get('user_email', '_', email); return one(e ? pick(await S.get('users', '_', e.uid), COLS.users) : null); },
    async 'users.byOidc'(sub, source) { return one((await U()).find(u => u.oidc_sub === sub && u.source === source) || null); },
    'users.insertOidc': (uid, email, name, source, oidc_sub, created) => insertUser({ uid, email, name, pass_hash: null, source, oidc_sub, created, disabled: 0 }),
    async 'users.setOidcSub'(sub, uid) { const u = await S.get('users', '_', uid); if (!u) return changes(0); await S.put('users', '_', uid, { ...pick(u, COLS.users), oidc_sub: sub }); return changes(1); },
    async 'oidc.purge'(t) { let n = 0; for (const r of await S.list('oidc', '_')) if (r.created < t) { await S.del('oidc', '_', r.s); n++; } return changes(n); },
    'oidc.insert': async (state, nonce, verifier, created) => { await S.put('oidc', '_', state, { state, nonce, verifier, created }); return changes(1); },
    'oidc.get': async state => one(pick(await S.get('oidc', '_', state), COLS.oidc_state)),
    'oidc.delete': async state => changes((await S.del('oidc', '_', state)) ? 1 : 0),
    'inbox.byMsg': async msg => rows((await S.list('inbox', msg)).map(r => pick(r, ['delivered_at', 'read_at']))),
    'inbox.get': async (msg, email) => one(pick(await S.get('inbox', msg, email), ['delivered_at', 'read_at', 'archived_at'])),
    'inbox.ensure': async (msg_id, email, t) => changes((await S.create('inbox', msg_id, email, { msg_id, email, delivered_at: t, read_at: null, archived_at: null })) ? 1 : 0),
    async 'inbox.read'(now, msg, email) { const r = await S.get('inbox', msg, email); if (!r) return changes(0); if (r.read_at === null || r.read_at === undefined) await S.put('inbox', msg, email, { ...pick(r, COLS.inbox), read_at: now }); return changes(1); },
    async 'inbox.archive'(now, now2, msg, email) { const r = await S.get('inbox', msg, email); if (!r) return changes(0); await S.put('inbox', msg, email, { ...pick(r, COLS.inbox), archived_at: now, read_at: r.read_at === null || r.read_at === undefined ? now2 : r.read_at }); return changes(1); },
    async 'inbox.unarchive'(msg, email) { const r = await S.get('inbox', msg, email); if (!r) return changes(0); await S.put('inbox', msg, email, { ...pick(r, COLS.inbox), archived_at: null }); return changes(1); }
  };
  async function insertUser(u) {
    if (!(await S.create('user_email', '_', u.email, { uid: u.uid }))) throw new Error('duplicate email (unique constraint): ' + u.email);
    if (!(await S.create('users', '_', u.uid, u))) { await S.del('user_email', '_', u.email); throw new Error('duplicate user (unique constraint)'); }
    return changes(1);
  }
  /** Documents search: equality on top-level fields, oldest first (same result as the SQL versions). */
  async function query(col, where, limit) {
    const want = where.map(([f, , v]) => [f, v === undefined ? null : v]);
    const ix = want.find(([f, v]) => INDEXED.includes(f) && v !== null);
    let ids;
    if (ix) ids = (await S.list('docidx', ixKey(col, ix[0], ix[1]))).map(r => r.id);
    else ids = (await S.A.list('doclist', col, {})).map(r => JSON.parse(r.j).id);
    const out = [];
    for (const id of ids) {
      const r = await S.get('doc', docKey(col, id), '_'); if (!r) continue;
      const d = JSON.parse(r.data);
      if (want.every(([f, v]) => (v === null ? (d[f] === undefined || d[f] === null) : d[f] === v))) out.push({ id: r.id, data: r.data, created: r.created });
    }
    out.sort((a, b) => a.created - b.created || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
    return rows((limit ? out.slice(0, Number(limit)) : out).map(r => ({ id: r.id, data: r.data })));
  }
  /** For import-sqlite: one row of a SQLite table. */
  async function importRow(table, r) {
    switch (table) {
      case 'docs': return M['docs.put'](r.col, r.id, r.data, r.created, r.updated);
      case 'users': return insertUser(pick(r, COLS.users));
      case 'codes': await S.put('codes', '_', r.code_hash, pick(r, COLS.codes)); return changes(1);
      case 'logins': await S.put('logins', '_', r.token_hash, pick(r, COLS.logins)); return changes(1);
      case 'allowlist': return M['allowlist.insert'](r.teacher_id, r.email, r.name, r.version);
      case 'allowlist_history': return M['allowHistory.insert'](r.t, r.package_id, r.package_version, r.list_version, r.added, r.removed, r.total);
      case 'audit': return audit(pick(r, ['t', 'actor', 'action', 'target', 'result', 'detail']));
      case 'inbox': await S.put('inbox', r.msg_id, r.email, pick(r, COLS.inbox)); return changes(1);
      default: throw new Error('Unknown table ' + table);
    }
  }
  async function count(table) {
    const where = { docs: null, users: ['users', '_'], audit: ['audit', '_'], codes: ['codes', '_'], logins: ['logins', '_'], allowlist: ['allowlist', '_'], inbox: null }[table];
    if (table === 'docs') { let n = 0; for (const c of await S.list('cols', '_')) n += (await S.A.list('doclist', c.col, {})).length; return n; }
    if (!where) return 0;
    return (await S.A.list(where[0], where[1], {})).length;
  }
  /** Can this account change an audit line? (On these databases only ExamFlow itself prevents it.) */
  async function tamper() {
    const recent = await S.list('audit', '_', { reverse: true, limit: 50 });
    const d = recent.find(r => r.action === 'db.check'); if (!d) return { blocked: false, why: 'no test line' };
    const { s, ...row } = d;
    try { await S.put('audit', '_', s, { ...row, result: 'changed' }); } catch (e) { return { blocked: true, why: e.message }; }
    await S.put('audit', '_', s, row);
    return { blocked: false };
  }
  return { M, query, importRow, count, tamper };
}

// ── adapters: each stores (t, p, s) → string j ───────────────────────────────

/** Amazon DynamoDB: one table (DB_NAME, default "examflow") with key pk (t|p) + sk (s). */
function dynamo(cfg) {
  const D = vendor('dynamodb');
  const TABLE = cfg.name || 'examflow';
  const client = new D.DynamoDBClient({
    region: cfg.region || 'us-east-1',
    ...(cfg.url ? { endpoint: cfg.url } : {}),
    ...(cfg.accessKeyId ? { credentials: { accessKeyId: cfg.accessKeyId, secretAccessKey: cfg.secretAccessKey, ...(cfg.sessionToken ? { sessionToken: cfg.sessionToken } : {}) } } : {}),
    maxAttempts: 5
  });
  const send = c => client.send(c);
  const K = (t, p, s) => ({ pk: { S: t + '|' + p }, sk: { S: s } });
  return {
    async connect() { await send(new D.ListTablesCommand({ Limit: 1 })); },
    async init() {
      try { await send(new D.DescribeTableCommand({ TableName: TABLE })); return; } catch (e) { if (e.name !== 'ResourceNotFoundException') throw e; }
      await send(new D.CreateTableCommand({ TableName: TABLE, BillingMode: 'PAY_PER_REQUEST',
        AttributeDefinitions: [{ AttributeName: 'pk', AttributeType: 'S' }, { AttributeName: 'sk', AttributeType: 'S' }],
        KeySchema: [{ AttributeName: 'pk', KeyType: 'HASH' }, { AttributeName: 'sk', KeyType: 'RANGE' }] }));
      for (let i = 0; i < 120; i++) { const d = await send(new D.DescribeTableCommand({ TableName: TABLE })); if (d.Table.TableStatus === 'ACTIVE') return; await new Promise(r => setTimeout(r, 1000)); }
      throw new Error('The DynamoDB table ' + TABLE + ' did not become ACTIVE.');
    },
    async get(t, p, s) { const r = await send(new D.GetItemCommand({ TableName: TABLE, Key: K(t, p, s), ConsistentRead: true })); return r.Item ? r.Item.j.S : null; },
    async put(t, p, s, j) { await send(new D.PutItemCommand({ TableName: TABLE, Item: { ...K(t, p, s), j: { S: j } } })); },
    async create(t, p, s, j) {
      try { await send(new D.PutItemCommand({ TableName: TABLE, Item: { ...K(t, p, s), j: { S: j } }, ConditionExpression: 'attribute_not_exists(pk)' })); return true; }
      catch (e) { if (e.name === 'ConditionalCheckFailedException') return false; throw e; }
    },
    async del(t, p, s) { await send(new D.DeleteItemCommand({ TableName: TABLE, Key: K(t, p, s) })); },
    async list(t, p, o) {
      const out = []; let start;
      do {
        const r = await send(new D.QueryCommand({ TableName: TABLE, KeyConditionExpression: 'pk = :p', ExpressionAttributeValues: { ':p': { S: t + '|' + p } },
          ConsistentRead: true, ScanIndexForward: !o.reverse, ...(o.limit ? { Limit: o.limit - out.length } : {}), ...(start ? { ExclusiveStartKey: start } : {}) }));
        for (const it of r.Items || []) out.push({ s: it.sk.S, j: it.j.S });
        start = r.LastEvaluatedKey;
      } while (start && !(o.limit && out.length >= o.limit));
      return out;
    },
    async incr(name) {
      const r = await send(new D.UpdateItemCommand({ TableName: TABLE, Key: K('#counter', '_', name), UpdateExpression: 'ADD #n :one', ExpressionAttributeNames: { '#n': 'n' }, ExpressionAttributeValues: { ':one': { N: '1' } }, ReturnValues: 'UPDATED_NEW' }));
      return Number(r.Attributes.n.N);
    },
    async version() { return 'Amazon DynamoDB (' + (cfg.url ? cfg.url : 'region ' + (cfg.region || 'us-east-1')) + ')'; },
    close: async () => client.destroy()
  };
}

/** Apache Cassandra / ScyllaDB / DataStax Astra / Amazon Keyspaces / Cosmos DB for Cassandra (CQL protocol). */
function cassandra(cfg) {
  const C = vendor('cassandra');
  const KS = cfg.name;
  const points = String(cfg.host || '').split(',').map(h => h.trim()).filter(Boolean).map(h => (h.includes(':') ? h : h + ':' + (cfg.port || 9042)));
  const opts = {
    ...(cfg.secureBundle ? { cloud: { secureConnectBundle: cfg.secureBundle } } : { contactPoints: points, localDataCenter: cfg.dataCenter || 'datacenter1' }),
    ...(cfg.user ? { credentials: { username: cfg.user, password: cfg.password } } : {}),
    ...(cfg.ssl && !cfg.secureBundle ? { sslOptions: { rejectUnauthorized: cfg.sslVerify !== false, ...(cfg.sslCa ? { ca: [cfg.sslCa] } : {}), ...(cfg.sslCert ? { cert: cfg.sslCert, key: cfg.sslKey } : {}), ...(points[0] ? { servername: points[0].split(':')[0] } : {}) } } : {}),
    socketOptions: { connectTimeout: 20000, readTimeout: 60000 },
    queryOptions: { consistency: C.types.consistencies[cfg.consistency || 'localQuorum'] || C.types.consistencies.localQuorum, prepare: true }
  };
  const client = new C.Client(opts);
  const q = (cql, params, o = {}) => client.execute(cql, params, { prepare: true, ...o });
  const T = `"${KS}".kv`, N = `"${KS}".counters`;
  return {
    async connect() { await client.connect(); },
    async init() {
      // The keyspace (with the replication the DBA chose) must exist; tables are created if missing.
      const ks = await q('SELECT keyspace_name FROM system_schema.keyspaces WHERE keyspace_name = ?', [KS]);
      if (!ks.rowLength) throw new Error(`Keyspace ${KS} does not exist. Ask the DBA to create it (DATABASES.md shows the CQL).`);
      await client.execute(`CREATE TABLE IF NOT EXISTS ${T} (t text, p text, s text, j text, PRIMARY KEY ((t, p), s))`);
      await client.execute(`CREATE TABLE IF NOT EXISTS ${N} (t text, k text, n counter, PRIMARY KEY ((t), k))`);
    },
    async get(t, p, s) { const r = await q(`SELECT j FROM ${T} WHERE t = ? AND p = ? AND s = ?`, [t, p, s]); return r.rowLength ? r.rows[0].j : null; },
    async put(t, p, s, j) { await q(`INSERT INTO ${T} (t, p, s, j) VALUES (?, ?, ?, ?)`, [t, p, s, j]); },
    async create(t, p, s, j) { const r = await q(`INSERT INTO ${T} (t, p, s, j) VALUES (?, ?, ?, ?) IF NOT EXISTS`, [t, p, s, j]); return r.rows[0]['[applied]'] === true; },
    async del(t, p, s) { await q(`DELETE FROM ${T} WHERE t = ? AND p = ? AND s = ?`, [t, p, s]); },
    async list(t, p, o) {
      const out = []; const cql = `SELECT s, j FROM ${T} WHERE t = ? AND p = ? ORDER BY s ${o.reverse ? 'DESC' : 'ASC'}` + (o.limit ? ` LIMIT ${Number(o.limit)}` : '');
      for await (const row of client.stream(cql, [t, p], { prepare: true, fetchSize: 500 })) out.push({ s: row.s, j: row.j });
      return out;
    },
    async incr(name) {
      await q(`UPDATE ${N} SET n = n + 1 WHERE t = 'seq' AND k = ?`, [name]);
      const r = await q(`SELECT n FROM ${N} WHERE t = 'seq' AND k = ?`, [name]);
      return Number(r.rows[0].n);
    },
    async version() { const r = await client.execute('SELECT release_version FROM system.local'); return 'Cassandra protocol, release ' + (r.rows[0] && r.rows[0].release_version); },
    close: () => client.shutdown()
  };
}

/** Google Cloud Firestore (Native mode), through its REST API: no extra libraries.
    Rows live at  <DB_NAME>/<t|p>/r/<s>  (DB_NAME is the top collection, default "examflow"). */
function firestore(cfg) {
  const enc = x => 'k' + Buffer.from(String(x)).toString('base64url');   // document IDs may not contain "/"; order comes from the field s
  const creds = cfg.credentials ? JSON.parse(cfg.credentials) : null;
  const project = cfg.project || (creds && creds.project_id);
  const dbId = cfg.firestoreDatabase || '(default)';
  const base = (cfg.url ? cfg.url.replace(/\/+$/, '') : 'https://firestore.googleapis.com') + `/v1/projects/${project}/databases/${encodeURIComponent(dbId)}/documents`;
  const ROOT = cfg.name || 'examflow';
  let token = null, tokenExp = 0;
  async function auth() {
    if (cfg.url && !creds) return 'owner';                                   // the Firestore emulator
    if (token && Date.now() < tokenExp - 60000) return token;
    if (creds) {
      const now = Math.floor(Date.now() / 1000);
      const b64 = o => Buffer.from(JSON.stringify(o)).toString('base64url');
      const unsigned = b64({ alg: 'RS256', typ: 'JWT' }) + '.' + b64({ iss: creds.client_email, scope: 'https://www.googleapis.com/auth/datastore', aud: creds.token_uri || 'https://oauth2.googleapis.com/token', iat: now, exp: now + 3600 });
      const sig = crypto.sign('RSA-SHA256', Buffer.from(unsigned), creds.private_key).toString('base64url');
      const r = await fetch(creds.token_uri || 'https://oauth2.googleapis.com/token', { method: 'POST', headers: { 'content-type': 'application/x-www-form-urlencoded' },
        body: 'grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=' + unsigned + '.' + sig });
      const j = await r.json(); if (!r.ok) throw new Error('Google sign-in failed: ' + (j.error_description || j.error || r.status));
      token = j.access_token; tokenExp = Date.now() + j.expires_in * 1000; return token;
    }
    // On Google Cloud (Cloud Run, GCE, GKE) without a key file: the machine's own service account.
    const r = await fetch('http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/token', { headers: { 'Metadata-Flavor': 'Google' } });
    if (!r.ok) throw new Error('No DB_CREDENTIALS_FILE and no Google Cloud service account on this machine.');
    const j = await r.json(); token = j.access_token; tokenExp = Date.now() + j.expires_in * 1000; return token;
  }
  async function call(method, url, body) {
    const r = await fetch(url, { method, headers: { authorization: 'Bearer ' + await auth(), 'content-type': 'application/json' }, body: body ? JSON.stringify(body) : undefined });
    const text = await r.text(); const j = text ? JSON.parse(text) : {};
    if (!r.ok) { const e = new Error('Firestore: ' + ((j.error && j.error.message) || r.status)); e.code = j.error && j.error.status; e.http = r.status; throw e; }
    return j;
  }
  const docPath = (t, p, s) => `${ROOT}/${enc(t + '|' + p)}/r/${enc(s)}`;
  const fields = (s, j) => ({ fields: { s: { stringValue: s }, j: { stringValue: j } } });
  return {
    async connect() { if (!project) throw new Error('Set DB_PROJECT (the Google Cloud project ID) or DB_CREDENTIALS_FILE.'); await call('GET', `${base}/${ROOT}?pageSize=1`); },
    async init() {},
    async get(t, p, s) { try { const d = await call('GET', `${base}/${docPath(t, p, s)}`); return d.fields.j.stringValue; } catch (e) { if (e.http === 404) return null; throw e; } },
    async put(t, p, s, j) { await call('PATCH', `${base}/${docPath(t, p, s)}`, fields(s, j)); },
    async create(t, p, s, j) {
      try { await call('PATCH', `${base}/${docPath(t, p, s)}?currentDocument.exists=false`, fields(s, j)); return true; }
      catch (e) { if (e.code === 'FAILED_PRECONDITION' || e.code === 'ALREADY_EXISTS' || e.http === 409 || e.http === 400) { if ((await this.get(t, p, s)) !== null) return false; } throw e; }
    },
    async del(t, p, s) { await call('DELETE', `${base}/${docPath(t, p, s)}`); },
    async list(t, p, o) {
      const parent = `${base}/${ROOT}/${enc(t + '|' + p)}`;
      const r = await call('POST', `${parent}:runQuery`, { structuredQuery: { from: [{ collectionId: 'r' }], orderBy: [{ field: { fieldPath: 's' }, direction: o.reverse ? 'DESCENDING' : 'ASCENDING' }], ...(o.limit ? { limit: o.limit } : {}) } });
      return (Array.isArray(r) ? r : []).filter(x => x.document).map(x => ({ s: x.document.fields.s.stringValue, j: x.document.fields.j.stringValue }));
    },
    async incr(name) {
      const doc = `projects/${project}/databases/${dbId}/documents/${ROOT}/${enc('#counter|_')}/r/${enc(name)}`;
      const r = await call('POST', `${base.replace(/\/documents$/, '/documents')}:commit`, { writes: [{ transform: { document: doc, fieldTransforms: [{ fieldPath: 'n', increment: { integerValue: '1' } }] } }] });
      const v = r.writeResults[0].transformResults[0]; return Number(v.integerValue || v.doubleValue);
    },
    async version() { return `Google Cloud Firestore (project ${project}, database ${dbId})`; },
    close: async () => {}
  };
}

const ADAPTERS = { dynamodb: dynamo, cassandra, firestore };
module.exports = { store, statements, ADAPTERS, CHUNK };
