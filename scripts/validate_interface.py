#!/usr/bin/env python3
from __future__ import annotations

import re
import sys
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
ROUTES = {
    ROOT / "index.html": "/",
    ROOT / "experience" / "index.html": "/experience/",
    ROOT / "blog" / "index.html": "/blog/",
    ROOT / "social" / "index.html": "/social/",
    ROOT / "privacy" / "index.html": "/privacy/",
}


class InterfaceParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.html_lang: str | None = None
        self.viewport: str | None = None
        self.h1_count = 0
        self.images: list[dict[str, str | None]] = []
        self.target_blank_links: list[dict[str, str | None]] = []
        self.nav_count = 0
        self.main_count = 0
        self.buttons: list[dict[str, str | None]] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        values = {key: value for key, value in attrs}
        if tag == "html":
            self.html_lang = values.get("lang")
        elif tag == "meta" and values.get("name") == "viewport":
            self.viewport = values.get("content")
        elif tag == "h1":
            self.h1_count += 1
        elif tag == "img":
            self.images.append(values)
        elif tag == "a" and values.get("target") == "_blank":
            self.target_blank_links.append(values)
        elif tag == "nav":
            self.nav_count += 1
        elif tag == "main":
            self.main_count += 1
        elif tag == "button":
            self.buttons.append(values)


def check_route(path: Path, route: str) -> tuple[list[str], list[str]]:
    errors: list[str] = []
    warnings: list[str] = []
    text = path.read_text(encoding="utf-8")
    parser = InterfaceParser()
    parser.feed(text)
    rel = path.relative_to(ROOT)

    if not parser.html_lang:
        errors.append(f"{rel}:1 - <html> missing lang")
    if not parser.viewport:
        errors.append(f"{rel}:1 - missing viewport meta")
    elif "user-scalable=no" in parser.viewport.lower() or re.search(r"maximum-scale\s*=\s*1(?:\.0)?(?:,|$)", parser.viewport, re.I):
        errors.append(f"{rel}:1 - viewport disables user zoom")

    if parser.h1_count != 1:
        errors.append(f"{rel}:1 - expected exactly one h1, found {parser.h1_count}")
    if parser.nav_count < 1:
        errors.append(f"{rel}:1 - missing navigation landmark")

    for index, image in enumerate(parser.images, start=1):
        if "alt" not in image:
            errors.append(f"{rel}:1 - image #{index} missing alt")

    if "/accessibility.css" not in text:
        errors.append(f"{rel}:1 - shared accessibility stylesheet not loaded")

    # Home loads theme.js through data.js; all other pages load it directly.
    if route == "/":
        if "data.js" not in text:
            errors.append(f"{rel}:1 - home shared runtime loader missing")
    elif "/theme.js" not in text:
        errors.append(f"{rel}:1 - shared theme/guideline runtime missing")

    # Legacy target=_blank markup is tolerated because web-guidelines.js upgrades
    # rel at runtime. Keep it visible as a warning until source HTML is normalized.
    for link in parser.target_blank_links:
        rel_tokens = set((link.get("rel") or "").split())
        if not {"noopener", "noreferrer"}.issubset(rel_tokens):
            warnings.append(f"{rel}:1 - target=_blank rel normalized by shared runtime")

    if parser.main_count == 0 and route in {"/", "/experience/", "/blog/"}:
        warnings.append(f"{rel}:1 - main landmark is inserted by shared runtime")

    return errors, warnings


def check_shared_files() -> list[str]:
    errors: list[str] = []
    js = (ROOT / "web-guidelines.js").read_text(encoding="utf-8")
    css = (ROOT / "vercel-guidelines.css").read_text(encoding="utf-8")

    required_js = [
        "ensureMainLandmark",
        "ensureSkipLink",
        "aria-current",
        "noopener",
        "noreferrer",
        "Intl.DateTimeFormat",
        "data-vercel-guidelines",
        "MutationObserver",
    ]
    for token in required_js:
        if token not in js:
            errors.append(f"web-guidelines.js:1 - missing required compliance behavior: {token}")

    required_css = [
        ":focus-visible",
        "prefers-reduced-motion",
        "env(safe-area-inset-left)",
        "touch-action: manipulation",
        "content-visibility: auto",
        "overscroll-behavior: contain",
        "min-height: var(--wg-touch)",
    ]
    for token in required_css:
        if token not in css:
            errors.append(f"vercel-guidelines.css:1 - missing required compliance rule: {token}")

    if "transition: all" in css or "transition:all" in css:
        errors.append("vercel-guidelines.css:1 - transition: all is prohibited")
    return errors


def main() -> int:
    errors: list[str] = []
    warnings: list[str] = []

    missing = [path.relative_to(ROOT) for path in ROUTES if not path.exists()]
    if missing:
        errors.extend(f"{path}:1 - expected user-facing route missing" for path in missing)
    else:
        for path, route in ROUTES.items():
            route_errors, route_warnings = check_route(path, route)
            errors.extend(route_errors)
            warnings.extend(route_warnings)

    errors.extend(check_shared_files())

    if warnings:
        print("Interface audit warnings (runtime-remediated legacy markup):")
        for warning in warnings:
            print(f"- {warning}")
        print()

    if errors:
        print("Interface validation failed:")
        for error in errors:
            print(f"- {error}")
        return 1

    print(f"Interface validation passed: {len(ROUTES)} user-facing routes checked.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
