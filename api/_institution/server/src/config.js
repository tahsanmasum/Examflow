'use strict';
/* Reads and checks the server's settings (environment variables, usually from .env).
   Every problem is collected and reported together; the server refuses to start
   with an invalid configuration instead of guessing. */
const path = require('node:path');
const fs = require('node:fs');
const { normEmail, EMAIL_RE } = require('./util');

function loadDotEnv(file) {
  // Docker Compose passes .env itself; this is for running with plain `node`.
  if (!file || !fs.existsSync(file)) return;
  for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
    const m = /^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/.exec(line);
    if (!m || line.trim().startsWith('#')) continue;
    let v = m[2];
    if (/^".*"$/.test(v) || /^'.*'$/.test(v)) v = v.slice(1, -1);
    if (process.env[m[1]] === undefined) process.env[m[1]] = v;
  }
}

function readConfig(env = process.env) {
  const errors = [], warnings = [];
  const root = path.resolve(__dirname, '..', '..'); // the unpacked package folder
  const c = {
    packageDir: path.resolve(env.PACKAGE_DIR || root),
    dataDir: path.resolve(env.DATA_DIR || path.join(root, 'data')),
    port: Number(env.PORT || 8080),
    host: env.HOST || '0.0.0.0',
    publicUrl: String(env.PUBLIC_URL || '').replace(/\/+$/, ''),
    authMode: String(env.AUTH_MODE || 'local').toLowerCase(),
    trustProxy: env.TRUST_PROXY === '1' || env.TRUST_PROXY === 'true',
    admins: String(env.INSTITUTION_ADMIN_EMAILS || '').split(',').map(normEmail).filter(Boolean),
    oidc: {
      issuer: String(env.OIDC_ISSUER || '').replace(/\/+$/, ''),
      clientId: env.OIDC_CLIENT_ID || '',
      clientSecret: env.OIDC_CLIENT_SECRET || '',
      allowedDomains: String(env.OIDC_ALLOWED_DOMAINS || '').split(',').map(s => s.trim().toLowerCase()).filter(Boolean),
      label: env.OIDC_BUTTON_LABEL || 'Sign in with your institution account'
    },
    controlPlaneUrl: String(env.CONTROL_PLANE_URL || '').replace(/\/+$/, ''), // normally taken from the manifest
    licenceCheckSec: Number(env.LICENCE_CHECK_SECONDS || 60),
    offlineGraceDays: env.OFFLINE_GRACE_DAYS !== undefined ? Number(env.OFFLINE_GRACE_DAYS) : null,
    allowDowngrade: env.ALLOW_PACKAGE_DOWNGRADE === '1',
    modelsDir: env.MODELS_DIR ? path.resolve(env.MODELS_DIR) : null,
    sessionDays: Number(env.SESSION_DAYS || 14),
    logRequests: env.LOG_REQUESTS === '1',
    maxBodyBytes: 2 * 1024 * 1024
  };
  if (!c.modelsDir) c.modelsDir = path.join(c.dataDir, 'models');
  c.db = readDbConfig(env, errors, warnings);

  if (!c.publicUrl) errors.push('PUBLIC_URL is missing. Set it to the address teachers will open, e.g. https://examflow.your-university.edu');
  else {
    let u; try { u = new URL(c.publicUrl); } catch (e) { errors.push('PUBLIC_URL is not a valid web address: ' + c.publicUrl); }
    if (u) {
      const local = ['localhost', '127.0.0.1', '[::1]'].includes(u.hostname);
      if (u.protocol !== 'https:' && !local) errors.push('PUBLIC_URL must start with https:// (plain http is only allowed for localhost testing). Cameras and sign-in need HTTPS.');
    }
  }
  if (!Number.isInteger(c.port) || c.port < 1 || c.port > 65535) errors.push('PORT must be a number from 1 to 65535.');
  if (!['local', 'oidc'].includes(c.authMode)) errors.push('AUTH_MODE must be "local" or "oidc".');
  if (c.authMode === 'oidc') {
    if (!/^https:\/\//.test(c.oidc.issuer) && !/^http:\/\/(localhost|127\.0\.0\.1)/.test(c.oidc.issuer)) errors.push('OIDC_ISSUER must be the https address of your identity provider (e.g. https://accounts.google.com).');
    if (!c.oidc.clientId) errors.push('OIDC_CLIENT_ID is missing (AUTH_MODE=oidc).');
    if (!c.oidc.clientSecret) errors.push('OIDC_CLIENT_SECRET is missing (AUTH_MODE=oidc).');
  }
  for (const a of c.admins) if (!EMAIL_RE.test(a)) errors.push('INSTITUTION_ADMIN_EMAILS has an invalid email: ' + a);
  if (!c.admins.length) warnings.push('INSTITUTION_ADMIN_EMAILS is empty, so nobody at the institution can open the Admin Monitor.');
  if (!(c.licenceCheckSec >= 15 && c.licenceCheckSec <= 3600)) errors.push('LICENCE_CHECK_SECONDS must be between 15 and 3600.');
  if (c.offlineGraceDays !== null && !(c.offlineGraceDays >= 0 && c.offlineGraceDays <= 30)) errors.push('OFFLINE_GRACE_DAYS must be between 0 and 30.');
  if (!(c.sessionDays >= 1 && c.sessionDays <= 90)) errors.push('SESSION_DAYS must be between 1 and 90.');
  return { config: c, errors, warnings };
}

/* Which database holds the institution's data. DATABASES.md explains every choice.

   DB_TYPE=sqlite (default) needs nothing else. For the others, either one DB_URL, e.g.
     postgres://examflow:PASSWORD@db.uni.edu:5432/examflow?sslmode=require
     mysql://examflow:PASSWORD@db.uni.edu:3306/examflow
     mssql://examflow:PASSWORD@sql.uni.edu:1433/examflow
     oracle://examflow:PASSWORD@ora.uni.edu:1521/EXAMPDB          (service name after the /)
     mongodb://examflow:PASSWORD@m1.uni.edu:27017,m2.uni.edu:27017/examflow?replicaSet=rs0
     mongodb+srv://examflow:PASSWORD@cluster0.abcde.mongodb.net/examflow   (Atlas)
   or the separate settings DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD (easier when the
   password has special characters).

   Connection security and sign-in (all optional):
     DB_SSL=1|0                 encrypt the connection (SQL Server: on unless 0)
     DB_SSL_CA=/path/ca.pem     trust this certificate authority (the institution's own)
     DB_SSL_VERIFY=0            accept any server certificate (testing only)
     DB_SSL_CERT, DB_SSL_KEY    client certificate + key files (mutual TLS); MongoDB: one PEM in DB_SSL_CERT
     DB_TRUST_SERVER_CERTIFICATE=1   SQL Server with its own self-signed certificate
     DB_SOCKET=/run/mysqld/mysqld.sock   MySQL/MariaDB on the same machine (PostgreSQL: DB_HOST=/var/run/postgresql)
     DB_AUTH=password | windows | azure-ad-password | azure-ad-service-principal | azure-ad-managed-identity | azure-ad-default
                                (SQL Server; windows uses DB_DOMAIN; Azure AD uses DB_CLIENT_ID, DB_CLIENT_SECRET, DB_TENANT_ID)
     DB_INSTANCE=SQLEXPRESS     SQL Server named instance
     DB_CONNECT_STRING          Oracle: Easy Connect, a full (DESCRIPTION=…) or a tnsnames.ora alias
     DB_TNS_ADMIN, DB_WALLET_DIR, DB_WALLET_PASSWORD   Oracle: folder with tnsnames.ora / wallet (Autonomous DB, TCPS)
     DB_AUTH_SOURCE=admin       MongoDB: database that holds the user (when not in DB_URL)
     DB_AUDIT_TRIGGERS=0        for databases without triggers (TiDB, PlanetScale/Vitess …): ExamFlow keeps the audit
                                log append-only itself, but the database does not enforce it

   Further databases (DATABASES.md has a page for each):
     firebird   DB_HOST, DB_PORT=3050, DB_NAME (database path or alias), DB_USER, DB_PASSWORD, DB_ROLE; DB_SSL=0 turns wire encryption off
     hana       DB_HOST, DB_PORT (30015; HANA Cloud: 443 with DB_SSL=1), DB_USER, DB_PASSWORD, DB_NAME (schema), DB_TENANT
     db2        DB_HOST, DB_PORT=50000, DB_NAME (database), DB_USER, DB_PASSWORD, DB_SCHEMA, or DB_CONNECT_STRING; needs IBM's driver:
                node server/src/cli.js add-driver db2
     cassandra  DB_HOST (one or more, comma-separated), DB_PORT=9042, DB_NAME (keyspace), DB_DATACENTER, DB_USER, DB_PASSWORD,
                DB_CONSISTENCY (default localQuorum); DataStax Astra: DB_SECURE_BUNDLE=/path/secure-connect.zip
     dynamodb   DB_REGION, DB_NAME (table, default examflow); DB_ACCESS_KEY_ID + DB_SECRET_ACCESS_KEY, or the machine's AWS role;
                DB_URL for DynamoDB Local
     firestore  DB_PROJECT, DB_CREDENTIALS_FILE (service-account key) or the machine's Google Cloud account,
                DB_FIRESTORE_DATABASE (default "(default)"), DB_NAME (top collection, default examflow) */
const DB_KINDS = { sqlite: 'sqlite', postgres: 'postgres', postgresql: 'postgres', pg: 'postgres', mysql: 'mysql', mariadb: 'mysql',
  mssql: 'mssql', sqlserver: 'mssql', oracle: 'oracle', mongodb: 'mongodb', mongo: 'mongodb', 'mongodb+srv': 'mongodb',
  firebird: 'firebird', hana: 'hana', db2: 'db2', cassandra: 'cassandra', dynamodb: 'dynamodb', firestore: 'firestore',
  // products that speak one of these protocols (the name is shown, and a few have their own defaults)
  cockroachdb: 'postgres', cockroach: 'postgres', yugabytedb: 'postgres', yugabyte: 'postgres', alloydb: 'postgres', 'aurora-postgresql': 'postgres',
  citus: 'postgres', neon: 'postgres', supabase: 'postgres', timescaledb: 'postgres', edb: 'postgres', 'azure-postgresql': 'postgres',
  percona: 'mysql', 'aurora-mysql': 'mysql', tidb: 'mysql', planetscale: 'mysql', vitess: 'mysql', singlestore: 'mysql', memsql: 'mysql', 'azure-mysql': 'mysql',
  azuresql: 'mssql', 'azure-sql': 'mssql', 'sql-server': 'mssql', 'oracle-autonomous': 'oracle',
  documentdb: 'mongodb', 'cosmosdb-mongodb': 'mongodb', ferretdb: 'mongodb', atlas: 'mongodb',
  saphana: 'hana', 'sap-hana': 'hana', 'hana-cloud': 'hana', ibmdb2: 'db2', 'ibm-db2': 'db2',
  scylla: 'cassandra', scylladb: 'cassandra', astra: 'cassandra', keyspaces: 'cassandra', 'amazon-keyspaces': 'cassandra', 'cosmosdb-cassandra': 'cassandra',
  'aws-dynamodb': 'dynamodb', firebase: 'firestore', 'cloud-firestore': 'firestore' };
const NO_TRIGGERS = ['tidb', 'planetscale', 'vitess', 'singlestore', 'memsql'];   // these engines have no triggers
const TRIGGERS_OPTIONAL = ['cockroachdb', 'cockroach', 'yugabytedb', 'yugabyte'];  // triggers depend on the version
const DB_PORTS = { postgres: 5432, mysql: 3306, mssql: 1433, oracle: 1521, mongodb: 27017, firebird: 3050, hana: 30015, db2: 50000, cassandra: 9042 };
const NO_HOST = ['dynamodb', 'firestore'];
const DB_AUTHS = ['password', 'windows', 'azure-ad-password', 'azure-ad-service-principal', 'azure-ad-managed-identity', 'azure-ad-default'];
const yes = v => /^(1|true|yes|on|require|required|verify-ca|verify-full)$/i.test(String(v));
const no = v => /^(0|false|no|off|disable|disabled|prefer|allow)$/i.test(String(v));
function readDbConfig(env, errors, warnings) {
  const raw = String(env.DB_TYPE || 'sqlite').trim().toLowerCase();
  const type = DB_KINDS[raw];
  if (!type) { errors.push('DB_TYPE must be one of: sqlite, postgres, mysql, mariadb, mssql, oracle, mongodb, firebird, hana, db2, cassandra, dynamodb, firestore, or a compatible product named in DATABASES.md (you wrote "' + raw + '").'); return { type: 'sqlite' }; }
  if (type === 'sqlite') {
    if (env.DB_URL || env.DB_HOST) warnings.push('DB_URL / DB_HOST are set but DB_TYPE is sqlite, so they are ignored. Set DB_TYPE to use an external database.');
    return { type };
  }
  const file = (name, asText = true) => { const f = env[name]; if (!f) return undefined;
    try { return asText ? fs.readFileSync(f, 'utf8') : (fs.accessSync(f), f); } catch (e) { errors.push(`${name} file cannot be read: ${f}`); return undefined; } };
  const d = { type, host: env.DB_HOST || '', port: env.DB_PORT ? Number(env.DB_PORT) : null, name: env.DB_NAME || '', user: env.DB_USER || '', password: env.DB_PASSWORD || '',
    domain: env.DB_DOMAIN || '', instance: env.DB_INSTANCE || '', socket: env.DB_SOCKET || '',
    auth: String(env.DB_AUTH || (env.DB_DOMAIN ? 'windows' : 'password')).toLowerCase(), clientId: env.DB_CLIENT_ID || '', clientSecret: env.DB_CLIENT_SECRET || '', tenantId: env.DB_TENANT_ID || '',
    connectString: env.DB_CONNECT_STRING || '', tnsAdmin: env.DB_TNS_ADMIN || '', walletDir: env.DB_WALLET_DIR || '', walletPassword: env.DB_WALLET_PASSWORD || '',
    authSource: env.DB_AUTH_SOURCE || '',
    auditTriggers: env.DB_AUDIT_TRIGGERS !== undefined ? !no(env.DB_AUDIT_TRIGGERS) : !NO_TRIGGERS.includes(raw),
    triggersOptional: TRIGGERS_OPTIONAL.includes(raw), variant: raw,
    role: env.DB_ROLE || '', tenant: env.DB_TENANT || '', schema: env.DB_SCHEMA || '',
    dataCenter: env.DB_DATACENTER || '', consistency: env.DB_CONSISTENCY || '', secureBundle: env.DB_SECURE_BUNDLE || '',
    region: env.DB_REGION || env.AWS_REGION || '', accessKeyId: env.DB_ACCESS_KEY_ID || '', secretAccessKey: env.DB_SECRET_ACCESS_KEY || '', sessionToken: env.DB_SESSION_TOKEN || '',
    project: env.DB_PROJECT || '', firestoreDatabase: env.DB_FIRESTORE_DATABASE || '' };
  if (type === 'dynamodb' || type === 'firestore') {
    if (env.DB_URL) d.url = env.DB_URL;                  // DynamoDB Local / Firestore emulator
    if (type === 'firestore' && env.DB_CREDENTIALS_FILE) d.credentials = file('DB_CREDENTIALS_FILE');
    if (type === 'firestore' && d.credentials) { try { const c = JSON.parse(d.credentials); if (!d.project) d.project = c.project_id; if (!c.private_key) errors.push('DB_CREDENTIALS_FILE is not a service-account key (no private_key).'); } catch (e) { errors.push('DB_CREDENTIALS_FILE is not valid JSON.'); } }
    if (type === 'firestore' && !d.project) errors.push('DB_PROJECT (the Google Cloud project ID) is missing.');
    if (type === 'dynamodb' && !d.region && !d.url) errors.push('DB_REGION (e.g. ap-south-1) is missing.');
    if (type === 'dynamodb' && !!d.accessKeyId !== !!d.secretAccessKey) errors.push('Set both DB_ACCESS_KEY_ID and DB_SECRET_ACCESS_KEY, or neither (then the machine\'s AWS role is used).');
    d.host = d.url || type; d.ssl = true;
    return d;
  }
  if (type === 'cassandra' && d.secureBundle) { d.secureBundle = file('DB_SECURE_BUNDLE', false) || ''; d.host = d.host || 'astra'; }
  let sslWord = env.DB_SSL, verifyWord = env.DB_SSL_VERIFY, trustWord = env.DB_TRUST_SERVER_CERTIFICATE;
  if (env.DB_URL) {
    let u; try { u = new URL(env.DB_URL); } catch (e) { errors.push('DB_URL is not a valid address. Example: postgres://examflow:PASSWORD@db.uni.edu:5432/examflow'); return d; }
    const proto = u.protocol.replace(':', '').toLowerCase();
    if (DB_KINDS[proto] !== type && !(type === 'hana' && proto === 'hdb') && !(type === 'cassandra' && proto === 'cql')) errors.push(`DB_URL starts with ${proto}:// but DB_TYPE is ${raw}. Make them match.`);
    const q = u.searchParams;
    const pick = (...keys) => { for (const k of keys) if (q.has(k)) return q.get(k); };
    if (type === 'mongodb') {
      // MongoDB addresses can list several hosts and many options: the driver reads DB_URL itself.
      d.url = env.DB_URL; d.name = d.name || decodeURIComponent(u.pathname.replace(/^\//, ''));
      d.host = d.host || u.hostname || '(see DB_URL)';
      if (!d.name) errors.push('Put the database name in DB_URL (…mongodb.net/examflow) or set DB_NAME.');
      d.ssl = false; // TLS options stay in DB_URL (Atlas / mongodb+srv turns TLS on by itself)
      if (env.DB_SSL !== undefined && yes(env.DB_SSL)) { d.ssl = true; d.sslCaFile = file('DB_SSL_CA', false); d.sslCertFile = file('DB_SSL_CERT', false); d.sslVerify = !(env.DB_SSL_VERIFY !== undefined && no(env.DB_SSL_VERIFY)); }
      return d;
    }
    d.host = decodeURIComponent(u.hostname); d.port = u.port ? Number(u.port) : null;
    d.name = decodeURIComponent(u.pathname.replace(/^\//, '')); d.user = decodeURIComponent(u.username); d.password = decodeURIComponent(u.password);
    if (sslWord === undefined) sslWord = pick('ssl', 'sslmode', 'encrypt', 'tls');
    if (verifyWord === undefined && /^(require|required)$/i.test(String(pick('sslmode') || ''))) verifyWord = '0'; // libpq meaning of "require"
    if (trustWord === undefined) trustWord = pick('trustServerCertificate', 'trustservercertificate');
    if (!d.domain && pick('domain')) { d.domain = pick('domain'); if (!env.DB_AUTH) d.auth = 'windows'; }
    if (!d.instance && pick('instance', 'instanceName')) d.instance = pick('instance', 'instanceName');
    if (!d.socket && pick('socket', 'socketPath')) d.socket = pick('socket', 'socketPath');
  }
  d.ssl = sslWord === undefined || sslWord === '' ? (type === 'mssql' || type === 'firebird') : (yes(sslWord) ? true : no(sslWord) ? false : (errors.push('DB_SSL must be 1 or 0.'), false));
  d.sslVerify = !(verifyWord !== undefined && no(verifyWord));
  d.trustServerCertificate = trustWord !== undefined && yes(trustWord);
  if (type === 'mongodb' || type === 'db2') { d.sslCaFile = file('DB_SSL_CA', false); d.sslCertFile = file('DB_SSL_CERT', false); }
  else { d.sslCa = file('DB_SSL_CA'); d.sslCert = file('DB_SSL_CERT'); d.sslKey = file('DB_SSL_KEY'); }
  if ((d.sslCert || d.sslKey) && !d.ssl) d.ssl = true;
  if (d.sslCert && !d.sslKey && type !== 'mongodb' && type !== 'db2') errors.push('DB_SSL_CERT is set but DB_SSL_KEY is missing (the client certificate needs its key).');
  if (!d.port && !d.instance && !d.socket && !d.host.startsWith('/')) d.port = DB_PORTS[type];
  if (d.port !== null && !(Number.isInteger(d.port) && d.port > 0 && d.port < 65536)) errors.push('DB_PORT must be a number from 1 to 65535.');
  if (type === 'mssql' && !DB_AUTHS.includes(d.auth)) errors.push('DB_AUTH must be one of: ' + DB_AUTHS.join(', ') + '.');
  if (type !== 'mssql' && env.DB_AUTH && d.auth !== 'password') errors.push('DB_AUTH is only for SQL Server. Other databases take the sign-in method from their own settings.');
  if ((type === 'oracle' || type === 'db2') && d.connectString) { /* host and database come from the connect string */ }
  else if (type === 'cassandra' && d.secureBundle) { if (!d.name) errors.push('DB_NAME (the keyspace) is missing.'); }
  else {
    if (!d.host && !d.socket) errors.push(`DB_HOST (or DB_URL) is missing. DB_TYPE=${raw} needs the address of the database server.`);
    if (!d.name) errors.push(type === 'oracle' ? 'DB_NAME (the Oracle service name, e.g. EXAMPDB or ORCLPDB1) or DB_CONNECT_STRING is missing.'
      : type === 'firebird' ? 'DB_NAME (the database file path on the Firebird server, or its alias) is missing.'
      : type === 'hana' ? 'DB_NAME (the schema for ExamFlow, e.g. EXAMFLOW) is missing.'
      : type === 'cassandra' ? 'DB_NAME (the keyspace) is missing. Ask the DBA to create one (DATABASES.md).'
      : 'DB_NAME (or the database name in DB_URL) is missing. Ask your DBA to create an empty database for ExamFlow.');
  }
  const azureNoUser = ['azure-ad-service-principal', 'azure-ad-managed-identity', 'azure-ad-default'].includes(d.auth);
  if (!d.user && !azureNoUser && !(type === 'oracle' && d.walletDir && !d.password) && type !== 'mongodb' && type !== 'cassandra' && !(type === 'db2' && d.connectString)) errors.push('DB_USER (or the user in DB_URL) is missing.');
  if (d.auth === 'windows' && !d.domain) errors.push('DB_AUTH=windows needs DB_DOMAIN (the Windows domain of DB_USER).');
  if (d.auth === 'azure-ad-service-principal' && !(d.clientId && d.clientSecret && d.tenantId)) errors.push('DB_AUTH=azure-ad-service-principal needs DB_CLIENT_ID, DB_CLIENT_SECRET and DB_TENANT_ID.');
  if (d.auth === 'azure-ad-password' && !d.clientId) errors.push('DB_AUTH=azure-ad-password needs DB_CLIENT_ID (the app registration allowed to sign in to Azure SQL).');
  if (!d.password && d.auth === 'password' && !azureNoUser) warnings.push('DB_PASSWORD is empty. That only works if the database allows this user without a password.');
  return d;
}

module.exports = { readConfig, loadDotEnv, readDbConfig };
