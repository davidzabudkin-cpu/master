> Aus einem echten Studio-Workflow übernommen. „David“ = der ursprüngliche Auftraggeber/Geschmack, „ZAB“ = seine Studio-Marke, Pfade wie `Davids Studio/…` gibt es hier nicht. Die Regeln gelten allgemein; Geschmacksregeln sind ein erprobter Startpunkt, kein Gesetz.

# Bühnen-Scroll (erprobt an ZAB Studio v13, Okt. 2026)

So ist die ZAB-Website gebaut, die David auf dem Handy „mega flüssig“ fand. Für jede neue Website mit Scroll-Effekten (eigene Seite, Referenz-Seiten, Kunden) als Bauplan nehmen. Code: `Davids Studio/projekte/zab-studio/` (`site/v13.js`, `site/v13.css`, `site/main.js`, Build `tools/v13_build.py`, Unterseiten `tools/sub13.py` + `site/sub13.js/.css`). Verlauf und Entscheidungen: `STATUS.md`, Briefe `BRIEF-website-v13*.md`.

## 1. Davids Regeln (aus vier Feedback-Runden)
- **Handy ist die Hauptversion.** Jedes Widget auf 390 × 844 prüfen. Nichts darf abgeschnitten sein, schief sitzen oder leeren Platz lassen; Knopftexte stehen mittig.
- **Nichts wird von unten hochgeschoben**, und es gibt keine sichtbaren Kanten oder Helligkeitslinien zwischen Szenen. Stattdessen „Bühnen“: Der Bildschirm bleibt stehen, Inhalte erscheinen an Ort und Stelle.
- **Nichts läuft von allein ab wie ein Video.** Text und Widgets hängen am Scroll und kommen beim Zurückscrollen wieder. Absätze erscheinen Wort für Wort, von unten nach oben.
- **Gleiche Dinge bekommen gleich viel Scrollweg** (z. B. die vier Wörter im Wort-Wechsler).
- **Wenn etwas verschwindet, kommt fast direkt das Nächste** (kein leeres Glas, kein Leerlauf zwischen herausstechen und dem nächsten Kapitel).
- **Nie eine lange Pause:** Jede Daumenbewegung wird belohnt, es passiert sofort etwas. Ältere Besucher müssen verstehen, dass man scrollen soll (Scroll-Hinweis statt Buttons im Intro).
- **Nichts kommt plötzlich aus dem Nichts:** erst unscharf, dann scharf, mit Absicht und spürbar.
- **Kein Autoplay** von Vorschau-Videos am Handy, nur das Standbild.
- **Menü und Logo springen sofort** (keine Scroll-Fahrt). Das Logo führt immer ganz nach oben.
- **Kein Zoomen mit zwei Fingern, kein seitliches Verrutschen.**
- Unterseiten-Karussell: Endlosschleife, **ein Wisch = eine Karte**, die Überschrift bricht beim Wortwechsel nie um, die Reihenfolge entspricht den Chips.
- Wenig Knöpfe: pro Bereich höchstens zwei kleine Handlungen. Keine harten Preise, die abschrecken (Stand 24.10.).
- **Keine leeren Scroll-Strecken** (David, ref-salon 24.10.): Eine Bühne, die nach einem normalen Abschnitt kommt, zeigt ihren Inhalt schon beim Hereinkommen (Einblenden über `rect.top` vor dem Einrasten), nicht erst danach. Nie mehr als ca. eine halbe Bildschirmhöhe ohne Inhalt. Hintergrund lieber ein Farbverlauf über die ganze Seite statt viel Weiß.
- Bilder: realistisch und hochwertig, immer mit Davids Referenzbildern; Porträt ohne komische Augen und ohne rote Reflexe prüfen.
- **Website-Vorschauen** (David, 25.10.): kein Zoom auf ein Standbild. Beim Drüberfahren läuft eine echte, ruhige Scroll-Aufnahme der Seite (`zab-studio/tools/rec13.cjs`, headless, 0 Credits), am Handy Standbild und Kachel mittig.
- **Vorher/Nachher-Vergleiche:** Strich in der Mitte, nur selbst schieben, nichts läuft automatisch. Vorher-Bilder nachstellen (keine fremden Fotos), Nachher = Bearbeitung desselben Fotos.
- **Zurück-Knopf in eingebetteten Ansichten** (iframe) führt immer direkt zurück, nie durch die Zwischenschritte.
- **Kein Scroll-Video (Video-Scrubbing) am Handy** (David, Mohn & Milch 26.10.): ruckelt auf echten Handys, auch wenn der Tempo-Test gut aussieht. Auch übereinander blendende Standbilder gefallen ihm nicht (Kapitel wirken gleichzeitig sichtbar). Desktop darf den Film behalten; am Handy ein eigener Anfang: Startbild + Überschrift wie bei der Osteria, danach die Kapitel untereinander mit gleichem Abstand und je eigenem Bild (Vorlage `ref-cafe/app/src/components/sonata/mobile-intro.tsx`). Real-ESRGAN x4plus nur mit `-s 4`.

