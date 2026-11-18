# motion-kit – Motion Graphics per Code

Eigene, freie Engine (Python + Pillow + numpy + ffmpeg). Kostet 0 Credits, Text ist immer scharf, jedes Bild ist wiederholbar. Abgeleitet aus dem Shorts-Renderer, mit dem die Finanz-Shorts und Motion-Shorts gebaut wurden.

**Wofür:** Erklär-Grafiken (Zahlen, Vergleiche, Abläufe, Listen), Kinetic Type, Shorts/Reels mit Untertiteln, Intros/Outros, Kapitelkarten, Motion-Ebene über KI-Filmen.
**Nicht wofür:** realistische Szenen und Figuren mit Mimik → KI-Bilder/Clips (Higgsfield o. ä.) oder ein Figuren-Rig (siehe Skill `code-animation`).

## Start
```bash
pip install pillow numpy          # + ffmpeg installieren (siehe ../werkzeuge/check_setup.py)
python demo_explainer.py ../stile/clean-hell            # 16:9, alle Bausteine
python demo_short.py ../stile/mesh-pastell              # 9:16 mit Untertiteln
python demo_explainer.py ../stile/dunkel-kino --sheet   # nur Kontaktbogen (schnell)
```
Ergebnisse in `out/`. Renderzeit grob 3–6 Bilder/s bei 1080p auf einem Laptop → 1 min Video ≈ 5–10 min. Mit `--preview` halbe Auflösung.

## Aufbau eines Videos
```python
import mk
style = mk.Style.load("../stile/clean-hell")          # oder eigener Stil aus stile/<name>/
v = mk.Video(style, size=(1920, 1080), fps=30, thousands=".")   # "." = deutsches Zahlenformat
words = mk.load_words("words.json")                    # aus werkzeuge/whisper_words.py
T = lambda w, n=1: mk.word_time(words, w, n)           # Zeit eines gesprochenen Worts

def szene_kaffee(c, t):                                # t = Sekunden seit Szenenstart
    c.bg()
    c.title("WOHIN 5 € FÜR EINEN KAFFEE GEHEN", t)
    c.bars([("Bohnen", 0.4), ("Miete", 1.1), ("Gewinn", 0.6)], t, t0=0.5, fmt="{:.2f} €")

v.scene(0, 4.2, szene_kaffee)                          # Szene = genau so lang wie der Satz
v.voice("stimme.mp3")
v.sfx("marimba", 0.5, note=3)                          # weicher Ton 60 ms vor dem Ereignis
v.contact_sheet("out/check.jpg")                       # ERST prüfen
v.render("out/video.mp4", loudness=-16)                # dann rendern (−14 Shorts, −16 lange Videos)
```
Szenen-Funktion mit drei Parametern `def s(c, t, tg)` bekommt zusätzlich die globale Zeit `tg` (praktisch für `word_time`).

