#!/usr/bin/env python3
"""Generate a real, runnable static website from the skill's canonical portable assets."""
from __future__ import annotations

import argparse
from html import escape
from pathlib import Path
import re
import shutil
import sys

SKILL = Path(__file__).resolve().parents[1]


def e(value: str) -> str:
    return escape(value.strip(), quote=True)


def parse_item(raw: str) -> tuple[str, str, str]:
    pieces = [part.strip() for part in raw.split("|", 2)]
    if len(pieces) != 3 or not all(pieces):
        raise ValueError("Each --item must be 'Title|Description|URL'")
    label, description, url = pieces
    if not (url.startswith("https://") or url.startswith("http://") or url.startswith("#")):
        raise ValueError("Item links must begin with https://, http:// or #")
    return label, description, url


def build_site(args: argparse.Namespace) -> Path:
    output = Path(args.output).expanduser().resolve()
    if output.exists() and any(output.iterdir()):
        raise ValueError("Output folder is not empty; choose a new folder to preserve existing files")
    if not re.fullmatch(r"[^\s@]+@[^\s@]+\.[^\s@]+", args.email):
        raise ValueError("A valid --email is required; do not invent contact addresses")
    for field in ("name", "headline", "description"):
        if not getattr(args, field).strip():
            raise ValueError(f"--{field} cannot be empty")

    background_file = None
    if args.background:
        background_file = Path(args.background).expanduser().resolve()
        if not background_file.is_file() or background_file.suffix.lower() not in {".jpg", ".jpeg", ".png", ".webp", ".avif"}:
            raise ValueError("--background must be an existing local image (jpg/png/webp/avif)")
    items = [parse_item(item) for item in args.item]
    for _title, _desc, url in items:
        if url.startswith("#") and url not in {"#main", "#about", "#work", "#contact"}:
            raise ValueError("Item anchors must reference a real section")
        if url == "#about" and not (args.about and args.about.strip()):
            raise ValueError("#about link requires --about content")
    about = args.about.strip() if args.about else ""
    nav = []
    if about:
        nav.append('<a class="og-btn" href="#about">About</a>')
    if items:
        nav.append('<a class="og-btn" href="#work">Work</a>')
    nav.append('<a class="og-btn" href="#contact">Contact</a>')
    about_section = ""
    if about:
        about_section = (
            '      <section class="og-section" id="about" aria-labelledby="about-heading">\n'
            '        <h2 class="og-section-title" id="about-heading">About</h2>\n'
            f'        <div class="og-card"><p class="og-body">{e(about)}</p></div>\n'
            '      </section>'
        )
    work_section = ""
    if items:
        cards = "\n".join(
            '          <article class="og-card">\n'
            f'            <h3>{e(title)}</h3>\n'
            f'            <p class="og-muted og-body">{e(description)}</p>\n'
            f'            <a class="og-btn" href="{e(url)}"'
            f'{" rel=\"noopener noreferrer\"" if url.startswith(("https://", "http://")) else ""}'
            f'>View {e(title)}</a>\n'
            '          </article>'
            for title, description, url in items
        )
        work_section = (
            '      <section class="og-section" id="work" aria-labelledby="work-heading">\n'
            '        <h2 class="og-section-title" id="work-heading">Selected work</h2>\n'
            f'        <div class="og-grid">\n{cards}\n        </div>\n'
            '      </section>'
        )
    mapping = {
        "META_DESCRIPTION": e(args.description[:155]),
        "SITE_TITLE": e(f"{args.name} | {args.headline}"),
        "BRAND": e(args.name),
        "NAV_LINKS": "".join(nav),
        "EYEBROW": e(args.eyebrow or args.kind.title()),
        "HEADLINE": e(args.headline),
        "DESCRIPTION": e(args.description),
        "ABOUT_SECTION": about_section,
        "WORK_SECTION": work_section,
        "EMAIL_ATTR": e(args.email),
        "EMAIL_TEXT": e(args.email),
    }
    template = (SKILL / "templates/site.htm").read_text(encoding="utf-8")
    for key, val in mapping.items():
        template = template.replace("{{" + key + "}}", val)
    if re.search(r"\{\{[A-Z_]+\}\}", template):
        raise ValueError("Unresolved template field")
    output.mkdir(parents=True, exist_ok=True)
    assets = output / "assets"
    assets.mkdir(exist_ok=True)
    for name in ("oalfawzan.css", "theme.js"):
        shutil.copy2(SKILL / "assets" / name, assets / name)
    if background_file:
        filename = "backdrop" + background_file.suffix.lower()
        shutil.copy2(background_file, assets / filename)
        with (assets / "oalfawzan.css").open("a", encoding="utf-8") as css:
            css.write(f'\n:root {{ --og-background-image: url("./{filename}"); }}\n')
    (output / "index.html").write_text(template, encoding="utf-8")
    (output / "README.md").write_text(
        "# " + args.name + "\n\nGenerated by OAlfawzan Liquid Glass.\n\n"
        "Preview: python -m http.server 8000 then open http://localhost:8000.\n"
        "Run the skill's scripts/validate.py with --site . to check source structure.\n"
        "Replace/extend content deliberately. Do not copy the author's personal image or identity.\n",
        encoding="utf-8",
    )
    return output


def main() -> int:
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument("--output", required=True, help="New/empty output directory")
    p.add_argument("--kind", choices=("portfolio", "landing"), default="portfolio")
    p.add_argument("--name", required=True)
    p.add_argument("--headline", required=True)
    p.add_argument("--description", required=True)
    p.add_argument("--email", required=True)
    p.add_argument("--eyebrow", default="")
    p.add_argument("--about", default="")
    p.add_argument("--item", action="append", default=[], help="Title|Description|URL; repeatable")
    p.add_argument("--background", help="An image supplied by the site owner, not the reference site's photograph")
    args = p.parse_args()
    try:
        print(f"Created: {build_site(args)}")
    except (ValueError, OSError) as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
