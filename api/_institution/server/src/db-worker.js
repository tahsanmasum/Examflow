'use strict';
/* Runs in a worker thread and holds the ONE connection to an external database.
   The server's main thread asks it to run a statement and waits for the answer
   (see db-remote.js), so the rest of the server uses every database exactly as it
   uses the built-in SQLite file.

   Protocols spoken here (drivers bundled in server/vendor/, nothing downloaded at install):
     postgres  PostgreSQL wire protocol  (PostgreSQL, Amazon RDS/Aurora, Azure, Cloud SQL,
                                          Supabase, Neon, Crunchy, Timescale, YugabyteDB, CockroachDB …)
     mysql     MySQL client/server protocol (MySQL, MariaDB, Percona, Amazon RDS/Aurora,
                                          Azure, Cloud SQL, PlanetScale, TiDB, SingleStore …)
     mssql     TDS (SQL Server, Azure SQL Database / Managed Instance, Amazon RDS for SQL Server)
     oracle    Oracle Net / TNS, thin mode (Oracle Database on-premises, Exadata, Autonomous DB, RDS)
     mongodb   MongoDB wire protocol (MongoDB, Atlas, Azure Cosmos DB for MongoDB, Amazon DocumentDB …)
     firebird  Firebird wire protocol, with wire encryption (Firebird 3, 4, 5)
     hana      SAP HANA SQL Command Network Protocol (SAP HANA 2.0, SAP HANA Cloud)
     db2       DRDA, through IBM's own driver, which IT installs: node server/src/cli.js add-driver db2
     cassandra CQL native protocol (Apache Cassandra, ScyllaDB, DataStax Astra, Amazon Keyspaces, Cosmos DB for Cassandra)
     dynamodb  Amazon DynamoDB HTTPS API (AWS, or DynamoDB Local)
     firestore Google Cloud Firestore REST API
   Every one can run over TLS; see DATABASES.md for the settings. */
const { workerData } = require('node:worker_threads');
const path = require('node:path');
const { port, signal, cfg } = workerData;
const vendor = name => require(path.join(__dirname, '..', 'vendor', name + '.js'));

let conn = null;
let inTx = false;

function reply(msg) {
  port.postMessage(msg);
  Atomics.add(signal, 0, 1); // the main thread waits for this number to change
  Atomics.notify(signal, 0);
}
const lost = () => { conn = null; inTx = false; };
const tlsOpts = () => cfg.ssl ? { rejectUnauthorized: cfg.sslVerify !== false, ...(cfg.sslCa ? { ca: cfg.sslCa } : {}), ...(cfg.sslCert ? { cert: cfg.sslCert } : {}), ...(cfg.sslKey ? { key: cfg.sslKey } : {}) } : undefined;

// ── PostgreSQL ──
const pgDriver = {
  async connect() {
    const pg = vendor('pg');
    pg.types.setTypeParser(20, v => v === null ? null : Number(v)); // BIGINT → number (times, counts)
    // DB_HOST may also be a Unix socket folder such as /var/run/postgresql
    const c = new pg.Client({ host: cfg.host, port: cfg.port || 5432, database: cfg.name, user: cfg.user, password: cfg.password,
      ssl: tlsOpts(), application_name: 'examflow', connectionTimeoutMillis: 20000 });
    c.on('error', lost); c.on('end', lost);
    await c.connect();
    return c;
  },
  async query(sql, args) { const r = await conn.query(sql, args); return { rows: r.rows || [], changes: r.rowCount || 0 }; },
  begin: () => conn.query('BEGIN'), commit: () => conn.query('COMMIT'), rollback: () => conn.query('ROLLBACK'),
  close: () => conn.end()
};

