---
name: auftrag-verstehen
description: Erster Schritt bei JEDER Nachricht von David, bevor irgendetwas gebaut, geschrieben oder geändert wird. Übersetzt das Gesagte (oft Diktat, sprunghaft, vage) in einen präzisen internen Auftrag mit Ziel, Ergebnis, Maßstab und Skill-Kette und legt das Antwortformat fest (kurz, Ergebnis zuerst). Nutzen bei jeder Aufgabe (REMIRA-Videos, Grafiken, Websites, Texte, Präsentationen), bei Feedback und Korrekturen von David oder Kolleginnen, und immer wenn David sagt „versteh erst, was ich meine“, „mach daraus einen Prompt“ oder „du hast mich nicht verstanden“. Für sehr lange Diktate danach diktat-zu-brief.
---

# Auftrag verstehen

David formuliert mündlich (Sprache-zu-Text). Er weiß, was er will, sagt es aber nicht so, wie man es einem Modell hinschreiben würde. Deine Aufgabe: aus seinen Worten den Auftrag schreiben, den er geschrieben hätte, wenn er Zeit dafür hätte. Dann erst arbeiten. Typische Fehler, die das verhindern soll: „Diktat zu wörtlich umgesetzt“, „nur den einen Satz geflickt“, „Regeln erst am Ende gelesen“.

## Die 5 Schritte (im Kopf, 30 Sekunden bei kleinen Aufgaben)

**1. Absicht.** Was soll danach anders sein? Nicht „was hat er gesagt“, sondern „wozu“.

**2. Kontext laden, bevor du arbeitest.**
- `CLAUDE.md` im Kit-Ordner und den zuständigen Skill **zuerst** lesen, inklusive Regel-/Fehlerabschnitte (bei REMIRA-Videos: `remira-erklaervideo`).
- Gab es das schon? Wenn David etwas erwähnt („das OMS-Video“, „die Plattform-Grafik“, „wie beim letzten Mal“), meint er etwas Bestimmtes, das in `remira/` oder `CLAUDE.md` dokumentiert ist. Nachschlagen, nicht raten.

**3. Auftrag formulieren** (intern; bei größeren Aufgaben als Datei über diktat-zu-brief):
```
Ziel:        ein Satz, das Wozu
Ergebnis:    was genau entsteht (Datei, Format, Länge, Ort)
Maßstab:     woran David erkennt, dass es gut ist (prüfbar)
Muss/Soll/Kann
Nicht anfassen: was schon gefällt
Skill-Kette: welche Skills in welcher Reihenfolge
Annahmen:    was ich annehme, weil er es nicht gesagt hat
```

**4. Diktat-Fallen prüfen.**
- Verhörer: „Cloud“ = Claude, „Remia/Remiro“ = REMIRA, „Fabel“ = Fable (Claude-Modell), „Hixfield/Hicksfield“ = Higgsfield, „Pfosten“ = Phosphor.
- „lassen“ heißt oft „weglassen“. Im Zweifel fragen.
- Zahlen, Preise, Daten aus Diktat an der Quelle prüfen, nie ungeprüft übernehmen.
- Vage Wörter („cooler“, „krasser“, „cleaner“, „schief“) → 2–3 konkrete Varianten oder eine messbare Angabe.
- Feedback von Kolleginnen (Screenshots aus Teams): erst die Stelle im Video/auf der Seite selbst ansehen (Standbild bei der genannten Sekunde), dann deuten, Deutung kurz nennen, dann umsetzen.
- Widerspruch zu einer früheren Regel? Benennen, nicht still eine Seite wählen.

**5. Entscheiden, wie es weitergeht.**
| Lage | Tun |
|---|---|
| Klein und eindeutig | Machen. Annahme in einer Zeile nennen. |
| Groß, viele Wünsche, lange Sprachnachricht | diktat-zu-brief → Kurzfassung „so habe ich dich verstanden“ → weiterarbeiten |
| Eine Entscheidung blockiert wirklich (teuer, nicht umkehrbar, Geschmack) | Genau **eine** Frage mit Empfehlung. Alles andere mit Annahme weitermachen. |
| Geschmacksfrage mit 2 guten Wegen (z. B. Layout) | Beide Varianten bauen, je ein Standbild zeigen, David wählt. |

## Bei Korrekturen
1. Welche **Klasse** von Fehler ist das? (z. B. „Punkt nicht auf Texthöhe“ betrifft alle Aufzählungen, nicht nur die genannte.)
2. Alle Vorkommen prüfen und beheben.
3. Kleine Änderung = kleiner Eingriff (nur betroffene Szene neu rendern, Rest unverändert).
4. Alte Fassung vorher sichern (`…-vN`).
5. Die Regel in den zuständigen Skill schreiben (Skill `skill-schmiede`).

## Antwortformat (gilt immer)
- **Ergebnis zuerst.** Erste Zeile = das, was er wissen will.
- **Kurz.** Richtwert 3–8 Zeilen. Keine Einleitung, keine Floskeln.
- **Details in Dateien**, im Chat nur, was drinsteht.
- **Ehrlich.** Was nicht geprüft ist, steht da (z. B. „Ton gemessen, nicht angehört“).
- **Höchstens eine offene Entscheidung** am Ende, mit Empfehlung.
- Deutsch, direkt, locker.
