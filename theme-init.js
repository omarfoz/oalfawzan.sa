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

  // Safari 26 derives the top/status-bar tint from the document canvas/background.
  // site.css uses #010204 as the body fallback; that exact color is what was appearing
  // in the black strip. Override only the fallback canvas color while preserving the
  // existing background image and gradient.
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
    html[data-theme="light"] body {
      background-color: ${lightTop} !important;
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
