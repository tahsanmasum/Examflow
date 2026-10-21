'use strict';
/* GHUM control plane: institution registry, teacher allowlists, institution
   packages, licences, server registration and the audit log.

   Runs only on the trusted side (Vercel serverless functions). The browser
   never writes these records itself: Firestore rules deny all client access to
   the cp* collections, and every change goes through here, checked against the
   signed-in admin's verified Firebase ID token.

   Stored centrally (and only this): institution names and contacts, teacher
   IDs and emails on each allowlist, package records, licence terms and their
   history, registered servers' public keys and their technical check-ins
   (software version, package, teacher-list version, database health). No
   exams, questions, attempts, answers or results from institution servers. */
const crypto = require('node:crypto');
const { canonical, sha256, verifyEd25519, keyFingerprint, randomId, humanCode, hashCode, normCode, normEmail, EMAIL_RE, TEACHER_ID_RE } = require('./util');
const { computeTerm, licenceStatus, dhakaDateToMs, dhakaToday, msToDhakaDate, DURATIONS, WARN_DAYS_DEFAULT, DAY } = require('./licence-core');
const { buildPackage, softwareFiles, softwareInfo } = require('./builder');

const C = { inst: 'cpInstitutions', allow: 'cpAllowlists', pkg: 'cpPackages', lic: 'cpLicenceEvents', reg: 'cpRegCodes', srv: 'cpServers', audit: 'cpAudit', ops: 'cpOps' };
const MAX_TEACHERS = 3000; // keeps each package record well under Firestore's 1 MB document limit

class CPError extends Error { constructor(msg, status = 400, code) { super(msg); this.status = status; this.code = code || 'bad_request'; } }
const bad = (m, s, c) => { throw new CPError(m, s, c); };
const str = (v, max, name, required) => {
  if (v === undefined || v === null || v === '') { if (required) bad(name + ' is required.'); return ''; }
  if (typeof v !== 'string') bad(name + ' must be text.');
  v = v.trim(); if (required && !v) bad(name + ' is required.');
  if (v.length > max) bad(`${name} is too long (max ${max} characters).`);
  return v;
};

/* ── CSV / teacher list validation ── */
function parseCsv(text) {
  const rows = []; let row = [], f = '', q = false;
  text = String(text || '').replace(/^﻿/, '');
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (q) { if (ch === '"') { if (text[i + 1] === '"') { f += '"'; i++; } else q = false; } else f += ch; }
    else if (ch === '"') q = true;
    else if (ch === ',') { row.push(f); f = ''; }
    else if (ch === '\n' || ch === '\r') { if (ch === '\r' && text[i + 1] === '\n') i++; row.push(f); rows.push(row); row = []; f = ''; }
    else f += ch;
  }
  if (f !== '' || row.length) { row.push(f); rows.push(row); }
  return rows.filter(r => r.some(c => String(c).trim() !== ''));
}
/**
 * Check a teacher list. input: { csv } or { teachers: [{teacherId,email,name}] }.
 * Returns { valid: [...], invalid: [{ row, teacherId, email, problems }], total }.
 */
function validateTeachers(input) {
  let entries = [];
  if (typeof input.csv === 'string') {
    if (input.csv.length > 2_000_000) bad('That file is too large (max 2 MB).');
    const rows = parseCsv(input.csv);
    if (!rows.length) bad('The file is empty.');
    const head = rows[0].map(h => String(h).trim().toLowerCase().replace(/\s+/g, '_'));
    const ti = head.indexOf('teacher_id'), ei = head.indexOf('email'), ni = head.indexOf('name');
    if (ti < 0 || ei < 0) bad('The first row must be a header with at least these columns: teacher_id,email (name is optional). See the template.');
    entries = rows.slice(1).map((r, i) => ({ row: i + 2, teacherId: String(r[ti] || '').trim(), email: String(r[ei] || '').trim(), name: ni >= 0 ? String(r[ni] || '').trim() : '' }));
  } else if (Array.isArray(input.teachers)) {
    entries = input.teachers.map((t, i) => ({ row: i + 1, teacherId: String((t && t.teacherId) || '').trim(), email: String((t && t.email) || '').trim(), name: String((t && t.name) || '').trim() }));
  } else bad('Send a CSV file or a list of teachers.');
  if (entries.length > MAX_TEACHERS) bad(`At most ${MAX_TEACHERS} teachers per institution.`);
  const valid = [], invalid = []; const seenId = new Map(), seenEmail = new Map();
  for (const e of entries) {
    const p = [];
    if (!e.teacherId) p.push('teacher ID is missing');
    else if (!TEACHER_ID_RE.test(e.teacherId)) p.push('teacher ID may use letters, digits, . _ - / and at most 64 characters');
    const em = normEmail(e.email);
    if (!em) p.push('email is missing');
    else if (!EMAIL_RE.test(em) || em.length > 254) p.push('email is not valid');
    if (e.name.length > 120) p.push('name is longer than 120 characters');
    if (e.teacherId && seenId.has(e.teacherId.toUpperCase())) p.push('duplicate teacher ID (also on row ' + seenId.get(e.teacherId.toUpperCase()) + ')');
    if (em && seenEmail.has(em)) p.push('duplicate email (also on row ' + seenEmail.get(em) + ')');
    if (e.teacherId) seenId.set(e.teacherId.toUpperCase(), seenId.get(e.teacherId.toUpperCase()) || e.row);
    if (em) seenEmail.set(em, seenEmail.get(em) || e.row);
    if (p.length) invalid.push({ row: e.row, teacherId: e.teacherId, email: e.email, name: e.name, problems: p });
    else valid.push({ teacherId: e.teacherId, email: em, ...(e.name ? { name: e.name } : {}) });
  }
  return { valid, invalid, total: entries.length };
}

