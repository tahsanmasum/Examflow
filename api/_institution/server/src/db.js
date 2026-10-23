'use strict';
/* The institution's database. Everything ExamFlow stores at this institution lives
   here — exams, questions and their pictures, student attempts, answers, photos,
   marks, camera alerts, feedback, accounts and the audit log. Nothing here is sent
   to GHUM.

   Which database is chosen in .env with DB_TYPE:
     sqlite   (default) one file, DATA_DIR/examflow.db — nothing else to install
     postgres PostgreSQL 12+
     mysql    MySQL 8+ or MariaDB 10.6+
     mssql    Microsoft SQL Server 2017+ / Azure SQL
     oracle   Oracle Database 19c+ (incl. Autonomous Database)
     mongodb  MongoDB 5+ / Atlas / Cosmos DB for MongoDB
     firebird Firebird 3+          hana  SAP HANA 2.0 / HANA Cloud      db2  IBM Db2 11.5+
     cassandra Apache Cassandra / ScyllaDB / Astra / Keyspaces          dynamodb  Amazon DynamoDB
     firestore Google Cloud Firestore
   (config.js also accepts the names of compatible products, e.g. cockroachdb or tidb.)
   The institution's DBA creates an empty database and a user that owns it; the
   server creates its tables on first start.

   Migrations only ever add; they never drop or rewrite existing data. With SQLite,
   a copy of the file is saved to DATA_DIR/backups/ before a migration runs; with an
   external database, back it up with that database's own tools before upgrading. */
const fs = require('node:fs');
const path = require('node:path');
const { SQLITE_MIGRATIONS, SCHEMA, prepared, docsQuery, placeholders, stepSql, APPIDX, INDEXED } = require('./db-sql');

const KINDS = { sqlite: 'sqlite', postgres: 'postgres', postgresql: 'postgres', pg: 'postgres', mysql: 'mysql', mariadb: 'mysql',
  mssql: 'mssql', sqlserver: 'mssql', oracle: 'oracle', mongodb: 'mongodb', mongo: 'mongodb',
  firebird: 'firebird', hana: 'hana', db2: 'db2', cassandra: 'cassandra', dynamodb: 'dynamodb', firestore: 'firestore' };
const LABEL = { sqlite: 'SQLite (built in)', postgres: 'PostgreSQL', mysql: 'MySQL / MariaDB', mssql: 'Microsoft SQL Server', oracle: 'Oracle Database', mongodb: 'MongoDB',
  firebird: 'Firebird', hana: 'SAP HANA', db2: 'IBM Db2', cassandra: 'Cassandra (CQL)', dynamodb: 'Amazon DynamoDB', firestore: 'Google Cloud Firestore' };
/** Databases without SQL: every named statement is run by db-worker.js / db-nosql.js. */
const DOCSTORE = ['mongodb', 'cassandra', 'dynamodb', 'firestore'];
const asText = v => typeof v === 'boolean' ? (v ? 'true' : 'false') : String(v);

class DB {
  /** dataDir: DATA_DIR. dbConfig (optional): { type, url | host, port, name, user, password, ssl, … } from .env */
  constructor(dataDir, dbConfig) {
    this.dataDir = dataDir;
    fs.mkdirSync(dataDir, { recursive: true });
    this.kind = KINDS[String((dbConfig && dbConfig.type) || 'sqlite').toLowerCase()];
    if (!this.kind) throw new Error('DB_TYPE must be one of: ' + Object.keys(LABEL).join(', ') + ' (DATABASES.md lists every supported product).');
    this.label = LABEL[this.kind] + (dbConfig && dbConfig.variant && dbConfig.variant !== this.kind ? ` (${dbConfig.variant})` : '');
    this.docstore = DOCSTORE.includes(this.kind);
    this.appidx = APPIDX.includes(this.kind);
    this.depth = 0;
    this.warnings = [];
    this.auditTriggers = !(dbConfig && dbConfig.auditTriggers === false);
    this.triggersOptional = !!(dbConfig && dbConfig.triggersOptional);
    if (this.kind === 'sqlite') {
      let DatabaseSync;
      try { ({ DatabaseSync } = require('node:sqlite')); } catch (e) {
        throw new Error('This Node.js has no built-in SQLite. Use Node.js 22.13 or newer (the Docker image already does).');
      }
      this.file = path.join(dataDir, 'examflow.db');
      const existed = fs.existsSync(this.file) && fs.statSync(this.file).size > 0;
      this.db = new DatabaseSync(this.file);
      this.db.exec('PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON; PRAGMA busy_timeout = 5000;');
      this.stmts = new Map();
      this.migrate(existed);
    } else {
      const { Remote } = require('./db-remote');
      this.remote = new Remote({ ...dbConfig, type: this.kind });
      this.where = describeTarget(dbConfig);
      try { this.remote.call('connect'); }
      catch (e) { this.remote.stop(); throw new Error(`Could not connect to ${this.label} at ${this.where}: ${e.message}`); }
      this.migrate(true);
      try { this.info = this.remote.call('info').rows[0]; } catch (e) { this.info = {}; }
    }
  }

