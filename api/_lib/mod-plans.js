'use strict';
/* Packages and entitlements. A package here is an entitlement profile (which
   features an institution gets, and its limits), never a payment plan.

   Versioning: saving a package makes a new version; institutions keep the
   snapshot they were assigned until an admin applies the new version to them
   (plans.assign with the new version). So editing a template never silently
   changes what an active institution has.

   Enforcement: the institution's server receives its effective features and
   limits in the signed check-in answer and refuses what isn't allowed;
   maxTeachers is also refused here when the roster is saved. */
const { CPError, C } = require('./cp');
const { FEATURES, BY_KEY } = require('./features-core');
const K = { plans: 'cpPlans' };
const bad = (m, s, c) => { throw new CPError(m, s, c); };
const ALLF = FEATURES.map(f => f.key);
const pick = (keys) => Object.fromEntries(ALLF.map(k => [k, keys.includes(k)]));

const TEMPLATES = [
  { id: 'pilot', name: 'Pilot', description: 'Every feature, for a trial term (for example IUB\'s pilot).', features: pick(ALLF), limits: { maxTeachers: 25, maxActiveExams: 20 } },
  { id: 'starter', name: 'Starter', description: 'MCQ and written exams, pictures, paper reading and results. No camera monitoring or combined exams.',
    features: pick(['exam.mcq', 'exam.written', 'questions.images', 'reader.paper', 'results.export', 'results.review', 'feedback.form']), limits: { maxTeachers: 50, maxActiveExams: 30 } },
  { id: 'standard', name: 'Standard', description: 'Starter plus combined exams and device switching.',
    features: pick(['exam.mcq', 'exam.written', 'exam.combined', 'questions.images', 'reader.paper', 'results.export', 'results.review', 'exam.deviceSwitch', 'feedback.form']), limits: { maxTeachers: 200, maxActiveExams: 100 } },
  { id: 'professional', name: 'Professional', description: 'Every feature, including camera monitoring.', features: pick(ALLF), limits: { maxTeachers: 500, maxActiveExams: 300 } },
  { id: 'enterprise', name: 'Enterprise', description: 'Every feature, the largest roster, no active-exam limit.', features: pick(ALLF), limits: { maxTeachers: 3000, maxActiveExams: null } },
  { id: 'custom', name: 'Custom', description: 'Start from everything and adjust.', features: pick(ALLF), limits: { maxTeachers: null, maxActiveExams: null } }
];

function cleanLimits(l) {
  l = l || {};
  const one = (v, name, max) => {
    if (v === null || v === undefined || v === '') return null;
    const n = Number(v); if (!Number.isInteger(n) || n < 1 || n > max) bad(`${name} must be a whole number from 1 to ${max}, or empty for no limit.`);
    return n;
  };
  return { maxTeachers: one(l.maxTeachers, 'Maximum teachers', 3000), maxActiveExams: one(l.maxActiveExams, 'Maximum active exams', 100000) };
}
function cleanFeatures(f) {
  const out = {}; for (const k of ALLF) out[k] = !!(f && f[k]);
  if (!out['exam.mcq'] && !out['exam.written'] && !out['exam.combined']) bad('A package must include at least one exam type.');
  return out;
}
function snapshot(p) { return { planId: p.id, planName: p.name, version: p.version, features: p.features, limits: p.limits }; }

