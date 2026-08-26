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

/* ScrollCraft enhancement layer: pointer depth + lightweight scroll state. */
(() => {
  const root = document.documentElement;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');

  root.dataset.scrollcraft = 'true';

  const updateScrollState = () => {
    const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const progress = Math.min(1, Math.max(0, window.scrollY / max));
    root.style.setProperty('--sc-progress', progress.toFixed(4));
    root.style.setProperty('--sc-scroll-y', `${window.scrollY}px`);
  };

  let scrollTicking = false;
  const onScroll = () => {
    if (scrollTicking) return;
    scrollTicking = true;
    requestAnimationFrame(() => {
      updateScrollState();
      scrollTicking = false;
    });
  };

  updateScrollState();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });

  if (reducedMotion.matches || !finePointer.matches) return;

  const depthTargets = [...document.querySelectorAll('.project-card, .blog-card, .photo-item, .glass-card:not(.nav)')];

  depthTargets.forEach((target) => {
    let frame = 0;

    const reset = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        target.style.transform = '';
      });
    };

    target.addEventListener('pointermove', (event) => {
      const rect = target.getBoundingClientRect();
      if (!rect.width || !rect.height) return;

      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      const rotateX = (-y * 2.4).toFixed(2);
      const rotateY = (x * 3.2).toFixed(2);

      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        target.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(0)`;
      });
    }, { passive: true });

    target.addEventListener('pointerleave', reset, { passive: true });
    target.addEventListener('pointercancel', reset, { passive: true });
  });

  const hero = document.querySelector('.hero img, header img');
  if (hero) {
    let heroFrame = 0;
    window.addEventListener('pointermove', (event) => {
      const x = event.clientX / window.innerWidth - 0.5;
      const y = event.clientY / window.innerHeight - 0.5;
      cancelAnimationFrame(heroFrame);
      heroFrame = requestAnimationFrame(() => {
        hero.style.transform = `translate3d(${(x * 8).toFixed(2)}px, ${(y * 6).toFixed(2)}px, 0)`;
      });
    }, { passive: true });
  }
})();
