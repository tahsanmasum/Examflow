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
     node server/src/cli.js backup           save a copy of the database to DATA_DIR/backups
     node server/src/cli.js status           short summary
   With Docker:  docker compose exec examflow node server/src/cli.js <command> */
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
  loadDotEnv(path.resolve(process.cwd(), '.env'));
  const cmd = process.argv[2];
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
      try { const p = boot(); out(`PASS  database at ${p.config.dataDir} (schema ${p.db.getMeta('schema_version')}), teacher list version ${p.db.getMeta('allowlist_version')}`); p.db.close(); }
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
      let rows = one ? db.db.prepare('SELECT * FROM allowlist WHERE email = ?').all(normEmail(one))
        : db.db.prepare('SELECT a.* FROM allowlist a LEFT JOIN users u ON u.email = a.email WHERE u.uid IS NULL ORDER BY a.teacher_id').all();
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
      for (const r of db.db.prepare('SELECT a.teacher_id, a.email, u.uid FROM allowlist a LEFT JOIN users u ON u.email = a.email ORDER BY a.teacher_id').all()) out(`${r.teacher_id},${r.email},${r.uid ? 'yes' : 'no'}`);
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
      out('Saved ' + db.backup('manual'));
    } else if (cmd === 'status') {
      const lic = new Licence({ db, config, pkg }); const st = lic.state();
      out(`Institution: ${pkg.manifest.institution.name} (${pkg.manifest.institution.id})\nPackage: ${pkg.manifest.packageId} v${pkg.manifest.packageVersion}\nTeacher list version: ${db.getMeta('allowlist_version')}\nRegistered: ${lic.registered() ? 'yes, ' + lic.serverId() : 'no'}\nLicence (last known): ${st.status}\nData folder: ${config.dataDir}`);
    } else {
      out(require('node:fs').readFileSync(__filename, 'utf8').split('*/')[0].replace(/^'use strict';\n\/\*/, ''));
      process.exitCode = cmd ? 1 : 0;
    }
  } finally { db.close(); }
}
main().catch(e => { console.error('Error: ' + e.message); process.exit(e.exitCode || 1); });
