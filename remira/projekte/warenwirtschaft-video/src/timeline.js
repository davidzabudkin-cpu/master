// Eine Quelle für alle Zeitpunkte: Bild (main.js) und Ton (tools/dump_cues.mjs → plan/cues.json) lesen dasselbe.
import { S, plain } from './texte.js';
import { SC, DURATION, LOGO_RING, FL, CY, PR, HW, HB, GN, SHELF } from './data.js';
import { prog, lerp, clamp, inOutCubic, outCubic } from './lib/ease.js';

const sine = u => .5 - .5 * Math.cos(Math.PI * u);
const inOutQuint = u => u < .5 ? 16 * u ** 5 : 1 - Math.pow(-2 * u + 2, 5) / 2;
const seq = (f, n) => Array.from({ length: n }, (_, k) => f(k));
const ORDER = ['hook', 'flow', 'cycle', 'problem', 'how', 'hubs', 'gain', 'end'];

// Kamerafahrten zwischen den Szenen [Start, Ende]; Index 3 = Wendepunkt (Heldin)
// v4 (Feedback 23.11.): Intro kurz (4,4 s), jede Szene nach dem Muster Text → Lesezeit → Animation → nächster Schritt
export const WHIPS = [[4.7, 5.4], [16.2, 17.0], [26.8, 28.0], [43.0, 45.4], [68.5, 69.3], [79.7, 80.5], [88.5, 89.2]];

export const T = {
  petal: k => .2 + k * .1, titleIn: .4, box: k => 1.4 + k * .14,
  // Szene 2: Satz allein lesen, dann Kacheln einzeln, Bahn, Datenlinien, dann nur 2 Kartons (kein Leerlauf)
  sub1: 5.7, node: k => 8.4 + k * .5, rail: [10.4, 11.0], data: [10.9, 11.5], flow0: 11.6, flowEvery: 1.0,
  // Szene 3: Satz, dann Bereiche einzeln, dann eine Runde
  head2: 17.3, st2: k => 18.6 + k * .4, lap0: 20.8, v2: k => 20.8 + k * 1.1,
  // Szene 4: Frage allein → Problemtext → Regal-Chaos → Listen → Grafik rückt nach rechts → Schlagworte als Liste links (v5)
  q3: 28.3, head3: 30.4, shelf2: 32.6, chaos: [33.6, 34.8], list: k => 35.0 + k * .35, tick0: 32.6, mism: 36.4, pmove: [37.0, 37.7], kw: k => 37.9 + k * .8,
  // v5: Heldin langsamer, von unten links, ca. 3,6 s im Bild (Marketing 24.11.)
  hero: [42.4, 46.0], recolor: [44.0, 45.2], hubHit: 45.4,
  // Szene 5 in drei Stufen, je: Nummer + Satz → Lesezeit → Animation. ① Quellen + Datenstrom ② Dashboard ③ Nachbestellung, dann Umlagerung
  head4: 45.7, step: [46.9, 53.9, 59.3], src: k => 48.5 + k * .4, stream: [50.1, 53.3], panel: 55.5, card: 56.3, avail: 57.7,
  dip: [60.9, 61.5], reorder: 61.8, refill: [62.2, 63.2], cap3sub: 63.7, stores: 65.3, move: [66.3, 67.5],
  // Szene 6: Satz, Knoten einzeln, dann Zeile direkt unter der Headline (v5)
  head5: 69.6, hb: k => 71.1 + k * 1.0, foot5: 75.3, spin: [70.1, 78.9],
  // Szene 7: Satz, Linie, Häkchen einzeln
  head6: 80.8, draw: [81.9, 82.8], check: k => 83.3 + k * .8,
  ringEnd: 89.6, logo: 90.3, wipe: [90.0, 90.9], end: [90.8, 91.3, 92.0]
};
// Kartons auf der Bahn (Szene 2): Startzeiten
export const FLOW_BOXES = seq(k => T.flow0 + k * T.flowEvery, 2);
// Datenpunkte zum Hub (Szene 5)
export const STREAM = (() => { const out = []; for (let c = 0; c < 4; c++) for (let e = T.stream[0] + c * .23; e < T.stream[1]; e += .95 + .08 * c) out.push({ c, t: +e.toFixed(3) }); return out.sort((a, b) => a.t - b.t); })();

