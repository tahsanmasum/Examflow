# ExamFlow for your institution — start here

This package runs ExamFlow on **your** server, with **your** database. Every exam, question, student attempt, answer, photo, mark and result stays with you; GHUM never receives them. Everything needed is inside this folder. The only other things you need from GHUM are:

- the **registration code**, a one-time code that is valid for 7 days;
- the **signing-key fingerprint**, to compare with the one this package prints. GHUM gives it to you by email or phone.

## 1. Pick how you will run it

| Your server | Folder | One command |
|---|---|---|
| Any server with **Docker** (Linux; or Windows / macOS with Docker Desktop) | [`install/1-docker`](install/1-docker/README.md) | `bash install/1-docker/install.sh` |
| **Linux without Docker** (Ubuntu, Debian, RHEL, Rocky, Alma, Oracle Linux, SUSE) | [`install/2-linux`](install/2-linux/README.md) | `sudo bash install/2-linux/install.sh` |
| **Windows Server** 2016–2025 (no Docker) | [`install/3-windows`](install/3-windows/README.md) | `powershell -ExecutionPolicy Bypass -File install\3-windows\install.ps1` |
| A **fresh Ubuntu server** with a domain name: installs Docker + HTTPS for you | [`install/4-ubuntu-one-command`](install/4-ubuntu-one-command/README.md) | `sudo bash install/4-ubuntu-one-command/setup.sh` |
| **Kubernetes / OpenShift** (Rancher, Tanzu, AKS, EKS, GKE, k3s …) | [`install/5-kubernetes`](install/5-kubernetes/README.md) | `bash install/5-kubernetes/install.sh --registry … --domain …` |
| **Podman** (Red Hat Enterprise Linux, Rocky, Alma, Oracle Linux, Fedora) | [`install/6-podman`](install/6-podman/README.md) | `sudo bash install/6-podman/install.sh` |
| **macOS** (a Mac mini or Mac Studio as the server) | [`install/7-macos`](install/7-macos/README.md) | `sudo bash install/7-macos/install.sh` |
| **Cloud**: Azure Container Apps, AWS ECS/Fargate, Google Cloud Run | [`install/8-cloud`](install/8-cloud/README.md) | Step-by-step commands per cloud |
| **FreeBSD** | [`install/9-freebsd`](install/9-freebsd/README.md) | `sh install/9-freebsd/install.sh` |
| Anything else: VMware, Proxmox, Hyper-V, NAS (Synology, QNAP, TrueNAS), Raspberry Pi, PaaS … | [`install/OTHER-PLATFORMS.md`](install/OTHER-PLATFORMS.md) | Which type to use |

Not sure? A new Ubuntu VM with type **4** is the fastest (about 5 minutes). Each folder's README.md has the details and the upgrade steps.

## 2. Pick the database

Each installer asks for the database. The default is the **built-in SQLite**: nothing to install, and it's enough for most institutions. To keep ExamFlow's data in a database server you already run, your DBA creates one **empty** database and a user, and you put the connection in the settings. ExamFlow creates its own tables.

| Database | Setting | Protocol |
|---|---|---|
| Built-in SQLite | `DB_TYPE=sqlite` | (a file in the data folder) |
| **PostgreSQL** 12+ — also Amazon RDS / Aurora, Azure Database, Google Cloud SQL, Supabase, Neon, Crunchy, Timescale | `DB_TYPE=postgres` | PostgreSQL wire protocol |
| **MySQL** 8+ / **MariaDB** 10.6+ — also Amazon RDS / Aurora, Azure, Cloud SQL, Percona, PlanetScale, TiDB | `DB_TYPE=mysql` | MySQL protocol |
| **Microsoft SQL Server** 2017+ / **Azure SQL** | `DB_TYPE=mssql` | TDS |
| **Oracle Database** 19c+ (on-premises, Exadata, Autonomous Database) | `DB_TYPE=oracle` | Oracle Net (no Oracle Client needed) |
| **MongoDB** 5+ — also Atlas, Azure Cosmos DB for MongoDB, Amazon DocumentDB | `DB_TYPE=mongodb` | MongoDB wire protocol |
| **Firebird** 3, 4, 5 | `DB_TYPE=firebird` | Firebird wire protocol (encrypted) |
| **SAP HANA** 2.0 / HANA Cloud | `DB_TYPE=hana` | HANA SQL command network protocol |
| **IBM Db2** 11.5+ (Linux, UNIX, Windows) | `DB_TYPE=db2` | DRDA (IBM's driver, one command to add) |
| **Apache Cassandra**, ScyllaDB, DataStax Astra, Amazon Keyspaces | `DB_TYPE=cassandra` | CQL native protocol |
| **Amazon DynamoDB** | `DB_TYPE=dynamodb` | DynamoDB HTTPS API |
| **Google Cloud Firestore** | `DB_TYPE=firestore` | Firestore REST API |

[`DATABASES.md`](DATABASES.md) explains each one:
- what the DBA creates;
- how to encrypt the connection (TLS, your own CA, client certificates, Windows / Azure AD sign-in, Oracle wallets);
- backups;
- moving from SQLite to a database server later (`import-sqlite`).

[`install/database-scripts`](install/database-scripts/README.md) has ready scripts for DBAs who prefer to create the tables themselves.

## 3. After it runs

1. **Check:** `node server/src/cli.js check` passes. The installers run it for you. Compare the key fingerprint it prints with the one GHUM gave you.
2. **Database check** (external database): `node server/src/cli.js db-check` tests reading, writing, searching, undo, the append-only audit log and the speed.
3. **HTTPS** in front: type 4 sets it up for you. For the others see the folder's README (Caddy, nginx or IIS).
4. **Register** with GHUM's code: the installers ask for it.
5. **Teachers:**
   - `AUTH_MODE=local`: `node server/src/cli.js teacher-codes` gives each approved teacher a one-time activation code.
   - `AUTH_MODE=oidc`: teachers sign in with their university account.

   See [`TEACHER-ONBOARDING.md`](TEACHER-ONBOARDING.md).
6. **Reading models** (Bangla + English paper reader): `node server/src/cli.js fetch-models`.

Full reference:
- [`INSTALL.md`](INSTALL.md): requirements, every setting, licence, troubleshooting.
- [`DATA.md`](DATA.md): what is stored where.
- [`UPGRADE.md`](UPGRADE.md): new versions and recovery.
- [`CHECKLIST.md`](CHECKLIST.md): go-live checklist.