## 2. Aufbau der Seite
1. **Intro** (sticky, `100lvh`): Kamera fährt in den Bildschirm (Video, an den Scroll gekoppelt). Am Handy Intro B ohne Ordner; das Video endet auf genau dem Standbild, das danach als Hintergrund liegt, und wird per Scroll weich überblendet (kein Umschalten).
2. **Spruch → Kapitel 01 im selben Glas** (Handy): Beide Glasflächen haben dieselbe Position und Größe (`top: 47svh; translate: 0 -50%; height: 250px`). Der Spruch wird unscharf und verschwindet, das Glas bleibt stehen. Die Übergabe passiert genau dann, wenn Kapitel 01 oben ankommt (`rot.getBoundingClientRect().top <= 0`). Danach erscheint der neue Satz Wort für Wort.
3. **herausstechen**: Das Wort wird beim Scrollen mit Licht „geschrieben“ (Maske + Lichtpunkt). Die Maske braucht Innenabstand, sonst schneidet sie den Glow als Kasten ab.
4. **Kapitel 02 als Bühne** (Handy und Desktop): Überschrift, Text und dann die Widgets nacheinander an Ort und Stelle. Am Handy liegen die Karten übereinander, die Punkte stehen senkrecht (waagerechte Punkte wirken wie seitlich wischen). Nicht in normalen Fluss umbauen, sonst kommt wieder alles von unten (David hat das zurückgewollt).
5. **Zusatz-Leistungen als Widgets zum Wischen** (Endlosschleife, ein Wisch = ein Widget), jedes Widget mit Vorher/Nachher-Bild und Link zu einer Detail-Stelle auf der Unterseite.
6. **Leistungen**: Desktop mit seitlich fahrender Spur, Karte 1 bleibt stehen, bis Karte 2 durch ist. Am Handy wischen mit `scroll-snap`.
7. Danach normale Abschnitte mit Wort-Reveals; Hintergrund-Szenen wechseln weich.

## 3. Technik, die das flüssig macht
**Bühnen-Prinzip:** Aufeinanderfolgende Sticky-Abschnitte überlappen um genau eine Bildschirmhöhe (`margin-top: -100lvh` bzw. `-100svh`). Inhalt blendet per Deckkraft an Ort und Stelle über.

**Ein Hintergrund für die ganze Seite** (`#sky`, `position: fixed; height: 100lvh`):
- Szenen = Bilder oder Verläufe, gestapelt.
- Ein Fahrplan `PLAN = [[abschnitt, anteil, szene, versatz], …]` rechnet die Scroll-Position in eine Kommazahl T um (`smoothstep` zwischen den Stopps). Szene i hat die Deckkraft `1 - |T - i|`.
- T wird weich nachgeführt (`lerp 0.16`). Nach Sprüngen (Menü, Logo) setzt `snap` T sofort.
- Am Handy keine Live-Unschärfe: Verläufe als fertige Bilder (`tools/grad13.cjs`) statt SVG-Blur.
- Am Handy beim „Abtauchen“ nur Überblenden, kein Zoom (Zoomen großer Bilder flackert in Kacheln).

**Alles am Scroll (scrubbed):**
- Fortschritt p je Abschnitt: `secP = -rect.top / (height - innerHeight)`. Elemente rechnen sich ihr Fenster daraus, z. B. `k = smoothstep((p - a) / dauer)`.
- Wort-Reveal: Wort i startet bei `(1 - D) * i / (n - 1)`, Dauer D ≈ 0,3. Deckkraft 0 → 1, `translate` 0,55em → 0, am Desktop Blur 6px → 0, am Handy ohne Blur. Die Wörter brauchen `display: inline-block`.
- Eine Animation, die beim Zurückscrollen wiederkommen soll, nie als Zeit-Animation bauen. `.rv`-Einblendungen mit einem IntersectionObserver, der `in` beim Verlassen wieder entfernt.

