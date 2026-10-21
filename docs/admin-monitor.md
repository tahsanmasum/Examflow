# Admin Monitor (v47)

The Admin Monitor is ExamFlow's control center. Open it from your dashboard: **your name → 🛡️ Admin Monitor**. It shows real data only. When something can't be measured, it says so instead of showing a number.

Every page reads from `/api/admin`, a Vercel function. That function checks your Firebase sign-in and your **role** on **every** request. Buttons you aren't allowed to use are hidden for convenience, but the protection is the server check: a forbidden action called directly returns **403** and is written to the audit log.

## Layout

- **Sidebar**: grouped into People, Institutions, Platform, Operations, Cloud activity and You. It shows only the modules your role can open. On a phone it becomes a drawer behind the ☰ button.
- **Top bar**:
  - breadcrumbs;
  - one **search** box across users, institutions, announcements and packages (it only returns what you may see);
  - **🔔 notifications**: licences ending or in grace, servers degraded or offline, configuration waiting for a server, open security alerts, application errors;
  - **← Dashboard**.
- **Every change is confirmed and reported honestly.** You confirm first, and after the server answers you see what actually happened: *applied*, *pending* (waiting for an institution server), *waiting for registration*, *failed* (with the reason), *refused* (no permission). A success message appears only after the server confirms.
- **Times**: all dates are shown in Asia/Dhaka time.

## Modules