function nextVersion(seq) { return `1.${seq}.0`; }
/** Grace days (0–30) and the warning threshold (1–120 days) given with a licence change, else the current ones, else the defaults. */
function policy(b, cur) {
  const g = b.graceDays !== undefined ? Number(b.graceDays) : (cur && Number.isFinite(cur.graceDays) ? cur.graceDays : Number(b._defaultGraceDays) || 0);
  const w = b.warnDays !== undefined ? Number(b.warnDays) : (cur && Number.isFinite(cur.warnDays) ? cur.warnDays : Number(b._defaultWarnDays) || WARN_DAYS_DEFAULT);
  if (!Number.isInteger(g) || g < 0 || g > 30) bad('Grace period must be a whole number of days from 0 to 30.');
  if (!Number.isInteger(w) || w < 1 || w > 120) bad('The warning threshold must be a whole number of days from 1 to 120.');
  return { graceDays: g, warnDays: w };
}

class ControlPlane {
  /**
   * store: storage adapter (Firestore in production); keys: { privatePem, publicPem };
   * env: { adminEmails, publicBaseUrl, models }; now(): trusted server time.
   */
  constructor({ store, keys, env, now, software, wallClock }) {
    this.store = store; this.keys = keys; this.env = env; this.now = now || (() => Date.now()); this.software = software;
    this.wallClock = wallClock || this.now; // what servers' clocks are compared with (tests move `now` alone)
    this.fingerprint = keys && keys.publicPem ? keyFingerprint(keys.publicPem) : null;
  }
  sw() { return this.software || softwareFiles(); }

  async audit(actor, action, target, result, detail) {
    if (this.auditHook) return this.auditHook(actor, action, target, result, detail);
    await this.store.add(C.audit, { t: this.now(), actor: (actor && actor.email) || actor || null, action, institutionId: target && target.inst || null,
      target: target && target.id || null, result, detail: detail || null });
  }
  /** Same opId → same answer, so a retried request after a timeout never runs twice. */
  async once(opId, action, fn) {
    if (!opId) return fn();
    if (!/^[A-Za-z0-9_-]{8,64}$/.test(opId)) bad('Invalid operation id.');
    const prev = await this.store.get(C.ops, opId);
    if (prev) { if (prev.action !== action) bad('Operation id reused for a different action.', 409, 'op_conflict'); return { ...prev.result, repeated: true }; }
    const result = await fn();
    await this.store.set(C.ops, opId, { action, at: this.now(), result });
    return result;
  }

  view(inst, now = this.now()) {
    const lic = inst.licence || null;
    const st = licenceStatus(lic, now, (lic && lic.warnDays) || WARN_DAYS_DEFAULT);
    return { ...inst, licenceState: { ...st, activatesAt: lic ? lic.activatesAt : null, expiresAt: lic ? lic.expiresAt : null,
      activationDate: lic && Number.isFinite(lic.activatesAt) ? msToDhakaDate(lic.activatesAt) : null,
      expiryDate: lic && Number.isFinite(lic.expiresAt) ? msToDhakaDate(lic.expiresAt) : null,
      suspended: !!(lic && (lic.suspended || lic.blocked)), blocked: !!(lic && (lic.suspended || lic.blocked)), suspendedReason: lic && (lic.suspendedReason || lic.blockedReason) || null,
      blockedReason: lic && (lic.suspendedReason || lic.blockedReason) || null, revoked: lic && lic.revoked || null,
      graceDays: lic && lic.graceDays || 0, warnDays: lic && Number.isFinite(lic.warnDays) ? lic.warnDays : WARN_DAYS_DEFAULT,
      durationLabel: lic && lic.durationLabel || null } };
  }
  async instOr404(id) { const i = await this.store.get(C.inst, String(id || '')); if (!i) bad('Institution not found.', 404, 'not_found'); return i; }

  /* ───────────── admin actions ───────────── */
  async act(admin, body) {
    const a = String(body.action || '');
    const fn = this['a_' + a.replace(/\./g, '_')];
    if (!fn) bad('Unknown action: ' + a, 404, 'unknown_action');
    return fn.call(this, admin, body);
  }

  async a_whoami(admin) { return { email: admin.email, signingKey: this.fingerprint, serverTime: this.now(), configured: !!this.keys.privatePem }; }

  async a_overview() {
    const now = this.now();
    const insts = (await this.store.all(C.inst)).map(i => this.view(i, now));
    const pkgs = await this.store.all(C.pkg);
    const byInst = {}; for (const p of pkgs) (byInst[p.institutionId] = byInst[p.institutionId] || []).push(p);
    const rows = insts.map(i => {
      const list = (byInst[i.id] || []).sort((a, b) => b.seq - a.seq);
      const latest = list[0] || null;
      return { id: i.id, name: i.name, deploymentType: i.deploymentType, createdAt: i.createdAt, updatedAt: i.updatedAt,
        teacherCount: i.allowlistCount || 0, allowlistVersion: i.allowlistVersion || 0,
        packageDraft: (i.allowlistVersion || 0) > (latest ? latest.allowlistVersion : 0),
        latest: latest ? { id: latest.id, version: latest.version, adminStatus: latest.adminStatus, tech: latest.tech, createdAt: latest.createdAt, allowlistVersion: latest.allowlistVersion } : null,
        licenceState: i.licenceState, server: i.server || null };
    });
    let sw = null; try { sw = softwareInfo(this.sw()); } catch (e) { sw = { error: e.message }; }
    return { institutions: rows, serverTime: now, signingKey: this.fingerprint, software: sw, warnDays: WARN_DAYS_DEFAULT, durations: DURATIONS };
  }

