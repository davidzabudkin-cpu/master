#!/usr/bin/env python3
"""Ton v2: Stimme + Musikflaeche (Pad, Sub, Puls) + Sounddesign (Whooshes, Riser, weiche Impacts, Ticks, gestimmte Taps). Alles geseedet.
Zeiten aus plan/cues.json (node tools/dump_cues.mjs) und plan/words.json. Aufruf: python tools/mix.py cache/audio/mix-vN.wav [stems]"""
import json, sys, pathlib
import numpy as np
from scipy.signal import butter, sosfilt, fftconvolve
from scipy.io import wavfile
from scipy.ndimage import uniform_filter1d
SR = 48000; ROOT = pathlib.Path(__file__).resolve().parents[1]
V = json.loads((ROOT / 'plan/words.json').read_text(encoding='utf-8')); Q = json.loads((ROOT / 'plan/cues.json').read_text())
DUR = Q['duration']; N = int(DUR * SR) + SR; rng = np.random.default_rng(23)
bus = lambda: np.zeros((2, N)); music, sfx, send = bus(), bus(), bus()
lp = lambda x, f, o=2: sosfilt(butter(o, f, fs=SR, btype='lowpass', output='sos'), x)
hp = lambda x, f, o=2: sosfilt(butter(o, f, fs=SR, btype='highpass', output='sos'), x)
bp = lambda x, lo, hi, o=2: sosfilt(butter(o, [lo, hi], fs=SR, btype='bandpass', output='sos'), x)
db = lambda d: 10 ** (d / 20); mtof = lambda m: 440 * 2 ** ((m - 69) / 12); T = lambda d: np.arange(int(d * SR)) / SR


def place(b, t, sig, gain=1.0, pan=0.0, rev=0.0):
    i = int(round(t * SR))
    if sig.ndim == 1: sig = np.vstack([sig * np.sqrt((1 - pan) / 2) * 1.414, sig * np.sqrt((1 + pan) / 2) * 1.414])
    if i < 0: sig = sig[:, -i:]; i = 0
    j = min(N, i + sig.shape[1])
    if j > i:
        b[:, i:j] += sig[:, :j - i] * gain
        if rev: send[:, i:j] += sig[:, :j - i] * gain * rev


def env(n, a, r):
    e = np.ones(n); na, nr = max(1, int(a * SR)), max(1, int(r * SR)); e[:na] = np.linspace(0, 1, na) ** 1.5; e[-nr:] *= np.linspace(1, 0, nr) ** 2; return e


# ---------- Musik: d-Moll (Problem) -> F-Dur (Loesung) ----------
CH = {'Dm9': [38, 50, 53, 57, 60, 64], 'Bb': [34, 46, 50, 53, 57, 62], 'F': [41, 53, 57, 60, 64, 67], 'C': [36, 48, 52, 55, 60, 62], 'Gm': [43, 55, 58, 62, 65, 69], 'Am': [45, 52, 57, 60, 64, 67]}


def pad(ch, t0, t1, g, bright=1800):
    n = int((t1 - t0 + 1.6) * SR); t = np.arange(n) / SR; out = np.zeros((2, n))
    for k, m in enumerate(CH[ch]):
        for d, p in [(-6, -.7), (6, .7)]:
            f = mtof(m) * 2 ** (d / 1200); ph = rng.random() * 6.28
            v = np.sin(2 * np.pi * f * t + ph) + (.35 if k else .15) * np.sin(4 * np.pi * f * t + ph * 2) + .12 * np.sin(6 * np.pi * f * t)
            v *= (1 + .2 * np.sin(2 * np.pi * (.15 + rng.random() * .2) * t + ph)) * (1.5 if k == 0 else 1)
            out[0] += v * (1 - p) * .5; out[1] += v * (1 + p) * .5
    out = np.vstack([lp(out[0], bright), lp(out[1], bright)]) / 12 * env(n, .7, 1.6)
    place(music, t0, out, g, rev=.35)


