#!/usr/bin/env python3
"""Ton des Warenwirtschaft-Erklärvideos (Basis OMS-Mix, ohne Claps). Ursprünglich: Ton des OMS-Erklärvideos (Runde 5: rhythmische Corporate-Musik 116 BPM statt Flächen; Runde 6: Intro bis 0:13 weicher, ohne Claps — Einbau per tools/splice_intro.py vor den Ton von v5): Musikflaeche (Pad, Sub, Puls) + Sounddesign (Whooshes, Riser, weiche Impacts, gestimmte Taps). Alles per Code, geseedet.
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
CH = {'Dm': [38, 50, 53, 57, 62, 65], 'FC': [41, 53, 57, 60, 64, 69], 'Dm9': [38, 50, 53, 57, 60, 64], 'Bb': [34, 46, 50, 53, 57, 62], 'F': [41, 53, 57, 60, 64, 67], 'C': [36, 48, 52, 55, 60, 62], 'Gm': [43, 55, 58, 62, 65, 69], 'Am': [45, 52, 57, 60, 64, 67]}


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




# ---------- Musik (Runde 5): modern, rhythmisch, 116 BPM – Drums, Bass, kurze Plucks, keine Flächen ----------
# Aufbau: Intro leise (Hats + Pluck, ab 4,5 s Kick) → Schritte (voller Beat) → Problem (Moll, halbes Tempo-Gefühl, dumpf)
# → Wendepunkt (Snare-Roll) → Drop auf den Hub → Lösung (16tel-Hats, zweites Motiv ab „Möglichkeiten“) → Logo: Drums stoppen, Ausklang.
W_ = Q['whips']; M_ = Q.get('musik', W_); BPM = 116; BEAT = 60 / BPM; S16 = BEAT / 4
HUB, LOGO = Q['hubHit'], Q['logo']


def sec(t):
    if t < M_[0][0]: return 'intro'
    if t < M_[1][0]: return 'steps'
    if t < M_[2][0]: return 'problem'
    if t < HUB: return 'turn'
    if t < M_[3][0]: return 'how'
    if t < LOGO: return 'full'
    return 'end'


def kick(g=1.0):
    t = T(.38); f = 48 + 110 * np.exp(-t / .035)
    return (np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / .16) + lp(rng.standard_normal(len(t)) * np.exp(-t / .004), 3000) * .25) * g


def clap(g=1.0):
    t = T(.3); e = sum(np.exp(-np.clip(t - d, 0, None) / (.006 if d < .02 else .09)) * (t >= d) for d in (0, .011, .022))
    return bp(rng.standard_normal(len(t)), 900, 3200) * e * .55 * g


def hat(g=1.0, d=.028):
    t = T(d * 4); return hp(rng.standard_normal(len(t)), 7500) * np.exp(-t / d) * .32 * g


def snare(g=1.0):
    t = T(.2); return (bp(rng.standard_normal(len(t)), 1200, 6000) * np.exp(-t / .07) * .5 + np.sin(2 * np.pi * 190 * t) * np.exp(-t / .04) * .4) * g


def crash(g=1.0):
    t = T(1.4); return lp(hp(rng.standard_normal(len(t)), 3500), 9000) * np.exp(-t / .45) * .22 * g


def bass(m, d, g=1.0):
    t = T(d); f = mtof(m); x = sum(np.sin(2 * np.pi * f * k * t) / k for k in range(1, 7))
    return lp(x, 420) * env(len(t), .004, min(.06, d * .4)) * .5 * g


def pl(m, g=1.0, dec=.12, bright=3200):
    t = T(.35); f = mtof(m); x = sum(np.sin(2 * np.pi * f * k * t) / k for k in (1, 3, 5, 7))
    return lp(x * np.exp(-t / dec), bright) * env(len(t), .002, .05) * .3 * g


PROG = {'maj': [('F', 41), ('C', 36), ('Dm', 38), ('Bb', 34)], 'min': [('Dm', 38), ('Bb', 34), ('Gm', 43), ('A', 45)]}
CH['A'] = [45, 52, 57, 61, 64, 69]
MOTIF = [0, 2, 1, 2, 3, 2, 1, None, 0, 2, 3, 4, 3, 2, None, 1]          # 16tel-Motiv, Index in Akkordtöne
MOTIF2 = [None, None, 4, None, None, 3, None, 2, None, None, 4, None, 5, None, 3, None]
n16 = int(DUR / S16)
for i in range(n16):
    t = i * S16; s = sec(t); beat = i // 4; step = i % 16; bar = i // 16
    if t > LOGO + .05: break
    mode = 'min' if s == 'problem' else 'maj'
    name, root = PROG[mode][(bar // 2) % 4]; tones = CH[name][1:]
    dark = s == 'problem'
    ramp = min(1.0, max(0.0, (t - M_[0][1]) / (13.0 - M_[0][1])))   # Runde 6: weicher Einstieg bis 0:13, danach unverändert
    # Kick
    if (s in ('steps', 'how', 'full') and i % 4 == 0) or (s == 'intro' and t >= 4.5 and i % 8 == 0) or (dark and i % 8 == 0):
        place(music, t, kick(.45 if s == 'intro' else .7 + .3 * ramp), 1.0)
    # Clap auf 2 und 4
    # Keine Claps (OMS-Feedback 16.11.: Claps störend) – Groove nur aus Kick, Hats, Bass, Plucks
    # Hats
    if s == 'intro' and i % 2 == 0 and t > 1.0: place(music, t, hat(.45 + .25 * (i % 4 == 2)), db(-10), pan=.3)
    if s == 'steps' and i % 2 == 0: place(music, t, hat((.6 + .35 * (i % 4 == 2)) * (.55 + .45 * ramp)), db(-4), pan=.3)
    if s in ('how', 'full'): place(music, t, hat((.35 + .5 * (i % 4 == 2)) * (1.0 if s == 'full' else .85), .022 if i % 4 else .03), db(-4), pan=.3)
    if dark and i % 4 == 2: place(music, t, hat(.4, .05), db(-9), pan=-.3)
    # Bass: Achtel-Offbeats (pumpt gegen die Kick), im Problem längere Töne
    if s in ('steps', 'how', 'full') and i % 2 == 0 and i % 4 != 0: place(music, t, bass(root - 12 + (12 if step in (6, 14) else 0), S16 * 1.8), db(-2))
    if s in ('steps', 'how', 'full') and i % 4 == 0 and step in (0, 8): place(music, t, bass(root - 12, S16 * 1.6, .8), db(-3))
    if dark and i % 8 == 0: place(music, t, lp(bass(root - 12, BEAT * 1.6), 300), db(-1))
    # Pluck-Motive
    if s in ('intro', 'steps', 'how', 'full') and MOTIF[step] is not None and not (s == 'intro' and t < 1.2):
        m = tones[MOTIF[step] % len(tones)] + 12
        gp = {'intro': .55, 'steps': .75, 'how': .85, 'full': .9}[s]
        place(music, t, pl(m, gp), db(-7), pan=.35 * np.sin(i * .9), rev=.12)
    if s == 'full' and MOTIF2[step] is not None:
        place(music, t, pl(tones[MOTIF2[step] % len(tones)] + 24, .5, .08, 4200), db(-11), pan=-.4, rev=.12)
    if dark and step in (0, 6, 10) and bar % 2 == 0:
        place(music, t, pl(tones[[0, 2, 1][[0, 6, 10].index(step)]] + 12, .55, .2, 1600), db(-9), rev=.15)

# Wendepunkt: Snare-Roll, der sich zum Drop auf den Hub steigert
t0 = M_[2][0]; k = 0
while t0 + k * S16 < HUB - .02:
    tt = t0 + k * S16; u = (tt - M_[2][0]) / (HUB - M_[2][0])
    if k % (2 if u < .6 else 1) == 0: place(music, tt, snare(.3 + .7 * u ** 1.5), db(-6), rev=.1)
    k += 1
place(music, HUB, kick(1.1), 1.0); place(music, HUB, crash(1.0), db(-4))
# Akzente auf allen anderen Übergängen: kurzer Snare-Fill vor dem Ende der Fahrt, Crash bei Ankunft
for a, b in W_:
    if a == M_[2][0]: continue
    for j in range(4): place(music, b - (4 - j) * S16, snare(.35 + .15 * j), db(-8), rev=.1)
    place(music, b, crash(.8), db(-7))
# Logo: Drums stoppen, letzter Akkord als Pluck-Arpeggio + Bassnote klingt aus
place(music, LOGO, crash(.9), db(-6)); place(music, LOGO, bass(29, 2.6, 1.0), db(-1))
for j, m in enumerate([65, 69, 72, 77, 81]): place(music, LOGO + j * S16, pl(m, .6, .5, 3600), db(-7), rev=.25)
for j, m in enumerate([69, 72, 77]): place(music, LOGO + 2.0 + j * S16 * 2, pl(m, .35, .6, 3000), db(-10), rev=.3)



def paper(g=1.0):                                    # Papier-Swish: kurzes, hohes Rauschen
    t = T(.35); u = t / .35; return bp(rng.standard_normal(len(t)), 2500, 9000) * np.sin(np.pi * u) ** 2 * .5 * g


def chime(ms, g=1.0): return chord(ms, 1.6, g, .005)

# ---------- Cues ----------
for k, tp in enumerate(Q['petals']): place(sfx, tp + .1, tap(PENTA[k], .7), db(-15), pan=-.4 + k * .16, rev=.6)
place(sfx, .05, swell(1.2, .8, 2600), db(-22), rev=.4); place(sfx, 1.25, chord([53, 60, 65, 69, 72], 2.6, .9), db(-15), rev=.6)
for k, ts in enumerate(Q['st1']): place(sfx, ts, tick(.6, 2400 + 150 * k), db(-24))
for k, tv in enumerate(Q['v1']): place(sfx, tv - .01, tap([65, 69, 72, 77][k], .9), db(-12), pan=-.5 + k * .33, rev=.5); place(sfx, tv, thump(.3), db(-20))
for a, b in W_:
    d = b - a + .25; place(sfx, a - .08, whoosh(d, 200, 2800, 1.0, .5, (-.6, .6)), db(-10), rev=.25); place(sfx, b - .05, thump(.5), db(-17), rev=.3)
for k, ts in enumerate(Q['st2']): place(sfx, ts, tick(.6, 2300 + 120 * k), db(-24))
for k, tv in enumerate(Q['v2']): place(sfx, tv - .01, tap([65, 67, 69, 72, 74][k], .9), db(-12), pan=-.6 + k * .3, rev=.5); place(sfx, tv, thump(.3), db(-20))
# Problem
for t0 in Q['pch'] + Q['psc']: place(sfx, t0, thump(.5), db(-17), rev=.2); place(sfx, t0 + .02, tap(57, .5), db(-20), rev=.3)
for k, tf in enumerate(Q['flights']): place(sfx, tf + .05, paper(1.0), db(-17), pan=-.5, rev=.15); place(sfx, tf + .93, tick(.7, 1500), db(-20), pan=.6)
tt = Q['tick0']; k = 0
while tt < M_[2][0] - .1: place(sfx, tt, tick(.55, [2000, 1700][k % 2]), db(-23)); tt += .5; k += 1
place(sfx, Q['mism'], chord([50, 51], 1.2, .6), db(-22))
for k, tk in enumerate(Q['kw']): place(sfx, tk, thump(.6), db(-15)); place(sfx, tk + .01, tap([57, 56, 53][k], .8), db(-16), rev=.4)
# Wendepunkt: Heldin, Ring wird bunt, Hub
h0, h1 = Q['hero']; place(sfx, h0 - .9, riser(1.2, 1.0), db(-17), rev=.3); place(sfx, h0, whoosh(h1 - h0 + .2, 150, 3200, 1.2, .45, (-.9, .9)), db(-8), rev=.3)
place(sfx, Q['recolor'][0], shimmer(2.8), db(-13), rev=.7)
place(sfx, Q['hubHit'] - .03, impact(1.0, 43.65, .7), db(-8), rev=.6); place(sfx, Q['hubHit'] - .02, chord([53, 60, 65, 69, 72, 77], 2.8, 1.0), db(-12), rev=.6)
for k, th in enumerate(Q['hch']): place(sfx, th, tap(PENTA[k + 1], .7), db(-17), pan=-.6, rev=.4)
for ts in Q['stream']: place(sfx, ts + .88, tick(.5, 2600), db(-28), pan=-.1)
place(sfx, Q['card'] - .1, whoosh(.5, 400, 2600, .6, .6, (0, 0)), db(-19)); place(sfx, Q['avail'], chime([77, 81, 84]), db(-13), rev=.6)
for k, th in enumerate(Q['hd']): place(sfx, th, tap(PENTA[k + 4], .7), db(-17), pan=.6, rev=.4)
for k, td in enumerate(Q['disp']): place(sfx, td + .78, tap([72, 76, 79][k % 3], .6), db(-20), pan=.6, rev=.4)
# Möglichkeiten, Vorteile
for k, tc in enumerate(Q['cards']): place(sfx, tc, thump(.5), db(-16), pan=[-.5, .5, -.5, .5][k]); place(sfx, tc + .02, tap([69, 72, 74, 77][k], 1.0), db(-12), pan=[-.5, .5, -.5, .5][k], rev=.5)
place(sfx, Q['text']['foot5'], chord([53, 60, 65, 69, 72], 2.2, .8), db(-17), rev=.6)
for k, tc in enumerate(Q['check']): place(sfx, tc + .12, tap([72, 74, 77, 81][k], 1.0), db(-12), pan=-.5, rev=.5); place(sfx, tc + .1, tick(.6, 3000), db(-22), pan=-.5)
for k, tb in enumerate(Q['bar']): place(sfx, tb, swell(.6, .6, 2000 + 600 * k), db(-24), pan=.5)
# Ende
place(sfx, Q['wipe'][0] - .05, whoosh(.9, 300, 3000, .7, .5, (-.4, .6)), db(-17), rev=.3)
place(sfx, Q['logo'] - .03, impact(.9, 43.65, .9), db(-9), rev=.6); place(sfx, Q['logo'] - .02, chord([41, 53, 60, 65, 69, 72], 3.6, 1.0, .03), db(-12), rev=.6); place(sfx, Q['logo'], shimmer(), db(-12), rev=.8)
for k, k2 in enumerate(['end1', 'end2', 'end3']): place(sfx, Q['text'][k2], tap([72, 77, 81][k], .7), db(-18), rev=.6)

# ---------- Hall + Mischung ----------
irn = int(2.6 * SR); ti = np.arange(irn) / SR
ir = np.vstack([lp(rng.standard_normal(irn), 5200) * np.exp(-ti / .75) for _ in range(2)]) * .03
verb = np.vstack([fftconvolve(hp(send[c], 220), ir[c])[:N] for c in range(2)])
# Dramaturgie der Musik: Intro leiser, Steigerung zur Lösung, ruhiges Ende (Abschnitts-Pegel mit weichen Rampen)
_pts = [(0, 6), (M_[0][0], 6), (M_[0][1], -4.5), (13.0, -3), (M_[1][0], -3), (M_[1][1], -3), (M_[2][0], -3), (HUB, 0), (M_[3][0], 0), (M_[3][1], .5), (LOGO, .5), (DUR, 0)]
_tt = np.arange(N) / SR; _env = db(np.interp(_tt, [a for a, _ in _pts], [b for _, b in _pts])); music *= _env
mrms = np.sqrt((music[:, :int(DUR * SR)] ** 2).mean()) + 1e-9   # Musik auf denselben Pegel wie bisher (RMS −25,5 dB), SFX-Verhältnis bleibt
MUS, SFX, VRB = music * (db(-25.5) / mrms), sfx * db(-5.5), verb * db(-11)
mix = MUS + SFX + VRB
n1 = int(DUR * SR); n0 = int((DUR - 3.0) * SR); mix = mix[:, :n1]; mix[:, n0:] *= np.linspace(1, 0, n1 - n0) ** 1.6
mix[:, :int(.3 * SR)] *= np.linspace(0, 1, int(.3 * SR))
pk = np.max(np.abs(mix)); mix *= db(-3) / pk
out = pathlib.Path(sys.argv[1]); out.parent.mkdir(parents=True, exist_ok=True)
wavfile.write(out, SR, np.rint(mix.T * 32767).astype(np.int16))
r = lambda b: 20 * np.log10(np.sqrt((b[:, :n1] ** 2).mean()) + 1e-9)
print(f'Wrote {out}: {DUR:.1f} s | Peak vor Normierung {20 * np.log10(pk):.1f} dB | RMS Musik {r(MUS):.1f} dB, SFX {r(SFX):.1f} dB, Hall {r(VRB):.1f} dB')
