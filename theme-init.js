// Lightweight theme bootstrap retained for compatibility with future static pages.
(() => {
  const key = 'oalfawzan-theme';
  let saved;
  try { saved = localStorage.getItem(key); } catch (_) {}
  document.documentElement.dataset.theme = saved === 'light' || saved === 'dark' ? saved : 'dark';

  const viewport = document.querySelector('meta[name="viewport"]');
  if (viewport && !viewport.content.includes('viewport-fit=cover')) {
    viewport.content += ', viewport-fit=cover';
  }
})();
