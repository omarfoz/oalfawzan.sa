(() => {
  /* Home historically did not include theme.js. Keep analytics.js as the
     universal bootstrap so every page gets the same theme controller. */
  if (!document.querySelector('script[src^="/theme.js"]') && !window.__oalfawzanThemeInitialized) {
    const themeScript = document.createElement('script');
    themeScript.src = '/theme.js?v=20260901';
    themeScript.defer = true;
    document.head.appendChild(themeScript);
  }

  const measurementId = 'G-FF5QTH48B5';
  let loaded = false;

  function loadAnalytics() {
    if (loaded) return;
    loaded = true;

    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function gtag() { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', measurementId);

    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.appendChild(script);
  }

  ['pointerdown', 'keydown', 'touchstart', 'scroll'].forEach(eventName => {
    window.addEventListener(eventName, loadAnalytics, { once: true, passive: true });
  });

  window.addEventListener('load', () => window.setTimeout(loadAnalytics, 8000), { once: true });
})();