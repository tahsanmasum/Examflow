'use strict';
/* Checks the institution package this server was installed from, and loads its
   teacher allowlist into the institution's own database.

   A package holds manifest.json (what is in it), manifest.sig (GHUM's Ed25519
   signature over manifest.json) and ghum-public-key.pem. Every file listed in
   the manifest must match its SHA-256. A package for another institution, or an
   older teacher list than the one already applied, is refused. */
const fs = require('node:fs');
const path = require('node:path');
const { sha256, verifyEd25519, keyFingerprint, normEmail, EMAIL_RE, TEACHER_ID_RE } = require('./util');

function readPackage(dir) {
  const errors = [];
  const rd = f => { try { return fs.readFileSync(path.join(dir, f)); } catch (e) { errors.push(`${f} is missing from the package folder (${dir}).`); return null; } };
  const manBuf = rd('manifest.json'), sig = rd('manifest.sig'), pub = rd('ghum-public-key.pem');
  if (errors.length) return { ok: false, errors };
  let manifest;
  try { manifest = JSON.parse(manBuf.toString('utf8')); } catch (e) { return { ok: false, errors: ['manifest.json is not valid JSON: ' + e.message] }; }
  if (manifest.format !== 'ghum-examflow-institution-package') errors.push('manifest.json is not an ExamFlow institution package manifest.');
  if (!verifyEd25519(pub.toString('utf8'), manBuf, sig.toString('utf8').trim())) {
    errors.push('The package signature does not match. The manifest was changed after GHUM signed it, or the files come from different packages. Ask GHUM for a fresh package.');
    return { ok: false, errors, manifest };
  }
  const fp = keyFingerprint(pub.toString('utf8'));
  if (manifest.signingKey && manifest.signingKey.fingerprint !== fp) errors.push('The signing key in the package is not the one named in its manifest.');
  for (const f of manifest.files || []) {
    const p = path.join(dir, f.path);
    if (!p.startsWith(path.resolve(dir) + path.sep)) { errors.push('Unsafe file path in manifest: ' + f.path); continue; }
    let buf; try { buf = fs.readFileSync(p); } catch (e) { errors.push(`Listed file is missing: ${f.path}`); continue; }
    if (sha256(buf) !== f.sha256) errors.push(`File was changed or damaged: ${f.path}`);
  }
  let allowlist = null;
  try {
    const raw = fs.readFileSync(path.join(dir, 'allowlist.json'));
    if (manifest.allowlist && sha256(raw) !== manifest.allowlist.sha256) errors.push('allowlist.json does not match the manifest.');
    allowlist = JSON.parse(raw.toString('utf8'));
    const v = validateAllowlist(allowlist, manifest);
    errors.push(...v);
  } catch (e) { errors.push('allowlist.json is missing or not valid JSON.'); }
  return { ok: errors.length === 0, errors, manifest, allowlist, fingerprint: fp, publicKey: pub.toString('utf8') };
}

function validateAllowlist(al, manifest) {
  const errs = [];
  if (!al || al.institutionId !== manifest.institution.id) errs.push('allowlist.json belongs to a different institution than the manifest.');
  if (!al || al.version !== manifest.allowlist.version) errs.push('allowlist.json version does not match the manifest.');
  const ids = new Set(), emails = new Set();
  for (const t of (al && al.teachers) || []) {
    if (!TEACHER_ID_RE.test(String(t.teacherId || ''))) errs.push('Invalid teacher ID in allowlist: ' + t.teacherId);
    const e = normEmail(t.email);
    if (!EMAIL_RE.test(e)) errs.push('Invalid email in allowlist for ' + t.teacherId);
    if (ids.has(t.teacherId)) errs.push('Duplicate teacher ID in allowlist: ' + t.teacherId);
    if (emails.has(e)) errs.push('Duplicate email in allowlist: ' + e);
    ids.add(t.teacherId); emails.add(e);
  }
  return errs;
}

/**
 * Apply a verified package to the database. Returns { applied, institutionId, added, removed, total, note }.
 * Throws with a clear message when it must refuse.
 */
function applyPackage(db, pkg, opts = {}) {
  const { manifest, allowlist } = pkg;
  const instId = manifest.institution.id;
  const haveInst = db.getMeta('institution_id');
  if (haveInst && haveInst !== instId) {
    throw new Error(`This data folder belongs to institution ${haveInst}, but the package is for ${instId}. Refusing, so one institution's data can never be mixed with another's. Use the right package or a separate DATA_DIR.`);
  }
  const curVer = Number(db.getMeta('allowlist_version') || 0);
  const newVer = Number(manifest.allowlist.version);
  const sameSoftware = db.getMeta('package_id') === manifest.packageId;
  if (newVer < curVer && !opts.allowDowngrade) {
    throw new Error(`The package's teacher list (version ${newVer}) is older than the one already applied (version ${curVer}). Refusing to go back. Set ALLOW_PACKAGE_DOWNGRADE=1 only if GHUM asked you to.`);
  }
  return db.tx(() => {
    if (!haveInst) { db.setMeta('institution_id', instId); db.setMeta('institution_name', manifest.institution.name); db.setMeta('installed_at', Date.now()); }
    db.setMeta('package_id', manifest.packageId); db.setMeta('package_version', manifest.packageVersion);
    db.setMeta('institution_name', manifest.institution.name);
    if (newVer === curVer) return { applied: false, institutionId: instId, note: sameSoftware ? 'Package already applied.' : 'Same teacher list; package details updated.' };
    const before = new Map(db.all('allowlist.pairs').map(r => [r.teacher_id, r.email]));
    db.run('allowlist.clear');
    const ins = { run: (...a) => db.run('allowlist.insert', ...a) };
    let added = 0;
    const now = new Set();
    for (const t of allowlist.teachers) {
      ins.run(t.teacherId, normEmail(t.email), t.name || null, newVer); now.add(t.teacherId);
      if (!before.has(t.teacherId)) added++;
    }
    let removed = 0; for (const k of before.keys()) if (!now.has(k)) removed++;
    db.setMeta('allowlist_version', newVer);
    db.run('allowHistory.insert', Date.now(), manifest.packageId, manifest.packageVersion, newVer, added, removed, now.size);
    db.audit('installer', 'allowlist.apply', manifest.packageId, 'ok', { listVersion: newVer, added, removed, total: now.size });
    return { applied: true, institutionId: instId, added, removed, total: now.size };
  });
}

module.exports = { readPackage, applyPackage, validateAllowlist };
