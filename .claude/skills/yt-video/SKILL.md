---
name: yt-video
description: Kompletter Ablauf für ein langes YouTube-Video (Erklärvideo, Story-Video, What-If, Listicle) in einem frei wählbaren Animationsstil – von Thema und Recherche über Skript, Szenen- und Animationsplan, Bilder/Animation, Stimme, Schnitt bis zum Upload-Paket. Nutzen, wenn jemand ein YouTube-Video, ein Skript, einen Szenenplan, Animationen, Voiceover, Schnitt oder Upload-Texte will, ein Thema mit Referenzvideos/Transkripten/Links umsetzen möchte („mach ein Video zu X im Stil von Y“) oder Feedback zu einem Video gibt. Für Thumbnails/Titel yt-thumbnail, für Shorts yt-shorts, für den Look stil-studio.
---

# YouTube-Video: von der Idee bis zum Upload

Erprobt an einem Faceless-Erklärkanal (Doodle-Stil, 15+ Videos, bestes Video ~79.000 Aufrufe). Alles hier ist universell; der Look kommt aus dem gewählten Stil (`stile/<name>/STYLE.md`), nicht aus diesem Skill.

**Grundregeln**
- Mit dem Nutzer in seiner Sprache sprechen; Videosprache = Sprache der Zielgruppe (fragen, falls unklar).
- **Nichts erfinden.** Jede Zahl, jedes Zitat, jede Behauptung mit Quelle (Faktentabelle). Nachgestellte Dialoge als solche behandeln.
- **Kosten vor jedem Credit-Schritt nennen** (KI-Bilder, Clips, Stimmen) und Freigabe holen. Kostenlose Wege zuerst (Code, Gratis-Modelle). Alles ins Ledger (`vorlagen/LEDGER.md`).
- Nach jedem Schritt eine Datei oder ein Video schicken und **eine** Entscheidung erfragen.
- Keine Anlageberatung, Heilversprechen oder Prognosen als Fakt; bei heiklen Themen beide Seiten.

## Referenzen (bei Bedarf lesen)
| Datei | Inhalt |
|---|---|
| `references/ideen-verpackung.md` | Ideen-Trichter, Ausschlusskriterien, Logline, Serien-Schablonen |
| `references/recherche.md` | Referenzvideos/Transkripte/Links auswerten, Faktentabelle, Rechnungen |
| `references/skript.md` | Hook-Formel, Aufbau, Satzregeln, Zahlen greifbar machen, Spannungsbogen |
| `references/storytelling.md` | Aber/Deshalb, in den Moment zoomen, Nebenhandlung, Bildregie wie im Film |
| `references/viral-regeln.md` | Thema, Verpackung, Hook, Retention, Prüfliste |
| `references/formate.md` | Explainer, Firmen-/Personen-Story, What-If, Listicle, Mythos-Check – Aufbau je Format |
| `references/szenenplan-animation.md` | Bewegung zuerst planen, Werkzeugwahl (Code / Bild / Clip), Dichte, Clip-Längen |
| `references/bilder-figuren.md` | Stil-Anker, Figurenblätter, Folgeszenen, echte Personen, Bild-QA |
| `references/ton-schnitt.md` | Stimmen, SFX, Musik, Schnitt nach Sätzen, Tempo-Fassung, Endkontrolle |
| `references/qualitaets-checkliste.md` | **Gesammelte Fehler aus 15 Videos – vor JEDER Vorschau abhaken** |
| `references/upload.md` | Beschreibung, Kapitel, Quellen, Kommentar, KI-Kennzeichnung, nach dem Upload |

Andere Skills: `stil-studio` (Look/Branding), `erklaer-grafik` (Grafik-Brief + Katalog), `code-animation` (Engines), `yt-thumbnail`, `yt-shorts`, `higgsfield-praxis` (KI-Bilder/Clips/Stimmen), `brief` (lange Diktate ordnen).

## Schritt 0 – Projekt anlegen
`projekte/<JJJJ-MM-TT>-<slug>/` mit `BRIEF.md`, `faktentabelle.md`, `skript-v1.md`, `szenenplan.md`, `LEDGER.md` (Vorlagen in `vorlagen/`), Unterordner `bilder/`, `audio/`, `grafik/`, `out/`. Stil festlegen: vorhandener Stil aus `stile/` oder mit `stil-studio` einen neuen bauen. **Ohne festen Stil nicht anfangen** – sonst sieht jedes Bild anders aus.

