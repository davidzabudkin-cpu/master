# 3. Relaunch-Konzept remira.com mit CLEAN Pro (Entwurf, intern)

Leitidee: **Zwei Türen, eine Plattform.** Wer auf remira.com kommt, wählt in einem Klick „Commerce“ oder „Supply Chain“. Commerce wird zuerst neu gebaut, weil REMIRA sich in diese zwei Bereiche trennt und Commerce heute auf der Seite kaum sichtbar ist (siehe Audit, Befund 1).

Klickbare Mockups: `mockups/index.html` (öffnen im Browser; Schalter „Module anzeigen“ blendet je Sektion Modulname und Kategorie ein).

Kategorien jeder Maßnahme:
- **(a) HubSpot-Editor:** mit CLEAN-Pro-Modulen per Drag-and-drop, Theme-Einstellungen, Menüs, Weiterleitungen. Kann Marketing selbst.
- **(b) eigenes Modul/Template:** im Design Manager oder per HubSpot-CLI als Child-Theme. Kann ich (Claude) als Code vorbereiten, Einbau durch jemanden mit Design-Manager-Rechten.
- **(c) Entwickler/Agentur:** Eingriffe in Integrationen, Tracking, Datenstrukturen (HubDB, CRM), Migration großer Inhaltsmengen, Rechtliches.

## 3.1 Seitenstruktur (neu)
```
Start
├─ Commerce (Bereichsseite, neu)                ← Schwerpunkt Phase 1
│   ├─ Omnichannel Commerce (bestehende URL bleibt)
│   ├─ Point of Sale (neu, heute nur Tab)
│   ├─ Warenwirtschaft (neu, heute nur Tab)
│   ├─ Order Management (bestehend)
│   ├─ Mobile Store Management (neu, heute nur Tab)
│   ├─ Payment (neu, heute nur Tab)
│   └─ Customer Hub (neu, heute nur Tab)
├─ Supply Chain (Bereichsseite, neu)
│   ├─ IBP & S&OP · Absatzprognose & Bestandsmanagement · Lieferantenmanagement · Stichprobeninventur (bestehend)
├─ Plattform (REMIRA PLATFORM, bestehend)
├─ Branchen (Übersicht) → Handel: Einzelhandel, Fashion & Schuhe, Sport & Spiel, Möbel & Deko, Baumarkt & DIY, Elektronik, Lifestyle
│                       → Produktion & Großhandel: Produktion, Großhandel, Lebensmittel, Kfz-Ersatzteile, Pharma & Chemie
├─ Referenzen (filterbar nach Commerce / Supply Chain / Branche)
├─ Wissen: Webinare & Events · Blog · Glossar · Whitepaper · Newsletter
├─ Unternehmen: Über uns · Fakten · Karriere · Kontakt
└─ Demo anfragen (eigene Seite, Button in jeder Kopfzeile)
```
**URL-Regel:** bestehende Produkt- und Branchen-URLs behalten (Rankings). Neu: `/de/commerce`, `/de/supply-chain`, `/de/commerce/point-of-sale` usw., `/de/demo`. Jede geänderte oder entfallende URL bekommt eine 301-Weiterleitung (a). Englisch spiegelt die Struktur unter `/en/`.
Offene Frage an Marketing: Gehört die Stichprobeninventur zu Supply Chain oder zu Commerce (Filiale)? Im Entwurf: Supply Chain.

## 3.2 Navigation (Mega-Menü, nur in CLEAN Pro)
| Menüpunkt | Inhalt | Kategorie |
|---|---|---|
| Commerce ▾ | 7 Module mit Phosphor-Icon und einer Zeile Nutzen; rechte Spalte: Showroom Dortmund (Bild + Termin-CTA) | (a) Mega-Menü-Einstellungen |
| Supply Chain ▾ | 4 Module, rechte Spalte: aktuelles Webinar | (a) |
| Plattform | direkter Link | (a) |
| Branchen ▾ | zwei Spalten: Handel / Produktion & Großhandel | (a) |
| Referenzen | direkter Link | (a) |
| Wissen ▾ | Webinare & Events, Blog, Glossar, Whitepaper, Newsletter | (a) |
| Unternehmen ▾ | Über uns, Fakten, Karriere, Kontakt | (a) |
| **Demo anfragen** | fester Button rechts, auf allen Seiten gleich | (a) |
| Suche, DE/EN | Symbole | (a) |
Am Handy: Akkordeon-Menü, Button „Demo anfragen“ unten als Daumen-Leiste (b, kleines eigenes Modul, falls CLEAN Pro keine Sticky-Leiste hat).

