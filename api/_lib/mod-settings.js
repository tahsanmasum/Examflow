'use strict';
/* Global settings: only what ExamFlow really uses. Every save is validated,
   versioned (cpConfigVersions keeps before and after, who and why) and can be
   rolled back. The public part is published to meta/settings for the app;
   security values never leave the server. Values that would weaken security
   need a typed confirmation and are bounded so they can't be switched off. */
const { CPError, C } = require('./cp');
const K = { config: 'cpConfig', configV: 'cpConfigVersions' };
const bad = (m, s, c) => { throw new CPError(m, s, c); };

const DEFAULT_SETTINGS = {
  platform: { maintenance: { on: false, text: '', level: 'info' }, supportEmail: 'examflow.live@gmail.com' },
  exam: { defaultMcqDurationMin: 45, defaultWrittenDurationMin: 90, defaultMcqMarks: 1, defaultShuffleQ: true, defaultShuffleO: true },
  security: { reauthMinutes: 15, inviteExpiryDays: 7, instRateLimitPerMin: 120 },
  files: { readerMaxMB: 25, readerMaxPages: 30, readerFormats: { photos: true, pdf: true, word: true, csv: true } },
  licence: { defaultDuration: '1y', warnSchedule: [30, 7, 1], graceDays: 0 },
  announcements: { enabled: true }
};
/* What each setting is and how it is checked. weakens(before, after) → true when the change lowers protection. */
const SCHEMA = {
  'platform.maintenance.on': { type: 'bool', label: 'Show a maintenance notice', where: 'Every page of the app (cloud and institutions)' },
  'platform.maintenance.text': { type: 'text', max: 300, label: 'Maintenance notice text' },
  'platform.maintenance.level': { type: 'enum', values: ['info', 'warning', 'critical'], label: 'Notice level' },
  'platform.supportEmail': { type: 'email', label: 'Support email shown to users' },
  'exam.defaultMcqDurationMin': { type: 'int', min: 5, max: 600, label: 'Default MCQ exam duration (minutes)', where: 'Pre-filled in the Create exam form (MCQ)' },
  'exam.defaultWrittenDurationMin': { type: 'int', min: 5, max: 600, label: 'Default written exam duration (minutes)', where: 'Pre-filled in the Create exam form (written)' },
  'exam.defaultMcqMarks': { type: 'num', min: 0.25, max: 100, label: 'Default marks per MCQ', where: 'Pre-filled in the Create exam forms' },
  'exam.defaultShuffleQ': { type: 'bool', label: 'Shuffle questions by default' },
  'exam.defaultShuffleO': { type: 'bool', label: 'Shuffle options by default' },
  'security.reauthMinutes': { type: 'int', min: 5, max: 60, label: 'Admins must have signed in within (minutes) for sensitive changes', weakens: (a, b) => b > a },
  'security.inviteExpiryDays': { type: 'int', min: 1, max: 30, label: 'Invitations count as expired after (days)', weakens: (a, b) => b > a },
  'security.instRateLimitPerMin': { type: 'int', min: 30, max: 600, label: 'Institution server requests allowed per minute', weakens: (a, b) => b > a },
  'files.readerMaxMB': { type: 'int', min: 1, max: 100, label: 'Largest file the paper reader accepts (MB)', where: 'Checked in the teacher\'s browser: papers are read there and never uploaded' },
  'files.readerMaxPages': { type: 'int', min: 1, max: 60, label: 'Most pages read from one file' },
  'files.readerFormats.photos': { type: 'bool', label: 'Accept photos (JPG, PNG)' },
  'files.readerFormats.pdf': { type: 'bool', label: 'Accept PDF' },
  'files.readerFormats.word': { type: 'bool', label: 'Accept Word (.doc, .docx)' },
  'files.readerFormats.csv': { type: 'bool', label: 'Accept CSV / JSON question banks' },
  'licence.defaultDuration': { type: 'enum', values: ['1m', '2m', '3m', '4m', '6m', '1y', '2y'], label: 'Default licence length' },
  'licence.warnSchedule': { type: 'intlist', min: 1, max: 120, maxItems: 5, label: 'Expiry warnings (days before expiry)' },
  'licence.graceDays': { type: 'int', min: 0, max: 30, label: 'Default grace period after expiry (days)' },
  'announcements.enabled': { type: 'bool', label: 'Show announcements at all (master switch)' }
};
const getPath = (o, p) => p.split('.').reduce((x, k) => x == null ? x : x[k], o);
const setPath = (o, p, v) => { const ks = p.split('.'); let x = o; for (let i = 0; i < ks.length - 1; i++) { x[ks[i]] = { ...(x[ks[i]] || {}) }; x = x[ks[i]]; } x[ks[ks.length - 1]] = v; };
function merge(def, cur) { const o = JSON.parse(JSON.stringify(def)); for (const p of Object.keys(SCHEMA)) { const v = getPath(cur || {}, p); if (v !== undefined) setPath(o, p, v); } return o; }
function check(p, v) {
  const s = SCHEMA[p]; if (!s) bad('Unknown setting: ' + p);
  const fail = m => bad(`${s.label}: ${m}`);
  switch (s.type) {
    case 'bool': if (typeof v !== 'boolean') fail('must be on or off.'); return v;
    case 'text': if (typeof v !== 'string' || v.length > s.max) fail(`up to ${s.max} characters.`); return v.replace(/[<>]/g, '');
    case 'email': if (typeof v !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) fail('enter a valid email.'); return v.toLowerCase();
    case 'enum': if (!s.values.includes(v)) fail('choose one of ' + s.values.join(', ') + '.'); return v;
    case 'int': { const n = Number(v); if (!Number.isInteger(n) || n < s.min || n > s.max) fail(`a whole number from ${s.min} to ${s.max}.`); return n; }
    case 'num': { const n = Number(v); if (!Number.isFinite(n) || n < s.min || n > s.max) fail(`a number from ${s.min} to ${s.max}.`); return n; }
    case 'intlist': { if (!Array.isArray(v) || !v.length || v.length > s.maxItems) fail(`1 to ${s.maxItems} values.`);
      const a = Array.from(new Set(v.map(Number))); if (a.some(n => !Number.isInteger(n) || n < s.min || n > s.max)) fail(`whole numbers from ${s.min} to ${s.max}.`); return a.sort((x, y) => y - x); }
  }
  fail('invalid.');
}
function publicSettings(v) { return { platform: v.platform, exam: v.exam, files: v.files, announcements: v.announcements }; }

