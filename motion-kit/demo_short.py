"""Demo 9:16 (Short/Reel): Hook-Wort, Zähler, Wort-für-Wort-Untertitel, weiche Sounds, Kamera-Stoß.

Ohne Stimme: Die Wortzeiten sind hier ausgedacht. Im echten Projekt kommen sie aus
`python ../werkzeuge/whisper_words.py stimme.mp3 words.json` und die Stimme über v.voice("stimme.mp3").

    python demo_short.py ../stile/mesh-pastell
"""
import sys
from pathlib import Path

import mk

HERE = Path(__file__).resolve().parent
style_dir = next((a for a in sys.argv[1:] if not a.startswith("--")), str(HERE.parent / "stile" / "mesh-pastell"))
v = mk.Video(mk.Style.load(style_dir), size=(1080, 1920), fps=30, thousands=".")

# Ausgedachte Wortzeiten (Format wie whisper_words.py)
text = "Ein Cent. Jeden Tag verdoppelt. Nach dreißig Tagen? Über fünf Millionen Euro. Klingt unmöglich, oder?"
words, t = [], 0.3
for w in text.split():
    d = 0.18 + 0.045 * len(w)
    words.append({"word": w, "start": round(t, 2), "end": round(t + d, 2)})
    t += d + (0.35 if w.endswith((".", "?")) else 0.06)

T = lambda w, n=1: mk.word_time(words, w, n)


def s1(c, tt):
    c.bg()
    c.slam_word("1 CENT", c.W / 2, c.H * 0.36, tt, T("Cent."), size=210, color="accent")
    if tt >= T("verdoppelt."):
        c.text("× 2", c.W / 2, c.H * 0.5, 150, "accent2", scale=mk.pop(tt, T("verdoppelt.")))
    c.captions(words, tt, y=c.H * 0.72, size=74, hot={"cent", "verdoppelt", "millionen"})


def s2(c, tt):
    tg = tt + T("Nach")                     # globale Zeit (Szene startet bei "Nach")
    c.bg()
    c.title("NACH 30 TAGEN", tg, T("Nach"), y=c.H * 0.2, size=80)
    c.counter(c.W / 2, c.H * 0.42, tg, T("Über"), T("Euro.") + 0.3, 0.01, 5_368_709.12, fmt="{:,.2f} €", size=120, color="accent2")
    c.captions(words, tg, y=c.H * 0.72, size=74, hot={"millionen", "unmöglich,"})


v.scene(0, T("Nach"), s1)
v.scene(T("Nach"), words[-1]["end"] + 0.8, s2)
v.sfx("thump", T("Cent.")); v.kick(T("Cent."), 16)
v.sfx("marimba", T("verdoppelt."), note=5)
v.sfx("riser", T("Über") - 0.2, dur=1.0, gain=0.25)
v.sfx("bell", T("Euro."), note=6)

out = HERE / "out"
name = Path(style_dir).name
v.contact_sheet(out / f"short_{name}_sheet.jpg", cols=6, width=270)
if "--sheet" not in sys.argv:
    v.render(out / f"short_{name}.mp4", preview="--preview" in sys.argv, loudness=-14)
