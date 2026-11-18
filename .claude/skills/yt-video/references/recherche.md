# Referenzen + Recherche

## Was der Nutzer mitgeben kann – und was du damit machst
| Input | Vorgehen |
|---|---|
| **YouTube-Link** | Transkript holen (vidIQ `video_transcript`, `yt-dlp --write-auto-subs --skip-download`, oder der Nutzer kopiert es aus YouTube „Transkript anzeigen“). Dazu Titel, Aufrufe, Kanal-Schnitt (Ausreißer?). |
| **Transkript (Text/Datei)** | Satz für Satz in eine Analyse-Tabelle zerlegen (unten). |
| **Screenshots/Frames** | Pro Bild notieren, *was genau* wirkt: Bildaufbau, Farbe, Schrift, Bewegung, Figurenstil. Für den Look → `stil-studio`. |
| **Eigene Notizen/Diktat** | Erst mit Skill `brief` ordnen. |
| **Artikel/PDF/Studien** | Fakten mit Seitenzahl/Link in die Faktentabelle. |

## Analyse-Tabelle für Referenzvideos (Datei `analyse-referenzen.md`)
| Abschnitt | Zeit | Was passiert (Inhalt) | Technik (Hook, Frage, Wendung, Witz) | Bild/Animation | Was fehlt / was machen wir besser |
Darunter:
- **Hook-Mechanik** in einem Satz (z. B. „echte Person + Paradox + Betrag + Frage“).
- **Struktur** als Liste von Kapiteln mit der Frage, mit der jedes endet.
- **Wiederkehrende Mittel** (Running Gag, Zähler, Leitmotiv-Satz).
- **Unser Winkel:** 1–3 Sätze, was wir anders und besser machen.
**Regel:** Struktur und Technik übernehmen ja – Wortlaut, Figuren, konkrete Motive, Markennamen nie.

## Faktentabelle (`faktentabelle.md`)
| ID | Aussage im Skript | Quelle (Link, Seite) | Status |
|---|---|---|---|
| F01 | „Die USA schulden 38 Bio. $“ | treasury.gov … | ✓ belegt / ~ vereinfacht / ⚠ prüfen |
- Jede Zahl, jedes Zitat, jedes Datum. Vor dem Upload alle ⚠ klären.
- Zitate im Original, nicht „vereinfachen“. Wenn die Quelle „schrumpft“ sagt, nicht „verloren“ schreiben.
- Primärquellen bevorzugen (Behörde, Geschäftsbericht, Studie), Medien als Zweitquelle.

## Rechnungen (`rechnungen.py`)
Alle Rechnungen und Alltagsvergleiche als kleines Python-Skript, damit sie nachprüfbar sind („500 $ pro Sekunde seit Jahr 0 ≈ 32 Bio. $“). Ergebnis in die Faktentabelle übernehmen. **Jeder Alltagsvergleich wird vorher nachgerechnet.**

## Beispiel-Figuren realistisch halten
Erfundene Beispielpersonen (Max, 32, Mieter) mit belegbaren Werten: Alter, typisches Einkommen, Sparquote – mit Quelle, damit sich Zuschauer wiederfinden.
