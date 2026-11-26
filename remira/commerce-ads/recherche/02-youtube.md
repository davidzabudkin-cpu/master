# 02 – REMIRA auf YouTube und Video allgemein (Recherche 26.11.2026)

Grundlage: WebSearch (extern) und `curl` auf remira.com (782 DE/EN-Seiten aus der Sitemap durchsucht). youtube.com, i.ytimg.com und die HubSpot-Video-CDN sind aus dieser Umgebung gesperrt, deshalb fehlen Abonnenten, Aufrufe und Thumbnails. Personennamen (Sprecher, Kunden-Ansprechpartner, Namen in Dateinamen) bewusst weggelassen.

## Kurzfazit

- Es gibt einen offiziellen Kanal **REMIRA** (`@remiracom`), verlinkt im Footer jeder remira.com-Seite
- remira.com bindet fast keine YouTube-Videos ein: die Website spielt ihre Videos über **HubSpot Video** aus (35 Videos gefunden), YouTube nur auf 4 Seiten
- Vorhandene Formate: Erklärvideos 1–2 min, „Wissen in 90 Sekunden“-Reihe, Produkt- und Plattform-Animationen, Kundenreferenzen, Event-/Showroom-Filme, Webinar-Aufzeichnungen (hinter Formular)
- **Humor und kurze Spots gibt es schon:** „Cartoon Commercials“ (Wahrsagerin/Fortune Teller, 32–34 s, DE + EN, Feb. 2025) und laut Owler die YouTube-Titel „Keinen Bock auf Inventur?!“ und „Inventur stresst euch?!“
- Nicht belegt: Shorts, 9:16-Formate, Ads speziell für Commerce (Kasse/POS, Warenwirtschaft), ROQQIO-Kanal

## Kanal

| Merkmal | Befund | Quelle |
|---|---|---|
| Name | REMIRA | https://www.youtube.com/@remiracom (Suchtreffer) |
| Handle | `@remiracom` (EN-Seiten-Footer, Suchergebnis „alternate name“) | https://remira.com/en/ |
| Kanal-ID | `UCmaJFAFcE-2eusoBoakCZsg` (DE-Seiten-Footer) | https://remira.com/de |
| Kanalbeschreibung | laut Suchergebnis: Supply-Chain-Anbieter für Handel und Industrie in großen europäischen Märkten, KI-gestützte Cloud-Software, mehr als 150 Mitarbeitende (Angabe wirkt veraltet) | Suchergebnis zu `@remiracom` |
| Abonnenten | nicht ermittelbar, braucht Freigabe von youtube.com | – |
| Anzahl Videos, Aufrufe, Upload-Rhythmus | nicht ermittelbar, braucht Freigabe von youtube.com | – |
| Shorts-Tab vorhanden | nicht ermittelbar, braucht Freigabe von youtube.com | – |
| Kanalbanner, Thumbnail-Stil | nicht ermittelbar, braucht Freigabe von youtube.com bzw. i.ytimg.com | – |
| Weitere Social-Kanäle im Footer | LinkedIn (`linkedin.com/company/remira`), Instagram (`instagram.com/remira_gmbh`) | https://remira.com/de |

## Auf YouTube belegte Videos

| Video-ID | Titel (laut Suchtreffer) | Thema | Eingebunden auf | Länge / Aufrufe / Datum |
|---|---|---|---|---|
| `sHTMXxTouOA` | „Die komplette Inventur in nur einer Schicht – Stichprobeninventur bei Centrotherm mit REMIRA“ | Kundenreferenz, Inventur vor Ort (Dez. 2022 laut OMR) | https://remira.com/de/know-how/inventur | nicht ermittelbar |
| `onmEzJlYdcA` | Titel nicht ermittelbar (Seite: Referenz Centrotherm, Lagerschließung von vier auf einen Tag) | Kundenreferenz Inventur | https://remira.com/de/uebersicht-referenzen/centrotherm-verkuerzt-lagerschliessung-bei-der-inventur-von-vier-auf-einen-tag | nicht ermittelbar |
| `3nHC2wHDmSo` | Titel nicht ermittelbar | Glossar Inventur | https://remira.com/de/glossar/inventur | nicht ermittelbar |
| `I3S2Inr1tuU` | „A Supply Chain Love Story“ (iframe-Titel) | Valentinstags-Animation (Supply Chain, Blog von 2022) | https://www.remira.com/en/supply-chain-blog/a-supply-chain-love-story | nicht ermittelbar |
| `2_nsCyg5_9c` | „Was sind die Vorteile einer Stichprobeninventur?“ | Erklärvideo Inventur | Suchtreffer | nicht ermittelbar |
| `XA1CsEXTZBQ` | „Was ist die Stichprobeninventur?“ | Erklärvideo Inventur | Suchtreffer | nicht ermittelbar |
| ? | „Noch nie war Inventur so einfach – REMIRA Stichprobeninventur Software“ | Produktvideo (auch als HubSpot-Video, 55 s) | Suchtreffer (Owler-Liste) | nicht ermittelbar |
| ? | „Keinen Bock auf Inventur?!“ | wirkt wie lockerer Kurz-Spot (Format nicht prüfbar) | https://www.owler.com/company/remiragmbh | nicht ermittelbar |
| ? | „Inventur stresst euch?!“ | wirkt wie lockerer Kurz-Spot (Format nicht prüfbar) | https://www.owler.com/company/remiragmbh | nicht ermittelbar |

