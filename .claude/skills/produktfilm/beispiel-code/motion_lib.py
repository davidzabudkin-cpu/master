"""Wiederverwendbare Motion-Design-Bausteine für KI-Video + Code (deterministisch: alles hängt nur von Zeit/Seed ab).
Erprobt an ZIGZAB v14/v15. Farben über Parameter, Standard = ZIGZAB-Marke."""
import math
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageChops

EMBER, CREAM, INK, WHITE = (232, 105, 47), (244, 237, 224), (14, 26, 51), (255, 248, 236)
clamp = lambda x: max(0.0, min(1.0, x))
ease_out = lambda x: 1 - (1 - clamp(x)) ** 3
ease_in = lambda x: clamp(x) ** 3
ease_back = lambda x, s=2.2: 1 + (s + 1) * (clamp(x) - 1) ** 3 + s * (clamp(x) - 1) ** 2


def bolt_path(p0, p1, seed, rough=.22, depth=6):
    """Gezackter Blitz von p0 nach p1 (Mittelpunkt-Verschiebung mit festem Seed)."""
    rng = np.random.default_rng(seed); pts = [np.array(p0, float), np.array(p1, float)]
    for d in range(depth):
        new = [pts[0]]
        for a, b in zip(pts[:-1], pts[1:]):
            m = (a + b) / 2; v = b - a; n = np.array([-v[1], v[0]]) / (np.linalg.norm(v) + 1e-9)
            new += [m + n * rng.normal(0, rough * np.linalg.norm(v) * (.62 ** d) * 1.6), b]
        pts = new
    return [tuple(p) for p in pts]


def branches(path, seed, n=3, length=.18):
    rng = np.random.default_rng(seed + 99); out = []
    for k in range(n):
        i = int(rng.uniform(.2, .75) * (len(path) - 1)); a = np.array(path[i]); d = np.array(path[-1]) - np.array(path[0])
        ang = math.atan2(d[1], d[0]) + rng.choice([-1, 1]) * rng.uniform(.5, .9)
        L = np.linalg.norm(d) * length * rng.uniform(.6, 1.2)
        out.append(bolt_path(tuple(a), tuple(a + L * np.array([math.cos(ang), math.sin(ang)])), seed + k * 7, .25, 4))
    return out


def draw_lightning(img, paths, strength, scale=1.0, glow=EMBER, mid=(255, 160, 95), core=WHITE):
    """Blitz normal (nicht additiv) überlagern, damit die Farbe auf jedem Hintergrund stimmt."""
    if strength <= 0: return img
    W, H = img.size; img = img.convert('RGBA')
    for width, blur, col, alpha in [(30, 20, glow, .85), (10, 4, mid, 1.0), (3, 0, core, 1.0)]:
        m = Image.new('L', (W, H), 0); d = ImageDraw.Draw(m)
        for i, p in enumerate(paths):
            d.line(p, fill=255, width=max(1, int(width * scale * (1 if i == 0 else .5))), joint='curve')
        if blur: m = m.filter(ImageFilter.GaussianBlur(blur * scale)); m = m.point(lambda v: min(255, int(v * 2.2)))
        lay = Image.new('RGBA', (W, H), col + (0,)); lay.putalpha(m.point(lambda v: int(v * alpha * strength)))
        img = Image.alpha_composite(img, lay)
    return img.convert('RGB')


def glow_dot(size, center, r, strength, ring=None, sparks=0.0, seed=1, squash=1.0, col=EMBER):
    """Leuchtender Punkt als additive Ebene (für warme/helle Hintergründe)."""
    W, H = size; lay = Image.new('RGB', (W, H), (0, 0, 0)); cx, cy = center
    for rr, a, blur in [(r * 3.2, .55, 26), (r * 1.6, .9, 10)]:
        l = Image.new('RGB', (W, H), (0, 0, 0)); ImageDraw.Draw(l).ellipse((cx - rr, cy - rr * squash, cx + rr, cy + rr * squash), fill=tuple(int(c * a) for c in col))
        lay = ImageChops.add(lay, l.filter(ImageFilter.GaussianBlur(blur)))
    d = ImageDraw.Draw(lay)
    if ring:
        rr, ra = ring
        d.ellipse((cx - rr, cy - rr * squash, cx + rr, cy + rr * squash), outline=tuple(int(c * ra) for c in (255, 190, 140)), width=3)
    if sparks > 0:
        rng = np.random.default_rng(seed)
        for k in range(9):
            ang = rng.uniform(0, 2 * math.pi); r0 = r * (1.2 + 2.5 * sparks); r1 = r0 + r * (1.4 * (1 - sparks) + .4)
            d.line((cx + r0 * math.cos(ang), cy + r0 * math.sin(ang) * squash, cx + r1 * math.cos(ang), cy + r1 * math.sin(ang) * squash),
                   fill=tuple(int(c * (1 - sparks)) for c in WHITE), width=2)
    return Image.eval(lay, lambda v: int(v * strength))


def flash(size, strength, tint=(255, 236, 214)):
    return Image.new('RGB', size, tuple(int(c * strength) for c in tint))


def add(img, layer):
    return img if layer is None else ImageChops.add(img, layer)


