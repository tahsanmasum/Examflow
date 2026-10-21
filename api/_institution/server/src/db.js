'use strict';
/* The institution's database: one SQLite file inside DATA_DIR.
   Everything ExamFlow stores at this institution lives here — exams, questions
   and their pictures, student attempts, answers, photos, marks, camera alerts,
   feedback, accounts and the audit log. Nothing here is sent to GHUM.

   Migrations only ever add; they never drop or rewrite existing data. Before a
   database that already has data is migrated, a copy is saved to
   DATA_DIR/backups/. */
const fs = require('node:fs');
const path = require('node:path');
let DatabaseSync;
try { ({ DatabaseSync } = require('node:sqlite')); } catch (e) {
  throw new Error('This Node.js has no built-in SQLite. Use Node.js 22.13 or newer (the Docker image already does).');
}

const MIGRATIONS = [
  // 1: first install
  `CREATE TABLE meta (k TEXT PRIMARY KEY, v TEXT);
   CREATE TABLE docs (col TEXT NOT NULL, id TEXT NOT NULL, data TEXT NOT NULL, created INTEGER NOT NULL, updated INTEGER NOT NULL, PRIMARY KEY (col, id));
   CREATE INDEX docs_examToken ON docs (col, json_extract(data, '$.examToken'));
   CREATE INDEX docs_teacherUid ON docs (col, json_extract(data, '$.teacherUid'));
   CREATE INDEX docs_switchCode ON docs (col, json_extract(data, '$.switchCode'));
   CREATE TABLE users (uid TEXT PRIMARY KEY, email TEXT NOT NULL UNIQUE, name TEXT, pass_hash TEXT, source TEXT NOT NULL, oidc_sub TEXT, created INTEGER NOT NULL, disabled INTEGER NOT NULL DEFAULT 0);
   CREATE TABLE codes (code_hash TEXT PRIMARY KEY, email TEXT NOT NULL, purpose TEXT NOT NULL, created INTEGER NOT NULL, expires INTEGER NOT NULL, used INTEGER);
   CREATE TABLE logins (token_hash TEXT PRIMARY KEY, uid TEXT NOT NULL, created INTEGER NOT NULL, expires INTEGER NOT NULL);
   CREATE TABLE oidc_state (state TEXT PRIMARY KEY, nonce TEXT NOT NULL, verifier TEXT NOT NULL, created INTEGER NOT NULL);
   CREATE TABLE allowlist (teacher_id TEXT PRIMARY KEY, email TEXT NOT NULL UNIQUE, name TEXT, version INTEGER NOT NULL);
   CREATE TABLE allowlist_history (n INTEGER PRIMARY KEY AUTOINCREMENT, t INTEGER NOT NULL, package_id TEXT, package_version TEXT, list_version INTEGER, added INTEGER, removed INTEGER, total INTEGER);
   CREATE TABLE audit (n INTEGER PRIMARY KEY AUTOINCREMENT, t INTEGER NOT NULL, actor TEXT, action TEXT NOT NULL, target TEXT, result TEXT NOT NULL, detail TEXT);
   CREATE TRIGGER audit_no_update BEFORE UPDATE ON audit BEGIN SELECT RAISE(ABORT, 'the audit log is append-only'); END;
   CREATE TRIGGER audit_no_delete BEFORE DELETE ON audit BEGIN SELECT RAISE(ABORT, 'the audit log is append-only'); END;`,
  // 2 (v47): dashboard messages from GHUM, per teacher: when each was delivered, read or archived
  `CREATE TABLE inbox (msg_id TEXT NOT NULL, email TEXT NOT NULL, delivered_at INTEGER, read_at INTEGER, archived_at INTEGER, PRIMARY KEY (msg_id, email));`
];