// ── MySQL / MariaDB ──
const myDriver = {
  async connect() {
    const mysql = vendor('mysql2');
    const ssl = tlsOpts();
    const c = mysql.createConnection({ ...(cfg.socket ? { socketPath: cfg.socket } : { host: cfg.host, port: cfg.port || 3306 }),
      database: cfg.name, user: cfg.user, password: cfg.password,
      charset: 'utf8mb4', supportBigNumbers: true, bigNumberStrings: false, connectTimeout: 20000, ...(ssl ? { ssl } : {}) });
    c.on('error', lost); c.on('end', lost);
    await new Promise((res, rej) => c.connect(e => e ? rej(e) : res()));
    await new Promise((res, rej) => c.query('SET NAMES utf8mb4 COLLATE utf8mb4_bin', e => e ? rej(e) : res()));
    return c;
  },
  query(sql, args) {
    return new Promise((res, rej) => conn.query(sql, args, (e, r) => {
      if (e) return rej(e);
      if (Array.isArray(r)) return res({ rows: r.map(x => ({ ...x })), changes: 0 });
      res({ rows: [], changes: r.affectedRows || 0 });
    }));
  },
  begin() { return myDriver.query('START TRANSACTION', []); },
  commit() { return myDriver.query('COMMIT', []); },
  rollback() { return myDriver.query('ROLLBACK', []); },
  close: () => new Promise(res => conn.end(() => res()))
};

// ── Microsoft SQL Server (TDS) ──
let T = null;
function msAuth() {
  const o = { clientId: cfg.clientId || undefined, tenantId: cfg.tenantId || undefined };
  switch (cfg.auth) {
    case 'windows': return { type: 'ntlm', options: { userName: cfg.user, password: cfg.password, domain: cfg.domain } };
    case 'azure-ad-password': return { type: 'azure-active-directory-password', options: { userName: cfg.user, password: cfg.password, ...o } };
    case 'azure-ad-service-principal': return { type: 'azure-active-directory-service-principal-secret', options: { clientId: cfg.clientId, clientSecret: cfg.clientSecret, tenantId: cfg.tenantId } };
    case 'azure-ad-managed-identity': return { type: 'azure-active-directory-msi-vm', options: cfg.clientId ? { clientId: cfg.clientId } : {} };
    case 'azure-ad-default': return { type: 'azure-active-directory-default', options: cfg.clientId ? { clientId: cfg.clientId } : {} };
    default: return { type: 'default', options: { userName: cfg.user, password: cfg.password } };
  }
}
const msDriver = {
  async connect() {
    T = vendor('tedious');
    const options = { database: cfg.name, encrypt: cfg.ssl !== false, trustServerCertificate: !!cfg.trustServerCertificate,
      connectTimeout: 20000, requestTimeout: 60000, appName: 'examflow', useColumnNames: false };
    if (cfg.sslCa) options.cryptoCredentialsDetails = { ca: cfg.sslCa };
    if (cfg.instance) options.instanceName = cfg.instance; else options.port = cfg.port || 1433;
    const c = new T.Connection({ server: cfg.host, authentication: msAuth(), options });
    c.on('end', lost); c.on('error', lost);
    await new Promise((res, rej) => c.connect(e => e ? rej(e) : res()));
    return c;
  },
  query(sql, args) {
    return new Promise((res, rej) => {
      const rows = [];
      const req = new T.Request(sql, (e, rowCount) => e ? rej(e) : res({ rows, changes: rowCount || 0 }));
      args.forEach((v, i) => {
        const type = v === null || v === undefined ? T.TYPES.NVarChar
          : typeof v === 'number' ? (Number.isInteger(v) ? T.TYPES.BigInt : T.TYPES.Float)
          : typeof v === 'boolean' ? T.TYPES.Bit : T.TYPES.NVarChar;
        req.addParameter('p' + (i + 1), type, v === undefined ? null : (type === T.TYPES.NVarChar && v !== null ? String(v) : v));
      });
      req.on('row', cols => {
        const o = {};
        for (const c of cols) {
          let v = c.value; const t = c.metadata.type.name;
          if (typeof v === 'string' && (t === 'BigInt' || (t === 'IntN' && c.metadata.dataLength === 8))) v = Number(v);
          o[c.metadata.colName] = v;
        }
        rows.push(o);
      });
      if (args.length) conn.execSql(req); else conn.execSqlBatch(req);
    });
  },
  begin: () => new Promise((res, rej) => conn.beginTransaction(e => e ? rej(e) : res())),
  commit: () => new Promise((res, rej) => conn.commitTransaction(e => e ? rej(e) : res())),
  rollback: () => new Promise((res, rej) => conn.rollbackTransaction(e => e ? rej(e) : res())),
  close: () => new Promise(res => { conn.on('end', res); conn.close(); })
};

