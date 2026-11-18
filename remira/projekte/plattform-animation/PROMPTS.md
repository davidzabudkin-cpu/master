# So bestellt man dieses Video bei Claude

**In einem Satz:**
„Hier ist unsere Plattform-Grafik als Bild. Bau sie als Vektor per Code nach und animiere sie als ruhiges 20-Sekunden-Video in 16:9 ohne Stimme: erst leuchtet der Remira-Ring mit dem AI-Chip auf, dann kommen der innere Kreis, die Module und der grüne Ring, am Ende fliegen links die Herausforderungen herein, Impulse laufen ins Sechseck und rechts kommen die Vorteile heraus. Das Schlussbild ist die komplette Grafik. Dazu leise Musik und weiche Geräusche. Halte dich an unser Branding (Source Sans, Ringfarben).“

## Was dabei wirklich passiert ist (zum Erzählen)
- Die Grafik wurde nicht abgefilmt, sondern neu gezeichnet: Formen, Icons und Texte sind Code (`src/main.js`, `src/data.js`). Deshalb ist alles scharf und einzeln animierbar.
- Der bunte Ring kommt aus der Original-Logo-Datei. Die Icons sind originale Phosphor-Icons (bold), die Sechsecke regelmäßig (Breite : Höhe = 2 : √3).
- Der Tippfehler „automatition“ aus der Vorlage ist zu „automation“ korrigiert.
- Bild und Ton hängen an denselben Zeitpunkten (`src/timeline.js` → `plan/cues.json`). Musik und Geräusche sind per Code erzeugt (`tools/mix.py`), kein Stockmaterial.
- Ehrlich: Claude kann nicht hören. Lautheit und Pegelspitzen sind gemessen, anhören muss ein Mensch.

## Neu rendern
```
node tools/dump_cues.mjs
python tools/mix.py cache/audio/mix.wav
python tools/master.py cache/audio/mix.wav cache/audio/master.wav
node src/render.js --out . --name "REMIRA-Plattform-Animation-v3" --audio cache/audio/master.wav
```
Braucht Node mit Playwright (vorher im Projektordner `npm install` und `npx playwright install chromium`), ffmpeg und Python mit numpy/scipy.

Prüfen: `python tools/measure.py REMIRA-Plattform-Animation.mp4` (Sechseck-Maße, Text steht still). Windows unterscheidet Groß/Klein bei Dateinamen nicht: alte Datei erst umbenennen, dann rendern.

## Zweite Sprache
`node src/render.js --lang en|de --out . --name "REMIRA-…-EN" --audio <fertige andere Sprachfassung>.mp4` (Ton bitgenau übernommen, gleiches Timing). Texte: `src/texte.js` bzw. `src/data.js`.
