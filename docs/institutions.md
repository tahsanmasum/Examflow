# Institutions, packages and licences (v47)

ExamFlow has two kinds of users, and their data never mixes:

| | Who | Where their exams, students and results are stored |
|---|---|---|
| **Cloud users** | Individual teachers on the public site | **Your Firebase project**, exactly as before. Nothing changed for them. |
| **Institutional users** | Teachers of a university or school you have set up | **The institution's own server and database** (SQLite on its disk). GHUM never receives them. |

Your Firebase project keeps only the *administration* of each institution: its name and permanent ID, its package (entitlements), the teacher roster (teacher ID + email), licence dates and history, install-package records, the registered server, the configuration it has applied, and an audit log. These live in Firestore collections whose names start with `cp`. Only the server functions can read them: `firestore.rules` denies the browser everything it does not list.

```
  Admin Monitor (owners + your admin team)
        │  Firebase ID token, checked on every request
        ▼
  /api/admin  ──── Firestore cp* collections (metadata only)
        │ builds + signs
        ▼
  install package .zip ── delivered by you ──►  Institution server (Docker / Node 22)
                                                  │  SQLite: exams, attempts, marks
  /api/inst   ◄──── signed check-in every few minutes ────┘
               ────► answer: licence status + configuration (features, limits,
                     roster, settings, announcements, messages), signed
```

The full Admin Monitor guide is in `docs/admin-monitor.md`.

---

## One-time setup on Vercel

1. **Signing key.** On your own computer, in the project folder: `node tools/make-signing-key.js`. Copy the private key into Vercel → Project → Settings → Environment Variables as `GHUM_SIGNING_PRIVATE_KEY`. Keep a private backup. Install packages and licence statements are signed with it; institution servers check the signature.
2. **Service account.** Firebase console → Project settings → Service accounts → *Generate new private key*. Paste the whole JSON into `FIREBASE_SERVICE_ACCOUNT`.
3. **`PUBLIC_BASE_URL`**: the https address of the site, for example `https://examflow-tahcreations.vercel.app`.
4. **`ADMIN_EMAILS`** (optional): the platform owners, comma-separated. Defaults to `examflow.live@gmail.com`. Keep it the same as `adminEmails()` in `firestore.rules`.
5. Redeploy.

Until these are set, the Admin Monitor says it can't open (and why). The rest of ExamFlow works normally.

---

## Creating an institution (Workflow A)

**Institution Management → + New institution** walks through:

1. **Institution** — name, contacts, technical contact. Deployment type: *Institution-hosted* (GHUM-managed hosting is shown as not available yet). ExamFlow gives it a permanent ID.
2. **Package** — Pilot, Starter, Standard, Professional, Enterprise, Custom or one of your own (see *Packages & Entitlements*), or decide later.
3. **Licence** — length (1, 2, 3, 4 or 6 months, 1 year (default), 2 years, a number of days or an end date), start date, grace days and the "Expiring Soon" warning. Or leave it for later.
4. **Review** — then *Create institution*.

It opens on the **Roster** tab. The **Overview** tab shows a readiness checklist, each item checked against real records: contacts, package, roster, licence, install package, server registered and reporting, configuration applied by the server, licence allows exams now.

---

## Licence controls

**Licence Management** lists every institution's licence; **Manage** opens the institution's **Licence** tab.

| Control | What it does |
|---|---|
| **Set validity** | When the licence is *Not set* or *Pending*. Choose the length and the start date. Expiry is calculated on the control plane's clock, in Bangladesh time (midnight Asia/Dhaka); months are calendar months. A preview shows the dates before you confirm. This is a manual administrative activation — no payment is involved, and who did it is recorded. |
| **Renew** | Extends from the current expiry, from today, or from a date you pick. Keeps the institution ID, the roster and every exam. Refuses a term shorter than the one in force. |
| **Grace period and warnings** | Grace days (0–30) after expiry during which new exams stay allowed (status *Grace Period*), and how many days before expiry it shows *Expiring Soon*. Defaults come from Global Settings → Licences. |
| **Suspend** | A pause (v46 called it *Block*). Needs a reason and the institution's name. Takes effect at the server's next check-in. |
| **Reactivate** | Needs an approval note. Returns to the status the dates give. |
| **Revoke** | Withdraws the licence. Needs the *licences.revoke* permission, a reason, typing REVOKE and a recent sign-in. Only someone with *licences.revoke* can reactivate it. |
| **History** | Every change: who, when, old and new dates, reason. |

