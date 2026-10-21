'use strict';
/* Feature controls and configuration sync.

   Global configuration (cpConfig/features): a default per feature and the
   emergency kill switches. It is published to meta/features, which the cloud
   app reads and Firestore's rules use to refuse protected writes. Per-user
   overrides go to featureUsers/{uid} (readable only by that user and the rules).

   Institutions get their effective features, limits, public settings,
   announcements and messages in the signed answer to their server's check-in
   (syncFor). The server reports which version it applied; until it does, the
   Admin Monitor shows the change as pending, never as applied. */
const crypto = require('node:crypto');
const { CPError, C } = require('./cp');
const { canonical } = require('./util');
const { FEATURES, BY_KEY, effective } = require('./features-core');
const K = { config: 'cpConfig', configV: 'cpConfigVersions', fusers: 'cpFeatureUsers', ann: 'cpAnnouncements', msgs: 'cpMessages', plans: 'cpPlans' };
const bad = (m, s, c) => { throw new CPError(m, s, c); };
const RULES_MARKER = 'ef-features-v1';

const methods = {
  async featureConfig() { return await this.store.get(K.config, 'features') || { defaults: {}, kill: {}, version: 0 }; },
  async saveConfig(key, admin, next, before, reason) {
    const version = (before && before.version || 0) + 1;
    const rec = { ...next, version, updatedAt: this.now(), updatedBy: admin.email };
    await this.store.set(K.config, key, rec);
    await this.store.set(K.configV, key + '_' + version, { key, version, before: before || null, after: rec, reason: reason || null, by: admin.email, t: this.now() });
    return rec;
  },
  /** Writes meta/features for the cloud app and the rules, then reads it back. */
  async publishFeatures(cfg) {
    const off = {}, kill = {};
    for (const f of FEATURES) {
      if (cfg.kill && cfg.kill[f.key] && f.killable) { kill[f.key] = true; off[f.key] = true; }
      const d = cfg.defaults && f.key in cfg.defaults ? cfg.defaults[f.key] : f.default;
      if (!d) off[f.key] = true;
    }
    const doc = { v: cfg.version || 0, updatedAt: this.now(), off, kill };
    try {
      await this.platform.writeMeta('features', doc);
      const back = await this.platform.readMeta('features');
      if (!back || back.v !== doc.v) return { state: 'failed', error: 'The published configuration could not be read back.' };
      return { state: 'applied', doc };
    } catch (e) { await this.errorEvent('features', 'publish', e); return { state: 'failed', error: e.message }; }
  },
  async rulesEnforce() {
    const src = await this.platform.rulesSource();
    if (src && typeof src === 'string') return src.includes(RULES_MARKER) ? 'yes' : 'no';
    return 'unknown';
  },
  async x_features_list() {
    const [cfg, insts, fus, plans, hist0, rules, published] = await Promise.all([this.featureConfig(), this.store.all(C.inst), this.store.all(K.fusers), this.store.all(K.plans),
      this.store.all(K.configV), this.rulesEnforce(), this.platform.readMeta('features')]);
    const hist = hist0.filter(v => v.key === 'features').sort((a, b) => b.t - a.t);
    const lastFor = k => { for (const h of hist) { const a = h.after || {}, b = h.before || {}; if (JSON.stringify((a.defaults || {})[k]) !== JSON.stringify((b.defaults || {})[k]) || !!(a.kill || {})[k] !== !!(b.kill || {})[k]) return { by: h.by, t: h.t }; } return null; };
    const rows = FEATURES.map(f => {
      const def = f.key in (cfg.defaults || {}) ? !!cfg.defaults[f.key] : f.default;
      return { ...f, globalOn: def, builtInDefault: f.default, killed: !!(cfg.kill || {})[f.key],
        institutionOverrides: insts.filter(i => i.featureOverrides && i.featureOverrides[f.key]).map(i => ({ id: i.id, name: i.name, ...i.featureOverrides[f.key] })),
        userOverrides: fus.filter(u => (u.on && u.on[f.key]) || (u.off && u.off[f.key])).map(u => ({ uid: u.uid, email: u.email, on: !!(u.on && u.on[f.key]) })),
        packages: plans.filter(p => p.features && p.features[f.key]).map(p => p.name), lastChange: lastFor(f.key) };
    });
    const syncs = await Promise.all(insts.map(async i => ({ id: i.id, name: i.name, ...(await this.syncState(i.id)) })));
    return { features: rows, config: { version: cfg.version || 0, updatedAt: cfg.updatedAt || null, updatedBy: cfg.updatedBy || null }, rulesEnforce: rules, rulesMarker: RULES_MARKER,
      published, institutions: syncs, history: hist.slice(0, 30).map(h => ({ id: h.key + '_' + h.version, version: h.version, by: h.by, t: h.t, reason: h.reason })),
      precedence: ['Emergency kill switch', 'Package entitlement (institutions)', 'Institution override', 'User override (cloud accounts)', 'Global default'] };
  },
  async x_features_preview(admin, b) {
    const f = BY_KEY[String(b.feature || '')]; if (!f) bad('Unknown feature.', 400);
    const scope = String(b.scope || 'global');
    const insts = await this.store.all(C.inst);
    if (scope === 'global') {
      const users = (await this.platform.listUsers()).filter(u => !u.disabled).length;
      const cfg = await this.featureConfig(); const next = { ...cfg, defaults: { ...(cfg.defaults || {}), [f.key]: b.state === 'on' } };
      const changedInst = insts.filter(i => { const ctx = { kind: 'institution', entitled: i.entitlement ? i.entitlement.features : null, overrides: i.featureOverrides };
        return effective(cfg, ctx)[f.key].on !== effective(next, ctx)[f.key].on; }).map(i => ({ id: i.id, name: i.name }));
      const fus = (await this.store.all(K.fusers)).filter(u => (u.on && u.on[f.key]) || (u.off && u.off[f.key])).length;
      return { feature: f, scope, cloudAccounts: users, cloudOverridesKept: fus, institutionsChanged: changedInst, enforce: f.enforce,
        consequence: b.state === 'on' ? `${f.name} becomes available by default.` : `${f.name} stops being available by default. Exams that already use it keep working; new ones can't use it.` };
    }
    if (scope === 'institution') {
      const inst = await this.cp.instOr404(b.target); const al = await this.store.get(C.allow, inst.id) || { teachers: [] };
      const inPkg = !inst.entitlement || !!inst.entitlement.features[f.key];
      return { feature: f, scope, institution: { id: inst.id, name: inst.name }, teachers: al.teachers.length, inPackage: inPkg, needsException: b.state === 'on' && !inPkg,
        registered: !!(inst.server && inst.server.serverId), consequence: inst.server && inst.server.serverId ? 'Applied when the institution\'s server next checks in (about 5 minutes).' : 'This institution has no registered server yet: the change waits until it registers.' };
    }
    if (scope === 'user') {
      const u = await this.platform.getUser(String(b.target || '')); if (!u) bad('User not found.', 404);
      return { feature: f, scope, user: { uid: u.uid, email: u.email }, enforce: f.enforce, consequence: 'Only this account is affected.' };
    }
    bad('Unknown scope.');
  },
  async x_features_set(admin, b) {
    if (b.confirm !== true) bad('Review and confirm first.', 400, 'confirm');
    const f = BY_KEY[String(b.feature || '')]; if (!f) bad('Unknown feature.', 400);
    const scope = String(b.scope || 'global'); const reason = String(b.reason || '').trim();
    if (!reason) bad('Give a reason. It is kept in the audit log and the change history.');
    if (scope === 'institution') {
      const r = await this.x_plans_override(admin, { id: b.target, feature: f.key, state: b.state === 'default' ? null : b.state, reason, confirm: true });
      return { result: r.sync.registered ? (r.sync.pending ? 'pending' : 'applied') : 'waiting-registration', sync: r.sync,
        message: r.sync.registered ? 'Saved. Waiting for the institution\'s server to apply it (it checks in about every 5 minutes).' : 'Saved. The institution has no registered server yet, so it applies once the server registers.' };
    }
    if (scope === 'user') {
      const u = await this.platform.getUser(String(b.target || '')); if (!u) bad('User not found.', 404);
      const prev = await this.store.get(K.fusers, u.uid) || { uid: u.uid, email: u.email, on: {}, off: {} };
      const next = { uid: u.uid, email: u.email, on: { ...prev.on }, off: { ...prev.off }, updatedAt: this.now(), updatedBy: admin.email };
      delete next.on[f.key]; delete next.off[f.key];
      if (b.state === 'on') next.on[f.key] = true; else if (b.state === 'off') next.off[f.key] = true;
      const empty = !Object.keys(next.on).length && !Object.keys(next.off).length;
      if (empty) await this.store.set(K.fusers, u.uid, { ...next, deleted: true }); else await this.store.set(K.fusers, u.uid, next);
      let state = 'applied', error = null;
      try { await this.platform.setUserFlags(u.uid, empty ? null : { on: next.on, off: next.off, updatedAt: this.now() }); } catch (e) { state = 'failed'; error = e.message; }
      await this.audit(admin, 'features.set', { type: 'user', id: u.uid }, state === 'applied' ? 'ok' : 'failed', { feature: f.key, scope, before: { on: !!prev.on[f.key], off: !!prev.off[f.key] }, after: b.state, reason, error });
      return { result: state, error, message: state === 'applied' ? `Applied to ${u.email}.` + (f.enforce.cloud === 'app' ? ' (Enforced by the app only: this feature runs inside the browser.)' : '') : 'Saved, but publishing failed: ' + error };
    }
    if (scope !== 'global') bad('Unknown scope.');
    const before = await this.featureConfig();
    const def = b.state === 'default' ? undefined : b.state === 'on';
    const defaults = { ...(before.defaults || {}) }; if (def === undefined) delete defaults[f.key]; else defaults[f.key] = def;
    const cfg = await this.saveConfig('features', admin, { ...before, defaults }, before, reason);
    const pub = await this.publishFeatures(cfg);
    await this.audit(admin, 'features.set', { type: 'feature', id: f.key }, pub.state === 'applied' ? 'ok' : 'failed', { scope, before: (before.defaults || {})[f.key], after: def, reason, version: cfg.version, error: pub.error || null });
    for (const i of await this.store.all(C.inst)) await this.markSyncPending(i.id);
    const enf = f.enforce.cloud === 'rules' ? await this.rulesEnforce() : 'app';
    return { result: pub.state, error: pub.error || null, version: cfg.version, rulesEnforce: enf,
      message: pub.state !== 'applied' ? 'Saved (version ' + cfg.version + ') but publishing to the app failed: ' + pub.error + '. The previous setting is still in effect for cloud users.'
        : 'Applied for cloud accounts (version ' + cfg.version + ').' + (enf === 'no' ? ' Note: your published Firestore rules are older than v47, so only the app hides it until you publish firestore.rules.' : enf === 'app' ? ' Enforced by the app (this feature runs inside the browser).' : '') + ' Institutions apply it at their next check-in.' };
  },
  async x_features_kill(admin, b) {
    if (b.confirm !== true) bad('Confirm first.', 400, 'confirm');
    const f = BY_KEY[String(b.feature || '')]; if (!f) bad('Unknown feature.', 400);
    if (!f.killable) bad(`${f.name} is a core feature and has no kill switch. Turn its default off instead if you must.`, 400, 'not_killable');
    const reason = String(b.reason || '').trim(); if (!reason) bad('Give a reason.');
    const before = await this.featureConfig();
    const kill = { ...(before.kill || {}) }; if (b.on === true) kill[f.key] = true; else delete kill[f.key];
    const cfg = await this.saveConfig('features', admin, { ...before, kill }, before, reason);
    const pub = await this.publishFeatures(cfg);
    await this.audit(admin, 'features.kill', { type: 'feature', id: f.key }, pub.state === 'applied' ? 'ok' : 'failed', { on: b.on === true, reason, version: cfg.version, error: pub.error || null });
    for (const i of await this.store.all(C.inst)) await this.markSyncPending(i.id);
    return { result: pub.state, error: pub.error || null, version: cfg.version, message: (b.on === true ? `${f.name} is switched off everywhere.` : `Kill switch for ${f.name} released.`) + ' Cloud: ' + pub.state + '. Institutions: at their next check-in.' };
  },
  async x_features_revert(admin, b) {
    if (b.confirm !== true) bad('Confirm first.', 400, 'confirm');
    const v = await this.store.get(K.configV, String(b.versionId || '')); if (!v || v.key !== 'features') bad('Version not found.', 404, 'not_found');
    const target = v.before; if (!target) bad('That was the first version; there is nothing before it to go back to.', 409);
    const before = await this.featureConfig();
    const cfg = await this.saveConfig('features', admin, { defaults: target.defaults || {}, kill: target.kill || {} }, before, 'Revert of version ' + v.version + ': ' + String(b.reason || '').slice(0, 200));
    const pub = await this.publishFeatures(cfg);
    await this.audit(admin, 'features.revert', { type: 'feature', id: 'config' }, pub.state === 'applied' ? 'ok' : 'failed', { revertedVersion: v.version, newVersion: cfg.version });
    for (const i of await this.store.all(C.inst)) await this.markSyncPending(i.id);
    return { result: pub.state, version: cfg.version };
  },

  /* ── configuration sync to institution servers ── */
  async syncPayload(inst) {
    const cfg = await this.featureConfig();
    const ctx = { kind: 'institution', entitled: inst.entitlement ? inst.entitlement.features : null, overrides: inst.featureOverrides || {} };
    const eff = effective(cfg, ctx); const features = Object.fromEntries(Object.entries(eff).map(([k, v]) => [k, v.on]));
    const settings = await this.settings();
    const now = this.now();
    const anns = (await this.store.all(K.ann)).filter(a => a.status === 'published' && (!a.endAt || a.endAt > now) && (a.audience === 'everyone' || (a.audience === 'institutions' && (a.institutionIds || []).includes(inst.id))) && settings.announcements.enabled !== false)
      .map(a => ({ id: a.id, heading: a.heading, body: a.body, link: a.link || null, category: a.category, priority: a.priority, mode: a.mode, startAt: a.startAt || null, endAt: a.endAt || null, updatedAt: a.updatedAt }));
    const msgs = (await this.store.all(K.msgs)).filter(m => m.status === 'published' && m.institutionId === inst.id && (!m.expiresAt || m.expiresAt > now))
      .map(m => ({ id: m.id, subject: m.subject, body: m.body, priority: m.priority, link: m.link || null, visibleFrom: m.visibleFrom || null, expiresAt: m.expiresAt || null,
        to: m.recipients.kind === 'institution-all' ? 'all' : (m.recipients.emails || []), sentAt: m.sentAt }));
    return { features, limits: inst.entitlement ? inst.entitlement.limits : { maxTeachers: null, maxActiveExams: null }, plan: inst.entitlement ? { id: inst.entitlement.planId, name: inst.entitlement.planName, version: inst.entitlement.version } : null,
      settings: { maintenance: settings.platform.maintenance, supportEmail: settings.platform.supportEmail, exam: settings.exam, files: settings.files },
      announcements: anns, messages: msgs };
  },
  syncVersionOf(p) { return crypto.createHash('sha256').update(canonical(p)).digest('base64url').slice(0, 24); },
  async markSyncPending(instId) {
    const inst = await this.store.get(C.inst, instId); if (!inst) return;
    const v = this.syncVersionOf(await this.syncPayload(inst));
    const s = { ...(inst.sync || {}) };
    if (s.currentVersion === v) return;
    s.currentVersion = v; s.changedAt = this.now();
    s.pendingSince = s.appliedVersion === v ? null : (s.pendingSince || this.now());
    await this.store.set(C.inst, inst.id, { ...(await this.store.get(C.inst, instId)), sync: s });
  },
  async syncState(instId) {
    const inst = await this.store.get(C.inst, instId); const s = inst && inst.sync || {};
    const registered = !!(inst && inst.server && inst.server.serverId && !inst.server.reset);
    return { registered, currentVersion: s.currentVersion || null, appliedVersion: s.appliedVersion || null, pending: !!s.currentVersion && s.appliedVersion !== s.currentVersion,
      pendingSince: s.pendingSince || null, appliedAt: s.appliedAt || null, error: s.error || null, lastSeenAt: inst && inst.server && inst.server.lastSeenAt || null };
  },
  /** Called for every check-in: the signed sync bundle, plus the roster when the server's copy is older. */
  async syncFor(inst) {
    const payload = await this.syncPayload(inst);
    const v = this.syncVersionOf(payload);
    const s = { ...(inst.sync || {}) };
    if (s.currentVersion !== v) { s.currentVersion = v; s.changedAt = this.now(); s.pendingSince = s.appliedVersion === v ? null : this.now(); await this.store.set(C.inst, inst.id, { ...(await this.store.get(C.inst, inst.id)), sync: s }); }
    const out = { version: v, ...payload };
    const reported = inst.server && Number.isFinite(inst.server.allowlistVersion) ? inst.server.allowlistVersion : 0;
    if ((inst.allowlistVersion || 0) > reported) {
      const al = await this.store.get(C.allow, inst.id);
      if (al) out.allowlist = { version: al.version, teachers: al.teachers };
    }
    return out;
  }
};
module.exports = { methods, RULES_MARKER };