// Texte mit Einblende-/Weg-Zeit (für die Lesezeit-Prüfung). t1 = Moment, in dem der Text das Bild verlässt.
export const TX = {
  title: [T.titleIn, WHIPS[0][0], plain(S.titleSmall + ' ' + S.title)],
  sub1: [T.sub1, WHIPS[1][0], plain(S.sub1)],
  st1: [T.node(0) + .2, WHIPS[1][0], S.st1.join(' ')],
  head2: [T.head2, WHIPS[2][0], plain(S.head2)],
  st2: [T.st2(0) + .2, WHIPS[2][0], S.st2.flat().join(' ')],
  q3: [T.q3, WHIPS[3][0], plain(S.q3)],
  head3: [T.head3, WHIPS[3][0], plain(S.head3)],
  kw3: [T.kw(0), WHIPS[3][0], S.kw3.join(' ')],
  head4: [T.head4, WHIPS[4][0], plain(S.head4)],
  src4: [T.src(0) + .2, WHIPS[4][0], S.ch4.join(' ')],
  cap1: [T.step[0], T.step[1] - .2, plain(S.cap1)],
  cap2: [T.step[1], T.step[2] - .2, plain(S.cap2)],
  cap3: [T.step[2], WHIPS[4][0], plain(S.cap3)],
  cap3sub: [T.cap3sub, WHIPS[4][0], plain(S.cap3sub)],
  head5: [T.head5, WHIPS[5][0], plain(S.head5)],
  cards5: [T.hb(0) + .15, WHIPS[5][0], S.cards5.flat().join(' ')],
  foot5: [T.foot5, WHIPS[5][0], plain(S.foot5)],
  head6: [T.head6, WHIPS[6][0], plain(S.head6)],
  items6: [T.check(0) + .08, WHIPS[6][0], S.items6.join(' ')],
  end1: [T.end[0], DURATION, S.claim],
  end2: [T.end[1], DURATION, plain(S.end2)],
  end3: [T.end[2], DURATION, plain(S.cta)]
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
rk(WHIPS[2][1], P('problem', ...PR.clockA), PR.rA, 1); rk(T.pmove[0], P('problem', ...PR.clockA), PR.rA, 1);
rk(T.pmove[1], P('problem', ...PR.clockB), PR.rB, 1); rk(WHIPS[3][0], P('problem', ...PR.clockB), PR.rB, 1);
rk(WHIPS[3][1], P('how', ...HW.hub), HW.hubR, 0); rk(WHIPS[4][0], P('how', ...HW.hub), HW.hubR);
rk(WHIPS[4][1], P('hubs', ...HB.hub), HB.hubR); rk(WHIPS[5][0], P('hubs', ...HB.hub), HB.hubR);
export const gainY = u => 10;   // Ring sitzt am Ende der geglätteten Linie (Mitte des grünen Korridors)
rk(WHIPS[5][1], P('gain', GN.ringX, 10), 62); rk(WHIPS[6][0], P('gain', GN.ringX, 10), 62);
rk(WHIPS[6][1], P('end', 0, -128), 150); rk(T.ringEnd, P('end', 0, -128), 150);
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
const rawSpin = t => .32 * t + 1.1 * inOutCubic(prog(t, T.recolor[0], T.recolor[1] + .3)) + 3.2 * inOutCubic(prog(t, ...T.spin));
export function spinAt(t) {
  const a = WHIPS[6][0], s0 = rawSpin(a), target = Math.ceil(s0 / (2 * Math.PI)) * 2 * Math.PI + 2 * Math.PI;
  if (t < a) return rawSpin(t);
  return lerp(s0, target, outCubic(prog(t, a, T.logo)));
}
// Heldin: fliegt beim Wendepunkt einmal diagonal durchs Bild (Bildschirm-Koordinaten)
// Heldin (v5): kommt langsam aus der Ecke unten links, ist in der Bildmitte am langsamsten (gut erkennbar), fliegt oben rechts hinaus
export function heroAt(t) {
  const [a, b] = T.hero; if (t <= a || t >= b) return null;
  const u = (t - a) / (b - a), e = u + .8 * Math.sin(2 * Math.PI * u) / (2 * Math.PI);
  return { x: lerp(-520, 2450, e), y: lerp(1380, -380, e) - 90 * Math.sin(Math.PI * e), w: 900, rot: -.32 };
}

// Ton-Cues: gleiche Schlüssel wie beim OMS-Mix, Inhalt an die neuen Ereignisse gebunden. „musik“ = 4 Abschnittsgrenzen für die Musik.
export const cues = () => ({
  duration: DURATION, whips: WHIPS, musik: [WHIPS[0], WHIPS[2], WHIPS[3], WHIPS[4]],
  petals: seq(T.petal, 6), st1: seq(T.box, 10), v1: seq(k => T.flow0 + (FL.x[k] - FL.x[0]) / FL.speed, 4),
  st2: seq(T.st2, 5), v2: seq(T.v2, 5),
  pch: [T.shelf2], q3: T.q3, steps: T.step, psc: seq(T.list, 3), flights: seq(T.list, 3), tick0: T.tick0, kw: seq(T.kw, 3), mism: T.mism,
  hero: T.hero, recolor: T.recolor, hubHit: T.hubHit, hch: seq(T.src, 4), stream: STREAM.map(s => s.t), card: T.card, avail: T.avail,
  hd: [T.dip[0], T.reorder, T.stores], disp: [T.reorder, T.refill[0], T.move[0], T.move[1] - .8],
  cards: seq(T.hb, 4), check: seq(T.check, 4), bar: seq(k => T.check(k) + .1, 4), logo: T.logo, wipe: T.wipe,
  text: Object.fromEntries(Object.entries(TX).map(([k, v]) => [k, v[0]]))
});
