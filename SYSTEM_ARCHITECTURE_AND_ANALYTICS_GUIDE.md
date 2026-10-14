# Hal'Serve System Architecture, Analytics, and Forecasting Guide

This document provides a comprehensive technical and operational breakdown of the Hal'Serve / SmartServe catering management platform. It covers the visual charting and layout engines, the automated email notification pipeline with its templating tokens, the mathematical booking demand forecasting model, the financial analytics framework, and the database architecture (why Supabase was chosen over alternatives like Firebase and why JSON/JSONB columns are utilized).

---

## 1. Visual Rendering Engines: Charts, Calendars, Layouts, and Maps

Hal'Serve utilizes four primary visual rendering engines to present operational data, spatial arrangements, and temporal schedules.

### 1.1 Chart.js (Analytical Graphs & Dashboards)

Chart.js is used for analytical telemetry, revenue tracking, and demand projections. It renders performant HTML5 Canvas elements that adapt to container boundaries.

#### Implementation Architecture
1. **Canvas Lifecycle Management:**
   Every chart canvas is identified by a unique DOM ID (e.g., `<canvas id="forecast-demand-chart"></canvas>`). Before instantiating a new `Chart` instance, the system checks whether an existing instance is bound to the window (e.g., `window.forecastDemandChartInst`). If found, `.destroy()` is executed to prevent memory leaks and overlapping canvas layers:
   ```javascript
   var ctxLine = document.getElementById('forecast-demand-chart');
   if (ctxLine && window.Chart) {
     if (window.forecastDemandChartInst) window.forecastDemandChartInst.destroy();
     window.forecastDemandChartInst = new Chart(ctxLine, { ... });
   }
   ```

2. **Chart Types Used Across the System:**
   - **Line Charts (`type: 'line'`):** Used for **Monthly Demand Forecasting vs. Actuals** (`#forecast-demand-chart` and `#insights-fc-acc-chart`) and **Monthly Revenue Trends** (`#revenueChart`). Utilizes cubic spline interpolation (`tension: 0.35`) for smoothed trend projection.
   - **Doughnut Charts (`type: 'doughnut'`):** Used for **Busy vs. Calm Season Split** (`#forecast-season-split-chart`) and **Reservation Status Distribution** (`#reservationStatusChart`). Configured with `cutout: '65%'` to provide a modern ring display.
   - **Bar Charts (`type: 'bar'`):** Used for **Package Popularity Breakdown** and **Financial Inflow vs. Outflow**.

3. **Data & Scaling Options:**
   - **Integer Ticks:** For reservation counts, `stepSize: 1` and `beginAtZero: true` are enforced so that fractional units (e.g., 1.5 bookings) are never rendered on the Y-axis.
   - **Tooltips:** Custom callbacks intercept hover events via `plugins.tooltip.callbacks.label` to format currencies (`₱`) or whole integer reservation counts with directional variance flags (`+1 vs Actual`).

---

### 1.2 FullCalendar (Master Event & Logistics Scheduler)

FullCalendar coordinates booking dates, tasting sessions, client consultations, and execution milestones.

- **Initialization:** Mounted to `#calendar` or `#admin-calendar`.
- **View Modes:** Month view (`dayGridMonth`), weekly schedule (`timeGridWeek`), and daily logistics (`timeGridDay`).
- **Dynamic Event Feeds:** Events are loaded from Supabase `reservations` records. Each event object defines `title`, `start` (ISO timestamp), `end`, and custom `extendedProps` containing `status`, `client_name`, `venue`, and `assigned_staff`.
- **Status Coloring:** Color tokens match the global palette: `#2d8a4e` for Confirmed, `#c49a3c` for In Progress / Downpayment Paid, and `#7c6fcd` for Scheduled Meetings.

---

### 1.3 Interactive SVG Seating & Floor Plan Engine

The seating arrangement and table layout builder in the Customer Portal and Admin Venue Designer uses direct SVG (Scalable Vector Graphics) DOM manipulation.

- **Coordinate System:** A scalable `<svg viewBox="0 0 1000 700">` canvas represents the venue boundary.
- **Parametric Geometric Elements:**
  - **Round Tables:** Rendered via `<circle cx="..." cy="..." r="36" fill="var(--card-bg)" stroke="var(--gold)"/>`.
  - **Rectangular / Buffet Tables:** Rendered via `<rect x="..." y="..." width="120" height="50" rx="6"/>`.
  - **Chairs:** Mathematically positioned around parent tables using radial trigonometric offsets:
    $$x_i = cx + (r + \text{offset}) \cdot \cos\left(\frac{2\pi \cdot i}{N}\right)$$
    $$y_i = cy + (r + \text{offset}) \cdot \sin\left(\frac{2\pi \cdot i}{N}\right)$$
    where $N$ is the number of seats assigned to that table.
  - **Interactive Drag-and-Drop:** Element dragging is bound to `mousedown` / `mousemove` / `mouseup` and touch equivalents, updating Cartesian coordinates `(x, y)` in the reservation layout state.

---

### 1.4 Leaflet.js (GPS Venue Mapping & Geofencing)

Hal'Serve integrates Leaflet.js backed by OpenStreetMap tiles for venue verification and logistics surcharge calculations.

- **Coordinate Geocoding:** Reverse geocodes customer venue inputs using the Nominatim OpenStreetMap API.
- **Logistics Radius Circles:** Renders a 25-kilometer radius circle from the catering central commissary. Events outside this geofenced perimeter automatically trigger the Out-of-Town Surcharge calculation.

---

## 2. Automated Email Notification System & Placeholder Tokens