// ── Oracle (Oracle Net, thin mode: no Oracle Client libraries needed) ──
let O = null;
const oraDriver = {
  async connect() {
    O = vendor('oracledb');
    O.fetchAsString = [O.CLOB];
    // DB_CONNECT_STRING may be an Easy Connect string, a full (DESCRIPTION=…) or a tnsnames.ora alias (with DB_TNS_ADMIN).
    const connectString = cfg.connectString || `${cfg.host}:${cfg.port || 1521}/${cfg.name}`;
    const c = await O.getConnection({ user: cfg.user, password: cfg.password, connectString, connectTimeout: 20,
      ...(cfg.tnsAdmin ? { configDir: cfg.tnsAdmin } : {}),
      ...(cfg.walletDir ? { walletLocation: cfg.walletDir, walletPassword: cfg.walletPassword || undefined } : {}),
      ...(cfg.ssl && !cfg.sslVerify ? { sslServerDNMatch: false } : {}) });
    oraVersion = c.oracleServerVersionString;
    return c;
  },
  async query(sql, args) {
    const binds = {};
    args.forEach((v, i) => {
      binds['p' + (i + 1)] = v === undefined ? null : typeof v === 'boolean' ? (v ? 1 : 0)
        : (typeof v === 'string' && v.length > 1000) ? { val: v, type: O.CLOB } : v;
    });
    const r = await conn.execute(sql, binds, { autoCommit: !inTx, outFormat: O.OUT_FORMAT_OBJECT });
    const rows = (r.rows || []).map(x => { const o = {}; for (const k of Object.keys(x)) o[k.toLowerCase()] = x[k]; return o; });
    return { rows, changes: r.rowsAffected || 0 };
  },
  begin: async () => {},            // Oracle starts a transaction by itself; statements stop auto-committing while inTx
  commit: () => conn.commit(), rollback: () => conn.rollback(),
  close: () => conn.close()
};
let oraVersion = null;

