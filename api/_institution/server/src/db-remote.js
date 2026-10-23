'use strict';
/* Lets the server talk to an external database with the same simple, one-step-at-a-time
   calls it uses for the built-in SQLite file. A worker thread (db-worker.js) holds the
   connection; each call here sends one request and waits for its answer.

   Keep the database server close to the ExamFlow server (same data centre / LAN):
   each statement is one round trip. */
const path = require('node:path');
const { Worker, MessageChannel, receiveMessageOnPort } = require('node:worker_threads');

const TIMEOUT_MS = 60000;

class Remote {
  constructor(cfg) { this.cfg = cfg; this.n = 0; this.w = null; }
  start() {
    const { port1, port2 } = new MessageChannel();
    this.signal = new Int32Array(new SharedArrayBuffer(4));
    this.port = port1;
    this.w = new Worker(path.join(__dirname, 'db-worker.js'), { workerData: { port: port2, signal: this.signal, cfg: this.cfg }, transferList: [port2] });
    this.w.unref();
    this.failed = null;
    this.w.on('error', e => { this.failed = e; });
  }
  stop() { if (this.w) { const w = this.w; this.w = null; w.terminate().catch(() => {}); try { this.port.close(); } catch (e) {} } }
  call(op, sql, args) {
    if (!this.w) this.start();
    const id = ++this.n;
    let seen = Atomics.load(this.signal, 0);
    this.port.postMessage({ id, op, sql, args });
    for (;;) {
      const r = Atomics.wait(this.signal, 0, seen, TIMEOUT_MS);
      if (r === 'timed-out') {
        this.stop();
        const e = new Error(`The ${label(this.cfg.type)} database did not answer within ${TIMEOUT_MS / 1000} seconds` + (this.failed ? ': ' + this.failed.message : '.'));
        e.code = 'DB_TIMEOUT'; throw e;
      }
      let got;
      while ((got = receiveMessageOnPort(this.port))) {
        const m = got.message;
        if (m.id !== id && m.id !== -1) continue; // a late answer to an earlier call
        if (!m.ok) { const e = new Error(m.error.message); e.code = m.error.code; e.number = m.error.number; throw e; }
        return m;
      }
      seen = Atomics.load(this.signal, 0);
    }
  }
}
const label = t => ({ postgres: 'PostgreSQL', mysql: 'MySQL/MariaDB', mssql: 'SQL Server', oracle: 'Oracle', mongodb: 'MongoDB' })[t] || t;

module.exports = { Remote, label };
