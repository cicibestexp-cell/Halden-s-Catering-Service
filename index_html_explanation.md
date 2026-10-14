# Halden's Event Management - `index.html` Code Breakdown

This document provides a simple, structured explanation of all the code found in the `index.html` file of the Halden's Event Management and Catering application. 

The `index.html` file acts as the primary "frame" or skeleton for the website. It contains the visual layout (HTML), the design structure (CSS references), and several small embedded scripts (Javascript methods) that handle immediate actions before the main application logic (`app.js`) is fully loaded.

Below is a breakdown of the key Javascript methods defined directly inside `index.html`, along with a simple explanation of their syntax and keywords.

---

## 1. The Infinite Redirect Loop Guard (IIFE)
At the very top of the `<head>` section, there is an Anonymous Function (also known as an IIFE - Immediately Invoked Function Expression).

```javascript
(function() {
  try {
    var now = Date.now();
    var raw = sessionStorage.getItem('_hard_loop_guard');
    var loads = raw ? JSON.parse(raw) : [];
    loads = loads.filter(function(t) { return now - t < 2500; });
    loads.push(now);
    sessionStorage.setItem('_hard_loop_guard', JSON.stringify(loads));
    if (loads.length >= 3) {
      localStorage.clear();
      sessionStorage.clear();
      document.write('<div style="..."><h2>Loop Detected...</h2>...</div>');
      window.stop();
    }
  } catch(e) {}
})();
```

### Syntax & Keyword Explanation:
* **`function()`**: This keyword declares a block of reusable code. Because it is wrapped in parentheses `(function() { ... })()`, it runs automatically as soon as the browser reads it.
* **`try...catch`**: A safety net. The code tries to execute the logic inside `try { ... }`. If an error occurs, it silently ignores it in the `catch(e) {}` block so the website doesn't crash.
* **`Date.now()`**: Grabs the exact current time in milliseconds.
* **`sessionStorage`**: The browser's temporary memory. It saves data that gets erased when you close the tab.
* **`if (loads.length >= 3)`**: This is a condition. It checks if the page has reloaded 3 or more times within 2.5 seconds. If it did, it means the website is stuck in an infinite reload loop.
* **`localStorage.clear()`**: A command that completely wipes the browser's saved data, removing corrupted login tokens that usually cause these loops.
* **`document.write(...)` & `window.stop()`**: These keywords completely halt the page from loading further and force the screen to display a "Loop Detected & Blocked!" error message.

---

## 2. Theme Initialization (FOUC Prevention)
Located in the `<head>` tag, this tiny one-liner ensures the website loads in the correct theme (dark or light mode) immediately, preventing a "Flash of Unstyled Content" (FOUC).

```javascript
document.documentElement.setAttribute('data-theme', localStorage.getItem('halden_theme') || 'dark');
```

### Syntax & Keyword Explanation:
* **`document.documentElement`**: Refers to the root `<html>` tag of the page.
* **`.setAttribute(...)`**: Adds a specific property to the HTML tag (in this case, `data-theme`).
* **`localStorage.getItem(...)`**: Reaches into the browser's long-term memory to grab the user's saved theme preference.
* **`|| 'dark'`**: The logical OR operator. It says "If the user hasn't saved a theme yet, default to 'dark'".

---

## 3. Authentication Stub Methods
Because the main application logic (`app.js`) might take a second to load, the `index.html` file includes "stub" methods. These act as placeholders so that if a user clicks a button too quickly, the click is remembered and executed once the app is ready.

```javascript
function continueAsGuest() {
  if (window._continueAsGuestReady) return window._continueAsGuestReady();
  document.addEventListener('app-ready', function() { window.continueAsGuest && window.continueAsGuest(); }, { once: true });
}

function goToLogin() {
  if (window._goToLoginReady) return window._goToLoginReady();
  document.addEventListener('app-ready', function() { window.goToLogin && window.goToLogin(); }, { once: true });
}
```

