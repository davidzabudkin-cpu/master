# REMIRA Glossar-Erklärvideo „Order Management System (OMS)“ – Storyboard

Zweck: REMIRA-Marketing, Glossar-Begleitvideo. Ohne Stimme: nur Text im Bild, leise Musik, weiche SFX.
Format: 16:9, 1920×1080, 30 fps, 71,5 s. Inhalte nur aus dem Skript (`OMS_Order_Managment_System_Skript.docx`) und dem Glossarartikel remira.com/de/glossar/order-management-system-oms.
Lesezeit-Regel: Text steht mind. 1 s pro 3 Wörter + 0,8 s (automatisch geprüft in `tools/dump_cues.mjs`).

## Roter Faden: der REMIRA-Ring
Setzt sich aus 6 Blättern zusammen → wird zur „Bestellung“, die Station für Station besucht → wird grau und zur tickenden Uhr (Problem) → die Heldin fliegt durch, der Ring wird wieder bunt → wird zum Order-Hub „OMS“, durch den Bestellungen fließen → sitzt auf dem höchsten Balken → rastet als echtes Logo ein.

## Textänderungen gegenüber dem Skript
- „Eine Bestellung – Prozesse.“ (Zahl fehlt im Skript) → „Eine Bestellung – viele Prozesse.“ (passt zu „viele Schritte“).
- Szene 6 „Ein Order Management System : …“ → „Ein Order Management System bringt:“ + 4 Häkchen. „Weniger Aufwand“, „Zufriedenere Kunden“ aus dem Skript; „Weniger manuelle Fehler“ und „Schnellere Lieferungen“ aus dem Artikel (Automatisierung verringert manuelle Fehler; schnellere Lieferzeiten).
- Kanal „App“ in Szene 4 ergänzt (Briefing); Skript nennt Online-Shop, Marktplatz, Filiale.
- Keine Zahlen im Video; die Balken in Szene 6 sind bewusst ohne Achse/Werte.

## Beats
| # | Zeit (s) | Text im Bild | Visual | Bewegung / Kamera | Ton |
|---|---|---|---|---|---|
| 1 | 0–10,2 | „Was ist ein **Order Management System (OMS)**?“ → „Eine Software, die die gesamte Auftragsabwicklung steuert – von der Bestellung bis zur Lieferung.“ | Ring setzt sich aus 6 Blättern zusammen; Titel rückt nach oben; 4 Stationen Warenkorb → Lager → Paket → Haus, Ring fährt als Bestellung die Linie entlang | sanfter Push-in, Ring dockt an jeder Station an | weiches Einblenden, gestimmte Taps pro Blatt und Station |
| 2 | 10,2–19,4 | „Hinter jeder Bestellung stecken viele Schritte.“ · 5 Stationen: Auftrag erfassen, Bestand prüfen, Ware versenden, Rechnung stellen, Kunden betreuen · „Eine Bestellung – viele Prozesse.“ | Prozesskette, Ring besucht jede Station, Linie füllt sich | Whip nach rechts (Motion Blur), langsamer Drift | Whoosh, aufsteigende Taps |
| 3 | 19,4–29,6 | „DAS PROBLEM“ · „Bestellungen kommen über viele Kanäle – und landen in verschiedenen Systemen.“ · „Manuelle Abstimmung. Fehlende Übersicht. Verzögerte Lieferungen.“ | Online-Shop, Marktplatz, Filiale schießen Zettel auf 3 getrennte Bildschirme, Papierstapel wachsen, rote „?“-Verbindungen; Ring grau als tickende Uhr | Whip nach unten (Abstieg), rötliches Licht | Musik nach Moll, Papier-Swishes, leises Ticken |
| 4 | 29,6–44,6 | „So funktioniert ein OMS“ · ① „Alle Bestellungen laufen zentral zusammen.“ ② „Der Bestand wird in Echtzeit geprüft.“ ③ „Jeder Auftrag geht automatisch an den besten Lieferort.“ + „Lager, Filiale oder Logistikpartner.“ | Heldin fliegt durchs Bild, Ring wird bunt und zum Hub „OMS“; Kanäle (Online-Shop, Marktplatz, Filiale, App) strömen ein; Bestandskarte springt auf „verfügbar“; Aufträge verteilen sich auf Lager, Filiale, LKW | diagonaler Whip nach oben, 3-stufiger Aufbau | Riser → Impact, Ticks für Bestellungen, Glocke bei „verfügbar“ |
| 5 | 44,6–54,6 | „Was dadurch möglich wird:“ · Ship-from-Store · Click & Collect · Automatische Auftragsweiterleitung · Anbindung an ERP und Logistikdienstleister · „Jede Bestellung findet den schnellsten Weg zum Kunden.“ | Hub in der Mitte, 4 Karten poppen auf, Leitungen mit fließenden Punkten | Whip nach rechts | Pop + Tap je Karte |
| 6 | 54,6–62,2 | „Ein Order Management System bringt:“ ✓ Weniger Aufwand ✓ Weniger manuelle Fehler ✓ Schnellere Lieferungen ✓ Zufriedenere Kunden | Häkchen-Liste links, aufsteigende Balken in Ringfarben rechts, Ring oben drauf | Whip nach rechts | Häkchen-Taps, steigende Töne |
| 7 | 62,2–71,5 | Logo (Ring + „REMIRA“, Claim ersetzt durch „Order Management System“) · „Alle Bestellungen. Ein System.“ exakt so breit wie der Logo-Block · „Jetzt mehr erfahren auf REMIRA.COM“ | Ring fliegt in die Mitte, rastet in die Logo-Position, Schriftzug wischt ein | Whip, dann Stand ≥ 5 s | Impact, Schimmer, Musik klingt aus |

