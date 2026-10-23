# Databases

ExamFlow keeps everything for your institution in one database:

- exams, questions and pictures;
- student attempts, answers, photos and marks;
- camera alerts and feedback;
- teacher accounts;
- the audit log.

Choose it with `DB_TYPE` in the settings file. That is `.env`, or for types 2 and 3 the file the installer names. Nothing here is ever sent to GHUM.

| `DB_TYPE` | Database | Tested by GHUM on | Notes |
|---|---|---|---|
| `sqlite` (default) | built in | every release | One file in the data folder. Nothing to install or administer. |
| `postgres` | PostgreSQL 12+ | PostgreSQL 16 | Recommended database server. |
| `mysql` | MySQL 8+, MariaDB 10.6+ | MySQL 8.0, MariaDB 10.11 | `mariadb` is accepted as a name too. |
| `mssql` | SQL Server 2017+, Azure SQL | built to Microsoft's TDS specification | Run `db-check` on first install. |
| `oracle` | Oracle Database 19c+ | built to Oracle's specification | Run `db-check` on first install. |
| `mongodb` | MongoDB 5+ | MongoDB 8.0 (replica set) | Use a replica set; Atlas always is one. |
| `firebird` | Firebird 3, 4, 5 | Firebird 3.0 | Encrypted connection by default. |
| `dynamodb` | Amazon DynamoDB | the DynamoDB API on a local emulator | No multi-row undo; see below. |
| `firestore` | Google Cloud Firestore (Native mode) | a stand-in that follows Google's REST API (not Google itself) | No multi-row undo; run `db-check` on first install. |
| `cassandra` | Apache Cassandra 3.11+ / 4 / 5, ScyllaDB, DataStax Astra, Amazon Keyspaces, Azure Cosmos DB for Cassandra | built to the CQL specification | No multi-row undo; run `db-check` on first install. |
| `hana` | SAP HANA 2.0 SPS05+, SAP HANA Cloud | built to SAP's specification | Run `db-check` on first install. |
| `db2` | IBM Db2 for Linux, UNIX and Windows 11.5+ | built to IBM's specification | Needs IBM's driver: `node server/src/cli.js add-driver db2`. |

On Cassandra, DynamoDB and Firestore a group of changes is not undone together if the connection fails halfway (for example, while a new teacher list is applied). ExamFlow then repeats the change at the next check-in. Their accounts also can't be stopped from editing the audit log: ExamFlow itself never edits it, but the database doesn't enforce that. Choose them when the university already runs them; otherwise prefer PostgreSQL.

On the next start ExamFlow creates its tables, indexes and protections by itself. Changes only ever **add**; ExamFlow never drops or rewrites your data. With SQLite a copy is saved before an upgrade changes the database. **With a database server, back it up with its own tools before upgrading ExamFlow.**

**The same protocol reaches the cloud versions.** Use the setting for the engine underneath:

| Service | Use |
|---|---|
| Amazon RDS / Aurora PostgreSQL, Azure Database for PostgreSQL, Google Cloud SQL (PostgreSQL), Supabase, Neon, Crunchy Bridge, Timescale, YugabyteDB, CockroachDB* | `postgres` |
| Amazon RDS / Aurora MySQL or MariaDB, Azure Database for MySQL, Google Cloud SQL (MySQL), Percona Server, PlanetScale*, TiDB*, SingleStore* | `mysql` |
| Azure SQL Database, Azure SQL Managed Instance, Amazon RDS for SQL Server, SQL Server on Linux | `mssql` |
| Oracle Autonomous Database, Exadata, Amazon RDS for Oracle, Oracle Base Database Service | `oracle` |
| MongoDB Atlas, Azure Cosmos DB for MongoDB (vCore), Amazon DocumentDB*, FerretDB* | `mongodb` |
| ScyllaDB, DataStax Astra, Amazon Keyspaces*, Azure Cosmos DB for Apache Cassandra* | `cassandra` |
| SAP HANA Cloud | `hana` |
| Amazon DynamoDB (any region) | `dynamodb` |
| Google Cloud Firestore (Native mode); a Firebase project's Firestore | `firestore` |

You may also write the product's own name in `DB_TYPE`, and ExamFlow picks the protocol and the right defaults:
- `cockroachdb`, `yugabytedb`, `alloydb`, `aurora-postgresql`, `supabase`, `neon`, `timescaledb`, `citus`, `edb`;
- `tidb`, `planetscale`, `vitess`, `singlestore`, `percona`, `aurora-mysql`;
- `azuresql`;
- `documentdb`, `cosmosdb-mongodb`, `ferretdb`, `atlas`;
- `scylladb`, `astra`, `keyspaces`, `cosmosdb-cassandra`;
- `saphana`, `hana-cloud`;
- `firebase`.