  async a_inst_create(admin, b) {
    const name = str(b.name, 160, 'Institution name', true);
    const all = await this.store.all(C.inst);
    if (all.some(i => i.name.toLowerCase() === name.toLowerCase())) bad('An institution with this name already exists. Open it instead of creating a second one.', 409, 'duplicate');
    const id = 'inst_' + randomId('', 12);
    const now = this.now();
    const inst = { id, name, deploymentType: 'institution-hosted',
      contact: { name: str(b.contactName, 120, 'Contact name'), email: normEmail(str(b.contactEmail, 254, 'Contact email')), phone: str(b.contactPhone, 40, 'Contact phone') },
      technicalContact: { name: str(b.techName, 120, 'Technical contact name'), email: normEmail(str(b.techEmail, 254, 'Technical contact email')) },
      notes: str(b.notes, 2000, 'Notes'), createdAt: now, createdBy: admin.email, updatedAt: now,
      allowlistVersion: 0, allowlistCount: 0, packageSeq: 0, licence: null, server: null };
    for (const e of [inst.contact.email, inst.technicalContact.email]) if (e && !EMAIL_RE.test(e)) bad('A contact email is not valid: ' + e);
    await this.store.set(C.inst, id, inst);
    await this.store.set(C.allow, id, { institutionId: id, version: 0, teachers: [], updatedAt: now, imports: [] });
    await this.audit(admin, 'institution.create', { inst: id, id }, 'ok', { name });
    return { institution: this.view(inst) };
  }
  async a_inst_get(admin, b) {
    const inst = await this.instOr404(b.id);
    const allow = await this.store.get(C.allow, inst.id) || { teachers: [], version: 0 };
    const packages = (await this.store.where(C.pkg, 'institutionId', inst.id)).sort((a, b) => b.seq - a.seq)
      .map(p => { const { manifest, ...rest } = p; return rest; });
    const licenceHistory = (await this.store.where(C.lic, 'institutionId', inst.id)).sort((a, b) => b.t - a.t);
    const audit = (await this.store.where(C.audit, 'institutionId', inst.id)).sort((a, b) => b.t - a.t).slice(0, 200);
    const codes = (await this.store.where(C.reg, 'institutionId', inst.id)).map(c => ({ createdAt: c.createdAt, expiresAt: c.expiresAt, used: c.used || null, createdBy: c.createdBy }));
    return { institution: this.view(inst), allowlist: allow, packages, licenceHistory, audit, registrationCodes: codes, serverTime: this.now() };
  }
  async a_inst_update(admin, b) {
    const inst = await this.instOr404(b.id);
    const before = { name: inst.name, contact: inst.contact, technicalContact: inst.technicalContact, notes: inst.notes };
    const patch = {};
    if (b.name !== undefined) patch.name = str(b.name, 160, 'Institution name', true);
    if (b.contactName !== undefined || b.contactEmail !== undefined || b.contactPhone !== undefined)
      patch.contact = { name: str(b.contactName, 120, 'Contact name'), email: normEmail(str(b.contactEmail, 254, 'Contact email')), phone: str(b.contactPhone, 40, 'Contact phone') };
    if (b.techName !== undefined || b.techEmail !== undefined) patch.technicalContact = { name: str(b.techName, 120, 'Technical contact name'), email: normEmail(str(b.techEmail, 254, 'Technical contact email')) };
    if (b.notes !== undefined) patch.notes = str(b.notes, 2000, 'Notes');
    for (const e of [patch.contact && patch.contact.email, patch.technicalContact && patch.technicalContact.email]) if (e && !EMAIL_RE.test(e)) bad('A contact email is not valid: ' + e);
    const next = { ...inst, ...patch, updatedAt: this.now() };
    await this.store.set(C.inst, inst.id, next);
    await this.audit(admin, 'institution.update', { inst: inst.id, id: inst.id }, 'ok', { before, after: patch });
    return { institution: this.view(next) };
  }

  /* teacher allowlist */
  async a_allowlist_validate(admin, b) {
    const r = validateTeachers(b);
    // Warn (don't block) when an email is approved at another institution too — some teachers teach at two.
    const others = []; const want = new Set(r.valid.map(t => t.email));
    for (const al of await this.store.all(C.allow)) if (al.institutionId !== b.id) for (const t of al.teachers || []) if (want.has(t.email)) others.push({ email: t.email, institutionId: al.institutionId });
    return { ...r, alsoElsewhere: others };
  }
  async a_allowlist_save(admin, b) {
    const inst = await this.instOr404(b.id);
    if (b.confirmInstitution !== inst.id) bad('Confirm which institution this list is for.', 400, 'confirm_institution');
    const r = validateTeachers({ teachers: b.teachers });
    if (r.invalid.length) bad(`${r.invalid.length} entr${r.invalid.length === 1 ? 'y has' : 'ies have'} problems. Fix or remove them first.`, 400, 'invalid_entries');
    return this.store.tx(async t => {
      const cur = await t.get(C.allow, inst.id) || { version: 0, teachers: [], imports: [] };
      const instNow = await t.get(C.inst, inst.id);
      if (Number(b.baseVersion) !== cur.version) bad(`The teacher list changed since you opened it (now version ${cur.version}). Reload and check again.`, 409, 'stale');
      const oldIds = new Set(cur.teachers.map(x => x.teacherId)), newIds = new Set(r.valid.map(x => x.teacherId));
      const added = r.valid.filter(x => !oldIds.has(x.teacherId)).map(x => x.teacherId);
      const removed = cur.teachers.filter(x => !newIds.has(x.teacherId)).map(x => x.teacherId);
      const changedEmail = r.valid.filter(x => oldIds.has(x.teacherId) && cur.teachers.find(y => y.teacherId === x.teacherId).email !== x.email).map(x => x.teacherId);
      if (!added.length && !removed.length && !changedEmail.length) return { allowlist: cur, unchanged: true };
      const now = this.now();
      const src = { t: now, by: admin.email, kind: b.source === 'csv' ? 'csv' : 'manual', file: str(b.filename, 200, 'File name') || null, total: r.valid.length, added: added.length, removed: removed.length };
      const next = { institutionId: inst.id, version: cur.version + 1, teachers: r.valid, updatedAt: now, updatedBy: admin.email, imports: [src, ...(cur.imports || [])].slice(0, 30) };
      t.set(C.allow, inst.id, next);
      t.set(C.inst, inst.id, { ...instNow, allowlistVersion: next.version, allowlistCount: r.valid.length, updatedAt: now });
      return { allowlist: next, added, removed, changedEmail };
    }).then(async res => {
      if (!res.unchanged) await this.audit(admin, 'allowlist.save', { inst: inst.id, id: inst.id }, 'ok', { version: res.allowlist.version, added: res.added, removed: res.removed, changedEmail: res.changedEmail, source: b.source || 'manual' });
      return res;
    });
  }

