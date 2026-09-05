// Run synchronously in <head>, before styles or page content can render.
(() => {
  // Allow the page background to paint behind iPhone/iPad safe areas.
  const viewport = document.querySelector('meta[name="viewport"]');
  if (viewport && !viewport.content.includes('viewport-fit=cover')) {
    viewport.content = `${viewport.content}, viewport-fit=cover`;
  }

  // Keep normal content below the status bar while the body background extends behind it.
  const safeAreaStyle = document.createElement('style');
  safeAreaStyle.textContent = `
    body {
      padding-top: env(safe-area-inset-top, 0px);
      padding-left: env(safe-area-inset-left, 0px);
      padding-right: env(safe-area-inset-right, 0px);
    }
  `;
  document.head.appendChild(safeAreaStyle);

  let saved;
  try { saved = localStorage.getItem('oalfawzan-theme'); } catch (_) {}
  const theme = saved === 'light' || saved === 'dark'
    ? saved
    : 'dark';
  document.documentElement.dataset.theme = theme;

  // Safari uses theme-color for the status-bar/browser chrome fallback.
  // Match it to the top of the site's dark blue background instead of pure black.
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.content = theme === 'light' ? '#dce8f5' : '#1e293f';
})();
