'use strict';
/* In-memory storage with Firestore's behaviour where it matters for tests:
   values are copied (no shared references), and inside a transaction every
   read must come before the first write, as Firestore requires. */
const clone = v => v === undefined ? undefined : JSON.parse(JSON.stringify(v));
/* what Firestore refuses: an array directly inside an array, a document over 1 MiB, more than 20 levels */
function check(d, where) {
  const walk = (v, depth, inArr) => {
    if (depth > 20) throw new Error('Firestore: ' + where + ' nests deeper than 20 levels.');
    if (Array.isArray(v)) { if (inArr) throw new Error('Firestore: ' + where + ' has an array inside an array.'); v.forEach(x => walk(x, depth + 1, true)); }
    else if (v && typeof v === 'object') Object.values(v).forEach(x => walk(x, depth + 1, false));
  };
  walk(d, 0, false);
  if (Buffer.byteLength(JSON.stringify(d || {})) > 1048000) throw new Error('Firestore: ' + where + ' is over 1 MiB.');
  return d;
}
function memoryStore(seed) {
  const data = new Map(); let n = 0; let chain = Promise.resolve();
  const col = c => { if (!data.has(c)) data.set(c, new Map()); return data.get(c); };
  const s = {
    data,
    async get(c, i) { return clone(col(c).get(i)) || null; },
    async set(c, i, d) { col(c).set(i, clone(check(d, c + '/' + i))); },
    async add(c, d) { const id = 'auto' + (++n); col(c).set(id, clone(check(d, c))); return id; },
    async where(c, f, v) { return [...col(c).values()].filter(x => x && x[f] === v).map(clone); },
    async all(c) { return [...col(c).values()].map(clone); },
    tx(fn) {
      const run = async () => {
        const writes = []; let wrote = false;
        const r = await fn({
          get: async (c, i) => { if (wrote) throw new Error('Firestore transactions require all reads before writes.'); return clone(col(c).get(i)) || null; },
          set: (c, i, d) => { wrote = true; writes.push([c, i, clone(check(d, c + '/' + i))]); }
        });
        for (const [c, i, d] of writes) col(c).set(i, d);
        return r;
      };
      const p = chain.then(run, run); chain = p.catch(() => {}); return p;
    }
  };
  return s;
}
module.exports = { memoryStore };
