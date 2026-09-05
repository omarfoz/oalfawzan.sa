// Theme bootstrap: runs synchronously in <head> before page content paints.
(() => {
  const storageKey = 'oalfawzan-theme';
  const darkTop = '#1b2942';
  const lightTop = '#e7eff8';

  let saved;
  try { saved = localStorage.getItem(storageKey); } catch (_) {}
  document.documentElement.dataset.theme =
    saved === 'light' || saved === 'dark' ? saved : 'dark';

  const viewport = document.querySelector('meta[name="viewport"]');
  if (viewport && !viewport.content.includes('viewport-fit=cover')) {
    viewport.content = `${viewport.content}, viewport-fit=cover`;
  }

  const syncChrome = () => {
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      meta.content = document.documentElement.dataset.theme === 'light'
        ? lightTop
        : darkTop;
    }
  };
  syncChrome();

  const style = document.createElement('style');
  style.id = 'site-theme-bootstrap';
  style.textContent = `
    html[data-theme="dark"]{background-color:${darkTop}!important}
    html[data-theme="dark"] body{background-color:${darkTop}!important}

    html[data-theme="light"][data-theme="light"]{
      color-scheme:light;
      --site-bg:${lightTop}!important;
      --site-accent:#0062cc!important;
      --site-text:#0f172a!important;
      --site-text-muted:#334155!important;
      --site-text-faint:#415166!important;
      --site-glass-fill:rgba(255,255,255,.70)!important;
      --site-glass-fill-strong:rgba(255,255,255,.84)!important;
      --site-glass-border:rgba(71,85,105,.16)!important;
      --site-glass-highlight:rgba(255,255,255,.96)!important;
      --site-glass-shadow:rgba(38,55,78,.13)!important;
      --site-glass-blur:22px!important;
      --site-glass-saturation:135%!important;
      --border-strong:rgba(51,65,85,.30)!important;
      background-color:${lightTop}!important
    }

    html[data-theme="light"][data-theme="light"] body,
    html[data-theme="light"][data-theme="light"] body:has(.photo-grid){
      position:relative!important;
      isolation:isolate!important;
      color:var(--site-text)!important;
      background:var(--site-bg)!important
    }

    html[data-theme="light"][data-theme="light"] body::before,
    html[data-theme="light"][data-theme="light"] body:has(.photo-grid)::before{
      content:""!important;
      position:fixed!important;
      inset:-34px!important;
      z-index:-1!important;
      pointer-events:none!important;
      background:
        linear-gradient(rgba(231,239,248,.82),rgba(231,239,248,.86)),
        url('/image-1600.webp') center/cover no-repeat!important;
      filter:blur(22px) saturate(.72) brightness(1.06)!important;
      -webkit-filter:blur(22px) saturate(.72) brightness(1.06)!important;
      transform:scale(1.08)!important;
      transform-origin:center!important
    }

    body{
      min-height:100dvh;
      padding-left:env(safe-area-inset-left,0px);
      padding-right:env(safe-area-inset-right,0px)
    }

    @supports(padding:max(0px)){
      .container{
        padding-left:max(var(--site-page-pad,16px),env(safe-area-inset-left,0px))!important;
        padding-right:max(var(--site-page-pad,16px),env(safe-area-inset-right,0px))!important
      }
    }

    html[data-theme="light"][data-theme="light"] h1,
    html[data-theme="light"][data-theme="light"] h2,
    html[data-theme="light"][data-theme="light"] h3,
    html[data-theme="light"][data-theme="light"] h4,
    html[data-theme="light"][data-theme="light"] .nav-name,
    html[data-theme="light"][data-theme="light"] .company,
    html[data-theme="light"][data-theme="light"] .tl-title,
    html[data-theme="light"][data-theme="light"] .project-name,
    html[data-theme="light"][data-theme="light"] .blog-title,
    html[data-theme="light"][data-theme="light"] .gallery-title{
      color:var(--site-text)!important
    }

    html[data-theme="light"][data-theme="light"] .hero-sub,
    html[data-theme="light"][data-theme="light"] .intro,
    html[data-theme="light"][data-theme="light"] .blog-excerpt,
    html[data-theme="light"][data-theme="light"] .project-desc,
    html[data-theme="light"][data-theme="light"] .tl-body,
    html[data-theme="light"][data-theme="light"] .learned-text,
    html[data-theme="light"][data-theme="light"] .gallery-copy,
    html[data-theme="light"][data-theme="light"] .period,
    html[data-theme="light"][data-theme="light"] .blog-meta,
    html[data-theme="light"][data-theme="light"] .gallery-counter,
    html[data-theme="light"][data-theme="light"] footer,
    html[data-theme="light"][data-theme="light"] body:has(article) article p,
    html[data-theme="light"][data-theme="light"] body:has(article) article li{
      color:var(--site-text-muted)!important
    }

    html[data-theme="light"][data-theme="light"] .hero-sub,
    html[data-theme="light"][data-theme="light"] .intro,
    html[data-theme="light"][data-theme="light"] .blog-excerpt,
    html[data-theme="light"][data-theme="light"] .project-desc,
    html[data-theme="light"][data-theme="light"] .tl-body,
    html[data-theme="light"][data-theme="light"] .learned-text,
    html[data-theme="light"][data-theme="light"] .gallery-copy,
    html[data-theme="light"][data-theme="light"] .summary-section .glass-card>p,
    html[data-theme="light"][data-theme="light"] body:has(article) article p,
    html[data-theme="light"][data-theme="light"] body:has(article) article li{
      font-weight:400!important
    }

    html[data-theme="light"][data-theme="light"] .section-title,
    html[data-theme="light"][data-theme="light"] .worked-label,
    html[data-theme="light"][data-theme="light"] .hero-eyebrow,
    html[data-theme="light"][data-theme="light"] .meta-pill{
      color:var(--site-text-faint)!important
    }

    html[data-theme="light"][data-theme="light"] .section-title::after{
      background:rgba(51,65,85,.22)!important
    }

    html[data-theme="light"][data-theme="light"] .hero-role,
    html[data-theme="light"][data-theme="light"] .headline,
    html[data-theme="light"][data-theme="light"] .tl-year,
    html[data-theme="light"][data-theme="light"] .blog-tag,
    html[data-theme="light"][data-theme="light"] .gallery-kicker,
    html[data-theme="light"][data-theme="light"] .eyebrow,
    html[data-theme="light"][data-theme="light"] .learned-label,
    html[data-theme="light"][data-theme="light"] .page-header p .accent,
    html[data-theme="light"][data-theme="light"] .blog-read,
    html[data-theme="light"][data-theme="light"] body:has(article) article a{
      color:#004ea6!important
    }

    html[data-theme="light"][data-theme="light"] .glass,
    html[data-theme="light"][data-theme="light"] .glass-card,
    html[data-theme="light"][data-theme="light"] .project-card,
    html[data-theme="light"][data-theme="light"] .blog-card,
    html[data-theme="light"][data-theme="light"] .social-link,
    html[data-theme="light"][data-theme="light"] .meta-pill,
    html[data-theme="light"][data-theme="light"] .pill,
    html[data-theme="light"][data-theme="light"] .logo-pill{
      background:
        linear-gradient(145deg,rgba(255,255,255,.88),rgba(255,255,255,.54) 62%),
        var(--site-glass-fill)!important;
      border-color:var(--site-glass-border)!important;
      box-shadow:
        inset 0 1px 0 var(--site-glass-highlight),
        inset 0 -1px 0 rgba(51,65,85,.06),
        0 12px 30px var(--site-glass-shadow)!important;
      -webkit-backdrop-filter:blur(var(--site-glass-blur)) saturate(var(--site-glass-saturation))!important;
      backdrop-filter:blur(var(--site-glass-blur)) saturate(var(--site-glass-saturation))!important
    }

    html[data-theme="light"][data-theme="light"] .nav,
    html[data-theme="light"][data-theme="light"] .nav.glass-card,
    html[data-theme="light"][data-theme="light"] body:has(.photo-grid) .nav{
      background:
        linear-gradient(145deg,rgba(255,255,255,.93),rgba(255,255,255,.62) 64%),
        rgba(255,255,255,.72)!important;
      border-color:rgba(71,85,105,.15)!important;
      box-shadow:
        inset 0 1px 0 rgba(255,255,255,.98),
        0 12px 28px rgba(38,55,78,.12)!important
    }

    html[data-theme="light"][data-theme="light"] .btn-sm,
    html[data-theme="light"][data-theme="light"] .filter-pill,
    html[data-theme="light"][data-theme="light"] .social-btn,
    html[data-theme="light"][data-theme="light"] .cta-secondary,
    html[data-theme="light"][data-theme="light"] .action-btn:not(.primary),
    html[data-theme="light"][data-theme="light"] .project-link{
      color:var(--site-text)!important;
      background:rgba(255,255,255,.64)!important;
      border-color:rgba(71,85,105,.18)!important;
      box-shadow:inset 0 1px 0 rgba(255,255,255,.94),0 3px 10px rgba(38,55,78,.06)!important
    }

    html[data-theme="light"][data-theme="light"] .btn-sm.active,
    html[data-theme="light"][data-theme="light"] .filter-pill.active,
    html[data-theme="light"][data-theme="light"] .action-btn.primary,
    html[data-theme="light"][data-theme="light"] .cta-primary{
      color:#fff!important;
      background:var(--site-accent)!important;
      border-color:rgba(255,255,255,.58)!important;
      box-shadow:inset 0 1px 0 rgba(255,255,255,.25),0 4px 14px rgba(0,98,204,.20)!important
    }

    html[data-theme="light"][data-theme="light"] .theme-toggle{
      color:#1e293b!important;
      background:rgba(255,255,255,.55)!important;
      border:1px solid rgba(71,85,105,.14)!important;
      box-shadow:inset 0 1px 0 rgba(255,255,255,.95)!important
    }

    html[data-theme="light"][data-theme="light"] .timeline::before{
      background:linear-gradient(to bottom,var(--site-accent),rgba(0,98,204,.18))!important
    }

    html[data-theme="light"][data-theme="light"] .tl-dot{
      background:#f8fbff!important;
      border-color:var(--site-accent)!important;
      box-shadow:0 0 0 3px rgba(0,98,204,.08),0 0 12px rgba(0,98,204,.20)!important
    }

    html[data-theme="light"][data-theme="light"] .tl-dot.big{
      background:var(--site-accent)!important
    }

    html[data-theme="light"][data-theme="light"] .ptag{
      background:rgba(0,98,204,.08)!important;
      border-color:rgba(0,98,204,.20)!important;
      color:#004ea6!important
    }

    html[data-theme="light"][data-theme="light"] .ptag.year{
      background:rgba(15,23,42,.045)!important;
      border-color:rgba(71,85,105,.14)!important;
      color:var(--site-text-muted)!important
    }

    html[data-theme="light"][data-theme="light"] .project-learned{
      background:rgba(219,234,254,.58)!important;
      border-color:rgba(0,98,204,.16)!important
    }

    html[data-theme="light"][data-theme="light"] .logo-pill svg{
      filter:none!important;
      opacity:.82!important;
      color:#1e293b!important;
      fill:#1e293b!important
    }

    html[data-theme="light"][data-theme="light"] .logo-pill svg [fill="white"],
    html[data-theme="light"][data-theme="light"] .logo-pill svg [fill="#fff"],
    html[data-theme="light"][data-theme="light"] .logo-pill svg [fill="#ffffff"],
    html[data-theme="light"][data-theme="light"] .logo-pill svg [fill="#FFFFFF"]{
      fill:#1e293b!important
    }

    html[data-theme="light"][data-theme="light"] .logo-pill img{
      filter:brightness(0) saturate(100%)!important;
      opacity:.78!important
    }

    html[data-theme="light"][data-theme="light"] .blog-cover{
      border-bottom:1px solid rgba(15,23,42,.10)!important
    }

    html[data-theme="light"][data-theme="light"] .blog-meta{
      border-top-color:rgba(51,65,85,.16)!important
    }

    html[data-theme="light"][data-theme="light"] body:has(.exp-item) .exp-item{
      border-bottom-color:rgba(51,65,85,.16)!important
    }

    html[data-theme="light"][data-theme="light"] .social-link{
      color:var(--site-text)!important
    }

    html[data-theme="light"][data-theme="light"] a[href^="mailto:"] svg{
      fill:var(--site-accent)!important
    }

    html[data-theme="light"][data-theme="light"] body:has(article) article h2{
      color:var(--site-text)!important
    }

    html[data-theme="light"][data-theme="light"] body:has(.photo-grid) .hero h1 em{
      color:var(--site-accent)!important
    }

    html[data-theme="light"][data-theme="light"] body:has(.photo-grid) .social-icon{
      color:#334155!important;
      background:rgba(15,23,42,.06)!important
    }

    html[data-theme="light"][data-theme="light"] body:has(.photo-grid) .photo-item{
      border-color:rgba(71,85,105,.16)!important;
      background:rgba(255,255,255,.50)!important;
      box-shadow:0 8px 24px rgba(38,55,78,.10)!important
    }

    html[data-theme="light"][data-theme="light"] .lightbox,
    html[data-theme="light"][data-theme="light"] .lightbox-control,
    html[data-theme="light"][data-theme="light"] .lightbox-info{
      color:#fff!important
    }

    @media(hover:hover) and (pointer:fine){
      html[data-theme="light"][data-theme="light"] .btn-sm:not(.active):hover,
      html[data-theme="light"][data-theme="light"] .filter-pill:not(.active):hover,
      html[data-theme="light"][data-theme="light"] .social-btn:hover,
      html[data-theme="light"][data-theme="light"] .cta-secondary:hover,
      html[data-theme="light"][data-theme="light"] .action-btn:not(.primary):hover{
        color:#0f172a!important;
        background:rgba(255,255,255,.86)!important;
        border-color:rgba(51,65,85,.28)!important
      }

      html[data-theme="light"][data-theme="light"] .theme-toggle:hover{
        background:rgba(255,255,255,.86)!important;
        border-color:rgba(51,65,85,.22)!important
      }

      html[data-theme="light"][data-theme="light"] .social-link:hover,
      html[data-theme="light"][data-theme="light"] .project-card:hover,
      html[data-theme="light"][data-theme="light"] .blog-card:hover{
        border-color:rgba(0,98,204,.28)!important;
        box-shadow:inset 0 1px 0 rgba(255,255,255,.98),0 14px 34px rgba(38,55,78,.15)!important
      }
    }

    @media(max-width:700px),(pointer:coarse){
      html[data-theme="light"][data-theme="light"]{
        --site-glass-blur:16px!important;
        --site-glass-saturation:125%!important
      }

      html[data-theme="light"][data-theme="light"] body::before,
      html[data-theme="light"][data-theme="light"] body:has(.photo-grid)::before{
        inset:-26px!important;
        filter:blur(18px) saturate(.70) brightness(1.06)!important;
        -webkit-filter:blur(18px) saturate(.70) brightness(1.06)!important;
        transform:scale(1.09)!important
      }
    }

    @supports not ((-webkit-backdrop-filter:blur(1px)) or (backdrop-filter:blur(1px))){
      html[data-theme="light"][data-theme="light"] .glass,
      html[data-theme="light"][data-theme="light"] .glass-card,
      html[data-theme="light"][data-theme="light"] .project-card,
      html[data-theme="light"][data-theme="light"] .blog-card,
      html[data-theme="light"][data-theme="light"] .social-link,
      html[data-theme="light"][data-theme="light"] .nav{
        background:rgba(248,251,255,.94)!important
      }
    }
  `;
  document.head.appendChild(style);

  // Prevent theme.js from reintroducing the old black status-bar color after toggles.
  new MutationObserver(syncChrome).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme']
  });

  // Home predates the shared theme controller. Load it only where it is missing.
  window.addEventListener('DOMContentLoaded', () => {
    const hasThemeScript = [...document.scripts].some(script => {
      try {
        return new URL(script.src, location.href).pathname === '/theme.js';
      } catch (_) {
        return false;
      }
    });

    if (!hasThemeScript) {
      const script = document.createElement('script');
      script.src = '/theme.js';
      document.body.appendChild(script);
    }
  }, { once: true });
})();
