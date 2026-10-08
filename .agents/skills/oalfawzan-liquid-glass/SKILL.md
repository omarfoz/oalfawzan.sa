---
name: oalfawzan-liquid-glass
description: Apply or audit the OAlfawzan Liquid Glass visual design system on a website using the oalfawzan.sa main portfolio as the sole design authority. Use when a user requests OAlfawzan styling, glassmorphism, matching the portfolio design, consistent dark/light themes, or harmonizing an existing multi-page UI with this aesthetic.
license: MIT
compatibility: Codex, OpenCode, and agents that support the Agent Skills SKILL.md convention.
metadata:
  author: Omar Alfawzan
  source: https://github.com/omarfoz/oalfawzan.sa
---

# OAlfawzan Liquid Glass

Apply the visual language of the **main website, https://oalfawzan.sa/**. The canonical repository is **https://github.com/omarfoz/oalfawzan.sa**.

## Non-negotiable source priority

1. **Primary authority:** the main site's `site.css`, `theme.js`, `theme-init.js`, and page HTML in `omarfoz/oalfawzan.sa` on `main`. Inspect these before claiming pixel parity, and note the specific revision inspected.
2. **Portable baseline:** this skill's `assets/oalfawzan.css` and `assets/theme.js`. These are intentionally distilled from the main site, without portfolio content or personal photos. They are starting points, not a replacement source of truth.
3. **Secondary validation only:** `tools.oalfawzan.sa` and `ai.oalfawzan.sa` are examples of adaptations for functional tools and educational diagrams. Never let their local colors, fonts, effects, chart styling, or exceptions override the main site's identity.

If any example differs from the main portfolio, **follow the main portfolio**. See `references/design-authority.md`.

## Visual fidelity contract: do NOT invent a new theme

**This is a reference-reproduction skill, not a generative "liquid glass" aesthetic prompt.** The target is the visual identity implemented by **the MAIN oalfawzan.sa website**, not a generic glowing UI associated with those words. Treat any user-provided screenshot of another website as **the site to transform**, not as permission to rewrite its content.

Before any edit:
1. **Verify the skill was actually loaded**: read this `SKILL.md` file from the project workspace. A phrase such as `npx skills add ...` appearing in a chat message is not proof of an executed installation. If running in a text-only assistant without shell/repository access, tell the user you cannot install or edit the site; instead supply actionable code/instructions, explicitly labeled as unexecuted.
2. **Read the actual canonical implementation**: fetch main `site.css`, `theme.js` and representative markup from `oalfawzan.sa`, or use the bundled portable tokens if offline. Before coding, explicitly identify at least the source's dark/light palettes, translucent material recipe, radius scale, typography, background treatment and responsive rules. Do not claim to have inspected the site unless you did.
3. **Take a visual baseline**: establish the target site's current copy, component structure, CTA labels, spacing, content ordering, active color theme, navigation, and all pages. If the user supplied before screenshots, use them to check content/structure preservation.
4. **Implement faithfully, not creatively**: change styling through a common token/component layer while leaving original language, brand, headings, labels, routes, interaction, links, and content intact. Keep the target's explicit theme choice/default preference unless the user authorizes changing it. The reference site has both dark and light designs; **"use this design" does not mean "force everything to dark."**
5. **Verify visual outcomes**: compare target screenshots with canonical oalfawzan.sa at a matched viewport and corresponding light/dark theme if visual tooling is available. If not, state exactly which aspects are source-derived and that screenshot parity is unverified.

**Forbidden substitutions unless explicitly demanded by the user or present in the canonical main implementation:**
- No neon cyan/purple hero gradients, rainbow-colored name text, abstract animated gradient blobs, or rotating light orbs.
- No cursor-following ambient glows, reactive refraction, parallax spectacles, or unnecessary animation libraries.
- No full-page dark-only overhaul of a light site just because the word "glass" appeared.
- No reworded bio, job title, value proposition, CTA copy, or different button order as a side effect of styling.
- No rewriting the entire app, breaking mobile navigation, replacing site content with a generic portfolio template, or wholesale refactoring of working logic to apply CSS.
- No borrowed personal photograph from oalfawzan.sa in a public template without separate permission; **the reference's photographic backdrop is central to its look**, so ask for a user-owned background if precise backdrop matching is desired. Explain that without the photo, pixel-level fidelity is impossible.

**Fail-fast rule:** If you cannot load this skill OR inspect either the canonical source or the bundled baseline, **stop rather than guessing**. Never claim you have applied "OAlfawzan Liquid Glass" after merely implementing generic dark glassmorphism.

Read `references/fidelity-tests.md` for a concrete before/after failure case and the release acceptance checklist.

## When to use

