"""Misst im Endbild das Seitenverhaeltnis der Sechsecke und prueft, ob Text still steht. Aufruf: python tools/measure.py VIDEO.mp4"""
import subprocess, sys, numpy as np
V = sys.argv[1]
def frames(ss, n):
    a = ['ffmpeg', '-v', 'error', '-ss', str(ss), '-i', V, '-frames:v', str(n), '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-']
    return np.frombuffer(subprocess.run(a, capture_output=True).stdout, np.uint8).reshape(-1, 1080, 1920, 3).astype(int)
f = frames(20.5, 1)[0]
green = lambda p: (abs(p[..., 0] - 168) < 30) & (abs(p[..., 1] - 213) < 26) & (abs(p[..., 2] - 154) < 30)
runs = lambda idx: [(int(a[0]), int(a[-1])) for a in np.split(idx, np.where(np.diff(idx) > 3)[0] + 1) if len(a) > 20]
row, col = np.where(green(f[540]))[0], np.where(green(f[:, 960]))[0]
rr, cc = runs(row), runs(col)
print('Reihe 540 gruen:', rr); print('Spalte 960 gruen:', cc)
w, h = rr[-1][1] - rr[0][0] + 1, cc[-1][1] - cc[0][0] + 1
print(f'gruener Ring aussen: {w} x {h} px, Verhaeltnis {w / h:.4f} (Soll 1.1547)')
wi, hi = rr[-1][0] - rr[0][1] - 1, cc[1][0] - cc[0][1] - 1
print(f'inneres Sechseck:    {wi} x {hi} px, Verhaeltnis {wi / hi:.4f}')
blk = lambda p: p.sum(-1) < 14
r, c = np.where(blk(f[540]))[0], np.where(blk(f[:, 960]))[0]
r = r[(r > 300) & (r < 1620)]
print(f'schwarzes Sechseck:  {r.max() - r.min() + 1} x {c.max() - c.min() + 1} px, Verhaeltnis {(r.max() - r.min() + 1) / (c.max() - c.min() + 1):.4f}')
for ss, name in ((19.0, 'Endbild'), (11.55, 'Ring fertig')):
    fr = frames(ss, 15); d = np.abs(fr[1:] - fr[:-1])
    print(f't {ss} {name}: mittlere Pixeldifferenz {d.mean():.3f}, max {d.max()}')
