# 1. Neues HubSpot-Theme: was wir wissen (Stand 26.11.2026)

## Kurzfassung
- Die vier Beispielseiten (clean.pro, cloudcapsule.io, flipsidegroup.com.au, momentumamp.com) sind in der Cloud-Umgebung **gesperrt** (Proxy: „no rule or network setting allows this host“). Screenshots und Quelltext-Prüfung waren deshalb **nicht möglich**.
- Sehr wahrscheinlich ist das Theme **CLEAN Pro von Helpful Hero**: clean.pro ist die Produktseite genau dieses Themes, und es ist laut HubSpot-Marketplace das meistgekaufte HubSpot-Theme. Ob die drei anderen Seiten wirklich CLEAN Pro nutzen, ist **unbestätigt** (Prüfung im Quelltext steht aus, siehe unten).
- Alles in diesem Dokument stammt aus öffentlichen Suchergebnissen, nicht aus eigener Ansicht. Die Modulliste ist darum eine Arbeitsgrundlage, keine Inventur.

## Was CLEAN Pro laut öffentlichen Quellen mitbringt
| Bereich | Was bekannt ist | Quelle |
|---|---|---|
| Umfang | ca. 50 Module (Drittquelle: 49 Module, 47 Seiten- und System-Templates) | Marketplace, kb.xencreate.com |
| Preis / Version | Marketplace zeigt ca. 997 USD, Version 127 (Update Okt. 2026); ob einmalig oder Abo ist **unklar** | Marketplace |
| Voraussetzung | „HubSpot Subscription“, CMS-Hub-Anforderungen erfüllt; welche Stufe nötig ist, steht nicht da | Marketplace |
| Mega-Menü | nur in Pro, Spalten frei, Bilder, CTAs, Formulare im Menü möglich; Hover-Verzögerung gegen Flackern | Pro-vs-Lite-Vergleich, Release Notes |
| Magic Module | ein Modul für viele Sektionen (Text, Bild/Video, Hintergrundbild/-video, Akkordeon), gedacht für Seitenköpfe | Helpful Hero Blog, clean.pro/modules |
| Weitere Module (Namen aus Quellen) | Hero Slider, Versa Cards, Hover Swap, Flexi-Tabs, FAQ Accordion, Logo Scroller, Content Slider, Super Social Proof, Vert Scroller, Scroll Swap, Masonry Gallery, Video Playlist, Countdown Timer, Product Detail (Beta) | Connector-Seite, Release Notes |
| Kategorien | Hero, Multi-Purpose, Tables, Image & Text, Image Galleries, Social Proof, Video, Pricing, Team, Specialty | clean.pro/modules |
| KI-Anbindung | „Clean Pro Connector“ (mcp.clean.pro): Seiten mit Claude/ChatGPT direkt in HubSpot bauen | mcp.clean.pro |

**Wichtig zum Connector:** Er würde Claude direkten Schreibzugriff auf das HubSpot-Portal geben. Das ist interessant für später (Seiten aus Mockups erzeugen), braucht aber Freigabe von Marketingleitung und IT und wird **nicht** ohne Auftrag eingerichtet.

## Was das für remira.com heißt
- Heute läuft remira.com (HubSpot-Portal 8189726) auf einem **eigenen Theme auf Basis der HubSpot-Vorlage** (`template_main.min.css`, `theme-overrides.css`) mit eigenen Modulen (`hero-section`, `mega-menu-data`, `Service_Cards`, `Testimonial_Grid_Slider`, `Logo_Slider`, `Latest_Blog_Posts`). CLEAN Pro wäre ein **Theme-Wechsel**: Seiten müssen im neuen Theme neu aufgebaut werden (ein Rezensent nennt genau das als Aufwand: kein automatischer Inhalts-Umzug).
- Das deckt sich mit dem Ziel „komplett neu“: Neuaufbau Seite für Seite, Commerce zuerst.

