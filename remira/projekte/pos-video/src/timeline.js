// Eine Quelle für alle Zeitpunkte: Bild (main.js) und Ton (tools/dump_cues.mjs → plan/cues.json) lesen dasselbe.
// Muster je Schritt (REMIRA-Regel seit WWS v4): Text zeigen → Lesezeit → Animation → nächster Schritt; Rest abdunkeln.
import { S, plain } from './texte.js';
import { SC, DURATION, LOGO_RING, PL, SY, PR, HW, TP, GN, ORDER } from './data.js';
import { prog, lerp, clamp, inOutCubic, outCubic } from './lib/ease.js';

const inOutQuint = u => u < .5 ? 16 * u ** 5 : 1 - Math.pow(-2 * u + 2, 5) / 2;
const seq = (f, n) => Array.from({ length: n }, (_, k) => f(k));

// Kamerafahrten zwischen den Szenen [Start, Ende]; Index 3 = Wendepunkt (Heldin, lange Fahrt)
// v2 (Marketing-Feedback): zu lange Pausen gekürzt (nach den Orten −1,2 s, nach dem POS-System −1,2 s, Tap2Pay −1,7 s)
export const WHIPS = [[4.7, 5.4], [13.4, 14.2], [24.0, 24.8], [42.2, 44.6], [65.5, 66.3], [80.1, 80.9], [88.8, 89.5]];

