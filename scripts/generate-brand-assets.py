#!/usr/bin/env python3
"""
Generates every brand image from one place: the app icons Expo bundles and the
Play Store graphics.

Keeping these generated rather than hand-drawn means the icon, the splash and
the store page cannot drift apart, and a colour change in the theme is one
edit here rather than six exports from a design tool.

    python3 scripts/generate-brand-assets.py

Requires Pillow and a CJK font (WQY Zen Hei ships on Debian/Ubuntu):
    pip install Pillow
    apt-get install fonts-wqy-zenhei
"""
from __future__ import annotations

import os
import sys

from PIL import Image, ImageDraw, ImageFilter, ImageFont

# --- Brand -----------------------------------------------------------------
# The same stops as `gradients.brand` in constants/theme.ts.
GRADIENT_TOP = (100, 91, 245)     # #645BF5
GRADIENT_BOTTOM = (74, 65, 201)   # #4A41C9
CORAL = (232, 99, 122)            # #E8637A, the warm end of `gradients.dusk`
WHITE = (255, 255, 255)

GLYPH = "한"
WORDMARK = "KoreanGo"
TAGLINE = "Speak Korean. Live Korea."

CJK_FONT_CANDIDATES = [
    "/usr/share/fonts/truetype/wqy/wqy-zenhei.ttc",
    "/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc",
    "/usr/share/fonts/truetype/nanum/NanumGothicBold.ttf",
    "/System/Library/Fonts/AppleSDGothicNeo.ttc",
    "C:/Windows/Fonts/malgunbd.ttf",
]
LATIN_FONT_CANDIDATES = [
    "/mnt/skills/examples/canvas-design/canvas-fonts/InstrumentSans-Bold.ttf",
    "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
]

OUT_APP = "assets"
OUT_STORE = "store"


def find_font(candidates: list[str]) -> str:
    for path in candidates:
        if os.path.exists(path):
            return path
    raise SystemExit(
        "No suitable font found. Install one of:\n  " + "\n  ".join(candidates)
    )


CJK_FONT = find_font(CJK_FONT_CANDIDATES)
LATIN_FONT = find_font(LATIN_FONT_CANDIDATES)


def cjk(size: int) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(CJK_FONT, size)


def latin(size: int) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(LATIN_FONT, size)


def vertical_gradient(size: tuple[int, int], top, bottom, diagonal=True) -> Image.Image:
    """A gradient, built at 1px per row then resized — far faster than
    per-pixel drawing and visually identical after the resample."""
    width, height = size
    steps = 256
    strip = Image.new("RGB", (1, steps))
    pixels = strip.load()
    for i in range(steps):
        t = i / (steps - 1)
        pixels[0, i] = (
            round(top[0] + (bottom[0] - top[0]) * t),
            round(top[1] + (bottom[1] - top[1]) * t),
            round(top[2] + (bottom[2] - top[2]) * t),
        )
    if not diagonal:
        return strip.resize(size, Image.BICUBIC)

    # Rotate a longer strip to get a 45-degree sweep, then centre-crop.
    span = int((width**2 + height**2) ** 0.5) + 2
    tall = strip.resize((span, span), Image.BICUBIC).rotate(45, expand=True, resample=Image.BICUBIC)
    left = (tall.width - width) // 2
    top_ = (tall.height - height) // 2
    return tall.crop((left, top_, left + width, top_ + height))


def draw_centred(draw: ImageDraw.ImageDraw, box, text, font, fill):
    """Centre by the ink bounds rather than the font metrics — CJK fonts carry
    a lot of vertical padding, and centring on metrics leaves the glyph
    visibly high in the frame."""
    x0, y0, x1, y1 = box
    bbox = draw.textbbox((0, 0), text, font=font)
    w = bbox[2] - bbox[0]
    h = bbox[3] - bbox[1]
    draw.text(
        (x0 + (x1 - x0 - w) / 2 - bbox[0], y0 + (y1 - y0 - h) / 2 - bbox[1]),
        text,
        font=font,
        fill=fill,
    )


