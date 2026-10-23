// ExamFlow institution server: MongoDB setup (MongoDB 5.0+ / Atlas / Cosmos DB for MongoDB vCore)
//
// Run as a MongoDB administrator with mongosh:
//   mongosh "mongodb://ADMIN@db.uni.edu:27017/admin" --file mongodb.js
// Optional settings (before --file):  --eval "var DB_NAME='examflow', APP_USER='examflow'"
//
// What it does (safe to run again):
//   1. creates the role "examflowApp" in the ExamFlow database: full read/write on ExamFlow's
//      collections, but on "audit" only read and add — so nobody using ExamFlow's account can
//      change or delete an audit line (the database refuses it);
//   2. creates the user APP_USER with that role (asks for its password) if it does not exist;
//   3. creates ExamFlow's indexes and records the schema version.
// Then put in ExamFlow's .env:
//   DB_TYPE=mongodb
//   DB_URL=mongodb://examflow:PASSWORD@db.uni.edu:27017/examflow?replicaSet=rs0&authSource=examflow
// Atlas: create the custom role and user in the Atlas UI with the same privileges (listed below),
// or run this script against the cluster with an Atlas admin user.

/* global db, print, passwordPrompt */
var DB_NAME = (typeof DB_NAME !== 'undefined' && DB_NAME) || 'examflow';
var APP_USER = (typeof APP_USER !== 'undefined' && APP_USER) || 'examflow';
var d = db.getSiblingDB(DB_NAME);

var RW = ['find', 'insert', 'update', 'remove', 'createCollection', 'createIndex', 'listIndexes', 'collStats'];
var collections = ['meta', 'docs', 'users', 'codes', 'logins', 'oidc_state', 'allowlist', 'allowlist_history', 'inbox', 'counters'];
var privileges = collections.map(function (c) { return { resource: { db: DB_NAME, collection: c }, actions: RW }; });
privileges.push({ resource: { db: DB_NAME, collection: 'audit' }, actions: ['find', 'insert', 'createCollection', 'createIndex', 'listIndexes', 'collStats'] });
privileges.push({ resource: { db: DB_NAME, collection: '' }, actions: ['listCollections', 'dbStats'] });

if (d.getRole('examflowApp')) { d.updateRole('examflowApp', { privileges: privileges, roles: [] }); print('Role examflowApp updated.'); }
else { d.createRole({ role: 'examflowApp', privileges: privileges, roles: [] }); print('Role examflowApp created.'); }

if (d.getUser(APP_USER)) {
  d.grantRolesToUser(APP_USER, [{ role: 'examflowApp', db: DB_NAME }]);
  print('User ' + APP_USER + ' already exists; it now has the role examflowApp.');
} else {
  var pw = (typeof APP_PASSWORD !== 'undefined' && APP_PASSWORD) || passwordPrompt();
  d.createUser({ user: APP_USER, pwd: pw, roles: [{ role: 'examflowApp', db: DB_NAME }] });
  print('User ' + APP_USER + ' created in database ' + DB_NAME + ' (use authSource=' + DB_NAME + ' in DB_URL).');
}

// Indexes ExamFlow uses (the server also creates them itself if they are missing).
var ix = [
  ['docs', { col: 1, created: 1, id: 1 }], ['docs', { col: 1, 'f.examToken': 1 }], ['docs', { col: 1, 'f.teacherUid': 1 }], ['docs', { col: 1, 'f.switchCode': 1 }],
  ['users', { email: 1 }, { unique: true }], ['users', { oidc_sub: 1 }], ['allowlist', { email: 1 }, { unique: true }], ['allowlist', { teacher_id: 1 }],
  ['logins', { uid: 1 }], ['logins', { expires: 1 }], ['codes', { email: 1, purpose: 1 }], ['oidc_state', { created: 1 }],
  ['audit', { n: 1 }, { unique: true }], ['audit', { t: 1 }], ['allowlist_history', { n: 1 }], ['inbox', { msg_id: 1 }]
];
ix.forEach(function (x) { d.getCollection(x[0]).createIndex(x[1], x[2] || {}); });
['audit', 'allowlist_history'].forEach(function (c) { d.counters.updateOne({ _id: c }, { $setOnInsert: { n: 0 } }, { upsert: true }); });
d.meta.updateOne({ _id: 'schema_version' }, { $set: { v: '2' } }, { upsert: true });

var hello = d.adminCommand({ hello: 1 });
if (!hello.setName && hello.msg !== 'isdbgrid') print('NOTE: this MongoDB is a single server, not a replica set. ExamFlow works, but groups of changes cannot be undone together. Run it as a one-member replica set (see DATABASES.md).');
print('ExamFlow database "' + DB_NAME + '" is ready. Next: node server/src/cli.js db-check');