export const T = {
  petal: k => .2 + k * .1, titleIn: .4, box: 1.3, scan: [1.7, 2.3], beep: 2.3, print: [2.5, 3.8],
  // Szene 2: Satz → „Zum Beispiel:“ → Orte einzeln
  head1: 5.7, eg: 8.4, place: k => 8.9 + k * .9,
  // Szene 3: Headline → je Punkt: Text, dann Teil dockt an
  head2: 14.5, sys: k => 16.2 + k * 1.8, dock: .8,
  // Szene 4: Frage → Problemtext → Fenster → Verkauf in der Filiale → Online noch „verfügbar“ → Bestellung → Doppelverkauf → Grafik rechts → Liste
  q3: 25.1, head3: 27.2, win: 30.2, sale: 31.2, still: 32.4, order: 33.4, double: 34.2, pmove: [35.0, 35.6], kw: k => 35.9 + k * .8,
  hero: [41.6, 45.2], recolor: [43.2, 44.4], hubHit: 44.6,
  // Szene 5: ① Preis aus der Zentrale ② Verkauf → Bestände live ③ Filiale ↔ Online-Shop
  head4: 44.9, step: [46.0, 52.2, 58.2], central: 48.2, store: 48.5, price: [48.8, 50.2], rtChip: 50.4,
  shop: 54.2, sale2: 54.6, syncDot: [54.9, 56.0], drop: [56.0, 56.6],
  cap3sub: 60.2, cc: [61.6, 63.0], ris: [63.5, 64.7],
  // Szene 6 (v2, Marketing): Satz → Unterzeile → Schlange → Smartphone → Kunde 1 bezahlt → zweite Unterzeile (lesen) → erst dann Kunde 2
  head5: 66.6, sub5a: 68.5, queue: k => 70.4 + k * .15, phone: 71.6, walk: k => [[72.5, 73.4], [76.2, 77.1]][k], tap: k => [73.6, 77.3][k], sub5b: 75.0,
  // Szene 7: Satz → Häkchen einzeln, Bon druckt mit → wird digital
  head6: 81.2, check: k => 82.4 + k * .9, toPhone: [86.7, 87.7],
  ringEnd: 89.9, logo: 90.6, wipe: [90.3, 91.2], end: [91.1, 91.6, 92.3], spin: [66.6, 79.9]
};
// Texte mit Einblende-/Weg-Zeit (für die Lesezeit-Prüfung). t1 = Moment, in dem der Text das Bild verlässt.
export const TX = {
  title: [T.titleIn, WHIPS[0][0], plain(S.titleSmall + ' ' + S.title)],
  head1: [T.head1, WHIPS[1][0], plain(S.head1)],
  places: [T.place(0) + .2, WHIPS[1][0], plain(S.eg) + ' ' + S.places.join(' ')],
  head2: [T.head2, WHIPS[2][0], plain(S.head2)],
  parts: [T.sys(0), WHIPS[2][0], S.parts.join(' ')],
  q3: [T.q3, WHIPS[3][0], plain(S.q3)],
  head3: [T.head3, WHIPS[3][0], plain(S.head3)],
  kw3: [T.kw(0), WHIPS[3][0], S.kw3.join(' ')],
  head4: [T.head4, WHIPS[4][0], plain(S.head4)],
  cap1: [T.step[0], T.step[1] - .2, plain(S.cap1)],
  cap2: [T.step[1], T.step[2] - .2, plain(S.cap2)],
  cap3: [T.step[2], WHIPS[4][0], plain(S.cap3)],
  cap3sub: [T.cap3sub, WHIPS[4][0], plain(S.cap3sub)],
  head5: [T.head5, WHIPS[5][0], plain(S.head5)],
  sub5a: [T.sub5a, WHIPS[5][0], plain(S.sub5a)],
  sub5b: [T.sub5b, WHIPS[5][0], plain(S.sub5b)],
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
rk(0, P('hook', 0, -330), 80); rk(WHIPS[0][0], P('hook', 0, -330), 80);
rk(WHIPS[0][1], P('place', ...PL.ring), PL.ringR); rk(WHIPS[1][0], P('place', ...PL.ring), PL.ringR);
rk(WHIPS[1][1], P('sys', ...SY.ring), SY.ringR); rk(WHIPS[2][0], P('sys', ...SY.ring), SY.ringR);
rk(WHIPS[2][1], P('problem', ...PR.ringA), PR.rA, 1); rk(T.pmove[0], P('problem', ...PR.ringA), PR.rA, 1);
rk(T.pmove[1], P('problem', ...PR.ringB), PR.rB, 1); rk(WHIPS[3][0], P('problem', ...PR.ringB), PR.rB, 1);
rk(WHIPS[3][1], P('how', ...HW.hub), HW.hubR); rk(WHIPS[4][0], P('how', ...HW.hub), HW.hubR);
rk(WHIPS[4][1], P('tap', ...TP.ring), TP.ringR); rk(WHIPS[5][0], P('tap', ...TP.ring), TP.ringR);
rk(WHIPS[5][1], P('gain', ...GN.ring), GN.ringR); rk(WHIPS[6][0], P('gain', ...GN.ring), GN.ringR);
rk(WHIPS[6][1], P('end', 0, -128), 150); rk(T.ringEnd, P('end', 0, -128), 150);
rk(T.logo, P('end', LOGO_RING.x, LOGO_RING.y), LOGO_RING.r); rk(DURATION + 1, P('end', LOGO_RING.x, LOGO_RING.y), LOGO_RING.r);

function ringBase(t) {
  let i = 0; while (i < RK.length - 2 && t >= RK[i + 1].t) i++;
  const a = RK[i], b = RK[i + 1], u = inOutCubic(clamp((t - a.t) / (b.t - a.t))), L = p => lerp(a[p], b[p], u);
  const bumps = [T.beep, ...seq(k => T.place(k) + .45, 4), ...seq(k => T.sys(k) + T.dock + .4, 4), T.hubHit, T.price[1], T.syncDot[0], ...seq(T.tap, 2), T.logo];
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
// Drehung: ruhig; im Problem fast Stillstand; vor dem Logo exakt auf 0 (mod 2π)
const rawSpin = t => .32 * t - .22 * clamp(t - WHIPS[2][1], 0, WHIPS[3][0] - WHIPS[2][1]) + 1.1 * inOutCubic(prog(t, T.recolor[0], T.recolor[1] + .3));
export function spinAt(t) {
  const a = WHIPS[6][0], s0 = rawSpin(a), target = Math.ceil(s0 / (2 * Math.PI)) * 2 * Math.PI + 2 * Math.PI;
  if (t < a) return rawSpin(t);
  return lerp(s0, target, outCubic(prog(t, a, T.logo)));
}
// Heldin: kommt langsam aus der Ecke unten links, in der Bildmitte am langsamsten (Regel WWS v5)
export function heroAt(t) {
  const [a, b] = T.hero; if (t <= a || t >= b) return null;
  const u = (t - a) / (b - a), e = u + .8 * Math.sin(2 * Math.PI * u) / (2 * Math.PI);
  return { x: lerp(-520, 2450, e), y: lerp(1380, -380, e) - 90 * Math.sin(Math.PI * e), w: 900, rot: -.32 };
}

// Ton-Cues für tools/mix.py. „musik“ = Abschnittsgrenzen für die Musik.
export const cues = () => ({
  duration: DURATION, whips: WHIPS, musik: [WHIPS[0], WHIPS[2], WHIPS[3], WHIPS[4]],
  petals: seq(T.petal, 6), hubHit: T.hubHit, logo: T.logo, wipe: T.wipe, hero: T.hero, recolor: T.recolor,
  beep: T.beep, print: T.print, places: seq(k => T.place(k) + .45, 4), dock: seq(k => T.sys(k) + T.dock + .4, 4),
  win: T.win, sale: T.sale, order: T.order, double: T.double, kw: seq(T.kw, 3),
  steps: T.step, central: T.central, price: T.price, rtChip: T.rtChip, sale2: T.sale2, sync: T.syncDot, drop: T.drop[0], cc: T.cc, ris: T.ris,
  queue: seq(T.queue, TP.n), phone: T.phone, taps: seq(T.tap, 2),
  check: seq(T.check, 4), toPhone: T.toPhone,
  text: Object.fromEntries(Object.entries(TX).map(([k, v]) => [k, v[0]]))
});
