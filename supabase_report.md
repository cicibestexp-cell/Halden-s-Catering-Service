# SMARTSERVE — Supabase Migration Report
**Project:** Hal'Serve / Halden's Event Management & Catering Service  
**Migration:** Firebase/Firestore → Supabase (PostgreSQL)  
**Date:** July 6, 2026  

---

## Overview

This document records every change made to migrate SmartServe from Firebase to Supabase, including all SQL commands run in the Supabase SQL Editor and all code files that were modified.

The migration used a **Firestore Emulation Adapter Pattern** — rather than rewriting ~26,000 lines of frontend Javascript, a shim file (`supabase_adapter.js`) was created that maps Firebase SDK function calls (like `addDoc`, `getDocs`, `onSnapshot`) directly to Supabase API calls under the hood. This preserved all existing application logic.

---

## Supabase Project Credentials

| Field | Value |
|---|---|
| **Project URL** | `https://nukbdmyqizrnkmbusdtm.supabase.co` |
| **Anon/Public Key** | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51a2JkbXlxaXpybmttYnVzZHRtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMzMjM3NTQsImV4cCI6MjA5ODg5OTc1NH0.WlKtqa8hBxLedDHS7-q10yoPne6VTjt5F4E86vTA5eY` |

---

## Files Created

### 1. `supabase_adapter.js` *(NEW)*
The core migration file. A drop-in polyfill that exposes the same `window.firebaseFns` API the existing JS code expects, but translates all calls natively into Supabase queries.

**Firebase → Supabase function mappings:**

| Firebase Function | Supabase Equivalent |
|---|---|
| `addDoc(collection(db, 'table'), data)` | `supabase.from('table').insert([data])` |
| `getDocs(query(..., where(...)))` | `supabase.from('table').select('*').eq(...)` |
| `getDoc(doc(db, 'table', id))` | `supabase.from('table').select('*').eq('id', id).single()` |
| `updateDoc(docRef, data)` | `supabase.from('table').update(data).eq('id', id)` |
| `setDoc(docRef, data)` | `supabase.from('table').upsert([{id, ...data}])` |
| `onSnapshot(query, cb)` | `supabase.channel(...).on('postgres_changes', ...).subscribe()` |
| `signInWithEmailAndPassword(...)` | `supabase.auth.signInWithPassword(...)` |
| `createUserWithEmailAndPassword(...)` | `supabase.auth.signUp(...)` |
| `signOut(auth)` | `supabase.auth.signOut()` |
| `onAuthStateChanged(auth, cb)` | `supabase.auth.onAuthStateChange(...)` |
| `signInWithPopup(auth, GoogleAuthProvider)` | `supabase.auth.signInWithOAuth({ provider: 'google' })` |

Also added `docChanges()` support with proper change tracking (`added`, `modified`, `removed`) to support the payment modal reactivity in the customer dashboard.

---

### 2. `supabase_schema.sql` *(NEW)*
The full PostgreSQL schema for the project. Contains all table definitions, indexes, Row Level Security policies, and Realtime publication setup.

**Tables created:**

| Table | Purpose |
|---|---|
| `users` | Supplements Supabase Auth — stores name, role, password, etc. |
| `reservations` | Core reservation records |
| `reservation_items` | Items per reservation (food, equipment, etc.) |
| `meetings` | Meeting schedules tied to reservations |
| `guests` | Guest list per reservation |
| `timeline_phases` | Event planning phases |
| `adhoc_charges` | Post-event settlement charges |
| `execution_activities` | Activity log on event day |
| `equipment_inventory` | Equipment catalog |
| `equipment_cycles` | Equipment allocation per reservation |
| `equipment_maintenance` | Maintenance logs |
| `equipment_resupply` | Resupply/purchase requests |
| `announcements` | Admin-to-staff announcements |
| `admin_chats` | Support + meeting chat messages |
| `directives` | Customer-facing notifications/flags |
| `routine_checks` | Equipment inspection logs |
| `messages` | General messaging collection |
| `chat_messages` | Per-reservation client chat |
| `chats` | Reservation-scoped chat |
| `designs` | Design selections per reservation |
| `foodtaste` | Food tasting records per reservation |
| `deploymentlogs` | Deployment activity logs |

---

## Files Modified

### 3. `index.html`
- Removed all Firebase ES Module `<script type="module">` import blocks
- Added Supabase CDN: `<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>`
- Added Supabase client initialization with project URL and anon key
- Added `<script src="supabase_adapter.js"></script>` injection

### 4. `admin.html`
- Same SDK swap as `index.html`
- Injected `supabase_adapter.js`

### 5. `staff.html`
- Same SDK swap as `index.html`
- Injected `supabase_adapter.js`

### 6. `customer.html`
- Same SDK swap as `index.html`
- Injected `supabase_adapter.js`
- **Auth guard rewritten** — the original guard only checked for a Supabase Auth session (which the custom `doLogin()` never creates). Updated to a two-step check:
  1. First checks `localStorage.getItem('halden_customer')` (set by the custom login)
  2. Falls back to checking `supabase.auth.getSession()` for OAuth flows
  3. Only redirects to `index.html` if both checks fail

---

## SQL Run in Supabase SQL Editor (Chronological)

### Step 1 — Initial Schema
Ran the full contents of `supabase_schema.sql`. Created all core tables with proper columns, indexes, RLS policies, and Realtime subscriptions.

### Step 2 — Disable Row Level Security
Because the custom `doLogin()` performs a pre-authentication read on the `users` table (to check the password), all RLS policies were disabled to match the open-access model of the original Firebase setup:

```sql
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservations DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservation_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.meetings DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.guests DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.timeline_phases DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.adhoc_charges DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.execution_activities DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.equipment_inventory DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.equipment_cycles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.equipment_maintenance DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.equipment_resupply DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_chats DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.directives DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.routine_checks DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.designs DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.chats DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.foodtaste DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.deploymentlogs DISABLE ROW LEVEL SECURITY;
```

### Step 3 — Add Admin User
Created the first admin account directly in the database:

```sql
DO $$
DECLARE new_user_id uuid := gen_random_uuid();
BEGIN
  INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
  VALUES ('00000000-0000-0000-0000-000000000000', new_user_id, 'authenticated', 'authenticated', 'admin@gmail.com', crypt('Yotsuba07', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"administrator"}', now(), now());
  INSERT INTO auth.identities (id, provider_id, user_id, identity_data, provider, created_at, updated_at)
  VALUES (gen_random_uuid(), new_user_id::text, new_user_id, format('{"sub":"%s","email":"%s"}', new_user_id::text, 'admin@gmail.com')::jsonb, 'email', now(), now());
  INSERT INTO public.users (id, name, email, role, status, created_at)
  VALUES (new_user_id, 'administrator', 'admin@gmail.com', 'admin', 'Active', now());
END $$;
```

Then added the plain-text password used by `doLogin()`:
```sql
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS password text;
ALTER TABLE public.users ALTER COLUMN id SET DEFAULT gen_random_uuid();
UPDATE public.users SET password = 'Yotsuba07' WHERE email = 'admin@gmail.com';
```

### Step 4 — Complete Column Patch
Added all camelCase columns (matching exact Javascript field names) that were missing from the strictly-typed Postgres tables:

```sql
-- USERS
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS uid text;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS fname text;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS lname text;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS mname text;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS "createdAt" text;

-- RESERVATIONS
ALTER TABLE public.reservations ADD COLUMN IF NOT EXISTS client text;
ALTER TABLE public.reservations ADD COLUMN IF NOT EXISTS email text;
ALTER TABLE public.reservations ADD COLUMN IF NOT EXISTS "customerEmail" text;
ALTER TABLE public.reservations ADD COLUMN IF NOT EXISTS "packageName" text;
ALTER TABLE public.reservations ADD COLUMN IF NOT EXISTS "packageItems" jsonb;
ALTER TABLE public.reservations ADD COLUMN IF NOT EXISTS time text;
ALTER TABLE public.reservations ADD COLUMN IF NOT EXISTS coords jsonb;
ALTER TABLE public.reservations ADD COLUMN IF NOT EXISTS "createdAt" text;
ALTER TABLE public.reservations ADD COLUMN IF NOT EXISTS "isVIP" boolean DEFAULT false;
ALTER TABLE public.reservations ADD COLUMN IF NOT EXISTS "vipCount" integer DEFAULT 0;
ALTER TABLE public.reservations ADD COLUMN IF NOT EXISTS "vipService" text;
ALTER TABLE public.reservations ADD COLUMN IF NOT EXISTS "proposedMeetingTimes" jsonb;
ALTER TABLE public.reservations ADD COLUMN IF NOT EXISTS "pricingMode" text;
ALTER TABLE public.reservations ADD COLUMN IF NOT EXISTS "selectedTier" jsonb;
ALTER TABLE public.reservations ALTER COLUMN date TYPE text USING date::text;
ALTER TABLE public.reservations ALTER COLUMN amount TYPE text USING amount::text;

-- MEETINGS
ALTER TABLE public.meetings ADD COLUMN IF NOT EXISTS "createdAt" text;
ALTER TABLE public.meetings ADD COLUMN IF NOT EXISTS "meetingRoomId" text;
ALTER TABLE public.meetings ADD COLUMN IF NOT EXISTS "clientName" text;
ALTER TABLE public.meetings ADD COLUMN IF NOT EXISTS "customerEmail" text;
ALTER TABLE public.meetings ADD COLUMN IF NOT EXISTS "reservationId" text;
ALTER TABLE public.meetings ADD COLUMN IF NOT EXISTS "customerName" text;

-- MESSAGES
ALTER TABLE public.messages ADD COLUMN IF NOT EXISTS uid text;
ALTER TABLE public.messages ADD COLUMN IF NOT EXISTS "userName" text;
ALTER TABLE public.messages ADD COLUMN IF NOT EXISTS "userEmail" text;
ALTER TABLE public.messages ADD COLUMN IF NOT EXISTS text text;
ALTER TABLE public.messages ADD COLUMN IF NOT EXISTS sender text;
ALTER TABLE public.messages ADD COLUMN IF NOT EXISTS timestamp text;

-- CHAT_MESSAGES
ALTER TABLE public.chat_messages ADD COLUMN IF NOT EXISTS "clientId" text;
ALTER TABLE public.chat_messages ADD COLUMN IF NOT EXISTS "senderId" text;
ALTER TABLE public.chat_messages ADD COLUMN IF NOT EXISTS "senderName" text;
ALTER TABLE public.chat_messages ADD COLUMN IF NOT EXISTS text text;
ALTER TABLE public.chat_messages ADD COLUMN IF NOT EXISTS timestamp text;

-- CHATS
ALTER TABLE public.chats ADD COLUMN IF NOT EXISTS "reservationId" text;
ALTER TABLE public.chats ADD COLUMN IF NOT EXISTS text text;
ALTER TABLE public.chats ADD COLUMN IF NOT EXISTS sender text;
ALTER TABLE public.chats ADD COLUMN IF NOT EXISTS timestamp text;

-- DESIGNS
ALTER TABLE public.designs ADD COLUMN IF NOT EXISTS "reservationId" text;

-- FOODTASTE / DEPLOYMENTLOGS (lowercase — Postgres auto-lowercases table names)
ALTER TABLE public.foodtaste ADD COLUMN IF NOT EXISTS "reservationId" text;
ALTER TABLE public.deploymentlogs ADD COLUMN IF NOT EXISTS "reservationId" text;
```

### Step 5 — Create Missing Tables
Some tables from the original schema were never created (Postgres silently lowercased them):

```sql
CREATE TABLE IF NOT EXISTS public.foodtaste (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now()
);
CREATE TABLE IF NOT EXISTS public.deploymentlogs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now()
);
CREATE TABLE IF NOT EXISTS public.messages (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), created_at timestamptz DEFAULT now());
CREATE TABLE IF NOT EXISTS public.chat_messages (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), created_at timestamptz DEFAULT now());
CREATE TABLE IF NOT EXISTS public.chats (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), created_at timestamptz DEFAULT now());
CREATE TABLE IF NOT EXISTS public.designs (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), created_at timestamptz DEFAULT now());
```

---

### Step 6 — Dynamic Premade Packages Schema & Data
Added a new robust system for managing packages dynamically via Supabase, replacing hardcoded packages.

**Tables Created (`kiddie_party_package_a.sql`):**
- `premade_packages`: Stores package details like slug, name, badge, pricing_mode, price_tiers (jsonb), and occasion.
- `premade_package_items`: Stores the mapping of items included in a package, referencing the catalog (`menu_items` or `equipment_inventory`) via `item_source`, with flags for `is_free` and `is_freebie`.

**Data Inserted:**
1. **Kiddie Party Package A** (`kiddie_party_package_a.sql`): A tiered pricing package mapping 50-150 pax brackets to fixed prices.
2. **Baptismal Package** (`insert_baptismal_package.sql`): Another tiered package under the Private occasion.
3. **Christmas Party Package A** (`insert_christmas_package.sql`): A per-head dynamic package featuring the newly added "Free Choices of Food From Menu" item logic.

---

## How to Add New Users (Going Forward)

Since the app uses a custom login system (not Supabase Auth), users are added directly through the **Supabase Table Editor**:

1. Go to **Table Editor → `users`**
2. Click **Insert Row**
3. Fill in: `name`, `email`, `password` (plain text), `role` (`admin` / `staff` / `customer`)
4. Leave `id` blank — it auto-generates
5. Click **Save**

The user can immediately log in via the website login form.

---

## Known Architecture Notes

- **Custom authentication:** `doLogin()` in `app.js` queries the `public.users` table directly and checks the plain-text `password` column. It does NOT use Supabase Auth for login. This is intentional and matches the original Firebase design.
- **Realtime:** `onSnapshot()` listeners are emulated using `supabase.channel()` with `postgres_changes` events. Tables need to be added to the `supabase_realtime` publication for live updates to work (already handled in the schema SQL).
- **Table name casing:** Postgres lowercases all unquoted table names. Mixed-case names like `FoodTaste` become `foodtaste`. Always use lowercase when referencing tables in SQL.
- **camelCase columns:** Javascript field names like `createdAt`, `packageName`, `isVIP` must be quoted in SQL (e.g., `"createdAt"`). These are preserved as-is to avoid rewriting the frontend.

---

## Recent Frontend/UI Updates
While this document focuses on the database architecture, it's worth noting the following recent frontend improvements implemented to support the overall system aesthetics:
- **Drawers & Modals**: The Cart Panel and Checkout Panel have been unified into sleek, right-side sliding drawers. The Premade Package view has been updated to a modern square-format modal.
- **Dark Mode & Styling**: Removed all native emojis in favor of premium SVG icons. Added dedicated dark mode CSS for all new overlays.
- **Mobile Responsiveness**: Enforced `100vw` sizing for drawers on mobile, with micro-adjustments for very small phones (stacking text, reducing padding) and robust z-index handling to prevent overlay conflicts.
- **Data Fix**: Addressed a bug in `app.js` where the `sourcePkg.time` object (used during event frame selection) was mistakenly referenced as `timeframe`.

### Recent Logic & UI Fixes
- **Meeting Scheduling Overhaul**:
  - Restored structural integrity to `admin.js` by fixing an unclosed `openMtModal` function which caused complete JS failure (`Unexpected end of input`).
  - Added robust scrollbars to both the `Schedule Meeting` panel (`.mt-modal-content` hard-capped at 650px) and `Meeting Details` panel (`.modal-body` capped at 450px).
  - Enforced a 3-slot maximum for proposed times in both the Customer UI (`app.js`) and Admin UI (`admin.js`).
  - Synced radio buttons in the `Schedule Meeting` admin panel so that customer proposed times automatically uncheck when the admin proposes alternate times, and re-check when the admin cancels the proposal.

### Step 7 — Finalizing Missing Columns & Adapter Mapping (July 2026)
Added strict two-way mapping in `supabase_adapter.js` and corresponding database columns to prevent data loss. 

**Root Cause of Data Loss:**
Previously, any data fields not strictly defined in the `allowedKeys` array in `supabase_adapter.js` (such as `packageItems`, `city`, `rejectionReason`) were silently dumped into a JSONB object named `_firebase_extras` inside the `execution_plan` column. This was an adapter safety mechanism to prevent data deletion, but caused the fields to be unreadable by the frontend. **Note: `_firebase_extras` is purely a JSON property name and has NO connection to Firebase servers.**

**Fix Applied:**
1. Updated `supabase_adapter.js` to explicitly map the following fields (camelCase to snake_case):
   - `packageItems` → `package_items`
   - `city` → `city`
   - `rejectionReason` → `rejection_reason`
   - `activePkgId` → `active_pkg_id`
   - `contractUrl` → `contract_url`
   - and ~15 other fields.
2. Ran `fix_missing_columns.sql` to explicitly add these columns to `public.reservations`:

```sql
ALTER TABLE public.reservations ADD COLUMN IF NOT EXISTS package_items text[] DEFAULT '{}';
ALTER TABLE public.reservations ADD COLUMN IF NOT EXISTS city text;
ALTER TABLE public.reservations ADD COLUMN IF NOT EXISTS rejection_reason text;
ALTER TABLE public.reservations ADD COLUMN IF NOT EXISTS active_pkg_id text;
ALTER TABLE public.reservations ADD COLUMN IF NOT EXISTS mandatory_meeting_concluded text DEFAULT 'none';
ALTER TABLE public.reservations ADD COLUMN IF NOT EXISTS downpayment_due_date date;
ALTER TABLE public.reservations ADD COLUMN IF NOT EXISTS contract_url text;
ALTER TABLE public.reservations ADD COLUMN IF NOT EXISTS contract_finalized_at timestamptz;
ALTER TABLE public.reservations ADD COLUMN IF NOT EXISTS status_note text;
ALTER TABLE public.reservations ADD COLUMN IF NOT EXISTS venue_surcharge numeric DEFAULT 0;
ALTER TABLE public.reservations ADD COLUMN IF NOT EXISTS activity_logs jsonb DEFAULT '[]';
ALTER TABLE public.reservations ADD COLUMN IF NOT EXISTS staffing jsonb;
ALTER TABLE public.reservations ADD COLUMN IF NOT EXISTS hired_personnel jsonb;
ALTER TABLE public.reservations ADD COLUMN IF NOT EXISTS logistics_milestones jsonb;
ALTER TABLE public.reservations ADD COLUMN IF NOT EXISTS timeline_tasks jsonb;
ALTER TABLE public.reservations ADD COLUMN IF NOT EXISTS final_rundown jsonb;
ALTER TABLE public.reservations ADD COLUMN IF NOT EXISTS paid_at timestamptz;
ALTER TABLE public.reservations ADD COLUMN IF NOT EXISTS payment_status_note text;
```

### Step 8 — Adding Package Origin & Per-Pax Metrics (July 2026)
Added `package_origin` and `price_per_head` mapping support to `supabase_adapter.js` to enable origin-aware modification modes within the admin Meeting Hub.

**Fix Applied:**
1. Created and ran `add_package_origin.sql` to backfill `package_origin` based on existing `pricing_mode` properties:
```sql
ALTER TABLE public.reservations ADD COLUMN IF NOT EXISTS package_origin text;
ALTER TABLE public.reservations ADD COLUMN IF NOT EXISTS price_per_head numeric DEFAULT 0;

