# Type 9 — FreeBSD

**For:** FreeBSD 13.2 or newer (14 recommended). The same approach works on other BSDs with rc.d.

**You need:**
- Node.js 22.13 or newer: `pkg install -y node22`, or let the script do it with `--install-node`.

## Install

As root, from the unzipped package folder:

```sh
cp .env.example .env && vi .env        # PUBLIC_URL, admins, sign-in, database (DATABASES.md)
sh install/9-freebsd/install.sh --install-node --code XXXX-XXXX-XXXX
```

The script:
1. Creates the `examflow` user.
2. Puts the program in `/usr/local/examflow`, the data in `/var/db/examflow`, and the settings in `/usr/local/etc/examflow/examflow.env`.
3. Runs the full check.
4. Installs the rc.d service. It runs under `daemon(8)`, which restarts it if it stops, and logs to syslog with the tag `examflow`.
5. Enables the service and starts it.

## Everyday

```sh
service examflow status | restart
grep examflow /var/log/messages
cd /usr/local/examflow/current && su -m examflow -c "env EXAMFLOW_ENV_FILE=/usr/local/etc/examflow/examflow.env node server/src/cli.js status"
```

**HTTPS:** nginx (`pkg install nginx`, with `install/2-linux/nginx-examflow.conf`) or Caddy (`pkg install caddy`).
