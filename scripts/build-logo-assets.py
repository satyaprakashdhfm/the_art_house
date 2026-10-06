"""Builds every logo and icon variant from the master Verona Arts emblem.

Usage: python scripts/build-logo-assets.py <path-to-master-jpeg>

The master is the circular emblem on a cream background. It is saved as
public/images/brand/emblem-source.png (with the duplicated "to You" line
painted out), and every other asset is cut from it:

  public/images/brand/emblem.png        full emblem, transparent background
  public/images/brand/emblem-light.png  full emblem with cream lettering, for dark backgrounds
  public/images/brand/lockup.png        leaf sprig + VERONA / ARTS, for the header
  public/images/brand/lockup-light.png  same lockup with cream text, for dark backgrounds
  public/images/brand/mark.png          leaf sprig alone
  src/app/icon.png                      512px tab / PWA icon
  src/app/apple-icon.png                180px home-screen icon
  src/app/favicon.ico                   16/32/48px favicon
  src/app/opengraph-image.png           1200x630 link-preview card
"""

import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parent.parent
BRAND = ROOT / "public" / "images" / "brand"
APP = ROOT / "src" / "app"

BG = np.array([254, 251, 244], dtype=float)  # the emblem's cream paper
INK = (31, 61, 43)  # --color-ink
CARD = (249, 242, 230)  # --color-card
GOLD = (194, 124, 56, 255)  # --color-gold


def load_master(path: Path) -> Image.Image:
    im = Image.open(path).convert("RGB")
    # The source art repeats "to You" on a second tagline line; paint it out.
    ImageDraw.Draw(im).rectangle((690, 732, 870, 786), fill=tuple(int(c) for c in BG))
    return im


def knock_out(im: Image.Image, lo: float = 6, hi: float = 70) -> Image.Image:
    """Cream background -> transparent, with soft edges and the cream fringe removed."""
    rgb = np.asarray(im.convert("RGB")).astype(float)
    dist = np.abs(rgb - BG).sum(axis=2)
    a = np.clip((dist - lo) / (hi - lo), 0, 1)
    safe = np.maximum(a, 1e-3)[..., None]
    fg = np.clip((rgb - BG * (1 - a[..., None])) / safe, 0, 255)
    out = np.dstack([fg, a * 255]).astype(np.uint8)
    return Image.fromarray(out)


def trim(im: Image.Image, pad: int = 0) -> Image.Image:
    l, t, r, b = im.getchannel("A").point(lambda v: 255 if v > 8 else 0).getbbox()
    return im.crop((max(l - pad, 0), max(t - pad, 0), min(r + pad, im.width), min(b + pad, im.height)))


def recolor_dark(im: Image.Image, color: tuple[int, int, int]) -> Image.Image:
    """Swap the forest-green letterforms for `color`, leaving gold untouched."""
    arr = np.asarray(im).copy()
    rgb = arr[..., :3].astype(int)
    dark = rgb.sum(axis=2) < 260
    arr[dark, :3] = color
    return Image.fromarray(arr)


