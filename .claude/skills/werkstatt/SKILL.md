---
name: werkstatt
description: Einstieg und Weiche für ALLE kreativen Aufträge in diesem Kit – liest den Prompt, erkennt was gebraucht wird (YouTube-Video, Skript, Short, Thumbnail, Stil/Branding, Erklär-Grafik, Code-Animation, Story-Film, Produktfilm, Website, KI-Bilder) und legt fest, welche Skills in welcher Reihenfolge benutzt werden, mit welchen Eingaben und Freigabe-Punkten. Nutzen bei jedem neuen Auftrag wie „mach ein Video zu …“, „ich will einen Kanal über …“, „hier ist ein Transkript/Link, orientier dich daran“, „bau mir …“, „was kann ich mit dem Kit machen?“, oder wenn unklar ist, welcher Skill passt.
---

# Werkstatt: welcher Skill, in welcher Reihenfolge?

Du bist die Regie. Bevor du arbeitest, legst du in 3–6 Zeilen fest: **Ziel · Format · Stil · Skill-Kette · Freigabe-Punkte · Kosten**. Dann zeigst du das dem Nutzer kurz und legst los (nur bei echten Blockern fragen).

## 1. Prompt lesen und einordnen
| Signal im Prompt | Auftrag | Skill-Kette |
|---|---|---|
| langes Diktat, viele Wünsche durcheinander | erst ordnen | `brief` → dann weiter unten |
| „Video zu Thema X“, „erklär …“, Transkript/YouTube-Link/Referenzen | langes YouTube-Video | (`stil-studio` falls kein Stil) → `yt-video` (+ `erklaer-grafik`, `code-animation`, `higgsfield-praxis`) → `yt-thumbnail` → `yt-shorts` |
| „nur das Skript“, „schreib mir ein krasses Skript“ | Skript | `yt-video` Schritt 1–3 (Referenzen → Faktentabelle → Skript + Szenenplan) |
| „Short“, „Reel“, „TikTok“ | Kurzvideo | `yt-shorts` (+ `code-animation`) |
| „Thumbnail“, „Titel“, „Banner“ | Verpackung | `yt-thumbnail` (+ `higgsfield-praxis`) |
| „Stil“, „Look“, „wie Kanal X“, „Branding“, „Logo“, „Farben“ | Stil/Marke | `stil-studio` |
| „Animation“, „Grafik für diese Zahl“, „mit Code“, „ohne Higgsfield“ | Code-Animation | `erklaer-grafik` (Erklärendes) / `code-animation` (alles andere) |
| „What if you …“, Strichfiguren, emotionaler Kurzfilm | Story-Film | `story-film` (+ `code-animation`) |
| Produkt, Marke, Launch, Werbespot, Logo-Reveal | Produktfilm/Reel | `produktfilm` (+ `higgsfield-praxis`, `code-animation`) |
| „Website“, „Landingpage“, „Portfolio“ | Website | (`stil-studio`) → `website` |
| KI-Bild/-Video/-Stimme erzeugen, Kosten, Higgsfield | Generierung | `higgsfield-praxis` |
| 3D-Cartoon-Welt, gleitende Kamera | 3D-Short | `cartoon-3d-short` |
| „Was kann das Kit?“ | Überblick | `CLAUDE.md` Abschnitt „Was hier drin ist“ zeigen + 3 Beispiel-Prompts |

Mehrere Signale → die Kette in sinnvoller Reihenfolge: **Brief → Stil → Recherche/Skript → Szenenplan → Material → Schnitt → Verpackung → Shorts.**

## 2. Pflicht-Weichen (immer prüfen)
1. **Gibt es einen festen Stil?** (`CLAUDE.md` → „Mein Kanal“ oder `stile/<name>/`). Nein → zuerst `stil-studio` (5 Stile zeigen oder Referenzen analysieren). Ohne Stil kein Bild.
2. **Budget:** 0 Credits (reiner Code + eigene Stimme) / gratis KI-Bilder + Code / mit Clips. Unklar → 0-Credit-Weg vorschlagen und Kosten der Upgrades nennen.
3. **Sprache des Videos** und Zielgruppe.
4. **Referenzen vorhanden?** YouTube-Link/Transkript/Screenshots → `yt-video/references/recherche.md` (Struktur übernehmen, nie Wortlaut/Figuren).
5. **Rechtliches:** nichts erfinden, Quellen, keine fremden Figuren/Logos/Musik, KI-Kennzeichnung.

## 3. Standard-Auftrag „Video zu X mit diesen Referenzen, in diesem Stil, krasses Skript + Animationen“
1. Projektordner `projekte/<datum>-<slug>/` + `BRIEF.md` (Ziel, Zielgruppe, Länge, Stil, Budget).
2. Stil laden oder mit `stil-studio` festlegen (Vorschau → Wahl).
3. Referenzen auswerten (Analyse-Tabelle), Faktentabelle + Rechnungen.
4. 3 Titel-/Thumbnail-Ideen + Logline → **Freigabe 1**.
5. Skript v1 nach Hook-Formel + Storytelling + Format → **Freigabe 2** (mit Kostenschätzung).
6. Szenenplan + Grafik-Brief (jeder Satz: GRAFIK / GLEICHE GRAFIK / SZENE, Werkzeug, Schnittwort) → bei Bedarf **Freigabe 3**.
7. Material: Code-Grafiken (motion-kit), ggf. Figurenblatt + Szenenbilder (gratis zuerst), wenige Clips.
8. Stimme → Wortzeiten → Schnitt → Kontaktbogen → Qualitäts-Checkliste → Vorschau an den Nutzer.
9. Feedback-Runden (jede neue Regel in die Checkliste).
10. Thumbnail + Titel A/B/C + Upload-Paket → 2 Shorts.

## 4. Antwort-Muster am Start eines Auftrags
```
Verstanden: <Ziel in einem Satz>
Format: <z. B. Explainer, 10 min, Englisch> · Stil: <stil oder „wählen wir zuerst“> · Budget: <0 / ~X Credits>
Ablauf: brief → stil-studio → yt-video (Recherche → Skript → Szenenplan) → erklaer-grafik → yt-thumbnail → yt-shorts
Erste Freigabe: <was du als Nächstes zeigst>
```

## 5. Wenn ein Skill fehlt
Gibt es für einen wiederkehrenden Auftrag keinen Skill: nach dem ersten erfolgreichen Durchlauf mit dem Nutzer einen neuen Skill unter `.claude/skills/<name>/SKILL.md` anlegen (Muster: vorhandene Skills; Beschreibung mit den Worten, die der Nutzer benutzt) und hier in Tabelle 1 eintragen.
