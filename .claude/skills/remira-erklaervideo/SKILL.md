---
name: remira-erklaervideo
description: Hausregeln für Remira-Motion- und Erklärvideos (Glossar-Videos, Produkt-Erklärer, Plattform-Animationen) aus fünf Feedback-Runden zum OMS-Video (David + Marketing-Team, Nov. 2026). Nutzen bei jedem neuen oder geänderten Remira-Video, wenn David ein Video zu einem Remira-Glossarartikel, Modul oder Thema will, „wie das OMS-Video“ sagt oder Kolleginnen Feedback zu einem Remira-Video geben. Ergänzt storyboard + code-animation (Ablauf) und remira-phosphor-icons (Icons); dieser Skill sagt, wie es für Remira aussehen und klingen muss.
---

# Remira-Erklärvideo – Hausregeln

Vorlage und Pipeline: `remira/projekte/oms-video/` (Canvas-Code, Playwright-Render, Musik/SFX per Code). Neues Video = Ordner kopieren, `src/data.js` + `src/timeline.js` + Szenen in `src/main.js` anpassen. Befehle in dessen `PROMPTS.md`. Ablauf: erst Storyboard (Skill `storyboard`), dann bauen, Stichproben-Standbilder, Prüfungen unten. Einmalig im Projektordner: `npm install` und `npx playwright install chromium`; dazu ffmpeg und Python mit numpy/scipy/Pillow.

