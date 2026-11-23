// Eine Quelle für alle Zeitpunkte: Bild (main.js) und Ton (tools/dump_cues.mjs → plan/cues.json) lesen dasselbe.
import { S, plain } from './texte.js';
import { SC, DURATION, LOGO_RING, FL, CY, PR, HW, HB, GN, SHELF } from './data.js';
import { prog, lerp, clamp, inOutCubic, outCubic } from './lib/ease.js';

const sine = u => .5 - .5 * Math.cos(Math.PI * u);
const inOutQuint = u => u < .5 ? 16 * u ** 5 : 1 - Math.pow(-2 * u + 2, 5) / 2;
const seq = (f, n) => Array.from({ length: n }, (_, k) => f(k));
const ORDER = ['hook', 'flow', 'cycle', 'problem', 'how', 'hubs', 'gain', 'end'];

// Kamerafahrten zwischen den Szenen [Start, Ende]; Index 3 = Wendepunkt (Heldin)
export const WHIPS = [[7.6, 8.4], [19.0, 19.8], [28.0, 29.2], [38.0, 39.0], [58.0, 58.8], [67.0, 67.8], [74.0, 74.7]];

export const T = {
  petal: k => .3 + k * .12, titleIn: 1.0, box: k => 2.2 + k * .3,
  // Szene 2: erst Satz lesen, dann Kacheln nacheinander, dann Kartons (halb so viele)
  node: k => 11.0 + k * .35, rail: [11.6, 12.3], data: [13.4, 14.2], flow0: 12.6, flowEvery: 1.6,
  st2: k => 20.4 + k * .15, lap0: 21.4, v2: k => 21.4 + k * 1.1,
  shelf2: 29.4, chaos: [30.8, 32.0], list: k => 30.4 + k * .25, tick0: 30.4, mism: 32.2, kw: k => 32.8 + k * .7,
  hero: [37.9, 39.4], recolor: [38.3, 39.3], hubHit: 39.0,
  // Szene 5 in drei Stufen: ① Quellen + Datenstrom ② Dashboard (Strom ruht) ③ Nachbestellung, dann Umlagerung
  src: k => 39.4 + k * .15, stream: [40.0, 44.2], panel: 44.5, card: 45.6, avail: 47.0,
  dip: [50.3, 50.9], reorder: 51.2, refill: [51.6, 52.6], stores: 53.3, move: [54.4, 55.6],
  hb: k => 60.0 + k * .6,
  draw: [68.0, 68.9], check: k => 68.8 + k * .7,
  logo: 75.8, wipe: [75.5, 76.4]
};
// Kartons auf der Bahn (Szene 2): Startzeiten
export const FLOW_BOXES = seq(k => T.flow0 + k * T.flowEvery, 4);
// Datenpunkte zum Hub (Szene 5)
export const STREAM = (() => { const out = []; for (let c = 0; c < 4; c++) for (let e = T.stream[0] + c * .23; e < T.stream[1]; e += .95 + .08 * c) out.push({ c, t: +e.toFixed(3) }); return out.sort((a, b) => a.t - b.t); })();

// Texte mit Einblende-/Weg-Zeit (für die Lesezeit-Prüfung). t1 = Moment, in dem der Text das Bild verlässt.
export const TX = {
  title: [T.titleIn, WHIPS[0][0], plain(S.titleSmall + ' ' + S.title)],
  sub1: [8.8, WHIPS[1][0], plain(S.sub1)],
  st1: [11.2, WHIPS[1][0], S.st1.join(' ')],
  head2: [20.1, WHIPS[2][0], plain(S.head2)],
  st2: [20.6, WHIPS[2][0], S.st2.flat().join(' ')],
  label3: [29.4, WHIPS[3][0], S.label3],
  head3: [29.6, WHIPS[3][0], plain(S.head3)],
  kw3: [32.8, WHIPS[3][0], S.kw3.join(' ')],
  head4: [39.3, WHIPS[4][0], plain(S.head4)],
  src4: [39.6, WHIPS[4][0], S.ch4.join(' ')],
  cap1: [39.9, 44.4, plain(S.cap1)],
  cap2: [44.6, 49.6, plain(S.cap2)],
  cap3: [49.8, 53.4, plain(S.cap3)],
  cap3sub: [53.5, WHIPS[4][0], plain(S.cap3sub)],
  head5: [59.1, WHIPS[5][0], plain(S.head5)],
  cards5: [60.0, WHIPS[5][0], S.cards5.flat().join(' ')],
  foot5: [62.9, WHIPS[5][0], plain(S.foot5)],
  head6: [68.1, WHIPS[6][0], plain(S.head6)],
  items6: [68.8, WHIPS[6][0], S.items6.join(' ')],
  end1: [76.3, DURATION, S.claim],
  end2: [76.8, DURATION, plain(S.end2)],
  end3: [77.5, DURATION, plain(S.cta)]
};

