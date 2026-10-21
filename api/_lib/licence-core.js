'use strict';
/* Licence arithmetic and status. Shared by the GHUM control plane (which owns
   the trusted clock) and the institution server (which enforces the result).

   Time-zone policy: licence dates are calendar dates in Asia/Dhaka (UTC+06:00,
   no daylight saving). A licence that activates on 2026-11-01 starts at
   00:00 Dhaka time that day. Its expiry is the same instant after the chosen
   duration: 1 year from 2026-11-01 expires at 2027-11-01 00:00 Dhaka, so the
   last full day of use is 2027-10-31. All instants are stored as UTC
   milliseconds. */

const TZ_OFFSET_MS = 6 * 3600 * 1000;
const DAY = 86400000;
const WARN_DAYS_DEFAULT = 30;

const DURATIONS = {
  '1m': { months: 1, label: '1 month' },
  '2m': { months: 2, label: '2 months' },
  '3m': { months: 3, label: '3 months' },
  '4m': { months: 4, label: '4 months' },
  '6m': { months: 6, label: '6 months' },
  '1y': { months: 12, label: '1 year' },
  '2y': { months: 24, label: '2 years' }
};
const DEFAULT_DURATION = '1y';
const WARN_SCHEDULE_DEFAULT = [30, 7, 1];
/* Status names, in the order they win. */
const STATUSES = ['Revoked', 'Suspended', 'Not set', 'Pending', 'Grace Period', 'Expired', 'Expiring Soon', 'Active'];

/** 'YYYY-MM-DD' → UTC ms of 00:00 Asia/Dhaka on that date. */
function dhakaDateToMs(s) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(s || ''));
  if (!m) return NaN;
  const y = +m[1], mo = +m[2], d = +m[3];
  const t = Date.UTC(y, mo - 1, d);
  const back = new Date(t);
  if (back.getUTCFullYear() !== y || back.getUTCMonth() !== mo - 1 || back.getUTCDate() !== d) return NaN;
  return t - TZ_OFFSET_MS;
}
/** UTC ms → 'YYYY-MM-DD' in Asia/Dhaka. */
function msToDhakaDate(ms) {
  const d = new Date(ms + TZ_OFFSET_MS);
  return d.getUTCFullYear() + '-' + String(d.getUTCMonth() + 1).padStart(2, '0') + '-' + String(d.getUTCDate()).padStart(2, '0');
}
/** Start of today in Dhaka, as UTC ms. */
function dhakaToday(nowMs) { return dhakaDateToMs(msToDhakaDate(nowMs)); }

/** Add calendar months in Dhaka time; a day that doesn't exist (31 Jan + 1 month) clamps to the month's last day. */
function addMonths(ms, months) {
  const d = new Date(ms + TZ_OFFSET_MS);
  const y = d.getUTCFullYear(), m = d.getUTCMonth(), day = d.getUTCDate();
  const target = new Date(Date.UTC(y, m + months, 1));
  const last = new Date(Date.UTC(target.getUTCFullYear(), target.getUTCMonth() + 1, 0)).getUTCDate();
  const out = Date.UTC(target.getUTCFullYear(), target.getUTCMonth(), Math.min(day, last),
    d.getUTCHours(), d.getUTCMinutes(), d.getUTCSeconds(), d.getUTCMilliseconds());
  return out - TZ_OFFSET_MS;
}

/**
 * Work out a licence term.
 * duration: { kind: '1m'|'2m'|'4m'|'1y'|'2y' } | { kind: 'days', days: N } | { kind: 'until', date: 'YYYY-MM-DD' }
 * startMs: UTC ms the term starts.
 * Returns { ok, activatesAt, expiresAt, label } or { ok:false, error }.
 */
