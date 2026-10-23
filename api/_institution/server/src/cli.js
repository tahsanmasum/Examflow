'use strict';
/* Commands for the institution's IT team. Run from the package folder:
     node server/src/cli.js check            check settings, package signature, files and database
     node server/src/cli.js register --code CODE
                                             register this server with GHUM (one-time code from GHUM)
     node server/src/cli.js licence          check the licence with GHUM now and show it
     node server/src/cli.js teacher-codes [--email someone@uni.edu]
                                             make one-time activation codes (AUTH_MODE=local) for listed
                                             teachers who don't have an account yet, or for one teacher
                                             (also used to reset a forgotten password)
     node server/src/cli.js teachers         list the approved teachers and whether they have an account
     node server/src/cli.js fetch-models     download the Bangla + English reading models (hash-checked)
     node server/src/cli.js backup           save a copy of the database to DATA_DIR/backups (SQLite only;
                                             PostgreSQL / MySQL / SQL Server: use the database's own backup)
     node server/src/cli.js db-check         connect to the database and test reading, writing, searching,
                                             undo (transactions) and the append-only audit log
     node server/src/cli.js import-sqlite [--from DATA_DIR/examflow.db]
                                             copy everything from an ExamFlow SQLite file into the external
                                             database set in .env (DB_TYPE); the external one must be empty
     node server/src/cli.js add-driver db2   install IBM's own Db2 driver (only for DB_TYPE=db2; needs internet,
                                             npm, and on Linux/macOS python3, make and a C++ compiler)
     node server/src/cli.js db-schema --type postgres|mysql|mssql|oracle|firebird|hana|db2|mongodb|cassandra|dynamodb
                                             print the script a DBA can run to create ExamFlow's tables
                                             (needs no .env and no database connection)
     node server/src/cli.js status           short summary
   With Docker:  docker compose exec examflow node server/src/cli.js <command>
   Settings come from .env in the current folder, or the file named by EXAMFLOW_ENV_FILE. */
const path = require('node:path');
const { loadDotEnv, readConfig } = require('./config');
const { readPackage } = require('./package');
const { boot } = require('./server');
const { Licence } = require('./licence');
const { Auth } = require('./auth');
const { normEmail } = require('./util');

const arg = (name) => { const i = process.argv.indexOf('--' + name); return i > 0 ? process.argv[i + 1] : undefined; };
const out = s => process.stdout.write(s + '\n');

