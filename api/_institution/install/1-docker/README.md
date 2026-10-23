# Type 1 — any server with Docker

**For:** Linux servers with Docker Engine, or Windows / macOS machines with Docker Desktop. ExamFlow runs in a container. Its data lives in the Docker volume `examflow-data`, which every package version shares.

**You need:**
- Docker with the Compose plugin (`docker compose version` works);
- 2 CPU, 2 GB RAM and 10 GB of disk;
- outbound HTTPS to GHUM.

## Install

From the unzipped package folder:

```bash
bash install/1-docker/install.sh                     # database: built-in SQLite, or whatever is in .env
bash install/1-docker/install.sh --with postgres     # also runs PostgreSQL 16 in Docker for ExamFlow
bash install/1-docker/install.sh --with mariadb      # also runs MariaDB 11 in Docker for ExamFlow
```

The script:
1. Asks for the web address and the admin emails, and writes `.env`.
2. Builds the image.
3. Runs the full check: signature, every file, settings and database.
4. Starts ExamFlow and waits until it is healthy.
5. Asks for GHUM's registration code.

To use the university's existing database server, set `DB_TYPE` and the connection in `.env` first. See [`DATABASES.md`](../../DATABASES.md). Add `--code XXXX-XXXX-XXXX` to register without the question.

**Windows with Docker Desktop:** run the same commands in Git Bash or WSL. Or run them by hand in PowerShell, from the package folder:
```powershell
Copy-Item .env.example .env; notepad .env
docker compose up -d --build
docker compose exec examflow node server/src/cli.js check
docker compose exec examflow node server/src/cli.js register --code XXXX-XXXX-XXXX
```

## HTTPS

ExamFlow listens on `127.0.0.1:8080` only. In front of it, put one of:
- Caddy: `Caddyfile.example`. It gets the certificate by itself.
- nginx: `install/2-linux/nginx-examflow.conf`.
- your load balancer.

Allow request bodies of 3 MB.

## Everyday

```bash
docker compose logs -f examflow
docker compose exec examflow node server/src/cli.js status        # also: teachers, teacher-codes, db-check, backup, licence
```

If you used `--with postgres` or `--with mariadb`, add the same `-f` files to every command. `install.sh` prints them, and they are saved in `.examflow-compose-files`. For example:

```bash
docker compose -f docker-compose.yml -f install/1-docker/with-postgres.yml exec examflow node server/src/cli.js status
```

## Upgrade to a new package

1. Unzip it **next to** the old folder.
2. Run `bash install/1-docker/install.sh` inside it, with the same `--with` as before.

Your `.env` is carried over from the old folder automatically. The data volumes stay. Back up first: `docker compose exec examflow node server/src/cli.js backup` for SQLite, or your database's own backup.
