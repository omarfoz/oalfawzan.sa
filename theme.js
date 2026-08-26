// Anthropic frontend-design visual system. Load before runtime work so all pages share one design floor.
(() => {
  if (document.querySelector('link[data-frontend-design]')) return;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = '/frontend-design.css';
  link.dataset.frontendDesign = 'anthropic';
  document.head.appendChild(link);
})();

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
    try { return localStorage.getItem(storageKey); } catch (_) { return null; }
  };

  const setTheme = (theme, persist = false) => {
    const isLight = theme === 'light';
    root.dataset.theme = isLight ? 'light' : 'dark';
    toggle.setAttribute('aria-label', isLight ? 'Switch to dark mode' : 'Switch to light mode');
    toggle.setAttribute('title', isLight ? 'Dark mode' : 'Light mode');
    toggle.setAttribute('aria-pressed', String(isLight));
    if (themeMeta) themeMeta.setAttribute('content', isLight ? '#f3f6fb' : '#010204');
    if (persist) {
      try { localStorage.setItem(storageKey, isLight ? 'light' : 'dark'); } catch (_) {}
    }
  };

  const clearTouchState = () => {
    if (!touchOnly.matches) return;
    toggle.blur();
    toggle.style.background = 'transparent';
    toggle.style.borderColor = 'transparent';
  };

  setTheme(getSavedTheme() || (systemTheme.matches ? 'light' : 'dark'));
  toggle.addEventListener('click', () => {
    setTheme(root.dataset.theme === 'light' ? 'dark' : 'light', true);
    clearTouchState();
  });
  toggle.addEventListener('pointerup', clearTouchState);
  toggle.addEventListener('touchend', clearTouchState, { passive: true });

  const syncSystemTheme = event => {
    if (!getSavedTheme()) setTheme(event.matches ? 'light' : 'dark');
  };
  if (typeof systemTheme.addEventListener === 'function') systemTheme.addEventListener('change', syncSystemTheme);
  else if (typeof systemTheme.addListener === 'function') systemTheme.addListener(syncSystemTheme);
})();

