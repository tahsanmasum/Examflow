-- ExamFlow institution server: database schema for SQL Server 2017+ / Azure SQL
-- Schema version 2. Run it connected to the EMPTY database (or schema) made for ExamFlow,
-- as its owner or an admin. Safe to run twice. Then give the ExamFlow user the rights listed in DATABASES.md.

-- indexes on computed columns need these (sqlcmd turns QUOTED_IDENTIFIER off unless run with -I)
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- ── step 1 ──
IF OBJECT_ID(N'meta', N'U') IS NULL CREATE TABLE meta (k NVARCHAR(191) COLLATE Latin1_General_100_BIN2 NOT NULL PRIMARY KEY, v NVARCHAR(MAX) COLLATE Latin1_General_100_BIN2)
GO
IF OBJECT_ID(N'docs', N'U') IS NULL CREATE TABLE docs (col NVARCHAR(64) COLLATE Latin1_General_100_BIN2 NOT NULL, id NVARCHAR(300) COLLATE Latin1_General_100_BIN2 NOT NULL, data NVARCHAR(MAX) COLLATE Latin1_General_100_BIN2 NOT NULL, created BIGINT NOT NULL, updated BIGINT NOT NULL, g_examToken AS CAST(LEFT(JSON_VALUE(data, '$.examToken'), 300) AS NVARCHAR(300)), g_teacherUid AS CAST(LEFT(JSON_VALUE(data, '$.teacherUid'), 300) AS NVARCHAR(300)), g_switchCode AS CAST(LEFT(JSON_VALUE(data, '$.switchCode'), 300) AS NVARCHAR(300)), CONSTRAINT pk_docs PRIMARY KEY (col, id))
GO
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'docs_examToken' AND object_id = OBJECT_ID(N'docs')) CREATE INDEX docs_examToken ON docs (col, g_examToken)
GO
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'docs_teacherUid' AND object_id = OBJECT_ID(N'docs')) CREATE INDEX docs_teacherUid ON docs (col, g_teacherUid)
GO
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'docs_switchCode' AND object_id = OBJECT_ID(N'docs')) CREATE INDEX docs_switchCode ON docs (col, g_switchCode)
GO
IF OBJECT_ID(N'users', N'U') IS NULL CREATE TABLE users (uid NVARCHAR(191) COLLATE Latin1_General_100_BIN2 NOT NULL PRIMARY KEY, email NVARCHAR(320) COLLATE Latin1_General_100_BIN2 NOT NULL UNIQUE, name NVARCHAR(MAX) COLLATE Latin1_General_100_BIN2, pass_hash NVARCHAR(MAX) COLLATE Latin1_General_100_BIN2, source NVARCHAR(32) COLLATE Latin1_General_100_BIN2 NOT NULL, oidc_sub NVARCHAR(MAX) COLLATE Latin1_General_100_BIN2, created BIGINT NOT NULL, disabled INT NOT NULL DEFAULT 0)
GO
IF OBJECT_ID(N'codes', N'U') IS NULL CREATE TABLE codes (code_hash NVARCHAR(191) COLLATE Latin1_General_100_BIN2 NOT NULL PRIMARY KEY, email NVARCHAR(MAX) COLLATE Latin1_General_100_BIN2 NOT NULL, purpose NVARCHAR(MAX) COLLATE Latin1_General_100_BIN2 NOT NULL, created BIGINT NOT NULL, expires BIGINT NOT NULL, used BIGINT NULL)
GO
IF OBJECT_ID(N'logins', N'U') IS NULL CREATE TABLE logins (token_hash NVARCHAR(191) COLLATE Latin1_General_100_BIN2 NOT NULL PRIMARY KEY, uid NVARCHAR(MAX) COLLATE Latin1_General_100_BIN2 NOT NULL, created BIGINT NOT NULL, expires BIGINT NOT NULL)
GO
IF OBJECT_ID(N'oidc_state', N'U') IS NULL CREATE TABLE oidc_state (state NVARCHAR(191) COLLATE Latin1_General_100_BIN2 NOT NULL PRIMARY KEY, nonce NVARCHAR(MAX) COLLATE Latin1_General_100_BIN2 NOT NULL, verifier NVARCHAR(MAX) COLLATE Latin1_General_100_BIN2 NOT NULL, created BIGINT NOT NULL)
GO
IF OBJECT_ID(N'allowlist', N'U') IS NULL CREATE TABLE allowlist (teacher_id NVARCHAR(191) COLLATE Latin1_General_100_BIN2 NOT NULL PRIMARY KEY, email NVARCHAR(320) COLLATE Latin1_General_100_BIN2 NOT NULL UNIQUE, name NVARCHAR(MAX) COLLATE Latin1_General_100_BIN2, version INT NOT NULL)
GO
IF OBJECT_ID(N'allowlist_history', N'U') IS NULL CREATE TABLE allowlist_history (n BIGINT IDENTITY(1,1) PRIMARY KEY, t BIGINT NOT NULL, package_id NVARCHAR(MAX) COLLATE Latin1_General_100_BIN2, package_version NVARCHAR(MAX) COLLATE Latin1_General_100_BIN2, list_version INT, added INT, removed INT, total INT)
GO
IF OBJECT_ID(N'audit', N'U') IS NULL CREATE TABLE audit (n BIGINT IDENTITY(1,1) PRIMARY KEY, t BIGINT NOT NULL, actor NVARCHAR(MAX) COLLATE Latin1_General_100_BIN2, action NVARCHAR(MAX) COLLATE Latin1_General_100_BIN2 NOT NULL, target NVARCHAR(MAX) COLLATE Latin1_General_100_BIN2, result NVARCHAR(MAX) COLLATE Latin1_General_100_BIN2 NOT NULL, detail NVARCHAR(MAX) COLLATE Latin1_General_100_BIN2)
GO
-- append-only protection for the audit log (audit_append_only)
CREATE OR ALTER TRIGGER audit_append_only ON audit INSTEAD OF UPDATE, DELETE AS BEGIN SET NOCOUNT ON; THROW 51000, 'the audit log is append-only', 1; END
GO

-- ── step 2 ──
IF OBJECT_ID(N'inbox', N'U') IS NULL CREATE TABLE inbox (msg_id NVARCHAR(191) COLLATE Latin1_General_100_BIN2 NOT NULL, email NVARCHAR(320) COLLATE Latin1_General_100_BIN2 NOT NULL, delivered_at BIGINT NULL, read_at BIGINT NULL, archived_at BIGINT NULL, CONSTRAINT pk_inbox PRIMARY KEY NONCLUSTERED (msg_id, email))
GO

-- record which schema version this database has
UPDATE meta SET v = '2' WHERE k = 'schema_version'; IF @@ROWCOUNT = 0 INSERT INTO meta (k, v) VALUES ('schema_version', '2')
GO


