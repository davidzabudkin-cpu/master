# Methoden und Fallstudien – was funktioniert hat und was nicht

Kurzfassung aller Erkenntnisse aus den Original-Projekten (Okt.–Nov. 2026). Die Details stehen in den Skills; hier steht das „Warum“.

## 1. Die wichtigsten Erkenntnisse
1. **Thema + Verpackung schlagen Animation.** Ein Video mit bekanntem Namen + Paradox (Split-Thumbnail mit historischer Person, „0 $ ↔ 40 Billionen $“) holte ~79.000 Aufrufe; abstrakte Themen blieben unter 2.000 – bei gleicher Produktionsqualität.
2. **Bewegung planen, bevor Material entsteht.** Größter Zeit- und Credit-Fresser waren Bilder, die „irgendwie animiert“ werden sollten.
3. **Checkliste vor der Vorschau.** Ein Video hatte 6 Schnittfassungen, fast nur wegen wiederkehrender Punkte (Bild passt nicht zum Satz, Animation friert ein, Text über Gesichtern). Seit der Checkliste: deutlich weniger Runden.
4. **Hybrid-Look gewinnt:** KI-Szenenbilder (gratis Modell) + Code-Grafiken für alles Erklärende. Reiner Code-Look wurde als „zu basic“ empfunden, reine KI-Clips waren teuer und fehleranfällig.
5. **Kosten sinken mit Prozess:** Video 2 ≈ 600 Credits (viele Korrekturrunden, CLI-Bilder) → Video 3 ≈ 65–160 Credits (gratis Bilder, Code-Grafiken, fast nur Stimmen).
6. **Feedback sofort in Regeln verwandeln.** Jeder Punkt, der zweimal kam, wurde mit ★ markiert – dadurch wiederholte er sich nicht mehr.

## 2. Fallstudie: Erfolgs-Explainer (bestes Video)
- Thema: große bekannte Zahl + Frage („Wem schuldet Amerika 40 Bio. $?“), Hook mit historischer Person, die die Schulden einmal auf 0 brachte.
- Spannungsbogen: Leitfrage erst am Schluss beantwortet, jedes Kapitel endet mit neuer Frage.
- Bild: Analogie-Dorf + Code-Grafiken (Torte, Waage, Zeitleiste, Ampel), echte Personen als Karikatur.
- Thumbnail-Gewinner: Split mit der Person, „0 $ | 40 BILLIONEN $“.

## 3. Fallstudie: Firmen-Story (4 Feedback-Runden, jetzt Vorlage)
Mehrere Menschen mit rotem Faden über Jahrzehnte, 10 Kapitel mit Ort+Jahr-Karte, Siege mit Stempel/Konfetti, Szenenplan als Code (pro Satz Shots mit Schnittwort, Bewegung, Schild, Prompt), Bilder gratis als 2×2-Raster, Bewegung meist „Standbild + leichtes Atmen“ statt Zoom, wenige Clips laufen ganz durch, Schnitt → Tempo 1,3× → Stichproben-Standbilder.

## 4. Fallstudie: What-If-Video
„Wähle deinen Tag“-Interaktion (Optionen zeigen, nicht vorlesen), Zähler läuft durch, Käufe als Simulation. Lehren: Interaktion = ein Animationsablauf; Einblender max. 2×; kein stummer Abspann (11,5 s Pause war schlecht für Retention); Thema muss im Thumbnail sofort sichtbar sein.

## 5. Shorts – was abgenommen wurde und was nicht
- **Abgenommen:** ganze Sätze mit kurzer Pause, eine Szene pro Satz (ganzes 16:9-Bild als Karte), Wort-für-Wort-Untertitel, oben höchstens ein Schlagwort, fast keine SFX, gesprochene Überleitung aufs lange Video.
- **Abgelehnt:** Whoosh-/Pop-Sounds, Kreise, große Überschriften, angeschnittene Sätze, nachhängende Untertitel, zu viele/zu kurze Szenen, Wackeln.
- **Story-Motion-Short (2D)** wurde Standard; **3D-Shorts** wurden verworfen (sahen aus wie der Referenzkanal bzw. passten nicht zum 2D-Kanal-Look). Lehre: Ein fremder Stil muss komplett in den eigenen übersetzt werden – oder man lässt ihn.

## 6. Kurzfilme (Strichfiguren)
Story muss man fühlen (persönlicher Grund, Zweifel von allen, konkreter Struggle). Regie wie ein Film: pro Beat Totale → Hände → Gesicht. Gebeugte Code-Gliedmaßen wirkten falsch → gerade Stäbe, Pendel-Gang. Hybrid aus KI-Hintergrund ohne Figuren + Code-Figuren funktioniert.

## 7. Produktfilm (21 Versionen)
KI-Film in einem Durchgang + lokaler Schnitt auf gemessenen Beat + Motion-Ebene per Code + Ton aus Ebenen. „Richtig krass“ war die Fusion KI-Film + Motion-Design. Final: am Anfang nur Maschinen-Ton, Musik ab dem Markenmoment, Drop auf der Produkt-Enthüllung. Fehler: zu laute/plötzliche Effekte, zu viele Whooshes, Musik aus dem Nichts, ruckelnde Clips eines schwächeren Modells.

## 8. Website
Flüssig vor Effekt; Bühnen statt Hochschieben; Handy ist Hauptversion (360/390 px prüfen); gespulte Videos springen am Handy → Bildfolge auf Canvas; „erst sichtbar, dann schwer“ hob PageSpeed mobil von 65 auf 86; Texte erscheinen zeitgesteuert, nicht am Scrollweg.

## 9. Thumbnails (A/B-Tests)
Autoritätsperson aus dem Video + verrückter Ausdruck + Split > Maskottchen-Schockgesicht + Zahl (zweimal Letzter). Viele Varianten zeigen (4–6), Nutzer kombiniert.

## 10. Arbeitsweise mit Claude
- Lange Sprachnachrichten erst als Brief ordnen.
- Nach jedem Schritt eine Datei + **eine** Entscheidung.
- Mehrere Sessions auf einem Higgsfield-Konto blockieren sich gegenseitig (Gratis-Warteschlange) und verbrauchen parallel Credits → Transaktionen prüfen.
- Lange Projekte mit `STATUS.md` übergeben, statt endlose Threads.
- Claude kann nicht hören: Ton wird gemessen (Lautheit, Stille, Sync), nicht angehört – das immer dazusagen.
