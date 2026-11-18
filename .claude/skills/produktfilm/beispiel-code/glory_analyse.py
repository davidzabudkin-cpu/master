"""GLORY-Analyse: Tempo, Beat-Phase, Abschnitte (Lautheit/Bass je Takt), Kick-Zeitpunkte.
Aufruf: python tools/glory_analyse.py glory/glory.mp3"""
import sys, subprocess
import numpy as np
from numpy.fft import rfft, rfftfreq
SR = 22050
a = np.frombuffer(subprocess.run(['ffmpeg', '-v', 'error', '-i', sys.argv[1], '-ac', '1', '-ar', str(SR), '-f', 'f32le', '-'],
                                 capture_output=True, check=True).stdout, np.float32)
n, hop = 1024, 128
fr = np.lib.stride_tricks.sliding_window_view(a, n)[::hop] * np.hanning(n)
S = np.abs(rfft(fr, axis=1)); F = rfftfreq(n, 1 / SR); t = np.arange(len(fr)) * hop / SR + n / 2 / SR
low = S[:, (F > 35) & (F < 120)].sum(1); hi = S[:, (F > 2000) & (F < 8000)].sum(1); mid = S[:, (F > 300) & (F < 2000)].sum(1)
flux = np.maximum(np.diff(np.log1p(S), axis=0, prepend=0), 0).sum(1)
x = flux - flux.mean(); ac = np.correlate(x, x, 'full')[len(x) - 1:]; lag = np.arange(len(ac)) * hop / SR
sel = (lag > .25) & (lag < .8); per = lag[sel][ac[sel].argmax()]
# feine Periode über langen Bereich: Peak nahe 16*per
L = 16 * per; s2 = (lag > L - .05) & (lag < L + .05); per = lag[s2][ac[s2].argmax()] / 16
print('Dauer %.2f s, Periode %.4f s = %.2f BPM' % (len(a) / SR, per, 60 / per))
# Phase: Kammfilter über flux
phs = np.linspace(0, per, 200, endpoint=False); sc = []
for p in phs:
    idx = ((np.arange(p, t[-1], per)) * SR / hop).astype(int); idx = idx[idx < len(flux)]; sc.append(flux[idx].mean())
p0 = phs[int(np.argmax(sc))]; print('Beat-Phase %.3f s (erster Schlag-Gitterpunkt)' % p0)
lowon = np.maximum(np.diff(np.log1p(low), prepend=0), 0)
print('\nTakt (4 Schläge) | Start | dB | Bass | Höhen | Bass-Onset')
bar = 4 * per; k = 0
st = p0
while st < len(a) / SR:
    m = (t >= st) & (t < st + bar); seg = a[int(st * SR):int((st + bar) * SR)]
    if m.any() and len(seg):
        db = 20 * np.log10(np.sqrt(np.mean(seg ** 2)) + 1e-9)
        print('%3d | %6.2f | %6.1f | %6.1f | %6.1f | %5.2f' % (k, st, db, 20*np.log10(low[m].mean()+1e-9), 20*np.log10(hi[m].mean()+1e-9), lowon[m].max()))
    st += bar; k += 1
