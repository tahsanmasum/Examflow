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

/** verifyAdmin(token) → { email } or throws CPError(401/403). */
function adminHandler({ cp, verifyAdmin }) {
  return async (req, res) => {
    try {
      if (req.method !== 'POST') return sendJson(res, 405, { ok: false, error: 'Use POST.' });
      const h = String(req.headers.authorization || '');
      if (!h.startsWith('Bearer ')) return sendJson(res, 401, { ok: false, error: 'Sign in as the ExamFlow admin.', code: 'unauthenticated' });
      const admin = await verifyAdmin(h.slice(7));
      const body = await readJson(req);
      const out = await (await cp()).act(admin, body);
      if (out && Buffer.isBuffer(out.zip)) {
        res.statusCode = 200;
        res.setHeader('content-type', 'application/zip');
        res.setHeader('content-disposition', `attachment; filename="${out.filename}"`);
        res.setHeader('x-package-sha256', out.sha256);
        res.setHeader('cache-control', 'no-store');
        return res.end(out.zip);
      }
      return sendJson(res, 200, { ok: true, ...out });
    } catch (e) {
      if (e instanceof CPError) return sendJson(res, e.status, { ok: false, error: e.message, code: e.code });
      console.error('admin api error', e);
      return sendJson(res, 500, { ok: false, error: 'Server error. Nothing was changed unless a later reload shows otherwise.', code: 'server_error' });
    }
  };
}
function instHandler({ cp }) {
  return async (req, res) => {
    try {
      if (req.method !== 'POST') return sendJson(res, 405, { ok: false, error: 'Use POST.' });
      const ip = String(req.headers['x-forwarded-for'] || req.socket && req.socket.remoteAddress || '').split(',')[0].trim();
      if (limited('i:' + ip, 120, 60000)) return sendJson(res, 429, { ok: false, error: 'Too many requests. Slow down.' });
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
module.exports = { adminHandler, instHandler, readJson, sendJson };
