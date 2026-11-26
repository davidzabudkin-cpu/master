# Commerce-Plattform: 8 neue Punkte für die blauen Flächen (Vorschlag, noch nicht eingebaut)

Stand 26.11.2026. Anlass: Die bisherigen Texte links/rechts stammen aus der allgemeinen Plattform-Grafik, nicht aus Commerce (Marketing).
Quelle (öffentlich): remira.com/de/omnichannel-commerce-software, Abschnitte „Welche Herausforderungen löst die REMIRA Omnichannel Commerce Software?“ (H) und „Was sind die Vorteile …?“ (V). Kundennamen von der Seite sind bewusst nicht verwendet.
Länge und Zeilenumbruch wie in der bisherigen Grafik (2–3 Zeilen je Punkt). Icons: Phosphor light.

## Links: Herausforderungen

| # | DE | EN (Entwurf) | Icon | Quelle |
|---|---|---|---|---|
| 1 | Nicht synchronisierte Bestände über alle Kanäle | Unsynchronized stock across all channels | `stack` | H „Isolierte und nicht synchronisierte Bestände über mehrere Kanäle“ |
| 2 | Overselling und fehlende Transparenz über Orders | Overselling and lack of order transparency | `warning` | H „Overselling sowie fehlende Transparenz über Orders und Retouren“ |
| 3 | Medienbrüche zwischen Shop, Filiale und Backend | Media breaks between shop, store and back end | `link-break` | H „Medienbrüche zwischen Shop, Filiale und Backend“ |
| 4 | Hoher manueller Abstimmungsaufwand | High manual coordination effort | `hand-pointing` | H „Hoher manueller Abstimmungsaufwand zwischen Systemen“ |

## Rechts: Vorteile

| # | DE | EN (Entwurf) | Icon | Quelle |
|---|---|---|---|---|
| 1 | Verbesserte Effizienz in allen Filialprozessen | Improved efficiency in all store processes | `chart-line-up` | V „Verbesserte Effizienz: … all Ihre Filialprozesse …“ |
| 2 | Erhöhte Kundenzufriedenheit durch mobile Beratung | Higher customer satisfaction through mobile advice | `smiley` | V „Erhöhte Kundenzufriedenheit: Dank zahlreicher mobiler Funktionen …“ |
| 3 | Volle Skalierbarkeit für neue Anforderungen | Full scalability for new requirements | `arrows-out` | V „Volle Skalierbarkeit … schnell auf neue Anforderungen zu reagieren“ |
| 4 | Kanalübergreifende Prozesse mit allen Zahlen im Blick | Cross-channel processes with all figures in view | `arrows-split` | V „Kanalübergreifende Prozesse … behalten Sie alle Zahlen stets im Blick“ |

## Alternativen (falls einzelne Punkte nicht passen)
- Single Source of Truth für Bestände, Preise und Kundendaten (Seite: „… eine Single Source of Truth für Bestände, Preise, Produktdaten, Kundendaten und Bestellungen“)
- Schnelle Digitalisierung durch nahtlose Integration (V „Schnelle & unkomplizierte Digitalisierung“)
- Fehlende Bestandstransparenz (H)

Nach Freigabe: Texte in `src/data.js` (CHALLENGES/BENEFITS) eintragen, Icons mit `phosphor.py js … --weight light` holen, neu rendern (Ton bleibt gleich).
