# Bilder + Figuren: Stil halten, Fehler vermeiden

Gilt für jeden bildbasierten Stil (Doodle, Cartoon, Kino, realistisch). Werkzeug-Details (Modelle, Gratis-Weg, Kosten): Skill `higgsfield-praxis`. Der Stil-Anker kommt aus `stile/<name>/STYLE.md`.

## Stil-Anker = erste Zeile jedes Prompts
Ein fester Absatz, der den Look beschreibt (Linien, Farben mit Namen, Figurenbau, Hintergrund, was verboten ist). Beispiel Doodle:
> Simple hand-drawn doodle illustration for an educational video. Plain warm off-white paper background, no lines or borders at the edges. Thick black marker outlines, slightly imperfect, flat colors without shading. Palette: black, emerald green, warm gold, light grey; red only for a cross or warning. Characters are simple figures with big round heads, dot eyes and expressive eyebrows. Any written words are short, bold hand-lettered capitals, spelled exactly as given. One clear idea per image. No 3D, no photorealism, no gradients, no frame. 16:9.
Prompt-Ende immer: „Every character appears exactly once. Nobody else unless described. No other words.“
Für Szenen randlos: „The whole frame is painted edge to edge … no empty white areas.“

## Figuren
- **Figurenblatt zuerst** (4 Posen in einer Reihe, gleiche Größe, gleiche Bodenlinie, freier Raum dazwischen) → Nutzer nickt ab → dient als Referenz für jede Szene.
- Jede Hauptfigur sofort erkennbar: eigene Farbe + ein Merkmal (Hoodie-Farbe, Cap, Brille, Frisur). Nebenfiguren dürfen ähnlich sein.
- **Echte Personen als erkennbare Karikatur im eigenen Stil:** Merkmale beschreiben (Frisur, Gesichtsform, typische Kleidung) statt Foto hochladen. Zwei echte Personen nebeneinander müssen unterscheidbar sein (Kleidung + Haare ausschreiben, beide Blätter als Referenz). Nichts in den Mund legen, was sie nicht gesagt haben.
- Maskottchen-Details, die das Modell gern falsch macht, ausdrücklich ausschließen (z. B. „no dollar sign on the face“).
- Freistellen für Code-Animation: Figur auf einfarbigem Grund erzeugen, dann freistellen (Pillow/rembg), Kontrolle auf farbigem Hintergrund; Posen-Bibliothek mit Fußpunkt je Pose anlegen.

## Orte und Folgeszenen
- **Gleicher Ort = gleiches Bild-Set:** Folgeszenen mit dem ERSTEN Szenenbild als Referenz („Use the FIRST reference image as the exact location … only change …“) + Figur als zweite Referenz.
- Requisiten bleiben am selben Ort. Keine Fremd-Hintergründe aus alten Videos, die nicht zum Ort passen.
- Nie ein Gruppenbild als Referenz (das Modell malt dann die ganze Aufstellung).
- Hohe Bilder für Kamerafahrten: 9:16, Inhalt „von oben nach unten“ beschreiben.
- 4 Szenen pro Job als 2×2-Raster erzeugen und per Code teilen spart Zeit/Credits (danach hochskalieren).

## QA – jedes Bild ansehen, bevor es jemand anderes sieht
- [ ] Figur = Figurenblatt (Gesicht, Haare, Kleidung, Proportionen)
- [ ] Jede Figur genau einmal, keine dritten Arme, Hände halten Dinge logisch
- [ ] Schrift exakt und nicht doppelt (Logos vergrößert prüfen), Jahreszahlen/Schilder passen zur Zeit
- [ ] Physik/Logik: nichts schwebt, Werkzeuge haben die richtige Form (Schaufel: ein Griff oben, ein Blatt unten), Figuren stehen auf dem Boden, nicht auf Möbeln
- [ ] Keine leeren Farbflächen als Hintergrund, kein Rahmen/Randlinie
- [ ] Folgeszene: gleicher Raum, gleiche Gegenstände
- [ ] Anachronismen (Dollarzeichen im Altertum, Smartphones 1990)
Fehler → neues Bild (alt nach `verworfen/`, Grund ins Ledger). **Mag der Nutzer ein Bild und nur ein Detail stört:** Original behalten, nur das Detail neu erzeugen und lokal einsetzen – ein komplett neues Bild ändert alles, was er mochte.

## Bilder sparsam wiederverwenden
Jedes Bild möglichst nur einmal pro Video (Wiederholungen zählen), nur bewusste Rückblenden doppelt.
