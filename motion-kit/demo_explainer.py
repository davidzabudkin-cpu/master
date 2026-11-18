"""Demo 16:9: zeigt alle Grafik-Bausteine in einem Stil (ohne Stimme, 0 Credits).

    python demo_explainer.py                       # Stil clean-hell
    python demo_explainer.py ../stile/dunkel-kino  # anderer Stil
    python demo_explainer.py ../stile/doodle-papier --sheet   # nur Kontaktbogen (schnell)
"""
import sys
from pathlib import Path

import mk

HERE = Path(__file__).resolve().parent
style_dir = next((a for a in sys.argv[1:] if not a.startswith("--")), str(HERE.parent / "stile" / "clean-hell"))
style = mk.Style.load(style_dir)
v = mk.Video(style, size=(1920, 1080), fps=30, thousands=".")


def s_hook(c, t):
    c.bg()
    c.slam_word("40.000.000.000 €", c.W / 2, c.H * 0.45, t, 0.3, size=150, color="accent")
    c.pop_text("…und keiner merkt es?", c.W / 2, c.H * 0.68, t, 1.3, size=70)
    c.tag("BEISPIELZAHL", t, 0.3, pos="bl")


def s_bars(c, t):
    c.bg()
    c.title("WOHIN 5 € FÜR EINEN KAFFEE GEHEN", t, 0.0)
    c.bars([("Bohnen", 0.40), ("Miete", 1.10), ("Personal", 1.60), ("Gewinn", 0.60)], t, t0=0.5, step=0.45, fmt="{:.2f} €")


def s_versus(c, t):
    c.bg()
    c.title("MIETEN ODER KAUFEN?", t, 0.0)
    c.versus({"label": "MIETEN", "big": "1.200 €", "note": "pro Monat"},
             {"label": "KAUFEN", "big": "1.650 €", "note": "Kredit + Nebenkosten"}, t, t0=0.4, t_win=2.2, winner="left")


def s_timeline(c, t):
    c.bg()
    c.title("WIE ES DAZU KAM", t, 0.0)
    c.timeline([(1971, "Gold-Bindung endet"), (2008, "Finanzkrise"), (2020, "Pandemie"), (2026, "heute")], t, t0=0.4, step=0.6)


def s_receipt(c, t):
    c.bg()
    c.receipt([("Grundpreis", "800 €"), ("Steuer", "152 €"), ("Versicherung", "90 €"), "---", ("SUMME", "1.042 €", "warn")],
              t, t0=0.3, step=0.5, stamp="TEUER!", t_stamp=3.0)


def s_list(c, t):
    c.bg()
    c.title("3 DINGE ZUM MERKEN", t, 0.0)
    c.checklist(["Erst verstehen, dann kaufen", "Kosten immer zusammenrechnen", "Nie alles auf eine Karte"], t, [0.5, 1.5, 2.5])


def s_counter(c, t):
    c.bg()
    c.title("SO SCHNELL WÄCHST ES", t, 0.0)
    c.counter(c.W / 2, c.H * 0.52, t, 0.4, 3.0, 0, 1_000_000, fmt="{:,.0f} €", size=190, color="accent2")
    c.arrow((c.W * 0.25, c.H * 0.82), (c.W * 0.75, c.H * 0.7), t, 1.0, 0.8, bend=0.15)


start = 0.0
for fn, d in [(s_hook, 3.0), (s_bars, 4.0), (s_versus, 3.6), (s_timeline, 3.8), (s_receipt, 4.0), (s_list, 3.6), (s_counter, 3.6)]:
    v.scene(start, start + d, fn)
    start += d

# Ton: weiche Sounds 50–70 ms vor dem Ereignis, ein Sound pro Ereignis
v.sfx("thump", 0.3); v.kick(0.3, 14)
v.sfx("marimba", 1.3, note=5)
for k in range(4):
    v.sfx("marimba", 3.0 + 0.5 + k * 0.45, note=2 + k)
v.sfx("bell", 7.0 + 2.2, note=4)
v.sfx("chord", 24.0 + 3.0, note=2)

out = HERE / "out"
name = Path(style_dir).name
if "--sheet" in sys.argv:
    print(v.contact_sheet(out / f"demo_{name}_sheet.jpg"))
else:
    v.contact_sheet(out / f"demo_{name}_sheet.jpg")
    v.render(out / f"demo_{name}.mp4", preview="--preview" in sys.argv, loudness=-16)
