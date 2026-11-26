# Recherche 01: remira.com (Fokus REMIRA Commerce)

Stand: 26.11.2026, Abruf per curl von www.remira.com (DE und EN). Grundlage: sitemap.xml (1.279 URLs, davon rund 600 DE/EN ohne Blog geladen) plus alle intern verlinkten Landingpages (Webinare, Whitepaper, Demo-Formulare), dazu ausgewählte Commerce-Blogartikel. Zitate sind wörtlich von der Seite übernommen (inklusive Schreibweise der Seite). Kurz-URLs beziehen sich auf `https://www.remira.com`.

Datenschutz: Personennamen aus Zitaten, Fallstudien und Teamseiten sind bewusst weggelassen, Kundenstimmen nur mit Rolle. Keine E-Mail-Adressen, keine Telefonnummern.

## 0. Nicht ladbar oder auffällig

- 404: `/en/products/commerce/buybye-app`, `/en/products/commerce/data-warehouse`, `/en/products/commerce/consignment`, `/en/products/commerce/mobile-solutions`, `/en/products/commerce/hoeltl-suite`, `/en/products/customer-hub` (Customer Hub hat keine EN-Seite), `/de/produkte/commerce/commerce-cloud`, `/en/resources`, `/en/references`, `/en/industries`, `/de/webinar-anmeldung`, `/de/loesungen/prognosebasierte-produktionsplanung`
- Nicht geladen (Timeout): `/de/datenschutzerklaerung`, `/en/privacy-policy` (für die Kampagne irrelevant)
- `/en/webinar-sign-up` lädt, enthält aber nur Einleitungstext und keine Termine (Formular wird per Script nachgeladen)
- Die EN-Webinarseite `/en/webinars` zeigt nur ältere deutsche Webinare (2021 bis April 2025), keine aktuellen EN-Termine
- Widersprüche auf der Seite selbst (vor Kampagnennutzung klären):
  - Mitarbeitende: „rund 400 (Stand: Oktober 2026)“ auf `/de/fakten`, aber „Rund 500 Mitarbeiter“ auf `/de/unternehmen` und `/en/company`
  - Kunden: „rund 1.500“ (`/de/fakten`) vs. „Über 1.500 Kunden“ (`/de/unternehmen`)
  - Cloud-Warenwirtschaft für KMU: „bis zu 10 Filialen“ (Produktseite, Fakten) vs. „für Händler mit bis zu fünf Filialen“ (Fallstudie DROSTE, `/de/uebersicht-referenzen/droste-lederwaren-case-study`)
  - Webinar „Vom Warenchaos zur Klarheit“: Startseite nennt „Donnerstag, 26. November“, Webinar- und Eventseite nennen „25. Februar 2027“ (Startseiten-Teaser veraltet)

## 1. Commerce-Produkte und Module

Offizielle Einordnung laut `/de/fakten`: „Omnichannel Commerce: Die REMIRA Omnichannel Commerce Software verbindet Online-Shop, Marktplätze und Filialen.“ Darunter: Order Management, POS, App für Mobile Store Management, Warenwirtschaft, Customer Hub. Zusätzlich auf der Omnichannel-Seite: Payment. Weitere Produktseiten: Retourenmanagement, Marketplace-Anbindungen.

Plattform-Hinweis (`/de/fakten`): „Alle REMIRA Lösungen sind als On-Premise, SaaS und Hybrid verfügbar – je nach Bedarf.“

### 1.1 Omnichannel Commerce Software (Dachlösung)

- DE: Omnichannel Commerce Software, `/de/omnichannel-commerce-software` (identisch: `/de/produkte/commerce`)
- EN: Omnichannel Commerce Software, `/en/omnichannel-commerce-software`
- Hero DE (wörtlich): „Alle Touchpoints der Customer Journey auf einen Blick mit unseren Softwarelösungen: Verkaufen Sie dort, wo gekauft wird. Ohne Medienbruch. Mit einer Single-Source-of-Truth. Online und im stationären Handel.“
- Hero EN (wörtlich): „Sell where people buy. Without media disruption. With a single source of truth. Online and in stationary retail.“
- Zentraler Nutzen (wörtlich): „Kunden können kanalübergreifend kaufen, reservieren, abholen, retournieren und beraten werden, während das Unternehmen eine Single Source of Truth für Bestände, Preise, Produktdaten, Kundendaten und Bestellungen erhält.“
- Kernnutzen (Kachelüberschriften): Verbesserte Effizienz, Erhöhte Kundenzufriedenheit, Volle Skalierbarkeit, Schnelle & unkomplizierte Digitalisierung, Mehr als eine Middleware, Kanalübergreifende Prozesse
- Services, die genannt werden: Click & Collect, Ship-from-Store, Endless Aisle, Click & Reserve, digitaler Kassenbon
- Zielgruppe (wörtlich): „Sie richtet sich an filialisierte Einzelhändler, D2C-Marken und Hersteller“
- Größe (EN-FAQ, wörtlich): „The REMIRA Omnichannel Software is suitable for retailers of any size. For companies with up to 10 stores, there is also a special SME solution available in the cloud.“
- Einführungszeit (EN-FAQ, wörtlich): „a go-live is often possible within a few weeks“
- Integration (EN-FAQ, wörtlich): „standard connectors for common systems such as SAP, Microsoft Dynamics, Shopify, Shopware, or standard POS systems“
- Homepage-Kurzform: „Vernetzung von Produktdaten & Beständen“, „Anbindung an Händler usw.“, „Filialmanagement & mobiles Kassieren“ (`/de/`)

### 1.2 Order Management (OMS)

- DE: Order Management Software / REMIRA Order Management System, `/de/ordermanagement-software`
- EN: Order Management Software, `/en/order-management-software`
- Früherer Name: „Commerce Cloud“ bzw. „ROQQIO/REMIRA Commerce Cloud“ (`/de/fakten`)
- Hero (wörtlich): „Die REMIRA Software für Order Management automatisiert den Fulfillmentprozess und sorgt dafür, dass alle Bestellungen zügig und ohne Fehler beim Kunden ankommen.“
- Kernnutzen (wörtlich, Auszug): „intelligentem Order Routing auf Basis von Bestand, Standort und Lieferoptionen“, „höherer Lieferfähigkeit und schnelleren Lieferzeiten“, „geringeren Versand- und Prozesskosten“, „einer konsistenten Customer Experience über alle Kanäle hinweg“
- Positionierung (wörtlich): „Die REMIRA-Lösung agiert als Middleware+ zwischen ihren vorhanden Altsystemen“ und „Schnittstellenchaos und unterschiedliche oder sogar fehlerhafte Daten in verschiedenen Systemen gehören so der Vergangenheit an.“
- Funktionskacheln: Harmonisierung aller Daten, Integriertes Lagerverwaltungssystem, Zentrale Produktdatenverwaltung, Anbindung aller Händler, Filialen & Streckenlieferanten, Skalierbare und hochverfügbare SaaS-Anwendung
- Zahlen (EN-FAQ, wörtlich): „the OMS can be implemented in about six weeks“ und „implementation typically takes between three and six months“; „a revenue target of over three million should be set“; „There is no upper limit on transaction volume.“
- Zertifikat: „Das REMIRA Order Management System verfügt ebenfalls über das Zertifikat ‚TÜV geprüfter Datenschutz‘.“ (`/de/fakten`)
- Auszeichnung: „Die COMMERCE Cloud … wurde vom Marktplatzbetreiber eBay als ‚SILVER Solution Provider 2023‘ ausgezeichnet.“ (`/de/supply-chain-blog/ebay-zeichnet-commerce-cloud-als-silver-solution-provider-2023-aus`)

