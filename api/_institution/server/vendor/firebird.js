var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};

// node_modules/node-firebird/lib/wire/const.js
var require_const = __commonJS({
  "node_modules/node-firebird/lib/wire/const.js"(exports2, module2) {
    "use strict";
    var defaultOptions = {
      DEFAULT_HOST: "127.0.0.1",
      DEFAULT_PORT: 3050,
      DEFAULT_USER: "SYSDBA",
      DEFAULT_PASSWORD: "masterkey",
      DEFAULT_LOWERCASE_KEYS: !1,
      DEFAULT_PAGE_SIZE: 4096,
      DEFAULT_SVC_NAME: "service_mgr",
      DEFAULT_ENCODING: "utf8",
      DEFAULT_FETCHSIZE: 200,
      // op_fetch row count (p_sqldata_messages) is an unsigned 16-bit wire field
      MAX_FETCHSIZE: 65535
    }, buffer = {
      MAX_BUFFER_SIZE: 8192
    }, int = {
      MAX_INT: Math.pow(2, 31) - 1,
      MIN_INT: -Math.pow(2, 31)
    }, numericMode = {
      NUMERIC_MODE_LOSSY: "lossy",
      NUMERIC_MODE_SAFE: "safe",
      NUMERIC_MODE_STRING: "string"
    }, op = {
      op_void: 0,
      // Packet has been voided
      op_connect: 1,
      // Connect to remote server
      op_exit: 2,
      // Remote end has exitted
      op_accept: 3,
      // Server accepts connection
      op_reject: 4,
      // Server rejects connection
      op_disconnect: 6,
      // Connect is going away
      op_response: 9,
      // Generic response block
      // Full context server operations
      op_attach: 19,
      // Attach database
      op_create: 20,
      // Create database
      op_detach: 21,
      // Detach database
      op_compile: 22,
      // Request based operations
      op_start: 23,
      op_start_and_send: 24,
      op_send: 25,
      op_receive: 26,
      op_unwind: 27,
      // apparently unused, see protocol.cpp's case op_unwind
      op_release: 28,
      op_transaction: 29,
      // Transaction operations
      op_commit: 30,
      op_rollback: 31,
      op_prepare: 32,
      op_reconnect: 33,
      op_create_blob: 34,
      // Blob operations
      op_open_blob: 35,
      op_get_segment: 36,
      op_put_segment: 37,
      op_cancel_blob: 38,
      op_close_blob: 39,
      op_info_database: 40,
      // Information services
      op_info_request: 41,
      op_info_transaction: 42,
      op_info_blob: 43,
      op_batch_segments: 44,
      // Put a bunch of blob segments
      op_que_events: 48,
      // Que event notification request
      op_cancel_events: 49,
      // Cancel event notification request
      op_commit_retaining: 50,
      // Commit retaining (what else)
      op_prepare2: 51,
      // Message form of prepare
      op_event: 52,
      // Completed event request (asynchronous)
      op_connect_request: 53,
      // Request to establish connection
      op_aux_connect: 54,
      // Establish auxiliary connection
      op_ddl: 55,
      // DDL call
      op_open_blob2: 56,
      op_create_blob2: 57,
      op_get_slice: 58,
      op_put_slice: 59,
      op_slice: 60,
      // Successful response to op_get_slice
      op_seek_blob: 61,
      // Blob seek operation
      // DSQL operations
      op_allocate_statement: 62,
      // allocate a statment handle
      op_execute: 63,
      // execute a prepared statement
      op_exec_immediate: 64,
      // execute a statement
      op_fetch: 65,
      // fetch a record
      op_fetch_response: 66,
      // response for record fetch
      op_free_statement: 67,
      // free a statement
      op_prepare_statement: 68,
      // prepare a statement
      op_set_cursor: 69,
      // set a cursor name
      op_info_sql: 70,
      op_dummy: 71,
      // dummy packet to detect loss of client
      op_response_piggyback: 72,
      // response block for piggybacked messages
      op_start_and_receive: 73,
      op_start_send_and_receive: 74,
      op_exec_immediate2: 75,
      // execute an immediate statement with msgs
      op_execute2: 76,
      // execute a statement with msgs
      op_insert: 77,
      op_sql_response: 78,
      // response from execute, exec immed, insert
      op_transact: 79,
      op_transact_response: 80,
      op_drop_database: 81,
      op_service_attach: 82,
      op_service_detach: 83,
      op_service_info: 84,
      op_service_start: 85,
      op_rollback_retaining: 86,
      op_partial: 89,
      // packet is not complete - delay processing
      op_trusted_auth: 90,
      op_cancel: 91,
      op_cont_auth: 92,
      op_ping: 93,
      op_accept_data: 94,
      // Server accepts connection and returns some data to client
      op_abort_aux_connection: 95,
      // Async operation - stop waiting for async connection to arrive
      op_crypt: 96,
      op_crypt_key_callback: 97,
      op_cond_accept: 98,
      // Server accepts connection, returns some data to client
      // and asks client to continue authentication before attach call
      op_batch_create: 99,
      // Create a statement batch (protocol 16+)
      op_batch_msg: 100,
      // Add a bunch of messages to the batch
      op_batch_exec: 101,
      // Execute the batch; server answers with op_batch_cs
      op_batch_rls: 102,
      // Release the batch
      op_batch_cs: 103,
      // Batch completion state (response to op_batch_exec)
      op_batch_cancel: 109,
      // Cancel the batch
      op_batch_sync: 110,
      // Wait for batch processing
      op_info_batch: 111,
      op_fetch_scroll: 112,
      op_info_cursor: 113,
      op_inline_blob: 114
    }, dsql = {
      DSQL_close: 1,
      DSQL_drop: 2,
      DSQL_unprepare: 4
      // >: 2.5
    }, batch = {
      BATCH_VERSION1: 1,
      BATCH_TAG_MULTIERROR: 1,
      // continue after per-record errors
      BATCH_TAG_RECORD_COUNTS: 2,
      // return per-record update counts
      BATCH_TAG_BUFFER_BYTES_SIZE: 3,
      // server-side batch buffer limit
      BATCH_TAG_BLOB_POLICY: 4,
      BATCH_TAG_DETAILED_ERRORS: 5,
      // max detailed status vectors returned
      BATCH_BLOB_NONE: 0
    }, cancelKind = {
      fb_cancel_disable: 1,
      // disable execution of fb_cancel_raise requests
      fb_cancel_enable: 2,
      // re-enable delivery of cancel requests
      fb_cancel_raise: 3,
      // cancel the operation currently executing on the attachment
      fb_cancel_abort: 4
      // forcibly abort the attachment's current activity
    }, fetchOp = {
      fetch_next: 0,
      fetch_prior: 1,
      fetch_first: 2,
      fetch_last: 3,
      fetch_absolute: 4,
      fetch_relative: 5
    }, iscError = {
      isc_sqlerr: 335544436,
      isc_arg_end: 0,
      // end of argument list
      isc_arg_gds: 1,
      // generic DSRI status value
      isc_arg_string: 2,
      // string argument
      isc_arg_cstring: 3,
      // count & string argument
      isc_arg_number: 4,
      // numeric argument (long)
      isc_arg_interpreted: 5,
      // interpreted status code (string)
      isc_arg_unix: 7,
      // UNIX error code
      isc_arg_next_mach: 15,
      // NeXT/Mach error code
      isc_arg_win32: 17,
      // Win32 error code
      isc_arg_warning: 18,
      // warning argument
      isc_arg_sql_state: 19
      // SQLSTATE
    }, connect = {
      CONNECT_VERSION2: 2,
      CONNECT_VERSION3: 3,
      ARCHITECTURE_GENERIC: 1
    }, FB_PROTOCOL_FLAG = 32768, protocol = {
      // Protocol 10 includes support for warnings and removes the requirement for
      // encoding and decoding status codes
      PROTOCOL_VERSION10: 10,
      // Since protocol 11 we must be separated from Borland Interbase.
      // Therefore always set highmost bit in protocol version to 1.
      // For unsigned protocol version this does not break version's compare.
      FB_PROTOCOL_FLAG,
      FB_PROTOCOL_MASK: ~FB_PROTOCOL_FLAG & 65535,
      // Protocol 11 has support for user authentication related
      // operations (op_update_account_info, op_authenticate_user and
      // op_trusted_auth). When specific operation is not supported,
      // we say "sorry".
      PROTOCOL_VERSION11: FB_PROTOCOL_FLAG | 11,
      // Protocol 12 has support for asynchronous call op_cancel.
      // Currently implemented asynchronously only for TCP/IP.
      PROTOCOL_VERSION12: FB_PROTOCOL_FLAG | 12,
      // Protocol 13 has support for authentication plugins (op_cont_auth).
      PROTOCOL_VERSION13: FB_PROTOCOL_FLAG | 13,
      // Protocol 14 has support for wire encryption.
      PROTOCOL_VERSION14: FB_PROTOCOL_FLAG | 14,
      // Protocol 15 has support for conditional accept with early wire encryption.
      PROTOCOL_VERSION15: FB_PROTOCOL_FLAG | 15,
      // Protocol 16 has support for statement timeouts, DECFLOAT data types,
      // and extended metadata identifiers (up to 63 characters).
      // Introduced in Firebird 4.0.
      PROTOCOL_VERSION16: FB_PROTOCOL_FLAG | 16,
      // Protocol 17 continues Firebird 4.0 enhancements.
      PROTOCOL_VERSION17: FB_PROTOCOL_FLAG | 17,
      // Protocol 18 includes support for fetches from scrollable cursors.
      // Introduced in Firebird 5.0.
      PROTOCOL_VERSION18: FB_PROTOCOL_FLAG | 18,
      // Protocol 19 includes support for Inline BLOBs.
      // Introduced in Firebird 5.0.3.
      PROTOCOL_VERSION19: FB_PROTOCOL_FLAG | 19,
      // Protocol 20 includes support for SQL Schemas and Named Arguments.
      // Introduced in Firebird 6.0.
      PROTOCOL_VERSION20: FB_PROTOCOL_FLAG | 20
    }, acceptType = {
      ptype_rpc: 2,
      // Simple remote procedure call
      ptype_batch_send: 3,
      // Batch sends, no asynchrony
      ptype_out_of_band: 4,
      // Batch sends w/ out of band notification
      ptype_lazy_send: 5,
      // Deferred packets delivery;
      ptype_mask: 255,
      // Mask - up to 255 types of protocol
      pflag_compress: 256
      // Turn on compression if possible
    }, SUPPORTED_PROTOCOL = [
      [protocol.PROTOCOL_VERSION10, connect.ARCHITECTURE_GENERIC, acceptType.ptype_rpc, acceptType.ptype_batch_send, 1],
      [protocol.PROTOCOL_VERSION11, connect.ARCHITECTURE_GENERIC, acceptType.ptype_lazy_send, acceptType.ptype_lazy_send, 2],
      [protocol.PROTOCOL_VERSION12, connect.ARCHITECTURE_GENERIC, acceptType.ptype_lazy_send, acceptType.ptype_lazy_send, 3],
      [protocol.PROTOCOL_VERSION13, connect.ARCHITECTURE_GENERIC, acceptType.ptype_lazy_send, acceptType.ptype_lazy_send, 4],
      [protocol.PROTOCOL_VERSION14, connect.ARCHITECTURE_GENERIC, acceptType.ptype_lazy_send, acceptType.ptype_lazy_send, 5],
      [protocol.PROTOCOL_VERSION15, connect.ARCHITECTURE_GENERIC, acceptType.ptype_lazy_send, acceptType.ptype_lazy_send, 6],
      [protocol.PROTOCOL_VERSION16, connect.ARCHITECTURE_GENERIC, acceptType.ptype_lazy_send, acceptType.ptype_lazy_send, 7],
      [protocol.PROTOCOL_VERSION17, connect.ARCHITECTURE_GENERIC, acceptType.ptype_lazy_send, acceptType.ptype_lazy_send, 8],
      [protocol.PROTOCOL_VERSION18, connect.ARCHITECTURE_GENERIC, acceptType.ptype_lazy_send, acceptType.ptype_lazy_send, 9],
      [protocol.PROTOCOL_VERSION19, connect.ARCHITECTURE_GENERIC, acceptType.ptype_lazy_send, acceptType.ptype_lazy_send, 10],
      [protocol.PROTOCOL_VERSION20, connect.ARCHITECTURE_GENERIC, acceptType.ptype_lazy_send, acceptType.ptype_lazy_send, 11]
    ], authPlugin = {
      AUTH_PLUGIN_LEGACY: "Legacy_Auth",
      AUTH_PLUGIN_SRP: "Srp",
      AUTH_PLUGIN_SRP256: "Srp256",
      AUTH_PLUGIN_SRP384: "Srp384",
      AUTH_PLUGIN_SRP512: "Srp512"
    }, authOptions = {
      AUTH_PLUGIN_LIST: [
        authPlugin.AUTH_PLUGIN_SRP512,
        authPlugin.AUTH_PLUGIN_SRP384,
        authPlugin.AUTH_PLUGIN_SRP256,
        authPlugin.AUTH_PLUGIN_SRP,
        authPlugin.AUTH_PLUGIN_LEGACY
      ],
      AUTH_PLUGIN_SRP_LIST: [
        authPlugin.AUTH_PLUGIN_SRP512,
        authPlugin.AUTH_PLUGIN_SRP384,
        authPlugin.AUTH_PLUGIN_SRP256,
        authPlugin.AUTH_PLUGIN_SRP
      ],
      LEGACY_AUTH_SALT: "9z",
      WIRE_CRYPT_DISABLE: 0,
      WIRE_CRYPT_ENABLE: 1
    }, sqlType = {
      SQL_TEXT: 452,
      // Array of char
      SQL_VARYING: 448,
      SQL_SHORT: 500,
      SQL_LONG: 496,
      SQL_FLOAT: 482,
      SQL_DOUBLE: 480,
      SQL_D_FLOAT: 530,
      SQL_TIMESTAMP: 510,
      SQL_BLOB: 520,
      SQL_ARRAY: 540,
      SQL_QUAD: 550,
      SQL_TYPE_TIME: 560,
      SQL_TYPE_DATE: 570,
      SQL_INT64: 580,
      SQL_INT128: 32752,
      // >= 4.0
      SQL_TIMESTAMP_TZ: 32754,
      // >= 4.0 - timestamp with time zone
      SQL_TIMESTAMP_TZ_EX: 32748,
      // >= 4.0 - extended timestamp with time zone
      SQL_TIME_TZ: 32756,
      // >= 4.0 - time with time zone
      SQL_TIME_TZ_EX: 32750,
      // >= 4.0 - extended time with time zone
      SQL_DEC16: 32760,
      // >= 4.0 - DECFLOAT(16) - 8 bytes, IEEE 754 Decimal64
      SQL_DEC34: 32762,
      // >= 4.0 - DECFLOAT(34) - 16 bytes, IEEE 754 Decimal128
      SQL_BOOLEAN: 32764,
      // >: 3.0
      SQL_NULL: 32766
      // >= 2.5
    }, blobType = {
      isc_blob_text: 1
    }, blr = {
      blr_text: 14,
      blr_text2: 15,
      blr_short: 7,
      blr_long: 8,
      blr_quad: 9,
      blr_float: 10,
      blr_double: 27,
      blr_d_float: 11,
      blr_timestamp: 35,
      blr_varying: 37,
      blr_varying2: 38,
      blr_blob: 261,
      blr_cstring: 40,
      blr_cstring2: 41,
      blr_blob_id: 45,
      blr_sql_date: 12,
      blr_sql_time: 13,
      blr_int64: 16,
      blr_int128: 26,
      // >: 4.0
      blr_dec64: 24,
      // >= 4.0 - DECFLOAT(16), IEEE 754 Decimal64
      blr_dec128: 25,
      // >= 4.0 - DECFLOAT(34), IEEE 754 Decimal128
      blr_time_tz: 29,
      // >= 4.0 - time with time zone
      blr_blob2: 17,
      // >: 2.0
      blr_domain_name: 18,
      // >: 2.1
      blr_domain_name2: 19,
      // >: 2.1
      blr_not_nullable: 20,
      // >: 2.1
      blr_column_name: 21,
      // >: 2.5
      blr_column_name2: 22,
      // >: 2.5
      blr_bool: 23,
      // >: 3.0
      blr_sql_time_tz: 28,
      // >: 4.0
      blr_timestamp_tz: 29,
      // >: 4.0
      blr_ex_time_tz: 30,
      // >: 4.0
      blr_ex_timestamp_tz: 31,
      // >: 4.0
      blr_version4: 4,
      blr_version5: 5,
      // dialect 3
      blr_eoc: 76,
      blr_end: 255,
      blr_assignment: 1,
      blr_begin: 2,
      blr_dcl_variable: 3,
      blr_message: 4
    }, dpb = {
      isc_dpb_version1: 1,
      isc_dpb_version2: 2,
      // >: FB30
      isc_dpb_cdd_pathname: 1,
      isc_dpb_allocation: 2,
      isc_dpb_journal: 3,
      isc_dpb_page_size: 4,
      isc_dpb_num_buffers: 5,
      isc_dpb_buffer_length: 6,
      isc_dpb_debug: 7,
      isc_dpb_garbage_collect: 8,
      isc_dpb_verify: 9,
      isc_dpb_sweep: 10,
      isc_dpb_enable_journal: 11,
      isc_dpb_disable_journal: 12,
      isc_dpb_dbkey_scope: 13,
      isc_dpb_number_of_users: 14,
      isc_dpb_trace: 15,
      isc_dpb_no_garbage_collect: 16,
      isc_dpb_damaged: 17,
      isc_dpb_license: 18,
      isc_dpb_sys_user_name: 19,
      isc_dpb_encrypt_key: 20,
      isc_dpb_activate_shadow: 21,
      isc_dpb_sweep_interval: 22,
      isc_dpb_delete_shadow: 23,
      isc_dpb_force_write: 24,
      isc_dpb_begin_log: 25,
      isc_dpb_quit_log: 26,
      isc_dpb_no_reserve: 27,
      isc_dpb_user_name: 28,
      isc_dpb_password: 29,
      isc_dpb_password_enc: 30,
      isc_dpb_sys_user_name_enc: 31,
      isc_dpb_interp: 32,
      isc_dpb_online_dump: 33,
      isc_dpb_old_file_size: 34,
      isc_dpb_old_num_files: 35,
      isc_dpb_old_file: 36,
      isc_dpb_old_start_page: 37,
      isc_dpb_old_start_seqno: 38,
      isc_dpb_old_start_file: 39,
      isc_dpb_old_dump_id: 41,
      isc_dpb_lc_messages: 47,
      isc_dpb_lc_ctype: 48,
      isc_dpb_cache_manager: 49,
      isc_dpb_shutdown: 50,
      isc_dpb_online: 51,
      isc_dpb_shutdown_delay: 52,
      isc_dpb_reserved: 53,
      isc_dpb_overwrite: 54,
      isc_dpb_sec_attach: 55,
      isc_dpb_connect_timeout: 57,
      isc_dpb_dummy_packet_interval: 58,
      isc_dpb_gbak_attach: 59,
      isc_dpb_sql_role_name: 60,
      isc_dpb_set_page_buffers: 61,
      isc_dpb_working_directory: 62,
      isc_dpb_sql_dialect: 63,
      isc_dpb_set_db_readonly: 64,
      isc_dpb_set_db_sql_dialect: 65,
      isc_dpb_gfix_attach: 66,
      isc_dpb_gstat_attach: 67,
      isc_dpb_set_db_charset: 68,
      isc_dpb_gsec_attach: 69,
      isc_dpb_address_path: 70,
      isc_dpb_process_id: 71,
      isc_dpb_no_db_triggers: 72,
      isc_dpb_trusted_auth: 73,
      isc_dpb_process_name: 74,
      isc_dpb_trusted_role: 75,
      isc_dpb_org_filename: 76,
      isc_dpb_utf8_filename: 77,
      isc_dpb_ext_call_depth: 78,
      isc_dpb_auth_block: 79,
      isc_dpb_client_version: 80,
      isc_dpb_remote_protocol: 81,
      isc_dpb_host_name: 82,
      isc_dpb_os_user: 83,
      isc_dpb_specific_auth_data: 84,
      isc_dpb_auth_plugin_list: 85,
      isc_dpb_auth_plugin_name: 86,
      isc_dpb_config: 87,
      isc_dpb_nolinger: 88,
      isc_dpb_reset_icu: 89,
      isc_dpb_map_attach: 90,
      isc_dpb_session_time_zone: 91,
      // Firebird 4.0
      isc_dpb_set_db_replica: 92,
      isc_dpb_set_bind: 93,
      isc_dpb_decfloat_round: 94,
      isc_dpb_decfloat_traps: 95,
      isc_dpb_clear_map: 96,
      // Firebird 5.0
      isc_dpb_upgrade_db: 97,
      isc_dpb_parallel_workers: 100,
      isc_dpb_worker_attach: 101,
      // Firebird 6.0
      // isc_dpb_owner sets the owner of a newly created database to a user
      // other than the connecting one (create only; requires superuser).
      isc_dpb_owner: 102,
      isc_dpb_max_blob_cache_size: 103,
      isc_dpb_max_inline_blob_size: 104,
      // Firebird 5.0.3+
      // isc_dpb_search_path sets the comma-separated ordered list of schema
      // names to search for unqualified object names (similar to PostgreSQL
      // search_path). CURRENT_SCHEMA is the first existing schema of the list.
      // Available on Protocol 20+ (Firebird 6.0).
      isc_dpb_search_path: 105
    }, cnct = {
      CNCT_user: 1,
      // User name
      CNCT_passwd: 2,
      // CNCT_ppo : 3, // Apollo person, project, organization. OBSOLETE.
      CNCT_host: 4,
      CNCT_group: 5,
      // Effective Unix group id
      CNCT_user_verification: 6,
      // Attach/create using this connection will use user verification
      CNCT_specific_data: 7,
      // Some data, needed for user verification on server
      CNCT_plugin_name: 8,
      // Name of plugin, which generated that data
      CNCT_login: 9,
      // Same data as isc_dpb_user_name
      CNCT_plugin_list: 10,
      // List of plugins, available on client
      CNCT_client_crypt: 11,
      // Client encyption level (DISABLED/ENABLED/REQUIRED)
      WIRE_CRYPT_DISABLED: 0,
      WIRE_CRYPT_ENABLED: 1,
      WIRE_CRYPT_REQUIRED: 2
    }, common = {
      isc_info_end: 1,
      isc_info_truncated: 2,
      isc_info_error: 3,
      isc_info_data_not_ready: 4,
      isc_info_length: 126,
      isc_info_flag_end: 127,
      fb_info_parallel_workers: 149
    }, tpb = {
      isc_tpb_version1: 1,
      isc_tpb_version3: 3,
      isc_tpb_consistency: 1,
      isc_tpb_concurrency: 2,
      isc_tpb_shared: 3,
      // < FB21
      isc_tpb_protected: 4,
      // < FB21
      isc_tpb_exclusive: 5,
      // < FB21
      isc_tpb_wait: 6,
      isc_tpb_nowait: 7,
      isc_tpb_read: 8,
      isc_tpb_write: 9,
      isc_tpb_lock_read: 10,
      isc_tpb_lock_write: 11,
      isc_tpb_verb_time: 12,
      isc_tpb_commit_time: 13,
      isc_tpb_ignore_limbo: 14,
      isc_tpb_read_committed: 15,
      isc_tpb_autocommit: 16,
      isc_tpb_rec_version: 17,
      isc_tpb_no_rec_version: 18,
      isc_tpb_restart_requests: 19,
      isc_tpb_no_auto_undo: 20,
      isc_tpb_lock_timeout: 21
      // >= FB20
    }, transactionIsolation = {
      ISOLATION_READ_UNCOMMITTED: [tpb.isc_tpb_read_committed, tpb.isc_tpb_rec_version],
      ISOLATION_READ_COMMITTED: [tpb.isc_tpb_read_committed, tpb.isc_tpb_no_rec_version],
      ISOLATION_REPEATABLE_READ: [tpb.isc_tpb_concurrency],
      ISOLATION_SERIALIZABLE: [tpb.isc_tpb_consistency],
      ISOLATION_READ_COMMITTED_READ_ONLY: [tpb.isc_tpb_read_committed, tpb.isc_tpb_no_rec_version]
    }, sqlInfo = {
      isc_info_sql_select: 4,
      isc_info_sql_bind: 5,
      isc_info_sql_num_variables: 6,
      isc_info_sql_describe_vars: 7,
      isc_info_sql_describe_end: 8,
      isc_info_sql_sqlda_seq: 9,
      isc_info_sql_message_seq: 10,
      isc_info_sql_type: 11,
      isc_info_sql_sub_type: 12,
      isc_info_sql_scale: 13,
      isc_info_sql_length: 14,
      isc_info_sql_null_ind: 15,
      isc_info_sql_field: 16,
      isc_info_sql_relation: 17,
      isc_info_sql_owner: 18,
      isc_info_sql_alias: 19,
      isc_info_sql_sqlda_start: 20,
      isc_info_sql_stmt_type: 21,
      isc_info_sql_get_plan: 22,
      isc_info_sql_records: 23,
      // per-verb row counts nested inside an isc_info_sql_records cluster
      // (inf_pub.h isc_info_req_*)
      isc_info_req_select_count: 13,
      isc_info_req_insert_count: 14,
      isc_info_req_update_count: 15,
      isc_info_req_delete_count: 16,
      isc_info_sql_batch_fetch: 24,
      isc_info_sql_relation_alias: 25,
      // >: 2.0
      isc_info_sql_explain_plan: 26,
      // >= 3.0
      // Firebird 6.0 (Protocol 20): schema name of the source relation for a
      // result-set column.  The server only sends this item when the column is
      // drawn from a named schema (i.e. not the legacy PUBLIC or unqualified).
      isc_info_sql_relation_schema: 33
    }, statementInfo = {
      isc_info_sql_stmt_select: 1,
      isc_info_sql_stmt_insert: 2,
      isc_info_sql_stmt_update: 3,
      isc_info_sql_stmt_delete: 4,
      isc_info_sql_stmt_ddl: 5,
      isc_info_sql_stmt_get_segment: 6,
      isc_info_sql_stmt_put_segment: 7,
      isc_info_sql_stmt_exec_procedure: 8,
      isc_info_sql_stmt_start_trans: 9,
      isc_info_sql_stmt_commit: 10,
      isc_info_sql_stmt_rollback: 11,
      isc_info_sql_stmt_select_for_upd: 12,
      isc_info_sql_stmt_set_generator: 13,
      isc_info_sql_stmt_savepoint: 14
    }, DESCRIBE = [
      sqlInfo.isc_info_sql_stmt_type,
      sqlInfo.isc_info_sql_select,
      sqlInfo.isc_info_sql_describe_vars,
      sqlInfo.isc_info_sql_sqlda_seq,
      sqlInfo.isc_info_sql_type,
      sqlInfo.isc_info_sql_sub_type,
      sqlInfo.isc_info_sql_scale,
      sqlInfo.isc_info_sql_length,
      sqlInfo.isc_info_sql_field,
      sqlInfo.isc_info_sql_relation,
      sqlInfo.isc_info_sql_relation_alias,
      // FB 2.0+: query alias of the source relation (nestTables)
      //isc_info_sql_owner,
      sqlInfo.isc_info_sql_alias,
      sqlInfo.isc_info_sql_describe_end,
      sqlInfo.isc_info_sql_bind,
      sqlInfo.isc_info_sql_describe_vars,
      sqlInfo.isc_info_sql_sqlda_seq,
      sqlInfo.isc_info_sql_type,
      sqlInfo.isc_info_sql_sub_type,
      sqlInfo.isc_info_sql_scale,
      sqlInfo.isc_info_sql_length,
      sqlInfo.isc_info_sql_describe_end
    ], DESCRIBE_WITH_SCHEMA = [
      sqlInfo.isc_info_sql_stmt_type,
      sqlInfo.isc_info_sql_select,
      sqlInfo.isc_info_sql_describe_vars,
      sqlInfo.isc_info_sql_sqlda_seq,
      sqlInfo.isc_info_sql_type,
      sqlInfo.isc_info_sql_sub_type,
      sqlInfo.isc_info_sql_scale,
      sqlInfo.isc_info_sql_length,
      sqlInfo.isc_info_sql_field,
      sqlInfo.isc_info_sql_relation,
      sqlInfo.isc_info_sql_relation_schema,
      // FB 6.0: schema of source relation
      sqlInfo.isc_info_sql_relation_alias,
      // query alias of the source relation (nestTables)
      //isc_info_sql_owner,
      sqlInfo.isc_info_sql_alias,
      sqlInfo.isc_info_sql_describe_end,
      sqlInfo.isc_info_sql_bind,
      sqlInfo.isc_info_sql_describe_vars,
      sqlInfo.isc_info_sql_sqlda_seq,
      sqlInfo.isc_info_sql_type,
      sqlInfo.isc_info_sql_sub_type,
      sqlInfo.isc_info_sql_scale,
      sqlInfo.isc_info_sql_length,
      sqlInfo.isc_info_sql_describe_end
    ], RECORDS_INFO = [
      sqlInfo.isc_info_sql_records
    ], iscAction = {
      isc_action_svc_backup: 1,
      /* Starts database backup process on the server	*/
      isc_action_svc_restore: 2,
      /* Starts database restore process on the server */
      isc_action_svc_repair: 3,
      /* Starts database repair process on the server	*/
      isc_action_svc_add_user: 4,
      /* Adds	a new user to the security database	*/
      isc_action_svc_delete_user: 5,
      /* Deletes a user record from the security database	*/
      isc_action_svc_modify_user: 6,
      /* Modifies	a user record in the security database */
      isc_action_svc_display_user: 7,
      /* Displays	a user record from the security	database */
      isc_action_svc_properties: 8,
      /* Sets	database properties	*/
      isc_action_svc_add_license: 9,
      /* Adds	a license to the license file */
      isc_action_svc_remove_license: 10,
      /* Removes a license from the license file */
      isc_action_svc_db_stats: 11,
      /* Retrieves database statistics */
      isc_action_svc_get_ib_log: 12,
      /* Retrieves the InterBase log file	from the server	*/
      isc_action_svc_get_fb_log: 12,
      // isc_action_svc_get_ib_log, /* Retrieves the Firebird log file	from the server	*/
      isc_action_svc_nbak: 20,
      /* start nbackup */
      isc_action_svc_nrest: 21,
      /* start nrestore */
      isc_action_svc_trace_start: 22,
      isc_action_svc_trace_stop: 23,
      isc_action_svc_trace_suspend: 24,
      isc_action_svc_trace_resume: 25,
      isc_action_svc_trace_list: 26
    }, service = {
      isc_spb_prp_page_buffers: 5,
      isc_spb_prp_sweep_interval: 6,
      isc_spb_prp_shutdown_db: 7,
      isc_spb_prp_deny_new_attachments: 9,
      isc_spb_prp_deny_new_transactions: 10,
      isc_spb_prp_reserve_space: 11,
      isc_spb_prp_write_mode: 12,
      isc_spb_prp_access_mode: 13,
      isc_spb_prp_set_sql_dialect: 14,
      isc_spb_num_att: 5,
      isc_spb_num_db: 6,
      // SHUTDOWN OPTION FOR 2.0
      isc_spb_prp_force_shutdown: 41,
      isc_spb_prp_attachments_shutdown: 42,
      isc_spb_prp_transactions_shutdown: 43,
      isc_spb_prp_shutdown_mode: 44,
      isc_spb_prp_online_mode: 45,
      isc_spb_prp_sm_normal: 0,
      isc_spb_prp_sm_multi: 1,
      isc_spb_prp_sm_single: 2,
      isc_spb_prp_sm_full: 3,
      // WRITE_MODE_PARAMETERS
      isc_spb_prp_wm_async: 37,
      isc_spb_prp_wm_sync: 38,
      // ACCESS_MODE_PARAMETERS
      isc_spb_prp_am_readonly: 39,
      isc_spb_prp_am_readwrite: 40,
      // RESERVE_SPACE_PARAMETERS
      isc_spb_prp_res_use_full: 35,
      isc_spb_prp_res: 36,
      // Option Flags
      isc_spb_prp_activate: 256,
      isc_spb_prp_db_online: 512
    }, serviceInfo = {
      isc_info_svc_svr_db_info: 50,
      /* Retrieves the number	of attachments and databases */
      isc_info_svc_get_license: 51,
      /* Retrieves all license keys and IDs from the license file	*/
      isc_info_svc_get_license_mask: 52,
      /* Retrieves a bitmask representing	licensed options on	the	server */
      isc_info_svc_get_config: 53,
      /* Retrieves the parameters	and	values for IB_CONFIG */
      isc_info_svc_version: 54,
      /* Retrieves the version of	the	services manager */
      isc_info_svc_server_version: 55,
      /* Retrieves the version of	the	InterBase server */
      isc_info_svc_implementation: 56,
      /* Retrieves the implementation	of the InterBase server	*/
      isc_info_svc_capabilities: 57,
      /* Retrieves a bitmask representing	the	server's capabilities */
      isc_info_svc_user_dbpath: 58,
      /* Retrieves the path to the security database in use by the server	*/
      isc_info_svc_get_env: 59,
      /* Retrieves the setting of	$INTERBASE */
      isc_info_svc_get_env_lock: 60,
      /* Retrieves the setting of	$INTERBASE_LCK */
      isc_info_svc_get_env_msg: 61,
      /* Retrieves the setting of	$INTERBASE_MSG */
      isc_info_svc_line: 62,
      /* Retrieves 1 line	of service output per call */
      isc_info_svc_to_eof: 63,
      /* Retrieves as much of	the	server output as will fit in the supplied buffer */
      isc_info_svc_timeout: 64,
      /* Sets	/ signifies	a timeout value	for	reading	service	information	*/
      isc_info_svc_get_licensed_users: 65,
      /* Retrieves the number	of users licensed for accessing	the	server */
      isc_info_svc_limbo_trans: 66,
      /* Retrieve	the	limbo transactions */
      isc_info_svc_running: 67,
      /* Checks to see if	a service is running on	an attachment */
      isc_info_svc_get_users: 68,
      /* Returns the user	information	from isc_action_svc_display_users */
      isc_info_svc_stdin: 78
    }, spb = {
      isc_spb_version1: 1,
      isc_spb_current_version: 2,
      isc_spb_version: 2,
      // isc_spb_current_version,
      isc_spb_user_name: dpb.isc_dpb_user_name,
      isc_spb_sys_user_name: dpb.isc_dpb_sys_user_name,
      isc_spb_sys_user_name_enc: dpb.isc_dpb_sys_user_name_enc,
      isc_spb_password: dpb.isc_dpb_password,
      isc_spb_password_enc: dpb.isc_dpb_password_enc,
      isc_spb_command_line: 105,
      isc_spb_dbname: 106,
      isc_spb_verbose: 107,
      isc_spb_options: 108
    }, serviceBackup = {
      isc_spb_bkp_file: 5,
      isc_spb_bkp_factor: 6,
      isc_spb_bkp_length: 7,
      isc_spb_bkp_ignore_checksums: 1,
      isc_spb_bkp_ignore_limbo: 2,
      isc_spb_bkp_metadata_only: 4,
      isc_spb_bkp_no_garbage_collect: 8,
      isc_spb_bkp_old_descriptions: 16,
      isc_spb_bkp_non_transportable: 32,
      isc_spb_bkp_convert: 64,
      isc_spb_bkp_expand: 128,
      isc_spb_bkp_no_triggers: 32768,
      isc_spb_bkp_parallel_workers: 21,
      // nbackup
      isc_spb_nbk_level: 5,
      isc_spb_nbk_file: 6,
      isc_spb_nbk_direct: 7,
      isc_spb_nbk_no_triggers: 1
    }, serviceRestore = {
      isc_spb_res_buffers: 9,
      isc_spb_res_page_size: 10,
      isc_spb_res_length: 11,
      isc_spb_res_access_mode: 12,
      isc_spb_res_parallel_workers: 21,
      isc_spb_res_fix_fss_data: 13,
      isc_spb_res_fix_fss_metadata: 14,
      isc_spb_res_am_readonly: service.isc_spb_prp_am_readonly,
      isc_spb_res_am_readwrite: service.isc_spb_prp_am_readwrite,
      isc_spb_res_deactivate_idx: 256,
      isc_spb_res_no_shadow: 512,
      isc_spb_res_no_validity: 1024,
      isc_spb_res_one_at_a_time: 2048,
      isc_spb_res_replace: 4096,
      isc_spb_res_create: 8192,
      isc_spb_res_use_all_space: 16384
    }, serviceRepair = {
      isc_spb_rpr_commit_trans: 15,
      isc_spb_rpr_rollback_trans: 34,
      isc_spb_rpr_recover_two_phase: 17,
      isc_spb_tra_id: 18,
      isc_spb_single_tra_id: 19,
      isc_spb_multi_tra_id: 20,
      isc_spb_tra_state: 21,
      isc_spb_tra_state_limbo: 22,
      isc_spb_tra_state_commit: 23,
      isc_spb_tra_state_rollback: 24,
      isc_spb_tra_state_unknown: 25,
      isc_spb_tra_host_site: 26,
      isc_spb_tra_remote_site: 27,
      isc_spb_tra_db_path: 28,
      isc_spb_tra_advise: 29,
      isc_spb_tra_advise_commit: 30,
      isc_spb_tra_advise_rollback: 31,
      isc_spb_tra_advise_unknown: 33,
      isc_spb_rpr_validate_db: 1,
      isc_spb_rpr_sweep_db: 2,
      isc_spb_rpr_mend_db: 4,
      isc_spb_rpr_list_limbo_trans: 8,
      isc_spb_rpr_check_db: 16,
      isc_spb_rpr_ignore_checksum: 32,
      isc_spb_rpr_kill_shadows: 64,
      isc_spb_rpr_full: 128,
      isc_spb_rpr_icu: 2048,
      isc_spb_rpr_par_workers: 52
    }, serviceSecurity = {
      isc_spb_sec_userid: 5,
      isc_spb_sec_groupid: 6,
      isc_spb_sec_username: 7,
      isc_spb_sec_password: 8,
      isc_spb_sec_groupname: 9,
      isc_spb_sec_firstname: 10,
      isc_spb_sec_middlename: 11,
      isc_spb_sec_lastname: 12,
      isc_spb_sec_admin: 13
    }, serviceLicence = {
      isc_spb_lic_key: 5,
      isc_spb_lic_id: 6,
      isc_spb_lic_desc: 7
    }, serviceStatistics = {
      isc_spb_sts_data_pages: 1,
      isc_spb_sts_db_log: 2,
      isc_spb_sts_hdr_pages: 4,
      isc_spb_sts_idx_pages: 8,
      isc_spb_sts_sys_relations: 16,
      isc_spb_sts_record_versions: 32,
      isc_spb_sts_table: 64,
      isc_spb_sts_nocreation: 128,
      isc_spb_sts_encryption: 256
    }, serviceTrace = {
      isc_spb_trc_id: 1,
      isc_spb_trc_name: 2,
      isc_spb_trc_cfg: 3
    }, Const = Object.freeze({
      ...acceptType,
      ...authPlugin,
      ...authOptions,
      ...blr,
      ...blobType,
      ...batch,
      ...buffer,
      ...cancelKind,
      ...cnct,
      ...common,
      ...connect,
      ...defaultOptions,
      DESCRIBE,
      DESCRIBE_WITH_SCHEMA,
      RECORDS_INFO,
      ...dpb,
      ...dsql,
      ...fetchOp,
      ...int,
      ...iscAction,
      ...iscError,
      ...numericMode,
      ...op,
      ...protocol,
      ...service,
      ...serviceBackup,
      ...serviceInfo,
      ...serviceLicence,
      ...serviceRestore,
      ...serviceRepair,
      ...serviceSecurity,
      ...serviceStatistics,
      ...serviceTrace,
      ...sqlInfo,
      ...sqlType,
      ...spb,
      ...statementInfo,
      SUPPORTED_PROTOCOL,
      ...tpb,
      ...transactionIsolation
    });
    module2.exports = Const;
  }
});

// node_modules/node-firebird/lib/callback.js
var require_callback = __commonJS({
  "node_modules/node-firebird/lib/callback.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: !0 });
    exports2.toError = toError;
    exports2.withPooledConnection = withPooledConnection;
    exports2.fromCallback = fromCallback;
    exports2.doError = doError;
    exports2.doCallback = doCallback;
    function toError(err) {
      if (err instanceof Error)
        return err;
      var error = new Error(err != null && typeof err == "object" && err.message ? err.message : String(err));
      return err != null && typeof err == "object" && Object.assign(error, err), error;
    }
    async function withPooledConnection(getAsync, work) {
      let db = await getAsync();
      try {
        return await work(db);
      } finally {
        await new Promise(function(resolve) {
          db.detach(function() {
            resolve();
          });
        });
      }
    }
    function fromCallback(executor) {
      return new Promise(function(resolve, reject) {
        executor(function(err, result) {
          err ? reject(toError(err)) : resolve(result);
        });
      });
    }
    function doError(obj, callback) {
      callback && callback(obj);
    }
    function isError(obj) {
      return !!(obj != null && typeof obj == "object" && !Array.isArray(obj) && obj.status);
    }
    function doCallback(obj, callback) {
      if (callback) {
        if (obj instanceof Error) {
          callback(obj);
          return;
        }
        if (isError(obj)) {
          var error = new Error(obj.message), status = obj.status && obj.status.length && obj.status[0] || {};
          error.gdscode = status.gdscode, error.gdsparams = status.params, callback(error);
          return;
        }
        callback(void 0, obj);
      }
    }
  }
});

// node_modules/node-firebird/lib/ieee754-decimal.js
var require_ieee754_decimal = __commonJS({
  "node_modules/node-firebird/lib/ieee754-decimal.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: !0 });
    exports2.encodeDecimal64 = encodeDecimal64;
    exports2.decodeDecimal64 = decodeDecimal64;
    exports2.encodeDecimal128 = encodeDecimal128;
    exports2.decodeDecimal128 = decodeDecimal128;
    var DECIMAL64_BIAS = 398, DECIMAL64_MAX_EXPONENT = 369, DECIMAL64_MAX_COEFFICIENT = 9999999999999999n, DECIMAL128_BIAS = 6176, DECIMAL128_MAX_EXPONENT = 6111, DECIMAL128_MAX_COEFFICIENT = 9999999999999999999999999999999999n, DECIMAL64_INFINITY = 0x7800000000000000n, DECIMAL64_NEG_INFINITY = 0xf800000000000000n, DECIMAL64_NAN = 0x7c00000000000000n, DECIMAL128_INFINITY_HIGH = 0x7800000000000000n, DECIMAL128_NEG_INFINITY_HIGH = 0xf800000000000000n, DECIMAL128_NAN_HIGH = 0x7c00000000000000n;
    function encodeDecimal64(value) {
      if (value == null)
        return Buffer.alloc(8);
      if (typeof value == "number") {
        if (isNaN(value))
          return bigIntToBuffer(DECIMAL64_NAN, 8);
        if (!isFinite(value))
          return bigIntToBuffer(value > 0 ? DECIMAL64_INFINITY : DECIMAL64_NEG_INFINITY, 8);
        value = value.toString();
      }
      if (Buffer.isBuffer(value))
        return value.slice(0, 8);
      let str = value.toString(), sign = str.startsWith("-") ? 1n : 0n, absStr = str.replace(/^-/, "");
      if (parseFloat(absStr) === 0)
        return bigIntToBuffer(sign << 63n, 8);
      let coefficient, exponent, eIndex = absStr.toLowerCase().indexOf("e");
      if (eIndex !== -1) {
        let mantissa = absStr.substring(0, eIndex).replace(".", "");
        coefficient = mantissa === "" || mantissa === "-" ? 0n : BigInt(mantissa);
        let expPart = absStr.substring(eIndex + 1), dotIndex = absStr.indexOf(".");
        dotIndex !== -1 && dotIndex < eIndex ? exponent = parseInt(expPart) - (eIndex - dotIndex - 1) : exponent = parseInt(expPart);
      } else {
        let dotIndex = absStr.indexOf(".");
        if (dotIndex !== -1) {
          let withoutDot = absStr.replace(".", "");
          coefficient = withoutDot === "" || withoutDot === "-" ? 0n : BigInt(withoutDot), exponent = -(absStr.length - dotIndex - 1);
        } else
          coefficient = absStr === "" || absStr === "-" ? 0n : BigInt(absStr), exponent = 0;
      }
      for (; coefficient % 10n === 0n && coefficient !== 0n && exponent < DECIMAL64_MAX_EXPONENT; )
        coefficient /= 10n, exponent++;
      if (coefficient > DECIMAL64_MAX_COEFFICIENT)
        throw new Error(`Coefficient ${coefficient} exceeds Decimal64 maximum`);
      let biasedExponent = exponent + DECIMAL64_BIAS;
      if (biasedExponent < 0 || biasedExponent > 767)
        throw new Error(`Exponent ${exponent} out of Decimal64 range`);
      let encoded = 0n;
      encoded |= sign << 63n;
      let msd = Number(coefficient / 1000000000000000n), coeffCont = coefficient % 1000000000000000n, expBigInt = BigInt(biasedExponent), expTop = expBigInt >> 8n & 0x3n, expLow = expBigInt & 0xffn;
      if (msd <= 7) {
        let combo = expTop << 3n | BigInt(msd);
        encoded |= combo << 58n, encoded |= expLow << 50n, encoded |= coeffCont & 0x3ffffffffffffn;
      } else {
        let combo = 0x18n | (BigInt(msd - 8) & 0x1n) << 2n | expTop;
        encoded |= combo << 58n, encoded |= expLow << 50n, encoded |= coeffCont & 0x3ffffffffffffn;
      }
      return bigIntToBuffer(encoded, 8);
    }
    function decodeDecimal64(buffer) {
      if (buffer.length !== 8)
        throw new Error("Decimal64 buffer must be 8 bytes");
      let encoded = bufferToBigInt(buffer), sign = encoded >> 63n & 0x1n, combo = encoded >> 58n & 0x1fn;
      if ((combo & 0x1en) === 0x1en)
        return (combo & 0x1n) === 0n ? sign ? -1 / 0 : 1 / 0 : NaN;
      let exponent, coefficient, msd;
      if ((combo & 0x18n) !== 0x18n) {
        msd = Number(combo & 0x7n);
        let expTop = combo >> 3n & 0x3n, expLow = encoded >> 50n & 0xffn;
        exponent = expTop << 8n | expLow;
        let coeffCont = encoded & 0x3ffffffffffffn;
        coefficient = BigInt(msd) * 1000000000000000n + coeffCont;
      } else {
        msd = 8 + Number(combo >> 2n & 0x1n);
        let expTop = combo & 0x3n, expLow = encoded >> 50n & 0xffn;
        exponent = expTop << 8n | expLow;
        let coeffCont = encoded & 0x3ffffffffffffn;
        coefficient = BigInt(msd) * 1000000000000000n + coeffCont;
      }
      let unbias = Number(exponent) - DECIMAL64_BIAS, coeffStr = coefficient.toString(), signStr = sign ? "-" : "";
      if (coefficient === 0n)
        return signStr + "0";
      if (unbias === 0)
        return signStr + coeffStr;
      if (unbias > 0)
        return signStr + coeffStr + "0".repeat(unbias);
      {
        let absExp = -unbias;
        if (absExp >= coeffStr.length)
          return signStr + "0." + "0".repeat(absExp - coeffStr.length) + coeffStr;
        {
          let intPart = coeffStr.substring(0, coeffStr.length - absExp), fracPart = coeffStr.substring(coeffStr.length - absExp);
          return signStr + intPart + "." + fracPart;
        }
      }
    }
    function encodeDecimal128(value) {
      if (value == null)
        return Buffer.alloc(16);
      if (typeof value == "number") {
        if (isNaN(value)) {
          let buf2 = Buffer.alloc(16);
          return bufferWriteBigInt(buf2, DECIMAL128_NAN_HIGH, 0, 8), buf2;
        }
        if (!isFinite(value)) {
          let buf2 = Buffer.alloc(16);
          return bufferWriteBigInt(buf2, value > 0 ? DECIMAL128_INFINITY_HIGH : DECIMAL128_NEG_INFINITY_HIGH, 0, 8), buf2;
        }
        value = value.toString();
      }
      if (Buffer.isBuffer(value))
        return value.slice(0, 16);
      let str = value.toString(), sign = str.startsWith("-") ? 1n : 0n, absStr = str.replace(/^-/, "");
      if (parseFloat(absStr) === 0) {
        let buf2 = Buffer.alloc(16);
        return bufferWriteBigInt(buf2, sign << 63n, 0, 8), buf2;
      }
      let coefficient, exponent, eIndex = absStr.toLowerCase().indexOf("e");
      if (eIndex !== -1) {
        let mantissa = absStr.substring(0, eIndex).replace(".", "");
        coefficient = mantissa === "" || mantissa === "-" ? 0n : BigInt(mantissa);
        let expPart = absStr.substring(eIndex + 1), dotIndex = absStr.indexOf(".");
        dotIndex !== -1 && dotIndex < eIndex ? exponent = parseInt(expPart) - (eIndex - dotIndex - 1) : exponent = parseInt(expPart);
      } else {
        let dotIndex = absStr.indexOf(".");
        if (dotIndex !== -1) {
          let withoutDot = absStr.replace(".", "");
          coefficient = withoutDot === "" || withoutDot === "-" ? 0n : BigInt(withoutDot), exponent = -(absStr.length - dotIndex - 1);
        } else
          coefficient = absStr === "" || absStr === "-" ? 0n : BigInt(absStr), exponent = 0;
      }
      for (; coefficient % 10n === 0n && coefficient !== 0n && exponent < DECIMAL128_MAX_EXPONENT; )
        coefficient /= 10n, exponent++;
      if (coefficient > DECIMAL128_MAX_COEFFICIENT)
        throw new Error(`Coefficient ${coefficient} exceeds Decimal128 maximum`);
      let biasedExponent = exponent + DECIMAL128_BIAS;
      if (biasedExponent < 0 || biasedExponent > 12287)
        throw new Error(`Exponent ${exponent} out of Decimal128 range`);
      let expBigInt = BigInt(biasedExponent), msd = Number(coefficient / 1000000000000000000000000000000000n), coeffCont = coefficient % 1000000000000000000000000000000000n, high = 0n, low = coeffCont & (1n << 64n) - 1n;
      high |= sign << 63n;
      let expTop = expBigInt >> 12n & 0x3n, expLow = expBigInt & 0xfffn;
      if (msd <= 7) {
        let combo = expTop << 3n | BigInt(msd);
        high |= combo << 58n, high |= expLow << 46n, high |= coeffCont >> 64n & 0x3fffffffffffn;
      } else {
        let combo = 0x18n | (BigInt(msd - 8) & 0x1n) << 2n | expTop;
        high |= combo << 58n, high |= expLow << 46n, high |= coeffCont >> 64n & 0x3fffffffffffn;
      }
      let buf = Buffer.alloc(16);
      return bufferWriteBigInt(buf, high, 0, 8), bufferWriteBigInt(buf, low, 8, 8), buf;
    }
    function decodeDecimal128(buffer) {
      if (buffer.length !== 16)
        throw new Error("Decimal128 buffer must be 16 bytes");
      let high = bufferToBigInt(buffer.slice(0, 8)), low = bufferToBigInt(buffer.slice(8, 16)), sign = high >> 63n & 0x1n, combo = high >> 58n & 0x1fn;
      if ((combo & 0x1en) === 0x1en)
        return (combo & 0x1n) === 0n ? sign ? -1 / 0 : 1 / 0 : NaN;
      let exponent, coefficient, msd;
      if ((combo & 0x18n) !== 0x18n) {
        msd = Number(combo & 0x7n);
        let expTop = combo >> 3n & 0x3n, expLow = high >> 46n & 0xfffn;
        exponent = expTop << 12n | expLow, coefficient = (high & 0x3fffffffffffn) << 64n | low, coefficient = BigInt(msd) * 1000000000000000000000000000000000n + coefficient;
      } else {
        msd = 8 + Number(combo >> 2n & 0x1n);
        let expTop = combo & 0x3n, expLow = high >> 46n & 0xfffn;
        exponent = expTop << 12n | expLow, coefficient = (high & 0x3fffffffffffn) << 64n | low, coefficient = BigInt(msd) * 1000000000000000000000000000000000n + coefficient;
      }
      let unbias = Number(exponent) - DECIMAL128_BIAS, coeffStr = coefficient.toString(), signStr = sign ? "-" : "";
      if (coefficient === 0n)
        return signStr + "0";
      if (unbias === 0)
        return signStr + coeffStr;
      if (unbias > 0)
        return signStr + coeffStr + "0".repeat(unbias);
      {
        let absExp = -unbias;
        if (absExp >= coeffStr.length)
          return signStr + "0." + "0".repeat(absExp - coeffStr.length) + coeffStr;
        {
          let intPart = coeffStr.substring(0, coeffStr.length - absExp), fracPart = coeffStr.substring(coeffStr.length - absExp);
          return signStr + intPart + "." + fracPart;
        }
      }
    }
    function bigIntToBuffer(value, size) {
      let buf = Buffer.alloc(size), val = BigInt(value.toString());
      for (let i = size - 1; i >= 0; i--)
        buf[i] = Number(val & 0xffn), val >>= 8n;
      return buf;
    }
    function bufferToBigInt(buffer) {
      let result = 0n;
      for (let i = 0; i < buffer.length; i++)
        result = result << 8n | BigInt(buffer[i]);
      return result;
    }
    function bufferWriteBigInt(buffer, value, offset, size) {
      let val = BigInt(value.toString());
      for (let i = offset + size - 1; i >= offset; i--)
        buffer[i] = Number(val & 0xffn), val >>= 8n;
    }
  }
});

// node_modules/node-firebird/lib/wire/serialize.js
var require_serialize = __commonJS({
  "node_modules/node-firebird/lib/wire/serialize.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: !0 });
    exports2.BitSet = exports2.XdrReader = exports2.XdrWriter = exports2.BlrReader = exports2.BlrWriter = void 0;
    var ieee754_decimal_1 = require_ieee754_decimal();
    function align(n) {
      return n + 3 & -4;
    }
    var MAX_STRING_SIZE = 255, BlrWriter = class {
      constructor(size) {
        this.buffer = Buffer.alloc(size || 32), this.pos = 0;
      }
      ensure(len) {
        for (var newlen = this.buffer.length; newlen < this.pos + len; )
          newlen *= 2;
        if (!(this.buffer.length >= newlen)) {
          var b = Buffer.alloc(newlen);
          this.buffer.copy(b), this.buffer = b;
        }
      }
      addByte(b) {
        this.ensure(1), this.buffer.writeUInt8(b, this.pos), this.pos++;
      }
      addShort(b) {
        this.ensure(1), this.buffer.writeInt8(b, this.pos), this.pos++;
      }
      addSmall(b) {
        this.ensure(2), this.buffer.writeInt16LE(b, this.pos), this.pos += 2;
      }
      addWord(b) {
        this.ensure(2), this.buffer.writeUInt16LE(b, this.pos), this.pos += 2;
      }
      addInt32(b) {
        this.ensure(4), this.buffer.writeUInt32LE(b, this.pos), this.pos += 4;
      }
      addByteInt32(c, b) {
        this.addByte(c), this.ensure(4), this.buffer.writeUInt32LE(b, this.pos), this.pos += 4;
      }
      addNumeric(c, v) {
        if (v < 256) {
          this.ensure(3), this.buffer.writeUInt8(c, this.pos), this.pos++, this.buffer.writeUInt8(1, this.pos), this.pos++, this.buffer.writeUInt8(v, this.pos), this.pos++;
          return;
        }
        this.ensure(6), this.buffer.writeUInt8(c, this.pos), this.pos++, this.buffer.writeUInt8(4, this.pos), this.pos++, this.buffer.writeInt32BE(v, this.pos), this.pos += 4;
      }
      addBytes(b) {
        this.ensure(b.length);
        for (var i = 0, length = b.length; i < length; i++)
          this.buffer.writeUInt8(b[i], this.pos), this.pos++;
      }
      addString(c, s, encoding) {
        this.addByte(c);
        var len = Buffer.byteLength(s, encoding);
        if (len > MAX_STRING_SIZE)
          throw new Error("blr string is too big");
        this.ensure(len + 1), this.buffer.writeUInt8(len, this.pos), this.pos++, this.buffer.write(s, this.pos, len, encoding), this.pos += len;
      }
      addBuffer(b) {
        this.addWord(b.length), this.ensure(b.length), b.copy(this.buffer, this.pos), this.pos += b.length;
      }
      addString2(c, s, encoding) {
        this.addByte(c);
        var len = Buffer.byteLength(s, encoding);
        if (len > MAX_STRING_SIZE * MAX_STRING_SIZE)
          throw new Error("blr string is too big");
        this.ensure(len + 2), this.buffer.writeUInt16LE(len, this.pos), this.pos += 2, this.buffer.write(s, this.pos, len, encoding), this.pos += len;
      }
      addMultiblockPart(c, s, encoding) {
        for (var buff = Buffer.from(s, encoding), remaining = buff.length, step = 0; remaining > 0; ) {
          var toWrite = Math.min(remaining, 254);
          this.addByte(c), this.addByte(toWrite + 1), this.addByte(step), this.ensure(toWrite), buff.copy(this.buffer, this.pos, step * 254, step * 254 + toWrite), step++, remaining -= toWrite, this.pos += toWrite;
        }
      }
    };
    exports2.BlrWriter = BlrWriter;
    var BlrReader = class {
      constructor(buffer) {
        this.buffer = buffer, this.pos = 0;
      }
      readByteCode() {
        return this.buffer.readUInt8(this.pos++);
      }
      readInt32() {
        var value = this.buffer.readUInt32LE(this.pos);
        return this.pos += 4, value;
      }
      readInt() {
        var len = this.buffer.readUInt16LE(this.pos);
        this.pos += 2;
        var value;
        switch (len) {
          case 1:
            value = this.buffer.readInt8(this.pos);
            break;
          case 2:
            value = this.buffer.readInt16LE(this.pos);
            break;
          case 4:
            value = this.buffer.readInt32LE(this.pos);
            break;
          case 8:
            value = Number(this.buffer.readBigInt64LE(this.pos));
        }
        return this.pos += len, value;
      }
      readString(encoding) {
        var len = this.buffer.readUInt16LE(this.pos), str;
        return this.pos += 2, len <= 0 ? "" : (str = this.buffer.toString(encoding, this.pos, this.pos + len), this.pos += len, str);
      }
      readSegment() {
        var ret, tmp, len = this.buffer.readUInt16LE(this.pos);
        for (this.pos += 2; len > 0 && (ret ? (tmp = ret, ret = Buffer.alloc(tmp.length + len), tmp.copy(ret), this.buffer.copy(ret, tmp.length, this.pos, this.pos + len)) : (ret = Buffer.alloc(len), this.buffer.copy(ret, 0, this.pos, this.pos + len)), this.pos += len, this.pos !== this.buffer.length); )
          len = this.buffer.readUInt16LE(this.pos), this.pos += 2;
        return ret || Buffer.alloc(0);
      }
    };
    exports2.BlrReader = BlrReader;
    var XdrWriter = class {
      constructor(size) {
        this.buffer = Buffer.alloc(size || 32), this.pos = 0;
      }
      ensure(len) {
        for (var newlen = this.buffer.length; newlen < this.pos + len; )
          newlen *= 2;
        if (!(this.buffer.length >= newlen)) {
          var b = Buffer.alloc(newlen);
          this.buffer.copy(b), this.buffer = b;
        }
      }
      addInt(value) {
        this.ensure(4), this.buffer.writeInt32BE(value, this.pos), this.pos += 4;
      }
      addInt64(value) {
        this.ensure(8), this.buffer.writeBigInt64BE(typeof value == "bigint" ? value : BigInt(Math.trunc(value)), this.pos), this.pos += 8;
      }
      addInt128(value) {
        this.ensure(16);
        let bigValue = BigInt(value), high = bigValue >> BigInt(64), low = bigValue & BigInt("0xFFFFFFFFFFFFFFFF");
        this.buffer.writeBigInt64BE(high, this.pos), this.pos += 8, this.buffer.writeBigUInt64BE(low, this.pos), this.pos += 8;
      }
      addDecFloat16(value) {
        this.ensure(8), (0, ieee754_decimal_1.encodeDecimal64)(value).copy(this.buffer, this.pos, 0, 8), this.pos += 8;
      }
      addDecFloat34(value) {
        this.ensure(16), (0, ieee754_decimal_1.encodeDecimal128)(value).copy(this.buffer, this.pos, 0, 16), this.pos += 16;
      }
      addUInt(value) {
        this.ensure(4), this.buffer.writeUInt32BE(value, this.pos), this.pos += 4;
      }
      addString(s, encoding) {
        var len = Buffer.byteLength(s, encoding), alen = align(len);
        this.ensure(alen + 4), this.buffer.writeInt32BE(len, this.pos), this.pos += 4, this.buffer.write(s, this.pos, len, encoding), this.buffer.fill(0, this.pos + len, this.pos + alen), this.pos += alen;
      }
      /** addString for pre-encoded bytes (codepage connection charsets). */
      addStringBuffer(b) {
        var alen = align(b.length);
        this.ensure(alen + 4), this.buffer.writeInt32BE(b.length, this.pos), this.pos += 4, b.copy(this.buffer, this.pos), this.buffer.fill(0, this.pos + b.length, this.pos + alen), this.pos += alen;
      }
      addText(s, encoding) {
        var len = Buffer.byteLength(s, encoding), alen = align(len);
        this.ensure(alen), this.buffer.write(s, this.pos, len, encoding), this.buffer.fill(0, this.pos + len, this.pos + alen), this.pos += alen;
      }
      addParamBuffer(b) {
        var len = b.length, alen = align(len);
        this.ensure(alen), b.copy(this.buffer, this.pos), this.buffer.fill(0, this.pos + len, this.pos + alen), this.pos += alen;
      }
      addBlr(blr) {
        var alen = align(blr.pos);
        this.ensure(alen + 4), this.buffer.writeInt32BE(blr.pos, this.pos), this.pos += 4, blr.buffer.copy(this.buffer, this.pos, 0, blr.pos), this.buffer.fill(0, this.pos + blr.pos, this.pos + alen), this.pos += alen;
      }
      getData() {
        return this.buffer.slice(0, this.pos);
      }
      addDouble(value) {
        this.ensure(8), this.buffer.writeDoubleBE(value, this.pos), this.pos += 8;
      }
      addFloat(value) {
        this.ensure(4), this.buffer.writeFloatBE(value, this.pos), this.pos += 4;
      }
      addQuad(quad) {
        this.ensure(8);
        var b = this.buffer;
        b.writeInt32BE(quad.high, this.pos), this.pos += 4, b.writeInt32BE(quad.low, this.pos), this.pos += 4;
      }
      addBuffer(buffer) {
        this.ensure(buffer.length), buffer.copy(this.buffer, this.pos, 0, buffer.length), this.pos += buffer.length;
      }
      addAlignment(len) {
        var alen = 4 - len & 3;
        this.ensure(alen), this.buffer.write("ffffff", this.pos, alen, "hex"), this.pos += alen;
      }
    };
    exports2.XdrWriter = XdrWriter;
    var XdrReader = class {
      constructor(buffer) {
        this.buffer = buffer, this.pos = 0;
      }
      readInt() {
        var r = this.buffer.readInt32BE(this.pos);
        return this.pos += 4, r;
      }
      readUInt() {
        var r = this.buffer.readUInt32BE(this.pos);
        return this.pos += 4, r;
      }
      readInt64() {
        return Number(this.readInt64BigInt());
      }
      readInt64BigInt() {
        let result = this.buffer.readBigInt64BE(this.pos);
        return this.pos += 8, result;
      }
      readInt128() {
        var high = this.buffer.readBigUInt64BE(this.pos);
        this.pos += 8;
        var low = this.buffer.readBigUInt64BE(this.pos);
        return this.pos += 8, (BigInt(high) << BigInt(64)) + BigInt(low);
      }
      readInt128Signed() {
        var high = this.buffer.readBigInt64BE(this.pos);
        this.pos += 8;
        var low = this.buffer.readBigUInt64BE(this.pos);
        return this.pos += 8, (BigInt(high) << BigInt(64)) + BigInt(low);
      }
      readDecFloat16() {
        let buf = this.buffer.slice(this.pos, this.pos + 8);
        return this.pos += 8, (0, ieee754_decimal_1.decodeDecimal64)(buf);
      }
      readDecFloat34() {
        let buf = this.buffer.slice(this.pos, this.pos + 16);
        return this.pos += 16, (0, ieee754_decimal_1.decodeDecimal128)(buf);
      }
      readShort() {
        var r = this.buffer.readInt16BE(this.pos);
        return this.pos += 2, r;
      }
      readQuad() {
        var b = this.buffer, high = b.readInt32BE(this.pos);
        this.pos += 4;
        var low = b.readInt32BE(this.pos);
        return this.pos += 4, { low, high };
      }
      readFloat() {
        var r = this.buffer.readFloatBE(this.pos);
        return this.pos += 4, r;
      }
      readDouble() {
        var r = this.buffer.readDoubleBE(this.pos);
        return this.pos += 8, r;
      }
      readArray() {
        var len = this.readInt();
        if (len) {
          len < 0 && (len &= 65535);
          var r = this.buffer.slice(this.pos, this.pos + len);
          return this.pos += align(len), r;
        }
      }
      readBuffer(len, toAlign = !0) {
        if (arguments.length || (len = this.readInt()), len != null) {
          if (len <= 0)
            return Buffer.alloc(0);
          var r = this.buffer.slice(this.pos, this.pos + len);
          return this.pos += toAlign ? align(len) : len, r;
        }
      }
      readString(encoding) {
        var len = this.readInt();
        return this.readText(len, encoding);
      }
      readText(len, encoding) {
        if (len <= 0)
          return "";
        var r = this.buffer.toString(encoding, this.pos, this.pos + len);
        return this.pos += align(len), r;
      }
    };
    exports2.XdrReader = XdrReader;
    var WORD_LOG = 5, BUFFER_BITS = 8, BIT_ON = 1, BIT_OFF = 0, BitSet = class {
      constructor(buffer) {
        if (this.data = [], buffer) {
          this.scale(buffer.length * BUFFER_BITS);
          for (var i = 0; i < buffer.length; i++)
            for (var n = buffer[i], j = 0; j < BUFFER_BITS; j++) {
              var k = i * BUFFER_BITS + j;
              this.data[k >>> WORD_LOG] |= (n >> j & BIT_ON) << k;
            }
        }
      }
      scale(index) {
        for (var l = index >>> WORD_LOG, i = this.data.length; l >= i; l--)
          this.data.push(BIT_OFF);
      }
      set(index, value) {
        let pos = index >>> 3;
        for (let i = this.data.length; pos >= i; pos--)
          this.data.push(BIT_OFF);
        pos = index >>> 3, value === void 0 || value ? this.data[pos] |= 1 << index % BUFFER_BITS : this.data[pos] &= ~(1 << index % BUFFER_BITS);
      }
      get(index) {
        var n = index >>> WORD_LOG;
        return n >= this.data.length ? BIT_OFF : this.data[n] >>> index & BIT_ON;
      }
      toBuffer() {
        return Buffer.from(this.data);
      }
    };
    exports2.BitSet = BitSet;
  }
});

// node_modules/node-firebird/lib/srp.js
var require_srp = __commonJS({
  "node_modules/node-firebird/lib/srp.js"(exports2) {
    "use strict";
    var __importDefault = exports2 && exports2.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { default: mod };
    };
    Object.defineProperty(exports2, "__esModule", { value: !0 });
    exports2.PRIME_N = void 0;
    exports2.clientSeed = clientSeed;
    exports2.serverSeed = serverSeed;
    exports2.serverSession = serverSession;
    exports2.clientProof = clientProof;
    exports2.hexPad = hexPad;
    var crypto_1 = __importDefault(require("crypto")), SRP_KEY_SIZE = 128, SRP_KEY_MAX = BigInt("340282366920938463463374607431768211456"), DEBUG = !1, DEBUG_PRIVATE_KEY = BigInt("0x84316857F47914F838918D5C12CE3A3E7A9B2D7C9486346809E9EEFCE8DE7CD4259D8BE4FD0BCC2D259553769E078FA61EE2977025E4DA42F7FD97914D8A33723DFAFBC00770B7DA0C2E3778A05790F0C0F33C32A19ED88A12928567749021B3FD45DCD1CE259C45325067E3DDC972F87867349BA82C303CCCAA9B207218007B"), PRIME = {
      N: BigInt("0xE67D2E994B2F900C3F41F08F5BB2627ED0D49EE1FE767A52EFCD565CD6E768812C3E1E9CE8F0A8BEA6CB13CD29DDEBF7A96D4A93B55D488DF099A15C89DCB0640738EB2CBDD9A8F7BAB561AB1B0DC1C6CDABF303264A08D1BCA932D1F1EE428B619D970F342ABA9A65793B8B2F041AE5364350C16F735F56ECBCA87BD57B29E7"),
      g: BigInt(2),
      k: BigInt("1277432915985975349439481660349303019122249719989")
    }, kCache = {};
    function getK(hashAlgo) {
      return kCache[hashAlgo] || (kCache[hashAlgo] = BigInt("0x" + getHash(hashAlgo, pad(PRIME.N), pad(PRIME.g)))), kCache[hashAlgo];
    }
    function clientSeed(a = toBigInt(crypto_1.default.randomBytes(SRP_KEY_SIZE)) % PRIME.N) {
      var A = modPow(PRIME.g, a, PRIME.N);
      return dump("a", a), dump("A", A), {
        public: A,
        private: a
      };
    }
    function serverSeed(user, password, salt, b, hashAlgo = "sha1") {
      typeof b == "string" && (hashAlgo = b, b = void 0);
      let bKey = b ?? toBigInt(crypto_1.default.randomBytes(SRP_KEY_SIZE));
      var v = getVerifier(user, password, salt, "sha1"), gb = modPow(PRIME.g, bKey, PRIME.N), k = getK("sha1"), kv = k * v % PRIME.N, B = (kv + gb) % PRIME.N;
      return dump("v", v), dump("b", bKey), dump("gb", bKey), dump("kv", v), dump("B", B), {
        public: B,
        private: bKey
      };
    }
    function serverSession(user, password, salt, A, B, b, hashAlgo = "sha1") {
      var u = getScramble(A, B, "sha1"), v = getVerifier(user, password, salt, "sha1"), vu = modPow(v, u, PRIME.N), Avu = A * vu % PRIME.N, sessionSecret = modPow(Avu, b, PRIME.N), K = getHash("sha1", toBuffer(sessionSecret));
      return dump("server sessionSecret", sessionSecret), dump("server K", K), BigInt("0x" + K);
    }
    function clientProof(user, password, salt, A, B, a, hashAlgo = "sha1") {
      var K = clientSession(user, password, salt, A, B, a, "sha1"), n1, n2;
      n1 = toBigInt(getHash("sha1", toBuffer(PRIME.N))), n2 = toBigInt(getHash("sha1", toBuffer(PRIME.g))), dump("n1", n1), dump("n2", n2), n1 = modPow(n1, n2, PRIME.N), n2 = toBigInt(getHash("sha1", user));
      var M = toBigInt(getHash(hashAlgo, toBuffer(n1), toBuffer(n2), salt, toBuffer(A), toBuffer(B), K));
      return dump("n1-2", n1), dump("n2-2", n2), dump("proof:M", M), {
        clientSessionKey: toBigInt(K),
        authData: M
      };
    }
    function hexPad(hex) {
      return hex.length % 2 !== 0 && (hex = "0" + hex), hex;
    }
    exports2.PRIME_N = PRIME.N;
    function pad(n) {
      var buff = Buffer.from(hexPad(n.toString(16)), "hex");
      if (buff.length > SRP_KEY_SIZE)
        buff = buff.slice(buff.length - SRP_KEY_SIZE, buff.length);
      else if (buff.length < SRP_KEY_SIZE) {
        var padded = Buffer.alloc(SRP_KEY_SIZE);
        buff.copy(padded, SRP_KEY_SIZE - buff.length), buff = padded;
      }
      return buff;
    }
    function getScramble(A, B, hashAlgo = "sha1") {
      return BigInt("0x" + getHash(hashAlgo, toBuffer(A), toBuffer(B)));
    }
    function clientSession(user, password, salt, A, B, a, hashAlgo = "sha1") {
      var u = getScramble(A, B, "sha1"), x = getUserHash(user, salt, password, "sha1"), gx = modPow(PRIME.g, x, PRIME.N), k = getK("sha1"), kgx = k * gx % PRIME.N, diff = (B - kgx) % PRIME.N;
      diff < 0n && (diff = diff + PRIME.N);
      var ux = u * x % PRIME.N, aux = (a + ux) % PRIME.N, sessionSecret = modPow(diff, aux, PRIME.N), K = Buffer.from(getHash("sha1", toBuffer(sessionSecret)), "hex");
      return dump("B", B), dump("u", u), dump("x", x), dump("gx", gx), dump("kgx", kgx), dump("diff", diff), dump("ux", ux), dump("aux", aux), dump("sessionSecret", sessionSecret), dump("sessionKey(K)", K), K;
    }
    function getUserHash(user, salt, password, hashAlgo = "sha1") {
      var hash1 = getHash(hashAlgo, user.toUpperCase(), ":", password), hash2 = getHash(hashAlgo, salt, toBuffer(hash1));
      return toBigInt(hash2);
    }
    function getVerifier(user, password, salt, hashAlgo = "sha1") {
      return modPow(PRIME.g, getUserHash(user, salt, password, hashAlgo), PRIME.N);
    }
    function getHash(algo, ...data) {
      var hash = crypto_1.default.createHash(algo);
      for (var d of data)
        hash.update(d);
      return hash.digest("hex");
    }
    function toBuffer(bigInt) {
      return Buffer.from(typeof bigInt == "bigint" ? hexPad(bigInt.toString(16)) : bigInt, "hex");
    }
    function toBigInt(hex) {
      return BigInt("0x" + (Buffer.isBuffer(hex) ? hex.toString("hex") : hex));
    }
    function dump(key, value) {
      DEBUG && (typeof value == "bigint" && (value = value.toString(16)), console.log(key + "=" + value));
    }
    function modPow(base, exp, mod) {
      let result = 1n;
      for (base = base % mod; exp > 0n; )
        exp & 1n && (result = result * base % mod), base = base * base % mod, exp >>= 1n;
      return result;
    }
  }
});

// node_modules/node-firebird/lib/unix-crypt.js
var require_unix_crypt = __commonJS({
  "node_modules/node-firebird/lib/unix-crypt.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: !0 });
    exports2.crypt = crypt;
    var CON_SALT = [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      16,
      17,
      18,
      19,
      20,
      21,
      22,
      23,
      24,
      25,
      26,
      27,
      28,
      29,
      30,
      31,
      32,
      33,
      34,
      35,
      36,
      37,
      32,
      33,
      34,
      35,
      36,
      37,
      38,
      39,
      40,
      41,
      42,
      43,
      44,
      45,
      46,
      47,
      48,
      49,
      50,
      51,
      52,
      53,
      54,
      55,
      56,
      57,
      58,
      59,
      60,
      61,
      62,
      63,
      0,
      0,
      0,
      0,
      0
    ], COV2CHAR = [
      46,
      47,
      48,
      49,
      50,
      51,
      52,
      53,
      54,
      55,
      56,
      57,
      65,
      66,
      67,
      68,
      69,
      70,
      71,
      72,
      73,
      74,
      75,
      76,
      77,
      78,
      79,
      80,
      81,
      82,
      83,
      84,
      85,
      86,
      87,
      88,
      89,
      90,
      97,
      98,
      99,
      100,
      101,
      102,
      103,
      104,
      105,
      106,
      107,
      108,
      109,
      110,
      111,
      112,
      113,
      114,
      115,
      116,
      117,
      118,
      119,
      120,
      121,
      122
    ], SHIFT2 = [!1, !1, !0, !0, !0, !0, !0, !0, !1, !0, !0, !0, !0, !0, !0, !1], SKB = [
      [
        0,
        16,
        536870912,
        536870928,
        65536,
        65552,
        536936448,
        536936464,
        2048,
        2064,
        536872960,
        536872976,
        67584,
        67600,
        536938496,
        536938512,
        32,
        48,
        536870944,
        536870960,
        65568,
        65584,
        536936480,
        536936496,
        2080,
        2096,
        536872992,
        536873008,
        67616,
        67632,
        536938528,
        536938544,
        524288,
        524304,
        537395200,
        537395216,
        589824,
        589840,
        537460736,
        537460752,
        526336,
        526352,
        537397248,
        537397264,
        591872,
        591888,
        537462784,
        537462800,
        524320,
        524336,
        537395232,
        537395248,
        589856,
        589872,
        537460768,
        537460784,
        526368,
        526384,
        537397280,
        537397296,
        591904,
        591920,
        537462816,
        537462832
      ],
      [
        0,
        33554432,
        8192,
        33562624,
        2097152,
        35651584,
        2105344,
        35659776,
        4,
        33554436,
        8196,
        33562628,
        2097156,
        35651588,
        2105348,
        35659780,
        1024,
        33555456,
        9216,
        33563648,
        2098176,
        35652608,
        2106368,
        35660800,
        1028,
        33555460,
        9220,
        33563652,
        2098180,
        35652612,
        2106372,
        35660804,
        268435456,
        301989888,
        268443648,
        301998080,
        270532608,
        304087040,
        270540800,
        304095232,
        268435460,
        301989892,
        268443652,
        301998084,
        270532612,
        304087044,
        270540804,
        304095236,
        268436480,
        301990912,
        268444672,
        301999104,
        270533632,
        304088064,
        270541824,
        304096256,
        268436484,
        301990916,
        268444676,
        301999108,
        270533636,
        304088068,
        270541828,
        304096260
      ],
      [
        0,
        1,
        262144,
        262145,
        16777216,
        16777217,
        17039360,
        17039361,
        2,
        3,
        262146,
        262147,
        16777218,
        16777219,
        17039362,
        17039363,
        512,
        513,
        262656,
        262657,
        16777728,
        16777729,
        17039872,
        17039873,
        514,
        515,
        262658,
        262659,
        16777730,
        16777731,
        17039874,
        17039875,
        134217728,
        134217729,
        134479872,
        134479873,
        150994944,
        150994945,
        151257088,
        151257089,
        134217730,
        134217731,
        134479874,
        134479875,
        150994946,
        150994947,
        151257090,
        151257091,
        134218240,
        134218241,
        134480384,
        134480385,
        150995456,
        150995457,
        151257600,
        151257601,
        134218242,
        134218243,
        134480386,
        134480387,
        150995458,
        150995459,
        151257602,
        151257603
      ],
      [
        0,
        1048576,
        256,
        1048832,
        8,
        1048584,
        264,
        1048840,
        4096,
        1052672,
        4352,
        1052928,
        4104,
        1052680,
        4360,
        1052936,
        67108864,
        68157440,
        67109120,
        68157696,
        67108872,
        68157448,
        67109128,
        68157704,
        67112960,
        68161536,
        67113216,
        68161792,
        67112968,
        68161544,
        67113224,
        68161800,
        131072,
        1179648,
        131328,
        1179904,
        131080,
        1179656,
        131336,
        1179912,
        135168,
        1183744,
        135424,
        1184e3,
        135176,
        1183752,
        135432,
        1184008,
        67239936,
        68288512,
        67240192,
        68288768,
        67239944,
        68288520,
        67240200,
        68288776,
        67244032,
        68292608,
        67244288,
        68292864,
        67244040,
        68292616,
        67244296,
        68292872
      ],
      [
        0,
        268435456,
        65536,
        268500992,
        4,
        268435460,
        65540,
        268500996,
        536870912,
        805306368,
        536936448,
        805371904,
        536870916,
        805306372,
        536936452,
        805371908,
        1048576,
        269484032,
        1114112,
        269549568,
        1048580,
        269484036,
        1114116,
        269549572,
        537919488,
        806354944,
        537985024,
        806420480,
        537919492,
        806354948,
        537985028,
        806420484,
        4096,
        268439552,
        69632,
        268505088,
        4100,
        268439556,
        69636,
        268505092,
        536875008,
        805310464,
        536940544,
        805376e3,
        536875012,
        805310468,
        536940548,
        805376004,
        1052672,
        269488128,
        1118208,
        269553664,
        1052676,
        269488132,
        1118212,
        269553668,
        537923584,
        806359040,
        537989120,
        806424576,
        537923588,
        806359044,
        537989124,
        806424580
      ],
      [
        0,
        134217728,
        8,
        134217736,
        1024,
        134218752,
        1032,
        134218760,
        131072,
        134348800,
        131080,
        134348808,
        132096,
        134349824,
        132104,
        134349832,
        1,
        134217729,
        9,
        134217737,
        1025,
        134218753,
        1033,
        134218761,
        131073,
        134348801,
        131081,
        134348809,
        132097,
        134349825,
        132105,
        134349833,
        33554432,
        167772160,
        33554440,
        167772168,
        33555456,
        167773184,
        33555464,
        167773192,
        33685504,
        167903232,
        33685512,
        167903240,
        33686528,
        167904256,
        33686536,
        167904264,
        33554433,
        167772161,
        33554441,
        167772169,
        33555457,
        167773185,
        33555465,
        167773193,
        33685505,
        167903233,
        33685513,
        167903241,
        33686529,
        167904257,
        33686537,
        167904265
      ],
      [
        0,
        256,
        524288,
        524544,
        16777216,
        16777472,
        17301504,
        17301760,
        16,
        272,
        524304,
        524560,
        16777232,
        16777488,
        17301520,
        17301776,
        2097152,
        2097408,
        2621440,
        2621696,
        18874368,
        18874624,
        19398656,
        19398912,
        2097168,
        2097424,
        2621456,
        2621712,
        18874384,
        18874640,
        19398672,
        19398928,
        512,
        768,
        524800,
        525056,
        16777728,
        16777984,
        17302016,
        17302272,
        528,
        784,
        524816,
        525072,
        16777744,
        16778e3,
        17302032,
        17302288,
        2097664,
        2097920,
        2621952,
        2622208,
        18874880,
        18875136,
        19399168,
        19399424,
        2097680,
        2097936,
        2621968,
        2622224,
        18874896,
        18875152,
        19399184,
        19399440
      ],
      [
        0,
        67108864,
        262144,
        67371008,
        2,
        67108866,
        262146,
        67371010,
        8192,
        67117056,
        270336,
        67379200,
        8194,
        67117058,
        270338,
        67379202,
        32,
        67108896,
        262176,
        67371040,
        34,
        67108898,
        262178,
        67371042,
        8224,
        67117088,
        270368,
        67379232,
        8226,
        67117090,
        270370,
        67379234,
        2048,
        67110912,
        264192,
        67373056,
        2050,
        67110914,
        264194,
        67373058,
        10240,
        67119104,
        272384,
        67381248,
        10242,
        67119106,
        272386,
        67381250,
        2080,
        67110944,
        264224,
        67373088,
        2082,
        67110946,
        264226,
        67373090,
        10272,
        67119136,
        272416,
        67381280,
        10274,
        67119138,
        272418,
        67381282
      ]
    ], SPTRANS = [
      [
        8520192,
        131072,
        2155872256,
        2156003840,
        8388608,
        2147615232,
        2147614720,
        2155872256,
        2147615232,
        8520192,
        8519680,
        2147484160,
        2155872768,
        8388608,
        0,
        2147614720,
        131072,
        2147483648,
        8389120,
        131584,
        2156003840,
        8519680,
        2147484160,
        8389120,
        2147483648,
        512,
        131584,
        2156003328,
        512,
        2155872768,
        2156003328,
        0,
        0,
        2156003840,
        8389120,
        2147614720,
        8520192,
        131072,
        2147484160,
        8389120,
        2156003328,
        512,
        131584,
        2155872256,
        2147615232,
        2147483648,
        2155872256,
        8519680,
        2156003840,
        131584,
        8519680,
        2155872768,
        8388608,
        2147484160,
        2147614720,
        0,
        131072,
        8388608,
        2155872768,
        8520192,
        2147483648,
        2156003328,
        512,
        2147615232
      ],
      [
        268705796,
        0,
        270336,
        268697600,
        268435460,
        8196,
        268443648,
        270336,
        8192,
        268697604,
        4,
        268443648,
        262148,
        268705792,
        268697600,
        4,
        262144,
        268443652,
        268697604,
        8192,
        270340,
        268435456,
        0,
        262148,
        268443652,
        270340,
        268705792,
        268435460,
        268435456,
        262144,
        8196,
        268705796,
        262148,
        268705792,
        268443648,
        270340,
        268705796,
        262148,
        268435460,
        0,
        268435456,
        8196,
        262144,
        268697604,
        8192,
        268435456,
        270340,
        268443652,
        268705792,
        8192,
        0,
        268435460,
        4,
        268705796,
        270336,
        268697600,
        268697604,
        262144,
        8196,
        268443648,
        268443652,
        4,
        268697600,
        270336
      ],
      [
        1090519040,
        16842816,
        64,
        1090519104,
        1073807360,
        16777216,
        1090519104,
        65600,
        16777280,
        65536,
        16842752,
        1073741824,
        1090584640,
        1073741888,
        1073741824,
        1090584576,
        0,
        1073807360,
        16842816,
        64,
        1073741888,
        1090584640,
        65536,
        1090519040,
        1090584576,
        16777280,
        1073807424,
        16842752,
        65600,
        0,
        16777216,
        1073807424,
        16842816,
        64,
        1073741824,
        65536,
        1073741888,
        1073807360,
        16842752,
        1090519104,
        0,
        16842816,
        65600,
        1090584576,
        1073807360,
        16777216,
        1090584640,
        1073741824,
        1073807424,
        1090519040,
        16777216,
        1090584640,
        65536,
        16777280,
        1090519104,
        65600,
        16777280,
        0,
        1090584576,
        1073741888,
        1090519040,
        1073807424,
        64,
        16842752
      ],
      [
        1049602,
        67109888,
        2,
        68158466,
        0,
        68157440,
        67109890,
        1048578,
        68158464,
        67108866,
        67108864,
        1026,
        67108866,
        1049602,
        1048576,
        67108864,
        68157442,
        1049600,
        1024,
        2,
        1049600,
        67109890,
        68157440,
        1024,
        1026,
        0,
        1048578,
        68158464,
        67109888,
        68157442,
        68158466,
        1048576,
        68157442,
        1026,
        1048576,
        67108866,
        1049600,
        67109888,
        2,
        68157440,
        67109890,
        0,
        1024,
        1048578,
        0,
        68157442,
        68158464,
        1024,
        67108864,
        68158466,
        1049602,
        1048576,
        68158466,
        2,
        67109888,
        1049602,
        1048578,
        1049600,
        68157440,
        67109890,
        1026,
        67108864,
        67108866,
        68158464
      ],
      [
        33554432,
        16384,
        256,
        33571080,
        33570824,
        33554688,
        16648,
        33570816,
        16384,
        8,
        33554440,
        16640,
        33554696,
        33570824,
        33571072,
        0,
        16640,
        33554432,
        16392,
        264,
        33554688,
        16648,
        0,
        33554440,
        8,
        33554696,
        33571080,
        16392,
        33570816,
        256,
        264,
        33571072,
        33571072,
        33554696,
        16392,
        33570816,
        16384,
        8,
        33554440,
        33554688,
        33554432,
        16640,
        33571080,
        0,
        16648,
        33554432,
        256,
        16392,
        33554696,
        256,
        0,
        33571080,
        33570824,
        33571072,
        264,
        16384,
        16640,
        33570824,
        33554688,
        264,
        8,
        16648,
        33570816,
        33554440
      ],
      [
        536870928,
        524304,
        0,
        537397248,
        524304,
        2048,
        536872976,
        524288,
        2064,
        537397264,
        526336,
        536870912,
        536872960,
        536870928,
        537395200,
        526352,
        524288,
        536872976,
        537395216,
        0,
        2048,
        16,
        537397248,
        537395216,
        537397264,
        537395200,
        536870912,
        2064,
        16,
        526336,
        526352,
        536872960,
        2064,
        536870912,
        536872960,
        526352,
        537397248,
        524304,
        0,
        536872960,
        536870912,
        2048,
        537395216,
        524288,
        524304,
        537397264,
        526336,
        16,
        537397264,
        526336,
        524288,
        536872976,
        536870928,
        537395200,
        526352,
        0,
        2048,
        536870928,
        536872976,
        537397248,
        537395200,
        2064,
        16,
        537395216
      ],
      [
        4096,
        128,
        4194432,
        4194305,
        4198529,
        4097,
        4224,
        0,
        4194304,
        4194433,
        129,
        4198400,
        1,
        4198528,
        4198400,
        129,
        4194433,
        4096,
        4097,
        4198529,
        0,
        4194432,
        4194305,
        4224,
        4198401,
        4225,
        4198528,
        1,
        4225,
        4198401,
        128,
        4194304,
        4225,
        4198400,
        4198401,
        129,
        4096,
        128,
        4194304,
        4198401,
        4194433,
        4225,
        4224,
        0,
        128,
        4194305,
        1,
        4194432,
        0,
        4194433,
        4194432,
        4224,
        129,
        4096,
        4198529,
        4194304,
        4198528,
        1,
        4097,
        4198529,
        4194305,
        4198528,
        4198400,
        4097
      ],
      [
        136314912,
        136347648,
        32800,
        0,
        134250496,
        2097184,
        136314880,
        136347680,
        32,
        134217728,
        2129920,
        32800,
        2129952,
        134250528,
        134217760,
        136314880,
        32768,
        2129952,
        2097184,
        134250496,
        136347680,
        134217760,
        0,
        2129920,
        134217728,
        2097152,
        134250528,
        136314912,
        2097152,
        32768,
        136347648,
        32,
        2097152,
        32768,
        134217760,
        136347680,
        32800,
        134217728,
        0,
        2129920,
        136314912,
        134250528,
        134250496,
        2097184,
        136347648,
        32,
        2097184,
        134250496,
        136347680,
        2097152,
        136314880,
        134217760,
        2129920,
        32800,
        134250528,
        136314880,
        32,
        136347648,
        2129952,
        0,
        134217728,
        136314912,
        32768,
        2129952
      ]
    ];
    function hPermOp(a, n, m) {
      var t = (a << 16 - n ^ a) & m;
      return a = a ^ t ^ t >>> 16 - n, a;
    }
    function intToFourBytes(iValue, b, offset) {
      b[offset++] = iValue & 255, b[offset++] = iValue >>> 8 & 255, b[offset++] = iValue >>> 16 & 255, b[offset++] = iValue >>> 24 & 255;
    }
    function byteToUnsigned(b) {
      var value = b;
      return value < 0 ? value + 256 : value;
    }
    function fourBytesToInt(b, offset) {
      var value = byteToUnsigned(b[offset++]);
      return value |= byteToUnsigned(b[offset++]) << 8, value |= byteToUnsigned(b[offset++]) << 16, value |= byteToUnsigned(b[offset++]) << 24, value;
    }
    function permOp(a, b, n, m, results) {
      var t = (a >>> n ^ b) & m;
      a ^= t << n, b ^= t, results[0] = a, results[1] = b;
    }
    function desSetKey(key) {
      var schedule = [], c = fourBytesToInt(key, 0), d = fourBytesToInt(key, 4), results = [0, 0];
      permOp(d, c, 4, 252645135, results), d = results[0], c = results[1], c = hPermOp(c, -2, 3435921408), d = hPermOp(d, -2, 3435921408), permOp(d, c, 1, 1431655765, results), d = results[0], c = results[1], permOp(c, d, 8, 16711935, results), c = results[0], d = results[1], permOp(d, c, 1, 1431655765, results), d = results[0], c = results[1], d = (d & 255) << 16 | d & 65280 | (d & 16711680) >>> 16 | (c & 4026531840) >>> 4, c &= 268435455;
      for (var j = 0, i = 0; i < 16; i++) {
        SHIFT2[i] ? (c = c >>> 2 | c << 26, d = d >>> 2 | d << 26) : (c = c >>> 1 | c << 27, d = d >>> 1 | d << 27), c &= 268435455, d &= 268435455;
        var s = SKB[0][c & 63] | SKB[1][c >>> 6 & 3 | c >>> 7 & 60] | SKB[2][c >>> 13 & 15 | c >>> 14 & 48] | SKB[3][c >>> 20 & 1 | c >>> 21 & 6 | c >>> 22 & 56], t = SKB[4][d & 63] | SKB[5][d >>> 7 & 3 | d >>> 8 & 60] | SKB[6][d >>> 15 & 63] | SKB[7][d >>> 21 & 15 | d >>> 22 & 48];
        schedule[j++] = t << 16 | s & 65535, s = s >>> 16 | t & 4294901760, s = s << 4 | s >>> 28, schedule[j++] = s;
      }
      return schedule;
    }
    function dEncrypt(el, r, s, e0, e1, sArr) {
      var v = r ^ r >>> 16, u = v & e0;
      v &= e1, u = u ^ u << 16 ^ r ^ sArr[s];
      var t = v ^ v << 16 ^ r ^ sArr[s + 1];
      return t = t >>> 4 | t << 28, el ^= SPTRANS[1][t & 63] | SPTRANS[3][t >>> 8 & 63] | SPTRANS[5][t >>> 16 & 63] | SPTRANS[7][t >>> 24 & 63] | SPTRANS[0][u & 63] | SPTRANS[2][u >>> 8 & 63] | SPTRANS[4][u >>> 16 & 63] | SPTRANS[6][u >>> 24 & 63], el;
    }
    function body(schedule, eSwap0, eSwap1) {
      for (var left = 0, right = 0, t = 0, j = 0; j < 25; j++) {
        for (var i = 0; i < 32; i += 4)
          left = dEncrypt(left, right, i, eSwap0, eSwap1, schedule), right = dEncrypt(right, left, i + 2, eSwap0, eSwap1, schedule);
        t = left, left = right, right = t;
      }
      t = right, right = left >>> 1 | left << 31, left = t >>> 1 | t << 31;
      var results = [0, 0];
      permOp(right, left, 1, 1431655765, results), right = results[0], left = results[1], permOp(left, right, 8, 16711935, results), left = results[0], right = results[1], permOp(right, left, 2, 858993459, results), right = results[0], left = results[1], permOp(left, right, 16, 65535, results), left = results[0], right = results[1], permOp(right, left, 4, 252645135, results), right = results[0], left = results[1];
      var out = [0, 0];
      return out[0] = left, out[1] = right, out;
    }
    function crypt(original, salt) {
      let orig = original instanceof Buffer ? original : Buffer.from(original);
      if (!salt)
        throw new Error("Invalid salt value: " + salt);
      var buffer = Buffer.alloc(13), charZero = salt[0].charCodeAt(0), charOne = salt[1].charCodeAt(0);
      buffer[0] = charZero, buffer[1] = charOne;
      for (var eSwap0 = CON_SALT[charZero], eSwap1 = CON_SALT[charOne] << 4, key = Buffer.alloc(8), i = 0; i < key.length && i < orig.length; i++) {
        var iChar = orig[i];
        key[i] = iChar << 1;
      }
      var schedule = desSetKey(key), out = body(schedule, eSwap0, eSwap1), b = Buffer.alloc(9);
      intToFourBytes(out[0], b, 0), intToFourBytes(out[1], b, 4), b[8] = 0;
      for (var i = 2, y = 0, u = 128; i < 13; i++)
        for (var j = 0, c = 0; j < 6; j++)
          c <<= 1, b[y] & u && (c |= 1), u >>>= 1, u == 0 && (y++, u = 128), buffer[i] = COV2CHAR[c];
      return buffer.toString("ascii");
    }
  }
});

// node_modules/node-firebird/lib/wire/codepages.js
var require_codepages = __commonJS({
  "node_modules/node-firebird/lib/wire/codepages.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: !0 });
    exports2.charsetWidthById = charsetWidthById;
    exports2.getCodec = getCodec;
    var ICU_LABELS = Object.freeze({
      WIN1250: "windows-1250",
      WIN1251: "windows-1251",
      WIN1252: "windows-1252",
      WIN1253: "windows-1253",
      WIN1254: "windows-1254",
      WIN1255: "windows-1255",
      WIN1256: "windows-1256",
      WIN1257: "windows-1257",
      WIN1258: "windows-1258",
      ISO8859_2: "iso-8859-2",
      ISO8859_3: "iso-8859-3",
      ISO8859_4: "iso-8859-4",
      ISO8859_5: "iso-8859-5",
      ISO8859_6: "iso-8859-6",
      ISO8859_7: "iso-8859-7",
      ISO8859_8: "iso-8859-8",
      ISO8859_9: "iso-8859-9",
      ISO8859_13: "iso-8859-13",
      KOI8R: "koi8-r",
      KOI8U: "koi8-u",
      DOS866: "ibm866"
    }), CHARSET_WIDTH_BY_ID = Object.freeze({
      3: 3,
      // UNICODE_FSS
      4: 4,
      // UTF8
      5: 2,
      // SJIS_0208
      6: 2,
      // EUCJ_0208
      44: 2,
      // KSC_5601
      56: 2,
      // BIG_5
      57: 2,
      // GB_2312
      67: 2,
      // GBK
      68: 2,
      // CP943C
      69: 4
      // GB18030
    });
    function charsetWidthById(id) {
      return id === void 0 ? 1 : CHARSET_WIDTH_BY_ID[id] || 1;
    }
    var cache = /* @__PURE__ */ new Map(), WIN1252_C1 = Object.freeze([
      8364,
      129,
      8218,
      402,
      8222,
      8230,
      8224,
      8225,
      710,
      8240,
      352,
      8249,
      338,
      141,
      381,
      143,
      144,
      8216,
      8217,
      8220,
      8221,
      8226,
      8211,
      8212,
      732,
      8482,
      353,
      8250,
      339,
      157,
      382,
      376
    ]);
    function buildByteToCodeTable(name, label) {
      let toCode = new Uint16Array(256);
      if (name === "WIN1252") {
        for (let i = 0; i < 256; i++)
          toCode[i] = (i & 224) === 128 ? WIN1252_C1[i - 128] : i;
        return toCode;
      }
      let decoder;
      try {
        decoder = new TextDecoder(label);
      } catch {
        throw new Error(`The requested Firebird encoding ${name} requires the ${label} ICU codec, but this Node.js runtime does not provide it. Use an official full-ICU Node.js build, or connect with encoding NONE and pass explicitly encoded Buffer values.`);
      }
      let one = Buffer.alloc(1);
      for (let i = 0; i < 256; i++)
        one[0] = i, toCode[i] = decoder.decode(one).charCodeAt(0);
      return toCode;
    }
    function buildCodec(name) {
      let label = ICU_LABELS[name];
      if (!label)
        return null;
      let toCode = buildByteToCodeTable(name, label), toByte = /* @__PURE__ */ new Map();
      for (let i = 0; i < 256; i++) {
        let ch = String.fromCharCode(toCode[i]);
        ch !== "\uFFFD" && !toByte.has(ch) && toByte.set(ch, i);
      }
      return {
        name,
        decode(buffer) {
          let codes = new Array(buffer.length);
          for (let i = 0; i < buffer.length; i++)
            codes[i] = toCode[buffer[i]];
          let CHUNK = 4096;
          if (codes.length <= CHUNK)
            return String.fromCharCode(...codes);
          let out = "";
          for (let i = 0; i < codes.length; i += CHUNK)
            out += String.fromCharCode(...codes.slice(i, i + CHUNK));
          return out;
        },
        encode(value) {
          let out = Buffer.alloc(value.length);
          for (let i = 0; i < value.length; i++) {
            let b = toByte.get(value[i]);
            out[i] = b === void 0 ? 63 : b;
          }
          return out;
        }
      };
    }
    function getCodec(charsetName) {
      if (!charsetName)
        return null;
      let name = String(charsetName).toUpperCase(), codec = cache.get(name);
      return codec === void 0 && (codec = buildCodec(name), cache.set(name, codec)), codec;
    }
  }
});

// node_modules/node-firebird/lib/wire/xsqlvar.js
var require_xsqlvar = __commonJS({
  "node_modules/node-firebird/lib/wire/xsqlvar.js"(exports2) {
    "use strict";
    var __importDefault = exports2 && exports2.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { default: mod };
    };
    Object.defineProperty(exports2, "__esModule", { value: !0 });
    exports2.SQLParamBool = exports2.SQLParamDate = exports2.SQLParamQuad = exports2.SQLParamBuffer = exports2.SQLParamString = exports2.SQLParamDouble = exports2.SQLParamDecFloat34 = exports2.SQLParamDecFloat16 = exports2.SQLParamInt128 = exports2.SQLParamInt64 = exports2.SQLParamInt = exports2.SQLVarBoolean = exports2.SQLVarTimeStampTzEx = exports2.SQLVarTimeStampTz = exports2.SQLVarTimeTzEx = exports2.SQLVarTimeTz = exports2.SQLVarTimeStamp = exports2.SQLVarTime = exports2.SQLVarDate = exports2.SQLVarDouble = exports2.SQLVarFloat = exports2.SQLVarDecFloat34 = exports2.SQLVarDecFloat16 = exports2.SQLVarInt128 = exports2.SQLVarInt64 = exports2.SQLVarShort = exports2.SQLVarInt = exports2.SQLVarArray = exports2.SQLVarBlob = exports2.SQLVarQuad = exports2.SQLVarString = exports2.SQLVarNull = exports2.SQLVarText = exports2.SQL_TYPE_NAMES = exports2.SQLVarBase = void 0;
    exports2.getFirebirdCharsetWidth = getFirebirdCharsetWidth;
    exports2.resolveTextEncoding = resolveTextEncoding;
    exports2.resolveTextCodec = resolveTextCodec;
    exports2.resolveTextState = resolveTextState;
    exports2.encodeConnectionText = encodeConnectionText;
    exports2.decodeConnectionText = decodeConnectionText;
    exports2.computeColumnKeys = computeColumnKeys;
    exports2.camelizeKey = camelizeKey;
    exports2.resolveKeyTransform = resolveKeyTransform;
    exports2.resolveNestTables = resolveNestTables;
    exports2.nestCell = nestCell;
    exports2.describeField = describeField;
    exports2.describeFields = describeFields;
    exports2.parseRecordCounts = parseRecordCounts;
    exports2.toScaledInteger = toScaledInteger;
    exports2.encodeDateTimeParts = encodeDateTimeParts;
    var const_1 = __importDefault(require_const()), serialize_1 = require_serialize(), codepages_1 = require_codepages(), DateOffset = 40587, TimeCoeff = 864e5, MsPerMinute = 6e4, EMPTY_BUFFER = Buffer.alloc(0), MAX_SAFE_BIGINT = BigInt(Number.MAX_SAFE_INTEGER), MIN_SAFE_BIGINT = BigInt(Number.MIN_SAFE_INTEGER);
    function applyScale(value, scale) {
      return scale ? scale < 0 ? value / Math.pow(10, -scale) : value * Math.pow(10, scale) : value;
    }
    function formatScaledBigInt(value, scale) {
      let negative = value < 0n, digits = (negative ? -value : value).toString(), sign = negative ? "-" : "";
      if (scale === 0)
        return sign + digits;
      if (scale > 0)
        return sign + digits + "0".repeat(scale);
      let places = -scale;
      return digits.length <= places && (digits = digits.padStart(places + 1, "0")), sign + digits.slice(0, -places) + "." + digits.slice(-places);
    }
    function decodeExactNumeric(value, scale, mode) {
      return mode === "string" || value > MAX_SAFE_BIGINT || value < MIN_SAFE_BIGINT ? formatScaledBigInt(value, scale) : scale < 0 ? Number(value) / Math.pow(10, -scale) : Number(value) * Math.pow(10, scale);
    }
    function decodeLossyInt128(value, scale) {
      return value > MAX_SAFE_BIGINT || value < MIN_SAFE_BIGINT ? formatScaledBigInt(value, scale) : applyScale(Number(value), scale);
    }
    var FirebirdToNodeEncoding = Object.freeze({
      UTF8: "utf8",
      UNICODE_FSS: "utf8",
      ISO8859_1: "latin1",
      LATIN1: "latin1",
      ASCII: "ascii",
      NONE: "latin1"
      // unspecified charset – treat as binary-safe latin1
    }), FirebirdCharsetWidths = {
      UTF8: 4,
      UNICODE_FSS: 3,
      // real Firebird names — the bare 'SJIS'/'EUCJ' keys never matched a
      // valid encoding option and silently resolved to width 1
      SJIS_0208: 2,
      EUCJ_0208: 2,
      KSC_5601: 2,
      BIG_5: 2,
      GB_2312: 2,
      GBK: 2,
      CP943C: 2,
      GB18030: 4
    };
    function getFirebirdCharsetWidth(charset) {
      if (!charset)
        return 4;
      let upper = charset.toUpperCase();
      return FirebirdCharsetWidths[upper] || 1;
    }
    function resolveTextEncoding(options) {
      let encoding = options && options.encoding ? options.encoding.toUpperCase() : const_1.default.DEFAULT_ENCODING;
      return FirebirdToNodeEncoding[encoding] || const_1.default.DEFAULT_ENCODING.toLowerCase();
    }
    function resolveTextCodec(options) {
      return resolveTextState(options).codec;
    }
    function resolveTextState(options) {
      let key = options && options.encoding;
      if (options && options.__textState && options.__textState.key === key)
        return options.__textState;
      let encoding = (key || const_1.default.DEFAULT_ENCODING).toUpperCase(), state = {
        key,
        codec: FirebirdToNodeEncoding[encoding] ? null : (0, codepages_1.getCodec)(encoding),
        enc: FirebirdToNodeEncoding[encoding] || const_1.default.DEFAULT_ENCODING.toLowerCase(),
        width: getFirebirdCharsetWidth(encoding)
      };
      return options && (options.__textState = state), state;
    }
    function encodeConnectionText(options, value) {
      let state = resolveTextState(options);
      return state.codec ? state.codec.encode(value) : (state.enc === "ascii" && (value = value.replace(/[^\x00-\x7F]/g, "?")), Buffer.from(value, state.enc));
    }
    function decodeConnectionText(options, buffer) {
      let codec = resolveTextCodec(options);
      return codec ? codec.decode(buffer) : buffer.toString(resolveTextEncoding(options));
    }
    var SQLVarBase = class {
    };
    exports2.SQLVarBase = SQLVarBase;
    function computeColumnKeys(output, nestTables, lowercaseKeys, transform) {
      return output.map((column) => {
        let key = column.alias || "";
        if (lowercaseKeys && (key = key.toLowerCase()), transform && (key = transform(key)), nestTables !== !0 && typeof nestTables != "string")
          return { key };
        let table = column.relationAlias || column.relation || "";
        return lowercaseKeys && (table = table.toLowerCase()), transform && (table = transform(table)), nestTables === !0 ? { table, key } : { key: table + nestTables + key };
      });
    }
    function camelizeKey(key) {
      let parts = String(key).toLowerCase().split("_"), out = parts[0] || "";
      for (let i = 1; i < parts.length; i++) {
        let part = parts[i];
        part && (out += part.charAt(0).toUpperCase() + part.slice(1));
      }
      return out;
    }
    function resolveKeyTransform(queryOptions, connectionOptions) {
      let value = resolveQueryOption("transformKeys", queryOptions, connectionOptions);
      if (value === "camel")
        return camelizeKey;
      if (typeof value == "function")
        return (key) => {
          try {
            return String(value(key));
          } catch (err) {
            return console.warn('[node-firebird] transformKeys mapper threw for key "%s": %s \u2014 using the untransformed key', key, err && err.message), key;
          }
        };
    }
    function resolveQueryOption(name, queryOptions, connectionOptions) {
      return queryOptions && queryOptions[name] !== void 0 ? queryOptions[name] : connectionOptions ? connectionOptions[name] : void 0;
    }
    function resolveNestTables(queryOptions, connectionOptions) {
      return resolveQueryOption("nestTables", queryOptions, connectionOptions);
    }
    function nestCell(row, table) {
      return table === void 0 ? row : row[table] || (row[table] = {});
    }
    exports2.SQL_TYPE_NAMES = {
      [const_1.default.SQL_TEXT]: "TEXT",
      [const_1.default.SQL_VARYING]: "VARYING",
      [const_1.default.SQL_SHORT]: "SHORT",
      [const_1.default.SQL_LONG]: "LONG",
      [const_1.default.SQL_FLOAT]: "FLOAT",
      [const_1.default.SQL_DOUBLE]: "DOUBLE",
      [const_1.default.SQL_D_FLOAT]: "D_FLOAT",
      [const_1.default.SQL_TIMESTAMP]: "TIMESTAMP",
      [const_1.default.SQL_BLOB]: "BLOB",
      [const_1.default.SQL_ARRAY]: "ARRAY",
      [const_1.default.SQL_QUAD]: "QUAD",
      [const_1.default.SQL_TYPE_TIME]: "TIME",
      [const_1.default.SQL_TYPE_DATE]: "DATE",
      [const_1.default.SQL_INT64]: "INT64",
      [const_1.default.SQL_INT128]: "INT128",
      [const_1.default.SQL_TIMESTAMP_TZ]: "TIMESTAMP_TZ",
      [const_1.default.SQL_TIMESTAMP_TZ_EX]: "TIMESTAMP_TZ_EX",
      [const_1.default.SQL_TIME_TZ]: "TIME_TZ",
      [const_1.default.SQL_TIME_TZ_EX]: "TIME_TZ_EX",
      [const_1.default.SQL_DEC16]: "DEC16",
      [const_1.default.SQL_DEC34]: "DEC34",
      [const_1.default.SQL_BOOLEAN]: "BOOLEAN",
      [const_1.default.SQL_NULL]: "NULL"
    };
    function describeField(meta) {
      return {
        type: meta.type,
        typeName: exports2.SQL_TYPE_NAMES[meta.type] || "UNKNOWN",
        subType: meta.subType,
        scale: meta.scale,
        // report the column's true declared length, not the widened fetch
        // buffer (see scaleOutputLengths)
        length: meta.nativeLength !== void 0 ? meta.nativeLength : meta.length,
        nullable: meta.nullable,
        field: meta.field,
        relation: meta.relation,
        relationAlias: meta.relationAlias,
        relationSchema: meta.relationSchema,
        alias: meta.alias
      };
    }
    function describeFields(output) {
      return (output || []).map(describeField);
    }
    function parseRecordCounts(buffer) {
      let counts = { selectCount: 0, insertCount: 0, updateCount: 0, deleteCount: 0 };
      if (!buffer || !buffer.length)
        return counts;
      try {
        let br = new serialize_1.BlrReader(buffer);
        for (; br.pos < br.buffer.length; ) {
          let item = br.readByteCode();
          if (item === const_1.default.isc_info_end || item === const_1.default.isc_info_truncated)
            break;
          if (item === const_1.default.isc_info_sql_records) {
            br.pos += 2;
            continue;
          }
          switch (item) {
            case const_1.default.isc_info_req_select_count:
              counts.selectCount = br.readInt() || 0;
              break;
            case const_1.default.isc_info_req_insert_count:
              counts.insertCount = br.readInt() || 0;
              break;
            case const_1.default.isc_info_req_update_count:
              counts.updateCount = br.readInt() || 0;
              break;
            case const_1.default.isc_info_req_delete_count:
              counts.deleteCount = br.readInt() || 0;
              break;
            default:
              br.pos += 2 + br.buffer.readUInt16LE(br.pos);
          }
        }
      } catch {
      }
      return counts;
    }
    var SQLVarText = class extends SQLVarBase {
      decode(data, lowerV13, options) {
        let ret;
        if (this.subType > 1 || this.subType === 0) {
          let state = resolveTextState(options);
          ret = state.codec ? state.codec.decode(data.readBuffer(this.length) || EMPTY_BUFFER) : data.readText(this.length, state.enc);
          let charLength = Math.floor(this.length / state.width);
          ret.length > charLength && (ret = ret.substring(0, charLength));
        } else
          ret = data.readBuffer(this.length);
        return !lowerV13 || !data.readInt() ? ret : null;
      }
      calcBlr(blr) {
        blr.addByte(const_1.default.blr_text), blr.addWord(this.length);
      }
    };
    exports2.SQLVarText = SQLVarText;
    var SQLVarNull = class extends SQLVarText {
    };
    exports2.SQLVarNull = SQLVarNull;
    var SQLVarString = class extends SQLVarBase {
      decode(data, lowerV13, options) {
        let ret;
        if (this.subType > 1 || this.subType === 0) {
          let state = resolveTextState(options);
          ret = state.codec ? state.codec.decode(data.readArray() || EMPTY_BUFFER) : data.readString(state.enc);
        } else
          ret = data.readBuffer();
        return !lowerV13 || !data.readInt() ? ret : null;
      }
      calcBlr(blr) {
        blr.addByte(const_1.default.blr_varying), blr.addWord(this.length);
      }
    };
    exports2.SQLVarString = SQLVarString;
    var SQLVarQuad = class extends SQLVarBase {
      decode(data, lowerV13) {
        var ret = data.readQuad();
        return !lowerV13 || !data.readInt() ? ret : null;
      }
      calcBlr(blr) {
        blr.addByte(const_1.default.blr_quad), blr.addShort(this.scale);
      }
    };
    exports2.SQLVarQuad = SQLVarQuad;
    var SQLVarBlob = class extends SQLVarQuad {
      calcBlr(blr) {
        blr.addByte(const_1.default.blr_quad), blr.addShort(0);
      }
    };
    exports2.SQLVarBlob = SQLVarBlob;
    var SQLVarArray = class extends SQLVarQuad {
      calcBlr(blr) {
        blr.addByte(const_1.default.blr_quad), blr.addShort(0);
      }
    };
    exports2.SQLVarArray = SQLVarArray;
    var SQLVarInt = class extends SQLVarBase {
      decode(data, lowerV13) {
        var ret = data.readInt();
        return ret = applyScale(ret, this.scale), !lowerV13 || !data.readInt() ? ret : null;
      }
      calcBlr(blr) {
        blr.addByte(const_1.default.blr_long), blr.addShort(this.scale);
      }
    };
    exports2.SQLVarInt = SQLVarInt;
    var SQLVarShort = class extends SQLVarInt {
      calcBlr(blr) {
        blr.addByte(const_1.default.blr_short), blr.addShort(this.scale);
      }
    };
    exports2.SQLVarShort = SQLVarShort;
    var SQLVarInt64 = class extends SQLVarBase {
      decode(data, lowerV13, options) {
        let mode = options?.numericMode || const_1.default.NUMERIC_MODE_LOSSY, ret;
        return mode === const_1.default.NUMERIC_MODE_LOSSY ? (ret = data.readInt64(), ret = applyScale(ret, this.scale)) : ret = decodeExactNumeric(data.readInt64BigInt(), this.scale, mode), !lowerV13 || !data.readInt() ? ret : null;
      }
      calcBlr(blr) {
        blr.addByte(const_1.default.blr_int64), blr.addShort(this.scale);
      }
    };
    exports2.SQLVarInt64 = SQLVarInt64;
    var SQLVarInt128 = class extends SQLVarBase {
      decode(data, lowerV13, options) {
        let mode = options?.numericMode || const_1.default.NUMERIC_MODE_LOSSY, ret = mode === const_1.default.NUMERIC_MODE_LOSSY ? decodeLossyInt128(data.readInt128Signed(), this.scale) : decodeExactNumeric(data.readInt128Signed(), this.scale, mode);
        return !lowerV13 || !data.readInt() ? ret : null;
      }
      calcBlr(blr) {
        blr.addByte(const_1.default.blr_int128), blr.addShort(this.scale);
      }
    };
    exports2.SQLVarInt128 = SQLVarInt128;
    var SQLVarDecFloat16 = class extends SQLVarBase {
      decode(data, lowerV13) {
        var ret = data.readDecFloat16();
        return !lowerV13 || !data.readInt() ? ret : null;
      }
      calcBlr(blr) {
        blr.addByte(const_1.default.blr_dec64), blr.addShort(0);
      }
    };
    exports2.SQLVarDecFloat16 = SQLVarDecFloat16;
    var SQLVarDecFloat34 = class extends SQLVarBase {
      decode(data, lowerV13) {
        var ret = data.readDecFloat34();
        return !lowerV13 || !data.readInt() ? ret : null;
      }
      calcBlr(blr) {
        blr.addByte(const_1.default.blr_dec128), blr.addShort(0);
      }
    };
    exports2.SQLVarDecFloat34 = SQLVarDecFloat34;
    var SQLVarFloat = class extends SQLVarBase {
      decode(data, lowerV13) {
        var ret = data.readFloat();
        return !lowerV13 || !data.readInt() ? ret : null;
      }
      calcBlr(blr) {
        blr.addByte(const_1.default.blr_float);
      }
    };
    exports2.SQLVarFloat = SQLVarFloat;
    var SQLVarDouble = class extends SQLVarBase {
      decode(data, lowerV13) {
        var ret = data.readDouble();
        return !lowerV13 || !data.readInt() ? ret : null;
      }
      calcBlr(blr) {
        blr.addByte(const_1.default.blr_double);
      }
    };
    exports2.SQLVarDouble = SQLVarDouble;
    var SQLVarDate = class extends SQLVarBase {
      decode(data, lowerV13) {
        var ret = data.readInt();
        if (!lowerV13 || !data.readInt()) {
          var d = /* @__PURE__ */ new Date(0);
          return d.setMilliseconds((ret - DateOffset) * TimeCoeff + d.getTimezoneOffset() * MsPerMinute), d;
        }
        return null;
      }
      calcBlr(blr) {
        blr.addByte(const_1.default.blr_sql_date);
      }
    };
    exports2.SQLVarDate = SQLVarDate;
    var SQLVarTime = class extends SQLVarBase {
      decode(data, lowerV13) {
        var ret = data.readUInt();
        if (!lowerV13 || !data.readInt()) {
          var d = /* @__PURE__ */ new Date(0);
          return d.setMilliseconds(Math.floor(ret / 10) + d.getTimezoneOffset() * MsPerMinute), d;
        }
        return null;
      }
      calcBlr(blr) {
        blr.addByte(const_1.default.blr_sql_time);
      }
    };
    exports2.SQLVarTime = SQLVarTime;
    var SQLVarTimeStamp = class extends SQLVarBase {
      decode(data, lowerV13) {
        var date = data.readInt(), time = data.readUInt();
        if (!lowerV13 || !data.readInt()) {
          var d = /* @__PURE__ */ new Date(0);
          return d.setMilliseconds((date - DateOffset) * TimeCoeff + Math.floor(time / 10) + d.getTimezoneOffset() * MsPerMinute), d;
        }
        return null;
      }
      calcBlr(blr) {
        blr.addByte(const_1.default.blr_timestamp);
      }
    };
    exports2.SQLVarTimeStamp = SQLVarTimeStamp;
    var SQLVarTimeTz = class extends SQLVarBase {
      decode(data, lowerV13) {
        var time = data.readUInt();
        return data.readInt(), !lowerV13 || !data.readInt() ? new Date(Math.floor(time / 10)) : null;
      }
      calcBlr(blr) {
        blr.addByte(const_1.default.blr_sql_time_tz);
      }
    };
    exports2.SQLVarTimeTz = SQLVarTimeTz;
    var SQLVarTimeTzEx = class extends SQLVarTimeTz {
      decode(data, lowerV13) {
        var time = data.readUInt();
        return data.readInt(), data.readInt(), !lowerV13 || !data.readInt() ? new Date(Math.floor(time / 10)) : null;
      }
      calcBlr(blr) {
        blr.addByte(const_1.default.blr_ex_time_tz);
      }
    };
    exports2.SQLVarTimeTzEx = SQLVarTimeTzEx;
    var SQLVarTimeStampTz = class extends SQLVarBase {
      decode(data, lowerV13) {
        var date = data.readInt(), time = data.readUInt();
        return data.readInt(), !lowerV13 || !data.readInt() ? new Date((date - DateOffset) * TimeCoeff + Math.floor(time / 10)) : null;
      }
      calcBlr(blr) {
        blr.addByte(const_1.default.blr_timestamp_tz);
      }
    };
    exports2.SQLVarTimeStampTz = SQLVarTimeStampTz;
    var SQLVarTimeStampTzEx = class extends SQLVarTimeStampTz {
      decode(data, lowerV13) {
        var date = data.readInt(), time = data.readUInt();
        return data.readInt(), data.readInt(), !lowerV13 || !data.readInt() ? new Date((date - DateOffset) * TimeCoeff + Math.floor(time / 10)) : null;
      }
      calcBlr(blr) {
        blr.addByte(const_1.default.blr_ex_timestamp_tz);
      }
    };
    exports2.SQLVarTimeStampTzEx = SQLVarTimeStampTzEx;
    var SQLVarBoolean = class extends SQLVarBase {
      decode(data, lowerV13) {
        var ret = data.readInt();
        return !lowerV13 || !data.readInt() ? !!ret : null;
      }
      calcBlr(blr) {
        blr.addByte(const_1.default.blr_bool);
      }
    };
    exports2.SQLVarBoolean = SQLVarBoolean;
    var SQLParamInt = class {
      constructor(value) {
        this.value = value;
      }
      calcBlr(blr) {
        blr.addByte(const_1.default.blr_long), blr.addShort(0);
      }
      encode(data) {
        this.value != null ? data.addInt(this.value) : (data.addInt(0), data.addInt(1));
      }
    };
    exports2.SQLParamInt = SQLParamInt;
    var SQLParamInt64 = class {
      constructor(value) {
        this.value = value;
      }
      calcBlr(blr) {
        blr.addByte(const_1.default.blr_int64), blr.addShort(0);
      }
      encode(data) {
        this.value != null ? data.addInt64(this.value) : (data.addInt64(0), data.addInt(1));
      }
    };
    exports2.SQLParamInt64 = SQLParamInt64;
    var SQLParamInt128 = class {
      constructor(value) {
        this.value = value;
      }
      calcBlr(blr) {
        blr.addByte(const_1.default.blr_int128), blr.addShort(0);
      }
      encode(data) {
        this.value != null ? data.addInt128(this.value) : (data.addInt128(0), data.addInt(1));
      }
    };
    exports2.SQLParamInt128 = SQLParamInt128;
    var FIXED_POINT_RE = /^([+-]?)(?:(\d+)(?:\.(\d*))?|\.(\d+))(?:[eE]([+-]?\d+))?$/;
    function toScaledInteger(value, scale, bits) {
      if (!Number.isSafeInteger(scale))
        throw new TypeError("Fixed-point scale must be an integer");
      if (typeof value == "number" && !Number.isFinite(value))
        throw new TypeError("Fixed-point value must be finite");
      if (typeof value != "number" && typeof value != "string" && typeof value != "bigint")
        throw new TypeError("Fixed-point value must be a number, string, or bigint");
      let text = String(value).trim(), match = FIXED_POINT_RE.exec(text);
      if (!match)
        throw new TypeError("Invalid fixed-point value: " + text);
      let negative = match[1] === "-", integer = match[2] || "0", fraction = match[3] !== void 0 ? match[3] : match[4] || "", exponent = match[5] === void 0 ? 0 : Number(match[5]);
      if (!Number.isSafeInteger(exponent))
        throw new RangeError("Fixed-point exponent is outside the supported range: " + match[5]);
      let digits = (integer + fraction).replace(/^0+/, "") || "0";
      if (digits === "0")
        return 0n;
      let shift = exponent - fraction.length - scale, coefficientDigits, roundUp = !1;
      if (shift >= 0) {
        if (digits.length + shift > 40)
          throw new RangeError("Fixed-point value is outside the signed " + bits + "-bit range: " + text);
        coefficientDigits = digits + "0".repeat(shift);
      } else {
        let discarded = -shift;
        if (discarded < digits.length) {
          let split = digits.length - discarded;
          coefficientDigits = digits.slice(0, split), roundUp = digits.charCodeAt(split) >= 53;
        } else
          coefficientDigits = "0", roundUp = discarded === digits.length && digits.charCodeAt(0) >= 53;
      }
      let coefficient = BigInt(coefficientDigits);
      roundUp && (coefficient += 1n), negative && (coefficient = -coefficient);
      let width = BigInt(bits), min = -(1n << width - 1n), max = (1n << width - 1n) - 1n;
      if (coefficient < min || coefficient > max)
        throw new RangeError("Fixed-point value is outside the signed " + bits + "-bit range: " + text);
      return coefficient;
    }
    var SQLParamDecFloat16 = class {
      constructor(value) {
        this.value = value;
      }
      calcBlr(blr) {
        blr.addByte(const_1.default.blr_dec64), blr.addShort(0);
      }
      encode(data) {
        this.value != null ? data.addDecFloat16(this.value) : (data.addDecFloat16(0), data.addInt(1));
      }
    };
    exports2.SQLParamDecFloat16 = SQLParamDecFloat16;
    var SQLParamDecFloat34 = class {
      constructor(value) {
        this.value = value;
      }
      calcBlr(blr) {
        blr.addByte(const_1.default.blr_dec128), blr.addShort(0);
      }
      encode(data) {
        this.value != null ? data.addDecFloat34(this.value) : (data.addDecFloat34(0), data.addInt(1));
      }
    };
    exports2.SQLParamDecFloat34 = SQLParamDecFloat34;
    var SQLParamDouble = class {
      constructor(value) {
        this.value = value;
      }
      encode(data) {
        this.value != null ? data.addDouble(this.value) : (data.addDouble(0), data.addInt(1));
      }
      calcBlr(blr) {
        blr.addByte(const_1.default.blr_double);
      }
    };
    exports2.SQLParamDouble = SQLParamDouble;
    var SQLParamString = class {
      constructor(value) {
        this.value = value;
      }
      encode(data) {
        this.value != null ? data.addText(this.value, const_1.default.DEFAULT_ENCODING) : data.addInt(1);
      }
      calcBlr(blr) {
        blr.addByte(const_1.default.blr_text);
        var len = this.value ? Buffer.byteLength(this.value, const_1.default.DEFAULT_ENCODING) : 0;
        blr.addWord(len);
      }
    };
    exports2.SQLParamString = SQLParamString;
    var SQLParamBuffer = class {
      constructor(value) {
        this.value = value;
      }
      encode(data) {
        this.value != null ? data.addParamBuffer(this.value) : data.addInt(1);
      }
      calcBlr(blr) {
        blr.addByte(const_1.default.blr_text);
        var len = this.value ? this.value.length : 0;
        blr.addWord(len);
      }
    };
    exports2.SQLParamBuffer = SQLParamBuffer;
    function encodeDateTimeParts(value) {
      var ms = value.getTime() - value.getTimezoneOffset() * MsPerMinute, time = ms % TimeCoeff, date = (ms - time) / TimeCoeff + DateOffset;
      return time *= 10, time < 0 && (date--, time = TimeCoeff * 10 + time), { date, time };
    }
    var SQLParamQuad = class {
      constructor(value) {
        this.value = value;
      }
      encode(data) {
        this.value != null ? (data.addInt(this.value.high), data.addInt(this.value.low)) : (data.addInt(0), data.addInt(0), data.addInt(1));
      }
      calcBlr(blr) {
        blr.addByte(const_1.default.blr_quad), blr.addShort(0);
      }
    };
    exports2.SQLParamQuad = SQLParamQuad;
    var SQLParamDate = class {
      constructor(value) {
        this.value = value;
      }
      encode(data) {
        if (this.value != null) {
          var parts = encodeDateTimeParts(this.value);
          data.addInt(parts.date), data.addUInt(parts.time);
        } else
          data.addInt(0), data.addUInt(0), data.addInt(1);
      }
      calcBlr(blr) {
        blr.addByte(const_1.default.blr_timestamp);
      }
    };
    exports2.SQLParamDate = SQLParamDate;
    var SQLParamBool = class {
      constructor(value, asBoolean = !1) {
        this.value = value, this.asBoolean = asBoolean;
      }
      encode(data) {
        if (this.asBoolean) {
          data.addBuffer(Buffer.from([this.value ? 1 : 0])), data.addAlignment(1);
          return;
        }
        this.value != null ? data.addInt(this.value ? 1 : 0) : (data.addInt(0), data.addInt(1));
      }
      calcBlr(blr) {
        if (this.asBoolean) {
          blr.addByte(const_1.default.blr_bool);
          return;
        }
        blr.addByte(const_1.default.blr_short), blr.addShort(0);
      }
    };
    exports2.SQLParamBool = SQLParamBool;
  }
});

// node_modules/node-firebird/lib/wire/service.js
var require_service = __commonJS({
  "node_modules/node-firebird/lib/wire/service.js"(exports2, module2) {
    "use strict";
    var __importDefault = exports2 && exports2.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { default: mod };
    }, events_1 = __importDefault(require("events")), stream_1 = __importDefault(require("stream")), const_1 = __importDefault(require_const()), serialize_1 = require_serialize(), callback_1 = require_callback();
    function isEmpty(obj) {
      for (var p in obj)
        return !1;
      return !0;
    }
    var SHUTDOWN_KIND = {
      0: const_1.default.isc_spb_prp_shutdown_db,
      1: const_1.default.isc_spb_prp_deny_new_transactions,
      2: const_1.default.isc_spb_prp_deny_new_attachments
    }, SHUTDOWNEX_KIND = {
      0: const_1.default.isc_spb_prp_force_shutdown,
      1: const_1.default.isc_spb_prp_transactions_shutdown,
      2: const_1.default.isc_spb_prp_attachments_shutdown
    }, SHUTDOWNEX_MODE = {
      //0: isc_spb_prp_sm_normal,
      1: const_1.default.isc_spb_prp_sm_multi,
      2: const_1.default.isc_spb_prp_sm_single,
      3: const_1.default.isc_spb_prp_sm_full
    }, ShutdownMode = { NORMAL: 0, MULTI: 1, SINGLE: 2, FULL: 3 }, ShutdownKind = { FORCED: 0, DENY_TRANSACTION: 1, DENY_ATTACHMENT: 2 }, ServiceManager = class extends events_1.default.EventEmitter {
      static {
        this.ShutdownMode = ShutdownMode;
      }
      static {
        this.ShutdownKind = ShutdownKind;
      }
      constructor(connection) {
        super(), this._infosmapping = {
          50: "dbinfo",
          51: "licenses",
          52: "licenseoptions",
          53: "fbconfig",
          54: "svcversion",
          55: "fbversion",
          56: "fbimplementation",
          57: "fbcapatibilities",
          58: "pathsecuritydb",
          59: "fbenv",
          60: "fbenvlock",
          61: "fbenvmsg",
          62: "",
          63: "",
          64: "",
          65: "",
          66: "limbotrans",
          67: "",
          68: "fbusers",
          78: ""
        }, this.connection = connection, connection.svc = this;
      }
      _createOutputStream(optread, buffersize, callback) {
        var self = this;
        optread = optread || "byline";
        var t = new stream_1.default.Readable({ objectMode: optread === "byline" });
        t.__proto__._read = function() {
          var selfread = this, fct = optread === "byline" ? self.readline : self.readeof;
          fct.call(self, { buffersize }, function(err, data) {
            if (err) {
              selfread.push(err.message, const_1.default.DEFAULT_ENCODING);
              return;
            }
            data.line && data.line.length ? selfread.push(data.line, const_1.default.DEFAULT_ENCODING) : selfread.push(null);
          });
        }, callback(null, t);
      }
      _processcapabilities(blr, res) {
        for (var capArray = [
          "WAL_SUPPORT",
          "MULTI_CLIENT_SUPPORT",
          "REMOTE_HOP_SUPPORT",
          "NO_SVR_STATS_SUPPORT",
          "NO_DB_STATS_SUPPORT",
          "LOCAL_ENGINE_SUPPORT",
          "NO_FORCED_WRITE_SUPPORT",
          "NO_SHUTDOWN_SUPPORT",
          "NO_SERVER_SHUTDOWN_SUPPORT",
          "SERVER_CONFIG_SUPPORT",
          "QUOTED_FILENAME_SUPPORT"
        ], dbcapa = res[this._infosmapping[57]] = [], caps = blr.readInt32(), i = 0; i < capArray.length; ++i)
          caps & 1 << i && dbcapa.push(capArray[i]);
      }
      _processdbinfo(blr, res) {
        var tinfo = blr.readByteCode(), dbinfo = res[this._infosmapping[50]] = {};
        for (dbinfo.database = []; tinfo != const_1.default.isc_info_flag_end; tinfo = blr.readByteCode())
          switch (tinfo) {
            case const_1.default.isc_spb_dbname:
              dbinfo.database.push(blr.readString());
              break;
            case const_1.default.isc_spb_num_att:
              dbinfo.nbattachment = blr.readInt32();
              break;
            case const_1.default.isc_spb_num_db:
              dbinfo.nbdatabase = blr.readInt32();
              break;
          }
      }
      _processquery(buffer, callback) {
        if (!Buffer.isBuffer(buffer)) {
          (0, callback_1.doError)(new Error("Malformed service-manager response: missing BLR buffer"), callback);
          return;
        }
        try {
          var br = new serialize_1.BlrReader(buffer), tinfo = br.readByteCode(), res = {};
          for (res.result = 0; tinfo !== const_1.default.isc_info_end; tinfo = br.readByteCode())
            switch (tinfo) {
              case const_1.default.isc_info_svc_server_version:
              case const_1.default.isc_info_svc_implementation:
              case const_1.default.isc_info_svc_user_dbpath:
              case const_1.default.isc_info_svc_get_env:
              case const_1.default.isc_info_svc_get_env_lock:
              case const_1.default.isc_info_svc_get_env_msg:
                res[this._infosmapping[tinfo]] = br.readString();
                break;
              case const_1.default.isc_info_svc_version:
                res[this._infosmapping[tinfo]] = br.readInt32();
                break;
              case const_1.default.isc_info_svc_svr_db_info:
                this._processdbinfo(br, res);
                break;
              case const_1.default.isc_info_svc_limbo_trans:
                for (; tinfo !== const_1.default.isc_info_flag_end; tinfo = br.readByteCode())
                  break;
              case const_1.default.isc_info_svc_get_users:
                br.pos += 2, res[this._infosmapping[tinfo]] = [];
                break;
              case const_1.default.isc_spb_sec_username:
                var tuser = res[this._infosmapping[68]];
                tuser.push({}), tuser[tuser.length - 1].username = br.readString();
                break;
              case const_1.default.isc_spb_sec_firstname:
                var tuser = res[this._infosmapping[68]], user = tuser[tuser.length - 1];
                user.firstname = br.readString();
                break;
              case const_1.default.isc_spb_sec_middlename:
                var tuser = res[this._infosmapping[68]], user = tuser[tuser.length - 1];
                user.middlename = br.readString();
                break;
              case const_1.default.isc_spb_sec_lastname:
                var tuser = res[this._infosmapping[68]], user = tuser[tuser.length - 1];
                user.lastname = br.readString();
                break;
              case const_1.default.isc_spb_sec_groupid:
                var tuser = res[this._infosmapping[68]], user = tuser[tuser.length - 1];
                user.groupid = br.readInt32();
                break;
              case const_1.default.isc_spb_sec_userid:
                var tuser = res[this._infosmapping[68]], user = tuser[tuser.length - 1];
                user.userid = br.readInt32();
                break;
              case const_1.default.isc_spb_sec_admin:
                var tuser = res[this._infosmapping[68]], user = tuser[tuser.length - 1];
                user.admin = br.readInt32();
                break;
              case const_1.default.isc_info_svc_line:
                res.line = br.readString();
                break;
              case const_1.default.isc_info_svc_to_eof:
                res.line = br.readString();
                break;
              case const_1.default.isc_info_truncated:
                res.result = 1;
                break;
              case const_1.default.isc_info_data_not_ready:
                res.result = 2;
                break;
              case const_1.default.isc_info_svc_timeout:
                res.result = 3;
                break;
              case const_1.default.isc_info_svc_stdin:
                break;
              case const_1.default.isc_info_svc_capabilities:
                this._processcapabilities(br, res);
                break;
            }
          callback(null, res);
        } catch (err) {
          (0, callback_1.doError)(new Error("Malformed service-manager response: " + err.message), callback);
        }
      }
      detach(callback, force) {
        var self = this;
        return !force && self.connection._pending.length > 0 ? (self.connection._detachAuto = !0, self.connection._detachCallback = callback, self) : (self.connection.svcdetach(function(err, obj) {
          self.connection.disconnect(), self.emit("detach", !1), callback && callback(err, obj);
        }, force), self);
      }
      backup(options, callback) {
        var dbpath = options.database || this.connection.options.filename || this.connection.options.database, verbose = options.verbose || !1, bckfiles = options.backupfiles || options.files || null;
        bckfiles && (bckfiles = bckfiles.constructor !== Array ? [{ filename: bckfiles, sizefile: "0" }] : bckfiles);
        var factor = options.factor || 0, ignorechecksums = options.ignorechecksums || !1, ignorelimbo = options.ignorelimbo || !1, metadataonly = options.metadataonly || !1, nogarbagecollect = options.nogarbasecollect || !1, olddescriptions = options.olddescriptions || !1, nontransportable = options.nontransportable || !1, convert = options.convert || !1, expand = options.expand || !1, notriggers = options.notriggers || !1;
        if (dbpath == null || dbpath.length === 0) {
          (0, callback_1.doError)(new Error("No database specified"), callback);
          return;
        }
        if (bckfiles == null || bckfiles.length === 0) {
          (0, callback_1.doError)(new Error("No backup path specified"), callback);
          return;
        }
        var blr = this.connection._blr;
        blr.pos = 0, blr.addByte(const_1.default.isc_action_svc_backup), blr.addString2(const_1.default.isc_spb_dbname, dbpath, const_1.default.DEFAULT_ENCODING);
        for (var i = 0; i < bckfiles.length; i++)
          blr.addString2(const_1.default.isc_spb_bkp_file, bckfiles[i].filename, const_1.default.DEFAULT_ENCODING), i !== bckfiles.length - 1 && blr.addString2(const_1.default.isc_spb_bkp_length, bckfiles[i].sizefile, const_1.default.DEFAULT_ENCODING);
        factor && blr.addByteInt32(const_1.default.isc_spb_bkp_factor, factor);
        var opts = 0;
        ignorechecksums && (opts = opts | const_1.default.isc_spb_bkp_ignore_checksums), ignorelimbo && (opts = opts | const_1.default.isc_spb_bkp_ignore_limbo), metadataonly && (opts = opts | const_1.default.isc_spb_bkp_metadata_only), nogarbagecollect && (opts = opts | const_1.default.isc_spb_bkp_no_garbage_collect), olddescriptions && (opts = opts | const_1.default.isc_spb_bkp_old_descriptions), nontransportable && (opts = opts | const_1.default.isc_spb_bkp_non_transportable), convert && (opts = opts | const_1.default.isc_spb_bkp_convert), expand && (opts = opts | const_1.default.isc_spb_bkp_expand), notriggers && (opts = opts | const_1.default.isc_spb_bkp_no_triggers), opts && blr.addByteInt32(const_1.default.isc_spb_options, opts), verbose && blr.addByte(const_1.default.isc_spb_verbose);
        var self = this;
        this.connection.svcstart(blr, function(err, data) {
          if (err) {
            (0, callback_1.doError)(new Error(err), callback);
            return;
          }
          self._createOutputStream(options.optread, options.buffersize, callback);
        });
      }
      nbackup(options, callback) {
        var dbpath = options.database || this.connection.options.filename || this.connection.options.database, bckfile = options.backupfile || options.file || null, level = options.level || 0, notriggers = options.notriggers || !1, direct = options.direct || "on";
        if (dbpath == null || dbpath.length === 0) {
          (0, callback_1.doError)(new Error("No database specified"), callback);
          return;
        }
        if (bckfile == null || bckfile.length === 0) {
          (0, callback_1.doError)(new Error("No backup path specified"), callback);
          return;
        }
        var blr = this.connection._blr;
        blr.pos = 0, blr.addByte(const_1.default.isc_action_svc_nbak), blr.addString2(const_1.default.isc_spb_dbname, dbpath, const_1.default.DEFAULT_ENCODING), blr.addString2(const_1.default.isc_spb_nbk_file, bckfile, const_1.default.DEFAULT_ENCODING), blr.addByteInt32(const_1.default.isc_spb_nbk_level, level), blr.addString2(const_1.default.isc_spb_nbk_direct, direct, const_1.default.DEFAULT_ENCODING);
        var opts = 0;
        notriggers && (opts = opts | const_1.default.isc_spb_nbk_no_triggers), blr.addByteInt32(const_1.default.isc_spb_options, opts);
        var self = this;
        this.connection.svcstart(blr, function(err, data) {
          if (err) {
            (0, callback_1.doError)(new Error(err), callback);
            return;
          }
          self._createOutputStream(options.optread, options.buffersize, callback);
        });
      }
      restore(options, callback) {
        var bckfiles = options.backupfiles || options.files || null;
        bckfiles && (bckfiles = bckfiles.constructor !== Array ? [bckfiles] : bckfiles);
        var dbfile = options.database || this.connection.options.filename || this.connection.options.database, verbose = options.verbose || !1, cachebuffers = options.cachebuffers || 2048, pagesize = options.pagesize || 4096, readonly = options.readonly || !1, deactivateindexes = options.deactivateindexes || !1, noshadow = options.noshadow || !1, novalidity = options.novalidity || !1, individualcommit = options.individualcommit || !0, replace = options.replace || !1, create = options.create || !0, useallspace = options.useallspace || !1, metadataonly = options.metadataonly || !1, fixfssdata = options.fixfssdata || null, fixfssmetadata = options.fixfssmetadata || null;
        if (bckfiles == null || bckfiles.length === 0) {
          (0, callback_1.doError)(new Error("No backup file specified"), callback);
          return;
        }
        if (dbfile == null || dbfile.length === 0) {
          (0, callback_1.doError)(new Error("No database path specified"), callback);
          return;
        }
        var blr = this.connection._blr;
        blr.pos = 0, blr.addByte(const_1.default.isc_action_svc_restore);
        for (var i = 0; i < bckfiles.length; i++)
          blr.addString2(const_1.default.isc_spb_bkp_file, bckfiles[i], const_1.default.DEFAULT_ENCODING);
        blr.addString2(const_1.default.isc_spb_dbname, dbfile, const_1.default.DEFAULT_ENCODING), blr.addByte(const_1.default.isc_spb_res_buffers), blr.addInt32(cachebuffers), blr.addByte(const_1.default.isc_spb_res_page_size), blr.addInt32(pagesize), blr.addByte(const_1.default.isc_spb_res_access_mode), readonly ? blr.addByte(const_1.default.isc_spb_prp_am_readonly) : blr.addByte(const_1.default.isc_spb_prp_am_readwrite), fixfssdata && blr.addString2(const_1.default.isc_spb_res_fix_fss_data, fixfssdata, const_1.default.DEFAULT_ENCODING), fixfssmetadata && blr.addString2(const_1.default.isc_spb_res_fix_fss_metadata, fixfssmetadata, const_1.default.DEFAULT_ENCODING);
        var opts = 0;
        deactivateindexes && (opts = opts | const_1.default.isc_spb_res_deactivate_idx), noshadow && (opts = opts | const_1.default.isc_spb_res_no_shadow), novalidity && (opts = opts | const_1.default.isc_spb_res_no_validity), individualcommit && (opts = opts | const_1.default.isc_spb_res_one_at_a_time), replace && (opts = opts | const_1.default.isc_spb_res_replace), create && (opts = opts | const_1.default.isc_spb_res_create), useallspace && (opts = opts | const_1.default.isc_spb_res_use_all_space), metadataonly && (opts = opts | const_1.default.isc_spb_res_fix_fss_metadata), opts && blr.addByteInt32(const_1.default.isc_spb_options, opts), verbose && blr.addByte(const_1.default.isc_spb_verbose);
        var self = this;
        this.connection.svcstart(blr, function(err, data) {
          if (err) {
            (0, callback_1.doError)(new Error(err), callback);
            return;
          }
          self._createOutputStream(options.optread, options.buffersize, callback);
        });
      }
      nrestore(options, callback) {
        var bckfiles = options.backupfiles || options.files || null;
        bckfiles && (bckfiles = bckfiles.constructor !== Array ? [bckfiles] : bckfiles);
        var dbpath = options.database || this.connection.options.filename || this.connection.options.database;
        if (bckfiles == null || bckfiles.length === 0) {
          (0, callback_1.doError)(new Error("No backup file specified"), callback);
          return;
        }
        if (dbpath == null || bckfiles.length === 0) {
          (0, callback_1.doError)(new Error("No database path specified"), callback);
          return;
        }
        var blr = this.connection._blr;
        blr.pos = 0, blr.addByte(const_1.default.isc_action_svc_nrest);
        for (var i = 0; i < bckfiles.length; i++)
          blr.addString2(const_1.default.isc_spb_nbk_file, bckfiles[i], const_1.default.DEFAULT_ENCODING);
        blr.addString2(const_1.default.isc_spb_dbname, dbpath, const_1.default.DEFAULT_ENCODING);
        var self = this;
        this.connection.svcstart(blr, function(err, data) {
          if (err) {
            (0, callback_1.doError)(new Error(err), callback);
            return;
          }
          self._createOutputStream(options.optread, options.buffersize, callback);
        });
      }
      _fixpropertie(options, callback) {
        var dbpath = options.database || this.connection.options.filename || this.connection.options.database, dialect = options.dialect || null, sweep = options.sweepinterval || null, pagebuffers = options.nbpagebuffers || null, online = options.bringonline || !1, shutdown = options.shutdown != null ? options.shutdown : null, shutdowndelay = options.shutdowndelay || 0, shutdownmode = options.shutdownmode, shadow = options.activateshadow || !1, forcewrite = options.forcewrite, reservespace = options.reservespace, accessmode = options.accessmode;
        if (dbpath == null || dbpath.length === 0) {
          (0, callback_1.doError)(new Error("No database specified"), callback);
          return;
        }
        var blr = this.connection._blr;
        if (blr.pos = 0, blr.addByte(const_1.default.isc_action_svc_properties), blr.addString2(const_1.default.isc_spb_dbname, dbpath, const_1.default.DEFAULT_ENCODING), dialect && blr.addByteInt32(const_1.default.isc_spb_prp_set_sql_dialect, dialect), sweep && blr.addByteInt32(const_1.default.isc_spb_prp_sweep_interval, sweep), pagebuffers && blr.addByteInt32(const_1.default.isc_spb_prp_page_buffers, pagebuffers), shutdown != null)
          if (shutdownmode != null) {
            if (SHUTDOWNEX_KIND[shutdown] === void 0) {
              (0, callback_1.doError)(new Error("Invalid shutdown kind"), callback);
              return;
            }
            if (SHUTDOWNEX_MODE[shutdownmode] === void 0) {
              (0, callback_1.doError)(new Error("Invalid shutdown mode"), callback);
              return;
            }
            blr.addBytes([const_1.default.isc_spb_prp_shutdown_mode, SHUTDOWNEX_MODE[shutdownmode]]), blr.addByteInt32(SHUTDOWNEX_KIND[shutdown], shutdowndelay);
          } else
            blr.addByteInt32(SHUTDOWN_KIND[shutdown], shutdowndelay);
        forcewrite && blr.addBytes([const_1.default.isc_spb_prp_write_mode, const_1.default.isc_spb_prp_wm_sync]), forcewrite === !1 && blr.addBytes([const_1.default.isc_spb_prp_write_mode, const_1.default.isc_spb_prp_wm_async]), accessmode === 1 && blr.addBytes([const_1.default.isc_spb_prp_access_mode, const_1.default.isc_spb_prp_am_readwrite]), accessmode === 0 && blr.addBytes([const_1.default.isc_spb_prp_access_mode, const_1.default.isc_spb_prp_am_readonly]), reservespace && blr.addBytes([const_1.default.isc_spb_prp_reserve_space, const_1.default.isc_spb_prp_res]), reservespace != null && !reservespace && blr.addBytes([const_1.default.isc_spb_prp_reserve_space, const_1.default.isc_spb_prp_res_use_full]);
        var opts = 0;
        shadow && (opts = opts | const_1.default.isc_spb_prp_activate), online && (opts = opts | const_1.default.isc_spb_prp_db_online), opts && blr.addByteInt32(const_1.default.isc_spb_options, opts);
        var self = this;
        this.connection.svcstart(blr, function(err, data) {
          if (err) {
            (0, callback_1.doError)(new Error(err), callback);
            return;
          }
          self._createOutputStream(options.optread, options.buffersize, callback);
        });
      }
      setDialect(db, dialect, callback) {
        this._fixpropertie({ database: db, dialect }, callback);
      }
      setSweepinterval(db, sweepinterval, callback) {
        this._fixpropertie({ database: db, sweepinterval }, callback);
      }
      setCachebuffer(db, nbpages, callback) {
        this._fixpropertie({ database: db, nbpagebuffers: nbpages }, callback);
      }
      BringOnline(db, callback) {
        this._fixpropertie({ database: db, bringonline: !0 }, callback);
      }
      Shutdown(db, kind, delay, mode, callback) {
        mode instanceof Function && (callback = mode, mode = void 0), this._fixpropertie({ database: db, shutdown: kind, shutdowndelay: delay, shutdownmode: mode }, callback);
      }
      setShadow(db, val, callback) {
        this._fixpropertie({ database: db, activateshadow: val }, callback);
      }
      setForcewrite(db, val, callback) {
        this._fixpropertie({ database: db, forcewrite: val }, callback);
      }
      setReservespace(db, val, callback) {
        this._fixpropertie({ database: db, reservespace: val }, callback);
      }
      setReadonlyMode(db, callback) {
        this._fixpropertie({ database: db, accessmode: 0 }, callback);
      }
      setReadwriteMode(db, callback) {
        this._fixpropertie({ database: db, accessmode: 1 }, callback);
      }
      validate(options, callback) {
        var dbpath = options.database || this.connection.options.filename || this.connection.options.database, checkdb = options.checkdb || !1, ignorechecksums = options.ignorechecksums || !1, killshadows = options.killshadows || !1, mend = options.mend || !1, validate = options.validate || !1, full = options.full || !1, sweep = options.sweep || !1, listlimbo = options.listlimbo || !1, icu = options.icu || !1;
        if (dbpath == null || dbpath.length === 0) {
          (0, callback_1.doError)(new Error("No database specified"), callback);
          return;
        }
        var blr = this.connection._blr;
        blr.pos = 0, blr.addByte(const_1.default.isc_action_svc_repair), blr.addString2(const_1.default.isc_spb_dbname, dbpath, const_1.default.DEFAULT_ENCODING);
        var opts = 0;
        checkdb && (opts = opts | const_1.default.isc_spb_rpr_check_db), ignorechecksums && (opts = opts | const_1.default.isc_spb_rpr_ignore_checksum), killshadows && (opts = opts | const_1.default.isc_spb_rpr_kill_shadows), mend && (opts = opts | const_1.default.isc_spb_rpr_mend_db), validate && (opts = opts | const_1.default.isc_spb_rpr_validate_db), full && (opts = opts | const_1.default.isc_spb_rpr_full), sweep && (opts = opts | const_1.default.isc_spb_rpr_sweep_db), listlimbo && (opts = opts | const_1.default.isc_spb_rpr_list_limbo_trans), icu && (opts = opts | const_1.default.isc_spb_rpr_icu), blr.addByteInt32(const_1.default.isc_spb_options, opts);
        var self = this;
        this.connection.svcstart(blr, function(err, data) {
          if (err) {
            (0, callback_1.doError)(new Error(err), callback);
            return;
          }
          self._createOutputStream(options.optread, options.buffersize, callback);
        });
      }
      commit(db, transactid, callback) {
        var dbpath = db || this.connection.options.filename || this.connection.options.database;
        if (dbpath == null || dbpath.length === 0) {
          (0, callback_1.doError)(new Error("No database specified"), callback);
          return;
        }
        var blr = this.connection._blr;
        blr.pos = 0, blr.addByte(const_1.default.isc_action_svc_repair), blr.addString2(const_1.default.isc_spb_dbname, dbpath, const_1.default.DEFAULT_ENCODING), blr.addByteInt32(const_1.default.isc_spb_rpr_commit_trans, transactid);
        var self = this;
        this.connection.svcstart(blr, function(err, data) {
          if (err) {
            (0, callback_1.doError)(new Error(err), callback);
            return;
          }
          self._createOutputStream(null, null, callback);
        });
      }
      rollback(db, transactid, callback) {
        var dbpath = db || this.connection.options.filename || this.connection.options.database;
        if (dbpath == null || dbpath.length === 0) {
          (0, callback_1.doError)(new Error("No database specified"), callback);
          return;
        }
        var blr = this.connection._blr;
        blr.pos = 0, blr.addByte(const_1.default.isc_action_svc_repair), blr.addString2(const_1.default.isc_spb_dbname, dbpath, const_1.default.DEFAULT_ENCODING), blr.addByteInt32(const_1.default.isc_spb_rpr_rollback_trans, transactid);
        var self = this;
        this.connection.svcstart(blr, function(err, data) {
          if (err) {
            (0, callback_1.doError)(new Error(err), callback);
            return;
          }
          self._createOutputStream(null, null, callback);
        });
      }
      recover(db, transactid, callback) {
        var dbpath = db || this.connection.options.filename || this.connection.options.database;
        if (dbpath == null || dbpath.length === 0) {
          (0, callback_1.doError)(new Error("No database specified"), callback);
          return;
        }
        var blr = this.connection._blr;
        blr.pos = 0, blr.addByte(const_1.default.isc_action_svc_repair), blr.addString2(const_1.default.isc_spb_dbname, dbpath, const_1.default.DEFAULT_ENCODING), blr.addByteInt32(const_1.default.isc_spb_rpr_recover_two_phase, transactid);
        var self = this;
        this.connection.svcstart(blr, function(err, data) {
          if (err) {
            (0, callback_1.doError)(new Error(err), callback);
            return;
          }
          self._createOutputStream(null, null, callback);
        });
      }
      getStats(options, callback) {
        var dbpath = options.database || this.connection.options.filename || this.connection.options.database, record = options.record || !1, nocreation = options.nocreation || !1, tables = options.tables || !1, pages = options.pages || !1, header = options.header || !1, indexes = options.indexes || !1, tablesystem = options.tablesystem || !1, encryption = options.encryption || !1, objects = options.objects || null;
        if (dbpath == null || dbpath.length === 0) {
          (0, callback_1.doError)(new Error("No database specified"), callback);
          return;
        }
        var blr = this.connection._blr;
        blr.pos = 0, blr.addByte(const_1.default.isc_action_svc_db_stats), blr.addString2(const_1.default.isc_spb_dbname, dbpath, const_1.default.DEFAULT_ENCODING);
        var opts = 0;
        record && (opts = opts | const_1.default.isc_spb_sts_record_versions), nocreation && (opts = opts | const_1.default.isc_spb_sts_nocreation), tables && (opts = opts | const_1.default.isc_spb_sts_table), pages && (opts = opts | const_1.default.isc_spb_sts_data_pages), header && (opts = opts | const_1.default.isc_spb_sts_hdr_pages), indexes && (opts = opts | const_1.default.isc_spb_sts_idx_pages), tablesystem && (opts = opts | const_1.default.isc_spb_sts_sys_relations), encryption && (opts = opts | const_1.default.isc_spb_sts_encryption), opts && blr.addByteInt32(const_1.default.isc_spb_options, opts), objects && blr.addString2(const_1.default.isc_spb_command_line, objects, const_1.default.DEFAULT_ENCODING);
        var self = this;
        this.connection.svcstart(blr, function(err, data) {
          if (err) {
            (0, callback_1.doError)(new Error(err), callback);
            return;
          }
          self._createOutputStream(options.optread, options.buffersize, callback);
        });
      }
      getLog(options, callback) {
        var self = this, blr = this.connection._blr, optread = options.optread || "byline";
        blr.pos = 0, blr.addByte(const_1.default.isc_action_svc_get_fb_log), this.connection.svcstart(blr, function(err, data) {
          if (err) {
            (0, callback_1.doError)(new Error(err), callback);
            return;
          }
          self._createOutputStream(optread, options.buffersize, callback);
        });
      }
      getUsers(username, callback) {
        var self = this, blr = this.connection._blr;
        blr.pos = 0, blr.addByte(const_1.default.isc_action_svc_display_user), username && blr.addString2(const_1.default.isc_spb_sec_username, username, const_1.default.DEFAULT_ENCODING), this.connection.svcstart(blr, function(err, data) {
          if (err) {
            (0, callback_1.doError)(new Error(err), callback);
            return;
          }
          self.readusers({}, callback);
        });
      }
      addUser(username, password, options, callback) {
        var rolename = options.rolename || null, groupname = options.groupname || null, firsname = options.firstname || null, middlename = options.middlename || null, lastname = options.lastname || null, userid = options.userid || null, groupid = options.groupid || null, admin = options.admin || null, blr = this.connection._blr;
        blr.pos = 0, blr.addByte(const_1.default.isc_action_svc_add_user), blr.addString2(const_1.default.isc_spb_sec_username, username, const_1.default.DEFAULT_ENCODING), blr.addString2(const_1.default.isc_spb_sec_password, password, const_1.default.DEFAULT_ENCODING), rolename && blr.addString2(const_1.default.isc_dpb_sql_role_name, rolename, const_1.default.DEFAULT_ENCODING), groupname && blr.addString2(const_1.default.isc_spb_sec_groupname, groupname, const_1.default.DEFAULT_ENCODING), firsname && blr.addString2(const_1.default.isc_spb_sec_firstname, firsname, const_1.default.DEFAULT_ENCODING), middlename && blr.addString2(const_1.default.isc_spb_sec_middlename, middlename, const_1.default.DEFAULT_ENCODING), lastname && blr.addString2(const_1.default.isc_spb_sec_lastname, lastname, const_1.default.DEFAULT_ENCODING), userid != null && blr.addByteInt32(const_1.default.isc_spb_sec_userid, userid), groupid != null && blr.addByteInt32(const_1.default.isc_spb_sec_groupid, groupid), admin != null && blr.addByteInt32(const_1.default.isc_spb_sec_admin, admin);
        var self = this;
        this.connection.svcstart(blr, function(err, data) {
          if (err) {
            (0, callback_1.doError)(new Error(err), callback);
            return;
          }
          self._createOutputStream(options.optread, options.buffersize, callback);
        });
      }
      editUser(username, options, callback) {
        var rolename = options.rolename || null, groupname = options.groupname || null, firsname = options.firstname || null, middlename = options.middlename || null, lastname = options.lastname || null, userid = options.userid || null, groupid = options.groupid || null, admin = options.admin || null, password = options.password || null, blr = this.connection._blr;
        blr.pos = 0, blr.addByte(const_1.default.isc_action_svc_modify_user), blr.addString2(const_1.default.isc_spb_sec_username, username, const_1.default.DEFAULT_ENCODING), password && blr.addString2(const_1.default.isc_spb_sec_password, password, const_1.default.DEFAULT_ENCODING), rolename && blr.addString2(const_1.default.isc_dpb_sql_role_name, rolename, const_1.default.DEFAULT_ENCODING), groupname && blr.addString2(const_1.default.isc_spb_sec_groupname, groupname, const_1.default.DEFAULT_ENCODING), firsname && blr.addString2(const_1.default.isc_spb_sec_firstname, firsname, const_1.default.DEFAULT_ENCODING), middlename && blr.addString2(const_1.default.isc_spb_sec_middlename, middlename, const_1.default.DEFAULT_ENCODING), lastname && blr.addString2(const_1.default.isc_spb_sec_lastname, lastname, const_1.default.DEFAULT_ENCODING), userid != null && blr.addByteInt32(const_1.default.isc_spb_sec_userid, userid), groupid != null && blr.addByteInt32(const_1.default.isc_spb_sec_groupid, groupid), admin != null && blr.addByteInt32(const_1.default.isc_spb_sec_admin, admin);
        var self = this;
        this.connection.svcstart(blr, function(err, data) {
          if (err) {
            (0, callback_1.doError)(new Error(err), callback);
            return;
          }
          self._createOutputStream(options.optread, options.buffersize, callback);
        });
      }
      removeUser(username, rolename, callback) {
        var blr = this.connection._blr;
        blr.pos = 0, blr.addByte(const_1.default.isc_action_svc_delete_user), blr.addString2(const_1.default.isc_spb_sec_username, username, const_1.default.DEFAULT_ENCODING), rolename && blr.addString2(const_1.default.isc_dpb_sql_role_name, rolename, const_1.default.DEFAULT_ENCODING);
        var self = this, options = {};
        this.connection.svcstart(blr, function(err, data) {
          if (err) {
            (0, callback_1.doError)(new Error(err), callback);
            return;
          }
          self._createOutputStream(options.optread, options.buffersize, callback);
        });
      }
      getFbserverInfos(infos, options, callback) {
        var buffersize = options.buffersize || 2048, timeout = options.timeout || 1, opts = {
          dbinfo: const_1.default.isc_info_svc_svr_db_info,
          fbconfig: const_1.default.isc_info_svc_get_config,
          svcversion: const_1.default.isc_info_svc_version,
          fbversion: const_1.default.isc_info_svc_server_version,
          fbimplementation: const_1.default.isc_info_svc_implementation,
          fbcapatibilities: const_1.default.isc_info_svc_capabilities,
          pathsecuritydb: const_1.default.isc_info_svc_user_dbpath,
          fbenv: const_1.default.isc_info_svc_get_env,
          fbenvlock: const_1.default.isc_info_svc_get_env_lock,
          fbenvmsg: const_1.default.isc_info_svc_get_env_msg
        }, tops = [], empty = isEmpty(infos);
        for (let popts in opts)
          (empty || infos[popts]) && tops.push(opts[popts]);
        var self = this;
        this.connection.svcquery(tops, buffersize, timeout, function(err, data) {
          if (err || !data.buffer) {
            (0, callback_1.doError)(new Error(err || "Bad query return"), callback);
            return;
          }
          self._processquery(data.buffer, callback);
        });
      }
      startTrace(options, callback) {
        var self = this, blr = this.connection._blr, configfile = options.configfile || "", tracename = options.tracename || "";
        if (configfile.length === 0) {
          (0, callback_1.doError)(new Error("No config filename specified"), callback);
          return;
        }
        if (tracename.length === 0) {
          (0, callback_1.doError)(new Error("No tracename specified"), callback);
          return;
        }
        blr.pos = 0, blr.addByte(const_1.default.isc_action_svc_trace_start), blr.addString2(const_1.default.isc_spb_trc_cfg, configfile, const_1.default.DEFAULT_ENCODING), blr.addString2(const_1.default.isc_spb_trc_name, tracename, const_1.default.DEFAULT_ENCODING), this.connection.svcstart(blr, function(err, data) {
          if (err) {
            (0, callback_1.doError)(new Error(err), callback);
            return;
          }
          self._createOutputStream(options.optread, options.buffersize, callback);
        });
      }
      suspendTrace(options, callback) {
        var self = this, blr = this.connection._blr, traceid = options.traceid || null;
        if (traceid == null) {
          (0, callback_1.doError)(new Error("No traceid specified"), callback);
          return;
        }
        blr.pos = 0, blr.addByte(const_1.default.isc_action_svc_trace_suspend), blr.addByteInt32(const_1.default.isc_spb_trc_id, traceid), this.connection.svcstart(blr, function(err, data) {
          if (err) {
            (0, callback_1.doError)(new Error(err), callback);
            return;
          }
          self._createOutputStream(options.optread, options.buffersize, callback);
        });
      }
      resumeTrace(options, callback) {
        var self = this, blr = this.connection._blr, traceid = options.traceid || null;
        if (traceid == null) {
          (0, callback_1.doError)(new Error("No traceid specified"), callback);
          return;
        }
        blr.pos = 0, blr.addByte(const_1.default.isc_action_svc_trace_resume), blr.addByteInt32(const_1.default.isc_spb_trc_id, traceid), this.connection.svcstart(blr, function(err, data) {
          if (err) {
            (0, callback_1.doError)(new Error(err), callback);
            return;
          }
          self._createOutputStream(options.optread, options.buffersize, callback);
        });
      }
      stopTrace(options, callback) {
        var self = this, blr = this.connection._blr, traceid = options.traceid || null;
        if (traceid == null) {
          (0, callback_1.doError)(new Error("No traceid specified"), callback);
          return;
        }
        blr.pos = 0, blr.addByte(const_1.default.isc_action_svc_trace_stop), blr.addByteInt32(const_1.default.isc_spb_trc_id, traceid), this.connection.svcstart(blr, function(err, data) {
          if (err) {
            (0, callback_1.doError)(new Error(err), callback);
            return;
          }
          self._createOutputStream(options.optread, options.buffersize, callback);
        });
      }
      getTraceList(options, callback) {
        var self = this, blr = this.connection._blr;
        blr.pos = 0, blr.addByte(const_1.default.isc_action_svc_trace_list), this.connection.svcstart(blr, function(err, data) {
          if (err) {
            (0, callback_1.doError)(new Error(err), callback);
            return;
          }
          self._createOutputStream(options.optread, options.buffersize, callback);
        });
      }
      readline(options, callback) {
        var buffersize = options.buffersize || 2048, timeout = options.timeout || 60, self = this;
        this.connection.svcquery([const_1.default.isc_info_svc_line], buffersize, timeout, function(err, data) {
          if (err || !data.buffer) {
            (0, callback_1.doError)(new Error(err || "Bad query return"), callback);
            return;
          }
          self._processquery(data.buffer, callback);
        });
      }
      readeof(options, callback) {
        var buffersize = options.buffersize || 8192, timeout = options.timeout || 60, self = this;
        this.connection.svcquery([const_1.default.isc_info_svc_to_eof], buffersize, timeout, function(err, data) {
          if (err || !data.buffer) {
            (0, callback_1.doError)(new Error(err || "Bad query return"), callback);
            return;
          }
          self._processquery(data.buffer, callback);
        });
      }
      hasRunningAction(options, callback) {
        var buffersize = options.buffersize || 2048, timeout = options.timeout || 60, self = this;
        this.connection.svcquery([const_1.default.isc_info_svc_running], buffersize, timeout, function(err, data) {
          if (err || !data.buffer) {
            (0, callback_1.doError)(new Error(err || "Bad query return"), callback);
            return;
          }
          self._processquery(data.buffer, callback);
        });
      }
      readusers(options, callback) {
        var buffersize = options.buffersize || 2048, timeout = options.timeout || 60, self = this;
        this.connection.svcquery([const_1.default.isc_info_svc_get_users], buffersize, timeout, function(err, data) {
          if (err || !data.buffer) {
            (0, callback_1.doError)(new Error(err || "Bad query return"), callback);
            return;
          }
          self._processquery(data.buffer, callback);
        });
      }
      readlimbo(options, callback) {
        var buffersize = options.buffersize || 2048, timeout = options.timeout || 60, self = this;
        this.connection.svcquery([const_1.default.isc_info_svc_limbo_trans], buffersize, timeout, function(err, data) {
          if (err || !data.buffer) {
            (0, callback_1.doError)(new Error(err || "Bad query return"), callback);
            return;
          }
          self._processquery(data.buffer, callback);
        });
      }
      /* Promise / async-await API — wrappers over the callback methods above. */
      detachAsync(force) {
        var self = this;
        return (0, callback_1.fromCallback)(function(cb) {
          self.detach(cb, force);
        });
      }
      backupAsync(options) {
        var self = this;
        return (0, callback_1.fromCallback)(function(cb) {
          self.backup(options, cb);
        });
      }
      nbackupAsync(options) {
        var self = this;
        return (0, callback_1.fromCallback)(function(cb) {
          self.nbackup(options, cb);
        });
      }
      restoreAsync(options) {
        var self = this;
        return (0, callback_1.fromCallback)(function(cb) {
          self.restore(options, cb);
        });
      }
      nrestoreAsync(options) {
        var self = this;
        return (0, callback_1.fromCallback)(function(cb) {
          self.nrestore(options, cb);
        });
      }
      setDialectAsync(db, dialect) {
        var self = this;
        return (0, callback_1.fromCallback)(function(cb) {
          self.setDialect(db, dialect, cb);
        });
      }
      setSweepintervalAsync(db, sweepinterval) {
        var self = this;
        return (0, callback_1.fromCallback)(function(cb) {
          self.setSweepinterval(db, sweepinterval, cb);
        });
      }
      setCachebufferAsync(db, nbpages) {
        var self = this;
        return (0, callback_1.fromCallback)(function(cb) {
          self.setCachebuffer(db, nbpages, cb);
        });
      }
      BringOnlineAsync(db) {
        var self = this;
        return (0, callback_1.fromCallback)(function(cb) {
          self.BringOnline(db, cb);
        });
      }
      ShutdownAsync(db, kind, delay, mode) {
        var self = this;
        return (0, callback_1.fromCallback)(function(cb) {
          self.Shutdown(db, kind, delay, mode, cb);
        });
      }
      setShadowAsync(db, val) {
        var self = this;
        return (0, callback_1.fromCallback)(function(cb) {
          self.setShadow(db, val, cb);
        });
      }
      setForcewriteAsync(db, val) {
        var self = this;
        return (0, callback_1.fromCallback)(function(cb) {
          self.setForcewrite(db, val, cb);
        });
      }
      setReservespaceAsync(db, val) {
        var self = this;
        return (0, callback_1.fromCallback)(function(cb) {
          self.setReservespace(db, val, cb);
        });
      }
      setReadonlyModeAsync(db) {
        var self = this;
        return (0, callback_1.fromCallback)(function(cb) {
          self.setReadonlyMode(db, cb);
        });
      }
      setReadwriteModeAsync(db) {
        var self = this;
        return (0, callback_1.fromCallback)(function(cb) {
          self.setReadwriteMode(db, cb);
        });
      }
      validateAsync(options) {
        var self = this;
        return (0, callback_1.fromCallback)(function(cb) {
          self.validate(options, cb);
        });
      }
      commitAsync(db, transactid) {
        var self = this;
        return (0, callback_1.fromCallback)(function(cb) {
          self.commit(db, transactid, cb);
        });
      }
      rollbackAsync(db, transactid) {
        var self = this;
        return (0, callback_1.fromCallback)(function(cb) {
          self.rollback(db, transactid, cb);
        });
      }
      recoverAsync(db, transactid) {
        var self = this;
        return (0, callback_1.fromCallback)(function(cb) {
          self.recover(db, transactid, cb);
        });
      }
      getStatsAsync(options) {
        var self = this;
        return (0, callback_1.fromCallback)(function(cb) {
          self.getStats(options, cb);
        });
      }
      getLogAsync(options) {
        var self = this;
        return (0, callback_1.fromCallback)(function(cb) {
          self.getLog(options, cb);
        });
      }
      getUsersAsync(username) {
        var self = this;
        return (0, callback_1.fromCallback)(function(cb) {
          self.getUsers(username === void 0 ? null : username, cb);
        });
      }
      addUserAsync(username, password, options) {
        var self = this;
        return (0, callback_1.fromCallback)(function(cb) {
          self.addUser(username, password, options, cb);
        });
      }
      editUserAsync(username, options) {
        var self = this;
        return (0, callback_1.fromCallback)(function(cb) {
          self.editUser(username, options, cb);
        });
      }
      removeUserAsync(username, rolename) {
        var self = this;
        return (0, callback_1.fromCallback)(function(cb) {
          self.removeUser(username, rolename === void 0 ? null : rolename, cb);
        });
      }
      getFbserverInfosAsync(infos, options) {
        var self = this;
        return (0, callback_1.fromCallback)(function(cb) {
          self.getFbserverInfos(infos || {}, options || {}, cb);
        });
      }
      startTraceAsync(options) {
        var self = this;
        return (0, callback_1.fromCallback)(function(cb) {
          self.startTrace(options, cb);
        });
      }
      suspendTraceAsync(options) {
        var self = this;
        return (0, callback_1.fromCallback)(function(cb) {
          self.suspendTrace(options, cb);
        });
      }
      resumeTraceAsync(options) {
        var self = this;
        return (0, callback_1.fromCallback)(function(cb) {
          self.resumeTrace(options, cb);
        });
      }
      stopTraceAsync(options) {
        var self = this;
        return (0, callback_1.fromCallback)(function(cb) {
          self.stopTrace(options, cb);
        });
      }
      getTraceListAsync(options) {
        var self = this;
        return (0, callback_1.fromCallback)(function(cb) {
          self.getTraceList(options || {}, cb);
        });
      }
      readlineAsync(options) {
        var self = this;
        return (0, callback_1.fromCallback)(function(cb) {
          self.readline(options || {}, cb);
        });
      }
      readeofAsync(options) {
        var self = this;
        return (0, callback_1.fromCallback)(function(cb) {
          self.readeof(options || {}, cb);
        });
      }
      hasRunningActionAsync(options) {
        var self = this;
        return (0, callback_1.fromCallback)(function(cb) {
          self.hasRunningAction(options || {}, cb);
        });
      }
      readusersAsync(options) {
        var self = this;
        return (0, callback_1.fromCallback)(function(cb) {
          self.readusers(options || {}, cb);
        });
      }
      readlimboAsync(options) {
        var self = this;
        return (0, callback_1.fromCallback)(function(cb) {
          self.readlimbo(options || {}, cb);
        });
      }
    };
    module2.exports = ServiceManager;
  }
});

// node_modules/node-firebird/lib/firebird.msg.json
var require_firebird_msg = __commonJS({
  "node_modules/node-firebird/lib/firebird.msg.json"(exports2, module2) {
    module2.exports = {
      "335544321": "Arithmetic exception, numeric overflow, or string truncation",
      "335544322": "Invalid database key",
      "335544323": "File @1 is not a valid database",
      "335544324": "Invalid database handle (no active connection)",
      "335544325": "Bad parameters on attach or create database",
      "335544326": "Unrecognized database parameter block",
      "335544327": "Invalid request handle",
      "335544328": "Invalid BLOB handle",
      "335544329": "Invalid BLOB ID",
      "335544330": "Invalid parameter in transaction parameter block",
      "335544331": "Invalid format for transaction parameter block",
      "335544332": "Invalid transaction handle (expecting explicit transaction start)",
      "335544333": "Internal gds software consistency check (@1)",
      "335544334": 'Conversion error from string "@1"',
      "335544335": "Database file appears corrupt (@1)",
      "335544336": "Deadlock",
      "335544337": "Attempt to start more than @1 transactions",
      "335544338": "No match for first value expression",
      "335544339": "Information type inappropriate for object specified",
      "335544340": "No information of this type available for object specified",
      "335544341": "Unknown information item",
      "335544342": "Action cancelled by trigger (@1) to preserve data integrity",
      "335544343": "Invalid request BLR at offset @1",
      "335544344": 'I/O error for file "@2"',
      "335544345": "Lock conflict on no wait transaction",
      "335544346": "Corrupt system table",
      "335544347": 'Validation error for column @1, value "@2"',
      "335544348": "No current record for fetch operation",
      "335544349": 'Attempt to store duplicate value ( visible to active transactions ) in unique index "@1"',
      "335544350": "Program attempted to exit without finishing database",
      "335544351": "Unsuccessful metadata update",
      "335544352": "No permission for @1 access to @2 @3",
      "335544353": "Transaction is not in limbo",
      "335544354": "Invalid database key",
      "335544355": "BLOB was not closed",
      "335544356": "Metadata is obsolete",
      "335544357": "Cannot disconnect database with open transactions (@1 active)",
      "335544358": "Message length error ( encountered @1, expected @2)",
      "335544359": "Attempted update of read - only column",
      "335544360": "Attempted update of read-only table",
      "335544361": "Attempted update during read - only transaction",
      "335544362": "Cannot update read-only view @1",
      "335544363": "No transaction for request",
      "335544364": "Request synchronization error",
      "335544365": "Request referenced an unavailable database",
      "335544366": "Segment buffer length shorter than expected",
      "335544367": "Attempted retrieval of more segments than exist",
      "335544368": "Attempted invalid operation on a BLOB",
      "335544369": "Attempted read of a new, open BLOB",
      "335544370": "Attempted action on blob outside transaction",
      "335544371": "Attempted write to read-only BLOB",
      "335544372": "Attempted reference to BLOB in unavailable database",
      "335544373": "Operating system directive @1 failed",
      "335544374": "Attempt to fetch past the last record in a record stream",
      "335544375": "Unavailable database",
      "335544376": "Table @1 was omitted from the transaction reserving list",
      "335544377": "Request includes a DSRI extension not supported in this implementation",
      "335544378": "Feature is not supported",
      "335544379": "Unsupported on - disk structure for file @1; found @2.@3, support @4.@5",
      "335544380": "Wrong number of arguments on call",
      "335544381": "Implementation limit exceeded",
      "335544382": "@1",
      "335544383": "Unrecoverable conflict with limbo transaction @1",
      "335544384": "Internal error",
      "335544385": "Internal error",
      "335544386": "Too many requests",
      "335544387": "Internal error",
      "335544388": "Block size exceeds implementation restriction",
      "335544389": "Buffer exhausted",
      "335544390": "BLR syntax error: expected @1 at offset @2, encountered @3",
      "335544391": "Buffer in use",
      "335544392": "Internal error",
      "335544393": "Request in use",
      "335544394": "Incompatible version of on-disk structure",
      "335544395": "Table @1 is not defined",
      "335544396": "Column @1 is not defined in table @2",
      "335544397": "Internal error",
      "335544398": "Internal error",
      "335544399": "Internal error",
      "335544400": "Internal error",
      "335544401": "Internal error",
      "335544402": "Internal error",
      "335544403": "Page @1 is of wrong type (expected @2, found @3)",
      "335544404": "Database corrupted",
      "335544405": "Checksum error on database page @1",
      "335544406": "Index is broken",
      "335544407": "Database handle not zero",
      "335544408": "Transaction handle not zero",
      "335544409": "Transaction - request mismatch ( synchronization error )",
      "335544410": "Bad handle count",
      "335544411": "Wrong version of transaction parameter block",
      "335544412": "Unsupported BLR version (expected @1, encountered @2)",
      "335544413": "Wrong version of database parameter block",
      "335544414": "BLOB and array data types are not supported for @1 operation",
      "335544415": "Database corrupted",
      "335544416": "Internal error",
      "335544417": "Internal error",
      "335544418": "Transaction in limbo",
      "335544419": "Transaction not in limbo",
      "335544420": "Transaction outstanding",
      "335544421": "Connection rejected by remote interface",
      "335544422": "Internal error",
      "335544423": "Internal error",
      "335544424": "No lock manager available",
      "335544425": "Context already in use (BLR error)",
      "335544426": "Context not defined (BLR error)",
      "335544427": "Data operation not supported",
      "335544428": "Undefined message number",
      "335544429": "Bad parameter number",
      "335544430": "Unable to allocate memory from operating system",
      "335544431": "Blocking signal has been received",
      "335544432": "Lock manager error",
      "335544433": 'communication error with journal "@1"',
      "335544434": 'Key size exceeds implementation restriction for index "@1"',
      "335544435": "Null segment of UNIQUE KEY",
      "335544436": "SQL error code = @1",
      "335544437": "Wrong DYN version",
      "335544438": "Function @1 is not defined",
      "335544439": "Function @1 could not be matched",
      "335544440": "-",
      "335544441": "Database detach completed with errors",
      "335544442": "Database system cannot read argument @1",
      "335544443": "Database system cannot write argument @1",
      "335544444": "Operation not supported",
      "335544445": "@1 extension error",
      "335544446": "Not updatable",
      "335544447": "No rollback performed",
      "335544448": "[no associated message]",
      "335544449": "[no associated message]",
      "335544450": "@1",
      "335544451": "Update conflicts with concurrent update",
      "335544452": "product @1 is not licensed",
      "335544453": "Object @1 is in use",
      "335544454": "Filter not found to convert type @1 to type @2",
      "335544455": "Cannot attach active shadow file",
      "335544456": "Invalid slice description language at offset @1",
      "335544457": "Subscript out of bounds",
      "335544458": "Column not array or invalid dimensions (expected @1, encountered @2)",
      "335544459": "Record from transaction @1 is stuck in limbo",
      "335544460": "A file in manual shadow @1 is unavailable",
      "335544461": "Secondary server attachments cannot validate databases",
      "335544462": "secondary server attachments cannot start journaling",
      "335544463": "Generator @1 is not defined",
      "335544464": "Secondary server attachments cannot start logging",
      "335544465": "Invalid BLOB type for operation",
      "335544466": 'Violation of FOREIGN KEY constraint "@1" on table "@2"',
      "335544467": "Minor version too high found @1 expected @2",
      "335544468": "Transaction @1 is @2",
      "335544469": "Transaction marked invalid by I/O error",
      "335544470": "Cache buffer for page @1 invalid",
      "335544471": "There is no index in table @1 with id @2",
      "335544472": `Your user name and password are not defined. Ask your database
administrator to set up a Firebird login
`,
      "335544473": "Invalid bookmark handle",
      "335544474": "Invalid lock level @1",
      "335544475": "Lock on table @1 conflicts with existing lock",
      "335544476": "Requested record lock conflicts with existing lock",
      "335544477": "Maximum indexes per table (@1) exceeded",
      "335544478": "enable journal for database before starting online dump",
      "335544479": "online dump failure. Retry dump",
      "335544480": "an online dump is already in progress",
      "335544481": "no more disk/tape space.  Cannot continue online dump",
      "335544482": "journaling allowed only if database has Write-ahead Log",
      "335544483": "maximum number of online dump files that can be specified is 16",
      "335544484": "error in opening Write-ahead Log file during recovery",
      "335544485": "Invalid statement handle",
      "335544486": "Write-ahead log subsystem failure",
      "335544487": "WAL Writer error",
      "335544488": "Log file header of @1 too small",
      "335544489": "Invalid version of log file @1",
      "335544490": "Log file @1 not latest in the chain but open flag still set",
      "335544491": "Log file @1 not closed properly; database recovery may be required",
      "335544492": "Database name in the log file @1 is different",
      "335544493": "Unexpected end of log file @1 at offset @2",
      "335544494": "Incomplete log record at offset @1 in log file @2",
      "335544495": "Log record header too small at offset @1 in log file @",
      "335544496": "Log block too small at offset @1 in log file @2",
      "335544497": "Illegal attempt to attach to an uninitialized WAL segment for @1",
      "335544498": "Invalid WAL parameter block option @1",
      "335544499": "Cannot roll over to the next log file @1",
      "335544500": "Database does not use Write-ahead Log",
      "335544501": "cannot drop log file when journaling is enabled",
      "335544502": "Reference to invalid stream number",
      "335544503": "WAL subsystem encountered error",
      "335544504": "WAL subsystem corrupted",
      "335544505": "must specify archive file when enabling long term journal for databases with round-robin log files",
      "335544506": "Database @1 shutdown in progress",
      "335544507": "Refresh range number @1 already in use",
      "335544508": "Refresh range number @1 not found",
      "335544509": "CHARACTER SET @1 is not defined",
      "335544510": "Lock time-out on wait transaction",
      "335544511": "Procedure @1 is not defined",
      "335544512": "Input parameter mismatch for procedure @1",
      "335544513": `Database @1: WAL subsystem bug for pid @2
@3`,
      "335544514": "Could not expand the WAL segment for database @1",
      "335544515": "Status code @1 unknown",
      "335544516": "Exception @1 not defined",
      "335544517": "Exception @1",
      "335544518": "Restart shared cache manager",
      "335544519": "Invalid lock handle",
      "335544520": "long-term journaling already enabled",
      "335544521": "Unable to roll over please see Firebird log.",
      "335544522": "WAL I/O error.  Please see Firebird log.",
      "335544523": "WAL writer - Journal server communication error.  Please see Firebird log.",
      "335544524": "WAL buffers cannot be increased.  Please see Firebird log.",
      "335544525": "WAL setup error.  Please see Firebird log.",
      "335544526": "obsolete",
      "335544527": "Cannot start WAL writer for the database @1",
      "335544528": "Database @1 shutdown",
      "335544529": "Cannot modify an existing user privilege",
      "335544530": "Cannot delete PRIMARY KEY being used in FOREIGN KEY definition",
      "335544531": "Column used in a PRIMARY constraint must be NOT NULL",
      "335544532": "Name of Referential Constraint not defined in constraints table",
      "335544533": "Non-existent PRIMARY or UNIQUE KEY specified for FOREIGN KEY",
      "335544534": "Cannot update constraints (RDB$REF_CONSTRAINTS)",
      "335544535": "Cannot update constraints (RDB$CHECK_CONSTRAINTS)",
      "335544536": "Cannot delete CHECK constraint entry (RDB$CHECK_CONSTRAINTS)",
      "335544537": "Cannot delete index segment used by an Integrity Constraint",
      "335544538": "Cannot update index segment used by an Integrity Constraint",
      "335544539": "Cannot delete index used by an Integrity Constraint",
      "335544540": "Cannot modify index used by an Integrity Constraint",
      "335544541": "Cannot delete trigger used by a CHECK Constraint",
      "335544542": "Cannot update trigger used by a CHECK Constraint",
      "335544543": "Cannot delete column being used in an Integrity Constraint",
      "335544544": "Cannot rename column being used in an Integrity Constraint",
      "335544545": "Cannot update constraints (RDB$RELATION_CONSTRAINTS)",
      "335544546": "Cannot define constraints on views",
      "335544547": "Internal gds software consistency check (invalid RDB$CONSTRAINT_TYPE)",
      "335544548": "Attempt to define a second PRIMARY KEY for the same table",
      "335544549": "Cannot modify or erase a system trigger",
      "335544550": "Only the owner of a table may reassign ownership",
      "335544551": "Could not find table/procedure for GRANT",
      "335544552": "Could not find column for GRANT",
      "335544553": "User does not have GRANT privileges for operation",
      "335544554": "Table/procedure has non-SQL security class defined",
      "335544555": "Column has non-SQL security class defined",
      "335544556": "Write-ahead Log without shared cache configuration not allowed",
      "335544557": "Database shutdown unsuccessful",
      "335544558": "Operation violates check constraint @1 on view or table @2",
      "335544559": "Invalid service handle",
      "335544560": "Database @1 shutdown in @2 seconds",
      "335544561": "Wrong version of service parameter block",
      "335544562": "Unrecognized service parameter block",
      "335544563": "Service @1 is not defined",
      "335544564": "long-term journaling not enabled",
      "335544565": "Cannot transliterate character between character sets",
      "335544566": "WAL defined; Cache Manager must be started first",
      "335544567": "Overflow log specification required for round-robin log",
      "335544568": "Implementation of text subtype @1 not located",
      "335544569": "Dynamic SQL Error",
      "335544570": "Invalid command",
      "335544571": "Data type for constant unknown",
      "335544572": "Invalid cursor reference",
      "335544573": "Data type unknown",
      "335544574": "Invalid cursor declaration",
      "335544575": "Cursor @1 is not updatable",
      "335544576": "Attempt to reopen an open cursor",
      "335544577": "Attempt to reclose a closed cursor",
      "335544578": "Column unknown",
      "335544579": "Internal error",
      "335544580": "Table unknown",
      "335544581": "Procedure unknown",
      "335544582": "Request unknown",
      "335544583": "SQLDA missing or incorrect version, or incorrect number/type of variables",
      "335544584": "Count of read - write columns does not equal count of values",
      "335544585": "Invalid statement handle",
      "335544586": "Function unknown",
      "335544587": "Column is not a BLOB",
      "335544588": "COLLATION @1 for CHARACTER SET @2 is not defined",
      "335544589": "COLLATION @1 is not valid for specified CHARACTER SET",
      "335544590": "Option specified more than once",
      "335544591": "Unknown transaction option",
      "335544592": "Invalid array reference",
      "335544593": "Array declared with too many dimensions",
      "335544594": "Illegal array dimension range",
      "335544595": "Trigger unknown",
      "335544596": "Subselect illegal in this context",
      "335544597": "Cannot prepare a CREATE DATABASE/SCHEMA statement",
      "335544598": "Must specify column name for view select expression",
      "335544599": "Number of columns does not match select list",
      "335544600": "Only simple column names permitted for VIEW WITH CHECK OPTION",
      "335544601": "No WHERE clause for VIEW WITH CHECK OPTION",
      "335544602": "Only one table allowed for VIEW WITH CHECK OPTION",
      "335544603": "DISTINCT, GROUP or HAVING not permitted for VIEW WITH CHECK OPTION",
      "335544604": "FOREIGN KEY column count does not match PRIMARY KEY",
      "335544605": "No subqueries permitted for VIEW WITH CHECK OPTION",
      "335544606": "Expression evaluation not supported",
      "335544607": "Gen.c: node not supported",
      "335544608": "Unexpected end of command",
      "335544609": "INDEX @1",
      "335544610": "EXCEPTION @1",
      "335544611": "COLUMN @1",
      "335544612": "Token unknown",
      "335544613": "Union not supported",
      "335544614": "Unsupported DSQL construct",
      "335544615": "Column used with aggregate",
      "335544616": "Invalid column reference",
      "335544617": "Invalid ORDER BY clause",
      "335544618": "Return mode by value not allowed for this data type",
      "335544619": "External functions cannot have morethan 10 parametrs",
      "335544620": "Alias @1 conflicts with an alias in the same statement",
      "335544621": "Alias @1 conflicts with a procedure in the same statement",
      "335544622": "Alias @1 conflicts with a table in the same statement",
      "335544623": "Illegal use of keyword VALUE",
      "335544624": "Segment count of 0 defined for index @1",
      "335544625": "A node name is not permitted in a secondary, shadow, cache or log file name",
      "335544626": "TABLE @1",
      "335544627": "PROCEDURE @1",
      "335544628": "Cannot create index @1",
      "335544629": "Write-ahead Log with shadowing configuration not allowed",
      "335544630": "There are @1 dependencies",
      "335544631": "Too many keys defined for index @1",
      "335544632": "Preceding file did not specify length, so @1 must include starting page number",
      "335544633": "Shadow number must be a positive integer",
      "335544634": "Token unknown - line @1, column @2",
      "335544635": "There is no alias or table named @1 at this scope level",
      "335544636": "There is no index @1 for table @2",
      "335544637": "Table @1 is not referenced in plan",
      "335544638": "Table @1 is referenced more than once in plan; use aliases to distinguish",
      "335544639": "Table @1 is referenced in the plan but not the from list",
      "335544640": "Invalid use of CHARACTER SET or COLLATE",
      "335544641": "Specified domain or source column @1 does not exist",
      "335544642": "Index @1 cannot be used in the specified plan",
      "335544643": "The table @1 is referenced twice; use aliases to differentiate",
      "335544644": "Illegal operation when at beginning of stream",
      "335544645": "The current position is on a crack",
      "335544646": "Database or file exists",
      "335544647": "Invalid comparison operator for find operation",
      "335544648": "Connection lost to pipe server",
      "335544649": "Bad checksum",
      "335544650": "Wrong page type",
      "335544651": "Cannot insert because the file is readonly or is on a read only medium",
      "335544652": "Multiple rows in singleton select",
      "335544653": "Cannot attach to password database",
      "335544654": "Cannot start transaction for password database",
      "335544655": "Invalid direction for find operation",
      "335544656": "Variable @1 conflicts with parameter in same procedure",
      "335544657": "Array/BLOB/DATE data types not allowed in arithmetic",
      "335544658": "@1 is not a valid base table of the specified view",
      "335544659": "Table @1 is referenced twice in view; use an alias to distinguish",
      "335544660": "View @1 has more than one base table; use aliases to distinguish",
      "335544661": "Cannot add index, index root page is full",
      "335544662": "BLOB SUB_TYPE @1 is not defined",
      "335544663": "Too many concurrent executions of the same request",
      "335544664": "Duplicate specification of @1- not supported",
      "335544665": 'Violation of PRIMARY or UNIQUE KEY constraint "@1" on table "@2"',
      "335544666": "Server version too old to support all CREATE DATABASE options",
      "335544667": "Drop database completed with errors",
      "335544668": "Procedure @1 does not return any values",
      "335544669": "Count of column list and variable list do not match",
      "335544670": "Attempt to index BLOB column in index @1",
      "335544671": "Attempt to index array column in index @1",
      "335544672": "Too few key columns found for index @1 (incorrect column name?)",
      "335544673": "Cannot delete",
      "335544674": "Last column in a table cannot be deleted",
      "335544675": "Sort error",
      "335544676": "Sort error: not enough memory",
      "335544677": "Too many versions",
      "335544678": "Invalid key position",
      "335544679": "Segments not allowed in expression index @1",
      "335544680": "Sort error: corruption in data structure",
      "335544681": "New record size of @1 bytes is too big",
      "335544682": "Inappropriate self-reference of column",
      "335544683": "Request depth exceeded. (Recursive definition?)",
      "335544684": "Cannot access column @1 in view @2",
      "335544685": "Dbkey not available for multi - table views",
      "335544686": "journal file wrong format",
      "335544687": "intermediate journal file full",
      "335544688": "The prepare statement identifies a prepare statement with an open cursor",
      "335544689": "Firebird error",
      "335544690": "Cache redefined",
      "335544691": "Insufficient memory to allocate page buffer cache",
      "335544692": "Log redefined",
      "335544693": "Log size too small",
      "335544694": "Log partition size too small",
      "335544695": "Partitions not supported in series of log file specification",
      "335544696": "Total length of a partitioned log must be specified",
      "335544697": "Precision must be from 1 to 18",
      "335544698": "Scale must be between zero and precision",
      "335544699": "Short integer expected",
      "335544700": "Long integer expected",
      "335544701": "Unsigned short integer expected",
      "335544702": "Invalid ESCAPE sequence",
      "335544703": "Service @1 does not have an associated executable",
      "335544704": "Failed to locate host machine",
      "335544705": "Undefined service @1/@2",
      "335544706": "The specified name was not found in the hosts file or Domain Name Services",
      "335544707": "User does not have GRANT privileges on base table/view for operation",
      "335544708": "Ambiguous column reference",
      "335544709": "Invalid aggregate reference",
      "335544710": "Navigational stream @1 references a view with more than one base table",
      "335544711": "Attempt to execute an unprepared dynamic SQL statement",
      "335544712": "Positive value expected",
      "335544713": "Incorrect values within SQLDA structure",
      "335544714": "Invalid blob id",
      "335544715": "Operation not supported for EXTERNAL FILE table @1",
      "335544716": "Service is currently busy: @1",
      "335544717": "Stack size insufficent to execute current request",
      "335544718": "Invalid key for find operation",
      "335544719": "Error initializing the network software.",
      "335544720": "Unable to load required library @1.",
      "335544721": 'Unable to complete network request to host "@1"',
      "335544722": "Failed to establish a connection",
      "335544723": "Error while listening for an incoming connection",
      "335544724": "Failed to establish a secondary connection for event processing",
      "335544725": "Error while listening for an incoming event connection request",
      "335544726": "Error reading data from the connection",
      "335544727": "Error writing data to the connection",
      "335544728": "Cannot deactivate index used by an integrity constraint",
      "335544729": "Cannot deactivate index used by a PRIMARY/UNIQUE constraint",
      "335544730": "Client/Server Express not supported in this release",
      "335544731": "[no associated message]",
      "335544732": "Access to databases on file servers is not supported",
      "335544733": "Error while trying to create file",
      "335544734": "Error while trying to open file",
      "335544735": "Error while trying to close file",
      "335544736": "Error while trying to read from file",
      "335544737": "Error while trying to write to file",
      "335544738": "Error while trying to delete file",
      "335544739": "Error while trying to access file",
      "335544740": "A fatal exception occurred during the execution of a user defined function",
      "335544741": "Connection lost to database",
      "335544742": "User cannot write to RDB$USER_PRIVILEGES",
      "335544743": "Token size exceeds limit",
      "335544744": "Maximum user count exceeded.Contact your database administrator",
      "335544745": `Your login @1 is same as one of the SQL role name. Ask your
database administrator to set up a valid Firebird login.
`,
      "335544746": '"REFERENCES table" without "(column)" requires PRIMARY KEY on referenced table',
      "335544747": "The username entered is too long. Maximum length is 31 bytes",
      "335544748": "The password specified is too long. Maximum length is @1 bytes",
      "335544749": "A username is required for this operation",
      "335544750": "A password is required for this operation",
      "335544751": "The network protocol specified is invalid",
      "335544752": "A duplicate user name was found in the security database",
      "335544753": "The user name specified was not found in the security database",
      "335544754": "An error occurred while attempting to add the user",
      "335544755": "An error occurred while attempting to modify the user record",
      "335544756": "An error occurred while attempting to delete the user record",
      "335544757": "An error occurred while updating the security database",
      "335544758": "Sort record size of @1 bytes is too big ????",
      "335544759": "Can not define a not null column with NULL as default value",
      "335544760": "Invalid clause - '@1'",
      "335544761": "Too many open handles to database",
      "335544762": "size of optimizer block exceeded",
      "335544763": "A string constant is delimited by double quotes",
      "335544764": "DATE must be changed to TIMESTAMP",
      "335544765": "Attempted update on read - only database",
      "335544766": "SQL dialect @1 is not supported in this database",
      "335544767": "A fatal exception occurred during the execution of a blob filter",
      "335544768": "Access violation.The code attempted to access a virtual address without privilege to do so",
      "335544769": `Datatype misalignment.The attempted to read or write a value that was not
stored on a memory boundary
`,
      "335544770": `Array bounds exceeded. The code attempted to access an array element that is
out of bounds.
`,
      "335544771": `Float denormal operand.One of the floating-point operands is too small to
represent a standard float value.
`,
      "335544772": `Floating-point divide by zero.The code attempted to divide a floating-point
value by zero.
`,
      "335544773": `Floating-point inexact result.The result of a floating-point operation cannot
be represented as a decimal fraction
`,
      "335544774": `Floating-point invalid operand.An indeterminant error occurred during a
floating-point operation
`,
      "335544775": `Floating-point overflow.The exponent of a floating-point operation is
greater than the magnitude allowed
`,
      "335544776": `Floating-point stack check.The stack overflowed or underflowed as the
result of a floating-point operation
`,
      "335544777": `Floating-point underflow.The exponent of a floating-point operation is
less than the magnitude allowed
`,
      "335544778": `Integer divide by zero.The code attempted to divide an integer value by
an integer divisor of zero
`,
      "335544779": `Integer overflow.The result of an integer operation caused the most
significant bit of the result to carry
`,
      "335544780": "An exception occurred that does not have a description.Exception number @1",
      "335544781": `Stack overflow.The resource requirements of the runtime stack have exceeded
the memory available to it
`,
      "335544782": "Segmentation Fault. The code attempted to access memory without privileges",
      "335544783": "Illegal Instruction. The Code attempted to perfrom an illegal operation",
      "335544784": "Bus Error. The Code caused a system bus error",
      "335544785": `Floating Point Error. The Code caused an Arithmetic Exception
or a floating point exception
`,
      "335544786": "Cannot delete rows from external files",
      "335544787": "Cannot update rows in external files",
      "335544788": `Unable to perform operation.You must be either SYSDBA or
owner of the database
`,
      "335544789": "Specified EXTRACT part does not exist in input datatype",
      "335544790": "Service @1 requires SYSDBA permissions. Reattach to the Service Manager using the SYSDBA account",
      "335544791": "The file @1 is currently in use by another process.Try again later",
      "335544792": "Cannot attach to services manager",
      "335544793": "Metadata update statement is not allowed by the current database SQL dialect @1",
      "335544794": "Operation was cancelled",
      "335544795": "Unexpected item in service parameter block, expected @1",
      "335544796": "Client SQL dialect @1 does not support reference to @2 datatype",
      "335544797": `User name and password are required while attaching to
the services manager
`,
      "335544798": `You created an indirect dependency on uncommitted metadata. You must
roll back the current transaction
`,
      "335544799": "The service name was not specified",
      "335544800": "Too many Contexts of Relation/Procedure/Views. Maximum allowed is 255",
      "335544801": "Data type not supported for arithmetic",
      "335544802": "Database dialect being changed from 3 to 1",
      "335544803": "Database dialect not changed",
      "335544804": "Unable to create database @1",
      "335544805": "Database dialect @1 is not a valid dialect",
      "335544806": "Valid database dialects are @1",
      "335544807": "SQL warning code = @1",
      "335544808": "DATE data type is now called TIMESTAMP",
      "335544809": `Function @1 is in @2, which is not in a permitted directory for
external functions
`,
      "335544810": "Value exceeds the range for valid dates",
      "335544811": "Passed client dialect @1 is not a valid dialect",
      "335544812": "Valid client dialects are @1",
      "335544813": "Unsupported field type specified in BETWEEN predicate",
      "335544814": `Services functionality will be supported in a later version
of the product
`,
      "335544815": "GENERATOR @1",
      "335544816": "UDF @1",
      "335544817": "Invalid parameter to FIRST.Only integers >= 0 are allowed",
      "335544818": "Invalid parameter to SKIP. Only integers >= 0 are allowed",
      "335544819": `File exceeded maximum size of 2GB. Add another database file or use
a 64 bit I/O version of Firebird
`,
      "335544820": "Unable to find savepoint with name @1 in transaction context",
      "335544821": "Invalid column position used in the @1 clause",
      "335544822": "Cannot use an aggregate function in a WHERE clause, use HAVING instead",
      "335544823": "Cannot use an aggregate function in a GROUP BY clause",
      "335544824": "Invalid expression in the @1 (not contained in either an aggregate function or the GROUP BY clause)",
      "335544825": "Invalid expression in the @1 (neither an aggregate function nor a part of the GROUP BY clause)",
      "335544826": "Nested aggregate functions are not allowed",
      "335544827": "Invalid argument in EXECUTE STATEMENT-cannot convert to string",
      "335544828": "Wrong request type in EXECUTE STATEMENT '@1'",
      "335544829": `Variable type (position @1) in EXECUTE STATEMENT '@2' INTO does not
match returned column type
`,
      "335544830": "Too many recursion levels of EXECUTE STATEMENT",
      "335544831": 'Access to @1 "@2" is denied by server administrator',
      "335544832": "Cannot change difference file name while database is in backup mode",
      "335544833": "Physical backup is not allowed while Write-Ahead Log is in use",
      "335544834": "Cursor is not open",
      "335544835": 'Target shutdown mode is invalid for database "@1"',
      "335544836": "Concatenation overflow. Resulting string cannot exceed 32K in length",
      "335544837": "Invalid offset parameter @1 to SUBSTRING. Only positive integers are allowed",
      "335544838": "Foreign key reference target does not exist",
      "335544839": "Foreign key references are present for the record",
      "335544840": "Cannot update",
      "335544841": "Cursor is already open",
      "335544842": "@1",
      "335544843": "Context variable @1 is not found in namespace @2",
      "335544844": "Invalid namespace name @1 passed to @2",
      "335544845": "Too many context variables",
      "335544846": "Invalid argument passed to @1",
      "335544847": "BLR syntax error. Identifier @1... is too long",
      "335544848": "Exception @1",
      "335544849": "Malformed string",
      "335544850": "Output parameter mismatch for procedure @1",
      "335544851": "Unexpected end of command- line @1, column @2",
      "335544852": "Partner index segment no @1 has incompatible data type",
      "335544853": "Invalid length parameter @1 to SUBSTRING. Negative integers are not allowed",
      "335544854": "CHARACTER SET @1 is not installed",
      "335544855": "COLLATION @1 for CHARACTER SET @2 is not installed",
      "335544856": "Connection shutdown",
      "335544857": "Maximum BLOB size exceeded",
      "335544858": "Can't have relation with only computed fields or constraints",
      "335544859": "Time precision exceeds allowed range (0-@1)",
      "335544860": "Unsupported conversion to target type BLOB (subtype @1)",
      "335544861": "Unsupported conversion to target type ARRAY",
      "335544862": "Stream does not support record locking",
      "335544863": `Cannot create foreign key constraint @1. Partner index does not
exist or is inactive
`,
      "335544864": `Transactions count exceeded. Perform backup and restore to make
database operable again
`,
      "335544865": "Column has been unexpectedly deleted",
      "335544866": "@1 cannot depend on @2",
      "335544867": "Blob sub_types bigger than 1 (text) are for internal use only",
      "335544868": `Procedure @1 is not selectable (it does not contain a SUSPEND
statement)
`,
      "335544869": "Datatype @1 is not supported for sorting operation",
      "335544870": "COLLATION @1",
      "335544871": "DOMAIN @1",
      "335544872": "Domain @1 is not defined",
      "335544873": "Array data type can use up to @1 dimensions",
      "335544874": "A multi database transaction cannot span more than @1 databases",
      "335544875": "Bad debug info format",
      "335544876": "Error while parsing procedure @1' s BLR",
      "335544877": "Index key too big",
      "335544878": "Concurrent transaction number is @1",
      "335544879": 'Validation error for variable @1, value "@2"',
      "335544880": 'Validation error for @1, value "@2"',
      "335544881": "Difference file name should be set explicitly for database on raw device",
      "335544882": "Login name too long (@1 characters, maximum allowed @2)",
      "335544883": "Column @1 is not defined in procedure @2",
      "335544884": "Invalid SIMILAR TO pattern",
      "335544885": "Invalid TEB format",
      "335544886": "Found more than one transaction isolation in TPB",
      "335544887": "Table reservation lock type @1 requires table name before in TPB",
      "335544888": "Found more than one @1 specification in TPB",
      "335544889": "Option @1 requires READ COMMITTED isolation in TPB",
      "335544890": "Option @1 is not valid if @2 was used previously in TPB",
      "335544891": "Table name length missing after table reservation @1 in TPB",
      "335544892": "Table name length @1 is too long after table reservation @2 in TPB",
      "335544893": "Table name length @1 without table name after table reservation @2 in TPB",
      "335544894": "Table name length @1 goes beyond the remaining TPB size after table reservation @2",
      "335544895": "Table name length is zero after table reservation @1 in TPB",
      "335544896": "Table or view @1 not defined in system tables after table reservation @2 in TPB",
      "335544897": "Base table or view @1 for view @2 not defined in system tables after table reservation @3 in TPB",
      "335544898": "Option length missing after option @1 in TPB",
      "335544899": "Option length @1 without value after option @2 in TPB",
      "335544900": "Option length @1 goes beyond the remaining TPB size after option @2",
      "335544901": "Option length is zero after table reservation @1 in TPB",
      "335544902": "Option length @1 exceeds the range for option @2 in TPB",
      "335544903": "Option value @1 is invalid for the option @2 in TPB",
      "335544904": "Preserving previous table reservation @1 for table @2, stronger than new @3 in TPB",
      "335544905": "Table reservation @1 for table @2 already specified and is stronger than new @3 in TPB",
      "335544906": "Table reservation reached maximum recursion of @1 when expanding views in TPB",
      "335544907": "Table reservation in TPB cannot be applied to @1 because it\u2019s a virtual table",
      "335544908": "Table reservation in TPB cannot be applied to @1 because it\u2019s a system table",
      "335544909": "Table reservation @1 or @2 in TPB cannot be applied to @3 because it\u2019s a temporary table",
      "335544910": "Cannot set the transaction in read only mode after a table reservation isc_tpb_lock_write in TPB",
      "335544911": "Cannot take a table reservation isc_tpb_lock_write in TPB because the transaction is in read only mode",
      "335544912": "value exceeds the range for a valid time",
      "335544913": "value exceeds the range for valid timestamps",
      "335544914": "string right truncation",
      "335544915": "blob truncation when converting to a string: length limit exceeded",
      "335544916": "numeric value is out of range",
      "335544917": "Firebird shutdown is still in progress after the specified timeout",
      "335544918": "Attachment handle is busy",
      "335544919": "Bad written UDF detected: pointer returned in FREE_IT function was not allocated by ib_util_malloc",
      "335544920": "External Data Source provider '@1' not found",
      "335544921": `Execute statement error at @1 :
@2Data source : @3`,
      "335544922": "Execute statement preprocess SQL error",
      "335544923": "Statement expected",
      "335544924": "Parameter name expected",
      "335544925": "Unclosed comment found near '@1'",
      "335544926": `Execute statement error at @1 :
@2Statement : @3
Data source : @4`,
      "335544927": "Input parameters mismatch",
      "335544928": "Output parameters mismatch",
      "335544929": "Input parameter '@1' have no value set",
      "335544930": "BLR stream length @1 exceeds implementation limit @2",
      "335544931": "Monitoring table space exhausted",
      "335544932": "module name or entrypoint could not be found",
      "335544933": "nothing to cancel",
      "335544934": "ib_util library has not been loaded to deallocate memory returned by FREE_IT function",
      "335544935": "Cannot have circular dependencies with computed fields",
      "335544936": "Security database error",
      "335544937": "Invalid data type in DATE/TIME/TIMESTAMP addition or subtraction in add_datettime()",
      "335544938": "Only a TIME value can be added to a DATE value",
      "335544939": "Only a DATE value can be added to a TIME value",
      "335544940": "TIMESTAMP values can be subtracted only from another TIMESTAMP value",
      "335544941": "Only one operand can be of type TIMESTAMP",
      "335544942": "Only HOUR, MINUTE, SECOND and MILLISECOND can be extracted from TIME values",
      "335544943": "HOUR, MINUTE, SECOND and MILLISECOND cannot be extracted from DATE values",
      "335544944": "Invalid argument for EXTRACT() not being of DATE/TIME/TIMESTAMP type",
      "335544945": "Arguments for @1 must be integral types or NUMERIC/DECIMAL without scale",
      "335544946": "First argument for @1 must be integral type or floating point type",
      "335544947": "Human readable UUID argument for @1 must be of string type",
      "335544948": "Human readable UUID argument for @2 must be of exact length @1",
      "335544949": 'Human readable UUID argument for @3 must have "-" at position @2 instead of "@1"',
      "335544950": 'Human readable UUID argument for @3 must have hex digit at position @2 instead of "@1"',
      "335544951": "Only HOUR, MINUTE, SECOND and MILLISECOND can be added to TIME values in @1",
      "335544952": "Invalid data type in addition of part to DATE/TIME/TIMESTAMP in @1",
      "335544953": "Invalid part @1 to be added to a DATE/TIME/TIMESTAMP value in @2",
      "335544954": "Expected DATE/TIME/TIMESTAMP type in evlDateAdd() result",
      "335544955": "Expected DATE/TIME/TIMESTAMP type as first and second argument to @1",
      "335544956": "The result of TIME-<value> in @1 cannot be expressed in YEAR, MONTH, DAY or WEEK",
      "335544957": "The result of TIME-TIMESTAMP or TIMESTAMP-TIME in @1 cannot be expressed in HOUR, MINUTE, SECOND or MILLISECOND",
      "335544958": "The result of DATE-TIME or TIME-DATE in @1 cannot be expressed in HOUR, MINUTE, SECOND and MILLISECOND",
      "335544959": "Invalid part @1 to express the difference between two DATE/TIME/TIMESTAMP values in @2",
      "335544960": "Argument for @1 must be positive",
      "335544961": "Base for @1 must be positive",
      "335544962": "Argument #@1 for @2 must be zero or positive",
      "335544963": "Argument #@1 for @2 must be positive",
      "335544964": "Base for @1 cannot be zero if exponent is negative",
      "335544965": "Base for @1 cannot be negative if exponent is not an integral value",
      "335544966": "The numeric scale must be between -128 and 127 in @1",
      "335544967": "Argument for @1 must be zero or positive",
      "335544968": "Binary UUID argument for @1 must be of string type",
      "335544969": "Binary UUID argument for @2 must use @1 bytes",
      "335544970": "Missing required item @1 in service parameter block",
      "335544971": "@1 server is shutdown",
      "335544972": "Invalid connection string",
      "335544973": "Unrecognized events block",
      "335544974": "Could not start first worker thread - shutdown server",
      "335544975": "Timeout occurred while waiting for a secondary connection for event processing",
      "335544976": "Argument for @1 must be different than zero",
      "335544977": "Argument for @1 must be in the range [-1, 1]",
      "335544978": "Argument for @1 must be greater or equal than one",
      "335544979": "Argument for @1 must be in the range ]-1, 1[",
      "335544980": "Incorrect parameters provided to internal function @1",
      "335544981": "Floating point overflow in built-in function @1",
      "335544982": "Floating point overflow in result from UDF @1",
      "335544983": "Invalid floating point value returned by UDF @1",
      "335544984": "Database is probably already opened by another engine instance in another Windows session",
      "335544985": "No free space found in temporary directories",
      "335544986": "Explicit transaction control is not allowed",
      "335544987": "Use of TRUSTED switches in spb_command_line is prohibited",
      "335544988": "PACKAGE @1",
      "335544989": "Cannot make field @1 of table @2 NOT NULL because there are NULLs present",
      "335544990": "Feature @1 is not supported anymore",
      "335544991": "VIEW @1",
      "335544992": "Can not access lock files directory @1",
      "335544993": "Fetch option @1 is invalid for a non-scrollable cursor",
      "335544994": "Error while parsing function @1\u2019s BLR",
      "335544995": "Cannot execute function @1 of the unimplemented package @2",
      "335544996": "Cannot execute procedure @1 of the unimplemented package @2",
      "335544997": "External function @1 not returned by the external engine plugin @2",
      "335544998": "External procedure @1 not returned by the external engine plugin @2",
      "335544999": "External trigger @1 not returned by the external engine plugin @2",
      "335545000": "Incompatible plugin version @1 for external engine @2",
      "335545001": "External engine @1 not found",
      "335545002": "Attachment is in use",
      "335545003": "Transaction is in use",
      "335545004": "Error loading plugin @1",
      "335545005": "Loadable module @1 not found",
      "335545006": "Standard plugin entrypoint does not exist in module @1",
      "335545007": "Module @1 exists but can not be loaded",
      "335545008": "Module @1 does not contain plugin @2 type @3",
      "335545009": "Invalid usage of context namespace DDL_TRIGGER",
      "335545010": "Value is NULL but isNull parameter was not informed",
      "335545011": "Type @1 is incompatible with BLOB",
      "335545012": "Invalid date",
      "335545013": "Invalid time",
      "335545014": "Invalid timestamp",
      "335545015": "Invalid index @1 in function @2",
      "335545016": "@1",
      "335545017": "Asynchronous call is already running for this attachment",
      "335545018": "Function @1 is private to package @2",
      "335545019": "Procedure @1 is private to package @2",
      "335545020": "Request can\u2019t access new records in relation @1 and should be recompiled",
      "335545021": "invalid events id (handle)",
      "335545022": "Cannot copy statement @1",
      "335545023": "Invalid usage of boolean expression",
      "335545024": "Arguments for @1 cannot both be zero",
      "335545025": "missing service ID in spb",
      "335545026": "External BLR message mismatch: invalid null descriptor at field @1",
      "335545027": "External BLR message mismatch: length = @1, expected @2",
      "335545028": "Subscript @1 out of bounds [@2, @3]",
      "335545029": "Install incomplete. To complete security database initialization please CREATE USER. For details read doc/README.security_database.txt.",
      "335545030": "@1 operation is not allowed for system table @2",
      "335545031": "Libtommath error code @1 in function @2",
      "335545032": "unsupported BLR version (expected between @1 and @2, encountered @3)",
      "335545033": "expected length @1, actual @2",
      "335545034": "Wrong info requested in isc_svc_query() for anonymous service",
      "335545035": "No isc_info_svc_stdin in user request, but service thread requested stdin data",
      "335545036": "Start request for anonymous service is impossible",
      "335545037": "All services except for getting server log require switches",
      "335545038": "Size of stdin data is more than was requested from client",
      "335545039": "Crypt plugin @1 failed to load",
      "335545040": "Length of crypt plugin name should not exceed @1 bytes",
      "335545041": "Crypt failed - already crypting database",
      "335545042": "Crypt failed - database is already in requested state",
      "335545043": "Missing crypt plugin, but page appears encrypted",
      "335545044": "No providers loaded",
      "335545045": "NULL data with non-zero SPB length",
      "335545046": "Maximum (@1) number of arguments exceeded for function @2",
      "335545047": "External BLR message mismatch: names count = @1, blr count = @2",
      "335545048": "External BLR message mismatch: name @1 not found",
      "335545049": "Invalid resultset interface",
      "335545050": "Message length passed from user application does not match set of columns",
      "335545051": "Resultset is missing output format information",
      "335545052": "Message metadata not ready - item @1 is not finished",
      "335545053": "Missing configuration file: @1",
      "335545054": "@1: illegal line <@2>",
      "335545055": "Invalid include operator in @1 for <@2>",
      "335545056": "Include depth too big",
      "335545057": "File to include not found",
      "335545058": "Only the owner can change the ownership",
      "335545059": "undefined variable number",
      "335545060": "Missing security context for @1",
      "335545061": "Missing segment @1 in multisegment connect block parameter",
      "335545062": "Different logins in connect and attach packets - client library error",
      "335545063": "Exceeded exchange limit during authentication handshake",
      "335545064": "Incompatible wire encryption levels requested on client and server",
      "335545065": "Client attempted to attach unencrypted but wire encryption is required",
      "335545066": "Client attempted to start wire encryption using unknown key @1",
      "335545067": "Client attempted to start wire encryption using unsupported plugin @1",
      "335545068": "Error getting security database name from configuration file",
      "335545069": "Client authentication plugin is missing required data from server",
      "335545070": "Client authentication plugin expected @2 bytes of @3 from server, got @1",
      "335545071": "Attempt to get information about an unprepared dynamic SQL statement.",
      "335545072": "Problematic key value is @1",
      "335545073": "Cannot select virtual table @1 for update WITH LOCK",
      "335545074": "Cannot select system table @1 for update WITH LOCK",
      "335545075": "Cannot select temporary table @1 for update WITH LOCK",
      "335545076": "System @1 @2 cannot be modified",
      "335545077": "Server misconfigured - contact administrator please",
      "335545078": "Deprecated backward compatibility ALTER ROLE \u2026\u200B SET/DROP AUTO ADMIN mapping may be used only for RDB$ADMIN role",
      "335545079": "Mapping @1 already exists",
      "335545080": "Mapping @1 does not exist",
      "335545081": "@1 failed when loading mapping cache",
      "335545082": "Invalid name <*> in authentication block",
      "335545083": "Multiple maps found for @1",
      "335545084": "Undefined mapping result - more than one different results found",
      "335545085": "Incompatible mode of attachment to damaged database",
      "335545086": "Attempt to set in database number of buffers which is out of acceptable range [@1:@2]",
      "335545087": "Attempt to temporarily set number of buffers less than @1",
      "335545088": "Global mapping is not available when database @1 is not present",
      "335545089": "Global mapping is not available when table RDB$MAP is not present in database @1",
      "335545090": "Your attachment has no trusted role",
      "335545091": "Role @1 is invalid or unavailable",
      "335545092": "Cursor @1 is not positioned in a valid record",
      "335545093": "Duplicated user attribute @1",
      "335545094": "There is no privilege for this operation",
      "335545095": "Using GRANT OPTION on @1 not allowed",
      "335545096": "read conflicts with concurrent update",
      "335545097": "@1 failed when working with CREATE DATABASE grants",
      "335545098": "CREATE DATABASE grants check is not possible when database @1 is not present",
      "335545099": "CREATE DATABASE grants check is not possible when table RDB$DB_CREATORS is not present in database @1",
      "335545100": "Interface @3 version too old: expected @1, found @2",
      "335545101": "Input parameter mismatch for function @1",
      "335545102": "Error during savepoint backout - transaction invalidated",
      "335545103": "Domain used in the PRIMARY KEY constraint of table @1 must be NOT NULL",
      "335545104": "CHARACTER SET @1 cannot be used as a attachment character set",
      "335545105": "Some database(s) were shutdown when trying to read mapping data",
      "335545106": "Error occurred during login, please check server firebird.log for details",
      "335545107": "Database already opened with engine instance, incompatible with current",
      "335545108": "Invalid crypt key @1",
      "335545109": "Page requires encryption but crypt plugin is missing",
      "335545110": "Maximum index depth (@1 levels) is reached",
      "335545111": "System privilege @1 does not exist",
      "335545112": "System privilege @1 is missing",
      "335545113": "Invalid or missing checksum of encrypted database",
      "335545114": "You must have SYSDBA rights at this server",
      "335545115": "Cannot open cursor for non-SELECT statement",
      "335545116": "If <window frame bound 1> specifies @1, then <window frame bound 2> shall not specify @2",
      "335545117": "RANGE based window with <expr> {PRECEDING | FOLLOWING} cannot have ORDER BY with more than one value",
      "335545118": "RANGE based window must have an ORDER BY key of numerical, date, time or timestamp types",
      "335545119": "Window RANGE/ROWS PRECEDING/FOLLOWING value must be of a numerical type",
      "335545120": "Invalid PRECEDING or FOLLOWING offset in window function: cannot be negative",
      "335545121": "Window @1 not found",
      "335545122": "Cannot use PARTITION BY clause while overriding the window @1",
      "335545123": "Cannot use ORDER BY clause while overriding the window @1 which already has an ORDER BY clause",
      "335545124": "Cannot override the window @1 because it has a frame clause. Tip: it can be used without parenthesis in OVER",
      "335545125": "Duplicate window definition for @1",
      "335545126": "SQL statement is too long. Maximum size is @1 bytes.",
      "335545127": "Config level timeout expired.",
      "335545128": "Attachment level timeout expired.",
      "335545129": "Statement level timeout expired.",
      "335545130": "Killed by database administrator.",
      "335545131": "Idle timeout expired.",
      "335545132": "Database is shutdown.",
      "335545133": "Engine is shutdown.",
      "335545134": "OVERRIDING clause can be used only when an identity column is present in the INSERT\u2019s field list for table/view @1",
      "335545135": "OVERRIDING SYSTEM VALUE can be used only for identity column defined as 'GENERATED ALWAYS' in INSERT for table/view @1",
      "335545136": "OVERRIDING USER VALUE can be used only for identity column defined as 'GENERATED BY DEFAULT' in INSERT for table/view @1",
      "335545137": "OVERRIDING SYSTEM VALUE should be used to override the value of an identity column defined as 'GENERATED ALWAYS' in table/view @1",
      "335545138": "DecFloat precision must be 16 or 34",
      "335545139": "Decimal float divide by zero.  The code attempted to divide a DECFLOAT value by zero.",
      "335545140": "Decimal float inexact result.  The result of an operation cannot be represented as a decimal fraction.",
      "335545141": "Decimal float invalid operation.  An indeterminant error occurred during an operation.",
      "335545142": "Decimal float overflow.  The exponent of a result is greater than the magnitude allowed.",
      "335545143": "Decimal float underflow.  The exponent of a result is less than the magnitude allowed.",
      "335545144": "Sub-function @1 has not been defined",
      "335545145": "Sub-procedure @1 has not been defined",
      "335545146": "Sub-function @1 has a signature mismatch with its forward declaration",
      "335545147": "Sub-procedure @1 has a signature mismatch with its forward declaration",
      "335545148": "Default values for parameters are not allowed in definition of the previously declared sub-function @1",
      "335545149": "Default values for parameters are not allowed in definition of the previously declared sub-procedure @1",
      "335545150": "Sub-function @1 was declared but not implemented",
      "335545151": "Sub-procedure @1 was declared but not implemented",
      "335545152": "Invalid HASH algorithm @1",
      "335545153": 'Expression evaluation error for index "@1" on table "@2"',
      "335545154": "Invalid decfloat trap state @1",
      "335545155": "Invalid decfloat rounding mode @1",
      "335545156": "Invalid part @1 to calculate the @1 of a DATE/TIMESTAMP",
      "335545157": "Expected DATE/TIMESTAMP value in @1",
      "335545158": "Precision must be from @1 to @2",
      "335545159": "invalid batch handle",
      "335545160": "Bad international character in tag @1",
      "335545161": "Null data in parameters block with non-zero length",
      "335545162": "Items working with running service and getting generic server information should not be mixed in single info block",
      "335545163": "Unknown information item, code @1",
      "335545164": "Wrong version of blob parameters block @1, should be @2",
      "335545165": "User management plugin is missing or failed to load",
      "335545166": "Missing entrypoint @1 in ICU library",
      "335545167": "Could not find acceptable ICU library",
      "335545168": "Name @1 not found in system MetadataBuilder",
      "335545169": "Parse to tokens error",
      "335545170": "Error opening international conversion descriptor from @1 to @2",
      "335545171": "Message @1 is out of range, only @2 messages in batch",
      "335545172": "Detailed error info for message @1 is missing in batch",
      "335545173": "Compression stream init error @1",
      "335545174": "Decompression stream init error @1",
      "335545175": "Segment size (@1) should not exceed 65535 (64K - 1) when using segmented blob",
      "335545176": "Invalid blob policy in the batch for @1() call",
      "335545177": "Can\u2019t change default BPB after adding any data to batch",
      "335545178": "Unexpected info buffer structure querying for default blob alignment",
      "335545179": "Duplicated segment @1 in multisegment connect block parameter",
      "335545180": "Plugin not supported by network protocol",
      "335545181": "Error parsing message format",
      "335545182": "Wrong version of batch parameters block @1, should be @2",
      "335545183": "Message size (@1) in batch exceeds internal buffer size (@2)",
      "335545184": "Batch already opened for this statement",
      "335545185": "Invalid type of statement used in batch",
      "335545186": "Statement used in batch must have parameters",
      "335545187": "There are no blobs in associated with batch statement",
      "335545188": "appendBlobData() is used to append data to last blob but no such blob was added to the batch",
      "335545189": "Portions of data, passed as blob stream, should have size multiple to the alignment required for blobs",
      "335545190": "Repeated blob id @1 in registerBlob()",
      "335545191": "Blob buffer format error",
      "335545192": "Unusable (too small) data remained in @1 buffer",
      "335545193": "Blob continuation should not contain BPB",
      "335545194": "Size of BPB (@1) greater than remaining data (@2)",
      "335545195": "Size of segment (@1) greater than current BLOB data (@2)",
      "335545196": "Size of segment (@1) greater than available data (@2)",
      "335545197": "Unknown blob ID @1 in the batch message",
      "335545198": "Internal buffer overflow - batch too big",
      "335545199": "Numeric literal too long",
      "335545200": "Error using events in mapping shared memory: @1",
      "335545201": "Global mapping memory overflow",
      "335545202": "Header page overflow - too many clumplets on it",
      "335545203": "No matching client/server authentication plugins configured for execute statement in embedded datasource",
      "335545204": "Missing database encryption key for your attachment",
      "335545205": "Key holder plugin @1 failed to load",
      "335545206": "Cannot reset user session",
      "335545207": "There are open transactions (@1 active)",
      "335545208": "Session was reset with warning(s)",
      "335545209": "Transaction is rolled back due to session reset, all changes are lost",
      "335545210": "Plugin @1:",
      "335545211": "PARAMETER @1",
      "335545212": "Starting page number for file @1 must be @2 or greater",
      "335545213": "Invalid time zone offset: @1 - must use format +/-hours:minutes and be between -14:00 and +14:00",
      "335545214": "Invalid time zone region: @1",
      "335545215": "Invalid time zone ID: @1",
      "335545216": "Wrong base64 text length @1, should be multiple of 4",
      "335545217": "Invalid first parameter datatype - need string or blob",
      "335545218": "Error registering @1 - probably bad tomcrypt library",
      "335545219": "Unknown crypt algorithm @1 in USING clause",
      "335545220": "Should specify mode parameter for symmetric cipher",
      "335545221": "Unknown symmetric crypt mode specified",
      "335545222": "Mode parameter makes no sense for chosen cipher",
      "335545223": "Should specify initialization vector (IV) for chosen cipher and/or mode",
      "335545224": "Initialization vector (IV) makes no sense for chosen cipher and/or mode",
      "335545225": "Invalid counter endianess @1",
      "335545226": "Counter endianess parameter is not used in mode @1",
      "335545227": "Too big counter value @1, maximum @2 can be used",
      "335545228": "Counter length/value parameter is not used with @1 @2",
      "335545229": "Invalid initialization vector (IV) length @1, need @2",
      "335545230": "TomCrypt library error: @1",
      "335545231": "Starting PRNG yarrow",
      "335545232": "Setting up PRNG yarrow",
      "335545233": "Initializing @1 mode",
      "335545234": "Encrypting in @1 mode",
      "335545235": "Decrypting in @1 mode",
      "335545236": "Initializing cipher @1",
      "335545237": "Encrypting using cipher @1",
      "335545238": "Decrypting using cipher @1",
      "335545239": "Setting initialization vector (IV) for @1",
      "335545240": "Invalid initialization vector (IV) length @1, need  8 or 12",
      "335545241": "Encoding @1",
      "335545242": "Decoding @1",
      "335545243": "Importing RSA key",
      "335545244": "Invalid OAEP packet",
      "335545245": "Unknown hash algorithm @1",
      "335545246": "Making RSA key",
      "335545247": "Exporting @1 RSA key",
      "335545248": "RSA-signing data",
      "335545249": "Verifying RSA-signed data",
      "335545250": "Invalid key length @1, need 16 or 32",
      "335545251": "invalid replicator handle",
      "335545252": "Transaction\u2019s base snapshot number does not exist",
      "335545253": "Input parameter '@1' is not used in SQL query text",
      "335545254": "Effective user is @1",
      "335545255": "Invalid time zone bind mode @1",
      "335545256": "Invalid decfloat bind mode @1",
      "335545257": "Invalid hex text length @1, should be multiple of 2",
      "335545258": "Invalid hex digit @1 at position @2",
      "335545259": 'Error processing isc_dpb_set_bind clumplet "@1"',
      "335545260": "The following statement failed: @1",
      "335545261": "Can not convert @1 to @2",
      "335545262": "cannot update old BLOB",
      "335545263": "cannot read from new BLOB",
      "335545264": "No permission for CREATE @1 operation",
      "335545265": "SUSPEND could not be used without RETURNS clause in PROCEDURE or EXECUTE BLOCK",
      "335545266": "String truncated warning due to the following reason",
      "335545267": "Monitoring data does not fit into the field",
      "335545268": "Engine data does not fit into return value of system function",
      "335545269": "Multiple source records cannot match the same target during MERGE",
      "335545270": "RDB$PAGES written by non-system transaction, DB appears to be damaged",
      "335545271": "Replication error",
      "335545272": "Reset of user session failed. Connection is shut down.",
      "335545273": "File size is less than expected",
      "335545274": "Invalid key length @1, need >@2",
      "335740929": "Database file name (@1) already given",
      "335740930": "Invalid switch @1",
      "335740932": "Incompatible switch combination",
      "335740933": "Replay log pathname required",
      "335740934": "Number of page buffers for cache required",
      "335740935": "Numeric value required",
      "335740936": "Positive numeric value required",
      "335740937": "Number of transactions per sweep required",
      "335740940": '"full" or "reserve" required',
      "335740941": "User name required",
      "335740942": "Password required",
      "335740943": "Subsystem name",
      "335740945": "Number of seconds required",
      "335740946": "Numeric value between 0 and 32767 inclusive required",
      "335740947": "Must specify type of shutdown",
      "335740948": "Please retry, specifying an option",
      "335740951": "Please retry, giving a database name",
      "335740991": "Internal block exceeds maximum size",
      "335740992": "Corrupt pool",
      "335740993": "Virtual memory exhausted",
      "335740994": "Bad pool id.",
      "335740995": "Transaction state @1 not in valid range",
      "335741012": "Unexpected end of input",
      "335741018": "Failed to reconnect to a transaction in database @1",
      "335741036": "Transaction description item unknown",
      "335741038": '"read_only" or "read_write" required',
      "335741039": "-sql_dialect | set database dialect n",
      "335741042": "Positive or zero numeric value required",
      "336003074": "Cannot SELECT RDB$DB_KEY from a stored procedure",
      "336003075": `Precision 10 to 18 changed from DOUBLE PRECISION in SQL
dialect 1 to 64-bit scaled integer in SQL dialect 3
`,
      "336003076": "Use of @1 expression that returns different results in dialect 1 and dialect 3",
      "336003077": "Database SQL dialect @1 does not support reference to @2 datatype",
      "336003079": "DB dialect @1 and client dialect @2 conflict with respect to numeric precision @3",
      "336003080": "WARNING: Numeric literal @1 is interpreted as a floating-point",
      "336003081": "value in SQL dialect 1, but as an exact numeric value in SQL dialect 3.",
      "336003082": "WARNING: NUMERIC and DECIMAL fields with precision 10 or greater are stored",
      "336003083": "as approximate floating-point values in SQL dialect 1, but as 64-bit",
      "336003084": "integers in SQL dialect 3.",
      "336003085": "Ambiguous field name between @1 and @2",
      "336003086": "External function should have return position between 1 and @1",
      "336003087": "Label @1 @2 in the current scope",
      "336003088": "Datatypes @1are not comparable in expression @2",
      "336003089": "Empty cursor name is not allowed",
      "336003090": "Statement already has a cursor @1 assigned",
      "336003091": "Cursor @1 is not found in the current context",
      "336003092": "Cursor @1 already exists in the current context",
      "336003093": "Relation @1 is ambiguous in cursor @2",
      "336003094": "Relation @1 is not found in cursor @2",
      "336003095": "Cursor is not open",
      "336003096": "Data type @1 is not supported for EXTERNAL TABLES. Relation '@2', field '@3'",
      "336003097": "Feature not supported on ODS version older than @1.@2",
      "336003098": "Primary key required on table @1",
      "336003099": "UPDATE OR INSERT field list does not match primary key of table @1",
      "336003100": "UPDATE OR INSERT field list does not match MATCHING clause",
      "336003101": "UPDATE OR INSERT without MATCHING could not be used with views based on more than one table",
      "336003102": "Incompatible trigger type",
      "336003103": "Database trigger type can't be changed",
      "336003104": "To be used with RDB$RECORD_VERSION, @1 must be a table or a view of single table",
      "336003105": "SQLDA version expected between @1 and @2, found @3",
      "336003106": "at SQLVAR index @1",
      "336003107": "empty pointer to NULL indicator variable",
      "336003108": "empty pointer to data",
      "336003109": "No SQLDA for input values provided",
      "336003110": "No SQLDA for output values provided",
      "336003111": "Wrong number of parameters (expected @1, got @2)",
      "336003112": "Invalid DROP SQL SECURITY clause",
      "336003113": "UPDATE OR INSERT value for field @1, part of the implicit or explicit MATCHING clause, cannot be DEFAULT",
      "336068645": "BLOB Filter @1 not found",
      "336068649": "Function @1 not found",
      "336068656": "Index not found",
      "336068662": "View @1 not found",
      "336068697": "Domain not found",
      "336068717": "Triggers created automatically cannot be modified",
      "336068740": "Table @1 already exists",
      "336068748": "Procedure @1 not found",
      "336068752": "Exception not found",
      "336068754": "Parameter @1 in procedure @2 not found",
      "336068755": "Trigger @1 not found",
      "336068759": "Character set @1 not found",
      "336068760": "Collation @1 not found",
      "336068763": "Role @1 not found",
      "336068767": "Name longer than database column size",
      "336068784": "column @1 does not exist in table/view @2",
      "336068796": "SQL role @1 does not exist",
      "336068797": "User @1 has no grant admin option on SQL role @2",
      "336068798": "User @1 is not a member of SQL role @2",
      "336068799": "@1 is not the owner of SQL role @2",
      "336068800": "@1 is a SQL role and not a user",
      "336068801": "User name @1 could not be used for SQL role",
      "336068802": "SQL role @1 already exists",
      "336068803": "Keyword @1 can not be used as a SQL role name",
      "336068804": "SQL roles are not supported in on older versions of the database. A backup and restore of the database is required",
      "336068812": "Cannot rename domain @1 to @2. A domain with that name already exists",
      "336068813": "Cannot rename column @1 to @2.A column with that name already exists in table @3",
      "336068814": "Column @1 from table @2 is referenced in @3",
      "336068815": "Cannot change datatype for column @1.Changing datatype is not supported for BLOB or ARRAY columns",
      "336068816": "New size specified for column @1 must be at least @2 characters",
      "336068817": "Cannot change datatype for @1.Conversion from base type @2 to @3 is not supported",
      "336068818": "Cannot change datatype for column @1 from a character type to a non-character type",
      "336068820": "Zero length identifiers are not allowed",
      "336068822": "Sequence @1 not found",
      "336068829": "Maximum number of collations per character set exceeded",
      "336068830": "Invalid collation attributes",
      "336068840": "@1 cannot reference @2",
      "336068843": "Collation @1 is used in table @2 (field name @3) and cannot be dropped",
      "336068844": "Collation @1 is used in domain @2 and cannot be dropped",
      "336068845": "Cannot delete system collation",
      "336068846": "Cannot delete default collation of CHARACTER SET @1",
      "336068849": "Table @1 not found",
      "336068851": "Collation @1 is used in procedure @2 (parameter name @3) and cannot be dropped",
      "336068852": "New scale specified for column @1 must be at most @2",
      "336068853": "New precision specified for column @1 must be at least @2",
      "336068855": "Warning: @1 on @2 is not granted to @3.",
      "336068856": "Feature '@1' is not supported in ODS @2.@3",
      "336068857": "Cannot add or remove COMPUTED from column @1",
      "336068858": "Password should not be empty string",
      "336068859": "Index @1 already exists",
      "336068864": "Package @1 not found",
      "336068865": "Schema @1 not found",
      "336068866": "Cannot ALTER or DROP system procedure @1",
      "336068867": "Cannot ALTER or DROP system trigger @1",
      "336068868": "Cannot ALTER or DROP system function @1",
      "336068869": "Invalid DDL statement for procedure @1",
      "336068870": "Invalid DDL statement for trigger @1",
      "336068871": "Function @1 has not been defined on the package body @2",
      "336068872": "Procedure @1 has not been defined on the package body @2",
      "336068873": "Function @1 has a signature mismatch on package body @2",
      "336068874": "Procedure @1 has a signature mismatch on package body @2",
      "336068875": "Default values for parameters are not allowed in the definition of a previously declared packaged procedure @1.@2",
      "336068877": "Package body @1 already exists",
      "336068878": "Invalid DDL statement for function @1",
      "336068879": "Cannot alter new style function @1 with ALTER EXTERNAL FUNCTION. Use ALTER FUNCTION instead.",
      "336068886": "Parameter @1 in function @2 not found",
      "336068887": "Parameter @1 of routine @2 not found",
      "336068888": "Parameter @1 of routine @2 is ambiguous (found in both procedures and functions). Use a specifier keyword.",
      "336068889": "Collation @1 is used in function @2 (parameter name @3) and cannot be dropped",
      "336068890": "Domain @1 is used in function @2 (parameter name @3) and cannot be dropped",
      "336068891": "ALTER USER requires at least one clause to be specified",
      "336068894": "Duplicate @1 @2",
      "336068895": "System @1 @2 cannot be modified",
      "336068896": "INCREMENT BY 0 is an illegal option for sequence @1",
      "336068897": "Can\u2019t use @1 in FOREIGN KEY constraint",
      "336068898": "Default values for parameters are not allowed in the definition of a previously declared packaged function @1.@2",
      "336068900": "role @1 can not be granted to role @2",
      "336068904": "INCREMENT BY 0 is an illegal option for identity column @1 of table @2",
      "336068907": "no @1 privilege with grant option on DDL @2",
      "336068908": "no @1 privilege with grant option on object @2",
      "336068909": "Function @1 does not exist",
      "336068910": "Procedure @1 does not exist",
      "336068911": "Package @1 does not exist",
      "336068912": "Trigger @1 does not exist",
      "336068913": "View @1 does not exist",
      "336068914": "Table @1 does not exist",
      "336068915": "Exception @1 does not exist",
      "336068916": "Generator/Sequence @1 does not exist",
      "336068917": "Field @1 of table @2 does not exist",
      "336330753": "Found unknown switch",
      "336330754": "Page size parameter missing",
      "336330755": "Page size specified (@1) greater than limit (16384 bytes)",
      "336330756": "Redirect location for output is not specified",
      "336330757": "Conflicting switches for backup/restore",
      "336330758": "Device type @1 not known",
      "336330759": "Protection is not there yet",
      "336330760": "Page size is allowed only on restore or create",
      "336330761": "Multiple sources or destinations specified",
      "336330762": "Requires both input and output filenames",
      "336330763": "Input and output have the same name. Disallowed",
      "336330764": 'Expected page size, encountered "@1"',
      "336330765": "REPLACE specified, but the first file @1 is a database",
      "336330766": "Database @1 already exists.To replace it, use the -REP switch",
      "336330767": "Device type not specified",
      "336330772": "Gds_$blob_info failed",
      "336330773": "Do not understand BLOB INFO item @1",
      "336330774": "Gds_$get_segment failed",
      "336330775": "Gds_$close_blob failed",
      "336330776": "Gds_$open_blob failed",
      "336330777": "Failed in put_blr_gen_id",
      "336330778": "Data type @1 not understood",
      "336330779": "Gds_$compile_request failed",
      "336330780": "Gds_$start_request failed",
      "336330781": "gds_$receive failed",
      "336330782": "Gds_$release_request failed",
      "336330783": "gds_$database_info failed",
      "336330784": "Expected database description record",
      "336330785": "Failed to create database @1",
      "336330786": "RESTORE: decompression length error",
      "336330787": "Cannot find table @1",
      "336330788": "Cannot find column for BLOB",
      "336330789": "Gds_$create_blob failed",
      "336330790": "Gds_$put_segment failed",
      "336330791": "Expected record length",
      "336330792": "Wrong length record, expected @1 encountered @2",
      "336330793": "Expected data attribute",
      "336330794": "Failed in store_blr_gen_id",
      "336330795": "Do not recognize record type @1",
      "336330796": "Expected backup version 1..8. Found @1",
      "336330797": "Expected backup description record",
      "336330798": "String truncated",
      "336330799": "warning -- record could not be restored",
      "336330800": "Gds_$send failed",
      "336330801": "No table name for data",
      "336330802": "Unexpected end of file on backup file",
      "336330803": "Database format @1 is too old to restore to",
      "336330804": "Array dimension for column @1 is invalid",
      "336330807": "Expected XDR record length",
      "336330817": "Cannot open backup file @1",
      "336330818": "Cannot open status and error output file @1",
      "336330934": "Blocking factor parameter missing",
      "336330935": 'Expected blocking factor, encountered "@1"',
      "336330936": "A blocking factor may not be used in conjunction with device CT",
      "336330940": "User name parameter missing",
      "336330941": "Password parameter missing",
      "336330952": "missing parameter for the number of bytes to be skipped",
      "336330953": 'Expected number of bytes to be skipped, encountered "@1"',
      "336330965": "Character set",
      "336330967": "Collation",
      "336330972": "Unexpected I/O error while reading from backup file",
      "336330973": "Unexpected I/O error while writing to backup file",
      "336330985": "Could not drop database @1 (database might be in use)",
      "336330990": "System memory exhausted",
      "336331002": "SQL role",
      "336331005": "SQL role parameter missing",
      "336331010": "Page buffers parameter missing",
      "336331011": 'Expected page buffers, encountered "@1"',
      "336331012": "Page buffers is allowed only on restore or create",
      "336331014": "Size specification either missing or incorrect for file @1",
      "336331015": "File @1 out of sequence",
      "336331016": "Can't join - one of the files missing",
      "336331017": "standard input is not supported when using join operation",
      "336331018": "Standard output is not supported when using split operation",
      "336331019": "Backup file @1 might be corrupt",
      "336331020": "Database file specification missing",
      "336331021": "Can't write a header record to file @1",
      "336331022": "Free disk space exhausted",
      "336331023": "File size given (@1) is less than minimum allowed (@2)",
      "336331025": "Service name parameter missing",
      "336331026": "Cannot restore over current database, must be SYSDBA or owner of the existing database",
      "336331031": '"read_only" or "read_write" required',
      "336331033": "Just data ignore all constraints etc.",
      "336331034": "Restoring data only ignoring foreign key, unique, not null & other constraints",
      "336397205": "ODS versions before ODS@1 are not supported",
      "336397206": "Table @1 does not exist",
      "336397207": "View @1 does not exist",
      "336397208": "At line @1, column @2",
      "336397209": "At unknown line and column",
      "336397210": "Column @1 cannot be repeated in @2 statement",
      "336397211": "Too many values ( more than @1) in member list to match against",
      "336397212": "Array and BLOB data types not allowed in computed field",
      "336397213": "Implicit domain name @1 not allowed in user created domain",
      "336397214": "Scalar operator used on field @1 which is not an array",
      "336397215": "Cannot sort on more than 255 items",
      "336397216": "Cannot group on more than 255 items",
      "336397217": "Cannot include the same field (@1.@2) twice in the ORDER BY clause with conflicting sorting options",
      "336397218": "Column list from derived table @1 has more columns than the number of items in its SELECT statement",
      "336397219": "Column list from derived table @1 has less columns than the number of items in its SELECT statement",
      "336397220": "No column name specified for column number @1 in derived table @2",
      "336397221": "Column @1 was specified multiple times for derived table @2",
      "336397222": "Internal dsql error: alias type expected by pass1_expand_select_node",
      "336397223": "Internal dsql error: alias type expected by pass1_field",
      "336397224": "Internal dsql error: column position out of range in pass1_union_auto_cast",
      "336397225": "Recursive CTE member (@1) can refer itself only in FROM clause",
      "336397226": "CTE '@1' has cyclic dependencies",
      "336397227": "Recursive member of CTE can't be member of an outer join",
      "336397228": "Recursive member of CTE can't reference itself more than once",
      "336397229": "Recursive CTE (@1) must be an UNION",
      "336397230": "CTE '@1' defined non-recursive member after recursive",
      "336397231": "Recursive member of CTE '@1' has @2 clause",
      "336397232": "Recursive members of CTE (@1) must be linked with another members via UNION ALL",
      "336397233": "Non-recursive member is missing in CTE '@1'",
      "336397234": "WITH clause can't be nested",
      "336397235": "Column @1 appears more than once in USING clause",
      "336397236": "Feature is not supported in dialect @1",
      "336397237": 'CTE "@1" is not used in query',
      "336397238": "column @1 appears more than once in ALTER VIEW",
      "336397239": "@1 is not supported inside IN AUTONOMOUS TRANSACTION block",
      "336397240": "Unknown node type @1 in dsql/GEN_expr",
      "336397241": "Argument for @1 in dialect 1 must be string or numeric",
      "336397242": "Argument for @1 in dialect 3 must be numeric",
      "336397243": "Strings cannot be added to or subtracted from DATE or TIME types",
      "336397244": "Invalid data type for subtraction involving DATE, TIME or TIMESTAMP types",
      "336397245": "Adding two DATE values or two TIME values is not allowed",
      "336397246": "DATE value cannot be subtracted from the provided data type",
      "336397247": "Strings cannot be added or subtracted in dialect 3",
      "336397248": "Invalid data type for addition or subtraction in dialect 3",
      "336397249": "Invalid data type for multiplication in dialect 1",
      "336397250": "Strings cannot be multiplied in dialect 3",
      "336397251": "Invalid data type for multiplication in dialect 3",
      "336397252": "Division in dialect 1 must be between numeric data types",
      "336397253": "Strings cannot be divided in dialect 3",
      "336397254": "Invalid data type for division in dialect 3",
      "336397255": "Strings cannot be negated (applied the minus operator) in dialect 3",
      "336397256": "Invalid data type for negation (minus operator)",
      "336397257": "Cannot have more than 255 items in DISTINCT / UNION DISTINCT list",
      "336397258": "ALTER CHARACTER SET @1 failed",
      "336397259": "COMMENT ON @1 failed",
      "336397260": "CREATE FUNCTION @1 failed",
      "336397261": "ALTER FUNCTION @1 failed",
      "336397262": "CREATE OR ALTER FUNCTION @1 failed",
      "336397263": "DROP FUNCTION @1 failed",
      "336397264": "RECREATE FUNCTION @1 failed",
      "336397265": "CREATE PROCEDURE @1 failed",
      "336397266": "ALTER PROCEDURE @1 failed",
      "336397267": "CREATE OR ALTER PROCEDURE @1 failed",
      "336397268": "DROP PROCEDURE @1 failed",
      "336397269": "RECREATE PROCEDURE @1 failed",
      "336397270": "CREATE TRIGGER @1 failed",
      "336397271": "ALTER TRIGGER @1 failed",
      "336397272": "CREATE OR ALTER TRIGGER @1 failed",
      "336397273": "DROP TRIGGER @1 failed",
      "336397274": "RECREATE TRIGGER @1 failed",
      "336397275": "CREATE COLLATION @1 failed",
      "336397276": "DROP COLLATION @1 failed",
      "336397277": "CREATE DOMAIN @1 failed",
      "336397278": "ALTER DOMAIN @1 failed",
      "336397279": "DROP DOMAIN @1 failed",
      "336397280": "CREATE EXCEPTION @1 failed",
      "336397281": "ALTER EXCEPTION @1 failed",
      "336397282": "CREATE OR ALTER EXCEPTION @1 failed",
      "336397283": "RECREATE EXCEPTION @1 failed",
      "336397284": "DROP EXCEPTION @1 failed",
      "336397285": "CREATE SEQUENCE @1 failed",
      "336397286": "CREATE TABLE @1 failed",
      "336397287": "ALTER TABLE @1 failed",
      "336397288": "DROP TABLE @1 failed",
      "336397289": "RECREATE TABLE @1 failed",
      "336397290": "CREATE PACKAGE @1 failed",
      "336397291": "ALTER PACKAGE @1 failed",
      "336397292": "CREATE OR ALTER PACKAGE @1 failed",
      "336397293": "DROP PACKAGE @1 failed",
      "336397294": "RECREATE PACKAGE @1 failed",
      "336397295": "CREATE PACKAGE BODY @1 failed",
      "336397296": "DROP PACKAGE BODY @1 failed",
      "336397297": "RECREATE PACKAGE BODY @1 failed",
      "336397298": "CREATE VIEW @1 failed",
      "336397299": "ALTER VIEW @1 failed",
      "336397300": "CREATE OR ALTER VIEW @1 failed",
      "336397301": "RECREATE VIEW @1 failed",
      "336397302": "DROP VIEW @1 failed",
      "336397303": "DROP SEQUENCE @1 failed",
      "336397304": "RECREATE SEQUENCE @1 failed",
      "336397305": "DROP INDEX @1 failed",
      "336397306": "DROP FILTER @1 failed",
      "336397307": "DROP SHADOW @1 failed",
      "336397308": "DROP ROLE @1 failed",
      "336397309": "DROP USER @1 failed",
      "336397310": "CREATE ROLE @1 failed",
      "336397311": "ALTER ROLE @1 failed",
      "336397312": "ALTER INDEX @1 failed",
      "336397313": "ALTER DATABASE failed",
      "336397314": "CREATE SHADOW @1 failed",
      "336397315": "DECLARE FILTER @1 failed",
      "336397316": "CREATE INDEX @1 failed",
      "336397317": "CREATE USER @1 failed",
      "336397318": "ALTER USER @1 failed",
      "336397319": "GRANT failed",
      "336397320": "REVOKE failed",
      "336397321": "Recursive member of CTE cannot use aggregate or window function",
      "336397322": "@2 MAPPING @1 failed",
      "336397323": "ALTER SEQUENCE @1 failed",
      "336397324": "CREATE GENERATOR @1 failed",
      "336397325": "SET GENERATOR @1 failed",
      "336397326": "WITH LOCK can be used only with a single physical table",
      "336397327": "FIRST/SKIP cannot be used with OFFSET/FETCH or ROWS",
      "336397328": "WITH LOCK cannot be used with aggregates",
      "336397329": "WITH LOCK cannot be used with @1",
      "336397330": "Number of arguments (@1) exceeds the maximum (@2) number of EXCEPTION USING arguments",
      "336397331": "String literal with @1 bytes exceeds the maximum length of @2 bytes",
      "336397332": "String literal with @1 characters exceeds the maximum length of @2 characters for the @3 character set",
      "336397333": "Too many BEGIN\u2026\u200BEND nesting. Maximum level is @1",
      "336397334": "RECREATE USER @1 failed",
      "336723983": "Unable to open database",
      "336723984": "Error in switch specifications",
      "336723985": "No operation specified",
      "336723986": "No user name specified",
      "336723987": "Add record error",
      "336723988": "Modify record error",
      "336723989": "Find / modify record error",
      "336723990": "Record not found for user: @1",
      "336723991": "Delete record error",
      "336723992": "Find / delete record error",
      "336723996": "Find / display record error",
      "336723997": "Invalid parameter, no switch defined",
      "336723998": "Operation already specified",
      "336723999": "Password already specified",
      "336724000": "Uid already specified",
      "336724001": "Gid already specified",
      "336724002": "Project already specified",
      "336724003": "Organization already specified",
      "336724004": "First name already specified",
      "336724005": "Middle name already specified",
      "336724006": "Last name already specified",
      "336724008": "Invalid switch specified",
      "336724009": "Ambiguous switch specified",
      "336724010": "No operation specified for parameters",
      "336724011": "No parameters allowed for this operation",
      "336724012": "Incompatible switches specified",
      "336724044": "Invalid user name (maximum 31 bytes allowed)",
      "336724045": "Warning - maximum 8 significant bytes of password used",
      "336724046": "Database already specified",
      "336724047": "Database administrator name already specified",
      "336724048": "Database administrator password already specified",
      "336724049": "SQL role name already specified",
      "336920577": "Found unknown switch",
      "336920578": "Please retry, giving a database name",
      "336920579": "Wrong ODS version, expected @1, encountered @2",
      "336920580": "Unexpected end of database file",
      "336920605": "Can't open database file @1",
      "336920606": "Can't read a database page",
      "336920607": "System memory exhausted",
      "336986113": "Wrong value for access mode",
      "336986114": "Wrong value for write mode",
      "336986115": "Wrong value for reserve space",
      "336986116": "Unknown tag (@1) in info_svr_db_info block after isc_svc_query()",
      "336986117": "Unknown tag (@1) in isc_svc_query() results",
      "336986118": 'Unknown switch "@1"'
    };
  }
});

// node_modules/node-firebird/lib/utils.js
var require_utils = __commonJS({
  "node_modules/node-firebird/lib/utils.js"(exports2) {
    "use strict";
    var __importDefault = exports2 && exports2.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { default: mod };
    };
    Object.defineProperty(exports2, "__esModule", { value: !0 });
    exports2.escape = exports2.lookupMessages = exports2.batchResultToError = exports2.parseDate = void 0;
    exports2.resolveEventHost = resolveEventHost;
    exports2.noop = noop;
    var firebird_msg_json_1 = __importDefault(require_firebird_msg()), const_1 = __importDefault(require_const()), MessagesError = firebird_msg_json_1.default;
    function resolveEventHost(options, advertisedHost) {
      return options.eventHost ? options.eventHost : advertisedHost === "0.0.0.0" || advertisedHost === "::" ? options.host || const_1.default.DEFAULT_HOST : advertisedHost;
    }
    var parseDate = (str) => {
      let self = str.trim(), arr = self.indexOf(" ") === -1 ? self.split("T") : self.split(" "), index = arr[0].indexOf(":"), length = arr[0].length;
      if (index !== -1) {
        let tmp = arr[1];
        arr[1] = arr[0], arr[0] = tmp;
      }
      arr[0] === void 0 && (arr[0] = "");
      let noTime = arr[1] === void 0 || arr[1].length === 0;
      for (let i = 0; i < length; i++) {
        let c = arr[0].charCodeAt(i);
        if (!(c > 47 && c < 58) && !(c === 45 || c === 46) && noTime)
          return new Date(self);
      }
      arr[1] === void 0 && (arr[1] = "00:00:00");
      let firstDay = arr[0].indexOf("-") === -1, date = (arr[0] || "").split(firstDay ? "." : "-"), time = (arr[1] || "").split(":");
      if (date.length < 4 && time.length < 2)
        return new Date(self);
      index = (time[2] || "").indexOf("."), index !== -1 ? (time[3] = time[2].substring(index + 1), time[2] = time[2].substring(0, index)) : time[3] = "0";
      let parsed = [
        parseInt(date[firstDay ? 2 : 0], 10),
        // year
        parseInt(date[1], 10),
        // month
        parseInt(date[firstDay ? 0 : 2], 10),
        // day
        parseInt(time[0], 10),
        // hours
        parseInt(time[1], 10),
        // minutes
        parseInt(time[2], 10),
        // seconds
        parseInt(time[3], 10)
        // miliseconds
      ], def = /* @__PURE__ */ new Date();
      for (let i = 0; i < parsed.length; i++) {
        isNaN(parsed[i]) && (parsed[i] = 0);
        let value = parsed[i];
        if (value === 0)
          switch (i) {
            case 0:
              value <= 0 && (parsed[i] = def.getFullYear());
              break;
            case 1:
              value <= 0 && (parsed[i] = def.getMonth() + 1);
              break;
            case 2:
              value <= 0 && (parsed[i] = def.getDate());
              break;
          }
      }
      return new Date(parsed[0], parsed[1] - 1, parsed[2], parsed[3], parsed[4], parsed[5]);
    };
    exports2.parseDate = parseDate;
    var batchResultToError = (result) => {
      let first = result.errors.length ? result.errors[0] : null, err = first ? first.error : new Error("Batch failed for record(s) " + result.errorRecordNumbers.join(", "));
      return err.batchCompletion = result, err;
    };
    exports2.batchResultToError = batchResultToError;
    var lookupMessages = (status) => status.map((item) => {
      let text = MessagesError[item.gdscode];
      return text === void 0 ? "Unknow error" : (item.params !== void 0 && item.params.forEach((param, i) => {
        text = text.replace("@" + (i + 1), param);
      }), text);
    }).join(", ");
    exports2.lookupMessages = lookupMessages;
    var escape = function(value, protocolVersion) {
      if (value == null)
        return "NULL";
      switch (typeof value) {
        case "boolean":
          return (protocolVersion || const_1.default.PROTOCOL_VERSION13) >= const_1.default.PROTOCOL_VERSION13 ? value ? "true" : "false" : value ? "1" : "0";
        case "number":
          return value.toString();
        case "string":
          return "'" + value.replace(/'/g, "''") + "'";
      }
      if (value instanceof Date)
        return "'" + value.getFullYear() + "-" + (value.getMonth() + 1).toString().padStart(2, "0") + "-" + value.getDate().toString().padStart(2, "0") + " " + value.getHours().toString().padStart(2, "0") + ":" + value.getMinutes().toString().padStart(2, "0") + ":" + value.getSeconds().toString().padStart(2, "0") + "." + value.getMilliseconds().toString().padStart(3, "0") + "'";
      throw new Error("Escape supports only primitive values.");
    };
    exports2.escape = escape;
    function noop() {
    }
  }
});

// node_modules/node-firebird/lib/sql-template.js
var require_sql_template = __commonJS({
  "node_modules/node-firebird/lib/sql-template.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: !0 });
    exports2.SqlQuery = exports2.SqlIdentifier = void 0;
    exports2.quoteIdentifier = quoteIdentifier;
    exports2.makeSqlTag = makeSqlTag;
    var SqlIdentifier = class {
      constructor(name) {
        this.name = name;
      }
    };
    exports2.SqlIdentifier = SqlIdentifier;
    function quoteIdentifier(name) {
      return String(name).split(".").map((part) => '"' + part.replace(/"/g, '""') + '"').join(".");
    }
    function compile(strings, values, active) {
      let text = "", params = [];
      for (let i = 0; i < strings.length; i++) {
        if (text += strings[i], i >= values.length)
          continue;
        let value = values[i];
        if (value instanceof SqlIdentifier)
          text += quoteIdentifier(value.name);
        else if (value instanceof SqlQuery) {
          if (active = active || /* @__PURE__ */ new Set(), active.has(value))
            throw new Error("circular sql fragment: a query is embedded (transitively) inside itself");
          active.add(value);
          let inner = compile(value.strings, value.values, active);
          active.delete(value), text += inner.text, params.push(...inner.params);
        } else if (Array.isArray(value)) {
          if (!value.length)
            throw new Error('cannot interpolate an empty array (would compile to invalid SQL like "IN ()")');
          text += value.map(() => "?").join(", "), params.push(...value);
        } else
          text += "?", params.push(value);
      }
      return { text, params };
    }
    var SqlQuery = class {
      constructor(executor, strings, values) {
        this.executor = executor, this.strings = strings, this.values = values;
      }
      /** The compiled SQL text (`?` placeholders) and parameter array. */
      toQuery() {
        return compile(this.strings, this.values);
      }
      /**
       * Attach per-query options (timeout, signal, nestTables, …). Must be
       * called before the query executes — options attached afterwards would
       * be silently ignored, so that throws instead.
       */
      options(queryOptions) {
        if (this.executed)
          throw new Error("sql query already executed \u2014 call .options() before awaiting it");
        return this.queryOptions = { ...this.queryOptions, ...queryOptions }, this;
      }
      /** Execute resolving the full { rows, fields, affectedRows, … } result. */
      withMeta() {
        return this.run(!0);
      }
      /**
       * A query executes exactly once, in the shape of its first consumer
       * (plain rows via then/await, or the full result via withMeta).
       * Consuming it again in the OTHER shape cannot be honoured from the
       * cached promise, so it throws rather than silently returning the
       * wrong shape.
       */
      run(withMeta) {
        if (this.executed) {
          if (withMeta !== this.executedMeta)
            throw new Error(this.executedMeta ? "sql query already executed via .withMeta() \u2014 await that result instead of the query" : "sql query already executed as plain rows \u2014 call .withMeta() first, or build a new query");
          return this.executed;
        }
        this.executedMeta = withMeta;
        let { text, params } = compile(this.strings, this.values), options = withMeta ? { ...this.queryOptions, withMeta: !0 } : this.queryOptions;
        return this.executed = this.executor(text, params, options), this.executed;
      }
      then(onfulfilled, onrejected) {
        return this.run(!1).then(onfulfilled, onrejected);
      }
      catch(onrejected) {
        return this.then(void 0, onrejected);
      }
      finally(onfinally) {
        return this.run(!1).finally(onfinally);
      }
    };
    exports2.SqlQuery = SqlQuery;
    function makeSqlTag(executor) {
      return function(first, ...values) {
        if (Array.isArray(first) && Object.prototype.hasOwnProperty.call(first, "raw"))
          return new SqlQuery(executor, first, values);
        if (typeof first == "string")
          return new SqlIdentifier(first);
        throw new Error("sql must be used as a template tag (sql`...`) or called with an identifier string (sql('NAME'))");
      };
    }
  }
});

// node_modules/node-firebird/lib/wire/eventConnection.js
var require_eventConnection = __commonJS({
  "node_modules/node-firebird/lib/wire/eventConnection.js"(exports2, module2) {
    "use strict";
    var __importDefault = exports2 && exports2.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { default: mod };
    }, net_1 = __importDefault(require("net")), serialize_1 = require_serialize(), const_1 = __importDefault(require_const()), DEFAULT_ENCODING = "utf8", EventConnection = class {
      constructor(host, port, callback, db) {
        var self = this;
        this.db = db, this.emgr = null, this._isClosed = !1, this._isOpened = !1, this._connectSettled = !1, this._terminalErrorReported = !1, this._intentionalClose = !1, this._socket = net_1.default.createConnection(port, host), this._bind_events(host, port, callback), this.error = null, this.eventcallback = null;
      }
      _bind_events(host, port, callback) {
        var self = this;
        function finishConnect(err) {
          self._connectSettled || (self._connectSettled = !0, callback && callback(err));
        }
        function reportTerminalError(err) {
          if (self._terminalErrorReported)
            return;
          self._terminalErrorReported = !0;
          let wasOpened = self._isOpened;
          self.error = err, self._isClosed = !0, self._isOpened = !1, !self._intentionalClose && !wasOpened ? finishConnect(err) : !self._intentionalClose && self.eventcallback ? self.eventcallback(err) : !self._intentionalClose && self.db && self.db.connection && typeof self.db.connection._emitError == "function" && self.db.connection._emitError(err), self._socket.destroyed || self._socket.destroy();
        }
        self._socket.on("close", function() {
          self._isClosed = !0, self._isOpened ? !self._intentionalClose && self.eventcallback && !self._terminalErrorReported && reportTerminalError(new Error(`Event connection to ${host}:${port} closed unexpectedly.`)) : finishConnect(self.error || new Error(`Event connection to ${host}:${port} closed before connecting.`)), self._isOpened = !1;
        }), self._socket.on("error", function(e) {
          reportTerminalError(e);
        }), self._socket.on("connect", function() {
          self._isClosed = !1, self._isOpened = !0, finishConnect();
        }), self._socket.on("data", function(data) {
          var xdr, buf;
          self._xdr ? (xdr = self._xdr, delete self._xdr, buf = Buffer.alloc(data.length + xdr.buffer.length), xdr.buffer.copy(buf), data.copy(buf, xdr.buffer.length), xdr.buffer = buf) : xdr = new serialize_1.XdrReader(data);
          var op_pos = xdr.pos;
          try {
            for (var tmp_event; xdr.pos < xdr.buffer.length; ) {
              op_pos = xdr.pos;
              do
                var r = xdr.readInt();
              while (r === const_1.default.op_dummy);
              switch (r) {
                case const_1.default.op_event:
                  xdr.readInt(), buf = xdr.readArray(), tmp_event = {};
                  for (var lst_event = [], eventname = "", eventcount = 0, pos = 1; pos < buf.length; ) {
                    var len = buf.readUInt8(pos++);
                    if (pos + len + 4 > buf.length)
                      throw new RangeError("Incomplete event payload");
                    eventname = buf.toString(DEFAULT_ENCODING, pos, pos + len);
                    var prevcount = self.emgr.events[eventname] || 0;
                    pos += len, eventcount = buf.readInt32LE(pos), tmp_event[eventname] = eventcount, pos += 4, prevcount !== eventcount && lst_event.push({ name: eventname, count: eventcount });
                  }
                  xdr.readInt64();
                  var event_id = xdr.readInt();
                  if (!self.emgr._eventBaseline)
                    for (var evt in tmp_event)
                      Object.prototype.hasOwnProperty.call(self.emgr.events, evt) && (self.emgr.events[evt] = tmp_event[evt]);
                  self.eventcallback && self.eventcallback(null, { eventid: event_id, events: lst_event, counts: tmp_event });
                  break;
                default:
                  reportTerminalError(new Error("Unexpected event connection opcode: " + r));
                  return;
              }
            }
          } catch (err) {
            err instanceof RangeError ? (xdr.buffer = xdr.buffer = xdr.buffer.slice(op_pos), xdr.pos = 0, self._xdr = xdr) : reportTerminalError(err instanceof Error ? err : new Error(String(err)));
          }
        });
      }
      throwClosed(callback) {
        var err = new Error("Event Connection is closed.");
        return callback && callback(err), this;
      }
    };
    module2.exports = EventConnection;
  }
});

// node_modules/node-firebird/lib/wire/fbEventManager.js
var require_fbEventManager = __commonJS({
  "node_modules/node-firebird/lib/wire/fbEventManager.js"(exports2, module2) {
    "use strict";
    var __importDefault = exports2 && exports2.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { default: mod };
    }, events_1 = __importDefault(require("events")), callback_1 = require_callback(), FbEventManager = class extends events_1.default.EventEmitter {
      constructor(db, eventconnection, eventid, callback) {
        super(), this.db = db, this.eventconnection = eventconnection, this.events = {}, this.eventid = eventid, this._subscriptionVersion = 0, this._activeSubscriptionVersion = 0, this._hasActiveSubscription = !1, this._baselinePending = !1, this._eventBaseline = db.connection.options?.eventBaseline === !0, this._baselineChangeInProgress = !1, this._baselineCallbacks = [], this._hasQueuedBaseline = !1, this._retiredEventIdLimit = 0, this._baselineCloseRequested = !1, this._baselineCloseCallbacks = [], this._readySettled = !1, this._terminalErrorReported = !1, this._readyCallback = callback, this._createEventLoop(), process.nextTick(() => this._finishReady());
      }
      on(event, listener) {
        return super.on(event, listener);
      }
      once(event, listener) {
        return super.once(event, listener);
      }
      _finishReady(err) {
        this._readySettled || (this._readySettled = !0, err ? (0, callback_1.doError)(err, this._readyCallback) : this._readyCallback(null));
      }
      _handleAsyncError(err) {
        if (this._terminalErrorReported)
          return;
        this._terminalErrorReported = !0;
        let error = err instanceof Error ? err : new Error(String(err));
        this._hasActiveSubscription = !1, this._baselinePending = !1, this._subscriptionVersion++, this.eventconnection._isClosed = !0, this.eventconnection._isOpened = !1, this.eventconnection.eventcallback = null, this.eventconnection._socket && !this.eventconnection._socket.destroyed && typeof this.eventconnection._socket.destroy == "function" && this.eventconnection._socket.destroy(), this._readySettled ? this.listenerCount("error") > 0 ? this.emit("error", error) : this.db.connection && typeof this.db.connection._emitError == "function" && this.db.connection._emitError(error) : this._finishReady(error);
      }
      /**
       * Returns a snapshot of the current state for debugging.
       * Useful for tracing the state machine during development.
       *
       * Stable states: 'IDLE', 'SUBSCRIBED', 'CLOSED'.
       * Transient states (SUBSCRIBING, CANCELLING, CLOSING) occur while waiting
       * for op_response on the main connection or for the socket to close; they
       * are not tracked with dedicated flags to keep the implementation simple,
       * but they can be inferred: if the socket is open and _hasActiveSubscription
       * disagrees with what the caller expects, a transitional operation is in
       * progress.
       *
       * @returns {{
       *   state: string,
       *   hasActiveSubscription: boolean,
       *   registeredEvents: Object,
       *   eventId: number,
       *   isEventConnectionOpen: boolean,
       *   isDatabaseConnectionClosed: boolean
       * }}
       */
      getState() {
        let evtConnOpen = this.eventconnection ? !this.eventconnection._isClosed : !1, dbConnClosed = this.db.connection ? this.db.connection._isClosed : !0, state;
        return dbConnClosed || !evtConnOpen ? state = "CLOSED" : this._hasActiveSubscription ? state = "SUBSCRIBED" : state = "IDLE", {
          state,
          hasActiveSubscription: this._hasActiveSubscription,
          registeredEvents: Object.assign({}, this.events),
          eventId: this.eventid,
          isEventConnectionOpen: evtConnOpen,
          isDatabaseConnectionClosed: dbConnClosed
        };
      }
      _createEventLoop() {
        var self = this, cnx = this.db.connection;
        this.eventconnection.emgr = this, process.env.FIREBIRD_DEBUG && console.log("[fb-debug] FbEventManager._createEventLoop: eventid=%d", self.eventid);
        function loop() {
          if (!self._hasActiveSubscription || Object.keys(self.events).length === 0 || self._eventBaseline && self._activeSubscriptionVersion !== self._subscriptionVersion)
            return;
          let eventId = self.eventid;
          cnx.queEvents(self.events, eventId, function(err) {
            if (err && (!self._eventBaseline || !self._isRetiredEventId(eventId))) {
              self._handleAsyncError(err);
              return;
            }
          });
        }
        this.eventconnection.eventcallback = function(err, ret) {
          if (err || !ret) {
            self._handleAsyncError(err || new Error("Missing event packet"));
            return;
          }
          if (self.eventid !== ret.eventid) {
            if (self._eventBaseline && self._isRetiredEventId(ret.eventid))
              return;
            self._handleAsyncError(new Error("Bad eventid"));
            return;
          }
          if (!(self._eventBaseline && (self._baselineCloseRequested || !self._hasActiveSubscription || self._activeSubscriptionVersion !== self._subscriptionVersion || Object.keys(ret.counts).some((name) => !Object.prototype.hasOwnProperty.call(self.events, name))))) {
            if (self._eventBaseline)
              for (let [name, count] of Object.entries(ret.counts))
                self.events[name] = count;
            self._eventBaseline && self._baselinePending && self._hasActiveSubscription ? (self._baselinePending = !1, self.emit("baseline", Object.freeze({ ...self.events }))) : ret.events.forEach(function(event) {
              self.emit("post_event", event.name, event.count);
            }), loop();
          }
        };
      }
      _changeEvent(callback) {
        if (this._eventBaseline) {
          this._changeEventWithBaseline(callback);
          return;
        }
        var self = this;
        let changeVersion = ++self._subscriptionVersion;
        function subscribe() {
          if (Object.keys(self.events).length === 0) {
            self._hasActiveSubscription = !1, self._baselinePending = !1, callback(null);
            return;
          }
          self._hasActiveSubscription = !0, self.db.connection.queEvents(self.events, self.eventid, function(err, ret) {
            if (err) {
              self._subscriptionVersion === changeVersion && (self._hasActiveSubscription = !1, self._baselinePending = !1), (0, callback_1.doError)(err, callback);
              return;
            }
            callback(null, ret);
          });
        }
        self._hasActiveSubscription ? self.db.connection.closeEvents(this.eventid, function(err) {
          if (err) {
            (0, callback_1.doError)(err, callback);
            return;
          }
          self._hasActiveSubscription = !1, subscribe();
        }) : subscribe();
      }
      _isRetiredEventId(eventId) {
        return eventId <= this._retiredEventIdLimit;
      }
      _changeEventWithBaseline(callback) {
        let cnx = this.db.connection;
        if (this._subscriptionVersion++, this._baselineCallbacks.push(callback), this._baselineChangeInProgress)
          return;
        this._baselineChangeInProgress = !0;
        let finish = (err, ret) => {
          this._baselineChangeInProgress = !1, this._baselineCloseRequested && !err && (err = new Error("Event Connection is closed."));
          let callbacks = this._baselineCallbacks.splice(0);
          for (let done of callbacks)
            err ? (0, callback_1.doError)(err, done) : done(null, ret);
          if (this._baselineCloseRequested) {
            this._baselineCloseRequested = !1;
            let closeCallbacks = this._baselineCloseCallbacks.splice(0);
            this.close((closeError) => {
              for (let done of closeCallbacks)
                done(closeError);
            });
          }
        }, subscribe = () => {
          if (this._baselineCloseRequested) {
            finish(new Error("Event Connection is closed."));
            return;
          }
          if (Object.keys(this.events).length === 0) {
            this._hasActiveSubscription = !1, this._baselinePending = !1, finish(null);
            return;
          }
          this._hasQueuedBaseline && (this.eventid = this.db.eventid++), this._hasQueuedBaseline = !0;
          let version = this._subscriptionVersion;
          this._activeSubscriptionVersion = version;
          for (let name of Object.keys(this.events))
            this.events[name] = 0;
          this._baselinePending = !0, this._hasActiveSubscription = !0, cnx.queEvents(this.events, this.eventid, (err, ret) => {
            err ? (this._hasActiveSubscription = !1, this._baselinePending = !1, finish(err)) : version !== this._subscriptionVersion ? cycle() : finish(null, ret);
          });
        }, cycle = () => {
          if (!this._hasActiveSubscription) {
            subscribe();
            return;
          }
          let oldId = this.eventid;
          this._hasActiveSubscription = !1, this._baselinePending = !1, this._retiredEventIdLimit = Math.max(this._retiredEventIdLimit, oldId), cnx.closeEvents(oldId, (err) => {
            err ? finish(err) : subscribe();
          });
        };
        cycle();
      }
      registerEvent(events, callback) {
        var self = this;
        if (self.db.connection._isClosed || self.eventconnection._isClosed || self._baselineCloseRequested)
          return self.eventconnection.throwClosed(callback);
        for (let event of events) {
          let byteLength = typeof event == "string" ? Buffer.byteLength(event, "utf8") : 0;
          if (byteLength < 1 || byteLength > 127)
            return (0, callback_1.doError)(new Error("Firebird event names must be between 1 and 127 UTF-8 bytes."), callback);
        }
        events.forEach((event) => self.events[event] = self.events[event] || 0), self._changeEvent(callback);
      }
      unregisterEvent(events, callback) {
        var self = this;
        if (self.db.connection._isClosed || self.eventconnection._isClosed || self._baselineCloseRequested)
          return self.eventconnection.throwClosed(callback);
        events.forEach(function(event) {
          delete self.events[event];
        }), self._changeEvent(callback);
      }
      close(callback) {
        var self = this;
        if (self._eventBaseline && self._baselineChangeInProgress) {
          self._baselineCloseRequested = !0, callback && self._baselineCloseCallbacks.push(callback);
          return;
        }
        process.env.FIREBIRD_DEBUG && console.log("[fb-debug] FbEventManager.close() called, _hasActiveSubscription=%s eventid=%d", self._hasActiveSubscription, self.eventid), self.eventconnection._intentionalClose = !0, self.eventconnection.eventcallback = null, self._baselinePending = !1;
        function endAndWaitForClose(cb) {
          var sock = self.eventconnection && self.eventconnection._socket;
          if (!sock || sock.destroyed) {
            process.env.FIREBIRD_DEBUG && console.log("[fb-debug] endAndWaitForClose: socket already destroyed, calling back immediately"), cb && cb();
            return;
          }
          var fired = !1, timer;
          function done(source) {
            fired || (fired = !0, clearTimeout(timer), process.env.FIREBIRD_DEBUG && console.log("[fb-debug] endAndWaitForClose done() via %s, eventid=%d", source, self.eventid), cb && cb());
          }
          sock.once("close", function() {
            done("close-event");
          }), process.env.FIREBIRD_DEBUG && console.log("[fb-debug] endAndWaitForClose: calling sock.end(), eventid=%d sock.destroyed=%s", self.eventid, sock.destroyed), sock.end(), timer = setTimeout(function() {
            done("200ms-timer");
          }, 200);
        }
        if (!self._hasActiveSubscription) {
          endAndWaitForClose(callback);
          return;
        }
        self.db.connection.closeEvents(this.eventid, function(err) {
          if (err) {
            (0, callback_1.doError)(err, callback);
            return;
          }
          self._hasActiveSubscription = !1, endAndWaitForClose(callback);
        });
      }
    };
    module2.exports = FbEventManager;
  }
});

// node_modules/node-firebird/lib/wire/query-stream.js
var require_query_stream = __commonJS({
  "node_modules/node-firebird/lib/wire/query-stream.js"(exports2, module2) {
    "use strict";
    var stream_1 = require("stream");
    function makeQueryStream(target, query, params, options) {
      options = options || {};
      let streamOptions = { objectMode: !0 };
      options.highWaterMark !== void 0 && (streamOptions.highWaterMark = options.highWaterMark);
      let queryOptions = { ...options };
      delete queryOptions.on, delete queryOptions.asStream, delete queryOptions.highWaterMark;
      let abortError = new Error("queryStream destroyed"), pendingNext = null, resume = (err) => {
        if (pendingNext) {
          let next = pendingNext;
          pendingNext = null, next(err);
        }
      }, stream = new stream_1.Readable({
        ...streamOptions,
        read() {
          resume();
        },
        destroy(err, cb) {
          resume(abortError), cb(err);
        }
      });
      return target.sequentially(query, params, function(row, _index, next) {
        if (stream.destroyed) {
          next(abortError);
          return;
        }
        stream.push(row) ? next() : pendingNext = next;
      }, function(err) {
        err && err !== abortError ? stream.destroy(err) : stream.destroyed || stream.push(null);
      }, queryOptions), stream;
    }
    module2.exports = makeQueryStream;
  }
});

// node_modules/node-firebird/lib/wire/batch-stream.js
var require_batch_stream = __commonJS({
  "node_modules/node-firebird/lib/wire/batch-stream.js"(exports2, module2) {
    "use strict";
    var stream_1 = require("stream"), callback_1 = require_callback(), utils_1 = require_utils();
    function makeBatchStream(target, query, options, ownsTransaction) {
      options = options || {};
      let flushRows = options.flushRows > 0 ? Math.floor(options.flushRows) : 1e3, batchOptions = { ...options };
      delete batchOptions.flushRows, delete batchOptions.highWaterMark;
      let transaction = null, statement = null, buffered = [], init = async () => {
        statement || (transaction = ownsTransaction ? await target.transactionAsync() : target, statement = await (0, callback_1.fromCallback)((cb) => transaction.newStatement(query, cb)));
      }, flush = async () => {
        if (!buffered.length)
          return;
        await init();
        let chunk = buffered;
        buffered = [];
        let result = await (0, callback_1.fromCallback)((cb) => statement.executeBatch(transaction, chunk, cb, batchOptions));
        if (!result.success)
          throw (0, utils_1.batchResultToError)(result);
        stream.recordCount += result.recordCount;
        for (let count of result.updateCounts)
          stream.affectedRows += count;
      }, cleanup = async (commit) => {
        if (statement) {
          let stmt = statement;
          statement = null, await new Promise((resolve) => stmt.release(() => resolve()));
        }
        if (ownsTransaction && transaction) {
          let tx = transaction;
          transaction = null, await (commit ? tx.commitAsync() : tx.rollbackAsync());
        }
      }, stream = new stream_1.Writable({
        objectMode: !0,
        highWaterMark: options.highWaterMark > 0 ? options.highWaterMark : flushRows,
        write(row, _enc, cb) {
          if (!Array.isArray(row)) {
            cb(new Error("batchStream expects parameter-array rows"));
            return;
          }
          buffered.push(row), buffered.length >= flushRows ? flush().then(() => cb(), cb) : cb();
        },
        final(cb) {
          flush().then(() => cleanup(!0)).then(() => cb(), (err) => {
            cleanup(!1).catch(() => {
            }), cb(err);
          });
        },
        destroy(err, cb) {
          cleanup(!1).then(() => cb(err), () => cb(err));
        }
      });
      return stream.recordCount = 0, stream.affectedRows = 0, stream;
    }
    module2.exports = makeBatchStream;
  }
});

// node_modules/node-firebird/lib/wire/database.js
var require_database = __commonJS({
  "node_modules/node-firebird/lib/wire/database.js"(exports2, module2) {
    "use strict";
    var __importDefault = exports2 && exports2.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { default: mod };
    }, events_1 = __importDefault(require("events")), callback_1 = require_callback(), utils_1 = require_utils(), const_1 = __importDefault(require_const()), sql_template_1 = require_sql_template(), xsqlvar_1 = require_xsqlvar(), eventConnection_1 = __importDefault(require_eventConnection()), fbEventManager_1 = __importDefault(require_fbEventManager()), query_stream_1 = __importDefault(require_query_stream()), batch_stream_1 = __importDefault(require_batch_stream());
    function readblob(blob, callback) {
      if (blob == null) {
        callback(null, blob);
        return;
      }
      if (typeof blob != "function") {
        callback(null, blob);
        return;
      }
      blob(function(err, name, e) {
        if (err) {
          callback(err);
          return;
        }
        if (!e) {
          callback(null, null);
          return;
        }
        let chunks = [], chunksLength = 0;
        e.on("data", function(chunk) {
          chunksLength += chunk.length, chunks.push(chunk);
        }), e.on("end", function() {
          callback(null, Buffer.concat(chunks, chunksLength));
        }), e.on("error", function(streamErr) {
          callback(streamErr);
        });
      });
    }
    function fetchBlobSyncRow(row, meta, nestTables, lowercaseKeys, transform, callback) {
      if (!row || !meta || !meta.length || !meta.some((m) => m && m.type === const_1.default.SQL_BLOB)) {
        callback(null, row);
        return;
      }
      let keys = Array.isArray(row) ? null : (0, xsqlvar_1.computeColumnKeys)(meta, nestTables, lowercaseKeys, transform), blobCells = [];
      for (let i = 0; i < meta.length; i++) {
        if (!meta[i] || meta[i].type !== const_1.default.SQL_BLOB)
          continue;
        let target = keys ? (0, xsqlvar_1.nestCell)(row, keys[i].table) : row, key = keys ? keys[i].key : i;
        typeof target[key] == "function" && !blobCells.some((cell) => cell.target === target && cell.key === key) && blobCells.push({ target, key });
      }
      if (!blobCells.length) {
        callback(null, row);
        return;
      }
      let pending = blobCells.length, blobErr;
      blobCells.forEach(function(cell) {
        readblob(cell.target[cell.key], function(err, data) {
          err && !blobErr && (blobErr = err), cell.target[cell.key] = data, pending--, pending === 0 && callback(blobErr, row);
        });
      });
    }
    var Database = class extends events_1.default.EventEmitter {
      constructor(connection) {
        super(), this.connection = connection, connection.db = this, this.eventid = 1;
      }
      /**
       * Tagged-template query API: db.sql`SELECT ... ${value}` (see README).
       * Built lazily on first access; the compiled text is positional-only,
       * so the namedPlaceholders rewriter is disabled — any `:token` in the
       * template is PSQL (EXECUTE BLOCK), not a placeholder.
       */
      get sql() {
        return this._sql || (this._sql = (0, sql_template_1.makeSqlTag)((text, params, options) => this.queryAsync(text, params, { ...options, namedPlaceholders: !1 })));
      }
      escape(value) {
        return (0, utils_1.escape)(value, this.connection.accept.protocolVersion);
      }
      detach(callback, force) {
        var self = this;
        return !force && self.connection._pending.length > 0 ? (self.connection._detachAuto = !0, self.connection._detachCallback = callback, self) : (self.connection._pooled === !1 ? self.connection.detach(function(err, obj) {
          self.connection.disconnect(), self.emit("detach", !1), callback && callback(err, obj);
        }) : (self.emit("detach", !1), callback && callback()), self);
      }
      transaction(options, callback) {
        return this.startTransaction(options, callback);
      }
      startTransaction(options, callback) {
        return this.connection.startTransaction(options, callback), this;
      }
      newStatement(query, callback) {
        let cb = callback;
        return this.startTransaction(function(err, transaction) {
          if (err || !transaction) {
            cb(err);
            return;
          }
          transaction.newStatement(query, function(err2, statement) {
            if (err2) {
              cb(err2);
              return;
            }
            transaction.commit(function(err3) {
              cb(err3, statement);
            });
          });
        }), this;
      }
      execute(query, params, callback, options) {
        params instanceof Function && (options = callback, callback = params, params = void 0);
        var self = this;
        return self.connection.startTransaction(function(err, transaction) {
          if (err || !transaction) {
            (0, callback_1.doError)(err, callback);
            return;
          }
          transaction.execute(query, params, function(err2, result, meta, isSelect) {
            if (err2) {
              transaction.rollback(function() {
                (0, callback_1.doError)(err2, callback);
              });
              return;
            }
            transaction.commit(function(err3) {
              callback && callback(err3, result, meta, isSelect);
            });
          }, options);
        }), self;
      }
      /**
       * Bulk-execute `query` once per row via the Firebird 4 batch API
       * (protocol 16+) with all-or-nothing semantics: the batch runs in its
       * own transaction, committed only when every record succeeded and
       * rolled back otherwise. On failure the error of the first failed
       * record is reported, with the full completion attached as
       * err.batchCompletion. Use transaction.executeBatch for partial-success
       * handling.
       */
      executeBatch(query, rows, callback, options) {
        var self = this;
        return self.connection.startTransaction(function(err, transaction) {
          if (err || !transaction) {
            (0, callback_1.doError)(err, callback);
            return;
          }
          transaction.executeBatch(query, rows, function(err2, result) {
            if (err2 || !result) {
              transaction.rollback(function() {
                (0, callback_1.doError)(err2, callback);
              });
              return;
            }
            if (!result.success) {
              transaction.rollback(function() {
                (0, callback_1.doError)((0, utils_1.batchResultToError)(result), callback);
              });
              return;
            }
            transaction.commit(function(err3) {
              callback && callback(err3, result);
            });
          }, options);
        }), self;
      }
      sequentially(query, params, on, callback, options = {}) {
        if (params instanceof Function && (options = callback, callback = on, on = params, params = void 0), on === void 0)
          throw new Error('Expected "on" delegate.');
        callback instanceof Boolean && (options = callback, callback = void 0);
        var self = this, keyResolutionDone = !1, resolvedNest, resolvedTransform, _on = function(row, i, meta, next) {
          var done = !1, finish = function(err) {
            done || (done = !0, next(err));
          };
          keyResolutionDone || (resolvedNest = (0, xsqlvar_1.resolveNestTables)(options, self.connection.options), resolvedTransform = (0, xsqlvar_1.resolveKeyTransform)(options, self.connection.options), keyResolutionDone = !0), fetchBlobSyncRow(row, meta, resolvedNest, self.connection._lowercase_keys, resolvedTransform, function(blobErr) {
            if (blobErr) {
              finish(blobErr);
              return;
            }
            try {
              var ret;
              on.length >= 3 ? ret = on(row, i, finish) : ret = on(row, i), ret && typeof ret.then == "function" ? ret.then(function() {
                finish();
              }).catch(finish) : on.length < 3 && finish();
            } catch (err) {
              finish(err);
            }
          });
        };
        return typeof options == "boolean" ? options = { asObject: !options, asStream: !0, on: _on } : options = {
          asObject: !0,
          asStream: !0,
          on: _on,
          ...options
        }, self.execute(query, params, callback, options), self;
      }
      /**
       * Run `query` and return an object-mode Readable emitting one row per
       * chunk (what pg-query-stream / mysql2 .stream() return), with real
       * backpressure: fetching pauses while the stream buffer is full. Runs
       * in its own transaction, like db.query. Destroying the stream early
       * (e.g. a pipeline() teardown) aborts the fetch and releases the
       * statement. Rows go through the regular decode path, so typeCast,
       * blobAsText and jsonAsObject all apply.
       */
      queryStream(query, params, options) {
        return (0, query_stream_1.default)(this, query, params, options);
      }
      /**
       * Bulk-insert Writable (the COPY FROM analogue, Firebird 4.0+): write
       * parameter-array rows, they are flushed in chunks through the batch
       * API on one prepared statement. Runs its own transaction — committed
       * on finish, rolled back on error/destroy (all-or-nothing for the
       * whole stream). BLOB columns accept Buffers/strings. After 'finish',
       * stream.recordCount / stream.affectedRows carry the totals.
       */
      batchStream(query, options) {
        return (0, batch_stream_1.default)(this, query, options, !0);
      }
      query(query, params, callback, options = {}) {
        params instanceof Function && (options = callback || {}, callback = params, params = void 0), options = {
          asObject: !0,
          asStream: callback == null,
          ...options
        };
        var self = this;
        return self.execute(query, params, callback, options), self;
      }
      drop(callback) {
        return this.connection.dropDatabase(callback);
      }
      /**
       * Cancel the operation currently executing on this connection by sending
       * an out-of-band op_cancel (Firebird 2.5+ / protocol 12+). The cancelled
       * operation fails through its own callback with err.gdscode ===
       * GDSCode.CANCELLED. `kind` defaults to fb_cancel_raise; cancellation is
       * per-attachment, not per-statement.
       */
      cancel(kind, callback) {
        return typeof kind == "function" && (callback = kind, kind = void 0), this.connection.cancelOperation(kind, callback), this;
      }
      attachEvent(callback) {
        var self = this;
        let eventid = self.eventid++, completed = !1, complete = function(err, manager) {
          completed || (completed = !0, callback(err, manager));
        };
        return process.env.FIREBIRD_DEBUG && console.log("[fb-debug] Database.attachEvent: calling auxConnection, eventid=%d queue=%d", eventid, self.connection._queue.length), this.connection.auxConnection(eventid, function(err, socket_info) {
          if (err) {
            process.env.FIREBIRD_DEBUG && console.log("[fb-debug] Database.attachEvent: auxConnection error:", err.message), (0, callback_1.doError)(err, complete);
            return;
          }
          process.env.FIREBIRD_DEBUG && console.log("[fb-debug] Database.attachEvent: auxConnection ok, connecting to aux port %s:%d", socket_info.host, socket_info.port);
          let host = (0, utils_1.resolveEventHost)(self.connection.options, socket_info.host), eventConnection = new eventConnection_1.default(host, socket_info.port, function(err2) {
            if (err2) {
              process.env.FIREBIRD_DEBUG && console.log("[fb-debug] Database.attachEvent: EventConnection error:", err2.message), (0, callback_1.doError)(err2, complete);
              return;
            }
            process.env.FIREBIRD_DEBUG && console.log("[fb-debug] Database.attachEvent: EventConnection connected, creating FbEventManager eventid=%d", eventid);
            let evt = new fbEventManager_1.default(self, eventConnection, eventid, function(err3) {
              if (err3) {
                (0, callback_1.doError)(err3, complete);
                return;
              }
              process.env.FIREBIRD_DEBUG && console.log("[fb-debug] Database.attachEvent: FbEventManager ready, eventid=%d", evt.eventid), complete(err3, evt);
            });
          }, self);
        }), this;
      }
      /**
       * Create a physical tablespace.
       * Supported in Firebird 6.0+ (Protocol 20+).
       *
       * @param {string} name - The name of the tablespace.
       * @param {string} filePath - The physical file path for the tablespace.
       * @param {function} [callback] - Asynchronous completion callback.
       * @returns {Database}
       */
      createTablespace(name, filePath, callback) {
        let sql = `CREATE TABLESPACE ${name} FILE '${filePath}'`;
        return this.execute(sql, [], callback);
      }
      /**
       * Alter an existing tablespace physical location.
       * Supported in Firebird 6.0+ (Protocol 20+).
       *
       * @param {string} name - The name of the tablespace.
       * @param {string} filePath - The new physical file path.
       * @param {function} [callback] - Asynchronous completion callback.
       * @returns {Database}
       */
      alterTablespace(name, filePath, callback) {
        let sql = `ALTER TABLESPACE ${name} SET FILE TO '${filePath}'`;
        return this.execute(sql, [], callback);
      }
      /**
       * Drop a tablespace.
       * Supported in Firebird 6.0+ (Protocol 20+).
       *
       * @param {string} name - The name of the tablespace.
       * @param {function} [callback] - Asynchronous completion callback.
       * @returns {Database}
       */
      dropTablespace(name, callback) {
        let sql = `DROP TABLESPACE ${name}`;
        return this.execute(sql, [], callback);
      }
      /**
       * Create a schema/namespace. Can optionally partition/map the namespace
       * to a physical tablespace.
       * Supported in Firebird 6.0+ (Protocol 20+).
       *
       * @param {string} schemaName - The name of the schema.
       * @param {string} [tablespaceName] - Optional tablespace name to bind this schema namespace.
       * @param {function} [callback] - Asynchronous completion callback.
       * @returns {Database}
       */
      createSchema(schemaName, tablespaceName, callback) {
        typeof tablespaceName == "function" && (callback = tablespaceName, tablespaceName = void 0);
        let sql = `CREATE SCHEMA ${schemaName}`;
        return tablespaceName && (sql += ` TABLESPACE ${tablespaceName}`), this.execute(sql, [], callback);
      }
      /*
       * Promise / async-await API.
       * Each *Async method wraps its callback counterpart; the callback API
       * stays untouched. The promises resolve with the rows alone unless
       * { withMeta: true } is passed, which resolves the full
       * { rows, fields, affectedRows, recordCounts, warnings } result.
       */
      queryAsync(query, params, options) {
        var self = this;
        return (0, callback_1.fromCallback)(function(cb) {
          self.query(query, params, cb, options);
        });
      }
      executeAsync(query, params, options) {
        var self = this;
        return (0, callback_1.fromCallback)(function(cb) {
          self.execute(query, params, cb, options);
        });
      }
      executeBatchAsync(query, rows, options) {
        var self = this;
        return (0, callback_1.fromCallback)(function(cb) {
          self.executeBatch(query, rows, cb, options);
        });
      }
      /** `on` may hold the options when the params argument is the row callback
       *  (public overload: sequentiallyAsync(query, rowCallback, options)). */
      sequentiallyAsync(query, params, on, options) {
        params instanceof Function && (options = on, on = params, params = void 0);
        var self = this;
        return (0, callback_1.fromCallback)(function(cb) {
          self.sequentially(query, params, on, cb, options);
        });
      }
      transactionAsync(options) {
        var self = this;
        return (0, callback_1.fromCallback)(function(cb) {
          self.startTransaction(options, cb);
        });
      }
      startTransactionAsync(options) {
        return this.transactionAsync(options);
      }
      newStatementAsync(query) {
        var self = this;
        return (0, callback_1.fromCallback)(function(cb) {
          self.newStatement(query, cb);
        });
      }
      detachAsync(force) {
        var self = this;
        return (0, callback_1.fromCallback)(function(cb) {
          self.detach(cb, force);
        });
      }
      dropAsync() {
        var self = this;
        return (0, callback_1.fromCallback)(function(cb) {
          self.drop(cb);
        });
      }
      attachEventAsync() {
        var self = this;
        return (0, callback_1.fromCallback)(function(cb) {
          self.attachEvent(cb);
        });
      }
      cancelAsync(kind) {
        var self = this;
        return (0, callback_1.fromCallback)(function(cb) {
          self.cancel(kind, cb);
        });
      }
      /**
       * Run `work` inside a transaction: commits when the returned promise
       * resolves, rolls back when it rejects (the original error is rethrown,
       * even if the rollback itself fails).
       */
      async withTransaction(work, options) {
        let transaction = await this.transactionAsync(options);
        try {
          let result = await work(transaction);
          return await (0, callback_1.fromCallback)(function(cb) {
            transaction.commit(cb);
          }), result;
        } catch (err) {
          try {
            await (0, callback_1.fromCallback)(function(cb) {
              transaction.rollback(cb);
            });
          } catch {
          }
          throw err;
        }
      }
    };
    module2.exports = Database;
  }
});

// node_modules/node-firebird/lib/named-params.js
var require_named_params = __commonJS({
  "node_modules/node-firebird/lib/named-params.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: !0 });
    exports2.parseNamedPlaceholders = parseNamedPlaceholders;
    exports2.isNamedParamsObject = isNamedParamsObject;
    exports2.bindNamedParams = bindNamedParams;
    var IDENT_START = /[A-Za-z_]/, IDENT_PART = /[A-Za-z0-9_$]/, CACHE_MAX = 100, cache = /* @__PURE__ */ new Map();
    function parseNamedPlaceholders(sql) {
      var cached = cache.get(sql);
      if (cached)
        return cached;
      for (var out = "", names = [], i = 0, n = sql.length; i < n; ) {
        var c = sql[i];
        if (c === "'" || c === '"') {
          for (var quote = c, end = i + 1; end < n; ) {
            if (sql[end] === quote) {
              if (sql[end + 1] === quote) {
                end += 2;
                continue;
              }
              end++;
              break;
            }
            end++;
          }
          out += sql.slice(i, end), i = end;
        } else if (c === "-" && sql[i + 1] === "-") {
          var eol = sql.indexOf(`
`, i);
          eol === -1 && (eol = n), out += sql.slice(i, eol), i = eol;
        } else if (c === "/" && sql[i + 1] === "*") {
          var close = sql.indexOf("*/", i + 2);
          close = close === -1 ? n : close + 2, out += sql.slice(i, close), i = close;
        } else if ((c === "q" || c === "Q") && sql[i + 1] === "'" && i + 2 < n && (i === 0 || !IDENT_PART.test(sql[i - 1]))) {
          var open = sql[i + 2], closer = open === "(" ? ")" : open === "[" ? "]" : open === "{" ? "}" : open === "<" ? ">" : open, stop = sql.indexOf(closer + "'", i + 3);
          stop = stop === -1 ? n : stop + 2, out += sql.slice(i, stop), i = stop;
        } else if (c === ":" && i + 1 < n && IDENT_START.test(sql[i + 1])) {
          for (var end2 = i + 2; end2 < n && IDENT_PART.test(sql[end2]); )
            end2++;
          names.push(sql.slice(i + 1, end2)), out += "?", i = end2;
        } else
          out += c, i++;
      }
      var result = names.length ? { sql: out, names } : { sql, names: null };
      return cache.size >= CACHE_MAX && cache.delete(cache.keys().next().value), cache.set(sql, result), result;
    }
    function isNamedParamsObject(params) {
      return params !== null && typeof params == "object" && !Array.isArray(params) && !Buffer.isBuffer(params) && !(params instanceof Date);
    }
    function bindNamedParams(names, params) {
      var missing = [], values = names.map(function(name) {
        return Object.prototype.hasOwnProperty.call(params, name) || missing.push(name), params[name];
      });
      if (missing.length)
        throw new Error("Missing value for named placeholder(s): " + missing.join(", "));
      return values;
    }
  }
});

// node_modules/node-firebird/lib/wire/statement.js
var require_statement = __commonJS({
  "node_modules/node-firebird/lib/wire/statement.js"(exports2, module2) {
    "use strict";
    var callback_1 = require_callback(), named_params_1 = require_named_params(), Statement = class {
      constructor(connection) {
        this.connection = connection;
      }
      close(callback) {
        this.connection.closeStatement(this, callback);
      }
      drop(callback) {
        this.connection.dropStatement(this, callback);
      }
      release(callback) {
        this.connection.releaseStatement(this, callback);
      }
      execute(transaction, params, callback, options) {
        if (params instanceof Function && (options = callback, callback = params, params = void 0), this.namedParams && (0, named_params_1.isNamedParamsObject)(params))
          try {
            params = (0, named_params_1.bindNamedParams)(this.namedParams, params);
          } catch (err) {
            (0, callback_1.doError)(err, callback);
            return;
          }
        this.options = options, this.connection.executeStatement(transaction, this, params, callback, options);
      }
      fetch(transaction, count, callback) {
        this.connection.fetch(this, transaction, count, callback);
      }
      fetchScroll(transaction, direction, offset, count, callback) {
        typeof count == "function" && (callback = count, count = void 0), typeof offset == "function" && (callback = offset, offset = void 0, count = void 0), this.connection.fetchScroll(this, transaction, direction, offset, count, callback);
      }
      fetchAll(transaction, callback) {
        this.connection.fetchAll(this, transaction, callback);
      }
      /**
       * Execute this statement once per row via the Firebird 4 batch API
       * (protocol 16+). `rows` is an array of parameter arrays — or, when the
       * statement was prepared with named placeholders, of values-by-name
       * objects (the two forms can be mixed).
       */
      executeBatch(transaction, rows, callback, options) {
        var names = this.namedParams;
        if (names && Array.isArray(rows))
          try {
            rows = rows.map(function(row) {
              return (0, named_params_1.isNamedParamsObject)(row) ? (0, named_params_1.bindNamedParams)(names, row) : row;
            });
          } catch (err) {
            (0, callback_1.doError)(err, callback);
            return;
          }
        this.connection.executeBatch(transaction, this, rows, callback, options);
      }
      /* Promise / async-await API — wrappers over the callback methods above. */
      executeAsync(transaction, params, options) {
        var self = this;
        return (0, callback_1.fromCallback)(function(cb) {
          self.execute(transaction, params, cb, options);
        });
      }
      executeBatchAsync(transaction, rows, options) {
        var self = this;
        return (0, callback_1.fromCallback)(function(cb) {
          self.executeBatch(transaction, rows, cb, options);
        });
      }
      fetchAsync(transaction, count) {
        var self = this;
        return (0, callback_1.fromCallback)(function(cb) {
          self.fetch(transaction, count, cb);
        });
      }
      fetchScrollAsync(transaction, direction, offset, count) {
        var self = this;
        return (0, callback_1.fromCallback)(function(cb) {
          self.fetchScroll(transaction, direction, offset, count, cb);
        });
      }
      fetchAllAsync(transaction) {
        var self = this;
        return (0, callback_1.fromCallback)(function(cb) {
          self.fetchAll(transaction, cb);
        });
      }
      closeAsync() {
        var self = this;
        return (0, callback_1.fromCallback)(function(cb) {
          self.close(cb);
        });
      }
      dropAsync() {
        var self = this;
        return (0, callback_1.fromCallback)(function(cb) {
          self.drop(cb);
        });
      }
      releaseAsync() {
        var self = this;
        return (0, callback_1.fromCallback)(function(cb) {
          self.release(cb);
        });
      }
    };
    module2.exports = Statement;
  }
});

// node_modules/node-firebird/lib/wire/transaction.js
var require_transaction = __commonJS({
  "node_modules/node-firebird/lib/wire/transaction.js"(exports2, module2) {
    "use strict";
    var __importDefault = exports2 && exports2.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { default: mod };
    }, callback_1 = require_callback(), named_params_1 = require_named_params(), utils_1 = require_utils(), const_1 = __importDefault(require_const()), sql_template_1 = require_sql_template(), xsqlvar_1 = require_xsqlvar(), query_stream_1 = __importDefault(require_query_stream()), batch_stream_1 = __importDefault(require_batch_stream());
    function abortError(signal) {
      if (signal && signal.reason instanceof Error)
        return signal.reason;
      var err = new Error("The operation was aborted");
      return err.name = "AbortError", err.code = "ABORT_ERR", err;
    }
    function hookAbortSignal(connection, signal, callback) {
      var settled = !1, onAbort = function() {
        settled || connection.cancelOperation(const_1.default.fb_cancel_raise);
      };
      return signal.addEventListener("abort", onAbort, { once: !0 }), function(err, result, meta, isSelect) {
        settled = !0, signal.removeEventListener("abort", onAbort), callback && callback(err, result, meta, isSelect);
      };
    }
    var Transaction = class {
      constructor(connection) {
        this._savepointDepth = 0, this.connection = connection, this.db = connection.db;
      }
      /**
       * Tagged-template query API: tx.sql`SELECT ... ${value}` (see README).
       * Built lazily — transactions are created per-query internally, and
       * those throwaway instances must not pay for the tag. The compiled text
       * is positional-only, so the namedPlaceholders rewriter is disabled:
       * any `:token` in the template is PSQL (EXECUTE BLOCK), not a
       * placeholder.
       */
      get sql() {
        return this._sql || (this._sql = (0, sql_template_1.makeSqlTag)((text, params, options) => this.queryAsync(text, params, { ...options, namedPlaceholders: !1 })));
      }
      /**
       * Run `work` inside a savepoint (Firebird 1.5+): on resolve the
       * savepoint is released, on reject the transaction rolls back TO the
       * savepoint — undoing only work's changes — and the error is rethrown,
       * leaving the transaction itself usable. Nestable (each call generates
       * a fresh NF_SP_n name), mirroring db.withTransaction's style and
       * Postgres.js's sql.savepoint().
       *
       * Do NOT run sibling savepoints concurrently on one transaction
       * (Promise.all): Firebird's RELEASE SAVEPOINT also releases every
       * savepoint created after it, so interleaved siblings release each
       * other. Nested (awaited) savepoints are fine.
       */
      async savepoint(work) {
        if (typeof work != "function")
          throw new Error("savepoint(work) expects a function");
        let name = "NF_SP_" + ++this._savepointDepth;
        try {
          await this.queryAsync("SAVEPOINT " + name);
          let result;
          try {
            result = await work(this);
          } catch (err) {
            try {
              await this.queryAsync("ROLLBACK TO SAVEPOINT " + name);
            } catch (rollbackErr) {
              err && typeof err == "object" && (err.savepointRollbackError = rollbackErr);
            }
            throw err;
          }
          return await this.queryAsync("RELEASE SAVEPOINT " + name), result;
        } finally {
          this._savepointDepth--;
        }
      }
      /** Per-call options.namedPlaceholders overrides the connection option. */
      namedPlaceholdersEnabled(options) {
        return options && options.namedPlaceholders !== void 0 ? !!options.namedPlaceholders : !!(this.connection.options && this.connection.options.namedPlaceholders);
      }
      newStatement(query, callback, options) {
        var cnx = this.connection, self = this, cb = callback, names = null;
        if (this.namedPlaceholdersEnabled(options)) {
          var parsed = (0, named_params_1.parseNamedPlaceholders)(query);
          parsed.names && (query = parsed.sql, names = parsed.names);
        }
        var deliver = function(err, statement) {
          statement && (statement.namedParams = names), cb(err, statement);
        }, query_cache = cnx.takeCachedStatement(query);
        query_cache ? deliver(null, query_cache) : cnx.prepare(self, query, !1, deliver);
      }
      execute(query, params, callback, options) {
        params instanceof Function && (options = callback, callback = params, params = void 0);
        var signal = options && options.signal;
        if (signal) {
          if (signal.aborted) {
            (0, callback_1.doError)(abortError(signal), callback);
            return;
          }
          callback = hookAbortSignal(this.connection, signal, callback);
        }
        var self = this;
        this.newStatement(query, function(err, statement) {
          if (err || !statement) {
            (0, callback_1.doError)(err, callback);
            return;
          }
          function dropError(err2) {
            statement._failed = !0, statement.release(), (0, callback_1.doCallback)(err2, callback);
          }
          statement.execute(self, params, function(err2, ret) {
            if (err2) {
              dropError(err2);
              return;
            }
            var withMeta = !!(options && typeof options == "object" && options.withMeta && !options.asStream);
            function deliver(rows, isSelect, plainDml) {
              if (!withMeta) {
                statement.release(), callback && (plainDml ? callback() : callback(void 0, rows, statement.output, isSelect));
                return;
              }
              var execWarnings = ret && ret.warnings || [], finalize = function(counts) {
                if (statement.release(), !!callback) {
                  var affectedRows = counts ? counts.insertCount + counts.updateCount + counts.deleteCount : Array.isArray(rows) ? rows.length : rows !== void 0 ? 1 : 0;
                  callback(void 0, {
                    rows,
                    fields: (0, xsqlvar_1.describeFields)(statement.output),
                    affectedRows,
                    recordCounts: counts,
                    warnings: execWarnings
                  }, statement.output, isSelect);
                }
              }, t = statement.type, isDml = t === const_1.default.isc_info_sql_stmt_insert || t === const_1.default.isc_info_sql_stmt_update || t === const_1.default.isc_info_sql_stmt_delete || t === const_1.default.isc_info_sql_stmt_exec_procedure;
              if (!isDml) {
                finalize();
                return;
              }
              self.connection.statementInfo(statement, const_1.default.RECORDS_INFO, function(err3, info) {
                if (err3) {
                  dropError(err3);
                  return;
                }
                finalize((0, xsqlvar_1.parseRecordCounts)(info && info.buffer));
              });
            }
            switch (statement.type) {
              case const_1.default.isc_info_sql_stmt_select:
                statement.fetchAll(self, function(err3, r) {
                  if (err3) {
                    dropError(err3);
                    return;
                  }
                  deliver(r, !0);
                });
                break;
              case const_1.default.isc_info_sql_stmt_exec_procedure:
                if (ret && ret.data && ret.data.length > 0) {
                  self.connection.resolveTextBlobs(self, ret, function(blobErr) {
                    if (blobErr) {
                      dropError(blobErr);
                      return;
                    }
                    deliver(ret.data[0], !0);
                  });
                  break;
                } else if (statement.output.length) {
                  statement.fetch(self, 1, function(err3, fret) {
                    if (err3) {
                      dropError(err3);
                      return;
                    }
                    self.connection.resolveTextBlobs(self, fret, function(blobErr) {
                      if (blobErr) {
                        dropError(blobErr);
                        return;
                      }
                      deliver(fret.data[0], !1);
                    });
                  });
                  break;
                }
              // Fall through is normal
              default:
                deliver(void 0, !1, !0);
                break;
            }
          }, options);
        }, options);
      }
      sequentially(query, params, on, callback, options = {}) {
        if (params instanceof Function && (options = callback, callback = on, on = params, params = void 0), on === void 0)
          throw new Error('Expected "on" delegate.');
        callback instanceof Boolean && (options = callback, callback = void 0);
        var self = this, _on = function(row, i, meta, next) {
          var done = !1, finish = function(err) {
            done || (done = !0, next(err));
          };
          try {
            var ret;
            on.length >= 3 ? ret = on(row, i, finish) : ret = on(row, i), ret && typeof ret.then == "function" ? ret.then(function() {
              finish();
            }).catch(finish) : on.length < 3 && finish();
          } catch (err) {
            finish(err);
          }
        };
        return typeof options == "boolean" ? options = { asObject: !options, asStream: !0, on: _on } : options = {
          asStream: !0,
          asObject: !0,
          on: _on,
          ...options
        }, self.execute(query, params, callback, options), self;
      }
      /**
       * Run `query` inside this transaction and return an object-mode
       * Readable emitting one row per chunk, with real backpressure (see
       * Database.queryStream). The transaction is NOT committed when the
       * stream ends — commit or roll back yourself.
       */
      queryStream(query, params, options) {
        return (0, query_stream_1.default)(this, query, params, options);
      }
      /**
       * Bulk-insert Writable running inside this transaction (see
       * Database.batchStream). The transaction is NOT committed or rolled
       * back by the stream — settle it yourself after 'finish'/'error'.
       */
      batchStream(query, options) {
        return (0, batch_stream_1.default)(this, query, options, !1);
      }
      query(query, params, callback, options = {}) {
        params instanceof Function && (callback = params, params = void 0), callback === void 0 && (callback = utils_1.noop), options = {
          asObject: !0,
          asStream: callback == null,
          ...options
        }, this.execute(query, params, callback, options);
      }
      /**
       * Execute `query` once per row in `rows` using the Firebird 4 batch API
       * (protocol 16+, single network flush). The callback receives a
       * completion object: { recordCount, updateCounts, errors:
       * [{recordNumber, error}], errorRecordNumbers, success }. Per-record
       * failures do NOT roll anything back here — inspect the completion and
       * commit or roll back yourself (or use db.executeBatch for
       * all-or-nothing semantics).
       */
      executeBatch(query, rows, callback, options) {
        var self = this;
        this.newStatement(query, function(err, statement) {
          if (err || !statement) {
            (0, callback_1.doError)(err, callback);
            return;
          }
          statement.executeBatch(self, rows, function(err2, result) {
            err2 && (statement._failed = !0), statement.release(), callback && callback(err2, result);
          }, options);
        }, options);
      }
      executeBatchAsync(query, rows, options) {
        var self = this;
        return (0, callback_1.fromCallback)(function(cb) {
          self.executeBatch(query, rows, cb, options);
        });
      }
      commit(callback) {
        this.connection.commit(this, callback);
      }
      rollback(callback) {
        this.connection.rollback(this, callback);
      }
      commitRetaining(callback) {
        this.connection.commitRetaining(this, callback);
      }
      rollbackRetaining(callback) {
        this.connection.rollbackRetaining(this, callback);
      }
      /* Promise / async-await API — wrappers over the callback methods above. */
      queryAsync(query, params, options) {
        var self = this;
        return (0, callback_1.fromCallback)(function(cb) {
          self.query(query, params, cb, options);
        });
      }
      executeAsync(query, params, options) {
        var self = this;
        return (0, callback_1.fromCallback)(function(cb) {
          self.execute(query, params, cb, options);
        });
      }
      sequentiallyAsync(query, params, on, options) {
        params instanceof Function && (options = on, on = params, params = void 0);
        var self = this;
        return (0, callback_1.fromCallback)(function(cb) {
          self.sequentially(query, params, on, cb, options);
        });
      }
      newStatementAsync(query) {
        var self = this;
        return (0, callback_1.fromCallback)(function(cb) {
          self.newStatement(query, cb);
        });
      }
      commitAsync() {
        var self = this;
        return (0, callback_1.fromCallback)(function(cb) {
          self.commit(cb);
        });
      }
      rollbackAsync() {
        var self = this;
        return (0, callback_1.fromCallback)(function(cb) {
          self.rollback(cb);
        });
      }
      commitRetainingAsync() {
        var self = this;
        return (0, callback_1.fromCallback)(function(cb) {
          self.commitRetaining(cb);
        });
      }
      rollbackRetainingAsync() {
        var self = this;
        return (0, callback_1.fromCallback)(function(cb) {
          self.rollbackRetaining(cb);
        });
      }
    };
    module2.exports = Transaction;
  }
});

// node_modules/node-firebird/lib/wire/socket.js
var require_socket = __commonJS({
  "node_modules/node-firebird/lib/wire/socket.js"(exports2, module2) {
    "use strict";
    var __importDefault = exports2 && exports2.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { default: mod };
    }, net_1 = __importDefault(require("net")), zlib_1 = __importDefault(require("zlib")), crypto_1 = __importDefault(require("crypto")), Arc4 = class {
      constructor(key) {
        this._s = new Uint8Array(256), this._i = 0, this._j = 0;
        for (var i = 0; i < 256; i++)
          this._s[i] = i;
        for (var j = 0, i = 0; i < 256; i++) {
          j = j + this._s[i] + key[i % key.length] & 255;
          var tmp = this._s[i];
          this._s[i] = this._s[j], this._s[j] = tmp;
        }
      }
      /**
       * Transform (encrypt/decrypt) data in place.
       * RC4 is symmetric - encrypt and decrypt are the same operation.
       */
      transform(data) {
        for (var out = Buffer.alloc(data.length), n = 0; n < data.length; n++) {
          this._i = this._i + 1 & 255, this._j = this._j + this._s[this._i] & 255;
          var tmp = this._s[this._i];
          this._s[this._i] = this._s[this._j], this._s[this._j] = tmp;
          var k = this._s[this._s[this._i] + this._s[this._j] & 255];
          out[n] = data[n] ^ k;
        }
        return out;
      }
    }, ChaChaCipher = class {
      constructor(key, iv, ivlen, isEncrypt) {
        let opensslIv = Buffer.alloc(16);
        if (ivlen === 8)
          iv.copy(opensslIv, 8, 0, 8);
        else if (ivlen === 16) {
          let ctr = (iv[12] << 24) + (iv[13] << 16) + (iv[14] << 8) + iv[15];
          opensslIv.writeUInt32LE(ctr, 0), iv.copy(opensslIv, 4, 0, 12);
        } else if (ivlen === 12)
          iv.copy(opensslIv, 4, 0, 12);
        else
          throw new Error("Wrong IV length: " + ivlen);
        isEncrypt ? this._cipher = crypto_1.default.createCipheriv("chacha20", key, opensslIv) : this._cipher = crypto_1.default.createDecipheriv("chacha20", key, opensslIv);
      }
      transform(data) {
        return this._cipher.update(data);
      }
    }, Socket = class {
      static {
        this.Arc4 = Arc4;
      }
      constructor(port, host, enableKeepAlive = !0, keepAliveInitialDelay = 6e4, ipFamily) {
        return this.compress = !1, this._socket = net_1.default.createConnection({ port, host, family: ipFamily || 0 }), this._socket.setNoDelay(!0), this._socket.setKeepAlive(enableKeepAlive, keepAliveInitialDelay), this.compressor = null, this.compressorBuffer = [], this.decompressor = null, this.decompressorBuffer = [], this.buffer = null, this.encrypt = !1, this.encryptCipher = null, this.decryptCipher = null, new Proxy(this._socket, this);
      }
      /**
       * Decompress and/or decrypt data when received.
       * Override on data event.
       */
      on(event, cb) {
        if (event === "data") {
          let mainCb = cb;
          cb = (data) => {
            this.encrypt && (data = this.decryptCipher.transform(data), process.env.FIREBIRD_DEBUG && (console.log("[fb-debug] socket.read decrypted: length=%d RX-cipher-offset=%d", data.length, this.decryptCipher._i), console.log("[fb-debug] socket.read decrypted hex: %s", data.toString("hex")))), this.compress ? this.decompressor.write(data, () => {
              mainCb(Buffer.concat(this.decompressorBuffer)), this.decompressorBuffer = [];
            }) : mainCb(data);
          };
        }
        this._socket.on(event, cb);
      }
      /**
       * Compress and/or encrypt data before sending to socket.
       */
      write(data, defer = !1) {
        if (data = Buffer.from(data), process.env.FIREBIRD_DEBUG && console.log("[fb-debug] socket.write: length=%d bytes=%s encrypt=%s defer=%s", data.length, data.toString("hex"), this.encrypt, defer), defer) {
          this.buffer = this.buffer ? Buffer.concat([this.buffer, data]) : data;
          return;
        }
        if (!defer && this.buffer && (data = Buffer.concat([this.buffer, data]), this.buffer = null), this.compress)
          this.compressor.write(data, () => {
            var compressedData = Buffer.concat(this.compressorBuffer);
            this.compressorBuffer = [], this.encrypt && (compressedData = this.encryptCipher.transform(compressedData)), this._socket.write(compressedData);
          });
        else if (this.encrypt) {
          let out = this.encryptCipher.transform(data);
          process.env.FIREBIRD_DEBUG && console.log("[fb-debug] socket.write encrypted: length=%d TX-cipher-offset=%d", out.length, this.encryptCipher._i), this._socket.write(out);
        } else
          this._socket.write(data);
      }
      /**
       * Enable compression/decompression on the fly.
       */
      enableCompression() {
        this.compress = !0, this.decompressor = zlib_1.default.createInflate(), this.decompressor.on("data", (inflate) => {
          this.decompressorBuffer.push(inflate);
        }), this.compressor = zlib_1.default.createDeflate({
          flush: zlib_1.default.constants.Z_FULL_FLUSH,
          finishFlush: zlib_1.default.constants.Z_SYNC_FLUSH
        }), this.compressor.on("data", (deflate) => {
          this.compressorBuffer.push(deflate);
        });
      }
      /**
       * Enable encryption/decryption.
       * @param {Buffer} sessionKey - The session key from SRP authentication.
       * @param {string} [pluginName='Arc4'] - The selected encryption plugin.
       * @param {Buffer} [iv] - The initialization vector (needed for ChaCha/ChaCha64).
       */
      enableEncryption(sessionKey, pluginName = "Arc4", iv) {
        if (this.encrypt = !0, pluginName === "Arc4")
          this.encryptCipher = new Arc4(sessionKey), this.decryptCipher = new Arc4(sessionKey);
        else if (pluginName === "ChaCha" || pluginName === "ChaCha64") {
          let stretchedKey = crypto_1.default.createHash("sha256").update(sessionKey).digest(), ivlen = pluginName === "ChaCha64" ? 8 : iv ? iv.length : 16;
          this.encryptCipher = new ChaChaCipher(stretchedKey, iv, ivlen, !0), this.decryptCipher = new ChaChaCipher(stretchedKey, iv, ivlen, !1);
        } else
          throw new Error("Unsupported encryption plugin: " + pluginName);
      }
      /**
       * Proxy trap.
       */
      get(target, field) {
        return field in this ? this[field].bind(this) : typeof target[field] == "function" ? target[field].bind(target) : target[field];
      }
    };
    module2.exports = Socket;
  }
});

// node_modules/node-firebird/lib/wire/connection.js
var require_connection = __commonJS({
  "node_modules/node-firebird/lib/wire/connection.js"(exports2, module2) {
    "use strict";
    var __createBinding = exports2 && exports2.__createBinding || (Object.create ? function(o, m, k, k2) {
      k2 === void 0 && (k2 = k);
      var desc = Object.getOwnPropertyDescriptor(m, k);
      (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) && (desc = { enumerable: !0, get: function() {
        return m[k];
      } }), Object.defineProperty(o, k2, desc);
    } : function(o, m, k, k2) {
      k2 === void 0 && (k2 = k), o[k2] = m[k];
    }), __setModuleDefault = exports2 && exports2.__setModuleDefault || (Object.create ? function(o, v) {
      Object.defineProperty(o, "default", { enumerable: !0, value: v });
    } : function(o, v) {
      o.default = v;
    }), __importStar = exports2 && exports2.__importStar || /* @__PURE__ */ function() {
      var ownKeys = function(o) {
        return ownKeys = Object.getOwnPropertyNames || function(o2) {
          var ar = [];
          for (var k in o2) Object.prototype.hasOwnProperty.call(o2, k) && (ar[ar.length] = k);
          return ar;
        }, ownKeys(o);
      };
      return function(mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) k[i] !== "default" && __createBinding(result, mod, k[i]);
        return __setModuleDefault(result, mod), result;
      };
    }(), __importDefault = exports2 && exports2.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { default: mod };
    }, events_1 = __importDefault(require("events")), os_1 = __importDefault(require("os")), path_1 = __importDefault(require("path")), serialize_1 = require_serialize(), callback_1 = require_callback(), srp = __importStar(require_srp()), crypt = __importStar(require_unix_crypt()), const_1 = __importDefault(require_const()), Xsql = __importStar(require_xsqlvar()), codepages_1 = require_codepages(), service_1 = __importDefault(require_service()), database_1 = __importDefault(require_database()), statement_1 = __importDefault(require_statement()), transaction_1 = __importDefault(require_transaction()), utils_1 = require_utils(), socket_1 = __importDefault(require_socket());
    function parseValueIfJson(value, options) {
      if (options && options.jsonAsObject && typeof value == "string" && (value.startsWith("{") || value.startsWith("[")))
        try {
          return JSON.parse(value);
        } catch {
        }
      return value;
    }
    function buildSchemaSearchPath(options) {
      var list = [];
      options.searchPath && (list = Array.isArray(options.searchPath) ? options.searchPath.slice() : String(options.searchPath).split(",").map(function(s) {
        return s.trim();
      }).filter(Boolean));
      var def = options.defaultSchema;
      return def && (list.length === 0 ? list = def === "PUBLIC" ? ["PUBLIC"] : [def, "PUBLIC"] : list = [def].concat(list.filter(function(s) {
        return s !== def;
      }))), list.length ? list.join(",") : null;
    }
    function statementCacheLimit(options) {
      let size = options && options.statementCacheSize;
      if (size && size > 0)
        return Math.floor(size);
      if (options && options.cacheQuery) {
        let legacy = options.maxCachedQuery;
        return legacy && legacy > 0 ? Math.floor(legacy) : 100;
      }
      return 0;
    }
    var SQL_TYPE_NAMES = Xsql.SQL_TYPE_NAMES;
    function textParam(options, value) {
      let codec = Xsql.resolveTextCodec(options), enc = Xsql.resolveTextEncoding(options);
      return !codec && enc === "utf8" ? new Xsql.SQLParamString(value) : new Xsql.SQLParamBuffer(Xsql.encodeConnectionText(options, value));
    }
    function applyTypeCast(options, meta, defaultValue) {
      let typeCast = options && options.typeCast;
      if (typeof typeCast != "function")
        return defaultValue;
      let column = Xsql.describeField(meta);
      try {
        return typeCast(column, function() {
          return defaultValue;
        });
      } catch (err) {
        return console.warn('[node-firebird] typeCast hook threw for column "%s" (%s): %s \u2014 using default value', column.alias || column.field, column.typeName, err && err.message), defaultValue;
      }
    }
    var Connection = class _Connection {
      constructor(host, port, callback, options, db, svc) {
        var self = this;
        this.db = db, this.svc = svc, this._msg = new serialize_1.XdrWriter(32), this._blr = new serialize_1.BlrWriter(32), this._queue = [], this._detachTimeout, this._detachCallback, this._detachAuto, this._socket = new socket_1.default(port, host, options.enableKeepAlive !== !1, options.keepAliveInitialDelay, options.ipFamily), this._pending = [], this._isOpened = !1, this._isClosed = !1, this._isDetach = !1, this._isUsed = !1, this._pooled = options.isPool || !1, options && !options.user && (options.user = const_1.default.DEFAULT_USER), options && !options.password && (options.password = const_1.default.DEFAULT_PASSWORD), options && options.blobChunkSize && options.blobChunkSize > 65535 && (options.blobChunkSize = 65535), options && options.blobReadChunkSize && options.blobReadChunkSize > 65535 && (options.blobReadChunkSize = 65535), this.options = options, this._bind_events(host, port, callback), this.error, this._retry_connection_id, this._retry_connection_interval = options.retryConnectionInterval || 1e3, this._statementCacheSize = statementCacheLimit(options), this._statementCache = this._statementCacheSize > 0 ? /* @__PURE__ */ new Map() : null, this._messageFile = options.messageFile || path_1.default.join(__dirname, "firebird.msg");
      }
      /**
       * Take an idle prepared statement for `query` out of the cache, or null.
       * The statement leaves the cache while in use, so concurrent callers of
       * the same query never share a server-side cursor — they simply prepare
       * a fresh statement and the spare is dropped when released.
       */
      takeCachedStatement(query) {
        let cache = this._statementCache;
        if (!cache)
          return null;
        let statement = cache.get(query);
        return statement ? (cache.delete(query), statement) : null;
      }
      /**
       * Return a statement after use. With the statement cache enabled the
       * statement goes back into the cache as most-recently-used (closing its
       * cursor but keeping the prepared handle), evicting the least-recently
       * used statement over the limit. Failed statements, DDL and spares for
       * an already-cached query are dropped instead.
       */
      releaseStatement(statement, callback) {
        let cache = this._statementCache;
        if (!(cache && statement.query && !statement._failed && statement.type !== const_1.default.isc_info_sql_stmt_ddl && !cache.has(statement.query))) {
          this.dropStatement(statement, callback);
          return;
        }
        for (cache.set(statement.query, statement); cache.size > this._statementCacheSize; ) {
          let oldestKey = cache.keys().next().value, oldest = cache.get(oldestKey);
          cache.delete(oldestKey), this.dropStatement(oldest, void 0);
        }
        this.closeStatement(statement, callback);
      }
      // Reject every request that is still awaiting a server response (e.g. a
      // transaction.commit() sent right before the server went away) instead of
      // leaving its callback to hang forever. Requests already in flight cannot
      // be transparently resumed on a reconnect: a fresh attach() hands out new
      // transaction/statement handles, so nothing the server sends back could
      // ever match a callback queued against the old connection.
      _rejectPending(err) {
        var queue = this._queue;
        this._queue = [], this._pending = [];
        for (var i = 0; i < queue.length; i++)
          (0, callback_1.doError)(err, queue[i]);
      }
      /**
       * Deliver a connection-level error to 'error' listeners — and ONLY to
       * listeners. Emitting an unlistened 'error' makes Node throw the error
       * object as an uncaught exception; for errors that originate in
       * background contexts (the reconnect timer, socket-level failures whose
       * operations are separately rejected via _rejectPending) that crashes
       * the process — or, under a test runner, fails whatever unrelated test
       * happens to be running. The failing operations themselves always
       * still receive their error through their own callbacks.
       */
      _emitError(err) {
        this.db && typeof this.db.listenerCount == "function" && this.db.listenerCount("error") > 0 ? this.db.emit("error", err) : process.env.FIREBIRD_DEBUG && console.warn("[fb-debug] connection error (no error listener):", err && err.message);
      }
      _bind_events(host, port, callback) {
        var self = this;
        self._socket.on("close", function() {
          if (!(!self._isOpened || self._isDetach)) {
            self._isOpened = !1, self._isClosed = !0;
            var lostError = self.error || new Error("Connection to Firebird server was lost.");
            if (!self.db) {
              self._rejectPending(lostError), callback && callback(self.error);
              return;
            }
            self._rejectPending(lostError), !(self.options && self.options.isPool) && (self._retry_connection_id = setTimeout(function() {
              self._socket.removeAllListeners(), self._socket = null;
              var ctx = new _Connection(host, port, function(err) {
                ctx.connect(self.options, function(err2) {
                  if (err2) {
                    self._emitError(err2);
                    return;
                  }
                  ctx.attach(self.options, function(err3) {
                    if (err3) {
                      self._emitError(err3);
                      return;
                    }
                    self.db.emit("reconnect");
                  }, self.db);
                }), Object.assign(self, ctx);
              }, self.options, self.db);
            }, self._retry_connection_interval));
          }
        }), self._socket.on("error", function(e) {
          self.error = e, self._emitError(e), callback && callback(e);
        }), self._socket.on("connect", function() {
          self._isClosed = !1, self._isOpened = !0, callback && callback();
        }), self._socket.on("data", function(data) {
          var xdr, hadSavedBuffer = !!self._xdr;
          for (self._xdr ? (xdr = new serialize_1.XdrReader(Buffer.concat([self._xdr.buffer, data], self._xdr.buffer.length + data.length)), delete self._xdr) : xdr = new serialize_1.XdrReader(data), process.env.FIREBIRD_DEBUG && console.log("[fb-debug] data event: bytes=%d queue=%d pending=%d xdr.pos=%d savedBuf=%s", xdr.buffer.length, self._queue.length, self._pending.length, xdr.pos, hadSavedBuffer); xdr.pos < xdr.buffer.length; ) {
            var cb = self._queue[0], pos = xdr.pos, lazySnapshot = cb ? cb.lazy_count : void 0;
            if (decodeResponse(xdr, cb, self, self._lowercase_keys, function(err, obj) {
              if (err) {
                err instanceof RangeError ? (xdr.buffer = xdr.buffer.slice(pos), xdr.pos = 0, self._xdr = xdr, process.env.FIREBIRD_DEBUG && console.log("[fb-debug] incomplete packet: saved %d bytes at pos=%d queue=%d", xdr.buffer.length, pos, self._queue.length), cb && (lazySnapshot === void 0 ? delete cb.lazy_count : cb.lazy_count = lazySnapshot)) : (process.env.FIREBIRD_DEBUG && console.warn(`[fb-debug] unhandled protocol error: ${err.message} pos=${pos} bytes=${xdr.buffer.length} queue=${self._queue.length}`), xdr.buffer = xdr.buffer.slice(pos), xdr.pos = 0, self._xdr = xdr);
                return;
              }
              if (xdr.r && delete xdr.r, obj && obj._isOpEvent) {
                process.env.FIREBIRD_DEBUG && console.log("[fb-debug] async opcode consumed (ignored): queue=%d xdr.pos=%d remaining=%d", self._queue.length, xdr.pos, xdr.buffer.length - xdr.pos);
                return;
              }
              if (self._queue.shift(), self._pending.shift(), process.env.FIREBIRD_DEBUG && console.log("[fb-debug] response dispatched: queue remaining=%d pending remaining=%d xdr.pos=%d", self._queue.length, self._pending.length, xdr.pos), obj && obj.warnings && obj.warnings.length && self.db && typeof self.db.emit == "function") {
                let warnings = obj.warnings;
                for (let w of warnings)
                  w.message === void 0 && (w.message = (0, utils_1.lookupMessages)([w]), (!w.message || w.message === "Unknow error") && (w.message = "Firebird warning " + w.gdscode + (w.params && w.params.length ? ": " + w.params.join(", ") : "")));
                process.nextTick(function() {
                  for (let w of warnings)
                    self.db.emit("warning", w);
                });
              }
              obj && obj.status && (obj.message = (0, utils_1.lookupMessages)(obj.status));
              try {
                (0, callback_1.doCallback)(obj, cb);
              } catch (callbackErr) {
                process.nextTick(function() {
                  throw callbackErr;
                });
              }
            }), xdr.pos === 0)
              break;
          }
          !self._detachAuto || self._pending.length !== 0 || (clearTimeout(self._detachTimeout), self._detachTimeout = setTimeout(function() {
            self.db.detach(self._detachCallback), self._detachAuto = !1;
          }, 100));
        });
      }
      disconnect() {
        this._socket.end();
      }
      sendOpContAuth(authData, authDataEnc, pluginName) {
        var msg = this._msg;
        msg.pos = 0, msg.addInt(const_1.default.op_cont_auth), msg.addString(authData, authDataEnc), msg.addString(pluginName, const_1.default.DEFAULT_ENCODING), msg.addString(const_1.default.AUTH_PLUGIN_LIST.join(","), const_1.default.DEFAULT_ENCODING), msg.addInt(0), this._socket.write(msg.getData());
      }
      sendOpCrypt(encryptPlugin) {
        var msg = this._msg;
        msg.pos = 0, msg.addInt(const_1.default.op_crypt), msg.addString(encryptPlugin || "Arc4", const_1.default.DEFAULT_ENCODING), msg.addString("Symmetric", const_1.default.DEFAULT_ENCODING), this._socket.write(msg.getData());
      }
      sendOpCryptKeyCallback(pluginData) {
        var msg = this._msg;
        msg.pos = 0, msg.addInt(const_1.default.op_crypt_key_callback), msg.addBlr(pluginData), this._socket.write(msg.getData());
      }
      /**
       * Send an out-of-band op_cancel packet (protocol 12+ / Firebird 2.5+).
       * The server reads it asynchronously while an operation is executing and
       * makes that operation fail with isc_cancelled (GDSCode.CANCELLED); the
       * op_cancel packet itself has no response, so nothing is queued here.
       */
      cancelOperation(kind, callback) {
        if (typeof kind == "function" && (callback = kind, kind = void 0), kind = kind || const_1.default.fb_cancel_raise, this._isClosed)
          return this.throwClosed(callback);
        if (!this.accept || this.accept.protocolVersion < const_1.default.PROTOCOL_VERSION12) {
          (0, callback_1.doError)(new Error("Query cancellation requires protocol 12+ (Firebird 2.5 or newer)"), callback);
          return;
        }
        var msg = this._msg;
        msg.pos = 0, msg.addInt(const_1.default.op_cancel), msg.addInt(kind), this._socket.write(msg.getData()), callback && callback();
      }
      /** Write a prebuilt packet and queue its response callback. */
      _queueEventBuffer(buffer, callback) {
        if (this._isClosed) {
          callback && callback(new Error("Connection is closed."));
          return;
        }
        this._socket.write(buffer), this._queue.push(callback);
      }
      _queueEvent(callback, defer = !1) {
        var self = this;
        if (self._isClosed) {
          callback && callback(new Error("Connection is closed."));
          return;
        }
        let canDefer = defer && this.accept.protocolVersion >= const_1.default.PROTOCOL_VERSION11;
        self._socket.write(self._msg.getData(), canDefer), canDefer ? (self._queue.push(void 0), callback && callback()) : self._queue.push(callback);
      }
      connect(options, callback) {
        var pluginName = options.pluginName || const_1.default.AUTH_PLUGIN_LIST[0], msg = this._msg, blr = this._blr;
        this._pending.push("connect"), this._authStartTime = Date.now(), msg.pos = 0, blr.pos = 0, blr.addString(const_1.default.CNCT_login, options.user, const_1.default.DEFAULT_ENCODING), blr.addString(const_1.default.CNCT_plugin_name, pluginName, const_1.default.DEFAULT_ENCODING), blr.addString(const_1.default.CNCT_plugin_list, const_1.default.AUTH_PLUGIN_LIST.join(","), const_1.default.DEFAULT_ENCODING);
        var specificData = "";
        if (const_1.default.AUTH_PLUGIN_SRP_LIST.indexOf(pluginName) > -1) {
          let _t0 = Date.now();
          this.clientKeys = srp.clientSeed(), process.env.FIREBIRD_DEBUG && console.log("[fb-debug] srp.clientSeed: %dms", Date.now() - _t0), specificData = this.clientKeys.public.toString(16), blr.addMultiblockPart(const_1.default.CNCT_specific_data, specificData, const_1.default.DEFAULT_ENCODING);
        } else if (pluginName === const_1.default.AUTH_PLUGIN_LEGACY)
          specificData = crypt.crypt(options.password, const_1.default.LEGACY_AUTH_SALT).substring(2), blr.addMultiblockPart(const_1.default.CNCT_specific_data, specificData, const_1.default.DEFAULT_ENCODING);
        else {
          (0, callback_1.doError)(new Error("Invalide auth plugin '" + pluginName + "'"), callback);
          return;
        }
        blr.addBytes([const_1.default.CNCT_client_crypt, 4, options.wireCrypt !== void 0 ? options.wireCrypt : const_1.default.WIRE_CRYPT_ENABLE, 0, 0, 0]), blr.addString(const_1.default.CNCT_user, os_1.default.userInfo().username || "Unknown", const_1.default.DEFAULT_ENCODING), blr.addString(const_1.default.CNCT_host, os_1.default.hostname(), const_1.default.DEFAULT_ENCODING), blr.addBytes([const_1.default.CNCT_user_verification, 0]), msg.addInt(const_1.default.op_connect), msg.addInt(const_1.default.op_attach), msg.addInt(const_1.default.CONNECT_VERSION3), msg.addInt(const_1.default.ARCHITECTURE_GENERIC), msg.addString(options.database || options.filename, const_1.default.DEFAULT_ENCODING);
        var maxProtocols = options.maxNegotiatedProtocols !== void 0 ? options.maxNegotiatedProtocols : const_1.default.SUPPORTED_PROTOCOL.length, protocolsToSend = const_1.default.SUPPORTED_PROTOCOL;
        protocolsToSend.length > maxProtocols && (protocolsToSend = protocolsToSend.slice(0, maxProtocols)), msg.addInt(protocolsToSend.length), msg.addBlr(this._blr);
        for (var protocol of protocolsToSend)
          msg.addInt(protocol[0]), msg.addInt(protocol[1]), msg.addInt(protocol[2]), protocol[0] >= const_1.default.PROTOCOL_VERSION13 && options.wireCompression ? msg.addInt(protocol[3] | const_1.default.pflag_compress) : msg.addInt(protocol[3]), msg.addInt(protocol[4]);
        var self = this;
        function cb(err, ret) {
          if (err) {
            (0, callback_1.doError)(err, callback);
            return;
          }
          if (self._pendingAccept && (ret = self._pendingAccept, delete self._pendingAccept), self.accept = ret, ret.sessionKey && ret.protocolVersion >= const_1.default.PROTOCOL_VERSION13 && options.wireCrypt !== const_1.default.WIRE_CRYPT_DISABLE) {
            var padLen = 40, keyBuf = Buffer.from(ret.sessionKey.toString(16).padStart(padLen, "0"), "hex"), selectedPlugin = "Arc4";
            if (ret.keys) {
              for (var serverPlugins = ret.keys.split(",").map(function(s) {
                return s.trim().toLowerCase();
              }), preferred = ["chacha64", "chacha", "arc4"], i = 0; i < preferred.length; i++)
                if (serverPlugins.indexOf(preferred[i]) !== -1) {
                  var mapping = {
                    chacha64: "ChaCha64",
                    chacha: "ChaCha",
                    arc4: "Arc4"
                  };
                  selectedPlugin = mapping[preferred[i]];
                  break;
                }
            }
            self.sendOpCrypt(selectedPlugin), selectedPlugin === "Arc4" && self._socket.enableEncryption(keyBuf, "Arc4"), self._pending.push("crypt"), self._queue.push(function(cryptErr, response) {
              if (cryptErr) {
                (0, callback_1.doError)(cryptErr, callback);
                return;
              }
              if (selectedPlugin !== "Arc4") {
                var iv = response && response.buffer;
                if (!iv || selectedPlugin === "ChaCha64" && iv.length < 8 || selectedPlugin === "ChaCha" && iv.length < 12) {
                  var errIv = new Error("Invalid or missing IV for " + selectedPlugin + " encryption");
                  (0, callback_1.doError)(errIv, callback);
                  return;
                }
                self._socket.enableEncryption(keyBuf, selectedPlugin, iv);
              }
              callback && callback(void 0, ret);
            });
            return;
          }
          callback && callback(void 0, ret);
        }
        process.env.FIREBIRD_DEBUG && console.log("[fb-debug] auth: op_connect sent plugin=%s t=%dms", pluginName, Date.now() - this._authStartTime), this._queueEvent(cb);
      }
      attach(options, callback, db) {
        this._lowercase_keys = options.lowercase_keys || const_1.default.DEFAULT_LOWERCASE_KEYS;
        var database = options.database || options.filename;
        if (database == null || database.length === 0) {
          (0, callback_1.doError)(new Error("No database specified"), callback);
          return;
        }
        var user = options.user || const_1.default.DEFAULT_USER, password = options.password || const_1.default.DEFAULT_PASSWORD, role = options.role, self = this, msg = this._msg, blr = this._blr;
        msg.pos = 0, blr.pos = 0, blr.addByte(const_1.default.isc_dpb_version1), blr.addString(const_1.default.isc_dpb_lc_ctype, String(options.encoding || "UTF8").toUpperCase(), const_1.default.DEFAULT_ENCODING), this.accept.protocolVersion >= const_1.default.PROTOCOL_VERSION13 && (blr.addByte(const_1.default.isc_dpb_utf8_filename), blr.addByte(0)), blr.addString(const_1.default.isc_dpb_user_name, user, const_1.default.DEFAULT_ENCODING), options.password && !this.accept.authData && this.accept.protocolVersion < const_1.default.PROTOCOL_VERSION13 && (this.accept.protocolVersion === const_1.default.PROTOCOL_VERSION10 ? blr.addString(const_1.default.isc_dpb_password, password, const_1.default.DEFAULT_ENCODING) : blr.addString(const_1.default.isc_dpb_password_enc, crypt.crypt(password, const_1.default.LEGACY_AUTH_SALT).substring(2), const_1.default.DEFAULT_ENCODING)), role && blr.addString(const_1.default.isc_dpb_sql_role_name, role, const_1.default.DEFAULT_ENCODING), blr.addBytes([const_1.default.isc_dpb_process_id, 4]), blr.addInt32(process.pid);
        let processName = process.title || "";
        if (blr.addString(const_1.default.isc_dpb_process_name, processName.length > 255 ? processName.substring(processName.length - 255, processName.length) : processName, const_1.default.DEFAULT_ENCODING), this.accept.authData && blr.addString(const_1.default.isc_dpb_specific_auth_data, this.accept.authData, const_1.default.DEFAULT_ENCODING), options.sessionTimeZone && blr.addString(const_1.default.isc_dpb_session_time_zone, options.sessionTimeZone, const_1.default.DEFAULT_ENCODING), options.parallelWorkers !== void 0 && blr.addNumeric(const_1.default.isc_dpb_parallel_workers, options.parallelWorkers), options.maxInlineBlobSize !== void 0 && blr.addNumeric(const_1.default.isc_dpb_max_inline_blob_size, options.maxInlineBlobSize), this.accept.protocolVersion >= const_1.default.PROTOCOL_VERSION20) {
          let sp = buildSchemaSearchPath(options);
          sp && blr.addString(const_1.default.isc_dpb_search_path, sp, const_1.default.DEFAULT_ENCODING);
        }
        msg.addInt(const_1.default.op_attach), msg.addInt(0), msg.addString(database, const_1.default.DEFAULT_ENCODING), msg.addBlr(this._blr);
        function cb(err, ret) {
          if (err) {
            (0, callback_1.doError)(err, callback);
            return;
          }
          self.dbhandle = ret.handle, callback && callback(void 0, ret), db || ret.emit("attach", ret);
        }
        db ? (db.connection = this, cb.response = db) : (cb.response = new database_1.default(this), cb.response.removeAllListeners("error"), cb.response.on("error", utils_1.noop)), this._queueEvent(cb);
      }
      detach(callback) {
        var self = this;
        if (self._isClosed)
          return this.throwClosed(callback);
        self._isUsed = !1, self._isDetach = !0;
        var msg = self._msg;
        msg.pos = 0, msg.addInt(const_1.default.op_detach), msg.addInt(0), self._queueEvent(function(err, ret) {
          clearTimeout(self._retry_connection_id), delete self.dbhandle, callback && callback(err, ret);
        });
      }
      createDatabase(options, callback) {
        this._lowercase_keys = options.lowercase_keys || const_1.default.DEFAULT_LOWERCASE_KEYS;
        var database = options.database || options.filename;
        if (database == null || database.length === 0) {
          (0, callback_1.doError)(new Error("No database specified"), callback);
          return;
        }
        var user = options.user || const_1.default.DEFAULT_USER, password = options.password || const_1.default.DEFAULT_PASSWORD, pageSize = options.pageSize || const_1.default.DEFAULT_PAGE_SIZE, role = options.role, blr = this._blr;
        blr.pos = 0, blr.addByte(const_1.default.isc_dpb_version1), blr.addString(const_1.default.isc_dpb_set_db_charset, String(options.defaultCharset || options.encoding || "UTF8").toUpperCase(), const_1.default.DEFAULT_ENCODING), blr.addString(const_1.default.isc_dpb_lc_ctype, String(options.encoding || "UTF8").toUpperCase(), const_1.default.DEFAULT_ENCODING), this.accept.protocolVersion >= const_1.default.PROTOCOL_VERSION13 && (blr.addByte(const_1.default.isc_dpb_utf8_filename), blr.addByte(0)), blr.addString(const_1.default.isc_dpb_user_name, user, const_1.default.DEFAULT_ENCODING), this.accept.protocolVersion < const_1.default.PROTOCOL_VERSION13 && (this.accept.protocolVersion === const_1.default.PROTOCOL_VERSION10 ? blr.addString(const_1.default.isc_dpb_password, password, const_1.default.DEFAULT_ENCODING) : blr.addString(const_1.default.isc_dpb_password_enc, crypt.crypt(password, const_1.default.LEGACY_AUTH_SALT).substring(2), const_1.default.DEFAULT_ENCODING)), role && blr.addString(const_1.default.isc_dpb_sql_role_name, role, const_1.default.DEFAULT_ENCODING), blr.addBytes([const_1.default.isc_dpb_process_id, 4]), blr.addInt32(process.pid);
        let processName = process.title || "";
        if (blr.addString(const_1.default.isc_dpb_process_name, processName.length > 255 ? processName.substring(processName.length - 255, processName.length) : processName, const_1.default.DEFAULT_ENCODING), this.accept.authData && blr.addString(const_1.default.isc_dpb_specific_auth_data, this.accept.authData, const_1.default.DEFAULT_ENCODING), options.sessionTimeZone && blr.addString(const_1.default.isc_dpb_session_time_zone, options.sessionTimeZone, const_1.default.DEFAULT_ENCODING), options.parallelWorkers !== void 0 && blr.addNumeric(const_1.default.isc_dpb_parallel_workers, options.parallelWorkers), options.maxInlineBlobSize !== void 0 && blr.addNumeric(const_1.default.isc_dpb_max_inline_blob_size, options.maxInlineBlobSize), this.accept.protocolVersion >= const_1.default.PROTOCOL_VERSION20) {
          let sp = buildSchemaSearchPath(options);
          sp && blr.addString(const_1.default.isc_dpb_search_path, sp, const_1.default.DEFAULT_ENCODING);
        }
        options.owner && blr.addString(const_1.default.isc_dpb_owner, options.owner, const_1.default.DEFAULT_ENCODING), blr.addNumeric(const_1.default.isc_dpb_sql_dialect, 3), blr.addNumeric(const_1.default.isc_dpb_force_write, 1), blr.addNumeric(const_1.default.isc_dpb_overwrite, 1), blr.addNumeric(const_1.default.isc_dpb_page_size, pageSize);
        var msg = this._msg;
        msg.pos = 0, msg.addInt(const_1.default.op_create), msg.addInt(0), msg.addString(database, const_1.default.DEFAULT_ENCODING), msg.addBlr(blr);
        var self = this;
        function cb(err, ret) {
          ret && (self.dbhandle = ret.handle), callback && callback(err, ret), !err && ret && ret.emit("attach", ret);
        }
        cb.response = new database_1.default(this), this._queueEvent(cb);
      }
      dropDatabase(callback) {
        var msg = this._msg;
        msg.pos = 0, msg.addInt(const_1.default.op_drop_database), msg.addInt(this.dbhandle);
        var self = this;
        this._queueEvent(function(err) {
          self.detach(function() {
            self.disconnect(), callback && callback(err);
          });
        });
      }
      throwClosed(callback) {
        var err = new Error("Connection is closed.");
        return this._emitError(err), callback && callback(err), this;
      }
      /** `options` is a resolved options object, a bare isolation array, or
       *  the callback itself when no options are given. */
      startTransaction(options, callback) {
        if (typeof options == "function") {
          var tmp = options;
          options = callback, callback = tmp;
        }
        if (Array.isArray(options) && (options = {
          isolation: options,
          readOnly: options === const_1.default.ISOLATION_READ_COMMITTED_READ_ONLY
        }), options = Object.assign({
          autoCommit: !1,
          autoUndo: !0,
          isolation: const_1.default.ISOLATION_READ_COMMITTED,
          ignoreLimbo: !1,
          //lock: [],
          readOnly: !1,
          wait: !0,
          waitTimeout: 0
        }, options), this._isClosed)
          return this.throwClosed(callback);
        this._pending.push("startTransaction");
        var blr = this._blr, msg = this._msg;
        blr.pos = 0, msg.pos = 0, blr.addByte(const_1.default.isc_tpb_version3), blr.addBytes(options.isolation), blr.addByte(options.readOnly ? const_1.default.isc_tpb_read : const_1.default.isc_tpb_write), options.wait ? (blr.addByte(const_1.default.isc_tpb_wait), options.waitTimeout && blr.addNumeric(const_1.default.isc_tpb_lock_timeout, options.waitTimeout)) : blr.addByte(const_1.default.isc_tpb_nowait), options.autoUndo || blr.addByte(const_1.default.isc_tpb_no_auto_undo), options.autoCommit && blr.addByte(const_1.default.isc_tpb_autocommit), options.ignoreLimbo && blr.addByte(const_1.default.isc_tpb_ignore_limbo), msg.addInt(const_1.default.op_transaction), msg.addInt(this.dbhandle), msg.addBlr(blr), callback.response = new transaction_1.default(this), this.db.emit("transaction", options), this._queueEvent(callback);
      }
      commit(transaction, callback) {
        if (this._isClosed)
          return this.throwClosed(callback);
        this._pending.push("commit");
        var msg = this._msg;
        msg.pos = 0, msg.addInt(const_1.default.op_commit), msg.addInt(transaction.handle), this.db.emit("commit"), this._queueEvent(callback);
      }
      rollback(transaction, callback) {
        if (this._isClosed)
          return this.throwClosed(callback);
        this._pending.push("rollback");
        var msg = this._msg;
        msg.pos = 0, msg.addInt(const_1.default.op_rollback), msg.addInt(transaction.handle), this.db.emit("rollback"), this._queueEvent(callback);
      }
      commitRetaining(transaction, callback) {
        if (this._isClosed)
          return this.throwClosed(callback);
        this._pending.push("commitRetaining");
        var msg = this._msg;
        msg.pos = 0, msg.addInt(const_1.default.op_commit_retaining), msg.addInt(transaction.handle), this._queueEvent(callback);
      }
      rollbackRetaining(transaction, callback) {
        if (this._isClosed)
          return this.throwClosed(callback);
        this._pending.push("rollbackRetaining");
        var msg = this._msg;
        msg.pos = 0, msg.addInt(const_1.default.op_rollback_retaining), msg.addInt(transaction.handle), this._queueEvent(callback);
      }
      allocateStatement(callback) {
        if (this._isClosed)
          return this.throwClosed(callback);
        this._pending.push("allocateStatement");
        var msg = this._msg;
        msg.pos = 0, msg.addInt(const_1.default.op_allocate_statement), msg.addInt(this.dbhandle), callback.response = new statement_1.default(this), this._queueEvent(callback);
      }
      dropStatement(statement, callback) {
        if (this._isClosed)
          return this.throwClosed(callback);
        this._pending.push("dropStatement");
        var msg = this._msg;
        msg.pos = 0, msg.addInt(const_1.default.op_free_statement), msg.addInt(statement.handle), msg.addInt(const_1.default.DSQL_drop), this._queueEvent(callback, !0);
      }
      closeStatement(statement, callback) {
        if (this._isClosed)
          return this.throwClosed(callback);
        this._pending.push("closeStatement");
        var msg = this._msg;
        msg.pos = 0, msg.addInt(const_1.default.op_free_statement), msg.addInt(statement.handle), msg.addInt(const_1.default.DSQL_close), this._queueEvent(callback, !0);
      }
      allocateAndPrepareStatement(transaction, query, plan, callback) {
        var self = this, mainCallback = function(err, ret) {
          err || (mainCallback.response.handle = ret.handle, describe(ret.buffer, mainCallback.response), mainCallback.response.query = query, self.db.emit("query", query), ret = mainCallback.response), callback && callback(err, ret);
        };
        this._pending.push("allocateAndPrepareStatement");
        var msg = this._msg, blr = this._blr;
        msg.pos = 0, blr.pos = 0, msg.addInt(const_1.default.op_allocate_statement), msg.addInt(this.dbhandle), mainCallback.lazy_count = 1;
        let describeBytes = this.accept.protocolVersion >= const_1.default.PROTOCOL_VERSION20 ? const_1.default.DESCRIBE_WITH_SCHEMA : const_1.default.DESCRIBE;
        process.env.FIREBIRD_DEBUG && console.log("[fb-debug] describeBytes:", describeBytes), blr.addBytes(describeBytes), plan && blr.addByte(const_1.default.isc_info_sql_get_plan), msg.addInt(const_1.default.op_prepare_statement), msg.addInt(transaction.handle), msg.addInt(65535), msg.addInt(3), msg.addStringBuffer(Xsql.encodeConnectionText(this.options, query)), msg.addBlr(blr), msg.addInt(65535), this.accept.protocolVersion >= const_1.default.PROTOCOL_VERSION20 && msg.addInt(0), mainCallback.lazy_count += 1, mainCallback.response = new statement_1.default(this), this._queueEvent(mainCallback);
      }
      prepare(transaction, query, plan, callback) {
        var self = this;
        this.accept.protocolMinimumType === const_1.default.ptype_lazy_send ? self.allocateAndPrepareStatement(transaction, query, plan, callback) : self.allocateStatement(function(err, statement) {
          if (err) {
            (0, callback_1.doError)(err, callback);
            return;
          }
          self.prepareStatement(transaction, statement, query, plan, callback);
        });
      }
      /** `plan` may be the callback itself when no plan flag is given. */
      prepareStatement(transaction, statement, query, plan, callback) {
        if (this._isClosed)
          return this.throwClosed(callback);
        var msg = this._msg, blr = this._blr;
        msg.pos = 0, blr.pos = 0, plan instanceof Function && (callback = plan, plan = !1);
        let describeBytes = this.accept.protocolVersion >= const_1.default.PROTOCOL_VERSION20 ? const_1.default.DESCRIBE_WITH_SCHEMA : const_1.default.DESCRIBE;
        blr.addBytes(describeBytes), plan && blr.addByte(const_1.default.isc_info_sql_get_plan), msg.addInt(const_1.default.op_prepare_statement), msg.addInt(transaction.handle), msg.addInt(statement.handle), msg.addInt(3), msg.addStringBuffer(Xsql.encodeConnectionText(this.options, query)), msg.addBlr(blr), msg.addInt(65535), this.accept.protocolVersion >= const_1.default.PROTOCOL_VERSION20 && msg.addInt(0);
        var self = this;
        this._queueEvent(function(err, ret) {
          err || (describe(ret.buffer, statement), statement.query = query, self.db.emit("query", query), ret = statement), callback && callback(err, ret);
        });
      }
      /**
       * Execute a statement once per row using the Firebird 4 batch API
       * (protocol 16+): op_batch_create + op_batch_msg(s) + op_batch_exec +
       * op_batch_rls, all pipelined in a single network flush. Every packet
       * gets an in-order response (op_batch_cs for exec), so the regular
       * response queue keeps everything in sync.
       *
       * rows: array of parameter arrays, one per record. BLOB columns accept
       * Buffers, strings, JSON-able objects or pre-created blob quad ids —
       * values are uploaded as transaction blobs first (all initiated
       * back-to-back so they pipeline) and the batch messages reference their
       * ids. ARRAY columns are not supported. The callback receives a
       * completion object: { recordCount, updateCounts, errors:
       * [{recordNumber, error}], errorRecordNumbers, success }.
       */
      executeBatch(transaction, statement, rows, callback, options) {
        if (options = options || {}, this._isClosed)
          return this.throwClosed(callback);
        if (!this.accept || this.accept.protocolVersion < const_1.default.PROTOCOL_VERSION16) {
          (0, callback_1.doError)(new Error("executeBatch requires protocol 16+ (Firebird 4.0 or newer)"), callback);
          return;
        }
        var input = statement.input;
        if (!input || !input.length) {
          (0, callback_1.doError)(new Error("executeBatch requires a statement with input parameters"), callback);
          return;
        }
        if (!Array.isArray(rows)) {
          (0, callback_1.doError)(new Error("executeBatch expects an array of parameter rows"), callback);
          return;
        }
        if (rows.length === 0) {
          callback && callback(void 0, {
            recordCount: 0,
            updateCounts: [],
            errors: [],
            errorRecordNumbers: [],
            success: !0
          });
          return;
        }
        for (var i = 0; i < rows.length; i++)
          if (!Array.isArray(rows[i]) || rows[i].length !== input.length) {
            (0, callback_1.doError)(new Error("executeBatch row " + i + " must be an array of " + input.length + " values"), callback);
            return;
          }
        try {
          validateBatchFixedPointRows(input, rows);
        } catch (err) {
          (0, callback_1.doError)(err, callback);
          return;
        }
        for (var self = this, blobCols = [], bj = 0; bj < input.length; bj++) {
          var bt = input[bj].type;
          (bt === const_1.default.SQL_BLOB || bt === const_1.default.SQL_QUAD) && blobCols.push(bj);
        }
        var needsBlobPass = !1;
        if (blobCols.length)
          outer: for (var ri = 0; ri < rows.length; ri++)
            for (var ci = 0; ci < blobCols.length; ci++) {
              var bv = rows[ri][blobCols[ci]];
              if (bv != null) {
                needsBlobPass = !0;
                break outer;
              }
            }
        if (needsBlobPass) {
          var cloned = rows.map(function(r) {
            return r.slice();
          }), pendingBlobs = 1, blobFailure = null, settleBlobs = function(err) {
            if (err && !blobFailure && (blobFailure = err), !--pendingBlobs) {
              if (blobFailure) {
                (0, callback_1.doError)(blobFailure, callback);
                return;
              }
              self._executeBatchEncoded(transaction, statement, cloned, callback, options);
            }
          };
          cloned.forEach(function(row) {
            blobCols.forEach(function(j) {
              var v = row[j];
              if (v != null) {
                if (v instanceof Xsql.SQLParamQuad) {
                  row[j] = v.value;
                  return;
                }
                pendingBlobs++, self.uploadBlob(transaction, v, function(err, oid) {
                  err || (row[j] = oid), settleBlobs(err);
                });
              }
            });
          }), settleBlobs();
          return;
        }
        this._executeBatchEncoded(transaction, statement, rows, callback, options);
      }
      /** Encode and send the batch packets (rows are fully materialized:
       *  blob values already replaced by quad ids by executeBatch). */
      _executeBatchEncoded(transaction, statement, rows, callback, options) {
        var input = statement.input, built;
        try {
          built = buildBatchEncoders(input, Object.assign({}, this.options, options));
        } catch (err) {
          (0, callback_1.doError)(err, callback);
          return;
        }
        var self = this, encoders = built.encoders, chunkSize = options.chunkSize && options.chunkSize > 0 ? options.chunkSize : 500, chunkCount = Math.ceil(rows.length / chunkSize), failure = null, completion = null, remaining = 2 + chunkCount;
        function settle(err) {
          if (err && !failure && (failure = err), remaining--, !(remaining > 0)) {
            if (failure) {
              (0, callback_1.doError)(failure, callback);
              return;
            }
            var detailed = completion ? completion.detailedErrors : [], errorRecordNumbers = detailed.map(function(e) {
              return e.recordNumber;
            }).concat(completion ? completion.errorRecordNumbers : []);
            callback && callback(void 0, {
              recordCount: completion ? completion.recordCount : 0,
              updateCounts: completion ? completion.updateCounts : [],
              errors: detailed,
              errorRecordNumbers,
              success: errorRecordNumbers.length === 0
            });
          }
        }
        var msg = this._msg, blr = this._blr, packets = [];
        try {
          msg.pos = 0, blr.pos = 0, CalcBlr(blr, input), msg.addInt(const_1.default.op_batch_create), msg.addInt(statement.handle), msg.addBlr(blr), msg.addInt(built.msglen);
          var pb = buildBatchPb(options);
          msg.addInt(pb.length), msg.addParamBuffer(pb), packets.push(Buffer.from(msg.getData()));
          for (var c = 0; c < chunkCount; c++) {
            var start = c * chunkSize, end = Math.min(start + chunkSize, rows.length);
            msg.pos = 0, msg.addInt(const_1.default.op_batch_msg), msg.addInt(statement.handle), msg.addInt(end - start);
            for (var i = start; i < end; i++) {
              for (var row = rows[i], nullBits = new serialize_1.BitSet(), j = 0; j < input.length; j++)
                nullBits.set(j, row[j] === null || row[j] === void 0 ? 1 : 0);
              var nullBuffer = nullBits.toBuffer(), requireBytes = Math.floor((input.length + 7) / 8), remainingBytes = requireBytes - nullBuffer.length;
              nullBuffer.length && msg.addBuffer(nullBuffer), remainingBytes > 0 && msg.addBuffer(Buffer.alloc(remainingBytes)), msg.addAlignment(requireBytes);
              for (var j = 0; j < input.length; j++)
                row[j] !== null && row[j] !== void 0 && encoders[j](msg, row[j]);
            }
            packets.push(Buffer.from(msg.getData()));
          }
          msg.pos = 0, msg.addInt(const_1.default.op_batch_exec), msg.addInt(statement.handle), msg.addInt(transaction.handle), packets.push(Buffer.from(msg.getData())), msg.pos = 0, msg.addInt(const_1.default.op_batch_rls), msg.addInt(statement.handle), packets.push(Buffer.from(msg.getData()));
        } catch (err) {
          (0, callback_1.doError)(err, callback);
          return;
        }
        for (var execIndex = packets.length - 2, p = 0; p < packets.length; p++)
          this._pending.push("executeBatch"), p === execIndex ? this._queueEventBuffer(packets[p], function(err, ret) {
            !err && ret && ret.batchCompletion ? (completion = ret.batchCompletion, settle()) : settle(err || new Error("op_batch_exec did not return a completion state"));
          }) : p === packets.length - 1 ? this._queueEventBuffer(packets[p], function() {
          }) : this._queueEventBuffer(packets[p], function(err) {
            settle(err);
          });
      }
      /** `params` may be the callback itself when the statement has no parameters. */
      executeStatement(transaction, statement, params, callback, custom) {
        if (this._isClosed)
          return this.throwClosed(callback);
        this._pending.push("executeStatement"), params instanceof Function && (callback = params, params = void 0);
        var self = this, op = const_1.default.op_execute;
        statement.type === const_1.default.isc_info_sql_stmt_exec_procedure && statement.output.length && (op = const_1.default.op_execute2);
        function PrepareParams(params2, input2, callback2) {
          var value, meta, ret = new Array(params2.length);
          function putBlobData(index2, value2, callback3) {
            self.createBlob2(transaction, function(err, blob) {
              var b, isStream = value2.readable;
              Buffer.isBuffer(value2) ? b = value2 : typeof value2 == "string" ? b = Xsql.encodeConnectionText(self.options, value2) : isStream || (b = Xsql.encodeConnectionText(self.options, JSON.stringify(value2)));
              var chunkSize = self.options.blobChunkSize || 1024;
              if (Buffer.isBuffer(b)) {
                bufferReader(b, chunkSize, function(b2, next) {
                  self.batchSegments(blob, b2, next);
                }, function() {
                  ret[index2] = new Xsql.SQLParamQuad(blob.oid), self.closeBlob(blob, callback3, !1);
                });
                return;
              }
              var isReading = !1, isEnd = !1;
              value2.on("data", function(chunk) {
                if (chunk.length <= chunkSize) {
                  self.batchSegments(blob, chunk, function() {
                    isEnd && !isReading && (ret[index2] = new Xsql.SQLParamQuad(blob.oid), self.closeBlob(blob, callback3, !1));
                  });
                  return;
                }
                value2.pause(), isReading = !0, bufferReader(chunk, chunkSize, function(b2, next) {
                  self.batchSegments(blob, b2, next);
                }, function() {
                  isReading = !1, isEnd ? (ret[index2] = new Xsql.SQLParamQuad(blob.oid), self.closeBlob(blob, callback3, !1)) : value2.resume();
                });
              }), value2.on("end", function() {
                isEnd = !0, !isReading && (isReading || (ret[index2] = new Xsql.SQLParamQuad(blob.oid), self.closeBlob(blob, callback3, !1)));
              });
            });
          }
          function step(i2) {
            if (i2 === params2.length) {
              callback2(ret);
              return;
            }
            if (value = params2[i2], meta = input2[i2], statement.connection.options && statement.connection.options.jsonAsObject && value !== null && value !== void 0 && typeof value == "object" && !(value instanceof Date) && !(value instanceof Buffer) && typeof value.pipe != "function" && (value = JSON.stringify(value)), value == null) {
              switch (meta.type) {
                case const_1.default.SQL_VARYING:
                case const_1.default.SQL_NULL:
                case const_1.default.SQL_TEXT:
                  ret[i2] = new Xsql.SQLParamString(null);
                  break;
                case const_1.default.SQL_DOUBLE:
                case const_1.default.SQL_FLOAT:
                case const_1.default.SQL_D_FLOAT:
                  ret[i2] = new Xsql.SQLParamDouble(null);
                  break;
                case const_1.default.SQL_TYPE_DATE:
                case const_1.default.SQL_TYPE_TIME:
                case const_1.default.SQL_TIMESTAMP:
                case const_1.default.SQL_TIME_TZ:
                case const_1.default.SQL_TIME_TZ_EX:
                case const_1.default.SQL_TIMESTAMP_TZ:
                case const_1.default.SQL_TIMESTAMP_TZ_EX:
                  ret[i2] = new Xsql.SQLParamDate(null);
                  break;
                case const_1.default.SQL_BLOB:
                case const_1.default.SQL_ARRAY:
                case const_1.default.SQL_QUAD:
                  ret[i2] = new Xsql.SQLParamQuad(null);
                  break;
                case const_1.default.SQL_LONG:
                case const_1.default.SQL_SHORT:
                case const_1.default.SQL_INT64:
                case const_1.default.SQL_BOOLEAN:
                  ret[i2] = new Xsql.SQLParamInt(null);
                  break;
                default:
                  ret[i2] = null;
              }
              step(i2 + 1);
            } else
              switch (meta.type) {
                case const_1.default.SQL_BLOB:
                  putBlobData(i2, value, function() {
                    step(i2 + 1);
                  });
                  break;
                case const_1.default.SQL_TIMESTAMP:
                case const_1.default.SQL_TYPE_DATE:
                case const_1.default.SQL_TYPE_TIME:
                case const_1.default.SQL_TIME_TZ:
                case const_1.default.SQL_TIME_TZ_EX:
                case const_1.default.SQL_TIMESTAMP_TZ:
                case const_1.default.SQL_TIMESTAMP_TZ_EX:
                  value instanceof Date ? ret[i2] = new Xsql.SQLParamDate(value) : typeof value == "string" ? ret[i2] = new Xsql.SQLParamDate((0, utils_1.parseDate)(value)) : ret[i2] = new Xsql.SQLParamDate(new Date(value)), step(i2 + 1);
                  break;
                default:
                  if (Buffer.isBuffer(value))
                    ret[i2] = new Xsql.SQLParamBuffer(value);
                  else
                    switch (typeof value) {
                      case "bigint":
                        ret[i2] = new Xsql.SQLParamInt128(value);
                        break;
                      case "number":
                        value % 1 === 0 ? value >= const_1.default.MIN_INT && value <= const_1.default.MAX_INT ? ret[i2] = new Xsql.SQLParamInt(value) : ret[i2] = new Xsql.SQLParamInt64(value) : ret[i2] = new Xsql.SQLParamDouble(value);
                        break;
                      case "string":
                        ret[i2] = textParam(self.options, value);
                        break;
                      case "boolean":
                        ret[i2] = new Xsql.SQLParamBool(value, meta.type === const_1.default.SQL_BOOLEAN);
                        break;
                      default:
                        ret[i2] = textParam(self.options, value.toString());
                        break;
                    }
                  step(i2 + 1);
              }
          }
          step(0);
        }
        var input = statement.input;
        if (input.length) {
          if (!(params instanceof Array))
            if (params !== void 0 && typeof params == "object" && params !== null) {
              for (var mappedParams = [], i = 0; i < input.length; i++)
                mappedParams.push(void 0);
              for (var matchedCount = 0, nameMap = {}, i = 0; i < input.length; i++) {
                var name = input[i].alias || input[i].field;
                name && (nameMap[name.toUpperCase()] = i);
              }
              for (var key in params)
                if (Object.prototype.hasOwnProperty.call(params, key)) {
                  var cleanKey = key.startsWith(":") ? key.substring(1) : key, index = nameMap[cleanKey.toUpperCase()];
                  index !== void 0 && (mappedParams[index] = params[key], matchedCount++);
                }
              matchedCount > 0 ? params = mappedParams : params = [params];
            } else params !== void 0 ? params = [params] : params = [];
          if (params.length !== input.length) {
            self._pending.pop(), callback(new Error("Expected parameters: (params=" + params.length + " vs. expected=" + input.length + ") - " + statement.query));
            return;
          }
          PrepareParams(params, input, function(prms) {
            self.sendExecute(op, statement, transaction, callback, prms);
          });
          return;
        }
        this.sendExecute(op, statement, transaction, callback);
      }
      sendExecute(op, statement, transaction, callback, parameters) {
        var msg = this._msg, blr = this._blr;
        if (msg.pos = 0, blr.pos = 0, msg.addInt(op), msg.addInt(statement.handle), msg.addInt(transaction.handle), parameters && parameters.length)
          if (CalcBlr(blr, parameters), msg.addBlr(blr), msg.addInt(0), msg.addInt(1), this.accept.protocolVersion >= const_1.default.PROTOCOL_VERSION13) {
            for (var nullBits = new serialize_1.BitSet(), i = 0; i < parameters.length; i++)
              nullBits.set(i, parameters[i].value === null ? 1 : 0);
            var nullBuffer = nullBits.toBuffer(), requireBytes = Math.floor((parameters.length + 7) / 8), remainingBytes = requireBytes - nullBuffer.length;
            nullBuffer.length && msg.addBuffer(nullBuffer), remainingBytes > 0 && msg.addBuffer(Buffer.alloc(remainingBytes)), msg.addAlignment(requireBytes);
            for (var i = 0; i < parameters.length; i++)
              parameters[i].value !== null && parameters[i].encode(msg);
          } else
            for (var i = 0; i < parameters.length; i++)
              parameters[i].encode(msg), parameters[i].value !== null && msg.addInt(0);
        else
          msg.addBlr(blr), msg.addInt(0), msg.addInt(0);
        if (op === const_1.default.op_execute2) {
          var outputBlr = new serialize_1.BlrWriter(32);
          statement.output && statement.output.length && CalcBlr(outputBlr, statement.output), msg.addBlr(outputBlr), msg.addInt(0);
        }
        this.accept.protocolVersion >= const_1.default.PROTOCOL_VERSION16 && msg.addInt(statement.options?.timeout || 0), this.accept.protocolVersion >= const_1.default.PROTOCOL_VERSION18 && msg.addInt(statement.options?.scrollable ? 1 : 0), this.accept.protocolVersion >= const_1.default.PROTOCOL_VERSION19 && msg.addInt(statement.options?.maxInlineBlobSize !== void 0 ? statement.options.maxInlineBlobSize : this.options?.maxInlineBlobSize || 0), callback.statement = statement, this._queueEvent(callback);
      }
      /** `count` may be the callback itself when no fetch size is given. */
      fetch(statement, transaction, count, callback) {
        var msg = this._msg, blr = this._blr;
        msg.pos = 0, blr.pos = 0, count instanceof Function && (callback = count, count = void 0), msg.addInt(const_1.default.op_fetch), msg.addInt(statement.handle), CalcBlr(blr, statement.output), msg.addBlr(blr), msg.addInt(0), msg.addInt(count || resolveFetchSize(statement, this.options)), callback.statement = statement, this._queueEvent(callback);
      }
      fetchScroll(statement, transaction, direction, offset, count, callback) {
        typeof count == "function" && (callback = count, count = void 0), typeof offset == "function" && (callback = offset, offset = void 0, count = void 0);
        var msg = this._msg, blr = this._blr;
        msg.pos = 0, blr.pos = 0;
        let dirInt = 0;
        if (typeof direction == "number")
          dirInt = direction;
        else if (typeof direction == "string")
          switch (direction.toUpperCase()) {
            case "NEXT":
              dirInt = 0;
              break;
            case "PRIOR":
              dirInt = 1;
              break;
            case "FIRST":
              dirInt = 2;
              break;
            case "LAST":
              dirInt = 3;
              break;
            case "ABSOLUTE":
              dirInt = 4;
              break;
            case "RELATIVE":
              dirInt = 5;
              break;
            default:
              throw new Error("Invalid fetch direction: " + direction);
          }
        let offsetVal = offset || 0, fetchCount = count || 1;
        msg.addInt(const_1.default.op_fetch_scroll), msg.addInt(statement.handle), CalcBlr(blr, statement.output), msg.addBlr(blr), msg.addInt(0), msg.addInt(fetchCount), msg.addInt(dirInt), msg.addInt(offsetVal), callback.statement = statement, this._queueEvent(callback);
      }
      /**
       * Query runtime information about a prepared statement via op_info_sql
       * (e.g. Const.RECORDS_INFO for the per-verb DML row counts). The
       * response is a plain op_response whose buffer holds the info clusters.
       */
      statementInfo(statement, items, callback) {
        if (this._isClosed)
          return this.throwClosed(callback);
        this._pending.push("statementInfo");
        var msg = this._msg, blr = this._blr;
        msg.pos = 0, blr.pos = 0, blr.addBytes(items), msg.addInt(const_1.default.op_info_sql), msg.addInt(statement.handle), msg.addInt(0), msg.addBlr(blr), msg.addInt(65535), this._queueEvent(callback);
      }
      /**
       * Resolve the pending blobAsText fetches of a decoded row batch
       * (ret.arrBlob) and write the text back into ret.data. Reads run
       * sequentially to respect Firebird's per-connection open-blob-handle
       * limit (issue #387). Used by fetchAll for cursors and by
       * transaction.execute for op_execute2 singletons (EXECUTE PROCEDURE /
       * RETURNING — issue #305, whose blobs never resolved before).
       */
      resolveTextBlobs(transaction, ret, callback) {
        let self = this, fns = ret && ret.arrBlob || [];
        if (!fns.length)
          return callback();
        let read = (index) => {
          if (index >= fns.length)
            return callback();
          fns[index](transaction).then((blob) => {
            Xsql.nestCell(ret.data[blob.row], blob.table)[blob.column] = applyTypeCast(self.options, blob.meta || {}, parseValueIfJson(blob.value, self.options)), read(index + 1);
          }, callback);
        };
        read(0);
      }
      fetchAll(statement, transaction, callback) {
        let self = this, custom = statement.options || {}, asStream = custom.asStream && custom.on, fetchSize = resolveFetchSize(statement, this.options), data = asStream ? null : [], streamIndex = 0, loop = (err, ret) => {
          if (err) {
            callback(err);
            return;
          }
          if (ret && ret.data && ret.data.length) {
            self.resolveTextBlobs(transaction, ret, (blobErr) => {
              if (blobErr) {
                callback(blobErr);
                return;
              }
              doSynchronousLoop(ret.data, (row, _i, next) => {
                let pos = asStream ? streamIndex++ : data.push(row) - 1;
                asStream ? executeStreamRow(custom, row, pos, statement.output, next) : next();
              }, (streamErr) => {
                if (streamErr) {
                  callback(streamErr);
                  return;
                }
                ret.fetched ? callback(void 0, data || []) : self.fetch(statement, transaction, fetchSize, loop);
              });
            });
            return;
          }
          ret && ret.fetched ? callback(void 0, data || []) : self.fetch(statement, transaction, fetchSize, loop);
        };
        this.fetch(statement, transaction, fetchSize, loop);
      }
      openBlob(blob, transaction, callback) {
        var msg = this._msg;
        msg.pos = 0, msg.addInt(const_1.default.op_open_blob), msg.addInt(transaction.handle), msg.addQuad(blob), this._queueEvent(callback);
      }
      closeBlob(blob, callback, defer = !0) {
        var msg = this._msg;
        msg.pos = 0, msg.addInt(const_1.default.op_close_blob), msg.addInt(blob.handle), this._queueEvent(callback, defer);
      }
      getSegment(blob, callback) {
        var msg = this._msg;
        msg.pos = 0, msg.addInt(const_1.default.op_get_segment), msg.addInt(blob.handle), msg.addInt(this.options.blobReadChunkSize || 1024), msg.addInt(0), this._queueEvent(callback);
      }
      createBlob2(transaction, callback) {
        var msg = this._msg;
        msg.pos = 0, msg.addInt(const_1.default.op_create_blob2), msg.addInt(0), msg.addInt(transaction.handle), msg.addInt(0), msg.addInt(0), this._queueEvent(callback);
      }
      batchSegments(blob, buffer, callback) {
        var msg = this._msg, blr = this._blr;
        msg.pos = 0, blr.pos = 0, msg.addInt(const_1.default.op_batch_segments), msg.addInt(blob.handle), msg.addInt(buffer.length + 2), blr.addBuffer(buffer), msg.addBlr(blr), this._queueEvent(callback);
      }
      /**
       * Create a transaction blob, upload `value` (Buffer, string, or a
       * JSON-able object) and deliver its quad id. executeBatch's blob
       * pre-pass uses this: batch messages reference pre-created transaction
       * blobs (the batch parameter buffer's default BLOB_NONE policy), just
       * like the classic execute path stores blob params.
       */
      uploadBlob(transaction, value, callback) {
        var self = this, b;
        Buffer.isBuffer(value) ? b = value : typeof value == "string" ? b = Xsql.encodeConnectionText(this.options, value) : b = Xsql.encodeConnectionText(this.options, JSON.stringify(value)), self.createBlob2(transaction, function(err, blob) {
          if (err)
            return callback(err);
          var chunkSize = self.options.blobChunkSize || 1024, segmentError = null;
          bufferReader(b, chunkSize, function(part, next) {
            self.batchSegments(blob, part, function(segErr) {
              segErr && !segmentError && (segmentError = segErr), next();
            });
          }, function() {
            self.closeBlob(blob, function(closeErr) {
              callback(segmentError || closeErr, blob.oid);
            }, !1);
          });
        });
      }
      svcattach(options, callback, svc) {
        this._lowercase_keys = options.lowercase_keys || const_1.default.DEFAULT_LOWERCASE_KEYS;
        var database = options.database || options.filename, user = options.user || const_1.default.DEFAULT_USER, password = options.password || const_1.default.DEFAULT_PASSWORD, role = options.role, msg = this._msg, blr = this._blr;
        msg.pos = 0, blr.pos = 0, blr.addBytes([const_1.default.isc_dpb_version2, const_1.default.isc_dpb_version2]), blr.addString(const_1.default.isc_dpb_lc_ctype, "UTF8", const_1.default.DEFAULT_ENCODING), this.accept.protocolVersion >= const_1.default.PROTOCOL_VERSION13 && (blr.addByte(const_1.default.isc_dpb_utf8_filename), blr.addByte(0)), blr.addString(const_1.default.isc_dpb_user_name, user, const_1.default.DEFAULT_ENCODING), blr.addString(const_1.default.isc_dpb_password, password, const_1.default.DEFAULT_ENCODING), blr.addByte(const_1.default.isc_dpb_dummy_packet_interval), blr.addByte(4), blr.addBytes([120, 10, 0, 0]), role && blr.addString(const_1.default.isc_dpb_sql_role_name, role, const_1.default.DEFAULT_ENCODING), msg.addInt(const_1.default.op_service_attach), msg.addInt(0), msg.addString(const_1.default.DEFAULT_SVC_NAME, const_1.default.DEFAULT_ENCODING), msg.addBlr(this._blr);
        var self = this;
        function cb(err, ret) {
          if (err) {
            (0, callback_1.doError)(err, callback);
            return;
          }
          self.svchandle = ret.handle, callback && callback(void 0, ret);
        }
        svc ? (svc.connection = this, cb.response = svc) : (cb.response = new service_1.default(this), cb.response.removeAllListeners("error"), cb.response.on("error", utils_1.noop)), this._queueEvent(cb);
      }
      svcstart(spbaction, callback) {
        var msg = this._msg, blr = this._blr;
        msg.pos = 0, msg.addInt(const_1.default.op_service_start), msg.addInt(this.svchandle), msg.addInt(0), msg.addBlr(spbaction), this._queueEvent(callback);
      }
      svcquery(spbquery, resultbuffersize, timeout, callback) {
        if (resultbuffersize > const_1.default.MAX_BUFFER_SIZE) {
          (0, callback_1.doError)(new Error("Buffer is too big"), callback);
          return;
        }
        var msg = this._msg, blr = this._blr;
        msg.pos = 0, blr.pos = 0, blr.addByte(const_1.default.isc_spb_current_version), msg.addInt(const_1.default.op_service_info), msg.addInt(this.svchandle), msg.addInt(0), msg.addBlr(blr), blr.pos = 0, blr.addBytes(spbquery), msg.addBlr(blr), msg.addInt(resultbuffersize), this._queueEvent(callback);
      }
      svcdetach(callback) {
        var self = this;
        if (self._isClosed) {
          (0, callback_1.doError)(new Error("Connection is closed."), callback);
          return;
        }
        self._isUsed = !1, self._isDetach = !0;
        var msg = self._msg;
        msg.pos = 0, msg.addInt(const_1.default.op_service_detach), msg.addInt(this.svchandle), self._queueEvent(function(err, ret) {
          delete self.svchandle, callback && callback(err, ret);
        });
      }
      auxConnection(eventid, callback) {
        typeof eventid == "function" && (callback = eventid, eventid = 0);
        var self = this;
        if (self._isClosed)
          return this.throwClosed(callback);
        var msg = self._msg;
        msg.pos = 0, msg.addInt(const_1.default.op_connect_request), msg.addInt(1), msg.addInt(self.dbhandle), msg.addInt(eventid), process.env.FIREBIRD_DEBUG && console.log("[fb-debug] auxConnection: sending op_connect_request(53) dbhandle=%d eventid=%d queue_before=%d xdr_saved=%s", self.dbhandle, eventid, self._queue.length, !!self._xdr);
        function cb(err, ret) {
          if (err) {
            process.env.FIREBIRD_DEBUG && console.log("[fb-debug] auxConnection: op_connect_request error: %s queue=%d", err.message, self._queue.length), (0, callback_1.doError)(err, callback);
            return;
          }
          var socket_info = {
            family: ret.buffer.readInt16BE(0),
            port: ret.buffer.readUInt16BE(2),
            host: ret.buffer.readUInt8(4) + "." + ret.buffer.readUInt8(5) + "." + ret.buffer.readUInt8(6) + "." + ret.buffer.readUInt8(7)
          };
          process.env.FIREBIRD_DEBUG && console.log("[fb-debug] auxConnection: op_response ok \u2192 aux family=%d port=%d host=%s queue=%d", socket_info.family, socket_info.port, socket_info.host, self._queue.length), callback(void 0, socket_info);
        }
        this._queueEvent(cb);
      }
      queEvents(events, eventid, callback) {
        var self = this;
        if (this._isClosed)
          return this.throwClosed(callback);
        var msg = this._msg, blr = this._blr;
        blr.pos = 0, msg.pos = 0, msg.addInt(const_1.default.op_que_events), msg.addInt(this.dbhandle), blr.addByte(1);
        for (var event in events) {
          var event_buffer = Buffer.from(event, "utf8");
          if (event_buffer.length < 1 || event_buffer.length > 127) {
            (0, callback_1.doError)(new Error("Firebird event names must be between 1 and 127 UTF-8 bytes."), callback);
            return;
          }
          blr.addByte(event_buffer.length), blr.addBytes(event_buffer), blr.addInt32(events[event]);
        }
        msg.addBlr(blr), msg.addInt(0), msg.addInt(0), msg.addInt(eventid);
        function cb(err, ret) {
          if (err) {
            (0, callback_1.doError)(err, callback);
            return;
          }
          callback(null, ret);
        }
        this._queueEvent(cb);
      }
      closeEvents(eventid, callback) {
        var self = this;
        if (this._isClosed)
          return this.throwClosed(callback);
        var msg = self._msg;
        msg.pos = 0, msg.addInt(const_1.default.op_cancel_events), msg.addInt(self.dbhandle), msg.addInt(eventid);
        function cb(err, ret) {
          if (err) {
            (0, callback_1.doError)(err, callback);
            return;
          }
          callback(null);
        }
        this._queueEvent(cb);
      }
    }, opcodeNames = Object.fromEntries(Object.entries(const_1.default).filter(([k]) => k.startsWith("op_")).map(([k, v]) => [v, k]));
    function decodeResponse(data, callback, cnx, lowercase_keys, cb) {
      let delivered = !1, deliver = cb;
      cb = function(err, obj) {
        return delivered = !0, deliver(err, obj);
      };
      try {
        do {
          var r = data.r || data.readInt();
          if (data.r && (data.r = null), r !== const_1.default.op_dummy && r === const_1.default.op_inline_blob) {
            process.env.FIREBIRD_DEBUG && console.log("[fb-debug] decodeResponse: opcode=op_inline_blob");
            var tran_id = data.readInt(), blob_id = data.readQuad(), blob_data = data.readArray();
            cnx._inlineBlobs || (cnx._inlineBlobs = /* @__PURE__ */ new Map());
            let cacheKey = `${blob_id.high}:${blob_id.low}`;
            cnx._inlineBlobs.set(cacheKey, blob_data), r = const_1.default.op_dummy;
          }
        } while (r === const_1.default.op_dummy);
        process.env.FIREBIRD_DEBUG && console.log("[fb-debug] decodeResponse: opcode=%d(%s) pos=%d buflen=%d", r, opcodeNames[r] || "unknown", data.pos, data.buffer.length);
        var item, op, response;
        switch (r) {
          case const_1.default.op_response:
            callback ? response = callback.response || {} : response = {};
            let loop = function(err) {
              if (err)
                return cb(err);
              callback && callback.lazy_count ? (callback.lazy_count--, callback.lazy_count > 0 ? (r = data.readInt(), parseOpResponse(data, response, loop)) : cb(null, response)) : cb(null, response);
            };
            return parseOpResponse(data, response, loop);
          case const_1.default.op_batch_cs: {
            var completion = {
              statementHandle: data.readInt(),
              recordCount: data.readInt()
            }, updatesCount = data.readInt(), vectorsCount = data.readInt(), simpleErrorsCount = data.readInt();
            completion.updateCounts = new Array(updatesCount);
            for (var bi = 0; bi < updatesCount; bi++)
              completion.updateCounts[bi] = data.readInt();
            completion.detailedErrors = [];
            for (var bi = 0; bi < vectorsCount; bi++) {
              var recordNumber = data.readInt(), vector = readStatusVector(data), recordError = new Error((0, utils_1.lookupMessages)(vector.status) || "Batch record failed");
              vector.status.length && (recordError.gdscode = vector.status[0].gdscode, recordError.gdsparams = vector.status[0].params), vector.sqlcode !== void 0 && (recordError.sqlcode = vector.sqlcode), completion.detailedErrors.push({ recordNumber, error: recordError });
            }
            completion.errorRecordNumbers = [];
            for (var bi = 0; bi < simpleErrorsCount; bi++)
              completion.errorRecordNumbers.push(data.readInt());
            return cb(null, { batchCompletion: completion });
          }
          case const_1.default.op_fetch_response:
          case const_1.default.op_sql_response:
            var statement = callback.statement, output = statement.output, custom = statement.options || {}, isOpFetch = r === const_1.default.op_fetch_response, _xdrpos;
            if (statement.nbrowsfetched = statement.nbrowsfetched || 0, delete data.fstatus, delete data.fcount, delete data.fcolumn, delete data.frow, delete data.frows, delete data.fcols, delete data.ftables, isOpFetch && data.fop && (data.readBuffer(68), op = data.readInt(), data.fop = !1, op === const_1.default.op_response))
              return parseOpResponse(data, {}, cb);
            if (isOpFetch || (data.fstatus = 0), data.fstatus = data.fstatus !== void 0 ? data.fstatus : data.readInt(), data.fcount = data.fcount !== void 0 ? data.fcount : data.readInt(), data.fcolumn = data.fcolumn || 0, data.frow = data.frow || (custom.asObject ? {} : new Array(output.length)), data.frows = data.frows || [], custom.asObject && !data.fcols) {
              let nest = Xsql.resolveNestTables(custom, cnx.options), transform = Xsql.resolveKeyTransform(custom, cnx.options), columnKeys = Xsql.computeColumnKeys(output, nest, lowercase_keys, transform);
              data.fcols = columnKeys.map((k) => k.key), nest === !0 && (data.ftables = columnKeys.map((k) => k.table));
            }
            let arrBlob = [], lowerV13 = statement.connection.accept.protocolVersion < const_1.default.PROTOCOL_VERSION13;
            for (var sqlResponseTrailerPending = !isOpFetch && !data.fcount; data.fcount && data.fstatus !== 100; ) {
              let nullBitSet;
              if (!lowerV13) {
                let nullBitsLen = Math.floor((output.length + 7) / 8);
                nullBitSet = new serialize_1.BitSet(data.readBuffer(nullBitsLen, !1)), data.readBuffer(4 - nullBitsLen & 3, !1);
              }
              for (let length = output.length; data.fcolumn < length; data.fcolumn++) {
                if (item = output[data.fcolumn], !lowerV13 && nullBitSet.get(data.fcolumn)) {
                  let nullKey = custom.asObject ? data.fcols[data.fcolumn] : data.fcolumn;
                  (data.ftables ? Xsql.nestCell(data.frow, data.ftables[data.fcolumn]) : data.frow)[nullKey] = applyTypeCast(cnx.options, item, null);
                  continue;
                }
                try {
                  _xdrpos = data.pos;
                  let key = custom.asObject ? data.fcols[data.fcolumn] : data.fcolumn, row = data.frows.length, value = item.decode(data, lowerV13, cnx.options), pendingTextBlob = !1;
                  item.type === const_1.default.SQL_BLOB && value !== null && (item.subType === const_1.default.isc_blob_text && cnx.options.blobAsText ? (value = fetch_blob_async_transaction(statement, value, key, row, item, data.ftables && data.ftables[data.fcolumn]), arrBlob.push(value), pendingTextBlob = !0) : value = fetch_blob_async(statement, value, key, row)), (data.ftables ? Xsql.nestCell(data.frow, data.ftables[data.fcolumn]) : data.frow)[key] = pendingTextBlob ? value : applyTypeCast(cnx.options, item, parseValueIfJson(value, cnx.options));
                } catch {
                  return data.pos = _xdrpos, data.r = r, cb(new Error("Packet is not complete"));
                }
              }
              data.fcolumn = 0, statement.connection.db.emit("row", data.frow, statement.nbrowsfetched, custom.asObject), data.frows.push(data.frow), data.frow = custom.asObject ? {} : new Array(output.length);
              try {
                if (_xdrpos = data.pos, isOpFetch) {
                  if (delete data.fstatus, delete data.fcount, op = data.readInt(), op === const_1.default.op_response)
                    return parseOpResponse(data, {}, cb);
                  data.fstatus = data.readInt(), data.fcount = data.readInt();
                } else
                  data.fcount--, r === const_1.default.op_sql_response && (op = data.readInt(), op === const_1.default.op_response && parseOpResponse(data, {}));
              } catch (e) {
                if (delivered)
                  throw e;
                return _xdrpos === data.pos && (data.fop = !0), data.r = r, cb(new Error("Packet is not complete"));
              }
              statement.nbrowsfetched++;
            }
            return sqlResponseTrailerPending && (op = data.readInt(), op === const_1.default.op_response && (response = {}, parseOpResponse(data, response), response.status)) ? cb(null, response) : (statement.connection.db.emit("result", data.frows, arrBlob), cb(null, { data: data.frows, fetched: !isOpFetch || data.fstatus === 100, arrBlob }));
          case const_1.default.op_accept:
          case const_1.default.op_cond_accept:
          case const_1.default.op_accept_data:
            let accept = {
              protocolVersion: data.readInt(),
              protocolArchitecture: data.readInt(),
              protocolMinimumType: data.readInt(),
              compress: !1,
              pluginName: "",
              authData: "",
              sessionKey: ""
            };
            if (accept.compress = (accept.protocolMinimumType & const_1.default.pflag_compress) !== 0, accept.protocolMinimumType = accept.protocolMinimumType & const_1.default.ptype_mask, accept.protocolVersion < 0 && (accept.protocolVersion = accept.protocolVersion & const_1.default.FB_PROTOCOL_MASK | const_1.default.FB_PROTOCOL_FLAG), r === const_1.default.op_cond_accept || r === const_1.default.op_accept_data) {
              var d = new serialize_1.BlrReader(data.readArray());
              accept.pluginName = data.readString(const_1.default.DEFAULT_ENCODING);
              var is_authenticated = data.readInt(), keys = data.readString(const_1.default.DEFAULT_ENCODING);
              if (accept.keys = keys, is_authenticated === 0) {
                if (cnx.options.pluginName && cnx.options.pluginName !== accept.pluginName) {
                  var errPlugin = new Error("Server don't accept plugin : " + cnx.options.pluginName + ", but support : " + accept.pluginName);
                  return (0, callback_1.doError)(errPlugin, callback), cb(errPlugin);
                }
                if (const_1.default.AUTH_PLUGIN_SRP_LIST.indexOf(accept.pluginName) !== -1 && !cnx.clientKeys) {
                  var errPlugin = new Error("Server accepted plugin : " + accept.pluginName + ", but client did not initialize SRP keys");
                  return (0, callback_1.doError)(errPlugin, callback), cb(errPlugin);
                }
                if (const_1.default.AUTH_PLUGIN_SRP_LIST.indexOf(accept.pluginName) !== -1) {
                  var crypto = {
                    Srp: "sha1",
                    Srp256: "sha256",
                    Srp384: "sha384",
                    Srp512: "sha512"
                  };
                  if (accept.srpAlgo = crypto[accept.pluginName], !d.buffer) {
                    cnx._pendingAccept = accept, cnx.sendOpContAuth(cnx.clientKeys.public.toString(16), const_1.default.DEFAULT_ENCODING, accept.pluginName);
                    return;
                  }
                  var saltLen = d.buffer.readUInt16LE(0);
                  if (saltLen > 32 * 2 && console.log("salt to long"), d.buffer.length < saltLen + 4) {
                    var errBuf = new Error("Invalid buffer size for " + accept.pluginName + " login");
                    return (0, callback_1.doError)(errBuf, callback), cb(errBuf);
                  }
                  var keyLen = d.buffer.readUInt16LE(saltLen + 2), keyStart = saltLen + 4;
                  cnx.serverKeys = {
                    salt: d.buffer.slice(2, saltLen + 2).toString("utf8"),
                    public: BigInt("0x" + d.buffer.slice(keyStart, keyStart + keyLen).toString("utf8")),
                    pluginName: accept.pluginName
                  }, process.env.FIREBIRD_DEBUG && (console.log("--- DEBUG SRP Handshake ---"), console.log("salt:", cnx.serverKeys.salt), console.log("server public key:", cnx.serverKeys.public.toString(16)), console.log("client public key:", cnx.clientKeys.public.toString(16)), console.log("hashAlgo:", accept.srpAlgo));
                  let _t1 = Date.now();
                  var proof = srp.clientProof(cnx.options.user.toUpperCase(), cnx.options.password, cnx.serverKeys.salt, cnx.clientKeys.public, cnx.serverKeys.public, cnx.clientKeys.private, accept.srpAlgo);
                  process.env.FIREBIRD_DEBUG && console.log("client proof M1:", proof.authData.toString(16)), process.env.FIREBIRD_DEBUG && console.log("[fb-debug] srp.clientProof(%s): %dms", accept.srpAlgo, Date.now() - _t1), accept.authData = proof.authData.toString(16), accept.sessionKey = proof.clientSessionKey;
                } else if (accept.pluginName === const_1.default.AUTH_PLUGIN_LEGACY)
                  accept.authData = crypt.crypt(cnx.options.password, const_1.default.LEGACY_AUTH_SALT).substring(2);
                else
                  return cb(new Error("Unknow auth plugin : " + accept.pluginName));
              } else
                accept.authData = "", accept.sessionKey = "";
            }
            if (accept.compress && cnx._socket.enableCompression(), process.env.FIREBIRD_DEBUG && console.log("[fb-debug] auth: %s received plugin=%s proto=%d t=%dms", r === const_1.default.op_cond_accept ? "op_cond_accept" : r === const_1.default.op_accept_data ? "op_accept_data" : "op_accept", accept.pluginName, accept.protocolVersion, cnx._authStartTime ? Date.now() - cnx._authStartTime : -1), r === const_1.default.op_cond_accept && accept.authData) {
              cnx._pendingAccept = accept, process.env.FIREBIRD_DEBUG && console.log("[fb-debug] auth: sending op_cont_auth plugin=%s t=%dms", accept.pluginName, cnx._authStartTime ? Date.now() - cnx._authStartTime : -1), cnx.sendOpContAuth(accept.authData, const_1.default.DEFAULT_ENCODING, accept.pluginName);
              return;
            }
            return cb(void 0, accept);
          case const_1.default.op_cont_auth:
            var d = new serialize_1.BlrReader(data.readArray()), pluginName = data.readString(const_1.default.DEFAULT_ENCODING);
            if (data.readString(const_1.default.DEFAULT_ENCODING), data.readString(const_1.default.DEFAULT_ENCODING), process.env.FIREBIRD_DEBUG && console.log("[fb-debug] auth: op_cont_auth received plugin=%s pendingAccept=%s t=%dms", pluginName, cnx._pendingAccept ? cnx._pendingAccept.pluginName : "none", cnx._authStartTime ? Date.now() - cnx._authStartTime : -1), cnx._pendingAccept && (cnx._pendingAccept.pluginName === pluginName || const_1.default.AUTH_PLUGIN_SRP_LIST.indexOf(pluginName) !== -1))
              if (cnx._pendingAccept.pluginName !== pluginName && (cnx._pendingAccept.pluginName = pluginName), !cnx.serverKeys || cnx.serverKeys.pluginName !== pluginName) {
                if (!d.buffer || d.buffer.length === 0) {
                  cnx.clientKeys || (cnx.clientKeys = srp.clientSeed()), cnx.serverKeys = void 0, process.env.FIREBIRD_DEBUG && console.log("[fb-debug] auth: server switched to %s, sending client public key t=%dms", pluginName, cnx._authStartTime ? Date.now() - cnx._authStartTime : -1), cnx.sendOpContAuth(cnx.clientKeys.public.toString(16), const_1.default.DEFAULT_ENCODING, pluginName);
                  return;
                }
                if (d.buffer.length < 4) {
                  var errShort = new Error("Invalid buffer size for " + pluginName + " login");
                  return (0, callback_1.doError)(errShort, callback), cb(errShort);
                }
                var saltLen = d.buffer.readUInt16LE(0);
                if (saltLen > 32 * 2 && console.log("salt to long"), d.buffer.length < saltLen + 4) {
                  var errBuf = new Error("Invalid buffer size for " + pluginName + " login");
                  return (0, callback_1.doError)(errBuf, callback), cb(errBuf);
                }
                var keyLen = d.buffer.readUInt16LE(saltLen + 2), keyStart = saltLen + 4;
                cnx.serverKeys = {
                  salt: d.buffer.slice(2, saltLen + 2).toString("utf8"),
                  public: BigInt("0x" + d.buffer.slice(keyStart, keyStart + keyLen).toString("utf8")),
                  pluginName
                };
                var crypto = {
                  Srp: "sha1",
                  Srp256: "sha256",
                  Srp384: "sha384",
                  Srp512: "sha512"
                }, srpAlgo = crypto[pluginName];
                process.env.FIREBIRD_DEBUG && (console.log("--- DEBUG SRP Handshake ---"), console.log("salt:", cnx.serverKeys.salt), console.log("server public key:", cnx.serverKeys.public.toString(16)), console.log("client public key:", cnx.clientKeys.public.toString(16)), console.log("hashAlgo:", srpAlgo));
                let _t1 = Date.now();
                var proof = srp.clientProof(cnx.options.user.toUpperCase(), cnx.options.password, cnx.serverKeys.salt, cnx.clientKeys.public, cnx.serverKeys.public, cnx.clientKeys.private, srpAlgo);
                process.env.FIREBIRD_DEBUG && console.log("[fb-debug] srp.clientProof(%s): %dms", srpAlgo, Date.now() - _t1), cnx._pendingAccept.authData = proof.authData.toString(16), cnx._pendingAccept.sessionKey = proof.clientSessionKey, cnx.sendOpContAuth(cnx._pendingAccept.authData, const_1.default.DEFAULT_ENCODING, pluginName);
                return;
              } else {
                process.env.FIREBIRD_DEBUG && console.log("[fb-debug] auth: server SRP proof (M2) received, waiting for op_accept t=%dms", cnx._authStartTime ? Date.now() - cnx._authStartTime : -1);
                return;
              }
            if (cnx._pendingAccept && pluginName === const_1.default.AUTH_PLUGIN_LEGACY) {
              process.env.FIREBIRD_DEBUG && console.log("[fb-debug] auth: SRP+Legacy_Auth chained-auth (proto %d), sending Legacy_Auth credentials t=%dms", cnx._pendingAccept.protocolVersion, cnx._authStartTime ? Date.now() - cnx._authStartTime : -1);
              var legacyAuthData = crypt.crypt(cnx.options.password, const_1.default.LEGACY_AUTH_SALT).substring(2);
              cnx.sendOpContAuth(legacyAuthData, const_1.default.DEFAULT_ENCODING, pluginName);
              return;
            }
            if (!cnx.options.pluginName) {
              if (cnx.accept && cnx.accept.pluginName === pluginName)
                return cb(new Error("Unable to connect with plugin " + cnx.accept.pluginName));
              if (pluginName === const_1.default.AUTH_PLUGIN_LEGACY)
                return cnx.accept.pluginName = pluginName, cnx.accept.authData = crypt.crypt(cnx.options.password, const_1.default.LEGACY_AUTH_SALT).substring(2), cnx.sendOpContAuth(cnx.accept.authData, const_1.default.DEFAULT_ENCODING, pluginName), { error: new Error("login") };
            }
            return process.env.FIREBIRD_DEBUG && console.warn("[fb-debug] auth: op_cont_auth unhandled plugin=%s pendingAccept=%s options.plugin=%s t=%dms", pluginName, cnx._pendingAccept ? cnx._pendingAccept.pluginName : "none", cnx.options.pluginName || "none", cnx._authStartTime ? Date.now() - cnx._authStartTime : -1), cb(new Error("Unhandled server op_cont_auth for plugin: " + pluginName));
          case const_1.default.op_crypt_key_callback:
            var serverPluginData = data.readArray();
            data.readInt();
            var clientPluginData = parseDbCryptConfig(cnx.options.dbCryptConfig), responseBlr = new serialize_1.BlrWriter(clientPluginData.length + 4);
            responseBlr.addBytes(clientPluginData), cnx.sendOpCryptKeyCallback(responseBlr);
            return;
          case const_1.default.op_event:
            {
              let evtDb = data.readInt();
              data.readArray(), data.readInt64();
              let evtRid = data.readInt();
              process.env.FIREBIRD_DEBUG && console.log("[fb-debug] op_event on main connection: db=%d rid=%d (consumed, not queued)", evtDb, evtRid);
            }
            return cb(null, { _isOpEvent: !0 });
          case const_1.default.op_response_piggyback:
            return parseOpResponse(data, {}, function(err) {
              process.env.FIREBIRD_DEBUG && (err ? console.warn("[fb-debug] op_response_piggyback parse error:", err.message) : console.log("[fb-debug] op_response_piggyback consumed (unsolicited Firebird 5 cleanup)"));
            }), cb(null, { _isOpEvent: !0 });
          default:
            return process.env.FIREBIRD_DEBUG && console.warn("[fb-debug] unknown opcode=%d at pos=%d buflen=%d queue=%d", r, data.pos, data.buffer.length, cnx && cnx._queue ? cnx._queue.length : 0), cb(new Error("Unexpected:" + r));
        }
      } catch (err) {
        if (process.env.FIREBIRD_DEBUG && console.warn("[fb-debug] decodeResponse exception: %s (RangeError=%s) pos=%d buflen=%d", err.message, err instanceof RangeError, data.pos, data.buffer.length), err instanceof RangeError && !delivered)
          return cb(err);
        throw err;
      }
    }
    function readStatusVector(data) {
      for (var result = { status: [] }, item = {}; ; ) {
        var op = data.readInt();
        switch (op) {
          case const_1.default.isc_arg_end:
            return result;
          case const_1.default.isc_arg_gds:
            var num = data.readInt();
            if (!num)
              break;
            item = { gdscode: num }, result.status.push(item);
            break;
          case const_1.default.isc_arg_string:
          case const_1.default.isc_arg_interpreted:
          case const_1.default.isc_arg_sql_state:
            var str = data.readString(const_1.default.DEFAULT_ENCODING);
            (item.params = item.params || []).push(str);
            break;
          case const_1.default.isc_arg_number:
            var n = data.readInt();
            (item.params = item.params || []).push(n), item.gdscode === const_1.default.isc_sqlerr && (result.sqlcode = n);
            break;
          case const_1.default.isc_arg_warning:
            var wnum = data.readInt();
            item = { gdscode: wnum }, wnum && (result.warnings = result.warnings || []).push(item);
            break;
          default:
            throw new Error("Unexpected status vector item: " + op);
        }
      }
    }
    function parseOpResponse(data, response, cb) {
      var handle = data.readInt();
      response.handle || (response.handle = handle);
      var oid = data.readQuad();
      (oid.low || oid.high) && (response.oid = oid);
      var buf = data.readArray();
      buf && (response.buffer = buf);
      for (var num, op, item = {}; ; )
        switch (op = data.readInt(), op) {
          case const_1.default.isc_arg_end:
            return cb ? cb(void 0, response) : response;
          case const_1.default.isc_arg_gds:
            if (num = data.readInt(), !num)
              break;
            item = { gdscode: num }, response.status ? response.status.push(item) : response.status = [item];
            break;
          case const_1.default.isc_arg_string:
          case const_1.default.isc_arg_interpreted:
          case const_1.default.isc_arg_sql_state:
            if (item.params) {
              var str = data.readString(const_1.default.DEFAULT_ENCODING);
              item.params.push(str);
            } else
              item.params = [data.readString(const_1.default.DEFAULT_ENCODING)];
            break;
          case const_1.default.isc_arg_number:
            num = data.readInt(), item.params ? item.params.push(num) : item.params = [num], item.gdscode === const_1.default.isc_sqlerr && (response.sqlcode = num);
            break;
          case const_1.default.isc_arg_warning:
            num = data.readInt(), item = { gdscode: num }, num && (response.warnings = response.warnings || []).push(item);
            break;
          default:
            if (cb)
              return cb(new Error("Unexpected: " + op));
            throw new Error("Unexpected: " + op);
        }
    }
    function describe(buff, statement) {
      for (var br = new serialize_1.BlrReader(buff), parameters = null, type, param; br.pos < br.buffer.length; )
        switch (br.readByteCode()) {
          case const_1.default.isc_info_sql_stmt_type:
            statement.type = br.readInt();
            break;
          case const_1.default.isc_info_sql_get_plan:
            statement.plan = br.readString(const_1.default.DEFAULT_ENCODING);
            break;
          case const_1.default.isc_info_sql_select:
            statement.output = parameters = [];
            break;
          case const_1.default.isc_info_sql_bind:
            statement.input = parameters = [];
            break;
          case const_1.default.isc_info_sql_num_variables:
            br.readInt();
            break;
          case const_1.default.isc_info_sql_describe_vars:
            if (!parameters)
              return;
            br.readInt();
            var finishDescribe = !1;
            for (param = null; !finishDescribe; )
              switch (br.readByteCode()) {
                case const_1.default.isc_info_sql_describe_end:
                  break;
                case const_1.default.isc_info_sql_sqlda_seq:
                  var num = br.readInt();
                  break;
                case const_1.default.isc_info_sql_type:
                  switch (type = br.readInt(), type & -2) {
                    case const_1.default.SQL_VARYING:
                      param = new Xsql.SQLVarString();
                      break;
                    case const_1.default.SQL_NULL:
                      param = new Xsql.SQLVarNull();
                      break;
                    case const_1.default.SQL_TEXT:
                      param = new Xsql.SQLVarText();
                      break;
                    case const_1.default.SQL_DOUBLE:
                      param = new Xsql.SQLVarDouble();
                      break;
                    case const_1.default.SQL_FLOAT:
                    case const_1.default.SQL_D_FLOAT:
                      param = new Xsql.SQLVarFloat();
                      break;
                    case const_1.default.SQL_TYPE_DATE:
                      param = new Xsql.SQLVarDate();
                      break;
                    case const_1.default.SQL_TYPE_TIME:
                      param = new Xsql.SQLVarTime();
                      break;
                    case const_1.default.SQL_TIMESTAMP:
                      param = new Xsql.SQLVarTimeStamp();
                      break;
                    case const_1.default.SQL_TIME_TZ:
                      param = new Xsql.SQLVarTimeTz();
                      break;
                    case const_1.default.SQL_TIME_TZ_EX:
                      param = new Xsql.SQLVarTimeTzEx();
                      break;
                    case const_1.default.SQL_TIMESTAMP_TZ:
                      param = new Xsql.SQLVarTimeStampTz();
                      break;
                    case const_1.default.SQL_TIMESTAMP_TZ_EX:
                      param = new Xsql.SQLVarTimeStampTzEx();
                      break;
                    case const_1.default.SQL_BLOB:
                      param = new Xsql.SQLVarBlob();
                      break;
                    case const_1.default.SQL_ARRAY:
                      param = new Xsql.SQLVarArray();
                      break;
                    case const_1.default.SQL_QUAD:
                      param = new Xsql.SQLVarQuad();
                      break;
                    case const_1.default.SQL_LONG:
                      param = new Xsql.SQLVarInt();
                      break;
                    case const_1.default.SQL_SHORT:
                      param = new Xsql.SQLVarShort();
                      break;
                    case const_1.default.SQL_INT64:
                      param = new Xsql.SQLVarInt64();
                      break;
                    case const_1.default.SQL_INT128:
                      param = new Xsql.SQLVarInt128();
                      break;
                    case const_1.default.SQL_DEC16:
                      param = new Xsql.SQLVarDecFloat16();
                      break;
                    case const_1.default.SQL_DEC34:
                      param = new Xsql.SQLVarDecFloat34();
                      break;
                    case const_1.default.SQL_BOOLEAN:
                      param = new Xsql.SQLVarBoolean();
                      break;
                    default:
                      throw new Error("Unexpected");
                  }
                  parameters[num - 1] = param, param.type = type, param.nullable = !!(param.type & 1), param.type &= -2;
                  break;
                case const_1.default.isc_info_sql_sub_type:
                  param.subType = br.readInt();
                  break;
                case const_1.default.isc_info_sql_scale:
                  param.scale = br.readInt();
                  break;
                case const_1.default.isc_info_sql_length:
                  param.length = br.readInt();
                  break;
                case const_1.default.isc_info_sql_null_ind:
                  param.nullable = !!br.readInt();
                  break;
                case const_1.default.isc_info_sql_field:
                  param.field = br.readString(const_1.default.DEFAULT_ENCODING);
                  break;
                case const_1.default.isc_info_sql_relation:
                  param.relation = br.readString(const_1.default.DEFAULT_ENCODING);
                  break;
                case const_1.default.isc_info_sql_relation_schema:
                  param.relationSchema = br.readString(const_1.default.DEFAULT_ENCODING);
                  break;
                case const_1.default.isc_info_sql_owner:
                  param.owner = br.readString(const_1.default.DEFAULT_ENCODING);
                  break;
                case const_1.default.isc_info_sql_alias:
                  param.alias = br.readString(const_1.default.DEFAULT_ENCODING);
                  break;
                case const_1.default.isc_info_sql_relation_alias:
                  param.relationAlias = br.readString(const_1.default.DEFAULT_ENCODING);
                  break;
                case const_1.default.isc_info_truncated:
                  throw new Error("Truncated");
                default:
                  finishDescribe = !0, br.pos--;
              }
        }
      function unpackCharSetCollation(params) {
        if (params)
          for (let i = 0; i < params.length; i++) {
            let p = params[i];
            p && (p.type === const_1.default.SQL_TEXT || p.type === const_1.default.SQL_VARYING) && p.subType !== void 0 && (p.charSetId = p.subType & 255, p.collationId = p.subType >> 8);
          }
      }
      unpackCharSetCollation(statement.input), unpackCharSetCollation(statement.output), scaleOutputLengths(statement.output, statement.connection && statement.connection.options);
    }
    function scaleOutputLengths(output, options) {
      if (!output || !output.length)
        return;
      let connWidth = Xsql.getFirebirdCharsetWidth(options && options.encoding);
      if (!(connWidth <= 1))
        for (let i = 0; i < output.length; i++) {
          let p = output[i];
          if (!p || p.type !== const_1.default.SQL_TEXT && p.type !== const_1.default.SQL_VARYING || p.charSetId === void 0 || p.charSetId === 1)
            continue;
          let colWidth = (0, codepages_1.charsetWidthById)(p.charSetId);
          colWidth >= connWidth || (p.nativeLength = p.length, p.length = Math.min(Math.floor(p.length / colWidth) * connWidth, Math.floor(65535 / connWidth) * connWidth));
        }
    }
    function scaleBatchFixedPoint(value, meta, bits, column) {
      try {
        return Xsql.toScaledInteger(value, meta.scale, bits);
      } catch (err) {
        var message = err instanceof Error ? err.message : String(err);
        throw new Error("Invalid fixed-point batch value for column " + column + " (" + (meta.field || "?") + "): " + message);
      }
    }
    function validateBatchFixedPointRows(input, rows) {
      for (var i = 0; i < rows.length; i++)
        for (var j = 0; j < input.length; j++) {
          var value = rows[i][j];
          if (value != null) {
            var bits = void 0;
            switch (input[j].type) {
              case const_1.default.SQL_SHORT:
                bits = 16;
                break;
              case const_1.default.SQL_LONG:
                bits = 32;
                break;
              case const_1.default.SQL_INT64:
                bits = 64;
                break;
              case const_1.default.SQL_INT128:
                bits = 128;
                break;
            }
            bits !== void 0 && scaleBatchFixedPoint(value, input[j], bits, j + 1);
          }
        }
    }
    function buildBatchEncoders(input, options) {
      for (var encoders = [], offset = 0, align = function(a) {
        offset = offset + a - 1 & ~(a - 1);
      }, jsonAsObject = options && options.jsonAsObject, toText = function(v) {
        return typeof v == "string" ? v : v instanceof Date ? v.toString() : typeof v == "object" && !Buffer.isBuffer(v) ? jsonAsObject ? JSON.stringify(v) : v.toString() : String(v);
      }, toBytes = function(v, meta2, column2) {
        var b = Buffer.isBuffer(v) ? v : Xsql.encodeConnectionText(options, toText(v));
        if (b.length > meta2.length)
          throw new Error("Batch value for column " + column2 + " is " + b.length + " bytes but the column accepts at most " + meta2.length + " (" + (meta2.field || "?") + ")");
        return b;
      }, toDate = function(v) {
        return v instanceof Date ? v : typeof v == "string" ? (0, utils_1.parseDate)(v) : new Date(v);
      }, j = 0; j < input.length; j++) {
        var meta = input[j], column = j + 1;
        switch (meta.type) {
          case const_1.default.SQL_TEXT:
            encoders.push(/* @__PURE__ */ function(m, col) {
              return function(msg, v) {
                var b = toBytes(v, m, col);
                b.length < m.length && (b = Buffer.concat([b, Buffer.alloc(m.length - b.length, 32)])), msg.addParamBuffer(b);
              };
            }(meta, column)), offset += meta.length;
            break;
          case const_1.default.SQL_VARYING:
          case const_1.default.SQL_NULL:
            encoders.push(/* @__PURE__ */ function(m, col) {
              return function(msg, v) {
                var b = toBytes(v, m, col);
                msg.addInt(b.length), msg.addParamBuffer(b);
              };
            }(meta, column)), align(2), offset += 2 + meta.length;
            break;
          case const_1.default.SQL_SHORT:
            encoders.push(/* @__PURE__ */ function(m, col) {
              return function(msg, v) {
                msg.addInt(Number(scaleBatchFixedPoint(v, m, 16, col)));
              };
            }(meta, column)), align(2), offset += 2;
            break;
          case const_1.default.SQL_LONG:
            encoders.push(/* @__PURE__ */ function(m, col) {
              return function(msg, v) {
                msg.addInt(Number(scaleBatchFixedPoint(v, m, 32, col)));
              };
            }(meta, column)), align(4), offset += 4;
            break;
          case const_1.default.SQL_INT64:
            encoders.push(/* @__PURE__ */ function(m, col) {
              return function(msg, v) {
                msg.addInt64(scaleBatchFixedPoint(v, m, 64, col));
              };
            }(meta, column)), align(8), offset += 8;
            break;
          case const_1.default.SQL_INT128:
            encoders.push(/* @__PURE__ */ function(m, col) {
              return function(msg, v) {
                msg.addInt128(scaleBatchFixedPoint(v, m, 128, col));
              };
            }(meta, column)), align(8), offset += 16;
            break;
          case const_1.default.SQL_FLOAT:
          case const_1.default.SQL_D_FLOAT:
            encoders.push(function(msg, v) {
              msg.addFloat(Number(v));
            }), align(4), offset += 4;
            break;
          case const_1.default.SQL_DOUBLE:
            encoders.push(function(msg, v) {
              msg.addDouble(Number(v));
            }), align(8), offset += 8;
            break;
          case const_1.default.SQL_DEC16:
            encoders.push(function(msg, v) {
              msg.addDecFloat16(v);
            }), align(8), offset += 8;
            break;
          case const_1.default.SQL_DEC34:
            encoders.push(function(msg, v) {
              msg.addDecFloat34(v);
            }), align(8), offset += 16;
            break;
          case const_1.default.SQL_BOOLEAN:
            encoders.push(function(msg, v) {
              msg.addBuffer(Buffer.from([v ? 1 : 0])), msg.addAlignment(1);
            }), offset += 1;
            break;
          case const_1.default.SQL_TIMESTAMP:
            encoders.push(function(msg, v) {
              var parts = Xsql.encodeDateTimeParts(toDate(v));
              msg.addInt(parts.date), msg.addUInt(parts.time);
            }), align(4), offset += 8;
            break;
          case const_1.default.SQL_TYPE_DATE:
            encoders.push(function(msg, v) {
              msg.addInt(Xsql.encodeDateTimeParts(toDate(v)).date);
            }), align(4), offset += 4;
            break;
          case const_1.default.SQL_TYPE_TIME:
            encoders.push(function(msg, v) {
              msg.addUInt(Xsql.encodeDateTimeParts(toDate(v)).time);
            }), align(4), offset += 4;
            break;
          case const_1.default.SQL_BLOB:
          case const_1.default.SQL_QUAD:
            encoders.push(/* @__PURE__ */ function(col) {
              return function(msg, v) {
                if (!v || typeof v.high != "number" || typeof v.low != "number")
                  throw new Error("Batch value for BLOB column " + col + " must be a Buffer, string, object, or blob quad id");
                msg.addInt(v.high), msg.addInt(v.low);
              };
            }(column)), align(4), offset += 8;
            break;
          default:
            throw new Error("executeBatch does not support the type of parameter " + column + " yet (" + (meta.field || "?") + ", SQL type " + meta.type + ")");
        }
        align(2), offset += 2;
      }
      return { encoders, msglen: offset };
    }
    function buildBatchPb(options) {
      var parts = [const_1.default.BATCH_VERSION1], addIntClumplet = function(tag, value) {
        parts.push(tag, 4, 0, 0, 0, value & 255, value >> 8 & 255, value >> 16 & 255, value >> 24 & 255);
      };
      return addIntClumplet(const_1.default.BATCH_TAG_RECORD_COUNTS, 1), (!options || options.multiError !== !1) && addIntClumplet(const_1.default.BATCH_TAG_MULTIERROR, 1), options && options.bufferSize && addIntClumplet(const_1.default.BATCH_TAG_BUFFER_BYTES_SIZE, options.bufferSize), options && options.detailedErrors !== void 0 && addIntClumplet(const_1.default.BATCH_TAG_DETAILED_ERRORS, options.detailedErrors), Buffer.from(parts);
    }
    function CalcBlr(blr, xsqlda) {
      blr.addBytes([const_1.default.blr_version5, const_1.default.blr_begin, const_1.default.blr_message, 0]), blr.addWord(xsqlda.length * 2);
      for (var i = 0, length = xsqlda.length; i < length; i++)
        xsqlda[i].calcBlr(blr), blr.addByte(const_1.default.blr_short), blr.addByte(0);
      blr.addByte(const_1.default.blr_end), blr.addByte(const_1.default.blr_eoc);
    }
    function fetch_blob_async_transaction(statement, id, column, row, meta, table) {
      let infoValue = { row, column, value: "", meta, table }, chunks = [];
      return (transactionArg) => {
        let cacheKey = `${id.high}:${id.low}`;
        if (statement.connection._inlineBlobs && statement.connection._inlineBlobs.has(cacheKey)) {
          let data = statement.connection._inlineBlobs.get(cacheKey);
          return infoValue.value = data ? Xsql.decodeConnectionText(statement.connection.options, data) : "", Promise.resolve(infoValue);
        }
        let singleTransaction = transactionArg === void 0, promiseTransaction;
        return singleTransaction ? promiseTransaction = new Promise((resolve, reject) => {
          statement.connection.startTransaction(const_1.default.ISOLATION_READ_UNCOMMITTED, (err, transaction) => {
            if (err)
              return reject(err);
            resolve(transaction);
          });
        }) : promiseTransaction = Promise.resolve(transactionArg), promiseTransaction.then((transaction) => new Promise((resolve, reject) => {
          statement.connection._pending.push("openBlob"), statement.connection.openBlob(id, transaction, (err, blob) => {
            if (err) {
              reject(err);
              return;
            }
            let read = () => {
              statement.connection.getSegment(blob, (err2, ret) => {
                if (err2) {
                  singleTransaction ? transaction.rollback(() => reject(err2)) : reject(err2);
                  return;
                }
                if (ret.buffer) {
                  let blr = new serialize_1.BlrReader(ret.buffer);
                  chunks.push(blr.readSegment());
                }
                if (ret.handle !== 2) {
                  read();
                  return;
                }
                infoValue.value = Xsql.decodeConnectionText(statement.connection.options, Buffer.concat(chunks)), statement.connection.closeBlob(blob), singleTransaction ? transaction.commit((err3) => {
                  err3 ? reject(err3) : resolve(infoValue);
                }) : resolve(infoValue);
              });
            };
            read();
          });
        }));
      };
    }
    function fetch_blob_async(statement, id, name, row) {
      let cbTransaction = (transaction, close, callback) => {
        statement.connection._pending.push("openBlob"), statement.connection.openBlob(id, transaction, (err, blob) => {
          let e = new events_1.default.EventEmitter();
          if (e.pipe = (stream) => {
            e.on("data", (chunk) => {
              stream.write(chunk);
            }), e.on("end", () => {
              stream.end();
            });
          }, err)
            return callback(err, name, e, row);
          let read = () => {
            statement.connection.getSegment(blob, (err2, ret) => {
              if (err2) {
                transaction.rollback(() => {
                  e.emit("error", err2);
                });
                return;
              }
              if (ret.buffer) {
                let data = new serialize_1.BlrReader(ret.buffer).readSegment();
                e.emit("data", data);
              }
              if (ret.handle !== 2) {
                read();
                return;
              }
              statement.connection.closeBlob(blob), close ? transaction.commit((err3) => {
                err3 ? e.emit("error", err3) : e.emit("end"), e = null;
              }) : (e.emit("end"), e = null);
            });
          };
          callback(err, name, e, row), read();
        });
      };
      return (transaction, callback) => {
        let singleTransaction = callback === void 0, actualCallback = singleTransaction ? transaction : callback, cacheKey = `${id.high}:${id.low}`;
        if (statement.connection._inlineBlobs && statement.connection._inlineBlobs.has(cacheKey)) {
          let data = statement.connection._inlineBlobs.get(cacheKey), e = new events_1.default.EventEmitter();
          e.pipe = (stream) => {
            e.on("data", (chunk) => {
              stream.write(chunk);
            }), e.on("end", () => {
              stream.end();
            });
          }, actualCallback(null, name, e, row), setImmediate(() => {
            data && e.emit("data", data), e.emit("end");
          });
          return;
        }
        singleTransaction ? (callback = transaction, statement.connection.startTransaction(const_1.default.ISOLATION_READ_UNCOMMITTED, (err, transaction2) => {
          if (err) {
            callback(err);
            return;
          }
          cbTransaction(transaction2, singleTransaction, callback);
        })) : cbTransaction(transaction, singleTransaction, callback);
      };
    }
    function resolveFetchSize(statement, options) {
      let size = Number(statement.options?.fetchSize ?? options?.fetchSize);
      return Number.isInteger(size) && size > 0 ? Math.min(size, const_1.default.MAX_FETCHSIZE) : const_1.default.DEFAULT_FETCHSIZE;
    }
    function doSynchronousLoop(data, processData, done) {
      if (!data || !data.length) {
        done();
        return;
      }
      let index = 0, finished = !1, run = () => {
        for (; index < data.length; ) {
          let called = !1, inCall = !0, advanced = !1, next = (err) => {
            if (!(called || finished)) {
              if (called = !0, err) {
                finished = !0, done(err);
                return;
              }
              if (index++, inCall) {
                advanced = !0;
                return;
              }
              run();
            }
          };
          try {
            processData(data[index], index, next);
          } finally {
            inCall = !1;
          }
          if (!advanced)
            return;
        }
        finished = !0, done();
      };
      run();
    }
    function executeStreamRow(custom, row, index, output, next) {
      let done = !1, finish = (err) => {
        done || (done = !0, next(err));
      };
      try {
        let ret = custom.on(row, index, output, finish);
        custom.on.length < 4 ? ret && typeof ret.then == "function" ? ret.then(() => finish()).catch(finish) : finish() : ret && typeof ret.then == "function" && ret.catch(finish);
      } catch (err) {
        finish(err);
      }
    }
    function bufferReader(buffer, max, writer, cb, beg, end) {
      beg || (beg = 0), end || (end = max), end >= buffer.length && (end = void 0);
      var b = buffer.slice(beg, end);
      writer(b, function() {
        if (end === void 0) {
          cb();
          return;
        }
        bufferReader(buffer, max, writer, cb, beg + max, end + max);
      });
    }
    function parseDbCryptConfig(config) {
      if (!config)
        return Buffer.alloc(0);
      if (config.startsWith("base64:")) {
        let base64Value = config.substring(7);
        try {
          return Buffer.from(base64Value, "base64");
        } catch (e) {
          return console.error("Failed to decode base64 dbCryptConfig, returning empty buffer:", e), Buffer.alloc(0);
        }
      }
      return Buffer.from(config, "utf8");
    }
    Connection.decodeResponse = decodeResponse;
    Connection.fetch_blob_async_transaction = fetch_blob_async_transaction;
    Connection.fetch_blob_async = fetch_blob_async;
    Connection.parseValueIfJson = parseValueIfJson;
    Connection.describe = describe;
    Connection.doSynchronousLoop = doSynchronousLoop;
    module2.exports = Connection;
  }
});

// node_modules/node-firebird/lib/pool.js
var require_pool = __commonJS({
  "node_modules/node-firebird/lib/pool.js"(exports2, module2) {
    "use strict";
    var __importDefault = exports2 && exports2.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { default: mod };
    }, events_1 = __importDefault(require("events")), callback_1 = require_callback(), Pool = class extends events_1.default.EventEmitter {
      constructor(attach, max, options) {
        super(), this.attach = attach, this.internaldb = [], this.pooldb = [], this.dbinuse = 0, this._creating = 0, this.max = max || 4, this.min = options && options.min > 0 ? Math.min(options.min, this.max) : 0, this.idleTimeoutMillis = options && options.idleTimeoutMillis > 0 ? options.idleTimeoutMillis : 0, this.maxUses = options && options.maxUses > 0 ? options.maxUses : 0, this.maxLifetimeMillis = options && options.maxLifetimeMillis > 0 ? options.maxLifetimeMillis : 0, this.pending = [], this.options = options, this._destroyed = !1, this._reaper = null;
        var sweepBasis = Math.min(this.idleTimeoutMillis || 1 / 0, this.maxLifetimeMillis || 1 / 0);
        if (sweepBasis !== 1 / 0) {
          var self = this, interval = Math.min(Math.max(sweepBasis / 2, 100), 3e4);
          this._reaper = setInterval(function() {
            self._reap();
          }, interval), this._reaper.unref && this._reaper.unref();
        }
      }
      /** True when the connection exceeded maxUses / maxLifetimeMillis.
       *  Both stamps are set unconditionally when the pool creates the
       *  connection, so they can be read bare here. */
      _isExpired(db) {
        return this.maxUses > 0 && db.__poolUseCount >= this.maxUses || this.maxLifetimeMillis > 0 && Date.now() - db.__poolCreatedAt >= this.maxLifetimeMillis;
      }
      /** Close a healthy pooled connection for good (reaper/retirement path). */
      _retire(db) {
        var self = this;
        this._forget(db), db.connection._pooled = !1;
        try {
          db.detach(function(err) {
            err && self._emitError(err, db);
          });
        } catch (e) {
          self._emitError(e, db);
        }
      }
      /** Physical connections owned by the pool (idle + in use). */
      get totalCount() {
        return this.internaldb.length;
      }
      /** Connections sitting idle in the pool. */
      get idleCount() {
        return this.pooldb.length;
      }
      /** Connections currently handed out to callers. */
      get activeCount() {
        return this.dbinuse;
      }
      /** get() requests queued for a free slot. */
      get waitingCount() {
        return this.pending.length;
      }
      /** True when the connection can no longer be used. */
      _isDead(db) {
        return !db.connection || db.connection._isClosed || db.connection._isDetach || !db.connection._socket || db.connection._socket.destroyed;
      }
      /** Drop a physical connection from the pool's books and emit 'remove'. */
      _forget(db) {
        var idx = this.internaldb.indexOf(db);
        idx !== -1 && this.internaldb.splice(idx, 1), idx = this.pooldb.indexOf(db), idx !== -1 && this.pooldb.splice(idx, 1), this.emit("remove", db);
      }
      /** Emit 'error' only when someone listens — never crash the app. */
      _emitError(err, db) {
        this.listenerCount("error") > 0 && this.emit("error", err, db);
      }
      /**
       * Idle sweep: evict dead idle connections immediately and close healthy
       * ones that have been idle longer than idleTimeoutMillis, keeping at
       * least `min` physical connections. (issue #329)
       */
      _reap() {
        if (!this._destroyed) {
          var self = this, now = Date.now();
          this.pooldb.slice().forEach(function(db) {
            if (self._isDead(db)) {
              self._forget(db);
              return;
            }
            if (self._isExpired(db)) {
              self._retire(db);
              return;
            }
            if (self.idleTimeoutMillis && !(self.internaldb.length <= self.min)) {
              var idleSince = typeof db.__poolIdleSince == "number" ? db.__poolIdleSince : now;
              now - idleSince < self.idleTimeoutMillis || self._retire(db);
            }
          });
        }
      }
      get(callback) {
        if (this._destroyed)
          return callback(new Error("Pool has been destroyed"), null), this;
        var self = this;
        return self.pending.push(callback), self.check(), self;
      }
      check() {
        var self = this;
        if (self._destroyed || self.dbinuse + self._creating >= self.max)
          return self;
        let cb = self.pending.shift();
        if (!cb)
          return self;
        if (self.pooldb.length) {
          var db = self.pooldb.shift();
          if (self._isDead(db))
            return self._forget(db), self.pending.unshift(cb), setImmediate(function() {
              self.check();
            }), self;
          self.dbinuse++, db.__poolUseCount = (db.__poolUseCount || 0) + 1, self.emit("acquire", db), cb(null, db);
        } else {
          self._creating++;
          var timedOut = !1, timer = null;
          self.options.connectTimeout > 0 && (timer = setTimeout(function() {
            timedOut = !0, self._creating--, cb(new Error("Connection timeout after " + self.options.connectTimeout + "ms"), null), setImmediate(function() {
              self.check();
            });
          }, self.options.connectTimeout)), this.attach(self.options, function(err, db2) {
            if (timedOut) {
              if (db2)
                try {
                  db2.connection && (db2.connection._pooled = !1), db2.detach();
                } catch {
                }
              return;
            }
            if (timer && clearTimeout(timer), self._creating--, self._destroyed) {
              if (db2)
                try {
                  db2.connection && (db2.connection._pooled = !1), db2.detach();
                } catch {
                }
              cb(new Error("Pool has been destroyed"), null);
              return;
            }
            err || (self.dbinuse++, db2.__poolCreatedAt = Date.now(), db2.__poolUseCount = 1, self.internaldb.push(db2), db2.on("detach", function() {
              self.pooldb.indexOf(db2) !== -1 || self.internaldb.indexOf(db2) === -1 || (db2.connection._isClosed || db2.connection._isDetach || db2.connection._pooled === !1 ? (self.internaldb.splice(self.internaldb.indexOf(db2), 1), self.emit("remove", db2)) : self._destroyed || self._isExpired(db2) ? self._retire(db2) : (db2.__poolIdleSince = Date.now(), self.pooldb.push(db2), self.emit("release", db2)), self.dbinuse--, self.check());
            }), self.emit("connect", db2), self.emit("acquire", db2)), cb(err, db2);
          });
        }
        return setImmediate(function() {
          self.check();
        }), self;
      }
      destroy(callback) {
        var self = this;
        self._destroyed = !0, self._reaper && (clearInterval(self._reaper), self._reaper = null);
        var draining = self.pending.splice(0);
        draining.forEach(function(cb) {
          try {
            cb(new Error("Pool is being destroyed"), null);
          } catch {
          }
        });
        var connectionCount = this.internaldb.length;
        connectionCount === 0 && callback && callback();
        function detachCallback(err) {
          if (err) {
            callback && callback(err);
            return;
          }
          connectionCount--, connectionCount === 0 && callback && callback();
        }
        this.internaldb.slice().forEach(function(db) {
          if (db.connection._pooled === !1) {
            detachCallback();
            return;
          }
          var _db_in_pool = self.pooldb.indexOf(db);
          _db_in_pool !== -1 ? (db.connection._pooled = !1, db.detach(function(err) {
            self._forget(db), detachCallback(err);
          })) : detachCallback();
        });
      }
      /* Promise / async-await API — wrappers over the callback methods above. */
      getAsync() {
        var self = this;
        return (0, callback_1.fromCallback)(function(cb) {
          self.get(cb);
        });
      }
      destroyAsync() {
        var self = this;
        return (0, callback_1.fromCallback)(function(cb) {
          self.destroy(cb);
        });
      }
      /**
       * Run `work` with a connection from the pool, returning it to the pool
       * (detach) when the returned promise settles — success or failure.
       */
      withConnection(work) {
        return (0, callback_1.withPooledConnection)(() => this.getAsync(), work);
      }
    };
    module2.exports = Pool;
  }
});

// node_modules/node-firebird/lib/uri.js
var require_uri = __commonJS({
  "node_modules/node-firebird/lib/uri.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: !0 });
    exports2.parseConnectionUri = parseConnectionUri;
    exports2.parseOldStyleConnectionString = parseOldStyleConnectionString;
    exports2.parseConnectionString = parseConnectionString;
    exports2.normalizeOptions = normalizeOptions;
    var BOOLEAN_KEYS = /* @__PURE__ */ new Set([
      "lowercase_keys",
      "blobAsText",
      "wireCompression",
      "manager",
      "namedPlaceholders",
      "enableKeepAlive",
      "eventBaseline"
    ]), NUMBER_KEYS = /* @__PURE__ */ new Set([
      "port",
      "pageSize",
      "timeout",
      "retryConnectionInterval",
      "blobChunkSize",
      "blobReadChunkSize",
      "wireCrypt",
      "parallelWorkers",
      "maxInlineBlobSize",
      "maxNegotiatedProtocols",
      "connectTimeout",
      "min",
      "idleTimeoutMillis",
      "keepAliveInitialDelay",
      "ipFamily",
      "fetchSize"
    ]);
    function coerce(key, value) {
      if (BOOLEAN_KEYS.has(key))
        return /^(1|true|yes|on)$/i.test(value);
      if (NUMBER_KEYS.has(key)) {
        var n = Number(value);
        if (Number.isNaN(n))
          throw new Error('Invalid numeric value for connection URI option "' + key + '": ' + value);
        return n;
      }
      return value;
    }
    var URI_SCHEMES = {
      "firebird:": void 0,
      "inet:": void 0,
      "inet4:": 4,
      "inet6:": 6
    }, LOCAL_SCHEMES = /^(xnet|wnet):$/;
    function parseConnectionUri(uri) {
      var url;
      try {
        url = new URL(uri);
      } catch {
        throw new Error("Invalid connection URI: " + uri);
      }
      var scheme = url.protocol.toLowerCase();
      if (LOCAL_SCHEMES.test(scheme))
        throw new Error('Unsupported connection URI scheme "' + scheme.replace(/:$/, "") + '" (local IPC transports are not available over the wire \u2014 use inet:// or firebird://)');
      if (!Object.prototype.hasOwnProperty.call(URI_SCHEMES, scheme))
        throw new Error('Unsupported connection URI scheme "' + scheme.replace(/:$/, "") + '" (expected firebird://, inet://, inet4:// or inet6://)');
      var options = {}, ipFamily = URI_SCHEMES[scheme];
      ipFamily !== void 0 && (options.ipFamily = ipFamily), url.hostname && (options.host = url.hostname.replace(/^\[(.*)\]$/, "$1")), url.port && (options.port = Number(url.port)), url.username && (options.user = decodeURIComponent(url.username)), url.password && (options.password = decodeURIComponent(url.password));
      var database = decodeURIComponent(url.pathname || "");
      return database.startsWith("/") && (database = database.slice(1)), database.includes("/") && !database.startsWith("/") && !/^[A-Za-z]:\//.test(database) && (database = "/" + database), database && (options.database = database), url.searchParams.forEach(function(value, key) {
        options[key] = coerce(key, value);
      }), options;
    }
    function parseOldStyleConnectionString(str) {
      var options = {}, host = null, port = null, database = str, ipv6 = /^\[([^\]]+)\](?:\/([^:]*))?:(.*)$/.exec(str);
      if (ipv6)
        host = ipv6[1], port = ipv6[2] !== void 0 ? ipv6[2] : null, database = ipv6[3];
      else {
        var colon = str.indexOf(":");
        if (colon === 0)
          throw new Error("Invalid connection string (empty host): " + str);
        if (colon > 1) {
          var hostPart = str.slice(0, colon);
          database = str.slice(colon + 1);
          var slash = hostPart.indexOf("/");
          if (slash !== -1) {
            if (host = hostPart.slice(0, slash), port = hostPart.slice(slash + 1), !host)
              throw new Error("Invalid connection string (empty host): " + str);
          } else
            host = hostPart;
        }
      }
      if (!database)
        throw new Error("Invalid connection string (empty database): " + str);
      if (host && (options.host = host), port !== null) {
        var n = Number(port);
        if (!/^\d+$/.test(port) || n < 1 || n > 65535)
          throw new Error('Invalid port in connection string "' + str + '" (service names are not supported \u2014 use a numeric port)');
        options.port = n;
      }
      return options.database = database, options;
    }
    var URI_SCHEME = /^[A-Za-z][A-Za-z0-9+.-]*:\/\//;
    function parseConnectionString(str) {
      return URI_SCHEME.test(str) ? parseConnectionUri(str) : parseOldStyleConnectionString(str);
    }
    function normalizeOptions(options) {
      typeof options == "string" && (options = parseConnectionString(options));
      let normalized = applyEnvDefaults(options), numericMode = normalized && normalized.numericMode;
      if (numericMode !== void 0 && numericMode !== "lossy" && numericMode !== "safe" && numericMode !== "string")
        throw new Error("Invalid numericMode option: " + numericMode + ' (expected "lossy", "safe", or "string")');
      return normalized;
    }
    var ENV_FALLBACKS = [
      ["user", "ISC_USER"],
      ["password", "ISC_PASSWORD"],
      ["host", "FIREBIRD_HOST"],
      ["port", "FIREBIRD_PORT"],
      ["database", "FIREBIRD_DATABASE"],
      ["role", "FIREBIRD_ROLE"]
    ];
    function applyEnvDefaults(options) {
      let out = options;
      for (let [key, envName] of ENV_FALLBACKS) {
        let value = process.env[envName];
        if (!(value === void 0 || value === "") && !(key === "database" && options.manager) && (out[key] === void 0 || out[key] === null || out[key] === ""))
          if (out === options && (out = { ...options }), key === "port") {
            let port = Number(value);
            if (!Number.isFinite(port) || port <= 0)
              throw new Error("Invalid FIREBIRD_PORT environment variable: " + value);
            out[key] = port;
          } else
            out[key] = value;
      }
      return out;
    }
  }
});

// node_modules/node-firebird/lib/pool-cluster.js
var require_pool_cluster = __commonJS({
  "node_modules/node-firebird/lib/pool-cluster.js"(exports2) {
    "use strict";
    var __importDefault = exports2 && exports2.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { default: mod };
    };
    Object.defineProperty(exports2, "__esModule", { value: !0 });
    var events_1 = __importDefault(require("events")), callback_1 = require_callback(), uri_1 = require_uri(), pool_1 = __importDefault(require_pool());
    function patternToRegExp(pattern) {
      let escaped = pattern.replace(/[.+?^${}()|[\]\\]/g, "\\$&").replace(/\*/g, ".*");
      return new RegExp("^" + escaped + "$");
    }
    var PoolCluster = class extends events_1.default.EventEmitter {
      constructor(attach, options) {
        super(), this.nodes = /* @__PURE__ */ new Map(), this.rrIndex = /* @__PURE__ */ new Map(), this._destroyed = !1, options = options || {}, this.attach = attach, this.defaults = options.defaults || {}, this.max = options.max && options.max > 0 ? options.max : 4, this.selector = options.selector || "rr", this.removeNodeErrorCount = options.removeNodeErrorCount !== void 0 ? options.removeNodeErrorCount : 5, this.restoreNodeTimeout = options.restoreNodeTimeout !== void 0 ? options.restoreNodeTimeout : 3e4;
        for (let [name, overrides] of Object.entries(options.nodes || {}))
          this.add(name, overrides);
      }
      /** Register a node; its pool is created lazily-safe right away. */
      add(name, overrides) {
        if (this._destroyed)
          throw new Error("PoolCluster has been destroyed");
        if (this.nodes.has(name))
          throw new Error("PoolCluster node already exists: " + name);
        typeof overrides == "string" && (overrides = (0, uri_1.parseConnectionString)(overrides));
        let nodeOptions = { ...this.defaults, ...overrides || {} };
        return this.nodes.set(name, {
          name,
          options: nodeOptions,
          pool: new pool_1.default(this.attach, nodeOptions.max || this.max, { ...nodeOptions, isPool: !0 }),
          online: !0,
          errorCount: 0,
          restoreTimer: null
        }), this;
      }
      /** Remove a node for good, destroying its pool. */
      remove(name, callback) {
        let node = this.nodes.get(name);
        if (!node) {
          callback && callback();
          return;
        }
        this.nodes.delete(name), node.restoreTimer && clearTimeout(node.restoreTimer), this.emit("remove", name), node.pool.destroy(callback);
      }
      /** Bring an offline node back into rotation immediately. */
      restore(name) {
        let node = this.nodes.get(name);
        !node || node.online || (node.restoreTimer && (clearTimeout(node.restoreTimer), node.restoreTimer = null), node.online = !0, node.errorCount = 0, this.emit("online", name));
      }
      /** name → { online, errorCount, pool metrics } for every node. */
      status() {
        let out = {};
        for (let node of this.nodes.values())
          out[node.name] = {
            online: node.online,
            errorCount: node.errorCount,
            totalCount: node.pool.totalCount,
            idleCount: node.pool.idleCount,
            activeCount: node.pool.activeCount,
            waitingCount: node.pool.waitingCount
          };
        return out;
      }
      matching(pattern) {
        let re = patternToRegExp(pattern), out = [];
        for (let node of this.nodes.values())
          re.test(node.name) && out.push(node);
        return out;
      }
      pick(pattern, selector, exclude) {
        let candidates = this.matching(pattern).filter((n) => n.online && !exclude.has(n.name));
        if (!candidates.length)
          return null;
        if (selector === "random")
          return candidates[Math.floor(Math.random() * candidates.length)];
        if (selector === "order")
          return candidates[0];
        let index = this.rrIndex.get(pattern) || 0;
        return exclude.size === 0 && this.rrIndex.set(pattern, index + 1), candidates[index % candidates.length];
      }
      noteFailure(node) {
        this.nodes.has(node.name) && (node.errorCount++, !(!this.removeNodeErrorCount || node.errorCount < this.removeNodeErrorCount || !node.online) && (node.online = !1, this.emit("offline", node.name), this.restoreNodeTimeout > 0 && (node.restoreTimer = setTimeout(() => {
          node.restoreTimer = null, this.restore(node.name);
        }, this.restoreNodeTimeout), node.restoreTimer.unref && node.restoreTimer.unref())));
      }
      /**
       * Acquire a connection from a node matching `pattern` (default '*').
       * Connection failures mark the node and FAIL OVER to the next
       * matching online node; only when every candidate has failed does the
       * callback receive the last error. Release connections with
       * db.detach(), exactly like a plain pool.
       */
      get(pattern, selector, callback) {
        if (typeof pattern == "function" && (callback = pattern, pattern = "*"), typeof selector == "function" && (callback = selector, selector = void 0), this._destroyed) {
          callback(new Error("PoolCluster has been destroyed"), null);
          return;
        }
        let sel = selector || this.selector, tried = /* @__PURE__ */ new Set(), self = this, attempt = (lastError) => {
          let node = self.pick(pattern, sel, tried);
          if (!node) {
            callback(lastError || new Error('PoolCluster: no online node matches pattern "' + pattern + '"'), null);
            return;
          }
          tried.add(node.name), node.pool.get((err, db) => {
            if (err) {
              self.noteFailure(node), attempt(err);
              return;
            }
            node.errorCount = 0, callback(null, db);
          });
        };
        attempt();
      }
      getAsync(pattern, selector) {
        let self = this;
        return (0, callback_1.fromCallback)((cb) => self.get(pattern || "*", selector, cb));
      }
      /**
       * A pool-like facade bound to a pattern (mysql2's cluster.of):
       * { get, getAsync, withConnection } routed through the cluster's
       * selection and failover.
       */
      of(pattern, selector) {
        let self = this;
        return {
          get(callback) {
            self.get(pattern, selector, callback);
          },
          getAsync() {
            return self.getAsync(pattern, selector);
          },
          withConnection(work) {
            return self.withConnection(pattern, work, selector);
          }
        };
      }
      /** Run `work` with a connection from a matching node, always released. */
      withConnection(pattern, work, selector) {
        return (0, callback_1.withPooledConnection)(() => this.getAsync(pattern, selector), work);
      }
      /** Destroy every node's pool. */
      destroy(callback) {
        this._destroyed = !0;
        let nodes = [...this.nodes.values()];
        this.nodes.clear();
        let remaining = nodes.length;
        if (!remaining) {
          callback && callback();
          return;
        }
        let firstError = null;
        for (let node of nodes)
          node.restoreTimer && clearTimeout(node.restoreTimer), node.pool.destroy((err) => {
            err && !firstError && (firstError = err), --remaining === 0 && callback && callback(firstError);
          });
      }
      destroyAsync() {
        let self = this;
        return (0, callback_1.fromCallback)((cb) => self.destroy(cb));
      }
    };
    exports2.default = PoolCluster;
  }
});

// node_modules/node-firebird/lib/types.js
var require_types = __commonJS({
  "node_modules/node-firebird/lib/types.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: !0 });
    exports2.ShutdownKind = exports2.ShutdownMode = void 0;
    var ShutdownMode;
    (function(ShutdownMode2) {
      ShutdownMode2[ShutdownMode2.NORMAL = 0] = "NORMAL", ShutdownMode2[ShutdownMode2.MULTI = 1] = "MULTI", ShutdownMode2[ShutdownMode2.SINGLE = 2] = "SINGLE", ShutdownMode2[ShutdownMode2.FULL = 3] = "FULL";
    })(ShutdownMode || (exports2.ShutdownMode = ShutdownMode = {}));
    var ShutdownKind;
    (function(ShutdownKind2) {
      ShutdownKind2[ShutdownKind2.FORCED = 0] = "FORCED", ShutdownKind2[ShutdownKind2.DENY_TRANSACTION = 1] = "DENY_TRANSACTION", ShutdownKind2[ShutdownKind2.DENY_ATTACHMENT = 2] = "DENY_ATTACHMENT";
    })(ShutdownKind || (exports2.ShutdownKind = ShutdownKind = {}));
  }
});

// node_modules/node-firebird/lib/gdscodes.js
var require_gdscodes = __commonJS({
  "node_modules/node-firebird/lib/gdscodes.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: !0 });
    exports2.GDSCode = void 0;
    var GDSCode = {
      /** Arithmetic exception, numeric overflow, or string */
      ARITH_EXCEPT: 335544321,
      /** Invalid database key */
      BAD_DBKEY: 335544322,
      /** File @1 is not a valid */
      BAD_DB_FORMAT: 335544323,
      /** Invalid database handle (no active connection) */
      BAD_DB_HANDLE: 335544324,
      /** Bad parameters on attach or create */
      BAD_DPB_CONTENT: 335544325,
      /** Unrecognized database parameter block */
      BAD_DPB_FORM: 335544326,
      /** Invalid request handle */
      BAD_REQ_HANDLE: 335544327,
      /** Invalid BLOB handle */
      BAD_SEGSTR_HANDLE: 335544328,
      /** Invalid BLOB ID */
      BAD_SEGSTR_ID: 335544329,
      /** Invalid parameter in transaction parameter block */
      BAD_TPB_CONTENT: 335544330,
      /** Invalid format for transaction parameter block */
      BAD_TPB_FORM: 335544331,
      /** Invalid transaction handle (expecting explicit */
      BAD_TRANS_HANDLE: 335544332,
      /** Internal gds software consistency check (@1) */
      BUG_CHECK: 335544333,
      /** Conversion error from string "@1" */
      CONVERT_ERROR: 335544334,
      /** Database file appears corrupt (@1) */
      DB_CORRUPT: 335544335,
      /** Deadlock */
      DEADLOCK: 335544336,
      /** Attempt to start more than @1 */
      EXCESS_TRANS: 335544337,
      /** No match for first value expression */
      FROM_NO_MATCH: 335544338,
      /** Information type inappropriate for object */
      INFINAP: 335544339,
      /** No information of this type available */
      INFONA: 335544340,
      /** Unknown information item */
      INFUNK: 335544341,
      /** Action cancelled by trigger (@1) to */
      INTEG_FAIL: 335544342,
      /** Invalid request BLR at offset @1 */
      INVALID_BLR: 335544343,
      /** I/O error for file "@2" */
      IO_ERROR: 335544344,
      /** Lock conflict on no wait transaction */
      LOCK_CONFLICT: 335544345,
      /** Corrupt system table */
      METADATA_CORRUPT: 335544346,
      /** Validation error for column @1, value */
      NOT_VALID: 335544347,
      /** No current record for fetch operation */
      NO_CUR_REC: 335544348,
      /** Attempt to store duplicate value (visible */
      NO_DUP: 335544349,
      /** Program attempted to exit without finishing */
      NO_FINISH: 335544350,
      /** Unsuccessful metadata update */
      NO_META_UPDATE: 335544351,
      /** No permission for @1 access to */
      NO_PRIV: 335544352,
      /** Transaction is not in limbo */
      NO_RECON: 335544353,
      /** Invalid database key */
      NO_RECORD: 335544354,
      /** BLOB was not closed */
      NO_SEGSTR_CLOSE: 335544355,
      /** Metadata is obsolete */
      OBSOLETE_METADATA: 335544356,
      /** Cannot disconnect database with open */
      OPEN_TRANS: 335544357,
      /** Message length error (encountered @1, expected */
      PORT_LEN: 335544358,
      /** Attempted update of read-only column */
      READ_ONLY_FIELD: 335544359,
      /** Attempted update of read-only table */
      READ_ONLY_REL: 335544360,
      /** Attempted update during read-only transaction */
      READ_ONLY_TRANS: 335544361,
      /** Cannot update read-only view @1 */
      READ_ONLY_VIEW: 335544362,
      /** No transaction for request */
      REQ_NO_TRANS: 335544363,
      /** Request synchronization error */
      REQ_SYNC: 335544364,
      /** Request referenced an unavailable database */
      REQ_WRONG_DB: 335544365,
      /** Segment buffer length shorter than expected */
      SEGMENT: 335544366,
      /** Attempted retrieval of more segments than */
      SEGSTR_EOF: 335544367,
      /** Attempted invalid operation on a BLOB */
      SEGSTR_NO_OP: 335544368,
      /** Attempted read of a new, open */
      SEGSTR_NO_READ: 335544369,
      /** Attempted action on blob outside transaction */
      SEGSTR_NO_TRANS: 335544370,
      /** Attempted write to read-only BLOB */
      SEGSTR_NO_WRITE: 335544371,
      /** Attempted reference to BLOB in unavailable */
      SEGSTR_WRONG_DB: 335544372,
      /** Operating system directive @1 failed */
      SYS_REQUEST: 335544373,
      /** Attempt to fetch past the last */
      STREAM_EOF: 335544374,
      /** Unavailable database */
      UNAVAILABLE: 335544375,
      /** Table @1 was omitted from the */
      UNRES_REL: 335544376,
      /** Request includes a DSRI extension not */
      UNS_EXT: 335544377,
      /** Feature is not supported */
      WISH_LIST: 335544378,
      /** Unsupported on-disk structure for file @1; */
      WRONG_ODS: 335544379,
      /** Wrong number of arguments on call */
      WRONUMARG: 335544380,
      /** Implementation limit exceeded */
      IMP_EXC: 335544381,
      /** @1 */
      RANDOM: 335544382,
      /** Unrecoverable conflict with limbo transaction @1 */
      FATAL_CONFLICT: 335544383,
      /** Internal error */
      BADBLK: 335544384,
      /** Internal error */
      INVPOOLCL: 335544385,
      /** Too many requests */
      NOPOOLIDS: 335544386,
      /** Internal error */
      RELBADBLK: 335544387,
      /** Block size exceeds implementation restriction */
      BLKTOOBIG: 335544388,
      /** Buffer exhausted */
      BUFEXH: 335544389,
      /** BLR syntax error= expected @1 at */
      SYNTAXERR: 335544390,
      /** Buffer in use */
      BUFINUSE: 335544391,
      /** Internal error */
      BDBINCON: 335544392,
      /** Request in use */
      REQINUSE: 335544393,
      /** Incompatible version of on-disk structure */
      BADODSVER: 335544394,
      /** Table @1 is not defined */
      RELNOTDEF: 335544395,
      /** Column @1 is not defined in */
      FLDNOTDEF: 335544396,
      /** Internal error */
      DIRTYPAGE: 335544397,
      /** Internal error */
      WAIFORTRA: 335544398,
      /** Internal error */
      DOUBLELOC: 335544399,
      /** Internal error */
      NODNOTFND: 335544400,
      /** Internal error */
      DUPNODFND: 335544401,
      /** Internal error */
      LOCNOTMAR: 335544402,
      /** Page @1 is of wrong type */
      BADPAGTYP: 335544403,
      /** Database corrupted */
      CORRUPT: 335544404,
      /** Checksum error on database page @1 */
      BADPAGE: 335544405,
      /** Index is broken */
      BADINDEX: 335544406,
      /** Database handle not zero */
      DBBNOTZER: 335544407,
      /** Transaction handle not zero */
      TRANOTZER: 335544408,
      /** Transaction--request mismatch (synchronization */
      TRAREQMIS: 335544409,
      /** Bad handle count */
      BADHNDCNT: 335544410,
      /** Wrong version of transaction parameter block */
      WROTPBVER: 335544411,
      /** Unsupported BLR version (expected @1, */
      WROBLRVER: 335544412,
      /** Wrong version of database parameter block */
      WRODPBVER: 335544413,
      /** BLOB and array data types are */
      BLOBNOTSUP: 335544414,
      /** Database corrupted */
      BADRELATION: 335544415,
      /** Internal error */
      NODETACH: 335544416,
      /** Internal error */
      NOTREMOTE: 335544417,
      /** Transaction in limbo */
      TRAINLIM: 335544418,
      /** Transaction not in limbo */
      NOTINLIM: 335544419,
      /** Transaction outstanding */
      TRAOUTSTA: 335544420,
      /** Connection rejected by remote interface */
      CONNECT_REJECT: 335544421,
      /** Internal error */
      DBFILE: 335544422,
      /** Internal error */
      ORPHAN: 335544423,
      /** No lock manager available */
      NO_LOCK_MGR: 335544424,
      /** Context already in use (BLR error) */
      CTXINUSE: 335544425,
      /** Context not defined (BLR error) */
      CTXNOTDEF: 335544426,
      /** Data operation not supported */
      DATNOTSUP: 335544427,
      /** Undefined message number */
      BADMSGNUM: 335544428,
      /** Bad parameter number */
      BADPARNUM: 335544429,
      /** Unable to allocate memory from operating */
      VIRMEMEXH: 335544430,
      /** Blocking signal has been received */
      BLOCKING_SIGNAL: 335544431,
      /** Lock manager error */
      LOCKMANERR: 335544432,
      /** Key size exceeds implementation restriction for */
      KEYTOOBIG: 335544434,
      /** Null segment of UNIQUE KEY */
      NULLSEGKEY: 335544435,
      /** SQL error code = @1 */
      SQLERR: 335544436,
      /** Wrong DYN version */
      WRODYNVER: 335544437,
      /** Function @1 is not defined */
      FUNNOTDEF: 335544438,
      /** Function @1 could not be matched */
      FUNMISMAT: 335544439,
      /**  */
      BAD_MSG_VEC: 335544440,
      /** Database detach completed with errors */
      BAD_DETACH: 335544441,
      /** Database system cannot read argument @1 */
      NOARGACC_READ: 335544442,
      /** Database system cannot write argument @1 */
      NOARGACC_WRITE: 335544443,
      /** Operation not supported */
      READ_ONLY: 335544444,
      /** @1 extension error */
      EXT_ERR: 335544445,
      /** Not updatable */
      NON_UPDATABLE: 335544446,
      /** No rollback performed */
      NO_ROLLBACK: 335544447,
      /**  */
      BAD_SEC_INFO: 335544448,
      /**  */
      INVALID_SEC_INFO: 335544449,
      /** @1 */
      MISC_INTERPRETED: 335544450,
      /** Update conflicts with concurrent update */
      UPDATE_CONFLICT: 335544451,
      /** Object @1 is in use */
      OBJ_IN_USE: 335544453,
      /** Filter not found to convert type */
      NOFILTER: 335544454,
      /** Cannot attach active shadow file */
      SHADOW_ACCESSED: 335544455,
      /** Invalid slice description language at offset */
      INVALID_SDL: 335544456,
      /** Subscript out of bounds */
      OUT_OF_BOUNDS: 335544457,
      /** Column not array or invalid dimensions */
      INVALID_DIMENSION: 335544458,
      /** Record from transaction @1 is stuck */
      REC_IN_LIMBO: 335544459,
      /** A file in manual shadow @1 */
      SHADOW_MISSING: 335544460,
      /** Secondary server attachments cannot validate */
      CANT_VALIDATE: 335544461,
      /** Generator @1 is not defined */
      GENNOTDEF: 335544463,
      /** Secondary server attachments cannot start logging */
      CANT_START_LOGGING: 335544464,
      /** Invalid BLOB type for operation */
      BAD_SEGSTR_TYPE: 335544465,
      /** Violation of FOREIGN KEY constraint "@1" */
      FOREIGN_KEY: 335544466,
      /** Minor version too high found @1 */
      HIGH_MINOR: 335544467,
      /** Transaction @1 is @2 */
      TRA_STATE: 335544468,
      /** Transaction marked invalid by I/O error */
      TRANS_INVALID: 335544469,
      /** Cache buffer for page @1 invalid */
      BUF_INVALID: 335544470,
      /** There is no index in table */
      INDEXNOTDEFINED: 335544471,
      /** Your user name and password are */
      LOGIN: 335544472,
      /** Invalid bookmark handle */
      INVALID_BOOKMARK: 335544473,
      /** Invalid lock level @1 */
      BAD_LOCK_LEVEL: 335544474,
      /** Lock on table @1 conflicts with */
      RELATION_LOCK: 335544475,
      /** Requested record lock conflicts with existing */
      RECORD_LOCK: 335544476,
      /** Maximum indexes per table (@1) exceeded */
      MAX_IDX: 335544477,
      /** Invalid statement handle */
      BAD_STMT_HANDLE: 335544485,
      /** WAL Writer error */
      WALW_ERR: 335544487,
      /** Log file header of @1 too */
      LOGH_SMALL: 335544488,
      /** Invalid version of log file @1 */
      LOGH_INV_VERSION: 335544489,
      /** Log file @1 not latest in */
      LOGH_OPEN_FLAG: 335544490,
      /** Log file @1 not closed properly; */
      LOGH_OPEN_FLAG2: 335544491,
      /** Database name in the log file */
      LOGH_DIFF_DBNAME: 335544492,
      /** Unexpected end of log file @1 */
      LOGF_UNEXPECTED_EOF: 335544493,
      /** Incomplete log record at offset @1 */
      LOGR_INCOMPLETE: 335544494,
      /** Log record header too small at */
      LOGR_HEADER_SMALL: 335544495,
      /** Log block too small at offset */
      LOGB_SMALL: 335544496,
      /** Database does not use Write-ahead Log */
      NO_WAL: 335544500,
      /** Reference to invalid stream number */
      STREAM_NOT_DEFINED: 335544502,
      /** Database @1 shutdown in progress */
      SHUTINPROG: 335544506,
      /** Refresh range number @1 already in */
      RANGE_IN_USE: 335544507,
      /** Refresh range number @1 not found */
      RANGE_NOT_FOUND: 335544508,
      /** CHARACTER SET @1 is not defined */
      CHARSET_NOT_FOUND: 335544509,
      /** Lock time-out on wait transaction */
      LOCK_TIMEOUT: 335544510,
      /** Procedure @1 is not defined */
      PRCNOTDEF: 335544511,
      /** Input parameter mismatch for procedure @1 */
      PRCMISMAT: 335544512,
      /** Status code @1 unknown */
      CODNOTDEF: 335544515,
      /** Exception @1 not defined */
      XCPNOTDEF: 335544516,
      /** Exception @1 */
      EXCEPT: 335544517,
      /** Restart shared cache manager */
      CACHE_RESTART: 335544518,
      /** Invalid lock handle */
      BAD_LOCK_HANDLE: 335544519,
      /** Database @1 shutdown */
      SHUTDOWN: 335544528,
      /** Cannot modify an existing user privilege */
      EXISTING_PRIV_MOD: 335544529,
      /** Cannot delete PRIMARY KEY being used */
      PRIMARY_KEY_REF: 335544530,
      /** Column used in a PRIMARY constraint */
      PRIMARY_KEY_NOTNULL: 335544531,
      /** Name of Referential Constraint not defined */
      REF_CNSTRNT_NOTFOUND: 335544532,
      /** Non-existent PRIMARY or UNIQUE KEY */
      FOREIGN_KEY_NOTFOUND: 335544533,
      /** Cannot update constraints */
      REF_CNSTRNT_UPDATE: 335544534,
      /** Cannot update constraints */
      CHECK_CNSTRNT_UPDATE: 335544535,
      /** Cannot delete CHECK constraint entry */
      CHECK_CNSTRNT_DEL: 335544536,
      /** Cannot delete index segment used by */
      INTEG_INDEX_SEG_DEL: 335544537,
      /** Cannot update index segment used by */
      INTEG_INDEX_SEG_MOD: 335544538,
      /** Cannot delete index used by an */
      INTEG_INDEX_DEL: 335544539,
      /** Cannot modify index used by an */
      INTEG_INDEX_MOD: 335544540,
      /** Cannot delete trigger used by a */
      CHECK_TRIG_DEL: 335544541,
      /** Cannot update trigger used by a */
      CHECK_TRIG_UPDATE: 335544542,
      /** Cannot delete column being used in */
      CNSTRNT_FLD_DEL: 335544543,
      /** Cannot rename column being used in */
      CNSTRNT_FLD_RENAME: 335544544,
      /** Cannot update constraints */
      REL_CNSTRNT_UPDATE: 335544545,
      /** Cannot define constraints on views */
      CONSTAINT_ON_VIEW: 335544546,
      /** Internal gds software consistency check (invalid */
      INVLD_CNSTRNT_TYPE: 335544547,
      /** Attempt to define a second PRIMARY */
      PRIMARY_KEY_EXISTS: 335544548,
      /** Cannot modify or erase a system */
      SYSTRIG_UPDATE: 335544549,
      /** Only the owner of a table */
      NOT_REL_OWNER: 335544550,
      /** Could not find table/procedure for GRANT */
      GRANT_OBJ_NOTFOUND: 335544551,
      /** Could not find column for GRANT */
      GRANT_FLD_NOTFOUND: 335544552,
      /** User does not have GRANT privileges */
      GRANT_NOPRIV: 335544553,
      /** Table/procedure has non-SQL security class */
      NONSQL_SECURITY_REL: 335544554,
      /** Column has non-SQL security class defined */
      NONSQL_SECURITY_FLD: 335544555,
      /** Database shutdown unsuccessful */
      SHUTFAIL: 335544557,
      /** Operation violates CHECK constraint @1 on */
      CHECK_CONSTRAINT: 335544558,
      /** Invalid service handle */
      BAD_SVC_HANDLE: 335544559,
      /** Database @1 shutdown in @2 seconds */
      SHUTWARN: 335544560,
      /** Wrong version of service parameter block */
      WROSPBVER: 335544561,
      /** Unrecognized service parameter block */
      BAD_SPB_FORM: 335544562,
      /** Service @1 is not defined */
      SVCNOTDEF: 335544563,
      /** Cannot transliterate character between character */
      TRANSLITERATION_FAILED: 335544565,
      /** WAL defined; Cache Manager must be */
      START_CM_FOR_WAL: 335544566,
      /** Implementation of text subtype @1 not */
      TEXT_SUBTYPE: 335544568,
      /** Dynamic SQL Error */
      DSQL_ERROR: 335544569,
      /** Invalid command */
      DSQL_COMMAND_ERR: 335544570,
      /** Data type for constant unknown */
      DSQL_CONSTANT_ERR: 335544571,
      /** Invalid cursor reference */
      DSQL_CURSOR_ERR: 335544572,
      /** Data type unknown */
      DSQL_DATATYPE_ERR: 335544573,
      /** Invalid cursor declaration */
      DSQL_DECL_ERR: 335544574,
      /** Cursor @1 is not updatable */
      DSQL_CURSOR_UPDATE_ERR: 335544575,
      /** Attempt to reopen an open cursor */
      DSQL_CURSOR_OPEN_ERR: 335544576,
      /** Attempt to reclose a closed cursor */
      DSQL_CURSOR_CLOSE_ERR: 335544577,
      /** Column unknown */
      DSQL_FIELD_ERR: 335544578,
      /** Internal error */
      DSQL_INTERNAL_ERR: 335544579,
      /** Table unknown */
      DSQL_RELATION_ERR: 335544580,
      /** Procedure unknown */
      DSQL_PROCEDURE_ERR: 335544581,
      /** Request unknown */
      DSQL_REQUEST_ERR: 335544582,
      /** SQLDA missing or incorrect version, or */
      DSQL_SQLDA_ERR: 335544583,
      /** Count of read-write columns does not */
      DSQL_VAR_COUNT_ERR: 335544584,
      /** Invalid statement handle */
      DSQL_STMT_HANDLE: 335544585,
      /** Function unknown */
      DSQL_FUNCTION_ERR: 335544586,
      /** Column is not a BLOB */
      DSQL_BLOB_ERR: 335544587,
      /** COLLATION @1 for CHARACTER SET @2 */
      COLLATION_NOT_FOUND: 335544588,
      /** COLLATION @1 is not valid for */
      COLLATION_NOT_FOR_CHARSET: 335544589,
      /** Option specified more than once */
      DSQL_DUP_OPTION: 335544590,
      /** Unknown transaction option */
      DSQL_TRAN_ERR: 335544591,
      /** Invalid array reference */
      DSQL_INVALID_ARRAY: 335544592,
      /** Array declared with too many dimensions */
      DSQL_MAX_ARR_DIM_EXCEEDED: 335544593,
      /** Illegal array dimension range */
      DSQL_ARR_RANGE_ERROR: 335544594,
      /** Trigger unknown */
      DSQL_TRIGGER_ERR: 335544595,
      /** Subselect illegal in this context */
      DSQL_SUBSELECT_ERR: 335544596,
      /** Cannot prepare a CREATE */
      DSQL_CRDB_PREPARE_ERR: 335544597,
      /** Must specify column name for view */
      SPECIFY_FIELD_ERR: 335544598,
      /** Number of columns does not match */
      NUM_FIELD_ERR: 335544599,
      /** Only simple column names permitted for */
      COL_NAME_ERR: 335544600,
      /** No WHERE clause for VIEW WITH */
      WHERE_ERR: 335544601,
      /** Only one table allowed for VIEW */
      TABLE_VIEW_ERR: 335544602,
      /** DISTINCT, GROUP or HAVING not permitted */
      DISTINCT_ERR: 335544603,
      /** FOREIGN KEY column count does not */
      KEY_FIELD_COUNT_ERR: 335544604,
      /** No subqueries permitted for VIEW WITH */
      SUBQUERY_ERR: 335544605,
      /** Expression evaluation not supported */
      EXPRESSION_EVAL_ERR: 335544606,
      /** Gen.c= node not supported */
      NODE_ERR: 335544607,
      /** Unexpected end of command */
      COMMAND_END_ERR: 335544608,
      /** INDEX @1 */
      INDEX_NAME: 335544609,
      /** EXCEPTION @1 */
      EXCEPTION_NAME: 335544610,
      /** COLUMN @1 */
      FIELD_NAME: 335544611,
      /** Token unknown */
      TOKEN_ERR: 335544612,
      /** Union not supported */
      UNION_ERR: 335544613,
      /** Unsupported DSQL construct */
      DSQL_CONSTRUCT_ERR: 335544614,
      /** Column used with aggregate */
      FIELD_AGGREGATE_ERR: 335544615,
      /** Invalid column reference */
      FIELD_REF_ERR: 335544616,
      /** Invalid ORDER BY clause */
      ORDER_BY_ERR: 335544617,
      /** Return mode by value not allowed */
      RETURN_MODE_ERR: 335544618,
      /** External functions cannot have more than */
      EXTERN_FUNC_ERR: 335544619,
      /** Alias @1 conflicts with an alias */
      ALIAS_CONFLICT_ERR: 335544620,
      /** Alias @1 conflicts with a procedure */
      PROCEDURE_CONFLICT_ERROR: 335544621,
      /** Alias @1 conflicts with a table */
      RELATION_CONFLICT_ERR: 335544622,
      /** Illegal use of keyword VALUE */
      DSQL_DOMAIN_ERR: 335544623,
      /** Segment count of 0 defined for */
      IDX_SEG_ERR: 335544624,
      /** A node name is not permitted */
      NODE_NAME_ERR: 335544625,
      /** TABLE @1 */
      TABLE_NAME: 335544626,
      /** PROCEDURE @1 */
      PROC_NAME: 335544627,
      /** Cannot create index @1 */
      IDX_CREATE_ERR: 335544628,
      /** There are @1 dependencies */
      DEPENDENCY: 335544630,
      /** Too many keys defined for index */
      IDX_KEY_ERR: 335544631,
      /** Preceding file did not specify length, */
      DSQL_FILE_LENGTH_ERR: 335544632,
      /** Shadow number must be a positive */
      DSQL_SHADOW_NUMBER_ERR: 335544633,
      /** Token unknown- line @1, column @2 */
      DSQL_TOKEN_UNK_ERR: 335544634,
      /** There is no alias or table */
      DSQL_NO_RELATION_ALIAS: 335544635,
      /** There is no index @1 for */
      INDEXNAME: 335544636,
      /** Table @1 is not referenced in */
      NO_STREAM_PLAN: 335544637,
      /** Table @1 is referenced more than */
      STREAM_TWICE: 335544638,
      /** Table @1 is referenced in the */
      STREAM_NOT_FOUND: 335544639,
      /** Invalid use of CHARACTER SET or */
      COLLATION_REQUIRES_TEXT: 335544640,
      /** Specified domain or source column @1 */
      DSQL_DOMAIN_NOT_FOUND: 335544641,
      /** Index @1 cannot be used in */
      INDEX_UNUSED: 335544642,
      /** The table @1 is referenced twice; */
      DSQL_SELF_JOIN: 335544643,
      /** Illegal operation when at beginning of */
      STREAM_BOF: 335544644,
      /** The current position is on a */
      STREAM_CRACK: 335544645,
      /** Database or file exists */
      DB_OR_FILE_EXISTS: 335544646,
      /** Invalid comparison operator for find operation */
      INVALID_OPERATOR: 335544647,
      /** Connection lost to pipe server */
      CONN_LOST: 335544648,
      /** Bad checksum */
      BAD_CHECKSUM: 335544649,
      /** Wrong page type */
      PAGE_TYPE_ERR: 335544650,
      /** Cannot insert because the file is */
      EXT_READONLY_ERR: 335544651,
      /** Multiple rows in singleton select */
      SING_SELECT_ERR: 335544652,
      /** Cannot attach to password database */
      PSW_ATTACH: 335544653,
      /** Cannot start transaction for password database */
      PSW_START_TRANS: 335544654,
      /** Invalid direction for find operation */
      INVALID_DIRECTION: 335544655,
      /** Variable @1 conflicts with parameter in */
      DSQL_VAR_CONFLICT: 335544656,
      /** Array/BLOB/DATE data types not allowed in */
      DSQL_NO_BLOB_ARRAY: 335544657,
      /** @1 is not a valid base */
      DSQL_BASE_TABLE: 335544658,
      /** Table @1 is referenced twice in */
      DUPLICATE_BASE_TABLE: 335544659,
      /** View @1 has more than one */
      VIEW_ALIAS: 335544660,
      /** Cannot add index, index root page */
      INDEX_ROOT_PAGE_FULL: 335544661,
      /** BLOB SUB_TYPE @1 is not defined */
      DSQL_BLOB_TYPE_UNKNOWN: 335544662,
      /** Too many concurrent executions of the */
      REQ_MAX_CLONES_EXCEEDED: 335544663,
      /** Duplicate specification of @1- not supported */
      DSQL_DUPLICATE_SPEC: 335544664,
      /** Violation of PRIMARY or UNIQUE KEY */
      UNIQUE_KEY_VIOLATION: 335544665,
      /** Server version too old to support */
      SRVR_VERSION_TOO_OLD: 335544666,
      /** Drop database completed with errors */
      DRDB_COMPLETED_WITH_ERRS: 335544667,
      /** Procedure @1 does not return any */
      DSQL_PROCEDURE_USE_ERR: 335544668,
      /** Count of column list and variable */
      DSQL_COUNT_MISMATCH: 335544669,
      /** Attempt to index BLOB column in */
      BLOB_IDX_ERR: 335544670,
      /** Attempt to index array column in */
      ARRAY_IDX_ERR: 335544671,
      /** Too few key columns found for */
      KEY_FIELD_ERR: 335544672,
      /** Cannot delete */
      NO_DELETE: 335544673,
      /** Last column in a table cannot */
      DEL_LAST_FIELD: 335544674,
      /** Sort error */
      SORT_ERR: 335544675,
      /** Sort error= not enough memory */
      SORT_MEM_ERR: 335544676,
      /** Too many versions */
      VERSION_ERR: 335544677,
      /** Invalid key position */
      INVAL_KEY_POSN: 335544678,
      /** Segments not allowed in expression index */
      NO_SEGMENTS_ERR: 335544679,
      /** Sort error= corruption in data structure */
      CRRP_DATA_ERR: 335544680,
      /** New record size of @1 bytes */
      REC_SIZE_ERR: 335544681,
      /** Inappropriate self-reference of column */
      DSQL_FIELD_REF: 335544682,
      /** Request depth exceeded. (Recursive definition?) */
      REQ_DEPTH_EXCEEDED: 335544683,
      /** Cannot access column @1 in view */
      NO_FIELD_ACCESS: 335544684,
      /** Dbkey not available for multi-table views */
      NO_DBKEY: 335544685,
      /** The prepare statement identifies a prepare */
      DSQL_OPEN_CURSOR_REQUEST: 335544688,
      /** Firebird error */
      IB_ERROR: 335544689,
      /** Cache redefined */
      CACHE_REDEF: 335544690,
      /** Insufficient memory to allocate page buffer */
      CACHE_TOO_SMALL: 335544691,
      /** Log redefined */
      LOG_REDEF: 335544692,
      /** Log size too small */
      LOG_TOO_SMALL: 335544693,
      /** Log partition size too small */
      PARTITION_TOO_SMALL: 335544694,
      /** Partitions not supported in series of */
      PARTITION_NOT_SUPP: 335544695,
      /** Total length of a partitioned log */
      LOG_LENGTH_SPEC: 335544696,
      /** Precision must be from 1 to */
      PRECISION_ERR: 335544697,
      /** Scale must be between zero and */
      SCALE_NOGT: 335544698,
      /** Short integer expected */
      EXPEC_SHORT: 335544699,
      /** Long integer expected */
      EXPEC_LONG: 335544700,
      /** Unsigned short integer expected */
      EXPEC_USHORT: 335544701,
      /** Invalid ESCAPE sequence */
      LIKE_ESCAPE_INVALID: 335544702,
      /** Service @1 does not have an */
      SVCNOEXE: 335544703,
      /** Failed to locate host machine. */
      NET_LOOKUP_ERR: 335544704,
      /** Undefined service @1/@2. */
      SERVICE_UNKNOWN: 335544705,
      /** The specified name was not found */
      HOST_UNKNOWN: 335544706,
      /** User does not have GRANT privileges */
      GRANT_NOPRIV_ON_BASE: 335544707,
      /** Ambiguous column reference. */
      DYN_FLD_AMBIGUOUS: 335544708,
      /** Invalid aggregate reference */
      DSQL_AGG_REF_ERR: 335544709,
      /** Navigational stream @1 references a view */
      COMPLEX_VIEW: 335544710,
      /** Attempt to execute an unprepared dynamic */
      UNPREPARED_STMT: 335544711,
      /** Positive value expected */
      EXPEC_POSITIVE: 335544712,
      /** Incorrect values within SQLDA structure */
      DSQL_SQLDA_VALUE_ERR: 335544713,
      /** Invalid blob id */
      INVALID_ARRAY_ID: 335544714,
      /** Operation not supported for EXTERNAL FILE */
      EXTFILE_UNS_OP: 335544715,
      /** Service is currently busy= @1 */
      SVC_IN_USE: 335544716,
      /** Stack size insufficent to execute current */
      ERR_STACK_LIMIT: 335544717,
      /** Invalid key for find operation */
      INVALID_KEY: 335544718,
      /** Unable to complete network request to */
      NETWORK_ERROR: 335544721,
      /** Failed to establish a connection. */
      NET_CONNECT_ERR: 335544722,
      /** Error while listening for an incoming */
      NET_CONNECT_LISTEN_ERR: 335544723,
      /** Failed to establish a secondary connection */
      NET_EVENT_CONNECT_ERR: 335544724,
      /** Error while listening for an incoming */
      NET_EVENT_LISTEN_ERR: 335544725,
      /** Error reading data from the connection. */
      NET_READ_ERR: 335544726,
      /** Error writing data to the connection. */
      NET_WRITE_ERR: 335544727,
      /** Cannot deactivate index used by an */
      INTEG_INDEX_DEACTIVATE: 335544728,
      /** Cannot deactivate index used by a */
      INTEG_DEACTIVATE_PRIMARY: 335544729,
      /** Client/Server Express not supported in this */
      CSE_NOT_SUPPORTED: 335544730,
      /**  */
      TRA_MUST_SWEEP: 335544731,
      /** Access to databases on file servers */
      UNSUPPORTED_NETWORK_DRIVE: 335544732,
      /** Error while trying to create file */
      IO_CREATE_ERR: 335544733,
      /** Error while trying to open file */
      IO_OPEN_ERR: 335544734,
      /** Error while trying to close file */
      IO_CLOSE_ERR: 335544735,
      /** Error while trying to read from */
      IO_READ_ERR: 335544736,
      /** Error while trying to write to */
      IO_WRITE_ERR: 335544737,
      /** Error while trying to delete file */
      IO_DELETE_ERR: 335544738,
      /** Error while trying to access file */
      IO_ACCESS_ERR: 335544739,
      /** A fatal exception occurred during the */
      UDF_EXCEPTION: 335544740,
      /** Connection lost to database */
      LOST_DB_CONNECTION: 335544741,
      /** User cannot write to RDB$USER_PRIVILEGES */
      NO_WRITE_USER_PRIV: 335544742,
      /** Token size exceeds limit */
      TOKEN_TOO_LONG: 335544743,
      /** Maximum user count exceeded.Contact your */
      MAX_ATT_EXCEEDED: 335544744,
      /** Your login @1 is same as */
      LOGIN_SAME_AS_ROLE_NAME: 335544745,
      /** "REFERENCES table" without "(column)" */
      REFTABLE_REQUIRES_PK: 335544746,
      /** The username entered is too long.Maximum */
      USRNAME_TOO_LONG: 335544747,
      /** The password specified is too long.Maximum */
      PASSWORD_TOO_LONG: 335544748,
      /** A username is required for this */
      USRNAME_REQUIRED: 335544749,
      /** A password is required for this */
      PASSWORD_REQUIRED: 335544750,
      /** The network protocol specified is invalid */
      BAD_PROTOCOL: 335544751,
      /** A duplicate user name was found */
      DUP_USRNAME_FOUND: 335544752,
      /** The user name specified was not */
      USRNAME_NOT_FOUND: 335544753,
      /** An error occurred while attempting to */
      ERROR_ADDING_SEC_RECORD: 335544754,
      /** An error occurred while attempting to */
      ERROR_MODIFYING_SEC_RECORD: 335544755,
      /** An error occurred while attempting to */
      ERROR_DELETING_SEC_RECORD: 335544756,
      /** An error occurred while updating the */
      ERROR_UPDATING_SEC_DB: 335544757,
      /** Sort record size of @1 bytes */
      SORT_REC_SIZE_ERR: 335544758,
      /** Can not define a not null */
      BAD_DEFAULT_VALUE: 335544759,
      /** Invalid clause--- '@1' */
      INVALID_CLAUSE: 335544760,
      /** Too many open handles to database */
      TOO_MANY_HANDLES: 335544761,
      /** A string constant is delimited by */
      INVALID_STRING_CONSTANT: 335544763,
      /** DATE must be changed to TIMESTAMP */
      TRANSITIONAL_DATE: 335544764,
      /** Attempted update on read-only database */
      READ_ONLY_DATABASE: 335544765,
      /** SQL dialect @1 is not supported */
      MUST_BE_DIALECT_2_AND_UP: 335544766,
      /** A fatal exception occurred during the */
      BLOB_FILTER_EXCEPTION: 335544767,
      /** Access violation.The code attempted to access */
      EXCEPTION_ACCESS_VIOLATION: 335544768,
      /** Datatype misalignment.The attempted to read or */
      EXCEPTION_DATATYPE_MISSALIGNMENT: 335544769,
      /** Array bounds exceeded.The code attempted to */
      EXCEPTION_ARRAY_BOUNDS_EXCEEDED: 335544770,
      /**  */
      EXCEPTION_FLOAT_DENORMAL_OPERAN: 335544771,
      /** Floating-point divide by zero.The code attempted */
      EXCEPTION_FLOAT_DIVIDE_BY_ZERO: 335544772,
      /** Floating-point inexact result.The result of a */
      EXCEPTION_FLOAT_INEXACT_RESULT: 335544773,
      /** Floating-point invalid operand.An indeterminant */
      EXCEPTION_FLOAT_INVALID_OPERAND: 335544774,
      /** Floating-point overflow.The exponent of a */
      EXCEPTION_FLOAT_OVERFLOW: 335544775,
      /** Floating-point stack check.The stack overflowed */
      EXCEPTION_FLOAT_STACK_CHECK: 335544776,
      /** Floating-point underflow.The exponent of a */
      EXCEPTION_FLOAT_UNDERFLOW: 335544777,
      /** Integer divide by zero.The code attempted */
      EXCEPTION_INTEGER_DIVIDE_BY_ZERO: 335544778,
      /** Integer overflow.The result of an integer */
      EXCEPTION_INTEGER_OVERFLOW: 335544779,
      /** An exception occurred that does not */
      EXCEPTION_UNKNOWN: 335544780,
      /** Stack overflow.The resource requirements of the */
      EXCEPTION_STACK_OVERFLOW: 335544781,
      /** Segmentation Fault. The code attempted to */
      EXCEPTION_SIGSEGV: 335544782,
      /** Illegal Instruction. The Code attempted to */
      EXCEPTION_SIGILL: 335544783,
      /** Bus Error. The Code caused a */
      EXCEPTION_SIGBUS: 335544784,
      /** Floating Point Error. The Code caused */
      EXCEPTION_SIGFPE: 335544785,
      /** Cannot delete rows from external files. */
      EXT_FILE_DELETE: 335544786,
      /** Cannot update rows in external files. */
      EXT_FILE_MODIFY: 335544787,
      /** Unable to perform operation.You must be */
      ADM_TASK_DENIED: 335544788,
      /** Specified EXTRACT part does not exist */
      EXTRACT_INPUT_MISMATCH: 335544789,
      /** Service @1 requires SYSDBA */
      INSUFFICIENT_SVC_PRIVILEGES: 335544790,
      /** The file @1 is currently in */
      FILE_IN_USE: 335544791,
      /** Cannot attach to services manager */
      SERVICE_ATT_ERR: 335544792,
      /** Metadata update statement is not allowed */
      DDL_NOT_ALLOWED_BY_DB_SQL_DIAL: 335544793,
      /** Operation was cancelled */
      CANCELLED: 335544794,
      /** Unexpected item in service parameter block, */
      UNEXP_SPB_FORM: 335544795,
      /** Client SQL dialect @1 does not */
      SQL_DIALECT_DATATYPE_UNSUPPORT: 335544796,
      /** User name and password are required */
      SVCNOUSER: 335544797,
      /** You created an indirect dependency on */
      DEPEND_ON_UNCOMMITTED_REL: 335544798,
      /** The service name was not specified. */
      SVC_NAME_MISSING: 335544799,
      /** Too many Contexts of Relation/Procedure/Views. */
      TOO_MANY_CONTEXTS: 335544800,
      /** Data type not supported for arithmetic */
      DATYPE_NOTSUP: 335544801,
      /** Database dialect not changed. */
      DIALECT_NOT_CHANGED: 335544803,
      /** Unable to create database @1 */
      DATABASE_CREATE_FAILED: 335544804,
      /** Database dialect @1 is not a */
      INV_DIALECT_SPECIFIED: 335544805,
      /** Valid database dialects are @1. */
      VALID_DB_DIALECTS: 335544806,
      /** Function @1 is in @2, which */
      EXTERN_FUNC_DIR_ERROR: 335544809,
      /** Value exceeds the range for valid */
      DATE_RANGE_EXCEEDED: 335544810,
      /** Passed client dialect @1 is not */
      INV_CLIENT_DIALECT_SPECIFIED: 335544811,
      /** Valid client dialects are @1. */
      VALID_CLIENT_DIALECTS: 335544812,
      /** Unsupported field type specified in BETWEEN */
      OPTIMIZER_BETWEEN_ERR: 335544813,
      /** Services functionality will be supported in */
      SERVICE_NOT_SUPPORTED: 335544814,
      /** GENERATOR @1 */
      GENERATOR_NAME: 335544815,
      /** UDF @1 */
      UDF_NAME: 335544816,
      /** Invalid parameter to FIRST.Only integers >= */
      BAD_LIMIT_PARAM: 335544817,
      /** Invalid parameter to SKIP.Only integers >= */
      BAD_SKIP_PARAM: 335544818,
      /** File exceeded maximum size of 2GB.Add */
      IO_32BIT_EXCEEDED_ERR: 335544819,
      /** Unable to find savepoint with name */
      INVALID_SAVEPOINT: 335544820,
      /** Invalid column position used in the */
      DSQL_COLUMN_POS_ERR: 335544821,
      /** Cannot use an aggregate function in */
      DSQL_AGG_WHERE_ERR: 335544822,
      /** Cannot use an aggregate function in */
      DSQL_AGG_GROUP_ERR: 335544823,
      /** Invalid expression in the @1 (not */
      DSQL_AGG_COLUMN_ERR: 335544824,
      /** Invalid expression in the @1 (neither */
      DSQL_AGG_HAVING_ERR: 335544825,
      /** Nested aggregate functions are not allowed */
      DSQL_AGG_NESTED_ERR: 335544826,
      /** Invalid argument in EXECUTE STATEMENTcannot conver */
      EXEC_SQL_INVALID_ARG: 335544827,
      /** Wrong request type in EXECUTE STATEMENT */
      EXEC_SQL_INVALID_REQ: 335544828,
      /** Variable type (position @1) in EXECUTE */
      EXEC_SQL_INVALID_VAR: 335544829,
      /** Too many recursion levels of EXECUTE */
      EXEC_SQL_MAX_CALL_EXCEEDED: 335544830,
      /** Access to @1 "@2" is denied */
      CONF_ACCESS_DENIED: 335544831,
      /** Cannot change difference file name while */
      WRONG_BACKUP_STATE: 335544832,
      /** Cursor is not open */
      CURSOR_NOT_OPEN: 335544834,
      /** Target shutdown mode is invalid for */
      BAD_SHUTDOWN_MODE: 335544835,
      /** Concatenation overflow. Resulting string cannot */
      CONCAT_OVERFLOW: 335544836,
      /** Invalid offset parameter @1 to SUBSTRING. */
      BAD_SUBSTRING_OFFSET: 335544837,
      /** Foreign key reference target does not */
      FOREIGN_KEY_TARGET_DOESNT_EXIST: 335544838,
      /** Foreign key references are present for */
      FOREIGN_KEY_REFERENCES_PRESENT: 335544839,
      /** Cannot update */
      NO_UPDATE: 335544840,
      /** Cursor is already open */
      CURSOR_ALREADY_OPEN: 335544841,
      /** @1 */
      STACK_TRACE: 335544842,
      /** Context variable @1 is not found */
      CTX_VAR_NOT_FOUND: 335544843,
      /** Invalid namespace name @1 passed to */
      CTX_NAMESPACE_INVALID: 335544844,
      /** Too many context variables */
      CTX_TOO_BIG: 335544845,
      /** Invalid argument passed to @1 */
      CTX_BAD_ARGUMENT: 335544846,
      /** BLR syntax error. Identifier @1... is */
      IDENTIFIER_TOO_LONG: 335544847,
      /** Exception @1 */
      EXCEPT2: 335544848,
      /** Malformed string */
      MALFORMED_STRING: 335544849,
      /** Output parameter mismatch for procedure @1 */
      PRC_OUT_PARAM_MISMATCH: 335544850,
      /** Unexpected end of command- line @1, */
      COMMAND_END_ERR2: 335544851,
      /** Partner index segment no @1 has */
      PARTNER_IDX_INCOMPAT_TYPE: 335544852,
      /** Invalid length parameter @1 to SUBSTRING. */
      BAD_SUBSTRING_LENGTH: 335544853,
      /** CHARACTER SET @1 is not installed */
      CHARSET_NOT_INSTALLED: 335544854,
      /** COLLATION @1 for CHARACTER SET @2 */
      COLLATION_NOT_INSTALLED: 335544855,
      /** Connection shutdown */
      ATT_SHUTDOWN: 335544856,
      /** Maximum BLOB size exceeded */
      BLOBTOOBIG: 335544857,
      /** Can't have relation with only computed */
      MUST_HAVE_PHYS_FIELD: 335544858,
      /** Time precision exceeds allowed range (0-@1) */
      INVALID_TIME_PRECISION: 335544859,
      /** Unsupported conversion to target type BLOB */
      BLOB_CONVERT_ERROR: 335544860,
      /** Unsupported conversion to target type ARRAY */
      ARRAY_CONVERT_ERROR: 335544861,
      /** Stream does not support record locking */
      RECORD_LOCK_NOT_SUPP: 335544862,
      /** Cannot create foreign key constraint @1. */
      PARTNER_IDX_NOT_FOUND: 335544863,
      /** Transactions count exceeded. Perform backup and */
      TRA_NUM_EXC: 335544864,
      /** Column has been unexpectedly deleted */
      FIELD_DISAPPEARED: 335544865,
      /** @1 cannot depend on @2 */
      MET_WRONG_GTT_SCOPE: 335544866,
      /** Blob sub_types bigger than 1 (text) */
      SUBTYPE_FOR_INTERNAL_USE: 335544867,
      /** Procedure @1 is not selectable (it */
      ILLEGAL_PRC_TYPE: 335544868,
      /** Datatype @1 is not supported for */
      INVALID_SORT_DATATYPE: 335544869,
      /** COLLATION @1 */
      COLLATION_NAME: 335544870,
      /** DOMAIN @1 */
      DOMAIN_NAME: 335544871,
      /** Domain @1 is not defined */
      DOMNOTDEF: 335544872,
      /** Array data type can use up */
      ARRAY_MAX_DIMENSIONS: 335544873,
      /** A multi database transaction cannot span */
      MAX_DB_PER_TRANS_ALLOWED: 335544874,
      /** Bad debug info format */
      BAD_DEBUG_FORMAT: 335544875,
      /** Error while parsing procedure @1's BLR */
      BAD_PROC_BLR: 335544876,
      /** Index key too big */
      KEY_TOO_BIG: 335544877,
      /** Concurrent transaction number is @1 */
      CONCURRENT_TRANSACTION: 335544878,
      /** Validation error for variable @1, value */
      NOT_VALID_FOR_VAR: 335544879,
      /** Validation error for @1, value "@2" */
      NOT_VALID_FOR: 335544880,
      /** Difference file name should be set */
      NEED_DIFFERENCE: 335544881,
      /** Login name too long (@1 characters, */
      LONG_LOGIN: 335544882,
      /** Column @1 is not defined in */
      FLDNOTDEF2: 335544883,
      /** Data base file name (@1) already */
      GFIX_DB_NAME: 335740929,
      /** Invalid switch @1 */
      GFIX_INVALID_SW: 335740930,
      /** Incompatible switch combination */
      GFIX_INCMP_SW: 335740932,
      /** Replay log pathname required */
      GFIX_REPLAY_REQ: 335740933,
      /** Number of page buffers for cache */
      GFIX_PGBUF_REQ: 335740934,
      /** Numeric value required */
      GFIX_VAL_REQ: 335740935,
      /** Positive numeric value required */
      GFIX_PVAL_REQ: 335740936,
      /** Number of transactions per sweep required */
      GFIX_TRN_REQ: 335740937,
      /** "full" or "reserve" required */
      GFIX_FULL_REQ: 335740940,
      /** User name required */
      GFIX_USRNAME_REQ: 335740941,
      /** Password required */
      GFIX_PASS_REQ: 335740942,
      /** Subsystem name */
      GFIX_SUBS_NAME: 335740943,
      /** Number of seconds required */
      GFIX_SEC_REQ: 335740945,
      /** Numeric value between 0 and 32767 */
      GFIX_NVAL_REQ: 335740946,
      /** Must specify type of shutdown */
      GFIX_TYPE_SHUT: 335740947,
      /** Please retry, specifying an option */
      GFIX_RETRY: 335740948,
      /** Please retry, giving a database name */
      GFIX_RETRY_DB: 335740951,
      /** Internal block exceeds maximum size */
      GFIX_EXCEED_MAX: 335740991,
      /** Corrupt pool */
      GFIX_CORRUPT_POOL: 335740992,
      /** Virtual memory exhausted */
      GFIX_MEM_EXHAUSTED: 335740993,
      /** Bad pool id */
      GFIX_BAD_POOL: 335740994,
      /** Transaction state @1 not in valid */
      GFIX_TRN_NOT_VALID: 335740995,
      /** Unexpected end of input */
      GFIX_UNEXP_EOI: 335741012,
      /** Failed to reconnect to a transaction */
      GFIX_RECON_FAIL: 335741018,
      /** Transaction description item unknown */
      GFIX_TRN_UNKNOWN: 335741036,
      /** "read_only" or "read_write" required */
      GFIX_MODE_REQ: 335741038,
      /** -sql_dialect set database dialect n */
      GFIX_OPT_SQL_DIALECT: 335741039,
      /** Positive or zero numeric value required */
      GFIX_PZVAL_REQ: 335741042,
      /** Cannot SELECT RDB$DB_KEY from a stored */
      DSQL_DBKEY_FROM_NON_TABLE: 336003074,
      /** Precision 10 to 18 changed from */
      DSQL_TRANSITIONAL_NUMERIC: 336003075,
      /** Database SQL dialect @1 does not */
      SQL_DB_DIALECT_DTYPE_UNSUPPORT: 336003077,
      /** DB dialect @1 and client dialect */
      ISC_SQL_DIALECT_CONFLICT_NUM: 336003079,
      /** Ambiguous field name between @1 and */
      DSQL_AMBIGUOUS_FIELD_NAME: 336003085,
      /** External function should have return position */
      DSQL_UDF_RETURN_POS_ERR: 336003086,
      /** Label @1 @2 in the current */
      DSQL_INVALID_LABEL: 336003087,
      /** Datatypes @1are not comparable in expression */
      DSQL_DATATYPES_NOT_COMPARABLE: 336003088,
      /** Empty cursor name is not allowed */
      DSQL_CURSOR_INVALID: 336003089,
      /** Statement already has a cursor @1 */
      DSQL_CURSOR_REDEFINED: 336003090,
      /** Cursor @1 is not found in */
      DSQL_CURSOR_NOT_FOUND: 336003091,
      /** Cursor @1 already exists in the */
      DSQL_CURSOR_EXISTS: 336003092,
      /** Relation @1 is ambiguous in cursor */
      DSQL_CURSOR_REL_AMBIGUOUS: 336003093,
      /** Relation @1 is not found in */
      DSQL_CURSOR_REL_NOT_FOUND: 336003094,
      /** Cursor is not open */
      DSQL_CURSOR_NOT_OPEN: 336003095,
      /** Data type @1 is not supported */
      DSQL_TYPE_NOT_SUPP_EXT_TAB: 336003096,
      /** Feature not supported on ODS version */
      DSQL_FEATURE_NOT_SUPPORTED_ODS: 336003097,
      /** Primary key required on table @1 */
      PRIMARY_KEY_REQUIRED: 336003098,
      /** UPDATE OR INSERT field list does */
      UPD_INS_DOESNT_MATCH_PK: 336003099,
      /** UPDATE OR INSERT field list does */
      UPD_INS_DOESNT_MATCH_MATCHING: 336003100,
      /** UPDATE OR INSERT without MATCHING */
      UPD_INS_WITH_COMPLEX_VIEW: 336003101,
      /** Incompatible trigger type */
      DSQL_INCOMPATIBLE_TRIGGER_TYPE: 336003102,
      /** Database trigger type can't be changed */
      DSQL_DB_TRIGGER_TYPE_CANT_CHANGE: 336003103,
      /** SQL role @1 does not exist */
      DYN_ROLE_DOES_NOT_EXIST: 336068796,
      /** User @1 has no grant admin */
      DYN_NO_GRANT_ADMIN_OPT: 336068797,
      /** User @1 is not a member */
      DYN_USER_NOT_ROLE_MEMBER: 336068798,
      /** @1 is not the owner of */
      DYN_DELETE_ROLE_FAILED: 336068799,
      /** @1 is a SQL role and */
      DYN_GRANT_ROLE_TO_USER: 336068800,
      /** User name @1 could not be */
      DYN_INV_SQL_ROLE_NAME: 336068801,
      /** SQL role @1 already exists */
      DYN_DUP_SQL_ROLE: 336068802,
      /** Keyword @1 can not be used */
      DYN_KYWD_SPEC_FOR_ROLE: 336068803,
      /** SQL roles are not supported in */
      DYN_ROLES_NOT_SUPPORTED: 336068804,
      /** Cannot rename domain @1 to @2.A */
      DYN_DOMAIN_NAME_EXISTS: 336068812,
      /** Cannot rename column @1 to @2.A */
      DYN_FIELD_NAME_EXISTS: 336068813,
      /** Column @1 from table @2 is */
      DYN_DEPENDENCY_EXISTS: 336068814,
      /** Cannot change datatype for column @1.Changing */
      DYN_DTYPE_INVALID: 336068815,
      /** New size specified for column @1 */
      DYN_CHAR_FLD_TOO_SMALL: 336068816,
      /** Cannot change datatype for @1.Conversion from */
      DYN_INVALID_DTYPE_CONVERSION: 336068817,
      /** Cannot change datatype for column @1 */
      DYN_DTYPE_CONV_INVALID: 336068818,
      /** Zero length identifiers are not allowed */
      DYN_ZERO_LEN_ID: 336068820,
      /** Maximum number of collations per character */
      MAX_COLL_PER_CHARSET: 336068829,
      /** Invalid collation attributes */
      INVALID_COLL_ATTR: 336068830,
      /** @1 cannot reference @2 */
      DYN_WRONG_GTT_SCOPE: 336068840,
      /** New scale specified for column @1 */
      DYN_SCALE_TOO_BIG: 336068852,
      /** New precision specified for column @1 */
      DYN_PRECISION_TOO_SMALL: 336068853,
      /** Feature '@1' is not supported in */
      DYN_ODS_NOT_SUPP_FEATURE: 336068856,
      /** Found unknown switch */
      GBAK_UNKNOWN_SWITCH: 336330753,
      /** Page size parameter missing */
      GBAK_PAGE_SIZE_MISSING: 336330754,
      /** Page size specified (@1) greater than */
      GBAK_PAGE_SIZE_TOOBIG: 336330755,
      /** Redirect location for output is not */
      GBAK_REDIR_OUPUT_MISSING: 336330756,
      /** Conflicting switches for backup/restore */
      GBAK_SWITCHES_CONFLICT: 336330757,
      /** Device type @1 not known */
      GBAK_UNKNOWN_DEVICE: 336330758,
      /** Protection is not there yet */
      GBAK_NO_PROTECTION: 336330759,
      /** Page size is allowed only on */
      GBAK_PAGE_SIZE_NOT_ALLOWED: 336330760,
      /** Multiple sources or destinations specified */
      GBAK_MULTI_SOURCE_DEST: 336330761,
      /** Requires both input and output filenames */
      GBAK_FILENAME_MISSING: 336330762,
      /** Input and output have the same */
      GBAK_DUP_INOUT_NAMES: 336330763,
      /** Expected page size, encountered "@1" */
      GBAK_INV_PAGE_SIZE: 336330764,
      /** REPLACE specified, but the first file */
      GBAK_DB_SPECIFIED: 336330765,
      /** Database @1 already exists.To replace it, */
      GBAK_DB_EXISTS: 336330766,
      /** Device type not specified */
      GBAK_UNK_DEVICE: 336330767,
      /** Gds_$blob_info failed */
      GBAK_BLOB_INFO_FAILED: 336330772,
      /** Do not understand BLOB INFO item */
      GBAK_UNK_BLOB_ITEM: 336330773,
      /** Gds_$get_segment failed */
      GBAK_GET_SEG_FAILED: 336330774,
      /** Gds_$close_blob failed */
      GBAK_CLOSE_BLOB_FAILED: 336330775,
      /** Gds_$open_blob failed */
      GBAK_OPEN_BLOB_FAILED: 336330776,
      /** Failed in put_blr_gen_id */
      GBAK_PUT_BLR_GEN_ID_FAILED: 336330777,
      /** Data type @1 not understood */
      GBAK_UNK_TYPE: 336330778,
      /** Gds_$compile_request failed */
      GBAK_COMP_REQ_FAILED: 336330779,
      /** Gds_$start_request failed */
      GBAK_START_REQ_FAILED: 336330780,
      /** gds_$receive failed */
      GBAK_REC_FAILED: 336330781,
      /** Gds_$release_request failed */
      GBAK_REL_REQ_FAILED: 336330782,
      /** gds_$database_info failed */
      GBAK_DB_INFO_FAILED: 336330783,
      /** Expected database description record */
      GBAK_NO_DB_DESC: 336330784,
      /** Failed to create database @1 */
      GBAK_DB_CREATE_FAILED: 336330785,
      /** RESTORE= decompression length error */
      GBAK_DECOMP_LEN_ERROR: 336330786,
      /** Cannot find table @1 */
      GBAK_TBL_MISSING: 336330787,
      /** Cannot find column for BLOB */
      GBAK_BLOB_COL_MISSING: 336330788,
      /** Gds_$create_blob failed */
      GBAK_CREATE_BLOB_FAILED: 336330789,
      /** Gds_$put_segment failed */
      GBAK_PUT_SEG_FAILED: 336330790,
      /** Expected record length */
      GBAK_REC_LEN_EXP: 336330791,
      /** Wrong length record, expected @1 encountered */
      GBAK_INV_REC_LEN: 336330792,
      /** Expected data attribute */
      GBAK_EXP_DATA_TYPE: 336330793,
      /** Failed in store_blr_gen_id */
      GBAK_GEN_ID_FAILED: 336330794,
      /** Do not recognize record type @1 */
      GBAK_UNK_REC_TYPE: 336330795,
      /** Expected backup version 1..8.Found @1 */
      GBAK_INV_BKUP_VER: 336330796,
      /** Expected backup description record */
      GBAK_MISSING_BKUP_DESC: 336330797,
      /** String truncated */
      GBAK_STRING_TRUNC: 336330798,
      /** warning-- record could not be restored */
      GBAK_CANT_REST_RECORD: 336330799,
      /** Gds_$send failed */
      GBAK_SEND_FAILED: 336330800,
      /** No table name for data */
      GBAK_NO_TBL_NAME: 336330801,
      /** Unexpected end of file on backup */
      GBAK_UNEXP_EOF: 336330802,
      /** Database format @1 is too old */
      GBAK_DB_FORMAT_TOO_OLD: 336330803,
      /** Array dimension for column @1 is */
      GBAK_INV_ARRAY_DIM: 336330804,
      /** Expected XDR record length */
      GBAK_XDR_LEN_EXPECTED: 336330807,
      /** Cannot open backup file @1 */
      GBAK_OPEN_BKUP_ERROR: 336330817,
      /** Cannot open status and error output */
      GBAK_OPEN_ERROR: 336330818,
      /** Blocking factor parameter missing */
      GBAK_MISSING_BLOCK_FAC: 336330934,
      /** Expected blocking factor, encountered "@1" */
      GBAK_INV_BLOCK_FAC: 336330935,
      /** A blocking factor may not be */
      GBAK_BLOCK_FAC_SPECIFIED: 336330936,
      /** User name parameter missing */
      GBAK_MISSING_USERNAME: 336330940,
      /** Password parameter missing */
      GBAK_MISSING_PASSWORD: 336330941,
      /** missing parameter for the number of */
      GBAK_MISSING_SKIPPED_BYTES: 336330952,
      /** Expected number of bytes to be */
      GBAK_INV_SKIPPED_BYTES: 336330953,
      /** Character set */
      GBAK_ERR_RESTORE_CHARSET: 336330965,
      /** Collation */
      GBAK_ERR_RESTORE_COLLATION: 336330967,
      /** Unexpected I/O error while reading from */
      GBAK_READ_ERROR: 336330972,
      /** Unexpected I/O error while writing to */
      GBAK_WRITE_ERROR: 336330973,
      /** Could not drop database @1 (database */
      GBAK_DB_IN_USE: 336330985,
      /** System memory exhausted */
      GBAK_SYSMEMEX: 336330990,
      /** SQL role */
      GBAK_RESTORE_ROLE_FAILED: 336331002,
      /** SQL role parameter missing */
      GBAK_ROLE_OP_MISSING: 336331005,
      /** Page buffers parameter missing */
      GBAK_PAGE_BUFFERS_MISSING: 336331010,
      /** Expected page buffers, encountered "@1" */
      GBAK_PAGE_BUFFERS_WRONG_PARAM: 336331011,
      /** Page buffers is allowed only on */
      GBAK_PAGE_BUFFERS_RESTORE: 336331012,
      /** Size specification either missing or incorrect */
      GBAK_INV_SIZE: 336331014,
      /** File @1 out of sequence */
      GBAK_FILE_OUTOF_SEQUENCE: 336331015,
      /** Can't join-- one of the files */
      GBAK_JOIN_FILE_MISSING: 336331016,
      /** standard input is not supported when */
      GBAK_STDIN_NOT_SUPPTD: 336331017,
      /** Standard output is not supported when */
      GBAK_STDOUT_NOT_SUPPTD: 336331018,
      /** Backup file @1 might be corrupt */
      GBAK_BKUP_CORRUPT: 336331019,
      /** Database file specification missing */
      GBAK_UNK_DB_FILE_SPEC: 336331020,
      /** Can't write a header record to */
      GBAK_HDR_WRITE_FAILED: 336331021,
      /** Free disk space exhausted */
      GBAK_DISK_SPACE_EX: 336331022,
      /** File size given (@1) is less */
      GBAK_SIZE_LT_MIN: 336331023,
      /** Service name parameter missing */
      GBAK_SVC_NAME_MISSING: 336331025,
      /** Cannot restore over current database, must */
      GBAK_NOT_OWNR: 336331026,
      /** "read_only" or "read_write" required */
      GBAK_MODE_REQ: 336331031,
      /** Just data ignore all constraints etc. */
      GBAK_JUST_DATA: 336331033,
      /** Restoring data only ignoring foreign key, */
      GBAK_DATA_ONLY: 336331034,
      /** ODS versions before ODS@1 are not */
      DSQL_TOO_OLD_ODS: 336397205,
      /** Table @1 does not exist */
      DSQL_TABLE_NOT_FOUND: 336397206,
      /** View @1 does not exist */
      DSQL_VIEW_NOT_FOUND: 336397207,
      /** At line @1, column @2 */
      DSQL_LINE_COL_ERROR: 336397208,
      /** At unknown line and column */
      DSQL_UNKNOWN_POS: 336397209,
      /** Column @1 cannot be repeated in */
      DSQL_NO_DUP_NAME: 336397210,
      /** Too many values (more than @1) */
      DSQL_TOO_MANY_VALUES: 336397211,
      /** Array and BLOB data types not */
      DSQL_NO_ARRAY_COMPUTED: 336397212,
      /** Implicit domain name @1 not allowed */
      DSQL_IMPLICIT_DOMAIN_NAME: 336397213,
      /** Scalar operator used on field @1 */
      DSQL_ONLY_CAN_SUBSCRIPT_ARRAY: 336397214,
      /** Cannot sort on more than 255 */
      DSQL_MAX_SORT_ITEMS: 336397215,
      /** Cannot group on more than 255 */
      DSQL_MAX_GROUP_ITEMS: 336397216,
      /** Cannot include the same field (@1.@2) */
      DSQL_CONFLICTING_SORT_FIELD: 336397217,
      /** Column list from derived table @1 */
      DSQL_DERIVED_TABLE_MORE_COLUMNS: 336397218,
      /** Column list from derived table @1 */
      DSQL_DERIVED_TABLE_LESS_COLUMNS: 336397219,
      /** No column name specified for column */
      DSQL_DERIVED_FIELD_UNNAMED: 336397220,
      /** Column @1 was specified multiple times */
      DSQL_DERIVED_FIELD_DUP_NAME: 336397221,
      /** Internal dsql error= alias type expected */
      DSQL_DERIVED_ALIAS_SELECT: 336397222,
      /** Internal dsql error= alias type expected */
      DSQL_DERIVED_ALIAS_FIELD: 336397223,
      /** Internal dsql error= column position out */
      DSQL_AUTO_FIELD_BAD_POS: 336397224,
      /** Recursive CTE member (@1) can refer */
      DSQL_CTE_WRONG_REFERENCE: 336397225,
      /** CTE '@1' has cyclic dependencies */
      DSQL_CTE_CYCLE: 336397226,
      /** Recursive member of CTE can't be */
      DSQL_CTE_OUTER_JOIN: 336397227,
      /** Recursive member of CTE can't reference */
      DSQL_CTE_MULT_REFERENCES: 336397228,
      /** Recursive CTE (@1) must be an */
      DSQL_CTE_NOT_A_UNION: 336397229,
      /** CTE '@1' defined non-recursive member after */
      DSQL_CTE_NONRECURS_AFTER_RECURS: 336397230,
      /** Recursive member of CTE '@1' has */
      DSQL_CTE_WRONG_CLAUSE: 336397231,
      /** Recursive members of CTE (@1) must */
      DSQL_CTE_UNION_ALL: 336397232,
      /** Non-recursive member is missing in CTE */
      DSQL_CTE_MISS_NONRECURSIVE: 336397233,
      /** WITH clause can't be nested */
      DSQL_CTE_NESTED_WITH: 336397234,
      /** Column @1 appears more than once */
      DSQL_COL_MORE_THAN_ONCE_USING: 336397235,
      /** Feature is not supported in dialect */
      DSQL_UNSUPP_FEATURE_DIALECT: 336397236,
      /** CTE "@1" is not used in */
      DSQL_CTE_NOT_USED: 336397237,
      /** Unable to open database */
      GSEC_CANT_OPEN_DB: 336723983,
      /** Error in switch specifications */
      GSEC_SWITCHES_ERROR: 336723984,
      /** No operation specified */
      GSEC_NO_OP_SPEC: 336723985,
      /** No user name specified */
      GSEC_NO_USR_NAME: 336723986,
      /** Add record error */
      GSEC_ERR_ADD: 336723987,
      /** Modify record error */
      GSEC_ERR_MODIFY: 336723988,
      /** Find/modify record error */
      GSEC_ERR_FIND_MOD: 336723989,
      /** Record not found for user= @1 */
      GSEC_ERR_REC_NOT_FOUND: 336723990,
      /** Delete record error */
      GSEC_ERR_DELETE: 336723991,
      /** Find/delete record error */
      GSEC_ERR_FIND_DEL: 336723992,
      /** Find/display record error */
      GSEC_ERR_FIND_DISP: 336723996,
      /** Invalid parameter, no switch defined */
      GSEC_INV_PARAM: 336723997,
      /** Operation already specified */
      GSEC_OP_SPECIFIED: 336723998,
      /** Password already specified */
      GSEC_PW_SPECIFIED: 336723999,
      /** Uid already specified */
      GSEC_UID_SPECIFIED: 336724e3,
      /** Gid already specified */
      GSEC_GID_SPECIFIED: 336724001,
      /** Project already specified */
      GSEC_PROJ_SPECIFIED: 336724002,
      /** Organization already specified */
      GSEC_ORG_SPECIFIED: 336724003,
      /** First name already specified */
      GSEC_FNAME_SPECIFIED: 336724004,
      /** Middle name already specified */
      GSEC_MNAME_SPECIFIED: 336724005,
      /** Last name already specified */
      GSEC_LNAME_SPECIFIED: 336724006,
      /** Invalid switch specified */
      GSEC_INV_SWITCH: 336724008,
      /** Ambiguous switch specified */
      GSEC_AMB_SWITCH: 336724009,
      /** No operation specified for parameters */
      GSEC_NO_OP_SPECIFIED: 336724010,
      /** No parameters allowed for this operation */
      GSEC_PARAMS_NOT_ALLOWED: 336724011,
      /** Incompatible switches specified */
      GSEC_INCOMPAT_SWITCH: 336724012,
      /** Invalid user name (maximum 31 bytes */
      GSEC_INV_USERNAME: 336724044,
      /** Warning- maximum 8 significant bytes of */
      GSEC_INV_PW_LENGTH: 336724045,
      /** Database already specified */
      GSEC_DB_SPECIFIED: 336724046,
      /** Database administrator name already specified */
      GSEC_DB_ADMIN_SPECIFIED: 336724047,
      /** Database administrator password already */
      GSEC_DB_ADMIN_PW_SPECIFIED: 336724048,
      /** SQL role name already specified */
      GSEC_SQL_ROLE_SPECIFIED: 336724049,
      /** Found unknown switch */
      GSTAT_UNKNOWN_SWITCH: 336920577,
      /** Please retry, giving a database name */
      GSTAT_RETRY: 336920578,
      /** Wrong ODS version, expected @1, encountered */
      GSTAT_WRONG_ODS: 336920579,
      /** Unexpected end of database file. */
      GSTAT_UNEXPECTED_EOF: 336920580,
      /** Can't open database file @1 */
      GSTAT_OPEN_ERR: 336920605,
      /** Can't read a database page */
      GSTAT_READ_ERR: 336920606,
      /** System memory exhausted */
      GSTAT_SYSMEMEX: 336920607,
      /** Wrong value for access mode */
      FBSVCMGR_BAD_AM: 336986113,
      /** Wrong value for write mode */
      FBSVCMGR_BAD_WM: 336986114,
      /** Wrong value for reserve space */
      FBSVCMGR_BAD_RS: 336986115,
      /** Unknown tag (@1) in info_svr_db_info block */
      FBSVCMGR_INFO_ERR: 336986116,
      /** Unknown tag (@1) in isc_svc_query() results */
      FBSVCMGR_QUERY_ERR: 336986117,
      /** Unknown switch "@1" */
      FBSVCMGR_SWITCH_UNKNOWN: 336986118
    };
    exports2.GDSCode = GDSCode;
    +function(_enum) {
      for (var k in _enum)
        _enum[_enum[k]] = k;
      Object.freeze(_enum);
    }(GDSCode);
  }
});

// node_modules/node-firebird/lib/index.js
var require_lib = __commonJS({
  "node_modules/node-firebird/lib/index.js"(exports2) {
    "use strict";
    var __createBinding = exports2 && exports2.__createBinding || (Object.create ? function(o, m, k, k2) {
      k2 === void 0 && (k2 = k);
      var desc = Object.getOwnPropertyDescriptor(m, k);
      (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) && (desc = { enumerable: !0, get: function() {
        return m[k];
      } }), Object.defineProperty(o, k2, desc);
    } : function(o, m, k, k2) {
      k2 === void 0 && (k2 = k), o[k2] = m[k];
    }), __exportStar = exports2 && exports2.__exportStar || function(m, exports3) {
      for (var p in m) p !== "default" && !Object.prototype.hasOwnProperty.call(exports3, p) && __createBinding(exports3, m, p);
    }, __importDefault = exports2 && exports2.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { default: mod };
    };
    Object.defineProperty(exports2, "__esModule", { value: !0 });
    exports2.isc_dpb_interp = exports2.isc_dpb_sys_user_name_enc = exports2.isc_dpb_password_enc = exports2.isc_dpb_password = exports2.isc_dpb_user_name = exports2.isc_dpb_no_reserve = exports2.isc_dpb_quit_log = exports2.isc_dpb_begin_log = exports2.isc_dpb_force_write = exports2.isc_dpb_delete_shadow = exports2.isc_dpb_sweep_interval = exports2.isc_dpb_activate_shadow = exports2.isc_dpb_encrypt_key = exports2.isc_dpb_sys_user_name = exports2.isc_dpb_license = exports2.isc_dpb_damaged = exports2.isc_dpb_no_garbage_collect = exports2.isc_dpb_trace = exports2.isc_dpb_number_of_users = exports2.isc_dpb_dbkey_scope = exports2.isc_dpb_disable_journal = exports2.isc_dpb_enable_journal = exports2.isc_dpb_sweep = exports2.isc_dpb_verify = exports2.isc_dpb_garbage_collect = exports2.isc_dpb_debug = exports2.isc_dpb_buffer_length = exports2.isc_dpb_num_buffers = exports2.isc_dpb_page_size = exports2.isc_dpb_journal = exports2.isc_dpb_allocation = exports2.isc_dpb_cdd_pathname = exports2.isc_dpb_version2 = exports2.isc_dpb_version1 = exports2.ISOLATION_READ_COMMITTED_READ_ONLY = exports2.ISOLATION_SERIALIZABLE = exports2.ISOLATION_REPEATABLE_READ = exports2.ISOLATION_READ_COMMITTED = exports2.ISOLATION_READ_UNCOMMITTED = exports2.NUMERIC_MODE_STRING = exports2.NUMERIC_MODE_SAFE = exports2.NUMERIC_MODE_LOSSY = exports2.WIRE_CRYPT_ENABLE = exports2.WIRE_CRYPT_DISABLE = exports2.AUTH_PLUGIN_SRP512 = exports2.AUTH_PLUGIN_SRP384 = exports2.AUTH_PLUGIN_SRP256 = exports2.AUTH_PLUGIN_SRP = exports2.AUTH_PLUGIN_LEGACY = exports2.GDSCode = void 0;
    exports2.isc_dpb_reset_icu = exports2.isc_dpb_nolinger = exports2.isc_dpb_config = exports2.isc_dpb_auth_plugin_name = exports2.isc_dpb_auth_plugin_list = exports2.isc_dpb_specific_auth_data = exports2.isc_dpb_os_user = exports2.isc_dpb_host_name = exports2.isc_dpb_remote_protocol = exports2.isc_dpb_client_version = exports2.isc_dpb_auth_block = exports2.isc_dpb_ext_call_depth = exports2.isc_dpb_utf8_filename = exports2.isc_dpb_org_filename = exports2.isc_dpb_trusted_role = exports2.isc_dpb_process_name = exports2.isc_dpb_trusted_auth = exports2.isc_dpb_no_db_triggers = exports2.isc_dpb_process_id = exports2.isc_dpb_address_path = exports2.isc_dpb_gsec_attach = exports2.isc_dpb_set_db_charset = exports2.isc_dpb_gstat_attach = exports2.isc_dpb_gfix_attach = exports2.isc_dpb_set_db_sql_dialect = exports2.isc_dpb_set_db_readonly = exports2.isc_dpb_sql_dialect = exports2.isc_dpb_working_directory = exports2.isc_dpb_set_page_buffers = exports2.isc_dpb_sql_role_name = exports2.isc_dpb_gbak_attach = exports2.isc_dpb_dummy_packet_interval = exports2.isc_dpb_connect_timeout = exports2.isc_dpb_sec_attach = exports2.isc_dpb_overwrite = exports2.isc_dpb_reserved = exports2.isc_dpb_shutdown_delay = exports2.isc_dpb_online = exports2.isc_dpb_shutdown = exports2.isc_dpb_cache_manager = exports2.isc_dpb_lc_ctype = exports2.isc_dpb_lc_messages = exports2.isc_dpb_old_dump_id = exports2.isc_dpb_old_start_file = exports2.isc_dpb_old_start_seqno = exports2.isc_dpb_old_start_page = exports2.isc_dpb_old_file = exports2.isc_dpb_old_num_files = exports2.isc_dpb_old_file_size = exports2.isc_dpb_online_dump = void 0;
    exports2.parseNamedPlaceholders = exports2.parseConnectionString = exports2.parseConnectionUri = exports2.connection = exports2.SQL_TYPES = exports2.escape = exports2.isc_dpb_search_path = exports2.isc_dpb_max_inline_blob_size = exports2.isc_dpb_max_blob_cache_size = exports2.isc_dpb_owner = exports2.isc_dpb_worker_attach = exports2.isc_dpb_parallel_workers = exports2.isc_dpb_upgrade_db = exports2.isc_dpb_clear_map = exports2.isc_dpb_decfloat_traps = exports2.isc_dpb_decfloat_round = exports2.isc_dpb_set_bind = exports2.isc_dpb_set_db_replica = exports2.isc_dpb_session_time_zone = exports2.isc_dpb_map_attach = void 0;
    exports2.attach = attach;
    exports2.drop = drop;
    exports2.create = create;
    exports2.attachOrCreate = attachOrCreate;
    exports2.pool = pool;
    exports2.poolCluster = poolCluster;
    exports2.attachAsync = attachAsync;
    exports2.createAsync = createAsync;
    exports2.attachOrCreateAsync = attachOrCreateAsync;
    exports2.dropAsync = dropAsync;
    var const_1 = __importDefault(require_const()), callback_1 = require_callback(), connection_1 = __importDefault(require_connection()), pool_1 = __importDefault(require_pool()), pool_cluster_1 = __importDefault(require_pool_cluster()), utils_1 = require_utils(), uri_1 = require_uri();
    Object.defineProperty(exports2, "parseConnectionUri", { enumerable: !0, get: function() {
      return uri_1.parseConnectionUri;
    } });
    Object.defineProperty(exports2, "parseConnectionString", { enumerable: !0, get: function() {
      return uri_1.parseConnectionString;
    } });
    __exportStar(require_types(), exports2);
    var gdscodes_1 = require_gdscodes();
    Object.defineProperty(exports2, "GDSCode", { enumerable: !0, get: function() {
      return gdscodes_1.GDSCode;
    } });
    typeof setImmediate > "u" && (global.setImmediate = function(cb) {
      process.nextTick(cb);
    });
    exports2.AUTH_PLUGIN_LEGACY = const_1.default.AUTH_PLUGIN_LEGACY;
    exports2.AUTH_PLUGIN_SRP = const_1.default.AUTH_PLUGIN_SRP;
    exports2.AUTH_PLUGIN_SRP256 = const_1.default.AUTH_PLUGIN_SRP256;
    exports2.AUTH_PLUGIN_SRP384 = const_1.default.AUTH_PLUGIN_SRP384;
    exports2.AUTH_PLUGIN_SRP512 = const_1.default.AUTH_PLUGIN_SRP512;
    exports2.WIRE_CRYPT_DISABLE = const_1.default.WIRE_CRYPT_DISABLE;
    exports2.WIRE_CRYPT_ENABLE = const_1.default.WIRE_CRYPT_ENABLE;
    exports2.NUMERIC_MODE_LOSSY = const_1.default.NUMERIC_MODE_LOSSY;
    exports2.NUMERIC_MODE_SAFE = const_1.default.NUMERIC_MODE_SAFE;
    exports2.NUMERIC_MODE_STRING = const_1.default.NUMERIC_MODE_STRING;
    exports2.ISOLATION_READ_UNCOMMITTED = const_1.default.ISOLATION_READ_UNCOMMITTED;
    exports2.ISOLATION_READ_COMMITTED = const_1.default.ISOLATION_READ_COMMITTED;
    exports2.ISOLATION_REPEATABLE_READ = const_1.default.ISOLATION_REPEATABLE_READ;
    exports2.ISOLATION_SERIALIZABLE = const_1.default.ISOLATION_SERIALIZABLE;
    exports2.ISOLATION_READ_COMMITTED_READ_ONLY = const_1.default.ISOLATION_READ_COMMITTED_READ_ONLY;
    exports2.isc_dpb_version1 = const_1.default.isc_dpb_version1;
    exports2.isc_dpb_version2 = const_1.default.isc_dpb_version2;
    exports2.isc_dpb_cdd_pathname = const_1.default.isc_dpb_cdd_pathname;
    exports2.isc_dpb_allocation = const_1.default.isc_dpb_allocation;
    exports2.isc_dpb_journal = const_1.default.isc_dpb_journal;
    exports2.isc_dpb_page_size = const_1.default.isc_dpb_page_size;
    exports2.isc_dpb_num_buffers = const_1.default.isc_dpb_num_buffers;
    exports2.isc_dpb_buffer_length = const_1.default.isc_dpb_buffer_length;
    exports2.isc_dpb_debug = const_1.default.isc_dpb_debug;
    exports2.isc_dpb_garbage_collect = const_1.default.isc_dpb_garbage_collect;
    exports2.isc_dpb_verify = const_1.default.isc_dpb_verify;
    exports2.isc_dpb_sweep = const_1.default.isc_dpb_sweep;
    exports2.isc_dpb_enable_journal = const_1.default.isc_dpb_enable_journal;
    exports2.isc_dpb_disable_journal = const_1.default.isc_dpb_disable_journal;
    exports2.isc_dpb_dbkey_scope = const_1.default.isc_dpb_dbkey_scope;
    exports2.isc_dpb_number_of_users = const_1.default.isc_dpb_number_of_users;
    exports2.isc_dpb_trace = const_1.default.isc_dpb_trace;
    exports2.isc_dpb_no_garbage_collect = const_1.default.isc_dpb_no_garbage_collect;
    exports2.isc_dpb_damaged = const_1.default.isc_dpb_damaged;
    exports2.isc_dpb_license = const_1.default.isc_dpb_license;
    exports2.isc_dpb_sys_user_name = const_1.default.isc_dpb_sys_user_name;
    exports2.isc_dpb_encrypt_key = const_1.default.isc_dpb_encrypt_key;
    exports2.isc_dpb_activate_shadow = const_1.default.isc_dpb_activate_shadow;
    exports2.isc_dpb_sweep_interval = const_1.default.isc_dpb_sweep_interval;
    exports2.isc_dpb_delete_shadow = const_1.default.isc_dpb_delete_shadow;
    exports2.isc_dpb_force_write = const_1.default.isc_dpb_force_write;
    exports2.isc_dpb_begin_log = const_1.default.isc_dpb_begin_log;
    exports2.isc_dpb_quit_log = const_1.default.isc_dpb_quit_log;
    exports2.isc_dpb_no_reserve = const_1.default.isc_dpb_no_reserve;
    exports2.isc_dpb_user_name = const_1.default.isc_dpb_user_name;
    exports2.isc_dpb_password = const_1.default.isc_dpb_password;
    exports2.isc_dpb_password_enc = const_1.default.isc_dpb_password_enc;
    exports2.isc_dpb_sys_user_name_enc = const_1.default.isc_dpb_sys_user_name_enc;
    exports2.isc_dpb_interp = const_1.default.isc_dpb_interp;
    exports2.isc_dpb_online_dump = const_1.default.isc_dpb_online_dump;
    exports2.isc_dpb_old_file_size = const_1.default.isc_dpb_old_file_size;
    exports2.isc_dpb_old_num_files = const_1.default.isc_dpb_old_num_files;
    exports2.isc_dpb_old_file = const_1.default.isc_dpb_old_file;
    exports2.isc_dpb_old_start_page = const_1.default.isc_dpb_old_start_page;
    exports2.isc_dpb_old_start_seqno = const_1.default.isc_dpb_old_start_seqno;
    exports2.isc_dpb_old_start_file = const_1.default.isc_dpb_old_start_file;
    exports2.isc_dpb_old_dump_id = const_1.default.isc_dpb_old_dump_id;
    exports2.isc_dpb_lc_messages = const_1.default.isc_dpb_lc_messages;
    exports2.isc_dpb_lc_ctype = const_1.default.isc_dpb_lc_ctype;
    exports2.isc_dpb_cache_manager = const_1.default.isc_dpb_cache_manager;
    exports2.isc_dpb_shutdown = const_1.default.isc_dpb_shutdown;
    exports2.isc_dpb_online = const_1.default.isc_dpb_online;
    exports2.isc_dpb_shutdown_delay = const_1.default.isc_dpb_shutdown_delay;
    exports2.isc_dpb_reserved = const_1.default.isc_dpb_reserved;
    exports2.isc_dpb_overwrite = const_1.default.isc_dpb_overwrite;
    exports2.isc_dpb_sec_attach = const_1.default.isc_dpb_sec_attach;
    exports2.isc_dpb_connect_timeout = const_1.default.isc_dpb_connect_timeout;
    exports2.isc_dpb_dummy_packet_interval = const_1.default.isc_dpb_dummy_packet_interval;
    exports2.isc_dpb_gbak_attach = const_1.default.isc_dpb_gbak_attach;
    exports2.isc_dpb_sql_role_name = const_1.default.isc_dpb_sql_role_name;
    exports2.isc_dpb_set_page_buffers = const_1.default.isc_dpb_set_page_buffers;
    exports2.isc_dpb_working_directory = const_1.default.isc_dpb_working_directory;
    exports2.isc_dpb_sql_dialect = const_1.default.isc_dpb_sql_dialect;
    exports2.isc_dpb_set_db_readonly = const_1.default.isc_dpb_set_db_readonly;
    exports2.isc_dpb_set_db_sql_dialect = const_1.default.isc_dpb_set_db_sql_dialect;
    exports2.isc_dpb_gfix_attach = const_1.default.isc_dpb_gfix_attach;
    exports2.isc_dpb_gstat_attach = const_1.default.isc_dpb_gstat_attach;
    exports2.isc_dpb_set_db_charset = const_1.default.isc_dpb_set_db_charset;
    exports2.isc_dpb_gsec_attach = const_1.default.isc_dpb_gsec_attach;
    exports2.isc_dpb_address_path = const_1.default.isc_dpb_address_path;
    exports2.isc_dpb_process_id = const_1.default.isc_dpb_process_id;
    exports2.isc_dpb_no_db_triggers = const_1.default.isc_dpb_no_db_triggers;
    exports2.isc_dpb_trusted_auth = const_1.default.isc_dpb_trusted_auth;
    exports2.isc_dpb_process_name = const_1.default.isc_dpb_process_name;
    exports2.isc_dpb_trusted_role = const_1.default.isc_dpb_trusted_role;
    exports2.isc_dpb_org_filename = const_1.default.isc_dpb_org_filename;
    exports2.isc_dpb_utf8_filename = const_1.default.isc_dpb_utf8_filename;
    exports2.isc_dpb_ext_call_depth = const_1.default.isc_dpb_ext_call_depth;
    exports2.isc_dpb_auth_block = const_1.default.isc_dpb_auth_block;
    exports2.isc_dpb_client_version = const_1.default.isc_dpb_client_version;
    exports2.isc_dpb_remote_protocol = const_1.default.isc_dpb_remote_protocol;
    exports2.isc_dpb_host_name = const_1.default.isc_dpb_host_name;
    exports2.isc_dpb_os_user = const_1.default.isc_dpb_os_user;
    exports2.isc_dpb_specific_auth_data = const_1.default.isc_dpb_specific_auth_data;
    exports2.isc_dpb_auth_plugin_list = const_1.default.isc_dpb_auth_plugin_list;
    exports2.isc_dpb_auth_plugin_name = const_1.default.isc_dpb_auth_plugin_name;
    exports2.isc_dpb_config = const_1.default.isc_dpb_config;
    exports2.isc_dpb_nolinger = const_1.default.isc_dpb_nolinger;
    exports2.isc_dpb_reset_icu = const_1.default.isc_dpb_reset_icu;
    exports2.isc_dpb_map_attach = const_1.default.isc_dpb_map_attach;
    exports2.isc_dpb_session_time_zone = const_1.default.isc_dpb_session_time_zone;
    exports2.isc_dpb_set_db_replica = const_1.default.isc_dpb_set_db_replica;
    exports2.isc_dpb_set_bind = const_1.default.isc_dpb_set_bind;
    exports2.isc_dpb_decfloat_round = const_1.default.isc_dpb_decfloat_round;
    exports2.isc_dpb_decfloat_traps = const_1.default.isc_dpb_decfloat_traps;
    exports2.isc_dpb_clear_map = const_1.default.isc_dpb_clear_map;
    exports2.isc_dpb_upgrade_db = const_1.default.isc_dpb_upgrade_db;
    exports2.isc_dpb_parallel_workers = const_1.default.isc_dpb_parallel_workers;
    exports2.isc_dpb_worker_attach = const_1.default.isc_dpb_worker_attach;
    exports2.isc_dpb_owner = const_1.default.isc_dpb_owner;
    exports2.isc_dpb_max_blob_cache_size = const_1.default.isc_dpb_max_blob_cache_size;
    exports2.isc_dpb_max_inline_blob_size = const_1.default.isc_dpb_max_inline_blob_size;
    exports2.isc_dpb_search_path = const_1.default.isc_dpb_search_path;
    exports2.escape = utils_1.escape;
    exports2.SQL_TYPES = Object.freeze({
      SQL_TEXT: const_1.default.SQL_TEXT,
      SQL_VARYING: const_1.default.SQL_VARYING,
      SQL_SHORT: const_1.default.SQL_SHORT,
      SQL_LONG: const_1.default.SQL_LONG,
      SQL_FLOAT: const_1.default.SQL_FLOAT,
      SQL_DOUBLE: const_1.default.SQL_DOUBLE,
      SQL_D_FLOAT: const_1.default.SQL_D_FLOAT,
      SQL_TIMESTAMP: const_1.default.SQL_TIMESTAMP,
      SQL_BLOB: const_1.default.SQL_BLOB,
      SQL_ARRAY: const_1.default.SQL_ARRAY,
      SQL_QUAD: const_1.default.SQL_QUAD,
      SQL_TYPE_TIME: const_1.default.SQL_TYPE_TIME,
      SQL_TYPE_DATE: const_1.default.SQL_TYPE_DATE,
      SQL_INT64: const_1.default.SQL_INT64,
      SQL_INT128: const_1.default.SQL_INT128,
      SQL_TIMESTAMP_TZ: const_1.default.SQL_TIMESTAMP_TZ,
      SQL_TIMESTAMP_TZ_EX: const_1.default.SQL_TIMESTAMP_TZ_EX,
      SQL_TIME_TZ: const_1.default.SQL_TIME_TZ,
      SQL_TIME_TZ_EX: const_1.default.SQL_TIME_TZ_EX,
      SQL_DEC16: const_1.default.SQL_DEC16,
      SQL_DEC34: const_1.default.SQL_DEC34,
      SQL_BOOLEAN: const_1.default.SQL_BOOLEAN,
      SQL_NULL: const_1.default.SQL_NULL
    });
    function attach(options, callback) {
      options = (0, uri_1.normalizeOptions)(options);
      var host = options.host || const_1.default.DEFAULT_HOST, port = options.port || const_1.default.DEFAULT_PORT, manager = options.manager || !1, cnx = exports2.connection = new connection_1.default(host, port, function(err) {
        if (err) {
          (0, callback_1.doError)(err, callback);
          return;
        }
        cnx.connect(options, function(err2) {
          err2 ? (0, callback_1.doError)(err2, callback) : manager ? cnx.svcattach(options, callback) : cnx.attach(options, callback);
        });
      }, options);
    }
    function drop(options, callback) {
      attach((0, uri_1.normalizeOptions)(options), function(err, db) {
        if (err) {
          callback({ error: err, message: "Drop error" });
          return;
        }
        db.drop(callback);
      });
    }
    function create(options, callback) {
      options = (0, uri_1.normalizeOptions)(options);
      var host = options.host || const_1.default.DEFAULT_HOST, port = options.port || const_1.default.DEFAULT_PORT, cnx = exports2.connection = new connection_1.default(host, port, function(err) {
        var self = cnx;
        if (err) {
          callback({ error: err, message: "Connect error" }, void 0);
          return;
        }
        cnx.connect(options, function(err2) {
          if (err2) {
            self.db && self.db.emit("error", err2), (0, callback_1.doError)(err2, callback);
            return;
          }
          cnx.createDatabase(options, callback);
        });
      }, options);
    }
    function attachOrCreate(options, callback) {
      options = (0, uri_1.normalizeOptions)(options);
      var host = options.host || const_1.default.DEFAULT_HOST, port = options.port || const_1.default.DEFAULT_PORT, cnx = exports2.connection = new connection_1.default(host, port, function(err) {
        var self = cnx;
        if (err) {
          callback({ error: err, message: "Connect error" }, void 0);
          return;
        }
        cnx.connect(options, function(err2) {
          if (err2) {
            (0, callback_1.doError)(err2, callback);
            return;
          }
          cnx.attach(options, function(err3, ret) {
            if (!err3) {
              self.db && self.db.emit("connect", ret), (0, callback_1.doCallback)(ret, callback);
              return;
            }
            cnx.createDatabase(options, callback);
          });
        });
      }, options);
    }
    function pool(max, options) {
      return new pool_1.default(attach, max, Object.assign({}, (0, uri_1.normalizeOptions)(options), { isPool: !0 }));
    }
    function poolCluster(options) {
      let normalized = { ...options || {} };
      return normalized.defaults = (0, uri_1.normalizeOptions)(normalized.defaults || {}), new pool_cluster_1.default(attach, normalized);
    }
    var named_params_1 = require_named_params();
    Object.defineProperty(exports2, "parseNamedPlaceholders", { enumerable: !0, get: function() {
      return named_params_1.parseNamedPlaceholders;
    } });
    function attachAsync(options) {
      return (0, callback_1.fromCallback)(function(cb) {
        attach(options, cb);
      });
    }
    function createAsync(options) {
      return (0, callback_1.fromCallback)(function(cb) {
        create(options, cb);
      });
    }
    function attachOrCreateAsync(options) {
      return (0, callback_1.fromCallback)(function(cb) {
        attachOrCreate(options, cb);
      });
    }
    function dropAsync(options) {
      return (0, callback_1.fromCallback)(function(cb) {
        drop(options, cb);
      });
    }
  }
});

// entries/vendor-firebird.js
module.exports = require_lib();
