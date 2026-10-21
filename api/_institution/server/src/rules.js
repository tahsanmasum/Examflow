'use strict';
/* Who may read and write what on the institution server.

   These mirror ExamFlow's Firestore security rules (firestore.rules), so the
   app behaves the same as on the cloud, and add the institutional checks:

   · Teacher allowlist: creating, listing, editing and deleting exams, and
     grading, need a signed-in account whose email is on the institution's
     approved teacher list. A teacher ID on its own grants nothing.
   · Licence: creating a new exam, or changing an existing exam's questions,
     settings or schedule (which includes publishing and reopening), needs an
     Active or Expiring Soon licence. Ending an exam early, moving it to the
     trash and restoring it stay possible, and so do student attempts, grading,
     results and exports. Nothing is ever deleted because a licence lapsed.
   · Tighter than the cloud: attempts can only be listed by exam token or
     switch code (never the whole table) unless you are the institution admin,
     and a new attempt must point at an exam that exists. */

const MAX_DOC = 1048576; // same 1 MiB limit as Firestore, so the app's own size checks still fit
const ID_RE = /^[^/\u0000-\u001f]{1,300}$/;
const FIELD_RE = /^[A-Za-z_][A-Za-z0-9_]{0,63}$/;
const COLLECTIONS = new Set(['exams', 'sessions', 'teachers', 'feedback', 'meta']);
// Exam fields that may change while the licence is not active (ending early, trash, restore).
const MGMT_FIELDS = new Set(['_trashed', '_trashedAt', 'endTime', 'reopened', 'savedAt', 'updatedAt']);

class Denied extends Error { constructor(msg, code = 403, reason) { super(msg); this.status = code; this.reason = reason || 'denied'; } }
const deny = (msg, code, reason) => { throw new Denied(msg, code, reason); };

const isObj = v => v && typeof v === 'object' && !Array.isArray(v);
const str = (v, max) => typeof v === 'string' && v.length <= max;

/** Firestore-style merge: nested maps merge, everything else replaces. Applies special values. */
function mergeDoc(base, patch, merge) {
  const out = merge && isObj(base) ? { ...base } : {};
  for (const [k, v] of Object.entries(patch || {})) {
    if (isObj(v) && v.__ef === 'inc') out[k] = (typeof out[k] === 'number' ? out[k] : 0) + Number(v.by || 0);
    else if (isObj(v) && v.__ef === 'ts') out[k] = Date.now();
    else if (isObj(v) && v.__ef === 'del') delete out[k];
    else if (merge && isObj(v) && isObj(out[k])) out[k] = mergeDoc(out[k], v, true);
    else out[k] = resolveSpecial(v);
  }
  return out;
}
function resolveSpecial(v) {
  if (Array.isArray(v)) return v.map(resolveSpecial);
  if (isObj(v)) {
    if (v.__ef === 'ts') return Date.now();
    if (v.__ef === 'inc') return Number(v.by || 0);
    const o = {}; for (const [k, x] of Object.entries(v)) o[k] = resolveSpecial(x); return o;
  }
  return v;
}
function changedFields(a, b) {
  const keys = new Set([...Object.keys(a || {}), ...Object.keys(b || {})]); const out = [];
  for (const k of keys) if (JSON.stringify(a ? a[k] : undefined) !== JSON.stringify(b ? b[k] : undefined)) out.push(k);
  return out;
}

class Rules {
  constructor({ db, config, auth, licence }) { this.db = db; this.config = config; this.auth = auth; this.licence = licence; }

  ctx(user) {
    const email = user ? user.email : null;
    const entry = email ? this.auth.allowEntry(email) : null;
    return { user, uid: user ? user.uid : null, email, admin: !!(email && this.config.admins.includes(email)), teacher: entry, teacherId: entry ? entry.teacher_id : null };
  }
  needTeacher(c, what) {
    if (!c.user) deny('Sign in first.', 401, 'unauthenticated');
    if (!c.teacher) deny(`Your account (${c.email}) is not on this institution's approved teacher list, so you can't ${what}. Ask your exam office to add your teacher ID.`, 403, 'not_allowlisted');
  }
  async needLicence(what) {
    const st = await this.licence.fresh();
    if (!st.canCreateExams) deny(`The institution's ExamFlow licence is ${st.status}, so you can't ${what} right now. Existing exams, grading and results still work. ${st.message || ''}`.trim(), 403, 'licence_' + String(st.status).toLowerCase().replace(/\s+/g, '_'));
    return st;
  }
  checkIds(col, id) {
    if (!COLLECTIONS.has(col)) deny('Unknown collection.', 403, 'collection');
    if (id !== undefined && !ID_RE.test(String(id))) deny('Invalid document id.', 400, 'bad_id');
  }

