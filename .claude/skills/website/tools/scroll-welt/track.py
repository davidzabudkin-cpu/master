# Bildschirm im Intro-Video Bild für Bild vermessen -> JSON (normierte Rechtecke), damit die Website das Welt-Bild exakt darauflegen kann
import subprocess, json, sys
import numpy as np
from PIL import Image, ImageDraw
W, H = 480, 270

def frames(path):
    p = subprocess.run(['ffmpeg', '-v', 'error', '-i', path, '-vf', f'scale={W}:{H}', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], capture_output=True)
    a = np.frombuffer(p.stdout, np.uint8); return a.reshape(-1, H, W, 3).astype(int)

def mask(f):
    r, g, b = f[..., 0], f[..., 1], f[..., 2]
    sky = (b > r + 35) & (b > 110)
    white = (r > 175) & (g > 175) & (b > 175) & (np.abs(r - b) < 45)
    green = (g > r + 15) & (g > b + 5) & (g > 70)
    return sky | white | green

def track(path, seed):
    out, cx, cy = [], seed[0] * W, seed[1] * H
    for i, f in enumerate(frames(path)):
        m = mask(f); x0, y0 = int(cx), int(cy)
        def walk(dx, dy):
            x, y, miss = x0, y0, 0
            while 0 <= x < W and 0 <= y < H:
                if m[y, x]: miss = 0
                else:
                    miss += 1
                    if miss > 4: return (x - dx * 5, y - dy * 5)
                x += dx; y += dy
            return (min(max(x, 0), W - 1), min(max(y, 0), H - 1))
        # mehrere Linien für Robustheit
        L = np.median([walk(-1, 0)[0] for _ in [0]] + [0]) if False else None
        xs_l, xs_r, ys_t, ys_b = [], [], [], []
        for oy in (-12, 0, 12):
            y1 = min(max(y0 + oy, 0), H - 1)
            row = m[y1]; x = x0; miss = 0
            while x > 0 and miss <= 4: miss = 0 if row[x] else miss + 1; x -= 1
            xs_l.append(x + 5)
            x = x0; miss = 0
            while x < W - 1 and miss <= 4: miss = 0 if row[x] else miss + 1; x += 1
            xs_r.append(x - 5)
        for ox in (-20, 0, 20):
            x1 = min(max(x0 + ox, 0), W - 1)
            col = m[:, x1]; y = y0; miss = 0
            while y > 0 and miss <= 4: miss = 0 if col[y] else miss + 1; y -= 1
            ys_t.append(y + 5)
            y = y0; miss = 0
            while y < H - 1 and miss <= 4: miss = 0 if col[y] else miss + 1; y += 1
            ys_b.append(y - 5)
        l, r, t, b = np.median(xs_l), np.median(xs_r), np.median(ys_t), np.median(ys_b)
        out.append([round(l / W, 4), round(t / H, 4), round(r / W, 4), round(b / H, 4)])
        cx, cy = (l + r) / 2, (t + b) / 2
    return out

if __name__ == '__main__':
    src, sx, sy, name = sys.argv[1], float(sys.argv[2]), float(sys.argv[3]), sys.argv[4]
    rects = track(src, (sx, sy))
    # geglättet (Ausreißer raus): gleitender Median über 5 Bilder
    arr = np.array(rects); sm = arr.copy()
    for i in range(len(arr)): sm[i] = np.median(arr[max(0, i - 2):i + 3], axis=0)
    json.dump(sm.round(4).tolist(), open(name + '.json', 'w'))
    fr = frames(src)
    for i in (0, 60, 120, 160, 200, 240):
        if i >= len(fr): continue
        im = Image.fromarray(fr[i].astype(np.uint8)); d = ImageDraw.Draw(im); l, t, r, b = sm[i]
        d.rectangle([l * W, t * H, r * W, b * H], outline=(255, 0, 0), width=2); im.save(f'_tr_{name}_{i}.png')
    print(name, len(sm), sm[0], sm[-1])
