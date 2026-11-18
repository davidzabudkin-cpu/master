"""Thumbnail-Text per Code (KI-Bild OHNE Schrift erzeugen, Text sauber darüberlegen).

    python thumb_text.py bild.png "WARUM SO TEUER?" out.png --hot TEUER --pos top
    python thumb_text.py bild.png "0 €|40 BILLIONEN" out.png --split      # Split: je Hälfte ein Wort/eine Zahl

Erzeugt out.png (1280x720, < 2 MB) und out_feed.jpg (Feed-Größe 380x214 für den 1-Sekunden-Test).
Regeln: max. 3–4 Wörter, eine Zeile, nie über Gesicht/Hauptmotiv, Zahl nicht doppelt mit dem Titel.
"""
import argparse
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

FONT = Path(__file__).resolve().parent.parent / "motion-kit" / "fonts" / "Fredoka-Bold.ttf"

ap = argparse.ArgumentParser()
ap.add_argument("img")
ap.add_argument("text")
ap.add_argument("out")
ap.add_argument("--hot", default="", help="Wörter in Akzentfarbe, Komma-getrennt (sonst: letztes Wort)")
ap.add_argument("--pos", default="top", choices=["top", "bottom"])
ap.add_argument("--split", action="store_true", help="Text mit | teilen: links | rechts")
ap.add_argument("--color", default="#FFFFFF")
ap.add_argument("--hotcolor", default="#FFD23F")
ap.add_argument("--stroke", default="#000000")
ap.add_argument("--font", default=str(FONT))
ap.add_argument("--dy", type=int, default=0, help="Bildausschnitt nach unten schieben (mehr Platz oben)")
a = ap.parse_args()

W, H = 1280, 720
im = Image.open(a.img).convert("RGB")
sc = max(W / im.width, H / im.height)
im = im.resize((int(im.width * sc) + 1, int(im.height * sc) + 1), Image.LANCZOS)
x0 = (im.width - W) // 2
y0 = max(0, (im.height - H) // 2 - a.dy)
im = im.crop((x0, y0, x0 + W, y0 + H))
d = ImageDraw.Draw(im)
hot = {h.strip().upper() for h in a.hot.split(",") if h.strip()}


def fit_size(text, max_w, size=150):
    while size > 40 and ImageFont.truetype(a.font, size).getlength(text) > max_w:
        size -= 6
    return size


def draw_line(text, cx, cy, max_w, size=None):
    size = size or fit_size(text, max_w)
    f = ImageFont.truetype(a.font, size)
    x = cx - f.getlength(text) / 2
    parts = text.split(" ")
    for i, w in enumerate(parts):
        is_hot = w.strip("?!.,").upper() in hot if hot else (len(parts) > 1 and i == len(parts) - 1)
        d.text((x, cy), w, font=f, fill=a.hotcolor if is_hot else a.color, anchor="lm",
               stroke_width=max(6, size // 12), stroke_fill=a.stroke)
        x += f.getlength(w + " ")


y = 110 if a.pos == "top" else H - 110
if a.split:
    left, right = (s.strip() for s in a.text.split("|"))
    size = min(fit_size(left, W * 0.44), fit_size(right, W * 0.44))   # beide Hälften gleich groß
    draw_line(left, W * 0.25, y, W * 0.44, size)
    draw_line(right, W * 0.75, y, W * 0.44, size)
else:
    draw_line(a.text, W / 2, y, W - 120)

out = Path(a.out)
im.save(out, optimize=True)
im.resize((380, 214), Image.LANCZOS).save(out.with_name(out.stem + "_feed.jpg"), quality=90)
print(f"-> {out} ({out.stat().st_size // 1024} KB) + Feed-Vorschau")
