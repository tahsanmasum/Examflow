'use strict';
// POST /api/inst — institution servers register and check in (Ed25519-signed requests). No exam data is accepted here.
const { instHandler } = require('./_lib/http');
const { cp } = require('./_lib/prod');
module.exports = instHandler({ cp });
