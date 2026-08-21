#!/usr/bin/env python3
from __future__ import annotations

import sys
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlparse
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
HTML_FILES = sorted(ROOT.rglob("*.html"))
REQUIRED_FILES = [ROOT / "index.html", ROOT / "robots.txt", ROOT / "sitemap.xml", ROOT / "CNAME"]


class SiteHTMLParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.has_title = False
        self.has_description = False
        self.links: list[str] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        attr_map = {key: value for key, value in attrs}
        if tag == "title":
            self.has_title = True
        elif tag == "meta" and attr_map.get("name") == "description" and attr_map.get("content"):
            self.has_description = True
        elif tag in {"a", "link"} and attr_map.get("href"):
            self.links.append(attr_map["href"] or "")
        elif tag in {"img", "script"} and attr_map.get("src"):
            self.links.append(attr_map["src"] or "")


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


def validate_html() -> list[str]:
    errors: list[str] = []
    for path in HTML_FILES:
        parser = SiteHTMLParser()
        try:
            parser.feed(path.read_text(encoding="utf-8"))
        except Exception as exc:
            errors.append(f"{path.relative_to(ROOT)}: HTML parse failure: {exc}")
            continue

        if not parser.has_title:
            errors.append(f"{path.relative_to(ROOT)}: missing <title>")
        if not parser.has_description:
            errors.append(f"{path.relative_to(ROOT)}: missing meta description")

        for link in parser.links:
            if not local_target_exists(path, link):
                errors.append(f"{path.relative_to(ROOT)}: broken local reference: {link}")

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
    errors.extend(validate_sitemap())

    if errors:
        print("Site validation failed:\n")
        for error in errors:
            print(f"- {error}")
        return 1

    print(f"Site validation passed: {len(HTML_FILES)} HTML files checked.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
