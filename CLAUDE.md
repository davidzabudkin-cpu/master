# REMIRA-Claude-Kit – Davids Arbeitsumgebung

> Claude: Lies diese Datei zuerst, ganz, danach `UEBERGABE.md` (Gedächtnis und Stand aus den Cloud-Chats bis 23.11.2026, offene Punkte). Sie ersetzt einen langen gemeinsamen Verlauf aus früheren Sitzungen. Danach weißt du, wer David ist, wie er redet, wie du arbeitest, was er mag und was schon fertig ist. Arbeite so, als hättest du die letzten Wochen mit ihm verbracht.

## 1. Wer David ist
- **David**, Marketing bei **REMIRA** (Dortmund; Software für Supply Chain Management und Omnichannel Commerce).
- Er baut mit Claude **Motion-Design-Videos, Grafik-Animationen, Websites/Landingpages, Präsentationen und Texte** für REMIRA. Er hat dem Marketing-Team am 11.11.2026 eine KI-Schulung gegeben.
- Feedback kommt auch aus dem **Marketing-Team** (meist per Teams-Screenshot): Design-Feedback und Text-Feedback (Zeichensetzung); Videos gehen über die Video-Freigabe im Team. Dieses Feedback ist genauso verbindlich wie Davids. Namen von Kolleginnen und Kollegen werden hier bewusst nicht gespeichert (REMIRA-Datenschutzregel).

## 2. Wie David redet
- **Deutsch, locker, direkt.** Er **diktiert** fast immer (Sprache-zu-Text): lange, sprunghafte Nachrichten, Füllwörter („quasi“, „genau“, „dementsprechend“), Sätze brechen ab.
- **Verhörer:** „Cloud“ = Claude · „Fabel/Fable“ = Claude Fable 5.2 · „Remia/Remiro“ = REMIRA · „Hixfield“ = Higgsfield · „Pfosten-Icons“ = Phosphor-Icons.
- **„lassen“ heißt oft „weglassen“** – im Zweifel fragen.
- Er schreibt oft „und“ am Ende, ohne den Satz zu beenden: dann mit dem Gesagten arbeiten, nicht nachfragen.
- Er schickt Screenshots mit roten Markierungen: Markierung = genau diese Stelle ist gemeint.

## 3. Wie du arbeitest (Pflicht, in dieser Reihenfolge)
0. **Datenschutz:** Keine personenbezogenen Daten verarbeiten (Ausnahme: geschäftliche E-Mail-Adressen @remira.com) und keine Secrets/Kennwörter. Feedback-Geber nur als Rolle nennen („Marketing, 16.11.“), nie mit Namen – auch nicht in Skills (`skill-schmiede`).
1. **Erst verstehen** (Skill `auftrag-verstehen`; bei langen Diktaten `diktat-zu-brief`): Wozu, Ergebnis, Maßstab, Skill-Kette. Bei Feedback zu einem Video erst die genannte Stelle als Standbild ansehen, dann deuten, Deutung in 1–2 Zeilen nennen, dann umsetzen.
2. **Regeln vor dem Bauen lesen:** den zuständigen Skill samt Regel-/Fehlerabschnitt (REMIRA-Video → `remira-erklaervideo` + `remira-phosphor-icons`; Website → `website` + `references/premium-interaktion.md`).
3. **Selbst prüfen, bevor du zeigst:** Videos als Standbilder an jeder Szene + Endkarte in voller Auflösung, Messungen statt Augenmaß (Ausrichtung in Pixeln, Lautheit in LUFS). Websites bei 1440 px und 390/360 px. Du kannst nicht hören: Ton immer als „gemessen, nicht angehört“ kennzeichnen.
4. **Kurz antworten:** Ergebnis in der ersten Zeile, 3–8 Zeilen, Details in Dateien, höchstens **eine** offene Frage am Ende (mit Empfehlung). Keine Floskeln, kein Nacherzählen.
5. **Ehrlich:** Was nicht geprüft oder schwach ist, steht da. Lieber unbequem als schöngeredet.
6. **Korrektur = Fehlerklasse:** alle Vorkommen beheben, nicht nur das genannte. Alte Fassung vorher als `…-vN` sichern. Kleine Änderung = kleiner Eingriff (nur betroffene Szene neu rendern).
7. **Skill-Schmiede am Ende jeder Aufgabe** (Skill `skill-schmiede`): neue Regel in den zuständigen Skill schreiben, in einer Zeile melden.
8. **Bei langen Läufen** (Rendern, Bildserien) zwischendurch kurz den Stand melden. Fertige Dateien direkt mitschicken bzw. den Pfad nennen.
9. **Geschmacksfragen:** lieber zwei Varianten bauen und je ein Standbild zeigen, als lange zu fragen (Beispiel: Endkarte A „mittig“ vs. B „linksbündig“ → David nahm B).

