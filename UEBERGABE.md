# Übergabe: Stand aller Chats (23.11.2026)

> Claude: Lies nach `CLAUDE.md` diese Datei ganz. Sie ist das Gedächtnis aus den Cloud-Chats vom 18.–23.11.2026 (Video-Chat und Website-Chat). Danach kannst du genau dort weitermachen.

## 1. So geht es lokal weiter (einmalig)
1. Repo klonen: `git clone https://github.com/davidzabudkin-cpu/master.git REMIRA-Claude-Kit` (oder das ZIP `REMIRA-Claude-Kit-komplett.zip` entpacken).
2. Claude Code im Ordner `REMIRA-Claude-Kit` starten. `CLAUDE.md`, diese Datei und alle 19 Skills unter `.claude/skills/` werden automatisch gefunden.
3. Einmal einrichten: Python ≥ 3.10 mit `pip install numpy scipy pillow` (für die Inventur-Heldenbilder zusätzlich `opencv-python-headless`), ffmpeg, Node.js. Dann in **jedem** Ordner unter `remira/projekte/` (`oms-video`, `plattform-animation`, `warenwirtschaft-video`, `erklaervideo-v2-inventur`): `npm install` und `npx playwright install chromium`. Prüfen: `python werkzeuge/check_setup.py`.
4. Ergebnisse immer committen und pushen, dann wissen alle Chats (lokal und Cloud) denselben Stand.

Hinweis: In der Cloud lief Playwright über `PLAYWRIGHT_DIR=/opt/node22/lib` (vorinstalliert). Lokal ist das nicht nötig, `npm install` holt Playwright 1.47.2 (fest in `package.json`).

## 2. Chronik Video-Chat (18.–23.11.2026)
1. **Kit-Prüfung (18.11.):** Zwei ZIPs + zwei Videos vom privaten PC geprüft. Korrigiert: Namen von Kolleginnen/Kollegen und private Angaben entfernt (REMIRA-Datenschutzregel, nur Rollen), Anleitung für zwei ZIPs, Videos an die Pfade gelegt, `package.json` Inventur, Phosphor-Lizenz, Großschreibung REMIRA in Dateinamen, Prüfskripte ohne `.mvd`-Konfiguration lauffähig.
2. **Lizenz Motion Video Director:** `src/render.js` war die Vorlage aus dem gekauften Skill (Einzelnutzer-Lizenz). Komplett neu geschrieben (eigener Code, kein lokaler Webserver, `page.route`), `.mvd/` entfernt. OMS-Video Bild für Bild mit altem Renderer verglichen: identisch. Lizenztext des gekauften Skills ist **noch nicht geprüft** (liegt auf dem privaten PC / in der Kaufbestätigung): klären, ob die damit erstellten Videos kommerziell für REMIRA genutzt werden dürfen.
3. **Neu-Render OMS + Plattform mit eigenem Renderer:** Ton bitgenau übernommen (`--audio ALT.mp4` kopiert die Tonspur). Bild nur in Kantenglättung abweichend (Chromium-Version). OMS-Endkarte: Claim-Breite war browserabhängig (`measureText('x')`) → jetzt feste Breite.
4. **Zweisprachig:** OMS-Video jetzt DE + EN (`src/texte.js`), Plattform-Animation EN + DE (`src/data.js` mit `pick`). `--lang de|en` im Renderer, `VIDEO_LANG=en` für `dump_cues`/`stills`. EN-OMS und DE-Plattform sind eigene Übersetzungen → **vor Veröffentlichung von Marketing freigeben**. Die Plattform-Grafik gibt es auf remira.com/de nur auf Englisch (keine offiziellen deutschen Modulnamen).
5. **remira.com freigegeben** in der Cloud-Umgebung (Netzwerkzugriff „Eingeschränkt“, Domains `remira.com`, `www.remira.com`, `*.remira.com`). unpkg.com ist gesperrt → Phosphor-Icons über `npm pack @phosphor-icons/core@2.1.1`.
6. **Warenwirtschaft-Video (WWS):**
   - v1 (18.11.): fast 1:1 OMS → verworfen („soll anders aufgebaut sein, passend zum Thema“).
   - v2 (18.11.): eigener Aufbau nach Skill `storyboard`: Regal → Warenstrom → Kreislauf → kaputtes Regal (Problem) → Bestands-Dashboard (Nachbestellung, Umlagerung) → Datendrehscheibe → Bestandslinie (Zickzack → grüner Korridor) → Endkarte B. Gesichert als `REMIRA-WWS-Erklaervideo-DE-v2.mp4` / `-EN-v2.mp4`.
   - v3 (23.11., aktuell): Feedback umgesetzt: **eigene Musik** (100 BPM, G-Dur/E-Moll, Marimba, Shaker, gebrochener Beat, Tom-Fills, keine Claps), **ruhigeres Tempo** (Warenstrom: erst Satz, dann Kacheln, dann 4 Kartons; „So funktioniert ein WWS“ in Stufen ① Datenstrom → ② Dashboard → ③ Nachbestellung → Umlagerung), **Widget-Fix** (dritte Bestandszeile lag unter dem Rechteck), strengere Lesezeit (2,5 Wörter/s + 1 s), 81 s, DE + EN.
   - Quellen: remira.com/de/glossar/warenwirtschaftssystem, remira.com/de/produkte/warenwirtschaft-software (`SKRIPT.md` mit Quelle je Zeile).
   - **Offen:** Freigabe der Problem-Szene (abgeleitet), des Slogans „Alle Waren. Ein System.“ (Vorschlag) und der EN-Übersetzung („Merchandise Management System (MMS)“). Feedback zu v3 steht noch aus.
