# Where ExamFlow keeps your institution's data

Everything below is on **your** server, in `DATA_DIR`: the Docker volume `examflow-data`, mounted at `/data`.

| What | Where |
|---|---|
| Exams and their settings, questions, options, answer keys, question pictures and diagrams | `examflow.db`, table `docs`, collection `exams` |
| Student attempts: names, IDs, answers, written answers, answer photos, marks, grading notes, browser and camera alerts, camera snapshots | `examflow.db`, `docs` → `sessions` |
| Teacher profiles | `examflow.db`, `docs` → `teachers` |
| Feedback sent from the app | `examflow.db`, `docs` → `feedback` (stays here; it does not go to GHUM) |
| Accounts (email, scrypt password hash), sign-in sessions, activation codes (hashed) | `examflow.db`, tables `users`, `logins`, `codes` |
| Approved teacher list and its history | `examflow.db`, tables `allowlist`, `allowlist_history` |
| Audit log (sign-ins, exam creation and deletion, refused actions, teacher-list changes) | `examflow.db`, table `audit`. Append-only: the database refuses edits and deletions. |
| Last licence statement from GHUM | `examflow.db`, table `meta` |
| This server's private identity key | `server-identity.pem` (never leaves the server) |
| Reading models | `models/` |
| Automatic backups before migrations, and `backup` command copies | `backups/` |

**Uploads** (answer photos, question pictures) are stored inside the database, compressed in the browser first. There is no separate upload folder and no cloud storage.

**Temporary files:** none are written by the server. Paper reading and camera checks run in the teacher's or student's browser.

**Logs** go to standard output (`docker compose logs`). They hold start-up messages, errors and licence check results — never exam content or answers.

**Sent to GHUM**, about every minute: institution ID, server ID, a timestamp and nonce, the server software version, the package ID and version, the teacher-list version, and `db: ok/error`. That is all.

## Backups

```
docker compose exec examflow node server/src/cli.js backup     # makes /data/backups/examflow-<time>-manual.db
```

Copy `backups/` (or the whole volume) to your normal backup storage on a schedule. To restore:

1. Stop the container.
2. Replace `examflow.db` with a backup, and delete `examflow.db-wal` and `examflow.db-shm` if present.
3. Start the container again.

Expired, blocked or revoked licences never delete data. Deleting data only happens when a teacher deletes their own exam or attempt, or your institution admin does.
