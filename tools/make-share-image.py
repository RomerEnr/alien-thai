#!/usr/bin/env python3
"""Compone la imagen para compartir el enlace (Open Graph): 1200×630 a 2x.

Parte del hero, oscurece la izquierda y pone el logo, el titular y los datos
con las fuentes de la web. Las fuentes salen de la compilación, así que antes
hay que ejecutar `npm run build`.

Uso: python3 tools/make-share-image.py
Salida: src/assets/images/social/share.webp (Astro la sirve en JPG a 1200×630)
"""
import io
import re
from pathlib import Path

from fontTools.ttLib import TTFont
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
HERO = ROOT / "src/assets/images/hero/hero-landscape.png"
OUTPUT = ROOT / "src/assets/images/social/share.webp"
FONTS = ROOT / "dist/_astro/fonts"

SCALE = 2
WIDTH, HEIGHT = 1200 * SCALE, 630 * SCALE
PAD = 64 * SCALE

TATAMI = (15, 16, 10)
WALL = (239, 235, 223)
WALL_DIM = (175, 171, 157)
GREEN = (171, 214, 77)
ORANGE = (243, 130, 29)

# The alien mark, as drawn in src/components/brand/AlienMark.astro (viewBox 100×113.8).
MARK_HEAD = "M50 110.7C18.3 92.4 3.1 66.1 3.1 47.3 3.1 13.8 32.1 3.1 50 3.1s46.9 10.7 46.9 44.2c0 18.8-15.2 45.1-46.9 63.4Z"
MARK_EYES = (
    "M12.1 44.6c30.1 0 33.7 22.8 33.7 30.6-23.5 0-33.7-16-33.7-30.6Z",
    "M87.9 44.6c-30.1 0-33.7 22.8-33.7 30.6 23.5 0 33.7-16 33.7-30.6Z",
)


def font_by_family(family: str, weight: int, size: int) -> ImageFont.FreeTypeFont:
    """Finds the built woff2 of `family` and sets its weight axis."""
    for path in FONTS.glob("*.woff2"):
        if " " in path.stem:  # stray copies such as "abc 2.woff2"
            continue
        font = TTFont(path)
        if font["name"].getDebugName(1).startswith(family):
            font.flavor = None
            buffer = io.BytesIO()
            font.save(buffer)
            buffer.seek(0)
            result = ImageFont.truetype(buffer, size)
            result.set_variation_by_axes([weight])
            return result
    raise SystemExit(f"No encuentro {family} en {FONTS}: ejecuta antes npm run build")


def path_points(d: str, steps: int = 24) -> list[tuple[float, float]]:
    """Flattens an SVG path made of M, C, c, s and Z into a polygon."""
    tokens = re.findall(r"[MCcsZ]|-?\d*\.?\d+", d)
    points, i = [], 0
    current = control = (0.0, 0.0)
    command = ""

    def cubic(p0, p1, p2, p3):
        for n in range(1, steps + 1):
            t = n / steps
            u = 1 - t
            points.append(tuple(u**3 * a + 3 * u * u * t * b + 3 * u * t * t * c + t**3 * e for a, b, c, e in zip(p0, p1, p2, p3)))

    while i < len(tokens):
        if tokens[i] in "MCcsZ":
            command = tokens[i]
            i += 1
            if command == "Z":
                continue
        nums = lambda k: [float(v) for v in tokens[i : i + k]]
        if command == "M":
            current = tuple(nums(2))
            points.append(current)
            i += 2
        elif command in "Cc":
            x1, y1, x2, y2, x, y = nums(6)
            if command == "c":
                cx, cy = current
                x1, y1, x2, y2, x, y = x1 + cx, y1 + cy, x2 + cx, y2 + cy, x + cx, y + cy
            cubic(current, (x1, y1), (x2, y2), (x, y))
            control, current = (x2, y2), (x, y)
            i += 6
        elif command == "s":
            x2, y2, x, y = nums(4)
            cx, cy = current
            x1, y1 = 2 * cx - control[0], 2 * cy - control[1]
            cubic(current, (x1, y1), (x2 + cx, y2 + cy), (x + cx, y + cy))
            control, current = (x2 + cx, y2 + cy), (x + cx, y + cy)
            i += 4
    return points


def draw_mark(draw: ImageDraw.ImageDraw, left: float, top: float, height: float) -> float:
    """Draws the alien mark and returns its width."""
    k = height / 113.8
    place = lambda pts: [(left + x * k, top + y * k) for x, y in pts]
    draw.polygon(place(path_points(MARK_HEAD)), fill=TATAMI, outline=GREEN, width=round(6.5 * k))
    for eye in MARK_EYES:
        draw.polygon(place(path_points(eye)), fill=GREEN)
    return 100 * k


def background() -> Image.Image:
    """The hero, cropped to cover the card, with the left side darkened for the text."""
    hero = Image.open(HERO).convert("RGB")
    scale = max(WIDTH / hero.width, HEIGHT / hero.height)
    hero = hero.resize((round(hero.width * scale), round(hero.height * scale)), Image.LANCZOS)
    top = round((hero.height - HEIGHT) * 0.35)
    left = hero.width - WIDTH
    image = hero.crop((left, top, left + WIDTH, top + HEIGHT))

    shade = Image.new("L", (WIDTH, 1))
    for x in range(WIDTH):
        t = x / WIDTH
        shade.putpixel((x, 0), round(255 * max(0.0, min(1.0, 0.92 - 1.5 * max(0.0, t - 0.18)))))
    wash = Image.new("RGB", (WIDTH, HEIGHT), TATAMI)
    return Image.composite(wash, image, shade.resize((WIDTH, HEIGHT)))


def main() -> None:
    image = background()
    draw = ImageDraw.Draw(image)
    display = lambda size: font_by_family("Big Shoulders", 900, size)

    # Wordmark: ALIEN [mark] THAI
    wordmark = display(44 * SCALE)
    x, y = PAD, PAD
    draw.text((x, y), "ALIEN", font=wordmark, fill=WALL)
    x += draw.textlength("ALIEN", font=wordmark) + 10 * SCALE
    x += draw_mark(draw, x, y + 6 * SCALE, 36 * SCALE) + 10 * SCALE
    draw.text((x, y), "THAI", font=wordmark, fill=WALL)

    # Headline, with the hero's orange full stop.
    heading = display(150 * SCALE)
    line_height = 128 * SCALE
    y = 196 * SCALE
    draw.text((PAD, y), "UN MUNDO", font=heading, fill=WALL)
    draw.text((PAD, y + line_height), "APARTE", font=heading, fill=WALL)
    stop_x = PAD + draw.textlength("APARTE", font=heading)
    draw.text((stop_x, y + line_height), ".", font=heading, fill=ORANGE)

    lede = font_by_family("Hanken Grotesk", 600, 34 * SCALE)
    draw.text((PAD, 492 * SCALE), "Muay Thai en Tegueste, Tenerife", font=lede, fill=WALL)

    mono = font_by_family("JetBrains Mono", 500, 19 * SCALE)
    draw.text((PAD, HEIGHT - PAD - 18 * SCALE), "CAMINO VIEJO 56  ·  @ALIENTHAI_", font=mono, fill=GREEN)

    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    image.save(OUTPUT, quality=90, method=6)
    print(f"✓ {OUTPUT.relative_to(ROOT)} ({OUTPUT.stat().st_size // 1024} KB)")


if __name__ == "__main__":
    main()
