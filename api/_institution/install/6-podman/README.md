# Type 6 — Podman (Red Hat, Rocky, Alma, Oracle Linux, Fedora)

**For:** Red Hat family servers, where **Podman** is the standard container engine and Docker isn't installed. It runs with SELinux enforcing.

**You need:**
- Podman 4+ (`dnf install -y podman`);
- 2 CPU, 2 GB RAM and 10 GB of disk.

## Install

From the unzipped package folder:

```bash
cp .env.example .env && vi .env        # PUBLIC_URL, admins, sign-in, database (DATABASES.md)
sudo bash install/6-podman/install.sh --code XXXX-XXXX-XXXX
```

The script:
1. Builds the image.
2. Creates the Podman volume `examflow-data`.
3. Copies the settings to `/etc/examflow/examflow.env` (readable by root only).
4. Runs the full check.
5. Sets up the **systemd service** `examflow`:
   - Podman 4.4+: as a Quadlet, `/etc/containers/systemd/examflow.container`;
   - older Podman: as a generated unit.
6. Waits until it is healthy, then registers with GHUM.

If the database runs on this same machine, add `--host-network`.

## HTTPS

ExamFlow listens on `127.0.0.1:8080`. Use nginx (`install/2-linux/nginx-examflow.conf`) or Caddy in front. Let nginx connect under SELinux:

```bash
setsebool -P httpd_can_network_connect 1
```

## Everyday

```bash
systemctl status examflow
podman logs -f examflow
podman exec examflow node server/src/cli.js status      # teachers, teacher-codes, db-check, backup, licence
```

**Upgrade:** run `install.sh` again from the new package. It builds a new image; the volume and settings stay.