const methods = {
  async x_settings_get() {
    const cur = await this.store.get(K.config, 'settings');
    const values = merge(DEFAULT_SETTINGS, cur && cur.values);
    const hist = (await this.store.all(K.configV)).filter(v => v.key === 'settings').sort((a, b) => b.t - a.t).slice(0, 50)
      .map(h => ({ id: 'settings_' + h.version, version: h.version, by: h.by, t: h.t, reason: h.reason, changes: h.changes || [] }));
    return { values, version: cur ? cur.version : 0, schema: SCHEMA, defaults: DEFAULT_SETTINGS, history: hist, published: await this.platform.readMeta('settings'),
      notAvailable: [{ name: 'Default language', why: 'ExamFlow has one interface language today.' }, { name: 'Public platform name', why: 'The name is part of the branded page; change it with a site update.' },
        { name: 'Password policy', why: 'Passwords are managed by Firebase Authentication (Firebase console → Authentication → Settings).' }] };
  },
  diff(before, changes) {
    const out = [];
    for (const [p, raw] of Object.entries(changes || {})) {
      const v = check(p, raw); const old = getPath(before, p);
      if (JSON.stringify(old) === JSON.stringify(v)) continue;
      const s = SCHEMA[p]; out.push({ path: p, label: s.label, before: old, after: v, weakens: !!(s.weakens && s.weakens(old, v)), where: s.where || null });
    }
    return out;
  },
  async x_settings_preview(admin, b) {
    const cur = await this.store.get(K.config, 'settings'); const values = merge(DEFAULT_SETTINGS, cur && cur.values);
    const d = this.diff(values, b.changes);
    return { changes: d, weakens: d.some(x => x.weakens), scope: d.some(x => /^(platform|exam|files|announcements)/.test(x.path)) ? 'Every cloud user and every institution (at its next check-in)' : 'Admin Monitor and server behaviour only' };
  },
  async x_settings_save(admin, b) {
    if (b.confirm !== true) bad('Review and confirm first.', 400, 'confirm');
    const reason = String(b.reason || '').trim(); if (!reason) bad('Give a reason for the change.');
    const cur = await this.store.get(K.config, 'settings');
    if (Number(b.baseVersion || 0) !== (cur ? cur.version : 0)) bad('Settings changed since you opened them. Reload and check again.', 409, 'stale');
    const before = merge(DEFAULT_SETTINGS, cur && cur.values);
    const d = this.diff(before, b.changes);
    if (!d.length) return { unchanged: true, version: cur ? cur.version : 0 };
    if (d.some(x => x.weakens) && b.confirmWeaken !== 'WEAKEN') bad('This change lowers a security protection. Type WEAKEN to confirm it.', 400, 'confirm_weaken');
    const values = JSON.parse(JSON.stringify(before)); for (const c of d) setPath(values, c.path, c.after);
    return this.commitSettings(admin, cur, values, d, reason);
  },
  async commitSettings(admin, cur, values, changes, reason) {
    const version = (cur ? cur.version : 0) + 1; const now = this.now();
    await this.store.set(K.config, 'settings', { values, version, updatedAt: now, updatedBy: admin.email });
    await this.store.set(K.configV, 'settings_' + version, { key: 'settings', version, before: cur ? cur.values : null, after: values, changes, reason, by: admin.email, t: now });
    let pub = 'applied', error = null;
    try { await this.platform.writeMeta('settings', { v: version, updatedAt: now, ...publicSettings(values) }); const back = await this.platform.readMeta('settings'); if (!back || back.v !== version) { pub = 'failed'; error = 'could not read it back'; } }
    catch (e) { pub = 'failed'; error = e.message; await this.errorEvent('settings', 'publish', e, admin); }
    await this.audit(admin, 'settings.save', { type: 'settings', id: 'v' + version }, pub === 'applied' ? 'ok' : 'failed', { changes, reason, error });
    if (changes.some(c => /^(platform|exam|files|announcements)/.test(c.path))) for (const i of await this.store.all(C.inst)) await this.markSyncPending(i.id);
    return { version, result: pub, error, changes, message: pub === 'applied' ? `Saved as version ${version} and applied to the cloud app. Institutions apply it at their next check-in.` : `Saved as version ${version}, but publishing to the app failed (${error}). Cloud users still have the previous values.` };
  },
  async x_settings_rollback(admin, b) {
    if (b.confirm !== true) bad('Confirm first.', 400, 'confirm');
    const v = await this.store.get(K.configV, String(b.versionId || '')); if (!v || v.key !== 'settings') bad('Version not found.', 404, 'not_found');
    const cur = await this.store.get(K.config, 'settings');
    const target = merge(DEFAULT_SETTINGS, v.before || {});
    const before = merge(DEFAULT_SETTINGS, cur && cur.values);
    const changes = []; for (const p of Object.keys(SCHEMA)) { const a = getPath(before, p), c = getPath(target, p); if (JSON.stringify(a) !== JSON.stringify(c)) changes.push({ path: p, label: SCHEMA[p].label, before: a, after: c, weakens: !!(SCHEMA[p].weakens && SCHEMA[p].weakens(a, c)) }); }
    if (!changes.length) return { unchanged: true };
    if (changes.some(x => x.weakens) && b.confirmWeaken !== 'WEAKEN') bad('Rolling back lowers a security protection. Type WEAKEN to confirm it.', 400, 'confirm_weaken');
    return this.commitSettings(admin, cur, target, changes, 'Rollback of version ' + v.version + (b.reason ? ': ' + String(b.reason).slice(0, 200) : ''));
  }
};
module.exports = { methods, DEFAULT_SETTINGS, SCHEMA, merge };