### 1.3 POS / Kasse

- DE: REMIRA POS Check-out (Kassensoftware), `/de/produkte/pos`
- EN: REMIRA Point-of-Sale, `/en/products/point-of-sale-software`
- Frühere Namen: „RFE, Futura“ (`/de/fakten`)
- Hero (wörtlich): „Einfach, effizient und sicher: Die REMIRA Kassensoftware sorgt in Ihren Filialen für optimale und schnelle Kassenprozesse.“
- Eigenschaften (Kacheln): Skalierbar, International, Hardwareunabhängig, Lokal oder Cloud
- Kernnutzen (wörtlich, Auszug): „neu angelegte Artikeldaten und Preise in Echtzeit an der Kasse verfügbar“; „Dadurch wird u.a. Click & Collect oder Return-in-Store ermöglicht.“; „alle Drucklayouts bequem von der Zentrale aus gesteuert“
- Funktionen: Filialumlagerung, Wareneingang & Warenretoure, Kundenverwaltung, Rabatte, Gutscheine & Kundenkarten, Digitaler Kassenbon, Tap2Pay, Reportings, Fiskalierung, Etikettendruck
- Tap2Pay (wörtlich): „Mit Tap2Pay wird das Smartphone zum mobilen Kartenterminal.“ und „Der Verkauf wird dort abgeschlossen, wo die Kaufentscheidung fällt.“
- Digitaler Kassenbon (wörtlich): „anonyme Kunden werden zu bekannten und registrierten Kunden“
- Sprachen: 15 Sprachen aufgeführt (u. a. Arabisch, Chinesisch, Japanisch), „Weitere Sprachen sind auf Anfrage möglich!“
- Fiskalisierung: „REMIRA POS ist für Deutschland und Österreich fiskalisiert.“ (`/de/fakten`); TSE wird auf der Produktseite genannt
- Zertifikate (wörtlich, `/de/fakten`): „Die REMIRA POS Check-out Software ist durch die interev GmbH nach IDW PS 880 zertifiziert und verfügt über ein BSI-Zertifikat (BSI-K-TR-0717-2025) der fiskaly GmbH.“
- Größe: „Rund 8.000 Verkaufsstellen (POS)“ mit REMIRA Kassen (`/de/unternehmen`, `/de/fakten`)

### 1.4 App für Mobile Store Management (Filial-App)

- DE: Software für Mobile Store Management / App für Mobile Store Management, `/de/produkte/mobile-store-management`
- EN: Software for Mobile Store Management, `/en/products/mobile-store-management-software`
- Weitere Namen laut `/de/fakten`: „REMIRA Store App“, „App für digitales Filialmanagement“; früher „Instore-App (auch INSTORE App)“
- Hero (wörtlich): „Die REMIRA Software für Mobile Store Management ist Ihr digitaler Assistent in der Filiale. Als All-in-One-Tool für das Personal vereint sie Kasse, Omnichannel-Funktionen und Filialmanagement in einem System … So haben Sie immer einen Blick auf das Wichtigste: den Kunden.“
- Kernnutzen: Mobiles Kassieren („wodurch lange Kassenschlangen vermieden werden können“), Umfassende Beratung („um mehr Kunden in kürzerer Zeit zu beraten“), Omnichannel-Services (Bestandsabfrage anderer Filialen, Click & Reserve, Click & Collect), Effizientes Filialmanagement, Schnelle Digitalisierung
- Plattformen (wörtlich): „eine auf Android, iOS und Windows funktionierende App“, nutzbar „auf Tablets, Smartphones oder auf einem Payment-Terminal“
- EN-Seite: „Over 200 satisfied customers from all sectors“ (`/en/products/mobile-store-management-software`)

### 1.5 Warenwirtschaft (WWS) und Retail Cloud

- DE: Software für Warenwirtschaft / REMIRA Warenwirtschaft, `/de/produkte/warenwirtschaft-software`
- EN: Software for merchandise management, `/en/products/merchandise-management-software`
- Frühere Namen: „REMIRA Retail bzw. REMIRA Retail Cloud“ (`/de/fakten`); KMU-Variante heißt in Webinaren weiterhin „REMIRA Retail Cloud“
- Hero (wörtlich): „Unsere Warenwirtschaft managt die Versorgung Ihrer Flächen mit Waren und übernimmt die unternehmensweite Warensteuerung weitgehend automatisiert.“ und „egal, ob zwei Filialen oder große Einzelhandelskette“
- Kernnutzen: NOS-Artikel automatisch nachordern oder Umlagerungen vorschlagen, „Schnellwarnsystem per E-Mail“, „zentralen Datendrehscheibe“, alle EDI-Nachrichtenarten (PRICAT, ORDERS, ORDRSP, DESADV, RECADV), Echtzeit-Reporting und Data Warehouse
- KMU-Cloud (wörtlich): „REMIRAs Cloudlösung für Warenwirtschaft ist die einfache und kostengünstige All-in-One-Lösung für Händler mit bis zu 10 Filialen. Die Cloudlösung ist innerhalb weniger Stunden einsetzbar“ und „Dank der Cloud-Technologie ist keine aufwendige und teure Installation notwendig.“
- Mode-Bezug (wörtlich): „Das hilft, Abschriften zu vermeiden, denn Preisreduzierung lassen sich so auf einen späteren Zeitpunkt verlagern.“
- Kacheln: Branchenübergreifend, International einsetzbar, Echtzeit-Daten, Aus der Cloud, Praxiserfahrenes Support-Team, Kombination mit REMIRA PAYMENT

### 1.6 Payment

- DE: Software für Zahlungsverkehr / REMIRA PAYMENT, `/de/produkte/zahlungsverkehr-software`
- EN: Software for payment transactions / PAYMENT Services, `/en/products/payment`
- Hero (wörtlich): „Mit den Payment-Lösungen ist REMIRA Zahlungsdienstleister für den stationären Handel und E-Commerce.“
- EN-Hero (wörtlich): „a single point of contact for all checkout, payment and other issues“
- Kernnutzen: Ansprechpartner für alles, Echtzeit-Monitoring, Abgenommene Terminals (ingenico, Verifone, PAX, Newland NPT), Tap2Pay, Omnichannel Payment
- Claims (wörtlich): „Keine versteckten Kosten. Unsere Preise sind transparent und basieren auf dem HGB.“; „Payment-Terminals sind inklusive … Es entstehen keine Kosten für Sie.“
- Kundenstimme (Payment-Kunde, Rolle nicht genannt): „Umstellung unserer rund 80 Kartenterminals auf das neue Lastschriftverfahren verlief äußerst erfolgreich“

