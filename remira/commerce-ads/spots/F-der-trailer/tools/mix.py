#!/usr/bin/env python3
"""Ton Spot A „Das letzte Paar“ (26.11.2026): eigener Track, alles per Code, geseedet, keine Claps, keine Flächen.
123,8 BPM; Intro leise (Pluck-Arpeggio E-Moll + leise Hats) → Groove ab dem Kartonflug (Kick, Snare-Rimshot, Hats, Bass, E-Moll)
→ Break mit Riser vor dem Ring → Einsatz auf der Landung in G-Dur → Drums stoppen beim Logo, Akkord klingt aus.
Sounddesign leise: Scanner-Piep, Tipp, Handy-Ding, Storno-Ton, Ticks, Impuls-Whoosh.
Zeiten aus plan/cues.json (node tools/dump_cues.mjs). Aufruf: python tools/mix.py cache/audio/mix.wav"""
import json, sys, pathlib
import numpy as np
from scipy.signal import butter, sosfilt
from scipy.io import wavfile
SR = 48000; ROOT = pathlib.Path(__file__).resolve().parents[1]
Q = json.loads((ROOT / 'plan/cues.json').read_text()); T = Q['T']
DUR = Q['duration']; B = Q['beat']; D0 = Q['drop0']; N = int((DUR + .5) * SR); rng = np.random.default_rng(7)
music, drums, sfx = (np.zeros((2, N)) for _ in range(3))
lp = lambda x, f, o=2: sosfilt(butter(o, f, fs=SR, btype='lowpass', output='sos'), x)
hp = lambda x, f, o=2: sosfilt(butter(o, f, fs=SR, btype='highpass', output='sos'), x)
bp = lambda x, lo, hi, o=2: sosfilt(butter(o, [lo, hi], fs=SR, btype='bandpass', output='sos'), x)
db = lambda d: 10 ** (d / 20); mtof = lambda m: 440 * 2 ** ((m - 69) / 12); tt = lambda d: np.arange(int(d * SR)) / SR


def place(bus, t, sig, gain=1.0, pan=0.0):
    i = int(round(t * SR))
    if sig.ndim == 1: sig = np.vstack([sig * np.sqrt((1 - pan) / 2) * 1.414, sig * np.sqrt((1 + pan) / 2) * 1.414])
    j = min(N, i + sig.shape[1])
    if j > i >= 0: bus[:, i:j] += sig[:, :j - i] * gain


def adsr(n, a=.005, d=.2, s=0.0, r=.05):
    e = np.zeros(n); na, nd, nr = int(a * SR), int(d * SR), int(r * SR); na = max(1, min(na, n)); e[:na] = np.linspace(0, 1, na)
    k = min(n, na + nd); e[na:k] = np.linspace(1, s, k - na); e[k:] = s
    if nr: e[-nr:] *= np.linspace(1, 0, min(nr, n))
    return e


# ---------- Instrumente ----------
def kick(g=1.0):
    t = tt(.35); f = 48 + 110 * np.exp(-t * 28); ph = 2 * np.pi * np.cumsum(f) / SR
    return np.sin(ph) * np.exp(-t * 9) * g + .25 * lp(rng.standard_normal(len(t)), 3000) * np.exp(-t * 120) * g
def snare(g=1.0):   # Rimshot/Snare, kein Clap
    t = tt(.22); n = bp(rng.standard_normal(len(t)), 900, 6000) * np.exp(-t * 26); tone = np.sin(2 * np.pi * 330 * t) * np.exp(-t * 40)
    return (n * .7 + tone * .5) * g
def hat(g=1.0, open_=False):
    t = tt(.25 if open_ else .06); return hp(rng.standard_normal(len(t)), 7500) * np.exp(-t * (14 if open_ else 70)) * g
def pluck(m, d=.45, g=1.0, bright=4200):
    t = tt(d + .3); f = mtof(m)
    v = sum(np.sin(2 * np.pi * f * h * t) / h ** 1.3 for h in range(1, 6)) * np.exp(-t * 7)
    return lp(v, bright) * adsr(len(t), .003, d, 0, .05) * g
