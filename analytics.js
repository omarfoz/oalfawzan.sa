(() => {
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
