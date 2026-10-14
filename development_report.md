# SmartServe Development Report

## Feature Additions and Fixes

### 1. Three-Tier Pricing System Implementation

**Overview:**
The pricing engine has been upgraded to properly support three distinct pricing types: item-based (Type 1), per-pax (Type 2), and tiered/fixed (Type 3).

**Changes Made:**
*   **Bug Fix (Type 2):** Fixed `finalizePackageInternal()` in `app.js` which was improperly recalculating pre-made package costs based purely on items instead of honoring the package's `pricePerHead`. The cart, checkout, and database now inherit the exact total shown in the custom builder.
*   **New Feature (Type 3 - Majorly Set):** Introduced the "Tiered" pricing model. 
    *   Added "Halden's Grand Fiesta" to demonstrate fixed pricing by pax bracket (e.g. 50 guests = ₱50,000).
    *   Modified `openPkgModal` to detect tiered packages and display a dropdown tier selector in `index.html`.
    *   Ensured that adding or removing items in the custom builder does not change the total price for tiered packages.
*   **UI Enhancements:** The Cart Drawer now displays a `pricing-mode-tag` badge indicating whether an item is a Custom Build, Base Package, or Fixed Tier.
*   **Data Persistence:** The specific `pricingMode` and `selectedTier` data are now successfully passed to Firestore upon reservation submission.
*   **Catalog Fix:** Fixed a rendering crash in `renderPkgs()` that prevented the new tiered package from displaying due to a missing `pricePerHead` property. Tiered packages now display a "starting at" price.

### 2. UI and Styling Updates (July 1, 2026)

**Overview:**
Several minor UI enhancements were implemented to unify typography, streamline navigation, and clean up the header interface.

**Changes Made:**
*   **Hero Typography & Layout:** The "Every Event, Perfectly Served" hero title was fully unified under the elegant cursive font (Cormorant Garamond). The invisible spacer below the "Premium Catering Services" badge was tightened, and the title was separated cleanly into two lines.
*   **Terminology Update:** Universally rebranded the "Fun" and "Entertainment" labels to "Add-ons" in the full catalog filters, custom builder, and navigation dropdowns.
*   **Dropdown Navigation:** Modified the catalog navigation dropdown and mobile menu links so they correctly direct users to the Full Catalog section (`#full-catalog`) instead of the custom builder.
*   **Header Settings Dash Button:** Replaced the disparate Light/Dark mode and Login/Profile buttons in the navigation header with a clean, unified "Settings" (gear icon) dropdown menu to reduce header clutter.

### 3. Light / Dark Mode Toggle (July 4, 2026)

**Overview:**
Implemented a fully functional light/dark mode system for `index.html`. Default mode is dark. Users can toggle via the existing Settings dropdown in the nav.

**Changes Made:**
- **`style.css`:** Added `[data-theme="dark"]` and `[data-theme="light"]` CSS blocks covering all major UI sections: nav, body, sections, cards, search inputs, custom package panel, AI chat window, cart drawer, auth drawer, filter buttons, scrollbar, review cards, package modals, checkout drawer, customer dashboard, and footer. Replaced hardcoded dark colors in the base `nav`, `nav-logo`, `nav-link`, `dropdown-menu`, and `dropdown-item` rules with CSS variable fallbacks (`--nav-bg`, `--nav-text`, `--nav-link-color`, `--nav-hover-bg`, `--nav-dropdown-bg`, `--nav-dropdown-color`) so theme overrides work correctly.
- **`style.css`:** Added new CSS classes `.nav-settings-btn`, `.nav-avatar-icon`, `.nav-settings-menu`, `.nav-zoom-controls`, `.nav-zoom-btn`, `.nav-zoom-label` to replace hardcoded inline dark styles on the nav Settings dropdown button.
- **`style.css` (Hero Fix):** Extracted hardcoded dark background and text colors from `#hero`, `.hero-content`, `.hero-title`, `.hero-sub`, `.hero-arrow`, and `.hero-hud` into CSS variables (`--hero-bg`, `--hero-content-bg`, etc.) and defined them in both the `[data-theme="dark"]` and `[data-theme="light"]` blocks. This ensures the 100vh hero section correctly switches to the light cream palette when toggled.
- **`style.css` (Buttons Fix):** Updated hardcoded colors in `.btn-primary` (View Packages), `.btn-outline` (Custom Package), `.cart-fab` (Cart), and `.desk-ai-fab` (AI Planner) to use CSS variables. Configured the light mode variables to match the warm muted gold/cream look from the reference screenshot. Also fixed a global `.btn-primary` rule at the bottom of the file that was overriding the text color with hardcoded `#000`.
- **`index.html`:** Fixed the FOUC-prevention inline script to default to `'dark'` (was `'light'`), aligning it with `theme.js`.
- **`index.html`:** Updated the nav Settings dropdown button HTML to use the new CSS classes instead of inline `style` attributes.
- **`theme.js`:** No changes needed — already defaults to `'dark'` and correctly calls `toggleTheme()`.

