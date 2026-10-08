# OAlfawzan Liquid Glass Skill

A reusable, agent-readable design skill, distilled from [oalfawzan.sa](https://oalfawzan.sa).

**Main site = the sole source of truth.** The [main portfolio code](https://github.com/omarfoz/oalfawzan.sa) defines colors, material, typography, visual hierarchy and dark/light behavior. The [tools site](https://tools.oalfawzan.sa) and [AI site](https://ai.oalfawzan.sa) are examples, **not competing design authorities**.

This package follows the Agent Skills `SKILL.md` convention, so AI coding agents can use it to build or reskin sites without cloning the owner's personal content.

## Install

From a project root with Node.js installed:

~~~bash
npx skills add https://github.com/omarfoz/oalfawzan.sa/tree/main/.agents/skills/oalfawzan-liquid-glass
~~~

Run the installation in your project terminal (or an agent with shell access), **not as prose inside a regular chat**. The command does not install anything merely because it appears in a Gemini/ChatGPT message. The skill is discoverable in `.agents/skills/` in supported agents, including OpenCode. Check your agent's installation instructions if necessary.

For manual install, copy the `oalfawzan-liquid-glass` directory to `.agents/skills/oalfawzan-liquid-glass/` in your project. OpenCode also supports `.opencode/skills/oalfawzan-liquid-glass/`.

## Ask your agent

> Apply the oalfawzan-liquid-glass skill to the entire website. Treat the main oalfawzan.sa repository as the only design authority. Preserve all routes, features, copy and SEO. Make dark/light, navigation, typography, forms, cards and charts consistent; check mobile, touch, accessibility and reduced motion.

## Prevent the common wrong result

Do **not** ask an assistant to "make the portfolio a stunning liquid-glass dark theme" and assume it knows this design. That usually produces an unrelated neon/gradient site.

The coding agent must load the actual skill, read the main site's code and **preserve the target site's original content and functionality**. It must not invent purple/cyan heading gradients, animated blobs, cursor glows or new text. It should not force a light-first target into dark mode without explicit direction.

**Recommended prompt after installing in a code-capable environment:**

> First confirm you can read the installed `oalfawzan-liquid-glass/SKILL.md` file and the main repo's `site.css`. Show me the concrete design tokens you found. Then apply the MAIN oalfawzan.sa visual system only to this project's styling. Preserve all original text, branding, CTAs, routes, structure, interactions and any existing theme preference. Do not introduce neon gradients, animated blobs, pointer glows or unrelated new design ideas. Update all pages consistently and validate before/after screenshots in light and dark; if you cannot access the skill or source, stop and explain what is missing.

In a **chat-only tool without local project access**, paste the actual contents of `SKILL.md` (not just the installation command), the relevant source files and the target site's code. A screenshot alone may let the model approximate a style, but cannot guarantee source-code fidelity.

See `references/fidelity-tests.md` for the failed-vs-expected visual example.

## Contents

- `SKILL.md`: agent instructions, source-of-truth hierarchy, workflow and checklist.
- `references/design-authority.md`: exact canonical tokens, source links and final light-mode cascade.
- `references/implementation.md`: integration and component guidance.
- `assets/oalfawzan.css`: portable reference implementation using namespaced `og-` classes.
- `assets/theme.js`: dependency-free light/dark toggle implementation.
- `assets/demo.htm`: local standalone visual starter.

## Preview

Open `assets/demo.htm` through a local HTTP server (e.g., `python3 -m http.server`) and navigate to the file. It references only files bundled in the same directory.

The portable version uses a neutral background by default. For the photo-backed effect, provide your **own** local image:

~~~css
:root { --og-background-image: url("./my-background.webp"); }
~~~

## License and credit

MIT for this skill and bundled portable implementation. Copyright (c) 2026 Omar Alfawzan.

The original website remains the definitive design reference and may include personal content and images **not** licensed by this skill. Reusing the style does not grant rights to the owner's identity, content, photographs, logos or trademarks.
