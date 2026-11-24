# Warenwirtschaft-Erklärvideo – Befehle

```
node tools/dump_cues.mjs                      # Zeitpunkte + Lesezeit DE
VIDEO_LANG=en node tools/dump_cues.mjs        # Lesezeit EN
python tools/mix.py cache/audio/mix.wav
python tools/master.py cache/audio/mix.wav cache/audio/master.wav
node src/render.js --lang de --out . --name "REMIRA-WWS-Erklaervideo-DE-v4" --audio cache/audio/master.wav
node src/render.js --lang en --out . --name "REMIRA-WWS-Erklaervideo-EN-v4" --audio cache/audio/master.wav
```
Standbilder: `VIDEO_LANG=en node tools/stills.mjs cache/stills 5 20 40` · Texte: `src/texte.js` · Icons: `src/phosphor-icons.js` (Phosphor light 2.1.1 seit v4, vorher bold; aus `npm pack @phosphor-icons/core@2.1.1`).
Vorher einmal: `npm install` und `npx playwright install chromium`.

v4 (23.11.2026): Zeitachse in `src/timeline.js` (`T`, `WHIPS`), Muster je Schritt: Text → Lesezeit → Animation. Blickführung mit `dimAt()` in `src/main.js`, Schritt-Nummern `stepRow()`. Ältere Fassungen: `-v2`, `-v3`.
v5 (24.11.2026): `-v5`-Dateien; Logo oben rechts per `?bug=logo|url` (Standbilder: `BUG=url node tools/stills.mjs …`). Kleine Symbole auf Plaketten aus `src/phosphor-icons-bold.js`.
