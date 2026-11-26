// Alle Bildtexte DE/EN (Vorschlag, vor Veröffentlichung von Marketing freigeben). Akzent mit *…*, Zeilenumbruch mit \n.
// Grundlage remira.com: „Isolierte und nicht synchronisierte Bestände über mehrere Kanäle“, „Overselling“, „Single-Source-of-Truth“ (Omnichannel Commerce Software).
import { pick } from './lang.js';
const D = {
  hook: { de: '1 Paar.\n*2 Käufer.*', en: '1 pair.\n*2 buyers.*' },
  tag: { de: 'Nur noch 1', en: 'Only 1 left' },
  store: { de: 'Laden', en: 'Store' },
  shop: { de: 'Online-Shop', en: 'Online shop' },
  cart: { de: 'In den Warenkorb', en: 'Add to cart' },
  sold: { de: 'VERKAUFT', en: 'SOLD' },
  cancel: { de: 'STORNIERT', en: 'CANCELLED' },
  agit: { de: 'Laden und Shop\nzählen *getrennt.*', en: 'Store and shop\ncount *separately.*' },
  stock: { de: 'Bestand', en: 'Stock' },
  sol: { de: 'Ein Bestand\nfür Laden und Shop.', en: 'One stock\nfor store and shop.' },
  soldOut: { de: 'Ausverkauft', en: 'Sold out' },
  realtime: { de: 'Echtzeit', en: 'Real time' },
  claim: { de: 'Ein Laden. Ein Bestand.\n*Ein System.*', en: 'One store. One stock.\n*One system.*' },
  cta: { de: 'Persönliche Demo sichern', en: 'Book your personal demo' },
  url: { de: 'remira.com', en: 'remira.com' }
};
export const S = Object.fromEntries(Object.entries(D).map(([k, v]) => [k, pick(v)]));
export const DE = Object.fromEntries(Object.entries(D).map(([k, v]) => [k, v.de]));
export const EN = Object.fromEntries(Object.entries(D).map(([k, v]) => [k, v.en]));
