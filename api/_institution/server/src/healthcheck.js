'use strict';
// Used by Docker's HEALTHCHECK: exits 0 only when /healthz answers OK.
const port = process.env.PORT || 8080;
fetch(`http://127.0.0.1:${port}/healthz`).then(r => r.json().then(j => process.exit(r.ok && j.ok ? 0 : 1))).catch(() => process.exit(1));