Auffällig: alle auf YouTube belegten Titel betreffen **Inventur/Supply Chain**, keiner Commerce (Kasse, Warenwirtschaft, OMS, Omnichannel). Das kann an der Suche liegen, eine Kanalprüfung fehlt.

Hinweis: Der EN-Glossar-Clip zur KI-Prognose heißt im CMS „2026_08_KI-Prognose_Erklärungsvideo **YT** EN“: es gibt also offenbar eigene YouTube-Fassungen, ob online, ist nicht prüfbar.

## Videos auf remira.com (HubSpot Video, aus JSON-LD `VideoObject`)

Länge und Upload-Datum stammen aus den Metadaten der Seiten. Bildformat (16:9 oder 9:16) nicht prüfbar, weil die Video-CDN gesperrt ist; die Einbettungen sind 16:9-Player.

**Commerce (für die Kampagne am wichtigsten)**
- „Die Supply Chain Wahrsagerin“ / Fortune Teller – Omnichannel Commerce (DE, EN): 34 s, 25.02.2025, Ordner „Cartoon Commercials“, Beschreibung „Wie die Wahrsagerin die Geheimnisse der Supply Chain voraussagt“, auf /de/omnichannel-commerce-software und /en/omnichannel-commerce-software
- Fortune Teller – Supply Chain (DE, EN): 32 s, 25.02.2025, auf /de/supply-chain-software und /en/supply-chain-software
- Omnichannel Commerce Video (DE, EN): 1:07, 19.10.2026, Produktseite und Glossar Omnichannel Commerce
- OMS-Erklärvideo (DE, EN): 1:11, 18.11.2026, /de/ordermanagement-software, /en/order-management-software
- WWS-Erklärvideo v7 (DE, EN): 1:35, 25.11.2026, Glossar Warenwirtschaftssystem, Produkt Warenwirtschaft
- Mobile Store Video (DE, EN): 1:00, Sept. 2026, Mobile Store Management
- Customer Hub „Click Journey“ (DE, „short“): 2:02, 15.09.2026, /de/produkte/customer-hub
- Showroom Dortmund mit Omnichannel-Funktionen: 1:29, 10.12.2024, Omnichannel- und Fashion-Seiten, Blog
- Kundenreferenz Sporthandel mit INSTORE App: 2:50, 09.10.2024, Referenzseite
- Kein eigenes Video zu **Kasse/POS** gefunden (POS-Seiten bieten nur Demo-Termin)

**Marke und Plattform**
- Plattform-Animation (DE, EN): 0:21, 18.11.2026, Startseiten und Unternehmen
- REMIRA Story: 0:30, 26.01.2026, /de/unternehmen
- REMIRA Platform (DE, EN): 1:50, März 2026, Plattform-Seite

**Supply Chain / Know-how**
- Reihe „Wissen in 90 Sekunden“ (Stichprobeninventur 1:27, VMI 2:05, Lagerumschlagshäufigkeit 1:35, Hochrechenverfahren 1:42, Sequenzialtest 1:26), 2024–2025
- Ablauf Stichprobeninventur „Noch nie war Inventur so einfach“: 0:55, März 2026
- ABC-XYZ-Analyse (Glossar): 1:00, Juli 2026
- KI-Whitepaper-Video (DE, EN): 0:53, April 2026
- Kostenfreie KI-Prognose (DE, EN-„YT“-Fassung): 0:49, Juli/Aug. 2026
- Talking-Head-Clip zur kostenfreien Datenanalyse (Rolle: REMIRA-Mitarbeiter, laut Dateiname): 0:32, Jan. 2026
- Kundeninterview Absatzprognose (Rolle: Kunde aus dem Bürobedarf-Handel): 2:18, Mai 2026
- Event-Mitschnitt Vortrag (Rolle: Referent, Event 2025): 11:30, Dez. 2025, Planungsseiten EN
- Kundenevent „Local Heroes“ Interviews: 1:19, Mai 2026

Quellen: https://remira.com/de/omnichannel-commerce-software · https://remira.com/en/omnichannel-commerce-software · https://remira.com/de/ordermanagement-software · https://remira.com/de/unternehmen · https://remira.com/de/supply-chain-und-omnichannel-commerce-plattform · https://remira.com/de/inventur-software · https://remira.com/de/absatzprognose-und-beschaffung-software · https://remira.com/de/produkte/customer-hub · https://remira.com/de/produkte/mobile-store-management · https://remira.com/de/glossar/stichprobeninventur

