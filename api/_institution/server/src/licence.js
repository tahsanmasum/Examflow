'use strict';
/* Licence verification against the GHUM control plane.

   · Registration (once): the institution's IT team runs `register --code CODE`
     with a one-time code from GHUM. The server makes its own Ed25519 key pair
     (kept in DATA_DIR, never leaves the server) and sends only the public key.
   · Check-in (every LICENCE_CHECK_SECONDS, default 60 s): the server signs a
     short report (server version, package, teacher-list version, health — no
     exam or student data) and gets back a licence statement signed by GHUM.
   · The statement is verified with GHUM's public key from the package. The
     status (Pending, Active, Expiring Soon, Expired, Blocked) is worked out by
     GHUM's clock; between check-ins this server advances that time with its own
     monotonic clock, so moving the system clock back does not extend a licence.
   · Offline: the last statement stays valid for its offline grace period
     (default 7 days). After that the licence counts as "Unverified" and new
     exams are paused until the server reaches GHUM again. Data is never deleted.
   · Creating, editing and publishing exams needs Active or Expiring Soon.
     Existing exams, student attempts, grading, results and exports always work. */
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { canonical, signEd25519, verifyEd25519, newEd25519, keyFingerprint, randomId } = require('./util');
const { licenceStatus, WARN_DAYS_DEFAULT, DAY } = require('./licence-core');

const SERVER_VERSION = require('../package.json').version;

class Licence {
  constructor({ db, config, pkg, fetchImpl, log }) {
    this.db = db; this.config = config; this.pkg = pkg; this.log = log || (() => {});
    this.fetch = fetchImpl || globalThis.fetch;
    this.ghumKey = pkg.publicKey;
    this.cpUrl = config.controlPlaneUrl || pkg.manifest.controlPlaneUrl;
    this.offlineGraceDays = config.offlineGraceDays ?? (pkg.manifest.licence && pkg.manifest.licence.offlineGraceDays) ?? 7;
    this.keyFile = path.join(config.dataDir, 'server-identity.pem');
    this.last = null; this.lastError = null; this.inflight = null;
    const cached = db.getMeta('licence_statement');
    if (cached) { try { const c = JSON.parse(cached); if (this.verifyStatement(c.statement, c.sig)) this.last = { ...c, mono: null }; } catch (e) {} }
  }
  serverId() { return this.db.getMeta('server_id'); }
  registered() { return !!(this.serverId() && fs.existsSync(this.keyFile)); }