  // ── the one place SQL is run ──
  _prep(sql) { let s = this.stmts.get(sql); if (!s) { s = this.db.prepare(sql); this.stmts.set(sql, s); } return s; }
  _all(sql, args) { return this.kind === 'sqlite' ? this._prep(sql).all(...args) : this.remote.call('all', sql, args).rows; }
  _run(sql, args) { return this.kind === 'sqlite' ? { changes: Number(this._prep(sql).run(...args).changes) } : { changes: this.remote.call('run', sql, args).changes }; }
  _exec(sql) { if (this.kind === 'sqlite') this.db.exec(sql); else this.remote.call('run', sql, []); }

  /** Named statements (see db-sql.js): one row, all rows, or run → { changes }. */
  one(name, ...args) { return this.all(name, ...args)[0]; }
  all(name, ...args) {
    if (this.docstore) return this.remote.call('stmt', name, args).rows;
    const p = prepared(this.kind, name); return this._all(p.sql, p.map ? p.map.map(i => args[i]) : args);
  }
  run(name, ...args) {
    if (this.docstore) return { changes: this.remote.call('stmt', name, args).changes };
    const p = prepared(this.kind, name); return this._run(p.sql, p.map ? p.map.map(i => args[i]) : args);
  }
  /** Raw SQL with ? placeholders, for checks and tools only (not on databases without SQL). */
  raw(sql, args = []) {
    if (this.docstore) throw new Error(this.label + ' does not take SQL.');
    const q = placeholders(this.kind, sql);
    return /^\s*(select|with)\b/i.test(sql) ? this._all(q, args) : this._run(q, args);
  }
  /** For import and checks: row count of a table, add one row, and whether the audit log refuses changes. */
  countRows(table) { return Number(this.docstore ? this.remote.call('count', table).rows[0].n : this.raw(`SELECT COUNT(*) AS n FROM ${table}`)[0].n); }
  insertRow(table, obj) {
    if (this.docstore) return this.remote.call('insert', table, obj);
    if (table === 'docs' && this.appidx) return this.run('docs.put', obj.col, obj.id, obj.data, obj.created, obj.updated, ...this._fields(obj.data));
    const cols = Object.keys(obj);
    return this.raw(`INSERT INTO ${table} (${cols.join(', ')}) VALUES (${cols.map(() => '?').join(', ')})`, cols.map(c => obj[c]));
  }
  auditIsProtected() {
    if (this.docstore) { const r = this.remote.call('tamper').rows[0]; return { update: r.blocked, delete: r.blocked, why: r.why }; }
    // refused by the triggers, or by the account's rights: either way the database does not let ExamFlow's account change it
    const t = sql => { try { this.raw(sql); return false; } catch (e) { return /append-only|permission|not authori[sz]ed|denied|insufficient privilege/i.test(e.message); } };
    return { update: t("UPDATE audit SET result = 'changed' WHERE action = 'db.check'"), delete: t("DELETE FROM audit WHERE action = 'db.check'") };
  }

