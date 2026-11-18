# Grafik-Katalog: welche Code-Grafik zu welchem Satz

Jede Vorlage hat **Tags in den Worten, die im Skript wirklich stehen**. Beim Szenenplan jeden Satz gegen „Sag es so“ lesen – passt ein Tag, ist die Grafik gesetzt.
- **motion-kit** = Methode in `motion-kit/mk.py` (`c.` = Canvas).
- **Sirio-Board** = Bewegungsvorbild in `werkzeuge/sirio-motion-graphics/boards/` (im Browser öffnen). „bauen“ = gibt es in motion-kit noch nicht → beim ersten Bedarf nach dem Board bauen und hier eintragen.

## 1. Zahlen und Beträge
| Sag es so (Tags) | Grafik | motion-kit | Sirio-Board |
|---|---|---|---|
| „kostet“, „ist wert“, eine einzelne große Summe | Zähler läuft, während die Zahl gesagt wird | `counter` | P198Odometer |
| „das ist so, als ob …“, „jede Sekunde für …“ | Zahl + Vergleichsbild, das sich füllt | `counter` + `image`/Icons (bauen: `fill`) | P226LiquidFill |
| „X Prozent“, „ein Anteil von“ | Torte, Stück für Stück | `pie` | D45Numbers, Y163Share |
| „ergibt zusammen“, „wohin das Geld geht“ | Teile stapeln sich zur Summe | `bars` (bauen: `waterfall`) | C108Waterfall |
| „die Rechnung“, „was du zahlst“, „Posten für Posten“ | Kassenzettel druckt, Stempel | `receipt` | C244Receipt |
| „von X auf Y“, „vorher/nachher“ | zwei Punkte, Linie kippt | bauen: `slope` | C111Slope |
| „wächst“, „mit der Zeit“, „Zinseszins“ | Kurve zeichnet sich | bauen: `line` (aus `arrow`-Kurve) | D44Line |
| „wie riskant“, Bewertung auf Skala | Zeiger/Thermometer | bauen: `gauge` | C115Gauge |

## 2. Vergleiche
| Sag es so | Grafik | motion-kit | Sirio-Board |
|---|---|---|---|
| „viel größer“, „im Vergleich zu“ (Mengen) | Balken nacheinander, der gemeinte bleibt farbig | `bars` (Farbe je Eintrag) | D43Bars, C241ChartFocus |
| „X gegen Y – und der Gewinner ist“ | zwei Karten, Sieger hebt sich, Verlierer grau | `versus` | C249VersusCards |
| „bei Preis, Risiko und …“ (mehrere Merkmale) | zweispaltige Liste mit Haken/Kreuz | `check`, `cross`, `text` | Y164Versus |
| „alle denken … aber eigentlich“ (Mythos) | falsche Aussage durchgestrichen, richtige darunter + Quelle | `text` + `strike` + `tag` | H144MythFact, P228CrossOut |
| „auf der einen Seite … auf der anderen“ | Waage kippt | bauen: `scale` | – |

## 3. Abläufe und Mechanismen (wer zahlt wem was)
| Sag es so | Grafik | motion-kit | Sirio-Board |
|---|---|---|---|
| „zahlt“, „leiht“, „schickt“, „fließt zu“ | Beteiligte als Karten, Ding wandert auf dem Pfeil | `card` + `arrow` + `image` | C245NodeGraph |
| „immer wieder“, „Kreislauf“ | Kreis, Gegenstände laufen gegenläufig | bauen: `cycle` | D47Cycle |
| „Schritt eins … dann … schließlich“ | Stufen bauen sich auf | `checklist` oder bauen: `steps` | D53Steps |
| „besteht aus“, „Schichten“ | Schichten/Baum | bauen: `layers` | D52Tree |
| „von all denen nur …“ | Trichter | bauen: `funnel` | D48Funnel |
| „hängt ab von“, „Kette“ | Kette/Netz | `card` + `arrow` | W69Nodes |
| „baut auf“, „Fundament“ | Pyramide | bauen: `pyramid` | D46Pyramid |
| „wo sich beides überschneidet“ | Venn | bauen: `venn` | D50Venn |

## 4. Zeit und Geschichte
| Sag es so | Grafik | motion-kit | Sirio-Board |
|---|---|---|---|
| „1984 … bis 2024“, „Jahrzehnte später“ | Zeitleiste | `timeline` | D49Timeline |
| Datum als Szeneneinstieg | getipptes Datum / Kalender | `typed` | – |
| Jahr/Ort/Name gesprochen | Schild in der Ecke | `tag` | D56Chapter |
| neues Kapitel | Kapitelkarte, Titel tippt sich (≥ 2 s) | `bg` + `typed` + `title` | D56Chapter |

## 5. Text-Momente
| Sag es so | Grafik | motion-kit | Sirio-Board |
|---|---|---|---|
| der eine Satz zum Merken | Satz schreibt sich, Schlüsselwort markiert | `typed` + `title`(Marker) | D57Quote, P237Highlighter |
| ein Name taucht auf | Hero-Wort knallt rein | `slam_word` | P199Scramble |
| „es gibt N davon“ | Karten fächern sich auf | `card` mehrfach | P211Fan |
| „drei Dinge zum Merken“ (Schluss) | drei Punkte nacheinander | `checklist` | H145Recap |
| Liste durchgehen | nur der genannte Punkt hell | `checklist(focus=True)` | P36Focus |
| Shorts: gesprochener Text | Wort-für-Wort-Untertitel | `captions` | – |

## Bewegungsregeln (aus Sirios System)
- Element erscheint **auf dem Wort**, das es nennt (nie vorher, höchstens 2 s danach).
- **Behälter vor Inhalt**; ein Pfeil erst, wenn beide Enden stehen.
- **Lesezeit:** Text bleibt mindestens max(1,5 s; 0,6 s + Wörter ÷ 3,2) stehen.
- Max. 12 Elemente, Staffelung < 1,5 s.
- **Nie linear** bewegen (ease-out fürs Ankommen, ease-in-out für große Wege, Überschwinger nur für Pops); linear nur für Zähler.
- **Fokus statt Zoom.** Wiederkehrende Grafik immer gleiche Stelle/Größe.
- Zufall immer mit festem Startwert (Konfetti, Partikel).

## Pflege
Neue Grafik gebaut → Zeile hier (Tags in gesprochenen Worten der Videosprache). Zwei Grafiken machen dasselbe → schwächere streichen. „bauen“-Zeilen nur bauen, wenn ein Skript sie braucht.
