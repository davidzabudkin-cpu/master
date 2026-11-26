import { S } from './texte.js';
// Maße, Farben (REMIRA-Branding) und Szenen-Positionen in der Welt – POS-Video v1 (25.11.2026).
export const W = 1920, H = 1080, FPS = 30, DURATION = 95.5;
export const RINGC = ['#41B6E6', '#28ABBA', '#61BD47', '#FCDA34', '#FF9524', '#F53D47'];
export const BLUE = '#41B6E6', GREEN = '#61BD47', RED = '#F53D47', ORANGE = '#FF9524', GREY = '#A8A8A8', SOFT = '#C9D3DE';
// Welt als Spirale im Uhrzeigersinn (anders als OMS und WWS): rechts → runter → links → runter → rechts → rechts → runter
export const SC = { hook: [0, 0], place: [2800, 0], sys: [2800, 1600], problem: [0, 1600], how: [0, 3200], tap: [2800, 3200], gain: [5600, 3200], end: [5600, 4800] };
export const ORDER = ['hook', 'place', 'sys', 'problem', 'how', 'tap', 'gain', 'end'];
// Endkarte (Variante B wie OMS)
export const VARIANT = (globalThis.location && new URLSearchParams(globalThis.location.search).get('variant')) || 'B';
export const A_SHIFT = 40;
export const REMIRA_INK = { x0: 370.27, x1: 1260.88 };
export const LOGO_W = 860, LOGO_S = LOGO_W / 1261.55, LOGO_X = -LOGO_W / 2 + 1, LOGO_Y = -185;
export const CLAIM = { x: 372.6, base: 271, xh: 39, right: 1258.6 }, END_TITLE_Y = 76, END_CTA_Y = 186;
export const LOGO_RING = { x: LOGO_X + 159.5 * LOGO_S, y: LOGO_Y + 146 * LOGO_S, r: 160 * LOGO_S };

// Szene 1 Hook: Karton mit Barcode wird gescannt, Kassenbon druckt
export const HK = { box: [-250, 175], boxW: 150, printer: [190, 70], pw: 300, paperW: 240, paperH: 300 };
// Szene 2 Orte: Ring oben, 4 Orte in einer Reihe
export const PL = { ring: [0, -150], ringR: 70, y: 160, x: [-630, -210, 210, 630], r: 82, icon: ['storefront', 'laptop', 'tag', 'fork-knife'] };
// Szene 3 POS-System: Checkliste links, rechts Ring mit 4 andockenden Teilen
export const SY = { iy: [-150, -30, 90, 210], ring: [470, 50], ringR: 110, pos: [[220, -150], [720, -150], [720, 250], [220, 250]], r: 70, icon: ['cash-register', 'credit-card', 'package', 'user-circle'] };
// Szene 4 Problem: zwei Fenster (Filiale, Online-Shop), dazwischen der graue Ring (Abgleich nur nachts); Gruppe erst mittig (A), dann rechts (B)
// v2 (Marketing): Kästchen höher und schmaler, damit die Grafik rechts neben der Liste in voller Größe bleibt (B-Skalierung 1 statt .52)
export const PR = { win: [[-250, 130], [250, 130]], ww: 340, wh: 420, ring: [0, 130], ringR: 62, ctr: [0, 130], A: { o: [0, 160], s: 1 }, B: { o: [480, 140], s: 1 }, kwY: [-120, 0, 120] };
{ const m = (c, p) => [c.o[0] + c.s * (p[0] - PR.ctr[0]), c.o[1] + c.s * (p[1] - PR.ctr[1])]; PR.ringA = m(PR.A, PR.ring); PR.ringB = m(PR.B, PR.ring); PR.rA = PR.ringR * PR.A.s; PR.rB = PR.ringR * PR.B.s; }
// Szene 5 So funktioniert's: Zentrale links, Ring (POS) Mitte, rechts Filiale (oben) und Online-Shop (unten)
export const HW = { central: [-690, 170], hub: [-230, 170], hubR: 104, store: { x: 360, y: 50, w: 620, h: 170 }, shop: { x: 360, y: 290, w: 620, h: 170 }, stepY: -352, capY: -272 };
// Szene 6 Tap2Pay: feste Kasse links mit Warteschlange, Smartphone rechts
export const TP = { checkout: [-680, 160], queue: k => [-530 + k * 100, 160], n: 5, phone: [430, 150], pw: 170, ph: 300, ring: [430, -80], ringR: 50 };
// Szene 7 Vorteile: Häkchen links, Kassenbon rechts → digitaler Bon
export const GN = { items: S.items6, iy: [-160, -40, 80, 200], receipt: [470, 30], ring: [470, -240], ringR: 50 };
