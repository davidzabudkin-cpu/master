#!/usr/bin/env python3
"""Kontaktbogen: python tools/sheet.py <ausgabe.jpg> <bild1> <bild2> … (Zeitstempel aus Dateinamen als Beschriftung)"""
import sys, re
from PIL import Image, ImageDraw
out, files = sys.argv[1], sys.argv[2:]
ims = [Image.open(f).convert('RGB') for f in files]
tw = 360 if ims[0].height > ims[0].width else 480
th = round(ims[0].height * tw / ims[0].width); cols = min(6, len(ims)); rows = -(-len(ims) // cols)
sheet = Image.new('RGB', (cols * (tw + 8) + 8, rows * (th + 30) + 8), (40, 40, 40)); d = ImageDraw.Draw(sheet)
for i, (f, im) in enumerate(zip(files, ims)):
    x, y = 8 + (i % cols) * (tw + 8), 8 + (i // cols) * (th + 30)
    sheet.paste(im.resize((tw, th), Image.LANCZOS), (x, y + 22)); m = re.search(r't(\d+\.\d+)', f); d.text((x, y + 4), (m.group(1) + ' s') if m else f, fill=(255, 255, 255))
sheet.save(out, quality=88); print(out)
