# Warenwirtschaft-Erklärvideo – Befehle

```
node tools/dump_cues.mjs                      # Zeitpunkte + Lesezeit DE
VIDEO_LANG=en node tools/dump_cues.mjs        # Lesezeit EN
python tools/mix.py cache/audio/mix.wav
python tools/master.py cache/audio/mix.wav cache/audio/master.wav
node src/render.js --lang de --out . --name "REMIRA-WWS-Erklaervideo-DE" --audio cache/audio/master.wav
node src/render.js --lang en --out . --name "REMIRA-WWS-Erklaervideo-EN" --audio cache/audio/master.wav
```
Standbilder: `VIDEO_LANG=en node tools/stills.mjs cache/stills 5 20 40` · Texte: `src/texte.js` · Icons: `src/phosphor-icons.js` (Phosphor bold 2.1.1, aus `npm pack @phosphor-icons/core@2.1.1`).
Vorher einmal: `npm install` und `npx playwright install chromium`.
