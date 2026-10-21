'use strict';
/* User Management. Cloud accounts are the existing Firebase Auth users (never a
   second user system); the Admin Monitor keeps only a little metadata about
   them in cpUserMeta (status, reason, institution association, notes).
   Institution teachers live on their institution's server: here they are
   listed from the roster (teacher ID, email, name) and can be messaged, but
   their accounts are managed by that institution.

   Passwords are never seen, stored or set here. Invitations and recovery use
   Firebase's own "set your password" email, sent from the admin's browser by
   Firebase itself, so no reset link ever passes through ExamFlow. */
const { CPError, C } = require('./cp');
const { normEmail, EMAIL_RE } = require('./util');
const { rolePerms, roleName } = require('./rbac');
const K = { users: 'cpUserMeta', invites: 'cpInvites', admins: 'cpAdmins' };
const bad = (m, s, c) => { throw new CPError(m, s, c); };
const DAY = 86400000;
const ACTIVE_DAYS = 30;

const methods = {
  async userRows() {
    const now = this.now();
    const [users, teachers, metas, invites, admins, exams, insts, allows] = await Promise.all([this.platform.listUsers(), this.platform.teachers(), this.store.all(K.users),
      this.store.all(K.invites), this.store.all(K.admins), this.platform.exams(), this.store.all(C.inst), this.store.all(C.allow)]);
    const roles = await this.customRoles();
    const T = new Map(teachers.map(t => [t.uid, t])), M = new Map(metas.map(m => [m.uid, m])), I = new Map(insts.map(i => [i.id, i]));
    const inv = new Map(); for (const v of invites) if (!inv.has(v.uid) || inv.get(v.uid).createdAt < v.createdAt) inv.set(v.uid, v);
    const seat = new Map(admins.filter(a => a.status === 'active' && a.email).map(a => [a.email, a]));
    const ex = {}; for (const e of exams) if (e.teacherUid && !e.trashed) ex[e.teacherUid] = (ex[e.teacherUid] || 0) + 1;
    const settings = await this.settings();
    const rows = users.map(u => {
      const m = M.get(u.uid) || {}; const t = T.get(u.uid) || {}; const v = inv.get(u.uid);
      const last = Math.max(u.lastSignInAt || 0, u.lastActiveAt || 0) || null;
      let status;
      if (m.status === 'suspended') status = 'Suspended';
      else if (u.disabled) status = 'Disabled';
      else if (v && !u.lastSignInAt) status = now - (v.sentAt || v.createdAt) > (settings.security.inviteExpiryDays || 7) * DAY ? 'Invitation expired' : 'Invited';
      else if (last && now - last <= ACTIVE_DAYS * DAY) status = 'Active';
      else status = 'Inactive';
      const isOwner = this.owners.includes(u.email || ''); const s = seat.get(u.email || '');
      const inst = m.institutionId ? I.get(m.institutionId) : null;
      return { uid: u.uid, name: t.name || u.displayName || '', email: u.email, accountType: 'cloud', role: isOwner ? 'Platform Owner' : s ? roleName(s.role, roles) : 'Teacher',
        admin: isOwner || !!s, status, institutionId: m.institutionId || null, institutionName: inst ? inst.name : (t.institution || ''), institutionLinked: !!inst,
        createdAt: u.createdAt, lastSignInAt: u.lastSignInAt, lastActiveAt: last, exams: ex[u.uid] || 0, emailVerified: u.emailVerified, providers: u.providers };
    });
    // institution teachers: roster entries, managed on their institution's own server
    for (const al of allows) {
      const inst = I.get(al.institutionId); if (!inst) continue;
      for (const t of al.teachers || []) rows.push({ uid: 'inst:' + inst.id + ':' + t.teacherId, name: t.name || '', email: t.email, accountType: 'institution', role: 'Teacher',
        admin: false, status: 'Managed by institution', institutionId: inst.id, institutionName: inst.name, institutionLinked: true, teacherId: t.teacherId,
        createdAt: null, lastSignInAt: null, lastActiveAt: null, exams: null });
    }
    return rows;
  },
  async x_users_list(admin, b) {
    let rows = await this.userRows();
    const counts = { all: rows.length };
    for (const r of rows) { counts[r.status] = (counts[r.status] || 0) + 1; counts[r.accountType] = (counts[r.accountType] || 0) + 1; }
    const q = String(b.q || '').trim().toLowerCase();
    if (q) rows = rows.filter(r => [r.name, r.email, r.uid, r.role, r.institutionName, r.teacherId].some(x => String(x || '').toLowerCase().includes(q)));
    if (b.status) rows = rows.filter(r => r.status === b.status);
    if (b.type) rows = rows.filter(r => r.accountType === b.type);
    if (b.role) rows = rows.filter(r => r.role === b.role);
    if (b.institutionId) rows = rows.filter(r => r.institutionId === b.institutionId);
    const sort = String(b.sort || 'lastActiveAt'), dir = b.dir === 'asc' ? 1 : -1;
    rows.sort((x, y) => { const a = x[sort], c = y[sort]; if (a == null && c == null) return 0; if (a == null) return 1; if (c == null) return -1; return (a > c ? 1 : a < c ? -1 : 0) * dir; });
    const size = Math.min(Math.max(Number(b.pageSize) || 20, 5), 200), page = Math.max(Number(b.page) || 1, 1);
    return { rows: rows.slice((page - 1) * size, page * size), total: rows.length, page, pageSize: size, counts, activeDays: ACTIVE_DAYS,
      institutions: (await this.store.all(C.inst)).map(i => ({ id: i.id, name: i.name })) };
  },
  async x_users_get(admin, b) {
    const uid = String(b.uid || '');
    if (uid.startsWith('inst:')) {
      const [, instId, teacherId] = uid.split(':');
      const inst = await this.store.get(C.inst, instId); const al = await this.store.get(C.allow, instId);
      const t = al && (al.teachers || []).find(x => x.teacherId === teacherId); if (!inst || !t) bad('Not found.', 404, 'not_found');
      return { user: { uid, accountType: 'institution', email: t.email, name: t.name || '', teacherId, institutionId: inst.id, institutionName: inst.name, status: 'Managed by institution' },
        note: 'This teacher\'s account lives on ' + inst.name + '\'s own ExamFlow server. Add or remove them on the institution\'s Teachers roster; their sign-in, exams and results stay on that server.',
        history: (await this.store.all(C.audit)).filter(a => a.target === uid).sort((x, y) => y.t - x.t).slice(0, 50) };
    }
    const u = await this.platform.getUser(uid); if (!u) bad('User not found.', 404, 'not_found');
    const rows = await this.userRows(); const row = rows.find(r => r.uid === uid);
    const meta = await this.store.get(K.users, uid) || {};
    const exams = (await this.platform.exams()).filter(e => e.teacherUid === uid).sort((x, y) => (y.createdAt || 0) - (x.createdAt || 0)).slice(0, 50)
      .map(e => ({ token: e.token, course: e.course, section: e.section, type: e.type, createdAt: e.createdAt, startTime: e.startTime, endTime: e.endTime, trashed: e.trashed, camOn: e.camOn }));
    const invites = (await this.store.where(K.invites, 'uid', uid)).sort((x, y) => y.createdAt - x.createdAt);
    const history = (await this.store.all(C.audit)).filter(a => a.target === uid).sort((x, y) => y.t - x.t).slice(0, 100);
    return { user: { ...row, emailVerified: u.emailVerified, disabled: u.disabled, tokensValidAfter: u.tokensValidAfter, providers: u.providers, mfaFactors: u.mfaFactors },
      meta: { status: meta.status || null, reason: meta.reason || null, note: meta.note || '', institutionId: meta.institutionId || null, statusHistory: meta.statusHistory || [] },
      exams, invites, history, canViewDashboard: admin.owner };
  },
  async guardTarget(admin, uid) {
    const u = await this.platform.getUser(uid); if (!u) bad('User not found.', 404, 'not_found');
    if (u.uid === admin.uid) bad('You can\'t do this to your own account.', 403, 'self');
    if (this.owners.includes(u.email || '')) bad('Platform owner accounts can\'t be changed from the Admin Monitor.', 403, 'owner_locked');
    const seat = u.email ? await this.store.get(K.admins, u.email) : null;
    if (seat && seat.status === 'active' && !this.can(admin, 'admins.manage')) bad('This user is an admin. Changing their account needs the admins.manage permission.', 403, 'forbidden');
    return u;
  },
  async setStatus(admin, uid, status, reason, action) {
    const prev = await this.store.get(K.users, uid) || { uid };
    const hist = [{ t: this.now(), by: admin.email, from: prev.status || 'active', to: status, reason: reason || null }, ...(prev.statusHistory || [])].slice(0, 50);
    await this.store.set(K.users, uid, { ...prev, uid, status, reason: reason || null, statusAt: this.now(), statusBy: admin.email, statusHistory: hist });
    return prev.status || 'active';
  },
  async x_users_suspend(admin, b) { return this.suspendLike(admin, b, 'suspended', 'users.suspend'); },
  async x_users_disable(admin, b) { return this.suspendLike(admin, b, 'disabled', 'users.disable'); },
  async suspendLike(admin, b, status, action) {
    if (b.confirm !== true) bad('Confirm first.', 400, 'confirm');
    const reason = String(b.reason || '').trim(); if (!reason) bad('Give a reason. It is kept in the account\'s history and the audit log.');
    const u = await this.guardTarget(admin, String(b.uid || ''));
    await this.platform.updateUser(u.uid, { disabled: true });
    const tva = await this.platform.revokeTokens(u.uid);
    const before = await this.setStatus(admin, u.uid, status, reason, action);
    await this.audit(admin, action, { type: 'user', id: u.uid }, 'ok', { email: u.email, reason, before: { status: before, disabled: u.disabled }, after: { status, disabled: true } });
    return { ok: true, status: status === 'suspended' ? 'Suspended' : 'Disabled', signedOutAfter: tva,
      note: 'The account can\'t sign in, and its devices are signed out within about an hour (when their sign-in refreshes). Its exams and results are kept.' };
  },
  async x_users_reactivate(admin, b) {
    if (b.confirm !== true) bad('Confirm first.', 400, 'confirm');
    const u = await this.guardTarget(admin, String(b.uid || ''));
    await this.platform.updateUser(u.uid, { disabled: false });
    const before = await this.setStatus(admin, u.uid, 'active', String(b.reason || '').trim() || null, 'users.reactivate');
    await this.audit(admin, 'users.reactivate', { type: 'user', id: u.uid }, 'ok', { email: u.email, before: { status: before, disabled: u.disabled }, after: { status: 'active', disabled: false }, reason: b.reason || null });
    return { ok: true, status: 'Active' };
  },
  async x_users_revokeSessions(admin, b) {
    if (b.confirm !== true) bad('Confirm first.', 400, 'confirm');
    const u = await this.guardTarget(admin, String(b.uid || ''));
    const tva = await this.platform.revokeTokens(u.uid);
    await this.audit(admin, 'users.revokeSessions', { type: 'user', id: u.uid }, 'ok', { email: u.email });
    return { ok: true, signedOutAfter: tva, note: 'Every device must sign in again. Firebase ends existing sign-ins when they next refresh, within about an hour.' };
  },
  async x_users_update(admin, b) {
    const uid = String(b.uid || '');
    const u = await this.platform.getUser(uid); if (!u) bad('User not found.', 404, 'not_found');
    if (this.owners.includes(u.email || '') && uid !== admin.uid) bad('Platform owner accounts can\'t be changed from the Admin Monitor.', 403, 'owner_locked');
    const prev = await this.store.get(K.users, uid) || { uid };
    const patch = {}; const before = {};
    if (b.name !== undefined) {
      const n = String(b.name || '').trim(); if (!n || n.length > 120) bad('Enter a name of up to 120 characters.');
      before.name = u.displayName; patch.name = n;
      await this.platform.updateUser(uid, { displayName: n }); await this.platform.setTeacher(uid, { name: n });
    }
    if (b.institutionId !== undefined) {
      const id = b.institutionId ? String(b.institutionId) : null;
      if (id && !(await this.store.get(C.inst, id))) bad('Institution not found.', 404, 'not_found');
      before.institutionId = prev.institutionId || null; patch.institutionId = id;
    }
    if (b.note !== undefined) { before.note = prev.note || ''; patch.note = String(b.note || '').slice(0, 1000); }
    await this.store.set(K.users, uid, { ...prev, uid, ...(patch.institutionId !== undefined ? { institutionId: patch.institutionId } : {}), ...(patch.note !== undefined ? { note: patch.note } : {}) });
    await this.audit(admin, 'users.update', { type: 'user', id: uid }, 'ok', { email: u.email, before, after: patch });
    return { ok: true };
  },
  /* Invitations: the server creates the Firebase account (no password); the admin's browser then asks
     Firebase to email the person a "set your password" link (users.inviteSent records the outcome). */
  async x_users_invite(admin, b) {
    if (b.confirm !== true) bad('Review and confirm first.', 400, 'confirm');
    const type = b.accountType === 'institution' ? 'institution' : 'cloud';
    const email = normEmail(b.email || ''); if (!EMAIL_RE.test(email)) bad('Enter a valid email address.');
    const name = String(b.name || '').trim().slice(0, 120);
    if (type === 'institution') {
      this.need(admin, 'institutions.manage');
      const inst = await this.store.get(C.inst, String(b.institutionId || '')); if (!inst) bad('Choose the institution.', 400);
      const al = await this.store.get(C.allow, inst.id) || { version: 0, teachers: [] };
      const teacherId = String(b.teacherId || '').trim();
      if (al.teachers.some(t => t.email === email)) bad('This email is already on ' + inst.name + '\'s roster.', 409, 'exists');
      const res = await this.cp.act(this.cpActor(admin), { action: 'allowlist.save', id: inst.id, confirmInstitution: inst.id, baseVersion: al.version, source: 'manual',
        teachers: [...al.teachers, { teacherId, email, ...(name ? { name } : {}) }] });
      return { accountType: 'institution', institution: { id: inst.id, name: inst.name }, allowlistVersion: res.allowlist.version,
        note: `Added to ${inst.name}'s roster (version ${res.allowlist.version}). Their server receives it at its next check-in (within about 5 minutes); then the teacher activates their account there (an activation code from the institution's admin, or the institution's own sign-in).` };
    }
    const existing = await this.platform.getUserByEmail(email);
    if (existing) bad('An account with this email already exists. Open it in the user directory instead.', 409, 'exists');
    let instId = null;
    if (b.institutionId) { const inst = await this.store.get(C.inst, String(b.institutionId)); if (!inst) bad('Institution not found.', 404); instId = inst.id; }
    const u = await this.platform.createUser({ email, displayName: name || null });
    if (name) await this.platform.setTeacher(u.uid, { name, email, createdAt: this.now() });
    await this.store.set(K.users, u.uid, { uid: u.uid, status: 'active', institutionId: instId, note: String(b.note || '').slice(0, 1000), invitedBy: admin.email, invitedAt: this.now() });
    const id = 'inv_' + require('node:crypto').randomBytes(9).toString('hex');
    const s = await this.settings();
    const inv = { id, uid: u.uid, email, createdAt: this.now(), createdBy: admin.email, status: 'Account created', sentAt: null, expiresAt: this.now() + (s.security.inviteExpiryDays || 7) * DAY, sends: [] };
    await this.store.set(K.invites, id, inv);
    await this.audit(admin, 'users.invite', { type: 'user', id: u.uid }, 'ok', { email, institutionId: instId, inviteId: id });
    return { accountType: 'cloud', uid: u.uid, inviteId: id, email, sendFromBrowser: true,
      note: 'Account created without a password. Your browser now asks Firebase to email them a link to set their password.' };
  },
  async x_users_inviteSent(admin, b) {
    const inv = await this.store.get(K.invites, String(b.inviteId || '')); if (!inv) bad('Invitation not found.', 404, 'not_found');
    const ok = b.ok === true; const now = this.now(); const s = await this.settings();
    const next = { ...inv, status: ok ? 'Sent' : 'Sending failed', sentAt: ok ? now : inv.sentAt, expiresAt: ok ? now + (s.security.inviteExpiryDays || 7) * DAY : inv.expiresAt,
      sends: [{ t: now, by: admin.email, ok, error: ok ? null : String(b.error || '').slice(0, 200) }, ...(inv.sends || [])].slice(0, 20) };
    await this.store.set(K.invites, inv.id, next);
    await this.audit(admin, ok ? 'users.inviteSent' : 'users.inviteFailed', { type: 'user', id: inv.uid }, ok ? 'ok' : 'failed', { email: inv.email, error: next.sends[0].error });
    return { invite: next };
  },
  /** Recovery: returns the email for the browser to pass to Firebase's own password-reset email. */
  async x_users_recover(admin, b) {
    const u = await this.platform.getUser(String(b.uid || '')); if (!u || !u.email) bad('User not found.', 404, 'not_found');
    if (u.disabled) bad('The account is suspended or disabled. Reactivate it first.', 409, 'state');
    if (this.owners.includes(u.email) && u.uid !== admin.uid) bad('Platform owner accounts can\'t be changed from the Admin Monitor.', 403, 'owner_locked');
    return { email: u.email, uid: u.uid, sendFromBrowser: true };
  },
  async x_users_recoverSent(admin, b) {
    const u = await this.platform.getUser(String(b.uid || '')); if (!u) bad('User not found.', 404, 'not_found');
    const inv = (await this.store.where(K.invites, 'uid', u.uid)).filter(i => i.status !== 'Sent' || !u.lastSignInAt).sort((x, y) => y.createdAt - x.createdAt)[0];
    if (inv && !u.lastSignInAt && b.ok === true) await this.x_users_inviteSent(admin, { inviteId: inv.id, ok: true });
    await this.audit(admin, b.ok === true ? 'users.recover' : 'users.recoverFailed', { type: 'user', id: u.uid }, b.ok === true ? 'ok' : 'failed', { email: u.email, error: b.ok === true ? null : String(b.error || '').slice(0, 200) });
    return { ok: true };
  }
};
module.exports = { methods, ACTIVE_DAYS };
