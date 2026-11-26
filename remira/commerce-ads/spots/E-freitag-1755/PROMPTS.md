# Spot A „Das letzte Paar“ (Prototyp v1, 26.11.2026)

Overselling: 1 Paar Schuhe, 2 Käufer (Laden + Online-Shop). Produkt: Omnichannel Commerce Software / Order Management Software. CTA: persönliche Demo. 17,3 s, ohne Stimme, DE + EN, Formate 9:16, 16:9, 1:1.

## Storyboard (Ist-Stand)
| Zeit | Zweck | Bild | Text im Bild | Ton |
|---|---|---|---|---|
| 0,1–2,7 | Hook | Schuhkarton mit rotem Etikett „Nur noch 1“, dann Laden-Karte, dann Handy mit Shop | „1 Paar. 2 Käufer.“ | leises Pluck-Arpeggio E-Moll |
| 2,7–4,6 | Beleg | Karton fliegt in den Laden → Stempel VERKAUFT; Tipp im Shop → VERKAUFT → wird STORNIERT | | Groove setzt ein, Scanner-Piep, Handy-Ding, Storno-Ton |
| 4,95–8,0 | Agitation | Zähler „Bestand: 0“ gegen „Bestand: 1“ (rot), Bewertung fällt von 5 auf 2 Sterne | „Laden und Shop zählen getrennt.“ | Groove E-Moll |
| 8,0–9,0 | Wendung | Rest abgedunkelt, REMIRA-Ring fliegt ein | | Drums stoppen, Riser |
| 9,0–12,45 | Auflösung | Ring verbindet Laden und Shop, Impuls Laden → Ring → Shop, Shop zeigt sofort „Ausverkauft“, beide Zähler blau | „Ein Bestand für Laden und Shop.“ + Chip „Echtzeit“ | Einsatz G-Dur auf der Landung |
| 12,88–17,3 | CTA | Ring fährt deckungsgleich ins Original-Logo, Kampagnenzeile, Button | „Ein Laden. Ein Bestand. Ein System.“ · „Persönliche Demo sichern“ · remira.com | Drums stoppen, Akkord klingt aus |

## Befehle (im Spot-Ordner)
```
export PLAYWRIGHT_DIR=/opt/node22/lib            # nur in der Cloud; lokal: npm install
node tools/dump_cues.mjs && VIDEO_LANG=en node tools/dump_cues.mjs     # Zeiten → plan/cues.json + Lesezeit DE/EN
python tools/mix.py cache/audio/mix.wav && python tools/master.py cache/audio/mix.wav cache/audio/master.wav
VARIANT=9x16 VIDEO_LANG=de node tools/stills.mjs cache/stills 1 3.4 6.2 9.6 11.8 16.5 && python tools/sheet.py cache/sheet.jpg cache/stills/9x16-de-*.jpg
node src/render.js --variant 9x16 --lang de --out . --name "REMIRA-Commerce-Spot-A-Das-letzte-Paar-DE-9x16-v1" --audio cache/audio/master.wav
```
Formate: `--variant 9x16 | 16x9 | 1x1`. Sprache: `--lang de | en`.

## Aufbau (Vorlage für alle Kampagnen-Spots)
- `src/kit.js`: gemeinsamer Rahmen: Format, Schrift, Hintergrund, Text (steht still), Chip, Stempel, Glas-Karte, Linie, Phosphor-Icons, **Ring aus der Original-SVG**, **Endkarte** (Original-Logo-PNG aus dem Logo-Pack, Kampagnenzeile, CTA-Button, remira.com; der Ring fährt deckungsgleich in die Bildmarke des Logos)
- `src/data.js`: alle Zeitpunkte `T`, Textfenster `TX`, Dauer, BPM-Raster
- `src/texte.js`: alle Texte DE/EN
- `src/main.js`: Szenen und Layout je Format
- `tools/mix.py`: eigene Musik + Sounddesign aus `plan/cues.json`; `tools/master.py`: linear auf −16 LUFS

## Messwerte v1
- Lesezeit (2,5 Wörter/s + 1 s): DE und EN ok
- Ton (gemessen, nicht angehört): gesamt −16,0 LUFS, True Peak −1,4 dBFS; Intro −21, Problem/Lösung −15, Ausklang −25 LUFS
- Reels-Sicherheitszone 9:16: alles Wichtige zwischen y 230 und 1660

## Offen
- Kampagnenzeile, Texte DE/EN, „Storniert“-Szene freigeben (Marketing)
- Darsteller-Fassung (Konzept in `../../KONZEPT.md`, Idee A)
