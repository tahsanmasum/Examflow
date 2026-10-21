'use strict';
// POST /api/me — a signed-in ExamFlow user's own dashboard messages, feature overrides and whether to show the Admin Monitor menu.
const { meHandler } = require('./_lib/http');
const { con, verifyToken } = require('./_lib/prod');
module.exports = meHandler({ con, verifyToken });
