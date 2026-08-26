/* Vercel Web Interface Guidelines compliance layer.
 * Keeps accessibility, navigation state, image behavior, focus safety, locale
 * formatting, and performance defaults consistent across all static pages.
 */
(() => {
  const run = () => {
    const root = document.documentElement;
    const path = location.pathname.replace(/\/+$/, '') || '/';

    root.dataset.webGuidelines = 'vercel';

    const style = document.createElement('style');
    style.id = 'vercel-web-guidelines';
    style.textContent = `
      :where(h1,h2,h3,h4,h5,h6,[id]) { scroll-margin-top: 7rem; }
      :where(.nav-buttons,.hero-ctas,.logos-row,.blog-meta,.gallery-head,.gallery-actions) > * { min-width: 0; }
      :where(p,li,.tl-body,.project-desc,.blog-excerpt,.learned-text,.intro) {
        overflow-wrap: anywhere;
        text-wrap: pretty;
      }
      :where(h1,h2,h3,.section-title,.project-name,.blog-title,.gallery-title,.company) {
        text-wrap: balance;
      }
      .photo-item {
        content-visibility: auto;
        contain-intrinsic-size: 320px 320px;
      }
      .sc-motion {
        filter: none !important;
        clip-path: none !important;
      }

      /* Accessibility skip link: completely off-canvas until keyboard focus. */
      .skip-link {
        position: fixed !important;
        z-index: 10000 !important;
        top: max(10px, env(safe-area-inset-top)) !important;
        left: max(10px, env(safe-area-inset-left)) !important;
        width: auto !important;
        height: auto !important;
        margin: 0 !important;
        padding: 10px 14px !important;
        overflow: visible !important;
        clip: auto !important;
        clip-path: none !important;
        white-space: nowrap !important;
        opacity: 0 !important;
        pointer-events: none !important;
        transform: translateY(calc(-100% - 48px)) !important;
        transition: transform .16s ease, opacity .16s ease !important;
      }
      .skip-link:focus,
      .skip-link:focus-visible {
        opacity: 1 !important;
        pointer-events: auto !important;
        transform: translateY(0) !important;
      }

      :where(a,button,[tabindex]):focus-visible {
        scroll-margin-block: 7rem;
      }

      /* On touch screens, ScrollCraft may move content but never dim readability. */
      @media (max-width: 760px) {
        html[data-scrollcraft-v2='true'] .sc-motion,
        html[data-scrollcraft-v2='true'] .section-title,
        html[data-scrollcraft-v2='true'] .gallery-head,
        html[data-scrollcraft-v2='true'] .tl-item,
        html[data-scrollcraft-v2='true'] .exp-item,
        html[data-scrollcraft-v2='true'] .social-link,
        html[data-scrollcraft-v2='true'] .glass-card:not(.nav),
        html[data-scrollcraft-v2='true'] article > h2,
        html[data-scrollcraft-v2='true'] article > p,
        html[data-scrollcraft-v2='true'] article > ul {
          opacity: 1 !important;
          filter: none !important;
        }
      }

      @media (prefers-reduced-motion: reduce) {
        html { scroll-behavior: auto !important; }
      }
    `;
    if (!document.getElementById(style.id)) document.head.appendChild(style);

    // Keep native browser theming aligned with the actual page theme.
    if (!root.style.colorScheme) root.style.colorScheme = root.dataset.theme || 'dark';

    // Ensure active navigation state is exposed to assistive technology.
    document.querySelectorAll('.nav a[href]').forEach(link => {
      const linkPath = new URL(link.href, location.href).pathname.replace(/\/+$/, '') || '/';
      if (linkPath === path) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });

    // Skip navigation on every page. Prefer a semantic <main>; fall back to the
    // first primary content landmark without restructuring page markup.
    let main = document.querySelector('main');
    if (!main) main = document.querySelector('.hero, .page-header, .container > header, .summary-section');
    if (main) {
      if (!main.id) main.id = 'main-content';
      if (!main.hasAttribute('tabindex')) main.setAttribute('tabindex', '-1');
      if (!document.querySelector('.skip-link')) {
        const skip = document.createElement('a');
        skip.className = 'skip-link';
        skip.href = `#${main.id}`;
        skip.textContent = 'Skip to Content';
        document.body.insertBefore(skip, document.body.firstChild);
      }
    }

    // External links opened in a new tab must not retain opener access.
    document.querySelectorAll('a[target="_blank"]').forEach(link => {
      const rel = new Set((link.getAttribute('rel') || '').split(/\s+/).filter(Boolean));
      rel.add('noopener');
      rel.add('noreferrer');
      link.setAttribute('rel', [...rel].join(' '));
    });

    // Add stable image dimensions as soon as intrinsic dimensions are known.
    // Critical hero portraits get eager/high-priority loading; below-fold media
    // gets native lazy loading and asynchronous decoding.
    const tuneImage = img => {
      if (!(img instanceof HTMLImageElement)) return;

      const isHero = img.matches('.hero img, header > img');
      if (isHero) {
        if (!img.hasAttribute('width')) img.width = 120;
        if (!img.hasAttribute('height')) img.height = 120;
        img.loading = 'eager';
        img.fetchPriority = 'high';
      } else if (!img.closest('.lightbox')) {
        img.loading = 'lazy';
      }
      img.decoding = 'async';

      const applyIntrinsicSize = () => {
        if (!img.hasAttribute('width') && img.naturalWidth) img.setAttribute('width', String(img.naturalWidth));
        if (!img.hasAttribute('height') && img.naturalHeight) img.setAttribute('height', String(img.naturalHeight));
      };
      if (img.complete) applyIntrinsicSize();
      else img.addEventListener('load', applyIntrinsicSize, { once: true });
    };

    document.querySelectorAll('img').forEach(tuneImage);
    const imageObserver = new MutationObserver(records => {
      records.forEach(record => record.addedNodes.forEach(node => {
        if (!(node instanceof Element)) return;
        if (node.matches('img')) tuneImage(node);
        node.querySelectorAll?.('img').forEach(tuneImage);
      }));
    });
    imageObserver.observe(document.body, { childList: true, subtree: true });

    // Blog filters are stateful UI, so reflect selection in the URL and restore
    // it on deep links/back-forward navigation.
    if (path === '/blog') {
      const buttons = [...document.querySelectorAll('.filter-pill')];
      const tags = ['all', 'ai', 'cloud', 'product', 'containers'];
      buttons.forEach((button, index) => { button.dataset.filterTag = tags[index] || 'all'; });

      const applyFilterFromUrl = () => {
        const requested = new URLSearchParams(location.search).get('filter') || 'all';
        const tag = tags.includes(requested) ? requested : 'all';
        const button = buttons.find(item => item.dataset.filterTag === tag);
        if (button && typeof window.filter === 'function') window.filter(tag, button);
      };

      buttons.forEach(button => {
        button.addEventListener('click', () => {
          const tag = button.dataset.filterTag || 'all';
          const url = new URL(location.href);
          if (tag === 'all') url.searchParams.delete('filter');
          else url.searchParams.set('filter', tag);
          history.replaceState({ filter: tag }, '', `${url.pathname}${url.search}${url.hash}`);
        });
      });
      window.addEventListener('popstate', applyFilterFromUrl);
      applyFilterFromUrl();
    }

    // Locale-aware rendering for machine-readable dates.
    document.querySelectorAll('time[datetime]').forEach(time => {
      const value = new Date(time.getAttribute('datetime'));
      if (!Number.isNaN(value.getTime())) {
        time.textContent = new Intl.DateTimeFormat(navigator.languages, {
          day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC'
        }).format(value);
      }
    });

    // The photography lightbox is removed from the focus tree while closed.
    const lightbox = document.querySelector('.lightbox[aria-hidden]');
    if (lightbox) {
      const syncInert = () => { lightbox.inert = lightbox.getAttribute('aria-hidden') !== 'false'; };
      syncInert();
      new MutationObserver(syncInert).observe(lightbox, { attributes: true, attributeFilter: ['aria-hidden'] });
    }

    // Clear action labels and number alignment for rapidly changing counters.
    const loadMore = document.getElementById('loadMoreBtn');
    const shuffle = document.getElementById('shuffleBtn');
    if (loadMore) loadMore.textContent = 'Load More';
    if (shuffle) shuffle.textContent = 'New Mix';
    document.querySelectorAll('.gallery-counter,.lightbox-info,.tl-year,.blog-meta').forEach(el => {
      el.style.fontVariantNumeric = 'tabular-nums';
    });

    // Prevent auto-translation from corrupting code-like and brand identifiers.
    document.querySelectorAll('.ptag,.blog-tag,.nav-name,.hero-role,.gallery-kicker').forEach(el => {
      el.setAttribute('translate', 'no');
    });
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run, { once: true });
  else run();
})();
