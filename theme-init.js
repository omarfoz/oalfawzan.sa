// Run synchronously in <head>, before styles or page content can render.
(() => {
  let saved;
  try { saved = localStorage.getItem('oalfawzan-theme'); } catch (_) {}
  const theme = saved === 'light' || saved === 'dark'
    ? saved
    : 'dark';
  document.documentElement.dataset.theme = theme;
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.content = theme === 'light' ? '#dce8f5' : '#010204';
})();