  schemaVersion() {
    if (this.docstore) return Number(this.getMeta('schema_version') || 0);
    if (!this.one('hasMeta') || !this.one('hasMeta').t) return 0;
    const r = this.one('meta.get', 'schema_version');
    return r ? Number(r.v) : 0;
  }
  migrate(existed) {
    if (this.docstore) { this.remote.call('migrate'); return; }
    const steps = this.kind === 'sqlite' ? SQLITE_MIGRATIONS : SCHEMA[this.kind];
    const cur = this.schemaVersion();
    if (cur > steps.length) throw new Error(`This database was created by a newer ExamFlow server (schema ${cur}). Install that version or newer; this one understands up to ${steps.length}.`);
    if (cur === steps.length) return;
    if (this.kind === 'sqlite' && existed && cur > 0) this.backup('pre-migrate-' + cur + '-to-' + steps.length);
    for (let v = cur; v < steps.length; v++) {
      // PostgreSQL, SQL Server and SQLite undo a failed migration completely. On the others table
      // changes cannot be undone (or used before they are committed), so every step there is safe to run again.
      const txn = ['sqlite', 'postgres', 'mssql'].includes(this.kind);
      if (txn) this._begin();
      try {
        if (this.kind === 'sqlite') this.db.exec(steps[v]);
        else for (const st of steps[v]) this._step(st);
        this.run('meta.set', 'schema_version', String(v + 1));
        if (txn) this._commit();
      } catch (e) {
        if (txn) { try { this._rollback(); } catch (_) {} }
        throw new Error('Database migration ' + (v + 1) + ' failed' + (txn ? ' and was rolled back' : '') + ': ' + e.message + hint(this.kind, e));
      }
    }
  }
  /** One schema step on an external SQL database. */
  _step(st) {
    if (typeof st === 'object' && st.trigger) {
      if (!this.auditTriggers) { this.warnings.push('DB_AUDIT_TRIGGERS=0: the audit log is append-only in ExamFlow, but the database itself does not enforce it.'); return; }
      if (this.one('hasTrigger', st.trigger)) return; // already there (e.g. made by the DBA's script)
    }
    if (typeof st === 'object' && st.trigger && this.triggersOptional) {
      try { for (const sql of stepSql(this.kind, st)) this._exec(sql); }
      catch (e) { this.warnings.push(`This database version has no triggers (${e.message.split('\n')[0]}). The audit log is append-only in ExamFlow, but the database itself does not enforce it.`); }
      return;
    }
    for (const sql of stepSql(this.kind, st)) {
      if (typeof st === 'object' && st.optional) { try { this._exec(sql); } catch (e) { this.warnings.push('Search index not created (ExamFlow still works, a little slower): ' + e.message.split('\n')[0]); } }
      else this._exec(sql);
    }
  }
  backup(label) {
    if (this.kind !== 'sqlite') {
      const e = new Error(`This server keeps its data in ${this.label} (${this.where}). Back it up with that database's own tools — see DATABASES.md (pg_dump, mysqldump, SQL Server BACKUP DATABASE, Oracle RMAN / Data Pump, mongodump).`);
      e.external = true; throw e;   // (also: Firebird gbak / nbackup, HANA BACKUP DATA, Db2 BACKUP DATABASE, Cassandra nodetool snapshot, DynamoDB point-in-time recovery, Firestore export)
    }
    const dir = path.join(this.dataDir, 'backups'); fs.mkdirSync(dir, { recursive: true });
    const file = path.join(dir, `examflow-${new Date().toISOString().replace(/[:.]/g, '-')}-${label || 'manual'}.db`);
    this.db.prepare('VACUUM INTO ?').run(file);
    return file;
  }
  _begin() { if (this.kind === 'sqlite') this.db.exec('BEGIN IMMEDIATE'); else this.remote.call('begin'); }
  _commit() { if (this.kind === 'sqlite') this.db.exec('COMMIT'); else this.remote.call('commit'); }
  _rollback() { if (this.kind === 'sqlite') this.db.exec('ROLLBACK'); else this.remote.call('rollback'); }
  tx(fn) {
    if (this.depth > 0) return fn(); // already inside one: becomes part of it
    this._begin(); this.depth++;
    try { const r = fn(); this.depth--; this._commit(); return r; }
    catch (e) { this.depth = 0; try { this._rollback(); } catch (_) {} throw e; }
  }
  // ── meta ──
  getMeta(k) { const r = this.one('meta.get', k); return r ? r.v : null; }
  setMeta(k, v) { this.run('meta.set', k, v === null ? null : String(v)); }
  // ── documents (the app's collections) ──
  getDoc(col, id) {
    const r = this.one('docs.get', col, id);
    return r ? JSON.parse(r.data) : null;
  }
  putDoc(col, id, data) {
    const now = Date.now(), json = JSON.stringify(data);
    if (this.appidx) this.run('docs.put', col, id, json, now, now, ...this._fields(json));
    else this.run('docs.put', col, id, json, now, now);
  }
  /** Firebird / HANA / Db2: the three searched fields, written into their own columns. */
  _fields(json) {
    let d = null; try { d = JSON.parse(json); } catch (e) {}
    return INDEXED.map(f => { const v = d && d[f]; if (!['string', 'number', 'boolean'].includes(typeof v)) return null; const t = asText(v); return t.length <= 255 ? t : null; });
  }
  deleteDoc(col, id) {
    if (this.appidx) { if (!this.one('docs.get', col, id)) return false; this.run('docs.delete', col, id); return true; } // their drivers do not report row counts
    return this.run('docs.delete', col, id).changes > 0;
  }
  query(col, where, limit) {
    if (this.docstore) return this.remote.call('query', null, { col, where, limit }).rows.map(r => ({ id: r.id, data: JSON.parse(r.data) }));
    const q = docsQuery(this.kind, col, where, limit);
    let out = this._all(q.sql, q.args).map(r => ({ id: r.id, data: JSON.parse(r.data) }));
    if (q.recheck) {
      const want = where.map(([f, , v]) => [f, v === undefined ? null : v]);
      out = out.filter(d => want.every(([f, v]) => (v === null ? d.data[f] === undefined || d.data[f] === null : d.data[f] === v)));
      if (limit) out = out.slice(0, Number(limit));
    }
    return out;
  }
  counts() {
    const r = {}; for (const x of this.all('docs.counts')) r[x.col] = Number(x.n); return r;
  }
  // ── audit (append-only, enforced by the database itself) ──
  audit(actor, action, target, result, detail) {
    this.run('audit.insert', Date.now(), actor || null, action, target || null, result, detail ? JSON.stringify(detail) : null);
  }
  /** A short description for status screens (never includes the password). */
  describe() { return this.kind === 'sqlite' ? `${this.label}, ${this.file}` : `${this.label}, ${this.where}`; }
  serverVersion() {
    if (this.kind === 'oracle' && this.info && this.info.version) return 'Oracle Database ' + this.info.version;
    if (['cassandra', 'dynamodb', 'firestore'].includes(this.kind)) return (this.info && this.info.version) || this.label;
    try { return String(this.one('version').v).split('\n')[0].trim(); } catch (e) { return 'unknown'; }
  }
  /** False for MongoDB without a replica set, and for Cassandra, DynamoDB and Firestore (changes cannot be undone as a group). */
  transactions() { return !(this.info && this.info.transactions === false); }
  close() {
    if (this.kind === 'sqlite') { try { this.db.close(); } catch (e) {} }
    else { try { this.remote.call('close'); } catch (e) {} this.remote.stop(); }
  }
}