### 4. Custom Package Area Cleanup & Validation (July 4, 2026)

**Changes Made:**
- **`app.js` (Catalog):** Removed `Same-Day Edit Video` (ph3) item from the catalog.
- **`index.html` + `app.js` (Data Panel):** Charts panel (Occasion/Theme/City/Description insights) now closes instantly when the user clicks anywhere on the panel. Added "✕ Click anywhere here to close" hint text at the bottom of the panel. Added `closeDataPanel()` function for instant close (vs. the existing `closeDataPanelDelay()` which had a 100ms delay for blur events).
- **`app.js` (Validation — Guest Count):** Added pax validation in `finalizePackage()`: minimum 10 guests (error: "Guest count too few..."), maximum 150 guests (error: "The business cannot cater to a guest count above 150...").
- **`app.js` (Validation — VIP Count):** Added VIP count validation: max 20 VIPs (error: "VIPs cannot be above 20...").
- **`app.js` (Validation — Event Date):** Added full date validation: rejects past dates, rejects dates < 1.5 weeks from today (error: "too soon, requires 2 weeks preparation"), rejects dates > 2 months from today (error: "far too long into the future").
- **`app.js` (Validation — Timeframe):** Added timeframe validation: minimum 2-hour event duration (error: "time frame is a little too short for an event").
- **`app.js` (Validation — Firestore Date/Timeframe Conflicts):** On finalize, queries Firestore for confirmed reservations on the same date. Rejects if 3+ exist (fully booked date). Checks hour-boundary overlap with existing timeframes — rejects if 2+ confirmed reservations have overlapping timeframes on the same date (error message includes the hours and date).
- **`app.js` (Validation — Meeting Time):** Rewrote `addMeetingTimeSlot()` with validation: rejects past dates, rejects dates outside the current Mon–Sun week (error: "meeting schedule needs to be within this week"), rejects meeting timeframes shorter than 2 hours.

### 5. Layout & Presentation Polish (July 4, 2026)

**Overview:**
Minor layout adjustments to ensure content alignment and premium presentation.

**Changes Made:**
- **`auth-prompt-styles.css`:** Centered the `.hero-divider` (the golden line separating the main title and sub-text) by applying `margin: 12px auto`.
- **`style.css`:** Enhanced the light mode hero background image. Appended a pseudo-element (`::after`) over `.hero-slides` specifically for `[data-theme="light"]` mode. It applies a subtle golden/yellow wash (using low opacity) to harmonize the background photography with the bright interface buttons.
- **`index.html`:** Patched the PayMongo integration modal placeholder by appending `display: none;` to its inline styles, preventing the payment interface from improperly leaking out into the static flow of the page at the very bottom.

### 6. Customer Dashboard Migration (July 4, 2026)

**Overview:**
Executed a major architectural migration to decouple the customer dashboard from the primary marketing site. The dashboard is no longer a static overlay nested inside `index.html`.