| Module | What it does |
|---|---|
| **Overview** | Key figures for 7, 30 or 90 days or a custom range:<br>• cloud users: total, active (signed in within 30 days), suspended or disabled, pending invitations, institution rosters;<br>• exams open right now;<br>• institutions and licences by status, configuration waiting for a server, reported server versions;<br>• announcements, admin actions, application errors, open security alerts.<br>Bar charts of new accounts, exams created and admin actions per day. Panels list upcoming expirations, server health, recent admin activity and recent announcements, plus quick actions. Each figure's definition is written under the page. |
| **User Management** | Cloud accounts (your Firebase Authentication users) and institution teachers (from their rosters), with search, filters, sorting, pagination and CSV export.<br>A user's page shows their account, exams, invitations, status history and admin history. Actions:<br>• **Edit** name, institution association and notes;<br>• **Suspend / Disable / Reactivate**, with a reason. This really disables the Firebase account and revokes its sign-ins. Nothing is deleted;<br>• **Sign out everywhere**;<br>• **Send password reset / Resend invitation**: Firebase sends the email from your browser, and ExamFlow never sees the link or the password;<br>• **View their dashboard**: owners only, read-only;<br>• **Send a message**.<br>**Add user**: cloud teacher (a Firebase account is created without a password, then Firebase emails a set-password link) or institution teacher (added to the institution's roster). It checks for duplicates first. |
| **Admin Team & Permissions** | Platform owners come from `ADMIN_EMAILS` and can't be changed here. Add admins by email with a role, change roles, remove admins (their admin sessions end) and create custom roles from 33 permissions. You can't give permissions you don't have, and you can't change your own seat. Only an owner can create a Super Admin. |
| **Institution Management** | Institution-hosted deployments. The list shows search, filters for licence and server health, and sorting.<br>**+ New institution** is a four-step wizard: institution, package, licence, review.<br>Each institution has these tabs:<br>• **Overview**: readiness checklist and details;<br>• **Package & features**: assign or upgrade the package, override features;<br>• **Roster**: add teachers by hand or by CSV with row-level checks;<br>• **Licence**;<br>• **Install packages**;<br>• **Server & sync**;<br>• **Messages**;<br>• **Activity**.<br>See `docs/institutions.md`. |
| **Packages & Entitlements** | Reusable entitlement profiles: which of the 10 features are included, the maximum number of teachers and the maximum number of exams open at once. They are **not payment plans**: there is no price and no checkout.<br>Six templates are built in: Pilot, Starter, Standard, Professional, Enterprise and Custom. You can add your own.<br>Editing a package creates a new **version**. Institutions keep their version until you apply the new one, and you see a preview first. Packages can be retired. |
| **Licence Management** | Every institution's licence, filtered by status:<br>• Not set, Pending, Active, Expiring Soon, Grace Period, Expired, Suspended, Revoked.<br>• Set and Renew: 1, 2, 3, 4 or 6 months, 1 year (default), 2 years, a custom number of days or a custom end date.<br>• Grace days and warnings.<br>• Suspend, Reactivate and Revoke.<br>• Full history. Activation is always manual; no payment is involved. |
| **Feature Controls** | All 10 real ExamFlow features. For each one you see its global default, kill switch, exceptions (institution and per-user overrides), which packages include it, and who changed it last.<br>Turning one off first previews who is affected. Then you confirm with a reason, and the result reports what really happened.<br>**Kill switches** need *features.emergency*, a typed name and a recent sign-in. Each change creates a configuration version you can undo.<br>The page also says whether your published Firestore rules enforce the switches (see below), and whether each institution server has applied the current configuration. |
| **Global Settings** | Only settings ExamFlow really uses:<br>• **Maintenance notice**: on/off, text, level;<br>• **Support email**;<br>• **Exam defaults** (pre-filled in Create exam): MCQ and written duration, marks per MCQ, shuffling;<br>• **Paper reader files**: largest file, most pages, accepted formats;<br>• **Licence defaults**: length, warnings, grace;<br>• **Announcements** master switch;<br>• **Security**: re-authentication window, invitation expiry, institution request limit.<br>Saving shows a before-and-after review and needs a reason. Any change that lowers protection also needs WEAKEN typed. Each save is versioned and can be rolled back.<br>Settings that would be fake (language, platform name, password policy) are listed as not available, with the reason. |
| **Announcements** | Pop-ups with heading, message (text with **bold** and line breaks), one https link, category, priority, start/end time, and how users close them (close, or must acknowledge).<br>Audience can be:<br>• everyone;<br>• the public landing page only;<br>• cloud teacher dashboards;<br>• selected institutions.<br>A live preview shows the pop-up as users see it. Nothing typed can run as code. Each announcement moves through Draft, Scheduled, Live, Ended, Taken down and Archived.<br>**Hide all now** is the emergency master switch. Each person sees an announcement once per version. Pop-ups are never shown to students sitting an exam. |
| **Dashboard Messages** | Messages to:<br>• selected cloud accounts;<br>• all cloud teachers (type ALL);<br>• cloud accounts associated with an institution;<br>• all or specific teachers at an institution.<br>Each message has an optional link, priority, delivery time and expiry. A live preview shows it.<br>Recipients see it in the **✉ inbox** on their dashboard. **Delivered** is recorded when their dashboard fetches it, and **Read** when they open it. For institution teachers, the counts come back from their server's check-in.<br>You can withdraw a message. |
| **System Health** | Live checks of:<br>• the control plane;<br>• Firestore;<br>• Firebase Authentication;<br>• the signing key;<br>• the public address;<br>• the Firestore rules version.<br>It also shows the Vercel deployment (environment, commit, branch) and versions: the app being served, and the server software in this release.<br>Each institution server's state (Healthy, Degraded, Unknown, Offline, Not connected) is shown with the reason, its version, compatibility and config sync.<br>The page also lists application errors reported by browsers, failed admin operations, and server and sync events. It states the release policy: the app updates through GitHub → Vercel; configuration syncs; server software changes only by a new install package. |
| **Security Center** | Alerts (5+ refused attempts from one address in an hour, an admin sign-in from a new address, a burst of high-risk changes) that you can mark resolved. A security review checklist, which includes whether `ADMIN_EMAILS` matches your Firestore rules. Admin sign-in methods and second factors. Admin Monitor sessions, which you can sign out. Refused attempts, permission refusals, role changes and recent high-risk changes. |
| **Audit Logs** | Every administrative action, including refused and failed ones. Each entry has the time, admin, role, action, target, institution, result, reason, before/after details, request ID, address and browser.<br>You can filter by date, admin, area, result, risk or institution, open the details, and export to CSV (*audit.export*). Entries are written only by the server; nobody can edit or delete them. |
| **Reports** | Previews and CSV downloads of live data:<br>• institution directory;<br>• licence status;<br>• licences ending in 90 days;<br>• package distribution;<br>• feature entitlements by institution;<br>• user account status;<br>• administrative activity;<br>• server health;<br>• announcement history. |
| **Cloud activity** | The v45 Admin Monitor views, now loaded through the server:<br>• **Teacher activity**: Active, Cooling, Dormant, Churned, drop-off;<br>• **Exams**: owners can delete one, with a typed confirmation and a recent sign-in;<br>• **Live & sessions**;<br>• **Feedback**. |
| **Admin Settings** | Your own preferences: which page opens first and how many rows per page. **Sign out everywhere.** |

## Roles

| Role | Can |
|---|---|
| **Platform Owner** | Everything. Set by `ADMIN_EMAILS`. |
| **Super Admin** | Everything, including the admin team; can't change owners. |
| **Operations Administrator** | Institutions, licences (not revoke), package assignment, feature view, health, audit, reports, users (view). |
| **User Support Administrator** | Users (view), recovery emails, messages, institutions and licences (view), audit. |
| **Communications Manager** | Announcements and messages. |
| **Read-Only Administrator** | Every *view* permission, no changes. |
| **Custom roles** | Any combination of the 33 permissions you hold. |

