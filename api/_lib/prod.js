'use strict';
/* Production wiring on Vercel: Firebase Admin (Firestore + ID-token checks) and the signing key.
   Environment variables (Vercel → Project → Settings → Environment Variables):
     FIREBASE_SERVICE_ACCOUNT    the service-account JSON from Firebase (raw JSON or base64)
     GHUM_SIGNING_PRIVATE_KEY    Ed25519 private key, PEM (make one with tools/make-signing-key.js)
     ADMIN_EMAILS                comma-separated; default examflow.live@gmail.com
     PUBLIC_BASE_URL             the site address institution servers call, e.g. https://examflow.live */
const crypto = require('node:crypto');
const { ControlPlane, CPError } = require('./cp');
const { firestoreStore } = require('./store-firestore');

let app = null, cpInst = null;
function admin() {
  if (app) return app;
  const fa = require('firebase-admin');
  let raw = process.env.FIREBASE_SERVICE_ACCOUNT || '';
  if (!raw) throw new CPError('The control plane is not set up: FIREBASE_SERVICE_ACCOUNT is missing on Vercel. See the v46 README.', 503, 'not_configured');
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
async function cp() {
  if (cpInst) return cpInst;
  const a = admin();
  const base = String(process.env.PUBLIC_BASE_URL || '').replace(/\/+$/, '');
  if (!/^https:\/\//.test(base)) throw new CPError('PUBLIC_BASE_URL must be set to the https address of this site on Vercel.', 503, 'not_configured');
  cpInst = new ControlPlane({ store: firestoreStore(a.firestore()), keys: keys(), env: { publicBaseUrl: base, models: require('./models.json') } });
  return cpInst;
}
const ADMINS = () => String(process.env.ADMIN_EMAILS || 'examflow.live@gmail.com').split(',').map(s => s.trim().toLowerCase()).filter(Boolean);
async function verifyAdmin(token) {
  let d;
  try { d = await admin().auth().verifyIdToken(token, true); }
  catch (e) { if (e instanceof CPError) throw e; throw new CPError('Your sign-in has expired or was revoked. Sign in again.', 401, 'unauthenticated'); }
  const email = String(d.email || '').toLowerCase();
  if (!email || !ADMINS().includes(email)) throw new CPError('Only the ExamFlow admin can do this.', 403, 'not_admin');
  if (d.email_verified !== true) throw new CPError('The admin email must be verified (sign in with Google, or verify the email in Firebase).', 403, 'unverified');
  return { email, uid: d.uid };
}
module.exports = { cp, verifyAdmin };
