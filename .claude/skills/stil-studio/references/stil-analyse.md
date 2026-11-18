# Stil-Analyse: Referenzen in prüfbare Angaben übersetzen

## Frames holen
- YouTube-Link: Video lokal haben (`yt-dlp -f "bv*[height<=720]" <link>` – nur für eigene Analyse, nicht weiterverwenden) oder Screenshots vom Nutzer.
- Frames: `ffmpeg -i video.mp4 -vf "fps=1/8,scale=640:-2" frames/f_%03d.jpg` → 8–15 Bilder, dazu ein Kontaktbogen (`werkzeuge/kontaktbogen.py video.mp4 --every 8`).
- Farben messen (Python):
```python
from PIL import Image
im = Image.open("frames/f_003.jpg").convert("RGB").resize((160, 90))
cols = im.quantize(colors=8).convert("RGB").getcolors(160*90)
for n, c in sorted(cols, reverse=True): print(n, '#%02X%02X%02X' % c)
```

## Analyse-Raster (pro Merkmal: was genau, als Zahl/Wort)
| Merkmal | Fragen | Beispiel-Antwort |
|---|---|---|
| Gefühl | 3 Wörter? | „warm, verspielt, klar“ |
| Palette | Hintergrund, Tinte, 1–2 Akzente, Warnfarbe – Hex | `#FDFBF0` Papier, `#1F1F1F` Tinte, `#E6B23C` Gold |
| Kontrast | hell auf dunkel oder umgekehrt? | dunkle Schrift auf hellem Grund |
| Linien | Stärke (px bei 1080p), Ende rund/eckig, sauber/zittrig | 6 px, rund, leicht unperfekt |
| Formen | Ecken-Radius, flach/Schatten/Verlauf | flach, Radius 16, kein Schatten |
| Schrift | Überschrift/Text/Untertitel: Art (Grotesk, Serif, Hand), Gewicht, Großbuchstaben? | Handschrift fett, Versalien |
| Figuren | Kopf-Körper-Verhältnis, Augen, Mund, Arme, Farbe | große runde Köpfe, Punktaugen, Strichglieder |
| Hintergrund | einfarbig, Papier, Verlauf, Szene, Körnung, Vignette | Papier mit leichtem Korn |
| Bewegung | Pop/Slide/Typewriter, Überschwinger, Kamera (still/Push/Wackeln) | Pop mit Überschwinger, Kamera still |
| Schnitt | Bildwechsel pro Minute, Übergänge (hart/Blende) | 20/min, harte Schnitte |
| Text im Bild | wie viel, wo, Untertitel ja/nein | ein Schlagwort oben, Untertitel unten |
| Ton | Musikstil, SFX-Dichte, Art (weich/kräftig) | leise Lo-Fi, 2 SFX/min, weich |
| Thumbnail | Aufbau, Textmenge, Gesichter, Farben | Split + 2 Wörter + Karikatur |

## Vage Wörter übersetzen
- „clean“ → wenige Elemente, viel Leerraum, ein Effekt pro Bereich, 1 Akzentfarbe.
- „hochwertig“ → weiche Verläufe/Körnung statt Flächen-Neon, Serif- oder gut gesetzte Grotesk, langsamere Bewegungen (ease-out 0,4–0,6 s).
- „verspielt“ → runde Formen, Überschwinger, Handschrift, kräftige Farben.
- „krass/dynamisch“ → Kinetic Type, Stöße auf Schlag-Wörtern, 25+ Wechsel/min, kräftige SFX.
- „leichter Blur“ → max. 2–4 px.

## Nachbauen ohne zu kopieren
Übernehmen: Prinzipien (Palette-Logik, Linienstärke, Bewegungsart, Tempo). Ändern: mindestens Akzentfarbe **oder** Figur **oder** Markenzeichen; nie fremde Figuren, Logos, Namen, Intro-Jingles, Thumbnail-Motive 1:1.
