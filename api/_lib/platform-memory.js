'use strict';
/* In-memory stand-in for platform-firebase.js, used by the local test server.
   Same method names and return shapes. Records every write so tests can check
   what really happened (e.g. that suspending a user disabled the account). */
const crypto = require('node:crypto');

function memoryPlatform(seed = {}) {
  const users = new Map(), teachers = new Map(), exams = new Map(), sessions = new Map(), feedback = new Map(), meta = new Map(), flags = new Map();
  const log = [];
  const now = () => Date.now();
  for (const u of seed.users || []) users.set(u.uid, { disabled: false, emailVerified: true, createdAt: now(), lastSignInAt: null, lastActiveAt: null, tokensValidAfter: null, providers: ['password'], mfaFactors: [], ...u, email: (u.email || '').toLowerCase() });
  for (const t of seed.teachers || []) teachers.set(t.uid, t);
  for (const e of seed.exams || []) exams.set(e.token, e);
  for (const s of seed.sessions || []) sessions.set(s.id, s);
  for (const f of seed.feedback || []) feedback.set(f.id, f);
  const copy = v => v == null ? v : JSON.parse(JSON.stringify(v));
  const p = {
    kind: 'memory', log, U: users, E: exams, F: feedback, meta, flags,
    async listUsers() { return [...users.values()].map(copy); },
    async getUser(uid) { return copy(users.get(uid)) || null; },
    async getUserByEmail(email) { return copy([...users.values()].find(u => u.email === String(email || '').toLowerCase())) || null; },
    async createUser({ email, displayName }) {
      if ([...users.values()].some(u => u.email === email)) { const e = new Error('The email address is already in use by another account.'); e.code = 'auth/email-already-exists'; throw e; }
      const u = { uid: 'u_' + crypto.randomBytes(6).toString('hex'), email, displayName: displayName || null, disabled: false, emailVerified: false, createdAt: now(), lastSignInAt: null, lastActiveAt: null, tokensValidAfter: null, providers: ['password'], mfaFactors: [] };
      users.set(u.uid, u); log.push(['createUser', u.uid, email]); return copy(u);
    },
    async updateUser(uid, patch) { const u = users.get(uid); if (!u) { const e = new Error('No user record.'); e.code = 'auth/user-not-found'; throw e; } Object.assign(u, patch); log.push(['updateUser', uid, patch]); return copy(u); },
    async revokeTokens(uid) { const u = users.get(uid); u.tokensValidAfter = now(); log.push(['revokeTokens', uid]); return u.tokensValidAfter; },
    async resetLink(email) { log.push(['resetLink', email]); return 'https://example.invalid/reset?oob=' + crypto.randomBytes(8).toString('hex'); },
    async teachers() { return [...teachers.values()].map(copy); },
    async setTeacher(uid, patch) { teachers.set(uid, { ...(teachers.get(uid) || { uid }), ...patch }); log.push(['setTeacher', uid, patch]); },
    async exams() { return [...exams.values()].map(e => ({ token: e.token, teacherUid: e.teacherUid || null, type: e.type || 'mcq', course: e.course || '', section: e.section || '', createdAt: e.createdAt || null,
      startTime: e.startTime || null, endTime: e.endTime || null, trashed: !!e._trashed, draft: !!e._draft, reopened: !!e.reopened, camOn: !!(e.camMon && e.camMon.on) })); },
    async sessions() { return [...sessions.values()].map(s => ({ id: s.id, examToken: s.examToken, name: s.name || '', studentId: s.studentId || '', submitted: s.submitted === true, startedAt: s.startedAt || null,
      submittedAt: s.submittedAt || null, score: s.score ?? null, totalMarks: s.totalMarks ?? null, flags: (s.violations || []).length })); },
    async feedback() { return [...feedback.values()].map(copy); },
    async deleteExam(token) { exams.delete(token); log.push(['deleteExam', token]); },
    async deleteFeedback(id) { feedback.delete(id); log.push(['deleteFeedback', id]); },
    async readMeta(doc) { return copy(meta.get(doc)) || null; },
    async writeMeta(doc, data) { meta.set(doc, copy(data)); log.push(['writeMeta', doc]); },
    async setUserFlags(uid, data) { if (data) flags.set(uid, copy(data)); else flags.delete(uid); log.push(['setUserFlags', uid]); },
    async ping() { return 1; },
    async authPing() { return 1; },
    async rulesSource() { return seed.rules || null; }
  };
  return p;
}
module.exports = { memoryPlatform };
