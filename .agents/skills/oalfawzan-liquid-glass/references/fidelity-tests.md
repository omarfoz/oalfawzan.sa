# Design fidelity and regression scenarios

These are **manual agent acceptance scenarios**, not automated browser tests. Use them before declaring a website transformed.

## Scenario: light-mode personal portfolio redesigned incorrectly

**Before:** A personal portfolio with a light background, top navigation, greeting, name, professional title, description, two CTA buttons and social links. It has a brand name and its own original written content.

**Bad output:** An agent says it will "overhaul" the site into a spectacular **dark-only** liquid-glass experience and changes the name colors to a blue/cyan/purple gradient, adds animated abstract blobs and cursor glow, rewrites the professional bio, removes or demotes an existing CTA, and rearranges the social area. This is a **FAIL**, even if the screenshot looks attractive.

**Expected:** The portfolio retains the exact original name, professional title, description, CTA words, number/order of CTA buttons, navigation, links and working functionality. Its *visual styling* follows the main `oalfawzan.sa` implementation: quiet translucent surfaces and interior highlight, canonical blue accent, restrained shapes/typography, responsive navigation, dark and light material treatments. Keep the user's explicit theme or saved preference; verify both modes.

## Required checks

1. **Skill loaded**: Is this `SKILL.md` in the agent's accessible workspace, and was it opened? Saying "I will use the skill" is not sufficient.
2. **Canonical source checked**: Did the agent actually read `oalfawzan.sa/site.css` and theme logic (or disclose an offline baseline)? Can it accurately name the final effective light theme values?
3. **Style vs content boundary**: Do all headings, paragraphs, brand text, link destinations and CTA wording still match before?
4. **No invented aesthetics**: Did it avoid cyan/purple neon gradients, large animated blobs, cursor glow, unrelated effects and extra package dependencies?
5. **Theme preservation**: Is the previous explicitly selected theme still honored, and can the user switch to a fully designed second theme?
6. **Visual validation**: Are screenshots at mobile and desktop in corresponding themes reasonably close to the canonical style, without claiming untested pixel parity?
7. **Background honesty**: Is the source site's photographic background treatment present with a licensed/project-owned photo if requested, or is the omission identified as a visual-fidelity limitation?
8. **Functional checks**: Do navigation, links, forms, charts, all routes, errors and keyboard interactions still work?

## Simple decision rule

If the result looks like a generic animated SaaS/glassmorphism template rather than a restrained continuation of **main oalfawzan.sa**, reject it. Fix the tokens, material, background treatment and hierarchy; do **not** keep restyling unrelated parts until it "looks impressive".

If a chat model has no file/network/shell access, it **cannot** install the skill just by reading an `npx` command. Either use a coding environment or paste relevant source/skill files, and label any resulting mockup as an approximation until visual validation.