- Build a website with the same design language as oalfawzan.sa.
- Reskin an existing website while retaining all content and behaviors.
- Create a new page or component that belongs in the same visual family.
- Audit a site for drift from the canonical liquid-glass language.

Do not use this skill when the user explicitly requests a different design or wishes only to change content.

## Workflow

1. **Inspect first.** Discover the target project's entry points, routes, stylesheets, theme implementation, design tokens, assets and interactive components. Find hidden routes, nested pages, dialogs, charts, responsive layouts and 404 pages. Do not assume only the homepage matters.
2. **Consult the authority.** If GitHub/network access is available, read the latest main site's `site.css`, theme scripts and markup. Pay attention to later cascading light-mode overrides in `site.css` (the first light declaration is not the final effective palette). When offline, use the bundled baseline and explicitly state that live parity could not be verified.
3. **Preserve the product.** Keep the current framework, routing, functionality, copy, analytics, SEO metadata, external integrations, accessibility and user data flows. Do not rewrite working JavaScript for cosmetic changes. Back up/commit current state before broad edits.
4. **Centralize the system.** Use a shared semantic-token layer and reusable materials rather than per-page overrides. For a plain HTML/CSS site, start from `assets/oalfawzan.css` and `assets/theme.js`; for React, Vue, Next.js or similar, translate the tokens and components into that project's existing conventions. Avoid introducing a new framework just to apply the design.
5. **Match the design, not a trend.** Never invent animated blobs, neon gradients, cursor glow or additional material engines. Apply one blue accent, restrained translucent panels with an inner highlight, typography and spacing from the main portfolio, calm controls, consistent navigation, and the photo/gradient backdrop treatment. Allow users to supply their **own** background photo; do not hotlink the owner's personal image.
6. **Retain light/dark.** Dark is the default unless the target already has a preference policy. Honor an explicitly selected theme, prevent first-paint flashing, use accessible toggle controls, and ensure all content is legible in both modes.
7. **Adapt specialized components.** Tables, visualizations and diagrams should use the same shell, border, type and elevation. Keep semantic chart colors only when they encode meaning, and ensure the chart remains readable in both themes. Do not turn every chart into a heavily blurred glass panel.
8. **Check every route.** Validate wide desktop, tablet and mobile widths, touch, keyboard, focus, disabled/error/empty states, reduced-motion preferences, browser fallback for backdrop-filter, RTL if the site uses Arabic, and readable contrast.
9. **Report precisely.** List modified files, visual changes, preserved functionality, checks run and remaining limitations. Never claim screenshot-perfect parity without actual visual comparison.

## Visual invariants

- **Default dark:** `#010204` background, `#007aff` accent, white foreground.
- **Effective light mode:** `#e7eff8` background and `#0062cc` accent, reflecting the **later active overrides** in the main site's stylesheet.
- **Material:** translucent white layers, 1px glass border, subtle inner highlight and restrained shadow; approx. 20px desktop backdrop blur. Light mode has a milky material, not merely inverted dark glass.
- **Shape:** cards 24px, navigation 28px, controls 18px. Individual components may follow the main site's explicit exceptions rather than inventing a second radius system.
- **Typography:** the main site's system sans stack, bold compact headlines, quiet uppercase section labels, 1.6–1.65 body line-height. Do not copy the secondary sites' special-purpose fonts into the canonical system.
- **Content width:** main column approximately 900px; 16px base page padding and 14px on compact/touch layouts.
- **Responsiveness:** mobile blur reduced to about 14px, backdrop scrolling rather than fixed backgrounds on touch, no horizontal overflow.
- **Motion:** short restrained transitions with `prefers-reduced-motion` support; no gratuitous glows, decorative animated blobs or scroll theatrics.

Use the full token and component detail in `references/design-authority.md` and `references/implementation.md`.

## Completion checklist

- [ ] Skill file was actually loaded by the agent; installation was not merely pasted into chat.
- [ ] Canonical main site was consulted, or offline limitation was disclosed.
- [ ] Original page copy, CTA text, content hierarchy, routes and preferred theme remain intact.
- [ ] No invented gradients, animated background blobs, cursor glows or other generic glassmorphism additions.
- [ ] Shared tokens replace competing page palettes and inconsistent radius/blur rules.
- [ ] Home and **every** relevant route use the same design language.
- [ ] Dark and light are intentionally designed, not auto-inverted.
- [ ] No copied personal identity, photograph, biography or hardcoded oalfawzan.sa dependency in the target deliverable.
- [ ] Navigation, forms, links, charts and interactions still work.
- [ ] Responsive, keyboard, touch, contrast and reduced-motion checks performed.
- [ ] All modifications and checks summarized truthfully.

**Important:** This skill is for **design adaptation**, not for cloning Omar Alfawzan's site content, impersonating its owner, or extracting images unrelated to the requested design.
