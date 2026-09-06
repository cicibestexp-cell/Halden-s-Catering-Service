# Architecture Refactor Plan: SMARTSERVE

This document outlines a phased approach to refactoring the frontend architecture for the SMARTSERVE application. The goal is to unify the shared logic between the Admin and Customer portals, ensuring that updates to one side automatically and flawlessly reflect on the other without breaking UI themes or encountering missing data.

## The Core Issues
1. **Scope and File Segregation:** `app.js` is intended as a shared library but is tightly coupled with customer-specific logic. Meanwhile, `admin.js` contains shared helpers (like `escHtml`) and constants (`ALLOC_RULES`) that the customer portal cannot access.
2. **Data Fetching Disparities:** The Admin side fetches a robust, deeply joined reservation payload, while the Customer side uses a lightweight fetch. This results in the Customer UI crashing or displaying blank data when rendering templates copied from the Admin side.
3. **Hardcoded Theming:** Admin templates use hardcoded CSS variables (like `var(--cream)`) meant for dark mode. When pasted into the light-mode Customer portal, text becomes invisible (white-on-white).

---

## Phased Rollout Plan

To mitigate risk, the refactor should be executed incrementally rather than as an all-at-once rewrite.

### Phase 1: The Safest Step (Helpers & Constants)
**Goal:** Centralize shared utility functions and constants to prevent "function not found" errors when sharing UI code.
- Create a new `utils.js` file.
- Move shared static dictionaries (e.g., `ALLOC_RULES`) out of `admin.js` and `app.js` into `utils.js`.
- Move generic formatting functions (e.g., `safeNum()`, `escHtml()`, currency formatters) into `utils.js`.
- Include `<script src="utils.js"></script>` at the top of all HTML files (`admin.html`, `customer.html`, `staff.html`).

### Phase 2: CSS Semantic Classes
**Goal:** Make UI components theme-agnostic so they render perfectly in both Dark Mode (Admin) and Light Mode (Customer).
- Stop injecting hardcoded CSS variables (e.g., `style="color: var(--cream)"`) in JavaScript template literals.
- Introduce semantic CSS classes like `.text-highlight`, `.text-dim`, and `.bg-panel`.
- Define these classes in `admin.css` for dark mode (e.g., `.text-highlight { color: #faf7f2; }`).
- Define the exact same classes in `style.css` for the customer light mode (e.g., `.text-highlight { color: #2c1a0e; }`).
- *Implementation Strategy:* Apply this gradually to new features or when fixing specific UI bugs, leaving legacy inline styles alone until they need to be touched.

### Phase 3: Unifying Data Fetching
**Goal:** Guarantee that both portals receive the exact same data structure when rendering a reservation.
- Create a unified `fetchFullReservationDetails(reservationId)` function in `supabase_adapter.js`.
- This function will pull the comprehensive payload (including joined `packageItems`, financial statuses, and operational requirements).
- *Implementation Strategy:* Test this new fetch on the Customer portal first. Once verified, migrate the Admin portal's heavy `loadData()` logic to utilize this unified adapter function.

### Phase 4: True UI Componentization
**Goal:** Eliminate massive duplicated HTML string templates across `app.js` and `admin.js`.
- Extract UI sections into reusable render functions. For example: `renderFinancialPanel(reservationData)`.
- Both the Admin and Customer portals will call these shared functions instead of maintaining their own copies of the HTML.
- *Implementation Strategy:* Build new panels as components first. Refactor older panels (like the main dashboard grids) one-by-one as they require updates.

---

## Moving Forward
By keeping this roadmap in mind, every new feature, bug fix, or UI tweak will naturally push the codebase toward a cleaner, more robust architecture without requiring the system to be taken offline for a massive rewrite.
