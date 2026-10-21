'use strict';
/* Admin roles and permissions for the Admin Monitor.

   Who is an admin:
     · Platform owners: the emails in the ADMIN_EMAILS environment variable on
       Vercel (default examflow.live@gmail.com). They hold every permission,
       can't be edited or removed from the Admin Monitor, and are the only ones
       Firestore's rules also treat as admin (adminEmails() in firestore.rules).
     · Team members: records in the cpAdmins collection, created by someone
       with admins.manage. Each has one role, built in or custom (cpRoles).

   Every /api/admin action names the permission it needs (ACTION_PERMS). The
   server checks it on every request; hiding a button is never the protection.
   Nobody can change their own role, and nobody can grant a permission they
   don't hold themselves. */

const PERMS = {
  'overview.view': 'See the overview dashboard',
  'users.view': 'See the user directory and user details',
  'users.invite': 'Add users and send invitations',
  'users.edit': 'Edit names, institution membership and notes',
  'users.suspend': 'Suspend, disable and reactivate accounts',
  'users.sessions': 'Sign users out of every device',
  'users.recover': 'Send account-recovery (password reset) emails',
  'institutions.view': 'See institutions, servers and rosters',
  'institutions.manage': 'Create and edit institutions, rosters, servers and install packages',
  'packages.view': 'See entitlement packages',
  'packages.manage': 'Create and edit entitlement packages',
  'packages.assign': 'Assign packages and overrides to institutions',
  'licences.view': 'See licences and their history',
  'licences.manage': 'Set, renew, suspend and reactivate licences',
  'licences.revoke': 'Revoke licences and reactivate revoked ones',
  'features.view': 'See feature controls',
  'features.manage': 'Turn features on or off',
  'features.emergency': 'Use emergency kill switches',
  'settings.view': 'See global settings',
  'settings.manage': 'Change global settings and roll them back',
  'announcements.view': 'See announcements',
  'announcements.manage': 'Draft, publish, schedule and take down announcements',
  'messages.view': 'See dashboard message history',
  'messages.send': 'Send dashboard messages',
  'health.view': 'See system health and versions',
  'security.view': 'See the security center',
  'security.manage': 'Revoke admin sessions and resolve security alerts',
  'audit.view': 'See audit logs',
  'audit.export': 'Export audit logs',
  'reports.view': 'Run and export reports',
  'activity.view': 'See cloud exams, live sessions and feedback',
  'admins.view': 'See the admin team and roles',
  'admins.manage': 'Add admins, change roles and create custom roles'
};
const ALL = Object.keys(PERMS);
const VIEW = ALL.filter(p => /\.view$/.test(p));

const BUILTIN_ROLES = {
  owner: { name: 'Platform Owner', builtin: true, locked: true, perms: ALL,
    description: 'Everything. Set by ADMIN_EMAILS on the server; can\'t be assigned or removed here.' },
  super_admin: { name: 'Super Admin', builtin: true, perms: ALL,
    description: 'Full platform control, including the admin team. Can\'t change platform owners.' },
  operations: { name: 'Operations Administrator', builtin: true,
    perms: ['overview.view', 'institutions.view', 'institutions.manage', 'packages.view', 'packages.assign', 'licences.view', 'licences.manage',
      'features.view', 'health.view', 'audit.view', 'reports.view', 'users.view'],
    description: 'Institutions, licences, package assignment and server health.' },
  support: { name: 'User Support Administrator', builtin: true,
    perms: ['overview.view', 'users.view', 'users.recover', 'messages.view', 'messages.send', 'institutions.view', 'licences.view', 'audit.view'],
    description: 'Looks up accounts, sends messages and recovery emails. Escalates anything else.' },
  communications: { name: 'Communications Manager', builtin: true,
    perms: ['overview.view', 'announcements.view', 'announcements.manage', 'messages.view', 'messages.send', 'users.view', 'institutions.view'],
    description: 'Announcements and dashboard messages.' },
  readonly: { name: 'Read-Only Administrator', builtin: true, perms: VIEW.filter(p => p !== 'admins.view'),
    description: 'Sees dashboards and reports. Can\'t change anything.' }
};

/* Which permission each /api/admin action needs. reauth: the admin must have
   signed in within the last few minutes (Settings → Security → re-authentication window). */
