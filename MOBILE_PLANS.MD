# SMARTSERVE Mobile Scanning App Plans

This document outlines the two primary paths for bringing the SMARTSERVE equipment scanning tool (`scan.html`) to mobile devices.

---

## Option A: Dedicated Native App (Flutter)

**Complexity:** 2/10 (Very Easy for a Flutter Dev)  
**Effort:** ~1-2 Days of Development

This option involves building a brand-new, standalone mobile application using the Flutter framework. It will compile into an actual `.apk` (Android) and `.ipa` (iOS) file.

### Prerequisites (for the Developer/Owner)
- [Flutter SDK](https://docs.flutter.dev/get-started/install) installed.
- Android Studio installed (for Android Emulator and SDK tools).
- Xcode installed (only if targeting iOS, requires a Mac).

### Architecture
1. **Frontend:** Flutter (Dart).
2. **Backend:** Direct connection to our existing Supabase project via the `supabase_flutter` package.
3. **Camera Plugin:** `mobile_scanner` (for high-speed QR/Barcode recognition).

### App Flow (2 Screens)
- **Screen 1: Login.** Connects to Supabase Native Auth. Ensures only authorized staff can access the scanner.
- **Screen 2: Scanner View.** 
  - Full-screen camera viewfinder.
  - Upon scanning a code, queries the `equipment_inventory` table in Supabase.
  - Bottom sheet slides up showing item details (Name, Current Stock).
  - "+" and "-" buttons to adjust stock, which updates `equipment_inventory` and logs the action in `allocation_history`.

### Pros & Cons
* **Pros:** Premium native feel, extreme camera performance, looks highly professional.
* **Cons:** Requires installing heavy developer SDKs (Android Studio/Flutter) just to compile it. Harder to distribute (you have to manually send the `.apk` file to staff or put it on the App Store).

---

## Option B: Progressive Web App (PWA)

**Complexity:** 1/10 (Trivial)  
**Effort:** ~30 Minutes

This option involves modifying our *existing* web-based scanner (`scan.html`) so that it can be "installed" directly to a phone's home screen via the browser.

### Prerequisites
- None. (No downloads or SDKs required).

### Architecture
1. **Service Worker:** A small JavaScript file that caches assets so the app loads instantly.
2. **Web App Manifest:** A `manifest.json` file that tells the phone what the app icon should look like, the app name, and to launch it in "standalone" mode (hiding the browser URL bar).

### App Flow
- Staff opens `yoursite.com/scan.html` in Chrome/Safari on their phone.
- A popup appears saying "Add SMARTSERVE Scanner to Home Screen".
- They click Add. 
- It appears on their phone home screen with a custom icon. When opened, it behaves exactly like a native app.

### Pros & Cons
* **Pros:** Zero downloads required for you. Instant updates (when you update the website, the app updates automatically).
* **Cons:** Slightly less performant camera compared to a native app (though HTML5-QRCode is still very good).

---

## Decision / Next Steps
When ready to proceed, instruct the AI to execute either **Option A** (generate the Flutter codebase) or **Option B** (convert `scan.html` into a PWA).
