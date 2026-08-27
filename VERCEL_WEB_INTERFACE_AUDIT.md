# Vercel Web Interface Guidelines Audit

Baseline: `3eae536f78caf75e4f504e78b6e493698df057a3`

Guideline source: latest `vercel-labs/web-interface-guidelines/main/command.md`, fetched for this review as required by the `web-design-guidelines` skill.

## Route inventory

1. `/` — Home, biography timeline, worked-with logos, projects
2. `/experience/` — summary, contact links, work history, skills, education
3. `/blog/` — article filters and external article cards
4. `/social/` — social links, 193-photo paged gallery, lightbox/dialog
5. `/privacy/` — privacy notice

No forms, authentication, dashboard, tables, search, dropdown menus, tabs, accordions, tooltips, toasts, or server-rendered loading/error states exist in this static site.

## Shared frontend surface

- `accessibility.css` — shared themes, focus, reduced motion, mobile overrides
- `frontend-design.css` — visual identity, typography, layout hierarchy
- `theme.js` — theme toggle and ScrollCraft runtime
- `web-guidelines.js` — shared standards/accessibility runtime
- `data.js` — Home content and Home runtime bootstrap
- `vercel-guidelines.css` — Vercel-guideline remediation layer added by this audit

## First-pass findings

### Accessibility

- Home, Experience, and Blog do not expose a static `<main>` landmark.
- Some navigation elements rely on runtime `aria-current` rather than consistent source markup.
- Logo-only Home links need programmatic names.
- Decorative SVGs/cover graphics are not consistently hidden from assistive technology.
- Mixed Arabic/English article titles need direction-safe handling.
- Skip-link behavior had previously been fragile on mobile.

### Responsive/mobile

- Navigation controls are below a 44px touch-target floor.
- ScrollCraft sticky chapter/card behavior can cover or dim mobile content.
- Fixed-background and heavy paint effects are expensive on mobile Safari.
- Small-width navigation needs explicit overflow/safe-area handling.

### Motion/performance

- ScrollCraft uses `filter` and `clip-path` in addition to transform/opacity.
- Permanent `will-change` and multiple scroll effects create avoidable paint/GPU cost.
- Gallery contains >50 images and needs explicit long-list rendering optimization.

### Navigation/state

- Blog filter state needs URL synchronization and accessible status feedback.
- `target="_blank"` links are not consistently authored with both `noopener` and `noreferrer` in legacy markup.

### Images/CLS

- Hero images have visual dimensions in CSS but not always explicit HTML dimensions.
- Dynamically generated gallery images cannot reserve exact natural aspect ratio until metadata is available; the shared runtime adds intrinsic dimensions as soon as images load and `content-visibility` reduces large-list rendering cost.

### Theme/focus

- `color-scheme` needs to stay synchronized with the runtime theme.
- Focus treatment needs a consistent high-contrast shared rule across all pages and themes.

## Remediation implemented

- Added `vercel-guidelines.css` with focus-visible, touch targets, safe areas, long-content handling, responsive navigation, reduced-motion, dialog overscroll containment, long-gallery `content-visibility`, and mobile ScrollCraft stabilization.
- Expanded `web-guidelines.js` to provide/normalize main landmarks, skip navigation, primary-nav labeling, current-page state, external-link safety, logo-link accessible names, image loading behavior, decorative SVG hiding, heading semantics, mixed-language direction, theme/color-scheme synchronization, Blog URL filter state/status, gallery dialog semantics, locale-aware dates, and translation protection for identifiers.
- Kept ScrollCraft on desktop but restricted visual animation to transform/opacity; touch/mobile gets stable readable content instead of sticky/opacity/parallax choreography.
- Added `scripts/validate_interface.py` and wired it into GitHub Actions together with `node --check` for all shared JavaScript runtimes.

## Remaining source-level notes

The legacy static HTML still contains a small number of `target="_blank"` links without full `rel` tokens and three routes rely on the shared runtime to insert their `<main>` landmark. These are normalized before interaction by `web-guidelines.js`; the regression validator reports them as warnings so they remain visible rather than silently ignored.