// ── MongoDB (not SQL: each named statement is written out below) ──
let M = null, client = null, mdb = null, session = null, mongoTx = true;
const MONGO_SCHEMA = 2;
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
const KEY = { users: 'uid', codes: 'code_hash', logins: 'token_hash', oidc_state: 'state', allowlist: 'teacher_id' };
const so = () => (inTx && session ? { session } : {});
const C = name => mdb.collection(name);
const row = (table, d, only) => { if (!d) return undefined; const o = {}; for (const c of only || COLS[table]) o[c] = d[c] === undefined ? null : d[c]; return o; };
const rows = (table, list, only) => ({ rows: list.map(d => row(table, d, only)), changes: 0 });
const one = async (table, filter, only) => { const d = await C(table).findOne(filter, so()); return { rows: d ? [row(table, d, only)] : [], changes: 0 }; };
const changed = r => ({ rows: [], changes: (r.modifiedCount || 0) + (r.deletedCount || 0) + (r.upsertedCount || 0) + (r.insertedCount || 0) + (r.insertedId !== undefined ? 1 : 0) });
async function insertRow(table, obj) {
  const d = {}; for (const c of COLS[table]) d[c] = obj[c] === undefined ? null : obj[c];
  if (KEY[table]) d._id = d[KEY[table]];
  if (table === 'inbox') d._id = d.msg_id + '\n' + d.email;
  if (table === 'audit' || table === 'allowlist_history') d.n = await nextSeq(table);
  return changed(await C(table).insertOne(d, so()));
}
async function nextSeq(name) {
  const r = await C('counters').findOneAndUpdate({ _id: name }, { $inc: { n: 1 } }, { upsert: true, returnDocument: 'after', ...so() });
  return (r && (r.value || r).n) || 1;
}
function scalars(json) {
  const f = {}; let d; try { d = JSON.parse(json); } catch (e) { return f; }
  if (d && typeof d === 'object') for (const [k, v] of Object.entries(d)) if (v === null || ['string', 'number', 'boolean'].includes(typeof v)) f[k] = v;
  return f;
}
const MONGO = {
  'meta.get': k => one('meta', { _id: k }, ['v']).then(r => ({ rows: r.rows.length ? [{ v: (r.rows[0].v === undefined ? null : r.rows[0].v) }] : [], changes: 0 })),
  'meta.set': async (k, v) => changed(await C('meta').updateOne({ _id: k }, { $set: { v } }, { upsert: true, ...so() })),
  'docs.get': async (col, id) => { const d = await C('docs').findOne({ _id: col + '/' + id }, so()); return { rows: d ? [{ data: d.data }] : [], changes: 0 }; },
  'docs.put': async (col, id, data, created, updated) => changed(await C('docs').updateOne({ _id: col + '/' + id },
    { $set: { col, id, data, f: scalars(data), updated }, $setOnInsert: { created } }, { upsert: true, ...so() })),
  'docs.delete': async (col, id) => changed(await C('docs').deleteOne({ _id: col + '/' + id }, so())),
  'docs.counts': async () => ({ rows: (await C('docs').aggregate([{ $group: { _id: '$col', n: { $sum: 1 } } }], so()).toArray()).map(x => ({ col: x._id, n: x.n })), changes: 0 }),
  'audit.insert': (t, actor, action, target, result, detail) => insertRow('audit', { t, actor, action, target, result, detail }),
  'logins.insert': (token_hash, uid, created, expires) => insertRow('logins', { token_hash, uid, created, expires }),
  'logins.purge': async now => changed(await C('logins').deleteMany({ expires: { $lt: now } }, so())),
  'logins.user': async (hash, now) => {
    const l = await C('logins').findOne({ _id: hash, expires: { $gt: now } }, so()); if (!l) return { rows: [], changes: 0 };
    return one('users', { _id: l.uid }, ['uid', 'email', 'name', 'disabled']);
  },
  'logins.delete': async hash => changed(await C('logins').deleteOne({ _id: hash }, so())),
  'logins.deleteUser': async uid => changed(await C('logins').deleteMany({ uid }, so())),
  'allowlist.byEmail': email => one('allowlist', { email }, ['teacher_id', 'email', 'name']),
  'allowlist.byEmailAll': async email => rows('allowlist', await C('allowlist').find({ email }, so()).toArray()),
  'allowlist.withoutAccount': async () => {
    const have = new Set((await C('users').find({}, { projection: { email: 1 }, ...so() }).toArray()).map(u => u.email));
    return rows('allowlist', (await C('allowlist').find({}, so()).sort({ teacher_id: 1 }).toArray()).filter(a => !have.has(a.email)));
  },
  'allowlist.withAccountFlag': async () => {
    const uid = new Map((await C('users').find({}, { projection: { email: 1, uid: 1 }, ...so() }).toArray()).map(u => [u.email, u.uid]));
    return { rows: (await C('allowlist').find({}, so()).sort({ teacher_id: 1 }).toArray()).map(a => ({ teacher_id: a.teacher_id, email: a.email, uid: uid.get(a.email) || null })), changes: 0 };
  },
  'allowlist.pairs': async () => rows('allowlist', await C('allowlist').find({}, so()).toArray(), ['teacher_id', 'email']),
  'allowlist.emails': async () => rows('allowlist', await C('allowlist').find({}, so()).toArray(), ['email']),
  'allowlist.clear': async () => changed(await C('allowlist').deleteMany({}, so())),
  'allowlist.insert': (teacher_id, email, name, version) => insertRow('allowlist', { teacher_id, email, name, version }),
  'allowHistory.insert': (t, package_id, package_version, list_version, added, removed, total) => insertRow('allowlist_history', { t, package_id, package_version, list_version, added, removed, total }),
  'codes.retire': async (now, email, purpose) => changed(await C('codes').updateMany({ email, purpose, used: null }, { $set: { used: now } }, so())),
  'codes.insert': (code_hash, email, purpose, created, expires) => insertRow('codes', { code_hash, email, purpose, created, expires, used: null }),
  'codes.get': hash => one('codes', { _id: hash }),
  'codes.use': async (now, hash) => changed(await C('codes').updateOne({ _id: hash }, { $set: { used: now } }, so())),
  'users.uidByEmail': email => one('users', { email }, ['uid']),
  'users.setPassword': async (pass_hash, uid) => changed(await C('users').updateOne({ _id: uid }, { $set: { pass_hash, disabled: 0 } }, so())),
  'users.insertLocal': (uid, email, name, pass_hash, source, created) => insertRow('users', { uid, email, name, pass_hash, source, oidc_sub: null, created, disabled: 0 }),
  'users.byEmail': email => one('users', { email }),
  'users.byOidc': (sub, source) => one('users', { oidc_sub: sub, source }),
  'users.insertOidc': (uid, email, name, source, oidc_sub, created) => insertRow('users', { uid, email, name, pass_hash: null, source, oidc_sub, created, disabled: 0 }),
  'users.setOidcSub': async (sub, uid) => changed(await C('users').updateOne({ _id: uid }, { $set: { oidc_sub: sub } }, so())),
  'oidc.purge': async t => changed(await C('oidc_state').deleteMany({ created: { $lt: t } }, so())),
  'oidc.insert': (state, nonce, verifier, created) => insertRow('oidc_state', { state, nonce, verifier, created }),
  'oidc.get': state => one('oidc_state', { _id: state }),
  'oidc.delete': async state => changed(await C('oidc_state').deleteOne({ _id: state }, so())),
  'inbox.byMsg': async msg => rows('inbox', await C('inbox').find({ msg_id: msg }, so()).toArray(), ['delivered_at', 'read_at']),
  'inbox.get': (msg, email) => one('inbox', { _id: msg + '\n' + email }, ['delivered_at', 'read_at', 'archived_at']),
  'inbox.ensure': async (msg_id, email, t) => changed(await C('inbox').updateOne({ _id: msg_id + '\n' + email },
    { $setOnInsert: { msg_id, email, delivered_at: t, read_at: null, archived_at: null } }, { upsert: true, ...so() })),
  'inbox.read': async (now, msg, email) => changed(await C('inbox').updateOne({ _id: msg + '\n' + email }, [{ $set: { read_at: { $ifNull: ['$read_at', now] } } }], so())),
  'inbox.archive': async (now, now2, msg, email) => changed(await C('inbox').updateOne({ _id: msg + '\n' + email }, [{ $set: { archived_at: now, read_at: { $ifNull: ['$read_at', now2] } } }], so())),
  'inbox.unarchive': async (msg, email) => changed(await C('inbox').updateOne({ _id: msg + '\n' + email }, { $set: { archived_at: null } }, so())),
  'version': async () => ({ rows: [{ v: 'MongoDB ' + (await mdb.admin().command({ buildInfo: 1 })).version }], changes: 0 })
};
const mongoDriver = {
  async connect() {
    M = vendor('mongodb');
    const url = cfg.url || `mongodb://${cfg.user ? encodeURIComponent(cfg.user) + ':' + encodeURIComponent(cfg.password) + '@' : ''}${cfg.host}:${cfg.port || 27017}/${encodeURIComponent(cfg.name)}${cfg.authSource ? '?authSource=' + encodeURIComponent(cfg.authSource) : ''}`;
    const opts = { appName: 'examflow', serverSelectionTimeoutMS: 20000, connectTimeoutMS: 20000, maxPoolSize: 4 };
    if (cfg.ssl) { opts.tls = true; if (cfg.sslCaFile) opts.tlsCAFile = cfg.sslCaFile; if (cfg.sslCertFile) opts.tlsCertificateKeyFile = cfg.sslCertFile; if (!cfg.sslVerify) opts.tlsAllowInvalidCertificates = true; }
    client = new M.MongoClient(url, opts);
    await client.connect();
    mdb = client.db(cfg.name || undefined);
    const hello = await mdb.admin().command({ hello: 1 });
    mongoTx = !!(hello.setName || hello.msg === 'isdbgrid'); // transactions need a replica set or sharded cluster (Atlas always is)
    client.on('close', lost);
    return client;
  },
  async begin() { if (!mongoTx) return; session = client.startSession(); session.startTransaction(); },
  async commit() { if (!session) return; const s = session; session = null; try { await s.commitTransaction(); } finally { await s.endSession(); } },
  async rollback() { if (!session) return; const s = session; session = null; try { await s.abortTransaction(); } finally { await s.endSession(); } },
  close: () => client.close()
};
async function mongoMigrate() {
  const meta = await C('meta').findOne({ _id: 'schema_version' });
  const cur = meta ? Number(meta.v) : 0;
  if (cur > MONGO_SCHEMA) throw new Error(`This database was created by a newer ExamFlow server (schema ${cur}). Install that version or newer; this one understands up to ${MONGO_SCHEMA}.`);
  if (cur === MONGO_SCHEMA) return { version: cur };
  const ix = [
    ['docs', { col: 1, created: 1, id: 1 }], ...['examToken', 'teacherUid', 'switchCode'].map(f => ['docs', { col: 1, ['f.' + f]: 1 }]),
    ['users', { email: 1 }, { unique: true }], ['users', { oidc_sub: 1 }], ['allowlist', { email: 1 }, { unique: true }], ['allowlist', { teacher_id: 1 }],
    ['logins', { uid: 1 }], ['logins', { expires: 1 }], ['codes', { email: 1, purpose: 1 }], ['oidc_state', { created: 1 }],
    ['audit', { n: 1 }, { unique: true }], ['audit', { t: 1 }], ['allowlist_history', { n: 1 }], ['inbox', { msg_id: 1 }]
  ];
  for (const [c, keys, o] of ix) await C(c).createIndex(keys, o || {});
  for (const c of ['audit', 'allowlist_history']) await C('counters').updateOne({ _id: c }, { $setOnInsert: { n: 0 } }, { upsert: true });
  await C('meta').updateOne({ _id: 'schema_version' }, { $set: { v: String(MONGO_SCHEMA) } }, { upsert: true });
  return { version: MONGO_SCHEMA, from: cur };
}

