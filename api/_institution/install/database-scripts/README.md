# Database scripts for DBAs

These scripts are for DBAs who create ExamFlow's tables themselves, with an admin account. ExamFlow's own user then only needs to read and write rows. If the ExamFlow user may create tables, you don't need these: ExamFlow creates everything on its first start.

| File | For | Run with |
|---|---|---|
| `postgres.sql` | PostgreSQL 12+ | `psql -d examflow -f postgres.sql` |
| `mysql.sql` | MySQL 8+ / MariaDB 10.6+ | `mysql -u root -p examflow < mysql.sql` |
| `mssql.sql` | SQL Server 2017+ / Azure SQL | `sqlcmd -S server -d examflow -i mssql.sql`, or SSMS |
| `oracle.sql` | Oracle 19c+ | SQL*Plus / SQLcl, as the EXAMFLOW user or with `CURRENT_SCHEMA` set |
| `mongodb.js` | MongoDB 5+ / Atlas | `mongosh "mongodb://ADMIN@host/admin" --file mongodb.js` |
| `firebird.sql` | Firebird 3+ | `isql-fb -user SYSDBA -i firebird.sql localhost:/path/examflow.fdb` |
| `hana.sql` | SAP HANA 2.0 / HANA Cloud | `hdbsql -n HOST:PORT -u ADMIN -c "#" -mI hana.sql`, after `SET SCHEMA EXAMFLOW` |
| `db2.sql` | IBM Db2 11.5+ | `db2 connect to EXAMFLOW && db2 -td@ -vf db2.sql` |
| `cassandra.cql` | Cassandra / ScyllaDB / Astra / Keyspaces | `cqlsh -f cassandra.cql`, after setting the replication |
| `dynamodb.json` | Amazon DynamoDB | `aws dynamodb create-table --cli-input-json file://dynamodb.json` |

Each script:
- creates every table, index and the audit log's append-only protection (triggers; the MongoDB script uses a role instead);
- records the schema version;
- is safe to run twice.

The rights to give ExamFlow's user afterwards are in [`DATABASES.md`](../../DATABASES.md).

Generate a script for this exact server version at any time with `node server/src/cli.js db-schema --type postgres`. This needs no settings and no connection.
