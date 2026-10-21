'use strict';
/* Configuration sync from GHUM (v47).

   GHUM's signed answer to every check-in carries a "sync" bundle: which
   features this institution has, its limits, public settings (maintenance
   notice, exam defaults), announcements and dashboard messages for its
   teachers, and — only when GHUM's copy is newer — the approved teacher list.
   Because it is inside the signed statement, nobody between GHUM and this
   server can change it.

   This is configuration, not software: nothing here downloads or runs code.
   The bundle's version is reported back in the next check-in, so the Admin
   Monitor shows "applied" only after this server really applied it.
   Dashboard receipts (how many teachers received and read each message) go
   back as counts only. */
const { FEATURES, effective } = require('./features-core');
const { validateAllowlist } = require('./package');
const { normEmail } = require('./util');

class Sync {
  constructor({ db, log, instId }) { this.db = db; this.log = log || (() => {}); this.instId = instId; }
  config() { try { return JSON.parse(this.db.getMeta('sync_config') || 'null'); } catch (e) { return null; } }
  /** Effective features: GHUM's list when synced, else every feature's built-in default. */
  features() {
    const c = this.config();
    if (c && c.features) return c.features;
    return Object.fromEntries(Object.entries(effective({}, null)).map(([k, v]) => [k, v.on]));
  }
  limits() { const c = this.config(); return (c && c.limits) || { maxTeachers: null, maxActiveExams: null }; }
  apply(statement) {
    const s = statement && statement.sync; if (!s || typeof s !== 'object') return false;
    let changed = false;
    try {
      if (s.allowlist && Number(s.allowlist.version) > Number(this.db.getMeta('allowlist_version') || 0)) { this.applyAllowlist(s.allowlist); changed = true; }
      if (s.version && s.version !== this.db.getMeta('sync_applied_version')) {
        const keep = { version: s.version, features: s.features || null, limits: s.limits || null, plan: s.plan || null, settings: s.settings || null,
          announcements: Array.isArray(s.announcements) ? s.announcements : [], messages: Array.isArray(s.messages) ? s.messages : [], receivedAt: Date.now() };
        this.db.tx(() => {
          this.db.setMeta('sync_config', JSON.stringify(keep));
          this.db.setMeta('sync_applied_version', s.version);
          this.db.setMeta('sync_applied_at', Date.now());
          this.db.setMeta('sync_error', '');
        });
        changed = true;
        this.db.audit('ghum', 'config.sync', s.version, 'ok', { features: Object.keys(s.features || {}).filter(k => s.features[k] === false), limits: s.limits || null,
          announcements: keep.announcements.length, messages: keep.messages.length });
      }
    } catch (e) {
      this.db.setMeta('sync_error', String(e.message).slice(0, 300));
      this.log('config sync failed: ' + e.message);
      changed = true;
    }
    return changed;
  }
  applyAllowlist(al) {
    const v0 = Number(al.version);
    const errs = validateAllowlist({ institutionId: this.instId, version: v0, teachers: al.teachers }, { institution: { id: this.instId }, allowlist: { version: v0 } });
    if (errs.length) throw new Error('The teacher list from GHUM was refused: ' + errs.slice(0, 3).join('; '));
    const v = Number(al.version);
    this.db.tx(() => {
      const before = new Map(this.db.db.prepare('SELECT teacher_id, email FROM allowlist').all().map(r => [r.teacher_id, r.email]));
      this.db.db.prepare('DELETE FROM allowlist').run();
      const ins = this.db.db.prepare('INSERT INTO allowlist (teacher_id, email, name, version) VALUES (?, ?, ?, ?)');
      const now = new Set(); let added = 0;
      for (const t of al.teachers) { ins.run(t.teacherId, normEmail(t.email), t.name || null, v); now.add(t.teacherId); if (!before.has(t.teacherId)) added++; }
      let removed = 0; for (const k of before.keys()) if (!now.has(k)) removed++;
      this.db.setMeta('allowlist_version', v);
      this.db.db.prepare('INSERT INTO allowlist_history (t, package_id, package_version, list_version, added, removed, total) VALUES (?, ?, ?, ?, ?, ?, ?)')
        .run(Date.now(), 'sync', null, v, added, removed, now.size);
      this.db.audit('ghum', 'allowlist.sync', String(v), 'ok', { added, removed, total: now.size });
    });
    this.log(`Teacher list version ${v} received from GHUM.`);
  }
  /** For the next check-in: what was applied, and per-message counts (no names, no content). */
  report() {
    const c = this.config(); const receipts = {};
    if (c && c.messages) {
      const teachers = this.db.db.prepare('SELECT email FROM allowlist').all().map(r => r.email);
      for (const m of c.messages) {
        const to = m.to === 'all' ? teachers : (m.to || []).filter(e => teachers.includes(e));
        const rows = this.db.db.prepare('SELECT delivered_at, read_at FROM inbox WHERE msg_id = ?').all(m.id);
        receipts[m.id] = { recipients: to.length, delivered: rows.filter(r => r.delivered_at).length, read: rows.filter(r => r.read_at).length };
      }
    }
    return { appliedVersion: this.db.getMeta('sync_applied_version') || null, appliedAt: Number(this.db.getMeta('sync_applied_at')) || null,
      error: this.db.getMeta('sync_error') || null, receipts };
  }
  /** What the app shows a visitor or a signed-in teacher. */
  forUser(email, now = Date.now()) {
    const c = this.config() || {};
    const out = { features: this.features(), limits: this.limits(), plan: c.plan || null, settings: c.settings || null,
      announcements: (c.announcements || []).filter(a => !a.endAt || a.endAt > now) };
    if (email) {
      const msgs = (c.messages || []).filter(m => (m.to === 'all' || (m.to || []).includes(email)) && (!m.visibleFrom || m.visibleFrom <= now) && (!m.expiresAt || m.expiresAt > now));
      const sel = this.db.db.prepare('SELECT delivered_at, read_at, archived_at FROM inbox WHERE msg_id = ? AND email = ?');
      const up = this.db.db.prepare('INSERT INTO inbox (msg_id, email, delivered_at) VALUES (?, ?, ?) ON CONFLICT(msg_id, email) DO NOTHING');
      out.inbox = msgs.map(m => { let r = sel.get(m.id, email); if (!r) { up.run(m.id, email, now); r = { delivered_at: now }; }
        return { id: m.id, subject: m.subject, body: m.body, link: m.link || null, priority: m.priority, sentAt: m.sentAt, from: 'ExamFlow', readAt: r.read_at || null, archivedAt: r.archived_at || null }; })
        .sort((a, b) => b.sentAt - a.sentAt);
      out.unread = out.inbox.filter(i => !i.readAt && !i.archivedAt).length;
    }
    return out;
  }
  mark(email, id, action, now = Date.now()) {
    const c = this.config() || {}; const m = (c.messages || []).find(x => x.id === id);
    if (!m || !(m.to === 'all' || (m.to || []).includes(email))) return false;
    this.db.db.prepare('INSERT INTO inbox (msg_id, email, delivered_at) VALUES (?, ?, ?) ON CONFLICT(msg_id, email) DO NOTHING').run(id, email, now);
    if (action === 'read') this.db.db.prepare('UPDATE inbox SET read_at = COALESCE(read_at, ?) WHERE msg_id = ? AND email = ?').run(now, id, email);
    else if (action === 'archive') this.db.db.prepare('UPDATE inbox SET archived_at = ?, read_at = COALESCE(read_at, ?) WHERE msg_id = ? AND email = ?').run(now, now, id, email);
    else if (action === 'unarchive') this.db.db.prepare('UPDATE inbox SET archived_at = NULL WHERE msg_id = ? AND email = ?').run(id, email);
    return true;
  }
}
module.exports = { Sync, FEATURES };
