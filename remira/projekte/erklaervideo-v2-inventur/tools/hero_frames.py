#!/usr/bin/env python3
"""Hero-Cutouts → Schleifen-Animation (Haare/Umhang wehen) per Verzerrungsfeld. Ergebnis: assets/heroes/<name>/NN.webp + meta.json
Aufruf: python tools/hero_frames.py"""
import json, pathlib, numpy as np, cv2
from PIL import Image
ROOT = pathlib.Path(__file__).resolve().parents[1]; NF = 30
def sm(a, b, v): u = np.clip((v - a) / (b - a), 0, 1); return u * u * (3 - 2 * u)
CFG = {
 'heroine': dict(width=1300, emblem=(1314, 650, 42), amp=13, k=10,
    weight=lambda X, Y: sm(.56, .24, X) * (1 - sm(.31, .43, Y))),
 'hero': dict(width=1150, emblem=(1220, 494, 92), amp=17, k=9,
    weight=lambda X, Y: sm(.31, .09, X) * (1 - sm(.40, .52, Y))),
}
meta = {}
for name, c in CFG.items():
    im = Image.open(ROOT / f'cache/heroes/{name}-raw.png').convert('RGBA'); a = np.array(im)
    ys, xs = np.where(a[..., 3] > 8); x0, x1, y0, y1 = xs.min(), xs.max() + 1, ys.min(), ys.max() + 1
    pad = 40; a = np.pad(a[y0:y1, x0:x1], ((pad, pad), (pad, pad), (0, 0)))
    s = c['width'] / a.shape[1]; W, H = c['width'], int(round(a.shape[0] * s))
    a = cv2.resize(a, (W, H), interpolation=cv2.INTER_AREA).astype(np.float32) / 255
    a[..., :3] *= a[..., 3:4]                                   # premultiplied für sauberes Resampling
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32); X, Y = xx / W, yy / H
    w = c['weight'](X, Y).astype(np.float32)
    out = ROOT / f'assets/heroes/{name}'; out.mkdir(parents=True, exist_ok=True)
    for f in range(NF):
        ph = 2 * np.pi * f / NF - c['k'] * (1 - X)
        dy = c['amp'] * w * np.sin(ph); dx = .45 * c['amp'] * w * np.cos(ph + .8) + .3 * c['amp'] * w * np.sin(2 * ph + 1.3) * .5
        r = cv2.remap(a, xx - dx, yy - dy, cv2.INTER_LINEAR, borderMode=cv2.BORDER_CONSTANT, borderValue=0)
        al = r[..., 3:4]; rgb = np.where(al > 1e-4, r[..., :3] / np.maximum(al, 1e-4), 0)
        Image.fromarray((np.clip(np.concatenate([rgb, al], 2), 0, 1) * 255 + .5).astype(np.uint8), 'RGBA').save(out / f'{f:02d}.webp', quality=93, method=4)
    ex, ey, er = c['emblem']
    meta[name] = dict(w=W, h=H, frames=NF, emblem=[round(((ex - x0 + pad) * s) / W, 4), round(((ey - y0 + pad) * s) / H, 4), round(er * s / W, 4)])
    print(name, W, H, meta[name]['emblem'])
(ROOT / 'assets/heroes/meta.json').write_text(json.dumps(meta, indent=1))
