import { S } from './texte.js';
// Maße, Farben (REMIRA-Branding) und Szenen-Positionen in der Welt – Warenwirtschaft v2.
export const W = 1920, H = 1080, FPS = 30, DURATION = 81.0;
export const RINGC = ['#41B6E6', '#28ABBA', '#61BD47', '#FCDA34', '#FF9524', '#F53D47'];
export const BLUE = '#41B6E6', GREEN = '#61BD47', RED = '#F53D47', ORANGE = '#FF9524', GREY = '#A8A8A8', SOFT = '#C9D3DE';
// Welt im Zickzack (anders als OMS): runter → rechts → runter → rechts → rechts → hoch → rechts
export const SC = { hook: [0, 0], flow: [0, 1500], cycle: [2800, 1500], problem: [2800, 3200], how: [5600, 3200], hubs: [8400, 3200], gain: [8400, 1600], end: [11200, 1600] };
export const ORDER = ['hook', 'flow', 'cycle', 'problem', 'how', 'hubs', 'gain', 'end'];
// Endkarte (Variante B wie OMS)
export const VARIANT = (globalThis.location && new URLSearchParams(globalThis.location.search).get('variant')) || 'B';
export const A_SHIFT = 40;
export const REMIRA_INK = { x0: 370.27, x1: 1260.88 };
export const LOGO_W = 860, LOGO_S = LOGO_W / 1261.55, LOGO_X = -LOGO_W / 2 + 1, LOGO_Y = -185;
export const CLAIM = { x: 372.6, base: 271, xh: 39, right: 1258.6 }, END_TITLE_Y = 76, END_CTA_Y = 186;
export const LOGO_RING = { x: LOGO_X + 159.5 * LOGO_S, y: LOGO_Y + 146 * LOGO_S, r: 160 * LOGO_S };

// Szene 1 Hook: Regal 5 × 2 Fächer
export const SHELF = { x0: -470, y0: 150, cw: 188, ch: 128, cols: 5, rows: 2, box: 96 };
// Szene 2 Warenstrom: 4 Kacheln auf einer Bahn
export const FL = { y: 110, x: [-660, -220, 220, 660], tile: 124, icon: ['truck', 'warehouse', 'storefront', 'user'], label: S.st1, ring: [0, -150], speed: 300 };
// Szene 3 Kreislauf: 5 Bereiche auf einer Kreisbahn um den Ring
export const CY = { c: [0, 50], R: 320, r: 58, ang: [-90, -18, 54, 126, 198], icon: ['shopping-cart', 'tray-arrow-down', 'warehouse', 'tray-arrow-up', 'storefront'], label: S.st2, ringR: 128 };
// Szene 4 Problem: Regal (links) + lose Listen (rechts) + graue Uhr
export const PR = { shelf: { x0: -800, y0: -40, cw: 176, ch: 120, cols: 5, rows: 2, box: 90 }, lists: [[420, -40], [640, 70], [430, 190]], clock: [640, -170],
  // Fach-Zustand im Chaos: 0 normal, -1 leer (rot), n>0 überfüllt mit n Zusatzkartons
  state: [-1, 0, 2, 0, -1, 0, 3, -1, 0, 1] };
// Szene 5 So funktioniert's: Quellen links, Hub, Bestands-Dashboard rechts, zwei Filialen unten
export const HW = { hub: [-430, -40], hubR: 118, srcX: -800, srcY: [-250, -95, 60, 215], srcIcon: ['tray-arrow-down', 'warehouse', 'storefront', 'laptop'], srcLabel: S.ch4,
  panel: { x: 330, y: -90, w: 700, h: 300 }, rows: [-38, 28, 94], fill: [.78, .55, .66], min: .32, stores: [[160, 200], [500, 200]] };   // rows: lokal zur Panel-Mitte (Panel ±150)
// Szene 6 Datendrehscheibe: 4 Knoten im Bogen um den Ring
export const HB = { hub: [0, -60], hubR: 118, pos: [[-650, -60], [-270, 200], [270, 200], [650, -60]], r: 58, icon: ['arrows-split', 'chart-line-up', 'database', 'plugs-connected'], lines: S.cards5 };
// Szene 7 Vorteile: Häkchen links, Bestandsverlauf rechts
export const GN = { items: S.items6, iy: [-190, -70, 50, 170], chart: { x0: 120, x1: 760, y0: -230, y1: 250, band: 70 }, ringX: 820 };
