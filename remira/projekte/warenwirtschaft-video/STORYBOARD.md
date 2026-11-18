# REMIRA Glossar-Erklärvideo „Warenwirtschaftssystem (WWS)“ – Storyboard

**Gebaut 18.11.2026** (DE + EN). Texte und Quellen in `SKRIPT.md`. Aufbau bewusst wie das OMS-Video (gleiche Szenen-Welt, gleiches Timing 71,5 s), damit die Glossar-Videos als Reihe erkennbar sind.
Zweck: Glossar-Begleitvideo, gleiche Reihe wie das OMS-Video. Ohne Stimme, Text im Bild, dynamische Musik, weiche SFX.
Format: 16:9, 1920×1080, 30 fps, ca. 68 s, DE + EN (Sprachumschaltung `--lang`, wie OMS).
Pipeline: Kopie von `remira/projekte/oms-video/` (eigener Renderer, `src/texte.js` für beide Sprachen).

## Roter Faden: der REMIRA-Ring als „Ware“
Setzt sich aus 6 Blättern zusammen → wandert als Ware durch Einkauf, Wareneingang, Lager, Verkauf → läuft einmal den Kreislauf → wird grau als tickende Uhr (Problem) → wird bunt und zum Hub „WWS“ → sitzt am Ende der geglätteten Bestandslinie → rastet als Logo ein.

## Beats
| # | Zeit (s) | Text im Bild | Visual | Kamera | Ton |
|---|---|---|---|---|---|
| 1 | 0–10 | „Was ist ein **Warenwirtschaftssystem** (WWS)?“ → Untertitel (Definition) | Ring aus 6 Blättern, Titel rückt hoch; 4 Stationen Einkauf → Wareneingang → Lager → Verkauf (Phosphor bold: shopping-cart / truck / warehouse / storefront), Ring wandert mit | Stand, kein Drift | leises Intro ohne Claps, Taps pro Station |
| 2 | 10–19 | „Ein WWS bildet den ganzen Warenkreislauf ab:“ · 5 Stationen | Kreislauf (Kreisbahn, Pfeilrichtung), Ring läuft herum, erledigte Stationen leicht blau gefüllt | Fahrt nach rechts | Musik setzt ein (Kick, Hats) |
| 3 | 19–29 | „DAS PROBLEM“ · Satz · 3 Schlagworte mit roten Punkten | Regal mit roten Lücken und orange überfüllten Fächern, fliegende Tabellen-Zettel, Ring grau als Uhr | Fahrt nach unten, rötliches Licht | Moll, Papier-Swishes, leises Ticken |
| 4 | 29–44 | „So funktioniert ein WWS“ · ①②③ nacheinander | Heldin fliegt einmal durch (Wendepunkt), Ring wird Hub „WWS“; Warenströme ein, Bestandskarte zählt, Chip „Bestellvorschlag“ | diagonale Fahrt nach oben, dann Stand | Riser → Impact, Ticks je Bewegung, Glocke beim Chip |
| 5 | 44–54 | „Was dadurch möglich wird:“ · 4 Kacheln · Fußzeile | Hub unten mittig, 4 Karten im Halbkreis darüber, Leitungen mit Punkten | Fahrt nach rechts | Pop + Tap je Karte |
| 6 | 54–61 | „Ein Warenwirtschaftssystem sorgt für:“ · 4 Häkchen | links Häkchen, rechts Bestandslinie glättet sich in grünen Korridor, Ring am Linienende | Fahrt nach rechts | aufsteigende Töne |
| 7 | 61–68 | Logo + Claim (Produktname) · „Alle Waren. Ein System.“ · Button REMIRA.COM | Endkarte Variante B | Fahrt, dann ≥ 5 s Stand | Drums stoppen beim Logo, Ausklang |

## OMS-Lehren, die hier von Anfang an gelten (nicht erst nach Feedback)
- **Text steht still:** Kamera im Stand Zoom 1, ganze Pixel, kein Drift, kein Motion Blur auf Text.
- **Ein Blickfang pro Moment:** Szene blendet 0,4 s vor jeder Fahrt aus, in der Fahrt nur Ring + Hintergrund.
- **Linien nur zwischen den Kreisen** (Kreisrand + 6 px), nie durch Kreise; Kreis unter dem Ring ausblenden.
- **Badges, Häkchen, Punkte auf Mitte der Großbuchstaben** (`capMid`, `tools/measure_badges.py`, ±1 px).
- **Icons Phosphor bold**, Original-SVGs, 12 % größer als „passt gerade“.
- **REMIRA in Großbuchstaben** überall, auch Dateinamen (`REMIRA-WWS-Erklaervideo.mp4`).
- **Zeichensetzung:** Listenpunkte ohne Punkt, Doppelpunkt vor Listen, keine Gedankenstriche.
- **Endkarte Variante B**, nach Tinte gemessen (`tools/measure_end.py`); Claim mit **fester Breite**, nicht aus gemessener x-Höhe (browserabhängig).
- **Musik dynamisch** (ca. 116 BPM, Drums/Bass/Plucks), Intro ca. 3 dB leiser **ohne Claps**, keine Flächen; Ton gemessen −16 LUFS, < −1 dBFS, anhören muss ein Mensch.
- **Sechsecke/Formen nie stauchen**, Hintergrund wie OMS (Navy-Verlauf).
- **Lesezeit** 1 s pro 3 Wörter + 0,8 s, in **beiden Sprachen** prüfen (`VIDEO_LANG=en node tools/dump_cues.mjs`).
- **Nichts erfinden:** keine Zahlen ohne „bis zu“ von der Seite; Heldin nur einmal, kurz, vor Veröffentlichung abstimmen.

## Umgesetzt abweichend vom ersten Entwurf
- Szene 2 als Linie (wie OMS) statt Kreislauf, Szene 3 Kanäle → getrennte Bildschirme (wie OMS), Szene 6 Balken (wie OMS): Reihen-Look, weniger Risiko. Eigene Varianten (Kreislauf, Regal, Bestandslinie) sind als nächste Ausbaustufe möglich.
- Musik: OMS-Mix **ohne Claps**, Intro auf OMS-Pegel (gemessen), Mastering linear statt loudnorm (`tools/master.py`).

## Offen
1. Freigabe der Texte (v. a. Szene 3 und Slogan) und der EN-Übersetzung durch Marketing.
2. Heldin (KI-Nachzeichnung) vor Veröffentlichung abstimmen.