def skyline(draw: ImageDraw.ImageDraw, x: int, y: int, width: int, height: int, alpha_fill):
    """The Seoul silhouette from components/decor/SeoulSkyline.tsx, at the same
    proportions so the store page and the app agree."""
    s = width / 360.0

    def rect(rx, ry, rw, rh):
        draw.rectangle([x + rx * s, y + (ry / 76) * height,
                        x + (rx + rw) * s, y + ((ry + rh) / 76) * height], fill=alpha_fill)

    def poly(points):
        draw.polygon([(x + px * s, y + (py / 76) * height) for px, py in points], fill=alpha_fill)

    # Namsan and N Seoul Tower.
    poly([(0, 76), (0, 58), (14, 48), (34, 45), (56, 49), (74, 58), (74, 76)])
    rect(40, 20, 4, 30)
    poly([(36, 26), (48, 26), (45, 17), (39, 17)])
    r = 3 * s
    cx, cy = x + 42 * s, y + (13 / 76) * height
    draw.ellipse([cx - r, cy - r, cx + r, cy + r], fill=alpha_fill)

    # Riverside apartment blocks.
    for bx, by, bw in [(86, 36, 17), (106, 28, 17), (126, 44, 17), (146, 32, 17), (166, 48, 14)]:
        rect(bx, by, bw, 76 - by)
    # Mid-rise offices.
    for bx, by, bw in [(188, 40, 22), (214, 52, 18), (236, 34, 20)]:
        rect(bx, by, bw, 76 - by)
    # Lotte World Tower.
    poly([(272, 76), (275, 22), (285, 22), (288, 76)])
    poly([(277, 22), (280, 12), (283, 22)])
    rect(296, 50, 16, 26)
    # Han River bridge.
    rect(316, 66, 44, 3)
    for bx in (322, 338, 354):
        rect(bx, 69, 3, 7)


def soft_glow(size: tuple[int, int], box, colour, alpha: int, blur: int) -> Image.Image:
    """A blurred ellipse. Drawn unblurred it reads as a hard disc — an obvious
    rendering mistake rather than light — so the blur is the whole point."""
    layer = Image.new("RGBA", size, (0, 0, 0, 0))
    ImageDraw.Draw(layer).ellipse(box, fill=colour + (alpha,))
    return layer.filter(ImageFilter.GaussianBlur(blur))


def rounded_mask(size: tuple[int, int], radius: int) -> Image.Image:
    mask = Image.new("L", size, 0)
    ImageDraw.Draw(mask).rounded_rectangle([0, 0, size[0] - 1, size[1] - 1], radius, fill=255)
    return mask


# --- Outputs ---------------------------------------------------------------

def app_icon(size: int) -> Image.Image:
    """Full-bleed square. Android and iOS apply their own rounding, so this
    must not round itself or the corners get clipped twice."""
    img = vertical_gradient((size, size), GRADIENT_TOP, GRADIENT_BOTTOM).convert("RGBA")
    # A coral warmth in the lower corner, echoing the dusk gradient. Pushed
    # mostly off-canvas so only the falloff shows.
    img = Image.alpha_composite(
        img,
        soft_glow(
            (size, size),
            [size * 0.52, size * 0.66, size * 1.5, size * 1.6],
            CORAL,
            110,
            max(4, int(size * 0.09)),
        ),
    ).convert("RGB")
    draw = ImageDraw.Draw(img)
    # 0.46 leaves the glyph clear of the corners that Android and iOS round
    # away, and clear of the circular mask some launchers apply.
    draw_centred(draw, (0, 0, size, size), GLYPH, cjk(int(size * 0.46)), WHITE)
    return img


def adaptive_foreground(size: int) -> Image.Image:
    """Android masks adaptive icons to arbitrary shapes and only the centre
    ~66% is guaranteed visible, so the glyph is kept well inside that."""
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    draw_centred(draw, (0, 0, size, size * 0.96), GLYPH, cjk(int(size * 0.38)), WHITE + (255,))
    return img


