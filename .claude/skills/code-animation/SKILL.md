---
name: code-animation
description: Animation per Code (0 Credits) – wählt die passende Engine und erklärt sie: motion-kit (Python, Motion Graphics, Kinetic Type, Shorts, Untertitel), Sirios HTML-Boards (Erklär-Boards im Browser, wortgenau synchron), Figuren per Sprite/Rig, 3D-Story-Shorts (Remotion + three.js), Motion-Ebene über KI-Filmen. Nutzen, wenn etwas „mit Code animiert“ werden soll, ohne Higgsfield/KI-Video, wenn eine Szene, Figur, Intro, Outro, Logo-Animation, Kinetic Typography, Kapitelkarte oder ein ganzes Video per Code entstehen soll, oder wenn unklar ist, welches Animationswerkzeug passt.
---

# Animation per Code

Warum Code: 0 Credits, Figuren und Text sehen immer gleich aus, jedes Bild ist wiederholbar, typische KI-Fehler (dritter Arm, Kauderwelsch-Schrift, springende Objekte) gibt es nicht. Grenze: schlichter als KI-Bilder – deshalb ist **Hybrid** (KI-Bilder für Szenen/Figuren + Code für alles Erklärende) oft der beste Look.

## Welche Engine?
| Aufgabe | Engine | Wo |
|---|---|---|
| Zahlen, Diagramme, Listen, Kinetic Type, Kapitelkarten, Shorts mit Untertiteln, Intro/Outro, ganzes Code-Video | **motion-kit** (Python) | `motion-kit/` – Standard |
| Erklär-Boards im Browser-Look, 70+ fertige Bewegungsvorbilder, wortgenauer Sync per Whisper | **Sirio-Boards** (HTML + Chrome-Export, MIT) | `werkzeuge/sirio-motion-graphics/` (START-HERE.md) |
| Figuren, die sich bewegen | **Sprites** (freigestellte Figurenblatt-Posen) in motion-kit: `c.sprite(...)` / `c.image(...)` | siehe unten |
| Strichfiguren mit Posen, Gehen, Gesichtern (Story-Filme) | eigenes Rig per Code (Regeln in `story-film`) oder ein Figuren-Rig-Kit (siehe „Fremde Engines“) | |
| 3D-Welt mit 2D-Cartoon-Figuren, gleitende Kamera | **cartoon-3d-short** (Remotion + three.js, MIT) | Skill `cartoon-3d-short` |
| Motion-Design über einem KI-Film (Glow, Funken, Blitz, Labels, Endkarte) | motion-kit Bild für Bild über das Video | Skill `produktfilm` |
| Website-Animationen | CSS/JS | Skill `website` |

## Arbeitsweise (gilt für alle Engines)
1. **Timing gehört einer Datei:** Wortzeiten (`werkzeuge/whisper_words.py`) bzw. Szenenplan. Jedes Element erscheint auf seinem Wort (`mk.word_time`).
2. **Stil aus `stile/<name>/style.json`** laden – nie Farben/Schriften im Szenen-Code festschreiben. So wechselt man den Look mit einer Zeile.
3. Szenen in Paketen à 8–12 bauen → **Kontaktbogen ansehen** (`v.contact_sheet`) → fixen → 30-s-Vorschau (`render(..., start, end, preview=True)`) → erst dann Final-Render (im Hintergrund).
4. Deterministisch: kein Zufall ohne festen Seed, keine Uhrzeit im Code.
5. Endbild jeder Szene prüfen (läuft die Bewegung zu Ende?).
6. Renderzeit: motion-kit ~3–6 Bilder/s bei 1080p → 10 min Video ≈ 1–1,5 h. Lange Renders im Hintergrund starten.

## Figuren per Code (Hybrid, bewährt)
- Code-gezeichnete Figuren wirkten im Test „anders“ als die KI-Figuren → **Figuren lieber aus einem KI-Figurenblatt** (4 Posen, gratis erzeugt) freistellen und per Code bewegen.
- Posen-Bibliothek: `figuren/<name>/stand.png, zeigt.png, schock.png, denkt.png, schulterzucken.png …`, Fußpunkt unten.
- `c.sprite([(0, "stand.png"), (T("aber"), "schock.png")], t, x, y_fuss, h=600)` → Posenwechsel auf dem Wort mit kurzem Stauchen, leichtes Atmen.
- Posen wechseln mit der Aussage: Frage → denkt, Schock → schock, Regel → zeigt, Wendung → Augenbraue, offene Frage → Schulterzucken.
- Freistellen: Figur auf einfarbigem Grund erzeugen, dann z. B. `rembg` oder Farbschwelle mit Pillow; Kontrolle auf farbigem Hintergrund (Lücken zwischen Armen/Beinen weg, Bodenschatten weg).

## Eigenes Strichfiguren-Rig (wenn reiner Code-Stil gewünscht)
Bewährte Regeln: Glieder als gerade Stäbe, die sich nur an Schulter/Hüfte drehen; Gehen als Pendel mit festem Standfuß (5 Frames/Schritt, kein Rutschen); Gesicht = zwei Punkt-Augen + Brauen; Blinzeln alle 3,5–4 s (3 Frames); Ellbogen nach außen; jede Hauptfigur eigene Farbe + Merkmal. Als neue Methode in `motion-kit/mk.py` bauen (ImageDraw-Linien + Kreise) und in `motion-kit/README.md` eintragen.

## Motion-Stil-Wissen (aus Brand-Reels und Produktfilmen)
- Helle, weiche Verläufe (Mesh/Pastell) wirken hochwertiger als Nacht-Look; ein **Markenzeichen** (z. B. ein glühender Punkt) spielt die Hauptrolle, springt von Wort zu Wort, wird Satzpunkt.
- Kinetic Type darf mutig sein (Wörter springen, schwellen an, Echo-Spuren); Linien gleiten elegant von Ort zu Ort.
- Outro „sehr Studio“: nur Verlauf + Logo, das zart erscheint.
- Blitze/Licht **normal überlagern, nicht additiv** (sonst werden sie auf Blau lila).
- Wenig Text, die Markenelemente animieren.

## Fremde Engines (nicht im Kit – selbst besorgen, Lizenz beachten)
- **aiTrends 2D Studio** (Canvas + Three.js, Figuren-Rig mit 28 Posen/18 Ausdrücken, Whisper-Sync, Render in headless Chromium): stammt aus einem YouTube-Tutorial/Plugin, im Kit nicht enthalten, weil keine Lizenzdatei dabei war. Wer es nutzt: Technik übernehmen (shots.json besitzt das Timing, `wordTime()`, Kontaktbogen vor dem Render), den dunklen Kino-Look nach Geschmack ersetzen.
- **Motion Video Director** (gekaufter Skill, Einzelnutzer-Lizenz): Regeln fürs Sounddesign und Motion. Darf nicht weitergegeben werden – bei Bedarf selbst kaufen.
- **Remotion** (React-Videos, `npx create-video`): gut für Web-Entwickler; für Firmen ab einer bestimmten Größe lizenzpflichtig – vorher prüfen.
