# Installation checklist

Tick each line. Everything here must pass before you give teachers the address.

- [ ] `PACKAGE-INFO.txt` names our institution, and the key fingerprint matches what GHUM told us separately.
- [ ] `node server/src/cli.js check` → **All checks passed**. The installers in `install/` run it for you.
- [ ] Database server only (`DB_TYPE` is not sqlite): `node server/src/cli.js db-check` → **The database is ready for ExamFlow**, and the connection is encrypted when the database is on another machine.
- [ ] `.env` filled in: `PUBLIC_URL` (https), `AUTH_MODE`, `INSTITUTION_ADMIN_EMAILS`, `TRUST_PROXY=1` behind a proxy.
- [ ] The server clock is synced (NTP).
- [ ] `register --code …` printed **Registered with GHUM** and a licence status.
- [ ] The service runs and restarts by itself:
  - Docker: `docker compose ps` shows **healthy**.
  - Linux: `systemctl status examflow` shows **active**.
  - Windows: the **ExamFlow** scheduled task is **Running**.
  - Kubernetes: `kubectl -n examflow get pods` shows **1/1 Running**.
  - Podman: `systemctl status examflow` shows **active**.
  - macOS: `launchctl print system/edu.ghum.examflow` shows **running**.
  - FreeBSD: `service examflow status` shows it running.
  - Cloud: one healthy instance.
- [ ] `https://PUBLIC_URL/healthz` shows `"ok":true`, `"registered":true` and the expected licence and teacher-list version.
- [ ] `fetch-models` downloaded both reading models with verified hashes.
- [ ] HTTPS certificate valid, and http redirects to https.
- [ ] One listed teacher activated an account (or signed in with SSO) and created a test exam.
- [ ] A student opened the exam link in a private window, submitted, and the attempt appeared in the teacher's monitor.
- [ ] A person who is **not** on the list cannot create exams (they see "not on the approved teacher list").
- [ ] Backups run on a schedule and are copied off the server:
  - SQLite: `backup` plus the data folder.
  - A database server: its own backup, plus the data folder, which holds `server-identity.pem`.
- [ ] Firewall: only port 443 is open to users; outbound HTTPS to GHUM is allowed.
- [ ] GHUM confirmed the package shows as **Installed** in their Admin Monitor.
