'use strict';
/* Production wiring on Vercel: Firebase Admin (Firestore, Authentication, rules
   read-back) and the signing key.
   Environment variables (Vercel → Project → Settings → Environment Variables):
     FIREBASE_SERVICE_ACCOUNT    the service-account JSON from Firebase (raw JSON or base64)
     GHUM_SIGNING_PRIVATE_KEY    Ed25519 private key, PEM (make one with tools/make-signing-key.js)
     ADMIN_EMAILS                platform owners, comma-separated; default examflow.live@gmail.com
                                 (must match adminEmails() in firestore.rules)
     PUBLIC_BASE_URL             the site address institution servers call, e.g. https://examflow.live
   Vercel fills in VERCEL_ENV, VERCEL_GIT_COMMIT_SHA and friends itself; System Health shows them. */
const crypto = require('node:crypto');
const { ControlPlane, CPError } = require('./cp');
const { AdminConsole } = require('./console');
const { firestoreStore } = require('./store-firestore');
const { firebasePlatform } = require('./platform-firebase');

let app = null, cpInst = null, conInst = null;
function admin() {
  if (app) return app;
  const fa = require('firebase-admin');
  let raw = process.env.FIREBASE_SERVICE_ACCOUNT || '';
  if (!raw) throw new CPError('The control plane is not set up: FIREBASE_SERVICE_ACCOUNT is missing on Vercel. See docs/institutions.md.', 503, 'not_configured');
  if (!raw.trim().startsWith('{')) raw = Buffer.from(raw, 'base64').toString('utf8');
  const cred = JSON.parse(raw);
  app = fa.apps.length ? fa.app() : fa.initializeApp({ credential: fa.credential.cert(cred), projectId: cred.project_id });
  return app;
}
function keys() {
  const pem = (process.env.GHUM_SIGNING_PRIVATE_KEY || '').replace(/\\n/g, '\n').trim();
  if (!pem) return { privatePem: null, publicPem: null };
  const k = crypto.createPrivateKey(pem);
  if (k.asymmetricKeyType !== 'ed25519') throw new Error('GHUM_SIGNING_PRIVATE_KEY must be an Ed25519 key.');
  return { privatePem: pem, publicPem: crypto.createPublicKey(k).export({ type: 'spki', format: 'pem' }) };
}
const OWNERS = () => String(process.env.ADMIN_EMAILS || 'examflow.live@gmail.com').split(',').map(s => s.trim().toLowerCase()).filter(Boolean);
async function cp() {
  if (cpInst) return cpInst;
  const a = admin();
  const base = String(process.env.PUBLIC_BASE_URL || '').replace(/\/+$/, '');
  if (base && !/^https:\/\//.test(base)) throw new CPError('PUBLIC_BASE_URL must start with https://.', 503, 'not_configured');
  cpInst = new ControlPlane({ store: firestoreStore(a.firestore()), keys: keys(), env: { publicBaseUrl: base || null, models: require('./models.json') } });
  return cpInst;
}
async function con() {
  if (conInst) return conInst;
  const c = await cp();
  conInst = new AdminConsole({ cp: c, platform: firebasePlatform(admin()), owners: OWNERS(), env: process.env });
  return conInst;
}
/* A verified sign-in is remembered for up to a minute (never past its expiry), so a busy Admin Monitor
   doesn't ask Firebase about the same token on every click. Revocations still apply within a minute. */
const verified = new Map();
async function verifyToken(token) {
  const hit = verified.get(token);
  if (hit && hit.until > Date.now()) return hit.decoded;
  const decoded = await admin().auth().verifyIdToken(token, true);
  if (verified.size > 500) verified.clear();
  verified.set(token, { decoded, until: Math.min(Date.now() + 60000, decoded.exp * 1000) });
  return decoded;
}
/** Starts Firebase on this instance ahead of time (called by GET /api/admin?warm=1); returns nothing. */
async function warm() { await con(); }
module.exports = { cp, con, verifyToken, warm };
