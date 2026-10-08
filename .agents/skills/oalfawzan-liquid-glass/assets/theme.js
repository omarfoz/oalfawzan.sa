/* Portable theme toggles based on oalfawzan.sa. No dependencies. */
(() => {
  const root = document.documentElement;
  const key = "oalfawzan-theme";
  function readTheme() {
    try {
      const saved = localStorage.getItem(key);
      return saved === "light" ? "light" : "dark";
    } catch (_) {
      return root.dataset.theme === "light" ? "light" : "dark";
    }
  }
  function updateControls() {
    const mode = root.dataset.theme === "light" ? "light" : "dark";
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = mode === "light" ? "#e7eff8" : "#010204";
    const ar = root.lang.toLowerCase().startsWith("ar");
    document.querySelectorAll("[data-og-theme-toggle]").forEach(button => {
      button.setAttribute("aria-label", mode === "light" ? (ar ? "التبديل إلى الوضع الداكن" : "Switch to dark theme") : (ar ? "التبديل إلى الوضع الفاتح" : "Switch to light theme"));
      button.setAttribute("aria-pressed", String(mode === "light"));
      const label = button.querySelector("[data-og-theme-label]");
      if (label) label.textContent = mode === "light" ? (ar ? "الوضع الداكن" : "Dark mode") : (ar ? "الوضع الفاتح" : "Light mode");
    });
  }
  root.dataset.theme = readTheme();
  function setTheme(value) {
    const next = value === "light" ? "light" : "dark";
    root.dataset.theme = next;
    try { localStorage.setItem(key, next); } catch (_) {}
    updateControls();
  }
  document.addEventListener("click", event => {
    const button = event.target.closest("[data-og-theme-toggle]");
    if (!button) return;
    setTheme(root.dataset.theme === "light" ? "dark" : "light");
  });
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", updateControls, { once: true });
  } else {
    updateControls();
  }
})();
