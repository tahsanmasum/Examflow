'use strict';
/* Sign-in for the institution server.

   AUTH_MODE=local  Teachers activate an account with a one-time activation code
                    from the institution's IT team (`teacher-codes` command),
                    their email and a password of their choice. Passwords are
                    stored only as scrypt hashes. Knowing a teacher ID or email
                    is not enough: the code is needed, and it works once.
   AUTH_MODE=oidc   Teachers sign in with the institution's own identity
                    provider (Google Workspace, Microsoft Entra ID, Keycloak…)
                    using OpenID Connect with PKCE. The ID token's signature,
                    issuer, audience, expiry and nonce are checked here.

   Either way, signing in only proves who someone is. Teacher permissions come
   from the institution's teacher allowlist, checked on every request (rules.js). */
const crypto = require('node:crypto');
const { normEmail, EMAIL_RE, hashCode, normCode, sha256, randomId, humanCode } = require('./util');

const SCRYPT = { N: 16384, r: 8, p: 1, keylen: 32 };
function hashPassword(pw) {
  const salt = crypto.randomBytes(16);
  const dk = crypto.scryptSync(pw, salt, SCRYPT.keylen, { N: SCRYPT.N, r: SCRYPT.r, p: SCRYPT.p });
  return `scrypt$${SCRYPT.N}$${SCRYPT.r}$${SCRYPT.p}$${salt.toString('base64')}$${dk.toString('base64')}`;
}
function checkPassword(pw, stored) {
  const m = /^scrypt\$(\d+)\$(\d+)\$(\d+)\$([^$]+)\$([^$]+)$/.exec(String(stored || ''));
  if (!m) return false;
  const dk = crypto.scryptSync(pw, Buffer.from(m[4], 'base64'), Buffer.from(m[5], 'base64').length, { N: +m[1], r: +m[2], p: +m[3] });
  return crypto.timingSafeEqual(dk, Buffer.from(m[5], 'base64'));
}
function passwordProblem(pw) {
  if (typeof pw !== 'string' || pw.length < 10) return 'Use a password of at least 10 characters.';
  if (pw.length > 200) return 'That password is too long.';
  return null;
}

/** A tiny fixed-window rate limiter kept in memory. */
class Limiter {
  constructor(max, windowMs) { this.max = max; this.windowMs = windowMs; this.m = new Map(); }
  hit(key) {
    const now = Date.now(); let e = this.m.get(key);
    if (!e || now - e.t > this.windowMs) { e = { t: now, n: 0 }; this.m.set(key, e); }
    e.n++; if (this.m.size > 10000) this.m.clear();
    return e.n <= this.max;
  }
}

class Auth {
  constructor({ db, config, fetchImpl }) {
    this.db = db; this.config = config; this.fetch = fetchImpl || globalThis.fetch;
    this.loginLimit = new Limiter(10, 15 * 60 * 1000);   // per email
    this.ipLimit = new Limiter(60, 15 * 60 * 1000);      // per address
    this.oidcMeta = null; this.jwks = null; this.jwksAt = 0;
  }
  // ── login sessions (cookie) ──
  createLogin(uid) {
    const token = crypto.randomBytes(32).toString('base64url');
    const now = Date.now();
    this.db.run('logins.insert', sha256(token), uid, now, now + this.config.sessionDays * 86400000);
    this.db.run('logins.purge', now);
    return token;
  }
  userFromToken(token) {
    if (!token) return null;
    const r = this.db.one('logins.user', sha256(token), Date.now());
    if (!r || r.disabled) return null;
    return { uid: r.uid, email: r.email, name: r.name };
  }
  endLogin(token) { if (token) this.db.run('logins.delete', sha256(token)); }
  endAllLogins(uid) { this.db.run('logins.deleteUser', uid); }

  // ── allowlist lookups ──
  allowEntry(email) { return this.db.one('allowlist.byEmail', normEmail(email)) || null; }

