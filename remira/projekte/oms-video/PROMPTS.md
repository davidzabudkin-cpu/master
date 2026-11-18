# So bestellt man dieses Video bei Claude

**In einem Satz:**
„Hier ist unser Skript zum Glossarartikel ‚Order Management System‘ und der Link zum Artikel: Mach daraus ein ruhiges, edles Motion-Design-Erklärvideo in 16:9 ohne Stimme, nur Text im Bild, leise Musik und weiche Geräusche; der REMIRA-Ring begleitet das Video, wird zur Bestellung, im Problem-Teil zur grauen Uhr und dann zum Order-Hub, durch den Bestellungen aus Online-Shop, Marktplatz, Filiale und App laufen und an Lager, Filiale oder Logistikpartner verteilt werden; jeder Text steht lange genug zum Lesen, nichts erfinden, am Ende unser Logo und remira.com, Branding: Source Sans, Schwarz/Weiß, Akzent #41B6E6, Ringfarben.“

## Was dabei wirklich passiert ist (zum Erzählen)
- Erst Skript + Artikel gelesen, dann ein Storyboard (`STORYBOARD.md`) mit Beat, Text, Visual, Bewegung, Ton, erst danach gebaut.
- Alles ist Code (`src/main.js`), keine Stockbilder: Formen, Texte, Kamera mit Bewegungsunschärfe. Der Ring und der Schriftzug kommen aus der Original-Logo-Datei, die Icons sind Original-Phosphor-Icons (Skill `remira-phosphor-icons`, `src/phosphor-icons.js`).
- Die Szenen liegen nebeneinander in einer „Welt“, die Kamera fährt von Szene zu Szene. Deshalb gibt es keine schwarzen Bilder zwischen den Szenen.
- Bild und Ton hängen an denselben Zeitpunkten (`src/timeline.js` → `plan/cues.json`). Musik und Geräusche sind per Code erzeugt (`tools/mix.py`).
- `tools/dump_cues.mjs` prüft automatisch die Lesezeit jedes Textes (1 s pro 3 Wörter + 0,8 s).
- Ehrlich: Claude kann nicht hören. Lautheit und Pegelspitzen sind gemessen, anhören muss ein Mensch.

## Neu rendern
```
node tools/dump_cues.mjs
python tools/mix.py cache/audio/mix.wav
python tools/master.py cache/audio/mix.wav cache/audio/master.wav
node src/render.js --out . --name "REMIRA-OMS-Erklaervideo-neu" --audio cache/audio/master.wav
```
Standbilder zum Prüfen: `node tools/stills.mjs cache/stills 5 20 40` und `python tools/sheet.py cache/stills cache/sheet.jpg 3`.
Braucht Node mit Playwright (vorher im Projektordner `npm install` und `npx playwright install chromium`), ffmpeg und Python mit numpy/scipy/Pillow.

## Zweite Sprache
`node src/render.js --lang en|de --out . --name "REMIRA-…-EN" --audio <fertige andere Sprachfassung>.mp4` (Ton bitgenau übernommen, gleiches Timing). Texte: `src/texte.js` bzw. `src/data.js`.
