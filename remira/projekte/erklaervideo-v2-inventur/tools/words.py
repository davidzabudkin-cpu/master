#!/usr/bin/env python3
"""Wortzeiten ohne Whisper: geprüfte Sprechblöcke (tools/blocks.py) → Pausen auf Wunschlänge → Wörter über Silbenanteil + Energie-Tal.
Aufruf: python tools/words.py sterling|xavier  → plan/words-<name>.json + assets/vo/vo-en-<name>-edit.wav"""
import json, re, sys, pathlib, numpy as np
from scipy.io import wavfile
from scipy.ndimage import uniform_filter1d
sys.stdout.reconfigure(encoding='utf-8')
ROOT = pathlib.Path(__file__).resolve().parents[1]
OFFSET, SR = 0.9, 48000
PHR = ["Taking inventory means", "counting every single item.", "Tedious.", "Often with the warehouse closed.", "There is a better way.",
       "With inventory sampling from Remira,", "you count just a small random sample.", "The software extrapolates the rest.",
       "Up to ninety-nine percent less counting effort.", "Your E-R-P data flows in.", "Count lists come out.", "You count,",
       "and the report for your auditor is ready.", "Certified by P-W-C.", "Start with a free data analysis.", "Remira."]
# Wunschpause NACH der Phrase (Sekunden): Platz für Whips/Impacts. None = Original, höchstens 0,6.
GAP = {1: .55, 2: .45, 3: .85, 4: .5, 6: .6, 7: .9, 8: .85, 9: .45, 10: .45, 11: .3, 12: .8, 13: .9, 14: .75}
VOICES = {
 'sterling': dict(file='assets/vo/vo-en-sterling.mp3', blocks=[(0.05, 1.40, [0]), (1.56, 3.08, [1]), (3.78, 4.27, [2]), (4.96, 6.53, [3]), (7.35, 8.28, [4]), (8.97, 11.07, [5]), (11.55, 13.67, [6]), (14.51, 16.38, [7]), (17.09, 19.38, [8]), (20.28, 21.97, [9]), (22.44, 23.51, [10]), (24.24, 24.72, [11]), (25.25, 27.05, [12]), (27.73, 29.50, [13]), (30.41, 32.17, [14]), (32.77, 33.36, [15])]),
 'xavier': dict(file='assets/vo/vo-en-xavier.mp3', blocks=[(0.01, 2.89, [0, 1]), (3.43, 4.07, [2]), (4.79, 6.52, [3]), (7.09, 8.17, [4]), (8.75, 10.78, [5]), (11.03, 13.19, [6]), (13.96, 16.09, [7]), (16.86, 19.39, [8]), (20.11, 22.03, [9]), (22.74, 23.98, [10]), (24.80, 25.39, [11]), (25.57, 27.60, [12]), (28.59, 30.50, [13]), (31.42, 33.51, [14]), (34.47, 35.04, [15])]),
}
name = sys.argv[1]; V = VOICES[name]
sr, x = wavfile.read(ROOT / f'cache/audio/{pathlib.Path(V["file"]).stem}-48k.wav'); x = x.astype(np.float64) / 32768; assert sr == SR
PAD = .06; fd = int(.012 * SR)
out, segs, cur = [], [], 0.0
for k, (a, b, ph) in enumerate(V['blocks']):
    a0, b0 = max(0, a - PAD), min(len(x) / SR, b + PAD)
    seg = x[int(a0 * SR):int(b0 * SR)].copy(); seg[:fd] *= np.linspace(0, 1, fd); seg[-fd:] *= np.linspace(1, 0, fd)
    out.append(seg); segs.append((cur + PAD, cur + PAD + (b - a), ph)); cur += len(seg) / SR
    if k + 1 < len(V['blocks']):
        orig = V['blocks'][k + 1][0] - b; want = GAP.get(ph[-1]); gap = want if want is not None else min(orig, .6)
        sil = max(0, gap - 2 * PAD); out.append(np.zeros(int(sil * SR))); cur += int(sil * SR) / SR
x = np.concatenate(out); edit = ROOT / f'assets/vo/vo-en-{name}-edit.wav'
wavfile.write(edit, SR, np.rint(np.clip(x, -1, 1) * 32767).astype(np.int16))
hop = int(SR * .01); n = len(x) // hop
db = 20 * np.log10(np.sqrt(np.maximum(uniform_filter1d((x[:n * hop] ** 2).reshape(n, hop).mean(1), 3), 0)) + 1e-9); t = np.arange(n) * .01
SYL = {'e-r-p': 3, 'p-w-c.': 5, 'ninety-nine': 3, 'every': 2, 'there': 1, 'software': 2, 'extrapolates': 4, 'warehouse': 2, 'closed.': 1, 'sample.': 2, 'come': 1, 'certified': 3, 'tedious.': 3, 'the': 1, 'free': 1, 'means': 1, 'analysis.': 4, 'inventory': 4, 'remira,': 3, 'remira.': 3, 'single': 2, 'item.': 2, 'data': 2, 'auditor': 3, 'ready.': 2, 'lists': 1, 'count,': 1, 'just': 1, 'small': 1, 'rest.': 1, 'less': 1, 'flows': 1, 'your': 1, 'you': 1, 'out.': 1, 'start': 1, 'with': 1, 'from': 1, 'way.': 1}
def syl(w): return SYL.get(w.lower(), max(1, len(re.findall(r'[aeiouy]+', re.sub(r'e\b', '', w.lower().strip('.,'))))))
words = []
for a, b, ph in segs:
    ws = ' '.join(PHR[p] for p in ph).split(); lines = [p for p in ph for _ in PHR[p].split()]
    w = np.array([syl(v) + .35 for v in ws], float); cum = np.concatenate([[0], np.cumsum(w)]) / w.sum(); cuts = [a]
    for c in cum[1:-1]:
        g = a + c * (b - a); lo = max(int((g - .09) * 100), int(cuts[-1] * 100) + 6); hi = max(int((g + .09) * 100), lo + 1)
        cuts.append(float(t[min(n - 1, lo + int(np.argmin(db[lo:hi])))]))
    cuts.append(b)
    for v, s, e, l in zip(ws, cuts[:-1], cuts[1:], lines): words.append({'w': v, 't0': round(s + OFFSET, 3), 't1': round(e + OFFSET, 3), 'line': l})
assert len(words) == 71, len(words)
(ROOT / f'plan/words-{name}.json').write_text(json.dumps({'voice': name, 'offset': OFFSET, 'vo_file': edit.relative_to(ROOT).as_posix(), 'vo_duration': round(len(x) / SR, 3), 'words': words}, ensure_ascii=False, indent=1), encoding='utf-8')
print(f'{name}: {len(x)/SR:.2f} s Stimme, letztes Wort endet {words[-1]["t1"]}')
print('  '.join(f'{i}:{w["w"]}@{w["t0"]}' for i, w in enumerate(words)))
