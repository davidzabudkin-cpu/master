import { pick } from './lang.js';
// REMIRA Commerce-Plattform (Grafik von Marketing, 25.11.2026, DE + EN). Texte wörtlich aus der Grafik; Ausnahmen siehe SKRIPT.md.
// Maße, Farben (REMIRA-Branding) und alle Texte. Aufbau wie die Plattform-Animation (remira/projekte/plattform-animation).
export const W = 1920, H = 1080, FPS = 30, DURATION = 42.5;
export const C = { blue: '#2A9AC4', green: '#A8D59A', ink: '#10231A', white: '#FFFFFF' };
export const RINGC = ['#41B6E6', '#28ABBA', '#61BD47', '#FCDA34', '#FF9524', '#F53D47'];
export const RING_TOP = 'Omnichannel', RING_BOTTOM = 'Commerce', CHIP = pick({ en: 'AI', de: 'KI' });
export const CHALLENGES = [
  { y: -290, lines: pick({ en: ['Increasing regulatory', 'compliance'], de: ['Einhaltung gesetzlicher', 'Vorschriften'] }), icon: 'gavel' },
  { y: -97, lines: pick({ en: ['Global crisis'], de: ['Globale Krise'] }), icon: 'rocket-launch' },
  { y: 97, lines: pick({ en: ['Changing customer', 'demand'], de: ['Veränderte', 'Kundennachfrage'] }), icon: 'device-mobile' },
  { y: 290, lines: pick({ en: ['New competitors', 'emerge'], de: ['Markteintritt', 'neuer Wettbewerber'] }), icon: 'boxing-glove' }];   // Grafik: „Markeneintritt“ (vermutlich Tippfehler), bitte Marketing bestätigen
export const BENEFITS = [
  { y: -290, lines: pick({ en: ['Cost savings through', 'optimal stock levels'], de: ['Kosteneinsparungen durch', 'optimale Lagerbestände'] }), icon: 'hand-coins' },
  { y: -116, lines: pick({ en: ['Sustainable through', 'less waste'], de: ['Nachhaltigkeit durch', 'weniger Abschreibungen'] }), icon: 'plant' },
  { y: 70, lines: pick({ en: ['Efficiency through', 'high automation', '& management', 'by exception'], de: ['Effizienz durch hohe', 'Automatisierung und', 'Management-', 'by-Exception'] }), icon: 'chart-line-up' },   // EN-Grafik: „automatition“ → korrigiert
  { y: 286, lines: pick({ en: ['Resilience through', 'seamless integration of', 'all business partners'], de: ['Widerstandsfähigkeit', 'durch nahtlose Integration', 'aller Geschäftspartner'] }), icon: 'shield-check' }];
// Sechs Module im Uhrzeigersinn ab oben (wie in der Grafik)
export const MODULES = [
  { lines: pick({ en: ['POS', 'Checkout'], de: ['POS', 'Check-out'] }), icon: 'cash-register' },
  { lines: pick({ en: ['Merchandise', 'Management'], de: ['Waren-', 'wirtschaft'] }), icon: 'storefront' },
  { lines: ['Order', 'Management'], icon: 'graph' },
  { lines: ['Mobile Store', 'Management'], icon: 'device-mobile' },
  { lines: ['Payment'], icon: 'credit-card' },
  { lines: ['Customer', 'Hub'], icon: 'user' }];
export const NMOD = MODULES.length, MOD_A = k => k * 360 / NMOD;   // Winkel der Module, Grad im Uhrzeigersinn ab oben
// Innerer Kreis: 4 gleiche Segmente, Icon direkt vor dem Wort, Gruppe mittig im Segment
export const INNER = [
  { label: pick({ en: 'Articles', de: 'Artikel' }), a: -45, dir: 1, icon: 'cube' },
  { label: pick({ en: 'Suppliers', de: 'Lieferanten' }), a: 45, dir: 1, icon: 'truck' },
  { label: pick({ en: 'Customers', de: 'Kunden' }), a: 135, dir: -1, icon: 'magnifying-glass' },
  { label: pick({ en: 'Transactions', de: 'Transaktionen' }), a: 225, dir: -1, icon: 'shopping-cart' }];