## Gate-Check
- Ohne Ton verständlich: jede Aussage steht als Text, Visual zeigt denselben Vorgang. ✔
- Kein schwarzes Bild zwischen Szenen: Übergänge sind Kamerafahrten über eine durchgehende Welt. ✔
- Lesezeit: alle Texte gegen die Regel geprüft (Ausgabe von `tools/dump_cues.mjs`). ✔
- Heroes: nur die Heldin, einmal, ca. 1,5 s, unverzerrt. Hinweis: KI-Nachzeichnung, vor Veröffentlichung mit Marketing abstimmen.

## Runde 2 (12.11.2026, Davids Feedback)
- Alle Icons sind jetzt Original-Phosphor-Icons (regular, v2.1.1, MIT) – Skill `remira-phosphor-icons`, Lizenz in `assets/phosphor/LICENSE.txt`.
- SFX 2,5 dB leiser (Musik gleich), Chip „verfügbar“ aus gemessener Textbreite, Bestandsbalken eine monotone Füllung.
- Endkarte neu (s. Beat 7), alles mittig; Satz per Tintenbreite bündig mit Ring links / Schriftzug rechts.
- Kamerafahrten: Ring fährt mit der Kamera mit und bleibt im Bild, dazu Lichtstreifen in Fahrtrichtung (kein leeres Bild mehr).
- Alte Fassung: `REMIRA-OMS-Erklaervideo-v1.mp4`.

## Runde 3 (12.11.2026)
- Text ruhig: Kamera steht im Stand still (Zoom 1, ganze Pixel), nur Partikel driften; Text auf ganze Pixel gerundet, Korn statisch. Geprüft: 2 × 15 Folgeframes, Pixeldifferenz im Textbereich ≈ 0.
- Icons Phosphor **bold**, 12 % größer (Davids Rückmeldung „REMIRA-Icons sind dicker“).
- Endkarte auf Bildmitte: Tinte Ring links bis „A“ rechts 531–1389 px (Mitte 960,0), Satz 531–1389 (Mitte 960,0), Button-Mitte 959,5.
- Alte Fassungen: `-v1.mp4`, `-v2.mp4`.

## Runde 4 (12.11.2026) – zwei Endkarten zur Wahl
- Gerendert wird nur das Ende ab 60 s (`node src/render.js --from 60 --to 71.5 --variant A|B …`), Anfang identisch aus v3, Ton aus v3.
- A (`-A-mittig.mp4`, `endkarte-A.png`): ohne Schlusspunkt, Zeile 40 px rechts der Bildmitte (Tinten-Mitte 999; Schriftzug-Mitte wäre +126, zu weit).
- B (`-B-linksbuendig.mp4`, `endkarte-B.png`): Satz und Button linksbündig an REMIRA (Tinte 784), Satz so breit wie REMIRA, Block mittig.
- Hauptdatei = v3, bis David wählt. Messung: `python tools/measure_end.py endkarte-A.png`.

## Runde 5 (16.11.2026, Marketing-Team) – Hauptdatei = Endkarte B
- Linien-Ketten nur zwischen den Kreisen (Rand + 6 px); Kreis verschwindet unter der Bildmarke, kommt als „erledigt“ zurück.
- Ruhe: Szene blendet 0,45 s vor jeder Kamerafahrt aus, in der Fahrt nur Bildmarke; Streifen 7 statt 26, dezent, beim Wendepunkt keine. Wendepunkt: Problem aus → Heldin → Hub.
- Texte: „…viele Schritte:“, Fußzeile „Eine Bestellung – viele Prozesse.“ entfernt; „…viele Kanäle und landen…“ (ohne Strich); Schlagworte ohne Punkt; „…besten Lieferort:“; „…sorgt für:“; Intro „…steuert, von der Bestellung…“ (Komma statt Gedankenstrich).
- Musik neu: 116 BPM, Kick/Clap/Hats, Bass, Plucks, Fills + Crash auf den Übergängen, Drop auf den Hub, Drums stoppen beim Logo.
- Hausregeln jetzt im Skill `remira-erklaervideo`. Vorfassung: `-v4-B.mp4`.
- Runde 6 (16.11.): Intro 0–13 s neu gemischt (keine Claps, Kick/Hats leiser, Übergang bis 0:13), ab 13,2 s Ton identisch mit v5 (tools/splice_intro.py). Vorfassung -v5.mp4.
- Runde 7 (16.11.): Badges/Häkchen/Bullets auf Mitte der Großbuchstaben (capMid, tools/measure_badges.py), nur Szenen 19,4–44,6 s und 54,6–62,2 s neu, Ton unverändert. Dateien heißen jetzt REMIRA-…; Vorfassung REMIRA-OMS-Erklaervideo-v6.mp4.
