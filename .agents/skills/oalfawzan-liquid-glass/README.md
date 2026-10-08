# OAlfawzan Liquid Glass — Agent Skill v2

A reusable, small-model-friendly design implementation skill based **only on the main [oalfawzan.sa](https://oalfawzan.sa)**. The [tools](https://tools.oalfawzan.sa) and [AI](https://ai.oalfawzan.sa) sites are examples, not design authorities.

The v1 experiment showed that an agent could copy CSS but still put navigation *below* the hero, ignore components and add unwired project buttons. v2 supplies a deterministic scaffold and a real validation loop.

## Install in OpenCode

From your project root (the installation command must execute in a terminal):

```sh
npx skills add omarfoz/oalfawzan.sa --skill oalfawzan-liquid-glass -a opencode
```

Open a new OpenCode session and explicitly tell it to read the installed `oalfawzan-liquid-glass/SKILL.md`. A command pasted as chat text is not installation.

## Create a fresh static website

The skill's generator requires factual site content; do not invent a fake email or projects:

```sh
python scripts/scaffold.py --output ./new-site \
  --name 'Example Studio' \
  --headline 'Thoughtful digital experiences.' \
  --description 'Independent design and development for real people.' \
  --email 'contact@example.org' \
  --about 'We work with thoughtful clients.' \
  --item 'Example project|A practical web tool|https://example.org'
python scripts/validate.py --site ./new-site
cd ./new-site && python -m http.server 8000
```

The commands above assume your shell is in the **installed skill folder**. When inside a different project folder, use the actual path to the installed skill's scripts. In OpenCode, the agent should resolve that path first, then run the commands. Omit `--about`/`--item` if you don't have real content. Optional `--background ./your-owned-photo.webp` copies a user-supplied photo into the project.

The output is a ready-to-run site containing `index.html`, `assets/oalfawzan.css` and `assets/theme.js`. The builder does not overwrite a populated folder.

## Quick OpenCode prompt

> Load `oalfawzan-liquid-glass/SKILL.md`. Build a NEW site using the skill's `scripts/scaffold.py`, not manual HTML. My real site details are: [name, headline, description, email, projects]. Main oalfawzan.sa is the single design authority. Run `scripts/validate.py`; if available run `scripts/browser_smoke.py` in both themes and at mobile/tablet/desktop sizes. Fix validation failures and rerun, preserving the original visual identity. Report skipped tests honestly.

## Validate in a loop

```sh
python scripts/validate.py --site ./new-site
python scripts/browser_smoke.py --site ./new-site --screenshots ./screenshots
```

`validate.py` uses Python standard library. `browser_smoke.py` optionally uses Playwright (`pip install playwright`, plus a working Chromium installation; specify `--chromium /path/to/chromium` when needed). Browser screenshots are diagnostic and are **not** proof of pixel parity with the source site.

## Files

- `SKILL.md` short deterministic workflow, readable by smaller models.
- `templates/site.htm` entire canonical-structure HTML template with substitution tokens.
- `components/` reusable navigation, hero and card snippets.
- `assets/` local portable CSS and JS, no personal photograph or identity.
- `scripts/scaffold.py` safe new-project creation, no overwrites, no fake content.
- `scripts/validate.py` structural/component/path/theme checks.
- `scripts/browser_smoke.py` optional actual browser smoke and screenshots.
- `references/small-model.md` step-by-step execution guide.
- `references/design-authority.md` canonical source tokens and cascading light mode details.
- `references/implementation.md` existing-site integration.
- `references/acceptance.md` and `references/fidelity-tests.md` failure conditions.
- `tests/test_workflow.py` regression tests for scaffold and validator.

## License

MIT for the skill's code and portable assets. The license does **not** grant rights to the source owner's personal images, identity, trademark or published content. Photo-backed fidelity requires a project-owned photo; without it, the portable baseline is an approximation.