### 1.7 Customer Hub

- DE: REMIRA Customer Hub, `/de/produkte/customer-hub` (keine EN-Seite, 404)
- Dachzeile: „Kundenbeziehungen mithilfe von KI aufbauen“
- Hero (wörtlich): „360-Grad-Blick auf die Kunden … Verwandeln Sie Laufkundschaft in treue Kunden“
- Claim (wörtlich): „Mit seiner Kombination aus Marketing, Loyalty Services und Kundenverwaltung ist der REMIRA Customer Hub einmalig auf dem Markt.“
- Funktionen: Kundenverwaltung, Loyalty- und Bonussystem, Gift-Card-System, mehrstufiges Kampagnenmanagement, Kundenkommunikation per E-Mail oder WhatsApp, Dashboard (u. a. „Verhältnis bekannter und anonymer Kunden“)

### 1.8 Retourenmanagement

- DE: Software für Retourenmanagement, `/de/produkte/retourenmanagement-software`
- EN: Software for returns management, `/en/products/returns-management-software`
- Hero (wörtlich): „Effizientes Retourenmanagement ist die Voraussetzung für eine hohe Kundenzufriedenheit und langfristige Kundenbindung.“
- Marktzahl auf der Seite (wörtlich, keine REMIRA-Leistungszahl): „Die artikelbezogene Retourenquote im Online-Handel im DACH-Raum 2021 lag bei 39 % der Unternehmen zwischen 5-25 %.“
- CTA hier: „Demo vereinbaren“

### 1.9 Marketplace-Anbindungen

- DE: Software für Marketplace Anbindungen, `/de/produkte/marketplace-anbindungen-software` (auch `/de/loesungen/marketplace-anbindungen-software`)
- EN: Software for Marketplace connections, `/en/products/marketplace-connection-software`
- Kernaussage (wörtlich): „Mit einer Marktplatz-Software kann der Einzelhandel Ware auf dem gewünschten Marketplace anbieten, ohne spezielles Know-how im E-Commerce zu haben und ohne die im Unternehmen vorhandene IT-Infrastruktur austauschen zu müssen.“
- Nutzen: Alle Verkaufskanäle in einem Tool, Stetige Aktualisierung aller Lagerbestände, Abwicklung diverser Zahlarten, Verschiedene Versandoptionen, Unterstützung von Retourenoptionen
- Genannte Marktplätze: Amazon, eBay, Otto, Zalando

### 1.10 Legacy-Seiten (ehemals höltl, nur DE, nicht in der Navigation)

- BuyBye (Self-Checkout-App), `/de/produkte/commerce/buybye-app`: „BuyBye: Die ultimative Self-Checkout App“; „Warteschlangen an der Kasse reduzieren“, „Budget für Kassen-Hardware schonen“, „Service-Qualität optimieren“
- Data Warehouse M.A.R.S Classic / M.A.R.S Galaxy, `/de/produkte/commerce/data-warehouse`: „Über 100 Schlüssel zur Eingrenzung und Gruppierung Ihrer Daten“, „Individuelle Reports in drei einfachen Schritten“
- Mobile Lösungen (RetailFlow, ConnectFlow, M.A.R.S.), `/de/produkte/commerce/mobile-loesungen`
- Konsignation (VerticalFlow, abgestimmt auf „POSFlow“), `/de/produkte/commerce/warenwirtschaft-konsignation`: „Rund 45.000 Markflächen gibt es derzeit im deutschen Modehandel. Tendenz steigend.“
- Einschätzung: alte Produktnamen, Seiten wirken nicht gepflegt (Platzhalter „Menu Item 1“ im Menü); für Werbung nicht verwenden, ohne Rücksprache

### 1.11 REMIRA PLATFORM (übergreifend)

- `/de/supply-chain-und-omnichannel-commerce-plattform`, EN `/en/remira-supply-chain-and-omnichannel-commerce-platform`
- H1: „Supply Chain und Omnichannel Commerce as-a-Service“
- Claims (wörtlich): „als Software-as-a-Service (SaaS) in europäischen Cloud-Rechenzentren betrieben“; „Ihre IT wird Ihnen danken, denn die REMIRA Platform ist in der Cloud und kommt ganz ohne Installationen aus.“; „einen achtstelligen Betrag in die Modernisierung unseres Produktportfolios investiert“; Technologiepartner Arvato und Microsoft; „regelmäßig Datenschutzaudits durch den TÜV“
- Footer überall: „Wir sind Microsoft Solutions Partner für Digital- und App-Innovationen Azure“

### 1.12 Beste Zahlen und Claims mit Commerce-Bezug (Kurzliste)

- „Rund 8.000 Verkaufsstellen (POS)“, `/de/unternehmen`
- „Über 1.500 Kunden aller Branchen weltweit“, `/de/unternehmen`
- „Seit über 30 Jahren erfolgreich am Markt“, `/de/unternehmen`; Commerce-Wurzel „Gründungsjahr REMIRA Commerce: 1972 (hoeltl)“, `/de/fakten`
- „All-in-One-Lösung für Händler mit bis zu 10 Filialen“, „innerhalb weniger Stunden einsetzbar“, `/de/produkte/warenwirtschaft-software`
- „the OMS can be implemented in about six weeks“, `/en/order-management-software`
- „a go-live is often possible within a few weeks“, `/en/omnichannel-commerce-software`
- „Payment-Terminals sind inklusive“, „Keine versteckten Kosten“, `/de/produkte/zahlungsverkehr-software`
- „Inventuraufwand um bis zu 99 % senken“ (Stichprobeninventur, Supply Chain, aber auf Fashion- und Handelsseiten beworben), `/de/software/fashion-und-schuhe`
- Fallstudien-Zahlen siehe Abschnitt 5

## 2. Lösungen und Branchen für den Handel

Navigation „Branchen“ (`/de/`): Einzelhandel, Fashion & Schuhe, Baumarkt & DIY, Lebensmittel, Möbel & Deko, Elektronik, Sport & Spiel, Lifestyle, Großhandel (plus Produktion, Kfz-Ersatzteile, Pharma & Chemie). Die Branchenseiten sind weitgehend gleich aufgebaut (Einleitung „Herausforderungen wie …“, sechs Nutzenkacheln, Produktkacheln) und nennen Schmerzpunkte eher allgemein. Konkretere Schmerzpunkte stehen auf Produkt- und Webinarseiten.

### 2.1 Schmerzpunkte aus Produkt- und Webinarseiten (wörtlich)