def adaptive_background(size: int) -> Image.Image:
    return vertical_gradient((size, size), GRADIENT_TOP, GRADIENT_BOTTOM).convert("RGBA")


def monochrome(size: int) -> Image.Image:
    """Themed icons: Android recolours this, so it must be a flat silhouette."""
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    draw_centred(draw, (0, 0, size, size * 0.96), GLYPH, cjk(int(size * 0.38)), WHITE + (255,))
    return img


def splash(size: int) -> Image.Image:
    """Sits on the splash background colour, so it is the mark alone."""
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    tile = size * 0.62
    x0 = (size - tile) / 2
    plate = Image.new("RGBA", (int(tile), int(tile)), WHITE + (255,))
    plate.putalpha(rounded_mask((int(tile), int(tile)), int(tile * 0.24)))
    img.paste(plate, (int(x0), int(x0)), plate)
    draw = ImageDraw.Draw(img)
    draw_centred(draw, (x0, x0, x0 + tile, x0 + tile * 0.97), GLYPH,
                 cjk(int(tile * 0.5)), GRADIENT_BOTTOM + (255,))
    return img


def feature_graphic() -> Image.Image:
    """1024x500, shown at the top of the store listing. Text is kept clear of
    the edges because Play crops it differently across surfaces."""
    w, h = 1024, 500
    img = vertical_gradient((w, h), GRADIENT_TOP, GRADIENT_BOTTOM)

    img = Image.alpha_composite(
        img.convert("RGBA"),
        soft_glow((w, h), [w * 0.60, -h * 0.45, w * 1.4, h * 1.25], CORAL, 120, 90),
    )

    layer = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    skyline(ImageDraw.Draw(layer), 0, int(h * 0.70), w, int(h * 0.30), WHITE + (38,))
    img = Image.alpha_composite(img, layer).convert("RGB")

    draw = ImageDraw.Draw(img)

    # Glyph tile on the right.
    tile = 190
    tx, ty = w - tile - 96, (h - tile) // 2
    plate = Image.new("RGBA", (tile, tile), WHITE + (255,))
    plate.putalpha(rounded_mask((tile, tile), 52))
    img.paste(plate, (tx, ty), plate)
    draw_centred(draw, (tx, ty, tx + tile, ty + tile * 0.97), GLYPH,
                 cjk(int(tile * 0.52)), GRADIENT_BOTTOM)

    # Wordmark and tagline on the left.
    draw.text((96, 186), WORDMARK, font=latin(86), fill=WHITE)
    draw.text((100, 292), TAGLINE, font=latin(34), fill=(233, 231, 255))
    return img


def store_icon() -> Image.Image:
    """Play requires exactly 512x512, 32-bit PNG."""
    return app_icon(512)


def main() -> int:
    os.makedirs(OUT_APP, exist_ok=True)
    os.makedirs(OUT_STORE, exist_ok=True)

    written = []

    def save(img: Image.Image, path: str, mode: str = "RGBA"):
        img.convert(mode).save(path, "PNG", optimize=True)
        written.append((path, img.size))

    save(app_icon(1024), f"{OUT_APP}/icon.png", "RGB")
    save(adaptive_foreground(512), f"{OUT_APP}/android-icon-foreground.png")
    save(adaptive_background(512), f"{OUT_APP}/android-icon-background.png")
    save(monochrome(432), f"{OUT_APP}/android-icon-monochrome.png")
    save(splash(1024), f"{OUT_APP}/splash-icon.png")
    save(app_icon(48), f"{OUT_APP}/favicon.png", "RGB")

    save(store_icon(), f"{OUT_STORE}/play-icon-512.png", "RGB")
    save(feature_graphic(), f"{OUT_STORE}/play-feature-graphic-1024x500.png", "RGB")

    for path, size in written:
        print(f"  {path:46} {size[0]}x{size[1]}")
    print(f"\n{len(written)} files written.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
