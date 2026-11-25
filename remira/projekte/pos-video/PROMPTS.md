# POS-Erklärvideo – Befehle

```
node tools/dump_cues.mjs                      # Zeitpunkte + Lesezeit DE
VIDEO_LANG=en node tools/dump_cues.mjs        # Lesezeit EN
python tools/mix.py cache/audio/mix.wav
python tools/master.py cache/audio/mix.wav cache/audio/master.wav
node src/render.js --lang de --out . --name "REMIRA-POS-Erklaervideo-DE-v1" --audio cache/audio/master.wav
node src/render.js --lang en --out . --name "REMIRA-POS-Erklaervideo-EN-v1" --audio cache/audio/master.wav
```
Standbilder: `VIDEO_LANG=en node tools/stills.mjs cache/stills 5 20 40` · Texte: `src/texte.js` · Zeiten: `src/timeline.js` · Szenen: `src/main.js` (ab „POS-Szenen“).
Icons: `src/phosphor-icons.js` (Phosphor light 2.1.1), kleine Symbole auf Plaketten `src/phosphor-icons-bold.js`. Logo oben rechts: `assets/brand/REMIRA_Logo_white.png` (Logo-Pack).
Technik aus `warenwirtschaft-video` übernommen (Renderer, Text-Helfer, Ring, Kamerafahrten, Endkarte B, Mastering). Musik eigen: 108 BPM, A-Dur/Fis-Moll, E-Piano, Rimshot + Hats.
Vorher einmal: `npm install` und `npx playwright install chromium`.
