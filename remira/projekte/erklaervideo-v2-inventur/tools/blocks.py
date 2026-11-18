#!/usr/bin/env python3
"""Sprechblöcke + Tonhöhe einer Stimme anzeigen (Vorstufe für words.py). Aufruf: python tools/blocks.py assets/vo/x.mp3"""
import subprocess, sys, pathlib, numpy as np
from scipy.io import wavfile
from scipy.ndimage import uniform_filter1d
ROOT = pathlib.Path(__file__).resolve().parents[1]
src = pathlib.Path(sys.argv[1]); wav = ROOT / f'cache/audio/{src.stem}-48k.wav'
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', str(src), '-ac', '1', '-ar', '48000', str(wav)], check=True)
sr, x = wavfile.read(wav); x = x.astype(np.float64) / 32768
hop = int(sr * .01); n = len(x) // hop
db = 20 * np.log10(np.sqrt(np.maximum(uniform_filter1d((x[:n * hop] ** 2).reshape(n, hop).mean(1), 3), 0)) + 1e-9)
thr = float(sys.argv[2]) if len(sys.argv) > 2 else -38
sp = db > thr; segs = []; i = 0
while i < n:
    if sp[i]:
        j = i
        while j < n and (sp[j] or sp[j:j + 12].any()): j += 1
        segs.append((i * .01, j * .01)); i = j
    else: i += 1
segs = [s for s in segs if s[1] - s[0] > .12]
print(f'{src.name}: {len(x)/sr:.2f} s, peak {20*np.log10(np.abs(x).max()):.1f} dBFS, {len(segs)} Blöcke')
for k, (a, b) in enumerate(segs): print(f'{k:2d} {a:6.2f}-{b:6.2f} ({b-a:4.2f})  Pause danach {(segs[k+1][0]-b) if k+1<len(segs) else 0:4.2f}')
# Tonhöhe (Autokorrelation, stimmhafte Frames)
f0 = []
for a in range(0, len(x) - 2400, 2400):
    fr = x[a:a + 2400]
    if np.sqrt((fr ** 2).mean()) < .03: continue
    fr = fr - fr.mean(); ac = np.correlate(fr, fr, 'full')[2399:]; lo, hi = sr // 300, sr // 60
    k = lo + int(np.argmax(ac[lo:hi]))
    if ac[k] > .4 * ac[0]: f0.append(sr / k)
print(f'Tonhöhe Median {np.median(f0):.0f} Hz (10–90 %: {np.percentile(f0,10):.0f}–{np.percentile(f0,90):.0f}), Sprechzeit {sum(b-a for a,b in segs):.1f} s')