def bass(m, d, g=1.0):
    t = tt(d); f = mtof(m); v = np.sign(np.sin(2 * np.pi * f * t)) * .5 + np.sin(2 * np.pi * f * t)
    return lp(v, 420) * adsr(len(t), .004, d * .6, .55, .04) * g
def epiano(ms, d, g=1.0):
    t = tt(d); v = np.zeros(len(t))
    for m in ms: f = mtof(m); v += (np.sin(2 * np.pi * f * t) + .25 * np.sin(2 * np.pi * 2 * f * t) * np.exp(-t * 3)) * np.exp(-t * 1.1)
    return lp(v / len(ms), 3500) * adsr(len(t), .01, d, 0.0, .6) * g
def noise_sweep(d, f0, f1, g=1.0, rise=True):
    t = tt(d); n = rng.standard_normal(len(t)); out = np.zeros(len(t)); seg = 2048
    for k in range(0, len(t), seg):
        u = k / len(t); f = f0 * (f1 / f0) ** u; out[k:k + seg] = bp(n[k:k + seg], max(60, f * .7), min(18000, f * 1.4), 1)
    env = (t / d) ** 2 if rise else np.exp(-t * 6); return out * env * g
def tone(f, d, g=1.0, wave='sine'):
    t = tt(d); v = np.sin(2 * np.pi * f * t) if wave == 'sine' else np.tanh(3 * np.sin(2 * np.pi * f * t)) * .6
    return v * adsr(len(t), .003, d * .5, .4, .03) * g

# ---------- Harmonie ----------
EM = {'Em': [52, 55, 59, 64], 'C': [48, 55, 60, 64], 'Am': [45, 52, 57, 60], 'B': [47, 54, 59, 63]}
GM = {'G': [55, 59, 62, 67], 'D': [50, 57, 62, 66], 'Em': [52, 55, 59, 64], 'C': [48, 55, 60, 64]}
beat = lambda k: D0 + k * B   # Beat k im Raster (k=0: erster Kick 2,7 s)
b_break = round((T['dim'] - D0) / B)        # ≈ Beat 11: Drums stoppen
b_land = round((T['ring'][1] - D0) / B)     # Beat 13: Ring landet
b_logo = round((T['end'] - D0) / B)         # Beat 21: Logo

# Intro (vor Beat 0): leises Arpeggio in Achteln, gefiltert, leise Hats
k = -6
while beat(k) < D0:
    m = EM['Em'][[0, 2, 1, 3][k % 4]] + 12
    place(music, beat(k), pluck(m, .3, .22, 2200), pan=.25 if k % 2 else -.25); place(music, beat(k) + B / 2, pluck(m + 7 if m + 7 < 84 else m, .25, .14, 2000), pan=-.2)
    place(drums, beat(k) + B / 2, hat(.05)); k += 1