def fit_square(im: Image.Image, size: int, fill=None, inset: float = 0.0) -> Image.Image:
    canvas = Image.new("RGBA", (size, size), fill or (0, 0, 0, 0))
    box = int(size * (1 - 2 * inset))
    k = box / max(im.size)
    scaled = im.resize((max(round(im.width * k), 1), max(round(im.height * k), 1)), Image.LANCZOS)
    canvas.alpha_composite(scaled, ((size - scaled.width) // 2, (size - scaled.height) // 2))
    return canvas


def main() -> None:
    master = load_master(Path(sys.argv[1]))
    BRAND.mkdir(parents=True, exist_ok=True)
    master.save(BRAND / "emblem-source.png", optimize=True)

    cut = knock_out(master)
    emblem = trim(cut, pad=4)
    emblem.save(BRAND / "emblem.png", optimize=True)

    # Same emblem with the lettering in cream, for the dark green footer and admin sidebar.
    # Only the text block is recoloured; leaf tips in its bottom-left corner keep their greens.
    text_box = (412, 380, 1170, 730)
    words_light = recolor_dark(cut.crop(text_box), CARD)
    words_light.paste(cut.crop((412, 540, 440, 730)), (0, 540 - 380))
    light_cut = cut.copy()
    light_cut.paste(words_light, text_box[:2])
    l, t, r, b = cut.getchannel("A").point(lambda v: 255 if v > 8 else 0).getbbox()
    light_cut.crop((l - 4, t - 4, r + 4, b + 4)).save(BRAND / "emblem-light.png", optimize=True)

    # Leaf sprig sits left of the ring's text area; the ring crosses it, so cut a
    # slice that stops before the wordmark starts.
    sprig_area = cut.crop((105, 175, 535, 925))
    # Clear the parts of the "V" and the left gold rule that fall inside the slice.
    ImageDraw.Draw(sprig_area).rectangle((405 - 105, 385 - 175, 430, 535 - 175), fill=(0, 0, 0, 0))
    ImageDraw.Draw(sprig_area).rectangle((440 - 105, 535 - 175, 430, 640 - 175), fill=(0, 0, 0, 0))
    # ...and the "A" of the tagline.
    ImageDraw.Draw(sprig_area).rectangle((495 - 105, 665 - 175, 430, 718 - 175), fill=(0, 0, 0, 0))
    sprig = trim(sprig_area, pad=2)
    sprig.save(BRAND / "mark.png", optimize=True)

    # The "V" of VERONA, used as the monogram for tab and home-screen icons.
    v = trim(cut.crop((408, 386, 556, 532)), pad=0)

    # Wordmark: VERONA, the gold rules and ARTS (no tagline, it is unreadable at header size).
    words_area = cut.crop((412, 380, 1170, 640))
    # Below the V only the gold rule belongs; drop leaf tips poking in at the left.
    ImageDraw.Draw(words_area).rectangle((0, 540 - 380, 455 - 412, 260), fill=(0, 0, 0, 0))
    words = trim(words_area, pad=2)

    # Horizontal lockup: sprig scaled to the wordmark's height plus a little, then the words.
    h = int(words.height * 1.55)
    s = sprig.resize((int(sprig.width * h / sprig.height), h), Image.LANCZOS)
    gap = int(words.height * 0.12)
    lockup = Image.new("RGBA", (s.width + gap + words.width, h), (0, 0, 0, 0))
    lockup.alpha_composite(s, (0, 0))
    lockup.alpha_composite(words, (s.width + gap, (h - words.height) // 2))
    lockup.save(BRAND / "lockup.png", optimize=True)

    light = Image.new("RGBA", lockup.size, (0, 0, 0, 0))
    light.alpha_composite(s, (0, 0))
    light.alpha_composite(recolor_dark(words, CARD), (s.width + gap, (h - words.height) // 2))
    light.save(BRAND / "lockup-light.png", optimize=True)

    # Tab icons: the emblem's text is unreadable at 16-32px, so the icons use the
    # "V" inside a gold ring, echoing the emblem's circle.
    def monogram(size: int, ring: float, background) -> Image.Image:
        big = size * 4
        im = Image.new("RGBA", (big, big), background)
        w = max(int(big * ring), 1)
        ImageDraw.Draw(im).ellipse((w // 2, w // 2, big - w // 2 - 1, big - w // 2 - 1),
                                   fill=(255, 255, 255, 255), outline=GOLD, width=w)
        im.alpha_composite(fit_square(v, big, inset=0.25))
        return im.resize((size, size), Image.LANCZOS)

    monogram(512, 0.035, (0, 0, 0, 0)).save(APP / "icon.png", optimize=True)
    monogram(180, 0.035, (255, 255, 255, 255)).convert("RGB").save(APP / "apple-icon.png", optimize=True)
    fav = [monogram(s, 0.07 if s <= 16 else 0.05, (0, 0, 0, 0)) for s in (16, 32, 48)]
    fav[-1].save(APP / "favicon.ico", sizes=[(16, 16), (32, 32), (48, 48)], append_images=fav[:-1])

    og = Image.new("RGBA", (1200, 630), (255, 255, 255, 255))
    og.alpha_composite(fit_square(emblem, 630, inset=0.05), (285, 0))
    og.convert("RGB").save(APP / "opengraph-image.png", optimize=True)

    for p in [*BRAND.iterdir(), APP / "icon.png", APP / "apple-icon.png", APP / "favicon.ico", APP / "opengraph-image.png"]:
        print(p.relative_to(ROOT), Image.open(p).size)


if __name__ == "__main__":
    main()