const ACTION_PERMS = {
  whoami: { perm: null },
  'console.bootstrap': { perm: null },
  'search': { perm: null },
  'notifications': { perm: null },
  'admin.prefs': { perm: null },
  'admin.signoutAll': { perm: null },
  // overview
  'overview.metrics': { perm: 'overview.view' },
  // institutions (v46 actions)
  overview: { perm: 'institutions.view' },
  'inst.create': { perm: 'institutions.manage' },
  'inst.get': { perm: 'institutions.view' },
  'inst.update': { perm: 'institutions.manage' },
  'inst.readiness': { perm: 'institutions.view' },
  'allowlist.validate': { perm: 'institutions.view' },
  'allowlist.save': { perm: 'institutions.manage' },
  'package.preview': { perm: 'institutions.view' },
  'package.generate': { perm: 'institutions.manage' },
  'package.download': { perm: 'institutions.manage' },
  'package.deliver': { perm: 'institutions.manage' },
  'package.revoke': { perm: 'institutions.manage', reauth: true },
  'regcode.create': { perm: 'institutions.manage' },
  'server.reset': { perm: 'institutions.manage', reauth: true },
  // licences
  'licence.preview': { perm: 'licences.view' },
  'licence.set': { perm: 'licences.manage' },
  'licence.renew': { perm: 'licences.manage' },
  'licence.block': { perm: 'licences.manage' },
  'licence.unblock': { perm: 'licences.manage' },
  'licence.suspend': { perm: 'licences.manage' },
  'licence.reactivate': { perm: 'licences.manage' },
  'licence.revoke': { perm: 'licences.revoke', reauth: true },
  'licence.policy': { perm: 'licences.manage' },
  'licence.list': { perm: 'licences.view' },
  // users
  'users.list': { perm: 'users.view' },
  'users.get': { perm: 'users.view' },
  'users.invite': { perm: 'users.invite' },
  'users.inviteSent': { perm: 'users.invite' },
  'users.update': { perm: 'users.edit' },
  'users.suspend': { perm: 'users.suspend' },
  'users.disable': { perm: 'users.suspend' },
  'users.reactivate': { perm: 'users.suspend' },
  'users.revokeSessions': { perm: 'users.sessions' },
  'users.recover': { perm: 'users.recover' },
  'users.recoverSent': { perm: 'users.recover' },
  // packages (entitlements)
  'plans.list': { perm: 'packages.view' },
  'plans.get': { perm: 'packages.view' },
  'plans.save': { perm: 'packages.manage' },
  'plans.status': { perm: 'packages.manage' },
  'plans.assignPreview': { perm: 'packages.view' },
  'plans.assign': { perm: 'packages.assign' },
  'plans.override': { perm: 'packages.assign' },
  // features
  'features.list': { perm: 'features.view' },
  'features.preview': { perm: 'features.view' },
  'features.set': { perm: 'features.manage' },
  'features.kill': { perm: 'features.emergency', reauth: true },
  'features.revert': { perm: 'features.manage' },
  // settings
  'settings.get': { perm: 'settings.view' },
  'settings.preview': { perm: 'settings.view' },
  'settings.save': { perm: 'settings.manage' },
  'settings.rollback': { perm: 'settings.manage' },
  // announcements
  'ann.list': { perm: 'announcements.view' },
  'ann.save': { perm: 'announcements.manage' },
  'ann.publish': { perm: 'announcements.manage' },
  'ann.unpublish': { perm: 'announcements.manage' },
  'ann.archive': { perm: 'announcements.manage' },
  'ann.killAll': { perm: 'announcements.manage' },
  // messages
  'msg.list': { perm: 'messages.view' },
  'msg.get': { perm: 'messages.view' },
  'msg.recipients': { perm: 'messages.send' },
  'msg.save': { perm: 'messages.send' },
  'msg.send': { perm: 'messages.send' },
  'msg.archive': { perm: 'messages.send' },
  // health, security, audit, reports, activity
  'health.get': { perm: 'health.view' },
  'security.get': { perm: 'security.view' },
  'security.revokeSession': { perm: 'security.manage', reauth: true },
  'security.ackAlert': { perm: 'security.manage' },
  'audit.list': { perm: 'audit.view' },
  'audit.export': { perm: 'audit.export' },
  'reports.run': { perm: 'reports.view' },
  'activity.get': { perm: 'activity.view' },
  'activity.deleteExam': { perm: 'activity.view', ownerOnly: true, reauth: true },
  'activity.deleteFeedback': { perm: 'activity.view', ownerOnly: true },
  // admin team
  'admins.list': { perm: 'admins.view' },
  'admins.add': { perm: 'admins.manage', reauth: true },
  'admins.update': { perm: 'admins.manage', reauth: true },
  'admins.remove': { perm: 'admins.manage', reauth: true },
  'roles.save': { perm: 'admins.manage', reauth: true },
  'roles.delete': { perm: 'admins.manage', reauth: true }
};

/** The permissions a role id gives, looking at built-in roles first, then custom ones. */
function rolePerms(roleId, customRoles) {
  if (BUILTIN_ROLES[roleId]) return BUILTIN_ROLES[roleId].perms.slice();
  const r = (customRoles || []).find(x => x.id === roleId);
  return r ? (r.perms || []).filter(p => PERMS[p]) : [];
}
function roleName(roleId, customRoles) {
  if (BUILTIN_ROLES[roleId]) return BUILTIN_ROLES[roleId].name;
  const r = (customRoles || []).find(x => x.id === roleId);
  return r ? r.name : roleId;
}
/** May an admin holding `mine` hand out a role holding `theirs`? Only if theirs ⊆ mine. */
function canGrant(mine, theirs) { const m = new Set(mine); return theirs.every(p => m.has(p)); }

module.exports = { PERMS, ALL, BUILTIN_ROLES, ACTION_PERMS, rolePerms, roleName, canGrant };
