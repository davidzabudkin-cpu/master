---
name: erklaer-grafik
description: Erklär-Grafiken (Motion Graphics) für YouTube-Videos und Shorts per Code für 0 Credits – plant Satz für Satz, welche Stelle eine Grafik braucht (Zahlen, Vergleiche, Abläufe, Mythen, Listen, Zeitleisten, Recap), wählt die Vorlage über Tags in gesprochenen Worten aus dem Katalog, baut sie mit motion-kit (oder Sirios HTML-Boards) im gewählten Stil und prüft sie per Standbild. Nutzen bei „Grafik“, „Animation für diese Zahl“, „Erklär-Animation“, „Diagramm“, „Zähler“, „Board“, „Infografik im Video“, Grafik-Brief/Animationsplan oder wenn eine neue Grafik-Vorlage gebaut werden soll. Gesamtablauf eines Videos bleibt in yt-video.
---

# Erklär-Grafiken per Code

Methode nach Sirio Beratis Board-System (MIT, liegt in `werkzeuge/sirio-motion-graphics/`), erprobt und als Standard freigegeben in einem Erklärkanal. Grundfrage für jeden Satz: **„Versteht man diesen Satz nur durchs Zuhören?“** Wenn nein → Grafik.

## Dateien
| Datei | Inhalt |
|---|---|
| `references/grafik-brief.md` | Planung: GRAFIK / GLEICHE GRAFIK / SZENE, Zahlen-Rollen, Aufbau mit Schnittwort, Prüfungen |
| `references/grafik-katalog.md` | Welche Grafik zu welchem Satz (Tags) + motion-kit-Baustein + Bewegungsvorbild |
| `motion-kit/README.md` | API der Engine |
| `werkzeuge/sirio-motion-graphics/boards/index.html` | 70+ Bewegungsvorbilder im Browser (Chrome öffnen) |

## Ablauf pro Video
1. **Grafik-Brief** nach `references/grafik-brief.md` im Szenenplan: GRAFIK-Sätze markieren, Vorlage per Tag aus dem Katalog, jede Zahl mit Rolle und Quelle.
2. **Wortzeiten** holen: `python werkzeuge/whisper_words.py stimme.mp3 grafik/words.json` (oder Satzlängen schätzen, solange es noch keine Stimme gibt).
3. **Grafik-Skript** `projekte/<video>/grafik/grafiken.py` – eine Funktion pro Grafik, Zeiten über `mk.word_time(words, "wort")`. Muster: `motion-kit/demo_explainer.py`.
4. **Prüfen** (bevor jemand es sieht): `v.contact_sheet(...)` + Standbilder 0,1 s vor und 0,5 s nach jedem Schnittwort. Checkliste unten.
5. **Rendern** (`v.render`) – als einzelne Clips pro Grafik (für den Schnitt) oder als ganzes Video (reiner Code-Stil).
6. **Neue Vorlage gebraucht?** Sirio-Board als Bewegungsvorbild öffnen, Methode in `motion-kit/mk.py` (Klasse `Canvas`) ergänzen, Zeile im Katalog eintragen.

## Checkliste je Grafik
- [ ] Titel ab dem ersten Bild sichtbar, **Aussage statt Thema** („WOHIN 5 € FÜR EINEN KAFFEE GEHEN“, nicht „KOSTEN“).
- [ ] In der ersten Sekunde steht Struktur (Achse, Rahmen); danach spätestens alle 3–5 s etwas Neues.
- [ ] Jedes Element auf seinem Wort, nie vorher. Schnittwörter nie Zahlen.
- [ ] Zahlen-Rolle stimmt: Währung nur bei Geld, Anzahl ohne Währung, Jahre nie hochzählen. Jede Zahl aus der Faktentabelle; Beispielzahlen mit Schild „BEISPIEL“.
- [ ] Wichtigste Zahl nie verdeckt. Nichts näher als 60 px am Rand, nichts abgeschnitten, Text ≥ 28 px (1080p).
- [ ] Max. 12 Elemente, Staffelung < 1,5 s. Keine lineare Bewegung außer Zählern.
- [ ] Kein Kamerazoom zur Betonung – Größe, Farbe, Abblenden.
- [ ] Grafik läuft bis zum Schnitt, Clip = Satzlänge, fertig bei ~70 %.
- [ ] Gleicher Begriff = gleiches Wort in allen Grafiken (Glossar).
- [ ] Stummtest: Sagt die Grafik ihre Aussage auch ohne Ton?

## Pflege
Neues Feedback zu Grafiken → Checkliste hier + `yt-video/references/qualitaets-checkliste.md`. Neue Vorlage → zuerst `motion-kit/mk.py`, dann Katalog.
