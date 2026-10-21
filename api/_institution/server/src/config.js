'use strict';
/* Reads and checks the server's settings (environment variables, usually from .env).
   Every problem is collected and reported together; the server refuses to start
   with an invalid configuration instead of guessing. */
const path = require('node:path');
const fs = require('node:fs');
const { normEmail, EMAIL_RE } = require('./util');

function loadDotEnv(file) {
  // Docker Compose passes .env itself; this is for running with plain `node`.
  if (!file || !fs.existsSync(file)) return;
  for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
    const m = /^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/.exec(line);
    if (!m || line.trim().startsWith('#')) continue;
    let v = m[2];
    if (/^".*"$/.test(v) || /^'.*'$/.test(v)) v = v.slice(1, -1);
    if (process.env[m[1]] === undefined) process.env[m[1]] = v;
  }
}

function readConfig(env = process.env) {
  const errors = [], warnings = [];
  const root = path.resolve(__dirname, '..', '..'); // the unpacked package folder
  const c = {
    packageDir: path.resolve(env.PACKAGE_DIR || root),
    dataDir: path.resolve(env.DATA_DIR || path.join(root, 'data')),
    port: Number(env.PORT || 8080),
    host: env.HOST || '0.0.0.0',
    publicUrl: String(env.PUBLIC_URL || '').replace(/\/+$/, ''),
    authMode: String(env.AUTH_MODE || 'local').toLowerCase(),
    trustProxy: env.TRUST_PROXY === '1' || env.TRUST_PROXY === 'true',
    admins: String(env.INSTITUTION_ADMIN_EMAILS || '').split(',').map(normEmail).filter(Boolean),
    oidc: {
      issuer: String(env.OIDC_ISSUER || '').replace(/\/+$/, ''),
      clientId: env.OIDC_CLIENT_ID || '',
      clientSecret: env.OIDC_CLIENT_SECRET || '',
      allowedDomains: String(env.OIDC_ALLOWED_DOMAINS || '').split(',').map(s => s.trim().toLowerCase()).filter(Boolean),
      label: env.OIDC_BUTTON_LABEL || 'Sign in with your institution account'
    },
    controlPlaneUrl: String(env.CONTROL_PLANE_URL || '').replace(/\/+$/, ''), // normally taken from the manifest
    licenceCheckSec: Number(env.LICENCE_CHECK_SECONDS || 60),
    offlineGraceDays: env.OFFLINE_GRACE_DAYS !== undefined ? Number(env.OFFLINE_GRACE_DAYS) : null,
    allowDowngrade: env.ALLOW_PACKAGE_DOWNGRADE === '1',
    modelsDir: env.MODELS_DIR ? path.resolve(env.MODELS_DIR) : null,
    sessionDays: Number(env.SESSION_DAYS || 14),
    logRequests: env.LOG_REQUESTS === '1',
    maxBodyBytes: 2 * 1024 * 1024
  };
  if (!c.modelsDir) c.modelsDir = path.join(c.dataDir, 'models');

  if (!c.publicUrl) errors.push('PUBLIC_URL is missing. Set it to the address teachers will open, e.g. https://examflow.your-university.edu');
  else {
    let u; try { u = new URL(c.publicUrl); } catch (e) { errors.push('PUBLIC_URL is not a valid web address: ' + c.publicUrl); }
    if (u) {
      const local = ['localhost', '127.0.0.1', '[::1]'].includes(u.hostname);
      if (u.protocol !== 'https:' && !local) errors.push('PUBLIC_URL must start with https:// (plain http is only allowed for localhost testing). Cameras and sign-in need HTTPS.');
    }
  }
  if (!Number.isInteger(c.port) || c.port < 1 || c.port > 65535) errors.push('PORT must be a number from 1 to 65535.');
  if (!['local', 'oidc'].includes(c.authMode)) errors.push('AUTH_MODE must be "local" or "oidc".');
  if (c.authMode === 'oidc') {
    if (!/^https:\/\//.test(c.oidc.issuer) && !/^http:\/\/(localhost|127\.0\.0\.1)/.test(c.oidc.issuer)) errors.push('OIDC_ISSUER must be the https address of your identity provider (e.g. https://accounts.google.com).');
    if (!c.oidc.clientId) errors.push('OIDC_CLIENT_ID is missing (AUTH_MODE=oidc).');
    if (!c.oidc.clientSecret) errors.push('OIDC_CLIENT_SECRET is missing (AUTH_MODE=oidc).');
  }
  for (const a of c.admins) if (!EMAIL_RE.test(a)) errors.push('INSTITUTION_ADMIN_EMAILS has an invalid email: ' + a);
  if (!c.admins.length) warnings.push('INSTITUTION_ADMIN_EMAILS is empty, so nobody at the institution can open the Admin Monitor.');
  if (!(c.licenceCheckSec >= 15 && c.licenceCheckSec <= 3600)) errors.push('LICENCE_CHECK_SECONDS must be between 15 and 3600.');
  if (c.offlineGraceDays !== null && !(c.offlineGraceDays >= 0 && c.offlineGraceDays <= 30)) errors.push('OFFLINE_GRACE_DAYS must be between 0 and 30.');
  if (!(c.sessionDays >= 1 && c.sessionDays <= 90)) errors.push('SESSION_DAYS must be between 1 and 90.');
  return { config: c, errors, warnings };
}

module.exports = { readConfig, loadDotEnv };