### Syntax & Keyword Explanation:
* **`function continueAsGuest()`**: Defines a method that triggers when the user clicks "Continue as Guest" on the welcome modal.
* **`if (window._continueAsGuestReady)`**: A condition that checks if the main app has already loaded this feature. If it has, it immediately runs (`return`) the real function.
* **`document.addEventListener('app-ready', ...)`**: This keyword tells the browser to "listen" for a specific custom signal (event) named `app-ready`. 
* **`{ once: true }`**: An option that ensures this listener only triggers a single time, preventing performance issues.

---

## 4. Customer Review Modals
These methods handle the popup (modal) that displays full customer testimonials.

```javascript
function openReviewModal(name, stars, text) {
  document.getElementById('rm-name').innerText = name;
  document.getElementById('rm-stars').innerText = stars;
  document.getElementById('rm-text').innerText = '"' + text + '"';
  document.getElementById('reviewModal').classList.remove('hidden');
}

function closeReviewModal(e) {
  if (e.target.id === 'reviewModal') {
    e.target.classList.add('hidden');
  }
}
```

### Syntax & Keyword Explanation:
* **`function openReviewModal(name, stars, text)`**: A method that accepts three pieces of data (parameters): the reviewer's name, the star rating, and the review text.
* **`document.getElementById(...)`**: A very common keyword used to find a specific HTML element on the page using its unique `id` attribute.
* **`.innerText = ...`**: Replaces the text inside the HTML element with the new data passed into the function.
* **`.classList.remove('hidden')`**: Takes the CSS class `hidden` off the modal, making it visible on the screen.
* **`function closeReviewModal(e)`**: The `e` stands for "event". This method tracks the mouse click event.
* **`if (e.target.id === 'reviewModal')`**: Checks if the exact spot the user clicked was the dark background overlay (`reviewModal`). If they clicked inside the actual box, it ignores the click. If they clicked the background, it adds the `hidden` class back, closing the popup.

---

## 5. Third-Party Service Initializers
Near the bottom of the page, there are two crucial scripts that initialize external services before `app.js` runs.

### Supabase SDK Initialization:
```javascript
const SUPABASE_URL  = 'https://...supabase.co';
const SUPABASE_ANON = 'eyJhbG...';
window.supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON);
```
### EmailJS Initialization:
```javascript
(function() {
  emailjs.init("rKo0nYgSSEaf_NUMH");
})();
```

### Syntax & Keyword Explanation:
* **`const`**: Declares a variable whose value cannot be changed. This holds the secure connection keys.
* **`window.supabaseClient`**: Attaches the Supabase connection directly to the browser's global `window` object so that all other files (like `app.js`) can easily access the database.
* **`.createClient(...)` & `.init(...)`**: These are built-in methods provided by the Supabase and EmailJS libraries to properly set up their respective connections using the provided keys.

---

## 6. Inline `onclick` Handlers
Throughout the `index.html` file, you will see HTML tags with the `onclick` keyword. These aren't full Javascript methods defined in the HTML, but rather triggers that call methods stored in `app.js` or `auth.js`.

Examples found in the file:
* **`onclick="go('#hero')"`**: Smoothly scrolls the page to the top hero section.
* **`onclick="toggleTheme()"`**: Calls the function to switch between dark mode and light mode.
* **`onclick="changeUIScale(-0.1)"`**: Calls the function to zoom out the user interface by 10%.
* **`onclick="switchAuthTab('login')"`**: Switches the authentication side-drawer to show the login form instead of the sign-up form.
* **`onclick="searchLocation()"`**: Triggers the map API to search for the address the user typed in.

### Syntax & Keyword Explanation:
* **`onclick="..."`**: An HTML attribute that tells the browser to execute the Javascript code inside the quotes the moment the user clicks the element.
* **Passing parameters (e.g., `'login'`, `-0.1`)**: The text inside the parentheses are instructions given to the function so it knows exactly what to do (e.g., which tab to open, or how much to zoom).

---

## Summary
The `index.html` file is built to be lightweight. It defines the physical structure (the navigation bar, the hero images, the cart drawer, the Modals, etc.) but delegates the heavy lifting (like talking to the database, processing payments, or adding items to the cart) to external Javascript files. The few scripts that *are* inside `index.html` are strictly there for immediate safety (the loop breaker, theme caching), immediate visual UI responses (opening modals), and configuring external libraries (Supabase, EmailJS).
