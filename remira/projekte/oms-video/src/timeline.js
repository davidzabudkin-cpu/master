// Eine Quelle für alle Zeitpunkte: Bild (main.js) und Ton (tools/dump_cues.mjs → plan/cues.json) lesen dasselbe.
import { SC, ORDER, DURATION, LOGO_RING, ST1, ST2, PB, HW, CN, GN } from './data.js';
import { S, plain } from './texte.js';
import { prog, lerp, clamp, inOutCubic, outCubic } from './lib/ease.js';

const sine = u => .5 - .5 * Math.cos(Math.PI * u);
const inOutQuint = u => u < .5 ? 16 * u ** 5 : 1 - Math.pow(-2 * u + 2, 5) / 2;
const seq = (f, n) => Array.from({ length: n }, (_, k) => f(k));

// Kamerafahrten zwischen den Szenen [Start, Ende]
export const WHIPS = [[10.2, 10.95], [19.4, 20.15], [29.6, 31.0], [44.6, 45.35], [54.6, 55.35], [62.2, 63.0]];

export const T = {
  petal: k => .3 + k * .12,
  st1: k => 4.5 + k * .12, v1: k => 5.0 + k * .95, titleUp: [4.2, 4.9],
  st2: k => 11.5 + k * .18, v2: k => 12.4 + k * .8,
  pch: k => 20.6 + k * .2, psc: k => 20.9 + k * .2, flight: k => 21.3 + k * .45, tick0: 21.0, kw: k => 24.6 + k * .7, mism: 24.8,
  hero: [29.55, 31.0], recolor: [29.9, 30.9], hubHit: 31.0,
  hch: k => 31.4 + k * .15, stream: [32.0, 43.6], card: 35.2, avail: 36.6, hd: k => 38.8 + k * .2, disp: k => 39.5 + k * .5,
  cards: k => 46.0 + k * .75,
  check: k => 55.9 + k * .55, bar: k => 56.2 + k * .3,
  logo: 64.3, wipe: [64.0, 64.9]
};
export const DISP = [0, 2, 1, 1, 0, 2, 0, 1, 2];                 // Ziel je Auftrag (Lager, Filiale, Logistikpartner)
export const FLIGHTS = [[0, 2], [1, 0], [2, 1], [1, 2], [0, 1], [2, 0], [1, 0], [2, 2], [0, 1], [0, 2], [1, 1], [2, 0]]; // [Kanal, Bildschirm]
// Bestellungen pro Kanal im Hub (Szene 4): Startzeiten
export const STREAM = (() => { const out = []; for (let c = 0; c < 4; c++) for (let e = T.stream[0] + c * .21; e < T.stream[1]; e += .92 + .07 * c) out.push({ c, t: +e.toFixed(3) }); return out.sort((a, b) => a.t - b.t); })();

// Texte mit Einblende-/Weg-Zeit (für die Lesezeit-Prüfung). t1 = Moment, in dem der Text das Bild verlässt.
export const TX = {
  title: [1.2, 10.2, plain(S.titleSmall + ' ' + S.title)],
  sub1: [4.6, 10.2, plain(S.sub1)],
  st1: [4.5, 10.2, S.st1.join(' ')],
  head2: [11.0, 19.4, plain(S.head2)],
  st2: [11.5, 19.4, S.st2.flat().join(' ')],
  label3: [20.2, 29.6, S.label3],
  head3: [20.4, 29.6, plain(S.head3)],
  ch3: [20.6, 29.6, S.ch3.join(' ')],
  kw3: [24.6, 29.6, S.kw3.join(' ')],
  head4: [31.1, 44.6, plain(S.head4)],
  cap1: [31.8, 35.2, plain(S.cap1)],
  cap2: [35.3, 38.7, plain(S.cap2)],
  cap3: [38.8, 44.6, plain(S.cap3 + ' ' + S.cap3sub)],
  head5: [45.4, 54.6, plain(S.head5)],
  cards5: [46.0, 54.6, S.cards5.flat().join(' ')],
  foot5: [49.6, 54.6, plain(S.foot5)],
  head6: [55.4, 62.2, plain(S.head6)],
  items6: [55.9, 62.2, S.items6.join(' ')],
  end1: [64.8, DURATION, S.claim],
  end2: [65.3, DURATION, plain(S.end2)],
  end3: [66.0, DURATION, plain(S.cta)]
};

// ---------- Kamera ----------
function hold(i, t) {
  const a = i ? WHIPS[i - 1][1] : 0, b = i < WHIPS.length ? WHIPS[i][0] : DURATION, u = sine(prog(t, a, b)), [x, y] = SC[ORDER[i]];
  // Kamera steht im Stand absolut still (ganze Pixel, Zoom 1): Text darf nicht mitwandern. Bewegung nur in den Fahrten.
  return { x, y, z: 1 };
}
export function camAt(t) {
  for (let i = 0; i < WHIPS.length; i++) {
    const [a, b] = WHIPS[i];
    if (t < a) return hold(i, t);
    if (t < b) { const A = hold(i, a), B = hold(i + 1, b), q = (t - a) / (b - a), u = inOutQuint(q), pull = Math.sin(Math.PI * q); return { x: lerp(A.x, B.x, u), y: lerp(A.y, B.y, u), z: lerp(A.z, B.z, u) * (1 - .12 * pull) }; }
  }
  return hold(WHIPS.length, t);
}
export function sceneIndex(t) { let i = 0; while (i < WHIPS.length && t >= WHIPS[i][0]) i++; return i; }

