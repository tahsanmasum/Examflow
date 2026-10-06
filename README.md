# ExamFlow

ExamFlow is a browser-based exam platform for teachers. Build an MCQ, written, or combined exam, share it by link or QR code, watch students take it live (optionally through their own cameras), grade, and export the results. Students never need an account.

**Live:** https://examflow-tahcreations.vercel.app
**Built by:** TahCreations

---

## What's in this repository

| File | Purpose |
|---|---|
| `index.html` | The entire app: markup, styles and scripts in one file. No build step. |
| `firestore.rules` | Cloud Firestore security rules. |
| `database.rules.json` | Realtime Database rules. The app doesn't use Realtime Database, so these deny everything. |
| `firebase.json`, `.firebaserc` | Let the Firebase CLI deploy both rule files to project `examflow-195df`. |
| `.gitignore` | Keeps macOS, Firebase CLI and Vercel CLI files out of the repo. |

---

## Features

### For teachers

- **Three exam types:** MCQ, written, and combined (an MCQ section followed by a timed written section). Either section of a combined exam may be left empty.
- **Questions your way:** add them by hand or import a CSV. A built-in prompt turns any question file into the right CSV format with ChatGPT.
- **Marks per MCQ:** set how many marks each MCQ is worth; scores and percentages use it.
- **Optional student list,** so students pick their name from a list instead of typing it. A name can only be used once per exam.
- **Scheduling:** every exam has an opening time, a closing time (which must be after the opening time) and a duration, or no timer at all. Ended exams can be reopened with a new window.
- **Drafts, edits and sections:** save drafts, edit a live exam at any time (students get the change instantly), group exams into sections, and restore deleted exams from the trash.
- **Share** with a link or a QR code.
- **Camera monitoring (optional, per exam):** turn it on when creating or editing an exam, and tick what students may keep on the desk (calculator, rough paper, books, phone, another screen). See [Camera monitoring](#camera-monitoring).
- **Live monitor:** progress per student, submissions, flagged students, search, sort, filters, and a score distribution. Each student's **violations** button opens a window with only that student's violations, including camera alerts and snapshots.
- **Written grading** with a red-pen annotation layer on photographed answers. In a combined exam, the MCQ marks stay in the total when you grade the written part. If a save fails, you're told instead of seeing "Marks saved".
- **Exports:** results as CSV (spreadsheet formulas in student-typed names are neutralised), answers as PDF.
- **Review link:** after grading, each student can see only their own script by entering their roll number and the one-time password they set.
- Teacher and student manuals, plus an in-app feedback form.

### For students

- No account, no install. Open the link, read the exam rules, enter your details, start.
- **Anti-cheat monitoring:** leaving full screen, switching tabs or windows, copy, cut, paste, right-click, blocked shortcuts, screenshot attempts and leaving the page are all logged with a timestamp and shown to the teacher live.
- **Camera monitoring,** when the teacher turns it on. The rules (what's allowed and what isn't) are shown before the exam starts, and the camera is analysed on the student's own device; video is never uploaded.
- **Safe to refresh:** if the page reloads mid-exam, the student comes back to the same questions in the same (shuffled) order, with their answers, name and roll intact, and the clock keeps running from the original start, so a refresh can't reset the timer.
- **Device switching:** progress is saved as the student works. If a device fails, **Switch device** resumes the same unsubmitted attempt elsewhere with a code and the student's one-time password.
- **Photos of handwritten work** can be attached to written answers. Photos are compressed in the browser (a 12-megapixel phone photo becomes roughly 100–250 KB), and each attempt holds about 700 KB of photos: the first ones stay sharp, later ones get smaller, and the student is told when the limit is reached.
- One submission per browser, and no new starts after the exam window closes. If a submission can't reach the teacher, the student is told to keep the page open.

### Admin Monitor (owner only)

Available from the avatar menu → **Admin Monitor** when signed in with the admin email.

- **Overview:** teachers, exams, attempts in progress, submissions, flags, feedback.
- **Teachers:** every teacher with institution, activity status, exams in the last 30 and 90 days, student count, last activity and join date.
  - Status: **Active** (used in the last 14 days), **Cooling** (15–30 days), **Dormant** (31–60), **Churned** (over 60), **Never used**.
  - **Drop-off** marks teachers who ran 3–6 exams and then went quiet for over 30 days. They're sorted to the top.
  - **View dashboard** opens that teacher's dashboard, read-only (see below).
- **Exams:** every exam with its owner, status and attempts. Open its sessions, open the owner's dashboard, or delete it.
- **Live & sessions** and the **Feedback** inbox.

---

## Camera monitoring

Teachers can turn on each student's own camera for an exam. Detection runs entirely in the student's browser; video is never uploaded or recorded. The teacher receives alerts, each with a small snapshot.

### Turning it on

- **Create exam** (MCQ, Written, MCQ + Written) and **Edit exam** have a **📷 Camera monitoring** switch, off by default.
- When it's on, tick what students may keep on the desk:

| Allowed item | Effect when ticked |
|---|---|
| Calculator | Calculators get no alert. A device that could be a phone still does. |
| Rough paper and notes | Paper, notes and looking down are not flagged. |
| Books | Books are not flagged (open-book exam). |
| Phone | Phones are not flagged. |
| Another laptop, tablet or TV | Extra screens are not flagged. |

- Another person, talking, leaving the seat and covering the camera are always flagged.
- In written exams, and in the written part of a combined exam, paper is always allowed, because students write answers on paper and upload a photo.
- The **Live Monitor** has the same switch and checkboxes. Changes reach students already in the exam instantly.

### What it detects

| Alert | Severity |
|---|---|
| No one at the screen | High |
| Face not visible | Medium |
| More than one person | High |
| Different person in front of the camera | High |
| Phone visible | High |
| Calculator visible (when not allowed) | High |
| Handheld device, could be a phone (when calculators are allowed) | Medium |
| Book visible | High |
| Notes or paper visible | High |
| Holding something up to the camera | High |
| Another screen visible | Medium |
| Looking away from the screen (head turned 1.5 s) | Medium |
| Repeated head turning (3 turns in 30 s) | Medium |
| Looking down, away from the screen (2 s) | Medium |
| Repeated talking (3 times in 60 s) | Medium |
| Camera covered or too dark | High |
| Camera stopped | High |
| Blocked camera access / No camera available | High / Medium |

High and medium alerts go into the student's violation log and flag the student, exactly like a tab switch, so they're included in the violation count, the "Most violations" sort and the CSV export. Minor notes (talking once, a few side glances) are kept as snapshots only.

### What the student sees

1. On **Read before you begin**, a camera box lists what's allowed and what isn't.
2. **I understand** asks for the camera before the details form, so it doesn't use exam time. If access is blocked, the student is told how to fix it; after a second refusal, or with no camera, they can continue and the teacher is notified.
3. The exam starts with a 2-second calibration (sit normally and look at the screen).
4. A small camera preview sits in a corner. It can be dragged to any corner and tapped to shrink, and it turns amber with "Look at the screen" before any alert is sent. Alerts appear in the exam's red banner.

### Where the teacher sees violations

Violations are shown per student, never in one combined feed.

1. Live Monitor → the student's **violations** button in the results table (for example `3 violations ›`), or their row in the **Flagged students** list.
2. A window opens with only that student's violations, newest first: what happened, the time, the question number, and the camera snapshot (tap to enlarge).
3. Tabs: **All**, **Camera**, **Browser** (tab switches, copy, paste and the other existing checks) and **Camera notes**.

### How it works

- Three Web Workers keep the exam page smooth:
  - **Face:** MediaPipe Face Landmarker. Face count, 3D head angle, looking down, mouth movement, eye glances.
  - **Objects:** EfficientDet-Lite0 (phone, book, laptop, TV), Hand Landmarker with a zoomed pass around the hands, a phone-vs-calculator check, and a paper and handwriting detector.
  - **Identity:** face-api.js, checking every 2 seconds that it's still the same student.
- Calibration records the student's straight-ahead position, closed mouth, face, and the empty background, so walls, posters, a bookshelf or a TV behind the student aren't flagged.
- Models start loading on *Read before you begin*. Students download about 30 MB once; the browser caches it.
- No paid APIs or keys: the models are open source (MediaPipe: Apache 2.0, face-api.js: MIT) and load from public CDNs.
- The camera needs HTTPS (Vercel provides it) or `localhost`.

---

## Admin: viewing a teacher's dashboard

1. Sign in to ExamFlow with the admin email.
2. Open the avatar menu → **Admin Monitor** → **Teachers**.
3. Click **View dashboard** on any teacher (or **Teacher dashboard** on a row in the Exams tab).

You see their dashboard as they see it: their exams, stats, sections and trash, and each exam's monitor with student results, violation logs and written answers. A bar at the bottom of the screen shows whose dashboard is open; **Exit to Admin** takes you back.

Nothing you do in that view can change their account. Creating, editing, deleting, restoring, publishing, reopening and ending exams are disabled, as are saving marks, changing camera settings, sending feedback and signing out. **Preview** becomes a read-only question sheet, because a real preview runs an exam session that would write into their exam.

How the lock works: every write path in the app checks whether a teacher view is open, and a safety net wraps the Firestore SDK so any write that slips past those checks is refused before it leaves the browser. The teacher's data is loaded fresh from Firestore each time, using the same queries their own dashboard runs. Sections are rebuilt from their exams, because each teacher's sections are saved in their own browser.

---

## How it's built

- **One static file.** `index.html` holds everything. There is no server of its own and no build step.
- **Firebase** (compat SDK 10.7.1): Authentication (email/password and Google; Google sign-in uses a redirect on phones) and Cloud Firestore.
- **Libraries from CDNs:** GSAP 3.12.5, three.js 0.160 (landing page animation), and some that load only when needed: jsPDF 2.5.1, qrcodejs 1.0.0, and, for camera exams only, MediaPipe Tasks Vision 0.10.14 and face-api.js 1.7.15 (`@vladmandic/face-api`).
- **Hosting:** Vercel, as a static site.

### Data

| Where | What it holds | Written by |
|---|---|---|
| `teachers/{uid}` | Teacher profile | The teacher, at sign-up |
| `exams/{token}` | Exam definition, keyed by its share token. Camera exams add `camMon` (on/off and allowed items). | The teacher who owns it |
| `sessions/{id}` | One student attempt. Camera exams add `CAMERA_*` violations, `camShots` (up to 12 snapshots, 128×96) and `camStatus`. | The student's browser; the owning teacher when grading |
| `feedback/{id}` | Feedback form entries | Anyone |
| `meta/stats` | Visit counter (no personal data) | Any visitor |

Exam sections are stored in each teacher's browser (localStorage), not in Firestore. The browser cache never blocks the app: if it fills up, the cache is saved without photos (Firestore still has them) and exams keep working.

---

## Run your own copy

1. **Create a Firebase project.** Enable Authentication → Sign-in method → **Email/Password** and **Google**. Create a **Cloud Firestore** database. (Realtime Database isn't needed.)
2. **Authorize your domain.** Authentication → Settings → Authorized domains → add the domain you'll host on (for example `your-app.vercel.app`). Google sign-in fails on domains that aren't listed.
3. **Point the app at your project.** In `index.html`, replace the config inside `firebase.initializeApp({...})` with your project's web config.
4. **Set the admin.** Change `const ADMIN_EMAILS` in `index.html` and `adminEmails()` in `firestore.rules`. They must match.
5. **Publish the rules** (next section).
6. **Deploy on Vercel.** Import this repository → Framework preset **Other** → no build command → output directory is the repository root. Every push to `main` redeploys.

---

## Publishing the security rules

**Firebase Console (no install):**

- Firestore Database → **Rules** → replace everything with `firestore.rules` → **Publish**.
- Realtime Database → **Rules** → replace everything with `database.rules.json` → **Publish**. (Only if the project has a Realtime Database; it locks it.)

**Firebase CLI:**

```bash
npm install -g firebase-tools
firebase login
firebase deploy --only firestore:rules,database
```

---

## Security model

- **Students never sign in.** Single-exam reads and the `sessions` collection stay open so signed-out browsers can take, resume and review exams. Listing exams is limited to the owner and the admin.
- **Everything is computed in the student's browser,** including the MCQ score, and the exam document, answer key included, reaches that browser. There is no server to hide it behind; keep that in mind for high-stakes exams.
- **Submitted attempts are locked.** Once submitted, only the teacher who owns the exam or the admin can change an attempt. Any other account, and any signed-out browser, is refused.
- **Teachers only touch their own data:** they can read, edit and delete their own exams, and can't reassign an exam to another account.
- **Admin rights come from the email** in `adminEmails()`. Keep that account's sign-in secure.
- **Student-supplied text is always shown as text.** Names, scores, violation labels and photo data can't inject markup or scripts into the teacher's monitor, the grading screen, or the Admin Monitor.
- **The read-only teacher view is enforced in the app,** not by the rules. The rules keep the admin's delete powers for the Admin Monitor.
- **Realtime Database is fully locked,** since nothing uses it.
- **Camera video stays on the student's device.** Frames are analysed in the browser and discarded. Only alerts and up to 12 small snapshots per attempt are saved.
- **Camera snapshots follow the same open-read rule as the rest of an attempt.** `sessions` is readable without signing in (students need that to resume and review), so anyone querying Firestore directly can read the snapshots too. Turn camera monitoring on only when you need it.
- **No rule changes are needed for camera monitoring:** `camMon` is an exam field written by its owner, and the camera fields on an attempt are written before submission.

---

## Changelog

Full version comparison and the reason for every change: [`CHANGELOG.md`](CHANGELOG.md).

- **v39:**
  - Camera monitoring: teacher switch in Create exam, Edit exam and the Live Monitor; allowed items (calculator, rough paper, books, phone, other screens); detection of phones, books, notes, another person, a different person, talking, head turning and looking away or down, all on the student's device.
  - Live Monitor: each student's violations open in their own window with camera snapshots; the combined violation log became a Flagged students list.


- **v38 (based on v33, Grade Vision AI removed):**
  - Admin Monitor: teacher activity status, drop-off flag, read-only view of any teacher's dashboard.
  - Fixed: phone photos were stored uncompressed, so a single photo pushed the attempt past Firestore's 1 MiB limit and the whole submission was lost.
  - Fixed: a full browser storage stopped submissions before they reached Firestore and broke the teacher's monitor.
  - Fixed: refreshing mid-exam replaced the student's name and roll with "Student", re-shuffled the questions so saved answers landed on the wrong ones, and repeated refreshes added time.
  - Fixed: marks per MCQ were ignored in scores; grading a combined exam dropped its MCQ marks; combined exams with one empty section crashed or never saved.
  - Fixed: resume codes could reopen submitted attempts; exams could be created closing before they open; grading re-saved answer keys as `qq0`.
  - Fixed: stored cross-site scripting through student-writable fields, a malformed feedback entry crashing the Admin Monitor, blank zero scores and formula injection in CSV exports, and silent save failures.
  - Rules: submitted attempts editable only by the exam's owner or the admin; list rules Firestore can prove against each query; feedback fields type-checked; legacy empty-owner exception removed; Grade Vision collections closed; Realtime Database locked.
- **v33:** base version.

---

## Contact

TahCreations · hellotahcreations@gmail.com