S = Q['scenes']  # 0 Start, 1 tedious, 2 hero, 3 title, 4 WH2, 5 software, 6 stat, 7 flow, 8 st1, 9 st3, 10 seal, 11 logo, 12 brand
SEQ = [('Dm9', S[0], .55, 1200), ('Bb', S[1], .5, 1000), ('F', S[2], .7, 2200), ('C', S[3], .7, 2200), ('Dm9', S[4], .65, 2000), ('Bb', S[5], .75, 2400), ('F', S[6], .85, 2600),
       ('Am', S[7], .65, 2000), ('Bb', S[8], .65, 2000), ('C', S[9], .7, 2200), ('Gm', S[10], .7, 2200), ('Bb', S[11], .75, 2400), ('F', S[12], .9, 2800)]
for k, (ch, a, g, br) in enumerate(SEQ): pad(ch, max(0, a - .25), SEQ[k + 1][1] - .25 if k + 1 < len(SEQ) else DUR, g, br)


def pluck(m, g=1.0):
    t = T(.7); f = mtof(m)
    x = np.sin(2 * np.pi * f * t) * np.exp(-t / .22) + .3 * np.sin(2 * np.pi * f * 2 * t) * np.exp(-t / .09) + .1 * np.sin(2 * np.pi * f * 3.01 * t) * np.exp(-t / .04)
    return lp(x, 3800) * env(len(t), .004, .2) * .3 * g


BPM = 104; step = 60 / BPM / 2
tt = S[2]; k = 0                                    # Puls erst ab der Loesung, pausiert in den Whips
while tt < S[12] - .3:
    ch = [c for c in SEQ if c[1] - .25 <= tt][-1][0]; notes = CH[ch][2:]; m = notes[[0, 2, 1, 3, 2, 1, 3, 2][k % 8] % len(notes)] + 12
    if not any(a - .1 < tt < b + .05 for a, b in Q['whips']): place(music, tt, pluck(m, .55 + .3 * (k % 4 == 0)), db(-7), pan=.5 * np.sin(k * 1.3), rev=.5)
    tt += step; k += 1


def sub(t0, t1, m, g):                               # tiefer Liegeton
    n = int((t1 - t0) * SR); t = np.arange(n) / SR
    place(music, t0, np.sin(2 * np.pi * mtof(m) * t) * (1 + .3 * np.sin(2 * np.pi * .25 * t)) * env(n, 1.0, 1.5), g)


sub(0, S[2] - .2, 26, .5); sub(S[4], S[6], 29, .35); sub(S[10], DUR - .2, 29, .35)


# ---------- SFX-Bausteine ----------
def tick(g=1.0, f=2600):
    t = T(.05); return (lp(bp(rng.standard_normal(len(t)), 900, 6000) * np.exp(-t / .005), 4500) * .6 + np.sin(2 * np.pi * f * t) * np.exp(-t / .012) * .25) * g


def sweep(x, fs, seg=960):                           # Rauschen mit wanderndem Bandpass
    out = np.zeros(len(x))
    for s in range(0, len(x), seg):
        f = fs[s]; out[s:s + seg] = bp(x[s:s + seg], f * .55, min(f * 1.6, 20000))
    return out


def whoosh(d=.6, lo=250, hi=2600, g=1.0, peak=.55, pan=(-.6, .6)):
    t = T(d); u = t / d; c = 1 - np.abs(u - peak) / max(peak, 1 - peak)
    e = np.where(u < peak, (u / peak) ** 2.2, ((1 - u) / (1 - peak)) ** 1.6)
    sig = lp(sweep(rng.standard_normal(len(t)), lo + (hi - lo) * c ** 1.5) * e, 6000) * g + np.sin(2 * np.pi * np.cumsum(70 + 60 * e) / SR) * e ** 2 * .35 * g
    p = pan[0] + (pan[1] - pan[0]) * u
    return np.vstack([sig * np.sqrt((1 - p) / 2) * 1.414, sig * np.sqrt((1 + p) / 2) * 1.414])


