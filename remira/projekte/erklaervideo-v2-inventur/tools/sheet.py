#!/usr/bin/env python3
"""Kontaktbogen mit Zeitstempeln. python tools/sheet.py <frames-ordner> <von> <fps> <spalten> <ziel.jpg> [breite je Bild]"""
import sys, pathlib
from PIL import Image, ImageDraw, ImageFont
d, t0, fps, cols, out = pathlib.Path(sys.argv[1]), float(sys.argv[2]), float(sys.argv[3]), int(sys.argv[4]), sys.argv[5]
tw = int(sys.argv[6]) if len(sys.argv) > 6 else 480
fs = sorted(d.glob('*.jpg')); im0 = Image.open(fs[0]); th = round(tw * im0.height / im0.width); rows = -(-len(fs) // cols)
sh = Image.new('RGB', (cols * (tw + 4), rows * (th + 4)), (48, 48, 48)); dr = ImageDraw.Draw(sh); f = ImageFont.truetype('arial.ttf', 18)
for i, p in enumerate(fs):
    x, y = (i % cols) * (tw + 4), (i // cols) * (th + 4); sh.paste(Image.open(p).resize((tw, th), Image.LANCZOS), (x, y))
    dr.rectangle([x, y, x + 62, y + 22], fill=(0, 0, 0)); dr.text((x + 4, y + 1), f'{t0 + i / fps:.2f}', fill=(255, 220, 0), font=f)
sh.save(out, quality=88); print(out, sh.size)
