'use strict';
/* Builds an institution package: the real institution server, the institution
   build of the ExamFlow app, deployment files, documentation, the teacher
   allowlist, and a manifest signed with GHUM's Ed25519 key.

   No secrets go into a package: no Firebase keys, no service accounts, no
   database passwords and never GHUM's private signing key. The institution
   chooses its own settings in .env from .env.example. */
const fs = require('node:fs');
const path = require('node:path');
const { canonical, sha256, signEd25519, keyFingerprint } = require('./util');
const { makeZip } = require('./zip');

const SOFTWARE_ROOT = path.join(__dirname, '..', '_institution');
const SKIP = /(^|\/)(node_modules|data|tests?|\.git)(\/|$)|\.DS_Store$|(^|\/)\.env$/;

/** The deployable software, as [{ path, data }], sorted. */
function softwareFiles(root = SOFTWARE_ROOT) {
  const out = [];
  (function walk(dir, rel) {
    for (const e of fs.readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
      const r = rel ? rel + '/' + e.name : e.name;
      if (SKIP.test(r)) continue;
      if (e.isDirectory()) walk(path.join(dir, e.name), r);
      else if (e.isFile()) out.push({ path: r, data: fs.readFileSync(path.join(dir, e.name)) });
    }
  })(root, '');
  if (!out.some(f => f.path === 'server/package.json') || !out.some(f => f.path === 'public/index.html')) {
    throw new Error('The institution software is missing from this deployment (api/_institution). Redeploy with the full v46 files.');
  }
  return out;
}
function softwareInfo(files) {
  const pj = JSON.parse(files.find(f => f.path === 'server/package.json').data.toString());
  const html = files.find(f => f.path === 'public/index.html').data.toString('utf8');
  const fv = (/<meta name="examflow-version" content="([^"]+)"/.exec(html) || [])[1] || 'unknown';
  const hash = sha256(files.map(f => f.path + ':' + sha256(f.data)).join('\n'));
  return { serverVersion: pj.version, frontendVersion: fv, softwareHash: hash };
}
const slug = s => String(s || 'institution').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40) || 'institution';

/**
 * Make the package. Returns { manifest, manifestBytes, sig, files, zip, folder }.
 * inst: institution record; allow: { version, teachers }; meta: { packageId, packageVersion, generatedAt, generatedBy, previous }
 */
function buildPackage({ inst, allow, meta, signingKeyPem, publicKeyPem, controlPlaneUrl, models, software }) {
  const sw = software || softwareFiles();
  const info = softwareInfo(sw);
  const allowlist = { institutionId: inst.id, institutionName: inst.name, version: allow.version,
    teachers: allow.teachers.map(t => ({ teacherId: t.teacherId, email: t.email, ...(t.name ? { name: t.name } : {}) })) };
  const allowBytes = Buffer.from(JSON.stringify(allowlist, null, 2) + '\n');
  const fp = keyFingerprint(publicKeyPem);
  const info2 = packageInfoText({ inst, allow, meta, info, fp, controlPlaneUrl });
  const files = [
    ...sw,
    { path: 'allowlist.json', data: allowBytes },
    { path: 'ghum-public-key.pem', data: Buffer.from(publicKeyPem) },
    { path: 'PACKAGE-INFO.txt', data: Buffer.from(info2) }
  ].sort((a, b) => a.path.localeCompare(b.path));
  const manifest = {
    format: 'ghum-examflow-institution-package', manifestVersion: 1,
    packageId: meta.packageId, packageVersion: meta.packageVersion,
    institution: { id: inst.id, name: inst.name },
    deploymentType: 'institution-hosted',
    generatedAt: new Date(meta.generatedAt).toISOString(), generatedBy: meta.generatedBy,
    software: { serverVersion: info.serverVersion, frontendVersion: info.frontendVersion, apiVersion: 1, softwareHash: info.softwareHash },
    controlPlaneUrl,
    allowlist: { version: allow.version, count: allowlist.teachers.length, sha256: sha256(allowBytes) },
    licence: { reference: inst.id, verification: 'online, signed by GHUM (Ed25519)', checkIntervalSeconds: 60, offlineGraceDays: 7 },
    models: models || [],
    signingKey: { algorithm: 'Ed25519', fingerprint: fp },
    files: files.map(f => ({ path: f.path, sha256: sha256(f.data), size: f.data.length }))
  };
  const manifestBytes = Buffer.from(JSON.stringify(manifest, null, 2) + '\n');
  const sig = signEd25519(signingKeyPem, manifestBytes);
  const folder = `examflow-${slug(inst.name)}-${meta.packageVersion}`;
  const all = [...files, { path: 'manifest.json', data: manifestBytes }, { path: 'manifest.sig', data: Buffer.from(sig + '\n') }];
  const zip = makeZip(all.map(f => ({ path: folder + '/' + f.path, data: f.data, mode: f.path.endsWith('.sh') ? 0o100755 : 0o100644 })), meta.generatedAt);
  return { manifest, manifestBytes, manifestSha256: sha256(manifestBytes), sig, files: all, zip, folder, softwareHash: info.softwareHash, info };
}

function packageInfoText({ inst, allow, meta, info, fp, controlPlaneUrl }) {
  const p = meta.previous;
  const lines = [
    'EXAMFLOW INSTITUTION PACKAGE',
    '',
    `Institution:        ${inst.name}`,
    `Institution ID:     ${inst.id}   (permanent; never changes)`,
    `Package ID:         ${meta.packageId}`,
    `Package version:    ${meta.packageVersion}`,
    `Generated:          ${new Date(meta.generatedAt).toISOString()} by ${meta.generatedBy}`,
    `Server software:    ${info.serverVersion}`,
    `ExamFlow app:       ${info.frontendVersion}`,
    `Teacher list:       version ${allow.version}, ${allow.teachers.length} approved teacher(s)`,
    `GHUM control plane: ${controlPlaneUrl}`,
    `GHUM signing key:   ${fp}`,
    '                    Compare this with the fingerprint GHUM gave you by another channel.',
    ''
  ];
  if (p) {
    lines.push(`This package replaces ${p.packageId} (version ${p.packageVersion}).`);
    lines.push(p.sameSoftware ? 'The server software is the SAME as in that package; only the teacher list or settings changed.' : `The server software CHANGED (was ${p.serverVersion}). Follow UPGRADE.md.`);
    if (p.added || p.removed) lines.push(`Teacher list changes: ${p.added.length} added, ${p.removed.length} removed.`);
    for (const t of p.added || []) lines.push('  + ' + t);
    for (const t of p.removed || []) lines.push('  - ' + t);
    lines.push('');
  }
  lines.push('Start with INSTALL.md. Check the package before installing:  node server/src/cli.js check', '');
  return lines.join('\n');
}

module.exports = { buildPackage, softwareFiles, softwareInfo, SOFTWARE_ROOT, slug };