/* ScrollCraft v2: scroll is the timeline; JS is the mobile-safe source of truth. */
(() => {
  setTimeout(() => {
    if (window.__oalfawzanScrollCraftV2) return;
    window.__oalfawzanScrollCraftV2 = true;

    const root = document.documentElement;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    const path = location.pathname.replace(/\/+$/, '') || '/';
    const clamp = (n, min = 0, max = 1) => Math.min(max, Math.max(min, n));
    const smooth = p => p * p * (3 - 2 * p);
    const mix = (a, b, p) => a + (b - a) * p;

    root.dataset.scrollcraftV2 = 'true';
    root.dataset.scPage = path === '/' ? 'home' : path.slice(1).split('/')[0];

    const style = document.createElement('style');
    style.id = 'scrollcraft-v2-styles';
    style.textContent = `
      html[data-scrollcraft-v2="true"] body::before { display:none !important; }

      html[data-scrollcraft-v2="true"] .hero,
      html[data-scrollcraft-v2="true"] .page-header,
      html[data-scrollcraft-v2="true"] .section-title,
      html[data-scrollcraft-v2="true"] .gallery-head,
      html[data-scrollcraft-v2="true"] .project-card,
      html[data-scrollcraft-v2="true"] .blog-card,
      html[data-scrollcraft-v2="true"] .exp-item,
      html[data-scrollcraft-v2="true"] .tl-item,
      html[data-scrollcraft-v2="true"] .photo-item,
      html[data-scrollcraft-v2="true"] .glass-card:not(.nav),
      html[data-scrollcraft-v2="true"] article > h2,
      html[data-scrollcraft-v2="true"] article > p,
      html[data-scrollcraft-v2="true"] article > ul {
        animation:none !important;
        animation-timeline:auto !important;
      }

      .sc-act { --sc-p:0; position:relative; }
      .sc-motion { will-change:transform,opacity,filter,clip-path; }
      .sc-reveal-title { position:relative; overflow:hidden; }
      .sc-reveal-title::after {
        content:''; position:absolute; inset:auto 0 0; height:1px;
        background:linear-gradient(90deg,var(--accent,#007aff),transparent);
        transform:scaleX(var(--sc-p)); transform-origin:left center; opacity:.75;
      }

      html[data-sc-page="home"] .hero,
      html[data-sc-page="experience"] header,
      html[data-sc-page="social"] .hero,
      html[data-sc-page="blog"] .page-header,
      html[data-sc-page="privacy"] header {
        transform-origin:50% 20%;
        will-change:transform,opacity,filter;
      }

      @media (max-width:760px) and (prefers-reduced-motion:no-preference) {
        html[data-sc-page="home"] .projects-section .project-card,
        html[data-sc-page="blog"] .blog-card {
          position:sticky;
          top:var(--sc-stack-top,92px);
          transform-origin:50% 12%;
        }
        html[data-sc-page="home"] .projects-section,
        html[data-sc-page="blog"] .blog-grid { padding-bottom:18vh; }

        html[data-sc-page="experience"] .section-title,
        html[data-sc-page="home"] .bio-section > .section-title,
        html[data-sc-page="privacy"] article > h2 {
          position:sticky;
          top:84px;
          z-index:4;
          padding:10px 12px;
          margin-left:-12px;
          margin-right:-12px;
          border-radius:14px;
          background:color-mix(in srgb,var(--bg,#010204) 72%,transparent);
          -webkit-backdrop-filter:blur(16px) saturate(150%);
          backdrop-filter:blur(16px) saturate(150%);
        }
      }

      html[data-scrollcraft-v2="true"] .timeline::before {
        transform:scaleY(var(--sc-line-p,0)) !important;
        transform-origin:50% 0 !important;
        opacity:calc(.25 + var(--sc-line-p,0) * .75) !important;
      }
      html[data-scrollcraft-v2="true"] .tl-dot {
        transform:translateX(-50%) scale(calc(.72 + var(--sc-item-p,0) * .28));
        box-shadow:0 0 calc(4px + 15px * var(--sc-item-p,0)) rgba(0,122,255,.55);
      }

      html[data-sc-page="social"] .photo-grid { perspective:1000px; }
      html[data-sc-page="social"] .photo-item { transform-style:preserve-3d; }
      html[data-scrollcraft-v2="true"] .section-title::after {
        transform:scaleX(var(--sc-p,0)); transform-origin:left center;
      }

      html[data-scrollcraft-v2="true"] .nav {
        position:relative; z-index:50;
        transition:opacity .25s ease,transform .25s ease,box-shadow .25s ease;
      }
      html[data-scrollcraft-v2="true"].sc-down .nav { opacity:.76; transform:translateY(-4px); }
      html[data-scrollcraft-v2="true"].sc-up .nav { opacity:1; transform:translateY(0); }

      @media (min-width:761px) and (prefers-reduced-motion:no-preference) {
        html[data-sc-page="home"] .project-card,
        html[data-sc-page="blog"] .blog-card,
        html[data-sc-page="experience"] .exp-item,
        html[data-sc-page="social"] .photo-item { transform-style:preserve-3d; }
      }

      @media (prefers-reduced-motion:reduce) {
        .sc-motion { transform:none !important; opacity:1 !important; filter:none !important; clip-path:none !important; }
        html[data-scrollcraft-v2="true"] .timeline::before { transform:none !important; opacity:1 !important; }
      }
    `;
    document.head.appendChild(style);

    const hero = document.querySelector('.hero, .page-header, .container > header, body > header');
    if (hero) hero.classList.add('sc-act','sc-motion');

    const titleNodes = [...document.querySelectorAll('.section-title,.gallery-head,article > h2')];
    titleNodes.forEach(el => el.classList.add('sc-act','sc-motion','sc-reveal-title'));

    const page = root.dataset.scPage;
    const itemSelectors = {
      home: '.worked-section,.summary-section .glass-card,.tl-item,.project-card',
      experience: '.glass-card:not(.nav),.exp-item,.grid > *,.social-link',
      blog: '.filter-row,.blog-card',
      social: '.social-row,.gallery-head,.photo-item,.gallery-actions',
      privacy: 'article > h2,article > p,article > ul'
    };
    const items = [...document.querySelectorAll(itemSelectors[page] || '.glass-card:not(.nav)')];
    items.forEach((el,index) => {
      el.classList.add('sc-act','sc-motion');
      el.style.setProperty('--sc-index',index);
      el.style.setProperty('--sc-stack-top',`${92 + Math.min(index,5) * 7}px`);
      el.dataset.scDevice = ['rise','swing','focus','wipe'][index % 4];
    });

    const timeline = document.querySelector('.timeline');
    const stackCards = page === 'home'
      ? [...document.querySelectorAll('.projects-section .project-card')]
      : page === 'blog'
        ? [...document.querySelectorAll('.blog-card')]
        : [];

    let active = new Set();
    const observed = [...new Set([hero,...titleNodes,...items].filter(Boolean))];
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => entry.isIntersecting ? active.add(entry.target) : active.delete(entry.target));
      }, { rootMargin:'35% 0px 35% 0px', threshold:0 });
      observed.forEach(el => observer.observe(el));
    } else active = new Set(observed);

    const entryProgress = (el,vh) => {
      const r = el.getBoundingClientRect();
      return clamp((vh * .94 - r.top) / (vh * .55));
    };

    const setMotion = (el,p,index = 0) => {
      const e = smooth(p);
      const device = el.dataset.scDevice || 'rise';
      el.style.setProperty('--sc-p',e.toFixed(4));
      el.style.clipPath = '';

      if (device === 'rise') {
        el.style.opacity = mix(.12,1,e).toFixed(3);
        el.style.transform = `translate3d(0,${mix(52,0,e).toFixed(1)}px,0) scale(${mix(.965,1,e).toFixed(4)})`;
        el.style.filter = `saturate(${mix(.72,1,e).toFixed(3)})`;
      } else if (device === 'swing') {
        const dir = index % 2 ? 1 : -1;
        el.style.opacity = mix(.1,1,e).toFixed(3);
        el.style.transform = `translate3d(${(dir * mix(58,0,e)).toFixed(1)}px,${mix(24,0,e).toFixed(1)}px,0) rotate(${(dir * mix(2.2,0,e)).toFixed(2)}deg)`;
        el.style.filter = 'none';
      } else if (device === 'focus') {
        el.style.opacity = mix(.08,1,e).toFixed(3);
        el.style.transform = `scale(${mix(.89,1,e).toFixed(4)}) translate3d(0,${mix(18,0,e).toFixed(1)}px,0)`;
        el.style.filter = `blur(${mix(8,0,e).toFixed(1)}px) saturate(${mix(.72,1,e).toFixed(3)})`;
      } else {
        el.style.opacity = mix(.15,1,e).toFixed(3);
        el.style.transform = `translate3d(0,${mix(30,0,e).toFixed(1)}px,0)`;
        el.style.clipPath = `inset(${mix(18,0,e).toFixed(2)}% ${mix(8,0,e).toFixed(2)}% ${mix(18,0,e).toFixed(2)}% ${mix(8,0,e).toFixed(2)}% round 18px)`;
        el.style.filter = 'none';
      }
    };

    const updateHero = vh => {
      if (!hero) return;
      const r = hero.getBoundingClientRect();
      const travel = Math.max(vh * .9,r.height + vh * .25);
      const p = clamp((-r.top + 20) / travel);
      hero.style.setProperty('--sc-p',p.toFixed(4));
      hero.style.opacity = mix(1,.34,p).toFixed(3);
      hero.style.transform = `translate3d(0,${mix(0,-34,p).toFixed(1)}px,0) scale(${mix(1,.92,p).toFixed(4)})`;
      hero.style.filter = `blur(${mix(0,2.6,p).toFixed(2)}px)`;
    };

    const updateTimeline = vh => {
      if (!timeline) return;
      const r = timeline.getBoundingClientRect();
      const p = clamp((vh * .62 - r.top) / Math.max(1,r.height - vh * .15));
      timeline.style.setProperty('--sc-line-p',p.toFixed(4));
      [...timeline.querySelectorAll('.tl-item')].forEach((node,index) => {
        const ip = entryProgress(node,vh);
        node.style.setProperty('--sc-item-p',smooth(ip).toFixed(4));
        setMotion(node,ip,index);
      });
    };

    const updateStack = vh => {
      if (!stackCards.length || innerWidth > 760) return;
      stackCards.forEach((card,index) => {
        const r = card.getBoundingClientRect();
        const stickyTop = 92 + Math.min(index,5) * 7;
        const compressed = clamp((stickyTop + vh * .18 - r.top) / (vh * .46));
        const scale = mix(1,.94 - Math.min(index,5) * .003,compressed);
        const rotate = (index % 2 ? 1 : -1) * mix(0,.55,compressed);
        card.style.transform = `scale(${scale.toFixed(4)}) rotate(${rotate.toFixed(2)}deg)`;
        card.style.opacity = mix(1,.82,compressed).toFixed(3);
        card.style.filter = `saturate(${mix(1,.88,compressed).toFixed(3)})`;
      });
    };

    const updatePhotos = vh => {
      if (page !== 'social') return;
      active.forEach(el => {
        if (!el.classList.contains('photo-item')) return;
        const r = el.getBoundingClientRect();
        const center = (r.top + r.height / 2 - vh / 2) / vh;
        const p = entryProgress(el,vh);
        const index = parseInt(el.style.getPropertyValue('--sc-index') || '0',10);
        const depth = index % 3 - 1;
        el.style.setProperty('--sc-p',smooth(p).toFixed(4));
        el.style.opacity = mix(.18,1,smooth(p)).toFixed(3);
        el.style.transform = `translate3d(0,${(-center * (9 + Math.abs(depth) * 6)).toFixed(1)}px,${(depth * 5).toFixed(1)}px) rotate(${(depth * .35).toFixed(2)}deg) scale(${mix(.955,1,smooth(p)).toFixed(4)})`;
        el.style.filter = `saturate(${mix(.7,1,smooth(p)).toFixed(3)})`;
      });
    };

    let lastY = window.scrollY;
    let ticking = false;
    const render = () => {
      ticking = false;
      if (reducedMotion.matches) return;
      const vh = window.innerHeight || 800;
      const y = window.scrollY;
      root.classList.toggle('sc-down',y > lastY + 2);
      root.classList.toggle('sc-up',y < lastY - 2);
      lastY = y;

      updateHero(vh);
      active.forEach(el => {
        if (el === hero || el.classList.contains('photo-item') || el.classList.contains('tl-item')) return;
        const index = parseInt(el.style.getPropertyValue('--sc-index') || '0',10);
        setMotion(el,entryProgress(el,vh),index);
      });
      updateTimeline(vh);
      updateStack(vh);
      updatePhotos(vh);
    };

    const requestRender = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(render);
    };

    window.addEventListener('scroll',requestRender,{ passive:true });
    window.addEventListener('resize',requestRender,{ passive:true });
    window.addEventListener('orientationchange',requestRender,{ passive:true });
    requestRender();
    requestAnimationFrame(requestRender);

    if (!reducedMotion.matches && finePointer.matches) {
      const depthTargets = [...document.querySelectorAll('.project-card,.blog-card,.photo-item,.glass-card:not(.nav)')];
      depthTargets.forEach(target => {
        let frame = 0;
        target.addEventListener('pointermove',event => {
          if (innerWidth <= 760) return;
          const rect = target.getBoundingClientRect();
          const x = (event.clientX - rect.left) / rect.width - .5;
          const y = (event.clientY - rect.top) / rect.height - .5;
          cancelAnimationFrame(frame);
          frame = requestAnimationFrame(() => {
            target.style.transform = `perspective(900px) rotateX(${(-y * 3).toFixed(2)}deg) rotateY(${(x * 4).toFixed(2)}deg) translateZ(6px)`;
          });
        },{ passive:true });
        target.addEventListener('pointerleave',() => {
          target.style.transform = '';
          requestRender();
        },{ passive:true });
      });
    }
  },0);
})();