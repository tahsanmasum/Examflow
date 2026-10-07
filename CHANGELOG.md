# ExamFlow changelog

What changed in each version, and why. Newest first.

- **v39** (current): v38 plus camera monitoring, the per-student violations window, an 85% desktop display scale and SEO.
- **v38**: v33 plus the admin teacher-dashboard view, every bug fix from the audit, and new security rules. Grade Vision AI is not included.
- **v36**: v33 plus Grade Vision AI and emailed graded scripts.
- **v33**: the version before Grade Vision AI. v38 is built on it.

---

## v39: camera monitoring

| | v38 | v39 (current) |
|---|---|---|
| Built on | v33 | v38 |
| File size | 5,406 lines · 584 KB | 7,116 lines · 685 KB |
| Lines | | 1,723 added · 59 changed · 13 removed |
| Firebase services used | Auth, Firestore | Auth, Firestore (no new services) |
| Security rules | | Unchanged (comments added describing the new fields) |
| Paid APIs or keys | None | None |

<details open>
<summary><b>Added: camera monitoring</b></summary>

<br>

- **Teacher switch** in Create exam (MCQ, Written, MCQ + Written), Edit exam and the Live Monitor. Off by default. Saved on the exam as `camMon`.
- **Allowed items** the teacher ticks: calculator, rough paper and notes, books, phone, another laptop, tablet or TV. Another person, talking, leaving the seat and covering the camera are always flagged.
- **Live rule changes:** students already in the exam receive changes instantly through a listener on the exam document, with a short notice.
- **Student rules** on *Read before you begin*: what's allowed and not allowed. The camera is requested before the details form, so it never costs exam time. A blocked or missing camera is explained; after a second refusal, or with no camera, the student may continue and the teacher is notified (`CAMERA_ACCESS_DENIED` / `CAMERA_NOT_AVAILABLE`).
- **Detection, all on the student's device** in three Web Workers:
  - Face: MediaPipe Face Landmarker. Face count, 3D head pose from the face transform, a looking-down signal, mouth movement for talking, eye glances.
  - Objects: EfficientDet-Lite0 (phone, book, laptop, TV), Hand Landmarker, a second detection pass zoomed around the hands, a phone-vs-calculator classifier (EfficientNet-Lite0 plus a key-grid pattern check), and a paper and handwriting detector that learns the background during calibration.
  - Identity: face-api.js face descriptors, checked every 2 seconds and right after the face reappears or the tab regains focus.
- **Alerts** use the existing `logViol()`, so they appear in the violation count, flag the student, sort under "Most violations" and export to CSV like any other violation. Each alert saves a 128×96 snapshot (`camShots`, last 12 kept).
- **Student preview:** a small camera window in a corner. It can be dragged to any corner (the position is remembered) and tapped to shrink. It turns amber with "Look at the screen" before an alert is sent.
- **Written answers:** paper is always allowed in written exams and in the written part of a combined exam, because students photograph handwritten answers.
- **Combined exams:** the camera stays on between the MCQ and written parts, and switches off after submission.

</details>

<details>
<summary><b>Accuracy and speed decisions</b></summary>

<br>

- Head turn: 20° from the calibrated position for 0.25 s counts as a turn; 1.5 s raises *Looking away*; 3 turns within 30 s raise *Repeated head turning*. Shorter twitches are ignored.
- The straight-ahead angle slowly follows posture changes while the student is settled, so leaning back is not a turn.
- Looking down for 2 s raises *Looking down*, unless rough paper or a calculator is allowed.
- *Face not visible* waits 4 s instead of 1.5 s when rough paper or a calculator is allowed.
- A second face triggers after 0.5 s; a second body without a face must stay for 1 s more, so posters and reflections don't count.
- Books on a shelf or a TV behind the student that were visible during calibration are ignored unless the student touches them.
- An alert that stays on, such as a phone left in view, is reported again every 45 s with a new snapshot.
- Frames are passed to the workers as zero-copy `VideoFrame`s (with an `ImageBitmap` fallback). Each model is warmed up while loading, and timed on the GPU and the CPU so it keeps whichever is faster on that device. The check rate adapts to each device; without worker support it falls back to the main thread at a lower rate so the exam stays smooth.
- Calibration never waits forever: if no single face is seen in 8 s, monitoring starts anyway and learns the head and mouth baseline once the face appears.
- Models start downloading on *Read before you begin*. Students download about 30 MB once; the browser caches it.