  /* packages */
  async a_package_preview(admin, b) {
    const inst = await this.instOr404(b.id);
    const allow = await this.store.get(C.allow, inst.id);
    const pkgs = (await this.store.where(C.pkg, 'institutionId', inst.id)).sort((a, b) => b.seq - a.seq);
    const prev = pkgs.find(p => p.adminStatus !== 'Revoked') || null;
    const prevIds = new Set(prev ? (prev.teacherIds || []) : []);
    const curIds = new Set(allow.teachers.map(t => t.teacherId));
    const info = softwareInfo(this.sw());
    return { institution: this.view(inst), nextVersion: nextVersion((inst.packageSeq || 0)), teacherCount: allow.teachers.length, allowlistVersion: allow.version,
      added: [...curIds].filter(x => !prevIds.has(x)), removed: [...prevIds].filter(x => !curIds.has(x)),
      previous: prev ? { id: prev.id, version: prev.version, serverVersion: prev.serverVersion, adminStatus: prev.adminStatus } : null,
      software: info, sameSoftware: prev ? prev.softwareHash === info.softwareHash : null,
      warnings: [
        ...(allow.teachers.length ? [] : ['The teacher list is empty. Add at least one teacher first.']),
        ...(inst.licence ? [] : ['No licence is set yet. The package can be installed, but teachers can\'t create exams until you set one.']),
        ...(prev && prev.allowlistVersion === allow.version && prev.softwareHash === info.softwareHash ? ['Nothing changed since the last package. Generating again only makes a new version number.'] : [])
      ] };
  }
  async a_package_generate(admin, b) {
    if (b.confirm !== true) bad('Confirm before generating a package.', 400, 'confirm');
    if (!this.keys.privatePem) bad('Package signing is not set up: GHUM_SIGNING_PRIVATE_KEY is missing on the server. See the v46 README.', 503, 'no_signing_key');
    if (!this.env.publicBaseUrl) bad('PUBLIC_BASE_URL is not set on Vercel, so a package would not know where to check in. Set it and redeploy.', 503, 'no_base_url');
    return this.once(b.opId, 'package.generate:' + b.id, async () => {
      const inst = await this.instOr404(b.id);
      const allow = await this.store.get(C.allow, inst.id);
      if (!allow || !allow.teachers.length) bad('Add at least one approved teacher before generating a package.', 400, 'empty_list');
      if (Number(b.allowlistVersion) !== allow.version) bad('The teacher list changed after you reviewed it. Review again.', 409, 'stale');
      const now = this.now();
      const all = (await this.store.where(C.pkg, 'institutionId', inst.id)).sort((x, y) => y.seq - x.seq);
      const prev = all.find(p => p.adminStatus !== 'Revoked') || null;
      const seq = (inst.packageSeq || 0) + 1, version = nextVersion(seq - 1);
      const packageId = 'pkg_' + randomId('', 12);
      const sw = this.sw(); const info = softwareInfo(sw);
      const prevIds = new Set(prev ? prev.teacherIds || [] : []), curIds = allow.teachers.map(t => t.teacherId);
      const built = buildPackage({ inst, allow, software: sw, signingKeyPem: this.keys.privatePem, publicKeyPem: this.keys.publicPem,
        controlPlaneUrl: this.env.publicBaseUrl, models: this.env.models || [],
        meta: { packageId, packageVersion: version, generatedAt: now, generatedBy: admin.email,
          previous: prev ? { packageId: prev.id, packageVersion: prev.version, serverVersion: prev.serverVersion, sameSoftware: prev.softwareHash === info.softwareHash,
            added: curIds.filter(x => !prevIds.has(x)), removed: [...prevIds].filter(x => !curIds.includes(x)) } : null } });
      const rec = { id: packageId, institutionId: inst.id, seq, version, createdAt: now, createdBy: admin.email,
        allowlistVersion: allow.version, teacherCount: allow.teachers.length, teacherIds: curIds, allowlistSnapshot: allow.teachers,
        serverVersion: info.serverVersion, frontendVersion: info.frontendVersion, softwareHash: info.softwareHash,
        manifest: built.manifest, manifestSha256: built.manifestSha256, sig: built.sig, zipSha256: sha256(built.zip), zipBytes: built.zip.length,
        controlPlaneUrl: this.env.publicBaseUrl, models: this.env.models || [],
        adminStatus: 'Generated', tech: { status: 'Not installed' }, delivery: [], downloads: [], supersedes: prev ? prev.id : null };
      await this.store.tx(async t => {
        const cur = await t.get(C.inst, inst.id);
        if ((cur.packageSeq || 0) !== seq - 1) bad('Another package was generated at the same time. Reload and try again.', 409, 'stale');
        t.set(C.pkg, packageId, rec);
        for (const p of all) if (p.adminStatus === 'Generated' || p.adminStatus === 'Delivered') t.set(C.pkg, p.id, { ...p, adminStatus: 'Superseded', supersededBy: packageId, supersededAt: now });
        t.set(C.inst, inst.id, { ...cur, packageSeq: seq, latestPackageId: packageId, latestPackageVersion: version, updatedAt: now });
      });
      await this.audit(admin, 'package.generate', { inst: inst.id, id: packageId }, 'ok', { version, allowlistVersion: allow.version, teachers: curIds.length, serverVersion: info.serverVersion, manifestSha256: built.manifestSha256 });
      const { manifest, allowlistSnapshot, ...summary } = rec;
      return { package: summary };
    });
  }
  /** Rebuilds the exact package bytes from its record. Refuses if this deployment's software differs. */
  async a_package_download(admin, b) {
    const p = await this.store.get(C.pkg, String(b.packageId || ''));
    if (!p) bad('Package not found.', 404, 'not_found');
    if (p.adminStatus === 'Revoked') bad('This package was revoked and can\'t be downloaded. Generate a new one.', 409, 'revoked');
    const inst = await this.instOr404(p.institutionId);
    const sw = this.sw(); const info = softwareInfo(sw);
    if (info.softwareHash !== p.softwareHash) bad(`This package was built with server software ${p.serverVersion}, which is no longer the software deployed here. Generate a new package version.`, 409, 'software_changed');
    // Rebuilt from the record; its manifest must be byte-identical to the one signed at generation.
    const rebuilt = await this.rebuildExact(p, inst, sw);
    p.downloads = [{ t: this.now(), by: admin.email }, ...(p.downloads || [])].slice(0, 50);
    await this.store.set(C.pkg, p.id, p);
    await this.audit(admin, 'package.download', { inst: inst.id, id: p.id }, 'ok', { version: p.version });
    return { zip: rebuilt.zip, filename: rebuilt.folder + '.zip', sha256: sha256(rebuilt.zip) };
  }
  async rebuildExact(p, inst, sw) {
    const prev = p.supersedes ? await this.store.get(C.pkg, p.supersedes) : null;
    const curIds = p.teacherIds, prevIds = new Set(prev ? prev.teacherIds || [] : []);
    const built = buildPackage({ inst: { id: inst.id, name: p.manifest.institution.name }, allow: { version: p.allowlistVersion, teachers: p.allowlistSnapshot }, software: sw,
      signingKeyPem: this.keys.privatePem, publicKeyPem: this.keys.publicPem, controlPlaneUrl: p.controlPlaneUrl, models: p.models,
      meta: { packageId: p.id, packageVersion: p.version, generatedAt: p.createdAt, generatedBy: p.createdBy,
        previous: prev ? { packageId: prev.id, packageVersion: prev.version, serverVersion: prev.serverVersion, sameSoftware: prev.softwareHash === p.softwareHash,
          added: curIds.filter(x => !prevIds.has(x)), removed: [...prevIds].filter(x => !curIds.includes(x)) } : null } });
    if (built.manifestSha256 !== p.manifestSha256) bad('The rebuilt package does not match the one recorded at generation. Generate a new package version.', 409, 'mismatch');
    return built;
  }
  async a_package_deliver(admin, b) {
    if (b.confirm !== true) bad('Confirm the delivery first.', 400, 'confirm');
    const p = await this.store.get(C.pkg, String(b.packageId || '')); if (!p) bad('Package not found.', 404, 'not_found');
    if (p.adminStatus === 'Revoked' || p.adminStatus === 'Superseded') bad(`A ${p.adminStatus.toLowerCase()} package can't be marked as delivered.`, 409, 'state');
    const ev = { t: this.now(), by: admin.email, note: str(b.note, 500, 'Delivery note') || null };
    p.adminStatus = 'Delivered'; p.delivery = [ev, ...(p.delivery || [])];
    await this.store.set(C.pkg, p.id, p);
    await this.audit(admin, 'package.deliver', { inst: p.institutionId, id: p.id }, 'ok', { note: ev.note });
    const { manifest, allowlistSnapshot, ...s } = p; return { package: s };
  }
  async a_package_revoke(admin, b) {
    if (b.confirm !== true) bad('Confirm the revocation first.', 400, 'confirm');
    const reason = str(b.reason, 500, 'Reason', true);
    const p = await this.store.get(C.pkg, String(b.packageId || '')); if (!p) bad('Package not found.', 404, 'not_found');
    if (p.adminStatus === 'Revoked') bad('Already revoked.', 409, 'state');
    p.revoked = { t: this.now(), by: admin.email, reason, previousStatus: p.adminStatus }; p.adminStatus = 'Revoked';
    await this.store.set(C.pkg, p.id, p);
    await this.audit(admin, 'package.revoke', { inst: p.institutionId, id: p.id }, 'ok', { reason });
    const { manifest, allowlistSnapshot, ...s } = p; return { package: s };
  }

