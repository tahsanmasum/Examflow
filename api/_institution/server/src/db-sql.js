'use strict';
/* Every SQL statement the institution server runs, for each database it supports:
     sqlite   – built into Node.js, one file in DATA_DIR (the default)
     postgres – PostgreSQL 12 or newer
     mysql    – MySQL 8 or MariaDB 10.6 or newer
     mssql    – Microsoft SQL Server 2017 or newer (or Azure SQL)
     oracle   – Oracle Database 19c or newer (thin driver: no Oracle Client needed)
     firebird – Firebird 3 or newer
     hana     – SAP HANA 2.0 / SAP HANA Cloud
     db2      – IBM Db2 for Linux, UNIX and Windows 11.5 or newer (not Db2 for z/OS or IBM i)
   Firebird, HANA and Db2 do not use the database's JSON functions: ExamFlow itself writes the three
   searched fields into their own columns (f_examToken, f_teacherUid, f_switchCode) and checks every
   other condition itself. On those three every table and column name is written in quotes, so no
   name can clash with a reserved word there.
   (MongoDB, Cassandra, DynamoDB and Firestore are not SQL: see db-worker.js and db-nosql.js.)

   Statements are written once with ? placeholders. A statement that needs different
   SQL on one database has an entry for it; { native } means the SQL already uses that
   database's own placeholders (@p1, @p2 … on SQL Server, :p1, :p2 … on Oracle) and is
   sent as written.

   Schema steps are SQL strings, or { trigger: name, sql: [...] } for the statements that
   create the audit log's append-only protection: those are skipped when that trigger
   already exists (a DBA may create them with an admin account using the scripts in
   install/database-scripts/) or when DB_AUDIT_TRIGGERS=0 (databases with no triggers). */

