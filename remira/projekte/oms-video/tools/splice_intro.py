"""Runde 6: neues Intro (0–13 s) vor den unveränderten Ton der Vorfassung setzen.
python tools/splice_intro.py neu.wav alt.wav out.wav  — neu wird so skaliert, dass 13–30 s gleich laut wie alt ist; Übergang 12,6–13,2 s equal-power."""
import sys, subprocess, re, numpy as np
from scipy.io import wavfile
new, old, dst = sys.argv[1:4]
def lufs(path, a, b):
    r = subprocess.run(['ffmpeg', '-hide_banner', '-ss', str(a), '-to', str(b), '-i', path, '-af', 'ebur128', '-f', 'null', '-'], capture_output=True, text=True).stderr
    return float(re.findall(r'I:\s+(-?[\d.]+) LUFS', r)[-1])
g = 10 ** ((lufs(old, 13, 30) - lufs(new, 13, 30)) / 20)
sr, A = wavfile.read(new); _, B = wavfile.read(old); A = A.astype(float) * g; B = B.astype(float)
# weicher Spitzenbegrenzer nur auf dem neuen Teil (Ziel −2 dBFS Sample-Spitze, 5 ms Vorlauf/Glättung)
from scipy.ndimage import minimum_filter1d, uniform_filter1d
thr = 32768 * 10 ** (-2 / 20); pk = np.max(np.abs(A), axis=1); gr = np.minimum(1, thr / np.maximum(pk, 1)); w = int(.005 * sr)
gr = uniform_filter1d(minimum_filter1d(gr, 2 * w), w); A = A * gr[:, None]
n = min(len(A), len(B)); A, B = A[:n], B[:n]; t = np.arange(n) / sr
u = np.clip((t - 12.6) / .6, 0, 1)[:, None]; out = A * np.cos(u * np.pi / 2) + B * np.sin(u * np.pi / 2)
wavfile.write(dst, sr, np.clip(np.rint(out), -32768, 32767).astype(np.int16)); print('Gain neu', round(20 * np.log10(g), 2), 'dB')
