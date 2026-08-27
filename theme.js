(() => {
  const nav = document.querySelector('.nav');
  if (!nav || document.getElementById('themeToggle')) return;

  const root = document.documentElement;
  const themeMeta = document.querySelector('meta[name="theme-color"]');
  const systemTheme = window.matchMedia('(prefers-color-scheme: light)');
  const touchOnly = window.matchMedia('(hover: none), (pointer: coarse)');
  const storageKey = 'oalfawzan-theme';

  const toggle = document.createElement('button');
  toggle.id = 'themeToggle';
  toggle.className = 'theme-toggle';
  toggle.type = 'button';
  toggle.innerHTML = `
    <svg class="theme-icon theme-icon-moon" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M19.8 15.1A8 8 0 0 1 8.9 4.2 8 8 0 1 0 19.8 15.1Z"></path>
    </svg>
    <svg class="theme-icon theme-icon-sun" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="3.4"></circle>
      <path d="M12 3v1.8M12 19.2V21M3 12h1.8M19.2 12H21M5.64 5.64l1.27 1.27M17.09 17.09l1.27 1.27M5.64 18.36l1.27-1.27M17.09 6.91l1.27-1.27"></path>
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
      themeMeta.setAttribute('content', isLight ? '#f3f6fb' : '#010204');
    }

    if (persist) {
      try {
        localStorage.setItem(storageKey, isLight ? 'light' : 'dark');
      } catch (_) {}
    }
  };

  const clearTouchState = () => {
    if (!touchOnly.matches) return;
    toggle.blur();
    toggle.style.background = 'transparent';
    toggle.style.borderColor = 'transparent';
    requestAnimationFrame(() => {
      toggle.style.background = 'transparent';
      toggle.style.borderColor = 'transparent';
    });
  };

  const savedTheme = getSavedTheme();
  setTheme(savedTheme || (systemTheme.matches ? 'light' : 'dark'));

  toggle.addEventListener('click', () => {
    setTheme(root.dataset.theme === 'light' ? 'dark' : 'light', true);
    clearTouchState();
  });

  toggle.addEventListener('pointerup', clearTouchState);
  toggle.addEventListener('touchend', clearTouchState, { passive: true });

  const syncSystemTheme = event => {
    if (!getSavedTheme()) setTheme(event.matches ? 'light' : 'dark');
  };

  if (typeof systemTheme.addEventListener === 'function') {
    systemTheme.addEventListener('change', syncSystemTheme);
  } else if (typeof systemTheme.addListener === 'function') {
    systemTheme.addListener(syncSystemTheme);
  }
})();

// Social uses a photography-specific layout internally, but its page shell should
// match the rest of the portfolio. Load the alignment layer only on /social/.
(() => {
  const path = location.pathname.replace(/\/+$/, '') || '/';
  if (path !== '/social' || document.querySelector('link[data-social-shared]')) return;

  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = '/social-shared.css';
  link.dataset.socialShared = 'true';
  document.head.appendChild(link);
})();