- Omnichannel: „Isolierte und nicht synchronisierte Bestände über mehrere Kanäle“, „Overselling sowie fehlende Transparenz über Orders und Retouren“, „Medienbrüche zwischen Shop, Filiale und Backend“, „Hoher manueller Abstimmungsaufwand zwischen Systemen“, „Fehlende Bestandstransparenz“, `/de/omnichannel-commerce-software`
- Omnichannel: „In vielen Unternehmen liegen diese Daten verteilt über ERP, E-Commerce, POS und externe Händlerkanäle, wodurch fehlerhafte Verfügbarkeiten und ein hoher Abstimmungsaufwand entstehen.“, `/de/omnichannel-commerce-software`
- Kundensicht: „Kaufabbrüche durch fehlerhafte Bestands- oder Preisdaten werden vermieden“, `/de/omnichannel-commerce-software`
- OMS: „Häufig entstehen Herausforderungen in der Auftragsabwicklung durch ein zunehmendes Bestellvolumen, verschiedene Kanäle und hohe Kundenerwartungen. Damit einher gehen Medienbrüche, mangelnde Transparenz über Bestände sowie ein vermehrter Aufwand.“, `/de/ordermanagement-software`
- Filiale: „Viele Filialen arbeiten immer noch mit getrennten Systemen für Kasse, Warenwirtschaft und Bestandsverwaltung. Dadurch werden Filialprozesse ausgebremst, weil Mitarbeitende zwischen verschiedenen Anwendungen wechseln, Informationen manuell prüfen oder Prozesse doppelt erfassen müssen.“, `/de/produkte/mobile-store-management`
- Kasse/Omnichannel: „Nur so lassen sich Doppelverkäufe bzw. Leerverkäufe im Online-Shop vermeiden.“, `/de/produkte/pos`
- Kasse/Personal: „Dort, wo es an Fachkräften mangelt und Quereinsteiger und häufig wechselndes Personal zum Einsatz kommen“, `/de/produkte/pos`
- Wartezeit: „Wartezeiten und Kundenschlangen an den Kassen gehören für die Konsumenten zu den besonders ärgerlichen Shopping-Erlebnissen und führen häufig dazu, dass Kunden sich für beim nächsten Kauf für einen Wettbewerber entscheiden.“, `/de/produkte/commerce/buybye-app`
- Store-Betrieb: „Mangelnde Kundenorientierung, ungenaue Bestände und manuelle Prozesse bremsen im Handel täglich Effizienz und Umsatzpotenzial.“, `/de/webinare`
- Modeketten: „Fehlende Transparenz und mangelnde Integration zwischen Online-Shop und Filialen führen häufig zu Frust bei Kunden und ineffizienten Prozessen im Handel.“, `/de/webinare`
- Mode/Marge: „Zentrallagerstrukturen stoßen im Handel zunehmend an ihre Grenzen und wirken sich nicht immer positiv auf Lieferfähigkeit und Rentabilität aus.“, `/de/webinare`
- Filialpersonal: „In vielen Filialen rauben administrative Aufgaben und aufwendige Warenprozesse dem Verkaufspersonal wertvolle Zeit für die Kundenberatung.“, `/de/webinare`
- Filialalltag: „Hoher Verwaltungsaufwand führt zu sinkender Effizienz und längeren Wartezeiten.“, `/de/webinare`
- Kleine Händler: „Persönliche Kundenansprache, Bestandsgenauigkeit und Transparenz im Warenmanagement stellen auch für Einzelhändler mit wenigen Filialen eine besondere Herausforderung dar.“, `/de/webinare`
- Kleine Händler: „Da sich komplexe Softwarelösungen oft nicht mit ihren Anforderungen und ihrem Budget vereinbaren lassen, bleiben sie zwangsläufig bei veralteten Anwendungen mit hohen Wartungskosten und komplizierter Bedienung.“, `/de/supply-chain-blog/retail-cloud-remira-katapultiert-kleine-einzelhaendler-ins-digitale-zeitalter`
- Kundenbindung stationär: „Während im Online-Handel jegliche Aktivitäten und Klicks getrackt und ausgewertet werden können, fehlt in der Filiale oft die erneute und gezielte Ansprache der Kunden.“, `/de/webinare`
- Personalisierung: „Im Einzelhandel entscheidet heute nicht mehr das beste Angebot, sondern die Fähigkeit, Kunden wirklich zu kennen und personalisiert anzusprechen“, `/de/webinare`
- Whitepaper-Aufhänger: „Egal, wie schön ein Geschäft oder ein Online-Shop ist – wenn ein Kunde nicht das bekommt, was er erwartet, kommt er nicht wieder.“, `/de/whitepaper-omnichannel-commerce`

### 2.2 Branchenseiten (Herausforderungen wörtlich)

- Einzelhandel: „Herausforderungen wie die Verwaltung unterschiedlicher Produktlinien, schwankende Nachfrage und die Aufrechterhaltung optimaler Lagerbestände“, `/de/software/einzelhandel`
- Fashion & Schuhe: „Herausforderungen wie das Management saisonaler Trends, schnell wechselnde Bestände und komplexe Lieferketten“, `/de/software/fashion-und-schuhe`; Produkte dort: S&OP, Omnichannel Commerce, Inventur, Order Management
- Sport & Spiel: Kachel „Verwaltung saisonaler Nachfrage“ mit „Fehlbestände und Überbestände während der Hochsaison und an Feiertagen“, `/de/software/sport-und-spiel`
- Baumarkt & DIY: „Herausforderungen wie die Verwaltung unterschiedlicher Bestände, schwankende Nachfrage und komplexe Lieferketten“, `/de/software/baumarkt-und-diy`
- Lebensmittel: „die Verwaltung verderblicher Bestände, die Einhaltung strenger gesetzlicher Vorschriften und schwankende Nachfrage“, `/de/software/lebensmittel` (Commerce-Bezug gering, Fokus Prognose)
- Möbel & Deko: „die Verwaltung großer Bestände, kundenspezifischer Aufträge und komplexer Lieferketten“, `/de/software/moebel-und-deko`
- Elektronik: „die Verwaltung komplexer Bestände, schnelle technologische Fortschritte und komplizierte Lieferketten“, Kachel „minimiert das Obsoleszenzrisiko“, `/de/software/elektronik`
- Lifestyle: „die Verwaltung unterschiedlicher Produktlinien, sich schnell ändernde Trends und die Logistik in der Lieferkette“, `/de/software/lifestyle`
- Großhandel: „komplexes Bestandsmanagement, schwankende Nachfrage und Unterbrechungen der Lieferkette“, `/de/software/grosshandel`
- Wiederkehrender Nutzensatz auf allen Branchenseiten (wörtlich): „REMIRA optimiert Prozesse, senkt Betriebskosten und fördert nachhaltiges Wachstum durch die Automatisierung von Routineaufgaben, die Minimierung manueller Fehler und die Steigerung der Gesamteffizienz.“
- EN-Pendants: `/en/software/retail`, `/en/software/fashion-and-shoes`, `/en/software/sports-and-games`, `/en/software/building-materials-and-diy`, `/en/software/food-and-beverage`, `/en/software/furniture-and-decoration`, `/en/software/electronics`, `/en/software/lifestyle`, `/en/software/wholesale`

