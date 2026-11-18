"""ZIGZAB Film v19: drei Fassungen mit der neuen Hook (A Nadelring, B Masche). Brief: BRIEF-film-glory.md (Runde 2).
Gegenüber v18 (Davids Feedback):
- Maschinen-Ton wieder drin (Stricken, Schneiden, Nähen), jeweils der echte Seedance-Ton des Shots, im selben Tempo wie das Bild.
- Whooshes an den Schnitten, Wind am T-Shirt, kleiner Windstoß, wenn das Licht übers T-Shirt fährt (Makro).
- GLORY ist ab Sekunde 0 ganz leise und dumpf da und öffnet sich beim Eintauchen in den Ring.
Fassungen:
  glory = Schnitt auf GLORY, Song eingebaut (nur intern)
  ohne  = derselbe Schnitt, alle Sounds, kein Song (zum Posten, GLORY in der App ab 0:38,6)
  alt   = Schnitt wie v17, alte Seedance-Musik + alle alten Sounds; Musik ab Sekunde 0 leise, Filter öffnet sich bis zum Drop
  eigen = (v20) Schnitt wie glory, aber mit eigenem Phonk-Beat (Seed Audio), Pause/Drop im Arrangement nachgebaut
Aufruf (im Ordner film-v2): python tools/glory_v19.py glory|ohne|alt|eigen [spaet]   (spaet = v21: Musik erst ab dem Punkt)"""
import subprocess, pathlib, math, sys
import numpy as np
from PIL import Image, ImageDraw, ImageFont
from scipy.signal import butter, sosfilt
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
from motion_lib import *
import cv2

MODE = sys.argv[1] if len(sys.argv) > 1 else 'glory'
RAW, V13, V9 = 'renders/zigzab-film-v8-r1.mp4', 'renders/final/ZIGZAB Film v13 16x9.mp4', 'renders/final/ZIGZAB Film v9 16x9.mp4'
HOOK_A, HOOK_B, SONG = 'renders/hook-A-r1.mp4', 'renders/hook-B-r1.mp4', 'glory/glory.mp3'
OUT = {'glory': 'renders/final/ZIGZAB Film v19 GLORY 16x9.mp4', 'ohne': 'renders/final/ZIGZAB Film v19 ohne Musik 16x9.mp4',
       'alt': 'renders/final/ZIGZAB Film v19 alte Musik 16x9.mp4', 'eigen': 'renders/final/ZIGZAB Film v20 eigener Beat 16x9.mp4'}[MODE]
LATE = len(sys.argv) > 2 and sys.argv[2] == 'spaet'   # v21: Musik erst ab dem Punkt (Kreis), voll da, wenn sich der Blitz auflädt
if LATE: OUT = OUT.replace(' v19 ', ' v21 ').replace(' v20 ', ' v21 ')
W, H, FPS, SR = 1280, 720, 24, 48000
S = (W, H)
f2t = lambda f: f / FPS
B0 = 22                                       # Startbild im Hook-B-Clip (ab ca. Bild 14 ist das Garn sichtbar)

if MODE in ('glory', 'ohne', 'eigen'):
    OFF = 47.654 - 218 / FPS                  # Film-Zeit = Song-Zeit - OFF, Drop genau auf Bild 218
    s2f = lambda s: round((s - OFF) * FPS)
    HB = 60 / 171.55 * 2                      # Bass-Puls 0,6996 s
    F_IN, F_CUT, F_STITCH, F_BREAK = s2f(40.666), s2f(42.065), s2f(43.464), s2f(44.863)
    F_DOT, F_LOGO, F_DROP = s2f(46.264), s2f(46.264 + .5), s2f(47.654)
    F_TEE, F_MAKRO, F_HERO = s2f(47.654 + 1.5 * HB), s2f(47.654 + 3 * HB), s2f(47.654 + 4.5 * HB)
    F_STRIKE = s2f(51.865); F_END = F_STRIKE + 34
    A_END = 72                                # Hook A 1,44x schneller
else:
    HB = .836                                 # Puls der Seedance-Musik
    F_IN, D = 48, 47                          # Hook A 2,0 s, Hook B 1,17 s; Einsatz liegt 8 Schläge vor dem Drop
    F_CUT, F_STITCH, F_BREAK, F_DOT, F_LOGO, F_DROP, F_TEE, F_MAKRO, F_HERO = [v + D for v in (29, 72, 101, 131, 143, 162, 186, 215, 241)]
    F_STRIKE = F_HERO + 28; F_END = F_HERO + 55
    A_END = 69
F_ZOOM, F_TXT = F_HERO + 8, F_STRIKE - 2