  /* licences */
  term(b, inst, now) {
    const dur = b.duration || {};
    if (!['1m', '2m', '3m', '4m', '6m', '1y', '2y', 'days', 'until'].includes(dur.kind)) bad('Choose a licence length.');
    let start;
    const mode = b.from || 'date';
    const lic = inst.licence;
    if (b.mode === 'renew' && mode === 'expiry') {
      if (!lic || !Number.isFinite(lic.expiresAt)) bad('There is no current term to extend. Choose a start date instead.');
      if (lic.expiresAt <= now) bad('The licence has already expired, so it can\'t be extended from its expiry date. Renew from today or a chosen date.', 400, 'expired');
      start = lic.expiresAt;
    } else if (mode === 'today') start = now;
    else {
      start = dhakaDateToMs(b.activationDate);
      if (!Number.isFinite(start)) bad('Choose a valid activation date.');
      if (start < dhakaToday(now) - 366 * DAY) bad('The activation date is more than a year in the past.');
    }
    const t = computeTerm(dur, start);
    if (!t.ok) bad(t.error);
    if (b.mode === 'renew' && mode !== 'expiry' && lic && Number.isFinite(lic.expiresAt) && lic.expiresAt > now && t.expiresAt <= lic.expiresAt) {
      bad('This renewal would end sooner than the current term. Extend from the current expiry instead, or choose a longer length.');
    }
    return t;
  }
  async a_licence_preview(admin, b) {
    const inst = await this.instOr404(b.id); const now = this.now();
    const t = this.term(b, inst, now);
    const after = { ...(inst.licence || {}), activatesAt: t.activatesAt, expiresAt: t.expiresAt };
    const st = licenceStatus(after, now);
    return { activatesAt: t.activatesAt, expiresAt: t.expiresAt, activationDate: msToDhakaDate(t.activatesAt), expiryDate: msToDhakaDate(t.expiresAt),
      lastFullDay: msToDhakaDate(t.expiresAt - 1), label: t.label, statusAfter: st.status, remainingDaysAfter: st.remainingDays, serverTime: now,
      current: this.view(inst, now).licenceState, staysBlocked: !!(inst.licence && (inst.licence.suspended || inst.licence.blocked || inst.licence.revoked)),
      staysSuspended: !!(inst.licence && (inst.licence.suspended || inst.licence.blocked)), staysRevoked: !!(inst.licence && inst.licence.revoked) };
  }
  async licenceChange(admin, b, kind, mutate, detailFn) {
    return this.once(b.opId, 'licence.' + kind + ':' + b.id, async () => {
      const now = this.now();
      const out = await this.store.tx(async t => {
        const inst = await t.get(C.inst, String(b.id || '')); if (!inst) bad('Institution not found.', 404, 'not_found');
        const before = inst.licence ? { ...inst.licence } : null;
        const lic = mutate(inst, now, before);
        const next = { ...inst, licence: lic, updatedAt: now };
        t.set(C.inst, inst.id, next);
        const ev = { institutionId: inst.id, t: now, by: admin.email, kind, reason: b.reason || null, before, after: lic, ...(detailFn ? detailFn(before, lic) : {}) };
        t.set(C.lic, 'le_' + randomId('', 14), ev);
        return { inst: next, ev };
      });
      await this.audit(admin, 'licence.' + kind, { inst: out.inst.id, id: out.inst.id }, 'ok', { reason: b.reason || null, before: out.ev.before, after: out.ev.after });
      return { institution: this.view(out.inst, now), event: out.ev };
    });
  }
  async a_licence_set(admin, b) {
    if (b.confirm !== true) bad('Confirm the licence first.', 400, 'confirm');
    const inst = await this.instOr404(b.id); const now = this.now();
    const st = licenceStatus(inst.licence, now);
    if (inst.licence && !['Not set', 'Pending'].includes(st.status) && !(['Suspended', 'Revoked'].includes(st.status) && !Number.isFinite(inst.licence.expiresAt)))
      bad(`The licence is ${st.status}. Use Renew to change an existing term.`, 409, 'use_renew');
    const t = this.term({ ...b, mode: 'set' }, inst, now);
    const pol = policy(b, inst.licence);
    return this.licenceChange(admin, b, 'set', (i, n, before) => ({ activatesAt: t.activatesAt, expiresAt: t.expiresAt, duration: t.duration, durationLabel: t.label,
      suspended: !!(before && (before.suspended || before.blocked)), suspendedReason: before && (before.suspendedReason || before.blockedReason) || null,
      suspendedAt: before && (before.suspendedAt || before.blockedAt) || null, suspendedBy: before && (before.suspendedBy || before.blockedBy) || null,
      revoked: before && before.revoked || null, ...pol, activation: { method: 'manual', by: admin.email, at: n, note: 'Manual administrative activation (no payment involved).' },
      setAt: n, setBy: admin.email }));
  }
  async a_licence_renew(admin, b) {
    if (b.confirm !== true) bad('Confirm the renewal first.', 400, 'confirm');
    const inst = await this.instOr404(b.id); const now = this.now();
    if (!inst.licence || !Number.isFinite(inst.licence.expiresAt)) bad('There is no licence to renew yet. Use Set validity.', 409, 'use_set');
    const t = this.term({ ...b, mode: 'renew' }, inst, now);
    if (inst.licence.revoked) bad('A revoked licence can\'t be renewed. Reactivate it first (needs the licences.revoke permission).', 409, 'revoked');
    const pol = policy(b, inst.licence);
    return this.licenceChange(admin, b, 'renew', (i, n, before) => ({ ...before, ...pol, activatesAt: b.from === 'expiry' ? before.activatesAt : t.activatesAt, expiresAt: t.expiresAt,
      duration: t.duration, durationLabel: t.label, renewedAt: n, renewedBy: admin.email,
      renewals: [{ t: n, by: admin.email, from: b.from || 'date', termStart: t.activatesAt, expiresAt: t.expiresAt, label: t.label }, ...(before.renewals || [])].slice(0, 50) }));
  }
  /* Suspend: a pause (v46 "Block"). Reactivate: back to what the dates say. Revoke: withdrawn; only a
     reactivation by someone with licences.revoke brings it back. None of them touch any data. */
  async a_licence_suspend(admin, b) {
    if (b.confirm !== true) bad('Confirm the suspension first.', 400, 'confirm');
    str(b.reason, 500, 'Reason', true);
    const inst = await this.instOr404(b.id);
    if (inst.licence && inst.licence.revoked) bad('The licence is revoked. Reactivate it first.', 409, 'state');
    if (inst.licence && (inst.licence.suspended || inst.licence.blocked)) bad('The licence is already suspended.', 409, 'state');
    return this.licenceChange(admin, b, 'suspend', (i, n, before) => ({ ...(before || {}), suspended: true, blocked: false, suspendedAt: n, suspendedBy: admin.email, suspendedReason: b.reason.trim() }));
  }
  async a_licence_block(admin, b) { return this.a_licence_suspend(admin, b); }
  async a_licence_reactivate(admin, b) {
    if (b.confirm !== true) bad('Confirm the reactivation first.', 400, 'confirm');
    str(b.reason, 500, 'Approval note', true);
    const inst = await this.instOr404(b.id);
    const L = inst.licence;
    if (!L || !(L.suspended || L.blocked || L.revoked)) bad('The licence is not suspended or revoked.', 409, 'state');
    if (L.revoked && !b._mayUnrevoke) bad('Reactivating a revoked licence needs the licences.revoke permission.', 403, 'forbidden');
    return this.licenceChange(admin, b, L.revoked ? 'unrevoke' : 'reactivate', (i, n, before) => ({ ...before, suspended: false, blocked: false, revoked: null,
      reactivatedAt: n, reactivatedBy: admin.email, reactivationNote: b.reason.trim(), suspendedReason: null, blockedReason: null }));
  }
  async a_licence_unblock(admin, b) { return this.a_licence_reactivate(admin, b); }
  async a_licence_revoke(admin, b) {
    if (b.confirm !== true) bad('Confirm the revocation first.', 400, 'confirm');
    str(b.reason, 500, 'Reason', true);
    const inst = await this.instOr404(b.id);
    if (inst.licence && inst.licence.revoked) bad('The licence is already revoked.', 409, 'state');
    return this.licenceChange(admin, b, 'revoke', (i, n, before) => ({ ...(before || {}), revoked: { t: n, by: admin.email, reason: b.reason.trim() } }));
  }
  /** Grace days and the "Expiring Soon" threshold for one institution. */
  async a_licence_policy(admin, b) {
    if (b.confirm !== true) bad('Confirm the change first.', 400, 'confirm');
    const inst = await this.instOr404(b.id);
    if (!inst.licence) bad('Set the licence first.', 409, 'use_set');
    const pol = policy(b, inst.licence);
    return this.licenceChange(admin, b, 'policy', (i, n, before) => ({ ...before, ...pol }));
  }