// ── Firebird (wire protocol, encrypted) ──
let FB = null, fbTx = null;
const fbCall = (o, fn, ...a) => new Promise((res, rej) => o[fn](...a, (e, r) => e ? rej(e) : res(r)));
const fbDriver = {
  async connect() {
    FB = vendor('firebird');
    const opts = { host: cfg.host, port: cfg.port || 3050, database: cfg.name, user: cfg.user, password: cfg.password, role: cfg.role || null,
      lowercase_keys: true, blobAsText: true, encoding: 'UTF8', pageSize: 8192, retryConnectionInterval: 1000,
      wireCrypt: cfg.ssl === false ? FB.WIRE_CRYPT_DISABLE : FB.WIRE_CRYPT_ENABLE, messageFile: path.join(__dirname, '..', 'vendor', 'firebird.msg') };
    const db = await fbCall(FB, 'attach', opts);
    db.on('error', lost); db.on('detach', lost);
    return db;
  },
  async query(sql, args) {
    const r = await fbCall(fbTx || conn, 'query', sql, args.map(v => (v === undefined ? null : typeof v === 'boolean' ? (v ? 1 : 0) : v)));
    return { rows: Array.isArray(r) ? r.map(x => ({ ...x })) : (r && typeof r === 'object' ? [{ ...r }] : []), changes: 0 };
  },
  async begin() { fbTx = await fbCall(conn, 'transaction', FB.ISOLATION_READ_COMMITTED); },
  async commit() { const t = fbTx; fbTx = null; if (t) await fbCall(t, 'commit'); },
  async rollback() { const t = fbTx; fbTx = null; if (t) await fbCall(t, 'rollback'); },
  close: () => fbCall(conn, 'detach')
};

