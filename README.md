# ExamFlow v45

> **Updated build of v45 (still v45).** It adds:
>
> - the **GHUM** name and logo in place of TahCreations;
> - the new admin email, **examflow.live@gmail.com**;
> - a guide for every feature, opened from wherever you need it;
> - updated camera and paper-reader guides;
> - fixes for the bugs found while testing.
>
> See [section 0](#0-this-update-ghum-admin-email-guides-and-bug-fixes).

This version makes the paper reader much more accurate on every kind of file:

- phone photos;
- scanned PDFs;
- typed PDFs;
- Word files (`.doc` and `.docx`).

It also adds the v45 features you asked for: answers found in every form, pages put in order, typed matrices, the maths keyboard and the single upload box.

All other features work as before. There is still no API, no AI service and nothing to pay for. Everything runs in the teacher's browser.

## What's in this folder

| File | What it is |
|---|---|
| `index.html` | ExamFlow v45. |
| `tessdata/ben.traineddata.gz` | The Bangla + English reading model from v43. It is unchanged. |
| `tessdata/eng.traineddata.gz` | The English model. It is unchanged. |
| `firestore.rules` | The security rules with the new admin email. **Must be published** (step 3 below). |
| `docs/camera-monitoring.md` | The camera guide for the repo, updated for v44 and v45. |
| `docs/paper-reader.md` | **New.** The paper-reader guide for the repo. |
| `README-repo.md` | Your repo's README, with GHUM, the admin email and the v40–v45 features. Save it as `README.md` in the repo. |
| `README.md` | This file: what changed in v45. |

## Putting it live (GitHub → Vercel)

1. In your repo, replace `index.html` and `firestore.rules`, and copy in the `docs` folder.
2. Rename `README-repo.md` to `README.md` and replace the one in your repo.
3. **Publish the new rules.** Without this, the Admin Monitor can't load data for the new admin email. Do one of these:
   - In the Firebase Console, open Firestore Database → Rules, paste in `firestore.rules`, and click **Publish**.
   - Or run `firebase deploy --only firestore:rules`.
4. In Firebase Authentication, make sure the account **examflow.live@gmail.com** can sign in: create it with a password, or use Google sign-in with that address.
5. The `tessdata` folder is the same as in v43 and v44. If it is already in your repo, leave it.
6. Commit. Vercel deploys it on its own.

---

## 0. This update: GHUM, admin email, guides and bug fixes

### GHUM in place of TahCreations

- **The logo.** The landing page shows the GHUM logo you sent. On phones it now fills the width of the screen; before, it was held to 280 px and the tagline was too small to read.
- **The name.** TahCreations is replaced by GHUM everywhere:
  - the badge under the logo;
  - the text beside the logo;
  - the footer ("Built by GHUM · Peace for you. No sleep for them.");
  - the data search engines read (name, slogan, description);
  - the repo README.
- **The old @TahCreations Twitter tags are removed.**
- **The web address stays the same:** `examflow-tahcreations.vercel.app`. Changing it means renaming the Vercel project. If you do that, also change the address in `index.html`, `robots.txt` and `sitemap.xml`.

### Admin email: examflow.live@gmail.com

- Only **examflow.live@gmail.com** sees **🛡️ Admin Monitor** in the menu and can open it.
- The old email no longer has admin rights. It was tested both ways.
- The contact email on the site is also examflow.live@gmail.com.
- **Publish `firestore.rules`** (step 3 above). The admin email lives in two places, the site and the Firestore rules, and both must match.

### Guides for every feature

A new guide library replaces the old two manuals. It has 18 guides, a search box, and links between guides. It works on phones.

| For teachers | For students |
|---|---|
| Getting started | Take an exam |
| Create an MCQ exam | Exams with the camera on |
| Create a written exam | Written answers and photos |
| Create an MCQ + written exam | Switch device or carry on after a refresh |
| **Read a question paper (photo, PDF, Word)**: answer forms, photo tips, limits | See your graded script |
| **Question pictures and the drawing pad** | |
| **Maths & science keyboard**: every tab | |
| **Calculator**: the calculator keys, worked-out answers, calculators under the camera | |
| **Camera monitoring**: turning it on, allowed items, every alert and its level, privacy | |
| Live monitor and cheating alerts | |
| Grading, results and review links | |
| Edit, reopen and delete exams | |
| Admin monitor (shown only to the admin) | |

**Where the guides open:**

- **Landing page → Guides & Manuals:** All guides, For teachers, For students, Reading a question paper, Camera monitoring, Maths keyboard, Calculator.
- **The avatar menu:** 📚 Manuals & guides.
- **The dashboard tip:** 📚 Guides.
- **The monitor tip:** Guide.
- **❔ How it works** beside the camera switch, in every Create and Edit window.
- **❔ How the paper reader works** under every upload box.
- **?** on the maths keyboard. It opens the Calculator guide from the Calculator tab, and the keyboard guide from the other tabs.
- **Student guide** on the students' "Read before you begin" page. Opening it is not flagged.

**Updated for camera monitoring and the paper reader:**

- The camera guide covers the v44 changes:
  - the four checks run side by side;
  - a phone held up clearly is flagged at once;
  - a graphics chip that gives bad results is swapped for the processor.
- The paper-reader guide covers everything in sections 2 and 3 below.
- In the repo, `docs/camera-monitoring.md` is updated, and `docs/paper-reader.md` is new.
- The **"What files can I use?"** window (once "Don't have a CSV? Convert any file with AI") now says to drop the photo, PDF or Word file straight in. Making a CSV with a chat assistant is kept as an optional extra.

### Bugs found and fixed

1. **Live Monitor on phones was wider than the screen.** The page can't scroll sideways, so these could not be reached on a phone:
   - the 5th count (Avg score);
   - the "Graded" filter;
   - the right-hand table columns, including each student's **violations** button;
   - **End exam early**.

   Now:
   - the counts sit in rows of three;
   - the table scrolls inside its card;
   - the top buttons fit, with the logo mark only on these pages.
2. **Admin Monitor on phones had the same problem.** Fixed the same way:
   - the 6 counts sit in rows of three;
   - the overview cards stack;
   - the top buttons fit.
3. **The dashboard's Sections / Trash / Feedback / + Create exam row was cut off on phones.** It now wraps. On very small phones (360 px) the account button showed only partly; it now shows just the avatar.
4. **Old landing-page animations ran on every page, including students' exam pages.** They targeted about 40 parts of a landing page that was redesigned long ago, and wrote about 100 warnings to the browser console on every load. They no longer run. The console is now clean on the landing, teacher, student and review pages.
5. **Out-of-date help text.**
   - The Create MCQ "Steps" line said "AI-convert". It now says to drop a photo, PDF, Word, CSV or JSON file.
   - The file-help window told teachers to convert photos and PDFs with ChatGPT, although ExamFlow reads them itself.

---

## What was in v45 before this update

Sections 1 to 5 are the v45 notes from before, unchanged except for the new tests in section 5.

## 1. How much better the reader is

Each test compares v44 with v45 on the same files.

### Phone photos and scanned PDFs

12 papers: book pages, test papers and admission-test photos, in Bangla and English. They hold 226 questions, and 192 of them have a known correct answer.

| | v44 | v45 |
|---|---|---|
| Questions found | 73 (32%) | **203 (90%)** |
| Correct answers | 8 (4%) | **159 (83%)** |

For 36 of the 159 answers, some options could not be read (usually formulas). Those questions keep their answer, with empty option boxes for you to type in. ExamFlow will not add them to the exam until the boxes are filled.

### Typed PDFs

For these files a Word version of the same paper exists. The reader's result from the PDF is compared with the Word file.

**60 papers (2,900 questions), used while improving the reader:**

| | v44 | v45 |
|---|---|---|
| Questions found | 64% | **84%** |
| Answers the same as in the Word file | 61% | **98.5%** |

**190 different papers (10,238 questions), not used while improving the reader.** This shows how it does on papers it has never seen:

| | v44 | v45 |
|---|---|---|
| Questions found | 75% | **82%** |
| Answers the same as in the Word file | 67% | **97%** |

The v44 figures are from 50 of these papers, the only ones measured with v44. Over all 190 papers, v45 finds 81% of the questions, and 90% of its answers match the Word file.

### Word files

**622 `.doc` files:**

| | v44 | v45 |
|---|---|---|
| MCQs read | 27,070 | **44,811** |
| MCQs with all their options | 22,430 | **43,254** |
| MCQs with an answer | 8,168 | **28,207** |
| Answers that agree with the "Answer:" line in the file | 26% (9 of 34) | **93% (54 of 58)** |

**237 `.docx` files:**

| | v44 | v45 |
|---|---|---|
| MCQs read | 12,429 | **12,712** |
| MCQs with all their options | 11,008 | **11,884** |
| MCQs with an answer | 3,887 | **8,365** |
| Answers that agree with the "Answer:" line in the file | 83% | **97%** |

In the `.doc` files, pictures lost on reading fell from 5,584 to 46. The lost pictures were drawings and text boxes.

---

## 2. What changed in the readers

### Photos and scans

- **A number reader that knows printed digits.** The general reader often gets a question number wrong, for example "53." read as "S3." or "৭),". ExamFlow now draws the digits 0–9 and ০–৯ in many fonts on the page itself, and matches each number against them. Nothing is downloaded, and no model was bought or trained elsewhere.
- **Question numbers that count up.** The numbers on a page run 53, 54, 55… Two kinds of mistake are fixed using this:
  - a number that breaks the run is not used;
  - a number that could not be read is filled in from its neighbours.
- **Answer-key tables are read cell by cell.** This covers keys like "53. d | 54. a | …", "০১. খ", and keys where the number and the letter are in separate cells. Each cell's number and letter is read on its own. Lines of the table the scan lost are put back.
- **Option letters printed in circles** (ⓚ ⓛ ⓜ ⓝ, Ⓐ Ⓑ Ⓒ Ⓓ) are read by their own reader. Options are also lettered by their order along the line.
- **Two-column pages with a printed line between the columns** are now read one column at a time.
- **Question numbers printed in the gap between the columns** now start the right-hand question. Before, they were added to the end of a left-hand line.
- **Tilted and curled photos.** Number columns that drift across a tilted photo are now followed. Faint or blurred numbers are read better, and digits that run together are split.
- **Several photos are put in page order** by their question numbers, even when one photo's first number is misread.
- **An answer key printed inside one column** now goes with the questions in that column.
- **A page of written questions after the MCQs, numbered from 1 again**, no longer takes the MCQ answer key.

### Typed PDFs

- **Columns** are found from where the text sits on the page. Tables, banners and lines across the page are handled.
- **Bijoy (SutonnyMJ) text** is found and turned into Unicode on its own.
- **Ticks and bubbles** printed in symbol fonts are read.
- **Answers marked by bold, underline, shading or colour** are found.
- **Page numbers and running headings** are removed.
- **Subscripts and superscripts** are kept.

### Word files

- **Drawings and text boxes** in both `.doc` and `.docx` are kept, and shapes are drawn into pictures.
- **Old equation fields** are read, including Bijoy inside equations.
- **Old WMF/EMF pictures** are drawn by ExamFlow's own picture reader.
- **More answer forms are found**, such as:
  - "ঘ ২৮০ টাকা (গ) ✓" (the answer after the last option);
  - keys written "১।খ ২।ক";
  - questions with five options.

---

## 3. The v45 features

- **Answers in every form.** The answer comes from whichever of these the paper uses:
  - an answer grid or table;
  - a circled letter;
  - a bold, shaded or coloured option;
  - a tick;
  - an "Ans: B" or "উত্তর: (খ)" line.
- **Pages in question order.** Photos dropped in any order are sorted.
- **Matrices as typed maths.** They show in the review list and on the student's screen as they will appear.
- **A maths and science keyboard** for typing questions: fractions, integrals, matrices and chemical formulas.
- **One upload box.** It takes photos, PDF, Word and CSV.

---

## 4. Honest limits

- **Not 100%.** No reader can be fully accurate on every phone photo. On the test photos, v45 finds 9 of every 10 questions, and gets about 8 of every 10 answers right from the key. Every answer the reader is unsure of is marked for you to check before it is added.
- **Pages photographed while curled into the book's spine** can lose the edge of the column. In the test photos this lost questions 2–10 on one page.
- **An answer grid on a strongly curled part of a page** is read only partly. In one test photo, 2 of its 3 rows were lost.
- **Formulas inside options** are often read badly from photos. The question is kept, and you type the formula in.
- **A few Word files use old non-Unicode fonts that are not Bijoy**, such as VillageII. These still come out as wrong letters.
- **The Bangla/English reading models are the same as in v43.** Other models were tried, and none read these papers better, so none is shipped.

## 5. Tests run on this build

All of these ran again on this update, in a real browser (Chromium) with a local Firebase stand-in, and all pass:

| Test | Checks |
|---|---|
| Earlier regression tests (camera, anti-cheat, create, monitor, admin) | 37 of 37 |
| v45 features (page order, answer grids, bold answers, matrices) | 7 of 7 |
| Paper reader inside ExamFlow | 21 of 21 |
| Maths keyboard and single upload box | 17 of 17 |
| Question pictures and drawing, including phone and touch | 25 of 25 |
| Written answers kept through a refresh | 6 of 6 |
| Earlier bug fixes | 9 of 9 |
| MCQ resumed after a refresh | 3 of 3 |
| **New:** GHUM branding, admin email, every guide and guide button, student guide link, phone layouts | 50 of 50 |

Also on this update:

- **A sweep of every button** on the dashboard, monitor and admin pages, on desktop and phone, as a teacher and as the admin: no errors.
- **Every window** opened on desktop and phone: none wider than the screen, and no "undefined" or old name on screen.
- **The browser console** on the landing, teacher, student and review pages: no errors and no warnings from ExamFlow.

The reader's earlier test files were also run again. Every result is the same as v44 or better:

- **16 test papers:** all options, answers and figures correct. One Bangla PDF now also has all its options right.
- **19 PHY121 answer-sheet photos:** 52 of 73 questions found (v44: 51); 44 with all four options (v44: 43).
- **5 written papers:** the same questions and marks as v44, plus one question v44 missed.