def riser(d=1.0, g=1.0):
    t = T(d); u = t / d; out = sweep(lp(hp(rng.standard_normal(len(t)), 500), 9000), 400 + 4200 * u ** 2, 1200)
    tone = np.sin(2 * np.pi * np.cumsum(220 * 2 ** u) / SR) * .12 + np.sin(2 * np.pi * np.cumsum(330 * 2 ** u) / SR) * .08
    return (out * .5 + tone) * u ** 2.6 * g


def impact(g=1.0, f0=44, body=.45):                  # weicher Impact: Sub-Boom + Filz-Anschlag + Luft
    t = T(1.4); boom = np.sin(2 * np.pi * np.cumsum(f0 + 55 * np.exp(-t / .045)) / SR) * np.exp(-t / body)
    click = lp(rng.standard_normal(len(t)) * np.exp(-t / .012), 1800) * .5; air = lp(hp(rng.standard_normal(len(t)), 1500), 6000) * np.exp(-t / .12) * .12
    return (boom + click + air) * env(len(t), .003, .3) * g


def thump(g=1.0):
    t = T(.45); return (np.sin(2 * np.pi * np.cumsum(50 + 70 * np.exp(-t / .04)) / SR) * np.exp(-t / .13) + lp(rng.standard_normal(len(t)) * np.exp(-t / .02), 900) * .6) * env(len(t), .003, .1) * g


PENTA = [65, 67, 69, 72, 74, 77, 79, 81, 84]


def tap(m, g=1.0):
    t = T(.6); f = mtof(m)
    x = np.sin(2 * np.pi * f * t) * np.exp(-t / .18) + .2 * np.sin(2 * np.pi * f * 3.98 * t) * np.exp(-t / .03) + .12 * np.sin(2 * np.pi * f * 2 * t) * np.exp(-t / .1)
    air = lp(hp(rng.standard_normal(len(t)), 2500), 7000) * np.exp(-t / .02) * .05
    return lp(x * env(len(t), .005, .15) + air, 5200) * .34 * g


def chord(ms, d=2.2, g=1.0, att=.02):
    t = T(d); out = np.zeros((2, len(t)))
    for k, m in enumerate(ms):
        v = (np.sin(2 * np.pi * mtof(m) * t) + .25 * np.sin(4 * np.pi * mtof(m) * t)) * np.clip(t / att, 0, 1) ** 1.5 * np.exp(-t / (d * .38)) / (1 + k * .25)
        p = -.6 + 1.2 * k / max(1, len(ms) - 1); out[0] += v * (1 - p) * .5; out[1] += v * (1 + p) * .5
    return np.vstack([lp(out[0], 4200), lp(out[1], 4200)]) * .2 * g


def shimmer(d=3.6):
    t = T(d); out = np.zeros((2, len(t)))
    for k, (m, a0) in enumerate([(77, 0), (81, .07), (84, .14), (89, .22), (93, .3), (96, .4)]):
        f = mtof(m) * (1 + .002 * np.sin(2 * np.pi * 5 * t)); e = np.clip((t - a0) / .4, 0, 1) ** 2 * np.exp(-np.clip(t - a0 - .4, 0, None) / 1.2)
        v = np.sin(2 * np.pi * np.cumsum(f) / SR) * e / (1 + k * .3); p = -.6 + k * .24; out[0] += v * (1 - p) * .5; out[1] += v * (1 + p) * .5
    return out * .26


def rattle(d, g=1.0):                                # Rolltor: getaktetes Rasseln, wird schneller
    t = T(d); u = t / d; ph = np.cumsum(9 + 16 * u ** 2) / SR; gate = uniform_filter1d((np.sin(2 * np.pi * ph) > .2).astype(float), 200)
    return (bp(rng.standard_normal(len(t)), 250, 2400) * gate * .5 + np.sin(2 * np.pi * 62 * t) * .25 * gate) * env(len(t), .1, .05) * (.4 + .6 * u) * g