## Webinare

- 20 Webinar-Aufzeichnungen auf https://remira.com/de/webinare („Aufzeichnung kostenlos verfügbar“), von 05/2021 bis 24.11.2026
- Commerce-Themen darunter: Retail Cloud für erfahrene Anwender (24.11.2026), Omnichannel-Excellence für Modeketten mit OMS und POS (17.09.2026), „Bestand ist King“ Warensteuerung Mode (14.10.2026), Smarter Retail für Local Heroes, Warenwirtschaft und Kasse (16.04.2026), digitale Kassenbons
- Aufzeichnungen liegen hinter HubSpot-Formular (Lead-Gate), nicht als YouTube-Einbettung; ob sie auch auf YouTube stehen: nicht ermittelbar, braucht Freigabe von youtube.com
- Stil: Webinar-Mitschnitt mit Folien und Sprecher (Rolle: Fachexperte, teils Kunde als Gast)

## LinkedIn, Vimeo, ROQQIO

- LinkedIn: Unternehmensseite `linkedin.com/company/remira` verlinkt; Videoposts per Suche nicht auffindbar (LinkedIn wird von Suchmaschinen kaum indexiert), nicht ermittelbar
- Vimeo: kein REMIRA-Kanal gefunden
- Instagram: `instagram.com/remira_gmbh` verlinkt (dort wären Reels/9:16 zu prüfen), Inhalte nicht ermittelbar
- ROQQIO: Commerce-Spezialist aus Hamburg, mit REMIRA unter der Marke REMIRA fusioniert (https://logistik-heute.de/news/logistik-it-remira-und-omnichannel-spezialist-roqqio-fusionieren-35785.html, https://ixtenso.com/supplier/4660-roqqio-gmbh.html); kein ROQQIO-YouTube-Kanal gefunden

## Stil (soweit belegt)

- Erklärvideos 1–2 min, 16:9, Wissens-Reihe mit festem Namen („in 90 Sekunden“)
- Motion-Design-Animationen (Plattform, OMS, WWS, Omnichannel), neue Generation seit Okt./Nov. 2026
- Cartoon-Spots mit Figur (Wahrsagerin) und Humor, 30–35 s, zweisprachig
- Talking Head und Kundeninterviews, Event- und Showroom-Filme
- Lange Webinar-Mitschnitte (Lead-Gate)
- Thumbnail-Stil: nicht ermittelbar, braucht Freigabe von i.ytimg.com bzw. der HubSpot-CDN

## Was fehlt (vorsichtig abgeleitet)

- **Commerce auf YouTube:** belegte YouTube-Titel sind Inventur/Supply Chain; Commerce-Videos laufen nur auf der Website (HubSpot), nicht als YouTube-Reichweite
- **Kasse/POS:** kein eigenes Video gefunden
- **Shorts / 9:16:** keine belegt; alle Website-Videos sind 16:9-Player
- **Kurze Ads (6–15 s, Bumper):** keine belegt; kürzeste Formate sind 21 s (Plattform-Animation) und 30–34 s (Cartoon-Spots)
- **Problem-Hooks aus dem Ladenalltag** (Kassenschlange, „Artikel nicht da“, Inventurstress) gibt es nur bei Inventur („Keinen Bock auf Inventur?!“); für Commerce nicht belegt
- **Humor:** existiert (Wahrsagerin, Love Story), aber selten und nicht als Serie; Anknüpfungspunkt für die Kampagne
- **Untertitel:** mehrere HubSpot-Videos haben DE-Captions („de Captions“), für Ton-aus-Feeds gut; für YouTube nicht prüfbar

## Für vollständige Analyse freizugebende Domains

- `youtube.com`, `www.youtube.com`, `m.youtube.com` (Kanalseite, Video-Liste, Shorts-Tab, Aufrufe, Datum)
- `youtubei.googleapis.com` (interne API, die die Kanal-Listen nachlädt)
- `i.ytimg.com`, `*.ytimg.com` (Thumbnails, Kanalbanner)
- `yt3.ggpht.com`, `yt3.googleusercontent.com` (Kanal-Avatar und Banner)
- `*.googlevideo.com` (nur falls Videos selbst angesehen bzw. Standbilder gezogen werden sollen)
- `www.youtube-nocookie.com` (eingebettete Player)
- Alternative ohne Scraping: `www.googleapis.com` (YouTube Data API v3, braucht API-Schlüssel von REMIRA-IT; liefert Abonnenten, Aufrufe, Länge, Datum sauber)
- `8189726.fs1.hubspotusercontent-eu1.net` (REMIRA-eigene HubSpot-Video-CDN: Vorschaubilder und MP4 der 35 Website-Videos, für Stil- und Formatprüfung)
- Optional: `www.linkedin.com` (Videoposts, meist nur mit Login sinnvoll), `www.instagram.com` (Reels von `remira_gmbh`)
