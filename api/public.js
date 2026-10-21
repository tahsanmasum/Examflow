'use strict';
// POST /api/public — anonymous, rate-limited error reports from the app (message, page, file and line only).
const { publicHandler } = require('./_lib/http');
const { con } = require('./_lib/prod');
module.exports = publicHandler({ con });