## 3.3 Seitentypen und Module
Modulnamen nach öffentlicher CLEAN-Pro-Doku; vor dem Bau gegen die echte Modulliste prüfen.

### Startseite (`mockups/start.html`)
| Sektion | Modul | Kat. | Hinweis |
|---|---|---|---|
| Hero mit Weiche Commerce / Supply Chain | Magic Module (Hintergrund + 2 Karten) | (a) | eine H1, ein Satz Lead, kein Slider |
| Signature: REMIRA-Ring als bewegter Hintergrund | eigenes Modul „Ring-Canvas“ | (b) | nur Desktop animiert, Handy ruhig, `prefers-reduced-motion` |
| Kundenlogos | Logo Scroller | (a) | Logos als SVG/WebP, nur freigegebene |
| Plattform in 6 Modulen | Versa Cards | (a) | Phosphor light als SVG statt 512-px-PNG |
| Commerce im Fokus | Flexi-Tabs | (a) | je Tab: Nutzen, Bild, Link zur Modulseite |
| Zahlen | Magic Module / Zähler | (a) | nur Zahlen von remira.com/de/fakten |
| Webinar / Event | Content Slider oder Karte | (a) | automatisch aus HubDB wäre (c) |
| Blog | Blog-Listing des Themes | (a) | |
| Demo-Band | CTA-Modul | (a) | ein Wortlaut überall: „Demo anfragen“ |

### Bereichsseite Commerce (`mockups/commerce.html`)
| Sektion | Modul | Kat. | Hinweis |
|---|---|---|---|
| Hero | Magic Module | (a) | |
| 6 Commerce-Module | Versa Cards / Hover Swap | (a) | jede Karte führt auf eigene Modulseite |
| „So hängt alles zusammen“: Kanäle verbinden sich | eigenes Modul (SVG + JS) | (b) | Signature-Grafik Commerce, passend zu Davids Wunsch „Effekte mit Bedeutung“ |
| Branchen Handel | Versa Cards (Bild) | (a) | |
| Referenz-Teaser | Super Social Proof | (a) | ohne Personennamen in unseren Entwürfen; live nur mit Freigabe |
| Showroom Dortmund | Magic Module + CTA | (a) | |
| FAQ | FAQ Accordion | (a) | FAQ-Schema (JSON-LD) prüfen, sonst (b) |

### Produktseite, Beispiel Order Management (`mockups/produkt-oms.html`)
| Sektion | Modul | Kat. | Hinweis |
|---|---|---|---|
| Hero mit Produktbild | Magic Module | (a) | Bild als `<img>` mit Vorladen statt CSS-Hintergrund (Audit Befund 10) |
| 3–6 Vorteile | Versa Cards (Icon) | (a) | Icon + ein Satz |
| Funktionen | Flexi-Tabs | (a) | |
| Ablauf in 3 Schritten | Vert Scroller / Scroll Swap | (a) | |
| Referenz | Super Social Proof | (a) | |
| FAQ | FAQ Accordion | (a) | |
| Sticky-CTA am Handy | eigenes Mini-Modul | (b) | falls Theme es nicht kann |
Vorlage einmal als **Seiten-Template „Produkt“** speichern (a, „Als Vorlage speichern“) bzw. als Theme-Template mit fester Reihenfolge (b), dann alle 11 Produktseiten gleich aufbauen.

### Lösung/Branche, Beispiel Fashion & Schuhe (`mockups/branche-fashion.html`)
Hero (Magic Module, a) · Herausforderungen → passendes Modul als Hover Swap (a) · Case-Study-Karten (Blog-/Content-Listing, a; automatisch nach Branche gefiltert = HubDB oder Tags, c) · CTA (a).

### Webinar/Event (`mockups/webinar.html`)
Hero mit Datum (Magic Module, a) · Countdown Timer (a) · Agenda (Tables oder Akkordeon, a) · Referierende (Team-Modul, a) · Anmeldung (HubSpot-Formular, max. 4 Felder, a) · On-Demand-Liste (Video Playlist, a). Webinar-Daten zentral in HubDB und automatische Listen auf Start/Wissen: (c), braucht CMS Pro.