**Changes Made:**
- **`customer.html` Creation:** Fully populated `customer.html` as a standalone page. Extracted the entire `#dash-overlay` HTML block out of `index.html` and placed it here. Added necessary script tags, stylesheet links (including `auth-prompt-styles.css` and Leaflet maps), and initialized the `CUSTOMER_PAGE = true` flag.
- **Authentication Guard:** Implemented a redirection rule at the top of `customer.html`. Using Firebase `onAuthStateChanged`, the page will forcefully eject unauthenticated visitors back to `index.html`.
- **`index.html` Cleanup:** Physically deleted over 500 lines of dashboard HTML (`#dash-overlay` and its contents) from `index.html`. This greatly reduces the payload of the primary marketing landing page.
- **Navigation Flow Redirection:** 
    - The "Dashboard" link in the header dropdown now executes `window.location.href = 'customer.html'`.
    - The "My Profile" button in the mobile slide-out menu redirects to `customer.html`.
- **`app.js` App State Management:** 
    - Updated `openProfile()` to trigger a hard redirect to `customer.html` rather than simply adding a CSS class. 
    - Updated `closeProfile()` to redirect back to `index.html`. 
    - Updated `setLoggedIn` to intercept successful login workflows occurring on `index.html` and transition the user immediately to `customer.html`.
    - Modified the `DOMContentLoaded` script loader. If it detects `window.CUSTOMER_PAGE = true`, it actively skips instantiating the marketing logic (e.g., hero sliders, public catalog rendering). If it detects a logged-in session on `index.html` (meaning the user successfully authenticated previously), it performs an immediate seamless redirect to their dashboard, bypassing the splash screen entirely.

---
*End of Report*

### 7. Meeting Hub Overhaul (Current)

**Overview:**
Fixed SQL errors related to meeting scheduling and overhauled the meeting proposal flow. The new flow allows admins to propose alternative meeting times if the customer's provided times do not work.

**Changes Made:**
- **SQL Schema Update:** Provided SQL statements to add missing columns (genda, date, 	ime, 	imeEnd, easoning, 	imeType, clientId, updatedAt, oomId, dminProposedTimes, etc.) to the meetings table.
- **Admin Modal Updates (dmin.html & dmin.js):**
  - Added a dynamic client phone number display to the meeting modal header by querying the users table based on the customer's email.
  - Replaced the single "custom time" scheduling option with a comprehensive "Propose Meeting Times" UI.
  - Implemented dual-path scheduling logic: choosing a customer's time immediately schedules the meeting, whereas proposing an admin time sets the status to  waiting_customer.
- **Customer UI Updates ( pp.js):**
  - Updated enderCustomerMeetings to robustly query by user email.
  - Introduced a prominent "ACTION REQUIRED" time-picker card for  waiting_customer meetings.
  - Added a live countdown timer showing the 24-hour expiration window.
  - Implemented client-side logic to automatically cancel the reservation and expire the meeting if the customer fails to select a time within the 24-hour window.
- **Weekly Meetings Rendering:** Updated enderWeeklyMeetings in  dmin.js to visibly distinguish  waiting_customer items with distinct colors and badging.

### 8. Smart Admin Notifications & Calendar Enhancements

**Overview:**
Introduced a "Smart Admin Notifications" system and patched customer calendar rendering logic to sync identically with the admin dashboard calendar.

**Changes Made:**
- **Notification Framework (`admin.html`, `admin.css`, `admin.js`):** Built a lightweight transient notification system using a temporary `adminAlert` property injected into the `meetings` document. Added green (success) and red (error) banners to the admin dashboard.
- **Auto-Hiding Notifications:** Connected the new alert system to the admin navigation (`showSection()`). Any displayed alerts are automatically marked as "seen" and cleared from the UI the moment the admin navigates away from the Dashboard panel.
- **Customer Meeting Confirmations (`app.js`):** When a customer successfully confirms an admin-proposed meeting time, `app.js` updates the meeting status and attaches a success alert (`adminAlert: { type: 'success' }`), triggering the green banner for the admin.
- **Auto-Cancellation Alerts (`app.js`):** If the 24-hour window expires, `app.js` attaches an error alert (`adminAlert: { type: 'error' }`), triggering the red cancellation banner for the admin.
- **Customer Calendar Fix (`app.js`):** Resolved an issue where meetings were dropped by `FullCalendar` due to non-ISO timestamp strings. Calendar now correctly parses meetings as all-day events.
- **Approved Reservations Fix (`app.js`):** The customer's `Event Calendar` now exclusively renders `status: 'confirmed'` reservations (matching the exact status structure utilized by the admin `Approved Event Calendar`).

