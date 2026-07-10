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