def swell(d, g=1.0, f=2400):
    t = T(d); return lp(rng.standard_normal(len(t)), f) * (t / d) ** 3 * g * .5


# ---------- Cues ----------
for k, tk in enumerate(Q['ticks']): place(sfx, tk - .01, tick(1, 2300 + 60 * (k % 3)), db(-17), pan=-.5 + k / len(Q['ticks']), rev=.15)
place(sfx, Q['tedious'] - .03, thump(.7), db(-10), rev=.2)
place(sfx, Q['shutter'][0], rattle(Q['shutter'][1] - Q['shutter'][0] - .25), db(-17), rev=.2)
place(sfx, Q['shutter'][0] + (Q['shutter'][1] - Q['shutter'][0]) * .86 - .02, impact(1.0, 40, .5), db(-7), rev=.5)
PANS = [(-.7, .7), (0, 0), (-.7, .7), (-.7, .7)]
for (a, b), pn in zip(Q['whips'], PANS):
    place(sfx, a - .85, riser(1.0, 1.0), db(-17), rev=.3); place(sfx, a - .2, whoosh(b - a + .22, 220, 3200, 1.0, .52, pn), db(-9), rev=.2)
place(sfx, Q['heroIn'][0] + .3, impact(.8, 48, .4), db(-10), rev=.5)
place(sfx, Q['better'] - .03, chord([65, 72, 77, 81], 2.2, 1.0), db(-14), rev=.5)
place(sfx, Q['title'] - .05, tap(77, .9), db(-13), rev=.5); place(sfx, Q['title'] + .12, tap(84, .7), db(-15), rev=.5)
pa, pb = Q['push']
place(sfx, pa - .7, riser(.85, 1.0), db(-22), rev=.3); place(sfx, pa - .08, whoosh(pb - pa + .12, 120, 2200, 1.2, .5, (0, 0)), db(-7), rev=.2); place(sfx, pb - .1, impact(.8, 42, .5), db(-10), rev=.5)
for k, ts in enumerate(Q['samples']):
    place(sfx, ts - .01, tap(PENTA[k], 1.0), db(-11), pan=-.5 + k / 5, rev=.45); place(sfx, ts - .2, whoosh(.24, 500, 2400, .5, .7, (0, 0)), db(-22))
place(sfx, Q['software'], swell(Q['extra'] - Q['software'] + .1, .9), db(-16), rev=.3)
place(sfx, Q['extra'] + .05, chord([53, 60, 65, 69, 72, 77], 2.8, 1.0, .12), db(-12), rev=.6); place(sfx, Q['extra'] + .05, impact(.6, 46, .5), db(-13), rev=.4)
n0, n1 = Q['n99']
for k in range(14): place(sfx, n0 + (n1 - n0) * (1 - (1 - k / 14) ** 2), tick(.9, 1800 + 160 * k), db(-19), pan=.4 * np.sin(k), rev=.2)
place(sfx, n1 - .16, impact(1.1, 42, .6), db(-6), rev=.6); place(sfx, n1 - .14, chord([53, 65, 69, 72, 76], 2.6, 1.0), db(-12), rev=.6)
for k, ts in enumerate(Q['stations']):
    place(sfx, ts - .01, tap(PENTA[[1, 3, 4, 6][k]], 1.0), db(-11), pan=-.3 + k * .2, rev=.45); place(sfx, ts, thump(.35), db(-17))
