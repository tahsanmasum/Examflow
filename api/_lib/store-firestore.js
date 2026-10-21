'use strict';
/* Storage adapter for the control plane on Cloud Firestore (firebase-admin).
   The Admin SDK bypasses security rules; the browser can't reach these
   collections because firestore.rules denies everything not listed. */
function firestoreStore(db) {
  try { db.settings({ ignoreUndefinedProperties: true }); } catch (e) { /* already set */ }
  const ref = (c, i) => db.collection(c).doc(i);
  return {
    async get(c, i) { const s = await ref(c, i).get(); return s.exists ? s.data() : null; },
    async set(c, i, d) { await ref(c, i).set(d); },
    async add(c, d) { const r = await db.collection(c).add(d); return r.id; },
    async where(c, f, v) { const s = await db.collection(c).where(f, '==', v).get(); return s.docs.map(x => x.data()); },
    async all(c) { const s = await db.collection(c).get(); return s.docs.map(x => x.data()); },
    async tx(fn) {
      return db.runTransaction(async t => fn({
        get: async (c, i) => { const s = await t.get(ref(c, i)); return s.exists ? s.data() : null; },
        set: (c, i, d) => { t.set(ref(c, i), d); }
      }));
    }
  };
}
module.exports = { firestoreStore };