</details>

<details>
<summary><b>Changed: Live Monitor</b></summary>

<br>

- Each student's **violations badge is now a button**. It opens a window with only that student's violations, newest first, with readable labels, times, question numbers and camera snapshots (tap to enlarge). Tabs: All, Camera, Browser, Camera notes. The window updates live.
- The sidebar's combined **Violation log** is now a **Flagged students** list: one row per student with their count and latest violation. A row opens that student's window.
- A **📷 Camera monitoring** card under the stats shows the switch, allowed items, cameras on, blocked cameras and the total of camera alerts. It doesn't list individual alerts.
- Violation labels moved into one shared function, `_violLabel()`, used by the sidebar and the student window.

</details>

<details>
<summary><b>Changed: display scale</b></summary>

<br>

- On screens 1100 px and wider, the whole site renders at 85% (like browser zoom at 85%). Phones and tablets stay at 100%; browsers without CSS `zoom` show 100%.
- Full-screen sections, the 3D background and modal heights are compensated, so they still fill the screen.
- The red-pen grading canvas and the camera preview drag map the pointer correctly at any scale.

</details>

<details>
<summary><b>Added: SEO</b></summary>

<br>

- Title shortened to fit search results (55 characters), description to 151 characters, expanded keywords (including Bangla terms).
- Inline SVG favicon (there was none).
- `hreflang`, sitemap link, `og:image:type`, `twitter:image:alt`; duplicate theme-color and mobile meta tags removed.
- The three JSON-LD blocks merged into one connected graph: WebSite, WebPage, Organization (with founder), SoftwareApplication, FAQPage.
- A screen-reader-only keyword phrase in the hero heading (no visual change), alt text on images, and a `<noscript>` summary for crawlers that don't run JavaScript.
- New `robots.txt` and `sitemap.xml`.

</details>

<details>
<summary><b>Fixed during the camera work</b></summary>

<br>

- The camera setting could only be turned on from the Live Monitor, so teachers didn't find it. It's now in Create exam and Edit exam.
- Old long links (`?ed=`) dropped the camera setting. The student page now fetches the latest setting from Firestore before starting.
- Written exams would have flagged answer paper as notes. Paper is now allowed whenever written answers are expected.
- The camera setting write now carries `teacherUid`, so it passes the rules even if it reaches Firestore before the exam document.
- No camera-status write is attempted after submission, when the rules lock the attempt.
- In the admin's read-only teacher view, the camera switch is refused like every other write.
- With no face in view at the start, calibration waited forever and nothing was flagged. It now starts after 8 s.
- On machines with only a software GPU, detection ran several seconds per frame. Each model now uses the faster of GPU and CPU.
- If the camera script finished loading after the rules page or a resumed exam was already on screen, the camera never started. It now picks up from there.
- The Flagged students list overflowed on long alert names; rows now wrap.
- On phones, the expanded camera preview could sit on top of **Next**. The end of the exam page now has room to scroll the buttons above it.
- **Existing bug:** on phones, the red warning banner (tab switch, right-click and camera alerts) went off screen once the student had scrolled, because the exam page's `content-visibility` made it the banner's containing block. The exam pages now opt out, so the banner stays at the top.

</details>

<details>
<summary><b>Known limitations</b></summary>

<br>

- **Snapshots are readable like the rest of an attempt.** `sessions` reads are open by design (signed-out students must resume and review). Planned: move snapshots to a collection only the exam's teacher can read.
- The camera can't see what is outside its view, such as notes flat on the desk below the screen or a phone held above the laptop.
- Coloured sticky notes and blank paper are not treated as notes; the detector looks for white or grey paper with writing.
- Chewing can look like talking.
- The exam answer key still reaches the student's browser (unchanged from v38).

