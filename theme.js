// ===== UNIVERSAL THEME TOGGLE =====
// Reads from localStorage, applies [data-theme] to <html>, updates all toggle buttons

(function () {
  const STORAGE_KEY = 'halden_theme';

  function getTheme() {
    return localStorage.getItem(STORAGE_KEY) || 'dark';
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY, theme);
    // Update all toggle buttons on the page
    document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
      btn.innerHTML = theme === 'dark'
        ? '<div style="display:flex; align-items:center; gap:10px;"><div style="width:14px; height:14px; border:2px solid currentColor; border-radius:50%; background:transparent; opacity:0.8;"></div><span class="theme-label" style="font-weight:500;">Light Mode</span></div>'
        : '<div style="display:flex; align-items:center; gap:10px;"><div style="width:14px; height:14px; border:2px solid currentColor; border-radius:50%; background:transparent; opacity:0.8;"></div><span class="theme-label" style="font-weight:500;">Dark Mode</span></div>';
      btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    });
  }

  function toggleTheme() {
    const current = getTheme();
    applyTheme(current === 'dark' ? 'light' : 'dark');
  }

  // Apply immediately before paint (FOUC prevention)
  applyTheme(getTheme());

  // Expose globally
  window.toggleTheme = toggleTheme;
  window.applyTheme = applyTheme;
  window.getTheme = getTheme;

  // After DOM is ready, bind any already-rendered buttons
  document.addEventListener('DOMContentLoaded', () => {
    applyTheme(getTheme()); // refresh button labels after DOM builds
  });
})();
