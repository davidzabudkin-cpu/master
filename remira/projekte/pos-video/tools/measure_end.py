"""python tools/measure_end.py bild.png → Tintenkanten der Endkarte (Ring, REMIRA, Claim, Satz, Button)"""
import sys
from PIL import Image
rgb = Image.open(sys.argv[1]).convert('RGB'); W, H = rgb.size; L = rgb.convert('L')
prof = [sum(1 for x in range(0, W, 2) if L.getpixel((x, y)) > 110) for y in range(H)]
bands = []; inb = False
for y, v in enumerate(prof):
    if v > 3 and not inb: s = y; inb = True
    if v <= 3 and inb: bands.append((s, y)); inb = False
def ink(y0, y1, test, x0=0, x1=W):
    xs = [x for y in range(y0, y1) for x in range(x0, x1) if test(rgb.getpixel((x, y)))]; return (min(xs), max(xs)) if xs else None
white = lambda p: min(p) > 170; col = lambda p: max(p) - min(p) > 90 and max(p) > 120; lit = lambda p: max(p) > 150
lk = bands[0]; ring = ink(lk[0], lk[1], col); rem = ink(lk[0], lk[0] + 120, white, 700, W); claim = ink(lk[0] + 135, lk[1], white, 700, W)
print(f'Ring {ring}  REMIRA {rem}  Claim {claim}  Lockup {ring[0]}–{rem[1]} Mitte {(ring[0] + rem[1]) / 2}')
rest = bands[1:]; title = rest[0]; tl = ink(*title, lit); print(f'Satz {tl} Mitte {(tl[0] + tl[1]) / 2} Breite {tl[1] - tl[0] + 1}  (REMIRA-Breite {rem[1] - rem[0] + 1})  y {title}')
bt = ink(rest[1][0] - 2, rest[-1][1], lambda p: max(p) > 100); print(f'Button {bt} Mitte {(bt[0] + bt[1]) / 2}  y {rest[1][0]}–{rest[-1][1]}')
