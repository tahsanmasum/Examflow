'use strict';
// POST /api/admin — the Admin Monitor. Every action is checked against the caller's admin role (see _lib/rbac.js).
const { adminHandler } = require('./_lib/http');
const { con, verifyToken, warm } = require('./_lib/prod');
module.exports = adminHandler({ con, verifyToken, warm });
