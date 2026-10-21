# New package versions, upgrades and recovery

GHUM sends a **new package version** (for example 1.0.0 → 1.1.0) when:

- the approved teacher list changes;
- the institution details change;
- the ExamFlow software is updated.

`PACKAGE-INFO.txt` in the new package says which, and lists teachers added (+) and removed (−).

Nothing updates itself. Your server changes only when you install the new package.

## Installing a new version (same server, same data)

1. Back up: `docker compose exec examflow node server/src/cli.js backup`
2. Unzip the new package **next to** the old one, and copy your `.env` into it.
3. Check it: `node server/src/cli.js check`
4. Stop the old one and start the new one with the **same data volume**:
   ```
   cd old-package && docker compose down        # data stays in the volume
   cd ../new-package && docker compose up -d --build
   ```
   Both folders use the same Docker volume, named exactly `examflow-data` (fixed in `docker-compose.yml`), so the new version sees all existing data. Check with `docker volume ls`.
5. The log says `Teacher list version N applied: X added, Y removed`. Removed teachers can no longer manage exams from that moment. Their earlier exams stay in the database.
6. GHUM's Admin Monitor shows the new version as **Installed** after the next check-in.

The server refuses:

- a package for a **different institution** than the data folder;
- a package whose teacher list is **older** than the one already applied. Set `ALLOW_PACKAGE_DOWNGRADE=1` only if GHUM tells you to.

## If GHUM revokes a package

Your server learns of it at its next check-in and **pauses new exams**. Existing exams, attempts and results keep working. Install the replacement package GHUM sends.

## Rebuilt or moved server

- **Same data:** move the whole data volume, including `server-identity.pem`. Nothing else is needed.
- **New data folder or lost identity:** ask GHUM to reset the registration and send a new registration code. Then run `register --code …` again.

## Rolling back after a failed upgrade

1. `docker compose down` in the new folder.
2. Start the old folder again. If the new version already applied a newer teacher list, the old package refuses to start; in that case restore the backup from step 1 first.

## Recovering a damaged database

Stop the server, then restore the newest file from `backups/` (see `DATA.md`).
