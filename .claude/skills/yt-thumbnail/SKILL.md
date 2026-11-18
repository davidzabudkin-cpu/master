---
name: yt-thumbnail
description: YouTube-Thumbnails, Titel (A/B/C-Test), Shorts-Cover und Kanal-Banner – vom Konzept über KI-Bild ohne Schrift (gratis zuerst) und Text per Code bis zur Upload-Datei, mit QA und Feed-Test. Nutzen, wenn jemand ein Thumbnail, Titelideen, einen Banner, ein Shorts-Cover, Upload-fertige Bilddateien will oder Feedback zu Thumbnails gibt.
---

# Thumbnail + Titel: von der Idee zur Upload-Datei

Erprobt an ~15 Videos mit A/B-Tests. Look kommt aus dem gewählten Stil (`stile/<name>/STYLE.md`, Abschnitt Thumbnail).

## 1. Was nachweislich funktioniert
- **Gewinner in unseren Tests (Test & Compare, Anteil Wiedergabezeit):** Autoritätsperson aus dem Video als Karikatur mit verrücktem/starkem Ausdruck + Kontrast/Split (43,6 %). Eine bekannte Figur bläst eine Blase, irrer Blick (37,8 %). **Maskottchen mit Schockgesicht + Zahl verlor zweimal** (27–29 %).
- **Split (vorher/nachher, klein ↔ riesig):** Text geteilt, je Hälfte ein Wort/eine Zahl („0 € | 40 BILLIONEN“, „1 ¢ | 222 BILLIONEN“). Favorit.
- **Mid-Action kurz vor dem Ereignis** („click to unpause“): Nadel drückt schon in die Blase.
- Echte Logos als runde Plaketten nur, wenn das Video davon handelt; Thema muss **sofort** im Bild sichtbar sein (abstrakte Symbole wie ein STOP-Knopf allein sind zu wenig).
- **Text:** max. 3–4 Wörter, eine Zeile, obere Hälfte im freien Raum, Schlüsselwort in Akzentfarbe, dicke Kontur. **Nie über dem Hauptmotiv.** Provokante, ehrliche Frage („ENDLICH GEPLATZT?“) oder eine belegte große Zahl.
- **Nicht:** unverständliche Texte („WER ZAHLT?“ ohne Bildbezug), Text, der eine echte Person falsch belastet, zu viele Elemente, Kopien von Referenzkanälen (Richtung ja, gleiches Motiv nein).
- **TV-/50 %-Test:** untere Hälfte abdecken – weckt die obere allein Interesse?

## 2. Ablauf
1. **Video verstehen:** Titel, Hook, Kernaussage, was das Video **nicht** behauptet. Firmen/Zahlen nur, wenn sie im Video vorkommen (Faktentabelle).
2. **Referenzen** (10–15 aus: eigene Ausreißer, fremde Ausreißer, gleiches Format/anderes Thema, außerhalb YouTube): pro Referenz den **Mechanismus** benennen (welche Frage/Emotion, wodurch?) – übertragen, nicht kopieren.
3. **10 Titel zuerst** (< 55 Zeichen, einfache Wörter, Frage/Widerspruch), besten wählen. **Titel = Thema/Suchbegriff, Thumbnail = Emotion/Frage**, nie dieselbe Zahl doppelt.
4. **4–6 Konzepte** über verschiedene Muster (Autoritätsperson + Split, Mid-Action, Objekt + Zahl, Betroffene, Serien-Schablone), je mit Textidee. Der Nutzer will meist viele Varianten sehen und dann kombinieren („nimm die Blase aus X in Bild Y“).
5. **Bilder erzeugen ohne Schrift** (`higgsfield-praxis`, gratis zuerst): Prompt = Stil-Anker + Komposition + „oberes Drittel frei (Himmel/Fläche), keine Schrift“. Zahl auf einem Objekt: KI malt ein **leeres** Schild, Zahl kommt per Code. Zwei Referenzen klappen gut: Bild 1 = Szene behalten, Bild 2 = Element übernehmen.
6. **QA** (Abschnitt 3), dann **Text per Code:** `python werkzeuge/thumb_text.py bild.png "TEXT" out.png --hot WORT` bzw. `--split`, `--dy` schiebt das Bild für mehr Platz oben.
7. **Übersicht** mit Feed-Größe (380×214, `*_feed.jpg`) an den Nutzer. Er wählt.
8. **Export + Doku** (Abschnitt 4).

Ohne KI-Bilder: Thumbnail komplett per Code (`motion-kit` `v.still(t, "thumb.png")` aus einer Grafik-Szene) oder aus einem Standbild des Videos + `thumb_text.py`.

## 3. QA (jedes Bild vergrößert prüfen)
- Logos/Schrift korrekt und nicht doppelt (KI-Logo-Fehler per Code ersetzen).
- Genau ein Hauptmotiv; oben wirklich frei für Text.
- Hände/Arme logisch, Figur = Figurenblatt.
- Feed-Größe: Motiv und Text in 1 Sekunde erkennbar? Auf hellem und dunklem Hintergrund testen.

## 4. Export, Titel-Test, Banner
- **Upload:** PNG/JPG 1280×720, < 2 MB → `projekte/<video>/upload/Thumbnail_N_<name>.png`. Nicht gewählte in `nicht-gewaehlt/`.
- **Test & Compare:** bis zu 3 Thumbnails – 3 verschiedene Ideen, nicht nur Farbe/Shirt getauscht. Dazu 3 Titel mit verschiedenen Klickgründen (A Frage + Marke, B Anlass + belegte Zahl, C Betroffenheit).
- **Serien-Schablone:** gleicher Aufbau je Folge einer Reihe (Hintergrund + riesiges Schlüsselwort + Zahl + Figur mit ikonischem Objekt).
- **Banner:** 2560×1440, < 6 MB. Handy-Bereich 1546×423 in der Mitte (x 507–2053, y 508–931) enthält Text + Hauptelemente; PC zeigt volle Breite × 423, TV das ganze Bild (oben/unten nicht leer).
- **Shorts-Cover:** 1080×1920, Text im oberen Drittel, unteres Fünftel frei.
- **Doku:** Gewinner-Prompts in `stile/<name>/thumbnail-prompts.md`, Geschmacks-Erkenntnisse des Nutzers in Abschnitt 1 dieses Skills.

## 5. Nach dem Upload
Erwartung notieren (Rang unter den eigenen Videos). Liegt das Video deutlich darunter → anderes Konzept (nicht nur Farbe). Ergebnisse von Test & Compare in Abschnitt 1 eintragen.
