# Start hier – so richtest du das Kit auf dem Arbeitskonto ein

## 1. Einrichten (einmal, ca. 10 Minuten)
1. **Beide ZIPs** (Teil 1 Skills, Teil 2 Projekte) in **denselben** Ordner entpacken, z. B. `Dokumente/`. Beide enthalten den Ordner `REMIRA-Claude-Kit` – Teil 2 ergänzt darin den Ordner `remira/` (mit den fertigen Videos). Beim Nachfragen „Zusammenführen/Ersetzen“ → ja.
   Kontrolle: In `REMIRA-Claude-Kit` liegen danach `CLAUDE.md`, `.claude/` (versteckt) **und** `remira/`.
2. **Claude Code** (Desktop-App → Code-Tab, oder Terminal `claude`) mit dem **Arbeitskonto** anmelden.
3. Den Ordner `REMIRA-Claude-Kit` als **Arbeitsordner** öffnen. Claude liest dann automatisch `CLAUDE.md` und findet alle Skills in `.claude/skills/`.
4. Für Videos einmal installieren: Python (mit `pip install numpy scipy pillow`), ffmpeg und Node.js. Danach in Claude sagen: „Prüf mein Setup und richte die Video-Projekte ein“ – Claude führt `python werkzeuge/check_setup.py` aus und in **jedem** Ordner unter `remira/projekte/` `npm install` und `npx playwright install chromium`.
5. Im Modell-Menü **Fable 5.2** wählen, wenn du Websites oder Motion-Videos baust.

Optional: Die Skills auch ohne diesen Ordner nutzen → Ordner aus `.claude/skills/` nach `~/.claude/skills/` (Mac: `/Users/<du>/.claude/skills/`) kopieren.

## 2. Erste Nachricht an Claude
> Lies zuerst `CLAUDE.md` ganz und sag mir in 5 Zeilen, wer ich bin, wie du mit mir arbeitest und welche REMIRA-Projekte es gibt.

## 3. Typische Aufträge (einfach so diktieren wie immer)
- „Hier ist das Skript und der Link zum Glossarartikel [X]. Mach daraus ein Video wie das OMS-Video.“
- „Hier ist Feedback aus dem Marketing [Screenshot]. Schau dir die Stellen an und setz es um.“
- „Bau eine Demo-Seite für [Modul] wie eine 10.000-€-Website, mit Fable.“
- „Animier diese Grafik [Screenshot] im REMIRA-Stil.“

## 4. Was drin ist
| Ordner | Inhalt |
|---|---|
| `CLAUDE.md` | **das Gehirn:** wer du bist, wie du redest, Arbeitsweise, Geschmack, REMIRA-Regeln, Projektstand |
| `.claude/skills/` | 19 Skills (Auftrag verstehen, Storyboard, REMIRA-Video, Phosphor-Icons, Website, Code-Animation, Produktfilm, …) |
| `remira/` | Branding + Heroes, Video-Projekte mit Code (OMS, Plattform, Inventur), Demo-Websites, Schulung, Rechtsleitfaden |
| `motion-kit/`, `stile/`, `werkzeuge/`, `vorlagen/`, `wissen/` | Code-Engine, Stile, Hilfsskripte, Vorlagen |
| `LIZENZEN.md` | was frei ist und was bewusst fehlt |