// ---------- Ring (Signature) ----------
const RK = [];
const P = (s, x, y) => [SC[s][0] + x, SC[s][1] + y];
const rk = (t, [x, y], r, grey = 0) => RK.push({ t, x, y, r, grey });
rk(0, P('intro', 0, -150), 120); rk(4.3, P('intro', 0, -150), 120);
for (let k = 0; k < 4; k++) {
  const v = T.v1(k), p = P('intro', ST1.x[k], ST1.y);
  if (k) rk(v - .2, P('intro', (ST1.x[k] + ST1.x[k - 1]) / 2, ST1.y), 60);
  rk(v, p, 92); rk(v + .55, p, 92);
}
rk(WHIPS[0][0], P('intro', ST1.x[3], ST1.y), 92);
rk(11.2, P('steps', ST2.x[0], ST2.y), 60);
for (let k = 0; k < 5; k++) {
  const v = T.v2(k), p = P('steps', ST2.x[k], ST2.y);
  if (k) rk(v - .18, P('steps', (ST2.x[k] + ST2.x[k - 1]) / 2, ST2.y), 56);
  rk(v, p, 92); rk(v + .45, p, 92);
}
rk(WHIPS[1][0], P('steps', ST2.x[4], ST2.y), 92);
rk(20.3, P('problem', ...PB.clock), 100, 1); rk(WHIPS[2][0], P('problem', ...PB.clock), 100, 1);
rk(WHIPS[2][1], P('how', ...HW.hub), HW.hubR, 0); rk(WHIPS[3][0], P('how', ...HW.hub), HW.hubR);
rk(WHIPS[3][1], P('can', ...CN.hub), CN.hubR); rk(WHIPS[4][0], P('can', ...CN.hub), CN.hubR);
rk(55.6, P('gain', ...GN.ring), 72); rk(WHIPS[5][0], P('gain', ...GN.ring), 72);
rk(WHIPS[5][1], P('end', 0, -128), 150); rk(63.4, P('end', 0, -128), 150);
rk(T.logo, P('end', LOGO_RING.x, LOGO_RING.y), LOGO_RING.r); rk(DURATION + 1, P('end', LOGO_RING.x, LOGO_RING.y), LOGO_RING.r);

function ringBase(t) {
  let i = 0; while (i < RK.length - 2 && t >= RK[i + 1].t) i++;
  const a = RK[i], b = RK[i + 1], u = inOutCubic(clamp((t - a.t) / (b.t - a.t))), L = p => lerp(a[p], b[p], u);
  const bumps = [...seq(T.v1, 4), ...seq(T.v2, 5), T.hubHit, T.avail, T.logo];
  let bump = 0; for (const tb of bumps) if (t >= tb) bump = Math.max(bump, Math.exp(-(t - tb) / .18) * clamp((t - tb) / .04));
  return { x: L('x'), y: L('y'), r: L('r') * (1 + .07 * bump), grey: L('grey') };
}
export function ringAt(t) {
  for (const [a, b] of WHIPS) if (t > a && t < b) {
    const A = ringBase(a), B = ringBase(b), q = (t - a) / (b - a), u = inOutQuint(q), s = 1 + .25 * Math.sin(Math.PI * q);
    return { x: lerp(A.x, B.x, u), y: lerp(A.y, B.y, u), r: lerp(A.r, B.r, u) * s, grey: lerp(A.grey, B.grey, inOutCubic(q)) };
  }
  return ringBase(t);
}
// Drehung: ruhig, vor dem Logo exakt auf 0 (mod 2π) auslaufen, damit der Ring deckungsgleich mit dem Logo einrastet.
const rawSpin = t => .32 * t + 1.1 * inOutCubic(prog(t, T.recolor[0], T.recolor[1] + .3));
export function spinAt(t) {
  const a = WHIPS[5][0], s0 = rawSpin(a), target = Math.ceil(s0 / (2 * Math.PI)) * 2 * Math.PI + 2 * Math.PI;
  if (t < a) return rawSpin(t);
  return lerp(s0, target, outCubic(prog(t, a, T.logo)));
}
// Heldin: fliegt beim Wendepunkt einmal diagonal durchs Bild (Bildschirm-Koordinaten)
export function heroAt(t) {
  const [a, b] = T.hero; if (t <= a || t >= b) return null;
  const u = (t - a) / (b - a), e = u * .55 + inOutCubic(u) * .45;
  return { x: lerp(-700, 2650, e), y: lerp(940, -260, e) - 120 * Math.sin(Math.PI * e), w: 1000, rot: -.2 };
}

export const cues = () => ({
  duration: DURATION, whips: WHIPS, petals: seq(T.petal, 6), st1: seq(T.st1, 4), v1: seq(T.v1, 4), st2: seq(T.st2, 5), v2: seq(T.v2, 5),
  pch: seq(T.pch, 3), psc: seq(T.psc, 3), flights: seq(T.flight, FLIGHTS.length), tick0: T.tick0, kw: seq(T.kw, 3), mism: T.mism,
  hero: T.hero, recolor: T.recolor, hubHit: T.hubHit, hch: seq(T.hch, 4), stream: STREAM.map(s => s.t), card: T.card, avail: T.avail,
  hd: seq(T.hd, 3), disp: seq(T.disp, DISP.length), cards: seq(T.cards, 4), check: seq(T.check, 4), bar: seq(T.bar, 4), logo: T.logo, wipe: T.wipe,
  text: Object.fromEntries(Object.entries(TX).map(([k, v]) => [k, v[0]]))
});
