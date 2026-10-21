'use strict';
/* Announcements (pop-ups) and dashboard messages.

   Announcements: content is plain text (only **bold**, line breaks and one
   https link are ever rendered), so nothing an admin types can run as code.
   Published items for the public site and cloud dashboards are written to
   meta/announcements; institution-targeted ones travel in the signed sync.

   Messages: one record per message (cpMessages) and one delivery record per
   cloud recipient (cpDeliveries). A recipient's app fetches its inbox from
   /api/me, which only ever returns that account's own deliveries.
   "Delivered" is recorded when the recipient's app actually fetched it,
   "Read" when they opened it. Institution teachers get messages through their
   own server; their delivered/read counts come back in its check-in. */
const crypto = require('node:crypto');
const { CPError, C } = require('./cp');
const K = { ann: 'cpAnnouncements', msgs: 'cpMessages', deliv: 'cpDeliveries', users: 'cpUserMeta' };
const bad = (m, s, c) => { throw new CPError(m, s, c); };
const id = p => p + crypto.randomBytes(9).toString('hex');
const CATS = ['general', 'feature', 'maintenance', 'service', 'urgent'];
const PRIOS = ['low', 'normal', 'high', 'urgent'];
const AUD = ['everyone', 'landing', 'cloud', 'institutions'];

