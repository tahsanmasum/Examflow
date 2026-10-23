# Type 4 — a fresh Ubuntu server, one command

**For:** a new Ubuntu 22.04 / 24.04 (or Debian 12) server or VM. The script installs everything it needs:
- **Docker**;
- **Caddy**, which gets and renews HTTPS certificates for free;
- **ExamFlow**.

**You need:**
- a DNS name such as `examflow.your-university.edu` pointing at this server;
- ports **80 and 443** open to the users;
- 2 CPU, 2 GB RAM and 10 GB of disk.

## Install

From the unzipped package folder:

```bash
sudo bash install/4-ubuntu-one-command/setup.sh
```

It asks four things:
- the web address;
- the admin emails;
- how teachers sign in (local codes, or the university's Google / Microsoft / Keycloak);
- the database: built-in SQLite, or PostgreSQL or MariaDB run in Docker.

Then it asks for GHUM's registration code. About five minutes later ExamFlow is live at `https://your-address`.

Or give all the answers in advance:

```bash
sudo bash install/4-ubuntu-one-command/setup.sh --domain examflow.uni.edu --admins exam-office@uni.edu \
     --auth local --db postgres --code XXXX-XXXX-XXXX --yes
```

To use the university's **existing** database server, write its `DB_*` settings into `.env` first (see [`DATABASES.md`](../../DATABASES.md)). Then run the script; it keeps them.

## Everyday and upgrades

Same as [type 1](../1-docker/README.md): `docker compose logs -f examflow`, `docker compose exec examflow node server/src/cli.js status`.

To upgrade:
1. Unzip the new package next to the old one.
2. Run the same `setup.sh` from it.

The settings come over automatically, and the data stays.