  // ── reads ──
  async get(c, col, id) {
    this.checkIds(col, id);
    if (col === 'exams' || col === 'sessions' || col === 'meta') return;           // open, as on the cloud
    if (col === 'teachers') { if (c.uid === id || c.admin) return; deny('You can only read your own profile.'); }
    if (col === 'feedback') { if (c.admin) return; deny('Only the institution admin can read feedback.'); }
  }
  async query(c, col, where) {
    this.checkIds(col);
    for (const w of where) {
      if (!Array.isArray(w) || w.length !== 3 || w[1] !== '==' || !FIELD_RE.test(w[0])) deny('Only equality filters on simple fields are supported.', 400, 'bad_query');
      if (!['string', 'number', 'boolean'].includes(typeof w[2]) && w[2] !== null) deny('Invalid filter value.', 400, 'bad_query');
    }
    const eq = f => { const w = where.find(x => x[0] === f); return w ? w[2] : undefined; };
    if (c.admin) return;
    if (col === 'exams') {
      if (!c.user) deny('Sign in first.', 401, 'unauthenticated');
      if (eq('teacherUid') !== undefined && eq('teacherUid') === c.uid) { this.needTeacher(c, 'open your exams'); return; }
      deny('Exams can only be listed by their own teacher.', 403, 'exam_list');
    }
    if (col === 'sessions') {
      if (typeof eq('examToken') === 'string' || typeof eq('switchCode') === 'string') return;
      deny('Attempts can only be looked up by exam or switch code.', 403, 'session_list');
    }
    if (col === 'meta') return;
    deny('Only the institution admin can list this.', 403, 'admin_only');
  }

  // ── writes ── returns the document to store (null to delete)
  async write(c, col, id, op, data, merge) {
    this.checkIds(col, id);
    if (op !== 'delete' && !isObj(data)) deny('Document data must be an object.', 400, 'bad_data');
    if (op !== 'delete') for (const k of Object.keys(data)) if (!FIELD_RE.test(k)) deny('Invalid field name: ' + k, 400, 'bad_field');
    const existing = this.db.getDoc(col, id);
    const next = op === 'delete' ? null : mergeDoc(existing, data, merge && !!existing);
    if (next && Buffer.byteLength(JSON.stringify(next)) > MAX_DOC) deny('This document is larger than 1 MB. Use fewer or smaller pictures.', 413, 'too_large');
    const fn = this['w_' + col]; await fn.call(this, c, id, op, existing, next);
    return next;
  }
  async w_exams(c, id, op, ex, next) {
    if (op === 'delete') {
      if (!ex) return;
      if (c.admin) return;
      this.needTeacher(c, 'delete exams');
      if (ex.teacherUid !== c.uid) deny('You can only delete your own exams.', 403, 'not_owner');
      return;
    }
    if (!ex) {
      this.needTeacher(c, 'create exams');
      if (next.teacherUid !== c.uid) deny('A new exam must belong to you.', 403, 'owner_mismatch');
      await this.needLicence('create new exams');
      return;
    }
    if (!c.admin) {
      this.needTeacher(c, 'change exams');
      if (ex.teacherUid !== c.uid || next.teacherUid !== c.uid) deny('You can only change your own exams.', 403, 'not_owner');
    }
    const changed = changedFields(ex, next);
    if (!changed.length) return;
    if (changed.every(k => MGMT_FIELDS.has(k)) && next.reopened !== true
        && !(changed.includes('endTime') && Number(next.endTime) > Math.max(Number(ex.endTime) || 0, Date.now() + 120000))) {
      return; // ending early / trash / restore never need a licence
    }
    await this.needLicence('edit, publish or reopen exams');
  }
  async w_sessions(c, id, op, ex, next) {
    if (op === 'delete') {
      if (!ex) return;
      if (c.admin) return;
      if (c.user && c.teacher && ex.teacherUid && ex.teacherUid === c.uid) return;
      deny('Only the institution admin can delete attempts.', 403, 'admin_only');
    }
    if (!ex) {
      if (!str(next.examToken, 64) || !next.examToken) deny('An attempt needs its exam token.', 400, 'bad_session');
      if (next.submitted === true) deny('A new attempt can\'t start as submitted.', 403, 'bad_session');
      if (!this.db.getDoc('exams', next.examToken)) deny('That exam does not exist on this server.', 404, 'no_exam');
      return;
    }
    if (next.examToken !== ex.examToken) deny('An attempt can\'t move to another exam.', 403, 'bad_session');
    if (ex.submitted !== true) return;
    if (c.admin) return;
    const exam = this.db.getDoc('exams', ex.examToken);
    if (c.user && c.teacher && exam && exam.teacherUid === c.uid) return; // grading
    deny('This attempt is submitted. Only its teacher can change it now.', 403, 'submitted');
  }
  async w_teachers(c, id, op, ex, next) {
    if (op === 'delete') { if (c.admin) return; deny('Only the institution admin can delete profiles.', 403, 'admin_only'); }
    if (c.admin && ex) return;
    if (!c.user || c.uid !== id) deny('You can only change your own profile.', 403, 'not_owner');
    if (!ex) {
      if (!str(next.name || '', 120) || !str(next.email || '', 254)) deny('Name or email too long.', 400, 'bad_profile');
      if (next.email && String(next.email).toLowerCase() !== c.email) deny('Your profile email must be your sign-in email.', 403, 'bad_profile');
    }
  }
  async w_feedback(c, id, op, ex, next) {
    if (op === 'delete' || ex) { if (c.admin) return; deny('Only the institution admin can change feedback.', 403, 'admin_only'); }
    if (!str(next.name || '', 120) || !str(next.message || '', 5000) || !String(next.message || '').length || !str(next.type || 'other', 40) || !str(next.institute || '', 200)) deny('Feedback is incomplete or too long.', 400, 'bad_feedback');
  }
  async w_meta(c, id, op, ex, next) {
    if (id === 'stats' && op !== 'delete' && Object.keys(next).every(k => k === 'visits' || k === 'lastVisit')) return;
    if (c.admin) return;
    deny('Not allowed.', 403, 'admin_only');
  }
}

module.exports = { Rules, Denied, mergeDoc, changedFields, MGMT_FIELDS };
