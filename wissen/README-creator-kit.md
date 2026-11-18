# Claude Creator-Kit – START HIER

Eine fertige Werkstatt für Claude Code: YouTube-Videos (Skript, Animation, Schnitt), Shorts, Thumbnails, eigener Stil/Branding, Animation per Code, Produktfilme und Websites. Du sagst Claude, was du willst – das Kit sagt Claude, **wie** es geht und welche Schritte in welcher Reihenfolge kommen.

Alles stammt aus echten Projekten (ein YouTube-Erklärkanal mit 15+ Videos, Kurzfilme, Produktfilm, Studio-Website) und ist so umgeschrieben, dass es für **jeden Kanal und jeden Stil** passt.

---

## 1. Einrichten (einmal, ~15 min)
1. **Claude Code** installieren: https://claude.com/claude-code (Desktop-App oder Terminal).
2. **Python 3.10+** (https://python.org, beim Installieren „Add to PATH“ anhaken) und dann:
   ```bash
   pip install pillow numpy
   ```
3. **ffmpeg** (Video/Audio): Windows `winget install Gyan.FFmpeg` · Mac `brew install ffmpeg`.
4. Optional: `pip install faster-whisper` (Wortzeiten aus deiner Stimme), Node.js (Websites, 3D, HTML-Boards), Higgsfield-Konto (KI-Bilder/Videos/Stimmen – nicht nötig für den Code-Weg).
5. Diesen Ordner irgendwo hinlegen, in Claude Code **diesen Ordner öffnen** und schreiben:
   > Lies CLAUDE.md und prüf mit werkzeuge/check_setup.py, ob alles installiert ist.
6. Test: > Render die Demo in allen 5 Stilen und zeig mir die Kontaktbögen.

## 2. Loslegen – Beispiel-Prompts
- **Erster Schritt:** > Hilf mir, meinen Kanal festzulegen (Thema, Zielgruppe, Stil) und trag es in CLAUDE.md unter „Mein Kanal“ ein.
- **Stil:** > Hier sind 4 Screenshots von Kanälen, die ich mag. Analysier den Stil und bau mir einen eigenen daraus – zeig mir 3 Varianten.
- **Video:** > Mach ein Video über „Warum ist Kaffee so teuer geworden?“. Referenzen: [YouTube-Link], [Transkript]. Stil: clean-hell. Schreib ein krasses Skript und plan die Animationen.
- **Nur Code, 0 Credits:** > Animier diese drei Zahlen per Code im Stil kreidetafel, 20 Sekunden.
- **Shorts:** > Mach aus dem fertigen Video 2 Shorts.
- **Thumbnail:** > 10 Titel und 5 Thumbnail-Konzepte für mein Video.
- **Website:** > Bau mir eine Landingpage für meinen Kanal.

Claude nutzt dafür automatisch die passenden Skills (Weiche: Skill `werkstatt`). Du musst die Skills nicht kennen.

## 3. Was drin ist
| Ordner | Inhalt |
|---|---|
| `CLAUDE.md` | Anleitung für Claude (Regeln, Skill-Übersicht, „Mein Kanal“) |
| `.claude/skills/` | 13 Skills: werkstatt, brief, stil-studio, yt-video, erklaer-grafik, code-animation, yt-thumbnail, yt-shorts, story-film, produktfilm, website, higgsfield-praxis, cartoon-3d-short |
| `motion-kit/` | Animations-Engine per Code (Zähler, Balken, Vergleiche, Zeitleisten, Kinetic Type, Untertitel, Sounds) |
| `stile/` | 5 Stile zum Aussuchen: doodle-papier, clean-hell, dunkel-kino, mesh-pastell, kreidetafel (+ Vorlage) |
| `werkzeuge/` | Wortzeiten, Thumbnail-Text, Tempo-Fassung, Kontaktbogen, Setup-Check, Sirio-Boards |
| `vorlagen/` | Brief, Faktentabelle, Skript, Szenenplan, Kosten-Ledger, Upload-Paket |
| `wissen/` | Was funktioniert hat und was nicht (Methoden, Fallstudien) |
| `projekte/` | deine Videos |

## 4. An deinen Stil anpassen
- **Eigener Stil:** Skill `stil-studio` → neuer Ordner `stile/<dein-stil>/`. Alle Grafiken, Thumbnails und Bild-Prompts nutzen ihn automatisch.
- **Dein Geschmack:** Sag Claude bei jedem Feedback „schreib das in die Checkliste/den Stil“. Die Skills sind normale Textdateien – du (oder Claude) kannst sie jederzeit ändern.
- **Neue Skills:** Wenn du etwas oft machst: > Mach daraus einen Skill.

## 5. Skills überall nutzen (optional)
Die Skills wirken automatisch, wenn Claude Code in diesem Ordner läuft. Für alle Ordner: Inhalt von `.claude/skills/` nach `~/.claude/skills/` kopieren (Windows: `C:\Users\<du>\.claude\skills\`). Dann aber Pfade wie `motion-kit/` mit dem Kit-Pfad angeben.

## 6. Kosten
Der Code-Weg kostet nichts außer deinem Claude-Abo. KI-Bilder/Clips/Stimmen kosten Credits – Claude nennt vorher den Preis und fragt. Richtwert für ein 10-min-Video: 0 Credits (Code + eigene Stimme) bis ~100–160 Credits (gratis Bilder + KI-Stimme + wenige Clips).

## 7. Nicht enthalten (Lizenzgründe)
Zwei Werkzeuge aus dem Original-Setup durften nicht weitergegeben werden (gekaufter Skill bzw. ohne Lizenz) – siehe `LIZENZEN.md`. Das Kit funktioniert ohne sie.