for ts in Q['rolls']: place(sfx, ts - .05, whoosh(.5, 300, 1800, .6, .6, (-.4, .4)), db(-17), rev=.2)
place(sfx, Q['ready'] - .02, tap(84, .8), db(-14), rev=.5)
place(sfx, Q['seal'] - .1, impact(.9, 44, .5), db(-9), rev=.5)
place(sfx, Q['pwc'] - .03, thump(.8), db(-9), rev=.35); place(sfx, Q['pwc'] - .02, chord([58, 62, 65, 70, 74], 2.4, 1.0), db(-13), rev=.6)
la, lb = Q['logo']; place(sfx, la - .1, whoosh(lb - la + .2, 260, 2000, .7, .55, (.5, -.5)), db(-14), rev=.3)
place(sfx, Q['heroine2'] - .05, whoosh(.7, 400, 3000, .7, .45, (.8, .2)), db(-15), rev=.3)
place(sfx, Q['pill'] - .05, tap(81, .9), db(-12), rev=.5); place(sfx, Q['pill'] - .03, thump(.3), db(-18))
place(sfx, Q['brand'] - .55, swell(.6, .9, 3000), db(-18), rev=.3)
place(sfx, Q['brand'] + .45, shimmer(), db(-9), rev=.8); place(sfx, Q['brand'] - .02, impact(.9, 43.65, .9), db(-9), rev=.6)

# ---------- Stimme + Ducking + Hall ----------
sr_v, vo = wavfile.read(ROOT / V['vo_file']); vo = vo.astype(np.float64) / 32768; assert sr_v == SR
vo = hp(vo, 75) / (np.max(np.abs(vo)) + 1e-9) * db(-3)
voice = bus(); place(voice, V['offset'], vo)
lvl = uniform_filter1d(np.abs(voice[0]), int(.22 * SR)); duck = 1 - .5 * np.clip(lvl / (np.max(lvl) * .22), 0, 1); duck = uniform_filter1d(duck, int(.18 * SR))
irn = int(2.6 * SR); ti = np.arange(irn) / SR
ir = np.vstack([lp(rng.standard_normal(irn), 5200) * np.exp(-ti / .75) for _ in range(2)]) * .03
verb = np.vstack([fftconvolve(hp(send[c], 220), ir[c])[:N] for c in range(2)])
sfx_duck = 1 - .9 * (1 - duck)                      # SFX nur leicht unter die Stimme
MUS, SFX, VRB = music * db(-15) * duck, sfx * db(-1) * sfx_duck, verb * db(-11) * (.2 + .8 * duck)
mix = voice + MUS + SFX + VRB
n1 = int(DUR * SR); n0 = int((DUR - 1.3) * SR); mix = mix[:, :n1]; mix[:, n0:] *= np.linspace(1, 0, n1 - n0) ** 1.6
mix[:, :int(.25 * SR)] *= np.linspace(0, 1, int(.25 * SR))
mix *= db(-1) / np.max(np.abs(mix))
out = pathlib.Path(sys.argv[1]); out.parent.mkdir(parents=True, exist_ok=True)
wavfile.write(out, SR, np.rint(mix.T * 32767).astype(np.int16))
r = lambda b: 20 * np.log10(np.sqrt((b[:, :n1] ** 2).mean()) + 1e-9)
print(f'Wrote {out}: {DUR:.1f} s | RMS Stimme {r(voice):.1f} dB, Musik {r(MUS):.1f} dB, SFX {r(SFX):.1f} dB, Hall {r(VRB):.1f} dB')
# Verstaendlichkeit: Pegelabstand Stimme zu allem anderen, waehrend gesprochen wird (1-s-Fenster)
sb = lambda x: np.vstack([bp(x[c, :n1], 300, 4000) for c in range(2)])
rest = sb(MUS + SFX + VRB); vb = sb(voice); win = SR // 2; res = []
for a in range(0, n1 - win, win // 4):
    v = np.sqrt((vb[:, a:a + win] ** 2).mean())
    if v > .03 and np.sqrt((vb[:, a:a + win // 2] ** 2).mean()) > .03 and np.sqrt((vb[:, a + win // 2:a + win] ** 2).mean()) > .03: res.append((20 * np.log10(v / (np.sqrt((rest[:, a:a + win] ** 2).mean()) + 1e-9)), a / SR))
res.sort(); print('kleinste Abstaende Stimme zu Rest im Sprachband (0,5-s-Fenster, dB @ s):', ', '.join(f'{d:.1f} @ {t:.1f}' for d, t in res[:6]))