def zoom(img, s):
    """Zoom-Punch: Bild um Faktor s vergrößert, mittig zugeschnitten."""
    if abs(s - 1) < 1e-3: return img
    W, H = img.size; w, h = round(W * s), round(H * s)
    return img.resize((w, h), Image.BICUBIC).crop(((w - W) // 2, (h - H) // 2, (w - W) // 2 + W, (h - H) // 2 + H))


def shake(img, amp, t, seed=0):
    """Kamera-Shake: deterministischer Versatz aus Zeit + Seed, Rand durch 4 % Zoom verdeckt."""
    if amp <= .2: return img
    W, H = img.size; rng = np.random.default_rng(seed + int(t * 1000))
    dx, dy = rng.uniform(-1, 1) * amp, rng.uniform(-1, 1) * amp * .7
    s = 1 + (2 * amp + 4) / W; w, h = round(W * s), round(H * s)
    big = img.resize((w, h), Image.BICUBIC); x0 = (w - W) // 2 + round(dx); y0 = (h - H) // 2 + round(dy)
    return big.crop((x0, y0, x0 + W, y0 + H))


def rgb_split(img, px):
    if px < 1: return img
    r, g, b = img.split()
    return Image.merge('RGB', (ImageChops.offset(r, int(px), 0), g, ImageChops.offset(b, -int(px), 0)))


def shockwave(size, center, radius, strength, squash=.55, col=CREAM, width=3):
    W, H = size; lay = Image.new('RGB', (W, H), (0, 0, 0)); cx, cy = center
    for rr, w, a in [(radius, width, 1.0), (radius * .82, max(1, width - 1), .5)]:
        ImageDraw.Draw(lay).ellipse((cx - rr, cy - rr * squash, cx + rr, cy + rr * squash), outline=tuple(int(c * a * strength) for c in col), width=w)
    return lay.filter(ImageFilter.GaussianBlur(1.2))


def mask_points(img, cond, n, seed, edge=True):
    """Zufällige Punkte auf einer Farbmaske (z. B. auf dem gestickten Blitz), fester Seed pro Bild."""
    a = np.asarray(img).astype(int); m = cond(a[..., 0], a[..., 1], a[..., 2])
    if edge:
        e = m.copy(); e[1:-1, 1:-1] = m[1:-1, 1:-1] & ~(m[:-2, 1:-1] & m[2:, 1:-1] & m[1:-1, :-2] & m[1:-1, 2:]); m = e
    ys, xs = np.nonzero(m)
    if len(xs) == 0: return []
    rng = np.random.default_rng(seed); idx = rng.choice(len(xs), size=min(n, len(xs)), replace=False)
    return [(int(xs[i]), int(ys[i])) for i in idx]


def knife_tip(img_bgr_or_rgb_gray, band=(440, 720), y_from=250):
    """Unterste Spitze eines dunklen, senkrechten Werkzeugs (z. B. Messer) im Bildband. Eingabe: Graustufen-Array."""
    g = img_bgr_or_rgb_gray; x0, x1 = band
    dark = g[y_from:, x0:x1] < 165
    rows = np.nonzero(dark.sum(1) > 6)[0]
    if len(rows) == 0: return None
    # zusammenhängend von oben: erste Lücke beendet das Werkzeug
    last = rows[0]
    for r in rows[1:]:
        if r - last > 3: break
        last = r
    xs = np.nonzero(dark[last])[0]
    return (int(x0 + xs.mean()), int(y_from + last))


def cut_trace(rgb, tip, reach=330, strength=.7, col=EMBER):
    """Leichtes Leuchten entlang einer frischen Schnittlinie, das von der Messerspitze aus verblasst."""
    import cv2
    g = cv2.cvtColor(np.asarray(rgb), cv2.COLOR_RGB2GRAY)
    bh = cv2.morphologyEx(g, cv2.MORPH_BLACKHAT, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (11, 11)))
    bg = cv2.GaussianBlur(g, (31, 31), 0)
    m = ((bh > 20) & (bg > 170)).astype(np.uint8); m[:max(0, tip[1] - 12)] = 0
    n, lab, st, _ = cv2.connectedComponentsWithStats(m, 8)
    keep = np.zeros_like(m)
    yy, xx = np.mgrid[0:m.shape[0], 0:m.shape[1]]
    near = (np.abs(xx - tip[0]) < 45) & (np.abs(yy - tip[1]) < 45)
    for k in range(1, n):
        if st[k][4] > 60 and (near & (lab == k)).any(): keep[lab == k] = 1
    d = np.sqrt((xx - tip[0]) ** 2 + (yy - tip[1]) ** 2)
    fade = np.clip(1 - d / reach, 0, 1) ** 1.6
    core = cv2.dilate(keep, np.ones((3, 3), np.uint8)).astype(np.float32) * fade
    glow = cv2.GaussianBlur(cv2.dilate(keep, np.ones((7, 7), np.uint8)).astype(np.float32), (0, 0), 6) * fade
    a = np.clip(core * 1.0 + glow * 1.6, 0, 1) * strength
    # Spitze: kleiner heller Punkt, wo das Messer gerade schneidet
    tip_glow = np.exp(-(d / 9.0) ** 2) * strength * 1.2
    base = np.asarray(rgb).astype(np.float32)
    colv = np.array(col, np.float32)
    out = base * (1 - a[..., None]) + colv * a[..., None]
    out = out + (np.array(WHITE, np.float32) - out) * np.clip(tip_glow, 0, 1)[..., None]
    return Image.fromarray(np.clip(out, 0, 255).astype(np.uint8))
