# OAlfawzan Liquid Glass Skill

A reusable, agent-readable design skill, distilled from [oalfawzan.sa](https://oalfawzan.sa).

**Main site = the sole source of truth.** The [main portfolio code](https://github.com/omarfoz/oalfawzan.sa) defines colors, material, typography, visual hierarchy and dark/light behavior. The [tools site](https://tools.oalfawzan.sa) and [AI site](https://ai.oalfawzan.sa) are examples, **not competing design authorities**.

This package follows the Agent Skills `SKILL.md` convention, so AI coding agents can use it to build or reskin sites without cloning the owner's personal content.

## Install

From a project root with Node.js installed:

~~~bash
npx skills add https://github.com/omarfoz/oalfawzan.sa/tree/main/.agents/skills/oalfawzan-liquid-glass
~~~

The command above is for **after this contribution is merged into main**. During PR review, use the skill folder from this branch or install from a local checkout. The skill is discoverable in `.agents/skills/` in supported agents, including OpenCode. Check your agent's installation instructions if necessary.

For manual install, copy the `oalfawzan-liquid-glass` directory to `.agents/skills/oalfawzan-liquid-glass/` in your project. OpenCode also supports `.opencode/skills/oalfawzan-liquid-glass/`.

## Ask your agent

> Apply the oalfawzan-liquid-glass skill to the entire website. Treat the main oalfawzan.sa repository as the only design authority. Preserve all routes, features, copy and SEO. Make dark/light, navigation, typography, forms, cards and charts consistent; check mobile, touch, accessibility and reduced motion.

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
