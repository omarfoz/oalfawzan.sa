#!/usr/bin/env python3
"""Static validation for a new site scaffolded by OAlfawzan Liquid Glass.

This checks source structure, local resource existence, and component usage.
It does not substitute for browser rendering or a pixel-fidelity comparison.
"""
from __future__ import annotations

import argparse
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit
import re
import sys


class Inspect(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.tags = []
        self.ids = set()
        self.refs = []
        self.h1 = 0
        self.buttons = []
        self.nav_index = None
        self.hero_index = None
        self.has_theme_toggle = False
        self.has_main = False
        self.has_description = False
        self.has_theme_bootstrap = False
        self.scripts = []
        self.styles = []
        self.has_skip = False

    def handle_starttag(self, tag, attrs):
        d = dict(attrs)
        cls = set((d.get("class") or "").split())
        idx = len(self.tags)
        self.tags.append((tag, d))
        if d.get("id"):
            self.ids.add(d["id"])
        if tag == "h1":
            self.h1 += 1
        if tag == "main":
            self.has_main = True
        if tag == "nav" and "og-nav" in cls:
            self.nav_index = idx
            if not d.get("aria-label"):
                self.refs.append(("a11y", "Navigation missing aria-label"))
        if "og-hero" in cls:
            self.hero_index = idx
        if tag == "meta" and d.get("name") == "description" and d.get("content"):
            self.has_description = True
        if tag == "script" and d.get("src"):
            self.scripts.append(d["src"])
        if tag == "link" and d.get("rel") == "stylesheet":
            self.styles.append(d.get("href", ""))
        if tag in ("a", "script", "link", "img"):
            link = d.get("href") if tag in ("a", "link") else d.get("src")
            if link:
                self.refs.append((tag, link))
        if tag == "button":
            self.buttons.append(d)
            if "data-og-theme-toggle" in d:
                self.has_theme_toggle = bool(d.get("aria-label")) and d.get("type") == "button"
        if tag == "a" and "og-skip" in cls:
            self.has_skip = True


def validate(site: Path) -> list[str]:
    failures = []
    page = site / "index.html"
    if not page.is_file():
        return ["Missing index.html"]
    raw = page.read_text(encoding="utf-8")
    inspect = Inspect()
    try:
        inspect.feed(raw)
    except Exception as ex:
        failures.append(f"HTML parsing: {ex}")
    if re.search(r"\{\{[A-Z_]+\}\}", raw):
        failures.append("Template variables were not replaced")
    if not inspect.has_description:
        failures.append("Missing SEO meta description")
    if inspect.h1 != 1:
        failures.append(f"Exactly one H1 required, got {inspect.h1}")
    if not inspect.has_main:
        failures.append("Missing semantic main")
    if inspect.nav_index is None:
        failures.append("Missing .og-nav navigation")
    if inspect.hero_index is None:
        failures.append("Missing .og-hero section")
    if inspect.nav_index is not None and inspect.hero_index is not None and inspect.nav_index > inspect.hero_index:
        failures.append("Navigation must appear BEFORE the hero")
    if not inspect.has_theme_toggle:
        failures.append("Theme toggle must have type=button, aria-label and data-og-theme-toggle")
    if not inspect.has_skip or "main" not in inspect.ids:
        failures.append("Missing usable skip-to-main link")
    if not re.search(r"<script\b[^>]*>\s*\(\(\)\s*=>[\s\S]*?oalfawzan-theme", raw):
        failures.append("Theme init bootstrap is missing from document head")
    if "og-btn--primary" not in raw or "og-card" not in raw and "og-section" not in raw:
        failures.append("Expected reusable shared components missing")
    if not any(x.endswith("/oalfawzan.css") for x in inspect.styles):
        failures.append("No local OAlfawzan stylesheet linked")
    if not any(x.endswith("/theme.js") for x in inspect.scripts):
        failures.append("No local theme.js linked")
    for button in inspect.buttons:
        if "data-og-theme-toggle" not in button:
            failures.append("Inert button detected: buttons require documented wired behavior; use real links for navigation")
    for kind, ref in inspect.refs:
        if kind == "a11y":
            failures.append(ref)
            continue
        if ref.startswith("#"):
            if ref[1:] not in inspect.ids:
                failures.append(f"Missing anchor target {ref}")
            continue
        parsed = urlsplit(ref)
        if parsed.scheme in {"http", "https", "mailto", "tel", "data"} or parsed.netloc:
            continue
        if parsed.scheme or ref.startswith("javascript:"):
            failures.append(f"Unsafe/unsupported URL {ref}")
            continue
        if not (site / unquote(parsed.path).lstrip("/")).is_file():
            failures.append(f"Broken local reference: {ref}")
    css = site / "assets/oalfawzan.css"
    if css.is_file():
        source = css.read_text(encoding="utf-8")
        for token in ("--site-accent: #007aff", "--site-bg: #e7eff8", ".og-hero", ".og-nav", "--site-glass-blur"):
            if token not in source:
                failures.append(f"Canonical CSS token/component absent: {token}")
        if "oalfawzan.sa/image-1600.webp" in source:
            failures.append("Must not hotlink the author's background photo")
    return failures


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--site", type=Path, required=True)
    args = parser.parse_args()
    errors = validate(args.site.expanduser().resolve())
    if errors:
        print(f"FAIL: {len(errors)} check(s)")
        for e in errors:
            print("- " + e)
        return 1
    print("PASS: HTML structure, design usage, file links, controls and theme bootstrap")
    return 0


if __name__ == "__main__":
    sys.exit(main())
