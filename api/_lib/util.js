'use strict';
/* Small shared helpers: canonical JSON, Ed25519 signing, hashing, ids.
   The same file is used by the GHUM control plane, so a signature made there
   verifies here byte for byte. */
const crypto = require('node:crypto');

/** JSON with object keys sorted at every level. Signatures are made over this. */
function canonical(v) {
  if (v === null || typeof v !== 'object') return JSON.stringify(v);
  if (Array.isArray(v)) return '[' + v.map(canonical).join(',') + ']';
  return '{' + Object.keys(v).filter(k => v[k] !== undefined).sort()
    .map(k => JSON.stringify(k) + ':' + canonical(v[k])).join(',') + '}';
}

const sha256 = buf => crypto.createHash('sha256').update(buf).digest('hex');
const sha256b64url = buf => crypto.createHash('sha256').update(buf).digest('base64url');

function signEd25519(privatePem, data) {
  const key = crypto.createPrivateKey(privatePem);
  return crypto.sign(null, Buffer.isBuffer(data) ? data : Buffer.from(data), key).toString('base64');
}
function verifyEd25519(publicPem, data, sigB64) {
  try {
    const key = crypto.createPublicKey(publicPem);
    if (key.asymmetricKeyType !== 'ed25519') return false;
    return crypto.verify(null, Buffer.isBuffer(data) ? data : Buffer.from(data), key, Buffer.from(String(sigB64 || ''), 'base64'));
  } catch (e) { return false; }
}
/** SHA-256 of the DER public key, shown to people so they can compare keys out of band. */
function keyFingerprint(publicPem) {
  const der = crypto.createPublicKey(publicPem).export({ type: 'spki', format: 'der' });
  return 'SHA256:' + sha256b64url(der);
}
function newEd25519() {
  const { publicKey, privateKey } = crypto.generateKeyPairSync('ed25519');
  return {
    publicPem: publicKey.export({ type: 'spki', format: 'pem' }),
    privatePem: privateKey.export({ type: 'pkcs8', format: 'pem' })
  };
}
const B32 = 'abcdefghijkmnpqrstuvwxyz23456789'; // no 0/o/1/l
function randomId(prefix, n = 12) {
  const b = crypto.randomBytes(n); let s = '';
  for (let i = 0; i < n; i++) s += B32[b[i] % B32.length];
  return (prefix || '') + s;
}
/** Human-typable one-time code, e.g. K7QF-2MZD-9HXA. */
function humanCode(groups = 3) {
  const A = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'; const b = crypto.randomBytes(groups * 4); let s = '';
  for (let i = 0; i < groups * 4; i++) { s += A[b[i] % A.length]; if (i % 4 === 3 && i < groups * 4 - 1) s += '-'; }
  return s;
}
const normCode = c => String(c || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
const hashCode = c => sha256('ef-code:' + normCode(c));
const normEmail = e => String(e || '').trim().toLowerCase();
const EMAIL_RE = /^[^\s@<>()",;:]+@[^\s@<>()",;:]+\.[^\s@<>()",;:]+$/;
const TEACHER_ID_RE = /^[A-Za-z0-9][A-Za-z0-9._\-\/]{0,63}$/;

module.exports = { canonical, sha256, sha256b64url, signEd25519, verifyEd25519, keyFingerprint, newEd25519,
  randomId, humanCode, normCode, hashCode, normEmail, EMAIL_RE, TEACHER_ID_RE };
