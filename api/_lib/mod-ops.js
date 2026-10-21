'use strict';
/* Overview metrics, system health, security center, audit logs, reports and
   cloud activity. Every number comes from a real query or a real report; a
   metric that can't be measured is returned as null with a reason, never
   made up. */
const { CPError, C } = require('./cp');
const { FEATURES, effective } = require('./features-core');
const { licenceStatus, msToDhakaDate } = require('./licence-core');
const { annState } = require('./mod-comms');
const K = { users: 'cpUserMeta', invites: 'cpInvites', ann: 'cpAnnouncements', errors: 'cpErrors', security: 'cpSecurity', events: 'cpEvents', sessions: 'cpAdminSessions',
  alerts: 'cpAlerts', admins: 'cpAdmins', plans: 'cpPlans', msgs: 'cpMessages', config: 'cpConfig' };
const bad = (m, s, c) => { throw new CPError(m, s, c); };
const DAY = 86400000, HOUR = 3600000;

/** Health of an institution's server, from its own reports only.
    Healthy: reported within 3 check-in intervals, database ok, last config sync ok.
    Degraded: reporting, but its database or the last config sync reported a problem.
    Unknown: no report for longer than 3 intervals but less than 24 hours (could be offline or a network block; not confirmed).
    Offline: no report for over 24 hours.
    Not connected: no server has registered (or its registration was reset). */
function serverHealth(inst, now) {
  const s = inst.server;
  if (!s || !s.serverId) return { state: 'Not connected', why: 'No server has registered yet.' };
  if (s.reset) return { state: 'Not connected', why: 'The registration was reset; waiting for the server to register again.' };
  const interval = (s.interval || 300) * 1000;
  const age = s.lastSeenAt ? now - s.lastSeenAt : Infinity;
  if (age <= 3 * interval) {
    if (s.health && s.health.db && s.health.db !== 'ok') return { state: 'Degraded', why: 'The server reports its database as "' + s.health.db + '".', lastSeenAt: s.lastSeenAt };
    if (inst.sync && inst.sync.error) return { state: 'Degraded', why: 'The last configuration sync failed: ' + inst.sync.error, lastSeenAt: s.lastSeenAt };
    return { state: 'Healthy', why: 'Reported ' + Math.round(age / 60000) + ' min ago.', lastSeenAt: s.lastSeenAt };
  }
  if (age <= DAY) return { state: 'Unknown', why: 'No report for ' + Math.round(age / 60000) + ' min. It may be offline or blocked from reaching GHUM; this is not a confirmed outage.', lastSeenAt: s.lastSeenAt };
  return { state: 'Offline', why: s.lastSeenAt ? 'No report for ' + Math.round(age / HOUR) + ' hours.' : 'Registered, but it has never reported.', lastSeenAt: s.lastSeenAt || null };
}

async function securityAlerts(con, now) {
  const since = now - DAY;
  const sec = (await con.store.all(K.security)).filter(e => e.t >= since);
  const acks = new Map((await con.store.all(K.alerts)).map(a => [a.id, a]));
  const out = [];
  const bucket = t => Math.floor(t / HOUR);
  const group = {};
  for (const e of sec.filter(e => e.kind === 'admin.denied')) { const k = (e.ip || '?') + '|' + bucket(e.t); (group[k] = group[k] || []).push(e); }
  for (const [k, list] of Object.entries(group)) if (list.length >= 5) out.push({ id: 'denied_' + k.replace(/[^A-Za-z0-9]/g, '_'), level: 'high', kind: 'Repeated refused sign-ins',
    text: `${list.length} refused Admin Monitor attempts from ${list[0].ip || 'an unknown address'} within an hour (${Array.from(new Set(list.map(x => x.email || 'no email'))).slice(0, 3).join(', ')}).`, t: list[list.length - 1].t });
  for (const e of sec.filter(e => e.kind === 'admin.newLocation')) out.push({ id: 'newloc_' + e.email.replace(/[^A-Za-z0-9]/g, '_') + '_' + bucket(e.t), level: 'medium', kind: 'Admin sign-in from a new address',
    text: `${e.email} opened the Admin Monitor from a new address (${e.ip || 'unknown'}).`, t: e.t });
  const risky = (await con.store.all(C.audit)).filter(a => a.risk === 'high' && a.t >= now - HOUR && a.result === 'ok');
  const by = {}; for (const a of risky) (by[a.actor] = by[a.actor] || []).push(a);
  for (const [who, list] of Object.entries(by)) if (list.length >= 10) out.push({ id: 'burst_' + String(who).replace(/[^A-Za-z0-9]/g, '_') + '_' + bucket(now), level: 'high', kind: 'Burst of high-risk changes',
    text: `${who} made ${list.length} high-risk changes in the last hour.`, t: list[0].t });
  return out.map(a => ({ ...a, acked: acks.has(a.id), ackedBy: acks.has(a.id) ? acks.get(a.id).by : null }));
}

