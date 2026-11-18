"""Wortzeiten aus einer Sprachaufnahme (faster-whisper, lokal, 0 Credits).

    pip install faster-whisper
    python whisper_words.py stimme.mp3 words.json [--lang de] [--model small]

Ergebnis: {"words": [{"word": "Hallo", "start": 0.12, "end": 0.48}, ...]}
Achtung: Whisper schreibt Zahlen oft als Ziffern ("40" statt "vierzig"). Schnittwörter daher nie Zahlen.
Sätze immer an der STILLE in der Tonspur schneiden, nicht an Whisper-Zeiten (die sind ±0,1 s ungenau).
"""
import argparse
import json

ap = argparse.ArgumentParser()
ap.add_argument("audio")
ap.add_argument("out")
ap.add_argument("--lang", default=None)
ap.add_argument("--model", default="small")
a = ap.parse_args()

from faster_whisper import WhisperModel  # noqa: E402

model = WhisperModel(a.model, device="cpu", compute_type="int8")
segs, info = model.transcribe(a.audio, language=a.lang, word_timestamps=True, vad_filter=True)
words = []
for s in segs:
    for w in s.words:
        words.append({"word": w.word.strip(), "start": round(w.start, 3), "end": round(w.end, 3)})
with open(a.out, "w", encoding="utf-8") as fh:
    json.dump({"language": info.language, "words": words}, fh, ensure_ascii=False, indent=1)
print(f"{len(words)} Woerter -> {a.out}")
