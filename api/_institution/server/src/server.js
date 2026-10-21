'use strict';
/* ExamFlow institution server.
   Serves the ExamFlow app to the institution's teachers and students, and
   stores everything in the institution's own database (DATA_DIR). */
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const { readConfig, loadDotEnv } = require('./config');
const { DB } = require('./db');
const { readPackage, applyPackage } = require('./package');
const { Auth } = require('./auth');
const { Licence, SERVER_VERSION } = require('./licence');
const { Rules, Denied } = require('./rules');
const { Sync } = require('./sync');
const { randomId } = require('./util');

const log = (...a) => console.log(new Date().toISOString(), ...a);

function parseCookies(h) {
  const o = {}; String(h || '').split(';').forEach(p => { const i = p.indexOf('='); if (i > 0) o[p.slice(0, i).trim()] = decodeURIComponent(p.slice(i + 1).trim()); }); return o;
}
function send(res, status, body, headers = {}) {
  const isBuf = Buffer.isBuffer(body);
  const data = isBuf ? body : (typeof body === 'string' ? body : JSON.stringify(body));
  res.writeHead(status, {
    'content-type': isBuf || typeof body === 'string' ? (headers['content-type'] || 'text/plain; charset=utf-8') : 'application/json; charset=utf-8',
    'x-content-type-options': 'nosniff', 'referrer-policy': 'same-origin', 'x-frame-options': 'SAMEORIGIN',
    'cache-control': headers['cache-control'] || 'no-store', ...headers
  });
  res.end(data);
}
function readBody(req, max) {
  return new Promise((resolve, reject) => {
    let n = 0; const chunks = [];
    req.on('data', c => { n += c.length; if (n > max) { reject(new Denied('Request too large.', 413, 'too_large')); req.destroy(); } else chunks.push(c); });
    req.on('end', () => { try { resolve(n ? JSON.parse(Buffer.concat(chunks).toString('utf8')) : {}); } catch (e) { reject(new Denied('Invalid JSON.', 400, 'bad_json')); } });
    req.on('error', reject);
  });
}
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.svg': 'image/svg+xml', '.gz': 'application/gzip', '.ico': 'image/x-icon', '.webp': 'image/webp' };

