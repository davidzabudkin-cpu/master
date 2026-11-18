import { S } from './texte.js';
// Maße, Farben (Remira-Branding) und Szenen-Positionen in der Welt.
export const W = 1920, H = 1080, FPS = 30, DURATION = 71.5;
export const RINGC = ['#41B6E6', '#28ABBA', '#61BD47', '#FCDA34', '#FF9524', '#F53D47'];
export const BLUE = '#41B6E6', GREEN = '#61BD47', RED = '#F53D47', ORANGE = '#FF9524', GREY = '#A8A8A8', SOFT = '#C9D3DE';
// Jede Szene liegt an einem eigenen Ort; Übergänge sind Kamerafahrten (keine Schnitte, keine Schwarzbilder).
export const SC = { intro: [0, 0], steps: [2600, 0], problem: [2600, 1800], how: [5200, 0], can: [7800, 0], gain: [10400, 0], end: [13000, 0] };
export const ORDER = ['intro', 'steps', 'problem', 'how', 'can', 'gain', 'end'];
// Endkarte: Logo-Block (Ring links bis Schriftzug rechts = SVG x 0…1261) 860 px breit, mittig. Ganze Gruppe (Logo, Satz, Link) vertikal zentriert.
// Maße aus tools/logo_bbox.mjs: REMIRA y 28.6–182.7, Claim y 213–288 (Grundlinie ≈ 271, x-Höhe ≈ 39), Ring x 0–318.5.
// Endkarten-Variante per URL (?variant=A|B), sonst v3. A: mittig, ohne Schlusspunkt, Zeile optisch nach rechts. B: Textspalte linksbündig an „REMIRA“.
export const VARIANT = (globalThis.location && new URLSearchParams(globalThis.location.search).get('variant')) || 'B';   // Standard seit Runde 5: Endkarte B
export const A_SHIFT = +((globalThis.location && new URLSearchParams(globalThis.location.search).get('ashift')) || 40);
export const REMIRA_INK = { x0: 370.27, x1: 1260.88 };
export const LOGO_W = 860, LOGO_S = LOGO_W / 1261.55, LOGO_X = -LOGO_W / 2 + 1, LOGO_Y = VARIANT === 'B' ? -185 : -230;   // +1: gemessene Tinten-Mitte exakt auf x = 960
export const CLAIM = { x: 372.6, base: 271, xh: 39, right: 1258.6 }, END_TITLE_Y = 76, END_CTA_Y = 186;
export const LOGO_RING = { x: LOGO_X + 159.5 * LOGO_S, y: LOGO_Y + 146 * LOGO_S, r: 160 * LOGO_S };
// Stationen
export const ST1 = { y: 40, x: [-540, -180, 180, 540], icon: ['truck', 'warehouse', 'storefront', 'user'], label: S.st1 };
export const ST2 = { y: 0, x: [-680, -340, 0, 340, 680], icon: ['shopping-cart', 'tray-arrow-down', 'warehouse', 'tray-arrow-up', 'storefront'],
  label: S.st2 };
export const PB = { chX: -660, chY: [-170, 20, 210], chIcon: ['storefront', 'warehouse', 'laptop'], chLabel: S.ch3,
  scX: 560, scY: [-170, 20, 210], clock: [-60, 40] };
export const HW = { hub: [0, -40], hubR: 130, chX: -680, chY: [-240, -90, 60, 210], chIcon: ['tray-arrow-down', 'warehouse', 'storefront', 'laptop'], chLabel: S.ch4,
  dX: 680, dY: [-220, -10, 200], dIcon: ['truck', 'storefront', 'laptop'], dLabel: S.d4, card: [0, 205] };
export const CN = { hub: [0, -20], hubR: 110, pos: [[-560, -170], [560, -170], [-560, 170], [560, 170]], icon: ['arrows-split', 'chart-line-up', 'database', 'plugs-connected'],
  lines: S.cards5 };
export const GN = { items: S.items6, iy: [-190, -70, 50, 170],
  bx: [330, 450, 570, 690], bh: [120, 200, 280, 380], base: 260, ring: [690, -215] };
