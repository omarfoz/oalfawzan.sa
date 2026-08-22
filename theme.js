(() => {
  const nav = document.querySelector('.nav');
  if (!nav || document.getElementById('themeToggle')) return;

  const root = document.documentElement;
  const themeMeta = document.querySelector('meta[name="theme-color"]');
  const systemTheme = window.matchMedia('(prefers-color-scheme: light)');
  const storageKey = 'oalfawzan-theme';

  const toggle = document.createElement('button');
  toggle.id = 'themeToggle';
  toggle.className = 'theme-toggle';
  toggle.type = 'button';
  toggle.innerHTML = `
    <svg class="theme-icon theme-icon-moon" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20.6 15.3A8.5 8.5 0 0 1 8.7 3.4 8.6 8.6 0 1 0 20.6 15.3Z"></path>
    </svg>
    <svg class="theme-icon theme-icon-sun" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="3.75"></circle>
      <path d="M12 2.25v2.1M12 19.65v2.1M4.25 4.25l1.5 1.5M18.25 18.25l1.5 1.5M2.25 12h2.1M19.65 12h2.1M4.25 19.75l1.5-1.5M18.25 5.75l1.5-1.5"></path>
    </svg>`;

  nav.appendChild(toggle);

  const getSavedTheme = () => {
    try {
      return localStorage.getItem(storageKey);
    } catch (_) {
      return null;
    }
  };

  const setTheme = (theme, persist = false) => {
    const isLight = theme === 'light';
    root.dataset.theme = isLight ? 'light' : 'dark';
    toggle.setAttribute('aria-label', isLight ? 'Switch to dark mode' : 'Switch to light mode');
    toggle.setAttribute('title', isLight ? 'Dark mode' : 'Light mode');
    toggle.setAttribute('aria-pressed', String(isLight));

    if (themeMeta) {
      themeMeta.setAttribute('content', isLight ? '#edf4fc' : '#010204');
    }

    if (persist) {
      try {
        localStorage.setItem(storageKey, isLight ? 'light' : 'dark');
      } catch (_) {}
    }
  };

  const savedTheme = getSavedTheme();
  setTheme(savedTheme || (systemTheme.matches ? 'light' : 'dark'));

  toggle.addEventListener('click', () => {
    setTheme(root.dataset.theme === 'light' ? 'dark' : 'light', true);
  });

  const syncSystemTheme = event => {
    if (!getSavedTheme()) setTheme(event.matches ? 'light' : 'dark');
  };

  if (typeof systemTheme.addEventListener === 'function') {
    systemTheme.addEventListener('change', syncSystemTheme);
  } else if (typeof systemTheme.addListener === 'function') {
    systemTheme.addListener(syncSystemTheme);
  }
})();