# Groove E-Moll: Beat 0 bis Break
prog_em = ['Em', 'Em', 'C', 'C', 'Am', 'Am', 'B', 'B']
for k in range(0, b_break):
    ch = EM[prog_em[(k // 2) % 8]]
    place(drums, beat(k), kick(.9))
    if k % 2: place(drums, beat(k), snare(.32))
    for h in (0, .5): place(drums, beat(k) + h * B, hat(.12 if h else .07), pan=.3)
    place(music, beat(k), bass(ch[0] - 12, B * .45, .35)); place(music, beat(k) + B / 2, bass(ch[0] - 12, B * .4, .28))
    place(music, beat(k) + B / 2, pluck(ch[1 + k % 3] + 12, .25, .2, 3000), pan=-.3 if k % 2 else .3)
# Break: Riser bis zur Landung, ein letzter tiefer Ton
place(sfx, beat(b_break), noise_sweep(beat(b_land) - beat(b_break), 300, 9000, .22))
place(music, beat(b_break), epiano([52, 59, 64], beat(b_land) - beat(b_break) + .2, .18))
# Landung: Impact (Kick + Sub + Becken-Rauschen), dann Groove G-Dur bis zum Logo
place(drums, beat(b_land), kick(1.2)); place(sfx, beat(b_land), noise_sweep(1.4, 9000, 2500, .22, rise=False))
place(music, beat(b_land), tone(49, 1.2, .35))
prog_g = ['G', 'G', 'D', 'D', 'Em', 'Em', 'C', 'C']
for k in range(b_land, b_logo):
    i = k - b_land; ch = GM[prog_g[(i // 2) % 8]]
    if i: place(drums, beat(k), kick(.95))
    if k % 2: place(drums, beat(k), snare(.34))
    for h in (0, .5): place(drums, beat(k) + h * B, hat(.14 if h else .08), pan=.3)
    if i % 4 == 3: place(drums, beat(k) + .75 * B, hat(.1))
    place(music, beat(k), bass(ch[0] - 12, B * .45, .36)); place(music, beat(k) + B / 2, bass(ch[0], B * .35, .22))
    for j, h in enumerate((0, .5)): place(music, beat(k) + h * B, pluck(ch[(i * 2 + j) % 4] + 12, .3, .24, 4500), pan=-.35 if j else .35)
    if i % 2 == 0: place(music, beat(k), epiano(ch, B * 2, .16))
# Logo: Drums stoppen, Schlussakkord G-Dur klingt aus
place(drums, beat(b_logo), kick(.8)); place(sfx, beat(b_logo), noise_sweep(1.0, 8000, 3000, .12, rise=False))
place(music, beat(b_logo), epiano([43, 55, 59, 62, 67], DUR - beat(b_logo) + .3, .42))
for j, m in enumerate([67, 71, 74, 79]): place(music, beat(b_logo) + j * B / 2, pluck(m, .5, .16, 5000), pan=(-1) ** j * .3)

# ---------- Sounddesign (leise) ----------
place(sfx, T['box'], tone(660, .08, .10)); place(sfx, T['tag'], tone(1320, .05, .07))
place(sfx, T['fly'][0], noise_sweep(T['fly'][1] - T['fly'][0], 500, 4000, .16))
place(sfx, T['sold1'], tone(1900, .09, .14, 'sq'))                                   # Scanner-Piep im Laden
place(sfx, T['tap'], hp(rng.standard_normal(int(.02 * SR)), 2000) * .12)             # Tipp
place(sfx, T['sold2'], tone(1568, .08, .12) + 0); place(sfx, T['sold2'] + .08, tone(2093, .12, .1))   # Handy-Ding
place(sfx, T['cancel'], tone(440, .12, .14, 'sq')); place(sfx, T['cancel'] + .14, tone(330, .2, .14, 'sq'))   # Storno
place(sfx, T['count'], tone(1200, .04, .07)); place(sfx, T['count'] + .1, tone(900, .04, .07))
for j in range(3): place(sfx, T['stars'][0] + j * .25, tone(880 * .84 ** j, .06, .07))
place(sfx, T['pulse'][0], noise_sweep(T['pulse'][1] - T['pulse'][0], 1500, 7000, .14))
place(sfx, T['sync'], tone(1760, .07, .1)); place(sfx, T['sync'] + .07, tone(2349, .12, .08))
place(sfx, T['chip'], tone(1400, .04, .06))

# ---------- Mischung ----------
mix = music * db(-1) + drums * db(-2) + sfx * db(-3)
# Intro (vor dem ersten Kick) etwas leiser als der Groove (≈ −22 LUFS), weich übergeben
gain = np.ones(N); i0, i1 = int((D0 - .6) * SR), int(D0 * SR); gain[:i0] = db(6); gain[i0:i1] = np.linspace(db(6), 1, i1 - i0)
f0 = int((DUR - .8) * SR); gain[f0:] *= np.linspace(1, 0, N - f0) ** 1.5   # Ausklang am Ende
mix *= gain; mix = mix[:, :int(DUR * SR)]
mix /= np.max(np.abs(mix)) * 1.12
out = pathlib.Path(sys.argv[1]); out.parent.mkdir(parents=True, exist_ok=True)
wavfile.write(out, SR, (mix.T * 32767).astype(np.int16)); print('geschrieben', out, f'{DUR:.1f} s')
