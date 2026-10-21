'use strict';
/* The cloud platform as the Admin Monitor's server sees it: Firebase Auth (the
   existing identity provider) and the app's own Firestore collections. Runs
   only on Vercel with the service account; the browser never gets these powers.
   Every method returns plain objects so the console code is testable with the
   in-memory stand-in (platform-memory.js). */

function userOut(u) {
  if (!u) return null;
  const mf = u.multiFactor && Array.isArray(u.multiFactor.enrolledFactors) ? u.multiFactor.enrolledFactors : [];
  return {
    uid: u.uid, email: (u.email || '').toLowerCase() || null, displayName: u.displayName || null,
    disabled: !!u.disabled, emailVerified: !!u.emailVerified,
    createdAt: u.metadata && u.metadata.creationTime ? Date.parse(u.metadata.creationTime) : null,
    lastSignInAt: u.metadata && u.metadata.lastSignInTime ? Date.parse(u.metadata.lastSignInTime) : null,
    lastActiveAt: u.metadata && u.metadata.lastRefreshTime ? Date.parse(u.metadata.lastRefreshTime) : null,
    tokensValidAfter: u.tokensValidAfterTime ? Date.parse(u.tokensValidAfterTime) : null,
    providers: (u.providerData || []).map(p => p.providerId),
    mfaFactors: mf.map(f => f.factorId)
  };
}

function firebasePlatform(app) {
  const auth = app.auth(), db = app.firestore();
  const pick = (d, f) => { const o = {}; for (const k of f) if (d[k] !== undefined) o[k] = d[k]; return o; };
  return {
    kind: 'firebase',
    async listUsers() {
      const out = []; let next;
      do { const r = await auth.listUsers(1000, next); r.users.forEach(u => out.push(userOut(u))); next = r.pageToken; } while (next && out.length < 50000);
      return out;
    },
    async getUser(uid) { try { return userOut(await auth.getUser(uid)); } catch (e) { if (e.code === 'auth/user-not-found') return null; throw e; } },
    async getUserByEmail(email) { try { return userOut(await auth.getUserByEmail(email)); } catch (e) { if (e.code === 'auth/user-not-found') return null; throw e; } },
    async createUser({ email, displayName }) { return userOut(await auth.createUser({ email, displayName: displayName || undefined, emailVerified: false, disabled: false })); },
    async updateUser(uid, patch) { const p = {}; if ('disabled' in patch) p.disabled = !!patch.disabled; if ('displayName' in patch) p.displayName = patch.displayName || null; return userOut(await auth.updateUser(uid, p)); },
    async revokeTokens(uid) { await auth.revokeRefreshTokens(uid); const u = await auth.getUser(uid); return userOut(u).tokensValidAfter; },
    async resetLink(email) { return auth.generatePasswordResetLink(email); },
    async verifyIdToken(tok) { return auth.verifyIdToken(tok, true); },

    async teachers() { const s = await db.collection('teachers').get(); return s.docs.map(d => ({ uid: d.id, ...pick(d.data(), ['name', 'email', 'institution', 'createdAt']) })); },
    async setTeacher(uid, patch) { await db.collection('teachers').doc(uid).set(patch, { merge: true }); },
    async exams() {
      const s = await db.collection('exams').select('teacherUid', 'type', 'course', 'section', 'createdAt', 'startTime', 'endTime', '_trashed', '_draft', 'reopened', 'camMon').get();
      return s.docs.map(d => { const x = d.data(); return { token: d.id, teacherUid: x.teacherUid || null, type: x.type || 'mcq', course: x.course || '', section: x.section || '',
        createdAt: x.createdAt || null, startTime: x.startTime || null, endTime: x.endTime || null, trashed: !!x._trashed, draft: !!x._draft, reopened: !!x.reopened, camOn: !!(x.camMon && x.camMon.on) }; });
    },
    async sessions() {
      const s = await db.collection('sessions').select('examToken', 'name', 'studentId', 'submitted', 'startedAt', 'submittedAt', 'score', 'totalMarks', 'violations').get();
      return s.docs.map(d => { const x = d.data(); return { id: d.id, examToken: x.examToken || null, name: x.name || '', studentId: x.studentId || '', submitted: x.submitted === true,
        startedAt: x.startedAt || null, submittedAt: x.submittedAt || null, score: x.score ?? null, totalMarks: x.totalMarks ?? null, flags: Array.isArray(x.violations) ? x.violations.length : 0 }; });
    },
    async feedback() { const s = await db.collection('feedback').get(); return s.docs.map(d => ({ id: d.id, ...d.data() })); },
    async deleteExam(token) { await db.collection('exams').doc(token).delete(); },
    async deleteFeedback(id) { await db.collection('feedback').doc(id).delete(); },

    /* public configuration the app reads (rules: meta/* readable by anyone; written only from here) */
    async readMeta(doc) { const s = await db.collection('meta').doc(doc).get(); return s.exists ? s.data() : null; },
    async writeMeta(doc, data) { await db.collection('meta').doc(doc).set(data); },
    /* per-user feature overrides the rules read (featureUsers/{uid}: readable by that user only) */
    async setUserFlags(uid, data) { const r = db.collection('featureUsers').doc(uid); if (data) await r.set(data); else await r.delete(); },

    async ping() { const t = Date.now(); await db.collection('meta').doc('stats').get(); return Date.now() - t; },
    async authPing() { const t = Date.now(); await auth.listUsers(1); return Date.now() - t; },
    /** Where the Firestore database lives (e.g. asia-southeast1), from Google's API; null if the service account may not read it. */
    async firestoreLocation() {
      try {
        const projectId = app.options.projectId || (app.options.credential && app.options.credential.projectId);
        const tok = await app.options.credential.getAccessToken();
        const r = await fetch(`https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)`, { headers: { authorization: 'Bearer ' + tok.access_token } });
        if (!r.ok) return null; const j = await r.json(); return j.locationId || null;
      } catch (e) { return null; }
    },
    async rulesSource() {
      try { const rs = await app.securityRules().getFirestoreRuleset(); return rs && rs.source && rs.source[0] ? rs.source[0].content : null; }
      catch (e) { return { error: e.message }; }
    }
  };
}
module.exports = { firebasePlatform, userOut };
