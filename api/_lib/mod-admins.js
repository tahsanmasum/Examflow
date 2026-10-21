'use strict';
/* Admin team and roles. Owners come from ADMIN_EMAILS and are shown but locked.
   Rules enforced here (not in the page):
     · nobody changes their own seat or role
     · a role can only be handed out by someone who holds every permission in it
     · only an owner can add or change a Super Admin
     · custom role ids can't shadow built-in ones */
const { PERMS, BUILTIN_ROLES, rolePerms, roleName, canGrant } = require('./rbac');
const { CPError } = require('./cp');
const { normEmail, EMAIL_RE } = require('./util');
const K = { admins: 'cpAdmins', roles: 'cpRoles', sessions: 'cpAdminSessions' };
const bad = (m, s, c) => { throw new CPError(m, s, c); };

const methods = {
  async x_admins_list(admin) {
    const roles = await this.customRoles();
    const rows = (await this.store.all(K.admins)).filter(a => a.status !== 'owner-prefs' && !String(a.email || '').startsWith('__owner__') && a.email);
    const sessions = await this.store.all(K.sessions);
    const last = e => Math.max(0, ...sessions.filter(s => s.email === e).map(s => s.lastAt || 0)) || null;
    const owners = this.owners.map(e => ({ email: e, role: 'owner', roleName: 'Platform Owner', status: 'active', locked: true, lastSeenAt: last(e), source: 'ADMIN_EMAILS on the server' }));
    const team = rows.map(a => ({ email: a.email, uid: a.uid || null, role: a.role, roleName: roleName(a.role, roles), status: a.status, addedAt: a.addedAt, addedBy: a.addedBy,
      updatedAt: a.updatedAt || null, lastSeenAt: last(a.email), note: a.note || '', perms: rolePerms(a.role, roles) }));
    return { owners, team, roles: [...Object.entries(BUILTIN_ROLES).map(([id, r]) => ({ id, ...r, perms: r.perms })), ...roles.map(r => ({ ...r, builtin: false }))], perms: PERMS, mine: admin.perms };
  },
  async checkGrant(admin, roleId) {
    if (roleId === 'owner') bad('Platform owners are set in ADMIN_EMAILS on the server, not here.', 403, 'owner_locked');
    const roles = await this.customRoles();
    if (!BUILTIN_ROLES[roleId] && !roles.some(r => r.id === roleId)) bad('Unknown role.', 400, 'bad_role');
    if (roleId === 'super_admin' && !admin.owner) bad('Only a platform owner can make someone a Super Admin.', 403, 'forbidden');
    const theirs = rolePerms(roleId, roles);
    if (!canGrant(admin.perms, theirs)) bad('You can\'t give a role that has permissions you don\'t have yourself.', 403, 'escalation');
    return theirs;
  },
  async x_admins_add(admin, b) {
    if (b.confirm !== true) bad('Confirm first.', 400, 'confirm');
    const email = normEmail(b.email || '');
    if (!EMAIL_RE.test(email)) bad('Enter a valid email address.');
    if (this.owners.includes(email)) bad('That email is a platform owner already.', 409, 'exists');
    if (email === admin.email) bad('You can\'t change your own admin seat.', 403, 'self');
    await this.checkGrant(admin, String(b.role || ''));
    const prev = await this.store.get(K.admins, email);
    if (prev && prev.status === 'active') bad('This person is already an admin. Change their role instead.', 409, 'exists');
    const user = await this.platform.getUserByEmail(email);
    const now = this.now();
    const rec = { email, uid: user ? user.uid : null, role: b.role, status: 'active', addedAt: now, addedBy: admin.email, updatedAt: now, note: String(b.note || '').slice(0, 300) };
    await this.store.set(K.admins, email, rec);
    await this.audit(admin, 'admins.add', { type: 'admin', id: email }, 'ok', { role: b.role, before: prev ? { role: prev.role, status: prev.status } : null, accountExists: !!user });
    return { admin: rec, accountExists: !!user, note: user ? null : 'No ExamFlow account uses this email yet. They become an admin when they sign up with it and verify the email.' };
  },
  async x_admins_update(admin, b) {
    if (b.confirm !== true) bad('Confirm first.', 400, 'confirm');
    const email = normEmail(b.email || '');
    if (email === admin.email) bad('You can\'t change your own role.', 403, 'self');
    if (this.owners.includes(email)) bad('Platform owners are set in ADMIN_EMAILS on the server, not here.', 403, 'owner_locked');
    const prev = await this.store.get(K.admins, email); if (!prev || prev.status !== 'active') bad('Admin not found.', 404, 'not_found');
    await this.checkGrant(admin, prev.role);          // you must be able to hold their current role to change it
    await this.checkGrant(admin, String(b.role || ''));
    const next = { ...prev, role: b.role, updatedAt: this.now(), updatedBy: admin.email };
    await this.store.set(K.admins, email, next);
    await this.audit(admin, 'admins.update', { type: 'admin', id: email }, 'ok', { before: { role: prev.role }, after: { role: b.role }, reason: b.reason || null });
    return { admin: next };
  },
  async x_admins_remove(admin, b) {
    if (b.confirm !== true) bad('Confirm first.', 400, 'confirm');
    const email = normEmail(b.email || '');
    if (email === admin.email) bad('You can\'t remove yourself.', 403, 'self');
    if (this.owners.includes(email)) bad('Platform owners are set in ADMIN_EMAILS on the server, not here.', 403, 'owner_locked');
    const prev = await this.store.get(K.admins, email); if (!prev || prev.status !== 'active') bad('Admin not found.', 404, 'not_found');
    await this.checkGrant(admin, prev.role);
    await this.store.set(K.admins, email, { ...prev, status: 'removed', removedAt: this.now(), removedBy: admin.email, reason: String(b.reason || '').slice(0, 300) });
    for (const s of await this.store.where(K.sessions, 'email', email)) if (!s.revokedAt) await this.store.set(K.sessions, s.id, { ...s, revokedAt: this.now(), revokedBy: admin.email });
    await this.audit(admin, 'admins.remove', { type: 'admin', id: email }, 'ok', { role: prev.role, reason: b.reason || null });
    return { ok: true };
  },
  async x_roles_save(admin, b) {
    if (b.confirm !== true) bad('Confirm first.', 400, 'confirm');
    const name = String(b.name || '').trim(); if (!name || name.length > 60) bad('Give the role a name (up to 60 characters).');
    const perms = Array.from(new Set((Array.isArray(b.perms) ? b.perms : []).filter(p => PERMS[p])));
    if (!perms.length) bad('Choose at least one permission.');
    if (perms.includes('admins.manage') && !admin.owner) bad('Only a platform owner can create a role that manages admins.', 403, 'forbidden');
    if (!canGrant(admin.perms, perms)) bad('A custom role can only contain permissions you hold yourself.', 403, 'escalation');
    let id = b.id ? String(b.id) : 'role_' + name.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '').slice(0, 30);
    if (BUILTIN_ROLES[id]) bad('That name clashes with a built-in role.', 409, 'exists');
    const prev = await this.store.get(K.roles, id);
    if (!b.id && prev && !prev.deleted) bad('A role with this name exists.', 409, 'exists');
    const rec = { id, name, description: String(b.description || '').slice(0, 200), perms, updatedAt: this.now(), updatedBy: admin.email, createdAt: prev ? prev.createdAt : this.now(), deleted: false };
    await this.store.set(K.roles, id, rec);
    await this.audit(admin, 'roles.save', { type: 'role', id }, 'ok', { before: prev ? { perms: prev.perms, name: prev.name } : null, after: { perms, name } });
    return { role: rec };
  },
  async x_roles_delete(admin, b) {
    if (b.confirm !== true) bad('Confirm first.', 400, 'confirm');
    const id = String(b.id || ''); const prev = await this.store.get(K.roles, id);
    if (!prev || prev.deleted) bad('Role not found.', 404, 'not_found');
    const using = (await this.store.all(K.admins)).filter(a => a.role === id && a.status === 'active');
    if (using.length) bad(`${using.length} admin${using.length === 1 ? ' uses' : 's use'} this role. Give them another role first.`, 409, 'in_use');
    await this.store.set(K.roles, id, { ...prev, deleted: true, deletedAt: this.now(), deletedBy: admin.email });
    await this.audit(admin, 'roles.delete', { type: 'role', id }, 'ok', { perms: prev.perms });
    return { ok: true };
  }
};
module.exports = { methods };