async function main() {
  loadDotEnv(process.env.EXAMFLOW_ENV_FILE || path.resolve(process.cwd(), '.env'));
  const cmd = process.argv[2];
  if (cmd === 'add-driver') {
    if (process.argv[3] !== 'db2') throw new Error('Usage: add-driver db2   (every other database driver is already inside the package)');
    const dir = path.join(__dirname, '..', 'addons');
    require('node:fs').mkdirSync(dir, { recursive: true });
    out(`Installing IBM's Db2 driver (ibm_db) into ${dir}. IBM's installer downloads the IBM Data Server Driver (about 100 MB) from IBM; it is IBM's software under IBM's licence.`);
    const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
    const r = require('node:child_process').spawnSync(npm, ['install', '--no-audit', '--no-fund', '--prefix', dir, 'ibm_db@3'], { stdio: 'inherit', shell: process.platform === 'win32' });
    if (r.status !== 0) throw new Error('The Db2 driver did not install (messages above). It needs internet access, npm, and on Linux/macOS: python3, make and a C++ compiler (e.g. apt install python3 make g++). On Windows it downloads a ready build.');
    out('IBM Db2 driver installed. Next: set DB_TYPE=db2 and the DB_* settings, then  node server/src/cli.js db-check');
    return;
  }
  if (cmd === 'db-schema') {
    const t = { postgresql: 'postgres', mariadb: 'mysql', sqlserver: 'mssql', mongo: 'mongodb', saphana: 'hana', scylladb: 'cassandra' }[arg('type')] || arg('type');
    const script = { mongodb: 'mongodb.js', cassandra: 'cassandra.cql', dynamodb: 'dynamodb.json' }[t];
    if (script) { out(require('node:fs').readFileSync(path.join(__dirname, '..', '..', 'install', 'database-scripts', script), 'utf8')); return; }
    if (!['postgres', 'mysql', 'mssql', 'oracle', 'firebird', 'hana', 'db2'].includes(t)) throw new Error('Usage: db-schema --type postgres|mysql|mssql|oracle|firebird|hana|db2|mongodb|cassandra|dynamodb');
    out(require('./db-sql').schemaScript(t)); return;
  }
  if (cmd === 'check') {
    let fail = 0;
    const { config, errors, warnings } = readConfig();
    out((errors.length ? 'FAIL' : 'PASS') + '  settings' + (errors.length ? '\n        - ' + errors.join('\n        - ') : ''));
    for (const w of warnings) out('WARN  ' + w);
    fail += errors.length ? 1 : 0;
    const pkg = readPackage(config.packageDir);
    out((pkg.ok ? 'PASS' : 'FAIL') + '  package signature and files' + (pkg.ok ? ` (package ${pkg.manifest.packageId} v${pkg.manifest.packageVersion} for ${pkg.manifest.institution.name}, key ${pkg.fingerprint})` : '\n        - ' + pkg.errors.join('\n        - ')));
    if (!pkg.ok) fail++;
    if (!errors.length && pkg.ok) {
      try {
        const p = boot(); out(`PASS  database: ${p.db.describe()} (schema ${p.db.getMeta('schema_version')}), teacher list version ${p.db.getMeta('allowlist_version')}`);
        for (const w of p.db.warnings) out('WARN  ' + w);
        if (!p.db.transactions()) out('WARN  this MongoDB is a single server without a replica set, so a group of changes cannot be undone together. Use a replica set (Atlas always is). See DATABASES.md.');
        p.db.close();
      }
      catch (e) { out('FAIL  ' + e.message.replace(/\n/g, '\n        ')); fail++; }
    }
    out(fail ? `\n${fail} check(s) failed. Fix them before starting the server.` : '\nAll checks passed.');
    process.exit(fail ? 1 : 0);
  }
  const parts = boot();
  const { db, config, pkg } = parts;
  try {
    if (cmd === 'register') {
      const code = arg('code'); if (!code) throw new Error('Usage: register --code CODE   (the one-time code from GHUM)');
      const lic = new Licence({ db, config, pkg });
      const id = await lic.register(code);
      const st = lic.state();
      out(`Registered with GHUM as server ${id}.\nLicence: ${st.status}${st.expiresAt ? ' — expires ' + new Date(st.expiresAt).toISOString() : ''}`);
    } else if (cmd === 'licence') {
      const lic = new Licence({ db, config, pkg });
      await lic.refresh();
      const st = lic.state();
      out(`Licence: ${st.status}` + (st.activatesAt ? `\nActive from: ${new Date(st.activatesAt).toISOString()}` : '') + (st.expiresAt ? `\nExpires: ${new Date(st.expiresAt).toISOString()} (${st.remainingDays} days left)` : '')
        + `\nNew exams allowed: ${st.canCreateExams ? 'yes' : 'no'}` + (st.message ? '\n' + st.message : '') + (lic.lastError ? '\nLast error: ' + lic.lastError : ''));
    } else if (cmd === 'teacher-codes') {
      if (config.authMode !== 'local') throw new Error('Activation codes are only for AUTH_MODE=local. With OIDC, teachers sign in with the institution account.');
      const auth = new Auth({ db, config });
      const one = arg('email');
      let rows = one ? db.all('allowlist.byEmailAll', normEmail(one))
        : db.all('allowlist.withoutAccount');
      // The institution's own admins (INSTITUTION_ADMIN_EMAILS) also need an account to open the Admin Monitor.
      if (one && !rows.length && config.admins.includes(normEmail(one))) rows = [{ teacher_id: '(institution admin)', email: normEmail(one) }];
      if (one && !rows.length) throw new Error(one + ' is not on the approved teacher list (or INSTITUTION_ADMIN_EMAILS). Ask GHUM for an updated package.');
      out('teacher_id,email,activation_code,expires');
      const exp = new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10);
      for (const r of rows) { out(`${r.teacher_id},${r.email},${auth.issueCode(r.email, 'activate', 14)},${exp}`); }
      db.audit('it-admin', 'codes.issue', one || 'all-without-account', 'ok', { count: rows.length });
      process.stderr.write(`\n${rows.length} code(s). Each works once, for that email only, for 14 days. Give each teacher only their own code.\n`);
    } else if (cmd === 'teachers') {
      out('teacher_id,email,has_account');
      for (const r of db.all('allowlist.withAccountFlag')) out(`${r.teacher_id},${r.email},${r.uid ? 'yes' : 'no'}`);
    } else if (cmd === 'fetch-models') {
      // The Bangla + English reading models (≈4 MB) are not inside the package; download them once and check their hashes.
      const fs = require('node:fs'); const { sha256 } = require('./util');
      const models = pkg.manifest.models || [];
      if (!models.length) { out('This package lists no reading models; the app will use the standard ones from the internet.'); return; }
      fs.mkdirSync(config.modelsDir, { recursive: true });
      for (const m of models) {
        const url = new URL(m.path, pkg.manifest.controlPlaneUrl + '/').toString();
        const r = await fetch(url); if (!r.ok) throw new Error(`Could not download ${url} (HTTP ${r.status}).`);
        const buf = Buffer.from(await r.arrayBuffer());
        if (sha256(buf) !== m.sha256) throw new Error(`${m.name} does not match the hash in the signed manifest. Not saved.`);
        fs.writeFileSync(path.join(config.modelsDir, m.name), buf);
        out(`Saved ${m.name} (${buf.length} bytes, hash verified).`);
      }
    } else if (cmd === 'backup') {
      try { out('Saved ' + db.backup('manual')); }
      catch (e) { if (!e.external) throw e; out(e.message); }
    } else if (cmd === 'db-check') {
      dbCheck(db);
    } else if (cmd === 'import-sqlite') {
      importSqlite(db, arg('from') || path.join(config.dataDir, 'examflow.db'));
    } else if (cmd === 'status') {
      const lic = new Licence({ db, config, pkg }); const st = lic.state();
      out(`Institution: ${pkg.manifest.institution.name} (${pkg.manifest.institution.id})\nPackage: ${pkg.manifest.packageId} v${pkg.manifest.packageVersion}\nTeacher list version: ${db.getMeta('allowlist_version')}\nRegistered: ${lic.registered() ? 'yes, ' + lic.serverId() : 'no'}\nLicence (last known): ${st.status}\nData folder: ${config.dataDir}\nDatabase: ${db.describe()}`);
    } else {
      out(require('node:fs').readFileSync(__filename, 'utf8').split('*/')[0].replace(/^'use strict';\n\/\*/, ''));
      process.exitCode = cmd ? 1 : 0;
    }
  } finally { db.close(); }
}
/** Proves the database can do everything ExamFlow needs. Leaves one audit line behind ("db.check"). */
function dbCheck(db) {
  const t0 = Date.now(); let fail = 0;
  const step = (name, fn) => { try { const r = fn(); out('PASS  ' + name + (r ? ' — ' + r : '')); } catch (e) { fail++; out('FAIL  ' + name + ' — ' + e.message); } };
  step('connected', () => `${db.describe()}; server ${db.serverVersion()}`);
  step('tables', () => `schema version ${db.getMeta('schema_version')}`);
  const id = 'check-' + Date.now().toString(36), col = '__dbcheck';
  const doc = { examToken: 'T-' + id, teacherUid: 'u-' + id, n: 5, ok: true, text: 'বাংলা ✓ “quotes” \'apostrophe\'' };
  step('write and read a document (with Bangla text)', () => {
    db.putDoc(col, id, doc); const back = db.getDoc(col, id);
    if (JSON.stringify(back) !== JSON.stringify(doc)) throw new Error('what came back was different'); });
  step('update keeps one copy', () => { db.putDoc(col, id, { ...doc, n: 6 }); const r = db.query(col, [['examToken', '==', doc.examToken]]); if (r.length !== 1 || r[0].data.n !== 6) throw new Error(r.length + ' copies'); });
  step('search by exam, number and true/false', () => {
    const a = db.query(col, [['examToken', '==', doc.examToken]]).length, b = db.query(col, [['n', '==', 6], ['ok', '==', true]]).length,
      c = db.query(col, [['ok', '==', false]]).length, d = db.query(col, [['missing', '==', null]]).length, e = db.query(col, [['examToken', '==', doc.examToken.toLowerCase()]]).length;
    if (a !== 1 || b !== 1 || c !== 0 || d !== 1) throw new Error(`found ${a}/${b}/${c}/${d}, expected 1/1/0/1`);
    if (e !== 0) throw new Error('searches ignore upper/lower case; ExamFlow needs exact matching');
  });
  step('undo (transaction rollback)', () => {
    if (!db.transactions() && db.kind === 'mongodb') throw new Error('not available: this MongoDB is not a replica set. Turn it into a one-member replica set (DATABASES.md) — Atlas already is.');
    if (!db.transactions()) return `not available on ${db.label}: a group of changes is not undone together (ExamFlow still works; DATABASES.md explains)`;
    try { db.tx(() => { db.putDoc(col, id + '-tx', { x: 1 }); throw new Error('__undo__'); }); } catch (e) { if (e.message !== '__undo__') throw e; }
    if (db.getDoc(col, id + '-tx')) throw new Error('the change was not undone');
  });
  step('delete', () => { if (!db.deleteDoc(col, id)) throw new Error('nothing deleted'); if (db.getDoc(col, id)) throw new Error('still there'); });
  step('audit log is append-only', () => {
    db.audit('it-admin', 'db.check', db.kind, 'ok');
    const p = db.auditIsProtected();
    if (db.kind === 'mongodb' && !p.update) return 'by ExamFlow only. To make MongoDB itself refuse changes, give ExamFlow the role from install/database-scripts/mongodb.js';
    if (['cassandra', 'dynamodb', 'firestore'].includes(db.kind) && !p.update) return `by ExamFlow only (${db.label} cannot refuse it for ExamFlow's own account)`;
    if (!p.update) throw new Error('an audit line could be changed — the protection triggers are missing' + (db.auditTriggers ? '' : ' (DB_AUDIT_TRIGGERS=0)'));
    if (!p.delete) throw new Error('an audit line could be deleted — the protection triggers are missing');
    return 'enforced by the database';
  });
  step('speed', () => { const s = Date.now(); for (let i = 0; i < 20; i++) db.getMeta('schema_version'); const ms = (Date.now() - s) / 20; if (ms > 20) throw new Error(ms.toFixed(1) + ' ms per request; put the database closer to this server (same network)'); return ms.toFixed(2) + ' ms per request'; });
  for (const w of db.warnings) out('WARN  ' + w);
  out(fail ? `\n${fail} check(s) failed.` : `\nThe database is ready for ExamFlow (${Date.now() - t0} ms).`);
  if (fail) process.exitCode = 1;
}

