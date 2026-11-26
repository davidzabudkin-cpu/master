#!/usr/bin/env python3
"""Ton der Commerce-Plattform-Animation v2 (26.11.2026): dieselbe Musik wie die Plattform-Animation (Wunsch David), angepasst an 6 Module und den Loop (v3: Fahrt ins Zentrum am Ende, endet leise wie der Anfang). Original: Musikflaeche (Pad, Sub, Puls) + Sounddesign (Whooshes, Riser, weiche Impacts, gestimmte Taps). Alles per Code, geseedet.
Zeiten aus plan/cues.json (node tools/dump_cues.mjs). Aufruf: python tools/mix.py cache/audio/mix.wav"""
import json, sys, pathlib
import numpy as np
from scipy.signal import butter, sosfilt, fftconvolve
from scipy.io import wavfile
from scipy.ndimage import uniform_filter1d
SR = 48000; ROOT = pathlib.Path(__file__).resolve().parents[1]
Q = json.loads((ROOT / 'plan/cues.json').read_text())
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


# ---------- Musik: d-Moll (Dunkel, Problem) -> F-Dur (Plattform, Loesung) ----------
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



def pluck(m, g=1.0):
    t = T(.7); f = mtof(m)
    x = np.sin(2 * np.pi * f * t) * np.exp(-t / .22) + .3 * np.sin(2 * np.pi * f * 2 * t) * np.exp(-t / .09) + .1 * np.sin(2 * np.pi * f * 3.01 * t) * np.exp(-t / .04)
    return lp(x, 3800) * env(len(t), .004, .2) * .3 * g



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



M = Q['mods']; STEP = (M[1] - M[0]) / 2          # Achtel = halber Modul-Abstand, der Puls sitzt auf den Modulen
SEQ = [('Dm9', 0, .55, 1200), ('Bb', Q['disc'][0], .6, 1700), ('F', M[0], .65, 2000), ('C', M[2], .65, 2000), ('Dm9', M[4], .65, 2000), ('Bb', M[5], .7, 2200),
       ('F', Q['ring'][1], .85, 2600), ('Gm', Q['ch'][0], .65, 1800), ('Am', Q['ch'][2], .65, 1800), ('C', Q['flow'], .7, 2200), ('Bb', Q['hit'], .8, 2500), ('F', Q['be'][1], .9, 2800)]
for k, (ch, a, g, br) in enumerate(SEQ): pad(ch, max(0, a - .25), SEQ[k + 1][1] - .25 if k + 1 < len(SEQ) else DUR, g, br)
tt = M[0]; k = 0
while tt < Q['settle'] - .2:
    ch = [c for c in SEQ if c[1] - .25 <= tt][-1][0]; notes = CH[ch][2:]; m = notes[[0, 2, 1, 3, 2, 1, 3, 2][k % 8] % len(notes)] + 12
    place(music, tt, pluck(m, .5 + .3 * (k % 2 == 0)), db(-8), pan=.5 * np.sin(k * 1.3), rev=.5)
    tt += STEP; k += 1


def sub(t0, t1, m, g):
    n = int((t1 - t0) * SR); t = np.arange(n) / SR
    place(music, t0, np.sin(2 * np.pi * mtof(m) * t) * (1 + .3 * np.sin(2 * np.pi * .25 * t)) * env(n, 1.0, 1.5), g)


sub(0, Q['disc'][0] + .5, 26, .5); sub(Q['ch'][0], Q['hit'], 31, .35); sub(Q['hit'], Q['push'][0] + 1.5, 29, .35)

# ---------- Cues ----------
for k, tp in enumerate(Q['petals']): place(sfx, tp + .1, tap(PENTA[k], .8), db(-14), pan=-.4 + k * .16, rev=.6); place(sfx, tp - .05, whoosh(.3, 500, 2400, .5, .7, (0, 0)), db(-24))
place(sfx, Q['hex'] - .7, riser(.8, 1.0), db(-22), rev=.3)
place(sfx, Q['hex'] + .03, impact(1.0, 43.65, .7), db(-7), rev=.6); place(sfx, Q['hex'] + .05, chord([53, 60, 65, 69, 72], 2.6, 1.0), db(-13), rev=.6)
for k, ta in enumerate(Q['ai']): place(sfx, ta - .01, tap(89 + 4 * k, .8), db(-13), rev=.6); place(sfx, ta - .01, tick(.8, 3200), db(-22))
d0, d1 = Q['disc']; place(sfx, d0 - .1, whoosh(1.2, 220, 2400, 1.0, .45, (-.6, .6)), db(-11), rev=.3)
for k, ti in enumerate(Q['inner']): place(sfx, ti + .05, tap([72, 74, 77, 79][k], .8), db(-15), pan=[-.4, .4, .4, -.4][k], rev=.5)
place(sfx, M[0] - .75, whoosh(.9, 160, 1800, .9, .55, (0, 0)), db(-14), rev=.25)
for k, tm in enumerate(M):
    a = float(np.sin(np.radians(k * 60)))
    place(sfx, tm - .01, tap(PENTA[k + 1], 1.0), db(-10), pan=.6 * a, rev=.45); place(sfx, tm - .2, whoosh(.3, 500, 2600, .5, .7, (0, .5 * a)), db(-21)); place(sfx, tm, thump(.3), db(-19))
