# Szenenplan + Animation: erst die Bewegung planen, dann das Material bauen

Kernregel: **Für jede wichtige Stelle zuerst festlegen, welche Bewegung den Satz erklärt.** Danach entsteht genau das Material dafür. Nie umgekehrt („Bild gemacht, irgendwie bewegt“).

## 1. Szenenplan (`szenenplan.md` oder als Code `plan.py`)
| Satz-ID | Gesagt | Schnittwort | Bild/Grafik | Bewegung, die es erklärt | Werkzeug | Schild | Kosten |
|---|---|---|---|---|---|---|---|
| H01 | „Juli 2026. Leopold …“ | Juli | Figur vor Gebäude | Namensschild gleitet herein | Bild + Code | „JULI 2026“ | 0 |
| B03 | „700 Mrd. = 1.000 $/s für 22 Jahre“ | seven | – | Zähler läuft, Tag/Nacht wechselt immer schneller | Code (`counter`) | – | 0 |

- Jede Zeile: **GRAFIK** (Code), **GLEICHE GRAFIK** (läuft weiter), **SZENE** (Bild/Clip).
- Bewährte Mischung für einen bildbasierten Stil: ~65 % vollflächige Szenenbilder, ~13 % Text-/Kapitelkarten, ~13 % Code-Grafiken, ~8 % Clips. **Hybrid heißt nicht „Figuren auf leerem Papier“** – Code-Grafiken nur für Zahlen/Diagramme/Abläufe.
- Reiner Code-Stil (z. B. Kinetic-Type-Explainer): dann ~100 % Code, aber mit Abwechslung (Ortswechsel, Karten, Icons, Figuren-Sprites).

## 2. Dichte und Tempo
- Hook: alle 1–3 s ein neues Bild/eine Bewegung, **nacheinander statt übereinander** (getippte Datumszeile → Figur mit Namensschild → Animation).
- Danach: an jeder Zahl, jedem Mechanismus, jeder Aufzählung eine Animation; sonst Bildwechsel alle 2–5 s.
- **Kein Bild kürzer als ~1,5 s** im fertigen Video, keines länger als ~5–6 s ohne neue Bewegung (lange Sätze an der größten Sprechpause teilen).
- Aufzählungen im Satz („ein Haus, eine Straße, eine Stadt“) → drei Bildkarten auf die drei Wörter.
- Grafik mind. ~3 s stehen lassen; nicht erst aufs letzte Wort setzen.

## 3. Werkzeug wählen (das billigste, das die Bewegung sauber kann)
| Werkzeug | Wofür | Kosten |
|---|---|---|
| **Code-Grafik** (`motion-kit`) | Zahlen, Zähler, Balken, Kurven, Pfeile, Ampeln, Haken, Vergleiche, Listen, Kapitelkarten, Text | 0 |
| **Standbild + leichte Bewegung** | ruhige Szenen: Figur „atmet“ (±0,6 % Skala), Licht/Regen/Funken als Ebene | 0 (+ Bild) |
| **Kamerafahrt über ein hohes Bild** | „oben … darunter …“ (Geldberg → Kredit-Stapel → Firmen) | 1 Bild |
| **Code über Bild** | Elemente aus einem KI-Bild freistellen und per Code bewegen (Fließband, Münzen im Kreis) – wenn Clip-KI gleichmäßige Bewegung verdirbt | 1–2 Bilder |
| **KI-Clip mit Start- + Endbild** | eine Figur tut eine Handlung mit klarem Ende (nimmt Geld, setzt sich) | Clip + 2 Bilder |
| **KI-Clip nur Startbild** | kleine natürliche Bewegung (gehen, winken) | Clip |

**Nicht mehr verwenden:** Zoom-Überblendung in Gebäude, Clip-KI für gleichförmige Fließbänder, starke Ausschnitt-Vergrößerungen als „Nahaufnahme“ (wirkt wie krasser Zoom → lieber neues Bild), Rein-raus-Zoomen, Wackeln.

## 4. Clips
- Eine Handlung pro Clip, Richtung angeben, „Text und Schilder bleiben exakt gleich, kein Zoom, keine neuen Figuren, kein Morphing“.
- Endbild-Paar: Endbild mit dem Startbild als Referenz erzeugen („Später Moment derselben Szene: …“).
- Günstig + scharf: niedrige Auflösung generieren und lokal mit Real-ESRGAN (`realesr-animevideov3`, ×3) hochskalieren – ffmpeg-Skalierung reicht sichtbar nicht. Bei realistischen Stilen lieber direkt 720p+.
- QA: 8 Standbilder pro Clip ansehen (Stil, Figuren, Text, Ende der Bewegung).

## 5. Clip-Länge an die Szene anpassen
- Clip länger als Szene → leicht beschleunigen, damit das Ende sichtbar ist.
- Clip kürzer → letztes Bild friert ein und wirkt wie „bleibt stehen“ → strecken (max. ±25 %, sonst ruckelt es) oder Szene teilen.
- Code-Grafiken: Dauer = Satzdauer, Elemente auf ihren Wörtern, fertig bei ~70 %.
- **Kein Aufblitzen an Satzgrenzen:** Grafiken, die über mehrere Sätze laufen, exakt an der Grenze schneiden (sonst erscheint ein Element kurz doppelt).

## 6. Schilder und Text im Bild
- Jahreszahlen, Orte, echte Namen sichtbar machen, wenn sie gesprochen werden (Schild in einer freien Ecke).
- Nebenfiguren mit Stimme sofort einordnen: Schild „NAME · ROLLE“.
- Bei genannten Apps/Marken deren bekannte Icons groß aufs Wort (selbst gezeichnet, nicht als Logo-Datei).
- Wenig Text im Bild, nie über Gesichtern/Köpfen oder dem Hauptmotiv, nie am Rand.
