-- ExamFlow institution server: Apache Cassandra / ScyllaDB / DataStax Astra / Amazon Keyspaces / Cosmos DB for Cassandra
-- Run with cqlsh as an admin. Change the replication to match your cluster (NetworkTopologyStrategy with your
-- data-centre names and replica counts). ExamFlow creates its two tables itself if the user may; this creates them too.
CREATE KEYSPACE IF NOT EXISTS examflow
  WITH replication = {'class': 'NetworkTopologyStrategy', 'datacenter1': 3};

CREATE TABLE IF NOT EXISTS examflow.kv (t text, p text, s text, j text, PRIMARY KEY ((t, p), s));
CREATE TABLE IF NOT EXISTS examflow.counters (t text, k text, n counter, PRIMARY KEY ((t), k));

-- The ExamFlow user (with PasswordAuthenticator / CassandraAuthorizer):
CREATE ROLE IF NOT EXISTS examflow WITH PASSWORD = 'change-me' AND LOGIN = true;
GRANT SELECT ON KEYSPACE examflow TO examflow;
GRANT MODIFY ON KEYSPACE examflow TO examflow;
-- (Astra / Keyspaces / Cosmos DB: create the keyspace and the role in their console instead.)