## 3. Glossar-Artikel mit Commerce-Bezug

DE (`https://www.remira.com/de/glossar/<slug>`), 240 Artikel insgesamt, Commerce-relevant:

- Omnichannel und Handel: omnichannel, omnichannel-commerce, multichannel, unified-commerce, cloud-commerce, digital-commerce, e-commerce, mobile-commerce-m-commerce, social-commerce, voice-commerce, quick-commerce, direct-to-consumer-d2c, curated-shopping, einzelhandel, stationaerer-handel, retail, grosshandel, b2b-b2c, ropo-effekt, showrooming
- Services: click-and-collect, click-and-reserve, curbside-pick-up, ship-from-store, return-in-store, endless-aisle, dropshipping, fulfillment, virtuelles-lager
- Kasse und Payment: point-of-sale-pos, mobile-pos, mobile-kasse, self-checkout, payment-provider, fiskalisierung, fiskalspeicher, kassensicherungsverordnung-kassensichv, dsfinv-k, belegausgabepflicht, nullbon, geschenkbon
- Auftrag und Retoure: order-management, order-management-system-oms, auftrag, auftragsabwicklung, retoure, retourenmanagement
- Filiale und Ware: warenwirtschaftssystem, umlagerung, out-of-stock, bestand, lagerbestand, sku, artikelnummer, ean, gtin-global-trade-item-number, rfid-radio-frequency-identification, digital-signage, planogramm, regalplanung, space-management, category-management, mobile-datenerfassung, mde-geraet, konsignationslager
- Kunde und Daten: customer-journey, customer-experience-management, customer-relationship-management-crm, produktinformationsmanagement-pim, product-experience-management-pxm, data-warehouse, business-intelligence-software, edi-electronic-data-interchange, edifact, api, erp-system, best-of-breed, software-as-a-service-saas, gamification, augmented-reality
- Marktplatz: asin, buy-box, repricing

EN (`https://www.remira.com/en/glossary/<slug>`), 38 Artikel, Commerce-relevant nur: omnichannel, retail, wholesale, out-of-stock-oos, sku, edi-electronic-data-interchange, software-as-a-service-saas. EN hat keine Glossarartikel zu POS, OMS, Click & Collect usw.

Know-how-Seiten mit Commerce-Bezug: `/de/know-how/omnichannel-commerce`, `/de/know-how/digitalisierung-im-handel`, `/de/know-how/logistik-im-omnichannel-handel`, `/de/know-how/online-marktplaetze`, `/de/know-how/dropshipping`, `/de/know-how/roqqer-talk`

## 4. Webinare, Events und kostenlose Angebote

### 4.1 Kommende Webinare (Stand 26.11.2026, `/de/webinare`, `/de/events`)

- 3. Dezember 2026, 10:00 bis 11:00 Uhr, kostenfrei: „Servicegrad rauf, Kapitalbindung runter: Bestandssteuerung in Einklang bringen“ (Absatzprognose, Supply Chain), `/de/webinar-absatzprognose-bestandsmanagement`
- 25. Februar 2027, 10:00 bis 11:00 Uhr, kostenfrei: „Vom Warenchaos zur Klarheit: Der Weg zu einem schlanken, kundenorientierten Store-Betrieb ohne Wartezeiten“ (Commerce: Warenwirtschaft + POS), `/de/webinar-vom-warenchaos-zur-klarheit`
  - Kernsatz (wörtlich): „Der Schlüssel zum Erfolg liegt in einer schlanken, vernetzten Warenwirtschaft und einem benutzerfreundlichen POS, die den gesamten Prozess von der Bestellung bis zum Verkauf nahtlos abbilden.“
- Keine EN-Webinartermine auf der Seite

### 4.2 On-Demand-Webinare mit Commerce-Bezug (CTA „Aufzeichnung ansehen“, „Aufzeichnung kostenlos verfügbar“)

- 24.11.2026: „REMIRA Retail Cloud: Tipps & Tricks für mehr Effizienz und das volle Potenzial Ihrer Warenwirtschaft“ (nur für Retail-Cloud-Kunden), `/de/webinar-retail-cloud`
- 14.10.2026: „Bestand ist King – und Chaos ist teuer: Wie Modehändler ihre Marge retten“ (u. a. „die fünf größten Margen-Killer im Fashion Retail“), `/de/webinar-bestand-ist-king`
- 17.09.2026: „Stationäres Geschäft und Online-Shop erfolgreich verschmelzen: Omnichannel-Excellence für Modeketten“, `/de/webinar-omnichannel-excellence-fuer-modeketten`
- 16.04.2026: „Smarter Retail für Local Heroes: Mehr Effizienz und Kundenorientierung im Filialalltag“, `/de/webinar-warenwirtschaft-in-der-cloud`
- 27.03.2026: „Customer Experience & Personalisierung: Individuelle Kundenansprache als Erfolgsrezept im Einzelhandel“, `/de/webinar-customer-experience-personalisierung`
- 24.11.2025: „Digitales Filialmanagement im Einzelhandel: Kundenzufriedenheit dank App“, `/de/webinar-digitales-filialmanagement`
- 14.11.2025: „Wie Omnichannel-Lösungen die Rolle der Store-Mitarbeitenden neu definieren“, `/de/webinar-omnichannel-loesungen`
- 10.10.2025: „Der digitale Kassenbon als neuer Marketingkanal am POS“, `/de/webinar-digitale-kassenbons`
- 05.09.2025: „KI-gestützte Omnichannel-Strategie durch personalisierte Kundeninteraktion via WhatsApp“ (mit Partner hellomateo), `/de/webinar-omnichannel-hellomateo`
- 23.05.2025: „Optimierung der Prozesslandschaft im Omnichannel-Commerce“, `/de/webinar-omnichannel-commerce`
- Supply-Chain-Webinare (z. B. „Vom Forecast ins Regal“, 29.10.2026) siehe `/de/webinare`, hier nicht im Fokus

### 4.3 Events (`/de/events`, Messen 2026/2027)

