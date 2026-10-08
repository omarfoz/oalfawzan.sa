# Canonical design authority

The **only authoritative source** for this skill is the main website `oalfawzan.sa`, repository `omarfoz/oalfawzan.sa`, branch `main`.

## Read first

- [Main CSS](https://github.com/omarfoz/oalfawzan.sa/blob/main/site.css): authoritative colors, typography, material, shared components, accessibility, mobile and **late overrides**.
- [Main theme logic](https://github.com/omarfoz/oalfawzan.sa/blob/main/theme.js): visual tuning and theme controls.
- [Theme bootstrap](https://github.com/omarfoz/oalfawzan.sa/blob/main/theme-init.js): persisted theme before paint.
- [Homepage markup](https://github.com/omarfoz/oalfawzan.sa/blob/main/index.html): real component usage, hierarchy and spacing.
- [Repository overview](https://github.com/omarfoz/oalfawzan.sa/blob/main/README.md): static HTML/CSS/JS architecture and page routes.

## Baseline observed 2026-10-08

Values below were derived from the canonical site's live repository files, **not** from tools.oalfawzan.sa or ai.oalfawzan.sa.

| Property | Canonical baseline |
| --- | --- |
| Dark background | `#010204`; dark document background also uses `#1b2942` in later rules |
| Dark action | `#007aff` |
| Dark foreground | `#ffffff` |
| Dark translucent panel | `rgba(255,255,255,.032)` |
| Dark strong panel | `rgba(255,255,255,.050)` |
| Dark border | `rgba(255,255,255,.13)` |
| Dark highlight | `rgba(255,255,255,.20)` |
| Dark blur | `20px`, saturation `160%` |
| **Final effective light background** | `#e7eff8` |
| **Final effective light action** | `#0062cc` |
| **Final effective light foreground** | `#0f172a` |
| Final effective light muted text | `#334155` |
| **Final effective light panel** | `rgba(255,255,255,.70)` |
| Final effective light strong panel | `rgba(255,255,255,.84)` |
| Final effective light border | `rgba(71,85,105,.16)` |
| Final effective light blur | `22px`, saturation `135%` |
| Default width | `900px` |
| Page padding | `16px`, `14px` on mobile/touch |
| Navigation / card / control radius | `28px` / `24px` / `18px` |
| Font | Apple/system sans stack |
| Mobile glass blur | `14px` |
| Mobile breakpoint | `700px` in shared stylesheet |

### Important cascade nuance

The main site's early `html[data-theme="light"]` block starts with `#dce8f5` and softer fill values. A **later, more specific** `html[data-theme="light"][data-theme="light"]` block defines `#e7eff8`, `#0062cc` and stronger milky surfaces with `!important`. Use the final effective visual language, **not the early variables**. Check subsequent responsive rules and the light-shadow tuning injected by `theme.js`.

### Background image

The source portfolio uses an author-owned photographic background and a special softened/blurred light-mode treatment. Reproduce the **technique**, not the exact personal photo by default. Use a replaceable project-local image or image-free gradient fallback; never require hotlinking to the owner's domain.

### Material recipe

- In dark mode, a 145° high-to-low white gradient on top of very transparent white fill.
- 1px subtle border; inset 1px white highlight; low-amplitude outer shadow.
- Background blur with saturation, not opaque frosted-white cards everywhere.
- In light mode, stronger milky tint and gentle border; subtle shadows rather than large diffuse halos.
- Clear hierarchy: the outer card is strongest, nested tiles are quieter.

### Typography

- UI and headings use `--site-font` from the canonical main site, not the homepage's older inline display font declarations.
- Hero: `clamp(2.55rem, 6vw, 3.35rem)`, 700, 1.06 line-height, `-.035em` spacing.
- Page heading: `clamp(2.20rem, 5vw, 2.85rem)`, 700.
- Section label: `.72rem`, 600, uppercase, `.14em` tracking.
- Body: about `.96rem`, line-height `1.65`; smaller labels `.84rem`.
- Avoid introducing serif headline fonts just because older inline CSS includes them. Canonical shared CSS overrides those.

## Authority conflict policy

The other two websites are **non-authoritative examples only**:
- [Tools](https://github.com/omarfoz/tools.oalfawzan.sa) demonstrates application panels and utility UI.
- [AI](https://github.com/omarfoz/ai.oalfawzan.sa) demonstrates diagrams and charts.

Do not import their additional accent colors, typography, custom QuickLiquid behavior, or local dark/light interpretations as the design contract. If they disagree with `site.css`, `site.css` wins.

## Keep it maintainable

Treat the bundled CSS and JS as a **portable snapshot** of the main style. When upstream changes, update this skill only by inspecting the canonical source, comparing token/cascade behavior, and testing dark/light/mobile before publishing a new version.