## Bausteine (`c.` = Canvas)
| Aufruf | Wofür | Wichtige Parameter |
|---|---|---|
| `bg(kind=None, colors=None)` | Hintergrund laut Stil | `paper`, `solid`, `gradient`, `spotlight`, `mesh`, `image:pfad.png` |
| `title(text, t, t0)` | Grafik-Titel = Aussage, mit Textmarker | `y`, `size`, `marker` |
| `tag(text, t, t0, pos)` | Schild in der Ecke (BEISPIEL, QUELLE, ORT + JAHR) | `pos`: `bl`,`br`,`tl`,`tr` |
| `text(...)`, `pop_text(...)` | Text, passt sich automatisch an die Breite an | `role`: head/body/caption/hand |
| `slam_word(text, x, y, t, t0)` | Hero-Wort knallt rein (Kinetic Type) | `size`, `color`, `rot` |
| `typed(text, x, y, t, t0)` | Schreibmaschine (Kapitel, Ort, Datum) | `cps` Zeichen/s |
| `counter(x, y, t, t0, t1, v0, v1, fmt)` | Zähler – nur Geld/Mengen, nie Jahre | `fmt="{:,.0f} €"` |
| `bars(data, t, t0, step)` | Balken wachsen nacheinander | `horizontal`, `box`, `fmt` |
| `pie(parts, x, y, r, t)` | Torte, Stück für Stück | `parts=[(label, anteil, farbe)]` |
| `timeline(points, t)` | Zeitleiste zeichnet sich | `points=[(1971, "Text")]` |
| `versus(left, right, t, t0, t_win, winner)` | Vergleich A vs. B, Gewinner leuchtet | `{label, big, note, color}` |
| `receipt(rows, t, t0, step, stamp, t_stamp)` | Kassenzettel, letzte Zeile = Summe | `"---"` = Trennlinie |
| `checklist(items, t, times)` | Fokus-Liste: aktueller Punkt hell | 3–5 Punkte |
| `arrow(p0, p1, t, t0, dur, bend)` | Pfeil zeichnet sich, Spitze am Ende | `bend` = Kurve |
| `check`, `cross`, `strike` | Haken, X, Durchstreichen (Mythos) | |
| `card(x, y, w, h, t)` | Karte/Rahmen | |
| `image(path, x, y, h, t, t0, anim)` | Figur/Logo/Freisteller einsetzen | `pop`, `fade`, `slide-l`, `slide-r` |
| `sprite(poses, t, x, y_fuss, h)` | Figur mit Posenwechsel auf dem Wort (Stauchen + Atmen) | `poses=[(0, "stand.png"), (2.1, "schock.png")]` |
| `scene_card(path, t)` | ganzes Szenenbild mit Rahmen + Push-in | für Shorts aus langen Videos |
| `captions(words, t, hot=…)` | Wort-für-Wort-Untertitel | `max_words`, `box`, `hot` = Schlüsselwörter |

**Video:** `scene(start, end, draw)`, `voice(pfad)`, `music(pfad, gain)`, `sfx(name|pfad, at, gain, note)`, `kick(at, strength)`, `still(t, pfad)`, `contact_sheet(pfad)`, `render(pfad, preview, loudness)`.
**Sounds (prozedural, lizenzfrei):** `marimba`, `bell`, `pluck`, `chord`, `thump`, `swish`, `tick`, `riser`, `boom`. Eigene WAV/MP3 gehen auch (`v.sfx("sounds/klick.wav", 2.0)`).
**Easing:** `mk.pop`, `mk.slam`, `mk.fade`, `mk.prog`, `mk.ease_out`, `mk.ease_in_out`, `mk.lerp`.

## Regeln, die sich bewährt haben
- Jedes Element erscheint **auf seinem Wort**, nie vorher (`word_time`). Schnittwörter nie Zahlen (Whisper schreibt Ziffern).
- Szene = Satzlänge. Animation ist bei ~70 % fertig, damit man sie zu Ende lesen kann; nichts friert ein, nichts wird abgeschnitten.
- In der ersten Sekunde steht Struktur (Titel, Achse, Rahmen), danach alle 3–5 s etwas Neues. Max. ~12 Elemente.
- Kein Kamerazoom zur Betonung – lieber Größe, Farbe, Abblenden. `kick` nur auf 1–3 Schlag-Wörter pro Minute.
- Nichts näher als 60 px am Rand, Text ≥ 28 px (bei 1080p), nie Text über Gesichtern.
- Ein Sound pro Ereignis, leise, 50–70 ms vor dem Bild. Lieber zu wenig als zu viel.
- Immer zuerst `contact_sheet` ansehen, dann rendern.

## Eigenen Baustein ergänzen
Neue Methode in `Canvas` schreiben (Muster: `bars`, `versus`). Nur von `t` abhängig machen (kein Zufall ohne festen Seed), Farben über `self.s.col("accent")`, Größen über `self.px(...)`. Danach in dieser Tabelle und im Katalog `../.claude/skills/erklaer-grafik/references/grafik-katalog.md` eintragen.

## Lizenz
Code: frei nutzbar (MIT, siehe `../LIZENZEN.md`). Schriften in `fonts/`: SIL Open Font License (Lizenzdateien liegen daneben).
