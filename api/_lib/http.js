'use strict';
/* HTTP layer for the control plane, shared by the Vercel functions and the local test server. */
const { CPError } = require('./cp');

async function readJson(req, max = 2_500_000) {
  if (req.body && typeof req.body === 'object' && !Buffer.isBuffer(req.body)) return req.body;   // Vercel already parsed it
  if (typeof req.body === 'string') { try { return JSON.parse(req.body); } catch (e) { throw new CPError('Invalid JSON.'); } }
  const chunks = []; let n = 0;
  for await (const c of req) { n += c.length; if (n > max) throw new CPError('Request too large.', 413); chunks.push(c); }
  try { return n ? JSON.parse(Buffer.concat(chunks).toString('utf8')) : {}; } catch (e) { throw new CPError('Invalid JSON.'); }
}
function sendJson(res, status, obj) {
  res.statusCode = status;
  res.setHeader('content-type', 'application/json; charset=utf-8');
  res.setHeader('cache-control', 'no-store');
  res.setHeader('x-content-type-options', 'nosniff');
  res.end(JSON.stringify(obj));
}
const hits = new Map();
function limited(key, max, windowMs) {
  const now = Date.now(); let e = hits.get(key);
  if (!e || now - e.t > windowMs) { e = { t: now, n: 0 }; hits.set(key, e); }
  if (hits.size > 5000) hits.clear();
  return ++e.n > max;
}

const ipOf = req => String(req.headers['x-forwarded-for'] || req.socket && req.socket.remoteAddress || '').split(',')[0].trim();
const newRequestId = () => 'req_' + require('node:crypto').randomBytes(9).toString('base64url');

/** /api/admin: verifyToken(idToken) → decoded Firebase token; con(): the AdminConsole. */
function adminHandler({ con, verifyToken }) {
  return async (req, res) => {
    const requestId = newRequestId();
    try {
      if (req.method !== 'POST') return sendJson(res, 405, { ok: false, error: 'Use POST.' });
      const ip = ipOf(req);
      if (limited('a:' + ip, 300, 60000)) return sendJson(res, 429, { ok: false, error: 'Too many requests. Wait a minute.', requestId });
      const h = String(req.headers.authorization || '');
      if (!h.startsWith('Bearer ')) return sendJson(res, 401, { ok: false, error: 'Sign in as an ExamFlow admin.', code: 'unauthenticated', requestId });
      const c = await con();
      let decoded;
      try { decoded = await verifyToken(h.slice(7)); }
      catch (e) {
        if (e instanceof CPError) throw e;
        await c.securityEvent('admin.denied', { ip, ua: String(req.headers['user-agent'] || '').slice(0, 200), code: 'bad_token' }).catch(() => {});
        throw new CPError('Your sign-in has expired or was revoked. Sign in again.', 401, 'unauthenticated');
      }
      const admin = await c.resolveAdmin(decoded, { ip, ua: String(req.headers['user-agent'] || ''), sessionId: String(req.headers['x-ef-session'] || '') || null, requestId });
      const body = await readJson(req);
      const out = await c.act(admin, body);
      if (out && Buffer.isBuffer(out.zip)) {
        res.statusCode = 200;
        res.setHeader('content-type', 'application/zip');
        res.setHeader('content-disposition', `attachment; filename="${out.filename}"`);
        res.setHeader('x-package-sha256', out.sha256);
        res.setHeader('cache-control', 'no-store');
        return res.end(out.zip);
      }
      return sendJson(res, 200, { ok: true, requestId, ...out });
    } catch (e) {
      if (e instanceof CPError) return sendJson(res, e.status, { ok: false, error: e.message, code: e.code, requestId });
      console.error('admin api error', requestId, e);
      try { const c = await con(); await c.errorEvent('admin-api', 'unhandled', e); } catch (x) { /* nothing more to do */ }
      return sendJson(res, 500, { ok: false, error: 'Server error (' + requestId + '). Nothing was changed unless a later reload shows otherwise.', code: 'server_error', requestId });
    }
  };
}
/** /api/me: any signed-in ExamFlow user, about themselves only (inbox, own feature overrides, admin menu). */
function meHandler({ con, verifyToken }) {
  return async (req, res) => {
    try {
      if (req.method !== 'POST') return sendJson(res, 405, { ok: false, error: 'Use POST.' });
      const ip = ipOf(req);
      if (limited('m:' + ip, 120, 60000)) return sendJson(res, 429, { ok: false, error: 'Too many requests.' });
      const h = String(req.headers.authorization || '');
      if (!h.startsWith('Bearer ')) return sendJson(res, 401, { ok: false, error: 'Sign in first.', code: 'unauthenticated' });
      let decoded; try { decoded = await verifyToken(h.slice(7)); } catch (e) { return sendJson(res, 401, { ok: false, error: 'Sign in again.', code: 'unauthenticated' }); }
      const body = await readJson(req, 20_000);
      const out = await (await con()).me(decoded, body);
      return sendJson(res, 200, { ok: true, ...out });
    } catch (e) {
      if (e instanceof CPError) return sendJson(res, e.status, { ok: false, error: e.message, code: e.code });
      console.error('me api error', e);
      return sendJson(res, 500, { ok: false, error: 'Server error.' });
    }
  };
}
/** /api/public: no sign-in. Only accepts small, anonymous error reports from the app. */
function publicHandler({ con }) {
  return async (req, res) => {
    try {
      if (req.method !== 'POST') return sendJson(res, 405, { ok: false, error: 'Use POST.' });
      const ip = ipOf(req);
      if (limited('p:' + ip, 20, 60000)) return sendJson(res, 429, { ok: false, error: 'Too many reports.' });
      const b = await readJson(req, 8_000);
      if (b.action !== 'error') return sendJson(res, 404, { ok: false, error: 'Unknown action.' });
      const s = (v, n) => typeof v === 'string' ? v.slice(0, n) : null;
      const c = await con();
      await c.store.add('cpErrors', { t: c.now(), source: 'app', where: s(b.page, 40), message: s(b.message, 300), file: s(String(b.file || '').replace(/[?#].*$/, ''), 120), line: Number.isInteger(b.line) ? b.line : null,
        version: s(b.version, 30), build: s(b.build, 20) });
      return sendJson(res, 200, { ok: true });
    } catch (e) { return sendJson(res, 400, { ok: false, error: 'Bad report.' }); }
  };
}
function instHandler({ cp }) {
  return async (req, res) => {
    try {
      if (req.method !== 'POST') return sendJson(res, 405, { ok: false, error: 'Use POST.' });
      const ip = String(req.headers['x-forwarded-for'] || req.socket && req.socket.remoteAddress || '').split(',')[0].trim();
      const c = await cp(); let lim = 120; try { if (c.rateLimit) lim = await c.rateLimit(); } catch (e) { /* default */ }
      if (limited('i:' + ip, lim, 60000)) return sendJson(res, 429, { ok: false, error: 'Too many requests. Slow down.' });
      const body = await readJson(req, 200_000);
      if (body.action === 'register' && limited('r:' + ip, 10, 15 * 60000)) return sendJson(res, 429, { ok: false, error: 'Too many registration attempts. Wait 15 minutes.' });
      const out = await (await cp()).inst(body, ip);
      return sendJson(res, 200, { ok: true, ...out });
    } catch (e) {
      if (e instanceof CPError) return sendJson(res, e.status, { ok: false, error: e.message, code: e.code });
      console.error('inst api error', e);
      return sendJson(res, 500, { ok: false, error: 'Server error.' });
    }
  };
}
module.exports = { adminHandler, meHandler, publicHandler, instHandler, readJson, sendJson };