// ── SAP HANA ──
let hanaInTx = false;
const hanaDriver = {
  async connect() {
    const H = vendor('hana');
    const c = H.createClient({ host: cfg.host, port: cfg.port || 30015, user: cfg.user, password: cfg.password,
      ...(cfg.tenant ? { databaseName: cfg.tenant } : {}),
      ...(cfg.ssl ? { useTLS: true, rejectUnauthorized: cfg.sslVerify !== false, ...(cfg.sslCa ? { ca: [cfg.sslCa] } : {}) } : {}) });
    c.on('error', lost); c.on('close', lost);
    await new Promise((res, rej) => c.connect(e => e ? rej(e) : res()));
    if (cfg.name) await new Promise((res, rej) => c.exec(`SET SCHEMA "${cfg.name.replace(/"/g, '""')}"`, e => e ? rej(e) : res()));
    return c;
  },
  query(sql, args) {
    const fix = r => { const o = {}; for (const k of Object.keys(r)) { const v = r[k]; o[k.toLowerCase()] = Buffer.isBuffer(v) ? v.toString('utf8') : v; } return o; };
    const done = (res, rej) => (e, r) => { if (e) return rej(e); if (Array.isArray(r)) return res({ rows: r.map(fix), changes: 0 }); res({ rows: [], changes: typeof r === 'number' ? r : 0 }); };
    return new Promise((res, rej) => {
      if (!args.length) return conn.exec(sql, { autoCommit: !hanaInTx }, done(res, rej));
      conn.prepare(sql, (e, st) => { if (e) return rej(e); st.exec(args.map(v => (v === undefined ? null : typeof v === 'boolean' ? (v ? 1 : 0) : v)), (e2, r) => { st.drop(() => {}); done(res, rej)(e2, r); }); });
    });
  },
  async begin() { conn.setAutoCommit(false); hanaInTx = true; },
  commit() { hanaInTx = false; return new Promise((res, rej) => conn.commit(e => { conn.setAutoCommit(true); e ? rej(e) : res(); })); },
  rollback() { hanaInTx = false; return new Promise((res, rej) => conn.rollback(e => { conn.setAutoCommit(true); e ? rej(e) : res(); })); },
  close: () => new Promise(res => conn.close(() => res()))
};