## Schritt 1 – Thema + Verpackung (mehr Zeit hier als bei Animationsdetails)
Nach `references/ideen-verpackung.md`: 3 Ideen-Seiten (Titel, Thumbnail-Skizze, Logline, Beleg). Der Nutzer wählt. Hat er schon ein Thema: nur Logline + Titel/Thumbnail-Idee schärfen.

## Schritt 2 – Referenzen + Recherche
Nach `references/recherche.md`. Referenzvideos (Link → Transkript), Transkripte, Screenshots auswerten: Hook, Struktur, Übergänge, Bildsprache – **Struktur übernehmen ja, Wortlaut/Figuren/Motive nie**. Faktentabelle + Rechnungsdatei. Mehrwert benennen: Was machen die Referenzen nicht?

## Schritt 3 – Skript v1 + Szenen-/Animationsplan → Freigabe
- Skript nach `skript.md` + `storytelling.md` + `viral-regeln.md`, Format `ID | SPRECHER | Text`, Aufbau nach `formate.md`.
- Szenenplan nach `szenenplan-animation.md`: pro Satz Bild/Grafik/Clip, Schnittwort, Bewegung, Schild. Grafik-Sätze mit `erklaer-grafik` (Vorlage aus dem Katalog).
- Kosten schätzen (Sätze × Stimme, Bilder, Clips). An den Nutzer, Freigabe abwarten. Änderungen als v2, v3 … (nie überschreiben, Änderungstabelle oben).

## Schritt 4 – Figuren + Bilder (falls der Stil Bilder nutzt)
Figurenblätter zuerst, Nutzer nickt ab. Dann Szenenbilder nach `bilder-figuren.md` (gratis zuerst, `higgsfield-praxis`). Jedes Bild durch die QA. Reiner Code-Stil: diesen Schritt überspringen.

## Schritt 5 – Animation
- Code-Grafiken mit `motion-kit` (Skill `code-animation`/`erklaer-grafik`).
- KI-Clips nur, wo eine Figur handelt und Code es nicht kann (Start- + Endbild).
- Jede Animation per Standbild prüfen: Anfang, Mitte, Ende.

## Schritt 6 – Stimme
Satz für Satz aufnehmen oder vertonen (eigene Stimme, ElevenLabs, Higgsfield …). Neue Stimmen vorher als Hörprobe. Nur geänderte Sätze neu vertonen. Wortzeiten: `werkzeuge/whisper_words.py`.

## Schritt 7 – Schnitt + Selbstkontrolle (bevor der Nutzer etwas sieht)
1. Schnitt nach Sätzen (`ton-schnitt.md`), Warnungen beheben.
2. Clip-Längen an Szenen anpassen (nichts friert ein, jede Bewegung läuft zu Ende).
3. Kontaktbogen (`werkzeuge/kontaktbogen.py`) + letztes Bild jeder Animation ansehen.
4. **`qualitaets-checkliste.md` komplett abhaken.**
5. Tempo-Fassung nur mit `werkzeuge/tempo.py` (prüft Bild- = Tonlänge), Lautheit −16 LUFS. Dann schicken.

## Schritt 8 – Feedback-Runden
Zeitstempel in Szenen umrechnen (bei Tempo-Fassung × Faktor), **alle gleichartigen Stellen mitkorrigieren**. Neue Fassung als neue Version. **Jeden neuen Feedback-Punkt sofort in `references/qualitaets-checkliste.md` eintragen** (wiederholt → ★). So lernt der Skill den Geschmack des Nutzers.

## Schritt 9 – Thumbnail, Titel, Upload-Paket
Skill `yt-thumbnail`, dann `upload.md`. Kapitel aus der finalen Timeline berechnen.

## Schritt 10 – Nach dem Upload
Vorher Erwartung notieren (Rang unter den eigenen Videos nach 24 h / 7 Tagen). Test & Compare mit 3 verschiedenen Thumbnail-Konzepten. Nach 48 h und 7 Tagen: Aufrufe, Halte-Kurve (wo springen Leute ab?), CTR. Erkenntnisse in diesen Skill.

## Kosten-Orientierung (Erfahrungswerte, 10–14-min-Video)
| Weg | Credits |
|---|---|
| Alles per KI-Bild + Clips, viele Korrekturrunden | ~600 |
| Bilder gratis, Code-Grafiken, wenige Clips | ~100–160 (fast nur Stimmen) |
| Reiner Code-Stil + eigene Stimme | 0 |
Die größten Sparhebel: Szenenplan VOR den Bildern, Checkliste VOR der ersten Vorschau, Code statt Clip wo möglich.
