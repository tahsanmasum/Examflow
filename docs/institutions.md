# Institutions, packages and licences (v46)

ExamFlow now has two kinds of users, and their data never mixes:

| | Who | Where their exams, students and results are stored |
|---|---|---|
| **Cloud users** | Individual teachers on the public site | **Your Firebase project**, exactly as before v46. Nothing changed for them. |
| **Institutional users** | Teachers of a university or school you have set up | **The institution's own server and database** (SQLite on its disk). GHUM never receives them. |

Your Firebase project keeps only the *administration* of each institution: its name and permanent ID, the teacher list (teacher ID + email), licence dates and history, package records, the registered server, and an audit log. These live in Firestore collections whose names start with `cp` (`cpInstitutions`, `cpAllowlists`, `cpPackages`, `cpLicenceEvents`, `cpRegCodes`, `cpServers`, `cpAudit`, `cpOps`). Only the server functions can read them: `firestore.rules` denies the browser everything it does not list, and v46 does not list them.

```
  Admin Monitor (examflow.live@gmail.com)
        │  Firebase ID token
        ▼
  /api/admin  ──── Firestore cp* collections (metadata only)
        │ builds + signs
        ▼
  package .zip  ──── delivered by you ────►  Institution server (Docker / Node 22)
                                               │  SQLite: exams, attempts, marks
                                               │
  /api/inst   ◄──── signed check-in every few minutes (licence status, package state)
```

---

## One-time setup on Vercel

1. **Signing key.** On your own computer, in the project folder:
   ```
   node tools/make-signing-key.js
   ```
   Copy the private key into Vercel → Project → Settings → Environment Variables as `GHUM_SIGNING_PRIVATE_KEY` (the multi-line PEM, or the one-line form it prints). Keep a private backup. Packages and licence statements are signed with it; institution servers check the signature.
2. **Service account.** Firebase console → Project settings → Service accounts → *Generate new private key*. Paste the whole JSON (or its base64) into `FIREBASE_SERVICE_ACCOUNT`.
3. **`PUBLIC_BASE_URL`**: the https address of the site, for example `https://examflow-tahcreations.vercel.app`. Institution servers call `PUBLIC_BASE_URL/api/inst` and download reading models from `PUBLIC_BASE_URL/tessdata/`.
4. **`ADMIN_EMAILS`** (optional): defaults to `examflow.live@gmail.com`. The admin must sign in with a verified email (Google sign-in is verified).
5. Redeploy. `package.json` makes Vercel install `firebase-admin` for the two functions; `vercel.json` ships the institution software (`api/_institution/`) with `/api/admin`. The static site is served as before.

Until these are set, the 🏛 Institutions tab says the control plane is not set up. The rest of ExamFlow works normally.

---

## Licence controls

Open **Admin Monitor → 🏛 Institutions → an institution → Licence**.

| Control | What it does |
|---|---|
| **Set validity** | Only when the licence is *Not set* or *Pending*. Choose 1 month, 2 months, 4 months, 1 year, 2 years, a custom number of days (1–1830) or a custom end date, and the activation date (today or a later date). Expiry is calculated on the control plane's clock, in Bangladesh time (midnight Asia/Dhaka); months are calendar months (31 Jan + 1 month = 28/29 Feb). A preview shows the dates before you confirm. |
| **Renew** | Extends from the current expiry, from today, or from a date you pick. Keeps the institution ID, the teacher list and every exam. Refuses "from the current expiry" once it has expired (use "from today"), and refuses a term shorter than the one in force. Requires typing the institution's name to confirm. |
| **Block** | Takes effect at the server's next check-in (within `LICENCE_CHECK_SECONDS`, 5 minutes by default). Requires a reason and the institution's name. |
| **Unblock** | Requires the reason for approval. Restores the status the dates give (Active, Expiring Soon, Expired). |
| **History** | Every set, renewal, block and unblock: who, when, old and new dates, reason. |

Statuses shown everywhere (dashboard, detail page, the institution's own app): **Not set**, **Pending** (activation date in the future), **Active**, **Expiring Soon** (30 days or fewer), **Expired**, **Blocked**. The institution server also shows **Unverified** when it could not check in for longer than `OFFLINE_GRACE_DAYS` (7 by default).

**What a Pending, Expired, Blocked or Unverified licence does** (as you chose: "No new exams"): teachers cannot create, edit, duplicate, reopen or publish exams. Exams already published still run; submitted attempts, grading, results and exports keep working. **Nothing is ever deleted** by expiry or blocking, and renewing or unblocking restores everything as it was.

Enforcement is on the institution server (its database rules refuse the writes), not only in the page. Licence statements are signed by GHUM and carry a fresh random value from the server's own request, so an old statement cannot be replayed. The server's time for licence purposes comes from the signed statement plus its own monotonic clock, so moving its system clock does not extend a licence.

There is no payment gateway and no automatic updater: every change is made by you, by hand, and recorded in the audit log.

---

## Packages

**Teachers** tab: add teachers one by one or import a CSV with the header `teacher_id,email` (optional `name`). Problems are listed by row (missing, malformed, duplicate ID, duplicate email) and can be fixed in place before saving. Replace or merge, then confirm with the institution's name. Up to 3,000 teachers.

**Packages** tab: *Review and generate* builds `examflow-<institution>-1.N.0.zip`, signed, containing the server, the app, the teacher list, GHUM's public key and the install guides. The previous package becomes *Superseded*. Download it, deliver it to the institution's IT (email, drive, USB), then *Mark delivered*. Its technical status (*Not installed*, *Installed*, *Installation failed*) comes only from the server's own check-ins — never assumed.

*Revoke* stops a package: the server pauses new exams until a newer package is installed.

**Server** tab: a registration code (valid 7 days) for the institution's IT to run `node server/src/cli.js register --code …`. One active server per institution; *Reset* lets a rebuilt server register again.

**Activity** tab: the audit log of everything above.

---

## What the institution's IT does

It is all in the package: `INSTALL.md`, `DATA.md`, `UPGRADE.md`, `CHECKLIST.md`, `TEACHER-ONBOARDING.md`. In short: check the signature, fill `.env`, `docker compose up -d`, register, give teachers their activation codes (or connect the institution's own sign-in).

## Limitations, honestly

- The control plane's Firestore code was tested against an in-memory store that enforces Firestore's rules (reads before writes in transactions, no nested arrays, 1 MiB documents), not against a live Firestore project. Try one institution end to end after deploying.
- A server that is offline keeps its last signed status for the grace period; a block reaches it only when it checks in.
- Whoever runs the institution server controls its disk. Signing proves the package came from GHUM and is unchanged; it cannot stop the institution editing its own copy of the software. The licence check is a business control, not DRM.