### Kontakt/Demo (`mockups/kontakt.html`)
Zwei Wege „Demo anfragen“ / „Allgemeine Frage“ (Flexi-Tabs, a) · Formular mit 4–5 Feldern statt heute 6+ (HubSpot-Formular, a; progressives Formular braucht Marketing Hub Pro) · Standorte als Karten (a) · Showroom-Termin (HubSpot-Meetings-Link, a).

## 3.4 Querschnitt-Regeln für das neue Theme
| Maßnahme | Kat. |
|---|---|
| Theme-Einstellungen: Source Sans 3/Pro, Schwarz/Weiß, Akzent #41B6E6, Ringfarben als Zusatzfarben, Radien, Button-Stil | (a) |
| Header und Footer als globale Partials, ein CTA-Wortlaut | (a) |
| Pro Seite genau eine H1, Slider-Folien ohne H1 | (a) |
| Icons: Phosphor light als SVG hochladen (ein Satz in `hubfs`), Font Awesome entfernen | (a) Upload, (b) falls Module FA fest einbauen |
| Ein Slider-System (das des Themes), jQuery 1.12.4, Owl, Slick raus | (b)/(c), je nachdem, wo sie eingebunden sind |
| Hero-Bilder als `<img>` mit `fetchpriority="high"`, Größen über HubSpot-Resize, WebP | (a)/(b) |
| Lange Seiten kürzen: Wiederholungen (Branchen, Kundenstimmen, Blog, „Neugierig auf …“) nur einmal je Seite | (a) |
| Signature-Effekte (Ring, Kanäle-Grafik, magnetische Buttons) als eigenes Child-Theme-Modul, Theme-Updates bleiben möglich | (b) |
| Redirect-Liste, hreflang DE/EN, Search Console, Tracking/Usercentrics prüfen | (c) |
| Inhaltsmigration (Blog, Glossar, Referenzen) ins neue Theme | (c) bzw. (a) Seite für Seite |

## 3.5 Priorisierte Maßnahmen
| # | Maßnahme | Kat. | Wirkung | Aufwand |
|---|---|---|---|---|
| 1 | Menü neu: Commerce / Supply Chain + Button „Demo anfragen“ | (a) | hoch | klein |
| 2 | Bereichsseite Commerce + 5 neue Commerce-Modulseiten | (a) + (b) | hoch | mittel |
| 3 | Produkt-Template einmal sauber bauen, alle Produktseiten danach umziehen | (a)/(b) | hoch | mittel |
| 4 | Startseite mit Weiche, eine H1, kein Text-Hero | (a) | hoch | klein |
| 5 | Tempo: LCP-Bild, Icons als SVG, Alt-Bibliotheken raus | (b)/(c) | mittel–hoch | mittel |
| 6 | Kontakt/Demo-Seite mit kurzem Formular | (a) | hoch | klein |
| 7 | Webinar-/Event-Template mit Countdown und Anmeldung | (a) | mittel | klein |
| 8 | Branchen-Seiten auf neues Template | (a) | mittel | mittel |
| 9 | Signature-Module (Ring, Kanäle-Grafik) | (b) | Marke | mittel |
| 10 | Webinare/Referenzen automatisch aus HubDB | (c) | mittel | mittel–groß |

## 3.6 Ablauf
1. **Klären** (Fragen in `04-fragen-und-naechste-schritte.md`), Domains freigeben, Beispielseiten prüfen, Modulliste abgleichen.
2. **Freigabe Struktur und Mockups** durch Marketingleitung.
3. CLEAN Pro im Portal installieren (falls noch nicht), **Child-Theme** anlegen, Theme-Einstellungen setzen. Neue Seiten zunächst als Entwürfe bzw. mit Content Staging (Pro/Enterprise).
4. Commerce-Bereich bauen (Menü, Bereichsseite, Modulseiten), dann Start, Kontakt/Demo, Webinar.
5. Supply Chain, Branchen, Wissen nachziehen; Weiterleitungen, Tests (1440/390/360 px, Lighthouse), Go-live nur mit Freigabe.
