// Alle Texte des OMS-Videos, je Sprache. *…* = Akzentfarbe, \n = Zeilenumbruch.
// DE: freigegebene Fassung (Skript Marketing). EN: Übersetzung 18.11.2026 – vor Veröffentlichung von Marketing freigeben lassen.
import { pick } from './lang.js';

export const S = pick({
  de: {
    titleSmall: 'Was ist ein', title: '*Order Management System* (OMS)?',
    sub1: 'Eine Software, die die gesamte *Auftragsabwicklung* steuert,\nvon der Bestellung bis zur Lieferung.',
    st1: ['Bestellung', 'Lager', 'Versand', 'Lieferung'],
    head2: 'Hinter jeder Bestellung stecken *viele Schritte:*',
    st2: [['Auftrag', 'erfassen'], ['Bestand', 'prüfen'], ['Ware', 'versenden'], ['Rechnung', 'stellen'], ['Kunden', 'betreuen']],
    label3: 'DAS PROBLEM',
    head3: 'Bestellungen kommen über *viele Kanäle*\nund landen in *verschiedenen Systemen.*',
    ch3: ['Online-Shop', 'Marktplatz', 'Filiale'],
    kw3: ['Manuelle Abstimmung', 'Fehlende Übersicht', 'Verzögerte Lieferungen'],
    head4: 'So funktioniert ein *OMS*',
    ch4: ['Online-Shop', 'Marktplatz', 'Filiale', 'App'], d4: ['Lager', 'Filiale', 'Logistikpartner'],
    stock: 'Bestand', realtime: '● Echtzeit', checking: 'wird geprüft …', available: 'verfügbar',
    cap1: 'Alle Bestellungen laufen *zentral* zusammen.',
    cap2: 'Der Bestand wird in *Echtzeit* geprüft.',
    cap3: 'Jeder Auftrag geht *automatisch* an den besten Lieferort:', cap3sub: 'Lager, Filiale oder Logistikpartner.',
    head5: 'Was dadurch *möglich* wird:',
    cards5: [['Ship-from-Store'], ['Click & Collect'], ['Automatische', 'Auftragsweiterleitung'], ['Anbindung an ERP und', 'Logistikdienstleister']],
    foot5: 'Jede Bestellung findet den *schnellsten Weg* zum Kunden.',
    head6: 'Ein *Order Management System* sorgt für:',
    items6: ['Weniger Aufwand', 'Weniger manuelle Fehler', 'Schnellere Lieferungen', 'Zufriedenere Kunden'],
    claim: 'Order Management System',
    end2: 'Alle Bestellungen. *Ein System.*', end2A: 'Alle Bestellungen. *Ein System*',
    cta: 'Jetzt mehr erfahren auf *REMIRA.COM*'
  },
  en: {
    titleSmall: 'What is an', title: '*Order Management System* (OMS)?',
    sub1: 'Software that controls the entire *order fulfillment* process,\nfrom order to delivery.',
    st1: ['Order', 'Warehouse', 'Shipping', 'Delivery'],
    head2: 'Behind every order there are *many steps:*',
    st2: [['Capture', 'orders'], ['Check', 'stock'], ['Ship', 'goods'], ['Issue', 'invoices'], ['Support', 'customers']],
    label3: 'THE PROBLEM',
    head3: 'Orders come in through *many channels*\nand end up in *different systems.*',
    ch3: ['Online shop', 'Marketplace', 'Store'],
    kw3: ['Manual reconciliation', 'Lack of overview', 'Delayed deliveries'],
    head4: 'How an *OMS* works',
    ch4: ['Online shop', 'Marketplace', 'Store', 'App'], d4: ['Warehouse', 'Store', 'Logistics partner'],
    stock: 'Stock', realtime: '● Real time', checking: 'checking …', available: 'available',
    cap1: 'All orders come together *centrally.*',
    cap2: 'Stock is checked in *real time.*',
    cap3: 'Each order goes *automatically* to the best location:', cap3sub: 'warehouse, store or logistics partner.',
    head5: 'What this makes *possible:*',
    cards5: [['Ship-from-Store'], ['Click & Collect'], ['Automated', 'order routing'], ['Integration with ERP', 'and logistics providers']],
    foot5: 'Every order finds the *fastest route* to the customer.',
    head6: 'An *Order Management System* delivers:',
    items6: ['Less effort', 'Fewer manual errors', 'Faster deliveries', 'Happier customers'],
    claim: 'Order Management System',
    end2: 'All orders. *One system.*', end2A: 'All orders. *One system*',
    cta: 'Learn more at *REMIRA.COM*'
  }
});
export const plain = s => s.replace(/\*/g, '').replace(/\n/g, ' ');