## 4. Modelle
- **Websites und Motion-Design: Fable 5.2** (bestes Modell für Design + Code) – im Modell-Menü wählen. Für schnelle Texte reicht Sonnet, für schwere Aufgaben Opus.
- David sagt manchmal ausdrücklich, welches Modell er will („nutze Fable“, „nicht Fable, sondern Opus“) – dann genau das.

## 5. Davids Geschmack
**Videos/Motion**
- Cinematic, edel, ruhig. Ein Blickfang pro Moment. Kamerafahrten zwischen Szenen statt Schnitte/Schwarzbilder.
- **Text steht still**, sobald er da ist (kein Wackeln, keine Kamera-Drift) – das war ein großer Kritikpunkt.
- Alles exakt ausgerichtet: Icons mittig zum Text, Aufzählungspunkte auf Texthöhe, Textblöcke bündig. „Das Auge sieht, dass es schief ist“ → nachmessen.
- Musik **dynamisch** (Drums, Bass, kurze Synths), keine Flächen/Kirchen-/Weltall-Sounds; Intro leise; Soundeffekte eher leise. Deutsche KI-Stimmen gefallen ihm nicht.
**Websites**
- „Wie eine 10.000-€-Website“: Maus-Effekte auf Text und eigenen Hintergrund-Ebenen, magnetisches Raster, Tilt-Karten, 3D (Three.js), ein Signature-Element (bei REMIRA der bunte Ring), alles **passend zum Thema**.
- Trotzdem: flüssig vor Effekt (kein Ruckeln/Flackern), Handy zuerst, wenig Text, gut lesbar, Fotos nie verzerren. Details: `website/references/premium-interaktion.md`.
**Präsentationen**
- Wenig Text, viele Bilder/Animationen, interaktiv (Fragen, Abstimmung), Sprechertext in die Notizen.

## 6. Regeln für alles mit REMIRA
- **REMIRA immer in Großbuchstaben** – im Bild, im Text und in Dateinamen (`REMIRA-OMS-Erklaervideo.mp4`).
- **Branding** (`remira/brand/BRANDING-REMIRA.md`): Schrift Source Sans 3/Pro · Schwarz/Weiß · Akzent #41B6E6 · Ringfarben #41B6E6 #28ABBA #61BD47 #FCDA34 #FF9524 #F53D47 · Logo/Ring nur aus Original-Dateien (`remira/brand/remira-logo-claim-white.svg`; Logo ohne Claim, Bildmarke allein und Claim-Varianten als PNG in `remira/brand/logo-pack/`), nie nachzeichnen oder neu zusammensetzen · Icons: **Phosphor light** (seit 23.11., schmal; Skill `remira-phosphor-icons`).
- **Heroes** (Comic-Heldin/-Held): `remira/brand/heroes-hq/` – KI-Nachzeichnungen, sparsam, vor Veröffentlichung mit Marketing abstimmen.
- **Zeichensetzung (Text-Feedback Marketing):** Stichpunkte ohne Punkt, vor Listen ein Doppelpunkt, keine Gedankenstriche als Satzverbindung.
- **Nichts erfinden:** Aussagen nur aus remira.com, Skript oder Glossar-Artikel. Zahlen mit „bis zu“, wenn es so auf der Seite steht.
- **Nur öffentliche Infos** in KI-Tools; keine Kunden-, Vertriebs- oder internen Daten, solange REMIRA das nicht freigegeben hat.
- **Nichts veröffentlichen** ohne Freigabe der Marketingleitung. Demos sind interne Vorschläge.
- Rechtliches (KI-Bilder, Urheberrecht, AI Act, DSGVO): `remira/rechtliches/KI-Rechtsleitfaden-Remira.pdf`.

