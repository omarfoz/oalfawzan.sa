# oalfawzan.sa

Personal website and photography portfolio for Omar Alfawzan, hosted as a static site on GitHub Pages.

## Architecture

The site intentionally uses plain HTML, CSS, and vanilla JavaScript. There is no framework, package manager, application server, database, or build step.

### Main pages

- `/` — homepage, biography, and personal projects
- `/experience/` — work experience and contact links
- `/blog/` — article index linking to published posts
- `/social/` — photography gallery and full-screen lightbox
- `/privacy/` — privacy and analytics information

### Shared files

- `data.js` — homepage biography and project data
- `site.css` — shared visual, accessibility, and mobile-performance rules
- `analytics.js` — interaction/idle-delayed Google Analytics loader
- `robots.txt` — crawler directives
- `sitemap.xml` — search-engine sitemap
- `CNAME` — GitHub Pages custom domain

## Photography workflow

The source photographs in `social/photos/` are treated as originals and are never overwritten by optimization scripts. The gallery grid uses generated WebP thumbnails from `social/thumbs/`; the lightbox still opens the original JPEG.

The gallery loads a small number of images at a time and opens the original JPEG in the lightbox. When adding photos:

1. Add sequentially named files such as `photo_194.jpg`.
2. Run `python3 scripts/generate_performance_images.py` (requires Pillow) to regenerate thumbnails and image metadata.
3. Update `PHOTO_COUNT` in `social/index.html`.
4. Update the visible photograph count in the social-page hero.
5. Update `sitemap.xml` when the page content meaningfully changes.

## Local development

Because the site uses absolute paths, preview it through a small local web server instead of opening HTML files directly.

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Validation

A lightweight GitHub Actions workflow runs `scripts/validate_site.py` on pushes and pull requests. It checks HTML structure, XML parsing, required site files, and common broken local links without adding third-party dependencies.

Run it locally with:

```bash
python3 scripts/validate_site.py
```

### Optional browser theme tests

Dark mode is the default. An explicitly saved light/dark choice takes precedence;
operating-system theme changes do not override it. Light mode keeps the background
photograph's natural colors.

With the local server running, install the optional test dependencies outside the site:

```bash
npm install --prefix /tmp/light-audit playwright axe-core
export AUDIT_DEPS=/tmp/light-audit
export AUDIT_BASE=http://127.0.0.1:8000
# Use an installed Chrome/Chromium executable (adjust this path for your machine).
export AUDIT_BROWSER=/usr/bin/google-chrome-stable
node scripts/theme-default-test.mjs
node scripts/theme-loading-test.mjs
node scripts/light-mode-audit.mjs
AUDIT_THEME=dark AUDIT_OUT=/tmp/oalfawzan-dark-audit node scripts/light-mode-audit.mjs
```

The audit saves screenshots and JSON under `/tmp/oalfawzan-light-audit` by default.
Axe's incomplete contrast results over photographs/gradients require visual review;
zero reported violations does not establish full contrast compliance.

## Deployment

GitHub Pages publishes from the `main` branch using the custom domain in `CNAME`.

## Analytics

The site uses Google Analytics. See `/privacy/` for the public privacy notice.