</details>

### Tests run for v39

**Final build, in real Chromium** (fake camera, the real MediaPipe and face-api.js models running in Web Workers, Firestore replaced by an in-memory stand-in): **37 of 37 checks passed.**

| Area | Checks |
|---|---|
| Teacher: 85% scale, Create exam camera switch, saving `camMon` with `teacherUid`, Edit exam load and save, Live Monitor card, violations button on every row, one student's window (newest first, with snapshots), Flagged students wrapping, admin read-only refusal | 16 |
| Normal exam (camera off): no camera box, details form, exam page, tab switch / right-click / copy logged, flagged overlay, no preview, submit | 8 |
| Camera exam: camera box, details form, exam page, anti-cheat still logged, **real detection flags an empty camera** (*No one at the screen*), status and snapshot saved, room for the preview on phones, banner visible after scrolling, all three detectors in workers, submit, camera off after submitting | 13 |

**Earlier builds** were also checked in a simulated browser (create and edit, monitor, student flow, anti-cheat with camera on and off, head-turn logic frame by frame, head-pose math, notes and phone-vs-calculator patterns): 96 checks.

Not covered: every real-world camera, lighting and phone model. Run a 2-minute test exam on a real phone and laptop before a real one.

---

# Earlier versions

- **v33**: the version before Grade Vision AI. v38 is built on it.
- **v36**: v33 plus Grade Vision AI and emailed graded scripts.
- **v38**: v33 plus the admin teacher-dashboard view, every bug fix from the audit, and new security rules. Grade Vision AI is not included.

---

## Version comparison

| | v33 | v36 | v38 |
|---|---|---|---|
| Built on | — | v33 | v33 |
| File size | 5,063 lines · 559 KB | 6,835 lines · 656 KB | 5,405 lines · 583 KB |
| Firebase services used | Auth, Firestore | Auth, Firestore, Realtime Database | Auth, Firestore |
| Grade Vision AI | No | Yes, but broken: its model, `gemini-2.0-flash`, was shut down on 1 June 2026 | No (removed) |
| Emailing graded scripts to students | No | Built, but never worked: the EmailJS keys were placeholders | No |
| Admin Monitor: overview, exams, live sessions, feedback | Yes | Yes | Yes |
| Admin: teacher activity status and drop-off flag | No | No | Yes |
| Admin: open any teacher's dashboard, read-only | No | No | Yes |
| Written answers with phone photos | Submission lost: one photo exceeds Firestore's 1 MB limit | Same bug | Fixed: photos compressed, about 7 per attempt |
| Browser storage full at submit | Submission never saved | Same bug | Fixed |
| Refresh mid-exam | Student renamed "Student"; shuffled answers land on wrong questions; extra time | Same bugs | Fixed |
| Marks per MCQ | Ignored (a perfect 2-mark paper shows 50%) | Same bug | Fixed |
| Grading a combined exam | MCQ marks dropped from the total | Same bug | Fixed |
| Combined exam with one empty section | MCQ-only never saves; written-only crashes | Same bugs | Fixed |
| Student-typed data in teacher/admin screens | Can inject scripts | Same bug | Fixed: always shown as text |
| Failed saves (grading, submission) | Silent | Silent | User is warned |
| CSV export | 0 scores blank; formula injection | Same bugs | Fixed |
| Firestore rules | Previous live rules: any signed-in account could edit a submitted attempt | Same rules, which also covered the Grade Vision collections | Only the exam's teacher or the admin can edit a submitted attempt |
| Realtime Database | Not used | Used for the phone-camera relay | Not used; rules deny everything |

---

## v38: what changed

v38 adds 423 lines to v33 and changes 81 of its original lines. Everything else in v33 is untouched, including the student exam flow except for the specific fixes below.

### Removed