  verifyStatement(statement, sig) {
    if (!statement || !verifyEd25519(this.ghumKey, Buffer.from(canonical(statement)), sig)) return false;
    if (statement.institutionId !== this.pkg.manifest.institution.id) return false;
    const sid = this.serverId(); if (sid && statement.serverId !== sid) return false;
    return true;
  }
  /** Trusted "now": GHUM's time at the last statement plus monotonic time since then. */
  trustedNow() {
    if (!this.last) return Date.now();
    if (this.last.mono != null) return this.last.statement.issuedAt + (performance.now() - this.last.mono);
    // Restored from disk after a restart: never earlier than the statement, never earlier than the wall clock.
    return Math.max(Date.now(), this.last.statement.issuedAt);
  }
  report() {
    let dbOk = true; try { this.db.getMeta('schema_version'); } catch (e) { dbOk = false; }
    return {
      serverVersion: SERVER_VERSION, packageId: this.pkg.manifest.packageId, packageVersion: this.pkg.manifest.packageVersion,
      allowlistVersion: Number(this.db.getMeta('allowlist_version') || 0),
      health: { db: dbOk ? 'ok' : 'error', node: process.version }
    };
  }
  async call(body) {
    if (!this.cpUrl) throw new Error('No control-plane address in the package.');
    const ctrl = new AbortController(); const t = setTimeout(() => ctrl.abort(), 8000);
    try {
      const r = await this.fetch(this.cpUrl + '/api/inst', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body), signal: ctrl.signal });
      let j = null; try { j = await r.json(); } catch (e) {}
      if (!r.ok || !j || !j.ok) throw new Error((j && j.error) || ('GHUM answered HTTP ' + r.status));
      return j;
    } catch (e) {
      if (e.name === 'AbortError') throw new Error('GHUM did not answer within 8 seconds.');
      if (e.cause && e.cause.code) throw new Error('Cannot reach GHUM (' + e.cause.code + ').');
      throw e;
    } finally { clearTimeout(t); }
  }
  accept(j, nonce) {
    if (!this.verifyStatement(j.statement, j.sig)) throw new Error('GHUM\'s answer has a bad signature or is for another server. Not accepted.');
    // GHUM signs our one-time nonce into its answer, so an old answer can't be replayed to us.
    if (!nonce || j.statement.nonce !== nonce) throw new Error('GHUM\'s answer is not for this request (nonce mismatch). Not accepted.');
    this.last = { statement: j.statement, sig: j.sig, verifiedAt: Date.now(), mono: performance.now() };
    this.db.setMeta('licence_statement', JSON.stringify({ statement: j.statement, sig: j.sig, verifiedAt: this.last.verifiedAt }));
    this.lastError = null;
  }

  async register(code) {
    if (this.registered()) throw new Error('This server is already registered as ' + this.serverId() + '.');
    const keys = newEd25519(); const nonce = randomId('', 16);
    const res = await this.call({ action: 'register', institutionId: this.pkg.manifest.institution.id, packageId: this.pkg.manifest.packageId,
      code, nonce, serverPublicKey: keys.publicPem, report: this.report() });
    if (!res.serverId) throw new Error('GHUM did not return a server ID.');
    // Save identity before accepting the statement, so the statement's serverId check passes.
    fs.writeFileSync(this.keyFile, keys.privatePem, { mode: 0o600 });
    this.db.setMeta('server_id', res.serverId);
    this.db.setMeta('server_key_fingerprint', keyFingerprint(keys.publicPem));
    try { this.accept(res, nonce); } catch (e) { this.lastError = e.message; }
    this.db.audit('installer', 'server.register', res.serverId, 'ok', { institutionId: this.pkg.manifest.institution.id });
    return res.serverId;
  }

  async refresh() {
    if (!this.registered()) { this.lastError = 'Not registered with GHUM yet.'; return false; }
    if (this.inflight) return this.inflight;
    this.inflight = (async () => {
      try {
        const body = { action: 'checkin', institutionId: this.pkg.manifest.institution.id, serverId: this.serverId(),
          ts: Date.now(), nonce: randomId('', 16), report: this.report() };
        const sig = signEd25519(fs.readFileSync(this.keyFile, 'utf8'), Buffer.from(canonical(body)));
        const j = await this.call({ ...body, sig });
        this.accept(j, body.nonce); return true;
      } catch (e) { this.lastError = e.message; this.log('licence check failed: ' + e.message); return false; }
      finally { this.inflight = null; }
    })();
    return this.inflight;
  }

  /** Current licence state as this server enforces it. */
  state() {
    if (!this.registered()) return { status: 'Unregistered', canCreateExams: false, verified: false,
      message: 'This server is not registered with GHUM yet, so its licence can\'t be checked. Your IT team runs the register command (see INSTALL.md).' };
    if (!this.last) return { status: 'Unverified', canCreateExams: false, verified: false, lastError: this.lastError,
      message: 'The licence has not been verified with GHUM yet. ' + (this.lastError || '') };
    const ageMs = Date.now() - this.last.verifiedAt;
    const s = this.last.statement;
    const now = this.trustedNow();
    const st = licenceStatus(s.licence, now, s.warnDays || WARN_DAYS_DEFAULT);
    const out = { ...st, verified: true, verifiedAt: this.last.verifiedAt, activatesAt: s.licence && s.licence.activatesAt,
      expiresAt: s.licence && s.licence.expiresAt, lastError: this.lastError, institutionName: s.institutionName };
    if (s.latestPackage && s.latestPackage.id !== this.pkg.manifest.packageId) out.newerPackage = s.latestPackage;
    if (s.packageRevoked) {
      return { ...out, status: 'Package revoked', canCreateExams: false,
        message: 'GHUM revoked this installation package. New exams are paused. Existing exams and results still work. Install the replacement package from GHUM (see UPGRADE.md).' };
    }
    if (ageMs > this.offlineGraceDays * DAY) {
      return { ...out, status: 'Unverified', canCreateExams: false, verified: false,
        message: `The server has not reached GHUM for more than ${this.offlineGraceDays} days, so the licence can't be confirmed. New exams are paused until it reconnects. Existing exams and results still work.` };
    }
    return out;
  }
  /** Before a protected action: refresh if the last check is older than the check interval (bounded wait). */
  async fresh() {
    const age = this.last ? Date.now() - this.last.verifiedAt : Infinity;
    if (this.registered() && age > this.config.licenceCheckSec * 1000) {
      await Promise.race([this.refresh(), new Promise(r => setTimeout(r, 4000))]);
    }
    return this.state();
  }
  start() {
    const tick = () => { this.refresh().catch(() => {}); };
    if (this.registered()) tick();
    this.timer = setInterval(tick, this.config.licenceCheckSec * 1000); this.timer.unref();
  }
  stop() { clearInterval(this.timer); }
}

module.exports = { Licence, SERVER_VERSION };
