"""python tools/sheet.py cache/s1 cache/sheet1.jpg [Spalten] → Kontaktbogen aller JPGs im Ordner"""
import sys, pathlib
from PIL import Image, ImageDraw
src, dst = pathlib.Path(sys.argv[1]), sys.argv[2]; cols = int(sys.argv[3]) if len(sys.argv) > 3 else 2
fs = sorted(src.glob('*.jpg')); w, h = 960, 540; rows = (len(fs) + cols - 1) // cols
sh = Image.new('RGB', (cols * w, rows * h), 'white')
for i, f in enumerate(fs):
    im = Image.open(f).resize((w, h)); ImageDraw.Draw(im).text((8, 6), f.stem, fill='yellow'); sh.paste(im, ((i % cols) * w, (i // cols) * h))
sh.save(dst, quality=85)