## Was noch geprüft werden muss (sobald die Domains frei sind)
1. Je Beispielseite im Quelltext: Theme-Name in Pfaden (`/hubfs/hub_generated/template_assets/…/CLEAN…`, `hs-fs`, `_hcms`), Template-Klassen, Modulnamen (`module_…min.css`). Werkzeug liegt bereit: `tools/audit-shots.cjs` (Seiten-Liste austauschen) plus ein `grep` auf `hub_generated/(template|module)_assets`.
2. Screenshots 1440 px und 390 px, auch Unterseiten, mit Modul-Zuordnung, Animationen, Typo, Farben, Ladezeit (Lighthouse).
3. Echte Modulliste aus `clean.pro/modules` bzw. der Theme-Doku abgleichen; `03-relaunch-konzept.md` danach anpassen.

## Domains, die freigegeben werden müssen
Im Umgebungs-Menü der Sitzung (Titelleiste → Cloud-Umgebung → Bearbeiten → Netzwerkzugriff → „Allowed domains“, Haken „Allow package managers“ drin lassen). Anleitung: https://code.claude.com/docs/en/cloud-environments#network-access

**Beispielseiten und Theme-Anbieter**
- `www.clean.pro`, `clean.pro`, `mcp.clean.pro`
- `www.cloudcapsule.io`, `cloudcapsule.io`
- `www.flipsidegroup.com.au`, `flipsidegroup.com.au`
- `momentumamp.com`, `www.momentumamp.com`
- `www.helpfulhero.com`, `blog.helpfulhero.com`
- `ecosystem.hubspot.com` (Marketplace-Eintrag)

**HubSpot-CDN (Bilder, Module, Skripte, Videos)**
- `*.hubspotusercontent-na1.net`, `*.hubspotusercontent-eu1.net`, `*.hubspotusercontent00.net`, `*.hubspotusercontent10.net`, `*.hubspotusercontent20.net`, `*.hubspotusercontent30.net`, `*.hubspotusercontent40.net`
- `*.hs-sites.com`, `*.hs-sites-eu1.com`, `*.hubspot.net`, `*.hsappstatic.net`, `*.hs-scripts.com`, `*.hs-analytics.net`, `*.hscollectedforms.net`, `*.hsforms.net`, `*.hsforms.com`, `*.hubspot.com`, `*.usemessages.com`

**Fremd-CDNs, die auch remira.com heute lädt** (ohne sie fehlen in den Screenshots Slider, Logo-Leiste, Icons und Cookie-Banner)
- `cdnjs.cloudflare.com`, `cdn.jsdelivr.net`, `unpkg.com`, `kit.fontawesome.com`, `ka-f.fontawesome.com`, `web.cmp.usercentrics.eu`, `*.usercentrics.eu`, `fonts.googleapis.com`, `fonts.gstatic.com`

Sobald die Beispielseiten eigene Fremd-CDNs nutzen (z. B. Vimeo, Typekit), meldet der Proxy das Host für Host; dann diese nachtragen.

## Quellen
- [CLEAN Pro im HubSpot Marketplace](https://ecosystem.hubspot.com/marketplace/website/clean-theme-by-helpful-hero)
- [CLEAN Lite im HubSpot Marketplace](https://ecosystem.hubspot.com/marketplace/website/clean-lite-theme-by-helpful-hero)
- [Clean Pro – Module](https://www.clean.pro/modules), [Release Notes](https://www.clean.pro/release-notes), [Knowledge Base](https://www.clean.pro/kb)
- [Clean Pro Connector](https://mcp.clean.pro/)
- [Helpful Hero – CLEAN Pro vs. Lite](https://www.helpfulhero.com/clean-pro-vs-lite), [CLEAN 6 Module Library](https://www.helpfulhero.com/clean6/module-library)
- [Magic Module (Helpful Hero Blog)](https://blog.helpfulhero.com/introducing-the-magic-module-and-clean-pros-step-into-2023)
- [CLEAN Theme (kb.xencreate.com)](https://kb.xencreate.com/clean-theme)