### 9. Modify Cancelled Reservation Feature

**Overview:**
Added a quality-of-life feature allowing customers to quickly re-use or modify a cancelled or rejected reservation, porting all details directly into the custom package builder without affecting the original cancelled record.

**Changes Made:**
- **Customer Dashboard UI (`app.js`):** Added a styled gold "✏ Modify Reservation" button exclusively to cards representing `cancelled` or `rejected` reservations. Button uses `data-res-id` attribute (no inline JSON) to avoid HTML quoting issues.
- **Reservation Cache (`app.js`):** `renderProfileReservations()` now populates `window._profileResCache` — a lookup map of all reservation objects keyed by their Firestore document ID — so the full object is always available for the button handler.
- **Delegated Click Handler (`app.js`):** A single `document.addEventListener('click')` handler intercepts clicks on `.btn-modify-res` buttons, looks up the full reservation from the cache, serializes it to `sessionStorage` (`halden_modify_res`), and redirects to `index.html`.
- **`applyModifyResData(res)` function (`app.js`):** Comprehensive restore function that:
  - Uses `window.smartAssign()` to correctly handle SELECT fields (occasion, theme, city) including the "Others" custom text path.
  - Parses date strings in both "Jul 31, 2026" and ISO formats.
  - Fills split timeframe inputs (`cpkg-timeframe-start` / `cpkg-timeframe-end`).
  - Restores VIP checkbox, count, and service type, and calls `toggleVIPFields()`.
  - Loads `proposedMeetingTimes` into the global `preferredMeetingTimes` array and calls `renderMeetingTimes()`.
  - Reconstructs `customPkgItems` by matching saved item names against the full `CAT` catalog. Falls back gracefully if an item is no longer in the catalog.
  - Calls `renderCustomPkg()`, `renderCat()`, and `updateCatTotals()` to refresh the builder UI.
  - Smooth-scrolls the user to the `#cpkg-panel` custom package area.
- **Async-Safe CAT Polling (`app.js`):** On `DOMContentLoaded`, if restore data is present, the code polls `CAT.length > 10` at 100ms intervals (up to 6 seconds) before calling `applyModifyResData()`, ensuring the catalog is loaded from Supabase before items are matched.

### 10. Origin-Aware Modify Mode in Meetings (July 14, 2026)

**Overview:**
Introduced per-package origin modification rules within the admin Meeting Hub, dynamically grouping auto-allocated system additions and ensuring strict business logic on package changes.

**Changes Made:**
- **Origin-Aware Rules (`admin.js`):** 
  - Majorly Set packages now lock the guest count input and total price, only allowing admins to modify unlimited drinks and freebie food items.
  - Dynamically Set packages (per_head) allow pax modification that recalculates price using the package's stored `pricePerHead` value, while still locking item additions except drinks/freebies.
  - Custom packages remain fully dynamic and editable.
- **Reservation Submission (`app.js`):** The client checkout flow now captures and saves the exact `pricePerHead` and calculates the `packageOrigin` (majorly set, dynamically set, custom) to the database at the time of reservation.
- **System Additions UI (`admin.js`):** In the Modify Package interface, auto-allocated system additions (equipment assigned based on guest count) have been grouped cleanly into a dedicated "⚙ System Additions" section to distinguish them from user-selected items.
- **Orphaned Meetings Fix (`admin.js`):** The weekly meetings list now properly filters out orphaned meetings whose parent reservation was entirely deleted from the database.

### 11. Initial Fee Delay Feature & UI Fix (July 2026)

**Overview:**
Fixed a UI contrast issue on the customer-facing initial fee modal and introduced a delay mechanism allowing customers 24 hours to secure payment without blocking contract finalization.

