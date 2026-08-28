#!/usr/bin/env python3
from __future__ import annotations

import re
import sys
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlparse
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
HTML_FILES = sorted(ROOT.rglob("*.html"))
REQUIRED_FILES = [ROOT / "index.html", ROOT / "robots.txt", ROOT / "sitemap.xml", ROOT / "CNAME"]
BRAND_NAME = "Omar Alfawzan"

# These legacy source glyphs are intentionally converted to inline/path SVGs by theme.js.
# Any new emoji-like glyph outside this allow-list should fail CI so it cannot silently
# reintroduce platform-dependent emoji rendering.
HANDLED_GLYPHS_BY_FILE = {
    "blog/index.html": {"🔒", "☁️", "☁", "⚡", "🏆", "🚢", "🐳", "🌐", "↗"},
    "social/index.html": {"✕", "‹", "›", "↗"},
}
UI_GLYPHS = {"↗", "✕", "‹", "›"}


def is_emoji_like(char: str) -> bool:
    code = ord(char)
    return (
        0x1F300 <= code <= 0x1FAFF
        or 0x2600 <= code <= 0x26FF
        or 0x2700 <= code <= 0x27BF
    )


class SiteHTMLParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.has_title = False
        self.has_description = False
        self.links: list[str] = []
        self.nav_names: list[str] = []
        self._in_nav_name = False
        self._nav_name_parts: list[str] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        attr_map = {key: value for key, value in attrs}
        classes = (attr_map.get("class") or "").split()

        if tag == "title":
            self.has_title = True
        elif tag == "meta" and attr_map.get("name") == "description" and attr_map.get("content"):
            self.has_description = True
        elif tag in {"a", "link"} and attr_map.get("href"):
            self.links.append(attr_map["href"] or "")
        elif tag in {"img", "script"} and attr_map.get("src"):
            self.links.append(attr_map["src"] or "")

        if "nav-name" in classes:
            self._in_nav_name = True
            self._nav_name_parts = []

    def handle_data(self, data: str) -> None:
        if self._in_nav_name:
            self._nav_name_parts.append(data)

    def handle_endtag(self, tag: str) -> None:
        if self._in_nav_name and tag in {"div", "span", "a"}:
            value = " ".join("".join(self._nav_name_parts).split())
            self.nav_names.append(value)
            self._in_nav_name = False
            self._nav_name_parts = []


def local_target_exists(source: Path, raw_url: str) -> bool:
    if not raw_url or raw_url.startswith(("#", "mailto:", "tel:", "javascript:")):
        return True

    parsed = urlparse(raw_url)
    if parsed.scheme or parsed.netloc:
        return True

    path = parsed.path
    if not path:
        return True

    if path.startswith("/"):
        candidate = ROOT / path.lstrip("/")
    else:
        candidate = source.parent / path

    candidate = candidate.resolve()
    if candidate.is_dir():
        candidate = candidate / "index.html"

    if candidate.exists():
        return True

    if candidate.suffix == "":
        index_candidate = candidate / "index.html"
        return index_candidate.exists()

    return False


def validate_glyphs(path: Path, raw_html: str) -> list[str]:
    errors: list[str] = []
    relative = path.relative_to(ROOT).as_posix()
    allowed = HANDLED_GLYPHS_BY_FILE.get(relative, set())

    scrubbed = raw_html
    # Remove longer tokens first so the variation-selector form is handled correctly.
    for glyph in sorted(allowed, key=len, reverse=True):
        scrubbed = scrubbed.replace(glyph, "")

    remaining = sorted({char for char in scrubbed if is_emoji_like(char) or char in UI_GLYPHS})
    if remaining:
        errors.append(
            f"{relative}: unhandled emoji/UI glyphs found: {' '.join(remaining)}; convert them to SVG or add an explicit runtime mapping"
        )

    return errors


def validate_html() -> list[str]:
    errors: list[str] = []
    for path in HTML_FILES:
        parser = SiteHTMLParser()
        try:
            raw_html = path.read_text(encoding="utf-8")
            parser.feed(raw_html)
        except Exception as exc:
            errors.append(f"{path.relative_to(ROOT)}: HTML parse failure: {exc}")
            continue

        relative = path.relative_to(ROOT)
        if not parser.has_title:
            errors.append(f"{relative}: missing <title>")
        if not parser.has_description:
            errors.append(f"{relative}: missing meta description")

        if not parser.nav_names:
            errors.append(f"{relative}: missing .nav-name brand label")
        else:
            for nav_name in parser.nav_names:
                if nav_name != BRAND_NAME:
                    errors.append(
                        f"{relative}: inconsistent .nav-name '{nav_name}' (expected '{BRAND_NAME}')"
                    )

        for link in parser.links:
            if not local_target_exists(path, link):
                errors.append(f"{relative}: broken local reference: {link}")

        errors.extend(validate_glyphs(path, raw_html))

    return errors


def validate_project_data() -> list[str]:
    errors: list[str] = []
    data_file = ROOT / "data.js"
    if not data_file.exists():
        return ["data.js: missing project data file"]

    text = data_file.read_text(encoding="utf-8")
    project_block_match = re.search(r"projects:\s*\[(.*?)\]\s*\n};", text, re.DOTALL)
    if not project_block_match:
        return ["data.js: unable to locate projects array"]

    project_block = project_block_match.group(1)
    emoji_values = re.findall(r'emoji:\s*"([^"]*)"', project_block)
    non_empty = [value for value in emoji_values if value.strip()]
    if non_empty:
        errors.append(
            "data.js: project emoji fields must stay empty because project artwork is rendered with SVG masks"
        )

    return errors


def validate_sitemap() -> list[str]:
    errors: list[str] = []
    sitemap = ROOT / "sitemap.xml"
    try:
        root = ET.parse(sitemap).getroot()
    except Exception as exc:
        return [f"sitemap.xml: XML parse failure: {exc}"]

    namespace = {"sm": "http://www.sitemaps.org/schemas/sitemap/0.9"}
    locations = [node.text for node in root.findall("sm:url/sm:loc", namespace) if node.text]
    if not locations:
        errors.append("sitemap.xml: no <loc> entries found")

    for location in locations:
        parsed = urlparse(location)
        if parsed.netloc != "oalfawzan.sa":
            errors.append(f"sitemap.xml: unexpected host: {location}")

    return errors


def main() -> int:
    errors: list[str] = []

    for required in REQUIRED_FILES:
        if not required.exists():
            errors.append(f"missing required file: {required.relative_to(ROOT)}")

    errors.extend(validate_html())
    errors.extend(validate_project_data())
    errors.extend(validate_sitemap())

    if errors:
        print("Site validation failed:\n")
        for error in errors:
            print(f"- {error}")
        return 1

    print(
        f"Site validation passed: {len(HTML_FILES)} HTML files checked; branding and UI glyph policy verified."
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())