- **Grade Vision AI** (phone-camera grading with Gemini). v33 predates it, so there is no Grade Vision code, copy, Realtime Database connection or `gv_*` data access in v38.
- **Emailed graded scripts** (added in v34–v36). Not part of v33, so not part of v38. It never sent anything in v36 because its EmailJS keys were never filled in.

### Added: Admin Monitor

- **Teachers tab** now shows, for every teacher:
  - status: **Active** (used in the last 14 days), **Cooling** (15–30 days), **Dormant** (31–60), **Churned** (over 60) or **Never used**, plus days since last activity
  - exams created in total, in the last 30 days and in the last 90 days
  - students, last activity and join date
  - a **Drop-off** flag for teachers who ran 3–6 exams and then went quiet for over 30 days, sorted to the top
- **View dashboard** on each teacher, and **Teacher dashboard** on each row of the Exams tab. It opens that teacher's dashboard exactly as they see it: exams, stats, sections, trash, and each exam's monitor with results, violation logs and written answers.
- **Read-only lock** while viewing a teacher:
  - Disabled: creating, editing, deleting, restoring, publishing, reopening or ending exams, saving marks, adding sections, sending feedback, signing out.
  - **Preview** becomes a read-only question sheet with correct answers ticked. A real preview runs an exam session that would write into their exam.
  - A safety net on the Firestore SDK refuses every write while the view is open, even from a code path nobody remembered to guard.
  - Their data is loaded fresh from Firestore each time. Sections are rebuilt from their exams, because sections live in each teacher's own browser.
  - A bar at the bottom shows whose dashboard is open, with **Exit to Admin**.

### Fixed: student work being lost

- **Phone photos.** v33 stored photos uncompressed, and one phone photo (3–8 MB) is bigger than a Firestore document can hold (1 MB). The entire submission was rejected: score, typed answers and all. The student still saw their results page and couldn't retry; the teacher saw them stuck as "Active".
  - Now photos are compressed in the browser. A 12-megapixel, 4.5 MB photo becomes about 170 KB.
  - Each attempt holds about 700 KB of photos, roughly 7. The first ones stay sharp, later ones get smaller, and the student is told when the limit is reached or a file can't be read.
  - If an attempt is somehow still too big at submission, the photos are dropped and everything else is saved, with a warning, instead of losing the whole submission.
- **Full browser storage.** Saving to the browser threw an error when storage was full. That stopped `doSubmit` before it reached Firestore, so the submission was lost. The same error broke the live monitor and exam creation for teachers whose storage had filled up with students' photos. Now browser saves never throw, and a full cache is saved without photos (Firestore still has them).
- **Refresh mid-exam.**
  - The student's name and roll became "Student" and blank, and that overwrote their real details in Firestore. Now they're kept.
  - With shuffle on, questions were re-shuffled after the refresh. Saved answers are stored by position (and are locked), so they landed on different questions. Now the original order is kept.
  - Each refresh after the first one restarted part of the clock. Now time always counts from the original start.
  - In a combined exam, a refresh skipped the written part. Now it doesn't.
  - A different student entering their details on the same browser now gets their own attempt instead of reusing the previous student's (when the previous student hadn't answered anything yet).

### Fixed: wrong grades

- **Marks per MCQ** were ignored: the score counted correct answers while the total used the marks. A perfect paper at 2 marks per question showed 10/20 (50%). Now correct.
- **Combined exams:** grading the written part replaced the score with the written marks only, dropping the MCQ marks. Now MCQ + written.
- **Combined exams with one empty section:** an MCQ-only one never saved the submission; a written-only one crashed on start. Both work now.
- **Answer keys:** grading re-saved answers as `qq0, qq1…` next to the real `q0, q1…`. Fixed.

### Fixed: other