function createApp({ config, pkg, db, fetchImpl }) {
  const auth = new Auth({ db, config, fetchImpl });
  const instId = pkg.manifest.institution.id;
  const sync = new Sync({ db, log, instId });
  const licence = new Licence({ db, config, pkg, fetchImpl, log });
  licence.sync = sync;
  const rules = new Rules({ db, config, auth, licence, sync });
  const secure = req => config.publicUrl.startsWith('https://') || (config.trustProxy && req.headers['x-forwarded-proto'] === 'https');
  const ipOf = req => (config.trustProxy && String(req.headers['x-forwarded-for'] || '').split(',')[0].trim()) || req.socket.remoteAddress || '?';
  const cookie = (req, token, maxAgeSec) =>
    `ef_sid=${token}; Path=/; HttpOnly; SameSite=Lax${secure(req) ? '; Secure' : ''}; Max-Age=${maxAgeSec}`;
  const userOf = req => auth.userFromToken(parseCookies(req.headers.cookie).ef_sid);

  function instConfig() {
    return { id: instId, name: db.getMeta('institution_name') || pkg.manifest.institution.name, authMode: config.authMode,
      oidcLabel: config.oidc.label, admins: config.admins, serverVersion: SERVER_VERSION, packageVersion: pkg.manifest.packageVersion };
  }
  let indexHtml = null;
  function index() {
    if (!indexHtml) {
      const raw = fs.readFileSync(path.join(config.packageDir, 'public', 'index.html'), 'utf8');
      const inject = `<script>window.EF_INST=${JSON.stringify(instConfig()).replace(/</g, '\\u003c')};</script>`;
      if (!raw.includes('<!--EF_INST_CONFIG-->')) throw new Error('public/index.html is not an institution build of ExamFlow.');
      indexHtml = raw.replace('<!--EF_INST_CONFIG-->', inject);
    }
    return indexHtml;
  }
  function meJson(u) {
    if (!u) return null;
    const c = rules.ctx(u);
    return { uid: u.uid, email: u.email, displayName: u.name || null, teacherId: c.teacherId, allowed: !!c.teacher, admin: c.admin };
  }
  function licencePublic() {
    const s = licence.state();
    return { status: s.status, canCreateExams: s.canCreateExams, activatesAt: s.activatesAt || null, expiresAt: s.expiresAt || null,
      remainingDays: s.remainingDays ?? null, verified: !!s.verified, verifiedAt: s.verifiedAt || null, message: s.message || null };
  }

  async function api(req, res, url) {
    if (req.method !== 'GET' && req.method !== 'POST') return send(res, 405, { error: 'Method not allowed' });
    // CSRF and wrong-institution protection: every API call carries this institution's ID in a custom header,
    // which a page on another site can't add without a CORS preflight (this server sends no CORS headers).
    if (req.headers['x-ef-institution'] !== instId) {
      db.audit(null, 'api.wrong_institution', url.pathname, 'denied', { got: String(req.headers['x-ef-institution'] || '').slice(0, 80) });
      return send(res, 403, { error: 'This request is not for this institution.', reason: 'wrong_institution' });
    }
    const body = req.method === 'POST' ? await readBody(req, config.maxBodyBytes) : {};
    const p = url.pathname;
    if (p === '/api/config') return send(res, 200, instConfig());
    if (p === '/api/licence') return send(res, 200, licencePublic());
    if (p === '/api/auth/me') return send(res, 200, { user: meJson(userOf(req)) });
    if (p === '/api/auth/logout' && req.method === 'POST') {
      auth.endLogin(parseCookies(req.headers.cookie).ef_sid);
      return send(res, 200, { ok: true }, { 'set-cookie': cookie(req, '', 0) });
    }
    if (p === '/api/auth/login' && req.method === 'POST') {
      if (config.authMode !== 'local') return send(res, 400, { error: 'This institution signs in with its own account system. Use the sign-in button.' });
      const r = auth.login(body, ipOf(req));
      if (r.error) return send(res, r.code || 400, { error: r.error });
      return send(res, 200, { user: meJson(r.user) }, { 'set-cookie': cookie(req, auth.createLogin(r.uid), config.sessionDays * 86400) });
    }
    if (p === '/api/auth/activate' && req.method === 'POST') {
      if (config.authMode !== 'local') return send(res, 400, { error: 'This institution signs in with its own account system.' });
      const r = auth.activate(body, ipOf(req));
      if (r.error) return send(res, r.code || 400, { error: r.error });
      return send(res, 200, { user: meJson(r.user) }, { 'set-cookie': cookie(req, auth.createLogin(r.uid), config.sessionDays * 86400) });
    }
    if (p === '/api/db' && req.method === 'POST') return send(res, 200, await dbOp(req, body));
    // v47: features, limits, settings, announcements and (for a signed-in teacher) their messages from GHUM
    if (p === '/api/sync') { const u = userOf(req); return send(res, 200, sync.forUser(u ? u.email : null)); }
    if (p === '/api/inbox' && req.method === 'POST') {
      const u = userOf(req); if (!u) return send(res, 401, { error: 'Sign in first.' });
      if (!['read', 'archive', 'unarchive'].includes(body.action)) return send(res, 400, { error: 'Unknown action.' });
      return send(res, sync.mark(u.email, String(body.id || ''), body.action) ? 200 : 404, { ok: true });
    }
    return send(res, 404, { error: 'Not found' });
  }

  async function dbOp(req, b) {
    const u = userOf(req); const c = rules.ctx(u);
    const col = String(b.col || ''), id = b.id === undefined ? undefined : String(b.id);
    try {
      switch (b.op) {
        case 'get': { await rules.get(c, col, id); const d = db.getDoc(col, id); return { exists: !!d, data: d }; }
        case 'query': {
          const where = Array.isArray(b.where) ? b.where : []; await rules.query(c, col, where);
          const lim = b.limit ? Math.min(Math.max(1, Number(b.limit) | 0), 5000) : 5000;
          return { docs: db.query(col, where, lim) };
        }
        case 'add': {
          const nid = randomId('', 20); const d = await rules.write(c, col, nid, 'set', b.data, false);
          db.putDoc(col, nid, d); return { id: nid };
        }
        case 'set': {
          const before = col === 'exams' ? db.getDoc(col, id) : null;
          const d = await rules.write(c, col, id, 'set', b.data, !!b.merge);
          db.putDoc(col, id, d);
          if (col === 'exams' && !before) db.audit(c.email, 'exam.create', id, 'ok', { teacherId: c.teacherId });
          return { ok: true };
        }
        case 'delete': {
          await rules.write(c, col, id, 'delete');
          const had = db.deleteDoc(col, id);
          if (col === 'exams' && had) db.audit(c.email, 'exam.delete', id, 'ok', { teacherId: c.teacherId });
          return { ok: true };
        }
        default: throw new Denied('Unknown operation.', 400, 'bad_op');
      }
    } catch (e) {
      if (e instanceof Denied && e.status === 403 && ['exams', 'sessions', 'teachers'].includes(col) && b.op !== 'get') {
        db.audit(c.email, col + '.' + b.op, id || null, 'denied', { reason: e.reason });
      }
      throw e;
    }
  }

  async function handle(req, res) {
    const url = new URL(req.url, 'http://x');
    // LOG_REQUESTS=1: method, path, status and time only — never bodies, cookies or query strings.
    if (config.logRequests) { const t0 = Date.now(); res.on('finish', () => log(req.method, url.pathname, res.statusCode, (Date.now() - t0) + 'ms')); }
    try {
      if (url.pathname === '/healthz') {
        let dbOk = true; try { db.getMeta('schema_version'); } catch (e) { dbOk = false; }
        const st = licence.state();
        return send(res, dbOk ? 200 : 503, { ok: dbOk, version: SERVER_VERSION, institutionId: instId, packageVersion: pkg.manifest.packageVersion,
          db: dbOk ? 'ok' : 'error', registered: licence.registered(), licence: st.status, allowlistVersion: Number(db.getMeta('allowlist_version') || 0) });
      }
      if (url.pathname.startsWith('/api/')) return await api(req, res, url);
      if (url.pathname === '/auth/oidc/start') {
        if (config.authMode !== 'oidc') return send(res, 404, 'Not found');
        return send(res, 302, '', { location: await auth.oidcStart() });
      }
      if (url.pathname === '/auth/oidc/callback') {
        if (config.authMode !== 'oidc') return send(res, 404, 'Not found');
        try {
          const r = await auth.oidcCallback(Object.fromEntries(url.searchParams));
          return send(res, 302, '', { location: '/?signedin=1', 'set-cookie': cookie(req, auth.createLogin(r.uid), config.sessionDays * 86400) });
        } catch (e) {
          db.audit(null, 'login.oidc', null, 'denied', { reason: e.message.slice(0, 200) });
          return send(res, 302, '', { location: '/?signin_error=' + encodeURIComponent(e.message.slice(0, 200)) });
        }
      }
      if (req.method !== 'GET' && req.method !== 'HEAD') return send(res, 405, 'Method not allowed');
      if (url.pathname === '/' || url.pathname === '/index.html') return send(res, 200, index(), { 'content-type': TYPES['.html'] });
      if (url.pathname.startsWith('/tessdata/')) return file(res, config.modelsDir, url.pathname.slice('/tessdata/'.length), true);
      return file(res, path.join(config.packageDir, 'public'), url.pathname.slice(1), false);
    } catch (e) {
      if (e instanceof Denied) return send(res, e.status, { error: e.message, reason: e.reason });
      log('error', req.method, url.pathname, e && e.stack || e);
      return send(res, 500, { error: 'Server error. The IT team can see details in the server log.' });
    }
  }
  function file(res, dir, rel, cache) {
    const p = path.resolve(dir, decodeURIComponent(rel));
    if (!p.startsWith(path.resolve(dir) + path.sep) || path.basename(p).startsWith('.')) return send(res, 404, 'Not found');
    let st; try { st = fs.statSync(p); } catch (e) { return send(res, 404, 'Not found'); }
    if (!st.isFile()) return send(res, 404, 'Not found');
    return send(res, 200, fs.readFileSync(p), { 'content-type': TYPES[path.extname(p)] || 'application/octet-stream', 'cache-control': cache ? 'public, max-age=86400' : 'no-cache' });
  }
  return { handle, auth, licence, rules, db, config, pkg, sync };
}

