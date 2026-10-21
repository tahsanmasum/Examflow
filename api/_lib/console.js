'use strict';
/* The Admin Monitor's server: every /api/admin request comes here.

   resolveAdmin()  turns a verified Firebase ID token into an admin with a role
                   and permissions (rbac.js), or refuses and records why.
   act()           checks the action's permission (and recent sign-in for
                   sensitive ones), runs it, and records the result.

   Institution, install-package and licence actions are carried out by the
   ControlPlane (cp.js); everything else lives in the mod-*.js files, mixed in
   below. Nothing here stores exams, questions or attempts from institution
   servers. */
const crypto = require('node:crypto');
const { CPError, C } = require('./cp');
const { PERMS, BUILTIN_ROLES, ACTION_PERMS, rolePerms, roleName } = require('./rbac');
const { EMAIL_RE, normEmail } = require('./util');

const K = { admins: 'cpAdmins', roles: 'cpRoles', sessions: 'cpAdminSessions', security: 'cpSecurity', events: 'cpEvents', config: 'cpConfig', configV: 'cpConfigVersions',
  users: 'cpUserMeta', invites: 'cpInvites', plans: 'cpPlans', ann: 'cpAnnouncements', msgs: 'cpMessages', deliv: 'cpDeliveries', errors: 'cpErrors', alerts: 'cpAlerts' };
const bad = (m, s, c) => { throw new CPError(m, s, c); };
const rid = (p, n = 14) => p + crypto.randomBytes(16).toString('base64url').replace(/[-_]/g, '').slice(0, n);
const HIGH_RISK = /^(admins\.|roles\.|features\.kill|licence\.revoke|licence\.block|licence\.suspend|users\.(suspend|disable)|security\.|settings\.(save|rollback)|activity\.delete|package\.revoke|server\.reset)/;

class AdminConsole {
  /** Tests (and anything that writes behind the console's back) call this. */
  clearCaches() { this.store.clear(); this.platform.clear(); }
  /** cp: ControlPlane; platform: platform-firebase or platform-memory; owners: platform-owner emails. */
  constructor({ cp, platform, owners, env, fetchImpl }) {
    const { cachedStore, cachedPlatform } = require('./cache');
    cp.store = cachedStore(cp.store);
    this.cp = cp; this.store = cp.store; this.platform = cachedPlatform(platform); this.owners = (owners || []).map(e => e.toLowerCase());
    this.env = env || {}; this.now = () => cp.now(); this.fetchImpl = fetchImpl || (typeof fetch === 'function' ? fetch : null);
    cp.auditHook = (actor, action, target, result, detail) => this.audit(actor, action, target ? { ...target, type: target.type || (String(action).split('.')[0]) } : null, result, detail);
    cp.syncFor = inst => this.syncFor(inst);
    cp.onServerReport = async (inst, info) => {
      if (info.prevStatus !== info.status) await this.event('server.status', { institutionId: inst.id, from: info.prevStatus || 'none', to: info.status, kind: info.kind });
      if (info.rep.sync && info.rep.sync.error) await this.event('sync.failed', { institutionId: inst.id, error: info.rep.sync.error });
      else if (info.rep.sync && info.rep.sync.appliedVersion && (!inst.sync || inst.sync.appliedVersion !== info.rep.sync.appliedVersion)) await this.event('sync.applied', { institutionId: inst.id, version: info.rep.sync.appliedVersion });
    };
    cp.rateLimit = async () => (await this.settings()).security.instRateLimitPerMin;
  }