// ── IBM Db2 (IBM's driver, installed separately: it is native code from IBM) ──
let IBM = null;
const db2Driver = {
  async connect() {
    try { IBM = require(path.join(__dirname, '..', 'addons', 'node_modules', 'ibm_db')); }
    catch (e) { throw new Error('IBM Db2 needs IBM\'s own driver, which is not inside the package. Install it once with:  node server/src/cli.js add-driver db2   (see DATABASES.md).'); }
    const kv = { DATABASE: cfg.name, HOSTNAME: cfg.host, PORT: cfg.port || 50000, PROTOCOL: 'TCPIP', UID: cfg.user, PWD: cfg.password };
    if (cfg.ssl) { kv.Security = 'SSL'; if (cfg.sslCaFile) kv.SSLServerCertificate = cfg.sslCaFile; }
    if (cfg.schema) kv.CurrentSchema = cfg.schema;
    const cs = cfg.connectString || Object.entries(kv).map(([k, v]) => `${k}=${v}`).join(';') + ';';
    return await new Promise((res, rej) => IBM.open(cs, (e, c) => e ? rej(e) : res(c)));
  },
  query(sql, args) {
    return new Promise((res, rej) => conn.query(sql, args.map(v => (v === undefined ? null : typeof v === 'boolean' ? (v ? 1 : 0) : v)), (e, r) => {
      if (e) return rej(e);
      res({ rows: Array.isArray(r) ? r.map(x => { const o = {}; for (const k of Object.keys(x)) o[k.toLowerCase()] = x[k]; return o; }) : [], changes: 0 });
    }));
  },
  begin: () => new Promise((res, rej) => conn.beginTransaction(e => e ? rej(e) : res())),
  commit: () => new Promise((res, rej) => conn.commitTransaction(e => e ? rej(e) : res())),
  rollback: () => new Promise((res, rej) => conn.rollbackTransaction(e => e ? rej(e) : res())),
  close: () => new Promise(res => conn.close(() => res()))
};

// ── Cassandra, DynamoDB, Firestore: rows (t, p, s) → value, see db-nosql.js ──
let KV = null, KVS = null;
const kvDriver = {
  async connect() {
    const N = require('./db-nosql');
    const A = N.ADAPTERS[cfg.type](cfg);
    await A.connect();
    KV = A; KVS = N.statements(N.store(A));
    return A;
  },
  begin: async () => {}, commit: async () => {}, rollback: async () => {},   // no multi-row transactions on these databases
  close: () => KV.close()
};
const KV_SCHEMA = 2;
async function kvMigrate() {
  await KV.init();
  const cur = Number(((await KVS.M['meta.get']('schema_version')).rows[0] || {}).v || 0);
  if (cur > KV_SCHEMA) throw new Error(`This database was created by a newer ExamFlow server (schema ${cur}). Install that version or newer; this one understands up to ${KV_SCHEMA}.`);
  if (cur !== KV_SCHEMA) await KVS.M['meta.set']('schema_version', String(KV_SCHEMA));
  return { version: KV_SCHEMA, from: cur };
}
const isKV = ['cassandra', 'dynamodb', 'firestore'].includes(cfg.type);