- KATAG Markentag 2026, Bielefeld, 11. bis 12. November 2026 („die Messe für Fashion und Services“)
- Best Retail Case Award 2026, 17. November 2026
- EuroCis 2027, Düsseldorf, 16. bis 18. Februar 2027 (Commerce-Leitmesse)
- Weitere (Supply Chain): BVL Kongress Berlin 21. bis 22.10.2026, BME Symposium Berlin 18. bis 19.11.2026, LogiMat Stuttgart 16. bis 18.03.2027, Logistics Plus 17.06.2027
- Eigenes Eventformat „Retail Leaders Lounge“: „Exklusives Netzwerken für den Handel“, „Nur ausgewählte Entscheider aus dem Handel – für echten Austausch auf Augenhöhe ohne Verkaufsdruck.“, „Keine Buzzwords, sondern konkrete Einblicke“; bisher u. a. Stuttgart (27.03.2025), Hamburg (16.10.2025), Wien (24.09.2026, „Zum dritten Mal“), Berlin, München, Düsseldorf; CTA „Jetzt kostenfrei bewerben“ (`/de/retail_leaders_lounge-stuttgart`, `https://retailleaderslounge.remira.com/de/rll-hamburg`, `https://retailleaderslounge.remira.com/de/rll-wien`)
- Showroom Dortmund (`/de/termin-vereinbaren-showroom-dortmund`): „Mit unserem neuen Showroom im Ambiente eines modernen Pop-up-Stores im Dortmunder Headquarter zeigen wir Ihnen vor Ort live unsere Lösungen zur Digitalisierung von Filialprozessen. Sie können verschiedene Retail-Technologien wie RFID, Digital Signage, interaktive Belege und Mobile Store Management testen.“ CTA „Jetzt Termin anfragen“; auf Produktseiten Teaser „Die Zukunft des Omnichannels / Showroom live erleben“

### 4.4 Kostenlose Angebote und CTAs (genaue Formulierung)

- Demo Commerce (`/de/produkte-commerce-demo`, `/de/demo-hauptloesung-omnichannel-commerce`): Überschrift „Sichern Sie sich jetzt eine persönliche Demo für unsere Commerce- Produkte!“; Vorteile-Liste „Optimierung Ihrer Geschäftsprozesse“, „Steigerung der Effizienz und Genauigkeit“, „Kunden über alle Kanäle hinweg begleiten“, „Nahtlose Customer Journey garantieren“, „Unkomplizierte Integration in bestehende Systeme“
- Demo EN (`/en/products-commerce-demo`): „Get a personal demo of our commerce products now!“
- Buttons auf Produktseiten: „Demo anfordern“, „Jetzt Demo anfordern!“, „Demo vereinbaren“, „Jetzt Demo vereinbaren“ (EN: „Request a demo“, „Request a demo now!“)
- Footer-CTA auf allen Seiten (wörtlich): „Neugierig auf unsere Supply-Chain- und Commerce-Lösungen? Gerne zeigen wir Ihnen kostenlos und unverbindlich, was unsere Softwarelösungen leisten, welche Lösung am besten zu Ihrem Unternehmen passt und beantworten all Ihre Fragen.“ Button „Jetzt Kontakt aufnehmen“
- Beratung WWS (wörtlich): „Gern führen wir mit Ihnen ein kostenlosen Beratungsgespräch zur Ermittlung Ihres Bedarfs und erstellen Ihnen ein Angebot.“, `/de/produkte/warenwirtschaft-software`
- Plattform-Kontakt: „kostenlosen und unverbindlichen Beratungstermin“, `/de/remira-plattform-kontaktieren-sie-uns`
- Whitepaper Commerce: „Connected Commerce im stationären Handel“, Seitentitel „Gratis Whitepaper anfordern - Connected Commerce“, „Kostenloses Whitepaper jetzt zum Download“, `/de/whitepaper-omnichannel-commerce`; EN „Connected commerce in brick-and-mortar stores“, „Free whitepaper now available for download“, `/en/whitepaper-omnichannel-commerce`
- Flyer digitaler Kassenbon (mit Partner anybill): „Flyer anfordern: Digitale Kassenbons für Ihren Erfolg“, „Jetzt Flyer anfordern“, „Den Einkauf dank digitaler Kassenbons revolutionieren“, `/de/flyer-anfordern-digitaler-kassenbon`
- Newsletter: „Verpassen Sie nichts mehr!“, „Jetzt zu den REMIRA Newslettern anmelden!“, zwei Newsletter (Supply Chain, Omnichannel Commerce), „Vier Newsletter (quartalsweise) pro Jahr“, `/de/newsletter-anmeldung`
- Webinare: „Jetzt anmelden“, „Kostenfreies Webinar“, „Aufzeichnung ansehen“
- Retail Leaders Lounge: „Jetzt kostenfrei bewerben“
- Showroom: „Jetzt Termin anfragen“
- Weitere kostenlose Angebote ohne Commerce-Fokus: Kostenfreie Datenanalyse Inventur (`/de/kostenfreie-datenanalyse`), KI-Prognose-Analyse (`/de/ki-prognosen-analyse`, `/en/ai-forecast-analysis`), AI-Forecast-Rechner (`/de/ai-forecast-calculator`), diverse Supply-Chain-Whitepaper

## 5. Referenzen und Fallstudien (Commerce)

Übersicht: `/de/uebersicht-referenzen` (92 DE-Fallstudien), `/en/overview-references` (75). Kundenstimmen hier nur mit Rolle. Firmennamen stehen gesammelt in 5.2.

### 5.1 Fälle nach Branche, Größe, Ergebnis

