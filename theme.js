(function () {
    const storageKey = 'oalfawzan-theme';
    let savedTheme = null;

    try {
        savedTheme = localStorage.getItem(storageKey);
    } catch (error) {
        // Use the default theme when browser storage is unavailable.
    }

    const systemTheme = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches
        ? 'light'
        : 'dark';
    const initialTheme = savedTheme === 'light' || savedTheme === 'dark' ? savedTheme : systemTheme;
    document.documentElement.dataset.theme = initialTheme;

    function applyTheme(theme) {
        document.documentElement.dataset.theme = theme;

        try {
            localStorage.setItem(storageKey, theme);
        } catch (error) {
            // The current page still works without persistence.
        }

        const metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (metaThemeColor) {
            metaThemeColor.setAttribute('content', theme === 'light' ? '#eef2f7' : '#010204');
        }

        document.querySelectorAll('[data-theme-toggle]').forEach((button) => {
            const nextTheme = theme === 'light' ? 'dark' : 'light';
            button.textContent = nextTheme === 'light' ? 'Light mode' : 'Dark mode';
            button.setAttribute('aria-label', `Switch to ${nextTheme} mode`);
            button.setAttribute('aria-pressed', String(theme === 'light'));
        });
    }

    window.addEventListener('DOMContentLoaded', function () {
        applyTheme(initialTheme);

        document.querySelectorAll('[data-theme-toggle]').forEach((button) => {
            button.addEventListener('click', function () {
                const nextTheme = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
                applyTheme(nextTheme);
            });
        });
    });
})();