/** Full start-up: settings → package check → database → teacher list → licence → listen. */
function boot(env = process.env) {
  const { config, errors, warnings } = readConfig(env);
  for (const w of warnings) log('warning:', w);
  if (errors.length) { const e = new Error('Configuration problems:\n  - ' + errors.join('\n  - ')); e.exitCode = 2; throw e; }
  const pkg = readPackage(config.packageDir);
  if (!pkg.ok) { const e = new Error('Package check failed:\n  - ' + pkg.errors.join('\n  - ')); e.exitCode = 3; throw e; }
  let db;
  try { db = new DB(config.dataDir); } catch (e) { const x = new Error('Database problem: ' + e.message); x.exitCode = 4; throw x; }
  try {
    const r = applyPackage(db, pkg, { allowDowngrade: config.allowDowngrade });
    if (r.applied) log(`Teacher list version ${pkg.manifest.allowlist.version} applied: ${r.added} added, ${r.removed} removed, ${r.total} in total.`);
  } catch (e) { db.close(); const x = new Error(e.message); x.exitCode = 5; throw x; }
  return { config, pkg, db };
}

if (require.main === module) {
  loadDotEnv(path.resolve(process.cwd(), '.env'));
  let parts;
  try { parts = boot(); } catch (e) { console.error('ExamFlow server did not start.\n' + e.message); process.exit(e.exitCode || 1); }
  const app = createApp(parts);
  app.licence.start();
  const srv = http.createServer((q, s) => { app.handle(q, s); });
  srv.listen(parts.config.port, parts.config.host, () => log(`ExamFlow institution server ${SERVER_VERSION} for ${parts.pkg.manifest.institution.name} (${parts.pkg.manifest.institution.id}) on port ${parts.config.port}. Data: ${parts.config.dataDir}`));
  const stop = () => { log('stopping'); srv.close(); app.licence.stop(); parts.db.close(); process.exit(0); };
  process.on('SIGTERM', stop); process.on('SIGINT', stop);
}

module.exports = { createApp, boot };