  // ── local accounts ──
  issueCode(email, purpose = 'activate', days = 14) {
    const code = humanCode(3), now = Date.now();
    this.db.run('codes.retire', now, normEmail(email), purpose);
    this.db.run('codes.insert', hashCode(code), normEmail(email), purpose, now, now + days * 86400000);
    return code;
  }
  activate({ email, code, password, name }, ip) {
    email = normEmail(email);
    if (!this.ipLimit.hit('a:' + ip) || !this.loginLimit.hit('a:' + email)) return { error: 'Too many attempts. Wait 15 minutes and try again.', code: 429 };
    if (!EMAIL_RE.test(email)) return { error: 'Enter a valid email address.' };
    const pp = passwordProblem(password); if (pp) return { error: pp };
    const row = this.db.one('codes.get', hashCode(code));
    if (!row || row.email !== email || row.used || row.expires < Date.now() || normCode(code).length < 8) {
      this.db.audit(email, 'account.activate', email, 'denied', { reason: 'bad code' });
      return { error: 'That activation code is not valid for this email, has been used, or has expired. Ask your IT team for a new one.', code: 403 };
    }
    const existing = this.db.one('users.uidByEmail', email);
    const now = Date.now();
    let uid;
    this.db.tx(() => {
      this.db.run('codes.use', now, row.code_hash);
      if (existing) { uid = existing.uid; this.db.run('users.setPassword', hashPassword(password), uid); this.endAllLogins(uid); }
      else {
        uid = randomId('u', 20);
        this.db.run('users.insertLocal', uid, email, String(name || '').slice(0, 120) || null, hashPassword(password), 'local', now);
      }
    });
    this.db.audit(email, existing ? 'account.password_reset' : 'account.activate', uid, 'ok');
    return { uid, user: { uid, email, name: name || null } };
  }
  login({ email, password }, ip) {
    email = normEmail(email);
    if (!this.ipLimit.hit('l:' + ip) || !this.loginLimit.hit('l:' + email)) return { error: 'Too many sign-in attempts. Wait 15 minutes and try again.', code: 429 };
    const u = this.db.one('users.byEmail', email);
    const ok = u && u.pass_hash && !u.disabled && checkPassword(String(password || ''), u.pass_hash);
    if (!ok) { this.db.audit(email, 'login', email, 'denied'); return { error: 'Wrong email or password.', code: 401 }; }
    this.db.audit(email, 'login', u.uid, 'ok');
    return { uid: u.uid, user: { uid: u.uid, email: u.email, name: u.name } };
  }