class DB {
  constructor(dataDir) {
    this.dataDir = dataDir;
    fs.mkdirSync(dataDir, { recursive: true });
    this.file = path.join(dataDir, 'examflow.db');
    const existed = fs.existsSync(this.file) && fs.statSync(this.file).size > 0;
    this.db = new DatabaseSync(this.file);
    this.db.exec('PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON; PRAGMA busy_timeout = 5000;');
    this.migrate(existed);
  }
  schemaVersion() {
    const has = this.db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='meta'").get();
    if (!has) return 0;
    const r = this.db.prepare("SELECT v FROM meta WHERE k='schema_version'").get();
    return r ? Number(r.v) : 0;
  }
  migrate(existed) {
    const cur = this.schemaVersion();
    if (cur > MIGRATIONS.length) throw new Error(`This database was created by a newer ExamFlow server (schema ${cur}). Install that version or newer; this one understands up to ${MIGRATIONS.length}.`);
    if (cur === MIGRATIONS.length) return;
    if (existed && cur > 0) this.backup('pre-migrate-' + cur + '-to-' + MIGRATIONS.length);
    for (let v = cur; v < MIGRATIONS.length; v++) {
      this.db.exec('BEGIN');
      try {
        this.db.exec(MIGRATIONS[v]);
        this.db.prepare("INSERT INTO meta (k, v) VALUES ('schema_version', ?) ON CONFLICT(k) DO UPDATE SET v = excluded.v").run(String(v + 1));
        this.db.exec('COMMIT');
      } catch (e) { this.db.exec('ROLLBACK'); throw new Error('Database migration ' + (v + 1) + ' failed and was rolled back: ' + e.message); }
    }
  }
  backup(label) {
    const dir = path.join(this.dataDir, 'backups'); fs.mkdirSync(dir, { recursive: true });
    const file = path.join(dir, `examflow-${new Date().toISOString().replace(/[:.]/g, '-')}-${label || 'manual'}.db`);
    this.db.prepare('VACUUM INTO ?').run(file);
    return file;
  }
  tx(fn) {
    this.db.exec('BEGIN IMMEDIATE');
    try { const r = fn(); this.db.exec('COMMIT'); return r; } catch (e) { try { this.db.exec('ROLLBACK'); } catch (_) {} throw e; }
  }
  // ── meta ──
  getMeta(k) { const r = this.db.prepare('SELECT v FROM meta WHERE k = ?').get(k); return r ? r.v : null; }
  setMeta(k, v) { this.db.prepare('INSERT INTO meta (k, v) VALUES (?, ?) ON CONFLICT(k) DO UPDATE SET v = excluded.v').run(k, v === null ? null : String(v)); }
  // ── documents (the app's collections) ──
  getDoc(col, id) {
    const r = this.db.prepare('SELECT data FROM docs WHERE col = ? AND id = ?').get(col, id);
    return r ? JSON.parse(r.data) : null;
  }
  putDoc(col, id, data) {
    const now = Date.now(), json = JSON.stringify(data);
    this.db.prepare(`INSERT INTO docs (col, id, data, created, updated) VALUES (?, ?, ?, ?, ?)
      ON CONFLICT(col, id) DO UPDATE SET data = excluded.data, updated = excluded.updated`).run(col, id, json, now, now);
  }
  deleteDoc(col, id) { return this.db.prepare('DELETE FROM docs WHERE col = ? AND id = ?').run(col, id).changes > 0; }
  query(col, where, limit) {
    let sql = 'SELECT id, data FROM docs WHERE col = ?'; const args = [col];
    for (const [f, , v] of where) {
      sql += ` AND json_extract(data, '$.${f}') IS ?`;
      args.push(typeof v === 'boolean' ? (v ? 1 : 0) : v);
    }
    sql += ' ORDER BY created';
    if (limit) { sql += ' LIMIT ?'; args.push(limit); }
    return this.db.prepare(sql).all(...args).map(r => ({ id: r.id, data: JSON.parse(r.data) }));
  }
  counts() {
    const r = {}; for (const x of this.db.prepare('SELECT col, COUNT(*) n FROM docs GROUP BY col').all()) r[x.col] = x.n; return r;
  }
  // ── audit (append-only, enforced by triggers) ──
  audit(actor, action, target, result, detail) {
    this.db.prepare('INSERT INTO audit (t, actor, action, target, result, detail) VALUES (?, ?, ?, ?, ?, ?)')
      .run(Date.now(), actor || null, action, target || null, result, detail ? JSON.stringify(detail) : null);
  }
  close() { try { this.db.close(); } catch (e) {} }
}

module.exports = { DB, MIGRATIONS };
