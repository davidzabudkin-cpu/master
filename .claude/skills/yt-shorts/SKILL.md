---
name: yt-shorts
description: YouTube-Shorts, Reels und TikToks (9:16, 30–70 s) bauen – aus einem fertigen langen Video (ganze Sätze, eine Szene pro Satz) oder komplett neu als Motion-Short bzw. Story-Motion-Short per Code (motion-kit), mit Wort-für-Wort-Untertiteln, weichen Sounds, gesprochener Überleitung und Posting-Plan. Nutzen bei „Short“, „Reel“, „TikTok“, „kurzes Video“, „Clip aus dem langen Video“, Posting-Plan für Shorts oder Feedback zu einem Short.
---

# Shorts / Reels (9:16)

Drei erprobte Varianten. Alle 0 Credits für Bilder (Code), nur neue Stimmen kosten.

## Regeln für alle Shorts
- **Sekunde 0:** stärkster Satz oder stärkstes Bild, kein Anlauf. Erste Worte = Paradox/Zahl/bekannter Name, in ≤ 3 s verständlich.
- 30–55 s Inhalt (Story-Shorts bis ~70 s), **ein** Gedanke.
- **Nur ganze Sätze**, nie mitten im Satz anfangen; Sätze an der **Stille** schneiden, nie nach Whisper (sonst fehlen Silben).
- **Eine Szene pro Satz**, Wechsel am Satzanfang; keine Szene < 1,5 s.
- **Untertitel Wort für Wort** exakt auf der Stimme, Schlüsselwörter farbig (`captions(hot=…)`). Oben höchstens ab und zu ein kurzes Schlagwort (≤ 4 Wörter) – nichts, was das Bild schon zeigt.
- **Jedes Element erscheint genau dann, wenn es gesagt wird.** Was gesagt wird, auch zeigen.
- Kein Text über Gesichtern, nichts im unteren Fünftel (YouTube-Oberfläche), fliegende Objekte nie über Text, Überschriften nie über Werten.
- Auf dunklem/grauem Grund keine dünne weiße Schrift – besser heller Grund mit Spotlight-Vignette und dunkler Schrift.
- **Keine** Kreise, Punch-Zooms, Wackeln, Layoutwechsel; Kamera nur sanfter Push-in, Stöße (`kick`) nur auf 1–3 Schlag-Wörter.
- **Ton:** fast keine Effekte (Knall bei Crash, Durchstreichen); weiche musikalische Töne 50–70 ms vor dem Wort; nie ein Sound auf ein gesprochenes Wort; Musik leise (Gain ~0,10). −14 LUFS.
- **Ende:** offene Frage, die nur das lange Video beantwortet, oder Loop zum Anfang + gesprochene Überleitung („Die ganze Geschichte? Link unten.“).

## Variante A – Short aus dem langen Video
1. Satzliste des langen Videos mit Zeiten (Timeline/Whisper).
2. Skript aus ganzen Sätzen: Hook (Paradox, stärkstes Bild) → Beleg (Jahr/Zahl) → Frage einer Figur → Wendung („Aber …“, „Weil …“) → Erklärung in 2–4 Sätzen → offene Frage. 9–12 Sätze.
3. Szenen: Standbild/Clip des langen Videos pro Satz als `scene_card` (ganzes 16:9-Bild als Karte, kein Crop), Grafiken neu in 9:16 (`counter`, `versus`, `timeline`).
4. Prüfen: Abschrift des fertigen Shorts (jeder Satz vollständig, kein Wortanfang des Nachbarsatzes), Szenenwechsel nur an Satzanfängen, Kontaktbogen.
**Zwei Shorts pro langem Video:** A = Story/Paradox mit Person, B = Mythos/Zahl/Du-Bezug. Andere Hook, andere Szenen, andere offene Frage.

## Variante B – Motion-Short (alles per Code, neu vertont)
- Skript ≤ 5.-Klasse-Niveau, 10–12 Sätze, Fakten aus der Faktentabelle. Sätze einzeln vertonen, Wortzeiten holen.
- Bausteine: Hero-Wort (`slam_word`), Zähler, Balken, Icons/Figuren-Sprites (`image`), Live-Zähler in der Ecke, Tag/Nacht-Himmel.
- Tempo oft 1,2× (`werkzeuge/tempo.py`), ~30 s + Überleitung.
- Vorlage: `motion-kit/demo_short.py`.

## Variante C – Story-Motion-Short (Standard für Geschichten)
Story-Formel (aus dem MIT-Skill `cartoon-3d-short`, im 2D-Stil umgesetzt):
1. Hook-Paradox in einem Satz.
2. Ort und Jahr.
3. Eskalation in 3–4 Schritten.
4. „Moment mal …?“
5. „Weißt du,“ + Mechanismus.
6. Glücklicherweise/Unglücklicherweise.
7. Callback auf heute.
8. Gesprochene Überleitung.
Bild: Figuren/Szenen als Karten (`scene_card`) + Code-Grafiken; jede Einstellung schiebt langsam hinein (`push`), Stöße mit Vorzeichenwechsel über 7 Frames auf Schlag-Wörtern (`kick`), ~6 Frames Überblendung am Satzwechsel (`crossfade` im Stil). Musik verspielt, ab der Wendung geheimnisvoll.
3D-Variante (Remotion + three.js): Skill `cartoon-3d-short` – nur, wenn der Stil 3D sein soll; jede Szene/Figur muss dann im eigenen Stil neu designt werden, sonst sieht es aus wie der Referenzkanal.

## Prüfen (Pflicht vor dem Schicken)
- [ ] Kontaktbogen: nichts abgeschnitten, Text lesbar, kein Text über Gesichtern
- [ ] Jeder Satz vollständig (Abschrift), keine Silbe angeschnitten
- [ ] Falsch ausgesprochene Wörter → Satz weg, nicht nur Untertitel korrigieren
- [ ] Szenenwechsel nur an Satzanfängen
- [ ] Lautheit −14 LUFS

## Upload + Posten
- Titel < 60 Zeichen, 2 Sätze Beschreibung + „Ganzes Video: <Titel>“ + Hinweis, 3–5 Hashtags. Das lange Video als „Ähnliches Video“ verlinken.
- 1 Short pro Tag, immer **nach** dem langen Video. Feste Uhrzeit (Zielgruppe beachten, z. B. 18:00 DE = 12:00 US-Ostküste). In YouTube Studio vorplanen. Hochladen macht der Nutzer.
- Leitplanken: nichts erfinden, keine Angstmache, keine fremden Logos ohne Bezug.