// ---------- Kamera: steht im Stand absolut still (Zoom 1), Bewegung nur in den Fahrten ----------
const hold = i => { const [x, y] = SC[ORDER[i]]; return { x, y, z: 1 }; };
export function camAt(t) {
  for (let i = 0; i < WHIPS.length; i++) {
    const [a, b] = WHIPS[i];
    if (t < a) return hold(i);
    if (t < b) { const A = hold(i), B = hold(i + 1), q = (t - a) / (b - a), u = inOutQuint(q), pull = Math.sin(Math.PI * q); return { x: lerp(A.x, B.x, u), y: lerp(A.y, B.y, u), z: (1 - .12 * pull) }; }
  }
  return hold(WHIPS.length);
}
export function sceneIndex(t) { let i = 0; while (i < WHIPS.length && t >= WHIPS[i][0]) i++; return i; }

// ---------- Ring (Signature): andere Rolle in jeder Szene ----------
const RK = [];
const P = (s, x, y) => [SC[s][0] + x, SC[s][1] + y];
const rk = (t, [x, y], r, grey = 0) => RK.push({ t, x, y, r, grey });
rk(0, P('hook', 0, -330), 92); rk(WHIPS[0][0], P('hook', 0, -330), 92);
rk(WHIPS[0][1], P('flow', ...FL.ring), 72); rk(WHIPS[1][0], P('flow', ...FL.ring), 72);
rk(WHIPS[1][1], P('cycle', ...CY.c), CY.ringR); rk(WHIPS[2][0], P('cycle', ...CY.c), CY.ringR);
rk(WHIPS[2][1], P('problem', ...PR.clock), 92, 1); rk(WHIPS[3][0], P('problem', ...PR.clock), 92, 1);
rk(WHIPS[3][1], P('how', ...HW.hub), HW.hubR, 0); rk(WHIPS[4][0], P('how', ...HW.hub), HW.hubR);
rk(WHIPS[4][1], P('hubs', ...HB.hub), HB.hubR); rk(WHIPS[5][0], P('hubs', ...HB.hub), HB.hubR);
export const gainY = u => 10;   // Ring sitzt am Ende der geglätteten Linie (Mitte des grünen Korridors)
rk(WHIPS[5][1], P('gain', GN.ringX, 10), 62); rk(WHIPS[6][0], P('gain', GN.ringX, 10), 62);
rk(WHIPS[6][1], P('end', 0, -128), 150); rk(75.1, P('end', 0, -128), 150);
rk(T.logo, P('end', LOGO_RING.x, LOGO_RING.y), LOGO_RING.r); rk(DURATION + 1, P('end', LOGO_RING.x, LOGO_RING.y), LOGO_RING.r);

function ringBase(t) {
  let i = 0; while (i < RK.length - 2 && t >= RK[i + 1].t) i++;
  const a = RK[i], b = RK[i + 1], u = inOutCubic(clamp((t - a.t) / (b.t - a.t))), L = p => lerp(a[p], b[p], u);
  const bumps = [...seq(T.v2, 5), T.hubHit, T.avail, T.reorder, T.logo];
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
// Drehung: ruhig; in der Datendrehscheibe (Szene 6) spürbar schneller; vor dem Logo exakt auf 0 (mod 2π)
const rawSpin = t => .32 * t + 1.1 * inOutCubic(prog(t, T.recolor[0], T.recolor[1] + .3)) + 3.2 * inOutCubic(prog(t, 59.2, 66.6));
export function spinAt(t) {
  const a = WHIPS[6][0], s0 = rawSpin(a), target = Math.ceil(s0 / (2 * Math.PI)) * 2 * Math.PI + 2 * Math.PI;
  if (t < a) return rawSpin(t);
  return lerp(s0, target, outCubic(prog(t, a, T.logo)));
}
// Heldin: fliegt beim Wendepunkt einmal diagonal durchs Bild (Bildschirm-Koordinaten)
export function heroAt(t) {
  const [a, b] = T.hero; if (t <= a || t >= b) return null;
  const u = (t - a) / (b - a), e = u * .55 + inOutCubic(u) * .45;
  return { x: lerp(-700, 2650, e), y: lerp(940, -260, e) - 120 * Math.sin(Math.PI * e), w: 1000, rot: -.2 };
}

// Ton-Cues: gleiche Schlüssel wie beim OMS-Mix, Inhalt an die neuen Ereignisse gebunden. „musik“ = 4 Abschnittsgrenzen für die Musik.
export const cues = () => ({
  duration: DURATION, whips: WHIPS, musik: [WHIPS[0], WHIPS[2], WHIPS[3], WHIPS[4]],
  petals: seq(T.petal, 6), st1: seq(T.box, 10), v1: seq(k => T.flow0 + (FL.x[k] - FL.x[0]) / FL.speed, 4),
  st2: seq(T.st2, 5), v2: seq(T.v2, 5),
  pch: [T.shelf2], psc: seq(T.list, 3), flights: seq(T.list, 3), tick0: T.tick0, kw: seq(T.kw, 3), mism: T.mism,
  hero: T.hero, recolor: T.recolor, hubHit: T.hubHit, hch: seq(T.src, 4), stream: STREAM.map(s => s.t), card: T.card, avail: T.avail,
  hd: [T.dip[0], T.reorder, T.stores], disp: [T.reorder, T.refill[0], T.move[0], T.move[1] - .8],
  cards: seq(T.hb, 4), check: seq(T.check, 4), bar: seq(k => T.check(k) + .1, 4), logo: T.logo, wipe: T.wipe,
  text: Object.fromEntries(Object.entries(TX).map(([k, v]) => [k, v[0]]))
});