const methods = {
  async plans() {
    let all = await this.store.all(K.plans);
    if (!all.length) {
      const now = this.now();
      for (const t of TEMPLATES) {
        const rec = { ...t, version: 1, status: 'available', deploymentTypes: ['institution-hosted'], template: true, createdAt: now, createdBy: 'system', updatedAt: now,
          effectiveFrom: now, versions: [{ version: 1, features: t.features, limits: t.limits, t: now, by: 'system', note: 'Built-in template' }] };
        await this.store.set(K.plans, t.id, rec);
      }
      await this.audit({ email: 'system' }, 'plans.seed', { type: 'package', id: 'templates' }, 'ok', { templates: TEMPLATES.map(t => t.id) });
      all = await this.store.all(K.plans);
    }
    return all;
  },
  async x_plans_list() {
    const plans = await this.plans(); const insts = await this.store.all(C.inst);
    return { plans: plans.map(p => ({ ...p, versions: undefined, versionCount: (p.versions || []).length,
      institutions: insts.filter(i => i.entitlement && i.entitlement.planId === p.id).map(i => ({ id: i.id, name: i.name, version: i.entitlement.version, outdated: i.entitlement.version !== p.version })) })),
      features: FEATURES, deploymentTypes: [{ id: 'institution-hosted', name: 'Institution-hosted', supported: true }, { id: 'ghum-managed', name: 'GHUM-managed hosting', supported: false, note: 'Not available yet.' }] };
  },
  async x_plans_get(admin, b) {
    const p = await this.store.get(K.plans, String(b.id || '')); if (!p) bad('Package not found.', 404, 'not_found');
    return { plan: p, features: FEATURES };
  },
  async x_plans_save(admin, b) {
    if (b.confirm !== true) bad('Review and confirm first.', 400, 'confirm');
    const name = String(b.name || '').trim(); if (!name || name.length > 60) bad('Give the package a name (up to 60 characters).');
    const features = cleanFeatures(b.features), limits = cleanLimits(b.limits);
    const description = String(b.description || '').slice(0, 400);
    const now = this.now();
    if (b.id) {
      const prev = await this.store.get(K.plans, String(b.id)); if (!prev) bad('Package not found.', 404, 'not_found');
      if (Number(b.baseVersion) !== prev.version) bad(`This package changed since you opened it (now version ${prev.version}). Reload it.`, 409, 'stale');
      const changed = JSON.stringify(prev.features) !== JSON.stringify(features) || JSON.stringify(prev.limits) !== JSON.stringify(limits);
      const version = changed ? prev.version + 1 : prev.version;
      const next = { ...prev, name, description, features, limits, version, updatedAt: now, updatedBy: admin.email, effectiveFrom: changed ? now : prev.effectiveFrom,
        versions: changed ? [...(prev.versions || []), { version, features, limits, t: now, by: admin.email, note: String(b.note || '').slice(0, 200) }] : prev.versions };
      await this.store.set(K.plans, prev.id, next);
      await this.audit(admin, 'plans.save', { type: 'package', id: prev.id }, 'ok', { before: { version: prev.version, features: prev.features, limits: prev.limits, name: prev.name }, after: { version, features, limits, name } });
      const affected = (await this.store.all(C.inst)).filter(i => i.entitlement && i.entitlement.planId === prev.id).map(i => ({ id: i.id, name: i.name, version: i.entitlement.version }));
      return { plan: next, newVersion: changed, affected, note: changed ? `Saved as version ${version}. ${affected.length} institution${affected.length === 1 ? ' keeps' : 's keep'} their current version until you apply this one to them.` : 'Saved. Features and limits are unchanged, so the version stays the same.' };
    }
    const id = String(b.newId || name).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40);
    if (!id) bad('Give the package an internal ID.');
    if (await this.store.get(K.plans, id)) bad('A package with this internal ID exists.', 409, 'exists');
    const rec = { id, name, description, features, limits, version: 1, status: 'available', deploymentTypes: ['institution-hosted'], template: false, createdAt: now, createdBy: admin.email,
      updatedAt: now, effectiveFrom: now, versions: [{ version: 1, features, limits, t: now, by: admin.email, note: String(b.note || '').slice(0, 200) }] };
    await this.store.set(K.plans, id, rec);
    await this.audit(admin, 'plans.save', { type: 'package', id }, 'ok', { created: true, features, limits, name });
    return { plan: rec, newVersion: true, affected: [] };
  },
  async x_plans_status(admin, b) {
    if (b.confirm !== true) bad('Confirm first.', 400, 'confirm');
    const p = await this.store.get(K.plans, String(b.id || '')); if (!p) bad('Package not found.', 404, 'not_found');
    const status = b.status === 'retired' ? 'retired' : 'available';
    await this.store.set(K.plans, p.id, { ...p, status, updatedAt: this.now(), updatedBy: admin.email });
    await this.audit(admin, 'plans.status', { type: 'package', id: p.id }, 'ok', { before: p.status, after: status });
    return { ok: true, note: status === 'retired' ? 'Retired: it can\'t be assigned to new institutions. Institutions that have it keep it.' : 'Available for assignment.' };
  },
  /** What changes for one institution if it gets this package (or this package's newest version). */
  async x_plans_assignPreview(admin, b) {
    const inst = await this.cp.instOr404(b.id); const p = await this.store.get(K.plans, String(b.planId || '')); if (!p) bad('Package not found.', 404, 'not_found');
    const cur = inst.entitlement || null; const al = await this.store.get(C.allow, inst.id) || { teachers: [] };
    const diff = FEATURES.map(f => ({ key: f.key, name: f.name, before: cur ? !!cur.features[f.key] : null, after: !!p.features[f.key] })).filter(x => x.before !== x.after);
    const warnings = [];
    if (p.status === 'retired') warnings.push('This package is retired.');
    if (p.limits.maxTeachers && al.teachers.length > p.limits.maxTeachers) warnings.push(`The roster has ${al.teachers.length} teachers but this package allows ${p.limits.maxTeachers}. Remove teachers first, or choose a larger package.`);
    return { institution: { id: inst.id, name: inst.name }, current: cur, next: snapshot(p), diff, limitsBefore: cur ? cur.limits : null, limitsAfter: p.limits, warnings, blocked: warnings.some(w => /^The roster/.test(w)) };
  },
  async x_plans_assign(admin, b) {
    if (b.confirm !== true) bad('Review and confirm first.', 400, 'confirm');
    const pv = await this.x_plans_assignPreview(admin, b);
    if (pv.blocked) bad(pv.warnings.join(' '), 409, 'limit');
    const p = await this.store.get(K.plans, String(b.planId));
    if (p.status === 'retired' && !(pv.current && pv.current.planId === p.id)) bad('This package is retired and can\'t be assigned to another institution.', 409, 'retired');
    const out = await this.store.tx(async t => {
      const inst = await t.get(C.inst, pv.institution.id);
      const ent = { ...snapshot(p), assignedAt: this.now(), assignedBy: admin.email, history: [{ t: this.now(), by: admin.email, planId: p.id, version: p.version, from: inst.entitlement ? { planId: inst.entitlement.planId, version: inst.entitlement.version } : null },
        ...((inst.entitlement && inst.entitlement.history) || [])].slice(0, 30) };
      t.set(C.inst, inst.id, { ...inst, entitlement: ent, updatedAt: this.now() });
      return ent;
    });
    await this.audit(admin, 'plans.assign', { type: 'institution', id: pv.institution.id, inst: pv.institution.id }, 'ok', { before: pv.current ? { planId: pv.current.planId, version: pv.current.version } : null, after: { planId: p.id, version: p.version }, diff: pv.diff });
    await this.markSyncPending(pv.institution.id);
    return { entitlement: out, sync: await this.syncState(pv.institution.id) };
  },
  /** Institution-specific override for one feature: on, off, or back to the package. Granting beyond the package is an approved exception. */
  async x_plans_override(admin, b) {
    if (b.confirm !== true) bad('Confirm first.', 400, 'confirm');
    const f = BY_KEY[String(b.feature || '')]; if (!f) bad('Unknown feature.', 400);
    const inst = await this.cp.instOr404(b.id);
    const reason = String(b.reason || '').trim(); if (!reason) bad('Give a reason for the override.');
    const ent = inst.entitlement; const inPkg = !ent || !!ent.features[f.key];
    let ov = null;
    if (b.state === 'on' || b.state === 'off') {
      ov = { on: b.state === 'on', reason, by: admin.email, t: this.now() };
      if (ov.on && !inPkg) { this.need(admin, 'features.manage'); ov.exception = true; }
    }
    const overrides = { ...(inst.featureOverrides || {}) }; const before = overrides[f.key] || null;
    if (ov) overrides[f.key] = ov; else delete overrides[f.key];
    await this.store.set(C.inst, inst.id, { ...inst, featureOverrides: overrides, updatedAt: this.now() });
    await this.audit(admin, 'plans.override', { type: 'institution', id: inst.id, inst: inst.id }, 'ok', { feature: f.key, before, after: ov, reason });
    await this.markSyncPending(inst.id);
    return { overrides, sync: await this.syncState(inst.id) };
  }
};
module.exports = { methods, TEMPLATES, snapshot };
