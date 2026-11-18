"""Kontaktbogen aus einem fertigen Video (Standbilder prüfen, bevor jemand anderes es sieht).

    python kontaktbogen.py video.mp4 [--every 2] [--cols 6]
"""
import argparse
import subprocess
import tempfile
from pathlib import Path

from PIL import Image, ImageDraw

ap = argparse.ArgumentParser()
ap.add_argument("video")
ap.add_argument("--every", type=float, default=2.0)
ap.add_argument("--cols", type=int, default=6)
a = ap.parse_args()

out = Path(a.video).with_name(Path(a.video).stem + "_bogen.jpg")
with tempfile.TemporaryDirectory() as tmp:
    subprocess.run(["ffmpeg", "-v", "error", "-i", a.video, "-vf", f"fps=1/{a.every},scale=360:-2",
                    str(Path(tmp) / "f_%04d.jpg")], check=True)
    frames = sorted(Path(tmp).glob("f_*.jpg"))
    with Image.open(frames[0]) as first:
        w, h = first.size
    rows = (len(frames) + a.cols - 1) // a.cols
    sheet = Image.new("RGB", (a.cols * w, rows * (h + 24)), (30, 30, 30))
    d = ImageDraw.Draw(sheet)
    for i, fp in enumerate(frames):
        x, y = (i % a.cols) * w, (i // a.cols) * (h + 24)
        with Image.open(fp) as fr:
            sheet.paste(fr, (x, y + 24))
        d.text((x + 6, y + 5), f"{i * a.every:.1f}s", fill=(255, 255, 255))
    sheet.save(out, quality=88)
print(f"-> {out}")