TiDB, PlanetScale, Vitess and SingleStore automatically get `DB_AUDIT_TRIGGERS=0`, since they have no triggers. On CockroachDB and YugabyteDB a missing trigger feature becomes a warning instead of an error.

\* These are compatible with the engine but not the same; run `db-check` first. Engines without triggers (TiDB, PlanetScale/Vitess, some CockroachDB versions) need `DB_AUDIT_TRIGGERS=0`. ExamFlow then keeps the audit log append-only by itself.

**Not supported, and why:**
- **Informix, Sybase / SAP ASE, Ingres:** they need vendor client libraries that can't be shipped in the package.
- **Db2 for z/OS and Db2 for i:** different system catalogues from Db2 LUW.
- **Teradata, Snowflake, BigQuery, Redshift, ClickHouse, Synapse:** analytics warehouses without fast single-row reads and writes, so they're unsuitable for a live exam app.
- **Redis, Memcached, Elasticsearch / OpenSearch:** caches and search engines, not durable primary databases.
- **Couchbase, CouchDB, Neo4j, ArangoDB, InfluxDB:** rare at universities. They can be added on request.

If your institution only runs one of these, use the built-in SQLite, or a small PostgreSQL next to ExamFlow (type 1: `install.sh --with postgres`).

---

## What the DBA creates

One empty database (or schema) and one user for ExamFlow. Then **either**:

- **A. ExamFlow creates its tables.** The user owns the database and can create tables, indexes and triggers. This is simplest.
- **B. The DBA creates the tables.** The DBA runs the script for the engine from [`install/database-scripts`](install/database-scripts/README.md) with an admin account. ExamFlow's user then only needs to read and write rows (SELECT, INSERT, UPDATE, DELETE). Use B when policy forbids applications from changing the schema.

Copy-paste examples (change the password):

**PostgreSQL**
```sql
CREATE ROLE examflow LOGIN PASSWORD 'change-me';
CREATE DATABASE examflow OWNER examflow ENCODING 'UTF8';
-- B instead: CREATE DATABASE examflow;  \c examflow  \i postgres.sql
--   GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO examflow;
--   GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO examflow;
```

**MySQL / MariaDB** (use `utf8mb4_bin`: ExamFlow needs exact, case-sensitive matching)
```sql
CREATE DATABASE examflow CHARACTER SET utf8mb4 COLLATE utf8mb4_bin;
CREATE USER 'examflow'@'%' IDENTIFIED BY 'change-me';
GRANT ALL PRIVILEGES ON examflow.* TO 'examflow'@'%';
```

Binary logging is on by default in MySQL 8. With it on, an ordinary user may not create triggers. Use B: `mysql -u root -p examflow < mysql.sql`, then grant only SELECT, INSERT, UPDATE and DELETE. If you'd rather allow A, a DBA sets `log_bin_trust_function_creators = 1`.

**SQL Server / Azure SQL**
```sql
CREATE DATABASE examflow;
GO
USE examflow;
CREATE LOGIN examflow WITH PASSWORD = 'Change-me-1!';   -- Azure SQL: CREATE USER examflow WITH PASSWORD = '…' in the database
CREATE USER examflow FOR LOGIN examflow;
ALTER ROLE db_owner ADD MEMBER examflow;                 -- B instead: run mssql.sql, then db_datareader + db_datawriter
```

**Oracle** (a PDB user; the tables live in its schema)
```sql
CREATE USER examflow IDENTIFIED BY "Change-me-1" DEFAULT TABLESPACE users QUOTA UNLIMITED ON users;
GRANT CREATE SESSION, CREATE TABLE, CREATE TRIGGER TO examflow;
-- B instead: connect as EXAMFLOW (or ALTER SESSION SET CURRENT_SCHEMA) and run oracle.sql in SQL*Plus / SQLcl
```

**MongoDB**: run [`install/database-scripts/mongodb.js`](install/database-scripts/mongodb.js) with `mongosh` as an admin. It creates the database's role and user. The role can read the audit log and add to it, but can't change or delete it.

