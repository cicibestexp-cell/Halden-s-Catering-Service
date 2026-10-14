# Addressing Supabase Security Issues — SMARTSERVE

> **Date:** August 17, 2026  
> **Status:** Brainstorm / Planning Phase  
> **Assessed By:** Antigravity (AI Pair Programmer)

---

## What the Problem Is

Every table marked **UNRESTRICTED** in the Supabase dashboard has **Row Level Security (RLS) disabled**.

Since the Supabase **anon key** is embedded directly in the frontend JavaScript files (`admin.js` and `app.js`), any person who opens browser DevTools → Sources can copy that key. Combined with the public Supabase project URL, they can then perform unrestricted read, write, update, and **delete** operations against all unprotected tables.

### Currently Exposed Tables (RLS Disabled)

| Table | Risk |
|---|---|
| `meetings` | Contains customer names, emails, meeting notes, shared documents |
| `guests` | Personal guest information (PII) |
| `equipment_flags` | Equipment operational data |
| `equipment_inventory` | Inventory records |
| `equipment_maintenance` | Maintenance logs |
| `equipment_resupply` | Supply chain records |
| `execution_activities` | Event execution data |
| `foodtaste` | Food tasting session data |
| `issueresolutions` | Internal issue records |
| `maintenancetasks` | Task assignment data |
| `purchaseorders` | Financial purchase data |

### Tables With RLS Already Enabled (Safe)

- `menu_items`
- `messages`
- `premade_package_items`
- `premade_packages`
- `recipe_ingredients`

---

## Root Cause Analysis

There are three compounding issues:

### 1. RLS Is Disabled
Without RLS, Supabase applies no access control at the row or table level. Any request with the anon key is treated as fully authorized.

### 2. Anon Key Is Exposed in Frontend Code
The `supabaseUrl` and `supabaseAnonKey` are hardcoded in the client-side JS. This is unavoidable in a pure frontend architecture — but it means the anon key **must be treated as public** and RLS becomes the only defense layer.

### 3. No Auth Bridging Between Firebase and Supabase
The system uses **Firebase** for authentication (login/logout, user sessions) but **Supabase** for data storage. Supabase has no knowledge of who is logged in via Firebase. This means RLS policies cannot currently say *"only the logged-in admin can write"* — because Supabase doesn't know who the admin is.

---

## Difficulty Rating: 6 / 10

| Factor | Complexity |
|---|---|
| Writing RLS policies (SQL) | Low — straightforward SQL `CREATE POLICY` statements |
| Not breaking existing app functionality | Medium — ~50+ Supabase calls across `admin.js` and `app.js` must still work |
| Firebase ↔ Supabase auth bridging | Medium-High — requires JWT forwarding or a shared auth token |
| Removing anon key from frontend | High — requires a backend proxy layer (server-side API) |
| Full role-based access control (RBAC) | High — requires redesigning how admin vs. customer vs. public access works |

---

## Two Tiers of Remediation

### Tier 1 — Quick Lockdown *(2–3 days, ~4/10 difficulty)*

**What it does:** Enables RLS on all exposed tables with policies that restrict the most dangerous operations.

**Approach:**
- Enable RLS on all `UNRESTRICTED` tables
- Write `SELECT` policies allowing anon to read only what's needed (e.g., public-facing data)
- Write `INSERT/UPDATE/DELETE` policies that are restricted (e.g., require a known session header, or block entirely for anon)
- Use Supabase's **service role key** server-side only (or in a trusted admin context) for full-access operations

**Limitations:**  
Does not fully solve the problem — anon key is still exposed. But significantly reduces attack surface. Malicious actors can no longer wipe tables or read all customer PII with the anon key alone.

**Priority tables to lock first:**
1. `meetings` (most sensitive — PII + documents)
2. `guests` (personal information)
3. `purchaseorders` (financial data)

---

### Tier 2 — Proper Security Architecture *(1–2 weeks, ~7/10 difficulty)*

**What it does:** Eliminates the anon key risk entirely by routing all Supabase writes through a secure backend.

**Approach:**
- Set up a lightweight **backend proxy** (Node.js/Express or Supabase Edge Functions)
- Frontend calls your own API endpoints — never Supabase directly
- Backend uses the **service role key** (never exposed to browser) to perform Supabase operations
- Forward Firebase JWT tokens to Supabase via custom claims for identity-aware RLS
- Implement true RBAC:
  - **Customers** → can only read/write their own reservation data
  - **Admin** → full access via verified Firebase token
  - **Public/Anon** → read-only for non-sensitive data only

**Scope:**  
All ~50+ Supabase calls in `admin.js` and `app.js` would need to be redirected to your API proxy. This is significant but manageable with a structured approach.

---

## Recommended Action Plan (One Week)

| Day | Task |
|---|---|
| Day 1 | Audit all Supabase calls in `admin.js` and `app.js` — map which tables each call touches and what role (admin/customer/public) it requires |
| Day 2 | Enable RLS on all exposed tables; write initial `SELECT`-only policies for anon |
| Day 3 | Write `INSERT/UPDATE/DELETE` policies using a custom claim or header strategy |
| Day 4 | Test all existing app flows against the new policies — fix any breakage |
| Day 5 | Buffer day — resolve edge cases, re-test customer portal and admin panel end-to-end |

> This covers **Tier 1** within a week. **Tier 2** would be a follow-up sprint.

---

## Most Critical Tables to Address First

1. **`meetings`** — Contains customer emails, names, uploaded documents, design notes, shared files
2. **`guests`** — Guest PII
3. **`purchaseorders`** — Financial records
4. **`issueresolutions`** — Internal operational data

---

## Notes

- The Supabase **anon key** is by design a "public" key — Supabase expects it to be in the frontend. The **service role key** must never be in frontend code.
- Even after enabling RLS, always assume the anon key is compromised and design policies accordingly.
- Supabase Edge Functions are a good middle-ground if a full backend is too much overhead — they run server-side and can use the service role key.
- Firebase Authentication JWT can be verified inside Supabase Edge Functions, enabling proper cross-platform identity checks.