  /* server registration (admin side) */
  async a_regcode_create(admin, b) {
    const inst = await this.instOr404(b.id);
    if (inst.server && inst.server.serverId && !inst.server.reset) bad('A server is already registered for this institution. Reset the registration first if the server was rebuilt.', 409, 'registered');
    const code = humanCode(3); const now = this.now();
    for (const c of await this.store.where(C.reg, 'institutionId', inst.id)) if (!c.used) await this.store.set(C.reg, c.id, { ...c, used: { t: now, by: 'replaced' } });
    const id = hashCode(code);
    await this.store.set(C.reg, id, { id, institutionId: inst.id, createdAt: now, createdBy: admin.email, expiresAt: now + 7 * DAY, used: null });
    await this.audit(admin, 'server.regcode', { inst: inst.id, id: inst.id }, 'ok', { expiresAt: now + 7 * DAY });
    return { code, expiresAt: now + 7 * DAY };
  }
  async a_server_reset(admin, b) {
    if (b.confirm !== true) bad('Confirm the reset first.', 400, 'confirm');
    const reason = str(b.reason, 500, 'Reason', true);
    const inst = await this.instOr404(b.id);
    if (!inst.server || !inst.server.serverId) bad('No server is registered.', 409, 'state');
    const sid = inst.server.serverId;
    const srv = await this.store.get(C.srv, sid); if (srv) await this.store.set(C.srv, sid, { ...srv, active: false, resetAt: this.now(), resetBy: admin.email });
    await this.store.set(C.inst, inst.id, { ...inst, server: { ...inst.server, reset: true, resetAt: this.now(), status: 'Registration reset' }, updatedAt: this.now() });
    await this.audit(admin, 'server.reset', { inst: inst.id, id: sid }, 'ok', { reason });
    return { ok: true };
  }
  async a_audit_list(admin, b) {
    let rows = b.institutionId ? await this.store.where(C.audit, 'institutionId', String(b.institutionId)) : await this.store.all(C.audit);
    rows.sort((x, y) => y.t - x.t);
    const lim = Math.min(Math.max(Number(b.limit) || 200, 1), 1000);
    return { audit: rows.slice(0, lim) };
  }