**Firebird** (UTF8; the ExamFlow user owns the database)
```sql
-- as SYSDBA, in any database:  GRANT CREATE DATABASE TO USER examflow;   CREATE USER examflow PASSWORD 'change-me';
CREATE DATABASE 'localhost:/var/lib/firebird/data/examflow.fdb' USER 'examflow' PASSWORD 'change-me' PAGE_SIZE 8192 DEFAULT CHARACTER SET UTF8;
-- B instead: create it as SYSDBA, run firebird.sql with isql, then GRANT SELECT, INSERT, UPDATE, DELETE ON each table TO USER examflow
```
`DB_NAME` is the database path on the Firebird server, or its alias from `databases.conf`.

**SAP HANA** (a schema owned by the ExamFlow user)
```sql
CREATE USER EXAMFLOW PASSWORD "Change-me-1" NO FORCE_FIRST_PASSWORD_CHANGE;   -- the user's own schema EXAMFLOW holds the tables
-- B instead: run hana.sql as an admin with SET SCHEMA EXAMFLOW, then GRANT SELECT, INSERT, UPDATE, DELETE ON SCHEMA EXAMFLOW TO <app user>
```
Set `DB_NAME=EXAMFLOW` (the schema). For HANA Cloud: `DB_PORT=443` and `DB_SSL=1`. For a tenant database on-premises: `DB_TENANT`.

**IBM Db2** (LUW 11.5+)
```sql
CREATE DATABASE EXAMFLOW USING CODESET UTF-8 TERRITORY US PAGESIZE 8 K;
-- connect, then:  GRANT DBADM ON DATABASE TO USER EXAMFLOW;   (B instead: db2 -td@ -vf db2.sql as the instance owner, then data rights)
```
Install IBM's driver once on the ExamFlow server: `node server/src/cli.js add-driver db2`. It needs internet access and npm, and on Linux/macOS python3, make and a C++ compiler. IBM's installer downloads the IBM Data Server Driver.

**Cassandra / ScyllaDB / Astra / Keyspaces**: run [`install/database-scripts/cassandra.cql`](install/database-scripts/cassandra.cql) with `cqlsh`, after setting the replication for your data centres. It creates the keyspace, two tables and the role. Settings:
- `DB_HOST`: one or more contact points, comma-separated;
- `DB_DATACENTER`: the local data-centre name;
- `DB_NAME`: the keyspace;
- `DB_USER` and `DB_PASSWORD`.

For DataStax Astra, set `DB_SECURE_BUNDLE=/path/secure-connect-examflow.zip`, with the client ID as the user and the secret as the password. For Amazon Keyspaces, use `DB_SSL=1`, port 9142, and service-specific credentials.

**Amazon DynamoDB**: ExamFlow creates one on-demand table (`DB_NAME`, default `examflow`) if its AWS identity may. Otherwise create it from [`install/database-scripts/dynamodb.json`](install/database-scripts/dynamodb.json). Give ExamFlow's identity only this policy, and turn on point-in-time recovery:
```json
{ "Version": "2012-10-17", "Statement": [{ "Effect": "Allow",
  "Action": ["dynamodb:GetItem","dynamodb:PutItem","dynamodb:DeleteItem","dynamodb:UpdateItem","dynamodb:Query","dynamodb:DescribeTable","dynamodb:CreateTable","dynamodb:ListTables"],
  "Resource": "arn:aws:dynamodb:REGION:ACCOUNT:table/examflow" }] }
```
On EC2, ECS or EKS use the machine's IAM role, and leave `DB_ACCESS_KEY_ID` / `DB_SECRET_ACCESS_KEY` out.