**Tempo-Regeln:**
- Eine `requestAnimationFrame`-Schleife, die nur arbeitet, wenn sich `scrollY` geändert hat. Erst alles messen (`getBoundingClientRect`), dann alles schreiben.
- Stile nur schreiben, wenn sich der Wert ändert (Cache pro Element: `css(el, k, v)`).
- Getrennte CSS-Eigenschaften `translate`, `scale` und `opacity` statt eines `transform`-Strings. Dann bleiben Hover-Neigungen (`transform`) mit ihrer Transition weich, statt zu springen.
- Am Handy: kein `backdrop-filter` auf großen Flächen (nur auf 1–2 zentralen Gläsern), keine `filter: blur` auf großen Bildern (unscharfer Hintergrund = kleines `-s`-Bild hochskaliert), keine Lichtteilchen, keine Dauer-Animationen, keine Mischmodi.
- `will-change` nur auf Ebenen, die gerade sichtbar sind; die ersten Szenen dauerhaft (Umschalten erzeugt Flackern).
- Bilder: zuerst die nahen laden, nach `load` alle vorab mit `img.decode()` entpacken. So hakt schnelles Wischen nicht.
- Scrub-Videos mit `-g 2` (fast jedes Bild ein Schlüsselbild) kodieren, als Blob laden und weich nachführen. Es läuft immer nur ein `seek` gleichzeitig (`seeked`-Flag).
- `history.scrollRestoration = 'manual'`. Die Position nur beim Zurück-Button wiederherstellen (`sessionStorage` + `navigation.type === 'back_forward'`).
- `html, body { overflow-x: clip }` am Handy (nicht `hidden`, das würde `sticky` kaputt machen). Im Viewport-Tag `maximum-scale=1, user-scalable=no`.

**Fallen, die wir hatten:**
- Globale Kurz-Klassen (`.d1`, `.s2`) aus alten Stilen trafen neue Elemente (blauer Rand, Unterstreichung). Neue Klassen immer mit Präfix benennen.
- Eine allgemeine Handy-Regel für dunkles Glas traf auch helle Abschnitte. Solche Regeln auf `section:not([data-ink])` begrenzen.
- Messungen bei Elementen, die gerade mit `translate` einblenden, liefern falsche Werte. Dann `offsetTop`-Ketten statt `getBoundingClientRect` nehmen.
- Git Bash wandelt Pfade mit führendem `/` um: Testpfade ohne `/` übergeben.
- Szenen nie über die Szenennummer interpolieren, wenn der Fahrplan zurückspringt (z. B. 8 → 6): T läuft dann durch 7 und Szene 7 blitzt auf. Pro Fahrplan-Abschnitt nur Szene A ↔ B überblenden und die Scroll-Position weich nachführen (KERN, `ref-store/site/main.js` `segAt`, Test `tools/bgcheck.cjs`).

## 4. Ablauf mit David (hat funktioniert)
1. Seine Sprachnachricht mit dem Skill `diktat-zu-brief` in einen Brief übersetzen und als `BRIEF-…md` speichern. Kurz zeigen, was ich verstanden habe, dann bauen.
2. Vor dem Bauen Backup anlegen (`site/v13-backup/stand-TT-MM/`).
3. Bauen, dann prüfen:
   - `node tools/pick13.cjs <ordner> m|d <pfad> abschnitt:anteil …` (Screenshots mit echtem, schrittweisem Scrollen)
   - Kontaktbogen der Screenshots selbst ansehen
   - `tools/perf13.cjs` und `perf13fast.cjs` (4× langsamere CPU, Ziel: Median 17 ms, wenige lange Frames)
   - `tools/nav13t.cjs` (Logo, Menü, Zurück-Taste)
   - `tools/chk13.cjs` (kein Deutsch auf den EN-Seiten)
   - `tools/dbg13d.cjs` (was liegt unter einem Punkt) und `tools/eval13.cjs` (Werte auslesen)
4. Online stellen zum echten Handy-Test (nur mit Davids Ja): `npx.cmd --yes wrangler@4 deploy` im Projektordner. Ergebnis: Worker mit statischen Dateien, `_headers` noindex, `_redirects`, `.assetsignore` für Backups.
5. Bilder und Videos zeigen, bevor sie eingebaut werden. Kosten vorher nennen. Videos Bild für Bild prüfen (Blinzeln, rote Streifen) und nur saubere Ausschnitte nehmen.
