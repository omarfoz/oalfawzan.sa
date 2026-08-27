(() => {
  // Home already defines the reference visual language in its page CSS.
  // Other routes load this final shared layer so their shell, hero, type scale,
  // spacing and navigation match Home consistently.
  if (!document.querySelector('link[data-site-consistency]')) {
    const consistencyStyles = document.createElement('link');
    consistencyStyles.rel = 'stylesheet';
    consistencyStyles.href = '/site-consistency.css';
    consistencyStyles.dataset.siteConsistency = 'true';
    document.head.appendChild(consistencyStyles);
  }

  // Use one of the existing Social gallery photographs as the site background.
  // A fresh photo is selected on every full page refresh/navigation.
  if (!document.querySelector('link[data-random-background]')) {
    const backgroundStyles = document.createElement('link');
    backgroundStyles.rel = 'stylesheet';
    backgroundStyles.href = '/random-background.css';
    backgroundStyles.dataset.randomBackground = 'true';
    document.head.appendChild(backgroundStyles);
  }

  const PHOTO_COUNT = 193;
  let randomPhoto = 1;
  if (window.crypto && typeof window.crypto.getRandomValues === 'function') {
    const randomValue = new Uint32Array(1);
    window.crypto.getRandomValues(randomValue);
    randomPhoto = (randomValue[0] % PHOTO_COUNT) + 1;
  } else {
    randomPhoto = Math.floor(Math.random() * PHOTO_COUNT) + 1;
  }
  const randomPhotoPath = `/social/photos/photo_${String(randomPhoto).padStart(3, '0')}.jpg`;
  document.documentElement.style.setProperty('--site-random-background', `url("${randomPhotoPath}")`);

  const nav = document.querySelector('.nav');
  if (!nav || document.getElementById('themeToggle')) return;

  if (document.querySelector('.photo-grid') && !document.getElementById('socialConsistencyStyles')) {
    const socialStyles = document.createElement('link');
    socialStyles.id = 'socialConsistencyStyles';
    socialStyles.rel = 'stylesheet';
    socialStyles.href = '/social/social-consistency.css';
    document.head.appendChild(socialStyles);
  }

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