These actions need a sign-in within the last 15 minutes (Global Settings → Security):
- revoking a licence or an install package;
- resetting a server;
- kill switches;
- every admin-team change;
- signing out another admin;
- deleting an exam.

The Admin Monitor asks you to confirm it's you, with Google or your password, and then continues.

## How features are enforced (honestly)

| Feature | Cloud users | Institutions |
|---|---|---|
| MCQ, written and combined exams; camera monitoring; pictures in questions | **Firestore rules** refuse creating an exam that newly uses a switched-off feature, once you publish the v47 `firestore.rules`. Exams that already use it keep working. | The institution **server** refuses it (`feature_off`). |
| Feedback form | Firestore rules refuse new feedback while it's off. | The app hides it. |
| Reading a question paper, result exports, student review links, switching device | **The app** hides and blocks them. These run inside the browser, so no server sees them. | **The app** hides and blocks them. |

Precedence: emergency kill switch → package entitlement (institutions) → institution override → per-user override (cloud) → global default. Core protections (sign-in, permissions, audit, data integrity) are not features and can't be switched off.

Until you publish the v47 rules, Feature Controls shows **Database enforcement: Degraded**. In that state, cloud switches are only hidden in the app.

## Data model (Firestore, your project)

All new collections are written only by the server functions. The browser is denied them by `firestore.rules`.

| Collection | Holds |
|---|---|
| `cpAdmins`, `cpRoles`, `cpAdminSessions` | Admin team seats (email → role, status), custom roles, Admin Monitor sessions. |
| `cpUserMeta`, `cpInvites` | Admin notes, status history and institution association per cloud account; invitations. |
| `cpPlans` | Packages (entitlement profiles) with their version history. |
| `cpInstitutions` | Institution record, licence, entitlement snapshot, feature overrides, server and sync state. |
| `cpAllowlists`, `cpPackages`, `cpLicenceEvents`, `cpRegCodes`, `cpServers`, `cpOps` | Rosters, install packages, licence history, registration codes, servers, idempotent operations (from v46). |
| `cpConfig`, `cpConfigVersions` | Feature configuration and settings, with every version (before/after, who, why). |
| `cpFeatureUsers` | Per-account feature overrides (copied to `featureUsers/{uid}` for the rules). |
| `cpAnnouncements`, `cpMessages`, `cpDeliveries` | Announcements; messages; one delivery record per cloud recipient (delivered, read, archived). |
| `cpAudit`, `cpSecurity`, `cpEvents`, `cpErrors`, `cpAlerts` | Audit log, security events, server and sync events, browser error reports, resolved alerts. |

The app reads these public documents:
- `meta/features`: `{v, off, kill}`;
- `meta/settings`: the public settings only, never the security values;
- `meta/announcements`: published items;
- `featureUsers/{uid}`: readable only by that account.

Existing collections (`teachers`, `exams`, `sessions`, `feedback`) and every user ID are unchanged.

On the institution server, a new `inbox` table (migration 1) records message delivery and reading. The applied configuration is stored in its `meta` table.

## What is live when

| Change | When it takes effect |
|---|---|
| The Admin Monitor itself, the inbox, announcements, the maintenance notice, exam defaults, app-side feature hiding | As soon as Vercel deploys v47 (GitHub → Vercel). |
| Database enforcement of cloud feature switches | After you publish `firestore.rules` from v47 (Firebase console → Firestore → Rules → Publish). Test it in the console's Rules Playground first. |
| Institution configuration, roster, announcements and messages | At each registered server's next check-in. They show *pending* until the server confirms. |
| Institution server software (features enforcement and limits on the server, the inbox) | Only after that institution's IT installs a **v47 install package** (generate one on the Install packages tab). A v46 server keeps its licence checks but ignores the new configuration; the Admin Monitor then shows it as *pending*. |

There is no payment gateway, no paywall and no automatic backend updater.

## Limitations, honestly

- Tested against a stand-in for Firebase that enforces Firestore's document rules (transactions, nested arrays, size), not a live project. The new Firestore rules could not be run in the Firestore emulator here, because its download is blocked. Check them in the Rules Playground before publishing.
- Google sign-in 2-step verification lives in the Google account and isn't visible to ExamFlow. The Security Center says so instead of guessing.
- Error reports come only from browsers that load v47 and are limited to the message, file and line.
- Paper-reader file limits are checked in the teacher's browser, where the reading happens; papers are never uploaded.
