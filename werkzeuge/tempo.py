"""Schnellere Fassung (z. B. 1,25x) sicher erzeugen: Bild und Ton getrennt, danach Längen prüfen.

    python tempo.py video.mp4 1.25 [--lufs -16]

Grund: atempo + loudnorm im selben Filter erzeugte bei uns Ton mit falscher Länge (Ton lief aus dem Takt).
"""
import argparse
import json
import subprocess
from pathlib import Path

ap = argparse.ArgumentParser()
ap.add_argument("video")
ap.add_argument("factor", type=float)
ap.add_argument("--lufs", type=float, default=-16)
a = ap.parse_args()

src = Path(a.video)
f = a.factor
out = src.with_name(f"{src.stem}-{f:g}x.mp4")
tv, ta = src.with_suffix(".tv.mp4"), src.with_suffix(".ta.wav")


def run(cmd):
    subprocess.run(cmd, check=True)


run(["ffmpeg", "-y", "-v", "error", "-i", str(src), "-an", "-vf", f"setpts=PTS/{f},fps=30",
     "-c:v", "libx264", "-crf", "18", "-pix_fmt", "yuv420p", str(tv)])
run(["ffmpeg", "-y", "-v", "error", "-i", str(src), "-vn", "-af", f"atempo={f}", "-ar", "48000", str(ta)])
run(["ffmpeg", "-y", "-v", "error", "-i", str(tv), "-i", str(ta), "-map", "0:v", "-map", "1:a", "-c:v", "copy",
     "-af", f"loudnorm=I={a.lufs}:TP=-1.5:LRA=11", "-ar", "48000", "-c:a", "aac", "-b:a", "192k",
     "-movflags", "+faststart", str(out)])
tv.unlink()
ta.unlink()


def dur(kind):
    r = subprocess.run(["ffprobe", "-v", "error", "-select_streams", kind, "-show_entries", "stream=duration",
                        "-of", "json", str(out)], capture_output=True, text=True).stdout
    return float(json.loads(r)["streams"][0]["duration"])


dv, da = dur("v:0"), dur("a:0")
print(f"-> {out}  Bild {dv:.2f}s / Ton {da:.2f}s  {'OK' if abs(dv - da) < 0.1 else 'ACHTUNG: Laengen weichen ab!'}")