**Google Cloud Firestore** (Native mode, in the university's own Google Cloud project):
1. Create a Firestore database.
2. Create a service account with the role **Cloud Datastore User**.
3. Either download its key and set `DB_CREDENTIALS_FILE=/path/key.json`, or run ExamFlow on Google Cloud, where the machine's account is used.

Set `DB_PROJECT`. `DB_NAME` names the top collection (default `examflow`).

---

## Connection settings

Use **either** one `DB_URL` **or** the separate parts. Separate parts are easier when the password contains `@ : / ? #`.

```ini
DB_TYPE=postgres
DB_HOST=db.your-university.edu
DB_PORT=5432
DB_NAME=examflow
DB_USER=examflow
DB_PASSWORD=change-me
```

| `DB_TYPE` | `DB_URL` example | Default port |
|---|---|---|
| postgres | `postgres://examflow:PASS@db.uni.edu:5432/examflow?sslmode=require` | 5432 |
| mysql | `mysql://examflow:PASS@db.uni.edu:3306/examflow` | 3306 |
| mssql | `mssql://examflow:PASS@sql.uni.edu:1433/examflow` | 1433 |
| oracle | `oracle://examflow:PASS@ora.uni.edu:1521/EXAMPDB` (the service name after `/`) | 1521 |
| mongodb | `mongodb://examflow:PASS@m1.uni.edu,m2.uni.edu/examflow?replicaSet=rs0&authSource=examflow` | 27017 |
| mongodb (Atlas) | `mongodb+srv://examflow:PASS@cluster0.xxxxx.mongodb.net/examflow` | – |

### Encryption and sign-in

Encrypt the connection whenever the database is on another machine.

| Setting | Meaning |
|---|---|
| `DB_SSL=1` | Encrypt the connection (TLS). SQL Server encrypts by default; `DB_SSL=0` turns it off. MongoDB: put `tls=true` in `DB_URL`; `mongodb+srv` turns it on by itself. |
| `DB_SSL_CA=/path/ca.pem` | Trust your institution's own certificate authority. |
| `DB_SSL_VERIFY=0` | Accept any server certificate. For testing only. `sslmode=require` in a PostgreSQL URL means the same, as in libpq. |
| `DB_SSL_CERT=/path/client.crt`, `DB_SSL_KEY=/path/client.key` | Client certificate (mutual TLS) for PostgreSQL and MySQL. MongoDB X.509: one PEM with both in `DB_SSL_CERT`, plus `authMechanism=MONGODB-X509` in `DB_URL`. |
| `DB_TRUST_SERVER_CERTIFICATE=1` | SQL Server with its own self-signed certificate. |
| `DB_SOCKET=/run/mysqld/mysqld.sock` | MySQL / MariaDB on the same machine, through its socket. For PostgreSQL write the socket folder as the host: `DB_HOST=/var/run/postgresql`. |
| `DB_INSTANCE=SQLEXPRESS` | SQL Server named instance (instead of a port). |
| `DB_AUTH=windows` + `DB_DOMAIN` | SQL Server with a Windows / Active Directory account (NTLM). |
| `DB_AUTH=azure-ad-password` + `DB_CLIENT_ID` (+ `DB_TENANT_ID`) | Azure SQL with a Microsoft Entra ID user and password. |
| `DB_AUTH=azure-ad-service-principal` + `DB_CLIENT_ID`, `DB_CLIENT_SECRET`, `DB_TENANT_ID` | Azure SQL with an app registration. |
| `DB_AUTH=azure-ad-managed-identity` (+ `DB_CLIENT_ID`) | Azure SQL from an Azure VM or App Service with a managed identity. No password. |
| `DB_CONNECT_STRING` | Oracle. One of:<ul><li>Easy Connect: `ora.uni.edu:1521/EXAMPDB`</li><li>a full `(DESCRIPTION=…)`, for example TCPS on port 2484</li><li>a `tnsnames.ora` alias, with `DB_TNS_ADMIN=/folder/with/tnsnames.ora`</li></ul> |
| `DB_WALLET_DIR`, `DB_WALLET_PASSWORD` | Oracle wallet: Autonomous Database, or mutual TLS. Unzip the wallet into a folder and point here. |
| `DB_AUTH_SOURCE=admin` | MongoDB: the database that holds the user, when it's not in `DB_URL`. |
| `DB_AUDIT_TRIGGERS=0` | For engines without triggers, described above. |
| `DB_ROLE` | Firebird role. |
| `DB_TENANT` | SAP HANA tenant database. |
| `DB_SCHEMA` | Db2 schema. |
| `DB_DATACENTER`, `DB_CONSISTENCY` | Cassandra local data centre, and consistency level (default `localQuorum`). |
| `DB_SECURE_BUNDLE` | DataStax Astra secure connect bundle. |
| `DB_REGION`, `DB_ACCESS_KEY_ID`, `DB_SECRET_ACCESS_KEY`, `DB_SESSION_TOKEN` | Amazon DynamoDB. `DB_URL=http://localhost:8000` for DynamoDB Local. |
| `DB_PROJECT`, `DB_CREDENTIALS_FILE`, `DB_FIRESTORE_DATABASE` | Google Cloud Firestore. `DB_URL` for the Firestore emulator. |

With Docker:
- A database on the **same machine** is `DB_HOST=host.docker.internal`.
- Certificate and wallet files go in a `certs/` folder inside the package folder. Write them as `/app/certs/…` in the settings.

**Not supported:**
- Kerberos/GSSAPI sign-in to PostgreSQL or MongoDB, and AWS IAM sign-in. These need extra system libraries.
- SQL Server named pipes. Use TCP.
- Oracle "thick mode" features such as native network encryption without TLS. Use TCPS.

---

## Check it

```
node server/src/cli.js db-check
```

It tests:
- the connection and the server version;
- writing and reading a document (with Bangla text);
- updates;
- exact, case-sensitive searches;
- undo (transactions);
- that the audit log refuses changes and deletions;
- the speed per request.

Keep the database close to the ExamFlow server, on the same network or data centre. Each request is one round trip; under 2 ms is ideal. `db-check` warns above 20 ms.

**MongoDB without a replica set:** ExamFlow works, but a group of changes can't be undone together. Make the server a one-member replica set:

1. Add `replication: { replSetName: rs0 }` to `mongod.conf`.
2. Restart it.
3. Run `rs.initiate()` once.

## Moving from SQLite to a database server

You can start on SQLite and move later. Keep the same data folder: it also holds the server's identity key.

1. Stop ExamFlow and back up the data folder.
2. In the settings, set `DB_TYPE` and the connection. Keep `DATA_DIR` the same.
3. Run `node server/src/cli.js import-sqlite`. It reads `DATA_DIR/examflow.db` (or `--from FILE`) and copies everything into the empty database server. Then `db-check`.
4. Start ExamFlow. Keep the `.db` file as a backup until you've checked everything.

## Backups

| Database | Backup |
|---|---|
| SQLite | `node server/src/cli.js backup`. This writes a copy to `DATA_DIR/backups/`. Also back up the whole data folder. |
| PostgreSQL | `pg_dump -Fc examflow > examflow.dump` |
| MySQL / MariaDB | `mysqldump --single-transaction --routines --triggers examflow > examflow.sql` |
| SQL Server | `BACKUP DATABASE examflow TO DISK = 'D:\backup\examflow.bak'`, or your existing maintenance plan |
| Oracle | RMAN, or Data Pump: `expdp examflow schemas=EXAMFLOW` |
| MongoDB | `mongodump --db examflow`, or Atlas backups |
| Firebird | `gbak -b -user SYSDBA localhost:/path/examflow.fdb examflow.fbk`, or `nbackup` |
| SAP HANA | `BACKUP DATA USING FILE ('examflow')`, or HANA Cloud's automatic backups |
| IBM Db2 | `db2 backup database EXAMFLOW online to /backup` |
| Cassandra | `nodetool snapshot examflow` on every node, or your managed service's backups |
| DynamoDB | Point-in-time recovery (turn it on for the table), or AWS Backup |
| Firestore | Scheduled exports (`gcloud firestore export gs://BUCKET`), or point-in-time recovery |

**Always** back up the data folder as well. It holds `server-identity.pem`, the server's identity with GHUM. Without it the server must be registered again.

## Problems

| Message | What to do |
|---|---|
| `Could not connect to … ECONNREFUSED / ETIMEDOUT` | Wrong host or port, or a firewall between the servers. Docker: `host.docker.internal` for the same machine. |
| `password authentication failed` / `Login failed` / `ORA-01017` / `Authentication failed` | Wrong user or password. For special characters use `DB_PASSWORD` instead of `DB_URL`. |
| `self-signed certificate` / `unable to verify` | Set `DB_SSL_CA` to your CA, or for SQL Server `DB_TRUST_SERVER_CERTIFICATE=1`. |
| `You do not have the SUPER privilege and binary logging is enabled` | MySQL 8: use way B above, or set `log_bin_trust_function_creators = 1`. |
| `permission denied` / `ORA-01031` / `not authorized` | The ExamFlow user may not create tables. Use way B, or give it ownership of its database. |
| `searches ignore upper/lower case` in `db-check` | MySQL: create the database with `COLLATE utf8mb4_bin`. |
| `IBM Db2 needs IBM's own driver` | Run `node server/src/cli.js add-driver db2` once. |
| `Incompatible wire encryption levels` (Firebird) | The server's `WireCrypt` setting doesn't match. Leave `DB_SSL` unset to encrypt, which Firebird 3+ servers require by default. |
| `Keyspace … does not exist` | Cassandra: create it with `cassandra.cql` (or the managed service's console). |
| `the protection triggers are missing` | Run the engine's script from `install/database-scripts` as an admin, or set `DB_AUDIT_TRIGGERS=0` on engines without triggers. |
