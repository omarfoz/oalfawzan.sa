---
name: oalfawzan-liquid-glass
description: Recreate or apply the exact design language of oalfawzan.sa, the sole visual authority. Use for new websites, existing-site redesigns, consistent light/dark glass cards, navigation, or UI components.
license: MIT
compatibility: OpenCode, Codex, and Agent Skills compatible coding agents.
metadata:
  author: Omar Alfawzan
  source: https://github.com/omarfoz/oalfawzan.sa
  version: '2.0'
---

# OAlfawzan Liquid Glass v2

**This is a design reproduction skill, NOT a generic glassmorphism idea.** The only source of truth is the main [oalfawzan.sa](https://oalfawzan.sa) implementation: `site.css`, `theme.js`, `theme-init.js` and page HTML. The sibling tools and AI sites are examples, not authorities. If the main site conflicts with bundled CSS, the main site wins.

## Before any work

1. Open and read this actual `SKILL.md`. A command pasted in chat is not an installation.
2. Inspect the **main** site's code, or use the portable assets and clearly disclose offline fidelity limits.
3. Determine whether the user wants **NEW** or **EXISTING**. Never invent a real person's name, role, projects, contact or site copy.

## NEW website: mandatory path

1. Collect actual name, headline, description, email and language; optional about, projects and owned backdrop. Use --lang ar for Arabic RTL sites. Ask for missing essential inputs.
2. **RUN `scripts/scaffold.py`** (details in `references/small-model.md`). It creates the complete website with the correct `nav → hero → content → footer` structure and copies CSS/theme JS. Do NOT improvise initial HTML when the scaffold tool is available.
3. Customize copy/sections carefully and add only functionality the user requested.
4. **RUN `scripts/validate.py --site <output>`**. Fix and rerun until PASS. If browser tooling is available, also run `scripts/browser_smoke.py` and visually inspect screenshots.

## EXISTING website: mandatory path

1. Inspect **all routes**, original content, CSS, interaction handlers, and saved theme behavior.
2. Apply bundled tokens/components or translate them into the existing framework. Preserve layout content, copy, links, SEO and functionality. Do not replace the app with a generic portfolio.
3. Verify each page, mode and key interaction. Explicitly explain any missing tests. See `references/implementation.md` and `references/acceptance.md`.

## Design invariants (main site)

- Dark: `#010204`, accent `#007aff`; effective light: `#e7eff8`, accent `#0062cc` (the **later cascade** in main `site.css` wins).
- Thin tinted glass border, translucent fill, inner highlight, restrained shadow, ~20px blur; light mode is milky, not dark mode inverted.
- Nav 28px radius, cards 24px, controls 18px; system sans font; approx. 900px content width.
- Navigation **before** hero; consistent blue actions; predictable light/dark and mobile/touch appearance.
- Owner-supplied backdrop needed for closer photo-backed fidelity; **never hotlink/relicense personal source images**.

## Forbidden mistakes

- No cyan/purple gradients, animated blobs, pointer glow, decorative motion or added libraries just because the name says Liquid Glass.
- No inert `Learn More` buttons, missing CSS/JS files, broken anchors, or theme controls that don't work.
- Do not count copying `oalfawzan.css` as completion if HTML never uses `.og-hero`, `.og-nav`, `.og-card`, `.og-btn`.
- Never claim screenshot parity without a real browser comparison.

**If you cannot access the skill or run the project's tooling, say so.** Read `references/small-model.md` for the short agent workflow and `references/acceptance.md` for release gates. Use `components/*.htm` as copy-safe fragments, not as standalone pages.