- A resume code could reopen an attempt that was already submitted. Now refused.
- Exams could be created with the closing time before the opening time (edit and reopen already checked this; creating didn't). Now refused.
- Failed saves were silent: a teacher saw "Marks saved" and a student saw their results even if the save was rejected. Both are now warned.
- A progress save scheduled just before submitting could fire afterwards. It's now cancelled on submit.
- CSV exports showed a score of 0 as a blank cell, and a student name starting with `=`, `+` or `@` ran as a spreadsheet formula. Both fixed.

### Fixed: security

- **Script injection.** Students aren't signed in and can write any field of their own attempt until they submit. Several of those fields (score, percentage, violation types, photo data, attempt ID) were placed into the page as HTML. That let a student run script in the teacher's browser (monitor, grading screen), or in the admin's browser (Admin Monitor, teacher dashboard view), with that person's permissions. All of these are now shown as plain text, and IDs in buttons are cleaned.
- **Admin Monitor crash.** Anyone can submit feedback without signing in. An entry with a non-text type crashed the whole Admin Monitor. The code now handles it, and the rules reject it.

### Security rules

**Firestore** (`firestore.rules`), compared with the rules that were live:

- **Submitted attempts:** only the teacher who owns the exam, or the admin, can change one. Before, any signed-in account could. Since anyone can create an account on the public sign-up page, a student could sign up and edit their own graded score from the browser console. Any teacher could also change another teacher's students' scores.
- **Exam ownership:** a teacher can't hand an exam over to another account.
- **Listing exams:** rewritten in the form Firestore can check against each query.
- **Legacy exception removed:** exams with an empty owner used to be editable by anyone signed in. The backfill tagged every exam (87 already set, 3 fixed, 0 orphans), so this is no longer needed.
- **Feedback:** type and institute must be short text.
- **Grade Vision collections** (`gv_profiles`, `gv_sessions`, `gv_results`) are closed. The old data stays in the Firebase Console until you delete it.

**Realtime Database** (`database.rules.json`): nothing uses it now, so it denies all reads and writes. This also closes the old Grade Vision phone-camera relay (`gv_live`).

### Unchanged from v33

Exam creation and CSV import, student lists, scheduling, drafts, sections, trash, reopening, editing live exams, link and QR sharing, the live monitor, red-pen grading, PDF export, the review portal, device switching, one submission per browser, the anti-cheat rules, the manuals, the feedback form, the visit counter, and the whole look of the site.

---

## v36: what it added over v33

- **Grade Vision AI:** a phone became a camera through a QR code, frames were relayed through Realtime Database, cleaned with OpenCV.js, and graded by Gemini 2.0 Flash against a profile learned from the teacher's old graded scripts. Google shut that model down on 1 June 2026, so AI grading had stopped working.
- **Emailed graded scripts** through EmailJS, with a student email field on the exam form and an Email column in the CSV. The keys were never configured, so no email was ever sent.
- Everything else was identical to v33, including every bug listed above.

---

## How v38 was checked

- **Automated checks on v38:** 53 of 53 admin and teacher-view checks pass, and 31 of 31 bug-fix checks pass. The same bug-fix checks run against the original v33 fail 25 of 31, which confirms each bug was real.
- **Student exam, end to end:** open the link, take the exam, submit, saved.
- **Real browser test (Chromium):** photos and submissions.
- **Code checks:** the read-only safety net was tested against the real Firebase 10.7.1 SDK; ESLint finds no undefined variables or logic errors; there are no duplicate element IDs; all 212 inline buttons and handlers point at real functions.
- **Rules:** reviewed against every read and write the app makes. Publishing them in the Firebase Console also checks their syntax.

---

## Known limitations (still true in v38)

- **Scores are calculated in the student's browser,** and the exam, answer key included, reaches that browser. A technically skilled student can tamper with their own attempt before submitting. Closing this needs a server that grades answers.
- **Typed written answers are saved only at submission.** A refresh or device switch during a written exam loses typed text (photos included). In a combined exam, a refresh during the written part returns to the MCQ part, with the MCQ answers kept.
- **Photo space** is about 700 KB per attempt, because an attempt is one Firestore document. More photos would need Firebase Storage.
- **One submission per browser** is enforced in that browser, so clearing its storage resets it.
- **Sections** are saved in each teacher's own browser, not in Firestore.
- **Shared computers:** if a student leaves mid-exam after answering questions, the next person who opens the same link on that browser lands in that attempt.
