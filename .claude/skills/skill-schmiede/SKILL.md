---
name: skill-schmiede
description: Prüft am Ende jeder Aufgabe und bei jeder Korrektur von David oder Kolleginnen, ob daraus ein neuer Skill, eine Skill-Erweiterung, ein Eintrag in CLAUDE.md oder nichts werden soll, und setzt das direkt um. Nutzen bei JEDEM Abschluss einer Aufgabe, bei jedem Feedback, wenn David etwas zum zweiten Mal erklärt, wenn ein Ablauf mehrere Schritte und Werkzeuge braucht, und wenn David sagt „mach daraus einen Skill“, „merk dir das“, „das hatten wir schon“, „schon wieder derselbe Fehler“ oder „verbessere den Workflow“.
---

# Skill-Schmiede

Zweck: Mit jeder Aufgabe besser werden, statt dieselben Erklärungen und Korrekturen zu wiederholen (Davids ausdrücklicher Wunsch, 16.11.2026).

## Wann prüfen (immer, 30 Sekunden)
1. Bevor eine Aufgabe als fertig gemeldet wird.
2. Sobald David oder eine Kollegin etwas korrigiert („falsch“, „nochmal“, „schief“, „gefällt mir nicht“).
3. Sobald ein Ablauf zum zweiten Mal vorkommt.

## Entscheidung (die erste passende Zeile gilt)
| Lage | Ergebnis |
|---|---|
| Korrektur zu einem Ablauf, für den es schon einen Skill gibt | **Skill erweitern**: Regel als prüfbares Gate an die Stelle, wo der Fehler entsteht. Mit Datum und Wortlaut („Marketing 16.11.: …“, Rolle statt Name – keine Personennamen speichern). |
| Gleicher Ablauf zum 2. Mal, mehrere Schritte/Werkzeuge, kein Skill dafür | **Neuen Skill anlegen** (Vorlage unten) |
| Fehler kam ≥ 2× trotz Regel | Regel war nicht prüfbar → **Werkzeug oder Pflicht-Check** bauen (Messskript, Checkliste vor der Vorschau) |
| Einzelne Vorliebe/Fakt über David oder ein Projekt | Kurz in `CLAUDE.md` unter „Gelernt“ eintragen (mit Datum) |
| Einmalig | **Nichts** |

Lohnt sich als Skill, wenn mindestens 2 zutreffen: kommt wieder · mehrere Schritte in fester Reihenfolge · teure Fehler (Credits, Zeit) · Davids/REMIRAs Geschmack steckt drin.

## Vorher nachsehen
`.claude/skills/*/SKILL.md` durchsehen. Passt ein bestehender Skill zu 70 %, diesen erweitern statt einen neuen anlegen.

## Vorlage für einen neuen Skill
Ordner `.claude/skills/<name>/SKILL.md`:
```markdown
---
name: <kurz-mit-bindestrich>
description: <Was er tut, ein Satz>. Nutzen, wenn <Auslöser in Davids Worten, 4–8 Beispiele>. <Abgrenzung>.
---
# <Titel>
Zweck, Datum, Vorbild-Projekt.
## Ablauf (nummeriert, Werkzeug + Ergebnis je Schritt)
## Gates (prüfbar, vor dem Zeigen abhaken)
## Regeln und Geschmack (mit Datum)
## Fehler, die schon passiert sind (Ursache → Gegenmaßnahme)
## Referenzen
```
SKILL.md unter ca. 150 Zeilen, Details in `references/`, Skripte in `scripts/`.

## Danach
David in **einer Zeile** Bescheid geben („Regel X in Skill Y ergänzt“). Keine Rückfrage für kleine Ergänzungen.

## Nicht tun
Keine Skills für Einmaliges, keine Doppel-Skills, keine Regeln ohne Prüfbarkeit („besser aufpassen“ ist keine Regel; „Badge-Mitte = Mitte der Großbuchstaben, mit measure_badges.py ±1 px prüfen“ ist eine).
