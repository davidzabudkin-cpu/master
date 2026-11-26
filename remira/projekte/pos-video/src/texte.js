// Alle Texte des POS-Videos, je Sprache. *…* = Akzentfarbe, \n = Zeilenumbruch.
// Quellen (25.11.2026): remira.com/de/glossar/point-of-sale-pos (G) und remira.com/de/produkte/pos (P); EN-Begriffe: remira.com/en/products/point-of-sale-software.
// DE = Entwurf nach den Quellen, EN = Übersetzung. Beides vor Veröffentlichung von Marketing freigeben lassen (siehe SKRIPT.md).
import { pick } from './lang.js';

export const S = pick({
  de: {
    titleSmall: 'Was ist ein', title: '*POS* (Point of Sale)?',                                                    // G
    head1: 'Der Ort, an dem der Kunde einen *Kauf* tätigt.', eg: 'Zum Beispiel:',                                  // G Definition
    places: ['Filiale', 'Online-Shop', 'Outlet', 'Gastro'],   // v2: Vorgabe David/Marketing (statt Glossar-Beispielen)
    head2: 'Ein *POS-System* verbindet:',                                                                          // P FAQ
    parts: ['Kasse', 'Zahlung', 'Bestände', 'Kundendaten'],                                                       // P FAQ
    q3: 'Was ist das Problem ohne *Live-Daten* an der Kasse?',                                                     // abgeleitet aus P
    head3: 'Werden Verkäufe erst über Nacht abgeglichen, stimmen Bestände\nin Filiale und Online-Shop *nicht überein.*',
    store: 'Filiale', shop: 'Online-Shop', stock: 'Bestand', sold: 'verkauft', available: 'verfügbar', soldout: 'ausverkauft', order: 'Bestellung', double: 'Doppelverkauf',
    kw3: ['Doppelverkäufe im Online-Shop', 'Warteschlangen an der Kasse', 'Einzelne Änderungen in jeder Filiale'], // abgeleitet aus P
    head4: 'So funktioniert *REMIRA POS*', hub: 'POS', central: 'Zentrale', newPrice: 'Neuer Preis', realtime: '● Echtzeit', live: '● live',
    cap1: 'Neue Artikel und Preise sind in *Echtzeit* an der Kasse verfügbar.',                                             // P
    cap2: 'Verkäufe und Bestände laufen *live* ins System.',                                                      // P
    cap3: 'Filiale und Online-Shop sind *verknüpft*', cap3sub: 'z. B. für Click & Collect oder Return-in-Store.', // P
    cc: 'Click & Collect', ris: 'Return-in-Store', paid: 'bezahlt',
    head5: 'Kassieren direkt auf der *Fläche:*',                                                                     // P Tap2Pay
    sub5a: 'Mit Tap2Pay wird das Smartphone zum Kartenterminal.',                                                 // P
    sub5b: 'Der Verkauf wird dort abgeschlossen, wo die Kaufentscheidung fällt.',                                 // P
    checkout: 'Kasse',
    head6: 'Ein modernes *POS-System* sorgt für:',                                                                 // G/P Vorteile
    items6: ['Besseren Kundenservice', 'Wirtschaftlichere Unternehmensführung', 'Flexiblere Prozesse', 'Entlastung der Mitarbeitenden'],   // v2: Marketing 26.11.
    receipt: 'Kassenbon', digital: 'digitaler Kassenbon', total: 'Summe',
    claim: 'POS Check-out',
    end2: 'Jeder Verkauf. *Ein System.*',
    cta: 'Jetzt mehr erfahren auf *REMIRA.COM*'
  },
  en: {
    titleSmall: 'What is a', title: '*POS* (point of sale)?',
    head1: 'The place where a customer makes a *purchase.*', eg: 'For example:',
    places: ['Store', 'Online shop', 'Outlet', 'Hospitality'],
    head2: 'A *POS system* connects:',
    parts: ['Checkout', 'Payment', 'Stock', 'Customer data'],
    q3: 'What is the problem without *live data* at the checkout?',
    head3: 'If sales are only synchronized overnight, stock in stores\nand the online shop *no longer match.*',
    store: 'Store', shop: 'Online shop', stock: 'Stock', sold: 'sold', available: 'available', soldout: 'sold out', order: 'Order', double: 'Double sale',
    kw3: ['Double sales online', 'Queues at the checkout', 'Single changes in every store'],
    head4: 'How *REMIRA POS* works', hub: 'POS', central: 'Head office', newPrice: 'New price', realtime: '● Real time', live: '● live',
    cap1: 'New items and prices reach the checkout in *real time.*',
    cap2: 'Sales and stock flow into the system *live.*',
    cap3: 'Stores and online business are *connected*', cap3sub: 'e.g. for Click & Collect or Return-in-Store.',
    cc: 'Click & Collect', ris: 'Return-in-Store', paid: 'paid',
    head5: 'Checkout right on the *sales floor:*',
    sub5a: 'With Tap2Pay, the smartphone becomes a card terminal.',
    sub5b: 'The sale closes where the purchase decision is made.',
    checkout: 'Checkout',
    head6: 'A modern *POS system* delivers:',
    items6: ['Better customer service', 'More efficient management', 'More flexible processes', 'Relief for employees'],
    receipt: 'Receipt', digital: 'digital receipt', total: 'Total',
    claim: 'POS Check-out',
    end2: 'Every sale. *One system.*',
    cta: 'Learn more at *REMIRA.COM*'
  }
});
export const plain = s => s.replace(/\*/g, '').replace(/\n/g, ' ');
