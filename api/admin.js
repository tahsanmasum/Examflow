'use strict';
// POST /api/admin — Admin Monitor → Institutions & Licences. Admin-only (Firebase ID token).
const { adminHandler } = require('./_lib/http');
const { cp, verifyAdmin } = require('./_lib/prod');
module.exports = adminHandler({ cp, verifyAdmin });