  /* ───────── who is asking ───────── */
  async customRoles() { return (await this.store.all(K.roles)).filter(r => !r.deleted); }
  /** decoded: verified Firebase ID token (uid, email, email_verified, auth_time). ctx: { ip, ua, sessionId } */
  async resolveAdmin(decoded, ctx = {}) {
    const email = String(decoded.email || '').toLowerCase();
    const deny = async (msg, code, status = 403) => {
      await this.securityEvent('admin.denied', { email: email || null, uid: decoded.uid || null, ip: ctx.ip || null, ua: (ctx.ua || '').slice(0, 200), code });
      bad(msg, status, code);
    };
    if (!email) await deny('This account has no email address, so it can\'t be an admin.', 'no_email');
    if (decoded.email_verified !== true) await deny('The admin email must be verified (sign in with Google, or verify the email in Firebase).', 'unverified');
    let roleId, record = null;
    let prefs = null;
    const isOwner = this.owners.includes(email);
    const [rec, roles] = await Promise.all([this.store.get(K.admins, isOwner ? '__owner__' + email : email), this.customRoles()]);
    if (isOwner) { roleId = 'owner'; prefs = rec && rec.prefs || null; }
    else {
      record = rec;
      if (!record || record.status !== 'active') await deny('Only ExamFlow admins can open the Admin Monitor.', 'not_admin');
      if (record.uid && record.uid !== decoded.uid) await deny('This admin seat belongs to a different account with the same email. Ask the platform owner to add you again.', 'uid_mismatch');
      roleId = record.role;
    }
    const perms = rolePerms(roleId, roles);
    if (record && !record.uid) await this.store.set(K.admins, email, { ...record, uid: decoded.uid, firstSeenAt: this.now() });
    return { email, uid: decoded.uid, role: roleId, roleName: roleName(roleId, roles), owner: roleId === 'owner', perms,
      authTime: Number(decoded.auth_time) * 1000 || 0, ip: ctx.ip || null, ua: (ctx.ua || '').slice(0, 200), sessionId: ctx.sessionId || null,
      requestId: ctx.requestId || rid('req_', 12), prefs: prefs || (record && record.prefs) || null };
  }
  can(admin, perm) { return !perm || admin.perms.includes(perm); }
  need(admin, perm) { if (!this.can(admin, perm)) bad(`Your role (${admin.roleName}) doesn't allow this. It needs the permission "${perm}" (${PERMS[perm] || ''}).`, 403, 'forbidden'); }

  async settings() { const m = require('./mod-settings'); const c = await this.store.get(K.config, 'settings'); return m.merge(m.DEFAULT_SETTINGS, c && c.values); }

  /* ───────── dispatch ───────── */
  async act(admin, body) {
    const action = String(body && body.action || '');
    const spec = ACTION_PERMS[action];
    if (!spec) bad('Unknown action: ' + action, 404, 'unknown_action');
    if (spec.perm && !this.can(admin, spec.perm)) {
      await this.securityEvent('permission.denied', { email: admin.email, action, perm: spec.perm, ip: admin.ip });
      await this.audit(admin, action, { type: 'action', id: action }, 'denied', { reason: 'missing permission ' + spec.perm });
      this.need(admin, spec.perm);
    }
    if (spec.ownerOnly && !admin.owner) bad('Only a platform owner can do this.', 403, 'owner_only');
    if (spec.reauth) {
      const mins = Number((await this.settings()).security.reauthMinutes) || 15;
      if (!admin.authTime || this.now() - admin.authTime > mins * 60000) bad(`This is a sensitive change. Confirm it's you: sign in again (needed when your last sign-in was more than ${mins} minutes ago).`, 401, 'reauth');
    }
    const own = this['x_' + action.replace(/\./g, '_')];
    try {
      if (own) return await own.call(this, admin, body || {});
      // institution / licence / install-package actions run in the ControlPlane, attributed to this admin
      return await this.cp.act(this.cpActor(admin), body);
    } catch (e) {
      if (e instanceof CPError && e.status < 500 && !['reauth', 'confirm', 'stale'].includes(e.code) && /\.(set|save|create|update|renew|suspend|reactivate|revoke|block|unblock|generate|assign|publish|send|add|remove|kill|delete|invite)$/.test(action))
        await this.audit(admin, action, { type: 'action', id: action }, 'failed', { code: e.code, error: e.message.slice(0, 300), institutionId: body && body.id || null });
      if (!(e instanceof CPError)) await this.errorEvent('admin-api', action, e, admin);
      throw e;
    }
  }
  /** The ControlPlane's own audit entries carry the admin's email; this adds the request context. */
  cpActor(admin) { return admin; }

  /* ───────── records ───────── */
  async audit(admin, action, target, result, detail) {
    const a = typeof admin === 'string' ? { email: admin } : (admin || {});
    const clean = scrub(detail);
    await this.store.add(C.audit, { t: this.now(), actor: a.email || null, actorUid: a.uid || null, role: a.role || null, action,
      targetType: target && target.type || null, target: target && target.id || null, institutionId: target && target.inst || (clean && clean.institutionId) || null,
      result, detail: clean || null, requestId: a.requestId || null, ip: a.ip || null, ua: a.ua || null, risk: HIGH_RISK.test(action) ? 'high' : 'normal' });
  }
  async securityEvent(kind, detail) { await this.store.add(K.security, { t: this.now(), kind, ...scrub(detail) }); }
  async event(kind, detail) { await this.store.add(K.events, { t: this.now(), kind, ...scrub(detail) }); }
  async errorEvent(source, where, err, admin) {
    await this.store.add(K.errors, { t: this.now(), source, where: String(where || '').slice(0, 120), message: String(err && err.message || err).slice(0, 500), by: admin && admin.email || null });
  }