7. **Ton-Technik:** `loudnorm` fiel bei leisem Intro in den dynamischen Modus → WWS nutzt `tools/master.py` (linear auf −16 LUFS + Limiter). Intro-Pegel am OMS gemessen.
8. **GitHub:** Privates Repo `davidzabudkin-cpu/master` (Branch `main`) mit allem. Hinweis an David: mit der IT klären, ob es in eine REMIRA-Organisation gehört (Firmeninhalte auf persönlichem Konto).

## 3. Website-Chat („REMIRA-Website auf HubSpot optimieren“)
Stand: **noch keine Ergebnisse.** Der Chat hat nachgefragt und wartet seit 18.11. auf Bestätigung (Repo einbinden). Neu starten mit diesem Auftrag:

> Unsere Website remira.com wird in HubSpot (CMS) gebaut und verwaltet. Überlege mit mir, welche Teile wir optimieren können, so dass es in HubSpot umsetzbar ist (Themes, Templates, eigene Module, HubL, Design Manager, Snippets, CSS/JS im Theme). Lies `CLAUDE.md` und den Skill `website` (`references/premium-interaktion.md`, `mobile-und-tempo.md`, `design-system.md`). Liefere ein kurzes Audit (Desktop 1440 px und Handy 390 px mit Playwright-Screenshots; Ladezeit, Bildgrößen, Lighthouse wenn möglich; Struktur, Lesbarkeit, Conversion/CTAs, Branding-Konsistenz) und daraus eine priorisierte Liste. Ordne jede Maßnahme ein: (a) direkt im HubSpot-Editor, (b) eigenes HubSpot-Modul/Template, (c) Entwickler/Agentur. Frag danach nach HubSpot-Stufe (CMS Hub Starter/Pro/Enterprise) und Rechten, bevor du Module baust. Nur öffentliche Infos, nichts in HubSpot ändern ohne Freigabe, Kundenzitate mit Personennamen nicht übernehmen. Ergebnisse nach `remira/website-optimierung/` committen.

## 4. Offene Punkte (Priorität)
1. WWS v3: Feedback von David/Marketing einholen, Texte freigeben lassen.
2. Lizenztext Motion Video Director prüfen (kommerzielle Nutzung der Ergebnisse).
3. Website-Audit starten (Auftrag oben).
4. OMS-Video: Claps ab 0:11 evtl. ganz raus; dann neue Musik nötig (der OMS-Ton stammt teils aus Fassung v5, die nicht im Repo ist → Tonspur ist nur noch im MP4 vorhanden).
5. Plattform-Animation: alte Flächen-Musik evtl. durch dynamische ersetzen; deutsche Modulnamen von Marketing bestätigen lassen.
6. Inventur-Video: Stimmdateien fehlen (ElevenLabs, privat) → nur mit freigegebenem Stimm-Tool.
7. Repo-Standort (persönliches Konto vs. REMIRA-Organisation) mit IT klären.

## 5. Wichtige Befehle
```
# WWS (analog für andere Projekte, siehe PROMPTS.md im Projektordner)
cd remira/projekte/warenwirtschaft-video
node tools/dump_cues.mjs && VIDEO_LANG=en node tools/dump_cues.mjs     # Lesezeit DE/EN
python tools/mix.py cache/audio/mix.wav && python tools/master.py cache/audio/mix.wav cache/audio/master.wav
node src/render.js --from 40 --to 56 --fps 10 --scale .5 --out cache/probe --jpg      # Schnelltest
VIDEO_LANG=en node tools/stills.mjs cache/stills 16 47 51                             # Standbilder
node src/render.js --lang de --out . --name "REMIRA-WWS-Erklaervideo-DE-v4" --audio cache/audio/master.wav
```
Alte Fassungen vor dem Überschreiben als `-vN` sichern (Regel in `CLAUDE.md`).