  /* ───────────── institution servers (no admin login; signed requests) ───────────── */
  statement(inst, srv, pkgRec, nonce, sync) {
    const now = this.now();
    const lic = inst.licence || null;
    const s = { v: 1, institutionId: inst.id, institutionName: inst.name, serverId: srv.id, issuedAt: now, nonce: typeof nonce === 'string' ? nonce.slice(0, 64) : null,
      licence: lic ? { activatesAt: lic.activatesAt ?? null, expiresAt: lic.expiresAt ?? null, suspended: !!(lic.suspended || lic.blocked), revoked: !!lic.revoked,
        graceDays: lic.graceDays || 0, warnDays: Number.isFinite(lic.warnDays) ? lic.warnDays : WARN_DAYS_DEFAULT } : null,
      warnDays: (lic && lic.warnDays) || WARN_DAYS_DEFAULT,
      status: licenceStatus(lic, now).status,
      latestPackage: inst.latestPackageId ? { id: inst.latestPackageId, version: inst.latestPackageVersion } : null,
      packageRevoked: !!(pkgRec && pkgRec.adminStatus === 'Revoked'),
      ...(sync ? { sync } : {}) };
    const sig = require('./util').signEd25519(this.keys.privatePem, Buffer.from(canonical(s)));
    return { statement: s, sig };
  }
  async recordReport(inst, srv, report, kind) {
    inst = (await this.store.get(C.inst, inst.id)) || inst;   // never overwrite an admin change made a moment ago
    const now = this.now();
    const rep = sanitizeReport(report);
    const pkgRec = rep.packageId ? await this.store.get(C.pkg, rep.packageId) : null;
    const pkgOk = pkgRec && pkgRec.institutionId === inst.id;
    const healthy = rep.health && rep.health.db === 'ok';
    if (pkgOk) {
      const tech = healthy ? { status: 'Installed', confirmedAt: pkgRec.tech && pkgRec.tech.status === 'Installed' ? pkgRec.tech.confirmedAt : now, lastSeenAt: now, serverId: srv.id }
                           : { status: 'Installation failed', reportedAt: now, serverId: srv.id, problem: 'Server reported database: ' + (rep.health && rep.health.db) };
      const upd = { ...pkgRec, tech };
      if (pkgRec.adminStatus === 'Revoked' && pkgRec.revoked && !pkgRec.revoked.confirmedAt) upd.revoked = { ...pkgRec.revoked, confirmedAt: now, confirmedBy: srv.id };
      await this.store.set(C.pkg, pkgRec.id, upd);
    }
    await this.store.set(C.srv, srv.id, { ...srv, lastSeenAt: now, lastReport: rep, lastKind: kind });
    const status = healthy && !(rep.sync && rep.sync.error) ? 'Healthy' : 'Degraded';
    const prevStatus = inst.server && inst.server.status;
    const syncState = { ...(inst.sync || {}) };
    if (rep.sync) {
      syncState.appliedVersion = rep.sync.appliedVersion || syncState.appliedVersion || null;
      syncState.appliedAt = rep.sync.appliedAt || syncState.appliedAt || null;
      syncState.error = rep.sync.error || null;
      syncState.reportedAt = now;
      if (syncState.appliedVersion && syncState.appliedVersion === syncState.currentVersion) syncState.pendingSince = null;
      if (rep.sync.receipts) syncState.receipts = rep.sync.receipts;
    }
    await this.store.set(C.inst, inst.id, { ...inst, sync: syncState, server: { serverId: srv.id, registeredAt: srv.registeredAt, lastSeenAt: now,
      serverVersion: rep.serverVersion || null, packageId: rep.packageId || null, packageVersion: rep.packageVersion || null, interval: rep.interval || null,
      allowlistVersion: rep.allowlistVersion ?? null, health: rep.health || null, knownPackage: !!pkgOk, status, statusSince: prevStatus === status ? (inst.server && inst.server.statusSince) || now : now } });
    if (this.onServerReport) await this.onServerReport(inst, { prevStatus, status, kind, rep });
    return pkgRec;
  }
  async inst(body, ip) {
    const a = body && body.action;
    if (a === 'register') return this.register(body);
    if (a === 'checkin') return this.checkin(body);
    bad('Unknown action.', 404, 'unknown_action');
  }
  async register(b) {
    if (!this.keys.privatePem) bad('GHUM licensing is not configured yet. Try again later.', 503, 'not_configured');
    const code = String(b.code || ''); if (normCode(code).length < 12) bad('That registration code is not valid.', 403, 'bad_code');
    let pub; try { pub = String(b.serverPublicKey || ''); if (crypto.createPublicKey(pub).asymmetricKeyType !== 'ed25519') throw 0; } catch (e) { bad('Invalid server key.', 400, 'bad_key'); }
    const hid = hashCode(code); const now = this.now();
    const res = await this.store.tx(async t => {
      const rc = await t.get(C.reg, hid);
      if (!rc || rc.used || rc.expiresAt < now || rc.institutionId !== b.institutionId) bad('That registration code is not valid for this institution, has been used, or has expired. Ask GHUM for a new code.', 403, 'bad_code');
      const inst = await t.get(C.inst, rc.institutionId); if (!inst) bad('Institution not found.', 404, 'not_found');
      if (inst.server && inst.server.serverId && !inst.server.reset) bad('Another server is already registered for this institution.', 409, 'registered');
      const sid = 'srv_' + randomId('', 12);
      const srv = { id: sid, institutionId: inst.id, publicKey: pub, fingerprint: keyFingerprint(pub), registeredAt: now, active: true, lastTs: 0 };
      t.set(C.srv, sid, srv);
      t.set(C.reg, hid, { ...rc, used: { t: now, serverId: sid } });
      t.set(C.inst, inst.id, { ...inst, server: { serverId: sid, registeredAt: now, status: 'Registered' } });
      return { srv, instId: inst.id };
    });
    const inst = await this.store.get(C.inst, res.instId);
    const pkgRec = await this.recordReport(inst, res.srv, b.report, 'register');
    await this.audit('server:' + res.srv.id, 'server.register', { inst: inst.id, id: res.srv.id }, 'ok', { fingerprint: res.srv.fingerprint });
    const inst2 = await this.store.get(C.inst, res.instId);
    const sync = this.syncFor ? await this.syncFor(inst2) : null;
    return { serverId: res.srv.id, ...this.statement(inst2, res.srv, pkgRec, b.nonce, sync) };
  }
  async checkin(b) {
    if (!this.keys.privatePem) bad('GHUM licensing is not configured yet.', 503, 'not_configured');
    const srv = await this.store.get(C.srv, String(b.serverId || ''));
    if (!srv || srv.institutionId !== b.institutionId) bad('Unknown server.', 403, 'unknown_server');
    if (!srv.active) bad('This server\'s registration was reset by GHUM. Register again with a new code.', 403, 'reset');
    const { sig, ...signed } = b;
    if (!verifyEd25519(srv.publicKey, Buffer.from(canonical(signed)), sig)) bad('Bad signature.', 403, 'bad_signature');
    const now = this.now();
    if (!(Math.abs(this.wallClock() - Number(b.ts)) < 5 * 60000)) bad('The server clock is more than 5 minutes off. Fix the server\'s time (NTP).', 403, 'clock');
    if (!(Number(b.ts) > (srv.lastTs || 0))) bad('Replayed request.', 403, 'replay');
    await this.store.set(C.srv, srv.id, { ...srv, lastTs: Number(b.ts) });
    const inst = await this.store.get(C.inst, srv.institutionId);
    const pkgRec = await this.recordReport(inst, { ...srv, lastTs: Number(b.ts) }, b.report, 'checkin');
    const inst2 = await this.store.get(C.inst, srv.institutionId);
    const sync = this.syncFor ? await this.syncFor(inst2) : null;
    return this.statement(inst2, srv, pkgRec, b.nonce, sync);
  }
}

