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
- `accessibility.css` — shared focus, reduced-motion, and mobile accessibility rules
- `robots.txt` — crawler directives
- `sitemap.xml` — search-engine sitemap
- `CNAME` — GitHub Pages custom domain

## Photography workflow

The source photographs in `social/photos/` are treated as originals and should not be overwritten by optimization scripts.

The gallery loads a small number of images at a time and opens the original JPEG in the lightbox. When adding photos:

1. Add sequentially named files such as `photo_194.jpg`.
2. Update `PHOTO_COUNT` in `social/index.html`.
3. Update the visible photograph count in the social-page hero.
4. Update `sitemap.xml` when the page content meaningfully changes.

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

## Deployment

GitHub Pages publishes from the `main` branch using the custom domain in `CNAME`.

## Analytics

The site uses Google Analytics. See `/privacy/` for the public privacy notice.