const driver = { postgres: pgDriver, mysql: myDriver, mssql: msDriver, oracle: oraDriver, mongodb: mongoDriver,
  firebird: fbDriver, hana: hanaDriver, db2: db2Driver, cassandra: kvDriver, dynamodb: kvDriver, firestore: kvDriver }[cfg.type];

async function ensure() {
  if (conn) return;
  if (inTx) throw new Error('The database connection was lost in the middle of a change; it was not saved.');
  conn = await driver.connect();
}

async function handle(m) {
  switch (m.op) {
    case 'connect': await ensure(); return {};
    case 'all': case 'run': await ensure(); return await driver.query(m.sql, m.args || []);
    case 'stmt': { // MongoDB, Cassandra, DynamoDB, Firestore: a named statement
      await ensure(); const fn = (isKV ? KVS.M : MONGO)[m.sql]; if (!fn) throw new Error('Unknown database statement: ' + m.sql);
      return await fn(...(m.args || []));
    }
    case 'query': { // documents search on the databases above
      await ensure(); const { col, where, limit } = m.args;
      if (isKV) return await KVS.query(col, where, limit);
      const filter = { col }; for (const [f, , v] of where) filter['f.' + f] = v === undefined ? null : v;
      let cur = C('docs').find(filter, { projection: { id: 1, data: 1 }, ...so() }).sort({ created: 1, id: 1 });
      if (limit) cur = cur.limit(Number(limit));
      return { rows: (await cur.toArray()).map(d => ({ id: d.id, data: d.data })), changes: 0 };
    }
    case 'migrate': await ensure(); return isKV ? await kvMigrate() : await mongoMigrate();
    case 'count': await ensure(); return { rows: [{ n: isKV ? await KVS.count(m.sql) : await C(m.sql).countDocuments({}, so()) }], changes: 0 };
    case 'insert': await ensure(); return isKV ? await KVS.importRow(m.sql, m.args) : await insertRow(m.sql, m.args);
    case 'tamper': { // can this account change the audit log? (it should not be able to)
      await ensure();
      if (isKV) return { rows: [await KVS.tamper()], changes: 0 };
      const d = await C('audit').findOne({ action: 'db.check' }, { sort: { n: -1 } });
      if (!d) return { rows: [{ blocked: false, why: 'no test line' }], changes: 0 };
      try { await C('audit').updateOne({ _id: d._id }, { $set: { result: 'changed' } }); }
      catch (e) { return { rows: [{ blocked: true, why: e.message }], changes: 0 }; }
      await C('audit').updateOne({ _id: d._id }, { $set: { result: d.result } });
      return { rows: [{ blocked: false }], changes: 0 };
    }
    case 'info': await ensure(); return { rows: [{ version: isKV ? await KV.version() : oraVersion, transactions: isKV ? false : cfg.type === 'mongodb' ? mongoTx : true }], changes: 0 };
    case 'begin': await ensure(); await driver.begin(); inTx = true; return {};
    case 'commit': inTx = false; await driver.commit(); return {};
    case 'rollback': inTx = false; if (conn) await driver.rollback(); return {};
    case 'close': if (conn) { const c = conn; await driver.close(); if (conn === c) conn = null; } return {};
    default: throw new Error('Unknown database request: ' + m.op);
  }
}

port.on('message', async m => {
  try { reply({ id: m.id, ok: true, ...(await handle(m)) }); }
  catch (e) {
    if (e && /ECONNRESET|ECONNREFUSED|EPIPE|ETIMEDOUT|ESOCKET|Connection lost|Connection terminated|closed state|NJS-500|NJS-003|MongoNetworkError|MongoNotConnected|NoHostAvailable|Connection is closed|socket hang up/i.test(String(e.code) + ' ' + e.name + ' ' + e.message)) lost();
    reply({ id: m.id, ok: false, error: { message: (e && e.message) || String(e), code: e && e.code, number: e && e.number } });
  }
});
process.on('uncaughtException', e => { lost(); reply({ id: -1, ok: false, error: { message: 'Database driver error: ' + e.message } }); });