**Changes Made:**
- **UI Contrast Fix (`app.js`):** Adjusted the text color of the "Pay in Person (Cash)" button within `renderCustomerInitialFeeModal` to `#000` (black) to ensure readability against the solid gold background.
- **New Delay Action (`app.js`):** Added a new "I can't pay right now" button to the initial fee modal.
- **Delay Logic (`app.js`):** Implemented `postponeInitialFee()` which connects to Supabase and updates the meeting document's `initial_fee_status` to `declined_24h` and establishes a 24-hour `initial_fee_deadline`. This immediately dismisses the modal (as governed by existing logic) and allows the customer to finalize the meeting while keeping the payment pending for 24 hours.

### 12. Point of Sale (POS) Modal for Initial Fee (July 2026)

**Overview:**
Introduced a dynamic Point of Sale (POS) modal in the admin Meeting Hub for processing in-person cash payments for the Initial Reservation Fee. This system enforces strict accounting by calculating exact change and logging the transaction details directly to the database.

**Changes Made:**
- **Database Schema Updates:** Created `add_pos_columns.sql` to append `initial_fee_received`, `initial_fee_change`, and `initial_fee_received_by` columns to the `public.meetings` table in Supabase.
- **Admin POS UI (`admin.html`):** Added a new `#admin-pos-modal` capturing the exact cash amount received, dynamically calculating the change, and displaying error warnings for insufficient funds. Also added `#mt-billing-pos-summary` to display the digital receipt in the right-side billing panel.
- **POS Logic & Validation (`admin.js`):** 
  - `calculatePosChange()` instantly calculates the change and blocks confirmation if the received amount is less than ₱5,000.
  - `processPosPayment()` commits the transaction, identifying the active admin via session storage, and updates both the Supabase `meetings` tracking table and the Firestore `reservations` doc.
- **Transaction Receipt (`admin.js`):** `updateBillingUI()` dynamically injects an itemized receipt (Amount Due, Cash Received, Change, Method, Receiver, Timestamp) into the billing panel when the fee is successfully marked as paid in cash.

### 13. Forgot Password Overhaul with EmailJS OTP (July 2026)

**Overview:**
Rebuilt the "Forgot Password" feature to bypass Firebase Auth and use EmailJS to deliver an OTP verification code. This aligns with the system's custom authentication which queries the Supabase `users` table directly.

**Changes Made:**
- **UI Update (`index.html`):** Split `#panel-forgot` into a two-step flow. Step 1 collects the email address. Step 2 (hidden initially) collects the 6-digit OTP and the new password.
- **Logic & Flow (`app.js`):** 
  - Overhauled `doForgotPassword()` to query the `users` collection for the email. If found, it generates a 6-digit OTP and dispatches it via EmailJS, then reveals Step 2.
  - Implemented `verifyForgotPasswordOtp()` to validate the OTP against the generated code and write the new password directly to the user's document in the `users` table via `window.firebaseFns.updateDoc()`.
  - Added reset states in `switchAuthTab()` to ensure the forgot password panel resets back to Step 1 if the user navigates away.

### 14. Dynamic Meeting Agendas in Admin Meeting Room (July 2026)

**Overview:**
Added the ability for admins to dynamically add and remove agendas during an active meeting session directly from the Meeting Room interface.

**Changes Made:**
- **UI (`admin.html`):**
  - Added an `+ Add Agenda` dropdown (`#mt-add-agenda-select`) inside the meeting room navigation tab bar.
  - Dynamically added tabs display a dismissible `✕` button next to their label.
  - Created a custom `#agenda-remove-overlay` confirmation modal matching the system's dark-glass premium design (similar to the `error-overlay` in `index.html`), with animated slide-in and out transitions.
- **Logic (`admin.js`):**
  - `dynamicAgendas[]` array tracks which agendas were added on the fly.
  - `AGENDA_OPTIONS` defines all available agendas (food, design, rundown, logistics, payment) with their display labels and keyword matchers.
  - `updateDynamicAgendaDropdown()` repopulates the dropdown, automatically excluding agendas already in the meeting's original agenda string or already dynamically added.
  - `addDynamicAgenda(agendaId)` shows the tab, injects the `✕` button, initializes the panel (calls its respective render function), and navigates to the new tab.
  - `confirmRemoveDynamicAgenda(agendaId)` opens the confirmation modal with the specific agenda name.
  - `removeDynamicAgenda(agendaId)` clears all inputs inside the panel (so no data is accidentally saved), hides the tab, and resets the dropdown.
  - `exitMeetingMode()` patched to auto-clean all dynamic tabs and hide the dropdown on exit.