## 7. Welcher Skill wofür
| Aufgabe | Skill-Kette |
|---|---|
| Jede Nachricht | `auftrag-verstehen` → (lang: `diktat-zu-brief`) |
| REMIRA-Erklärvideo / Motion-Grafik / Plattform-Animation | `storyboard` → `remira-erklaervideo` + `remira-phosphor-icons` → Pipeline aus `remira/projekte/oms-video/` |
| Website / Landingpage / Demo | `website` (+ `references/premium-interaktion.md`), Branding aus Abschnitt 6 |
| Erklär-Grafik, animierte Zahl | `erklaer-grafik`, `code-animation` (Engine `motion-kit/`) |
| Produkt-/Werbefilm mit KI-Clips | `produktfilm`, `higgsfield-praxis` |
| Reels/Shorts, Thumbnails | `yt-shorts`, `yt-thumbnail`, `storyboard` |
| Stil festlegen | `stil-studio` |
| Unklar | `werkstatt` (Weiche) |
| Ende jeder Aufgabe / jede Korrektur | `skill-schmiede` |

## 8. REMIRA-Projekte (Stand 23.11.2026) – alles in `remira/`
| Projekt | Ort | Stand |
|---|---|---|
| **OMS-Erklärvideo** (71 s, 16:9, ohne Stimme, Glossar „Order Management System“) | `remira/projekte/oms-video/REMIRA-OMS-Erklaervideo-DE.mp4` und `-EN.mp4` + Code (Texte beider Sprachen in `src/texte.js`) | 7 Feedback-Runden, Endkarte B. **Offen:** David findet Claps störend (Intro ohne, ab 0:11 noch drin) – evtl. ganz raus. |
| **Plattform-Animation** (21 s, Plattform-Sechseck animiert) | `remira/projekte/plattform-animation/REMIRA-Plattform-Animation-EN.mp4` und `-DE.mp4` + Code (Texte in `src/data.js`) | regelmäßige, weich gerundete Sechsecke, Hintergrund schwarz, Phosphor bold. **Offen:** hat noch die alte Flächen-Musik – evtl. dynamische Musik wie OMS. |
| **Erklärvideo Stichprobeninventur** (Englisch, mit Stimme) | `remira/projekte/erklaervideo-v2-inventur/` | Schulungs-Demo. Bild rendert (Assets am 18.11. wiederhergestellt, Heldenbilder per `tools/hero_frames.py`, braucht `pip install opencv-python-headless`). **Fehlt:** Stimmdateien `assets/vo/*.mp3` (ElevenLabs) und das fertige MP4 – mit Ton erst nach neuer Stimme aus einem freigegebenen Tool. |
| **Warenwirtschaft-Erklärvideo** (95 s, v7: Schritt für Schritt mit Blickführung, eigene Musik, REMIRA-Logo oben rechts; Regal, Warenstrom, Kreislauf, Dashboard, Drehscheibe, Bestandslinie) | `remira/projekte/warenwirtschaft-video/REMIRA-WWS-Erklaervideo-DE-v7.mp4` und `-EN-v7.mp4` (+ `-v2` bis `-v6`) + Code | v7 am 25.11.: offizielles Logo oben rechts; **offen:** Freigabe Texte (Problem-Frage DE/EN, Slogan, EN) |
| **POS-Erklärvideo** (Glossar „POS (Point of Sale)“, geplant ca. 95–100 s, DE + EN) | `remira/projekte/pos-video/` (`STORYBOARD.md`, `SKRIPT.md`) | 25.11.: Storyboard + Skript v1 aus Glossar + Produktseite; **offen:** Go zum Bau, Freigabe Problem-Szene, Slogan, EN |
| **Demo-Websites** | `remira/demos/demo-premium/` (3D-Ring, Maus-Effekte, Fable), `demo-commerce/`, `demo-website/` (Inventur) | Konzept-Demos, intern |
| **KI-Schulung 11.11.** | `remira/schulung/` (Präsentation als HTML, Lernpfad, Spickzettel, Folien-Quelle) | gehalten |
| **Rechtsleitfaden KI** | `remira/rechtliches/` | fertig, keine Rechtsberatung |

Neues Video = Ordner `oms-video` kopieren, `src/data.js`, `src/timeline.js`, Szenen in `src/main.js` anpassen; Befehle in `PROMPTS.md`.

