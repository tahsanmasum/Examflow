# Installing ExamFlow on your institution's server

This package runs ExamFlow on **your** server. Teachers and students use the usual ExamFlow app, but every exam, question, picture, student attempt, answer, photo, mark and result is stored in **your** database, on **your** disk. GHUM never receives them.

Read `PACKAGE-INFO.txt` first. It names your institution, its permanent institution ID, the package version and the fingerprint of GHUM's signing key.

---

## 1. What you need

| | |
|---|---|
| Server | Any 64-bit Linux server or VM. 2 CPU cores, 2 GB RAM and 10 GB of free disk is enough for most universities. |
| Software | **Docker** with Docker Compose (recommended), **or** Node.js **22.13 or newer**. Nothing else: the server has no npm packages to install. |
| Address | A name such as `examflow.your-university.edu`, with an HTTPS certificate. Cameras, sign-in and copying exam links all need HTTPS. |
| Network in | Port 443 from wherever teachers and students connect (campus, or the internet). |
| Network out | HTTPS to the GHUM address in `PACKAGE-INFO.txt`, for the licence check-in. Teachers' and students' browsers also load fonts and some free libraries from public CDNs (cdnjs, jsDelivr, unpkg, Google Fonts). |
| Time | The server's clock must be correct (NTP). GHUM refuses check-ins from a clock more than 5 minutes off. |

## 2. Check the package

Unzip it and, inside the folder, run:

```
node server/src/cli.js check
```

With Docker only (no Node.js on the host):

```
docker run --rm -v "$PWD":/app -w /app node:22-bookworm-slim node server/src/cli.js check
```

The check verifies GHUM's signature on `manifest.json`, the SHA-256 of every file listed in it, and your settings. Compare the "key" fingerprint it prints with the fingerprint GHUM gave you by email or phone. If any check fails, **don't install**. Ask GHUM for a fresh package.

## 3. Settings

```
cp .env.example .env
nano .env
```

| Setting | What to put |
|---|---|
| `PUBLIC_URL` | The https address teachers and students will open. |
| `AUTH_MODE` | `local`: teachers get accounts on this server with one-time activation codes from you. `oidc`: teachers sign in with your existing accounts (Google Workspace, Microsoft Entra ID, Keycloak and similar). |
| `OIDC_ISSUER`, `OIDC_CLIENT_ID`, `OIDC_CLIENT_SECRET` | Only for `oidc`. Register `https://YOUR-PUBLIC-URL/auth/oidc/callback` as the redirect URI in your identity provider. `OIDC_ALLOWED_DOMAINS` limits sign-in to your email domains. |
| `INSTITUTION_ADMIN_EMAILS` | Who may open the Admin Monitor on this server (for example the exam office). They see all exams and attempts at your institution. |
| `TRUST_PROXY` | `1` when a reverse proxy in front terminates HTTPS (normal). |

Keep `.env` private. It is never sent anywhere.

## 4. Database and storage

Nothing to provision. The server creates its SQLite database at `DATA_DIR/examflow.db` (Docker: the volume named `examflow-data`, mounted at `/data`; `docker volume inspect examflow-data` shows where it is on disk) on first start, and applies migrations by itself.

- Migrations only add. They never drop or rewrite your data.
- Before a database that already has data is migrated, a copy is saved to `DATA_DIR/backups/`.
- Never point a new installation at another institution's data folder. The server refuses: the data folder is tied to your institution ID.

See `DATA.md` for exactly what is stored where, and how to back it up.

## 5. Teacher allowlist

The approved teacher list is in `allowlist.json`, signed as part of the package. The server loads it into its own database on start, and only teachers on it can create or manage exams. To change the list, GHUM sends a new package version (see `UPGRADE.md`). Editing `allowlist.json` yourself breaks the signature, and the server will refuse to start.

## 6. Register with GHUM (licence)

GHUM gives you a one-time registration code (valid 7 days). Run:

```
node server/src/cli.js register --code XXXX-XXXX-XXXX
# with Docker, after the container exists:
docker compose run --rm examflow node server/src/cli.js register --code XXXX-XXXX-XXXX
```

The server creates its own key pair in `DATA_DIR/server-identity.pem`; only the public key goes to GHUM. From then on it checks the licence about every minute. Each check-in sends only technical details:

- the server software version;
- the package ID and version;
- the teacher-list version;
- whether the database is healthy.

GHUM answers with a licence statement it signs. Your server verifies that signature with `ghum-public-key.pem`.

| Licence | Teachers can create, edit and publish exams | Existing exams, attempts, grading, results, exports |
|---|---|---|
| Active / Expiring Soon | Yes | Yes |
| Pending (start date ahead), Expired, Blocked | No | Yes |
| Not verified (not registered, or no contact with GHUM for more than 7 days) | No | Yes |

Nothing is ever deleted because of the licence.

## 7. Start

```
docker compose up -d --build
docker compose logs -f examflow     # watch it start
```

Without Docker: `node server/src/server.js`, run as a service (systemd) by an unprivileged user.

Put HTTPS in front. `Caddyfile.example` shows the simplest way (Caddy gets the certificate by itself); nginx or your existing load balancer work too. Allow request bodies of at least 3 MB.

## 8. Reading models (Bangla and English)

```
docker compose exec examflow node server/src/cli.js fetch-models
```

This downloads ExamFlow's paper-reading models (about 4 MB) from GHUM and checks them against the hashes in the signed manifest. Without them, the paper reader falls back to the standard models from the internet, which read Bangla worse.

## 9. Health checks

- `https://YOUR-PUBLIC-URL/healthz` returns `{"ok":true,…}` with the licence status, the teacher-list version and whether the server is registered. Docker uses it as the container health check.
- `node server/src/cli.js status` gives a short summary.
- `node server/src/cli.js licence` checks the licence with GHUM now and prints the result.

## 10. Test with a real teacher

1. Local mode: run `node server/src/cli.js teacher-codes` to get one activation code per listed teacher. Give one teacher their code.
2. The teacher opens `PUBLIC_URL` → Sign in → **Activate account**, then enters their email, the code and a new password.
3. The teacher creates a small exam and opens its link in a private window as a student.
4. Check the attempt shows in the teacher's Live Monitor.

## 11. Confirm the data stays here

- The exam and the attempt are in `DATA_DIR/examflow.db`. For example: `sqlite3 $(docker volume inspect -f '{{.Mountpoint}}' examflow-data)/examflow.db "select col, count(*) from docs group by col"`.
- Your firewall logs show only check-ins to GHUM's `/api/inst` address.

## 12. Troubleshooting

| Message | What to do |
|---|---|
| `Package check failed: … signature does not match` | A file was changed after GHUM signed it. Don't edit package files; ask for a fresh package. |
| `File was changed or damaged: …` | Same. Unzip the package again. |
| `PUBLIC_URL must start with https://` | Use the https address; plain http only works for `localhost`. |
| `This data folder belongs to institution …` | You pointed `DATA_DIR` at another institution's data. Use the right package or folder. |
| `The package's teacher list … is older` | You started an older package on newer data. Use the latest package. |
| `Database problem: …` | The data folder is not writable or the file is damaged. Check permissions (Docker runs as user `node`) and restore from `backups/` if needed. |
| Licence shows **Unregistered** or **Unverified** | Run `register`, or check outbound HTTPS to GHUM and the server clock (`timedatectl`). |
| `The server clock is more than 5 minutes off` | Turn on NTP. |
| Teachers see "not on the approved teacher list" | Their sign-in email isn't in `allowlist.json`. Ask GHUM to add it and send a new package. |
| Sign-in with your identity provider fails | Check the redirect URI, client ID and secret, and `OIDC_ALLOWED_DOMAINS`. The reason appears on the sign-in page and in the audit log. |

Logs: `docker compose logs examflow`. The logs contain no exam content or student answers.