### 15. Reservation Details Handling Upgrade (Current)

**Overview:**
Upgraded the Reservation Details Handling in the admin portal to provide a comprehensive dashboard view, unified the modification panel to use dropdowns and map interfaces, and fixed data syncing with Supabase.

**Changes Made:**
- **Food Tasting Sync:** Fixed the read and write operations for Food Tasting results to bypass the Firebase adapter and directly query the lowercase `foodtaste` table in Supabase via native queries, resolving the issue where meeting room data wasn't appearing in the details tab.
- **Main Dashboard Views:** Enriched the view-mode detail grid to show the Package Name, Package Category (Majorly Set, Dynamically Set, Custom), Venue City, and Current Stage (Ops Status). VIP count was also extracted into its own dedicated row.
- **Modify Reservation Panel Overhaul:** 
  - Transformed the Event Type and Theme inputs into dropdown selectors matching the custom builder (with an "Others" text fallback).
  - Converted the Venue Location to a locked dropdown containing all 16 NCR cities.
  - Upgraded Venue Name to a read-only input that triggers a Leaflet GPS map modal (`openResdMapModal`) identical to the Meeting Room interface.
  - Added strict HTML date constraints (minimum today, maximum 2 months out) to the modification date picker.
- **Ops Status Consolidation:** Removed the standalone "Update Ops Status" button and integrated the Ops Status dropdown directly into the Financial & Status section of the Modify Reservation Details panel.

### 16. UI Polish & Equipment Assets Enhancements (Current)

**Overview:**
Fixed video meeting interface aesthetics across both admin and customer portals, and improved the reliability and dynamic nature of the Equipment Assets tracking.

**Changes Made:**
- **LiveKit Video Interface Fixes (`admin.js`, `admin.html`, `app.js`, `customer.html`):**
  - Removed garbled text and broken emojis (e.g., `dYZT`, `dY"`) from admin video controls and empty state messages.
  - Removed HTML emojis from customer-facing video controls to adhere to strict professional branding guidelines.
  - Enforced a uniform `16:9` aspect ratio for customer-facing camera tiles in `style.css` (`.vcall-video-box`) to prevent the camera from appearing disproportionately small compared to the admin view.
  - **Dynamic User Identities:** Overhauled identity generation and parsing so video tiles extract and display the actual authenticated user's name from `window.currentUser` instead of defaulting to generic "Admin" or "Customer".
  - **Room Code Declutter:** Removed the unnecessary `VC-XXXX` video room code badge from both the admin (`mt-mode-room-id-display`) and customer (`c-mt-room-id`) UI headers to simplify the interface. Added safe null checks to prevent JS crashes on missing elements.
- **Equipment Assets Fixes (`admin.js`, `admin.html`):**
  - **Total Asset Value NaN Fix:** Identified that missing prices or undefined values in the Supabase `equipment_inventory` table caused `EIM_ASSETS.reduce` to output `NaN`. Wrapped the `reduce` logic with `parseFloat(val) || 0` fallbacks, successfully restoring the total monetary calculation for all equipment.
  - **Dynamic Category Filters:** Eliminated hardcoded category filter buttons (Furniture, Tableware, etc.) in the Equipment Assets tab. Replaced them with `updateEIMCategoryFilters()`, a new function that dynamically generates filter buttons by extracting the unique list of categories directly from the live Supabase inventory data.

### Equipment Assets: Availability Tracking & Polish
- **Available Column:** Introduced a new "Available" column to the Equipment Assets table (EIM). This reads vailable_qty directly from Supabase, dynamically formatting the text gold when availability is lower than total quantity, giving admins an instant visual cue of items in use or under maintenance.
- **Badge Polish:** Stripped the broken encoded icons (ï¸) that were appearing next to the "Individual" and "Edit" badges across the equipment asset rows.
- **SQL Requirement:** Required adding an vailable_qty (INTEGER) column to the Supabase equipment_inventory table to power the new frontend display logic.
