# Regeln für alle REMIRA-Commerce-Spots (Stand 26.11.2026)

Vorlage: `A-das-letzte-paar/` (siehe dessen `PROMPTS.md`). Konzept je Idee: `../KONZEPT.md`, Abschnitt 3. Belege: `../recherche/`.

## Neuer Spot aus der Vorlage
1. Ordner kopieren ohne MP4s und `cache/`: `rsync -a --exclude '*.mp4' --exclude cache --exclude node_modules A-das-letzte-paar/ X-name/`
2. `src/kit.js` unverändert lassen (gemeinsamer Rahmen: Format, Text, Chip, Stempel, Glas-Karte, Ring, Endkarte). Fehlt ein Baustein, im Spot (`main.js`) bauen
3. Neu schreiben: `STORYBOARD.md` (Tabelle wie in `A/PROMPTS.md`), `src/texte.js`, `src/data.js` (Zeiten `T`, Lesefenster `TX`, Dauer, BPM-Raster), `src/main.js` (Szenen, Layout für 9x16, 16x9, 1x1), `tools/mix.py` (eigene Musik), `PROMPTS.md`
4. Icons: `python /home/user/master/.claude/skills/remira-phosphor-icons/scripts/phosphor.py js <namen…> --weight light --out src/phosphor-icons.js` (bold nur für Häkchen/Kreuz auf Plaketten: `src/phosphor-icons-bold.js`, Export danach in `phosphorPathBold` umbenennen; fill nur für gefüllte Sterne o. ä.). Namen per `ls ~/.cache/phosphor-core-2.1.1/assets/light | grep …`
5. Prüfen und rendern wie in `A/PROMPTS.md` (in der Cloud vorher `export PLAYWRIGHT_DIR=/opt/node22/lib`)

## Bild
- Hook in den ersten 2 s: ein Bild + höchstens 5 Wörter, ohne Ton verständlich. Kein Logo am Anfang
- Ein Blickfang pro Moment: erst Text zeigen (Lesezeit 2,5 Wörter/s + 1 s, Prüfung `tools/dump_cues.mjs` muss DE und EN „ok“ melden), dann das Bild-Ereignis, dann das nächste. Nie zwei Bewegungen gleichzeitig. Was nicht dran ist, abdunkeln (ca. 28 %)
- Text steht still, sobald er da ist (ganze Pixel, kein Wackeln, keine Kamerafahrt unter Text)
- Wendung immer mit dem REMIRA-Ring aus `ring()` (Original-SVG); Ende immer `endCard()` (Ring fährt ins Original-Logo, Kampagnenzeile „Ein Laden. Ein Bestand. Ein System.“, CTA-Button, remira.com). Nur der CTA-Text unterscheidet sich je Spot
- Farben: Problem Rot #F53D47, Lösung Blau #41B6E6, Häkchen Grün #61BD47; Schrift Source Sans 3 fett; Icons Phosphor light, weiß
- Alles in allen drei Formaten sauber: nichts überlappt, nichts ragt aus Karten/Buttons (Breiten aus gemessener Textbreite), 9:16 wichtige Inhalte zwischen y 230 und 1660 (Reels-Oberfläche)
- Keine echten Personen, keine Namen, keine Kundenlogos. Personen nur als Icons/Silhouetten. Keine fremden Marken nachbilden (z. B. kein LinkedIn-Logo, kein echtes App-Design)

## Text
- REMIRA immer groß. Stichpunkte ohne Punkt, vor Listen Doppelpunkt, keine Gedankenstriche als Satzverbindung, „selbstständig“
- Nur Aussagen aus remira.com (`../recherche/01-remira-website.md`) bzw. dem Konzept; Zahlen nur mit Quelle. Alles DE + EN in `texte.js`, EN als „vor Freigabe prüfen“

## Ton
- Eigene Musik je Spot (anderes Tempo, andere Tonart, anderes Leitinstrument als die anderen Spots), dynamisch: Drums, Bass, kurze Plucks; keine Claps, keine Flächen/Chor/Hall-Teppiche
- Muster: Intro etwas leiser (≈ −21 LUFS) → Groove im Problem → kurze Pause/Riser vor dem Ring → Einsatz auf der Ring-Landung → Drums stoppen beim Logo, Akkord klingt aus
- SFX leise, ein Sound pro Ereignis; Master −16 LUFS, Spitze ≤ −1 dBFS (`tools/master.py`). Immer „gemessen, nicht angehört“

## Dateien
- Name: `REMIRA-Commerce-Spot-<Buchstabe>-<Titel>-<DE|EN>-<9x16|16x9|1x1>-v1.mp4` im Spot-Ordner
- Alte Fassungen nie überschreiben (`-v2` usw.)

## Belegte Spot-Ideen und Spot-Tempo
| Spot | Musik |
|---|---|
| A Das letzte Paar | 123,8 BPM, E-Moll → G-Dur, Plucks + E-Piano |
