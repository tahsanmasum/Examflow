-- ExamFlow institution server: database schema for PostgreSQL 12+
-- Schema version 2. Run it connected to the EMPTY database (or schema) made for ExamFlow,
-- as its owner or an admin. Safe to run twice. Then give the ExamFlow user the rights listed in DATABASES.md.

-- ── step 1 ──
CREATE TABLE IF NOT EXISTS meta (k TEXT PRIMARY KEY, v TEXT);
CREATE TABLE IF NOT EXISTS docs (col TEXT NOT NULL, id TEXT NOT NULL, data TEXT NOT NULL, created BIGINT NOT NULL, updated BIGINT NOT NULL, PRIMARY KEY (col, id));
CREATE INDEX IF NOT EXISTS docs_examtoken ON docs (col, ((data::jsonb)->>'examToken'));
CREATE INDEX IF NOT EXISTS docs_teacheruid ON docs (col, ((data::jsonb)->>'teacherUid'));
CREATE INDEX IF NOT EXISTS docs_switchcode ON docs (col, ((data::jsonb)->>'switchCode'));
CREATE TABLE IF NOT EXISTS users (uid TEXT PRIMARY KEY, email TEXT NOT NULL UNIQUE, name TEXT, pass_hash TEXT, source TEXT NOT NULL, oidc_sub TEXT, created BIGINT NOT NULL, disabled INTEGER NOT NULL DEFAULT 0);
CREATE TABLE IF NOT EXISTS codes (code_hash TEXT PRIMARY KEY, email TEXT NOT NULL, purpose TEXT NOT NULL, created BIGINT NOT NULL, expires BIGINT NOT NULL, used BIGINT);
CREATE TABLE IF NOT EXISTS logins (token_hash TEXT PRIMARY KEY, uid TEXT NOT NULL, created BIGINT NOT NULL, expires BIGINT NOT NULL);
CREATE TABLE IF NOT EXISTS oidc_state (state TEXT PRIMARY KEY, nonce TEXT NOT NULL, verifier TEXT NOT NULL, created BIGINT NOT NULL);
CREATE TABLE IF NOT EXISTS allowlist (teacher_id TEXT PRIMARY KEY, email TEXT NOT NULL UNIQUE, name TEXT, version INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS allowlist_history (n BIGSERIAL PRIMARY KEY, t BIGINT NOT NULL, package_id TEXT, package_version TEXT, list_version INTEGER, added INTEGER, removed INTEGER, total INTEGER);
CREATE TABLE IF NOT EXISTS audit (n BIGSERIAL PRIMARY KEY, t BIGINT NOT NULL, actor TEXT, action TEXT NOT NULL, target TEXT, result TEXT NOT NULL, detail TEXT);
-- append-only protection for the audit log (audit_no_change)
CREATE OR REPLACE FUNCTION examflow_audit_append_only() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'the audit log is append-only'; END $$;
DROP TRIGGER IF EXISTS audit_no_change ON audit;
CREATE TRIGGER audit_no_change BEFORE UPDATE OR DELETE ON audit FOR EACH ROW EXECUTE FUNCTION examflow_audit_append_only();
-- append-only protection for the audit log (audit_no_truncate)
CREATE OR REPLACE FUNCTION examflow_audit_append_only() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'the audit log is append-only'; END $$;
DROP TRIGGER IF EXISTS audit_no_truncate ON audit;
CREATE TRIGGER audit_no_truncate BEFORE TRUNCATE ON audit FOR EACH STATEMENT EXECUTE FUNCTION examflow_audit_append_only();

-- ── step 2 ──
CREATE TABLE IF NOT EXISTS inbox (msg_id TEXT NOT NULL, email TEXT NOT NULL, delivered_at BIGINT, read_at BIGINT, archived_at BIGINT, PRIMARY KEY (msg_id, email));

-- record which schema version this database has
INSERT INTO meta (k, v) VALUES ('schema_version', '2') ON CONFLICT(k) DO UPDATE SET v = excluded.v;

