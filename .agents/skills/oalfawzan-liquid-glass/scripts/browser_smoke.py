#!/usr/bin/env python3
"""Optional real-browser smoke and screenshots for a scaffolded site.

Requires: pip install playwright, and a working Chromium installation.
This does NOT claim pixel parity with the upstream live site.
"""
from __future__ import annotations

import argparse
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from threading import Thread
import os
import sys
from functools import partial


def exercise(site: Path, screenshots: Path, browser_exe: str | None = None) -> list[str]:
    from playwright.sync_api import sync_playwright
    errors = []
    server = ThreadingHTTPServer(("127.0.0.1", 0), partial(SimpleHTTPRequestHandler, directory=str(site)))
    thread = Thread(target=server.serve_forever, daemon=True)
    thread.start()
    screenshots.mkdir(parents=True, exist_ok=True)
    try:
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True, executable_path=browser_exe, args=["--no-sandbox"] if browser_exe else [])
            try:
                for width in (390, 768, 1440):
                    for theme in ("dark", "light"):
                        page = browser.new_page(viewport={"width": width, "height": 900}, device_scale_factor=1)
                        js_errors = []
                        page.on("pageerror", lambda err: js_errors.append(str(err)))
                        page.goto(f"http://127.0.0.1:{server.server_port}/index.html", wait_until="load")
                        page.evaluate("theme => localStorage.setItem('oalfawzan-theme',theme)", theme)
                        page.reload(wait_until="load")
                        actual = page.locator("html").get_attribute("data-theme")
                        if actual != theme:
                            errors.append(f"{width}/{theme}: loaded theme {actual}")
                        nav_y = page.locator(".og-nav").bounding_box()["y"]
                        hero_y = page.locator(".og-hero").bounding_box()["y"]
                        if nav_y >= hero_y:
                            errors.append(f"{width}/{theme}: nav is below hero")
                        metrics = page.evaluate("""() => ({scroll: document.documentElement.scrollWidth, inner: innerWidth,
                          accent: getComputedStyle(document.documentElement).getPropertyValue('--site-accent').trim(),
                          bg: getComputedStyle(document.documentElement).getPropertyValue('--site-bg').trim(),
                          cardBlur: getComputedStyle(document.querySelector('.og-nav')).backdropFilter})""")
                        if metrics["scroll"] > metrics["inner"] + 1:
                            errors.append(f"{width}/{theme}: horizontal overflow {metrics}")
                        if metrics["accent"] != ("#007aff" if theme == "dark" else "#0062cc"):
                            errors.append(f"{width}/{theme}: unexpected accent {metrics['accent']}")
                        if metrics["bg"] != ("#010204" if theme == "dark" else "#e7eff8"):
                            errors.append(f"{width}/{theme}: unexpected background {metrics['bg']}")
                        if metrics["cardBlur"] == "none":
                            errors.append(f"{width}/{theme}: nav blur missing")
                        if js_errors:
                            errors.append(f"{width}/{theme}: script errors {js_errors}")
                        if width == 390:
                            page.get_by_role("button", name=("Switch to light theme" if theme == "dark" else "Switch to dark theme")).click()
                            switched = page.locator("html").get_attribute("data-theme")
                            expected = "light" if theme == "dark" else "dark"
                            if switched != expected:
                                errors.append(f"{width}/{theme}: theme button failed: {switched}")
                            page.reload()
                            if page.locator("html").get_attribute("data-theme") != expected:
                                errors.append(f"{width}/{theme}: theme preference did not persist")
                            page.evaluate("theme => localStorage.setItem('oalfawzan-theme',theme)", theme)
                            page.reload()
                        page.screenshot(path=str(screenshots / f"{width}-{theme}.png"), full_page=True)
                        page.close()
            finally:
                browser.close()
    finally:
        server.shutdown()
        server.server_close()
        thread.join(timeout=2)
    return errors


def main() -> int:
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument("--site", type=Path, required=True)
    p.add_argument("--screenshots", type=Path, required=True)
    p.add_argument("--chromium", default=os.environ.get("CHROMIUM_EXECUTABLE"))
    a = p.parse_args()
    try:
        errors = exercise(a.site.resolve(), a.screenshots.resolve(), a.chromium)
    except ImportError:
        print("SKIP: playwright not installed. Install with pip install playwright and provide a browser.")
        return 2
    except Exception as e:
        print("ERROR: browser smoke could not run:", e)
        return 2
    if errors:
        print(f"FAIL: {len(errors)} browser check(s):\n" + "\n".join(errors))
        return 1
    print("PASS: 6 browser render checks (390/768/1440 × light/dark), navigation, theme persistence, no overflow or script errors")
    return 0


if __name__ == "__main__":
    sys.exit(main())
