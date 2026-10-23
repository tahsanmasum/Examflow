# Type 7 — macOS (a Mac mini or Mac Studio as the server)

**For:** macOS 13 Ventura or newer, on Apple silicon or Intel.

**You need:**
- Node.js 22.13 or newer: the macOS installer from nodejs.org, or `brew install node@22`;
- an administrator account.

## Install

Open **Terminal** in the unzipped package folder:

```bash
sudo bash install/7-macos/install.sh --code XXXX-XXXX-XXXX
```

The script:
1. Checks Node.js, then the package signature and every file.
2. Asks for the web address, the admin emails and the sign-in type.
3. Puts the program in `/usr/local/examflow`, and the data and settings in `/Library/Application Support/ExamFlow`.
4. Runs the full check.
5. Starts ExamFlow as a **launchd service** (`edu.ghum.examflow`) under the unprivileged `nobody` account. It starts at boot and restarts if it stops.
6. Registers with GHUM.

The log is in `/Library/Logs/ExamFlow/examflow.log`.

## HTTPS

```bash
brew install caddy
caddy run --config Caddyfile.example      # after putting your domain in it
```

Or use nginx, or your router or load balancer.

## Everyday

```bash
sudo launchctl kickstart -k system/edu.ghum.examflow          # restart
tail -f /Library/Logs/ExamFlow/examflow.log
cd /usr/local/examflow/current && sudo -u nobody env EXAMFLOW_ENV_FILE="/Library/Application Support/ExamFlow/examflow.env" node server/src/cli.js status
```

In **System Settings → Energy**, turn on *Prevent automatic sleeping* and *Start up automatically after a power failure*.

**Upgrade:** run `install.sh` again from the new package.
