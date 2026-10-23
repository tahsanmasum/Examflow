-- ExamFlow institution server: database schema for MySQL 8+ / MariaDB 10.6+
-- Schema version 2. Run it connected to the EMPTY database (or schema) made for ExamFlow,
-- as its owner or an admin. Safe to run twice. Then give the ExamFlow user the rights listed in DATABASES.md.

-- (Run with the mysql command-line client:  mysql -u admin -p examflow < mysql.sql)

-- ── step 1 ──
CREATE TABLE IF NOT EXISTS meta (k VARCHAR(191) NOT NULL PRIMARY KEY, v LONGTEXT) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
CREATE TABLE IF NOT EXISTS docs (col VARCHAR(64) NOT NULL, id VARCHAR(300) NOT NULL, data LONGTEXT NOT NULL, created BIGINT NOT NULL, updated BIGINT NOT NULL, g_examToken VARCHAR(255) AS (LEFT(CASE WHEN JSON_TYPE(JSON_EXTRACT(data, '$.examToken')) = 'NULL' THEN NULL ELSE JSON_UNQUOTE(JSON_EXTRACT(data, '$.examToken')) END, 255)) VIRTUAL, g_teacherUid VARCHAR(255) AS (LEFT(CASE WHEN JSON_TYPE(JSON_EXTRACT(data, '$.teacherUid')) = 'NULL' THEN NULL ELSE JSON_UNQUOTE(JSON_EXTRACT(data, '$.teacherUid')) END, 255)) VIRTUAL, g_switchCode VARCHAR(255) AS (LEFT(CASE WHEN JSON_TYPE(JSON_EXTRACT(data, '$.switchCode')) = 'NULL' THEN NULL ELSE JSON_UNQUOTE(JSON_EXTRACT(data, '$.switchCode')) END, 255)) VIRTUAL, PRIMARY KEY (col, id), KEY docs_examToken (col, g_examToken), KEY docs_teacherUid (col, g_teacherUid), KEY docs_switchCode (col, g_switchCode)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
CREATE TABLE IF NOT EXISTS users (uid VARCHAR(191) NOT NULL PRIMARY KEY, email VARCHAR(320) NOT NULL UNIQUE, name TEXT, pass_hash TEXT, source VARCHAR(32) NOT NULL, oidc_sub TEXT, created BIGINT NOT NULL, disabled INT NOT NULL DEFAULT 0) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
CREATE TABLE IF NOT EXISTS codes (code_hash VARCHAR(191) NOT NULL PRIMARY KEY, email TEXT NOT NULL, purpose TEXT NOT NULL, created BIGINT NOT NULL, expires BIGINT NOT NULL, used BIGINT NULL) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
CREATE TABLE IF NOT EXISTS logins (token_hash VARCHAR(191) NOT NULL PRIMARY KEY, uid TEXT NOT NULL, created BIGINT NOT NULL, expires BIGINT NOT NULL) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
CREATE TABLE IF NOT EXISTS oidc_state (state VARCHAR(191) NOT NULL PRIMARY KEY, nonce TEXT NOT NULL, verifier TEXT NOT NULL, created BIGINT NOT NULL) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
CREATE TABLE IF NOT EXISTS allowlist (teacher_id VARCHAR(191) NOT NULL PRIMARY KEY, email VARCHAR(320) NOT NULL UNIQUE, name TEXT, version INT NOT NULL) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
CREATE TABLE IF NOT EXISTS allowlist_history (n BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY, t BIGINT NOT NULL, package_id TEXT, package_version TEXT, list_version INT, added INT, removed INT, total INT) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
CREATE TABLE IF NOT EXISTS audit (n BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY, t BIGINT NOT NULL, actor TEXT, action TEXT NOT NULL, target TEXT, result TEXT NOT NULL, detail LONGTEXT) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
-- append-only protection for the audit log (audit_no_update)
DROP TRIGGER IF EXISTS audit_no_update;
CREATE TRIGGER audit_no_update BEFORE UPDATE ON audit FOR EACH ROW SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'the audit log is append-only';
-- append-only protection for the audit log (audit_no_delete)
DROP TRIGGER IF EXISTS audit_no_delete;
CREATE TRIGGER audit_no_delete BEFORE DELETE ON audit FOR EACH ROW SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'the audit log is append-only';

-- ── step 2 ──
CREATE TABLE IF NOT EXISTS inbox (msg_id VARCHAR(191) NOT NULL, email VARCHAR(320) NOT NULL, delivered_at BIGINT NULL, read_at BIGINT NULL, archived_at BIGINT NULL, PRIMARY KEY (msg_id, email)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- record which schema version this database has
INSERT INTO meta (k, v) VALUES ('schema_version', '2') ON DUPLICATE KEY UPDATE v = VALUES(v);