  /* ───────── session & shell ───────── */
  async x_whoami(admin) {
    return { email: admin.email, role: admin.role, roleName: admin.roleName, owner: admin.owner, perms: admin.perms,
      signingKey: this.cp.fingerprint, serverTime: this.now(), configured: !!(this.cp.keys && this.cp.keys.privatePem) };
  }
  /** Called when the Admin Monitor opens: records the admin session, returns who you are and what you can see. */
  async x_console_bootstrap(admin) {
    const now = this.now(); const settingsP = this.settings();
    if (admin.sessionId && /^[A-Za-z0-9_-]{8,64}$/.test(admin.sessionId)) {
      const sid = admin.sessionId;
      const [prev, mine] = await Promise.all([this.store.get(K.sessions, sid), this.store.where(K.sessions, 'email', admin.email)]);
      if (prev && prev.revokedAt) bad('This Admin Monitor session was signed out by an administrator. Sign in again.', 401, 'session_revoked');
      const others = mine.filter(s => s.id !== sid);
      const known = others.some(s => s.ip === admin.ip);
      await Promise.all([
        this.store.set(K.sessions, sid, { id: sid, email: admin.email, uid: admin.uid, role: admin.role, ip: admin.ip, ua: admin.ua, startedAt: prev ? prev.startedAt : now, lastAt: now, revokedAt: null }),
        !prev && !known && others.length ? this.securityEvent('admin.newLocation', { email: admin.email, ip: admin.ip, ua: admin.ua }) : null]);
    }
    return { ...(await this.x_whoami(admin)), prefs: admin.prefs || {}, permsAll: PERMS, timeZone: 'Asia/Dhaka (UTC+06:00)', settings: await settingsP };
  }
  async x_admin_prefs(admin, b) {
    const p = b.prefs || {};
    const prefs = { landing: typeof p.landing === 'string' ? p.landing.slice(0, 40) : 'overview', pageSize: [10, 20, 50, 100].includes(Number(p.pageSize)) ? Number(p.pageSize) : 20,
      compact: !!p.compact, alerts: p.alerts !== false };
    if (admin.owner) { const o = await this.store.get(K.admins, '__owner__' + admin.email) || {}; await this.store.set(K.admins, '__owner__' + admin.email, { ...o, email: admin.email, owner: true, prefs, status: 'owner-prefs' }); }
    else { const r = await this.store.get(K.admins, admin.email); await this.store.set(K.admins, admin.email, { ...r, prefs }); }
    return { prefs };
  }
  async x_admin_signoutAll(admin) {
    await this.platform.revokeTokens(admin.uid);
    for (const s of await this.store.where(K.sessions, 'email', admin.email)) await this.store.set(K.sessions, s.id, { ...s, revokedAt: this.now(), revokedBy: admin.email });
    await this.audit(admin, 'admin.signoutAll', { type: 'admin', id: admin.email }, 'ok');
    return { ok: true };
  }
  /** One search box for the whole Admin Monitor; only returns what the admin may see. */
  async x_search(admin, b) {
    const q = String(b.q || '').trim().toLowerCase(); if (q.length < 2) return { results: [] };
    const out = [];
    const none = Promise.resolve([]);
    const [U, I, A, P] = await Promise.all([this.can(admin, 'users.view') ? this.platform.listUsers() : none, this.can(admin, 'institutions.view') ? this.store.all(C.inst) : none,
      this.can(admin, 'announcements.view') ? this.store.all(K.ann) : none, this.can(admin, 'packages.view') ? this.store.all(K.plans) : none]);
    for (const u of U) if ((u.email || '').includes(q) || (u.displayName || '').toLowerCase().includes(q) || u.uid.toLowerCase() === q)
      out.push({ type: 'user', id: u.uid, label: u.displayName || u.email, sub: u.email });
    for (const i of I) if (i.name.toLowerCase().includes(q) || i.id.toLowerCase().includes(q))
      out.push({ type: 'institution', id: i.id, label: i.name, sub: i.id });
    for (const a of A) if ((a.title || '').toLowerCase().includes(q) || (a.heading || '').toLowerCase().includes(q))
      out.push({ type: 'announcement', id: a.id, label: a.title || a.heading, sub: a.status });
    for (const p of P) if ((p.name || '').toLowerCase().includes(q) || p.id.toLowerCase().includes(q))
      out.push({ type: 'package', id: p.id, label: p.name, sub: 'v' + p.version });
    return { results: out.slice(0, 30) };
  }
  /** Bell menu: things that need attention, filtered to what this admin may act on. */
  async x_notifications(admin) {
    const now = this.now(); const out = [];
    const ops = require('./mod-ops');
    const seeInst = this.can(admin, 'licences.view') || this.can(admin, 'institutions.view');
    const [s, insts, alerts, errs] = await Promise.all([this.settings(), seeInst ? this.store.all(C.inst) : [],
      this.can(admin, 'security.view') ? ops.securityAlerts(this, now) : [], this.can(admin, 'health.view') ? this.store.recent(K.errors, 't', now - 24 * 3600000, 500) : null]);
    if (seeInst) {
      const sched = (s.licence && s.licence.warnSchedule) || [30, 7, 1];
      for (const i of insts) {
        const v = this.cp.view(i, now).licenceState;
        if (v.status === 'Expiring Soon' && v.remainingDays <= Math.max(...sched)) out.push({ level: v.remainingDays <= Math.min(...sched.filter(x => x > 1).concat([7])) ? 'warn' : 'info', kind: 'licence', id: i.id, text: `${i.name}: licence ends in ${v.remainingDays} day${v.remainingDays === 1 ? '' : 's'}.` });
        if (v.status === 'Grace Period') out.push({ level: 'warn', kind: 'licence', id: i.id, text: `${i.name}: licence expired, grace period (${v.graceDaysLeft} day${v.graceDaysLeft === 1 ? '' : 's'} left).` });
        if (v.status === 'Expired') out.push({ level: 'err', kind: 'licence', id: i.id, text: `${i.name}: licence expired.` });
        const h = ops.serverHealth(i, now);
        if (h.state === 'Degraded' || h.state === 'Offline') out.push({ level: 'err', kind: 'server', id: i.id, text: `${i.name}: server ${h.state.toLowerCase()} — ${h.why}` });
        if (i.sync && i.sync.pendingSince && now - i.sync.pendingSince > 30 * 60000) out.push({ level: 'warn', kind: 'sync', id: i.id, text: `${i.name}: configuration change not applied yet (waiting for the server).` });
      }
    }
    for (const a of alerts.filter(a => !a.acked)) out.push({ level: 'err', kind: 'security', id: a.id, text: a.text });
    if (errs) {
      if (errs.length) out.push({ level: 'warn', kind: 'errors', id: 'errors', text: `${errs.length} application error${errs.length === 1 ? '' : 's'} in the last 24 hours.` });
    }
    return { items: out.slice(0, 50), serverTime: now };
  }
}

/** Removes anything secret-looking before it reaches a log. */
function scrub(v, depth = 0) {
  if (v == null || depth > 6) return v;
  if (Array.isArray(v)) return v.slice(0, 200).map(x => scrub(x, depth + 1));
  if (typeof v === 'object') {
    const o = {};
    for (const [k, x] of Object.entries(v)) {
      if (/pass(word)?|secret|token|private|credential|serviceaccount|apikey|link$|oob/i.test(k)) { o[k] = '[removed]'; continue; }
      o[k] = scrub(x, depth + 1);
    }
    return o;
  }
  if (typeof v === 'string') return v.length > 2000 ? v.slice(0, 2000) + '…' : v;
  return v;
}

/* Plain require() calls (not a loop over names) so Vercel's bundler includes every module. */
for (const mod of [require('./mod-admins'), require('./mod-users'), require('./mod-plans'), require('./mod-features'), require('./mod-settings'), require('./mod-comms'), require('./mod-ops')]) {
  for (const [k, fn] of Object.entries(mod.methods || {})) AdminConsole.prototype[k] = fn;
}

module.exports = { AdminConsole, K, rid, scrub, bad, BUILTIN_ROLES, EMAIL_RE, normEmail };