r0, r1 = Q['ring']
place(sfx, r0 - .1, riser(r1 - r0 + .1, 1.0), db(-15), rev=.3); place(sfx, r0, whoosh(r1 - r0 + .15, 160, 2800, 1.1, .8, (0, 0)), db(-12), rev=.25)
place(sfx, r1 - .05, impact(1.1, 43.65, .7), db(-6), rev=.6); place(sfx, r1 - .03, chord([53, 65, 69, 72, 77], 2.8, 1.0), db(-11), rev=.6)
for a, b in (Q['omni'], Q['scm']):
    for k in range(9): place(sfx, a + (b - a) * k / 9, tick(.7, 2200 + 70 * (k % 4)), db(-23), pan=-.3 + .6 * k / 9, rev=.15)
p0, p1 = Q['panel']
place(sfx, p0 - .15, whoosh(p1 - p0 + .3, 120, 2200, 1.2, .5, (0, 0)), db(-9), rev=.25); place(sfx, p1 - .12, impact(.7, 46, .5), db(-12), rev=.5)
for k, tc in enumerate(Q['ch']):
    place(sfx, tc - .12, whoosh(.5, 300, 2200, .7, .6, (-.9, -.3)), db(-15), rev=.2); place(sfx, tc + .42, thump(.55), db(-13), pan=-.5, rev=.25); place(sfx, tc + .42, tap([62, 60, 58, 57][k], .9), db(-14), pan=-.5, rev=.5)
place(sfx, Q['flow'], riser(Q['hit'] - Q['flow'], 1.0), db(-15), rev=.3)
for k in range(10): place(sfx, Q['flow'] + .45 + (Q['hit'] - Q['flow'] - .45) * (1 - (1 - k / 10) ** 1.6), tick(.8, 1900 + 140 * k), db(-21), pan=-.7 + .07 * k, rev=.2)
place(sfx, Q['hit'] - .03, impact(1.2, 43.65, .8), db(-5), rev=.6); place(sfx, Q['hit'] - .02, chord([46, 58, 62, 65, 70, 74], 2.6, 1.0), db(-11), rev=.6)
s0, s1 = Q['spin']; place(sfx, s0, whoosh(s1 - s0, 240, 3000, .9, .5, (-.5, .5)), db(-13), rev=.3)
for k, tb in enumerate(Q['be']):
    place(sfx, tb - .5, whoosh(.55, 400, 3000, .7, .75, (.2, .9)), db(-16), rev=.2); place(sfx, tb + .02, tap([65, 69, 72, 77][k], 1.0), db(-10), pan=.5, rev=.5); place(sfx, tb + .02, thump(.3), db(-18), pan=.4)
place(sfx, Q['settle'] - .65, swell(.6, .9, 3000), db(-19), rev=.3)
place(sfx, Q['settle'] - .1, shimmer(), db(-10), rev=.8); place(sfx, Q['settle'] - .12, impact(.8, 43.65, .9), db(-10), rev=.6); place(sfx, Q['settle'] - .1, chord([41, 53, 60, 65, 69, 72], 3.2, 1.0, .05), db(-11), rev=.6)

# Loop-Ende (v3): Kamerafahrt ins Zentrum = weicher Sog (Whoosh, leiser Riser), Ringblätter drehen sich heraus = umgekehrter Shimmer, dann Stille wie am Anfang
p0, p1 = Q['push']; place(sfx, p0, whoosh(p1 - p0, 150, 2400, .8, .75, (.4, 0)), db(-17), rev=.4); place(sfx, p0 + .8, riser(p1 - p0 - .8, .6), db(-24), rev=.4)
place(sfx, Q['oPetal'][0] - 1.4, shimmer(2.0)[:, ::-1].copy(), db(-16), rev=.6)

# ---------- Hall + Mischung ----------
irn = int(2.6 * SR); ti = np.arange(irn) / SR
ir = np.vstack([lp(rng.standard_normal(irn), 5200) * np.exp(-ti / .75) for _ in range(2)]) * .03
verb = np.vstack([fftconvolve(hp(send[c], 220), ir[c])[:N] for c in range(2)])
MUS, SFX, VRB = music * db(-9), sfx * db(-3), verb * db(-11)
mix = MUS + SFX + VRB
# Intro leise und weich: bis kurz vor dem Ringschluss 3,5 dB zurueck, dann sanft hochfahren (kein Sprung)
tg = np.arange(N) / SR; mix *= db(-3.5 * (1 - np.clip((tg - (Q['ring'][0] - 1.0)) / 2.2, 0, 1) ** 2 * (3 - 2 * np.clip((tg - (Q['ring'][0] - 1.0)) / 2.2, 0, 1))))
n1 = int(DUR * SR); n0 = int((Q['push'][0] + .5) * SR);   # Loop: während der Fahrt ins Zentrum weich ausblenden, endet so leise wie der Anfang
mix = mix[:, :n1]; mix[:, n0:] *= np.linspace(1, 0, n1 - n0) ** 1.6
mix[:, :int(.25 * SR)] *= np.linspace(0, 1, int(.25 * SR))
pk = np.max(np.abs(mix)); mix *= db(-3) / pk
out = pathlib.Path(sys.argv[1]); out.parent.mkdir(parents=True, exist_ok=True)
wavfile.write(out, SR, np.rint(mix.T * 32767).astype(np.int16))
r = lambda b: 20 * np.log10(np.sqrt((b[:, :n1] ** 2).mean()) + 1e-9)
print(f'Wrote {out}: {DUR:.1f} s | Peak vor Normierung {20 * np.log10(pk):.1f} dB | RMS Musik {r(MUS):.1f} dB, SFX {r(SFX):.1f} dB, Hall {r(VRB):.1f} dB')
