# Implementation guidance

## Project integration

First classify the target as static HTML, React/Next.js, Vue, Svelte, or another stack. Preserve the existing stack. Centralize theme variables in an existing design token module if present.

For plain HTML use:

1. Copy `assets/oalfawzan.css` and `assets/theme.js` to the target project's local public/assets folder.
2. Place the theme bootstrap snippet from `assets/demo.html` in the document head before CSS to avoid light-theme flashing.
3. Add `class="og-app"` to the body, link the stylesheet, and load the script with `defer`.
4. Use `og-container`, `og-nav`, `og-glass`, `og-card`, `og-btn`, `og-btn--primary`, `og-eyebrow`, `og-hero` and `og-muted` where appropriate.
5. Supply a **project-owned** optional backdrop with `--og-background-image: url('./your-background.webp')` on `:root`. An image is not bundled intentionally.
6. Retain original content, anchors, routing and interactive logic. Customize classes/markup only where needed.

The bundled `assets/demo.html` is an isolated visual example, **not** a drop-in replacement for the site's real homepage.

## Components

| Element | Treatment |
| --- | --- |
| Page shell | Centered approx. 900px content, restrained vertical rhythm |
| Navigation | One translucent glass container, compact name and links, predictable mobile reflow |
| Hero | Direct headline, one blue accent if useful, descriptive supporting copy |
| Card/panel | 24px radius, shared material with thin border and inner light |
| Primary action | Blue, prominent but compact |
| Secondary action | Transparent, gently outlined, similar to other glass controls |
| Text input | Clearly labeled, focus outline, legible in both themes |
| Status/empty/error | Maintain semantic meaning; never rely on color alone |
| Table/chart | Clear text and ticks, same shell material, avoid chart-specific neon/glow effects |
| Footer | Low contrast but readable, no unrelated component styles |

## Theme behavior

The source website defaults to dark and saves an explicitly chosen light/dark preference using the key `oalfawzan-theme`. Restore before paint; do not allow system appearance to silently overwrite an explicit user choice. Theme toggles must be proper buttons with visible focus and clear accessible labels.

For other sites that already have established theme preference keys, keep their stored preference behavior and map their state into the canonical `data-theme` values instead of breaking existing users' settings.

## Accessibility and performance

- Each icon button needs an accessible label. Aim for 44px touch targets when the layout permits; the source nav is visually compact but targets may need enlarging for accessibility.
- Support tab order, focus-visible rings, form error/help text, accessible chart labels/alternatives, and semantic navigation.
- Reduce expensive blur and fixed backgrounds on mobile/touch as in the original shared CSS.
- Provide a usable solid-background fallback where backdrop-filter is unsupported.
- Avoid large animated backgrounds and pointer tracking.
- Do not overuse `!important`: the canonical stylesheet uses it to override legacy pages; a new implementation should be cleaner where possible.

## Apply-to-existing-site procedure

1. Inventory every CSS entry point, route and interactive state.
2. Map target's colors to `--site-*` tokens; identify and eliminate contradictory definitions.
3. Create/attach one shared material class; adapt headers, cards, buttons and forms.
4. Keep content and data display intact; do not delete domain-specific color semantics.
5. Test every page at 390, 768 and 1440px widths, or the nearest practical sizes.
6. Test both themes, motion preferences, keyboard and touch.
7. Report what was and was not visually compared with the upstream main website.

## Example user prompts

- "Apply the OAlfawzan Liquid Glass skill to this site. Preserve all features and content, but make the complete site consistent in dark/light and mobile."
- "Audit all pages against the main oalfawzan.sa design. Fix inconsistent panels, fonts, controls and visualizations without changing their logic."
- "Build a landing page with the OAlfawzan Liquid Glass design system, using my own name, copy and hero image."

## Important restraint

Match the original's **quiet hierarchy**. Glass is not the goal by itself. Do not add rainbow gradients, glowing neon borders, excessive nested cards, expensive animated refractions or UI motion merely because the request mentions "liquid glass".