UPDATE public.reservations 
SET package_origin = CASE 
    WHEN pricing_mode = 'majorly_set' OR pricing_mode = 'tiered' THEN 'majorly set'
    WHEN pricing_mode = 'per_head' THEN 'dynamically set'
    ELSE 'custom'
END
WHERE package_origin IS NULL;
```
2. Mapped `packageOrigin` and `pricePerHead` within the `supabase_adapter.js` and checkout flow logic for continuous real-time sync.

### Step 9 — Meeting Room Realtime & Live Package Modification (July 2026)
Added columns and direct Supabase usage to fix failing real-time updates when an admin modified a package during a live meeting.

**Root Cause of Silent Failure:**
The `admin.js` script used the adapter's `updateDoc` to send `isModifying` and `liveDraft` states to the `meetings` collection. However, the adapter did not natively map these meeting-specific dynamically nested states, resulting in the update failing silently (`.catch(e => {})`).

**Fix Applied:**
1. Ran `add_meeting_live_state.sql` to add native snake_case columns directly to `public.meetings`:
```sql
ALTER TABLE public.meetings
  ADD COLUMN IF NOT EXISTS is_modifying  boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS live_draft    jsonb   DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS active_tab    text    DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS meeting_notes text    DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS is_live       boolean DEFAULT false;

