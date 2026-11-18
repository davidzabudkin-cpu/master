import { pick } from './lang.js';
// Texte EN = Original-Grafik von remira.com. DE = Übersetzung 18.11.2026, mit der deutschen Fassung der Grafik auf remira.com/de abgleichen und von Marketing freigeben lassen.
// Maße, Farben (Remira-Branding) und alle Texte der Plattform-Grafik.
export const W = 1920, H = 1080, FPS = 30, DURATION = 21.0;
export const C = { blue: '#2A9AC4', green: '#A8D59A', ink: '#10231A', white: '#FFFFFF' };
export const RINGC = ['#41B6E6', '#28ABBA', '#61BD47', '#FCDA34', '#FF9524', '#F53D47'];
export const CHALLENGES = [
  { y: -290, lines: pick({ en: ['Increasing regulatory', 'compliance'], de: ['Steigende regulatorische', 'Anforderungen'] }), icon: 'gavel' },
  { y: -97, lines: pick({ en: ['Global crisis'], de: ['Globale Krisen'] }), icon: 'rocket-launch' },
  { y: 97, lines: pick({ en: ['Changing customer', 'demand'], de: ['Veränderte', 'Kundennachfrage'] }), icon: 'device-mobile' },
  { y: 290, lines: pick({ en: ['New competitors', 'emerge'], de: ['Neue Wettbewerber', 'drängen in den Markt'] }), icon: 'boxing-glove' }];
export const BENEFITS = [
  { y: -290, lines: pick({ en: ['Cost savings through', 'optimal stock levels'], de: ['Kostenersparnis durch', 'optimale Bestände'] }), icon: 'hand-coins' },
  { y: -125, lines: pick({ en: ['Sustainable through', 'less waste'], de: ['Nachhaltig durch', 'weniger Abfall'] }), icon: 'plant' },
  { y: 62, lines: pick({ en: ['Efficiency through', 'high automation', '& management', 'by exception'], de: ['Effizienz durch', 'hohe Automatisierung', '& Management', 'by Exception'] }), icon: 'chart-line-up' },
  { y: 286, lines: pick({ en: ['Resilience through', 'seamless integration of', 'all business partners'], de: ['Resilienz durch', 'nahtlose Integration', 'aller Geschäftspartner'] }), icon: 'shield-check' }];
export const MODULES = [
  { lines: pick({ en: ['Forecast and', 'Replenishment'], de: ['Prognose und', 'Disposition'] }), icon: 'chart-bar' },
  { lines: pick({ en: ['Supplier', 'Collaboration'], de: ['Lieferanten-', 'management'] }), icon: 'truck' },
  { lines: pick({ en: ['Stocktaking', 'Optimization'], de: ['Inventur-', 'optimierung'] }), icon: 'warehouse' },
  { lines: ['Omnichannel', 'Commerce'], icon: 'storefront' },
  { lines: ['Order', 'Management'], icon: 'graph' },
  { lines: pick({ en: ['ESG and', 'DPP'], de: ['ESG und', 'DPP'] }), icon: 'leaf' },
  { lines: pick({ en: ['IBP', 'and S&OP'], de: ['IBP', 'und S&OP'] }), icon: 'arrows-clockwise' }];
export const MOD_A = k => -20 + k * 360 / 7;               // Winkel der Module, Grad im Uhrzeigersinn ab oben
// Innerer Kreis: 4 gleiche Segmente (Mitte bei 315°, 45°, 135°, 225°), Icon direkt vor dem Wort, Gruppe mittig im Segment
export const INNER = [
  { label: pick({ en: 'Articles', de: 'Artikel' }), a: -45, dir: 1, icon: 'cube' },
  { label: pick({ en: 'Suppliers', de: 'Lieferanten' }), a: 45, dir: 1, icon: 'truck' },
  { label: pick({ en: 'Customers', de: 'Kunden' }), a: 135, dir: -1, icon: 'magnifying-glass' },
  { label: pick({ en: 'Transactions', de: 'Transaktionen' }), a: 225, dir: -1, icon: 'shopping-cart' }];
