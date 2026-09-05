// Run synchronously in <head>, before styles or page content can render.
(() => {
  let saved;
  try { saved = localStorage.getItem('oalfawzan-theme'); } catch (_) {}
  const theme = saved === 'light' || saved === 'dark' ? saved : 'dark';
  document.documentElement.dataset.theme = theme;

  const darkTop = '#1b2942';
  const lightTop = '#dce8f5';
  const topColor = theme === 'light' ? lightTop : darkTop;

  // iOS Safari decides viewport/status-bar treatment while parsing <head>.
  // Insert these synchronously rather than changing the existing tags afterwards.
  document.write('<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">');
  document.write('<meta name="theme-color" content="' + topColor + '">');
  document.write('<meta name="apple-mobile-web-app-capable" content="yes">');
  document.write('<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">');

  // Keep the document canvas the same colour all the way through the iOS safe area.
  const style = document.createElement('style');
  style.textContent = `
    html {
      background-color: ${topColor} !important;
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

  const meta = document.querySelector('meta[name="theme-color"]:last-of-type');
  if (meta) meta.content = topColor;
})();