- Elektronik-Handelskooperation (OMS): „rund 400 Märkten, knapp 200 Gesellschaftern und einem Innenumsatz von über zwei Milliarden Euro“, Plattform „an große Marktplätze wie OTTO, eBay und Kaufland angebunden“, „über 250 individuelle Fachmarktseiten“, „rund 60.000 gelisteten Produkten“, Partnerschaft „Seit 2012“; Bereichsleitung Marketing und E-Commerce: „Wir brauchen einen Single Point of Truth, an dem alle Informationen zusammenlaufen.“, `/de/uebersicht-referenzen/expert-case-study`
- Luxus-Sportmode (Kasse, OMS, Filial-App, WWS): „15 Stores und zehn Outlets in der DACH-Region sowie jeweils einen Store und ein Outlet in den USA“, Warenwirtschaft live seit Februar 2025; Best Retail Cases Award: „2. Platz in der Jury-Wertung und dem 1. Platz im Anwender-Voting“, `/de/uebersicht-referenzen/bogner-omnichannel`, `/de/supply-chain-blog/remira-commerce-sparte-gewinnt-auszeichnung-beim-best-retail-cases-award`
- Parfümerie-Filialist (WWS + Kasse): „Alle 140 Filialen und den eigenen Onlineshop vollautomatisch mit Ware versorgen“, „innerhalb von vier Monaten ihre Infrastruktur im gesamten Filialnetz durchgängig modernisiert“, Bestandsdaten „innerhalb von ein bis zwei Sekunden“ ausgetauscht, Best Retail Cases Award 2023, `/de/uebersicht-referenzen/wie-multifilialist-pieper-waren-online-und-station%C3%A4r-automatisch-steuert`
- Sneaker-/Streetwear-Kette (WWS, Kasse, Payment): „in nur fünf Wochen sowohl eine neue Warenwirtschaftslösung einzuführen als auch alle Filialen mit neuen Kassensystemen auszustatten“, „an allen 19 Standorten das Kassensystem REMIRA POS eingeführt“, „alle Lösungen aus einer Hand“, `/de/uebersicht-referenzen/onygo-setzt-auf-remira-commerce-loesungen`
- Norddeutsches Modehaus, acht Filialen (Kasse, WWS, Filial-App): „mehr als 100 Top-Marken auf insgesamt 22.000 m² Verkaufsfläche in acht Filialen“, „98 % der Lieferanten bei CB Mode sind über EDI angebunden“, „Fehlerquote: nahezu null“, App „an allen acht Standorten genutzt“; Leitung Digitalisierung & Supply Chain: Kundenfragen „direkt auf der Fläche beantworten“, `/de/uebersicht-referenzen/cb-mode-case-study`
- Sporthändler mit fünf Stores (Filial-App): „rund 50.000 Artikeln und fünf stationären Stores“, App ermöglichte, „die Anzahl an stationären Kassen vor Ort zu reduzieren, was auch die Investitionskosten senkte“; Geschäftsführung: „Ein Kunde schrieb uns, einen so guten Service wie bei INTERSPORT habe er noch nie erlebt.“, `/de/uebersicht-referenzen/intersport-krumholz-optimiertes-einkaufserlebnis-und-bessere-beratung-dank-remira-instore-app`
- Schuhhandel-Familienunternehmen (Ship from Store): „80 Prozent der Schuhpaare in den Filialen angeboten“; Geschäftsleitung: „Sonst waren fünf Mitarbeiterinnen damit beschäftigt, die Rechnungen zu erstellen. Nun geht das innerhalb von Sekunden.“, `/de/uebersicht-referenzen/schuhhaus-horsch-schneller-aus-den-filialen-versenden`
- Jeans-Filialist (Kasse, seit 2000): „rund 300 Filialen“; Prokura: Click & Collect, Kunden „müssen die Ware erst bei Abholung bezahlen“, `/de/uebersicht-referenzen/jeans-fritz-verknuepft-online-und-offline-kanaele`
- Österreichische Modekette (WWS + Kasse): „filialweite Ausrollen von 60 Kassen REMIRA POS“, `/de/uebersicht-referenzen/gruppe-kleider-bauer-besser-verkaufen-mit-neuer-it`
- Männermodehaus, 1.000 m² (Filial-App, mobiles Kassieren): Geschäftsführung: „wenn der Kunde an der Kasse ist, muss er nur noch sagen, wie er heißt“, `/de/uebersicht-referenzen/maenner-modehaus-wahl-kassieren-neu-gedacht`
- Outdoor-Marke international (Kasse): „rund 30 Kassenplätzen der MAMMUT-Stores in der Schweiz, Deutschland und Japan“, „Der Remote-Rollout war ein voller Erfolg“, `/de/uebersicht-referenzen/mammut-kundenbindung-von-der-schweiz-bis-japan`
- Modehaus mit RFID (WWS, Kasse): „Beim Testlauf dauerte die Sichtung von 5.000 Teilen so gerade einmal 20 Minuten.“, `/de/uebersicht-referenzen/pier-14-minuten-inventur-mit-rfid`
- Modehaus, 9.000 m² (Filial-App, Inventur): „Inventur mit 200.000 Artikeln dank INSTORE App“, `/de/uebersicht-referenzen/modehaus-garhammer-remira-instore-app-inventur-mit-200000-artikeln`
- Premium-Modefilialist, 24 Filialen (WWS + Kasse): Technologie-Upgrade, `/de/uebersicht-referenzen/premiumfilialist-soer-technologie-upgrade-mit-remira`
- Lederwaren-Traditionshändler (Cloud-WWS + Kasse): Go-live Januar 2025, Wechsel von höltl Retail Flow Advanced; Geschäftsführung: „spürbare Prozessoptimierungen“, `/de/uebersicht-referenzen/droste-lederwaren-case-study`
- Schweizer Modehaus, zwei Standorte, rund 9.000 Artikel (Cloud-WWS, EDI): „transparenten Beständen, automatisierten Prozessen und einer höheren Kontrolle“, `/de/uebersicht-referenzen/moda-decurtins-case-study`
- Heimtextil-Onlinehändler (WWS, Marktplätze): „7.000 Artikel“, Problem Doppelverkäufe, `/de/uebersicht-referenzen/living-stars-mit-live-daten-zum-kundenglueck`
- Autozubehör-Hersteller (Marktplätze via Commerce Cloud): „Die Commerce Cloud importiert über 4.000 Artikel“, `/de/uebersicht-referenzen/walser-die-vielzahl-von-marktplaetzen-nutzen`
- Weitere Commerce-Fälle ohne Kennzahlen: Reitsport-Fachhandel (Kasse), Sport-/Modehaus mit 5.000 m² (WWS), Schweizer Fashion Group mit 14 Stores (Kasse), Modehändler Sigrist (Cloud-WWS + Kasse), Concept-Store mit zwei Filialen (Retail Cloud, läuft „auch auf dem Apple Mac“), Kennzeichen-Hersteller (Kasse, Terminals, Payment aus einer Hand), Sporthändler im INTERSPORT-Verbund (WWS, 35.000 Artikel)
- Zitat Homepage (Bestandsmanagement, Supply Chain): Einkauf eines Reifengroßhändlers: „unsere 16.000 SKUs nicht mehr jede Woche manuell durchgehen“, `/de/`

### 5.2 Referenzkunden (öffentlich genannt, Commerce)

expert, BOGNER, Parfümerie Pieper, ONYGO, CB Mode, INTERSPORT Krumholz, INTERSPORT Teichmann, Mode STÖCKER / INTERSPORT STÖCKER, Schuhhaus Horsch, Jeans Fritz, Kleider Bauer, Männer-Modehaus Wahl, MAMMUT, Pier 14, Modehaus Garhammer, SØR, DROSTE Lederwaren, Moda Decurtins, Sigrist Mode, Oak Store, Bollag-Guggenheim Fashion Group, EQUIVA, Living Stars, WALSER, Astorga-Gruppe, Yeans Halle (Payment-Zitat), Rose Bikes (Blog), Alte Silberschmiede (Blog), Oberpaur (Blog), Robert Ley (Blog), Convercus/Pier14 (Blog). Partner im Commerce: warrify (interaktive Belege), anybill (digitaler Kassenbon), hellomateo (Messenger-CRM/WhatsApp), Convercus (Loyalty), crossbase (PIM)

## 6. Unternehmensfakten (wörtlich)