function period(b, now) {
  if (b.from || b.to) {
    const from = Date.parse(b.from), to = b.to ? Date.parse(b.to) + DAY : now;
    if (!Number.isFinite(from) || !Number.isFinite(to) || to <= from) bad('Choose a valid date range.');
    if (to - from > 366 * DAY) bad('The range can be at most a year.');
    return { from, to, label: msToDhakaDate(from) + ' – ' + msToDhakaDate(to - 1) };
  }
  const days = [7, 30, 90].includes(Number(b.days)) ? Number(b.days) : 30;
  return { from: now - days * DAY, to: now, label: 'last ' + days + ' days', days };
}
function perDay(times, p) {
  const n = Math.min(Math.ceil((p.to - p.from) / DAY), 366); const out = [];
  for (let i = 0; i < n; i++) out.push({ day: msToDhakaDate(p.from + i * DAY), n: 0 });
  for (const t of times) { if (t == null || t < p.from || t >= p.to) continue; const i = Math.floor((t - p.from) / DAY); if (out[i]) out[i].n++; }
  return out;
}

const methods = {
  /* ── Overview ── */
  async x_overview_metrics(admin, b) {
    const now = this.now(); const p = period(b || {}, now);
    const can = x => this.can(admin, x);
    const out = { period: p, serverTime: now, definitions: {
      activeUser: 'Signed in or refreshed their sign-in in the last 30 days (Firebase Authentication).',
      activeExam: 'Published (not a draft, not in the trash) and open right now: its start time has passed and its end time has not.',
      activeLicence: 'Status Active, Expiring Soon or Grace Period (new exams allowed).' } };
    let users = null, exams = null;
    if (can('users.view')) {
      users = await this.platform.listUsers(); const metas = await this.store.all(K.users);
      const invites = await this.store.all(K.invites); const s = await this.settings();
      const sus = new Set(metas.filter(m => m.status === 'suspended').map(m => m.uid));
      const allows = await this.store.all(C.allow);
      out.users = { total: users.length, cloud: users.length, institutionRoster: allows.reduce((n, a) => n + (a.teachers || []).length, 0),
        active: users.filter(u => !u.disabled && Math.max(u.lastSignInAt || 0, u.lastActiveAt || 0) >= now - 30 * DAY).length,
        suspended: users.filter(u => sus.has(u.uid)).length, disabled: users.filter(u => u.disabled && !sus.has(u.uid)).length,
        newInPeriod: users.filter(u => u.createdAt >= p.from && u.createdAt < p.to).length,
        pendingInvites: invites.filter(i => { const u = users.find(x => x.uid === i.uid); return u && !u.lastSignInAt && i.status === 'Sent' && (i.sentAt || 0) + s.security.inviteExpiryDays * DAY > now; }).length };
    }
    if (can('activity.view') || can('overview.view')) {
      try {
        exams = await this.platform.exams();
        const live = exams.filter(e => !e.trashed && !e.draft && e.startTime && e.startTime <= now && (e.endTime > now || e.reopened));
        out.exams = { total: exams.filter(e => !e.trashed).length, activeNow: live.length, createdInPeriod: exams.filter(e => e.createdAt >= p.from && e.createdAt < p.to).length };
      } catch (e) { out.exams = { unavailable: 'Could not read exams: ' + e.message }; }
    }
    if (can('institutions.view') || can('licences.view')) {
      const insts = await this.store.all(C.inst); const st = insts.map(i => ({ i, l: this.cp.view(i, now).licenceState, h: serverHealth(i, now) }));
      const c = s => st.filter(x => x.l.status === s).length;
      out.institutions = { total: insts.length, activeLicences: st.filter(x => x.l.canCreateExams).length, expiringSoon: c('Expiring Soon'), grace: c('Grace Period'), expired: c('Expired'),
        suspended: c('Suspended') + c('Revoked'), pending: c('Pending'), notSet: c('Not set'),
        health: ['Healthy', 'Degraded', 'Unknown', 'Offline', 'Not connected'].reduce((o, k) => (o[k] = st.filter(x => x.h.state === k).length, o), {}),
        syncPending: insts.filter(i => i.sync && i.sync.currentVersion && i.sync.appliedVersion !== i.sync.currentVersion && i.server && i.server.serverId).length,
        versions: insts.filter(i => i.server && i.server.serverVersion).map(i => ({ id: i.id, name: i.name, serverVersion: i.server.serverVersion, packageVersion: i.server.packageVersion, lastSeenAt: i.server.lastSeenAt })),
        upcoming: st.filter(x => Number.isFinite(x.i.licence && x.i.licence.expiresAt) && x.i.licence.expiresAt > now && x.i.licence.expiresAt - now <= 60 * DAY)
          .sort((a, b2) => a.i.licence.expiresAt - b2.i.licence.expiresAt).map(x => ({ id: x.i.id, name: x.i.name, expiryDate: x.l.expiryDate, remainingDays: x.l.remainingDays, status: x.l.status })),
        serverRows: st.map(x => ({ id: x.i.id, name: x.i.name, state: x.h.state, why: x.h.why, lastSeenAt: x.h.lastSeenAt || null })) };
    }
    if (can('announcements.view')) { const anns = (await this.store.all(K.ann)).map(a => ({ ...a, state: annState(a, now) }));
      out.announcements = { live: anns.filter(a => a.state === 'Live').length, scheduled: anns.filter(a => a.state === 'Scheduled').length,
        recent: anns.filter(a => a.publishedAt).sort((a, c) => c.publishedAt - a.publishedAt).slice(0, 5).map(a => ({ id: a.id, heading: a.heading, state: a.state, publishedAt: a.publishedAt, audience: a.audience })) }; }
    if (can('audit.view')) { const au = (await this.store.all(C.audit)).filter(a => a.t >= p.from && a.t < p.to);
      out.admin = { actions: au.length, failed: au.filter(a => a.result === 'failed' || a.result === 'denied').length,
        recent: au.sort((a, c) => c.t - a.t).slice(0, 8).map(a => ({ t: a.t, actor: a.actor, action: a.action, target: a.target, result: a.result })) }; }
    if (can('health.view')) out.errors = { inPeriod: (await this.store.all(K.errors)).filter(e => e.t >= p.from && e.t < p.to).length };
    if (can('security.view')) out.security = { openAlerts: (await securityAlerts(this, now)).filter(a => !a.acked).length };
    out.charts = {};
    if (users) out.charts.signups = perDay(users.map(u => u.createdAt), p);
    if (exams) out.charts.exams = perDay(exams.map(e => e.createdAt), p);
    if (out.admin) out.charts.adminActions = perDay((await this.store.all(C.audit)).map(a => a.t), p);
    return out;
  },

  /* ── Institutions (wrappers over cp.js that add packages, limits, sync and settings defaults) ── */
  async x_overview(admin, b) {
    const r = await this.cp.act(this.cpActor(admin), { action: 'overview' });
    const insts = new Map((await this.store.all(C.inst)).map(i => [i.id, i])); const now = this.now();
    r.institutions = r.institutions.map(x => { const i = insts.get(x.id) || {}; return { ...x, contact: i.contact || null, plan: i.entitlement ? { id: i.entitlement.planId, name: i.entitlement.planName, version: i.entitlement.version } : null,
      health: serverHealth(i, now), sync: i.sync ? { pending: !!i.sync.currentVersion && i.sync.appliedVersion !== i.sync.currentVersion, appliedAt: i.sync.appliedAt || null } : null }; });
    const s = await this.settings(); r.licenceDefaults = s.licence; r.perms = admin.perms;
    return r;
  },
  async x_inst_get(admin, b) {
    const r = await this.cp.act(this.cpActor(admin), { action: 'inst.get', id: b.id });
    const i = await this.store.get(C.inst, r.institution.id); const now = this.now();
    r.entitlement = i.entitlement || null; r.featureOverrides = i.featureOverrides || {}; r.health = serverHealth(i, now); r.sync = await this.syncState(i.id);
    const cfg = await this.featureConfig(); r.effectiveFeatures = effective(cfg, { kind: 'institution', entitled: i.entitlement ? i.entitlement.features : null, overrides: i.featureOverrides || {} });
    r.features = FEATURES; r.plans = (await this.plans()).map(p => ({ id: p.id, name: p.name, version: p.version, status: p.status }));
    r.messages = (await this.store.all(K.msgs)).filter(m => m.institutionId === i.id).sort((a, c) => c.sentAt - a.sentAt).slice(0, 20).map(m => ({ id: m.id, subject: m.subject, sentAt: m.sentAt, label: m.recipients.label, status: m.status }));
    r.announcements = (await this.store.all(K.ann)).filter(a => a.audience === 'everyone' || (a.audience === 'institutions' && (a.institutionIds || []).includes(i.id))).map(a => ({ id: a.id, heading: a.heading, state: annState(a, now), audience: a.audience }));
    r.cloudMembers = (await this.store.all(K.users)).filter(m => m.institutionId === i.id).length;
    r.events = (await this.store.all(K.events)).filter(e => e.institutionId === i.id).sort((a, c) => c.t - a.t).slice(0, 50);
    r.licenceDefaults = (await this.settings()).licence; r.perms = admin.perms;
    return r;
  },
  async x_inst_create(admin, b) {
    const deployment = b.deploymentType || 'institution-hosted';
    if (deployment !== 'institution-hosted') bad('Only institution-hosted deployments are supported today. GHUM-managed hosting is not available yet.', 400, 'unsupported');
    const r = await this.cp.act(this.cpActor(admin), { ...b, action: 'inst.create' });
    const id = r.institution.id;
    if (b.planId) { this.need(admin, 'packages.assign'); await this.x_plans_assign(admin, { id, planId: b.planId, confirm: true }); }
    if (b.licence && b.licence.duration) { this.need(admin, 'licences.manage'); await this.x_licence_set(admin, { ...b.licence, id, confirm: true }); }
    await this.markSyncPending(id);
    return { institution: (await this.x_inst_get(admin, { id })).institution, checklist: (await this.x_inst_readiness(admin, { id })).checklist };
  },
  /** Setup checklist: each item is checked against real records, never assumed. */
  async x_inst_readiness(admin, b) {
    const i = await this.cp.instOr404(b.id); const now = this.now();
    const al = await this.store.get(C.allow, i.id) || { teachers: [] };
    const pk = (await this.store.where(C.pkg, 'institutionId', i.id)).sort((a, c) => c.seq - a.seq)[0];
    const L = this.cp.view(i, now).licenceState; const h = serverHealth(i, now); const sy = await this.syncState(i.id);
    const items = [
      { key: 'contact', label: 'Contact and technical contact recorded', ok: !!(i.contact && i.contact.email && i.technicalContact && i.technicalContact.email) },
      { key: 'plan', label: 'Package (entitlements) assigned', ok: !!i.entitlement, detail: i.entitlement ? i.entitlement.planName + ' v' + i.entitlement.version : null },
      { key: 'roster', label: 'Teacher roster imported', ok: al.teachers.length > 0, detail: al.teachers.length + ' teachers' },
      { key: 'licence', label: 'Licence set', ok: !!(i.licence && Number.isFinite(i.licence.expiresAt)), detail: L.status },
      { key: 'install', label: 'Install package generated', ok: !!pk, detail: pk ? pk.version + ' · ' + pk.adminStatus : null },
      { key: 'server', label: 'Server registered and reporting', ok: h.state === 'Healthy', detail: h.state + ' — ' + h.why },
      { key: 'sync', label: 'Server has applied the current configuration', ok: sy.registered && !sy.pending, detail: !sy.registered ? 'No server yet' : sy.pending ? 'Waiting for the server' : 'Up to date' },
      { key: 'active', label: 'Licence allows exams now', ok: !!L.canCreateExams, detail: L.status }
    ];
    return { checklist: items, ready: items.every(x => x.ok) };
  },
  async x_allowlist_save(admin, b) {
    const i = await this.cp.instOr404(b.id);
    const max = i.entitlement && i.entitlement.limits && i.entitlement.limits.maxTeachers;
    if (max && Array.isArray(b.teachers) && b.teachers.length > max) bad(`${i.name}'s package (${i.entitlement.planName}) allows ${max} teachers; this list has ${b.teachers.length}. Remove some, or assign a larger package.`, 409, 'limit');
    const r = await this.cp.act(this.cpActor(admin), { ...b, action: 'allowlist.save' });
    if (!r.unchanged) await this.markSyncPending(i.id);
    return { ...r, sync: await this.syncState(i.id) };
  },
  async licenceDefaults(b) { const s = await this.settings(); return { ...b, _defaultGraceDays: s.licence.graceDays, _defaultWarnDays: Math.max(...s.licence.warnSchedule) }; },
  async x_licence_set(admin, b) { const r = await this.cp.act(this.cpActor(admin), { ...(await this.licenceDefaults(b)), action: 'licence.set' }); await this.markSyncPending(b.id); return { ...r, sync: await this.syncState(b.id) }; },
  async x_licence_renew(admin, b) { const r = await this.cp.act(this.cpActor(admin), { ...(await this.licenceDefaults(b)), action: 'licence.renew' }); return { ...r, sync: await this.syncState(b.id) }; },
  async x_licence_reactivate(admin, b) { return this.cp.act(this.cpActor(admin), { ...b, action: 'licence.reactivate', _mayUnrevoke: this.can(admin, 'licences.revoke') }); },
  async x_licence_unblock(admin, b) { return this.x_licence_reactivate(admin, b); },
  async x_licence_list(admin, b) {
    const now = this.now(); const insts = await this.store.all(C.inst); const ev = await this.store.all(C.lic);
    const rows = insts.map(i => { const v = this.cp.view(i, now).licenceState; return { id: i.id, name: i.name, ...v, plan: i.entitlement ? i.entitlement.planName : null, events: ev.filter(e => e.institutionId === i.id).length,
      lastEvent: ev.filter(e => e.institutionId === i.id).sort((a, c) => c.t - a.t)[0] || null, activation: i.licence && i.licence.activation || null }; });
    const s = await this.settings();
    return { licences: rows, defaults: s.licence, durations: require('./licence-core').DURATIONS, statuses: require('./licence-core').STATUSES,
      transitions: { set: 'Not set or Pending → Pending / Active', renew: 'Active, Expiring Soon, Grace Period, Expired, Pending → new term (Suspended stays suspended)', suspend: 'any except Revoked → Suspended',
        reactivate: 'Suspended → status from the dates', revoke: 'any → Revoked', unrevoke: 'Revoked → status from the dates (needs licences.revoke)' },
      renewalRule: 'Active, Expiring Soon or Pending: extend from the current expiry (or start a new term from today or a date). Grace Period or Expired: a new term from today or a chosen date. The new term can\'t end sooner than the current one.' };
  },

  /* ── System health ── */
  async x_health_get(admin) {
    const now = this.now(); const checks = [];
    const t0 = Date.now(); checks.push({ name: 'Control plane API', state: 'Healthy', detail: 'This request reached the server.' });
    try { const ms = await this.platform.ping(); checks.push({ name: 'Firestore (your Firebase database)', state: ms < 2000 ? 'Healthy' : 'Degraded', detail: 'Read in ' + ms + ' ms.' }); }
    catch (e) { checks.push({ name: 'Firestore (your Firebase database)', state: 'Degraded', detail: e.message }); }
    try { const ms = await this.platform.authPing(); checks.push({ name: 'Firebase Authentication', state: ms < 2000 ? 'Healthy' : 'Degraded', detail: 'Answered in ' + ms + ' ms.' }); }
    catch (e) { checks.push({ name: 'Firebase Authentication', state: 'Degraded', detail: e.message }); }
    checks.push({ name: 'Package and licence signing key', state: this.cp.keys && this.cp.keys.privatePem ? 'Healthy' : 'Not connected', detail: this.cp.keys && this.cp.keys.privatePem ? 'Loaded. Fingerprint ' + this.cp.fingerprint : 'GHUM_SIGNING_PRIVATE_KEY is not set on Vercel.' });
    const base = this.cp.env && this.cp.env.publicBaseUrl;
    checks.push({ name: 'Public address for institution servers', state: base ? 'Healthy' : 'Not connected', detail: base || 'PUBLIC_BASE_URL is not set.' });
    const rules = await this.rulesEnforce();
    checks.push({ name: 'Firestore rules (v47 feature checks)', state: rules === 'yes' ? 'Healthy' : rules === 'no' ? 'Degraded' : 'Unknown', detail: rules === 'yes' ? 'Published rules include the v47 feature checks.' : rules === 'no' ? 'Published rules are older than v47: feature switches are only hidden in the app until you publish firestore.rules.' : 'Could not read the published rules (the service account may lack the Firebase Rules viewer role).' });
    const env = this.env || {};
    const deploy = { environment: env.VERCEL_ENV || null, commit: env.VERCEL_GIT_COMMIT_SHA ? env.VERCEL_GIT_COMMIT_SHA.slice(0, 7) : null, branch: env.VERCEL_GIT_COMMIT_REF || null,
      message: env.VERCEL_GIT_COMMIT_MESSAGE ? env.VERCEL_GIT_COMMIT_MESSAGE.slice(0, 120) : null, url: env.VERCEL_URL || null, deploymentId: env.VERCEL_DEPLOYMENT_ID || null,
      note: env.VERCEL_ENV ? null : 'Vercel deployment details are not available (they are filled in automatically on Vercel).' };
    let frontend = null;
    if (base && this.fetchImpl) { try { const r = await this.fetchImpl(base + '/', { headers: { range: 'bytes=0-30000' } }); const t = await r.text(); const m = /name="examflow-version" content="([^"]+)"/.exec(t); frontend = m ? m[1] : 'not found'; } catch (e) { frontend = 'could not fetch: ' + e.message; } }
    let sw = null; try { sw = require('./builder').softwareInfo(this.cp.sw()); } catch (e) { sw = { error: e.message }; }
    const insts = await this.store.all(C.inst);
    const servers = insts.map(i => { const h = serverHealth(i, now); return { id: i.id, name: i.name, ...h, serverVersion: i.server && i.server.serverVersion || null, packageVersion: i.server && i.server.packageVersion || null,
      compatible: !i.server || !i.server.serverVersion ? null : sw && sw.serverVersion ? (String(i.server.serverVersion).split('.')[0] === String(sw.serverVersion).split('.')[0]) : null,
      needsMaintenance: !!(i.server && i.server.serverVersion && sw && sw.serverVersion && i.server.serverVersion !== sw.serverVersion), sync: i.sync || null }; });
    const errors = (await this.store.all(K.errors)).sort((a, b) => b.t - a.t).slice(0, 50);
    const failed = (await this.store.all(C.audit)).filter(a => a.result === 'failed').sort((a, b) => b.t - a.t).slice(0, 30);
    const events = (await this.store.all(K.events)).sort((a, b) => b.t - a.t).slice(0, 100);
    return { checks, deploy, frontendVersion: frontend, software: sw, servers, errors, failedOps: failed, events, serverTime: now, tookMs: Date.now() - t0,
      definitions: { Healthy: 'Reported within 3 check-in intervals; database and last configuration sync OK.', Degraded: 'Reporting, but something it reports is wrong.', Unknown: 'No report for more than 3 intervals but less than 24 hours. Not a confirmed outage.', Offline: 'No report for over 24 hours.', 'Not connected': 'No server registered.' },
      policy: { frontend: 'The app itself updates through GitHub → Vercel, for cloud users and every institution app that loads it.', configuration: 'Feature switches, settings, announcements and messages reach institution servers in their signed check-in; this page shows whether each has applied them.', backend: 'Institution server software changes only when their IT installs a new install package. Nothing here downloads or installs code on their server.' } };
  },

  /* ── Security center ── */
  async x_security_get(admin) {
    const now = this.now(); const roles = await this.customRoles();
    const team = (await this.x_admins_list(admin)); const all = [...team.owners, ...team.team.filter(a => a.status === 'active')];
    const mfa = []; for (const a of all) { const u = await this.platform.getUserByEmail(a.email);
      mfa.push({ email: a.email, role: a.roleName, account: !!u, verified: u ? u.emailVerified : null, providers: u ? u.providers : [], factors: u ? u.mfaFactors : [],
        note: !u ? 'No account yet.' : u.mfaFactors.length ? 'Second factor enrolled in Firebase.' : u.providers.includes('google.com') ? 'Signs in with Google: 2-step verification is managed in the Google account and isn\'t visible to ExamFlow.' : 'Password only, no second factor. Use Google sign-in with 2-step verification for admins.' }); }
    const sessions = (await this.store.all(K.sessions)).filter(s => now - (s.lastAt || 0) < 30 * DAY).sort((a, b) => b.lastAt - a.lastAt);
    const sec = (await this.store.all(K.security)).filter(e => now - e.t < 7 * DAY).sort((a, b) => b.t - a.t);
    const denied = {}; for (const e of sec.filter(e => e.kind === 'admin.denied')) { const k = (e.email || 'no email') + ' · ' + (e.ip || '?'); denied[k] = denied[k] || { who: e.email || null, ip: e.ip || null, n: 0, last: 0, codes: {} }; denied[k].n++; denied[k].last = Math.max(denied[k].last, e.t); denied[k].codes[e.code] = (denied[k].codes[e.code] || 0) + 1; }
    const audit = await this.store.all(C.audit);
    const s = await this.settings(); const rules = await this.rulesEnforce(); const src = await this.platform.rulesSource();
    let rulesAdmins = null; if (typeof src === 'string') { const m = /function adminEmails\(\)\s*\{\s*return\s*\[([^\]]*)\]/.exec(src); if (m) rulesAdmins = (m[1].match(/'([^']+)'|"([^"]+)"/g) || []).map(x => x.replace(/['"]/g, '').toLowerCase()); }
    const review = [
      { item: 'Package signing key on the server only', ok: !!(this.cp.keys && this.cp.keys.privatePem), detail: 'Stored in Vercel environment variables, never sent to browsers.' },
      { item: 'Admin emails must be verified', ok: true, detail: 'Enforced on every Admin Monitor request.' },
      { item: 'Sensitive changes need a recent sign-in', ok: s.security.reauthMinutes <= 30, detail: 'Within ' + s.security.reauthMinutes + ' minutes.' },
      { item: 'Platform owners match the Firestore rules', ok: rulesAdmins ? this.owners.every(o => rulesAdmins.includes(o)) && rulesAdmins.every(o => this.owners.includes(o)) : null,
        detail: rulesAdmins ? 'Rules: ' + rulesAdmins.join(', ') + ' · Server: ' + this.owners.join(', ') : 'Could not read the published rules.' },
      { item: 'Firestore rules include the v47 feature checks', ok: rules === 'yes' ? true : rules === 'no' ? false : null, detail: rules === 'unknown' ? 'Could not read the published rules.' : '' },
      { item: 'Every owner signs in with a verified account', ok: mfa.filter(m => m.role === 'Platform Owner').every(m => m.verified), detail: '' }
    ];
    return { team: all.map(a => ({ email: a.email, role: a.roleName, perms: a.perms || null, lastSeenAt: a.lastSeenAt })), roles: team.roles, mfa, sessions, failedAuth: Object.values(denied).sort((a, b) => b.n - a.n).slice(0, 30),
      permissionDenials: sec.filter(e => e.kind === 'permission.denied').slice(0, 30), permissionChanges: audit.filter(a => /^(admins|roles)\./.test(a.action)).sort((a, b) => b.t - a.t).slice(0, 30),
      highRisk: audit.filter(a => a.risk === 'high').sort((a, b) => b.t - a.t).slice(0, 50), alerts: await securityAlerts(this, now), review, serverTime: now };
  },
  async x_security_revokeSession(admin, b) {
    if (b.confirm !== true) bad('Confirm first.', 400, 'confirm');
    const s = await this.store.get(K.sessions, String(b.id || '')); if (!s) bad('Session not found.', 404, 'not_found');
    if (s.email === admin.email) bad('Use "Sign out everywhere" in Admin Settings for your own sessions.', 403, 'self');
    if (this.owners.includes(s.email) && !admin.owner) bad('Only a platform owner can sign out an owner.', 403, 'owner_locked');
    for (const x of await this.store.where(K.sessions, 'email', s.email)) await this.store.set(K.sessions, x.id, { ...x, revokedAt: this.now(), revokedBy: admin.email });
    let tokens = 'revoked'; try { if (s.uid) await this.platform.revokeTokens(s.uid); } catch (e) { tokens = 'failed: ' + e.message; }
    await this.audit(admin, 'security.revokeSession', { type: 'admin', id: s.email }, tokens === 'revoked' ? 'ok' : 'failed', { sessionId: s.id, tokens });
    return { ok: true, note: 'Signed out of the Admin Monitor everywhere. Firebase sign-in tokens were ' + tokens + '; any other ExamFlow tab of theirs ends within about an hour.' };
  },
  async x_security_ackAlert(admin, b) {
    const idv = String(b.id || ''); if (!/^[A-Za-z0-9_.-]{3,120}$/.test(idv)) bad('Invalid alert.');
    await this.store.set(K.alerts, idv, { id: idv, by: admin.email, at: this.now(), note: String(b.note || '').slice(0, 300) });
    await this.audit(admin, 'security.ackAlert', { type: 'alert', id: idv }, 'ok', { note: b.note || null });
    return { ok: true };
  },

  /* ── Audit logs ── */
  async auditRows(b) {
    let rows = await this.store.all(C.audit);
    const from = b.from ? Date.parse(b.from) : null, to = b.to ? Date.parse(b.to) + DAY : null;
    if (from) rows = rows.filter(a => a.t >= from); if (to) rows = rows.filter(a => a.t < to);
    if (b.actor) rows = rows.filter(a => String(a.actor || '').toLowerCase().includes(String(b.actor).toLowerCase()));
    if (b.actionPrefix) rows = rows.filter(a => String(a.action || '').startsWith(b.actionPrefix));
    if (b.target) rows = rows.filter(a => String(a.target || '').includes(String(b.target)));
    if (b.institutionId) rows = rows.filter(a => a.institutionId === b.institutionId);
    if (b.result) rows = rows.filter(a => a.result === b.result);
    if (b.risk) rows = rows.filter(a => a.risk === b.risk);
    return rows.sort((x, y) => y.t - x.t);
  },
  async x_audit_list(admin, b) {
    const rows = await this.auditRows(b); const size = Math.min(Math.max(Number(b.pageSize) || 50, 10), 200), page = Math.max(Number(b.page) || 1, 1);
    return { rows: rows.slice((page - 1) * size, page * size), total: rows.length, page, pageSize: size, actions: Array.from(new Set((await this.store.all(C.audit)).map(a => String(a.action).split('.')[0]))).sort(),
      audit: rows.slice(0, Math.min(Number(b.limit) || size, 1000)) };
  },
  async x_audit_export(admin, b) {
    const rows = (await this.auditRows(b)).slice(0, 5000);
    await this.audit(admin, 'audit.export', { type: 'audit', id: 'export' }, 'ok', { rows: rows.length, filters: { from: b.from || null, to: b.to || null, actor: b.actor || null, actionPrefix: b.actionPrefix || null } });
    return { columns: ['time', 'actor', 'role', 'action', 'targetType', 'target', 'institutionId', 'result', 'reason', 'requestId', 'ip'],
      rows: rows.map(a => [new Date(a.t).toISOString(), a.actor, a.role, a.action, a.targetType, a.target, a.institutionId, a.result, a.detail && (a.detail.reason || a.detail.error) || '', a.requestId, a.ip]) };
  },

  /* ── Reports ── */
  async x_reports_run(admin, b) {
    const now = this.now(); const type = String(b.type || ''); const need = p => this.need(admin, p);
    const insts = async () => { need('institutions.view'); return this.store.all(C.inst); };
    const d = t => t ? new Date(t).toISOString().slice(0, 16).replace('T', ' ') : '';
    switch (type) {
      case 'institutions': { const I = await insts(); return { title: 'Institution directory', columns: ['ID', 'Name', 'Deployment', 'Package', 'Licence', 'Expiry', 'Teachers', 'Server', 'Server version', 'Contact', 'Created'],
        rows: I.map(i => { const v = this.cp.view(i, now).licenceState; return [i.id, i.name, i.deploymentType, i.entitlement ? i.entitlement.planName + ' v' + i.entitlement.version : '', v.status, v.expiryDate || '', i.allowlistCount || 0, serverHealth(i, now).state, i.server && i.server.serverVersion || '', i.contact && i.contact.email || '', d(i.createdAt)]; }) }; }
      case 'licences': case 'expiring': { need('licences.view'); const I = await this.store.all(C.inst); let r = I.map(i => ({ i, v: this.cp.view(i, now).licenceState }));
        if (type === 'expiring') r = r.filter(x => Number.isFinite(x.i.licence && x.i.licence.expiresAt) && x.i.licence.expiresAt > now && x.i.licence.expiresAt - now <= 90 * DAY).sort((a, c) => a.i.licence.expiresAt - c.i.licence.expiresAt);
        return { title: type === 'expiring' ? 'Licences ending in the next 90 days' : 'Licence status', columns: ['Institution', 'Status', 'Activation', 'Expiry', 'Days left', 'Grace days', 'Length', 'Suspended reason'],
          rows: r.map(x => [x.i.name, x.v.status, x.v.activationDate || '', x.v.expiryDate || '', x.v.remainingDays ?? '', x.v.graceDays || 0, x.v.durationLabel || '', x.v.suspendedReason || '']) }; }
      case 'packages': { need('packages.view'); const P = await this.plans(); const I = await this.store.all(C.inst);
        return { title: 'Package distribution', columns: ['Package', 'Current version', 'Status', 'Institutions', 'On an older version'], rows: P.map(p => { const on = I.filter(i => i.entitlement && i.entitlement.planId === p.id); return [p.name, p.version, p.status, on.length, on.filter(i => i.entitlement.version !== p.version).length]; }) }; }
      case 'users': { need('users.view'); const R = (await this.userRows()).filter(r => r.accountType === 'cloud');
        return { title: 'User account status', columns: ['Name', 'Email', 'Role', 'Status', 'Institution', 'Exams', 'Joined', 'Last active'], rows: R.map(r => [r.name, r.email, r.role, r.status, r.institutionName, r.exams, d(r.createdAt), d(r.lastActiveAt)]) }; }
      case 'entitlements': { const I = await insts(); const cfg = await this.featureConfig();
        return { title: 'Feature entitlements by institution', columns: ['Institution', 'Package', ...FEATURES.map(f => f.name)],
          rows: I.map(i => { const e = effective(cfg, { kind: 'institution', entitled: i.entitlement ? i.entitlement.features : null, overrides: i.featureOverrides || {} }); return [i.name, i.entitlement ? i.entitlement.planName : '(none: global defaults)', ...FEATURES.map(f => e[f.key].on ? 'on' : 'off (' + e[f.key].source + ')')]; }) }; }
      case 'admin-activity': { need('audit.view'); const R = await this.auditRows(b); return { title: 'Administrative activity', columns: ['Time', 'Admin', 'Action', 'Target', 'Result'], rows: R.slice(0, 5000).map(a => [d(a.t), a.actor, a.action, a.target || '', a.result]) }; }
      case 'server-health': { const I = await insts(); return { title: 'Server health summary', columns: ['Institution', 'State', 'Why', 'Last report', 'Server version', 'Config applied'],
        rows: I.map(i => { const h = serverHealth(i, now); return [i.name, h.state, h.why, d(h.lastSeenAt), i.server && i.server.serverVersion || '', i.sync && i.sync.appliedVersion && i.sync.appliedVersion === i.sync.currentVersion ? 'yes' : i.server && i.server.serverId ? 'pending' : 'no server']; }) }; }
      case 'announcements': { need('announcements.view'); const A = await this.store.all(K.ann);
        return { title: 'Announcement history', columns: ['Heading', 'State', 'Audience', 'Category', 'Priority', 'Start', 'End', 'Published', 'By'], rows: A.sort((a, c) => (c.updatedAt || 0) - (a.updatedAt || 0)).map(a => [a.heading, annState(a, now), a.audience, a.category, a.priority, d(a.startAt), d(a.endAt), d(a.publishedAt), a.publishedBy || a.createdBy]) }; }
    }
    bad('Unknown report.');
  },

  /* ── Cloud activity: exams, live sessions, feedback (the v45 Admin Monitor tabs) ── */
  async x_activity_get(admin) {
    const [teachers, exams, sessions, feedback] = await Promise.all([this.platform.teachers(), this.platform.exams(), this.platform.sessions(), this.platform.feedback()]);
    return { teachers, exams, sessions, feedback, owner: admin.owner };
  },
  async x_activity_deleteExam(admin, b) {
    if (b.confirm !== true) bad('Confirm first.', 400, 'confirm');
    const token = String(b.token || ''); if (!token) bad('Which exam?');
    await this.platform.deleteExam(token);
    await this.audit(admin, 'activity.deleteExam', { type: 'exam', id: token }, 'ok', { reason: b.reason || null });
    return { ok: true };
  },
  async x_activity_deleteFeedback(admin, b) {
    if (b.confirm !== true) bad('Confirm first.', 400, 'confirm');
    await this.platform.deleteFeedback(String(b.id || ''));
    await this.audit(admin, 'activity.deleteFeedback', { type: 'feedback', id: String(b.id || '') }, 'ok', {});
    return { ok: true };
  }
};
module.exports = { methods, serverHealth, securityAlerts };
