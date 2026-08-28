(() => {
  const root = document.documentElement;

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

  const svgIcon = (name, extraClass = '') => {
    const paths = iconPaths[name];
    if (!paths) return '';
    return `<svg class="site-svg-icon${extraClass ? ` ${extraClass}` : ''}" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${paths}</svg>`;
  };

  const ensureRuntimeStyles = () => {
    if (document.getElementById('siteRuntimePolish')) return;
    const style = document.createElement('style');
    style.id = 'siteRuntimePolish';
    style.textContent = `
      .nav-name {
        display: block !important;
        font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "DM Sans", sans-serif !important;
        font-size: 1.1rem !important;
        font-weight: 800 !important;
        line-height: 1.2 !important;
        letter-spacing: -.02em !important;
        white-space: nowrap;
      }
      .site-svg-icon {
        width: 1em;
        height: 1em;
        display: inline-block;
        flex: 0 0 auto;
        vertical-align: -.12em;
        fill: none;
        stroke: currentColor;
        stroke-width: 1.8;
        stroke-linecap: round;
        stroke-linejoin: round;
      }
      .blog-cover .site-svg-icon { width: 1em; height: 1em; }
      .blog-read .site-svg-icon,
      .project-link .site-svg-icon,
      .gallery-actions .site-svg-icon { margin-left: .32em; }
      .social-icon .site-svg-icon { width: 15px; height: 15px; vertical-align: 0; }
      .lightbox-control .site-svg-icon { width: 20px; height: 20px; vertical-align: 0; }
      @media (max-width: 700px), (pointer: coarse) {
        body, html[data-theme="light"] body { background-attachment: scroll !important; }
        .glass,
        .glass-card,
        .project-card,
        .blog-card,
        .nav {
          -webkit-backdrop-filter: blur(14px) saturate(145%) !important;
          backdrop-filter: blur(14px) saturate(145%) !important;
        }
        html[data-theme="light"] .glass,
        html[data-theme="light"] .glass-card,
        html[data-theme="light"] .project-card,
        html[data-theme="light"] .blog-card,
        html[data-theme="light"] .nav {
          -webkit-backdrop-filter: blur(16px) saturate(150%) brightness(1.03) !important;
          backdrop-filter: blur(16px) saturate(150%) brightness(1.03) !important;
        }
        .photo-item:hover img { transform: none !important; }
      }
    `;
    document.head.appendChild(style);
  };

  const normalizeBranding = () => {
    document.querySelectorAll('.nav-name').forEach(el => {
      el.textContent = 'Omar Alfawzan';
    });
  };

  const replaceKnownGlyphs = () => {
    const replacements = [
      ['🔒', 'lock'],
      ['☁️', 'cloud'],
      ['☁', 'cloud'],
      ['⚡', 'bolt'],
      ['🏆', 'trophy'],
      ['🚢', 'container'],
      ['🐳', 'container'],
      ['🌐', 'globe']
    ];

    document.querySelectorAll('.blog-cover').forEach(el => {
      let html = el.innerHTML;
      replacements.forEach(([glyph, name]) => {
        if (html.includes(glyph)) html = html.split(glyph).join(svgIcon(name));
      });
      el.innerHTML = html;
    });

    document.querySelectorAll('.blog-read, .project-link, .gallery-actions a').forEach(el => {
      if (el.innerHTML.includes('↗')) {
        el.innerHTML = el.innerHTML.split('↗').join(svgIcon('external'));
      }
    });

    const close = document.querySelector('.lightbox-close');
    const prev = document.querySelector('.lightbox-prev');
    const next = document.querySelector('.lightbox-next');
    if (close) close.innerHTML = svgIcon('close');
    if (prev) prev.innerHTML = svgIcon('left');
    if (next) next.innerHTML = svgIcon('right');

    const socialMappings = [
      ['.social-btn.instagram .social-icon', 'instagram'],
      ['.social-btn.snapchat .social-icon', 'snapchat'],
      ['.social-btn[href*="x.com"] .social-icon', 'x'],
      ['.social-btn[href*="vsco.co"] .social-icon', 'vsco']
    ];
    socialMappings.forEach(([selector, name]) => {
      const el = document.querySelector(selector);
      if (el) el.innerHTML = svgIcon(name);
    });
  };

  const optimizeGallery = () => {
    const images = Array.from(document.querySelectorAll('.photo-item img'));
    images.forEach((img, index) => {
      img.loading = 'lazy';
      img.decoding = 'async';
      if ('fetchPriority' in img) img.fetchPriority = index < 6 ? 'auto' : 'low';
    });
  };

  ensureRuntimeStyles();
  normalizeBranding();
  replaceKnownGlyphs();
  optimizeGallery();

  const nav = document.querySelector('.nav');
  if (!nav || document.getElementById('themeToggle')) return;

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