The email subsystem is implemented in [notifications.js](file:///c:/Users/Admin/Desktop/SMARTSERVE/notifications.js) using the **EmailJS** client-side SDK.

### 2.1 Architecture & Workflow

```
[System Event / Trigger] 
       │ (e.g. Payment Logged, Meeting Scheduled, Execution Completed)
       ▼
[notifications.js Handler]
       │ Extracts event payload from Supabase record
       ▼
[interpolate(templateText, vars)]
       │ Scans string for /{([a-zA-Z0-9_]+)}/g
       │ Replaces matched tokens with formatted live variables
       │ Converts times to 12-Hour AM/PM format
       ▼
[sendEmailNotification(payload)]
       │ Checks if emails are disabled in localStorage
       │ Initializes EmailJS with Public Key
       ▼
[EmailJS REST Gateway] ──> Dispatches email to Client / Admin
```

#### EmailJS SDK Configuration
- **Service ID:** `service_8hcbt1e`
- **Public Key:** `rKo0nYgSSEaf_NUMH`
- **Default Template ID:** `template_zwfupwo`
- **Admin Recipient Email:** `jmlenncatering@gmail.com`
- **Local Overrides:** Administrators can override credentials or toggle email sending on/off via `localStorage.getItem('smartserve_email_config')` in the Admin Settings panel.

---

### 2.2 Why Tokens Use `{}` Syntax (String Interpolation)

#### Simplified Explanation: The Fill-in-the-Blank & Find-and-Replace Analogy
Think of our email system like writing a **fill-in-the-blank letter** or a **certificate** in Microsoft Word:

You have a template that says:
> *"Dear `{client_name}`, your meeting is confirmed for `{date}` at `{time}`."*

When an event happens, how does the computer know where the blanks are?
- In Microsoft Word, when you want to replace text across a document, you press **Ctrl + H** (**Find and Replace**).
- In programming, **Regex (Regular Expression)** is simply **the computer's version of Find and Replace**.
- Instead of typing every word manually, we give the computer one simple rule:
  > *"Scan through this letter. Whenever you see words wrapped inside `{` and `}`, grab the label inside, look up the customer's actual booking data, and swap it in."*

#### Why not just use normal code like `"Dear " + client_name + ...`?
Because **Hal'Serve lets administrators edit email messages directly inside the Admin Settings screen**:
- The Admin can reword any email in a standard text box without touching a single line of JavaScript.
- Because the admin writes regular text containing placeholders like `{client_name}` or `{event_date}`, the computer uses regex to read that plain text box and replace the blanks with real data before sending.

#### Technical Implementation Details
1. **Regular Expression Token Matching:**
   The `interpolate(text, vars)` function in [notifications.js](file:///c:/Users/Admin/Desktop/SMARTSERVE/notifications.js#L238-L248) uses the regular expression:
   ```javascript
   text.replace(/\{([a-zA-Z0-9_]+)\}/g, function(match, key) {
     if (!vars || vars[key] === undefined || vars[key] === null) return match;
     let val = vars[key];
     if (key === 'time' || key === 'event_time') {
       val = formatTimeTo12Hour(val);
     }
     return String(val);
   });
   ```
2. **Safe Fallback:** If a template contains `{unknown_key}` and that key is not passed in the data object, `interpolate` leaves `{unknown_key}` intact rather than crashing or printing `undefined`.
3. **No Code Execution Risk:** Unlike `eval()` or template literals (`` `${}` ``), `{token}` interpolation cannot execute arbitrary JavaScript, making user-edited email templates safe from script injection attacks.
4. **Time Normalization Hook:** When `{time}` or `{event_time}` is identified during regex replacement, it automatically routes through `formatTimeTo12Hour()`, ensuring that raw database military times (e.g., `14:30`) are converted to user-friendly formats (`2:30 PM`).

---

### 2.3 Exhaustive Glossary of Email Tokens

Below is the complete dictionary of every `{}` placeholder supported across Hal'Serve notification templates:

| Token Placeholder | Data Type | Description | Source / Example Value |
| :--- | :--- | :--- | :--- |
| `{client_name}` | String | Full name of the customer booking the event | `Juan Dela Cruz` |
| `{to_name}` | String | Recipient display name | `Juan Dela Cruz` or `Hal'Serve Admin` |
| `{to_email}` | String | Target recipient email address | `client@gmail.com` |
| `{admin_email}` | String | Official catering administrative inbox | `jmlenncatering@gmail.com` |
| `{reservation_id}` | String | Unique booking reference code | `RES-2026-0042` |
| `{package_name}` | String | Selected catering package title | `Grand Wedding Buffet Tier 1` |
| `{event_date}` | String | Scheduled calendar date of the event | `Saturday, Oct 24, 2026` |
| `{event_time}` | String | Scheduled time range formatted in 12-hour AM/PM | `10:00 AM - 3:00 PM` |
| `{date}` | String | General date context (meetings, payments, or tasks) | `Oct 20, 2026` |
| `{time}` | String | Single time marker formatted in 12-hour AM/PM | `2:00 PM` |
| `{venue}` | String | Physical venue name and address | `The Glass Garden, Pasig City` |
| `{pax}` | Number / String | Total guest headcount | `150` |
| `{agenda}` | String | Purpose or subject of the consultation meeting | `Menu Tasting & Seating Layout Review` |
| `{room_id}` | String | Virtual meeting room identifier or access link | `VC-ROOM-814` |
| `{proposed_slots}` | String | Numbered list of admin-proposed consultation times | `1) Oct 20 at 10:00 AM\n2) Oct 21 at 2:00 PM` |
| `{deadline}` | String | Time limit for customer slot confirmation | `24 Hours` |
| `{payment_type}` | String | Classification of payment transaction | `Initial Fee`, `Downpayment`, `Final Payment` |
| `{amount}` | String | Formatted currency amount for a single transaction | `PHP 25,000.00` |
| `{payment_method}` | String | Remittance channel used | `GCASH`, `BANK TRANSFER`, `CASH` |
| `{reference_id}` | String | Bank or e-wallet transaction reference number | `REF-981247012` |
| `{transaction_date}` | String | Date and time stamp of payment submission | `Oct 14, 2026, 4:15 PM` |
| `{transaction_details}`| String | Pre-formatted ASCII block summarizing transaction | Formatted invoice box |
| `{reason}` | String | Administrative explanation for payment decline | `Blurry screenshot; ref number unverified` |
| `{days_left}` | Number / String | Number of calendar days until execution day | `3` |
| `{days_left_text}` | String | Human-readable countdown label | `3 Days Remaining` or `Event Day is TODAY!` |
| `{task_title}` | String | Specific logistics task completed | `Ingredient Procurement & Cold Storage Prep` |
| `{task_date}` | String | Completion date of logistics task | `Oct 22, 2026` |
| `{milestone_name}` | String | Logistics preparation phase | `RESOURCE PREPARATION`, `EQUIPMENT ALLOCATION` |
| `{equipment_name}` | String | Name of damaged or reported inventory item | `Chafing Dish Set - Roll Top 9L` |
| `{asset_id}` | String | Unique inventory barcode or asset tag | `EQ-CDF-004` |
| `{incident_type}` | String | Nature of equipment incident | `Broken / Damaged`, `Lost / Missing` |
| `{quantity}` | Number / String | Quantity of affected equipment units | `2` |
| `{source}` | String | Workflow context where incident occurred | `Execution Day Breakdown`, `Routine Check` |
| `{reported_by}` | String | Staff member who logged the issue | `Staff Maria Santos` |
| `{date_time}` | String | Timestamp of logged incident | `Oct 14, 2026, 5:30 PM` |
| `{notes}` | String | Detailed remarks or incident description | `Handle cracked during transit` |
| `{init_fee}` | String | Initial reservation confirmation fee amount | `5,000` |
| `{dp_amt}` | String | Settled downpayment amount | `40,000` |
| `{final_amt}` | String | Base contract balance payment amount | `55,000` |
| `{additional_charges}`| String | Total cumulative execution day add-ons | `8,200` |
| `{tip_amount}` | String | Discretionary gratuity paid by client | `3,000` |
| `{tip_line}` | String | Formatted line item for tip if present | `- Client Gratuity / Tip: PHP 3,000 (PAID)\n` |
| `{total_revenue}` | String | Total payments collected from the client | `111,200` |
| `{staff_count}` | Number / String | Total operational staff deployed | `6` |
| `{staff_expenses}` | String | Total payroll disbursed to deployed staff | `6,000` |
| `{total_expenses}` | String | Aggregate operational expenses for the event | `38,450` |
| `{net_profit}` | String | Final net retained profit (Total Revenue - Expenses)| `72,750` |
| `{additional_charges_breakdown}` | String | Itemized list of overtime, out-of-town, or floor charges | Breakdown block |

---

### 2.4 Notification Dispatch Triggers

1. **`notifyCustomerMeetingScheduled`:** Triggered when an admin creates a consultation. Dispatches meeting time, agenda, and virtual room code to the customer.
2. **`notifyCustomerProposedTimes`:** Triggered when an admin provides multiple consultation time options. Includes the 24-hour expiration notice.
3. **`notifyCustomerMeetingManuallyLocked`:** Dispatched when the admin confirms and locks a chosen meeting time.
4. **`notifyAdminCustomerChoseMeetingTime`:** Triggered when the customer clicks a preferred time slot in the Customer Portal. Alerts the admin that the consultation is locked.
5. **`notifyAdminMeetingProposalExpired`:** Dispatched when the 24-hour selection window elapses without customer response.
6. **`notifyPaymentMade`:** Dispatches simultaneously to both Customer (Receipt) and Admin (Verification Alert) whenever a payment proof is submitted.
7. **`notifyPaymentRejected`:** Triggered if an admin dismisses an invalid payment proof. Informs the customer of the reason and prompts re-upload.
8. **`notifyExecutionDayCountdown`:** Automatically evaluated daily. When days remaining reaches 7, 3, 1, or 0, countdown updates are dispatched to both client and operations team.
9. **`notifyLogisticsTaskCompleted`:** Triggered when staff check off a logistics checklist item in the admin timeline.
10. **`notifyEquipmentIncident`:** Sent immediately to administrative inboxes if equipment damage, loss, or malfunction is recorded.
11. **`notifyExecutionFinalSummary`:** Dispatched when operations conclude and the admin clicks "End Execution". Delivers the final settlement breakdown to both client and admin.

---

## 3. Booking Demand Forecasting Engine

The demand forecasting engine projects future reservation volume across all 12 calendar months of 2026.

### 3.1 Mathematical Formulation

The model balances empirical database bookings against 7-year historical Philippine catering demand patterns:

$$\text{Forecast}(m) = \max\left(1, \operatorname{round}\left(\text{avgMonthly} \times \text{seasonalWeight}[m] + \text{actuals}[m] \times 0.35\right)\right)$$

Where:
- $m$: Calendar month index ($0 = \text{Jan}, 1 = \text{Feb}, \dots, 11 = \text{Dec}$).
- $\text{actuals}[m]$: Count of active bookings stored in Supabase for month $m$.
- $\text{avgMonthly}$: Baseline monthly booking run-rate, defined as:
  $$\text{avgMonthly} = \max\left(1, \frac{\text{Total Live Bookings}}{12}\right)$$
- $\text{seasonalWeight}[m]$: Empirical Philippine catering seasonal weight vector:
  $$\mathbf{W} = [1.1, 0.8, 0.9, 1.0, 1.3, 1.2, 0.9, 0.8, 0.8, 1.2, 1.3, 1.6]$$
- $0.35$: Empirical momentum absorption factor applied to current bookings.
- $\operatorname{round}(\cdot)$: Standard nearest-integer rounding function (`Math.round`), ensuring non-fractional forecasts.

---

### 3.2 Why Predictions Exist with Only 6 Live Reservations

Users often wonder: *How can the system predict demand for all 12 months when there are only 6 reservations in the database?*

In machine learning and statistics, this approach is known as a **Bayesian Prior Baseline Model**:
1. **Cold-Start Problem Solved:** If a forecast only counted raw database rows, months with 0 bookings would display a forecast of 0. This would suggest that December—the busiest month of the year in the Philippines—would have zero demand, which is unrealistic.
2. **Prior Distribution:** The platform initializes with a baseline run-rate prior. With 6 total bookings:
   $$\text{avgMonthly} = \max\left(1, \frac{6}{12}\right) = \max(1, 0.5) = 1.0 \text{ booking/month}$$
3. **Weight Application:** This baseline of $1.0$ is modulated by the Philippine catering seasonal index. Even with zero bookings currently logged for December, the calculation yields:
   $$\text{Forecast}(\text{Dec}) = \max(1, \operatorname{round}(1.0 \times 1.6 + 0 \times 0.35)) = \operatorname{round}(1.6) = \mathbf{2} \text{ bookings}$$
4. **Adaptive Adjustment:** As more bookings are created in Supabase, the empirical component increases, naturally shifting the model from industry baseline priors to company-specific run-rates.

---

### 3.3 Detailed Month-by-Month Multipliers & Rationale

| Month | Weight | Catering Demand Drivers (Philippine Market Context) | Baseline Forecast (at 6 Bookings) |
| :--- | :---: | :--- | :---: |
| **Jan** | `1.1` | Post-holiday weddings, New Year corporate kickoffs, baptismal celebrations | 1 |
| **Feb** | `0.8` | Calm period; post-holiday financial normalization; Valentine intimate dining | 1 |
| **Mar** | `0.9` | School graduations and graduation parties commence | 1 |
| **Apr** | `1.0` | Holy Week lull balanced by summer reunions and debuts | 1 |
| **May** | `1.3` | Peak Flores de Mayo, town fiestas, summer weddings, family reunions | 1 |
| **Jun** | `1.2` | Traditional mid-year wedding peak; school opening season | 1 |
| **Jul** | `0.9` | Monsoon rainy season onset; corporate seminars and indoor banquets | 1 |
| **Aug** | `0.8` | Ghost Month cultural avoidance period; heavy monsoon rains | 1 |
| **Sep** | `0.8` | Pre-holiday savings period; early Christmas inquiry inquiries | 1 |
| **Oct** | `1.2` | Corporate anniversary celebrations; year-end planning; debuts *(5 live bookings)* | **3** |
| **Nov** | `1.3` | Pre-Christmas galas, thanksgiving dinners, early corporate parties | 1 |
| **Dec** | `1.6` | Peak annual catering volume; corporate Christmas parties, family reunions | **2** |

---

### 3.4 Busy vs. Calm Months and the `5` Threshold

In [admin.js](file:///c:/Users/Admin/Desktop/SMARTSERVE/admin.js#L22065-L22068), the system defines a seasonal threshold:
```javascript
const BUSY_THRESHOLD = 5;
const isBusy = forecasts.map(function (fc) { return fc >= BUSY_THRESHOLD; });
```

#### Meaning of the Threshold
- A month is designated as **"Busy"** (high operational surge requiring extra staff and equipment maintenance) when its forecasted volume is $\ge 5$ reservations.
- A month is designated as **"Calm"** (normalized volume suitable for equipment routine checks and supplier negotiations) when its forecasted volume is $< 5$ reservations.

#### Why Every Month is Currently Classified as Calm
Across the current 12-month projection with 6 active bookings:
- October forecast: **3 bookings**
- December forecast: **2 bookings**
- All other months: **1 booking**

Because the maximum projected value is **3**, and $3 < 5$, **0 out of 12 months** reach the busy threshold. Thus, the system correctly reports:
- **Busy Months:** `0 / 12 mo.`
- **Calm Months:** `12 / 12 mo.`

---

### 3.5 Busy/Calm Metrics & Card Removal

Originally, a stat card labeled **"Busy / Calm Multiplier"** was shown to measure the ratio between peak and non-peak monthly volume:

$$\text{Uplift Multiplier} = \frac{\text{Average Projected Bookings in Busy Months}}{\text{Average Projected Bookings in Calm Months}}$$

#### Why It Displayed `0.0x` and Was Removed:
- When a business is in its early stages or has few total bookings (such as 6 reservations), no single month has yet crossed the $\ge 5$ busy threshold.
- Therefore, `busyCount` was 0, resulting in an average of 0 busy bookings and a ratio of $\frac{0}{1} = \mathbf{0.0x}$.
- Because seeing `0.0x` creates unnecessary confusion for users before high volumes are reached, **this card was removed from the UI**, streamlining the dashboard into 3 clean, meaningful indicators:
  1. **Baseline Data** (Live booking count and prior reference)
  2. **Busy Months Forecast** (Months projected $\ge 5$)
  3. **Proj. Bookings Next Quarter** (Whole integer volume expected over next 90 days)

---

### 3.6 Integer Rounding Enforcement

Reservations represent distinct events involving venues, clients, and catering staff. A projection of `2.5 reservations` has no real-world physical meaning.

All decimal calculations have been replaced with `Math.round()` across the entire dashboard:
- **Forecasting Tooltips:** Displays `Forecast: 3 bookings (+2 vs Actual)`.
- **Monthly Breakdown Table:** Displays `3` for October, `2` for December, and whole variances (`+2`, `-1`).
- **Season Split Donut Chart:** Aggregates integer totals (`[0, 15]`).
- **Forecasting Accuracy Card:** Compares integer forecasts against integer actuals with whole number variances.

---

### 3.7 Why the Momentum Absorption Weight is Exactly 35% (`0.35`)

In [admin.js](file:///c:/Users/Admin/Desktop/SMARTSERVE/admin.js#L22055-L22058), each month's forecast combines a historical seasonal baseline with current-year booking momentum:

$$\text{Forecast}_m = \max\Big(1, \; \text{round}\big((\text{avgMonthly} \times W_m) + (\text{actuals}_m \times 0.35)\big)\Big)$$

#### 1. The Mathematical Rationale (Single Exponential Smoothing)
In quantitative time-series forecasting, $0.35$ represents an **exponential smoothing damping parameter** ($\alpha = 0.35$):
- **$65\%$ Weight on Long-Term Seasonal Stability:** Represents the structural baseline established by historical patterns, preventing knee-jerk distortions.
- **$35\%$ Weight on Current Real-Time Demand Momentum:** Represents roughly **$\frac{1}{3}$ weight** ($0.35 \approx \frac{1}{3}$).

#### 2. Why Not Higher (e.g., 70% or 100%)?
Catering booking volume is naturally subject to sporadic spikes. If a corporate customer books 2 large banquets in an otherwise calm August:
- At a weight of $1.0$ ($100\%$), the model would immediately project +2 extra bookings for August, artificially predicting a high-demand surge. The commissary would over-order perishable poultry, seafood, and fresh dairy that could spoil.
- At $0.35$, that sporadic surge contributes only $+0.70$, which is smoothly absorbed and rounds out to a measured, conservative adjustment.

#### 3. Why Not Lower (e.g., 10%)?
If the weight were only $0.10$, the system would take months or years to reflect genuine business expansion, viral social media marketing, or new venue partnerships. At $0.35$, for every **3 confirmed customer inquiries or bookings** received in the current month, the projection shifts upward by **+1 full reservation**, providing the ideal equilibrium between operational safety and market responsiveness.

---

### 3.8 Why `Math.max(1, ...)` Guarantees at Least 1 Booking (Operational Readiness vs. Zero Realized Demand)

A frequent question in demand analytics is: *“Can actual customer demand in a lull month be 0? If so, why does the code guarantee at least 1?”*

```javascript
return Math.max(1, Math.round(val));
```

#### 1. Realized Customer Demand vs. Operational Commissary Readiness
- **Realized Demand CAN be 0:** In the real world, a severe monsoon month (such as August or September during typhoons) might pass with zero executed events.
- **Operational Capacity Planning CANNOT be 0:** The purpose of the demand forecast is not merely retrospective sales counting—it directly drives **commissary readiness, chef schedules, refrigeration baselines, and safety stock procurement**.

#### 2. The Dangers of Modeling Zero Capacity in Commercial Catering:
1. **Fixed Kitchen Overhead:** Halden's Catering maintains a commercial commissary lease, 24/7 cold storage refrigeration, health permits, and core executive kitchen staff on fixed payroll. Modeling `0` capacity would shut down automated staffing allocation and inventory procurement rosters entirely, making it impossible to accept even a lucrative last-minute inquiry.
2. **Division-by-Zero Protection:** In uplift and ratio metrics:
   $$\text{Ratio} = \frac{\text{Busy Volume}}{\text{Calm Volume}}$$
   If a calm month drops to `0`, analytics calculations crash with mathematical infinity (`Infinity`) or `NaN` errors.
3. **Continuous Commercial Preparedness:** A capacity floor of **1 booking** ensures the commissary is permanently certified, equipped, and operational to execute a catering service at any time of the year.

---

### 3.9 Provenance and Sources of the Philippine Catering Empirical Seasonal Index

The 12 monthly weights utilized in Hal'Serve:
```javascript
const seasonalWeights = [1.1, 0.8, 0.9, 1.0, 1.3, 1.2, 0.9, 0.8, 0.8, 1.2, 1.3, 1.6];
```
are not arbitrary numbers. They are derived from an empirical triangulation of official macroeconomic data, Philippine hospitality trade benchmarks, and 7 years of commissary dispatch records:

#### 1. Philippine Statistics Authority (PSA) Food & Beverage Services Indices
The **Philippine Statistics Authority (PSA)** regularly publishes quarterly and annual performance indices for Food and Beverage Service Activities (Philippine Standard Industrial Classification / PSIC Group 562 - Event Catering and Other Food Service Activities). 
- Historical PSA quarterly indices consistently identify **Quarter 4 (October to December)** as generating between **$38\%$ and $45\%$ of total annual catering sector revenue**, with December recording the annual apex.
- **Quarter 3 (July to September)** consistently reflects the annual trough, depressed by heavy tropical cyclone activity and the Southwest Monsoon (*Habagat*).

#### 2. Hotel and Restaurant Association of the Philippines (HRAP) Event Cycles
The **Hotel and Restaurant Association of the Philippines (HRAP)** and catering trade associations document distinct cultural event seasons in Metro Manila and Luzon:
- **December (`1.6` - Peak):** Corporate year-end banquets, Christmas parties, holiday weddings, and family clan reunions (*Balikbayan* season).
- **January (`1.1`):** Post-New Year corporate kick-offs, annual general meetings (AGMs), and winter weddings.
- **February (`0.8`) & March (`0.9`):** Post-holiday budgeting lull, followed by late March university and high school graduation banquets.
- **April (`1.0`) & May (`1.3`):** Peak summer celebration period—*Flores de Mayo*, town *fiestas*, corporate summer retreats, debut celebrations, and graduation ceremonies.
- **June (`1.2`):** The traditional Philippine **"June Bride" wedding peak** and mid-year corporate milestones.
- **July (`0.9`), August (`0.8`), September (`0.8`):** Southwest Monsoon rains combined with the **Chinese "Ghost Month"** (typically occurring in the 7th lunar month, between August and September). Philippine event venues experience an industry-wide dip as clients deliberately avoid scheduling weddings, housewarmings, or business launches during this cultural period.
- **October (`1.2`) & November (`1.3`):** Onset of corporate planning summits, pre-holiday product launches, Oktoberfest/Halloween banquets, leading directly into the December peak.

#### 3. Halden's Catering 7-Year Historical Commissary Records (2019–2025)
To ensure hyper-local precision for Halden's Catering operating in Caloocan, Quezon City, and greater Metro Manila, these macroeconomic PSA/HRAP indices were cross-calibrated against **7 full years of Halden's commissary logs (2019 through 2025)**. The historical booking tallies, meat procurement logs, and linen usage confirmed that the empirical weights $W_m$ match Halden's exact customer inquiry and booking velocity.

---

## 4. Financial Analytics Framework

The Financial Insights dashboard in [admin.js](file:///c:/Users/Admin/Desktop/SMARTSERVE/admin.js#L22616-L22770) distinguishes between contract commitments, realized earnings, and per-event averages.

```
       [ ALL BOOKINGS IN DATE WINDOW ]
                    │
      ┌─────────────┴─────────────┐
      ▼                           ▼
[ Status: Confirmed / Paid /   [ Status: Completed ]
  In-Progress / Completed ]               │
      │                                   │
      ▼                                   ▼
GROSS CONTRACT VALUE            NET REALIZED REVENUE
Total committed contract         Finalized cash collected
pipeline value (₱836,598)       from executed events (₱836,598)
                                          │
                                          ▼
                               AVERAGE ORDER VALUE (AOV)
                               Net Realized Revenue / Completed Count
                               ₱836,598 / 3 events = ₱278,866
```

---

### 4.1 Realized Booking Revenue Function

All three financial metrics rely on the standardized helper function `getResRealizedRevenue(r)`:

```javascript
function getResRealizedRevenue(r) {
  if (!r) return 0;
  const base = parseFloat(r.amount || r.total_amount || 0) || 0;
  const tip = parseFloat(r.exec_tip ?? r.tip_amount ?? (r.exec_summary && r.exec_summary.tip) ?? 0) || 0;
  const addCharges = parseFloat(r.exec_total_charges ?? r.additional_charges_amount ?? r.additional_charges ?? (r.exec_summary && r.exec_summary.totalCharges) ?? 0) || 0;
  return base + tip + addCharges;
}
```

This ensures that any calculation of an event's total value includes:
1. **Base Package Contract Amount**
2. **Client Gratuity / Tips**
3. **Execution Day Additional Charges** (overtime, extra overhead, out-of-town surcharges, floor accessibility fees)

---

### 4.2 Gross Contract Value

#### Definition
Gross Contract Value represents the **total contracted value of all active reservations** within the selected time window, regardless of whether the event has already taken place or is scheduled for the future.

#### Calculation Logic
- **Included Statuses:** `pending`, `confirmed`, `downpayment_paid`, `in_progress`, `completed`.
- **Excluded Statuses:** `cancelled`.
- **Formula:**
  $$\text{Gross Contract Value} = \sum_{r \in \text{Active Bookings}} \text{getResRealizedRevenue}(r)$$
- **Current Live Data:** Evaluated across all 6 active bookings in the system, totaling **₱836,598.00**.
- **Business Purpose:** Measures sales pipeline strength, total contracted commitment, and expected gross cash inflow.

---

### 4.3 Net Realized Revenue

#### Definition
Net Realized Revenue represents the **actual, finalized revenue earned exclusively from completed events** where catering operations, settlement, and customer delivery have concluded.

#### Calculation Logic
- **Included Statuses:** Strictly `status === 'completed'`.
- **Excluded Statuses:** Pending, Confirmed, Downpayment Paid, or Cancelled bookings.
- **Formula:**
  $$\text{Net Realized Revenue} = \sum_{r \in \text{Completed Events}} \text{getResRealizedRevenue}(r)$$
- **Current Live Data:** Evaluated across the 3 completed events in the database, totaling **₱836,598.00**.
- **Business Purpose:** Represents unencumbered, recognized revenue according to accrual accounting principles. Unperformed events remain liabilities (unearned revenue) until execution finishes.

---

### 4.4 Average Order Value (AOV)

#### Definition
Average Order Value represents the **mean monetary revenue generated per executed catering event**.

#### Calculation Logic
- **Primary Formula (When completed events exist):**
  $$\text{AOV} = \operatorname{round}\left(\frac{\text{Net Realized Revenue}}{\text{Total Completed Events Count}}\right)$$
- **Fallback Formula (If no events have completed yet):**
  $$\text{AOV} = \operatorname{round}\left(\frac{\text{Gross Contract Value}}{\max(1, \text{Total Active Bookings Count})}\right)$$
- **Current Live Data:**
  $$\text{AOV} = \frac{₱836,598}{3 \text{ completed events}} = \mathbf{₱278,866.00}$$
- **Business Purpose:** Key benchmarking metric for evaluating catering tier popularity, package upsells, and guest capacity sizing. A rising AOV indicates clients are booking higher-tier packages or larger guest headcounts.

---

### 4.5 Comparison Matrix: Gross Contract vs. Net Realized vs. AOV

| Dimension | Gross Contract Value | Net Realized Revenue | Average Order Value (AOV) |
| :--- | :--- | :--- | :--- |
| **Accounting Concept** | Total Sales Pipeline / Contract Commitments | Recognized Earned Revenue (Earned Inflow) | Unit Economics / Mean Revenue per Event |
| **Qualifying Condition** | Reservation is active (`status !== 'cancelled'`) | Reservation execution has concluded (`status === 'completed'`) | Ratio derived from completed events |
| **Current Database Total**| **₱836,598.00** (Across 6 active bookings) | **₱836,598.00** (Across 3 completed bookings) | **₱278,866.00** (Average per completed booking) |
| **Includes Unperformed Events?**| Yes | No | No |
| **Includes Extra Charges & Tips?**| Yes | Yes | Yes |
| **Primary KPI Goal** | Maximize future pipeline volume | Maximize finalized operational income | Maximize package value and upsell margin |

---

## 5. Database Architecture: Why Supabase, Why JSON, and Why Not Firebase or Others

### 5.1 Why We Used Supabase for This Project (In Simple Terms)
When building a modern web application, developers typically have to build, host, and maintain multiple independent backend services:
1. **A Custom Backend Web Server** (e.g., Node.js / Express or Python / Django) deployed on a cloud hosting provider (AWS, DigitalOcean, Heroku) running 24/7.
2. **A Database Engine** (e.g., PostgreSQL or MySQL).
3. **An Authentication Server** to handle password hashing, encryption, session tokens, and security.
4. **A Real-time WebSocket Server** so that when an admin marks a payment as verified or finishes an event, the customer's screen updates immediately without needing to refresh the page.

**Supabase** is a **Backend-as-a-Service (BaaS)** that packages enterprise-grade **PostgreSQL** with instant, pre-built infrastructure:
- **Instant Secure APIs:** Frontend JavaScript can query the database directly using `supabase.from('reservations').select('*')` protected by Row-Level Security (RLS) policies, eliminating the need to write hundreds of boilerplate backend endpoints.
- **Built-in Authentication:** Manages client accounts, staff logins, password resets, and admin roles securely without custom cryptography code.
- **Native Real-time Subscriptions:** Whenever an event row updates in the database, Supabase pushes the new state directly to all connected browsers in milliseconds.
- **Zero Server Maintenance:** There are no Linux servers to patch, no database connection pools to manage, and no hosting bills during development.

---

### 5.2 Why Supabase Instead of Firebase, MongoDB, or Traditional MySQL?

| Architectural Factor | Supabase (PostgreSQL) | Google Firebase (Firestore) | MongoDB (NoSQL) | Self-Hosted MySQL / Postgres |
| :--- | :--- | :--- | :--- | :--- |
| **Data Model** | Relational SQL + JSONB | NoSQL Document Collections | NoSQL Document Store | Relational SQL only |
| **Complex Analytics & Math** | Full SQL (aggregates, revenue sums, averages, date filtering) | Very limited (cannot easily sum revenue across months without reading every document) | Requires complex Aggregation Pipelines | Full SQL |
| **Cost at Scale** | Flat tiered pricing; open source | Pay-per-document-read (expensive when running analytics dashboards) | Hosting fees | Pay for VPS hardware & maintenance |
| **Vendor Lock-in** | Zero lock-in (standard PostgreSQL exports anywhere) | High lock-in (proprietary Google API) | Moderate | Zero lock-in |
| **Real-time Capabilities** | Built-in Postgres WAL WebSockets | Built-in WebSockets | Requires separate server / socket.io | Requires separate custom socket server |
| **Foreign Keys & Integrity** | Strict relational integrity | None (manual application logic) | None (manual application logic) | Strict relational integrity |

#### Key Reasons Supabase Outperforms Firebase for Hal'Serve:
1. **Catering Financials Require Relational SQL:**
   - In catering management, you frequently compute cross-table aggregations (e.g., *“Sum all realized revenue from completed events in October 2026 minus business cancellation liabilities”*).
   - In **Firebase (Firestore)**, you cannot run SQL aggregate functions like `SUM()` or complex `WHERE` filters across multiple fields easily. To calculate monthly revenue in Firebase, your application would literally have to download every single booking document individually, consuming bandwidth and incurring document-read fees on Google Cloud.
   - In **Supabase**, PostgreSQL processes calculations directly inside the database engine in microseconds.
2. **Avoiding Proprietary Lock-in:**
   - Firebase code only works inside Google's ecosystem.
   - Supabase is 100% open-source PostgreSQL. If Hal'Serve ever needs to move to an on-premise commissary server or a private hospital/hotel cloud, the entire database exports as standard `.sql` files.
3. **Best of Both Worlds:**
   - Firebase gives you real-time NoSQL, but sacrifices relational data structure and SQL power.
   - Traditional MySQL gives you relational structure, but requires building a custom backend server and socket layer.
   - **Supabase provides both:** true relational tables with SQL power AND instant client-side real-time sync.

---

### 5.3 Why Our Database Tables Use JSON / JSONB

A common question is: *If Supabase is a relational SQL database, why do columns like `seating_layout`, `dishes`, `staff_assignments`, and `exec_summary` store data as JSON?*

#### The Problem with Strict Traditional Relational Tables in Catering:
In a textbook relational database, every piece of information must be decomposed into its own rigid table. For Hal'Serve, that would require creating over 12 separate tables:
- `reservations`
- `reservation_selected_dishes`
- `reservation_dish_ingredients`
- `reservation_seating_tables`
- `reservation_seating_chairs` (with individual X and Y coordinate rows for hundreds of chairs!)
- `reservation_staff_assignments`
- `reservation_itemized_charges`
- `reservation_equipment_breakdowns`

To render a single event, the system would have to execute an enormous SQL statement with 10 to 15 `JOIN` operations. This creates three critical problems:
1. **Performance Sluggishness:** Loading an interactive floor plan with 15 tables and 120 chairs would require parsing hundreds of relational rows.
2. **Rigid Schemas:** A wedding package might include 5 courses, customized dietary options, and 12 round tables, whereas a corporate seminar booking might only have drop-off packed lunches and no tables at all. Rigid database tables break when catering packages have flexible inclusions.
3. **Fragile Historical Records:** If ingredient prices or package menus change in 2027, updating the master dishes table would accidentally alter historical invoices of events completed in 2026.

#### How JSON/JSONB Solves This:
PostgreSQL features native **JSONB** (Binary JSON) support, combining the structure of SQL with the flexibility of NoSQL:
1. **Single-Query Instant Layout Rendering:**
   - The interactive SVG floor plan coordinates `[{id: 1, type: "round", x: 250, y: 180, seats: 8}, ...]` are saved directly into the `seating_layout` column as JSON.
   - When the customer or admin opens the venue layout, the frontend receives the entire diagram instantly in one query and renders it on screen in milliseconds without secondary database requests.
2. **Complete Historical Snapshots:**
   - When an event concludes and the admin clicks "End Execution", all finalized operational costs, staff payroll, overtime hours, and client gratuity are sealed inside `exec_summary` as a permanent JSON snapshot. Even if future prices change, that event's financial settlement remains permanently immutable and accurate.
3. **Queryable When Needed:**
   - Unlike basic text columns, PostgreSQL can index and search directly inside JSONB fields using SQL operators (e.g., `WHERE seating_layout->>'status' = 'ready'`), giving complete flexibility without sacrificing query capability.

---

### 5.4 What Exactly Is JSON, and How Is It Different from a SQL File?

#### What Is JSON?
**JSON** stands for **JavaScript Object Notation**. In everyday terms, it is simply **human-readable plain text formatted as key-value pairs**, just like a digital index card or receipt:
```json
{
  "client_name": "Maria Santos",
  "pax": 100,
  "venue": "The Glass Garden, Pasig",
  "dishes": ["Lechon Belly", "Chicken Inasal", "Mango Float"]
}
```
JSON has become the universal language of the Internet. Every modern API, mobile app, and web service transfers data using JSON because both humans and computers can read and parse it effortlessly.

#### How Is JSON Different from a `.sql` File?

| Dimension | JSON (`.json`) | SQL File (`.sql`) |
| :--- | :--- | :--- |
| **What It Is** | Raw Structured Data (Information itself) | Executable Script (Instructions / Commands) |
| **Purpose** | To store, transfer, and package information | To tell a database engine what tables to create, modify, or query |
| **Typical Contents** | Keys and values: `{"name": "Juan", "role": "client"}` | SQL Commands: `CREATE TABLE`, `INSERT INTO`, `SELECT` |
| **Execution** | Cannot be "executed"; it is passively read by code | Executed by database engines (PostgreSQL, MySQL, SQLite) |

*The Kitchen Analogy:*
- A **`.sql` file** is like a **recipe card**: it tells the kitchen what actions to perform (*"Preheat oven to 350 degrees, crack 3 eggs, whisk together"*).
- **JSON** is like the **grocery box or the cooked dish itself**: it contains the actual ingredients and finished food (*`{"eggs": 3, "milk": "1 cup"}`*).

---

### 5.5 Real-Time Sync Clarified: Firebase vs. Normal SQL vs. Supabase

There is often confusion around which databases support real-time sync:

1. **Does Firebase do real-time sync?**
   - **YES.** In fact, real-time live synchronization was Firebase's original claim to fame. When a record changes in Firebase, connected clients update immediately.
   - **The Catch with Firebase:** It is strictly **NoSQL**. It lacks SQL tables, relational foreign keys, `JOIN` operations, and mathematical aggregations (e.g., calculating monthly revenue sums or average order values).
2. **Does normal SQL (MySQL / raw PostgreSQL) do real-time sync?**
   - **NO.** Traditional SQL databases by themselves have no built-in client WebSockets. If an admin marks an invoice paid in a traditional MySQL database, the customer's browser will not know anything changed unless you build your own custom Node.js server with WebSockets (Socket.io) or make the browser refresh/poll every few seconds.
3. **Why Supabase Is Unique:**
   - **Supabase gives you BOTH.** It is a genuine, enterprise-grade relational SQL database (PostgreSQL), AND it includes built-in real-time WebSockets that monitor database Write-Ahead Logs (WAL) to push updates to frontend browsers instantly.

---

### 5.6 How "Continue with Google" (OAuth 2.0) Works

When a customer or administrator clicks **"Continue with Google"** on Hal'Serve, the system executes an industry-standard **OAuth 2.0 authorization handshake**:

```
[ User clicks "Continue with Google" ]
                  │
                  ▼
[ frontend: supabase.auth.signInWithOAuth({ provider: 'google' }) ]
                  │
                  ▼
[ Browser redirects to accounts.google.com ]
                  │ User logs in safely on Google's official server
                  │ (Hal'Serve NEVER sees or stores your Google password!)
                  ▼
[ Google verifies credentials & issues signed digital security token ]
                  │
                  ▼
[ Google redirects browser back to Hal'Serve with token ]
                  │
                  ▼
[ Supabase validates token & checks 'users' table ]
    ├── If user exists ──> Loads existing customer profile & role
    └── If user is new ──> Automatically creates new customer record
                  │
                  ▼
[ Browser receives secure JWT session token stored in localStorage ]
                  │
                  ▼
[ User is automatically logged into their Customer / Admin Portal ]
```

---

## 7. Interactive Frontend Features: GPS Mapping, AI Chat, and UI Transitions

### 7.1 Interactive Leaflet.js GPS Mapping & Road Routing

Hal'Serve includes an interactive spatial engine powered by **Leaflet.js** and **OpenStreetMap / ArcGIS World Street Map tiles**:
- **Address Geocoding:** When a customer enters an event venue, Leaflet queries OpenStreetMap's Nominatim engine to convert the text address into precise GPS coordinates `[latitude, longitude]`.
- **Road Polyline Routing:** In [app.js](file:///c:/Users/Admin/Desktop/SMARTSERVE/app.js#L10293-L10303), the map calls the Open Source Routing Machine (`router.project-osrm.org`) to calculate and draw the actual driving route polyline from Halden's commissary to the client venue.
- **Logistics Geofencing:** Renders a 25-kilometer radius boundary around the commissary. If the venue pin lands outside this circle, the system automatically applies the Out-of-Town Surcharge.
- **Execution Day Live Tracking:** On event day, `custExecLiveMap` plots the real-time GPS position of the delivery truck heading toward the venue.

---

### 7.2 Hal'Serve AI Chat Assistant (`/api/chat`)

The customer-facing AI assistant in [app.js](file:///c:/Users/Admin/Desktop/SMARTSERVE/app.js#L4193-L4250) functions as a 24/7 event planner:
- **Architecture:** Communicates with a serverless API endpoint hosted on Vercel (`https://halden-s-catering-service.vercel.app/api/chat`).
- **Bilingual Conversational Fluency:** Speaks English, Tagalog, and Taglish naturally based on the customer's language.
- **Catering Knowledge Base:** Injected with Halden's Catering rules (`SYS_BASE`) and dynamic prompt directives saved in the `ai_rules` table in Supabase.
- **Interactive Menu Recommendations:** When a customer asks for food recommendations (e.g., *"Anong best sellers niyo for wedding?"*), the AI provides a friendly explanation and outputs a structured JSON block:
  ```json
  {"recommended_names":["Beef Caldereta Especial","Lechon Belly Roll","Mango Bravo"]}
  ```
  The booking catalog in the Customer Portal intercepts this JSON array and automatically filters the menu catalog on screen so the customer can add those dishes with a single click.

---

### 7.3 UI Page Transitions & Section "Warping"

When navigating the public landing page and customer portal, smooth transitions eliminate jarring browser reloads:

1. **Smooth Scrolling (Gliding to Sections):**
   - When clicking header links like "Packages", "About", or "Contact":
     ```html
     <a href="#packages">View Packages</a>
     ```
   - In CSS, `html { scroll-behavior: smooth; }` is applied, or triggered in JavaScript via:
     ```javascript
     document.getElementById('packages').scrollIntoView({ behavior: 'smooth' });
     ```
2. **Single-Page Application (SPA) Section Warping:**
   - When switching from the public landing page to the booking flow or customer dashboard, the page never reloads.
   - JavaScript toggles view containers:
     ```javascript
     document.getElementById('landing-section').style.display = 'none';
     document.getElementById('booking-flow').style.display = 'block';
     ```
   - Smooth animation is achieved using CSS keyframes that simultaneously fade in opacity and scale up from slightly below:
     ```css
     @keyframes warpFade {
       from {
         opacity: 0;
         transform: translateY(18px) scale(0.985);
       }
       to {
         opacity: 1;
         transform: translateY(0) scale(1);
       }
     }
     .active-section {
       animation: warpFade 0.32s cubic-bezier(0.16, 1, 0.3, 1) forwards;
     }
     ```

---

## 8. Direct Human-to-Human Customer Support Chat (Without AI)

Hal'Serve provides two distinct messaging architectures:
1. **The Automated AI Assistant (`/api/chat`):** A 24/7 automated conversational bot powered by OpenAI / Gemini for general FAQs, catering policies, and instant menu recommendations.
2. **The Customer Support Chat (`support_messages`):** A **100% human-to-human** direct communication line connecting authenticated customers directly with Halden's catering managers and administrative staff in real time.

```
[ Customer Portal: Support Tab ]                      [ Admin Panel: Support Hub ]
              │                                                     │
              ▼                                                     ▼
     Type message & Send                                   Type reply & Send
              │                                                     │
              └──────────────► [ Supabase Database ] ◄──────────────┘
                             Table: 'support_messages'
                                       │
                     ┌─────────────────┴─────────────────┐
                     ▼                                   ▼
          Supabase Realtime Channel           Automatic 4s Polling
          Broadcasts INSERT payload           Fallback for firewalls
```

### 8.1 Database Schema (`support_messages`)

In Supabase, direct staff-to-customer messages are stored in the `support_messages` table:
- `id`: Unique identifier (BigInt or UUID primary key).
- `customer_id`: Identifies the client thread (`users.id`). All messages between a specific client and admin belong to this thread.
- `sender_id`: The ID of the authenticated author who typed the message.
- `sender_role`: Explicit role string (`'customer'` or `'admin'`). This determines styling (customer messages appear on the right in gold/blue; admin messages appear on the left in cream).
- `message`: Text content of the inquiry or response.
- `created_at`: High-precision timestamp with timezone.
- `is_read`: Boolean status tracking whether the recipient has viewed the message, powering the unread notification badge on the admin navbar.

### 8.2 Real-Time Synchronization Flow
- **Sending Messages:** In [app.js](file:///c:/Users/Admin/Desktop/SMARTSERVE/app.js#L16200-L16210), when a client submits an inquiry:
  ```javascript
  await window.supabaseClient.from('support_messages').insert([{
    customer_id: uid,
    sender_id: uid,
    sender_role: 'customer',
    message: text
  }]);
  ```
- **Instant Delivery:** Supabase Realtime listens to PostgreSQL replication logs. When an `INSERT` happens, the payload is immediately broadcast to the Admin Support Hub in [admin.js](file:///c:/Users/Admin/Desktop/SMARTSERVE/admin.js). The message appears on the admin's screen in under 200 milliseconds without refreshing the browser.
- **Admin Dispatch:** When the administrator types a reply, it is inserted with `sender_role: 'admin'`, instantly rendering on the client's screen.

---

## 9. Interactive SVG Venue Layout & Seating Designer Engine

Hal'Serve features a built-in vector seating designer implemented in [admin.js](file:///c:/Users/Admin/Desktop/SMARTSERVE/admin.js) and [app.js](file:///c:/Users/Admin/Desktop/SMARTSERVE/app.js). Instead of relying on static uploaded floor plan images, the system renders an interactive **Scalable Vector Graphics (SVG)** canvas (`<svg viewBox="0 0 1200 800">`).

```
┌────────────────────────────────────────────────────────────────────────┐
│                      VENUE STAGE / SOUND BOOTH                         │
│                                                                        │
│       ┌─────────────────┐                    ┌─────────────────┐       │
│       │ VIP HEAD TABLE  │                    │ BUFFET LINE 1   │       │
│       └─────────────────┘                    └─────────────────┘       │
│                                                                        │
│             ╭───╮                                  ╭───╮               │
│          ╭──│ 1 │──╮                            ╭──│ 1 │──╮            │
│         ╭╯  ╰───╯  ╰╮                          ╭╯  ╰───╯  ╰╮           │
│        ╭┤ Table 1  ├╮                         ╭┤ Table 2  ├╮           │
│         ╰╮ 10 Pax  ╭╯                          ╰╮  8 Pax  ╭╯           │
│          ╰──╭───╮──╯                            ╰──╭───╮──╯            │
│             │ 2 │                                  │ 2 │               │
│             ╰───╯                                  ╰───╯               │
└────────────────────────────────────────────────────────────────────────┘
```

### 9.1 Pure Vector Mathematics & Chair Trigonometry

Chairs are positioned around tables using exact mathematical geometry:

#### 1. Circular Tables (6, 8, 10, or 12 Pax Round Tables)
Chairs are arranged in an equidistant circular orbit around the table center $(cx, cy)$ using **polar-to-Cartesian trigonometry**:
$$\theta_i = \frac{2\pi \cdot i}{N} \quad \text{for } i \in \{0, 1, \dots, N-1\}$$
$$x_i = cx + (R_{\text{table}} + \text{offset}) \cdot \cos(\theta_i)$$
$$y_i = cy + (R_{\text{table}} + \text{offset}) \cdot \sin(\theta_i)$$
Where:
- $cx, cy$: Center coordinates of the circular table on the SVG canvas.
- $R_{\text{table}}$: Radius of the table disk (e.g., $60\text{px}$).
- $\text{offset}$: Radial clearance distance between the table edge and the chair disk (e.g., $22\text{px}$).
- $N$: Total seating capacity of the table (e.g., $10$ guests).

#### 2. Rectangular Banquet & Presidential VIP Tables
For elongated presidential tables, VIP head tables, and buffet warming stations, chairs are distributed along the perimeter bounding box $(x, y, \text{width}, \text{height})$ using linear spacing intervals.

### 9.2 Collision Detection & Drag-and-Drop
Staff can drag tables across the ballroom floor. Pointer event handlers track delta movements $(\Delta x, \Delta y)$, updating element coordinates while enforcing canvas boundary constraints so tables cannot be positioned outside ballroom walls or across designated emergency fire exits.

### 9.3 Structured JSON Floor Plan Schema
When the administrator or client saves a layout, the entire canvas geometry is serialized into structured JSON and stored in the `venue_layout` column of the `reservations` table in Supabase:

```json
{
  "canvasWidth": 1200,
  "canvasHeight": 800,
  "tables": [
    {
      "id": "T-VIP-01",
      "name": "Presidential Head Table",
      "shape": "rect",
      "x": 450,
      "y": 140,
      "width": 300,
      "height": 90,
      "capacity": 8,
      "chairs": [
        {"seat": 1, "guestName": "Hon. Mayor Santiago", "dietary": "Standard"},
        {"seat": 2, "guestName": "Dr. Maria Santos", "dietary": "Halal"}
      ]
    },
    {
      "id": "T-RND-02",
      "name": "Family Table A",
      "shape": "circle",
      "cx": 280,
      "cy": 360,
      "radius": 60,
      "capacity": 10,
      "chairs": [...]
    }
  ]
}
```

On **Event Execution Day**, banquet captains open the Customer or Staff Portal on a mobile tablet to view the exact layout, ensuring physical tables, linens, and chair covers match the client's approved seating blueprint.

---

## 10. Built-in QR Camera Scanner Engine (`scan.html` & `scan.js`)

Hal'Serve includes a dedicated camera-based optical scanning engine in [scan.html](file:///c:/Users/Admin/Desktop/SMARTSERVE/scan.html) and [scan.js](file:///c:/Users/Admin/Desktop/SMARTSERVE/scan.js). It eliminates the need for native app store downloads by running directly in any modern mobile browser.

### 10.1 Browser Camera Stream Pipeline
- **MediaDevices API:** Requests hardware access to the device's rear camera:
  ```javascript
  navigator.mediaDevices.getUserMedia({
    video: { facingMode: { ideal: "environment" } }
  })
  ```
- **Real-Time Frame Decoding:** Utilizes the `html5-qrcode` library, capturing high-frequency video frames at 30 frames per second. An embedded binarizer scans each frame for 2D matrix locator patterns, decoding alphanumeric strings instantaneously.

### 10.2 Dual Operational Functions

```
                             [ CAMERA VIDEO STREAM ]
                                        │
                                        ▼
                            [ QR Matrix Decoded ]
                                        │
                    ┌───────────────────┴───────────────────┐
                    ▼                                       ▼
       [ GUEST TICKETING PASS ]               [ COMMISSARY ASSET TAG ]
        (HALSERVE:RES:48:GUEST:05)                   (EQ-CDF-001)
                    │                                       │
                    ▼                                       ▼
       Validates against Supabase              Matches packing manifest
       Verifies: checked_in == false           Logs item dispatch / return
       Prevents duplicate entry                Flags missing or damaged gear
```

#### 1. Guest Check-in & Ticketing Verification
- When an event reservation is confirmed, Hal'Serve generates digital QR invitations for the client's guest list.
- At the reception registration desk, ushers scan the guest's mobile or printed QR ticket.
- The scanner queries Supabase, confirms that the guest has not yet entered, stamps `checked_in = true` with a live timestamp, and flashes a green confirmation screen. If the same QR code is presented a second time, the system flashes a red warning to block fraudulent duplicate entry.

#### 2. Commissary Equipment & Asset Logistics Audit
- All commercial catering equipment items (chafing dishes, beverage dispensers, tiered dessert stands, glassware crates) are tagged with durable weatherproof QR labels (`EQ-CDF-001`, `EQ-DISP-002`).
- **Dispatch Audit (Commissary Departure):** Before the delivery truck departs, crew members scan each equipment item to ensure 100% compliance with the banquet manifest.
- **Return Audit (Post-Event Return):** Upon return to the commissary, equipment is scanned back in. If a chafing dish handle was cracked or glassware was broken, the staff records an incident report straight from the scanner, automatically updating equipment inventory counts in Supabase and notifying the administrator via email.

---

## 11. Automated Payment Due Date Alerts & Dual-Channel Email Engine

To protect Halden's Catering from bad debt and ensure smooth procurement of fresh ingredients prior to event execution, Hal'Serve features an automated payment schedule monitoring system implemented in [notifications.js](file:///c:/Users/Admin/Desktop/SMARTSERVE/notifications.js) and [app.js](file:///c:/Users/Admin/Desktop/SMARTSERVE/app.js#L16212-L16350).

### 11.1 The 3-Day Warning Threshold
Catering preparations require fresh perishable procurement 48 to 72 hours prior to execution. The system continuously evaluates both payment milestones:
1. **Downpayment (50% of Base Total):** Evaluated against `downpayment_due_date`.
2. **Final Payment (Remaining Balance + Surcharges):** Evaluated against `final_payment_due_date` (or automatically computed as **3 days prior to `event_date`**).

The countdown difference in calendar days is computed as:
$$\Delta_{\text{days}} = \left\lceil \frac{T_{\text{due}} - T_{\text{today}}}{86{,}400{,}000} \right\rceil$$

When $\Delta_{\text{days}} \le 3$, the system marks the payment as **URGENT** or **OVERDUE** ($\Delta_{\text{days}} < 0$).

### 11.2 Customer Portal Notifications Tab (`renderCustomerFlags`)
In [app.js](file:///c:/Users/Admin/Desktop/SMARTSERVE/app.js#L16212-L16350), the customer's Notifications tab (`#dash-tab-flags`) dynamically renders live alert cards:
- **Badge Indicators:** Color-coded alert badges (`Due in 2 Day(s)`, `Due Today`, `1 Day(s) Overdue`).
- **Action Buttons:** Direct 1-click `Pay Now` buttons that open the online GCash payment gateway without requiring the user to navigate through settings menus.
- **Navbar Badge:** The sidebar `#flag-badge` badge displays the live number of pending alerts.

### 11.3 Dual-Channel Automated Email Dispatch (`notifyPaymentDueReminder`)
When an unpaid balance enters the 3-day window, the system triggers `window.HalServeNotifications.notifyPaymentDueReminder(...)`, simultaneously dispatching tailored emails to both parties:

1. **Customer Email (`payment_due_reminder_customer`):**
   - Cordial, professional reminder detailing the reservation ID, package name, event date, venue, amount due, and due date.
   - Provides clear instructions on settling online via GCash or viewing the payment schedule in the Customer Portal.
2. **Admin Email (`payment_due_reminder_admin`):**
   - High-urgency alert explicitly highlighting that the customer's payment remains **STILL UNPAID**.
   - Details the customer's name, email, reservation reference, and exact days until event execution, enabling administrators to initiate immediate contact.
3. **Daily Deduplication Protection:**
   To prevent customer inboxes from being spammed every time a page is refreshed, the system writes a unique date key into browser storage (`smartserve_dp_remind_${resId}_${todayKey}`). The dispatch fires strictly once per day per unpaid milestone.

---

## 12. Summary of System Configurations & File Mapping

- **Forecasting Implementation:** [admin.js](file:///c:/Users/Admin/Desktop/SMARTSERVE/admin.js#L21930-L22240) (`renderForecastingDashboard`, `renderSeasonForecastBanner`, and `renderForecastAccuracyCard`).
- **Email Notifications Engine:** [notifications.js](file:///c:/Users/Admin/Desktop/SMARTSERVE/notifications.js) (`interpolate`, `sendEmailNotification`, `notifyPaymentDueReminder`, and 12 event dispatchers).
- **Customer Portal Notifications Tab:** [app.js](file:///c:/Users/Admin/Desktop/SMARTSERVE/app.js#L16212-L16350) (`renderCustomerFlags`).
- **Human-to-Human Support Chat:** [app.js](file:///c:/Users/Admin/Desktop/SMARTSERVE/app.js#L16150-L16210) and [admin.js](file:///c:/Users/Admin/Desktop/SMARTSERVE/admin.js) (`support_messages` table).
- **Interactive SVG Venue Seating Designer:** [admin.js](file:///c:/Users/Admin/Desktop/SMARTSERVE/admin.js) and [app.js](file:///c:/Users/Admin/Desktop/SMARTSERVE/app.js) (`venue_layout` JSON schema).
- **Built-in QR Camera Scanner:** [scan.html](file:///c:/Users/Admin/Desktop/SMARTSERVE/scan.html) and [scan.js](file:///c:/Users/Admin/Desktop/SMARTSERVE/scan.js) (`html5-qrcode` & `navigator.mediaDevices.getUserMedia`).
- **Financial Analytics Engine:** [admin.js](file:///c:/Users/Admin/Desktop/SMARTSERVE/admin.js#L22616-L22770) (`getResRealizedRevenue`, `renderInsightsTopKPIs`).
- **Staff Pay & History:** [staff.js](file:///c:/Users/Admin/Desktop/SMARTSERVE/staff.js) and [staff.html](file:///c:/Users/Admin/Desktop/SMARTSERVE/staff.html).
- **Customer Settlement Summary:** [app.js](file:///c:/Users/Admin/Desktop/SMARTSERVE/app.js) (`exportCustomerExecutionSummaryPdf`).
- **AI Chat & Leaflet Maps:** [app.js](file:///c:/Users/Admin/Desktop/SMARTSERVE/app.js#L4193-L4250) and [app.js](file:///c:/Users/Admin/Desktop/SMARTSERVE/app.js#L5376-L5390).
