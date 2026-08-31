# Feature: Venue Location Unification & Map Auto-Population

The goal of this change is to unify the terminology across the application by renaming "City" to "Venue Location" (both in the UI and the Supabase database), and restricting customers from manually altering the Venue Location by forcing the map selection to auto-populate the field.

## User Review Required
> [!WARNING]
> This plan includes renaming a column in the live Supabase database. You will need to manually run an SQL command in your Supabase SQL Editor. I will provide the SQL file for you.

## Proposed Changes

---
### Database Changes (Supabase)

#### [NEW] rename_city_column.sql
Create a script containing the exact SQL command you must run in your Supabase SQL Editor:
```sql
ALTER TABLE public.reservations RENAME COLUMN city TO venue_location;
```

#### [MODIFY] supabase_adapter.js
Update the adapter to map the new database column `venue_location` to the frontend JavaScript property `venueLocation` instead of `city`.
- Replace instances of `city` with `venue_location` in `allowedKeys`.
- Translate `venueLocation` -> `venue_location` in `mapToDB`.
- Translate `venue_location` -> `venueLocation` in `mapFromDB`.

---
### Public Portal (Custom Package Builder)

#### [MODIFY] index.html
- Rename the label "City" to "Venue Location" in the Custom Package builder panel.
- Change `id="cpkg-city"` to `id="cpkg-venue-location"` and add the `disabled` property to the dropdown so users cannot manually click and change it.
- Rename the data insights label from "City" to "Venue Location" and update `bs-city` to `bs-venue-location`.

#### [MODIFY] app.js
- Rename all references of `city` to `venueLocation` across variables, array keys, and cart items (`pkg.city` -> `pkg.venueLocation`, `res.city` -> `res.venueLocation`, etc.).
- Update ID references from `cpkg-city` to `cpkg-venue-location`.
- Update the Map `confirmLocation()` function: When the customer confirms a pinned location on the map, parse the returned location name via regex to extract the NCR city, and automatically update the `cpkg-venue-location` dropdown value.

---
### Admin Portal

#### [MODIFY] admin.js
- Rename the global variable `mtCity` to `mtVenueLocation`.
- Rename `res.city` references to `res.venueLocation` when loading the reservation into the Meeting Mode panel (line ~1920) and in any other reservation rendering functions.
- In the Meeting Mode panel HTML template (`<!-- City Dropdown -->` block, lines ~2808–2815):
  - Change the `<label>City</label>` to `<label>Venue Location</label>`.
  - Add `id="mt-venue-location-select"` to the `<select>` element.
  - Remove the `onchange="mtCity=this.value"` handler and replace it with nothing (the field will be read-only).
  - Add `disabled style="opacity:0.6; cursor:not-allowed;"` so the admin cannot manually alter it — it must be auto-populated by the map, identical to the public portal restriction.
- Update `confirmMtLocation()` (line ~3018): After setting `mtVenue` and updating `mt-venue-display`, add the same NCR city-parsing regex used by `confirmLocation()` in `app.js`. Match the confirmed location string against the list of NCR cities and auto-set `mtVenueLocation` and update the `mt-venue-location-select` dropdown's value.
- Update `saveMtModePackage()` (line ~2574): Change the Firestore update key from `city: mtCity` to `venueLocation: mtVenueLocation` so it persists the correct field name that the supabase adapter now expects.

## Verification Plan

### Manual Verification
1. I will ask you to run the SQL script in your Supabase Dashboard.
2. I will apply all frontend codebase changes.
3. You will open `index.html`, select a package, and observe that "City" is now "Venue Location" and is greyed out.
4. You will open the map, search for "Trinoma, Quezon City", confirm the map selection, and see that the "Venue Location" dropdown automatically updates to "Quezon City".
5. You will open `admin.html`, enter Meeting Mode on a reservation, and verify:
   - The "City" label is now "Venue Location" and the dropdown is greyed out / disabled.
   - Clicking "Open Map", searching for a venue (e.g. "SM Megamall, Mandaluyong"), and confirming automatically fills the "Venue Location" dropdown with "Mandaluyong" — no manual selection required.
6. Save the package modification and confirm the `venueLocation` field is persisted correctly in the database.