// ── schema ──────────────────────────────────────────────────────────────────
// Each migration only ever adds. External-database migrations are written so
// running one twice is harmless (IF NOT EXISTS / DROP-then-CREATE for triggers).
const SQLITE_MIGRATIONS = [
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

const INDEXED = ['examToken', 'teacherUid', 'switchCode'];

// PostgreSQL: TEXT everywhere, BIGINT for times, JSON looked up with ->> (indexed by expression).
const pj = f => `((data::jsonb)->>'${f}')`;
const PG_MIGRATIONS = [
  [
    `CREATE TABLE IF NOT EXISTS meta (k TEXT PRIMARY KEY, v TEXT)`,
    `CREATE TABLE IF NOT EXISTS docs (col TEXT NOT NULL, id TEXT NOT NULL, data TEXT NOT NULL, created BIGINT NOT NULL, updated BIGINT NOT NULL, PRIMARY KEY (col, id))`,
    ...INDEXED.map(f => `CREATE INDEX IF NOT EXISTS docs_${f.toLowerCase()} ON docs (col, ${pj(f)})`),
    `CREATE TABLE IF NOT EXISTS users (uid TEXT PRIMARY KEY, email TEXT NOT NULL UNIQUE, name TEXT, pass_hash TEXT, source TEXT NOT NULL, oidc_sub TEXT, created BIGINT NOT NULL, disabled INTEGER NOT NULL DEFAULT 0)`,
    `CREATE TABLE IF NOT EXISTS codes (code_hash TEXT PRIMARY KEY, email TEXT NOT NULL, purpose TEXT NOT NULL, created BIGINT NOT NULL, expires BIGINT NOT NULL, used BIGINT)`,
    `CREATE TABLE IF NOT EXISTS logins (token_hash TEXT PRIMARY KEY, uid TEXT NOT NULL, created BIGINT NOT NULL, expires BIGINT NOT NULL)`,
    `CREATE TABLE IF NOT EXISTS oidc_state (state TEXT PRIMARY KEY, nonce TEXT NOT NULL, verifier TEXT NOT NULL, created BIGINT NOT NULL)`,
    `CREATE TABLE IF NOT EXISTS allowlist (teacher_id TEXT PRIMARY KEY, email TEXT NOT NULL UNIQUE, name TEXT, version INTEGER NOT NULL)`,
    `CREATE TABLE IF NOT EXISTS allowlist_history (n BIGSERIAL PRIMARY KEY, t BIGINT NOT NULL, package_id TEXT, package_version TEXT, list_version INTEGER, added INTEGER, removed INTEGER, total INTEGER)`,
    `CREATE TABLE IF NOT EXISTS audit (n BIGSERIAL PRIMARY KEY, t BIGINT NOT NULL, actor TEXT, action TEXT NOT NULL, target TEXT, result TEXT NOT NULL, detail TEXT)`,
    { trigger: 'audit_no_change', sql: [
      `CREATE OR REPLACE FUNCTION examflow_audit_append_only() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'the audit log is append-only'; END $$`,
      `CREATE TRIGGER audit_no_change BEFORE UPDATE OR DELETE ON audit FOR EACH ROW EXECUTE FUNCTION examflow_audit_append_only()`] },
    { trigger: 'audit_no_truncate', sql: [
      `CREATE OR REPLACE FUNCTION examflow_audit_append_only() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'the audit log is append-only'; END $$`,
      `CREATE TRIGGER audit_no_truncate BEFORE TRUNCATE ON audit FOR EACH STATEMENT EXECUTE FUNCTION examflow_audit_append_only()`] }
  ],
  [
    `CREATE TABLE IF NOT EXISTS inbox (msg_id TEXT NOT NULL, email TEXT NOT NULL, delivered_at BIGINT, read_at BIGINT, archived_at BIGINT, PRIMARY KEY (msg_id, email))`
  ]
];

// MySQL / MariaDB: utf8mb4 with binary (case-sensitive) comparison, like SQLite.
// Keys are VARCHAR; everything else is (LONG)TEXT so no value is ever too long.
// The three looked-up JSON fields get generated columns with an index.
const mjx = f => `CASE WHEN JSON_TYPE(JSON_EXTRACT(data, '$.${f}')) = 'NULL' THEN NULL ELSE JSON_UNQUOTE(JSON_EXTRACT(data, '$.${f}')) END`;
const MY_OPTS = 'ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin';
const MY_TRIG = 'SIGNAL SQLSTATE \'45000\' SET MESSAGE_TEXT = \'the audit log is append-only\'';
const MY_MIGRATIONS = [
  [
    `CREATE TABLE IF NOT EXISTS meta (k VARCHAR(191) NOT NULL PRIMARY KEY, v LONGTEXT) ${MY_OPTS}`,
    `CREATE TABLE IF NOT EXISTS docs (col VARCHAR(64) NOT NULL, id VARCHAR(300) NOT NULL, data LONGTEXT NOT NULL, created BIGINT NOT NULL, updated BIGINT NOT NULL, `
      + INDEXED.map(f => `g_${f} VARCHAR(255) AS (LEFT(${mjx(f)}, 255)) VIRTUAL, `).join('')
      + `PRIMARY KEY (col, id), ` + INDEXED.map(f => `KEY docs_${f} (col, g_${f})`).join(', ') + `) ${MY_OPTS}`,
    `CREATE TABLE IF NOT EXISTS users (uid VARCHAR(191) NOT NULL PRIMARY KEY, email VARCHAR(320) NOT NULL UNIQUE, name TEXT, pass_hash TEXT, source VARCHAR(32) NOT NULL, oidc_sub TEXT, created BIGINT NOT NULL, disabled INT NOT NULL DEFAULT 0) ${MY_OPTS}`,
    `CREATE TABLE IF NOT EXISTS codes (code_hash VARCHAR(191) NOT NULL PRIMARY KEY, email TEXT NOT NULL, purpose TEXT NOT NULL, created BIGINT NOT NULL, expires BIGINT NOT NULL, used BIGINT NULL) ${MY_OPTS}`,
    `CREATE TABLE IF NOT EXISTS logins (token_hash VARCHAR(191) NOT NULL PRIMARY KEY, uid TEXT NOT NULL, created BIGINT NOT NULL, expires BIGINT NOT NULL) ${MY_OPTS}`,
    `CREATE TABLE IF NOT EXISTS oidc_state (state VARCHAR(191) NOT NULL PRIMARY KEY, nonce TEXT NOT NULL, verifier TEXT NOT NULL, created BIGINT NOT NULL) ${MY_OPTS}`,
    `CREATE TABLE IF NOT EXISTS allowlist (teacher_id VARCHAR(191) NOT NULL PRIMARY KEY, email VARCHAR(320) NOT NULL UNIQUE, name TEXT, version INT NOT NULL) ${MY_OPTS}`,
    `CREATE TABLE IF NOT EXISTS allowlist_history (n BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY, t BIGINT NOT NULL, package_id TEXT, package_version TEXT, list_version INT, added INT, removed INT, total INT) ${MY_OPTS}`,
    `CREATE TABLE IF NOT EXISTS audit (n BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY, t BIGINT NOT NULL, actor TEXT, action TEXT NOT NULL, target TEXT, result TEXT NOT NULL, detail LONGTEXT) ${MY_OPTS}`,
    { trigger: 'audit_no_update', sql: [`CREATE TRIGGER audit_no_update BEFORE UPDATE ON audit FOR EACH ROW ${MY_TRIG}`] },
    { trigger: 'audit_no_delete', sql: [`CREATE TRIGGER audit_no_delete BEFORE DELETE ON audit FOR EACH ROW ${MY_TRIG}`] }
  ],
  [
    `CREATE TABLE IF NOT EXISTS inbox (msg_id VARCHAR(191) NOT NULL, email VARCHAR(320) NOT NULL, delivered_at BIGINT NULL, read_at BIGINT NULL, archived_at BIGINT NULL, PRIMARY KEY (msg_id, email)) ${MY_OPTS}`
  ]
];

// SQL Server: NVARCHAR with a binary (case-sensitive) collation, like SQLite.
// The three looked-up JSON fields get indexed computed columns.
const BIN = 'COLLATE Latin1_General_100_BIN2';
const K = n => `NVARCHAR(${n}) ${BIN}`, TX = `NVARCHAR(MAX) ${BIN}`;
const ms = (t, ddl) => `IF OBJECT_ID(N'${t}', N'U') IS NULL CREATE TABLE ${t} (${ddl})`;
const MS_MIGRATIONS = [
  [
    ms('meta', `k ${K(191)} NOT NULL PRIMARY KEY, v ${TX}`),
    ms('docs', `col ${K(64)} NOT NULL, id ${K(300)} NOT NULL, data ${TX} NOT NULL, created BIGINT NOT NULL, updated BIGINT NOT NULL, `
      + INDEXED.map(f => `g_${f} AS CAST(LEFT(JSON_VALUE(data, '$.${f}'), 300) AS NVARCHAR(300)), `).join('')
      + `CONSTRAINT pk_docs PRIMARY KEY (col, id)`),
    ...INDEXED.map(f => `IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'docs_${f}' AND object_id = OBJECT_ID(N'docs')) CREATE INDEX docs_${f} ON docs (col, g_${f})`),
    ms('users', `uid ${K(191)} NOT NULL PRIMARY KEY, email ${K(320)} NOT NULL UNIQUE, name ${TX}, pass_hash ${TX}, source ${K(32)} NOT NULL, oidc_sub ${TX}, created BIGINT NOT NULL, disabled INT NOT NULL DEFAULT 0`),
    ms('codes', `code_hash ${K(191)} NOT NULL PRIMARY KEY, email ${TX} NOT NULL, purpose ${TX} NOT NULL, created BIGINT NOT NULL, expires BIGINT NOT NULL, used BIGINT NULL`),
    ms('logins', `token_hash ${K(191)} NOT NULL PRIMARY KEY, uid ${TX} NOT NULL, created BIGINT NOT NULL, expires BIGINT NOT NULL`),
    ms('oidc_state', `state ${K(191)} NOT NULL PRIMARY KEY, nonce ${TX} NOT NULL, verifier ${TX} NOT NULL, created BIGINT NOT NULL`),
    ms('allowlist', `teacher_id ${K(191)} NOT NULL PRIMARY KEY, email ${K(320)} NOT NULL UNIQUE, name ${TX}, version INT NOT NULL`),
    ms('allowlist_history', `n BIGINT IDENTITY(1,1) PRIMARY KEY, t BIGINT NOT NULL, package_id ${TX}, package_version ${TX}, list_version INT, added INT, removed INT, total INT`),
    ms('audit', `n BIGINT IDENTITY(1,1) PRIMARY KEY, t BIGINT NOT NULL, actor ${TX}, action ${TX} NOT NULL, target ${TX}, result ${TX} NOT NULL, detail ${TX}`),
    { trigger: 'audit_append_only', sql: [`CREATE OR ALTER TRIGGER audit_append_only ON audit INSTEAD OF UPDATE, DELETE AS BEGIN SET NOCOUNT ON; THROW 51000, 'the audit log is append-only', 1; END`] }
  ],
  [
    ms('inbox', `msg_id ${K(191)} NOT NULL, email ${K(320)} NOT NULL, delivered_at BIGINT NULL, read_at BIGINT NULL, archived_at BIGINT NULL, CONSTRAINT pk_inbox PRIMARY KEY NONCLUSTERED (msg_id, email)`)
  ]
];

// Oracle: UID and AUDIT are reserved words there, so those two names are written
// "uid" / "audit" (quoted) on Oracle — oracleNames() does that to every statement.
// Before 23ai Oracle has no CREATE … IF NOT EXISTS, so each step ignores "already exists".
const OV = n => `VARCHAR2(${n} CHAR)`, OT = 'VARCHAR2(4000)', ON = 'NUMBER(19)';
const ojx = f => `JSON_VALUE(data, '$.${f}' RETURNING VARCHAR2(4000))`;
const OR_MIGRATIONS = [
  [
    `CREATE TABLE meta (k ${OV(191)} PRIMARY KEY, v CLOB)`,
    `CREATE TABLE docs (col ${OV(64)} NOT NULL, id ${OV(300)} NOT NULL, data CLOB NOT NULL, created ${ON} NOT NULL, updated ${ON} NOT NULL, CONSTRAINT pk_docs PRIMARY KEY (col, id), CONSTRAINT docs_json CHECK (data IS JSON))`,
    ...INDEXED.map(f => ({ optional: true, sql: `CREATE INDEX docs_${f} ON docs (col, ${ojx(f)})` })),
    `CREATE TABLE users (uid ${OV(191)} PRIMARY KEY, email ${OV(320)} NOT NULL UNIQUE, name ${OT}, pass_hash ${OT}, source ${OV(32)} NOT NULL, oidc_sub ${OT}, created ${ON} NOT NULL, disabled NUMBER(1) DEFAULT 0 NOT NULL)`,
    `CREATE TABLE codes (code_hash ${OV(191)} PRIMARY KEY, email ${OT} NOT NULL, purpose ${OT} NOT NULL, created ${ON} NOT NULL, expires ${ON} NOT NULL, used ${ON})`,
    `CREATE TABLE logins (token_hash ${OV(191)} PRIMARY KEY, uid ${OT} NOT NULL, created ${ON} NOT NULL, expires ${ON} NOT NULL)`,
    `CREATE TABLE oidc_state (state ${OV(191)} PRIMARY KEY, nonce ${OT} NOT NULL, verifier ${OT} NOT NULL, created ${ON} NOT NULL)`,
    `CREATE TABLE allowlist (teacher_id ${OV(191)} PRIMARY KEY, email ${OV(320)} NOT NULL UNIQUE, name ${OT}, version NUMBER(10) NOT NULL)`,
    `CREATE TABLE allowlist_history (n ${ON} GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY, t ${ON} NOT NULL, package_id ${OT}, package_version ${OT}, list_version NUMBER(10), added NUMBER(10), removed NUMBER(10), total NUMBER(10))`,
    `CREATE TABLE audit (n ${ON} GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY, t ${ON} NOT NULL, actor ${OT}, action ${OT} NOT NULL, target CLOB, result ${OT} NOT NULL, detail CLOB)`,
    { trigger: 'audit_append_only', sql: [`CREATE OR REPLACE TRIGGER audit_append_only BEFORE UPDATE OR DELETE ON audit BEGIN RAISE_APPLICATION_ERROR(-20001, 'the audit log is append-only'); END;`] }
  ],
  [
    `CREATE TABLE inbox (msg_id ${OV(191)} NOT NULL, email ${OV(320)} NOT NULL, delivered_at ${ON}, read_at ${ON}, archived_at ${ON}, CONSTRAINT pk_inbox PRIMARY KEY (msg_id, email))`
  ]
];
/** Quote Oracle's reserved names outside string literals. */
function oracleNames(sql) {
  return sql.split(/('(?:[^']|'')*')/).map((part, i) => i % 2 ? part : part.replace(/\b(uid|audit)\b/g, '"$1"')).join('');
}
/** An Oracle CREATE that does nothing if the table/index/constraint is already there. */
const oracleIfMissing = sql => `BEGIN EXECUTE IMMEDIATE '${sql.replace(/'/g, "''")}'; EXCEPTION WHEN OTHERS THEN IF SQLCODE NOT IN (-955, -1408, -2260, -2261, -2275) THEN RAISE; END IF; END;`;

// ── Firebird, SAP HANA, IBM Db2 (app-indexed, names quoted) ──────────────────
const APPIDX = ['firebird', 'hana', 'db2'];
const NAMES = ['meta', 'docs', 'users', 'codes', 'logins', 'oidc_state', 'allowlist', 'allowlist_history', 'audit', 'inbox',
  'k', 'v', 'col', 'id', 'data', 'created', 'updated', 'uid', 'email', 'name', 'pass_hash', 'source', 'oidc_sub', 'disabled', 'code_hash',
  'purpose', 'expires', 'used', 'token_hash', 'state', 'nonce', 'verifier', 'teacher_id', 'version', 'n', 't', 'package_id', 'package_version',
  'list_version', 'added', 'removed', 'total', 'actor', 'action', 'target', 'result', 'detail', 'msg_id', 'delivered_at', 'read_at', 'archived_at'];
const NAMES_RE = new RegExp('(?<!["$\\w])\\b(' + NAMES.join('|') + ')\\b(?!["$])', 'g');
/** Write ExamFlow's table and column names in quotes (outside string literals). */
function quoteNames(sql) {
  return sql.split(/('(?:[^']|'')*')/).map((part, i) => i % 2 ? part : part.replace(NAMES_RE, '"$1"')).join('');
}
// [name, [[column, kind, size, notNull, default]], primary key, unique]
const APP_TABLES = [
  ['meta', [['k', 'key', 191, 1], ['v', 'text']], ['k']],
  ['docs', [['col', 'key', 64, 1], ['id', 'key', 300, 1], ['data', 'text', 0, 1], ['created', 'big', 0, 1], ['updated', 'big', 0, 1],
    ...INDEXED.map(f => ['f_' + f, 'key', 255])], ['col', 'id']],
  ['users', [['uid', 'key', 191, 1], ['email', 'key', 320, 1], ['name', 'mid'], ['pass_hash', 'mid'], ['source', 'key', 32, 1], ['oidc_sub', 'mid'], ['created', 'big', 0, 1], ['disabled', 'int', 0, 1, '0']], ['uid'], ['email']],
  ['codes', [['code_hash', 'key', 191, 1], ['email', 'mid', 0, 1], ['purpose', 'key', 32, 1], ['created', 'big', 0, 1], ['expires', 'big', 0, 1], ['used', 'big']], ['code_hash']],
  ['logins', [['token_hash', 'key', 191, 1], ['uid', 'key', 191, 1], ['created', 'big', 0, 1], ['expires', 'big', 0, 1]], ['token_hash']],
  ['oidc_state', [['state', 'key', 191, 1], ['nonce', 'mid', 0, 1], ['verifier', 'mid', 0, 1], ['created', 'big', 0, 1]], ['state']],
  ['allowlist', [['teacher_id', 'key', 191, 1], ['email', 'key', 320, 1], ['name', 'mid'], ['version', 'int', 0, 1]], ['teacher_id'], ['email']],
  ['allowlist_history', [['n', 'ident'], ['t', 'big', 0, 1], ['package_id', 'mid'], ['package_version', 'mid'], ['list_version', 'int'], ['added', 'int'], ['removed', 'int'], ['total', 'int']], ['n']],
  ['audit', [['n', 'ident'], ['t', 'big', 0, 1], ['actor', 'mid'], ['action', 'mid', 0, 1], ['target', 'text'], ['result', 'mid', 0, 1], ['detail', 'text']], ['n']]
];
const APP_TABLES_2 = [['inbox', [['msg_id', 'key', 64, 1], ['email', 'key', 254, 1], ['delivered_at', 'big'], ['read_at', 'big'], ['archived_at', 'big']], ['msg_id', 'email']]];
const APP_TYPES = {
  firebird: { key: n => `VARCHAR(${n}) CHARACTER SET UTF8`, mid: 'VARCHAR(1000) CHARACTER SET UTF8', text: 'BLOB SUB_TYPE TEXT CHARACTER SET UTF8', big: 'BIGINT', int: 'INTEGER', ident: 'BIGINT GENERATED BY DEFAULT AS IDENTITY', table: 'TABLE' },
  hana: { key: n => `NVARCHAR(${n})`, mid: 'NVARCHAR(1000)', text: 'NCLOB', big: 'BIGINT', int: 'INTEGER', ident: 'BIGINT GENERATED BY DEFAULT AS IDENTITY', table: 'COLUMN TABLE' },
  db2: { key: n => `VARCHAR(${n})`, mid: 'VARCHAR(800)', text: 'CLOB(1G)', big: 'BIGINT', int: 'INTEGER', ident: 'BIGINT NOT NULL GENERATED BY DEFAULT AS IDENTITY', table: 'TABLE' }
};
function appCreate(kind, [name, cols, pk, uniq]) {
  const T = APP_TYPES[kind];
  const defs = cols.map(([c, k, n, nn, def]) => `${c} ${typeof T[k] === 'function' ? T[k](n) : T[k]}${def !== undefined ? ' DEFAULT ' + def : ''}${nn ? ' NOT NULL' : ''}`);
  if (kind === 'db2') for (let i = 0; i < defs.length; i++) if (pk.includes(cols[i][0]) && !/NOT NULL/.test(defs[i])) defs[i] += ' NOT NULL';
  defs.push(`PRIMARY KEY (${pk.join(', ')})`);
  if (uniq) defs.push(`UNIQUE (${uniq.join(', ')})`);
  return `CREATE ${T.table} ${name} (${defs.join(', ')})`;
}
const APP_MSG = "'the audit log is append-only'";
function appTriggers(kind) {
  if (kind === 'firebird') return [{ trigger: 'audit_no_change', sql: [
    `CREATE OR ALTER EXCEPTION audit_append_only ${APP_MSG}`,
    'GRANT USAGE ON EXCEPTION audit_append_only TO PUBLIC',
    'CREATE OR ALTER TRIGGER audit_no_change FOR audit ACTIVE BEFORE UPDATE OR DELETE POSITION 0 AS BEGIN EXCEPTION audit_append_only; END'] }];
  if (kind === 'hana') return ['update', 'delete'].map(op => ({ trigger: 'audit_no_' + op, sql: [
    `CREATE TRIGGER audit_no_${op} BEFORE ${op.toUpperCase()} ON audit FOR EACH ROW BEGIN SIGNAL SQL_ERROR_CODE 10001 SET MESSAGE_TEXT = ${APP_MSG}; END`] }));
  return ['update', 'delete'].map(op => ({ trigger: 'audit_no_' + op, sql: [
    `CREATE OR REPLACE TRIGGER audit_no_${op} NO CASCADE BEFORE ${op.toUpperCase()} ON audit FOR EACH ROW SIGNAL SQLSTATE '75001' SET MESSAGE_TEXT = ${APP_MSG}`] }));
}
function appMigrations(kind) {
  const ix = INDEXED.map(f => `CREATE INDEX docs_${f} ON docs (col, f_${f})`);
  return [
    [...APP_TABLES.map(t => appCreate(kind, t)), ...ix, `CREATE INDEX docs_created ON docs (col, created)`, ...appTriggers(kind)],
    APP_TABLES_2.map(t => appCreate(kind, t))
  ];
}
/** A CREATE TABLE / CREATE INDEX that does nothing when the object is already there. */
function appIfMissing(kind, sql) {
  const m = /^CREATE (?:COLUMN )?(TABLE|INDEX) "?(\w+)"?/.exec(sql);
  const isTable = m[1] === 'TABLE', obj = isTable ? m[2] : m[2].toUpperCase(), esc = sql.replace(/'/g, "''");
  if (kind === 'firebird') return `EXECUTE BLOCK AS BEGIN IF (NOT EXISTS (SELECT 1 FROM ${isTable ? `rdb$relations WHERE rdb$relation_name = '${obj}'` : `rdb$indices WHERE rdb$index_name = '${obj}'`})) THEN EXECUTE STATEMENT '${esc}'; END`;
  if (kind === 'hana') return `DO BEGIN DECLARE cnt INT; SELECT COUNT(*) INTO cnt FROM ${isTable ? 'TABLES' : 'INDEXES'} WHERE SCHEMA_NAME = CURRENT_SCHEMA AND ${isTable ? 'TABLE_NAME' : 'INDEX_NAME'} = '${obj}'; IF :cnt = 0 THEN EXEC '${esc}'; END IF; END`;
  return `BEGIN DECLARE CONTINUE HANDLER FOR SQLSTATE '42710' BEGIN END; EXECUTE IMMEDIATE '${esc}'; END`;
}
const hanaIfNoTrigger = (name, sql) => `DO BEGIN DECLARE cnt INT; SELECT COUNT(*) INTO cnt FROM TRIGGERS WHERE SCHEMA_NAME = CURRENT_SCHEMA AND TRIGGER_NAME = '${name.toUpperCase()}'; IF :cnt = 0 THEN EXEC '${sql.replace(/'/g, "''")}'; END IF; END`;
const DOCS_PUT_APP = 'col, id, data, created, updated, f_examToken, f_teacherUid, f_switchCode';

// ── statements ──────────────────────────────────────────────────────────────
const STATEMENTS = {
  // meta + documents
  'meta.get': 'SELECT v FROM meta WHERE k = ?',
  'meta.set': {
    sqlite: 'INSERT INTO meta (k, v) VALUES (?, ?) ON CONFLICT(k) DO UPDATE SET v = excluded.v',
    mysql: 'INSERT INTO meta (k, v) VALUES (?, ?) ON DUPLICATE KEY UPDATE v = VALUES(v)',
    mssql: { native: 'UPDATE meta SET v = @p2 WHERE k = @p1; IF @@ROWCOUNT = 0 INSERT INTO meta (k, v) VALUES (@p1, @p2)' },
    oracle: { native: 'MERGE INTO meta t USING dual ON (t.k = :p1) WHEN MATCHED THEN UPDATE SET t.v = :p2 WHEN NOT MATCHED THEN INSERT (k, v) VALUES (:p1, :p2)' },
    firebird: 'UPDATE OR INSERT INTO meta (k, v) VALUES (?, ?) MATCHING (k)',
    hana: 'UPSERT meta (k, v) VALUES (?, ?) WITH PRIMARY KEY',
    db2: 'MERGE INTO meta t USING (VALUES (CAST(? AS VARCHAR(191)), CAST(? AS CLOB(1G)))) s (k, v) ON t.k = s.k WHEN MATCHED THEN UPDATE SET v = s.v WHEN NOT MATCHED THEN INSERT (k, v) VALUES (s.k, s.v)'
  },
  'docs.get': 'SELECT data FROM docs WHERE col = ? AND id = ?',
  'docs.put': {
    sqlite: `INSERT INTO docs (col, id, data, created, updated) VALUES (?, ?, ?, ?, ?)
      ON CONFLICT(col, id) DO UPDATE SET data = excluded.data, updated = excluded.updated`,
    mysql: 'INSERT INTO docs (col, id, data, created, updated) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE data = VALUES(data), updated = VALUES(updated)',
    mssql: { native: 'UPDATE docs SET data = @p3, updated = @p5 WHERE col = @p1 AND id = @p2; IF @@ROWCOUNT = 0 INSERT INTO docs (col, id, data, created, updated) VALUES (@p1, @p2, @p3, @p4, @p5)' },
    oracle: { native: 'MERGE INTO docs t USING dual ON (t.col = :p1 AND t.id = :p2) WHEN MATCHED THEN UPDATE SET t.data = :p3, t.updated = :p5 WHEN NOT MATCHED THEN INSERT (col, id, data, created, updated) VALUES (:p1, :p2, :p3, :p4, :p5)' },
    // Firebird, HANA, Db2 get 8 values: col, id, data, created, updated + the three searched fields
    firebird: { sql: `MERGE INTO docs t USING rdb$database ON t.col = ? AND t.id = ? WHEN MATCHED THEN UPDATE SET data = ?, updated = ?, f_examToken = ?, f_teacherUid = ?, f_switchCode = ? WHEN NOT MATCHED THEN INSERT (${DOCS_PUT_APP}) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, map: [0, 1, 2, 4, 5, 6, 7, 0, 1, 2, 3, 4, 5, 6, 7] },
    hana: { sql: `UPSERT docs (${DOCS_PUT_APP}) SELECT ?, ?, ?, COALESCE((SELECT created FROM docs WHERE col = ? AND id = ?), ?), ?, ?, ?, ? FROM DUMMY`, map: [0, 1, 2, 0, 1, 3, 4, 5, 6, 7] },
    db2: `MERGE INTO docs t USING (VALUES (CAST(? AS VARCHAR(64)), CAST(? AS VARCHAR(300)), CAST(? AS CLOB(1G)), CAST(? AS BIGINT), CAST(? AS BIGINT), CAST(? AS VARCHAR(255)), CAST(? AS VARCHAR(255)), CAST(? AS VARCHAR(255)))) s (col, id, data, created, updated, fe, ft, fs) ON t.col = s.col AND t.id = s.id WHEN MATCHED THEN UPDATE SET data = s.data, updated = s.updated, f_examToken = s.fe, f_teacherUid = s.ft, f_switchCode = s.fs WHEN NOT MATCHED THEN INSERT (${DOCS_PUT_APP}) VALUES (s.col, s.id, s.data, s.created, s.updated, s.fe, s.ft, s.fs)`
  },
  'docs.delete': 'DELETE FROM docs WHERE col = ? AND id = ?',
  'docs.counts': 'SELECT col, COUNT(*) n FROM docs GROUP BY col',
  'audit.insert': 'INSERT INTO audit (t, actor, action, target, result, detail) VALUES (?, ?, ?, ?, ?, ?)',
  // sign-in sessions
  'logins.insert': 'INSERT INTO logins (token_hash, uid, created, expires) VALUES (?, ?, ?, ?)',
  'logins.purge': 'DELETE FROM logins WHERE expires < ?',
  'logins.user': `SELECT u.uid, u.email, u.name, u.disabled FROM logins l JOIN users u ON u.uid = l.uid
      WHERE l.token_hash = ? AND l.expires > ?`,
  'logins.delete': 'DELETE FROM logins WHERE token_hash = ?',
  'logins.deleteUser': 'DELETE FROM logins WHERE uid = ?',
  // approved teachers
  'allowlist.byEmail': 'SELECT teacher_id, email, name FROM allowlist WHERE email = ?',
  'allowlist.byEmailAll': 'SELECT * FROM allowlist WHERE email = ?',
  'allowlist.withoutAccount': 'SELECT a.* FROM allowlist a LEFT JOIN users u ON u.email = a.email WHERE u.uid IS NULL ORDER BY a.teacher_id',
  'allowlist.withAccountFlag': 'SELECT a.teacher_id, a.email, u.uid FROM allowlist a LEFT JOIN users u ON u.email = a.email ORDER BY a.teacher_id',
  'allowlist.pairs': 'SELECT teacher_id, email FROM allowlist',
  'allowlist.emails': 'SELECT email FROM allowlist',
  'allowlist.clear': 'DELETE FROM allowlist',
  'allowlist.insert': 'INSERT INTO allowlist (teacher_id, email, name, version) VALUES (?, ?, ?, ?)',
  'allowHistory.insert': 'INSERT INTO allowlist_history (t, package_id, package_version, list_version, added, removed, total) VALUES (?, ?, ?, ?, ?, ?, ?)',
  // activation codes
  'codes.retire': 'UPDATE codes SET used = ? WHERE email = ? AND purpose = ? AND used IS NULL',
  'codes.insert': 'INSERT INTO codes (code_hash, email, purpose, created, expires, used) VALUES (?, ?, ?, ?, ?, NULL)',
  'codes.get': 'SELECT * FROM codes WHERE code_hash = ?',
  'codes.use': 'UPDATE codes SET used = ? WHERE code_hash = ?',
  // accounts
  'users.uidByEmail': 'SELECT uid FROM users WHERE email = ?',
  'users.setPassword': 'UPDATE users SET pass_hash = ?, disabled = 0 WHERE uid = ?',
  'users.insertLocal': 'INSERT INTO users (uid, email, name, pass_hash, source, created) VALUES (?, ?, ?, ?, ?, ?)',
  'users.byEmail': 'SELECT * FROM users WHERE email = ?',
  'users.byOidc': 'SELECT * FROM users WHERE oidc_sub = ? AND source = ?',
  'users.insertOidc': 'INSERT INTO users (uid, email, name, pass_hash, source, oidc_sub, created) VALUES (?, ?, ?, NULL, ?, ?, ?)',
  'users.setOidcSub': 'UPDATE users SET oidc_sub = ? WHERE uid = ?',
  // institution sign-in (OIDC) round trips
  'oidc.purge': 'DELETE FROM oidc_state WHERE created < ?',
  'oidc.insert': 'INSERT INTO oidc_state (state, nonce, verifier, created) VALUES (?, ?, ?, ?)',
  'oidc.get': 'SELECT * FROM oidc_state WHERE state = ?',
  'oidc.delete': 'DELETE FROM oidc_state WHERE state = ?',
  // dashboard messages from GHUM
  'inbox.byMsg': 'SELECT delivered_at, read_at FROM inbox WHERE msg_id = ?',
  'inbox.get': 'SELECT delivered_at, read_at, archived_at FROM inbox WHERE msg_id = ? AND email = ?',
  'inbox.ensure': {
    sqlite: 'INSERT INTO inbox (msg_id, email, delivered_at) VALUES (?, ?, ?) ON CONFLICT(msg_id, email) DO NOTHING',
    mysql: 'INSERT IGNORE INTO inbox (msg_id, email, delivered_at) VALUES (?, ?, ?)',
    mssql: { native: 'IF NOT EXISTS (SELECT 1 FROM inbox WHERE msg_id = @p1 AND email = @p2) INSERT INTO inbox (msg_id, email, delivered_at) VALUES (@p1, @p2, @p3)' },
    oracle: { native: 'INSERT INTO inbox (msg_id, email, delivered_at) SELECT :p1, :p2, :p3 FROM dual WHERE NOT EXISTS (SELECT 1 FROM inbox WHERE msg_id = :p1 AND email = :p2)' },
    firebird: { sql: 'MERGE INTO inbox t USING rdb$database ON t.msg_id = ? AND t.email = ? WHEN NOT MATCHED THEN INSERT (msg_id, email, delivered_at) VALUES (?, ?, ?)', map: [0, 1, 0, 1, 2] },
    hana: { sql: 'INSERT INTO inbox (msg_id, email, delivered_at) SELECT CAST(? AS NVARCHAR(64)), CAST(? AS NVARCHAR(254)), CAST(? AS BIGINT) FROM DUMMY WHERE NOT EXISTS (SELECT 1 FROM inbox WHERE msg_id = ? AND email = ?)', map: [0, 1, 2, 0, 1] },
    db2: 'MERGE INTO inbox t USING (VALUES (CAST(? AS VARCHAR(64)), CAST(? AS VARCHAR(254)), CAST(? AS BIGINT))) s (msg_id, email, d) ON t.msg_id = s.msg_id AND t.email = s.email WHEN NOT MATCHED THEN INSERT (msg_id, email, delivered_at) VALUES (s.msg_id, s.email, s.d)'
  },
  'inbox.read': 'UPDATE inbox SET read_at = COALESCE(read_at, ?) WHERE msg_id = ? AND email = ?',
  'inbox.archive': 'UPDATE inbox SET archived_at = ?, read_at = COALESCE(read_at, ?) WHERE msg_id = ? AND email = ?',
  'inbox.unarchive': 'UPDATE inbox SET archived_at = NULL WHERE msg_id = ? AND email = ?',
  // housekeeping
  'version': { sqlite: 'SELECT sqlite_version() AS v', postgres: 'SELECT version() AS v', mysql: 'SELECT VERSION() AS v', mssql: 'SELECT @@VERSION AS v', oracle: "SELECT 'Oracle Database' AS v FROM dual",
    firebird: "SELECT 'Firebird ' || rdb$get_context('SYSTEM', 'ENGINE_VERSION') AS v FROM rdb$database", hana: "SELECT 'SAP HANA ' || VERSION AS v FROM M_DATABASE",
    db2: "SELECT 'IBM Db2 ' || SERVICE_LEVEL AS v FROM SYSIBMADM.ENV_INST_INFO" },
  'hasMeta': {
    sqlite: "SELECT name AS t FROM sqlite_master WHERE type='table' AND name='meta'",
    postgres: "SELECT to_regclass('meta') AS t",
    mysql: "SELECT table_name AS t FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = 'meta'",
    mssql: "SELECT OBJECT_ID(N'meta', N'U') AS t",
    oracle: "SELECT table_name AS t FROM user_tables WHERE table_name = 'META'",
    firebird: "SELECT 1 AS t FROM rdb$relations WHERE rdb$relation_name = 'meta'",
    hana: "SELECT TABLE_NAME AS t FROM TABLES WHERE SCHEMA_NAME = CURRENT_SCHEMA AND TABLE_NAME = 'meta'",
    db2: "SELECT TABNAME AS t FROM SYSCAT.TABLES WHERE TABSCHEMA = CURRENT SCHEMA AND TABNAME = 'meta'"
  },
  'hasTrigger': {
    postgres: 'SELECT tgname AS t FROM pg_trigger WHERE tgname = ? AND NOT tgisinternal',
    mysql: 'SELECT trigger_name AS t FROM information_schema.triggers WHERE trigger_schema = DATABASE() AND trigger_name = ?',
    mssql: 'SELECT name AS t FROM sys.triggers WHERE name = ?',
    oracle: 'SELECT trigger_name AS t FROM user_triggers WHERE trigger_name = UPPER(?)',
    firebird: 'SELECT 1 AS t FROM rdb$triggers WHERE rdb$trigger_name = UPPER(?)',
    hana: 'SELECT TRIGGER_NAME AS t FROM TRIGGERS WHERE SCHEMA_NAME = CURRENT_SCHEMA AND TRIGGER_NAME = UPPER(?)',
    db2: 'SELECT TRIGNAME AS t FROM SYSCAT.TRIGGERS WHERE TRIGSCHEMA = CURRENT SCHEMA AND TRIGNAME = UPPER(?)'
  }
};

/** ? placeholders → the database's own. */
function placeholders(kind, sql) {
  if (kind === 'postgres') { let i = 0; return sql.replace(/\?/g, () => '$' + (++i)); }
  if (kind === 'mssql') { let i = 0; return sql.replace(/\?/g, () => '@p' + (++i)); }
  if (kind === 'oracle') { let i = 0; return oracleNames(sql.replace(/\?/g, () => ':p' + (++i))); }
  if (APPIDX.includes(kind)) return quoteNames(sql);
  return sql;
}
const _cache = new Map();
/** A named statement on a database → { sql, map } (map: which argument goes to each "?", when reordered or repeated). */
function prepared(kind, name) {
  const key = kind + ':' + name;
  if (_cache.has(key)) return _cache.get(key);
  const s = STATEMENTS[name];
  if (!s) throw new Error('Unknown database statement: ' + name);
  let v = typeof s === 'string' ? s : (s[kind] !== undefined ? s[kind] : s.sqlite);
  let out;
  if (typeof v === 'object' && v.native) out = { sql: kind === 'oracle' ? oracleNames(v.native) : v.native, map: null };
  else if (typeof v === 'object') out = { sql: placeholders(kind, v.sql), map: v.map };
  else out = { sql: placeholders(kind, v), map: null };
  _cache.set(key, out);
  return out;
}
/** The SQL text for a named statement on a database. */
function statement(kind, name) { return prepared(kind, name).sql; }

/** SQL + arguments for a documents query: equality on top-level JSON fields, oldest first. */
const FIELD = /^[A-Za-z_][A-Za-z0-9_]{0,63}$/;
function docsQuery(kind, col, where, limit) {
  const parts = [], args = [col];
  const asText = v => typeof v === 'boolean' ? (v ? 'true' : 'false') : String(v);
  if (APPIDX.includes(kind)) {
    // the searched fields come from their own columns; every condition is checked again by db.js
    let all = true;
    for (const [f, , v] of where) {
      if (!FIELD.test(String(f))) throw new Error('Invalid field name in query: ' + f);
      if (INDEXED.includes(f) && v !== null && v !== undefined && asText(v).length <= 255) { parts.push(`f_${f} = ?`); args.push(asText(v)); }
      else all = false;
    }
    let sql = 'SELECT id, data FROM docs WHERE col = ?' + parts.map(p => ' AND ' + p).join('') + ' ORDER BY created, id';
    const n = all && limit ? Math.max(1, Number(limit) | 0) : 0;
    if (n) sql += kind === 'firebird' ? ` ROWS ${n}` : kind === 'hana' ? ` LIMIT ${n}` : ` FETCH FIRST ${n} ROWS ONLY`;
    return { sql: placeholders(kind, sql), args, recheck: true };
  }
  for (const [f, , v] of where) {
    if (!FIELD.test(String(f))) throw new Error('Invalid field name in query: ' + f);
    if (kind === 'sqlite') { parts.push(`json_extract(data, '$.${f}') IS ?`); args.push(typeof v === 'boolean' ? (v ? 1 : 0) : v); continue; }
    const ix = INDEXED.includes(f);
    const expr = kind === 'postgres' ? pj(f) : kind === 'mysql' ? `(${mjx(f)})` : kind === 'oracle' ? ojx(f) : `JSON_VALUE(data, '$.${f}')`;
    if (v === null || v === undefined) { parts.push(ix && (kind === 'mysql' || kind === 'mssql') ? `g_${f} IS NULL` : `${expr} IS NULL`); continue; }
    if (ix && kind === 'mysql') { parts.push(`g_${f} = LEFT(?, 255)`); args.push(asText(v)); }
    if (ix && kind === 'mssql') { parts.push(`g_${f} = CAST(LEFT(?, 300) AS NVARCHAR(300))`); args.push(asText(v)); }
    parts.push(`${expr} = ?`); args.push(asText(v));
  }
  let sql = 'SELECT id, data FROM docs WHERE col = ?' + parts.map(p => ' AND ' + p).join('');
  if (kind === 'sqlite') {
    sql += ' ORDER BY created';
    if (limit) { sql += ' LIMIT ?'; args.push(limit); }
  } else if (kind === 'mssql') {
    sql += ' ORDER BY created, id';
    if (limit) { sql += ' OFFSET 0 ROWS FETCH NEXT ? ROWS ONLY'; args.push(Number(limit)); }
  } else if (kind === 'oracle') {
    sql += ' ORDER BY created, id';
    if (limit) { sql += ' FETCH FIRST ? ROWS ONLY'; args.push(Number(limit)); }
  } else {
    sql += ' ORDER BY created, id';
    if (limit) { sql += ' LIMIT ?'; args.push(Number(limit)); }
  }
  return { sql: placeholders(kind, sql), args };
}

const MIGRATIONS = SQLITE_MIGRATIONS; // kept under the old name for anything that imports it
const SCHEMA = { postgres: PG_MIGRATIONS, mysql: MY_MIGRATIONS, mssql: MS_MIGRATIONS, oracle: OR_MIGRATIONS,
  firebird: appMigrations('firebird'), hana: appMigrations('hana'), db2: appMigrations('db2') };

/** One schema step → the SQL statements to run (Oracle: quoted names, "if missing" wrappers). */
function stepSql(kind, step) {
  const list = typeof step === 'string' ? [step] : step.sql ? [].concat(step.sql) : [];
  if (APPIDX.includes(kind)) return list.map(sql => {
    const q = quoteNames(sql);
    if (/^CREATE (COLUMN )?(TABLE|INDEX)/.test(sql)) return appIfMissing(kind, q);
    if (kind === 'hana' && step.trigger) return hanaIfNoTrigger(step.trigger, q);
    return q;
  });
  if (kind !== 'oracle') return list;
  return list.map(sql => /^CREATE (TABLE|INDEX)/.test(sql) ? oracleIfMissing(oracleNames(sql)) : oracleNames(sql));
}

/** A complete, commented SQL script a DBA can run with an admin account to create everything
    (then the ExamFlow user only needs to read and write rows). */
function schemaScript(kind, opts = {}) {
  const steps = SCHEMA[kind]; if (!steps) throw new Error('No SQL schema for ' + kind);
  const end = { postgres: ';', mysql: ';', mssql: '\nGO', oracle: '\n/', firebird: ' ^\nCOMMIT ^', hana: '\n#', db2: ' @' }[kind];
  const lines = [`-- ExamFlow institution server: database schema for ${({ postgres: 'PostgreSQL 12+', mysql: 'MySQL 8+ / MariaDB 10.6+', mssql: 'SQL Server 2017+ / Azure SQL', oracle: 'Oracle Database 19c+', firebird: 'Firebird 3+', hana: 'SAP HANA 2.0 / HANA Cloud', db2: 'IBM Db2 11.5+' })[kind]}`,
    `-- Schema version ${steps.length}. Run it connected to the EMPTY database (or schema) made for ExamFlow,`,
    '-- as its owner or an admin. Safe to run twice. Then give the ExamFlow user the rights listed in DATABASES.md.', ''];
  if (kind === 'mysql' && opts.withDelimiter !== false) lines.push('-- (Run with the mysql command-line client:  mysql -u admin -p examflow < mysql.sql)', '');
  if (kind === 'mssql') lines.push('-- indexes on computed columns need these (sqlcmd turns QUOTED_IDENTIFIER off unless run with -I)', 'SET ANSI_NULLS ON', 'GO', 'SET QUOTED_IDENTIFIER ON', 'GO', '');
  if (kind === 'oracle') lines.push('SET DEFINE OFF', '');
  if (kind === 'firebird') lines.push('-- Run with isql:  isql-fb -user SYSDBA -i firebird.sql localhost:/path/examflow.fdb   (the database must use UTF8)', 'SET TERM ^ ;', '');
  if (kind === 'hana') lines.push('-- Run with hdbsql, "#" ends each statement:  hdbsql -n HOST:PORT -u ADMIN -c "#" -mI hana.sql', '');
  if (kind === 'db2') lines.push('-- Run with the Db2 command line, "@" ends each statement:  db2 connect to EXAMFLOW && db2 -td@ -vf db2.sql', '');
  for (const [i, step] of steps.entries()) {
    lines.push(`-- ── step ${i + 1} ──`);
    for (const st of step) {
      if (typeof st === 'object' && st.trigger) lines.push(`-- append-only protection for the audit log (${st.trigger})`);
      if (typeof st === 'object' && st.optional) lines.push('-- (speeds up searches; if your database refuses it, ExamFlow still works)');
      for (let sql of stepSql(kind, st)) {
        if (kind === 'mysql' && /^CREATE TRIGGER/.test(sql)) sql = `DROP TRIGGER IF EXISTS ${st.trigger};\n${sql}`;
        if (kind === 'postgres' && /^CREATE TRIGGER/.test(sql)) sql = `DROP TRIGGER IF EXISTS ${st.trigger} ON audit;\n${sql}`;
        lines.push(sql + end);
      }
    }
    lines.push('');
  }
  if (APPIDX.includes(kind)) {
    const p = prepared(kind, 'meta.set'); let i = 0;
    lines.push('-- record which schema version this database has', p.sql.replace(/\?/g, () => (i++ === 0 ? "'schema_version'" : `'${steps.length}'`)) + end, '');
    if (kind === 'firebird') lines.push('COMMIT ^', 'SET TERM ; ^'); if (kind === 'db2') lines.push('COMMIT @');
    return lines.join('\n');
  }
  const ver = statement(kind, 'meta.set').replace(/\$1|\?|@p1|:p1/, "'schema_version'").replace(/\$2|\?|@p2|:p2/, `'${steps.length}'`)
    .replace(/@p1|:p1/g, "'schema_version'").replace(/@p2|:p2/g, `'${steps.length}'`);
  lines.push('-- record which schema version this database has', ver + end, '');
  if (kind === 'oracle' || kind === 'mssql') lines.push(kind === 'oracle' ? 'COMMIT\n/' : '');
  if (kind === 'firebird') lines.push('COMMIT ^', 'SET TERM ; ^');
  if (kind === 'db2') lines.push('COMMIT @');
  return lines.join('\n');
}

module.exports = { MIGRATIONS, SQLITE_MIGRATIONS, SCHEMA, STATEMENTS, statement, prepared, docsQuery, placeholders, oracleNames, quoteNames, stepSql, schemaScript, INDEXED, APPIDX };
