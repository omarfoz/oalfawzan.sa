# Deterministic workflow for small coding models

A 12B-class agent will often reproduce CSS yet miss the HTML that activates it. **Do not reconstruct markup from memory.** Use the scaffold generator and component fragments.

## Choose the mode

- **New static website:** Do NOT manually write the initial index.html. Collect name, headline, description, contact email and optional about/projects from the user's request. Ask if essential facts are missing. Then execute python scripts/scaffold.py --output <empty-folder> --name ... --headline ... --description ... --email ... from this skill's directory. Add --item 'Title|Description|https://...' for each real project. The project is complete only after source validation and actual browser review.
- **Existing website:** Do NOT replace the app. Inspect all routes and functionality, copy local CSS/JS or port tokens into the existing framework, and adapt actual components to .og-* classes. Preserve text, links and state. Compare before/after.

## Non-negotiable source priority

1. Original oalfawzan.sa/site.css and main site (the *only* visual authority).
2. This skill's local CSS, theme.js and templates as a portable implementation.
3. Tools and AI sibling sites are *examples only*, never authorities.

## Execute in short steps

1. Verify the skill has been opened. Print "Skill loaded: <path>".
2. Identify the operation: new or existing website. Extract real content and known routes; do not fabricate identity, projects or emails.
3. New: run scaffold script. Existing: map semantic components, don't rewrite from scratch.
4. Run python scripts/validate.py --site <target> for scaffolded static sites. Fix reported failures, repeat until PASS. For existing sites, adapt validators to the framework.
5. If a browser is available, run browser smoke or equivalent, check light/dark and widths 390/768/1440. If not, report this missing test; do not claim pixel parity.
6. Return **files changed**, **validation output**, and **unverified issues**. Do not say complete when the checker reports FAIL.

## Anti-failure checklist

- Navbar **must be before** hero; never put hero above navigation.
- All CSS and JS references must resolve, including exact filenames.
- Use .og-hero for hero; .og-grid and .og-card for a set of cards; .og-btn for actions and nav links.
- A button must have implemented behavior. Otherwise use a meaningful anchor or omit it.
- Use real owner-provided background photography for closer visual parity. Without one, declare an unavoidable visual difference. Never hotlink the source owner's private/photo asset.
- Do not invent neon gradients, hover glow, moving gradient blobs or a purple accent.
- Do not break existing interactions, routes, copy, SEO or theme preference.
- Do not claim to have inspected live visuals if you only looked at code.