## Branding
- Schrift Source Sans 3 (Headlines 700–800, Bildtexte 700; seit 23.11. keine Bildtexte mehr in 500, nur kleine Unterzeilen/Labels 600). Hintergrund dunkles Navy (#0F1D2F → #03060B), Text weiß, Akzent #41B6E6, Ringfarben #41B6E6 #28ABBA #61BD47 #FCDA34 #FF9524 #F53D47 nur für Bildmarke, Punkte, Balken.
- Bildmarke (bunter Ring) aus der Original-Logo-SVG als roter Faden; nie nachzeichnen.
- Icons: Phosphor **light** (schmal, seit Marketing-Feedback 23.11.2026; bold wirkte „knubbelig“), Original-SVGs, siehe Skill `remira-phosphor-icons`.
- Heroes (KI-Nachzeichnungen) nur sparsam und vor Veröffentlichung mit Marketing abstimmen.

## Ruhe im Bild
- **Text steht still:** Kamera im Stand ohne Drift/Zoom (Zoom 1, ganze Pixel), Text auf ganze Pixel runden, Korn statisch. Erlaubt: einmaliges Einblenden mit kurzem, monotonem Versatz (ease-out). Prüfen: 15 Folgeframes im Textbereich, Pixeldifferenz ≈ 0.
- **Ein Blickfang pro Moment.** Vor jeder Kamerafahrt blendet die Szene ruhig aus (0,4 s), in der Fahrt nur Bildmarke + Hintergrund, danach baut sich die neue Szene auf. Lichtstreifen höchstens wenige und dezent, beim Wendepunkt keine. Kein Motion Blur auf Text.
- **Linien-Ketten** laufen nur zwischen den Kreisen: Start und Ende am Kreisrand + 6 px, nie unter/über einem Kreis, nicht über den letzten hinaus.
- **Kreis unter der Bildmarke ausblenden:** Sitzt der Ring auf einem Icon-Kreis, verschwindet der Kreis dahinter; beim Weiterwandern kommt er als „erledigt“ (leicht blau gefüllt) zurück.
- **Badges/Bullets optisch mittig zur Zeile:** Nummernkreise, Häkchen-Kreise und Aufzählungspunkte sitzen mit ihrer Mitte auf der Mitte der Großbuchstaben der ersten Zeile (nicht auf der Mitte der Textbox mit Unterlängen). Im Code `capMid(px, w)` in `src/main.js`; prüfen mit `tools/measure_badges.py` (±1 px, Marketing 16.11.).
- Widgets/Chips: Breite aus gemessener Textbreite + Padding. Fortschrittsbalken: eine monotone Füllung, kein Hin und Her.
- Keine dunklen Frames zwischen Szenen (durchgehende Welt, Kamerafahrten).

## Text und Zeichensetzung (Text-Feedback Marketing)
- Listen-/Stichpunkte **ohne Punkt** (Kacheln, Häkchen, Schlagworte, Labels).
- Einleitung einer Liste **mit Doppelpunkt** („… sorgt für:“, „… an den besten Lieferort:“).
- **Keine Gedankenstriche** als Satzverbindung; Komma oder neuer Satz.
- **REMIRA immer in Großbuchstaben**, im Bild wie im Fließtext und auch in Dateinamen (`REMIRA-OMS-Erklaervideo.mp4`); Ausnahme nur technische Ordner-/Skill-Namen in Kleinbuchstaben.
- Nichts erfinden: nur Aussagen aus Skript bzw. Remira-Artikel, keine Zahlen ohne Quelle.
- Lesezeit: mind. 1 s pro 2,5 Wörter + 1 s (seit WWS-Feedback 23.11.; wird von `tools/dump_cues.mjs` geprüft).

## Musik und Ton
- Musik **dynamisch statt Flächen**: modern, Corporate/Tech, ca. 110–120 BPM, klare Drums (Kick, Clap, Hi-Hats), Bass, kurze Plucks; keine langen Pads, Chor, Orgel, viel Hall („klingt nach Kirche/Weltall“ abgelehnt).
- **Intro leise und weich** (David 16.11.): erste ca. 13 s ohne Claps, Kick/Hats zurückgenommen, ca. 3 dB unter dem Hauptteil (Intro ≈ −20 LUFS, Hauptteil ≈ −17); in den letzten 2 s vor dem ersten großen Szenenwechsel sanft hochfahren, kein Sprung.
- Auf die Szenen getimt: Fill vor Ankunft, Crash bei Ankunft, Intro leiser, Steigerung zur Lösung, Drums stoppen beim Logo, ruhiger Ausklang.
- SFX weich und eher leise (Runde 2: −2,5 dB), Ton −16 LUFS, Spitze < −1 dBFS. Alles per Code (`tools/mix.py`), kein Stockmaterial. Claude misst nur, anhören muss ein Mensch.

## Endkarte (Variante B, gewählt)
Ring links, rechts daneben linksbündig an der linken Tintenkante von „REMIRA“: REMIRA (Original-Pfade), darunter statt des Claims „Order Management System“ bzw. das Thema (Source Sans 3 Light, gleiche x-Höhe/Grundlinie), dann der Satz (Tinten-Breite = Breite von REMIRA), dann kleiner Button „Jetzt mehr erfahren auf REMIRA.COM“. Ganzer Block horizontal und vertikal mittig. Messen mit `tools/measure_end.py` (Tinte, nicht Textboxen).

## Prüfen vor Abgabe
Standbilder an jeder Szene + Endkarte in voller Auflösung, Übergänge als Frame-Folge (ruhig?), Lesezeit-Prüfung, Schwarzbild-Prüfung (nur gewollter Start), LUFS/True Peak. Alte Fassung vor dem Überschreiben als `REMIRA-…-vN.mp4` sichern. Bei kleinen Änderungen nur die betroffenen Szenen neu rendern (`--from/--to`) und per Frame-genauem Schnitt einsetzen, Ton unverändert übernehmen.

## Plattform-Grafik und andere Schaubilder (Feedback 16.11.2026)
Vorlage: `remira/projekte/plattform-animation/` (Messung: `tools/measure.py`).
- **Sechsecke immer regelmäßig:** aus dem Umkreisradius bauen (Breite 2R, Höhe √3·R), Rundung als fester Anteil von R. Bei Platzmangel kleiner skalieren, nie eine Achse stauchen. Im Endbild nachmessen (mit Rundung ca. 1,13, Ecken ohne Rundung 1,1547).
- **Icon + Label sind eine Gruppe:** überall gleich aufgebaut, gleiche Größe, gleicher Abstand. Auf Bögen: Icon direkt vor dem Wort, Gruppe mittig im Segment, auf der Mittellinie des Bogens. In Kacheln/Modulen: Icon mittig über dem Label.
- **REMIRA immer in Großbuchstaben**, auch in Dateinamen. Achtung Windows: `Remira-x.mp4` und `REMIRA-x.mp4` sind dieselbe Datei, alte Fassung erst als `-vN` wegsichern und umbenennen.
- **Sechseck-Ecken weich wie im Original** (Marketing 17.11.): Eckenradius ca. 0,36 × Umkreisradius, bei allen Sechsecken derselbe Anteil; gepunktete Ränder folgen der Rundung.
- **Hintergrund = Sechseck-Schwarz** (#000): das große schwarze Sechseck verschmilzt mit dem Grund wie im Original, keine Partikel, keine Vignette, keine Kontur ums Sechseck. Blaue Seitenflächen bleiben.

## Rendern (eigener Renderer, seit 18.11.2026)
- **Immer `node src/render.js`** aus dem Projektordner (eigener Code, kein Teil eines gekauften Skills). Neues Video = Ordner `remira/projekte/oms-video` kopieren, der Renderer kommt mit. Nie Code oder Vorlagen aus dem Motion Video Director ins Kit oder auf Firmengeräte holen.
- Ablauf: `node tools/dump_cues.mjs` → `python tools/mix.py cache/audio/mix.wav` → `python tools/master.py cache/audio/mix.wav cache/audio/master.wav` → `node src/render.js --out . --name "REMIRA-…-vN" --audio cache/audio/master.wav`. Schnelltest vorher: `--from A --to B --fps 10 --scale 0.5 --out cache/probe --jpg`.
- **Ton einer freigegebenen Fassung unverändert übernehmen:** `--audio ALT.mp4` kopiert die Tonspur bitgenau (nur ab `--from 0`). Nutzen, wenn nur das Bild geändert wird.
- **Browser-unabhängig bauen:** Schriftgrößen nie aus gemessenen Glyphenhöhen ableiten (`measureText('x')` liefert je nach Chromium-Version andere Werte, Endkarte OMS war dadurch 9 px zu kurz). Feste px-Größe oder auf eine feste Breite einpassen. Playwright-Version in `package.json` fest lassen (1.47.2), damit Kantenglättung gleich bleibt.
- **Neu-Render prüfen:** Ton `ffmpeg -v error -i X.mp4 -map 0:a -c copy -f data - | md5sum` (alt = neu), Bild `ffmpeg -i ALT.mp4 -i NEU.mp4 -lavfi "[0:v][1:v]ssim" -f null -` (≥ 0,99) plus Standbild der Endkarte nebeneinander.

## Zwei Sprachen (seit 18.11.2026)
- Jedes Video **DE und EN**. Alle Bildtexte in `src/texte.js` (bzw. `pick({de, en})` in `data.js`), nie fest im Szenencode. Rendern: `node src/render.js --lang en …`; Standbilder `VIDEO_LANG=en node tools/stills.mjs …`; Lesezeit beider Sprachen mit `VIDEO_LANG=en node tools/dump_cues.mjs` prüfen.
- Timing bleibt in beiden Sprachen gleich, der Ton wird bitgenau übernommen (`--audio <andere Fassung>.mp4`). Zu lange Übersetzungen kürzen statt Timing ändern.
- Breiten aus Text ableiten (Chips, Abstände), nie feste x-Positionen hinter Text. Danach jede Szene in beiden Sprachen als Standbild prüfen (Überlauf, Zeilenumbruch, Ausrichtung).
- Dateinamen mit Sprachkürzel: `REMIRA-…-DE.mp4`, `REMIRA-…-EN.mp4`. Übersetzungen als „vor Freigabe prüfen“ kennzeichnen, offizielle Begriffe der jeweiligen remira.com-Seite haben Vorrang.

## Ton-Mastering (18.11.2026)
- Kein `loudnorm` für das Endmastering: fällt bei großem Dynamikumfang (leises Intro) in den dynamischen Modus und drückt das Intro hoch. Stattdessen `tools/master.py` aus `warenwirtschaft-video` (messen → linear auf −16 LUFS → Limiter −1,5 dBFS).
- Intro-Pegel gegen das freigegebene OMS-Video messen (RMS 0–5 s ≈ −29, 5–10 s ≈ −21, Hauptteil ≈ −16 dB). Keine Claps.

## Neues Video, nicht Kopie (18.11.2026)
- Von `oms-video` übernehmen: Technik (Renderer, Text-Helfer, Ring, Kamera-Fahrten, Ton-Pipeline), Ring als roten Faden, Endkarte B. **Neu erfinden:** Szenen, Key Visuals, Kamerapfad und Ring-Rollen passend zum Thema (Beispiel WWS: Regal, Warenstrom, Kreislauf, Bestands-Dashboard, Datendrehscheibe, Bestandslinie). Vorher Storyboard nach Skill `storyboard` mit Gates.

## Tempo und Musik (Feedback 23.11.2026, WWS)
- **Nicht zu viel auf einmal:** Szene in Stufen bauen. Erst den Satz allein stehen lassen (≈ Lesezeit), dann Bildelemente nacheinander (Kacheln, dann Bewegung). Bei nummerierten Schritten ①②③ zeigt jede Stufe nur ihr eigenes Ereignis; vorherige Bewegung ruht (z. B. Datenstrom endet, wenn das Dashboard kommt). Unterzeilen erst mit ihrem Bild-Ereignis einblenden. Keine langen Leerlauf-Pausen.
- Bewegte Mengen halbieren: lieber 4 Kartons/Datenpunkte als 9.
- **Eigene Musik je Video:** nicht den Track eines anderen Videos wiederverwenden. Tempo, Tonart, Groove und Leitinstrument ändern (WWS: 100 BPM, G-Dur/E-Moll, Marimba, Shaker, gebrochener Beat; OMS: 116 BPM, F-Dur, Plucks, Hats).
- **Inhalt bleibt im Widget:** Zeilen in Karten/Panels immer in lokalen Koordinaten zur Kartenmitte angeben und vor dem Rendern prüfen, dass jede Zeile innerhalb ±h/2 − Rand liegt (WWS 23.11.: dritte Bestandszeile lag unter dem Rechteck). Chips/Badges mit Abstand zum Balkenende.

## Reihenfolge und Blickführung (Feedback Auftraggeber + Marketing 23.11.2026, WWS v4)
- **Muster je Schritt:** (1) Text zeigen und Lesezeit lassen (Satz ca. 1,5–2,5 s allein), (2) erst dann die passende Animation, (3) dann der nächste Schritt mit seinem Text. Aufzählungen und Knoten erscheinen einzeln (≥ 0,4 s Abstand, bei Knoten mit Text ≈ 1 s), nie mehrere Bewegungen gleichzeitig.
- **Blick führen:** Was gerade erklärt wird, ist hell; der Rest wird auf ca. 30 % abgedunkelt (`dimAt()` in `warenwirtschaft-video/src/main.js`), aktives Widget mit blauem Rahmen/Glow, nur der neue Knoten leuchtet. Kamera bleibt im Stand still (Text-Regel), Fokus also über Helligkeit, nicht über Zoom.
- Abdunkeln funktioniert nur, wenn Zeichenfunktionen `globalAlpha` **multiplizieren** (`*=`) statt setzen; `text()` nimmt die Grund-Deckkraft mit.
- **Schritt-Nummern ①②③** groß und mittig zwischen Headline und Satz (nicht klein links vor dem Text): alle drei als Reihe sichtbar, aktueller blau gefüllt, erledigte mit Häkchen.
- **Problem-Szene als Frage einleiten** („Was ist das Problem ohne zentrales System?“ groß, Problemtext kleiner darunter), damit sie nicht überrascht.
- **Intro kurz:** Titel + Key Visual in ≈ 4–5 s, dann erste Fahrt. Szenen ohne Leerlauf: Wiederholungen (Kartons, Datenpunkte) auf 2 begrenzen.
- Rechtschreibung „selbstständig“ (nicht „selbständig“, Hausschreibweise).

## Feedback 24.11.2026 (Marketing zu WWS v4)
- **Aufzählungen einheitlich:** Wer im Video schon eine Checkliste links hat (Vorteile), baut andere Aufzählungen genauso auf (Problem-Schlagworte als Liste links, roter Kreis mit Kreuz). Grafik rückt dafür vorher ruhig zur Seite, nicht gleichzeitig mit einer anderen Bewegung.
- **Heldin erkennbar:** mind. 3,5 s im Bild, in der Bildmitte am langsamsten (`e = u + 0,8·sin(2πu)/2π`), Einflug aus der Ecke unten links. Die Kamerafahrt darunter entsprechend länger (≈ 2,4 s).
- **Zusatzzeile zu einer Headline** steht direkt unter der Headline (kleiner, SOFT), nicht unten im Bild.
- **Logo oben rechts (Stand 25.11., v7):** die offizielle Datei `remira/brand/logo-pack/REMIRA_Logo_white.png` (Logo ohne Claim, aus dem Logo-Pack von Marketing) unverändert skaliert, ca. 290 px breit, 40 px oben / 44 px rechts, mit ≥ 20 px Abstand zu jeder Headline (messen). **Nie selbst aus der Claim-SVG zusammensetzen:** im Original ist die Bildmarke viel kleiner im Verhältnis zum Schriftzug (v6 wurde abgelehnt: Bildmarke zu groß, Logo zu groß, berührte fast die Überschrift).
- *Überholt (v6):* wie in früheren REMIRA-Videos: Ring links, „REMIRA“ **vertikal mittig zum Ring**, Ring-Höhe ≈ 1,6 × Versalhöhe, Abstand ≈ 0,15 × Ringbreite, ≈ 360 px breit, 36 px vom oberen und rechten Rand, volle Deckkraft. Aus den Original-Pfaden der Logo-SVG neu angeordnet (die Claim-Datei setzt „REMIRA“ zu hoch, weil darunter der Claim steht; so wirkte es schief). Headlines dafür 50 px tiefer (`TOP` in `main.js`). Nicht im Intro und nicht auf der Endkarte. Code: `LOGO_BUG` in `warenwirtschaft-video/src/main.js`.

## Neues Video aus der WWS-Vorlage (POS, 25.11.2026)
- Vorlage ist jetzt `remira/projekte/warenwirtschaft-video` (alle Regeln bis v7 eingebaut: Logo-Pack oben rechts, `TOP`-Versatz der Headlines, Schritt-Nummern, `dimAt`, Checklisten links mit bold-Häkchen, langsame Heldin, lineares Mastering). Kopieren: `src`, `assets`, `tools`, `plan`, `package.json`; in `main.js` alles bis zu den Szenen-Helfern übernehmen, ab `const scenes` neu schreiben, `end`-Szene und Rahmen (Hintergrund, Logo, Heldin, Frame) übernehmen.
- Feste Bausteine je Video: Hook ≤ 5 s → Definition → Bestandteile (Checkliste links + Grafik rechts) → Problem als Frage (Grafik rückt nach rechts, Liste links) → Heldin → „So funktioniert REMIRA …“ mit ①②③ → Zusatz-Szene zum Produkt → Vorteile (Checkliste links) → Endkarte B. Bildsprache, Kamerapfad (POS: Spirale) und Musik (POS: 108 BPM A-Dur E-Piano) je Thema neu.
- `T`-Objekt: keine doppelten Schlüssel (POS v1: zweites `sale` überschrieb das erste); je Szene eigene Namen (`sale`, `sale2`).
- DOTS-Hintergrund an die Weltgröße anpassen (x/y-Bereich der Szenen-Positionen `SC`).
- Lange EN-Übersetzungen kürzen statt Timing zu ändern (POS: „Double sales online“, „Changes store by store“).
