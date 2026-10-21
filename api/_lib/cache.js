'use strict';
/* Short-lived, per-instance read cache for the Admin Monitor.
   A warm Vercel function serves many requests; within a few seconds the same
   documents are read again and again (roles, settings, institutions…). This
   keeps them for a few seconds and forgets a collection the moment this
   instance writes to it, so an admin always sees their own change at once.
   Another instance may see a change up to `ttl` ms later. Results are copies,
   so callers can't change what is cached. */
const clone = v => v === undefined || v === null ? v : JSON.parse(JSON.stringify(v));

function cachedStore(inner, ttl = 8000) {
  if (inner && inner.__cached) return inner;
  const m = new Map();
  const k = (op, c, ...a) => op + '\u0001' + c + '\u0001' + a.map(String).join('\u0001');
  const forget = c => { for (const key of m.keys()) if (key.split('\u0001')[1] === c) m.delete(key); };
  const memo = (key, fn) => {
    const e = m.get(key);
    if (e && Date.now() - e.t < ttl) return e.p.then(clone);
    const p = Promise.resolve().then(fn);
    m.set(key, { t: Date.now(), p });
    p.catch(() => { if (m.get(key) && m.get(key).p === p) m.delete(key); });
    return p.then(clone);
  };
  const write = async (c, fn) => { forget(c); try { return await fn(); } finally { forget(c); } };
  const s = {
    __cached: true, inner, data: inner.data,
    get: (c, i) => memo(k('get', c, i), () => inner.get(c, i)),
    all: c => memo(k('all', c), () => inner.all(c)),
    where: (c, f, v) => memo(k('where', c, f, v), () => inner.where(c, f, v)),
    /** Newest documents with field >= since, newest first (Firestore: a single-field range query, no extra index). */
    recent: (c, f, since, limit) => memo(k('recent', c, f, since, limit), () => inner.recent(c, f, since, limit)),
    set: (c, i, d) => write(c, () => inner.set(c, i, d)),
    add: (c, d) => write(c, () => inner.add(c, d)),
    del: (c, i) => write(c, () => inner.del(c, i)),
    tx: fn => inner.tx(t => fn({ get: t.get, set: (c, i, d) => { forget(c); t.set(c, i, d); } })).finally(() => m.clear()),
    clear: () => m.clear()
  };
  return s;
}

/* Firebase Auth and the app's own collections, cached the same way; any change made through it forgets everything. */
function cachedPlatform(inner, ttl = 15000) {
  if (inner && inner.__cached) return inner;
  const m = new Map();
  const memo = (key, fn) => {
    const e = m.get(key);
    if (e && Date.now() - e.t < ttl) return e.p.then(clone);
    const p = Promise.resolve().then(fn);
    m.set(key, { t: Date.now(), p });
    p.catch(() => { if (m.get(key) && m.get(key).p === p) m.delete(key); });
    return p.then(clone);
  };
  const READ = ['listUsers', 'getUser', 'getUserByEmail', 'teachers', 'exams', 'sessions', 'feedback', 'readMeta', 'rulesSource', 'firestoreLocation'];
  return new Proxy(inner, {
    get(t, p) {
      if (p === '__cached') return true;
      if (p === 'clear') return () => m.clear();
      const v = t[p];
      if (typeof v !== 'function') return v;
      if (READ.includes(p)) return (...a) => memo(p + '\u0001' + a.map(x => JSON.stringify(x)).join('\u0001'), () => v.apply(t, a));
      return async (...a) => { m.clear(); try { return await v.apply(t, a); } finally { m.clear(); } };
    }
  });
}
module.exports = { cachedStore, cachedPlatform };