## 9. Technik (einmalig einrichten)
- Python ≥ 3.10 mit `pip install numpy scipy pillow`, **ffmpeg**, **Node.js**. Prüfen: `python werkzeuge/check_setup.py`.
- In jedem Video-Projektordner einmal: `npm install` und `npx playwright install chromium`.
- Renderer `src/render.js` ist eigener Code (kein Teil des gekauften Skills). Optional: `PLAYWRIGHT_DIR`, `CHROMIUM_PATH`, `FFMPEG` als Umgebungsvariablen, falls Playwright/Browser/ffmpeg woanders liegen.
- Higgsfield/ElevenLabs sind nicht Teil des Firmenkontos – nur verbinden, wenn David es ausdrücklich will und die REMIRA-IT einverstanden ist. Ohne sie funktioniert alles, was per Code entsteht (Videos, Grafiken, Websites).

## 10. Gelernt (Davids Korrekturen, damit sie nicht wiederkommen)
- Text wackelte durch Kamera-Drift → Kamera im Stand absolut still (OMS, 12.11.).
- Icons zu dünn → Phosphor **bold** statt regular (12.11.).
- Endkarte wirkte schief → nach Tinte messen, nicht nach Textboxen; Variante B linksbündig gewählt (12.–16.11.).
- Linien liefen durch Kreise, Kreis hinter dem Ring sichtbar, zu viel gleichzeitig bei Übergängen (Marketing, 16.11.).
- Musik „wie Kirche/Weltall“ → dynamisch; Intro zu laut, Claps störend (Marketing/David, 16.11.).
- Aufzählungspunkte nicht auf Texthöhe; REMIRA klein geschrieben (Marketing, 16.11.).
- Sechseck gestaucht → regelmäßig; noch runder; Hintergrund schwarz statt dunkelblau (Marketing, 16.–17.11.).
- Videos neu mit eigenem Renderer (18.11.): Ton bitgenau übernommen, Bild gleich; OMS-Endkarten-Claim jetzt feste Breite statt x-Höhen-Messung (war browserabhängig). Regeln: `remira-erklaervideo` → „Rendern“.
- Zweisprachig (18.11.): EN-OMS und DE-Plattform sind eigene Übersetzungen, vor Veröffentlichung von Marketing freigeben lassen; offizielle Begriffe von remira.com/en bzw. /de haben Vorrang.
- Mastering: `loudnorm` fiel bei leisem Intro in den dynamischen Modus und hob es um bis zu 10 dB an → WWS nutzt lineares Mastering (`tools/master.py`), Intro am OMS-Pegel gemessen (18.11.).
- Neues Video ≠ Kopie: OMS ist Vorlage für Technik, Ring-Faden und Endkarte, aber Szenen, Bildsprache und Kamerapfad werden fürs Thema neu erfunden (WWS v1 war zu ähnlich, 18.11.).
- WWS-Feedback 23.11.: eigene Musik pro Video (nicht den OMS-Track wiederverwenden); nicht zu viel gleichzeitig: erst Text lesen lassen, dann Bild-Ereignisse nacheinander, Szenen in Stufen passend zu ①②③, aber keine langen Leerlauf-Pausen. Lesezeit-Regel jetzt 2,5 Wörter/s + 1 s.
- WWS v4 (23.11., Auftraggeber + Marketing): pro Schritt erst Text + Lesezeit, dann Animation; Rest abdunkeln; Schritt-Nummern groß zwischen Headline und Satz; Problem als Frage einleiten; Intro ≈ 4–5 s; alle Bildtexte fett; Icons light statt bold. Regeln: `remira-erklaervideo` → „Reihenfolge und Blickführung“.
- WWS v5 (24.11., Marketing): Aufzählungen wie die Vorteils-Checkliste aufbauen; Heldin langsam und ≥ 3,5 s sichtbar; Zusatzzeile direkt unter die Headline; REMIRA-Logo oben rechts; Häkchen auf Plaketten bold.
- WWS v6/v7 (25.11., David + Marketing): Logo oben rechts = offizielle Datei `logo-pack/REMIRA_Logo_white.png`, ca. 290 px, Abstand zu Headlines messen. Eigenes Zusammensetzen aus der Claim-SVG (v6) war falsch: Bildmarke zu groß.
- Neue Lehren hier und im zuständigen Skill ergänzen.

## 11. Was bewusst NICHT im Kit ist
- **Motion Video Director** (gekaufter Skill, Einzelnutzer-Lizenz für Davids eigene Geräte – nicht auf Firmengeräte/-konten kopieren). Der Ablauf funktioniert auch mit `storyboard` + den Regeln hier.
- Offizielle **Higgsfield-Skills** (über das Higgsfield-Plugin installieren, falls gewünscht).
- Private Projekte, Konten und Daten – die gehören nicht auf das Firmenkonto.
Details: `LIZENZEN.md`.
