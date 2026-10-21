'use strict';
/* ExamFlow's switchable features, shared by the GHUM control plane and the
   institution server (which enforces them). Only features that really exist in
   ExamFlow are listed, and each says honestly where it is enforced:
     rules   cloud: Firestore security rules refuse the write (meta/features, featureUsers/{uid})
     server  institution: the institution server's database rules refuse the write
     app     only the app hides it (the work happens inside the browser, so no server sees it)

   Precedence, highest first:
     1. Emergency kill switch      off everywhere (cloud and every institution)
     2. Package entitlement        institutions only: a feature their package doesn't include is off,
                                   unless an approved exception override grants it
     3. Institution override       institutions only
     4. User override              cloud accounts only
     5. Global default             everyone else
   Core protections (sign-in, permissions, audit, data integrity) are not features
   and can't be switched off. */

const FEATURES = [
  { key: 'exam.mcq', name: 'MCQ exams', group: 'Exams', default: true, killable: false,
    description: 'Creating multiple-choice exams.', enforce: { cloud: 'rules', institution: 'server' } },
  { key: 'exam.written', name: 'Written exams', group: 'Exams', default: true, killable: false,
    description: 'Creating written exams graded by the teacher.', enforce: { cloud: 'rules', institution: 'server' } },
  { key: 'exam.combined', name: 'MCQ + written exams', group: 'Exams', default: true, killable: true,
    description: 'Creating combined exams with an MCQ part and a written part.', enforce: { cloud: 'rules', institution: 'server' } },
  { key: 'camera.monitoring', name: 'Camera monitoring', group: 'Integrity', default: true, killable: true,
    description: 'Turning on the student camera checks for an exam.', enforce: { cloud: 'rules', institution: 'server' } },
  { key: 'questions.images', name: 'Pictures in questions', group: 'Questions', default: true, killable: true,
    description: 'Diagrams, photos and drawings attached to questions.', enforce: { cloud: 'rules', institution: 'server' } },
  { key: 'reader.paper', name: 'Read a question paper', group: 'Questions', default: true, killable: true,
    description: 'Reading photos, PDFs and Word files into questions. Runs inside the teacher\'s browser.', enforce: { cloud: 'app', institution: 'app' } },
  { key: 'results.export', name: 'Result exports', group: 'Results', default: true, killable: true,
    description: 'CSV reports and answer-script PDFs.', enforce: { cloud: 'app', institution: 'app' } },
  { key: 'results.review', name: 'Student review links', group: 'Results', default: true, killable: true,
    description: 'Links that let students see their graded scripts.', enforce: { cloud: 'app', institution: 'app' } },
  { key: 'exam.deviceSwitch', name: 'Switch device during an exam', group: 'Integrity', default: true, killable: true,
    description: 'Students carrying on from another device with a code and password.', enforce: { cloud: 'app', institution: 'app' } },
  { key: 'feedback.form', name: 'Feedback form', group: 'Platform', default: true, killable: true,
    description: 'The in-app feedback form that reaches the Admin Monitor.', enforce: { cloud: 'rules', institution: 'app' } }
];
const BY_KEY = Object.fromEntries(FEATURES.map(f => [f.key, f]));

/**
 * Effective state of every feature.
 * cfg: { defaults: {key:bool}, kill: {key:bool} }      (global configuration)
 * ctx: { kind: 'cloud', user: {on:{}, off:{}} }  or  { kind: 'institution', entitled: {key:bool}|null, overrides: {key:{on:bool, exception?:bool}} }
 * Returns { key: { on, source } } where source names the rule that decided it.
 */
function effective(cfg, ctx) {
  cfg = cfg || {}; const d = cfg.defaults || {}, kill = cfg.kill || {};
  const out = {};
  for (const f of FEATURES) {
    const k = f.key; const def = k in d ? !!d[k] : f.default;
    if (kill[k] && f.killable) { out[k] = { on: false, source: 'kill switch' }; continue; }
    if (ctx && ctx.kind === 'institution') {
      const ov = ctx.overrides && ctx.overrides[k];
      const inPkg = !ctx.entitled || ctx.entitled[k] === true;
      if (!inPkg && !(ov && ov.on && ov.exception)) { out[k] = { on: false, source: 'not in package' }; continue; }
      if (ov && typeof ov.on === 'boolean') { out[k] = { on: ov.on, source: ov.exception && !inPkg ? 'approved exception' : 'institution override' }; continue; }
      out[k] = { on: def, source: 'global default' }; continue;
    }
    if (ctx && ctx.kind === 'cloud' && ctx.user) {
      if (ctx.user.on && ctx.user.on[k]) { out[k] = { on: true, source: 'user override' }; continue; }
      if (ctx.user.off && ctx.user.off[k]) { out[k] = { on: false, source: 'user override' }; continue; }
    }
    out[k] = { on: def, source: 'global default' };
  }
  return out;
}
/** Which feature an exam document uses: type, camera, pictures. */
function examNeeds(exam) {
  const t = exam && exam.type || 'mcq';
  const need = [t === 'written' ? 'exam.written' : t === 'combined' ? 'exam.combined' : 'exam.mcq'];
  if (exam && exam.camMon && exam.camMon.on === true) need.push('camera.monitoring');
  if (exam && exam.qImages && typeof exam.qImages === 'object' && Object.keys(exam.qImages).length) need.push('questions.images');
  return need;
}

module.exports = { FEATURES, BY_KEY, effective, examNeeds };
