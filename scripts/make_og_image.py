#!/usr/bin/env python3
"""Build the 1200x630 social share card (og-image.jpg) from the site's own assets.

Run: python scripts/make_og_image.py   (requires Pillow)
"""
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parents[1]
W, H = 1200, 630
FONT_DIR = Path("C:/Windows/Fonts")


def font(name: str, size: int) -> ImageFont.FreeTypeFont:
    for candidate in (FONT_DIR / name, Path("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf")):
        if candidate.exists():
            return ImageFont.truetype(str(candidate), size)
    return ImageFont.load_default(size)


def main() -> None:
    bg = Image.open(ROOT / "image-1600.webp").convert("RGB")
    scale = max(W / bg.width, H / bg.height)
    bg = bg.resize((round(bg.width * scale), round(bg.height * scale)), Image.LANCZOS)
    left, top = (bg.width - W) // 2, (bg.height - H) // 2
    bg = bg.crop((left, top, left + W, top + H)).filter(ImageFilter.GaussianBlur(2))

    shade = Image.new("RGB", (W, H), (4, 8, 20))
    card = Image.blend(bg, shade, 0.78)
    glow = Image.new("L", (W, H), 0)
    ImageDraw.Draw(glow).ellipse((-200, -260, 700, 520), fill=120)
    glow = glow.filter(ImageFilter.GaussianBlur(120))
    card = Image.composite(Image.new("RGB", (W, H), (0, 90, 200)), card, glow)

    portrait = Image.open(ROOT / "omaralfawzan.png").convert("RGB")
    size = 300
    portrait = portrait.resize((size, size), Image.LANCZOS)
    mask = Image.new("L", (size * 4, size * 4), 0)
    ImageDraw.Draw(mask).ellipse((0, 0, size * 4 - 1, size * 4 - 1), fill=255)
    mask = mask.resize((size, size), Image.LANCZOS)
    px, py = 96, (H - size) // 2
    ring = Image.new("L", (size + 12, size + 12), 0)
    ImageDraw.Draw(ring).ellipse((0, 0, size + 11, size + 11), fill=255)
    card.paste((255, 255, 255), (px - 6, py - 6), ring.point(lambda v: v * 0.35))
    card.paste(portrait, (px, py), mask)

    d = ImageDraw.Draw(card)
    x = px + size + 72
    d.text((x, 168), "Omar Alfawzan", font=font("segoeuib.ttf", 76), fill=(255, 255, 255))
    d.text((x, 268), "Cloud Technical Lead", font=font("segoeuib.ttf", 40), fill=(64, 156, 255))
    d.text((x, 326), "Pre-Sales  ·  Architecture  ·  Delivery", font=font("segoeui.ttf", 30), fill=(205, 215, 230))
    d.text((x, 410), "oalfawzan.sa", font=font("segoeui.ttf", 28), fill=(150, 165, 190))

    out = ROOT / "og-image.jpg"
    card.save(out, "JPEG", quality=86, optimize=True, progressive=True)
    print(f"wrote {out.name} ({out.stat().st_size // 1024} KB)")


if __name__ == "__main__":
    main()
