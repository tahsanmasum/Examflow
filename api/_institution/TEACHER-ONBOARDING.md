# Getting teachers started

Only teachers on your institution's approved list can create and manage exams. Students never need accounts: they open the exam link their teacher shares.

## If you use local accounts (AUTH_MODE=local)

1. Make activation codes for the listed teachers who have no account yet:
   ```
   docker compose exec examflow node server/src/cli.js teacher-codes > codes.csv
   ```
   Each line has teacher ID, email, code and expiry date. A code:
   - works **once**;
   - works only for **that email**;
   - expires after 14 days.
2. Give each teacher only their own code, privately (in person, or by email to that address).
3. The teacher opens your ExamFlow address → **Sign in** → **Activate account**, and enters:
   - their name;
   - their email (exactly as on the list);
   - the code;
   - a password of at least 10 characters.
4. Delete `codes.csv` afterwards.

**Forgotten password:** run `teacher-codes --email teacher@your-university.edu`. The teacher uses **Activate account** again with the new code and a new password, and their old sign-ins end.

**Exam office (Admin Monitor):** people in `INSTITUTION_ADMIN_EMAILS` get a code the same way, with `teacher-codes --email office@your-university.edu`.

## If you use your own sign-in (AUTH_MODE=oidc)

Teachers click the sign-in button and use their usual university account. Nothing to hand out. Their email must match the one on the approved list.

## A short message you can send teachers

> ExamFlow is now available at https://examflow.your-university.edu for creating and running exams. Sign in with [your activation code / your university account]. Everything you create stays on the university's own server. The built-in guides (📚 in the menu) explain every feature.

## When a teacher is added or removed

Ask GHUM to update the list. GHUM sends a new package version; install it as described in `UPGRADE.md`. Until then, the server keeps using the list it has.
