# Installing ExamFlow on your institution's server

This package runs ExamFlow on **your** server. Teachers and students use the usual ExamFlow app, but every exam, question, picture, student attempt, answer, photo, mark and result is stored in **your** database, on **your** disk. GHUM never receives them.

Read `PACKAGE-INFO.txt` first. It names your institution, its permanent institution ID, the package version and the fingerprint of GHUM's signing key.

**In a hurry? Open [`START-HERE.md`](START-HERE.md).** It shows the nine ready-made ways to install:
- Docker;
- Linux without Docker;
- Windows Server;
- a fresh Ubuntu server;
- Kubernetes / OpenShift;
- Podman;
- macOS;
- the cloud platforms;
- FreeBSD.

`install/OTHER-PLATFORMS.md` covers everything else: VMs, NAS boxes, ARM and PaaS. The installers do sections 2–7 of this guide for you. This file is the full reference.

---

## 1. What you need

| | |
|---|---|
| Server | Any 64-bit server: Linux, Windows Server 2016+, macOS 13+ or FreeBSD 13.2+; a VM, a Kubernetes cluster or a cloud container service. 2 CPU cores, 2 GB RAM (Windows: 4 GB) and 10 GB of free disk is enough for most universities. |
| Software | **Docker** with Docker Compose, **or** Node.js **22.13 or newer**. Nothing else: the database drivers are inside the package (`server/vendor/`), and nothing is downloaded during installation. |
| Database | Built-in SQLite (nothing to install), or your own **PostgreSQL, MySQL/MariaDB, SQL Server, Oracle, MongoDB, Firebird, SAP HANA, IBM Db2, Cassandra/ScyllaDB, Amazon DynamoDB or Google Firestore**, including their cloud versions. See [`DATABASES.md`](DATABASES.md). |
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

**Default: nothing to provision.** The server creates its SQLite database on first start, at `DATA_DIR/examflow.db`. With Docker that is the volume named `examflow-data`, mounted at `/data`; `docker volume inspect examflow-data` shows where it is on disk.

**Your own database server:**
1. Set `DB_TYPE` (`postgres`, `mysql`, `mssql`, `oracle`, `mongodb`, `firebird`, `hana`, `db2`, `cassandra`, `dynamodb` or `firestore`) and the connection in `.env`.
2. Your DBA creates one empty database and a user. The server creates its tables on first start, or the DBA runs the script from `install/database-scripts/`.
3. Run `node server/src/cli.js db-check` to prove it works.

[`DATABASES.md`](DATABASES.md) covers every engine, the cloud versions, TLS and sign-in options, backups, and moving from SQLite later.

- Migrations only add. They never drop or rewrite your data.
- With SQLite, before a database that already has data is migrated, a copy is saved to `DATA_DIR/backups/`. With a database server, back it up with its own tools before upgrading.
- Never point a new installation at another institution's data. The server refuses: the database is tied to your institution ID.
- `DATA_DIR` is needed with every database. It holds `server-identity.pem`, this server's identity with GHUM, and the reading models.

See `DATA.md` for exactly what is stored where, and how to back it up.

## 5. Teacher allowlist

The approved teacher list arrives in `allowlist.json`, signed as part of the package. The server loads it into its own database on start, and only teachers on it can create or manage exams.

When GHUM changes the list later, the registered server receives the new signed list at its next check-in (about a minute). No new package is needed. The log says `Teacher list version N received from GHUM.`

Editing `allowlist.json` yourself breaks the signature, and the server will refuse to start.

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
| Grace Period (after the end date, if GHUM allows one) | Yes | Yes |
| Pending (start date ahead), Expired, Suspended, Revoked | No | Yes |
| Not verified (not registered, or no contact with GHUM for more than 7 days) | No | Yes |

Nothing is ever deleted because of the licence.

## 7. Start

The installers in `install/` start ExamFlow as a service for you. By hand:

```
docker compose up -d --build
docker compose logs -f examflow     # watch it start
```

Without Docker: `node server/src/server.js`, run as a service by an unprivileged user.
- Linux: `install/2-linux/examflow.service`.
- Windows: `install/3-windows/install.ps1`.

Settings come from `.env` in the current folder, or from the file named by `EXAMFLOW_ENV_FILE`.

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

- The exam and the attempt are in your database.
  - SQLite: `sqlite3 $(docker volume inspect -f '{{.Mountpoint}}' examflow-data)/examflow.db "select col, count(*) from docs group by col"`.
  - A database server: `SELECT col, COUNT(*) FROM docs GROUP BY col` in the ExamFlow database. MongoDB: `db.docs.aggregate([{$group:{_id:"$col",n:{$sum:1}}}])`.
- Your firewall logs show only check-ins to GHUM's `/api/inst` address.

## 12. Troubleshooting

| Message | What to do |
|---|---|
| `Package check failed: … signature does not match` | A file was changed after GHUM signed it. Don't edit package files; ask for a fresh package. |
| `File was changed or damaged: …` | Same. Unzip the package again. |
| `PUBLIC_URL must start with https://` | Use the https address; plain http only works for `localhost`. |
| `This data folder belongs to institution …` | You pointed `DATA_DIR` at another institution's data. Use the right package or folder. |
| `The package's teacher list … is older` | You started an older package on newer data. Use the latest package. |
| `Database problem: …` | SQLite: the data folder is not writable or the file is damaged. Check permissions (Docker runs as user `node`) and restore from `backups/` if needed. A database server: see the table at the end of `DATABASES.md`, and run `node server/src/cli.js db-check`. |
| Licence shows **Unregistered** or **Unverified** | Run `register`, or check outbound HTTPS to GHUM and the server clock (`timedatectl`). |
| `The server clock is more than 5 minutes off` | Turn on NTP. |
| Teachers see "not on the approved teacher list" | Their sign-in email isn't in `allowlist.json`. Ask GHUM to add it and send a new package. |
| Sign-in with your identity provider fails | Check the redirect URI, client ID and secret, and `OIDC_ALLOWED_DOMAINS`. The reason appears on the sign-in page and in the audit log. |

Logs:
- Docker: `docker compose logs examflow`
- Linux service: `journalctl -u examflow`
- Windows: `C:\ProgramData\ExamFlow\logs\examflow.log`
- Kubernetes: `kubectl -n examflow logs deployment/examflow`
- Podman: `podman logs examflow`
- macOS: `/Library/Logs/ExamFlow/examflow.log`
- FreeBSD: `/var/log/messages` (tag `examflow`)

The logs contain no exam content or student answers.