# Segmente: (Quelle, Quellbild von, bis [exkl.], Filmbild von, bis [exkl.])
SEGS = [
    (HOOK_A, 0, A_END, 0, F_IN),              # Nadelring
    (HOOK_B, B0, B0 + round((F_CUT - F_IN) * 1.29), F_IN, F_CUT),   # Masche entsteht
    (RAW, 46, 89, F_CUT, F_STITCH),           # Zuschnitt
    (RAW, 107, 136, F_STITCH, F_BREAK),       # Nadel näht von links nach rechts
    (RAW, 136, 166, F_BREAK, F_DOT),          # Nadel fährt zur Spitze, Punkt liegt frei
    (RAW, 166, 178, F_DOT, F_LOGO),
    (RAW, 178, 197, F_LOGO, F_DROP),          # Streiflicht übers Logo
    (RAW, 197, 221, F_DROP, F_TEE),           # Cap (mit Seedance-Whip am Anfang)
    (V13, 221, 223, F_TEE, F_TEE + 2),        # eigener Dreh-Whip Cap -> Tee (aus v9)
    (RAW, 253, 280, F_TEE + 2, F_MAKRO),      # T-Shirt im Wind
    (RAW, 280, 306, F_MAKRO, F_HERO),         # Licht-Makro
    (RAW, 306, 361, F_HERO, F_END),           # Hero + Endkarte
]
LABELS = [('01', 'KNIT', F_IN + 3, F_CUT - 2), ('02', 'CUT', F_CUT + 3, F_STITCH - 2), ('03', 'STITCH', F_STITCH + 3, F_BREAK - 2)]
CUTS = [F_CUT, F_STITCH, F_BREAK]
DOT_POS, END_DOT = (815, 401), (852, 588)
serif = ImageFont.truetype('v3/instrument-serif-italic.ttf', 78)
mono = ImageFont.truetype('v3/dmmono.ttf', 22)
DROP_BOLT = bolt_path((700, -20), (560, 760), seed=11, rough=.18); DROP_BR = branches(DROP_BOLT, 11, 3)
TEE_BOLT = bolt_path((-20, 150), (1300, 560), seed=31, rough=.12); TEE_BR = branches(TEE_BOLT, 31, 2, .12)
END_BOLT = bolt_path((1170, -30), END_DOT, seed=23, rough=.14); END_BR = branches(END_BOLT, 23, 2, .15)
is_bolt = lambda r, g, b: (r > 150) & (r - b > 90) & (g < 160)

# ---------------- Bild: Segmente laden, zwischenrechnen ----------------
dis = cv2.DISOpticalFlow_create(cv2.DISOPTICAL_FLOW_PRESET_MEDIUM)
gy, gx = np.mgrid[0:H, 0:W].astype(np.float32)


def load(path, a, b):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', path, '-vf', f'select=between(n\\,{a}\\,{b - 1})', '-fps_mode', 'passthrough',
                          '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], capture_output=True, check=True).stdout
    return list(np.frombuffer(raw, np.uint8).reshape(-1, H, W, 3))


def between(f0, f1, a):
    """Zwischenbild bei Anteil a (0..1) per optischem Fluss."""
    flow = dis.calc(cv2.cvtColor(f0, cv2.COLOR_RGB2GRAY), cv2.cvtColor(f1, cv2.COLOR_RGB2GRAY), None)
    w0 = cv2.remap(f0, gx - a * flow[..., 0], gy - a * flow[..., 1], cv2.INTER_LINEAR, borderMode=cv2.BORDER_REPLICATE)
    w1 = cv2.remap(f1, gx + (1 - a) * flow[..., 0], gy + (1 - a) * flow[..., 1], cv2.INTER_LINEAR, borderMode=cv2.BORDER_REPLICATE)
    return ((1 - a) * w0.astype(np.float32) + a * w1.astype(np.float32)).astype(np.uint8)


def segment_frames(path, a, b, o0, o1):
    src = load(path, a, b); n_out = o1 - o0; n_src = len(src)
    for j in range(n_out):
        p = j * n_src / n_out; i = int(p); fr = p - i
        if i >= n_src - 1 or fr < .08: yield src[min(i, n_src - 1)]
        elif fr > .92: yield src[i + 1]
        else: yield between(src[i], src[i + 1], fr)