function computeTerm(duration, startMs) {
  if (!Number.isFinite(startMs)) return { ok: false, error: 'The activation date is not a valid date.' };
  const k = duration && duration.kind;
  if (DURATIONS[k]) return { ok: true, activatesAt: startMs, expiresAt: addMonths(startMs, DURATIONS[k].months), label: DURATIONS[k].label, duration: { kind: k } };
  if (k === 'days') {
    const n = Number(duration.days);
    if (!Number.isInteger(n) || n < 1 || n > 1830) return { ok: false, error: 'A custom length must be a whole number of days from 1 to 1830 (about 5 years).' };
    return { ok: true, activatesAt: startMs, expiresAt: startMs + n * DAY, label: n + (n === 1 ? ' day' : ' days'), duration: { kind: 'days', days: n } };
  }
  if (k === 'until') {
    const end = dhakaDateToMs(duration.date);
    if (!Number.isFinite(end)) return { ok: false, error: 'The expiry date is not a valid date.' };
    if (end <= startMs) return { ok: false, error: 'The expiry date must be after the activation date.' };
    if (end - startMs > 1830 * DAY) return { ok: false, error: 'A licence can last at most about 5 years.' };
    return { ok: true, activatesAt: startMs, expiresAt: end, label: 'until ' + duration.date, duration: { kind: 'until', date: duration.date } };
  }
  return { ok: false, error: 'Choose a licence length.' };
}

/**
 * The licence status at time nowMs. lic: { activatesAt, expiresAt, suspended|blocked, revoked, graceDays } or null.
 * Returns { status, remainingDays, canCreateExams, graceEndsAt? }.
 *   Revoked        withdrawn by an administrator; only a reactivation brings it back
 *   Suspended      paused by an administrator (v46 called this "Blocked")
 *   Not set        no licence has been configured yet
 *   Pending        configured, but the activation date is still ahead
 *   Active         in its term
 *   Expiring Soon  in its term, with warnDays or fewer left
 *   Grace Period   the term has ended, but the agreed grace days have not (new exams still allowed)
 *   Expired        the term and any grace period have ended
 * Only Active, Expiring Soon and Grace Period allow new exams. No status ever deletes data.
 */
function licenceStatus(lic, nowMs, warnDays = WARN_DAYS_DEFAULT) {
  const suspended = !!(lic && (lic.suspended || lic.blocked));
  const revoked = !!(lic && lic.revoked);
  if (!lic || !Number.isFinite(lic.activatesAt) || !Number.isFinite(lic.expiresAt)) {
    return { status: revoked ? 'Revoked' : suspended ? 'Suspended' : 'Not set', remainingDays: null, canCreateExams: false };
  }
  const remainingDays = Math.max(0, Math.ceil((lic.expiresAt - nowMs) / DAY));
  if (revoked) return { status: 'Revoked', remainingDays, canCreateExams: false };
  if (suspended) return { status: 'Suspended', remainingDays, canCreateExams: false };
  if (nowMs < lic.activatesAt) return { status: 'Pending', remainingDays, startsInDays: Math.ceil((lic.activatesAt - nowMs) / DAY), canCreateExams: false };
  if (nowMs >= lic.expiresAt) {
    const g = Math.max(0, Math.min(90, Math.floor(Number(lic.graceDays) || 0)));
    const graceEndsAt = lic.expiresAt + g * DAY;
    if (g && nowMs < graceEndsAt) return { status: 'Grace Period', remainingDays: 0, graceDaysLeft: Math.ceil((graceEndsAt - nowMs) / DAY), graceEndsAt, canCreateExams: true };
    return { status: 'Expired', remainingDays: 0, canCreateExams: false };
  }
  const wd = Number.isFinite(lic.warnDays) ? lic.warnDays : warnDays;
  if (remainingDays <= wd) return { status: 'Expiring Soon', remainingDays, canCreateExams: true };
  return { status: 'Active', remainingDays, canCreateExams: true };
}

module.exports = { DURATIONS, DEFAULT_DURATION, WARN_SCHEDULE_DEFAULT, STATUSES, DAY, TZ_OFFSET_MS, WARN_DAYS_DEFAULT, dhakaDateToMs, msToDhakaDate, dhakaToday, addMonths, computeTerm, licenceStatus };
