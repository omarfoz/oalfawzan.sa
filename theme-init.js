// Run synchronously in <head>, before styles or page content can render.
(() => {
  let saved;
  try { saved = localStorage.getItem('oalfawzan-theme'); } catch (_) {}
  const theme = saved === 'light' || saved === 'dark' ? saved : 'dark';
  document.documentElement.dataset.theme = theme;

  const darkTop = '#1b2942';
  const lightTop = '#dce8f5';
  const topColor = theme === 'light' ? lightTop : darkTop;

  // Apply viewport-fit and theme color synchronously to the existing first meta tags.
  // This avoids duplicate viewport/theme-color tags and keeps older Safari versions aligned.
  const viewport = document.querySelector('meta[name="viewport"]');
  if (viewport && !viewport.content.includes('viewport-fit=cover')) {
    viewport.content = `${viewport.content}, viewport-fit=cover`;
  }

  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.content = topColor;

  // Keep the iOS canvas aligned with the page background. In light mode, render the
  // wallpaper on a fixed pseudo-element so only the wallpaper is blurred — never the content.
  // The duplicated [data-theme] selector deliberately outranks site.css even though this
  // synchronous style is inserted before the shared stylesheet finishes loading.
  const style = document.createElement('style');
  style.textContent = `
    html[data-theme="dark"] {
      background-color: ${darkTop} !important;
    }
    html[data-theme="dark"] body {
      background-color: ${darkTop} !important;
    }
    html[data-theme="light"] {
      background-color: ${lightTop} !important;
    }
    html[data-theme="light"][data-theme="light"] body {
      position: relative;
      isolation: isolate;
      background: ${lightTop} !important;
    }
    html[data-theme="light"][data-theme="light"] body::before {
      content: "";
      position: fixed;
      inset: -28px;
      z-index: -1;
      pointer-events: none;
      background: url('/image-1600.webp') center / cover no-repeat;
      filter: blur(18px);
      -webkit-filter: blur(18px);
      transform: scale(1.06);
      transform-origin: center;
      opacity: 0.90;
    }
    body {
      min-height: 100dvh;
      padding-left: env(safe-area-inset-left, 0px);
      padding-right: env(safe-area-inset-right, 0px);
    }
    @supports (padding: max(0px)) {
      .container {
        padding-left: max(var(--site-page-pad, 16px), env(safe-area-inset-left, 0px)) !important;
        padding-right: max(var(--site-page-pad, 16px), env(safe-area-inset-right, 0px)) !important;
      }
    }
  `;
  document.head.appendChild(style);
})();
