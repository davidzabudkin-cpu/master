# Grafik-Brief: welche Sätze ein Bild brauchen

Methode nach Sirios `explainer-board-brief` (in `werkzeuge/sirio-motion-graphics/skills/`), für bildbasierte und reine Code-Stile umgebaut.

## Pass 1 · Satz-Liste
Jeder Satz hat seine ID aus dem Skript (`ID | SPRECHER | Text`). Nichts neu nummerieren.

## Pass 2 · Jeder Satz bekommt eine Entscheidung
| Entscheidung | Wann | Was gebaut wird |
|---|---|---|
| **GRAFIK** | Zahl, Betrag, Prozent · Vergleich · Geld/Dinge wandern zwischen Beteiligten · Ablauf mit Schritten · Fachwort zum ersten Mal · genaues Zitat · Beleg (Dokument, Kurve) | Code-Grafik aus dem Katalog |
| **GLEICHE GRAFIK** | Satz setzt das Bild davor fort (nächster Schritt, nächste Zahl) | neuer Aufbau-Schritt in derselben Grafik |
| **SZENE** | Erzählung, Figur handelt, Stimmung, Übergang, Frage an den Zuschauer | Szenenbild/Clip (oder Code-Szene im reinen Code-Stil) |

Zu jeder GRAFIK: **„Danach weiß der Zuschauer: …“** Gelingt der Satz nicht, ist die Skriptstelle unklar → Skript-Notiz (Pass 7).
Mischung prüfen (bildbasierter Stil): Code-Grafiken nur für Erklärendes, sonst wirkt das Video „basic“.

## Pass 3 · Wortliste / Glossar
Jeden Fachbegriff, jede Zahl, jeden Namen: wo zuerst erklärt? Beschriftungen immer exakt dieselben Wörter.

## Pass 4 · Rolle jeder Zahl
**Geld** · **Prozent** · **Anzahl** · **Jahr/Datum** · **Dauer** · **wiederholt** (schon gezeigt → steht sofort da, ohne Zähler/Pop).
Folgen: Währungsformat nur bei Geld; Anzahl nie mit Währung; Jahreszahlen nie als Zähler.

## Pass 5 · Grafik beschreiben (Kompaktformat)
```
G_KAFFEE · WOHIN 5 € FÜR EINEN KAFFEE GEHEN   (B04–B06, Katalog: bars)
Danach weiß der Zuschauer: Die Miete kostet mehr als die Bohnen.
Bild: 4 Balken (Bohnen, Miete, Personal, Gewinn), Gewinn in Akzentfarbe
Aufbau (Element → Schnittwort):
  sofort: Titel, Grundlinie
  Balken Bohnen → "Bohnen"
  Balken Miete → "Miete"
Quelle: Faktentabelle F12 (Beispielzahlen → Schild BEISPIEL)
```
- Schnittwort wörtlich aus dem Skript, nie eine Zahl, nie ein Wort, das ein anderes einleitet.
- **Behälter zuerst** (Rahmen, Achsen), Inhalt auf sein Wort.
- **Nie leer, nie still:** erste Sekunde steht etwas, danach alle 3–5 s ein Schritt.
- Fehlende Zahl → `[FEHLT: …]` statt erfinden.

## Pass 6 · Prüfen
1. **Nur Ton:** Versteht ein Neuling jeden GRAFIK-Satz mit seiner Grafik?
2. **Nur Bild (stumm):** Sagt jede Grafik ihre Aussage ohne Stimme?
3. Titel/Aussage, Bild, alle Zahlen mit Rolle und Quelle.
4. Ein Bild pro Grafik – lieber Aufbau-Schritte als zwei Grafiken auf einer Fläche.
5. Wiederkehrende Grafik (roter Faden): gleiche Position, gleiche Größe, nur Neues leuchtet.

## Pass 7 · Skript-Notizen
Was der Plan aufdeckt (fehlendes Beispiel, Begriff zu früh, Brücke fehlt) als nummerierte Vorschläge an den Nutzer. Skript nie still ändern.

## Selbst-QA nach dem Rendern
Standbilder 0,1 s vor jedem Schnittwort (Element noch nicht da) und 0,5 s danach (muss da sein), plus Endbild. Text ≥ 28 px, nichts am Rand, nichts abgeschnitten/überlappt, nichts > 5 s still, keine erfundenen Zahlen. **Jeder neue Fehlertyp wird eine Regel.**