/** host:port/database, without user or password. */
function describeTarget(c) {
  if (!c) return '';
  if (c.url) { try { const u = new URL(c.url); return `${u.protocol.replace(':', '')}://${u.hostname}${u.port ? ':' + u.port : ''}/${c.name || u.pathname.replace(/^\//, '')}`; } catch (e) { return '(DB_URL)'; } }
  if (c.connectString) return c.connectString.length > 80 ? c.connectString.slice(0, 77) + '…' : c.connectString;
  if (c.socket) return `${c.socket} (socket)/${c.name || '?'}`;
  return `${c.host || '?'}${c.instance ? '\\' + c.instance : c.port ? ':' + c.port : ''}/${c.name || '?'}`;
}

function hint(kind, e) {
  const m = String(e && e.message);
  if (kind === 'mysql' && /SUPER privilege|log_bin_trust_function_creators|TRIGGER command denied/i.test(m))
    return '\nThe ExamFlow database user needs the TRIGGER privilege (the audit log is protected by triggers). With binary logging on, also set log_bin_trust_function_creators = 1. See DATABASES.md.';
  if (/ORA-01031|ORA-01950/.test(m)) return '\nThe Oracle user needs CREATE TABLE, CREATE TRIGGER and a tablespace quota, or a DBA must run install/database-scripts/oracle.sql first. See DATABASES.md.';
  if (/not authorized|Unauthorized/i.test(m) && kind === 'mongodb') return '\nThe MongoDB user needs the readWrite role on the ExamFlow database. See DATABASES.md.';
  if (/permission denied|denied|not have permission/i.test(m))
    return '\nThe ExamFlow database user must own its database (create tables, indexes and triggers). See DATABASES.md.';
  return '';
}

module.exports = { DB, MIGRATIONS: SQLITE_MIGRATIONS, KINDS, LABEL, describeTarget };