function sanitizeReport(r) {
  r = r && typeof r === 'object' ? r : {};
  const s = (v, n) => typeof v === 'string' ? v.slice(0, n) : null;
  let sync = null;
  if (r.sync && typeof r.sync === 'object') {
    const rc = {};
    if (r.sync.receipts && typeof r.sync.receipts === 'object') for (const [k, v] of Object.entries(r.sync.receipts).slice(0, 200)) {
      if (!/^[A-Za-z0-9_-]{4,40}$/.test(k) || !v || typeof v !== 'object') continue;
      const n = x => Number.isInteger(x) && x >= 0 && x < 1e6 ? x : 0;
      rc[k] = { recipients: n(v.recipients), delivered: n(v.delivered), read: n(v.read) };
    }
    sync = { appliedVersion: s(r.sync.appliedVersion, 80), appliedAt: Number.isFinite(r.sync.appliedAt) ? r.sync.appliedAt : null, error: s(r.sync.error, 300), receipts: rc };
  }
  return { serverVersion: s(r.serverVersion, 40), packageId: s(r.packageId, 40), packageVersion: s(r.packageVersion, 20),
    allowlistVersion: Number.isFinite(r.allowlistVersion) ? r.allowlistVersion : null, interval: Number.isInteger(r.interval) && r.interval > 0 && r.interval < 100000 ? r.interval : null,
    health: r.health && typeof r.health === 'object' ? { db: s(r.health.db, 20), node: s(r.health.node, 20) } : null, sync };
}

module.exports = { ControlPlane, CPError, validateTeachers, parseCsv, C };
