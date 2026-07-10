# SmartServe — Comprehensive System Analysis Report

> **Project Name:** SmartServe (Publicly branded as "Hal'Serve" / "Halden's Event Management & Catering Service")  
> **Project Location:** `c:\Users\USER\Desktop\SMARTSERVE`  
> **Report Date:** June 30, 2026  
> **Report Scope:** Full codebase, all portals, architecture, data flows, APIs, and integrations.

additional but important notes: this is how things will go, for fixing/debugging, you just need to fix the code the way I tell you to, but for adding features or removing features or overhauling features entirely, I want you to make a report for each change and compile it into one .md file called development_report.md

---

## Table of Contents

1. [System Overview](#1-system-overview)
2. [File & Directory Structure](#2-file--directory-structure)
3. [Technology Stack](#3-technology-stack)
4. [Portal 1: Public Website (`index.html` / `app.js`)](#4-portal-1-public-website)
5. [Portal 2: Administrator Dashboard (`admin.html` / `admin.js`)](#5-portal-2-administrator-dashboard)
6. [Portal 3: Staff Dashboard (`staff.html` / `staff.js`)](#6-portal-3-staff-dashboard)
7. [Shared Utilities & Stylesheets](#7-shared-utilities--stylesheets)
8. [Backend / Serverless API Layer (`api/`)](#8-backend--serverless-api-layer)
9. [Firebase Data Model (Firestore Collections)](#9-firebase-data-model)
10. [Authentication System](#10-authentication-system)
11. [Catalog & Package Data](#11-catalog--package-data)
12. [End-to-End Reservation Flow](#12-end-to-end-reservation-flow)
13. [Meeting Mode & Real-Time Collaboration](#13-meeting-mode--real-time-collaboration)
14. [Equipment Inventory System](#14-equipment-inventory-system)
15. [Execution Day System](#15-execution-day-system)
16. [Key Non-Functional Details](#16-key-non-functional-details)
17. [Deployment & Environment](#17-deployment--environment)

---

## 1. System Overview

**SmartServe** is a full-stack, cloud-connected web application designed for **Halden's Event Management and Catering Service** — a Philippine-based catering and events business operating within the National Capital Region (NCR). The system was developed as an academic/professional capstone project and is production-deployable on Vercel.

The platform handles the **complete lifecycle of a catering event reservation**, from initial customer browsing all the way through contract finalization, execution day logistics, and post-event settlement/billing.

### Four Core Modules (Portals)

| Portal | Entry File | Audience | Description |
|--------|-----------|----------|-------------|
| **Public Website** | `index.html` | Customers / General Public | Browse services, build packages, book events, interact with AI planner |
| **Admin Dashboard** | `admin.html` | Super Admins | Full reservation management, meetings, staff, equipment, analytics |
| **Staff Dashboard** | `staff.html` | Operational Staff | View assignments, execute day tasks, log performance |
| **Customer Portal** | `customer.html` | Logged-In Customers | Track reservations, attend meetings, view execution updates |

---

## 2. File & Directory Structure

```
SMARTSERVE/
│
├── index.html                  # Public-facing landing page (1818 lines)
├── app.js                      # All frontend logic for index.html
├── style.css                   # Complete stylesheet for index.html
├── auth-prompt-styles.css      # Styles for the welcome modal overlay (3KB)
│
├── admin.html                  # Administrator dashboard UI (5283 lines, 290KB)
├── admin.js                    # All admin portal logic (19119 lines, 953KB) — the largest file
├── admin.css                   # Stylesheet shared by admin.html and staff.html (99KB)
│
├── staff.html                  # Staff dashboard UI (212 lines, 10KB)
├── staff.js                    # Staff portal logic (62KB)
│
├── theme.js                    # Universal light/dark theme toggle (41 lines, shared across all pages)
│
├── api/
│   ├── chat.js                 # Vercel serverless function — proxies OpenRouter AI chat API
│   └── paymongo.js             # Vercel serverless function — creates PayMongo checkout sessions
│
├── REQUIREMENTS.md             # System functional/non-functional requirements spec (220 lines)
├── TECHNOLOGY_RATIONALE.md     # Justification for each technology choice (218 lines)
│
├── all_reservations.html       # Standalone test/utility page for viewing reservations
├── customer.html               # Dedicated customer dashboard portal
├── seating layout.html         # Standalone seating layout prototype/test
├── qr-test.html                # QR code scan/test utility page
├── clean.js                    # Utility cleanup script
├── temp_head.txt               # Scratch file (HTML head fragment)
└── walkthrough.md              # A brief developer walkthrough note
```

> **Critical Note:** There is no `package.json`, no build system, no bundler. This is **pure vanilla HTML/CSS/JavaScript** hosted statically. The only server-side code is two Vercel serverless functions in `api/`.

---

## 3. Technology Stack

### 3.1 Frontend (Client-Side)
| Technology | Version/Source | Role |
|-----------|---------------|------|
| **HTML5** | Native | Structure of all portals |
| **Vanilla CSS** | Native | All styling (no Tailwind, no Bootstrap) |
| **Vanilla JavaScript (ES6+)** | Native | All application logic |
| **Google Fonts** | CDN | Playfair Display, DM Sans, Cormorant Garamond |
| **Leaflet.js** | v1.9.4 (CDN) | Interactive GPS maps for venue selection and execution tracking |
| **Leaflet Routing Machine** | CDN | Route/distance calculation on execution day |
| **FullCalendar.js** | v6.1.10 (CDN) | Calendar views for public events, admin scheduling, meeting hub |
| **Chart.js** | CDN | Dashboard analytics charts and business insights |
| **QRCode.js** | v1.0.0 (CDN) | QR code generation for equipment tracking and guest attendance |
| **PeerJS** | v1.5.2 (CDN) | WebRTC peer-to-peer video calling for meeting mode |
| **Tesseract.js** | v4.1.1 (CDN) | OCR text extraction (used in QR scan workflow) |
| **jsQR** | v1.4.0 (CDN) | QR code decoding/scanning from camera |

### 3.2 Backend / Cloud Services
| Technology | Role |
|-----------|------|
| **Firebase (Firestore)** | Primary NoSQL database — real-time document store |
| **Firebase Authentication** | User login (email/password + Google OAuth) |
| **Firebase Storage** | Contract documents, media uploads |
| **Vercel** | Static site hosting + serverless functions |
| **OpenRouter API** | AI chat — proxied through Vercel function |
| **PayMongo API** | Philippine payment gateway (GCash, Maya, card) |
| **Cloudinary** | CDN for hero images and gallery photos |

### 3.3 Firebase SDK
All pages use the **Firebase Web SDK v12.11.0** loaded via ES module imports from `gstatic.com`. The SDK is initialized inline in `<script type="module">` blocks at the bottom of each HTML page and exposed to the global scope via `window.firebaseAuth`, `window.firebaseDB`, and `window.firebaseFns`.

```javascript
// Firebase project config (same across all portals)
const firebaseConfig = {
  apiKey: "AIzaSyAc9hHRGErQ8R2tByoqMJ04SMvJed5FDro",
  authDomain: "smartserve-e3856.firebaseapp.com",
  projectId: "smartserve-e3856",
  storageBucket: "smartserve-e3856.firebasestorage.app",
  messagingSenderId: "255403568863",
  appId: "1:255403568863:web:7187560f64c8730ecec36a"
};
```

---

## 4. Portal 1: Public Website

**Files:** `index.html`, `app.js`, `style.css`, `auth-prompt-styles.css`

### 4.1 Page Structure & Sections

The public website is a **single-page application (SPA)** that uses hash-based smooth scrolling (`go('#section-id')`) to navigate between sections. There is no page reload — everything is in one HTML document.

| Section | HTML ID | Description |
|---------|---------|-------------|
| Auth Welcome Modal | `#authPromptModal` | Shown on first visit — prompts Guest or Login |
| Navigation Bar | `<nav>` | Sticky top nav with logo, links, cart FAB, auth button, theme toggle |
| Hero Section | `#hero` | Full-screen image slideshow with auto-advancing slides |
| Photo Carousel | `#photo-carousel` | Draggable horizontal gallery (desktop) / fading carousel (mobile) |
| Customer Reviews | `#customer-reviews` | Auto-scrolling horizontal testimonial carousel |
| Ready-Made Packages | `#packages` | Grid of 6 pre-built event packages with filters & search |
| Full Catalog (Read-Only) | `#full-catalog` | Browsable read-only catalog with category filters and star ratings |
| Custom Package Builder | `#catalog` | Interactive workspace: build your own package by selecting items |
| Public Event Calendar | `#event-calendar` | FullCalendar view showing all approved events + sidebar list |
| AI Chat (Floating) | `.desk-ai-window` / `.mob-ai-drawer` | Floating AI assistant (desktop window + mobile bottom drawer) |
| Map Modal | `#map-modal` | Leaflet map for venue pin selection (NCR-restricted geocoding) |
| Cart Drawer | `#cart-drawer` | Slide-in panel showing finalized packages with total |
| Auth Drawer | `#auth-drawer` | Slide-in panel for Login / Sign Up / Forgot Password |
| Checkout Drawer | `#checkout-drawer` | Final reservation confirmation form before submission |
| Footer | `<footer>` | Brand info, links, contact placeholders |

### 4.2 Hero Section (Slideshow)
- 5 slides loaded from **Cloudinary CDN** URLs
- Labels per slide: Wedding Reception, Kiddie Party, Birthday Celebration, Corporate Dinner, Grand Reception
- Features: auto-play timer (CSS animation via `#hero-progress-fill`), prev/next arrows, dot navigation, counter HUD (01/05)
- JavaScript manages the active slide class and dot states

### 4.3 Authentication Welcome Modal
- Shown on page load via `auth-prompt-overlay` div
- Two options: **Continue as Guest** (sets guest flag in sessionStorage) or **I Have an Account** (opens auth drawer)
- Disclaimer: Guests can browse but cannot book reservations

### 4.4 Authentication System (Detailed in Section 10)
The auth drawer (`#auth-drawer`) has 4 panels:
1. **Login** — email/password + Google OAuth
2. **Sign Up** — 3-step wizard (Personal Details → Email OTP Verification → Success)
3. **Forgot Password** — sends Firebase password reset email
4. **Logged-In State** — shows user avatar, name, email, sign out button

OTP verification flow: User submits Step 1 → system generates a 6-digit OTP → sends to email (via Firebase or serverless function) → user enters OTP → on match, `createUserWithEmailAndPassword()` is called, Firestore `users` document is created, and the user is logged in.

### 4.5 Pre-Made Packages Section
- **Data Source:** Fetched dynamically from Supabase (`premade_packages` and `premade_package_items` tables) via `loadPackagesFromSupabase()`. Hardcoded packages have been removed from the frontend.
- **Packages Features:** 
  - Supports multiple pricing modes: `majorly_set` (fixed price), `per_head` (dynamic price based on pax), and `tiered` (fixed price per specific pax bracket).
  - Categorized by occasion (Wedding, Birthday, Corporate, Private, etc.) and filterable by text search.
  - Recent additions include: **Kiddie Party Package A** (tiered), **Baptismal Package** (tiered), and **Christmas Party Package A** (per_head with Free Choice mechanic).
- **Package Modal:** Clicking "View Details" opens a modal with package image, badge, theme, occasion, included items grouped by source (Foods, Equipment, Freebies), and an "Apply This Package" button.
- **Applying a Package:** Loads all item IDs into the `customPkgItems` array, marks freebies as `isFree: true` and `isFreebie: true`, and redirects the user to the Custom Package Builder section.
- **"Free Choice" Mechanic:** A special `menu_item` called "Free Choices of Food From Menu" can be included in a package. If present in the builder, clicking any food or dessert item from the catalog will automatically consume this placeholder and apply a ₱0 cost to the selected item.

### 4.6 Full Catalog (Read-Only)
- All items from the `CAT` array displayed for browsing
- No add-to-cart functionality — purely informational
- Shows category label, name, price (dynamically calculated per pax if pax is set), description, star rating, review count
- Filter: All / Food / Desserts / Drinks / Decor / Equipment / Fun (entertainment)
- Text search filters by name or description

### 4.7 Custom Package Builder (Core Feature)
The most complex section of the public site. A **dual-panel workspace**:

#### Left Panel: Package Configuration (`#cpkg-panel`)
Form fields the user fills in:
- **Budget** — caps total; prevents adding items that exceed it
- **Event Description** — textarea, auto-resize
- **Occasion** — select (Wedding, Birthday, Corporate, Private, Others) with "Others" text input
- **Theme/Style** — select (Classic, Modern, Rustic, Vintage, Bohemian, Others)
- **Guest Count (Pax)** — number input; dynamically recalculates ALL prices
- **VIP Checkbox** — toggles hidden VIP fields (count + service type: Properly Catered / Plated)
- **Event Time Frame** — dual time inputs (start/end)
- **Event Date** — date picker
- **City** — dropdown of all 17 NCR cities/municipalities
- **Venue** — read-only input, populated by the Map Modal
- **Preferred Meeting Times** — user can add 2-3 proposed consultation time slots
- **Selected Items View** — toggleable panel showing items grouped by: Food & Drinks, Equipments & Decor, Fun & Entertainment, Add-ons, Included Free Items
- **Finalize Package** button — validates fields → prompts for package name → adds to cart

#### Right Panel: Catalog Browser (`#cat-panel`)
- Category filter tabs, text search
- Items rendered with dynamic price based on current pax
- "Add to Package" button per item — toggles in/out of `customPkgItems`
- AI recommendation banner shown when `aiPicks` is set

#### Validation Rules & Restrictions (Locks)
To ensure operational feasibility, the Custom Package builder strictly enforces the following validation locks upon finalization:
- **Guest Count (Pax)**: Minimum of 10 guests, maximum of 150 guests.
- **VIP Count**: Maximum of 20 VIPs allowed.
- **Event Date**: Cannot be a past date. Must be at least 1.5 weeks (preparation time) and no more than 2 months into the future.
- **Time Frame**: The event duration must be at least 2 hours.
- **Date & Overlap Conflicts**: 
  - Queries Firestore to reject the reservation if the date already has 3 or more confirmed events.
  - Rejects the reservation if the chosen time frame overlaps with 2 or more existing confirmed events on that same date.
- **Meeting Times**: Proposed meeting slots must be within the current week (Mon-Sun) and have a minimum 2-hour window.

#### Right Panel (Alt): Data Insights (`#data-panel`)
- Appears on focus of key form fields (description, occasion, theme, city, venue)
- Renders Chart.js charts showing past booking trends for that data type

#### Pricing Engine (`getDynamicPrice`)
```javascript
function getDynamicPrice(item, pax) {
  if (item.isFree) return 0;
  const p = parseInt(pax) || 0;
  if (p <= 0) return item.price;
  if (item.isIndividual) return item.price * p;   // e.g. chairs @ ₱150/person
  if (item.batchSize) return Math.ceil(p / item.batchSize) * item.price; // e.g. food trays per 20
  return item.price; // flat rate (e.g. photo booth)
}
```

### 4.8 Map Modal (Leaflet GPS)
- Opens `#map-modal` with a Leaflet.js map (`#leaflet-map`)
- User types an address → press Enter or click Search → calls **Nominatim geocoding API** (`nominatim.openstreetmap.org`)
- NCR validation: Checks if result is within NCR by verifying city/state/county against a list of NCR localities
- Places a marker at the selected location; "Confirm Location" populates the venue input field with the formatted address + stores lat/lng in `lastMapCoords`
- Checkout Map Modal (`#chk-map-modal`): Read-only map view of the confirmed venue, shown in the checkout drawer

### 4.9 AI Chat Planner ("Halden's AI Planner")
- Available as **floating window** on desktop (`#desk-ai-window`) or **bottom drawer** on mobile (`#mob-ai-drawer`)
- Triggered by FAB buttons (`#desk-ai-fab` / `#mob-ai-fab`)
- Context bar (`#daw-context-bar`) shows current package state (occasion, pax, items count, total)
- Quick-action chips: "Birthday for 50 guests", "Wedding reception", "Review my package", "Corporate event 100 pax"
- Messages stored in conversation history array; renders with user/AI bubble styles
- **API Call:** `POST /api/chat` → Vercel function → OpenRouter API
- System prompt injects the user's current event details and package items as context
- Parses AI response for `RECOMMEND_IDS:[id1,id2,...]` pattern to highlight recommended catalog items

### 4.10 Public Event Calendar
- Uses **FullCalendar.js** to render all confirmed reservations from Firestore
- Color coding: Event Day = gold/yellow, Preparation Period = blue
- Sidebar shows upcoming events list with client name, date, pax, type
- "Browse Packages" CTA button

### 4.11 Cart & Checkout Flow
1. User finalizes custom package (or applies pre-made one) → gets pushed to `cart[]` array
2. Cart FAB shows badge count
3. Cart Drawer: lists all finalized packages, shows estimated total, "Inquire / Book This Package" button
4. Checkout Drawer: shows event details (date, timeframe, venue, occasion, theme, pax) pre-filled from `customPkg` form; allows payment method selection (Online / Cash on Event)
5. "Confirm Reservation" → calls `openOrderConfirmation()` → creates Firestore reservation document
6. If payment method is Online: calls `/api/paymongo` to create a PayMongo checkout session, redirects to PayMongo hosted page; on success/cancel, URL params `?payment=success&resId=...` are detected on page load

### 4.12 Customer Dashboard (Logged-In)
The customer dashboard has been extracted from `index.html` into its own dedicated portal page: `customer.html`.
It features a full-screen layout with a sidebar and tabbed content:

| Tab | ID | Content |
|-----|-----|---------|
| My Reservations | `dash-tab-reservations` | List of customer's own reservations; if any is confirmed, shows "Reservation Approved!" hero banner with CTA to Planning Hub |
| Event Calendar | `dash-tab-calendar` | FullCalendar of their event dates |
| Meetings | `dash-tab-meetings` | List of scheduled meetings with admin; join meeting via room ID |
| Reservation Details | `dash-tab-resdetails` | Customer-facing view of their reservation details, timeline, procurement status |
| Payments | `dash-tab-payments` | Payment history and status |
| Summary & Feedback | `dash-tab-reviews` | Post-event feedback form |
| Notifications | `dash-tab-flags` | System notifications and alerts |

Join Meeting feature: User inputs a `MTG-XXXXXXXX` room ID → calls `joinMeetingRoom()` → connects via PeerJS to admin-initiated meeting

---

## 5. Portal 2: Administrator Dashboard

**Files:** `admin.html`, `admin.js`, `admin.css`

### 5.1 Auth Guard
`admin.js` runs `checkAuth()` immediately on load. Checks `sessionStorage.getItem('halden_admin')`. If not found, redirects to `index.html`. The admin session is written to sessionStorage when an admin-role user logs in from the public page (handled in `app.js`).

```javascript
function checkAuth() {
  const logged = sessionStorage.getItem('halden_admin');
  if (!logged) { window.location.href = 'index.html'; return; }
  // Parses name from stored JSON, displays in top nav
}
```

### 5.2 Layout
- **Top Navigation Bar** (`.top-nav`): Brand logo, admin name, Support chat button, theme toggle, Sign Out
- **Sidebar** (`.sidebar`): Collapsible section groups
- **Main Content Area** (`.main`): Section divs, only the `.active` one is visible

### 5.3 Sidebar Navigation Structure

#### Reservations Group
- **Dashboard** — statistics, calendar, activity feed
- **All Reservations** — filterable table (All / Pending / Confirmed / Cancelled)
- **Reservation Details Handling** — deep-dive management for approved reservations
- **Activity Logs** — audit trail for approved/completed reservations
- **Meetings Hub** — consultation scheduling and meeting management
- **Execution Day** — event day tracker and settlement

#### Equipment Inventory Group
- **Equipment Assets** — full inventory table
- **Availability & Status** — real-time equipment status tracking
- **Routine Checks** — weekly inspection module
- **Equipment Cycle** — scheduling equipment allocation per reservation
- **Equipment Resupply** — procurement requests
- **Equipment Maintenance** — maintenance records and status
- **Archived Disposed Records** — disposed/written-off equipment history

#### User Handling Group
- **User Management** — create/edit/deactivate staff and view customers

#### Analytics Group
- **Business Insights** — revenue charts, booking trends, equipment utilization

#### Items & Packages Group
- **Manage Catalog** — add/edit/remove items and packages (saved to Firestore + `localStorage`)

### 5.4 Dashboard Section
- **Greeting**: Time-based (Good morning/afternoon/evening) + current date
- **4 Stat Cards**: Upcoming Events, Pending Approval, Equipment Status, Est. Revenue (Month)
- **Season Forecast Banner**: Renders contextual banner if peak booking season approaching
- **Routine Check Alert**: Warning if weekly equipment inspection is overdue (shows days since last check)
- **Approved Event Calendar**: FullCalendar with all confirmed reservations; click event → open event details modal
- **Upcoming Reservations panel**: Next few confirmed events listed
- **Recent Activity panel**: Timestamped log of recent system actions

### 5.5 All Reservations Section
- Table view: Client, Event Type, Date, Pax, Amount, Status badge, Action buttons
- Status filter tabs: All / Pending / Confirmed / Cancelled
- Action per reservation:
  - **Approve**: Updates Firestore status to `confirmed`, auto-navigates to Meetings Hub, creates meeting entry
  - **Reject**: Prompts for rejection reason, updates status to `cancelled`
  - **View Details**: Opens event details modal

### 5.6 Reservation Details Handling — The Central Hub
The most feature-rich section of the admin portal. After selecting a confirmed reservation from the dropdown, it reveals **10 sub-tabs**:

#### Tab 1: Main Dashboard
- Full reservation overview: client info, event details, package items, venue map, total amount
- "Modify Reservation Details" — opens right-side panel with live catalog to add/remove items
- "Update Ops Status" — changes operational status (Planning / Confirmed / Preparing / On-going / Completed)

#### Tab 2: Logistics Timeline
- Visual timeline showing all 6 phases:
  1. Reservation Detailing & Planning
  2. Resource Planning
  3. Payment Fulfillment
  4. Procurement & External Confirmation
  5. Finalization
  6. Pre-Preparation (Pre-Prep)
- Each phase has: color, activities list, duration weight, overlap
- Auto-calculated date ranges based on event date and duration weights
- Timeline calendar (FullCalendar) shows phases as events
- Milestones: clickable cards for each phase date
- Per-day activity assignment (task title, status, notes)
- Payments & Pending Payments: auto-dated payment milestones
- **Reschedule**: change event date + re-allocate all timeline phases automatically
- **Execution Day Strategy**: subpanel for planning execution phases (Setup, Service, Teardown) with 24-hour visual timeline, staff auto-distribution, phase timeframes, save execution plan

#### Tab 3: Procurement Hub
4-column kanban-style grid:
- **Dishes & Ingredients**: Lists all food items with their sub-ingredients and quantities scaled to pax; exportable as PDF; uses `RECIPE_DATA` constant for per-dish ingredients
- **Event Equipment**: Lists required equipment assets; links to Equipment Cycle Scheduling
- **Aesthetic & Decor**: Lists decoration items with `DECOR_COMPONENTS` sub-ingredients; exportable shopping list
- **Talent & Personnel**: Lists booked entertainment/coordinator personnel with contact info

#### Tab 4: Guest & Seating
- **Global Analytics Bar**: Total capacity (chairs vs pax), VIP capacity, guest list progress
- **List of Guests**: Editable table for customer-submitted guest names; generates attendance QR codes
- **Customer Provided Equipment**: Form for logging furniture/tableware/catering equipment the client is bringing (auto-deducted from required totals)
- **Execution Agenda**: Event program flow builder (add agenda items with titles and time)
- **Venue Seating Layout**: Full SVG-based drag-and-drop floor plan editor:
  - Admin mode vs Customer View mode
  - Elements: Round Tables, Rectangular Tables, Individual Chairs
  - Interactions: drag to position, click to select, multi-select, delete, copy/paste, undo
  - VIP table designation
  - Zoom in/out
  - Workflow: Admin sends layout to customer for naming → customer returns named layout → admin receives it
  - Layout status tracking (not sent / sent / received)

#### Tab 5: Design
- Visual design selection for decorations (currently placeholder, built out during meeting mode)

#### Tab 6: Food Tasted
- Records which dishes the client has tasted during food tasting meetings
- Renders per dish with tasted/not-tasted status

#### Tab 7: Final Summary
- Auto-generated summary of all finalized event details

#### Tab 8: Staff Allocation
- Shows which staff members are assigned to the reservation
- Allocation controls

#### Tab 9: Personnel
- Talent & external personnel management for the reservation
- Based on `PERSONNEL_CONTACTS` data (event coordinators, emcees, photographers, sound techs, decorators, logistics staff)
- Each contact: name, email, phone, role, day rate, times booked
- Hire/confirm/follow-up actions per personnel

#### Tab 10: Final Rundown
- Unified summary of all finalized event details
- Only generated after a "Final Program Rundown" meeting is completed

### 5.7 Meetings Hub

The meetings section is the nerve center for **admin-customer collaboration**. It has 3 panels:

#### Panel 1: Pending Meetings (Left)
- Lists all approved reservations that need meetings
- Filter chips: All / Contract finalization / Food tasting / Additional reservation discussion / Design and decorations to be selected / Final program rundown
- These correspond to **mandatory meeting topics** that must be completed before an event can proceed

#### Panel 2: Meetings This Week (Center)
- Scheduled meetings for the current 7-day window
- Each item: reservation name, meeting topic, scheduled date/time

#### Panel 3: Meeting Calendar (Right)
- FullCalendar showing all scheduled meetings

#### Scheduling a Meeting
Admin clicks a reservation → selects from customer's proposed time slots (from the public site checkout) → confirms the meeting → system writes to Firestore, notifies customer

#### Meeting Mode (Full-Screen Collaboration)
When admin enters a meeting:
1. A unique room ID `MTG-XXXXXXXX` is generated and stored in Firestore
2. **PeerJS** creates a WebRTC peer connection
3. Full-screen meeting interface opens with:
   - **Video call area** (admin + customer cameras)
   - **Food Panel**: Live package editing — add/remove food items, quantities
   - **Venue Panel**: Leaflet map + routing from admin's GPS location to event venue; distance/ETA display
   - **Design Panel**: Visual design catalog — browse and select decoration themes with image galleries from `DESIGN_CATALOG`
   - **Chat Panel**: Real-time text chat during meeting
   - **Meeting Minutes**: Auto-recording of what was decided
   - **Conclude Meeting** button: Finalizes changes, marks meeting topic as completed, updates Firestore

### 5.8 Execution Day Section
- Lists all approved reservations grouped by month (left panel)
- Select a reservation → right panel shows:
  - **Live GPS Tracker** (Leaflet map): Starts admin's browser geolocation tracking; draws route from admin's current position to event venue; shows ETA, distance, speed
  - Live status buttons: On The Way / Arriving / Delayed / Arrived
  - Delay reason field (required if delayed)
  - **Execution Phase Tracker**: Shows planned phases from execution plan (Setup, Service, Teardown) with tasks; staff can mark tasks complete
  - **Activities Log**: Log any activities or incidents
  - **Settlement & Billing Panel**:
    - Shows base package amount
    - Add-hoc charges form (item name, qty, unit price)
    - Running table of all ad-hoc charges
    - Final settlement total = base + ad-hoc
    - Generate Invoice PDF button
    - Mark as Settled / Paid button

### 5.9 Activity Logs Section
- Selects from approved/completed reservations (left)
- Shows full chronological activity history (right): creation, approvals, meetings, status changes, task completions, settlements

### 5.10 Equipment Inventory System (See Section 14 for details)
The admin portal contains a comprehensive multi-page equipment management system.

### 5.11 User Management
- Tab: Staff vs Customers
- **Staff**: Fetched from Firestore `users` collection where `role != 'customer'`
- Lists: name, email, role, status, last login
- Actions: Edit details, Activate/Deactivate, Delete
- Create new staff account form: name, email, password, role (Staff / Admin), department

- **Customers**: Fetched from Firestore `users` where `role == 'customer'`
- Read-only view: name, email, registration date, reservation count

### 5.12 Business Insights
- **Revenue Overview**: Chart.js line chart of monthly revenue
- **Booking Volume**: Bar chart of reservations per month
- **Equipment Utilization**: Pie chart of equipment by status
- **Top Packages**: Ranked by bookings
- **Peak Season Forecast**: Based on historical booking patterns
- All data aggregated in real-time from the `RESERVATIONS` array loaded from Firestore

### 5.13 Catalog Management
Admin can:
- **Add New Item**: Form with name, category, price, batchSize/isIndividual flag, description, image URL, ingredients
- **Edit Existing Item**: In-place edits
- **Hide/Delete Item**: Marks `hidden: true` or removes from array
- **Add New Package**: Full package creation with item selection
- Changes are **saved to `localStorage`** (`halden_catalog`, `halden_packages`) for persistence across sessions and loaded on next page visit. This effectively creates an admin-controlled local override of the catalog.

### 5.14 Admin Support Chat
- Toggle via "Support" button in top nav
- Chat panel slides in from the right
- Pulls from Firestore `adminChats` collection (or similar)
- For admin-to-customer messaging

---

## 6. Portal 3: Staff Dashboard

**Files:** `staff.html`, `staff.js`, `admin.css` (shared)

### 6.1 Structure
Uses the same `.layout` / `.sidebar` / `.main` structure as the admin portal but with a simplified sidebar:

| Sidebar Item | Section |
|-------------|---------|
| Dashboard | `section-dashboard` |
| Execution Day | `section-execution-day` |
| Execution Performance | `section-execution-performance` |

### 6.2 Authentication
Same Firebase auth pattern — checks for logged-in user, reads role from Firestore `users` doc. Staff cannot access admin routes.

### 6.3 Staff Dashboard
- 4 stat cards: Assigned Events, Days on Duty, Completed Tasks, Performance Score
- **My Assigned Reservations**: Fetched from Firestore — reservations where the current staff member's UID is in the `staff` array
- **Announcements**: Pulled from Firestore (admin-posted notices)
- **Recent Activity**: Staff's own task completion feed

### 6.4 Execution Day Section
- Left sidebar: List of staff member's assigned reservations
- Click a reservation → right panel loads the full execution detail view:
  - Event info (date, time, venue, pax)
  - Navigation to venue (GPS link)
  - **Execution phases**: Setup / Service / Teardown (with time windows from the admin's execution plan)
  - **Tasks per phase**: Click a phase to see its task checklist; mark tasks as In Progress / Done
  - **Activities Log**: Staff can log activities/incidents with notes
  - Equipment checklist (with quantities to verify)
  - **Live Execution View** (`section-execution-live`): Full-screen mode for active event management

### 6.5 Execution Performance
- Auto-populated after staff complete a "Restorage" phase checklist
- Shows per-event records:
  - Event name, date, role
  - Tasks completed (count), total tasks
  - Hours worked (calculated from phase times)
  - Estimated pay (hours × role rate)
  - Issues logged
- Rendered via `renderExecutionPerformance()` from `staff.js`

### 6.6 Strategy View Modal
- `#staff-strategy-modal` — full-screen modal showing the Execution Day Strategy document
- Accessible via a button in the execution detail view
- Shows all phases with staff assignments, times, and task breakdowns

---

## 7. Shared Utilities & Stylesheets

### 7.1 `theme.js`
A universal IIFE module loaded on all pages:
- Reads `localStorage.getItem('halden_theme')` (defaults to `'dark'`)
- Applies `data-theme` attribute to `<html>` element
- FOUC prevention: applied via inline `<script>` in `<head>` before stylesheet load
- `toggleTheme()` switches between `'dark'` and `'light'`
- Updates all `.theme-toggle-btn` button labels across the page
- All CSS uses `var(--variable)` tokens that are defined per theme in `style.css` and `admin.css`

### 7.2 CSS Architecture
#### `style.css` (index.html / public site)
- CSS custom properties defined at `:root` for light theme
- `[data-theme="dark"]` overrides for dark mode
- Key variables: `--bg`, `--bg2`, `--bg3`, `--card`, `--border`, `--text`, `--text-mid`, `--text-dim`, `--cream`, `--cream2`, `--gold`, `--primary`, `--red`, `--green`, `--blue`
- Gold/amber (`#c49a3c`) is the primary brand color throughout
- Comprehensive component styles: nav, hero, carousel, packages, catalog, AI chat, cart drawer, auth drawer, map modal, dashboard overlay, checkout, footer, etc.
- Responsive breakpoints for mobile (hamburger nav, mobile AI drawer, mobile carousel)

#### `admin.css` (admin.html + staff.html)
- Same CSS variable approach
- Admin-specific components: sidebar, main content panels, stat cards, tables, badges, tab bars, form inputs, chip containers, modal overlays, seating canvas, equipment grid, meeting mode layout, etc.
- Default theme for admin is **dark** (opposite of the public site which defaults to light)

#### `auth-prompt-styles.css`
- Standalone styles only for the welcome/auth prompt overlay modal
- Glassmorphism effect for the modal card

---

## 8. Backend / Serverless API Layer

All server-side secrets are handled by two Vercel serverless functions in the `api/` directory.

### 8.1 `api/chat.js` — AI Chat Proxy
```
POST /api/chat
Body: OpenRouter chat completion request body (model, messages, etc.)
Response: OpenRouter API response
```
- Simple pass-through proxy
- Injects `Authorization: Bearer ${OPENROUTER_API_KEY}` from Vercel env variable
- Sets referrer and title headers for OpenRouter attribution
- No authentication on the proxy itself (rate limiting handled on OpenRouter side)

### 8.2 `api/paymongo.js` — Payment Checkout Session
```
POST /api/paymongo
Body: { items: [{name, price}], customerInfo: {name, type}, reservationId }
Response: { checkout_url, session_id }
```
- Creates a PayMongo Checkout Session
- Line items are mapped to PayMongo format (amount in centavos)
- Supports payment methods: `gcash`, `paymaya`, `card`
- Success URL: `{origin}/?payment=success&resId={reservationId}`
- Cancel URL: `{origin}/?payment=cancel`
- Uses `Basic` authentication with base64-encoded PayMongo secret key
- Sends email receipt, shows description, shows line items

---

## 9. Firebase Data Model

### 9.1 Firestore Collections

#### `reservations`
The primary data collection. Each document represents one customer reservation.

```json
{
  "id": "auto-generated",
  "userId": "firebase-uid",
  "clientName": "Maria Santos",
  "clientEmail": "maria@email.com",
  "clientPhone": "09123456789",
  "date": "2026-08-15",
  "timeframe": "14:00 - 22:00",
  "venue": "ABC Venue, Quezon City",
  "venueCoords": { "lat": 14.676, "lng": 121.043 },
  "pax": 120,
  "type": "Wedding",
  "theme": "Classic",
  "description": "Intimate garden wedding...",
  "status": "pending | confirmed | cancelled | completed",
  "opsStatus": "planning | preparing | on-going | completed",
  "amount": 145000,
  "paymentMethod": "Online | Cash",
  "paymentStatus": "pending | paid",
  "packageName": "Royal Wedding Package",
  "items": [...],
  "vip": { "enabled": true, "count": 20, "service": "plated" },
  "meetingTimes": [...],
  "createdAt": "timestamp",
  "staff": ["uid1", "uid2"],
  "meetings": [...],
  "guestList": [...],
  "seatingLayout": {...},
  "timelinePhases": [...],
  "executionPlan": {...},
  "adhocCharges": [...],
  "settlementAmount": 0,
  "settled": false,
  "foodTasted": {...},
  "executionActivities": [...],
  "executionLiveStatus": "idle | on-the-way | arriving | delayed | arrived",
  "delayReason": "",
  "rundownData": {...}
}
```

#### `users`
Stores extended profile data for all users (supplement to Firebase Auth).

```json
{
  "uid": "firebase-uid",
  "name": "Full Name",
  "email": "email@domain.com",
  "phone": "09123456789",
  "role": "customer | staff | admin",
  "status": "Active | Inactive",
  "department": "Operations",
  "lastLogin": "timestamp",
  "createdAt": "timestamp"
}
```

#### `equipmentInventory`
Equipment asset records.

```json
{
  "id": "auto-generated",
  "name": "Tiffany Chair",
  "category": "Furniture",
  "totalQty": 500,
  "availableQty": 480,
  "status": "available | allocated | in-use | maintenance | disposed",
  "condition": "Good | Fair | Needs Repair",
  "lastInspected": "date",
  "allocatedTo": "reservation-id",
  "qrCode": "base64-string",
  "purchaseDate": "date",
  "value": 250
}
```

#### `announcements`
Admin-created staff announcements.
```json
{
  "title": "string",
  "body": "string",
  "createdAt": "timestamp",
  "createdBy": "admin-uid"
}
```

#### `adminChats` (or similar)
Admin-customer chat messages for the support panel.

---

## 10. Authentication System

### 10.1 Customer Authentication (index.html / app.js)

**Login Flow:**
1. User opens Auth Drawer → Login tab
2. Enters email + password → `doLogin()` → `signInWithEmailAndPassword(auth, email, password)`
3. On success: `onAuthStateChanged` fires → `currentUser` set → UI updates (profile button visible)
4. If user has `role = 'admin'` in Firestore → writes to `sessionStorage('halden_admin')` → redirects to `admin.html`
5. If user has `role = 'staff'` → redirects to `staff.html`
6. Otherwise → customer remains on `index.html`, dashboard button becomes visible

**Google OAuth Flow:**
1. `doGoogleLogin()` → `signInWithPopup(auth, new GoogleAuthProvider())`
2. On success: checks if Firestore `users/{uid}` exists
3. If new Google user: creates Firestore profile document
4. Same role-based redirect logic

**Sign Up Flow (3-Step):**
1. Step 1: Collect first name, last name, middle name (optional), phone, email, password, confirm password → validates → stores in temp object
2. Step 2: Email OTP — system generates 6-digit code, sends to user's email, user enters code → `verifyOtp()` matches → calls `createUserWithEmailAndPassword()`
3. Step 3: Success screen → `finishSignup()` → updates Firebase profile + creates Firestore user doc

**Sign Out:** `signOut(auth)` → clears `currentUser` → hides dashboard button

### 10.2 Admin Authentication
- Admin login happens via the same `index.html` login form
- `app.js` checks `onAuthStateChanged` → fetches Firestore user doc → if `role === 'admin'`: writes `{ name, uid, email }` to `sessionStorage('halden_admin')` → `window.location.href = 'admin.html'`
- `admin.js` runs `checkAuth()` immediately on script load to guard the page

### 10.3 Staff Authentication
- Same flow as admin but `role === 'staff'` redirects to `staff.html`
- `staff.js` has its own `checkAuth()` that guards the page

---

## 11. Catalog & Package Data

### 11.1 Catalog Items (`CAT` array)
Defined in both `app.js` and `admin.js` identically. Total: ~50+ items across 6 categories:

| Category | Count | ID Prefix | Examples |
|----------|-------|----------|---------|
| `food` | 16 | `f1`-`f16` | Pork Belly Lechon, Beef Caldereta, Seafood Paella, Chicken Adobo, Pancit Bihon |
| `dessert` | 8 | `d1`-`d9` | Mango Bravo Cake, Leche Flan Tower, Halo-Halo Station, Buko Pandan |
| `drink` | 5 | `dr1`-`dr5` | Soft Drinks Bar, Iced Tea & Lemonade, Brewed Coffee Station |
| `equipment` | 10 | `eq1`-`eq10` | Tiffany Chairs (₱150/pax), Round Tables, Lights & Sound, HD Projector, Generator |
| `decoration` | 6 | `dc1`-`dc6` | Entrance Stylist Setup, Balloon Setup, Table Centerpiece, Letter Standee |
| `entertainment` | 8 | `en1`-`ph3` | Photo Booth, Event Coordinator, Kids Magician, Event Photography, Photo & Video Bundle |

Each item object:
```javascript
{
  id: 'f1',
  name: 'Pork Belly Lechon',
  cat: 'food',
  image: 'https://images.unsplash.com/...',
  price: 2500,
  batchSize: 20,          // optional — scales with pax
  isIndividual: true,     // optional — multiplies by pax count
  desc: 'Tender slow-cooked pork...',
  rating: 4.8,
  reviews: 124,
  ingredients: ['Pork Belly', 'Lemongrass', ...],
  hidden: false,          // admin can hide items
  isFree: false           // set by system for rice/cheap desserts in pre-made packages
}
```

### 11.2 Decoration Components (`DECOR_COMPONENTS`)
Maps decoration item names to their sub-components with cost and supplier. Used in the Procurement Hub. Example:
```javascript
'Entrance Stylist Setup': [
  { name: 'Entrance Arch Structure', cost: 5000, supplier: 'EventStyle Co.' },
  { name: 'Fabric Drapes (100m)', cost: 3500, supplier: 'EventStyle Co.' },
  { name: 'Floral Accents (Premium)', cost: 4000, supplier: 'Blossom Florists' },
  { name: 'Spotlight / Pinlight Set', cost: 2500, supplier: 'ProSound Rentals' }
]
```

### 11.3 Recipe Data (`RECIPE_DATA`)
Maps food dish names to their raw ingredients with quantities (scaled per 20 pax), costs, and supplier names. Used in the Procurement Hub "Dishes & Ingredients" column. The `getIngredientsForDish(dishName, pax)` function scales quantities proportionally.

### 11.4 Design Catalog (`DESIGN_CATALOG`)
Maps decoration names to arrays of Unsplash image URLs for visual selection during Meeting Mode.

### 11.5 Personnel Contacts (`PERSONNEL_CONTACTS`)
Fixed list of external talent/personnel available for hire:
- Maria Cruz — Event Coordinator — ₱8,500/event
- John Santos — Emcee / Party Host — ₱5,000/event
- Elena Reyes — Photo & Video Lead — ₱12,000/event
- Antonio Luna — Sound & Lighting Tech — ₱4,500/event
- Bea Villanueva — Decorator / Stylist — ₱6,000/event
- Carlo Mendez — Logistics Staff — ₱2,500/event

---

## 12. End-to-End Reservation Flow

```
CUSTOMER JOURNEY                         ADMIN RESPONSE
─────────────────                        ──────────────
1. Visits index.html
   ↓ Welcome modal (Guest/Login)
2. Browses packages/catalog
3. Builds custom package OR
   applies pre-made package
4. Fills event details form
   (occasion, pax, date, venue, city,
    theme, description, meeting times)
5. Finalizes package → names it → 
   adds to cart
6. Opens checkout drawer
7. Confirms reservation
   ↓ Firestore reservation doc created
   ↓ If Online payment: /api/paymongo
     ↓ PayMongo checkout session
     ↓ Redirect to PayMongo
     ↓ GCash / Maya / Card payment
     ↓ Redirect back with ?payment=success
8. Reservation visible in customer
   dashboard (status: pending)
                                         8b. Admin sees new reservation 
                                             in All Reservations table
                                         9. Admin reviews and APPROVES
                                            ↓ Firestore status = 'confirmed'
                                            ↓ Auto-navigate to Meetings Hub
                                            ↓ Meeting entry created
10. Customer notified (banner in
    customer dashboard)
11. Customer and admin schedule
    meetings:
    - Food tasting
    - Design selection
    - Contract finalization
    - Final rundown
    ↓ Each meeting conducted via
      PeerJS video call
    ↓ Meeting mode for collaborative
      editing of package details
12. Admin manages logistics:
    - Timeline phases
    - Procurement checklist
    - Guest list & seating layout
    - Staff allocation
    - Equipment scheduling
    - Personnel hiring
13. Execution Day:
    - Admin starts GPS tracker
    - Staff view their tasks
    - Phase-by-phase execution
    - Activity logs
    - Issues reported
14. Post-Event:
    - Ad-hoc charges added
    - Final invoice generated
    - Payment marked as settled
    - Reservation status = 'completed'
15. Customer provides feedback
```

---

## 13. Meeting Mode & Real-Time Collaboration

Meeting Mode is the most technically advanced feature, activated from the Meetings Hub.

### Initiation
1. Admin selects a reservation and clicks "Start Meeting"
2. System generates Room ID: `MTG-` + 8 random alphanumeric characters
3. Room ID stored in Firestore reservation doc under `meetings[].roomId`
4. PeerJS connection established: `new Peer(roomId)`
5. Full-screen meeting interface rendered

### Customer Joining
1. Customer sees meeting notification in their dashboard
2. Enters room ID in "Join Meeting" input → `joinMeetingRoom()`
3. Customer's PeerJS connects to admin peer: `peer.connect(roomId)`
4. Video call established between admin and customer

### Meeting Mode Interface
The meeting interface is a specialized full-screen layout rendered programmatically in the admin portal. It contains:

- **Header**: Reservation name, room ID, timer, end meeting button
- **Main Area**: Side-by-side panels:
  - Left: Video call streams (admin + customer)
  - Right: Tabbed content panels

- **Food Panel**: Live menu editor synchronized with customer's view. Admin can add/remove food items; changes sync in real-time via Firestore listeners
- **Venue Panel**: Leaflet map with:
  - Customer's pinned venue (marker)
  - Admin's current GPS position (tracker)
  - Route drawn by Leaflet Routing Machine
  - Distance and estimated travel time displayed
  - Surcharge calculator: distance > threshold adds travel surcharge to total
- **Design Panel**: Browse `DESIGN_CATALOG` images for each decoration item; select preferred aesthetics; decisions recorded in Firestore
- **Chat Panel**: Real-time text chat using Firestore `onSnapshot` listener for instant message delivery
- **Meeting Minutes**: Auto-generated summary of decisions made during the meeting

### Concluding a Meeting
1. Admin clicks "Conclude Meeting"
2. System marks the meeting topic as completed in Firestore
3. Package modifications are saved
4. If topic was "Contract Finalization": generates PDF contract, uploads to Cloudinary, updates Firestore
5. Meeting mode closes; redirects to reservation details

---

## 14. Equipment Inventory System

The equipment inventory is a multi-module system within the admin portal.

### 14.1 Equipment Assets
- Full table of all equipment items in inventory
- Columns: Name, Category, Total Qty, Available Qty, Status, Condition, Last Inspected, Actions
- Add new asset: Name, category, quantity, condition, purchase date, value
- **QR Code Generation**: Each asset can have a QR code generated (via QRCode.js library) containing the asset's ID and details; used for physical tracking

### 14.2 Availability & Status
- Real-time view of equipment across 4 statuses: Available / Allocated / In-Use / Maintenance
- Visual status breakdown per category
- Quick status update controls

### 14.3 Routine Checks
- Weekly inspection module
- Dashboard alert shown if last inspection was >7 days ago
- Inspection form: check each equipment item's condition, note issues
- Logs inspection results to Firestore with timestamp
- "Mark Inspection Complete" saves the date and clears the dashboard alert

### 14.4 Equipment Cycle (Scheduling)
- Per-reservation equipment allocation
- Select a reservation from dropdown → view required equipment (derived from the package items)
- Allocate available equipment to the reservation
- Mark as: Allocated / Delivered / Returned
- Timeline view showing when equipment is assigned and returned
- Prevents double-booking (checks availability by date)

### 14.5 Equipment Resupply
- Tracks equipment quantities below reorder threshold
- Create purchase requests for replenishment
- Tracks supplier, expected delivery date, requested quantity

### 14.6 Equipment Maintenance
- Logs maintenance work: item, issue description, cost, date in/out
- Status tracking: Needs Repair / In Repair / Repaired
- Maintenance history per asset

### 14.7 Archived Disposed Records
- Equipment retired from service
- Shows: item name, reason for disposal, disposal date, value written off

---

## 15. Execution Day System

### Execution Planning (Admin - Pre-Event)
Accessed via the **Logistics Timeline → Execution Day Planning** subpanel in Reservation Details.

- Admin defines event time frame (from reservation data)
- System creates default phases:
  1. **Mobilization/Setup** — pre-event setup at venue
  2. **Service** — the event itself, catering service
  3. **Teardown/Restorage** — packing up after event

- For each phase: set start time, end time, and which staff are responsible
- **Auto-Distribute Staff**: Assigns staff members evenly across phases
- **24-Hour Visual Timeline**: Horizontal bar chart showing all phases on a timeline
- **Flexibility**: Strict (no extension allowed) vs Flexible (extension allowed)
- **Save Execution Plan**: Writes to Firestore reservation doc under `executionPlan`

### Execution Day Live (Admin)
In the **Execution Day** admin section:

- **GPS Tracker**: Browser `navigator.geolocation.watchPosition()` tracks admin in real-time
- Route plotted via Leaflet Routing Machine to the event venue
- ETA calculated from route duration
- Speed calculated from successive GPS fixes
- Live status broadcasts to Firestore (`executionLiveStatus`): on-the-way / arriving / delayed / arrived
- Customer can see this status in their dashboard

### Execution Day Live (Staff)
In `staff.html`:

- Staff see their assigned phases and tasks
- Click a phase → see all tasks for that time window
- Mark tasks: Pending → In Progress → Done
- Log activities and issues
- **Full-Screen Live View** (`section-execution-live`): Immersive mode for active event management with large task cards

### Post-Execution
- After all tasks complete, staff logs performance data
- **Execution Performance** section records: hours, tasks done, estimated pay
- Admin can do final settlement: adds ad-hoc charges, generates invoice, marks settled

---

## 16. Key Non-Functional Details

### State Management
- No frameworks (no Redux, no Vuex) — pure vanilla JS global variables
- Key globals in `app.js`: `CAT`, `PKGS`, `cart`, `customPkgItems`, `currentUser`, `aiPicks`, `lastMapCoords`, `preferredMeetingTimes`, `curCat`, `curPkgOccasion`
- Key globals in `admin.js`: `RESERVATIONS`, `USERS`, `activeResDetailId`, `mtCustomPkgItems`, `mtPax`, `currentEqcReservationId`, and many more
- Catalog persistence: Admin edits saved to `localStorage` (`halden_catalog`, `halden_packages`) and reloaded on next page visit via try/catch block at the top of `app.js`

### Scroll-Based Reveal Animations
- CSS class `.reveal` triggers fade-in animations via `IntersectionObserver` in `app.js`
- Staggered with `.delay-1`, `.delay-2`, `.delay-3` classes

### Error Handling
- Custom error modal (`#error-overlay`, `#error-msg`) used throughout `app.js` instead of native `alert()`
- `openErrorModal(msg)` / `closeErrorModal()` exposed on `window`

### Auto-Resize Textarea
- `ar(this)` function auto-expands textarea height as user types
- Used throughout all portals

### Mobile Responsiveness
- Hamburger menu (`#hamburger`) toggles `#mobile-nav` drawer for mobile navigation
- Separate mobile AI drawer (bottom sheet)
- Mobile-specific carousel (fading square carousel vs desktop draggable carousel)
- CSS media queries in `style.css` handle breakpoints

### Data Synchronization Pattern
- Admin portal loads all reservations once via `loadData()` into `RESERVATIONS[]` array
- Uses Firestore `onSnapshot` listeners for real-time updates on specific documents (e.g., meeting chat, execution live status)
- Staff portal uses similar pattern for assigned reservations

### LocalStorage Keys
| Key | Value | Used By |
|-----|-------|---------|
| `halden_theme` | `'light'` or `'dark'` | All pages — theme.js |
| `halden_catalog` | JSON string of CAT array | app.js — admin catalog edits |
| `halden_packages` | JSON string of PKGS array | app.js — admin package edits |

### SessionStorage Keys
| Key | Value | Used By |
|-----|-------|---------|
| `halden_admin` | JSON `{name, uid, email}` | admin.js auth guard |
| `halden_staff` | JSON `{name, uid, email}` | staff.js auth guard |

---

## 17. Deployment & Environment

### Hosting
- **Static Files**: Vercel (free tier) for HTML/CSS/JS/assets
- **Serverless Functions**: `api/chat.js` and `api/paymongo.js` deployed as Vercel Edge/Serverless functions
- **Database**: Firebase Firestore (Google-managed, globally distributed)
- **Auth**: Firebase Authentication
- **Media**: Cloudinary CDN

### Environment Variables (Vercel)
| Variable | Used By |
|----------|---------|
| `OPENROUTER_API_KEY` | `api/chat.js` — AI chat completions |
| `PAYMONGO_SECRET_KEY` | `api/paymongo.js` — payment checkout sessions |

### Production URL
The PayMongo API handler references `https://smartserve-rho.vercel.app` as a fallback origin, confirming the production deployment URL.

### CI/CD
- GitHub repository connected to Vercel
- Every push to `main` branch triggers automatic redeployment
- No build step required — Vercel serves static files as-is

---

## Summary of Key Facts for Developers/AI

| Fact | Value |
|------|-------|
| Total source files | ~20 files |
| Lines of code (approx total) | ~32,000+ lines |
| Largest file | `admin.js` at 19,119 lines / 953KB |
| Framework | None — pure vanilla HTML/CSS/JS |
| Database | Firebase Firestore (NoSQL) |
| Auth provider | Firebase Auth (email/password + Google OAuth) |
| Payment gateway | PayMongo (Philippines) |
| AI engine | OpenRouter → any LLM (proxied via Vercel) |
| Maps provider | Leaflet.js + OpenStreetMap + Nominatim geocoding |
| Calendar library | FullCalendar.js v6.1.10 |
| Charts library | Chart.js |
| Video calls | PeerJS (WebRTC) |
| QR codes | QRCode.js + jsQR (scanner) + Tesseract.js (OCR) |
| Brand colors | Gold `#c49a3c`, Cream, Dark backgrounds |
| Target market | Philippines, NCR events, catering/venue sector |
| Service area | National Capital Region (NCR) only (GPS-enforced) |
| Supported events | Weddings, Debuts, Birthdays, Kiddie Parties, Corporate Events, Private Dinners |
| Pre-made packages | 6 packages (₱650–₱1,200 per head) |
| Catalog items | ~50+ items across 6 categories |
| User roles | Customer, Staff, Admin (Super Admin) |
| Session persistence | sessionStorage (admin/staff), localStorage (theme, catalog) |
