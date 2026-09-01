(() => {
  if (window.__oalfawzanThemeInitialized) return;
  window.__oalfawzanThemeInitialized = true;

  const root = document.documentElement;
  const storageKey = 'oalfawzan-theme';
  const systemTheme = window.matchMedia('(prefers-color-scheme: light)');

  const getSavedTheme = () => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved === 'light' || saved === 'dark' ? saved : null;
    } catch (_) {
      return null;
    }
  };

  const initialTheme = getSavedTheme() || (systemTheme.matches ? 'light' : 'dark');
  root.dataset.theme = initialTheme;

  if (!document.querySelector('link[data-light-mode-v2]')) {
    const lightStyles = document.createElement('link');
    lightStyles.rel = 'stylesheet';
    lightStyles.href = '/light-mode.css?v=20260901';
    lightStyles.dataset.lightModeV2 = 'true';
    document.head.appendChild(lightStyles);
  }

  const iconPaths = {
    lock: '<rect x="5" y="10" width="14" height="10" rx="2"></rect><path d="M8 10V7a4 4 0 0 1 8 0v3"></path>',
    cloud: '<path d="M7 18h10a4 4 0 0 0 .8-7.92A6 6 0 0 0 6.3 8.2 4.5 4.5 0 0 0 7 18Z"></path>',
    bolt: '<path d="M13 2 5 14h6l-1 8 8-12h-6l1-8Z"></path>',
    trophy: '<path d="M8 4h8v4a4 4 0 0 1-8 0V4Z"></path><path d="M8 6H5a2 2 0 0 0 2 3M16 6h3a2 2 0 0 1-2 3M12 12v4M9 20h6M10 16h4"></path>',
    container: '<rect x="3" y="6" width="18" height="12" rx="2"></rect><path d="M7 6v12M11 6v12M15 6v12M19 6v12"></path>',
    globe: '<circle cx="12" cy="12" r="9"></circle><path d="M3 12h18M12 3c2.5 2.5 3.5 5.5 3.5 9s-1 6.5-3.5 9c-2.5-2.5-3.5-5.5-3.5-9s1-6.5 3.5-9Z"></path>',
    external: '<path d="M14 5h5v5M10 14 19 5"></path><path d="M19 13v5a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5"></path>',
    close: '<path d="M6 6l12 12M18 6 6 18"></path>',
    left: '<path d="m15 18-6-6 6-6"></path>',
    right: '<path d="m9 18 6-6-6-6"></path>',
    instagram: '<rect x="3" y="3" width="18" height="18" rx="5"></rect><circle cx="12" cy="12" r="4"></circle><circle cx="17.3" cy="6.7" r="1"></circle>',
    snapchat: '<path d="M12 4c-2.7 0-4.5 2-4.5 4.7 0 1-.2 1.8-.7 2.4-.5.7-1.3 1.1-2.3 1.4.5 1.3 1.5 2.1 3 2.5.2 1.2.9 1.8 2.1 1.8.8 0 1.4.2 2.4 1 .9-.8 1.6-1 2.4-1 1.2 0 1.9-.6 2.1-1.8 1.5-.4 2.5-1.2 3-2.5-1-.3-1.8-.7-2.3-1.4-.5-.6-.7-1.4-.7-2.4C16.5 6 14.7 4 12 4Z"></path>',
    x: '<path d="M5 4l14 16M19 4 5 20"></path>',
    vsco: '<circle cx="12" cy="12" r="8"></circle><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"></path>'
  };

  const svgIcon = name => {
    const paths = iconPaths[name];
    return paths ? `<svg class="site-svg-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${paths}</svg>` : '';
  };

  document.querySelectorAll('.nav-name').forEach(el => {
    el.textContent = 'Omar Alfawzan';
  });

  const replacements = [
    ['🔒', 'lock'], ['☁️', 'cloud'], ['☁', 'cloud'], ['⚡', 'bolt'],
    ['🏆', 'trophy'], ['🚢', 'container'], ['🐳', 'container'], ['🌐', 'globe']
  ];

  document.querySelectorAll('.blog-cover').forEach(el => {
    let html = el.innerHTML;
    replacements.forEach(([glyph, icon]) => {
      if (html.includes(glyph)) html = html.split(glyph).join(svgIcon(icon));
    });
    el.innerHTML = html;
  });

  document.querySelectorAll('.blog-read, .project-link, .gallery-actions a').forEach(el => {
    if (el.innerHTML.includes('↗')) {
      el.innerHTML = el.innerHTML.split('↗').join(svgIcon('external'));
    }
  });

  const iconTargets = [
    ['.lightbox-close', 'close'],
    ['.lightbox-prev', 'left'],
    ['.lightbox-next', 'right'],
    ['.social-btn.instagram .social-icon', 'instagram'],
    ['.social-btn.snapchat .social-icon', 'snapchat'],
    ['.social-btn[href*="x.com"] .social-icon', 'x'],
    ['.social-btn[href*="vsco.co"] .social-icon', 'vsco']
  ];

  iconTargets.forEach(([selector, icon]) => {
    const el = document.querySelector(selector);
    if (el) el.innerHTML = svgIcon(icon);
  });

  const nav = document.querySelector('.nav');
  if (!nav) return;

  const themeMeta = document.querySelector('meta[name="theme-color"]');
  const toggle = document.getElementById('themeToggle') || document.createElement('button');

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

  if (!toggle.isConnected) nav.appendChild(toggle);

  const updateToggle = theme => {
    const light = theme === 'light';
    toggle.setAttribute('aria-label', light ? 'Switch to dark mode' : 'Switch to light mode');
    toggle.setAttribute('title', light ? 'Dark mode' : 'Light mode');
    toggle.setAttribute('aria-pressed', String(light));
    if (themeMeta) themeMeta.setAttribute('content', light ? '#f3f6fa' : '#010204');
  };

  const setTheme = (theme, persist = false) => {
    const nextTheme = theme === 'light' ? 'light' : 'dark';
    root.dataset.theme = nextTheme;
    updateToggle(nextTheme);

    if (persist) {
      try { localStorage.setItem(storageKey, nextTheme); } catch (_) {}
    }

    window.dispatchEvent(new CustomEvent('oalfawzan:themechange', { detail: { theme: nextTheme } }));
  };

  updateToggle(initialTheme);

  toggle.addEventListener('click', () => {
    setTheme(root.dataset.theme === 'light' ? 'dark' : 'light', true);
    toggle.blur();
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