Statuses: **Not set**, **Pending**, **Active**, **Expiring Soon**, **Grace Period**, **Expired**, **Suspended**, **Revoked**. The institution server also shows **Unverified** when it could not check in for longer than `OFFLINE_GRACE_DAYS` (7 by default).

**What Pending, Expired, Suspended, Revoked or Unverified do:** teachers cannot create, edit, duplicate, reopen or publish exams. Published exams still run; submitted attempts, grading, results and exports keep working. **Nothing is ever deleted**, and renewing or reactivating restores everything as it was.

Enforcement is on the institution server (its database rules refuse the writes), not only in the page. Licence statements are signed and carry a fresh value from the server's own request, so an old statement can't be replayed; the server's licence clock can't be moved forward by changing its system clock.

---

## Package (entitlements), features and limits

**Package & features** tab: the assigned package and version, its limits (teachers, exams open at once), and every feature with its effective state and what decided it (kill switch, package, institution override, global default). *Override…* forces one feature on or off for this institution with a reason; forcing on a feature the package doesn't include is an *approved exception* and needs *features.manage*.

Editing a package template creates a new version. Institutions keep their version until you *Apply* the new one to them, with a preview of what changes.

The institution's server enforces the features and limits it receives: it refuses an exam that uses a switched-off feature (`feature_off`) or would exceed the open-exam limit (`limit_active_exams`). The roster can't be saved larger than the package's teacher limit.

---

## Configuration sync (no new install package needed)

Feature switches, package limits, the roster, public settings (maintenance notice, exam defaults, reader file limits), announcements and dashboard messages for an institution travel in the **signed answer to its server's check-in**. The server applies them and reports the version it applied in its next check-in (it checks in again about 1.5 seconds after applying).

The Admin Monitor shows each change as **pending** until the server has reported it, then **applied** (with the time). If the server reports an error, it shows **failed** with the error. A server that is offline stays *pending*; it is never shown as updated.

---

## Install packages and server registration

**Install packages** tab: *Review & generate* builds a signed zip with the server, the app, the roster, GHUM's public key and the install guides. Download it, deliver it, *Mark delivered*. Its technical status (*Not installed*, *Installed*, *Installation failed*) comes only from the server's own check-ins. You need a new install package only for a fresh installation or new server software — not for roster or configuration changes.

**Server & sync** tab: a one-time registration code (valid 7 days); health from the server's own reports (Healthy, Degraded, Unknown, Offline, Not connected); the configuration sync state; server events. *Reset registration* lets a rebuilt server register again.

---

## What the institution's IT does

It is all in the package: `INSTALL.md`, `DATA.md`, `UPGRADE.md`, `CHECKLIST.md`, `TEACHER-ONBOARDING.md`. In short: check the signature, fill `.env`, `docker compose up -d`, register, give teachers their activation codes (or connect the institution's own sign-in).

**Server software is never updated remotely.** Upgrading the institution server means its IT installs a new install package (UPGRADE.md keeps the same database).

## Limitations, honestly

- The control plane's Firestore code was tested against an in-memory store that enforces Firestore's limits, not against a live Firestore project. Try one institution end to end after deploying.
- A server that is offline keeps its last signed status for the grace period; a suspension or configuration change reaches it only when it checks in.
- Whoever runs the institution server controls its disk. Signing proves the package came from GHUM and is unchanged; it can't stop the institution editing its own copy. The licence check is a business control, not DRM.
