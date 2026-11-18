"""Analysiert eine Musikspur: Dauer, Lautheit über die Zeit, Tempo, Kick-Zeitpunkte, Sprach-Verdacht.
Aufruf: python tools/beat_analyse.py ton/beat-A.wav"""
import sys, subprocess
import numpy as np
from numpy.fft import rfft, rfftfreq
SR = 22050
a = np.frombuffer(subprocess.run(['ffmpeg', '-v', 'error', '-i', sys.argv[1], '-ac', '1', '-ar', str(SR), '-f', 'f32le', '-'],
                                 capture_output=True, check=True).stdout, np.float32)
print('Datei', sys.argv[1], 'Dauer %.2f s' % (len(a) / SR))
n, hop = 1024, 256
fr = np.array([a[i:i + n] * np.hanning(n) for i in range(0, len(a) - n, hop)])
S = np.abs(rfft(fr, axis=1)); F = rfftfreq(n, 1 / SR); t = np.arange(len(fr)) * hop / SR
low = S[:, (F > 35) & (F < 150)].sum(1); mid = S[:, (F > 300) & (F < 3000)].sum(1)
on = np.maximum(np.diff(np.log1p(low * 5), prepend=0), 0)
x = on - on.mean(); ac = np.correlate(x, x, 'full')[len(x) - 1:]; lag = np.arange(len(ac)) * hop / SR
sel = (lag > .4) & (lag < 1.2); per = lag[sel][ac[sel].argmax()]
print('Tempo: Periode %.3f s = %.1f BPM' % (per, 60 / per))
thr = np.percentile(on, 93); kicks = []
for i in range(1, len(on) - 1):
    if on[i] > thr and on[i] >= on[i - 1] and on[i] >= on[i + 1] and (not kicks or t[i] - kicks[-1] > .25):
        kicks.append(t[i])
print('Kicks:', ' '.join('%.2f' % k for k in kicks))
for s in np.arange(0, len(a) / SR, .5):
    m = (t >= s) & (t < s + .5)
    if m.any():
        db = 20 * np.log10(np.sqrt(np.mean(a[int(s * SR):int((s + .5) * SR)] ** 2)) + 1e-9)
        # Sprache: starke Energie 300-3000 Hz relativ zu Bass + 3-6-Hz-Silbenmodulation
        print('%5.1fs %6.1f dB  Mitte/Bass %.2f' % (s, db, mid[m].mean() / (low[m].mean() + 1e-9)))
