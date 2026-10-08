# Release gates: OAlfawzan Liquid Glass

## Source authority

The main website oalfawzan.sa / omarfoz/oalfawzan.sa is the sole visual source. The portable CSS is a baseline, not guaranteed pixel-identical. Check final light overrides in site.css, main nav geometry, responsive rules and owner-controlled photographic background technique before changes.

## Required structural checks (automatable)

1. Exactly one H1, a named main landmark and a skip link.
2. Header navigation preceding the hero (the v1 user test placed it after).
3. Brand and navigation links grouped in the glass navigation material.
4. Cards generated as individual articles in a grid, not one giant shared card.
5. All local stylesheets and scripts exist, and anchor navigation targets are valid.
6. Theme init executed before CSS renders; visible and accessible theme toggle.
7. No inert buttons or fake links: a button needs a JS event; links point to real pages/sections.
8. No unfilled template variables or placeholder author identity.
9. All visual areas use canonical tokens and appropriate components.
10. No unauthorized external photo hotlinks.

## Required browser checks (where tooling permits)

- Render and inspect 390, 768, 1440px viewports in **both light and dark**.
- Theme toggle immediately changes appearance and persists after reload.
- No page JS exceptions, missing CSS, horizontal overflow or clipped nav items.
- Keyboard navigation and focus visible; form and link interaction behavior works.
- Compare target and **main** website screenshots at equal widths/theme. The automated browser script only validates behavior, **not pixel-level likeness**.

## Failure loop

Generate or edit → run static checker → fix actual errors → rerun. Run browser checks after static PASS → fix regressions → rerun both. On a failure you cannot reproduce locally, report limitations and give exact test command. Do not mislabel a skipped test as passed.

## Not in scope

The style's MIT license does not grant rights to copy the source owner's photography, personal portfolio text or identity. This skill does not guarantee a new site will be a pixel-for-pixel clone without an approved project-owned image and a browser comparison.