function cleanText(v, max, name, required) {
  if (v == null) v = ''; if (typeof v !== 'string') bad(name + ' must be text.');
  v = v.replace(/\r/g, '').replace(/[<>]/g, s => s === '<' ? '‹' : '›').trim();
  if (required && !v) bad(name + ' is required.'); if (v.length > max) bad(`${name} is too long (max ${max} characters).`);
  return v;
}
function cleanLink(l) {
  if (!l || (!l.url && !l.label)) return null;
  const url = String(l.url || '').trim(), label = cleanText(l.label || 'Learn more', 40, 'Link label');
  if (!/^https:\/\/[^\s"'<>]+$/i.test(url) && !/^\/[^\s"'<>]*$/.test(url)) bad('Links must start with https:// (or be a page on this site, starting with /).');
  if (url.length > 500) bad('The link is too long.');
  return { url, label };
}
function when(v, name) {
  if (v == null || v === '') return null;
  const n = typeof v === 'number' ? v : Date.parse(v);
  if (!Number.isFinite(n)) bad(name + ' is not a valid date and time.');
  return n;
}
function annState(a, now) {
  if (a.status === 'archived') return 'Archived';
  if (a.status === 'withdrawn') return 'Taken down';
  if (a.status !== 'published') return 'Draft';
  if (a.startAt && a.startAt > now) return 'Scheduled';
  if (a.endAt && a.endAt <= now) return 'Ended';
  return 'Live';
}

const methods = {
  /* ───── announcements ───── */
  async publishAnnouncements() {
    const now = this.now(); const s = await this.settings();
    const items = s.announcements.enabled === false ? [] : (await this.store.all(K.ann)).filter(a => a.status === 'published' && (!a.endAt || a.endAt > now) && ['everyone', 'landing', 'cloud'].includes(a.audience))
      .map(a => ({ id: a.id, heading: a.heading, body: a.body, link: a.link || null, category: a.category, priority: a.priority, audience: a.audience, mode: a.mode, startAt: a.startAt || null, endAt: a.endAt || null, updatedAt: a.updatedAt }));
    const doc = { v: now, updatedAt: now, off: s.announcements.enabled === false, items };
    try { await this.platform.writeMeta('announcements', doc); const back = await this.platform.readMeta('announcements'); return back && back.v === doc.v ? { state: 'applied', doc } : { state: 'failed', error: 'could not read it back' }; }
    catch (e) { await this.errorEvent('announcements', 'publish', e); return { state: 'failed', error: e.message }; }
  },
  async x_ann_list(admin, b) {
    const now = this.now();
    let rows = (await this.store.all(K.ann)).map(a => ({ ...a, state: annState(a, now) })).sort((x, y) => (y.updatedAt || 0) - (x.updatedAt || 0));
    if (b.state) rows = rows.filter(a => a.state === b.state);
    const pub = await this.platform.readMeta('announcements');
    return { announcements: rows, published: pub, categories: CATS, priorities: PRIOS, audiences: AUD, enabled: (await this.settings()).announcements.enabled !== false,
      institutions: (await this.store.all(C.inst)).map(i => ({ id: i.id, name: i.name })) };
  },
  async x_ann_save(admin, b) {
    const now = this.now();
    const rec = {
      title: cleanText(b.title, 120, 'Internal title', true), heading: cleanText(b.heading, 120, 'Heading', true), body: cleanText(b.body, 2000, 'Message', true),
      link: cleanLink(b.link), category: CATS.includes(b.category) ? b.category : 'general', priority: PRIOS.includes(b.priority) ? b.priority : 'normal',
      audience: AUD.includes(b.audience) ? b.audience : 'everyone', institutionIds: [], mode: b.mode === 'ack' ? 'ack' : 'dismiss',
      startAt: when(b.startAt, 'Start'), endAt: when(b.endAt, 'End')
    };
    if (rec.audience === 'institutions') {
      const ids = Array.from(new Set((b.institutionIds || []).map(String)));
      if (!ids.length) bad('Choose at least one institution.');
      const all = new Set((await this.store.all(C.inst)).map(i => i.id)); if (ids.some(i => !all.has(i))) bad('Unknown institution in the audience.');
      rec.institutionIds = ids;
    }
    if (rec.startAt && rec.endAt && rec.endAt <= rec.startAt) bad('The end must be after the start.');
    if (rec.endAt && rec.endAt <= now) bad('The end time has already passed.');
    let prev = null;
    if (b.id) { prev = await this.store.get(K.ann, String(b.id)); if (!prev) bad('Announcement not found.', 404, 'not_found'); if (prev.status === 'archived') bad('Archived announcements can\'t be edited.', 409); }
    const out = { ...(prev || { id: id('ann_'), status: 'draft', createdAt: now, createdBy: admin.email, history: [] }), ...rec, updatedAt: now, updatedBy: admin.email };
    out.history = [{ t: now, by: admin.email, what: prev ? 'edited' : 'created' }, ...(out.history || [])].slice(0, 50);
    await this.store.set(K.ann, out.id, out);
    await this.audit(admin, 'ann.save', { type: 'announcement', id: out.id }, 'ok', { before: prev ? { heading: prev.heading, audience: prev.audience, startAt: prev.startAt, endAt: prev.endAt } : null, after: { heading: out.heading, audience: out.audience, startAt: out.startAt, endAt: out.endAt } });
    let pub = null; if (out.status === 'published') { pub = await this.publishAnnouncements(); await this.syncAudience(out); }
    return { announcement: { ...out, state: annState(out, now) }, republished: pub ? pub.state : null };
  },
  async syncAudience(a) { const ids = a.audience === 'everyone' ? (await this.store.all(C.inst)).map(i => i.id) : a.audience === 'institutions' ? a.institutionIds : []; for (const i of ids) await this.markSyncPending(i); },
  async annChange(admin, b, status, action) {
    if (b.confirm !== true) bad('Confirm first.', 400, 'confirm');
    const a = await this.store.get(K.ann, String(b.id || '')); if (!a) bad('Announcement not found.', 404, 'not_found');
    const now = this.now(); const before = a.status;
    const next = { ...a, status, updatedAt: now, updatedBy: admin.email, ...(status === 'published' ? { publishedAt: now, publishedBy: admin.email } : {}),
      history: [{ t: now, by: admin.email, what: action, reason: b.reason || null }, ...(a.history || [])].slice(0, 50) };
    if (status === 'published' && next.endAt && next.endAt <= now) bad('The end time has passed. Change it first.', 409);
    await this.store.set(K.ann, a.id, next);
    const pub = await this.publishAnnouncements(); await this.syncAudience(next);
    const live = pub.state === 'applied' && ['everyone', 'landing', 'cloud'].includes(next.audience) ? pub.doc.items.some(i => i.id === a.id) : null;
    await this.audit(admin, 'ann.' + action, { type: 'announcement', id: a.id }, pub.state === 'applied' ? 'ok' : 'failed', { before, after: status, reason: b.reason || null, error: pub.error || null });
    return { announcement: { ...next, state: annState(next, now) }, result: pub.state, error: pub.error || null, visibleNow: live,
      message: pub.state !== 'applied' ? 'Saved, but publishing to the site failed: ' + pub.error : status === 'published' ? (annState(next, now) === 'Scheduled' ? 'Published; it will appear at its start time.' : 'Published and live.') + (next.audience === 'institutions' || next.audience === 'everyone' ? ' Institution apps show it after their next check-in.' : '') : 'Done. It no longer appears.' };
  },
  async x_ann_publish(admin, b) { return this.annChange(admin, b, 'published', 'publish'); },
  async x_ann_unpublish(admin, b) { return this.annChange(admin, b, 'withdrawn', 'unpublish'); },
  async x_ann_archive(admin, b) { return this.annChange(admin, b, 'archived', 'archive'); },
  /** Master switch: hides every announcement at once (Global Settings → Announcements). */
  async x_ann_killAll(admin, b) {
    if (b.confirm !== true) bad('Confirm first.', 400, 'confirm');
    const cur = await this.store.get('cpConfig', 'settings'); const vals = (await this.settings());
    const next = JSON.parse(JSON.stringify(vals)); next.announcements.enabled = b.on === true;
    const r = await this.commitSettings(admin, cur, next, [{ path: 'announcements.enabled', label: 'Show announcements at all', before: vals.announcements.enabled, after: b.on === true }], String(b.reason || (b.on ? 'Announcements switched back on' : 'Emergency: all announcements hidden')));
    const pub = await this.publishAnnouncements();
    return { ...r, announcementsResult: pub.state };
  },

  /* ───── dashboard messages ───── */
  async resolveRecipients(b) {
    const kind = String(b.kind || '');
    if (kind === 'users') {
      const uids = Array.from(new Set((b.uids || []).map(String))).slice(0, 500); if (!uids.length) bad('Choose at least one recipient.');
      const out = []; for (const u of uids) { const x = await this.platform.getUser(u); if (!x) bad('A recipient no longer exists: ' + u); out.push({ uid: x.uid, email: x.email }); }
      return { kind, users: out, count: out.length, label: out.length === 1 ? out[0].email : out.length + ' selected accounts' };
    }
    if (kind === 'cloud-all') { const us = (await this.platform.listUsers()).filter(u => !u.disabled); return { kind, users: us.map(u => ({ uid: u.uid, email: u.email })), count: us.length, label: 'All cloud teachers (' + us.length + ')' }; }
    if (kind === 'cloud-institution') {
      const inst = await this.cp.instOr404(b.institutionId); const metas = (await this.store.all(K.users)).filter(m => m.institutionId === inst.id);
      const us = []; for (const m of metas) { const x = await this.platform.getUser(m.uid); if (x && !x.disabled) us.push({ uid: x.uid, email: x.email }); }
      return { kind, institutionId: inst.id, users: us, count: us.length, label: `Cloud teachers associated with ${inst.name} (${us.length})` };
    }
    if (kind === 'institution-all' || kind === 'institution-teachers') {
      const inst = await this.cp.instOr404(b.institutionId); const al = await this.store.get(C.allow, inst.id) || { teachers: [] };
      if (kind === 'institution-all') return { kind, institutionId: inst.id, count: al.teachers.length, label: `All teachers at ${inst.name} (${al.teachers.length}, via their server)`, viaServer: true };
      const want = new Set((b.emails || []).map(e => String(e).toLowerCase())); const hit = al.teachers.filter(t => want.has(t.email));
      if (!hit.length) bad('None of those emails is on ' + inst.name + '\'s roster.');
      return { kind, institutionId: inst.id, emails: hit.map(t => t.email), count: hit.length, label: `${hit.length} teacher${hit.length === 1 ? '' : 's'} at ${inst.name} (via their server)`, viaServer: true };
    }
    bad('Choose who receives the message.');
  },
  async x_msg_recipients(admin, b) { const r = await this.resolveRecipients(b); return { ...r, users: (r.users || []).slice(0, 20), sample: true }; },
  async x_msg_send(admin, b) {
    if (b.confirm !== true) bad('Preview and confirm first.', 400, 'confirm');
    const subject = cleanText(b.subject, 120, 'Subject', true), body = cleanText(b.body, 4000, 'Message', true);
    const link = cleanLink(b.link), priority = PRIOS.includes(b.priority) ? b.priority : 'normal';
    const visibleFrom = when(b.visibleFrom, 'Delivery time'), expiresAt = when(b.expiresAt, 'Expiry'); const now = this.now();
    if (expiresAt && expiresAt <= (visibleFrom || now)) bad('The expiry must be after delivery.');
    const r = await this.resolveRecipients(b.recipients || {});
    if (r.kind === 'cloud-all' && b.confirmAll !== 'ALL') bad(`This goes to every cloud teacher (${r.count}). Type ALL to confirm.`, 400, 'confirm_all');
    if (!r.count) bad('Nobody would receive this message.');
    const mid = id('msg_');
    const rec = { id: mid, subject, body, link, priority, visibleFrom, expiresAt, sender: admin.email, sentAt: now, status: 'published',
      recipients: { kind: r.kind, label: r.label, count: r.count, ...(r.emails ? { emails: r.emails } : {}), ...(r.users ? { uids: r.users.map(u => u.uid).slice(0, 5000) } : {}) },
      institutionId: r.institutionId || null, viaServer: !!r.viaServer, failed: 0 };
    await this.store.set(K.msgs, mid, rec);
    let failed = 0;
    for (const u of r.users || []) {
      try { await this.store.set(K.deliv, mid + '_' + u.uid, { id: mid + '_' + u.uid, msgId: mid, uid: u.uid, email: u.email, state: 'sent', createdAt: now, visibleFrom, expiresAt, deliveredAt: null, readAt: null, archivedAt: null }); }
      catch (e) { failed++; }
    }
    if (failed) await this.store.set(K.msgs, mid, { ...rec, failed });
    if (r.viaServer) await this.markSyncPending(r.institutionId);
    await this.audit(admin, 'msg.send', { type: 'message', id: mid, inst: r.institutionId || null }, failed ? 'failed' : 'ok', { recipients: r.label, count: r.count, failed, subject });
    return { message: { ...rec, failed }, state: visibleFrom && visibleFrom > now ? 'Scheduled' : 'Published',
      note: r.viaServer ? 'Saved. It reaches the teachers through their institution\'s server at its next check-in; delivered and read counts come back the same way.' : (failed ? `${failed} delivery record${failed === 1 ? '' : 's'} could not be saved.` : `Ready in ${r.count} inbox${r.count === 1 ? '' : 'es'}. It shows as delivered when each recipient's dashboard fetches it.`) };
  },
  async msgStats(m) {
    if (m.viaServer) {
      const inst = await this.store.get(C.inst, m.institutionId); const rc = inst && inst.sync && inst.sync.receipts && inst.sync.receipts[m.id];
      const synced = inst && inst.sync && inst.sync.appliedAt && inst.sync.appliedAt >= m.sentAt && !(inst.sync.appliedVersion !== inst.sync.currentVersion && inst.sync.pendingSince && inst.sync.pendingSince <= m.sentAt);
      return { recipients: rc ? rc.recipients : null, delivered: rc ? rc.delivered : 0, read: rc ? rc.read : 0, archived: null, syncState: rc ? 'Received by the server' : synced ? 'Synced' : 'Waiting for the server' };
    }
    const d = await this.store.where(K.deliv, 'msgId', m.id);
    return { recipients: d.length, delivered: d.filter(x => x.deliveredAt).length, read: d.filter(x => x.readAt).length, archived: d.filter(x => x.archivedAt).length };
  },
  async x_msg_list(admin, b) {
    const now = this.now(); const rows = (await this.store.all(K.msgs)).sort((x, y) => (y.sentAt || 0) - (x.sentAt || 0)).slice(0, 300);
    const out = []; for (const m of rows) out.push({ ...m, recipients: { ...m.recipients, uids: undefined }, stats: await this.msgStats(m),
      state: m.status === 'archived' ? 'Archived' : m.visibleFrom && m.visibleFrom > now ? 'Scheduled' : m.expiresAt && m.expiresAt <= now ? 'Expired' : 'Published' });
    return { messages: out, institutions: (await this.store.all(C.inst)).map(i => ({ id: i.id, name: i.name })), priorities: PRIOS };
  },
  async x_msg_get(admin, b) {
    const m = await this.store.get(K.msgs, String(b.id || '')); if (!m) bad('Message not found.', 404, 'not_found');
    const d = m.viaServer ? [] : (await this.store.where(K.deliv, 'msgId', m.id)).map(x => ({ email: x.email, uid: x.uid, deliveredAt: x.deliveredAt, readAt: x.readAt, archivedAt: x.archivedAt }));
    return { message: m, stats: await this.msgStats(m), deliveries: d };
  },
  async x_msg_archive(admin, b) {
    if (b.confirm !== true) bad('Confirm first.', 400, 'confirm');
    const m = await this.store.get(K.msgs, String(b.id || '')); if (!m) bad('Message not found.', 404, 'not_found');
    await this.store.set(K.msgs, m.id, { ...m, status: 'archived', archivedAt: this.now(), archivedBy: admin.email });
    if (m.viaServer) await this.markSyncPending(m.institutionId);
    await this.audit(admin, 'msg.archive', { type: 'message', id: m.id }, 'ok', {});
    return { ok: true, note: 'Withdrawn: it no longer shows in recipients\' inboxes.' };
  },

  /* ───── /api/me: a signed-in user's own inbox and feature overrides ───── */
  async me(decoded, b) {
    const uid = decoded.uid; const now = this.now(); const a = String(b && b.action || '');
    if (a === 'bootstrap' || a === 'inbox') {
      const mine = await this.store.where(K.deliv, 'uid', uid);
      const msgs = {}; const items = [];
      for (const d of mine) {
        if (d.visibleFrom && d.visibleFrom > now) continue;
        if (d.expiresAt && d.expiresAt <= now) continue;
        const m = msgs[d.msgId] || (msgs[d.msgId] = await this.store.get(K.msgs, d.msgId));
        if (!m || m.status === 'archived') continue;
        if (!d.deliveredAt) { d.deliveredAt = now; await this.store.set(K.deliv, d.id, { ...d, deliveredAt: now }); }
        items.push({ id: d.msgId, subject: m.subject, body: m.body, link: m.link || null, priority: m.priority, sentAt: m.sentAt, from: 'ExamFlow', readAt: d.readAt || null, archivedAt: d.archivedAt || null });
      }
      items.sort((x, y) => y.sentAt - x.sentAt);
      const out = { inbox: items, unread: items.filter(i => !i.readAt && !i.archivedAt).length, serverTime: now };
      if (a === 'bootstrap') {
        const fu = await this.store.get('cpFeatureUsers', uid);
        out.features = fu && !fu.deleted ? { on: fu.on || {}, off: fu.off || {} } : null;
        const email = String(decoded.email || '').toLowerCase();
        const seat = this.owners.includes(email) ? { role: 'owner' } : (email ? await this.store.get('cpAdmins', email) : null);
        out.admin = !!(seat && (seat.role === 'owner' || seat.status === 'active') && decoded.email_verified === true);
      }
      return out;
    }
    if (a === 'read' || a === 'archive' || a === 'unarchive') {
      const d = await this.store.get(K.deliv, String(b.id || '') + '_' + uid); if (!d) bad('Message not found.', 404, 'not_found');
      const patch = a === 'read' ? { readAt: d.readAt || now } : a === 'archive' ? { archivedAt: now, readAt: d.readAt || now } : { archivedAt: null };
      await this.store.set(K.deliv, d.id, { ...d, ...patch });
      return { ok: true };
    }
    bad('Unknown action.', 404, 'unknown_action');
  }
};
module.exports = { methods, annState };
