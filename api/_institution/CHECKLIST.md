# Installation checklist

Tick each line. Everything here must pass before you give teachers the address.

- [ ] `PACKAGE-INFO.txt` names our institution, and the key fingerprint matches what GHUM told us separately.
- [ ] `node server/src/cli.js check` → **All checks passed**.
- [ ] `.env` filled in: `PUBLIC_URL` (https), `AUTH_MODE`, `INSTITUTION_ADMIN_EMAILS`, `TRUST_PROXY=1` behind a proxy.
- [ ] The server clock is synced (NTP).
- [ ] `register --code …` printed **Registered with GHUM** and a licence status.
- [ ] `docker compose up -d --build`, and `docker compose ps` shows the container as **healthy**.
- [ ] `https://PUBLIC_URL/healthz` shows `"ok":true`, `"registered":true` and the expected licence and teacher-list version.
- [ ] `fetch-models` downloaded both reading models with verified hashes.
- [ ] HTTPS certificate valid, and http redirects to https.
- [ ] One listed teacher activated an account (or signed in with SSO) and created a test exam.
- [ ] A student opened the exam link in a private window, submitted, and the attempt appeared in the teacher's monitor.
- [ ] A person who is **not** on the list cannot create exams (they see "not on the approved teacher list").
- [ ] `backup` works, and backups are copied off the server on a schedule.
- [ ] Firewall: only port 443 is open to users; outbound HTTPS to GHUM is allowed.
- [ ] GHUM confirmed the package shows as **Installed** in their Admin Monitor.
