/*
 * Vercel Web Interface Guidelines — site-wide remediation runtime.
 * Applies semantic/accessibility/state fixes consistently across every static route.
 */
(() => {
  const PATHS = new Set(['/', '/experience', '/blog', '/social', '/privacy']);
  const normalizePath = value => value.replace(/\/+$/, '') || '/';
  const path = normalizePath(location.pathname);

  const loadComplianceStyles = () => {
    if (document.querySelector('link[data-vercel-guidelines]')) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/vercel-guidelines.css';
    link.dataset.vercelGuidelines = 'current';
    document.head.appendChild(link);
  };

  const ensureMainLandmark = () => {
    let main = document.querySelector('main');
    if (main) {
      main.classList.add('wg-main');
      if (!main.id) main.id = 'main-content';
      return main;
    }

    const container = document.querySelector('.container');
    if (!container) return null;

    const nav = container.querySelector(':scope > nav');
    const footer = container.querySelector(':scope > footer');
    if (!nav) return null;

    main = document.createElement('main');
    main.id = 'main-content';
    main.className = 'wg-main';

    const nodes = [];
    let current = nav.nextSibling;
    while (current && current !== footer) {
      const next = current.nextSibling;
      nodes.push(current);
      current = next;
    }

    nav.after(main);
    nodes.forEach(node => main.appendChild(node));
    return main;
  };

  const ensureSkipLink = main => {
    if (!main) return;
    let skip = document.querySelector('.skip-link');
    if (!skip) {
      skip = document.createElement('a');
      skip.className = 'skip-link';
      skip.textContent = 'Skip to Content';
      document.body.insertBefore(skip, document.body.firstChild);
    }
    skip.href = `#${main.id}`;
  };

  const enhanceNavigation = () => {
    document.querySelectorAll('nav.nav').forEach(nav => {
      if (!nav.hasAttribute('aria-label')) nav.setAttribute('aria-label', 'Primary navigation');
    });

    document.querySelectorAll('.nav a[href]').forEach(link => {
      let linkPath = '/';
      try { linkPath = normalizePath(new URL(link.href, location.href).pathname); } catch (_) {}
      if (linkPath === path) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });

    document.querySelectorAll('.nav-name').forEach(el => {
      el.setAttribute('translate', 'no');
    });
  };

  const enhanceLinks = () => {
    document.querySelectorAll('a[target="_blank"]').forEach(link => {
      const rel = new Set((link.getAttribute('rel') || '').split(/\s+/).filter(Boolean));
      rel.add('noopener');
      rel.add('noreferrer');
      link.setAttribute('rel', [...rel].join(' '));
    });

    const experienceLabels = {
      'exp-site': 'SITE experience',
      'exp-mobily': 'Mobily experience',
      'exp-stc': 'solutions by stc experience',
      'exp-ibm': 'IBM experience'
    };
    document.querySelectorAll('.logo-pill-link[href]').forEach(link => {
      if (link.getAttribute('aria-label')) return;
      const id = (link.getAttribute('href') || '').split('#')[1];
      if (experienceLabels[id]) link.setAttribute('aria-label', experienceLabels[id]);
    });
  };

  const tuneImage = img => {
    if (!(img instanceof HTMLImageElement)) return;
    const hero = img.matches('.hero img, header > img');

    if (hero) {
      if (!img.hasAttribute('width')) img.setAttribute('width', '120');
      if (!img.hasAttribute('height')) img.setAttribute('height', '120');
      img.loading = 'eager';
      img.fetchPriority = 'high';
    } else if (!img.closest('.lightbox')) {
      img.loading = 'lazy';
    }

    img.decoding = 'async';

    const applyIntrinsic = () => {
      if (!img.hasAttribute('width') && img.naturalWidth) img.setAttribute('width', String(img.naturalWidth));
      if (!img.hasAttribute('height') && img.naturalHeight) img.setAttribute('height', String(img.naturalHeight));
    };
    if (img.complete) applyIntrinsic();
    else img.addEventListener('load', applyIntrinsic, { once: true });
  };

  const enhanceImages = () => {
    document.querySelectorAll('img').forEach(tuneImage);

    document.querySelectorAll('.blog-cover span,.blog-cover div,.banner-icon,.banner-grid').forEach(el => {
      el.setAttribute('aria-hidden', 'true');
    });

    document.querySelectorAll('svg').forEach(svg => {
      const control = svg.closest('a,button');
      if (!control) return;
      const hasAccessibleText = (control.textContent || '').trim().length > 0 || control.hasAttribute('aria-label');
      if (hasAccessibleText) {
        svg.setAttribute('aria-hidden', 'true');
        svg.setAttribute('focusable', 'false');
      }
    });
  };

  const enhanceHeadings = () => {
    const toHeading = (selector, level) => {
      document.querySelectorAll(selector).forEach(el => {
        if (/^H[1-6]$/.test(el.tagName)) return;
        el.setAttribute('role', 'heading');
        el.setAttribute('aria-level', String(level));
      });
    };

    toHeading('.project-name,.blog-title,.company,.tl-title', 3);
    document.querySelectorAll('.blog-title,.blog-excerpt,.project-name,.tl-title,.tl-body,.company').forEach(el => {
      el.setAttribute('dir', 'auto');
    });
  };

  const syncTheme = () => {
    const root = document.documentElement;
    const meta = document.querySelector('meta[name="theme-color"]');
    const apply = () => {
      const light = root.dataset.theme === 'light';
      root.style.colorScheme = light ? 'light' : 'dark';
      if (meta) meta.setAttribute('content', light ? '#eaf2fb' : '#050914');
    };
    apply();
    new MutationObserver(apply).observe(root, { attributes: true, attributeFilter: ['data-theme'] });
  };

  const enhanceBlog = () => {
    if (path !== '/blog') return;
    const row = document.querySelector('.filter-row');
    const grid = document.getElementById('grid');
    const status = document.getElementById('filterStatus');
    const buttons = [...document.querySelectorAll('.filter-pill')];
    const tags = ['all', 'ai', 'cloud', 'product', 'containers'];

    if (row) {
      row.setAttribute('role', 'group');
      row.setAttribute('aria-label', 'Article filters');
    }

    buttons.forEach((button, index) => {
      const tag = tags[index] || 'all';
      button.dataset.filterTag = tag;
      if (grid) button.setAttribute('aria-controls', grid.id);
    });

    const updateUrl = tag => {
      const url = new URL(location.href);
      if (tag === 'all') url.searchParams.delete('filter');
      else url.searchParams.set('filter', tag);
      history.replaceState({ filter: tag }, '', `${url.pathname}${url.search}${url.hash}`);
    };

    const updateStatus = tag => {
      if (!status) return;
      const visible = [...document.querySelectorAll('.blog-card')].filter(card => getComputedStyle(card).display !== 'none').length;
      const label = tag === 'all' ? 'all categories' : tag;
      status.textContent = visible ? `Showing ${visible} articles in ${label}.` : `No articles found in ${label}.`;
    };

    buttons.forEach(button => {
      button.addEventListener('click', () => {
        const tag = button.dataset.filterTag || 'all';
        updateUrl(tag);
        requestAnimationFrame(() => updateStatus(tag));
      });
    });

    const applyUrlState = () => {
      const requested = new URLSearchParams(location.search).get('filter') || 'all';
      const tag = tags.includes(requested) ? requested : 'all';
      const button = buttons.find(item => item.dataset.filterTag === tag);
      if (button && typeof window.filter === 'function') window.filter(tag, button);
      requestAnimationFrame(() => updateStatus(tag));
    };

    window.addEventListener('popstate', applyUrlState);
    applyUrlState();
  };

  const enhanceGallery = () => {
    if (path !== '/social') return;

    const grid = document.getElementById('photoGrid');
    if (grid) {
      grid.setAttribute('role', 'region');
      grid.setAttribute('aria-label', 'Photography gallery');
    }

    const loadMore = document.getElementById('loadMoreBtn');
    const shuffle = document.getElementById('shuffleBtn');
    if (loadMore) loadMore.textContent = 'Load More';
    if (shuffle) shuffle.textContent = 'New Mix';

    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
      lightbox.setAttribute('aria-label', 'Photo viewer');
      lightbox.removeAttribute('aria-labelledby');
      lightbox.setAttribute('aria-describedby', 'lightboxCaption');

      const syncInert = () => {
        const closed = lightbox.getAttribute('aria-hidden') !== 'false';
        lightbox.inert = closed;
      };
      syncInert();
      new MutationObserver(syncInert).observe(lightbox, { attributes: true, attributeFilter: ['aria-hidden'] });
    }
  };

  const formatDates = () => {
    document.querySelectorAll('time[datetime]').forEach(time => {
      const value = new Date(time.getAttribute('datetime'));
      if (Number.isNaN(value.getTime())) return;
      time.textContent = new Intl.DateTimeFormat(navigator.languages, {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        timeZone: 'UTC'
      }).format(value);
    });
  };

  const markIdentifiers = () => {
    document.querySelectorAll('.ptag,.blog-tag,.nav-name,.hero-role,.gallery-kicker,.tl-year,.period').forEach(el => {
      el.setAttribute('translate', 'no');
    });
    document.querySelectorAll('.gallery-counter,.lightbox-info,.tl-year,.blog-meta').forEach(el => {
      el.style.fontVariantNumeric = 'tabular-nums';
    });
  };

  const watchDynamicUi = () => {
    const observer = new MutationObserver(records => {
      for (const record of records) {
        for (const node of record.addedNodes) {
          if (!(node instanceof Element)) continue;
          if (node.matches('img')) tuneImage(node);
          node.querySelectorAll?.('img').forEach(tuneImage);
          node.querySelectorAll?.('svg').forEach(svg => {
            const control = svg.closest('a,button');
            if (control && ((control.textContent || '').trim() || control.hasAttribute('aria-label'))) {
              svg.setAttribute('aria-hidden', 'true');
              svg.setAttribute('focusable', 'false');
            }
          });
        }
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
  };

  const run = () => {
    loadComplianceStyles();
    document.documentElement.dataset.webGuidelines = 'vercel-current';
    if (!PATHS.has(path)) document.documentElement.dataset.webGuidelinesRoute = 'unlisted';

    const main = ensureMainLandmark();
    ensureSkipLink(main);
    enhanceNavigation();
    enhanceLinks();
    enhanceImages();
    enhanceHeadings();
    syncTheme();
    enhanceBlog();
    enhanceGallery();
    formatDates();
    markIdentifiers();
    watchDynamicUi();
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run, { once: true });
  else run();
})();
