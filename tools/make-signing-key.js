#!/usr/bin/env node
'use strict';
/* Makes the GHUM signing key for institution packages and licences (Ed25519).
   Run once on your own computer:   node tools/make-signing-key.js
   Then copy the private key into Vercel → Settings → Environment Variables → GHUM_SIGNING_PRIVATE_KEY.
   Keep a copy somewhere safe and private. If you lose it, every institution needs a new package;
   if someone else gets it, they can sign packages as you — make a new one and re-issue packages. */
const crypto = require('node:crypto');
const { privateKey, publicKey } = crypto.generateKeyPairSync('ed25519');
const priv = privateKey.export({ type: 'pkcs8', format: 'pem' });
const pub = publicKey.export({ type: 'spki', format: 'pem' });
const fp = 'SHA256:' + crypto.createHash('sha256').update(publicKey.export({ type: 'spki', format: 'der' })).digest('base64url');
process.stdout.write(
  '\n=== GHUM_SIGNING_PRIVATE_KEY (secret — paste into Vercel, keep a private backup) ===\n' + priv +
  '\nOne-line form (if your tool wants a single line):\n' + priv.trim().replace(/\n/g, '\\n') + '\n' +
  '\n=== Public key (safe to share; every package carries it) ===\n' + pub +
  '\nFingerprint: ' + fp + '\n');