- „Die REMIRA GmbH ist ein Softwarehersteller mit Sitz in Dortmund. REMIRA entwickelt Software für Supply Chain Management und Omnichannel Commerce.“, `/de/fakten`
- Gruppenstruktur: „REMIRA GmbH als Muttergesellschaft; vereint die REMIRA Commerce GmbH und die REMIRA Supply Chain GmbH“, `/de/fakten`
- Gründung: „Gründungsjahr REMIRA Supply Chain: 1994 (LogoMate)“, „Gründungsjahr REMIRA Commerce: 1972 (hoeltl)“, `/de/fakten`
- Beschäftigte: „rund 400 (Stand: Oktober 2026)“, `/de/fakten`; aber „Rund 500 Mitarbeiter“ und „Jahresumsatz von über 50 Millionen Euro“, `/de/unternehmen`, `/en/company`
- Kunden: „rund 1.500“, `/de/fakten`; „Über 1.500 Kunden aller Branchen weltweit“, `/de/unternehmen`; EN „more than 1,500 satisfied customers“
- POS: „Verkaufsstellen mit REMIRA Kassen: rund 8.000“, `/de/fakten`; „Rund 8.000 Verkaufsstellen (POS)“, `/de/unternehmen`
- Standorte: „12 Standorte, davon vier in Deutschland (Dortmund, Hamburg, Bad Hersfeld, Ludwigsburg)“, `/de/fakten`; Länder: Deutschland, Italien, Niederlande, Österreich, Schweiz, USA, Australien, Polen, `/de/unternehmen`
- Partner: „Partner in Deutschland, Österreich, den Niederladen, Polen, Australien und der Schweiz“ (Tippfehler auf der Seite), `/de/unternehmen`
- „Seit über 30 Jahren erfolgreich am Markt“, `/de/unternehmen`
- „Hauptsitz in Dortmund“, eigene REMIRA Austria GmbH in Wien, `/de/unternehmen`
- Positionierung: „zählen wir zu den größten Softwareunternehmen mit Hauptsitz in Deutschland“, `/de/unternehmen`
- Microsoft: „Wir sind Microsoft Solutions Partner für Digital- und App-Innovationen Azure“ (Footer aller Seiten)

## 7. Slogans, Claims, Tonalität

- Markenclaim (Kopfzeile Unternehmensseite DE und EN): „Empowering Supply Chain & Commerce“, `/de/unternehmen`, `/en/company`
- Website-Titel: „REMIRA intelligent software solutions“
- Startseite H1 DE: „KI-GESTÜTZTE SOFTWARE FÜR SUPPLY CHAIN UND COMMERCE AUS DER CLOUD“; EN: „AI-SUPPORTED SOFTWARE FOR SUPPLY CHAIN AND COMMERCE FROM THE CLOUD“
- Dachzeile: „Intelligente Softwarelösungen für Handel, Produktion und Logistik“
- Positionierung: „REMIRA ist einer der führenden europäischen Anbieter von Supply-Chain- und Omnichannel-Commerce-Lösungen“, Ziel: Prozesse „nachhaltiger, resilienter, kostengünstiger und agiler zu gestalten. So sorgen wir für mehr Umsatz“, `/de/`
- Commerce-Hauptbotschaft: „Verkaufen Sie dort, wo gekauft wird. Ohne Medienbruch. Mit einer Single-Source-of-Truth. Online und im stationären Handel.“, `/de/omnichannel-commerce-software`
- Weitere Commerce-Formeln: „Mehr als eine Middleware“, „Middleware+“, „Single Point of Truth“, „Ihr digitaler Assistent in der Filiale“, „Der Verkauf wird dort abgeschlossen, wo die Kaufentscheidung fällt.“, „Verwandeln Sie Laufkundschaft in treue Kunden“, „Die Zukunft des Omnichannels“
- Blog-Formel aktuell: „Vom vernetzten Omnichannel zum autonomen Commerce“ (Trendartikel 2027), „Vom Datenspeicher zum Profit-Center“ (Order-Management-Trends 2027), `/de/`
- Tonalität: sachlich B2B, Sie-Ansprache, nutzenorientiert, viele Fachbegriffe (Single Source of Truth, Middleware, Click & Collect), oft lange Sätze; Webinar-Titel arbeiten mit Kontrasten und Bildern („Vom Warenchaos zur Klarheit“, „Bestand ist King – und Chaos ist teuer“, „Cashflow statt Tonne“, „Servicegrad rauf, Kapitalbindung runter“); Events betonen Exklusivität ohne Verkaufsdruck
- Auffällig: Commerce wirkt auf der Website weiterhin als Teil einer Supply-Chain-Marke (Navigation führt Commerce unter „Software“ neben Supply-Chain-Lösungen, Blog heißt „supply-chain-blog“, Footer-CTA nennt beides). Eine eigenständige Commerce-Marke oder -Domain gibt es auf remira.com nicht

## 8. ROQQIO und frühere Marken

- `/de/produkte/commerce/hoeltl-suite` (H1 „ROQQIO ist jetzt REMIRA“, Untertitel „Höltl ist jetzt REMIRA“), wörtlich:
  - „In 2022 haben sich der Supply-Chain-Spezialist REMIRA und ROQQIO, der Experte für Omnichannel-Commerce-Softwarelösungen, unter dem weiterentwickelten Markendach REMIRA zusammen geschlossen.“
  - „Mit der Fusion beider Unternehmen wird das Produktangebot von REMIRA, das bislang die Bereiche Planning, Purchasing, Manufacturing, Transportation und Warehousing umfasst, um einen sechsten Bereich – Commerce – erweitert.“
  - „Ab 2023 wird die Marke ROQQIO vollständig in REMIRA aufgehen.“
  - „Bereits im Jahr 2018 haben sich die eFulfilment Transaction Services GmbH, die Futura Retail Solutions AG sowie die höltl Retail Solutions GmbH unter dem Dach der ROQQIO Commerce Solutions GmbH zusammen geschlossen.“
  - „Mit rund 500 Mitarbeitern und einem kumulierten Jahresumsatz von 50 Millionen Euro ist eines der größten Softwareunternehmen mit Hauptsitz in Deutschland entstanden.“
- Blog (2022, aktualisiert 2026): „ROQQIO, die Commerce-Sparte von REMIRA“, `/de/supply-chain-blog/remira-commerce-sparte-gewinnt-auszeichnung-beim-best-retail-cases-award`
- Frühere Produktnamen Commerce (`/de/fakten`): Commerce Cloud / ROQQIO Commerce Cloud → REMIRA Order Management; RFE, Futura → REMIRA POS; InstoreApp → App für Mobile Store Management; REMIRA Retail / Retail Cloud → REMIRA Warenwirtschaft
- Ältere höltl-Produktnamen auf Legacy-Seiten: RetailFlow (Warenwirtschaft), ConnectFlow (Filialmanagement), POSFlow (Kasse), VerticalFlow (Konsignation), M.A.R.S Classic / Galaxy (Data Warehouse), BuyBye (Self-Checkout)
- Know-how-Seite „roqqer-talk“ existiert noch (`/de/know-how/roqqer-talk`)
- Folgerung für die Kampagne: ROQQIO ist laut Website eine abgeschlossene Vorgängermarke der heutigen REMIRA Commerce. Die Website erwähnt keine geplante Abspaltung oder neue Commerce-Marke; die im Auftrag genannte Trennung in Supply Chain und Commerce ist auf remira.com nur als Gruppenstruktur (REMIRA Commerce GmbH und REMIRA Supply Chain GmbH) sichtbar
