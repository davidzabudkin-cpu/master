# REMIRA Commerce-Plattform-Animation – Befehle

Abgeleitet aus `remira/projekte/plattform-animation` (25.11.2026) für die Commerce-Grafik von Marketing (DE + EN). v3 (26.11.): 26,2 s **Loop**, Tempo und Musik wie die Plattform-Animation; Loop-Ende = Kamerafahrt ins Zentrum, Ebenen lösen sich von außen nach innen bis zum Anfangsbild. v2 (Rücklauf) bleibt als `-v2` erhalten. v1 (42,5 s, mit Lese-Pausen und eigener Musik) bleibt als `-v1` erhalten.
Änderungen gegenüber der Plattform-Animation: 6 Module (POS Check-out, Warenwirtschaft, Order Management, Mobile Store Management, Payment, Customer Hub), Ring „Omnichannel / Commerce“, Chip „KI“ (DE) bzw. „AI“ (EN), Texte links/rechts wörtlich aus der Grafik, Phosphor light (kleine Icons auf dem grünen Kreis bold), Punkte links/rechts einzeln mit Lesezeit und Blickführung (vorherige gedimmt), eigene dynamische Musik (112 BPM, D-Dur, keine Flächen, keine Claps), lineares Mastering.

```
VIDEO_LANG=de node tools/dump_cues.mjs        # Zeitpunkte + Lesezeit DE
VIDEO_LANG=en node tools/dump_cues.mjs        # Lesezeit EN
python tools/mix.py cache/audio/mix.wav
python tools/master.py cache/audio/mix.wav cache/audio/master.wav
node src/render.js --lang de --out . --name "REMIRA-Commerce-Plattform-Animation-DE-v3" --audio cache/audio/master.wav
node src/render.js --lang en --out . --name "REMIRA-Commerce-Plattform-Animation-EN-v3" --audio cache/audio/master.wav
```
Standbilder: `VIDEO_LANG=en node tools/stills.mjs cache/stills 5 20 42`. Texte und Maße: `src/data.js`, Zeiten: `src/timeline.js`.
Vorher einmal: `npm install` und `npx playwright install chromium`.

Zur Freigabe (Marketing): DE-Grafik schreibt „Markeneintritt neuer Wettbewerber“, im Video steht „Markteintritt“ (vermuteter Tippfehler). EN-Grafik „automatition“ → „automation“.
