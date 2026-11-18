"""python tools/measure_badges.py bild.jpg y0 y1 farbe → Badge-Mitte vs. Mitte des ersten Großbuchstabens rechts daneben (Tinte)
farbe: blue|green|red. Sucht im Zeilenband y0–y1."""
import sys, numpy as np
from PIL import Image
f, y0, y1, col = sys.argv[1], int(sys.argv[2]), int(sys.argv[3]), sys.argv[4]
a = np.array(Image.open(f).convert('RGB')).astype(int)[y0:y1]
T = {'blue': (a[:, :, 2] > 180) & (a[:, :, 0] < 110) & (a[:, :, 1] > 120), 'green': (a[:, :, 1] > 150) & (a[:, :, 0] < 150) & (a[:, :, 2] < 130),
     'red': (a[:, :, 0] > 190) & (a[:, :, 1] < 110) & (a[:, :, 2] < 120)}[col]
xs = np.where(T.any(axis=0))[0]; bx0, bx1 = xs.min(), xs.max()
# nur zusammenhängender Badge (erste Gruppe)
gaps = np.where(np.diff(xs) > 3)[0]; bx1 = xs[gaps[0]] if len(gaps) else bx1
ys = np.where(T[:, bx0:bx1 + 1].any(axis=1))[0]; bmid = (ys.min() + ys.max()) / 2 + y0
W = (a.min(axis=2) > 200); W[:, :bx1 + 4] = False
cols = np.where(W.any(axis=0))[0]; c0 = cols[0]; c1 = c0
while c1 + 1 < W.shape[1] and W[:, c1 + 1].any(): c1 += 1
ly = np.where(W[:, c0:c1 + 1].any(axis=1))[0]; lmid = (ly.min() + ly.max()) / 2 + y0
print(f'Badge-Mitte {bmid:.1f}  Großbuchstabe {ly.min() + y0}–{ly.max() + y0} Mitte {lmid:.1f}  Abweichung {bmid - lmid:+.1f} px')