# Endkarte (wie tools/endkarte_zoom.py, aber auf Filmzeit)
ZD, TD, S1 = .6, .45, .64
efont = ImageFont.truetype('v3/archivo-wdth.ttf', round(H * .11)); efont.set_variation_by_axes([900, 118])
txt = Image.new('RGBA', S, (0, 0, 0, 0)); dr = ImageDraw.Draw(txt); bb = dr.textbbox((0, 0), 'ZIGZAB', font=efont)
dr.text(((W - (bb[2] - bb[0])) // 2 - bb[0], round(H * .845 - (bb[3] - bb[1]) / 2) - bb[1]), 'ZIGZAB', font=efont, fill=CREAM + (255,))
ease_io = lambda x: 4 * x ** 3 if x < .5 else 1 - (-2 * x + 2) ** 3 / 2
feather = lambda w, h, r=22: (np.clip(np.minimum.outer(np.minimum(np.arange(h), np.arange(h)[::-1]), np.minimum(np.arange(w), np.arange(w)[::-1])) / r, 0, 1) * 255).astype(np.uint8)
end_state = {}


def endkarte(f, img):
    t, z0, t0 = f2t(f), f2t(F_ZOOM), f2t(F_TXT)
    if t >= z0:
        fr = np.asarray(img); k = ease_io(min(1, (t - z0) / ZD)); s = 1 - (1 - S1) * k
        if 'bg' not in end_state:
            band = np.concatenate([fr[:12].reshape(-1, 3), fr[:, :12].reshape(-1, 3), fr[:, -12:].reshape(-1, 3)])
            end_state['bg'] = tuple(int(v) for v in np.median(band, axis=0))
            m = np.abs(fr.astype(int) - np.array(end_state['bg'])).sum(axis=2) > 90; cols = np.where(m.mean(axis=0) > .02)[0]
            end_state['shift'] = (W / 2 - (cols.min() + cols.max()) / 2) if len(cols) else 0
        sw, sh = round(W * s), round(H * s); canvas = Image.new('RGB', S, end_state['bg'])
        canvas.paste(img.resize((sw, sh), Image.LANCZOS), (round(W / 2 + end_state['shift'] * s * k - sw / 2), round(H / 2 - H * .115 * k - sh / 2)),
                     Image.fromarray(feather(sw, sh)))
        img = canvas
    if t >= t0:
        a = min(1, (t - t0) / TD); lay = Image.new('RGBA', S, (0, 0, 0, 0)); lay.paste(txt, (0, round(14 * (1 - ease_out(a)))))
        lay.putalpha(Image.fromarray((np.asarray(lay)[..., 3] * ease_out(a)).astype(np.uint8)))
        img = Image.alpha_composite(img.convert('RGBA'), lay).convert('RGB')
    return img


def zoom_blur(img, s0, s1, steps=8):
    """Zoom mit Bewegungsunschärfe in die Bildmitte (Sog in den Stoffschlauch)."""
    acc = np.zeros((H, W, 3), np.float32)
    for k in range(steps): acc += np.asarray(zoom(img, s0 + (s1 - s0) * k / (steps - 1)), np.float32)
    return Image.fromarray((acc / steps).astype(np.uint8))


def render(f, img):
    t = f2t(f); adds = []; amp = 0; split = 0
    # Hook A: kurzer Zoom-out beim Start, am Ende Sog in die dunkle Mitte
    if f < 10: img = zoom(img, 1 + .12 * (1 - ease_out(f / 10)))
    if F_IN - 9 <= f < F_IN:
        u = (f - (F_IN - 9)) / 8; s = 1 + 1.6 * ease_in(u)
        img = zoom_blur(img, s, s * (1 + .12 + .25 * u))
        img = Image.blend(img, Image.new('RGB', S, (8, 6, 5)), .55 * ease_in(u))
    # Einsatz der Musik + Herstellungs-Schnitte: Zoom-Punch + kurzer Lichtblitz
    for c, z, fl in [(F_IN, .10, .5)] + [(c, .07, .3) for c in CUTS]:
        k = f - c
        if 0 <= k < 7: img = zoom(img, 1 + z * (1 - ease_out(k / 6)))
        if 0 <= k <= 1: adds.append(flash(S, fl * (1 if k == 0 else .35)))
    k = f - F_IN
    if 0 <= k <= 4: amp = max(amp, 8 * (1 - k / 5) ** 1.5); split = {0: 6, 1: 3}.get(k, 0)
    for num, word, f0, f1 in LABELS:
        if f0 <= f < f1:
            a = clamp((f1 - f) / 4); n = int(len(word) * ease_out((f - f0) / 7) + .999)
            lay = Image.new('RGBA', S, (0, 0, 0, 0)); d = ImageDraw.Draw(lay); x, y = 58, 650
            d.line((x, y - 14, x + 26 * ease_out((f - f0) / 5), y - 14), fill=EMBER + (int(255 * a),), width=2)
            d.text((x, y), num, font=mono, fill=EMBER + (int(255 * a),))
            d.text((x + 42, y), word[:n], font=mono, fill=INK + (int(235 * a),))
            img = Image.alpha_composite(img.convert('RGBA'), lay).convert('RGB')
    # Punkt: Glow, Ring, Funken + Lichtblitz
    if F_DOT <= f < F_LOGO:
        u = t - f2t(F_DOT); tl = f2t(F_LOGO)
        s = ease_out(u / .1) * (1 - .4 * clamp((u - .2) / .3)) * (1 if t < tl - .06 else clamp((tl - t) / .06))
        ring = (22 + 140 * ease_out(u / .4), clamp(1 - u / .4)) if u < .4 else None
        adds.append(glow_dot(S, DOT_POS, 26, s, ring, clamp(u / .3) if u < .3 else 0, seed=5, squash=.42))
        if f - F_DOT <= 1: adds.append(flash(S, (.3, .1)[f - F_DOT]))
    # Logo: Funken an der Stickkante, immer mehr bis zum Drop
    if F_LOGO + 2 <= f < F_DROP:
        u = (f - F_LOGO - 2) / (F_DROP - F_LOGO - 2); n = 1 + int(11 * u ** 1.5)
        pts = np.array(mask_points(img, is_bolt, 400, seed=f)); paths = []; rng = np.random.default_rng(f * 7 + 1)
        if len(pts) > 10:
            for kk in rng.choice(len(pts), size=min(n, len(pts)), replace=False):
                p = pts[kk]; d = np.linalg.norm(pts - p, axis=1); near = np.nonzero((d > 22) & (d < 70))[0]
                if len(near): paths.append(bolt_path(tuple(p), tuple(pts[rng.choice(near)]), seed=f * 13 + int(kk), rough=.16, depth=3))
        if paths: img = draw_lightning(img, paths, .7 + .3 * u, scale=.45, mid=(255, 226, 200))
        amp = 3.5 * u * u
    k = f - F_DROP
    if -1 <= k <= 3:
        img = draw_lightning(img, [DROP_BOLT] + DROP_BR, {-1: .35, 0: 1.0, 1: .7, 2: .35, 3: .12}[k])
        if k >= 0: adds.append(flash(S, {0: .55, 1: .22, 2: .08, 3: 0}[k]))
    if 0 <= k <= 6: amp = max(amp, 14 * (1 - k / 7) ** 1.5)
    split = max(split, {0: 9, 1: 5, 2: 2}.get(k, 0))
    k2 = f - F_TEE
    if -1 <= k2 <= 3:
        img = draw_lightning(img, [TEE_BOLT] + TEE_BR, {-1: .3, 0: .95, 1: .55, 2: .25, 3: .08}[k2], scale=.8)
        if k2 >= 0: adds.append(flash(S, {0: .32, 1: .1, 2: 0, 3: 0}[k2]))
    if 0 <= k2 <= 4: amp = max(amp, 9 * (1 - k2 / 5) ** 1.5)
    if k2 in (0, 1): split = max(split, {0: 6, 1: 3}[k2])
    k4 = f - F_MAKRO
    if 0 <= k4 < 7: img = zoom(img, 1 + .05 * (1 - ease_out(k4 / 6)))
    # Spruch Wort für Wort
    if F_MAKRO + 2 <= f < F_HERO - 1:
        lay = Image.new('RGBA', S, (0, 0, 0, 0)); d = ImageDraw.Draw(lay); out_a = clamp((f2t(F_HERO - 1) - t) / .2)
        cx = 1200 - d.textlength('Stitched electric.', font=serif); t1 = f2t(F_MAKRO + 2)
        for word, t0 in [('Stitched', t1), ('electric.', t1 + .35)]:
            a = ease_out((t - t0) / .3) * out_a; dy = 14 * (1 - ease_out((t - t0) / .3))
            if a > 0: d.text((cx, 588 + dy), word, font=serif, fill=INK + (int(255 * a),))
            cx += d.textlength(word + ' ', font=serif)
        img = Image.alpha_composite(img.convert('RGBA'), lay).convert('RGB')
    if 0 <= f - F_HERO <= 1: adds.append(flash(S, .28 * (1 if f == F_HERO else .35)))
    if f >= F_HERO: img = endkarte(f, img)
    # Endkarte: Glut-Punkt glimmt, Blitz schlägt ein
    F_ENDDOT = F_STRIKE - 10
    if f >= F_ENDDOT:
        u = t - f2t(F_ENDDOT); pre = clamp(u / .3); ts = f2t(F_STRIKE); v = t - ts
        flick = 1 if t >= ts else (.75 + .25 * math.sin(u * 47) * math.sin(u * 13))
        size = 9 * ease_back(u / .3) if t < ts else 11
        dot = Image.new('RGBA', S, (0, 0, 0, 0)); ImageDraw.Draw(dot).ellipse((END_DOT[0] - size, END_DOT[1] - size, END_DOT[0] + size, END_DOT[1] + size), fill=EMBER + (255,))
        img = Image.alpha_composite(img.convert('RGBA'), dot).convert('RGB')
        k3 = f - F_STRIKE
        adds.append(glow_dot(S, END_DOT, 11, (.55 if t < ts else .8) * pre * flick, sparks=clamp(v / .35) if 0 <= v < .35 else 0, seed=8))
        if -1 <= k3 <= 4:
            img = draw_lightning(img, [END_BOLT] + END_BR, {-1: .3, 0: 1.0, 1: .75, 2: .4, 3: .18, 4: .06}[k3])
            if k3 >= 0: adds.append(flash(S, {0: .6, 1: .25, 2: .1, 3: .03, 4: 0}[k3]))
        if 0 <= v < .55:
            adds.append(shockwave(S, END_DOT, 20 + 760 * ease_out(v / .55), 1 - v / .55))
            if v > .08: adds.append(shockwave(S, END_DOT, 20 + 520 * ease_out((v - .08) / .5), (1 - v / .55) * .6, width=2))
        if 0 <= k3 <= 5: amp = max(amp, 10 * (1 - k3 / 6) ** 1.5)
        if k3 in (0, 1): split = max(split, {0: 7, 1: 3}[k3])
    for a in adds: img = add(img, a)
    return shake(rgb_split(img, split), amp, t, seed=3)


vid = OUT + '.video.mp4'
enc = subprocess.Popen(['ffmpeg', '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{H}', '-r', str(FPS), '-i', '-',
                        '-c:v', 'libx264', '-crf', '15', '-preset', 'slow', '-pix_fmt', 'yuv420p', vid], stdin=subprocess.PIPE)
f = 0
for path, a, b, o0, o1 in SEGS:
    assert o0 == f, (path, o0, f)
    for fr in segment_frames(path, a, b, o0, o1):
        enc.stdin.write(np.asarray(render(f, Image.fromarray(fr)), np.uint8).tobytes()); f += 1
enc.stdin.close(); enc.wait()
DUR = F_END / FPS


# ---------------- Ton ----------------
def pcm(path, af=None, ss=None, dur=None):
    cmd = ['ffmpeg', '-v', 'error'] + (['-ss', f'{ss:.4f}', '-t', f'{dur:.4f}'] if ss is not None else []) + ['-i', path, '-vn', '-ac', '2', '-ar', str(SR)]
    cmd += (['-af', af] if af else []) + ['-f', 'f32le', '-']
    return np.frombuffer(subprocess.run(cmd, capture_output=True, check=True).stdout, np.float32).reshape(-1, 2).copy()


def seg(x, t0, t1, fi=.005, fo=.1):
    y = x[int(t0 * SR):int(t1 * SR)].copy(); i, o = int(fi * SR), int(fo * SR)
    if i: y[:i] *= np.linspace(0, 1, i)[:, None]
    if o: y[-o:] *= np.linspace(1, 0, o)[:, None]
    return y


def sweep(x, fc_at, block=512):
    """Tiefpass, dessen Grenzfrequenz sich über die Zeit ändert (fc_at: Sekunde -> Hz). Filterzustand läuft weiter, kein Knacksen."""
    out = np.zeros_like(x); zi = np.zeros((2, 2, 2))
    for b0 in range(0, len(x), block):
        sos = butter(4, min(fc_at(b0 / SR), SR * .45), 'low', fs=SR, output='sos')
        out[b0:b0 + block], zi = sosfilt(sos, x[b0:b0 + block], axis=0, zi=zi)
    return out


rms = lambda x: float(np.sqrt(np.mean(x ** 2)) + 1e-9)
A = np.zeros((int(DUR * SR), 2), np.float32)
T = f2t


def put(x, at, g, norm=True):
    if norm: x = x / (np.abs(x).max() + 1e-9) * ref
    s = int(round(at * SR)); s0 = max(0, -s); s = max(0, s); e = min(len(A), s + len(x) - s0)
    if e > s: A[s:e] += x[s0:s0 + e - s] * g


def machine(path, a, b, o0, o1, fo=.015):
    """Echter Ton eines Shots (Quellbilder a..b), im selben Tempo wie das Bild auf o0..o1 gestreckt."""
    k = (b - a) / (o1 - o0)
    x = pcm(path, f'atempo={k:.5f}', ss=a / FPS, dur=(b - a) / FPS)[:int((o1 - o0) / FPS * SR)]
    i = int(.008 * SR); x[:i] *= np.linspace(0, 1, i)[:, None]; o = int(fo * SR); x[-o:] *= np.linspace(1, 0, o)[:, None]
    return x


P = 'ton/prozedural/'
fx1, fx2, fx3, fx4 = pcm('ton/effekte-seed-1.wav'), pcm('ton/effekte-seed-2.wav'), pcm('ton/effekte-seed-3.wav'), pcm('ton/effekte-seed-4.wav')
riser = pcm('ton/riser-seed-1.wav')
# Hook-Ton: Hook A läuft 0,25 s in Hook B hinein und blendet dort aus, Hook B blendet am Schnitt in 30 ms aus
HOOK_MACH = [(HOOK_A, 0, A_END + 9, 0, F_IN + 6, .25), (*SEGS[1][:3], SEGS[1][3], SEGS[1][4], .03)]

BEAT = 'ton/phonk-eigen-2-171.wav'          # eigener Beat (Seed Audio, Job a1fd3fa8), mit atempo 1,04053 auf 171,55 BPM gestreckt
BEAT_IN = 1.582                             # Groove-Einsatz im Beat (Kick auf dem Takt), liegt auf dem Film-Einsatz


def intro_tail(m):
    """Bis zum Eintauchen dumpf und leise, beim Sog öffnet sich der Filter, voll auf dem Einsatz; in der Herstellung 2,5 dB leiser,
    damit der Drop noch mehr aufgeht; nach dem Einschlag läuft die Musik gefiltert aus."""
    t_dive, t_in = T(F_IN - 9), T(F_IN)
    fc = lambda t: 260 if t < t_dive else (20000 if t >= t_in - .01 else 260 * (20000 / 260) ** (((t - t_dive) / (t_in - .01 - t_dive)) ** 1.6))
    n_in = int((t_in + .05) * SR); m[:n_in] = sweep(m[:n_in], fc)
    tt = np.arange(len(m)) / SR
    g_db = np.interp(tt, [0, .35, t_dive, t_in - .02, t_in, T(F_DROP) - .02, T(F_DROP)], [-45, -22, -17, -6, -2.5, -2.5, 0])
    m *= (10 ** (g_db / 20))[:, None]
    i0 = int(T(F_STRIKE) * SR); tail = m[i0:].copy(); n = len(tail)
    m[i0:] = sweep(tail, lambda t: 9000 * (1 - min(1, t / 1.6)) ** 3 + 180) * ((1 - np.linspace(0, 1, n)) ** 1.6 * .8)[:, None]
    return m


def late(m):
    """v21: vor dem Punkt keine Musik. Ab 0,5 s vor dem Kreis langsam lauter (-36 dB -> 0), voll da, wenn sich der Blitz auflädt (Logo).
    Der Bass-Schlag auf dem Punkt bleibt voll, er trägt den Zap."""
    tt = np.arange(len(m)) / SR; td, t0, t1 = T(F_DOT), T(F_DOT - 12), T(F_LOGO)
    lo = sosfilt(butter(4, 150, 'low', fs=SR, output='sos'), m, axis=0)
    hitl = lo * np.interp(tt, [td - .02, td - .01, td + .30, td + .38], [0, 1, 1, 0])[:, None]
    g = 10 ** (np.interp(tt, [t0, t1], [-36, 0]) / 20); g[tt < t0] = 0
    return (m - hitl) * g[:, None] + hitl


if MODE in ('glory', 'ohne', 'eigen'):
    if MODE == 'eigen':
        beat = pcm(BEAT); d = T(F_IN) + .012 - BEAT_IN          # Beat-Zeit = Film-Zeit - d
        i_drop = int((T(F_DROP) - d) * SR); ref = np.abs(beat[i_drop:i_drop + SR]).max(); song_rms = rms(beat[i_drop:i_drop + 4 * SR])
        m = np.zeros_like(A); s = int(d * SR); m[s:] = beat[:len(A) - s]
        # Pause wie im Song-Aufbau: ab der Pause Kick + 808 raus, nur zwei Bass-Schläge (Puls 7 und 8, der zweite auf dem Punkt),
        # Melodie läuft weiter, 0,3 s Stille vor dem Drop
        tb, td, tdr = T(F_BREAK), T(F_DOT), T(F_DROP); tt = np.arange(len(m)) / SR
        lo = sosfilt(butter(4, 150, 'low', fs=SR, output='sos'), m, axis=0); hi = m - lo
        hit = lo[int((tb - .01) * SR):int((tb + .33) * SR)].copy(); hit[-int(.08 * SR):] *= np.linspace(1, 0, int(.08 * SR))[:, None]
        gl = np.interp(tt, [0, tb - .006, tb, tdr - .004, tdr], [1, 1, 0, 0, 1])
        gh = np.interp(tt, [0, tb - .01, tb, tdr - .32, tdr - .30, tdr - .004, tdr], [1, 1, .75, .6, 0, 0, 1])
        m = lo * gl[:, None] + hi * gh[:, None]
        for th in (tb + HB, td): s = int((th - .01) * SR); m[s:s + len(hit)] += hit
        m = intro_tail(m); put(late(m) if LATE else m, 0, 1.0, norm=False)
    else:
        song = pcm(SONG); ref = np.abs(song[int(47.654 * SR):int(48.654 * SR)]).max(); song_rms = rms(song[int(47.654 * SR):int(51.8 * SR)])
    if MODE == 'glory':
        # Song ab Sekunde 0 (Song 38,57 s)
        m = intro_tail(song[int(OFF * SR):int((T(F_STRIKE) + OFF + 1.6) * SR)].copy()); put(late(m) if LATE else m, 0, 1.0, norm=False)
    # Maschinen: echter Ton jedes Herstellungs-Shots im Bild-Tempo, jeder Shot auf gleichen Pegel; in der Hook lauter (dort trägt die Maschine)
    mach = np.zeros_like(A)
    for path, a, b, o0, o1, fo in HOOK_MACH + [(*sg[:5], .015) for sg in SEGS[2:6]]:
        x = machine(path, a, b, o0, o1, fo); s = int(T(o0) * SR); x = x[:len(mach) - s]
        mach[s:s + len(x)] += x / rms(x) * .5
    gain = np.where(np.arange(len(A)) < int(T(F_IN) * SR), .5 if LATE else .45, .42 if MODE == 'ohne' else (.5 if LATE else .30))   # ohne Musik davor: Maschinen tragen
    A += mach * (song_rms / .5) * gain[:, None]
    put(seg(riser, 1.25, 2.25, .3, .01), T(F_IN) - 1.0, .40)                    # Sog in die Mitte, Spitze auf dem Einsatz
    put(seg(riser, 1.6, 2.25, .3, .01), T(F_DROP) - .65, .22)                   # leiser Sog in den Drop
    put(seg(fx3, .78, 1.6, .005, .35), T(F_DROP) - .22, .50)                    # Knall beim Drop-Blitz
    put(seg(fx2, 9.15, 9.95, .004, .35), T(F_DROP) - .40, .55 if MODE == 'ohne' else .30)   # tiefer Schlag beim Drop
    put(seg(fx3, .1, 2.9, .05, .6), T(F_STRIKE) - .9, .62)                      # Einschlag in den Punkt: Knistern, Knall, Donner
    put(seg(fx2, 9.15, 9.95, .004, .35), T(F_DOT) - .40, .40)                   # tiefer Bass unter dem Zap
else:
    # Alte Seedance-Musik: v13-Ton (Maschinen, Musik ab dem Cap, Riser, Zap, Whip, Woosh, Einschlag) ab dem Zuschnitt, wie in v17 geschnitten
    v13 = pcm(V13); parts = [v13[int(46 / FPS * SR):int(89 / FPS * SR)], v13[int(107 / FPS * SR):]]
    xf = int(.025 * SR); r = np.linspace(0, 1, xf, dtype=np.float32)[:, None]
    base = np.concatenate([parts[0][:-xf], parts[0][-xf:] * (1 - r) + parts[1][:xf] * r, parts[1][xf:]])
    s = int(T(F_CUT) * SR); base = base[:len(A) - s].copy(); base[:xf] *= r
    A[s:s + len(base)] += base
    ref = np.abs(A[int(T(F_DROP) * SR):int((T(F_DROP) + 1) * SR)]).max()
    mach_rms = rms(A[s:s + int(2.5 * SR)])
    # Hooks: echter Maschinenton, auf den Pegel des v13-Maschinentons gebracht, weicher Übergang in den Zuschnitt
    for path, a, b, o0, o1, fo in HOOK_MACH:
        x = machine(path, a, b, o0, o1, fo); put(x / rms(x) * mach_rms, T(o0), 1.0, norm=False)
    # Musik ab Sekunde 0: Groove der Seedance-Musik im Takt des Drops, leise und dumpf, beim Eintauchen lauter,
    # danach öffnet sich der Filter bis kurz vor den Drop, 0,3 s Pause, dann Drop
    DROP_T = T(F_DROP); groove = pcm(V9)[int(10.026 * SR):int((10.026 + 2 * HB) * SR)]; L = len(groove)
    start = DROP_T - 2 * HB * math.ceil(DROP_T / (2 * HB)); tease = np.zeros_like(A); s0 = int(start * SR)
    while s0 < int((DROP_T - .3) * SR):
        e0, e1 = max(0, s0), min(len(A), s0 + L)
        if e1 > e0: tease[e0:e1] += groove[e0 - s0:e1 - s0]
        s0 += L
    t_dive, t_in = T(F_IN - 9), T(F_IN); tt = np.arange(len(A)) / SR
    if LATE:   # v21: erst ab 0,5 s vor dem Kreis, voll da beim Laden des Blitzes, Filter öffnet sich weiter bis zum Drop
        t0, t1 = T(F_DOT - 12), T(F_LOGO)
        tease = sweep(tease, lambda t: 400 if t < t0 else (400 * (1500 / 400) ** min(1, (t - t0) / (t1 - t0)) if t < t1 else 1500 * (5000 / 1500) ** min(1, (t - t1) / (DROP_T - .3 - t1))))
        env = 10 ** (np.interp(tt, [t0, t1, DROP_T - .3], [-40, -10, -7]) / 20); env[tt < t0] = 0
    else:
        tease = sweep(tease, lambda t: 200 if t < t_dive else (200 + 140 * min(1, (t - t_dive) / (t_in - t_dive)) if t < t_in else 340 * (1100 / 340) ** min(1, (t - t_in) / (DROP_T - .3 - t_in)) ** 1.4))
        env = 10 ** (np.interp(tt, [0, .5, t_dive, t_in, T(F_LOGO), DROP_T - .3], [-40, -27, -24, -15, -12, -9]) / 20)
    env[tt >= DROP_T - .3] = 0; rmp = (tt > DROP_T - .38) & (tt < DROP_T - .3); env[rmp] *= np.linspace(1, 0, rmp.sum())
    A += tease * env[:, None] / (np.abs(groove).max() + 1e-9) * ref * .9
    put(seg(riser, 1.25, 2.25, .3, .01), T(F_IN) - 1.0, .35)                    # Sog in die Mitte
    put(seg(fx2, 9.15, 9.95, .004, .35), T(F_DOT) - .40, .45)                   # tiefer Bass unter dem Zap (wie v16)
    put(seg(fx3, .78, 1.6, .005, .35), T(F_DROP) - .22, .55)                    # Knall beim Drop-Blitz (wie v16)

# Effekte wie v16/v17 (alle Fassungen)
for num, word, f0, f1 in LABELS:
    for j, fn in enumerate(['tick-1', 'tick-2', 'tick-3']): put(pcm(P + fn + '.wav'), T(f0) + j * .08, .12)
put(pcm(P + 'swish-2.wav'), T(F_IN) - .14, .20)                                 # Whoosh beim Eintauchen
for c in CUTS: put(pcm(P + 'swish-2.wav'), T(c) - .14, .20)                     # Whooshes an den Herstellungs-Schnitten
put(seg(fx4, .0, 1.8, .003, .5), T(F_DOT) - .03, .62)                          # Zap-Drop am Punkt
put(seg(fx4, 2.6, 3.42, .15, .01), T(F_DROP) - .83, .40)                       # Funken-Knistern bis zum Drop, endet hart
put(seg(fx3, .78, 1.35, .005, .3), T(F_TEE) - .22, .32)                        # Knall beim T-Shirt-Blitz
if MODE != 'alt':                                                               # (in v13-Ton schon drin)
    put(seg(fx1, 2.45, 3.35, .05, .25), T(F_DROP) - .30, .22)                   # Woosh Logo -> Cap
    put(seg(fx2, 6.2, 6.9, .02, .15), T(F_TEE) - .15, .30)                      # Whip Cap -> T-Shirt
    put(seg(fx1, 5.8, 6.9, .25, .4), T(F_TEE) + .1, .22)                        # Stoff flattert im Wind
    put(seg(fx1, 12.0, 13.0, .1, .35), T(F_HERO) - .5, .24)                     # Woosh in den Hero
put(seg(fx2, 3.7, 4.95, .1, .35), T(F_MAKRO) - .15, .30)                       # kleiner Windstoß, wenn das Licht übers T-Shirt fährt

A = A / max(np.abs(A).max(), 1e-6) * .89
wav = OUT + '.wav'; lufs = -16 if MODE == 'ohne' else -14
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'f32le', '-ar', str(SR), '-ac', '2', '-i', '-', wav], input=A.astype(np.float32).tobytes(), check=True)
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', vid, '-i', wav, '-map', '0:v', '-map', '1:a', '-af', f'alimiter=limit=0.84:attack=3:release=80,loudnorm=I={lufs}:TP=-1.5:LRA=9',
                '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-ar', '48000', '-shortest', '-movflags', '+faststart', OUT], check=True)
for p in (vid, wav): pathlib.Path(p).unlink()
print('fertig:', OUT, F_END, 'Bilder =', round(DUR, 2), 's | Einsatz', F_IN, 'Schnitte', CUTS, 'Punkt', F_DOT, 'Drop', F_DROP, 'T-Shirt', F_TEE, 'Makro', F_MAKRO, 'Einschlag', F_STRIKE)