/** Copies a SQLite ExamFlow database (e.g. from a trial install) into the external database. */
function importSqlite(db, file) {
  if (db.kind === 'sqlite') throw new Error('import-sqlite copies INTO an external database. Set DB_TYPE (postgres, mysql or mssql) and its connection settings in .env first.');
  const fs = require('node:fs');
  if (!fs.existsSync(file)) throw new Error('No SQLite database at ' + file + '. Use --from /path/to/examflow.db');
  const { DatabaseSync } = require('node:sqlite');
  const src = new DatabaseSync(file, { readOnly: true });
  try {
    const sv = (src.prepare("SELECT v FROM meta WHERE k='schema_version'").get() || {}).v;
    if (Number(sv) !== Number(db.getMeta('schema_version'))) throw new Error(`The SQLite file has schema ${sv} but this server uses ${db.getMeta('schema_version')}. Start this server version once on the SQLite file first (it upgrades it), then import.`);
    const srcInst = (src.prepare("SELECT v FROM meta WHERE k='institution_id'").get() || {}).v, dstInst = db.getMeta('institution_id');
    if (srcInst && dstInst && srcInst !== dstInst) throw new Error(`The SQLite file belongs to institution ${srcInst}, this database to ${dstInst}. Refusing to mix them.`);
    const busy = ['docs', 'users', 'audit'].map(t => [t, db.countRows(t)]).filter(([t, n]) => n > 0 && !(t === 'audit' && n <= 3));
    if (busy.length) throw new Error('The external database already has ExamFlow data (' + busy.map(([t, n]) => `${t}: ${n}`).join(', ') + '). Import only into a new, empty database.');
    const TABLES = { docs: ['col', 'id', 'data', 'created', 'updated'], users: ['uid', 'email', 'name', 'pass_hash', 'source', 'oidc_sub', 'created', 'disabled'],
      codes: ['code_hash', 'email', 'purpose', 'created', 'expires', 'used'], logins: ['token_hash', 'uid', 'created', 'expires'],
      allowlist: ['teacher_id', 'email', 'name', 'version'], allowlist_history: ['t', 'package_id', 'package_version', 'list_version', 'added', 'removed', 'total'],
      audit: ['t', 'actor', 'action', 'target', 'result', 'detail'], inbox: ['msg_id', 'email', 'delivered_at', 'read_at', 'archived_at'] };
    const counts = {};
    db.tx(() => {
      for (const r of src.prepare('SELECT k, v FROM meta').all()) if (r.k !== 'schema_version') db.setMeta(r.k, r.v);
      db.run('allowlist.clear');
      for (const [t, cols] of Object.entries(TABLES)) {
        let n = 0;
        for (const r of src.prepare(`SELECT ${cols.join(', ')} FROM ${t}${['audit', 'allowlist_history'].includes(t) ? ' ORDER BY n' : ''}`).iterate()) {
          const row = {}; for (const c of cols) row[c] = r[c] === undefined ? null : (typeof r[c] === 'bigint' ? Number(r[c]) : r[c]);
          if (t === 'docs' && db.kind === 'mongodb') db.run('docs.put', row.col, row.id, row.data, row.created, row.updated); // keeps the search fields
          else db.insertRow(t, row);
          n++;
        }
        counts[t] = n;
      }
      db.audit('it-admin', 'db.import-sqlite', file, 'ok', counts);
    });
    out('Copied from ' + file + ' into ' + db.describe() + ':');
    for (const [t, n] of Object.entries(counts)) out(`  ${t.padEnd(18)} ${n}`);
    out('Keep the SQLite file as a backup until you have checked ExamFlow on the new database.');
  } finally { src.close(); }
}

main().catch(e => { console.error('Error: ' + e.message); process.exit(e.exitCode || 1); });