  // ── OIDC ──
  async oidcDiscover() {
    if (this.oidcMeta) return this.oidcMeta;
    const r = await this.fetch(this.config.oidc.issuer + '/.well-known/openid-configuration');
    if (!r.ok) throw new Error('Could not read the identity provider\'s settings (HTTP ' + r.status + ').');
    const m = await r.json();
    if (m.issuer.replace(/\/+$/, '') !== this.config.oidc.issuer) throw new Error('The identity provider reports a different issuer.');
    this.oidcMeta = m; return m;
  }
  async oidcStart() {
    const m = await this.oidcDiscover();
    const state = crypto.randomBytes(16).toString('base64url'), nonce = crypto.randomBytes(16).toString('base64url');
    const verifier = crypto.randomBytes(32).toString('base64url');
    const challenge = crypto.createHash('sha256').update(verifier).digest('base64url');
    this.db.run('oidc.purge', Date.now() - 10 * 60000);
    this.db.run('oidc.insert', state, nonce, verifier, Date.now());
    const u = new URL(m.authorization_endpoint);
    u.searchParams.set('response_type', 'code'); u.searchParams.set('client_id', this.config.oidc.clientId);
    u.searchParams.set('redirect_uri', this.config.publicUrl + '/auth/oidc/callback');
    u.searchParams.set('scope', 'openid email profile'); u.searchParams.set('state', state); u.searchParams.set('nonce', nonce);
    u.searchParams.set('code_challenge', challenge); u.searchParams.set('code_challenge_method', 'S256');
    return u.toString();
  }
  async jwk(kid) {
    const m = await this.oidcDiscover();
    if (!this.jwks || Date.now() - this.jwksAt > 3600000 || !this.jwks.keys.some(k => k.kid === kid)) {
      const r = await this.fetch(m.jwks_uri); if (!r.ok) throw new Error('Could not load the identity provider\'s signing keys.');
      this.jwks = await r.json(); this.jwksAt = Date.now();
    }
    const k = this.jwks.keys.find(k => k.kid === kid);
    if (!k) throw new Error('The ID token was signed with an unknown key.');
    return crypto.createPublicKey({ key: k, format: 'jwk' });
  }
  async verifyIdToken(idToken, nonce) {
    const parts = String(idToken || '').split('.');
    if (parts.length !== 3) throw new Error('Malformed ID token.');
    const header = JSON.parse(Buffer.from(parts[0], 'base64url').toString());
    const claims = JSON.parse(Buffer.from(parts[1], 'base64url').toString());
    const alg = header.alg;
    if (!['RS256', 'ES256', 'PS256'].includes(alg)) throw new Error('Unsupported ID token algorithm: ' + alg);
    const key = await this.jwk(header.kid);
    const data = Buffer.from(parts[0] + '.' + parts[1]); const sig = Buffer.from(parts[2], 'base64url');
    let ok;
    if (alg === 'RS256') ok = crypto.verify('sha256', data, key, sig);
    else if (alg === 'PS256') ok = crypto.verify('sha256', data, { key, padding: crypto.constants.RSA_PKCS1_PSS_PADDING, saltLength: 32 }, sig);
    else ok = crypto.verify('sha256', data, { key, dsaEncoding: 'ieee-p1363' }, sig);
    if (!ok) throw new Error('The ID token signature is not valid.');
    const now = Math.floor(Date.now() / 1000);
    if (String(claims.iss).replace(/\/+$/, '') !== this.config.oidc.issuer) throw new Error('The ID token comes from another issuer.');
    const aud = Array.isArray(claims.aud) ? claims.aud : [claims.aud];
    if (!aud.includes(this.config.oidc.clientId)) throw new Error('The ID token is for another application.');
    if (!(claims.exp > now - 60)) throw new Error('The ID token has expired.');
    if (claims.nonce !== nonce) throw new Error('The ID token nonce does not match.');
    if (!claims.email) throw new Error('The identity provider did not share an email address.');
    if (claims.email_verified === false || claims.email_verified === 'false') throw new Error('The email address is not verified by the identity provider.');
    const email = normEmail(claims.email);
    const dom = email.split('@')[1];
    if (this.config.oidc.allowedDomains.length && !this.config.oidc.allowedDomains.includes(dom)) throw new Error('Accounts from ' + dom + ' can\'t sign in here.');
    return { sub: String(claims.sub), email, name: claims.name || null };
  }
  async oidcCallback(query) {
    const st = this.db.one('oidc.get', String(query.state || ''));
    if (!st || Date.now() - st.created > 10 * 60000) throw new Error('The sign-in took too long or was started elsewhere. Try again.');
    this.db.run('oidc.delete', st.state);
    if (query.error) throw new Error('The identity provider refused the sign-in: ' + query.error);
    const m = await this.oidcDiscover();
    const body = new URLSearchParams({ grant_type: 'authorization_code', code: String(query.code || ''), redirect_uri: this.config.publicUrl + '/auth/oidc/callback',
      client_id: this.config.oidc.clientId, client_secret: this.config.oidc.clientSecret, code_verifier: st.verifier });
    const r = await this.fetch(m.token_endpoint, { method: 'POST', headers: { 'content-type': 'application/x-www-form-urlencoded' }, body });
    const j = await r.json().catch(() => ({}));
    if (!r.ok || !j.id_token) throw new Error('The identity provider did not return an ID token.');
    const id = await this.verifyIdToken(j.id_token, st.nonce);
    let u = this.db.one('users.byOidc', id.sub, 'oidc')
         || this.db.one('users.byEmail', id.email);
    if (u && u.disabled) throw new Error('This account is disabled at this institution.');
    if (!u) {
      const uid = randomId('u', 20);
      this.db.run('users.insertOidc', uid, id.email, id.name, 'oidc', id.sub, Date.now());
      u = { uid, email: id.email, name: id.name };
    } else if (!u.oidc_sub) this.db.run('users.setOidcSub', id.sub, u.uid);
    this.db.audit(id.email, 'login.oidc', u.uid, 'ok');
    return { uid: u.uid, user: { uid: u.uid, email: u.email, name: u.name } };
  }
}

module.exports = { Auth, hashPassword, checkPassword, passwordProblem, Limiter };