ALTER PUBLICATION supabase_realtime ADD TABLE public.meetings;
```
2. Refactored `admin.js` (`pushMtLiveDraft`, `toggleMtModifyMode`, and the finalization flow) to bypass the adapter and use `window.supabaseClient.from('meetings').update(...)` natively.
3. Added a `parseCurrency()` helper to strip formatting (`₱` and `,`) from strings like `₱22,500` before `parseFloat()` to prevent `NaN` errors converting the draft price to `0`.
4. Rewrote `startMeetingRoomListener` in `app.js` (customer UI) to use a native `sb.channel('...').on('postgres_changes', ...)` subscription to react instantly to the admin's live draft modifications without reloading the page.

### Step 10 � Initial Reservation Fee State Tracking (July 2026)
Added tracking columns for the ?5,000 Initial Reservation fee flow directly to the meetings table. This allows the admin to lock the customer's screen and force them to pay either via PayMongo or Cash, syncing states in real-time.

**Fix Applied:**
1. Ran an ALTER TABLE to add the tracking states directly to the meetings table:
``sql
ALTER TABLE public.meetings
  ADD COLUMN IF NOT EXISTS initial_fee_status   text        DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS initial_fee_method   text        DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS initial_fee_paid_at  timestamptz DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS initial_fee_deadline timestamptz DEFAULT NULL;
``
2. Re-mapped startMeetingRoomListener inside pp.js to fetch and listen to these new columns in real-time to trigger the enderCustomerInitialFeeModal().
3. Overhauled cancelInitialFeePayment() in dmin.js to reset the initial_fee_status back to 
ull and instantly refresh the UI locally, fixing a bug where cancelling the flow resulted in a permanently disabled button state.


---

### Step 11 -- Bug Fixes Session (July 20, 2026 Evening)

The following Supabase-related bugs were identified and fixed during this session.

---

#### 11a. Mojibake Character Encoding Fix

**Files Affected:** admin.html, admin.js, app.js
**Root Cause:** UTF-8 multi-byte characters (em-dashes, peso signs, arrows, checkmarks, etc.) had been double-encoded as Windows-1252, corrupting the display of symbols throughout the application.
**Fix Applied:** A Node.js decode/re-encode script was executed that correctly identified and reversed the CP1252 -> UTF-8 double encoding for all three files. No Supabase changes required.

---

#### 11b. "Mark as Completed" Crash -- meetings Table Schema Mismatch

**Error:** Could not find the 'contractUrl' column of 'meetings' in the schema cache
**Root Cause:** The completeMeeting function in admin.js was attempting to write contractUrl and uploadedFiles directly into the meetings table row in Supabase. These columns do not exist in the meetings table -- contractUrl is a column of the reservations table only. Supabase's strict schema validation rejected the entire update.

**Affected Code (admin.js):**
  await updateDoc(doc(db, 'meetings', activeMeeting.id), {
    status: 'completed',
    contractUrl: contractUrl,       // WRONG -- does not exist in meetings
    uploadedFiles: mtUploadedUrls,  // WRONG -- does not exist in meetings
    notes: notes,
    concluded_at: new Date().toISOString()
  });

**Fix Applied:** Removed contractUrl and uploadedFiles from the meetings table payload. The contract URL continues to be saved to reservations.contract_url via the existing reservationPatch block.

**Reminder for future schema additions:** If contractUrl or uploadedFiles ever need to be stored on a meeting row, the following SQL must be run first:
  ALTER TABLE public.meetings ADD COLUMN IF NOT EXISTS contract_url text;
  ALTER TABLE public.meetings ADD COLUMN IF NOT EXISTS uploaded_files jsonb;

---

#### 11c. Critical Missing Reverse Mapping: package_origin -> packageOrigin in supabase_adapter.js

**Error Observed:** Admin meeting room always displayed "CUSTOM" for package origin regardless of the actual value stored in Supabase, even after manually correcting the database row to 'dynamically set'.
**Root Cause:** supabase_adapter.js contains two mapping functions:
- mapToDB(): converts JS camelCase to Postgres snake_case for writes (was working correctly)
- mapFromDB(): converts Postgres snake_case back to JS camelCase for reads (was MISSING the package_origin entry)

Because mapFromDB() did not include a translation for package_origin -> packageOrigin, every reservation fetched from Supabase returned the raw column name package_origin. The admin meeting room's getMtOrigin() function read activeMeetingResCache.packageOrigin (camelCase), found it undefined, and always defaulted to 'custom'.

**Fix Applied in supabase_adapter.js mapFromDB():**
  // Added missing reverse mapping:
  if (fbData.package_origin !== undefined) {
    fbData.packageOrigin = fbData.package_origin;
    delete fbData.package_origin;
  }

This fix was positioned alongside the other reverse mappings (contract_url, downpayment_due_date, etc.) in the mapFromDB block.

**Cache Buster Update:** supabase_adapter.js version bumped from v=3 to v=4 in admin.html, index.html, and customer.html to force browsers to load the corrected adapter.

---

#### 11d. Schedule Next Meeting -- Incorrect customerName and customerEmail Saved

**Error Observed:** Meetings created via the "Book Next Meeting" panel in the admin meeting room were saved to Supabase with customerName = 'Client' and customerEmail = '' instead of the actual customer's name and email.
**Root Cause:** scheduleNextMeetingInMeetingMode read res.customerName and res.customerEmail. However:
- The reservations table does not have a customerName column -- the client name is in the client_name column, mapped to res.client in JS.
- The customerEmail field is not always populated; the email is stored in client_email / res.email.
- Both lookups returned undefined, triggering the hardcoded fallback string 'Client'.

**Fix Applied in admin.js:**
Updated the new meeting document payload to use activeMeeting.customerName as the primary source (synced from the reservation when the meeting goes live) with cascading fallbacks to res.client and res.email. Added clientName and clientId to match the standard schema.

**Resulting meeting document structure:**
  {
    reservationId: activeMeeting.reservationId,
    clientName:    activeMeeting.customerName || (res ? res.client : 'Client'),
    customerName:  activeMeeting.customerName || (res ? res.client : 'Client'),
    customerEmail: activeMeeting.customerEmail || (res ? (res.customerEmail || res.email) : ''),
    clientId:      res ? (res.clientId || '') : '',
    date, time, agenda, status: 'pending', createdAt
  }

All scheduled follow-up meetings (Food Tasting, Design & Decorations, Final Program Rundown, etc.) are correctly linked to the customer's reservation via reservationId and will appear in the customer portal's meeting hub and calendar automatically.

---

#### Cache Buster Version Summary (as of July 20, 2026 Evening)

| File                | Current Version |
|---------------------|-----------------|
| admin.js            | v=8             |
| app.js              | v=14            |
| supabase_adapter.js | v=4             |

---

## Recent Changelog

### Reservation Queries Update (Customer Portal)
- **Direct Querying for Package Contents:** The customer portal's UI (via pp.js) was previously expecting `res.packageItems` to contain fully populated objects. However, the initial lightweight data query left these items incomplete, rendering as blank names. The rendering logic was updated to actively fallback and query the `reservation_items` Supabase table (which perfectly maps the CRM's rich data structure) to ensure all inclusion item names display correctly.
- **Cache Buster Update:** The pp.js file reference in customer.html has been bumped to `v=15` to reflect these fixes.

### Admin Dashboard Database Mapping Enforcement
- **package_origin Strict Evaluation:** Updated the logic in dmin.js to strictly map and enforce rules based on the package_origin column provided directly by Supabase ('custom', 'dynamically set', 'majorly set'), replacing the previous naive frontend fallback check against isCustom. This ensures frontend item restriction behaviors (graying out/locking items like equipment and decorations) are mathematically locked to the exact database schema definition of the reservation, rather than relying on frontend-specific abstractions.

### Database Stability & Real-time Equipment Management (Current)
- **NaN Data Handling:** Implemented defensive parsing (parseFloat(val) || 0) in the frontend logic for calculating Total Asset Value, which resolves critical display issues (NaN) that occurred when Supabase returned unformatted/empty pricing data for inventory items.
- **Dynamic Category Mapping:** De-hardcoded the Equipment Assets category filter buttons. The system now dynamically aggregates unique categories directly from the loaded equipment_inventory Supabase data, ensuring that any future category additions to the database will instantly appear as interactive filters on the dashboard without requiring a code push.

### Equipment Assets: Availability Tracking & Polish
- **Available Column:** Introduced a new "Available" column to the Equipment Assets table (EIM). This reads vailable_qty directly from Supabase, dynamically formatting the text gold when availability is lower than total quantity, giving admins an instant visual cue of items in use or under maintenance.
- **Badge Polish:** Stripped the broken encoded icons (ï¸) that were appearing next to the "Individual" and "Edit" badges across the equipment asset rows.
- **SQL Requirement:** Required adding an vailable_qty (INTEGER) column to the Supabase equipment_inventory table to power the new frontend display logic.
