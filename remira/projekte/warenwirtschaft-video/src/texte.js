// Alle Texte des Warenwirtschaft-Videos, je Sprache. *…* = Akzentfarbe, \n = Zeilenumbruch.
// Quellen (18.11.2026): remira.com/de/glossar/warenwirtschaftssystem (G) und remira.com/de/produkte/warenwirtschaft-software (P).
// DE = Entwurf nach den Quellen, EN = Übersetzung. Beides vor Veröffentlichung von Marketing freigeben lassen.
import { pick } from './lang.js';

export const S = pick({
  de: {
    titleSmall: 'Was ist ein', title: '*Warenwirtschaftssystem* (WWS)?',
    sub1: 'Eine Software, die die *Warenströme* eines Unternehmens\nüber mehrere Stufen hinweg abbildet.',                          // G Definition
    st1: ['Lieferant', 'Lager', 'Filiale', 'Kunde'],
    head2: 'Ein WWS verbindet *alle Bereiche:*',                                                                                     // G Bestandteile
    st2: [['Einkauf'], ['Waren-', 'eingang'], ['Lager'], ['Waren-', 'ausgang'], ['Verkauf']],
    q3: 'Was ist das Problem ohne *zentrales System?*',                                                                              // Marketing 23.11.: Frage statt Label
    head3: 'Ohne WWS liegen Bestände und Verkäufe\nan *vielen verschiedenen Stellen.*',
    ch3: ['Filiale', 'Lager', 'Online-Shop'],
    kw3: ['Manueller Datenabgleich', 'Fehlender Überblick', 'Hoher Planungsaufwand'],                                               // G Schnittstellen, P Überblick/Planung
    head4: 'So funktioniert ein *WWS*', hub: 'WWS',
    ch4: ['Wareneingang', 'Lager', 'Filiale', 'Online-Shop'], d4: ['Lieferant', 'Filiale', 'Online-Shop'],
    stock: 'Bestand', realtime: '● Echtzeit', checking: 'wird ermittelt …', available: 'aktuell', reorder: 'nachbestellt', transfer: 'Umlagerung',
    cap1: 'Alle Daten laufen *zentral* zusammen.',                                                                                  // P zentrale Datendrehscheibe
    cap2: 'Artikelbestände werden *exakt* ermittelt.',                                                                             // P
    cap3: 'Das System bestellt *selbstständig* nach', cap3sub: 'oder schlägt Umlagerungen aus anderen Filialen vor.',                 // P
    head5: 'Was dadurch *möglich* wird:',
    cards5: [['Omnichannel-Handel'], ['Echtzeit-', 'Auswertungen'], ['Zentrale', 'Datendrehscheibe'], ['EDI-Kommunikation', 'mit Lieferanten']], // P
    foot5: 'Die Basis für *zeitgemäßen Omnichannel-Handel.*',                                                                      // P
    head6: 'Ein *Warenwirtschaftssystem* sorgt für:',
    items6: ['Automatisierung der Prozesse', 'Mehr Transparenz', 'Steigerung der Effizienz', 'Zeitersparnis'],                     // G Ziele
    claim: 'Warenwirtschaft',
    end2: 'Alle Waren. *Ein System.*', end2A: 'Alle Waren. *Ein System*',
    cta: 'Jetzt mehr erfahren auf *REMIRA.COM*'
  },
  en: {
    titleSmall: 'What is a', title: '*Merchandise Management System* (MMS)?',
    sub1: 'Software that maps a company’s *flow of goods*\nacross multiple stages.',
    st1: ['Supplier', 'Warehouse', 'Store', 'Customer'],
    head2: 'An MMS connects *all areas:*',
    st2: [['Purchasing'], ['Goods', 'receipt'], ['Warehouse'], ['Goods', 'issue'], ['Sales']],
    q3: 'What is the problem without a *central system?*',
    head3: 'Without an MMS, stock and sales data\nare spread across *many different places.*',
    ch3: ['Store', 'Warehouse', 'Online shop'],
    kw3: ['Manual data matching', 'Lack of overview', 'High planning effort'],
    head4: 'How an *MMS* works', hub: 'MMS',
    ch4: ['Goods receipt', 'Warehouse', 'Store', 'Online shop'], d4: ['Supplier', 'Store', 'Online shop'],
    stock: 'Stock', realtime: '● Real time', checking: 'calculating …', available: 'up to date', reorder: 'reordered', transfer: 'Transfer',
    cap1: 'All data comes together *centrally.*',
    cap2: 'Stock levels are determined *precisely.*',
    cap3: 'The system reorders *automatically*', cap3sub: 'or suggests transfers from other stores.',
    head5: 'What this makes *possible:*',
    cards5: [['Omnichannel retail'], ['Real-time', 'analytics'], ['Central', 'data hub'], ['EDI communication', 'with suppliers']],
    foot5: 'The foundation for *modern omnichannel retail.*',
    head6: 'A *merchandise management system* delivers:',
    items6: ['Automated processes', 'More transparency', 'Greater efficiency', 'Time savings'],
    claim: 'Merchandise Management',
    end2: 'All goods. *One system.*', end2A: 'All goods. *One system*',
    cta: 'Learn more at *REMIRA.COM*'
  }
});
export const plain = s => s.replace(/\*/g, '').replace(/\n/g, ' ');
