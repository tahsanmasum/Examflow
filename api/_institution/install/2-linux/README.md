# Type 2 — Linux server without Docker (Node.js + systemd)

**For:**
- Ubuntu 20.04+ and Debian 11+;
- RHEL, Rocky, AlmaLinux and Oracle Linux 8+;
- SUSE 15+;
- any systemd Linux.

ExamFlow runs as the `examflow` system service, under its own unprivileged user.

**You need:**
- Node.js 22.13 or newer. The script can install it: `--install-node`.
- 2 CPU, 2 GB RAM and 10 GB of disk;
- outbound HTTPS to GHUM.

## Install

From the unzipped package folder:

```bash
sudo bash install/2-linux/install.sh --install-node
```

The script:
1. Checks Node.js.
2. Checks the package signature and every file.
3. Creates the `examflow` user.
4. Asks the questions and writes the settings to `/etc/examflow/examflow.env`. The file is readable only by root and the service.
5. Installs the program in `/opt/examflow/releases/<version>`, with `/opt/examflow/current` pointing at it.
6. Runs the full check, including the database.
7. Starts the `examflow` service (it restarts automatically).
8. Asks for GHUM's registration code.

The data is in `/var/lib/examflow`.

To use a database server, edit `/etc/examflow/examflow.env` (see [`DATABASES.md`](../../DATABASES.md)) and run the script again. If the database runs on the same machine, uncomment the matching `After=` line in `/etc/systemd/system/examflow.service`.

Options:

| Option | Does |
|---|---|
| `--code CODE` | Registers without the question. |
| `--env FILE` | Uses a settings file you prepared. |
| `--no-start` | Installs without starting. |
| `--no-systemd` | For containers or minimal systems. It prints the start command instead. |

## HTTPS

ExamFlow listens on `127.0.0.1:8080`. Use [`nginx-examflow.conf`](nginx-examflow.conf) with certbot, or Caddy (`Caddyfile.example` in the package folder), or your load balancer.

## Everyday

```bash
systemctl status examflow
journalctl -u examflow -f
cd /opt/examflow/current && sudo -u examflow env EXAMFLOW_ENV_FILE=/etc/examflow/examflow.env node server/src/cli.js status
#   other commands: teachers · teacher-codes · db-check · backup · licence · fetch-models
```

## Upgrade, go back, remove

- **Upgrade:**
  1. Unzip the new package anywhere.
  2. Run `sudo bash install/2-linux/install.sh` from it.

  The settings and data stay. The new version is checked before the service switches over. If it doesn't start, the script switches back to the previous version.
- **Go back by hand:**
  1. `ls /opt/examflow/releases`
  2. `sudo ln -sfn /opt/examflow/releases/<old> /opt/examflow/current`
  3. `sudo systemctl restart examflow`
- **Remove:** `sudo bash install/2-linux/uninstall.sh`. This keeps the data and settings; add `--purge` to delete them too.
