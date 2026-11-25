// Eine Quelle für alle Zeitpunkte: Bild (main.js) und Ton (tools/dump_cues.mjs → plan/cues.json) lesen dasselbe.
// Commerce-Fassung (25.11.2026): Regeln seit WWS v4: erst lesen lassen, dann weiter; Punkte links/rechts einzeln mit Lesezeit (2,5 Wörter/s + 1 s).
import { DURATION } from './data.js';
import { inOutCubic, outCubic } from './lib/ease.js';
export const T = {
  petal: k => .35 + k * .14, hex: 1.5, ai: [2.0, 2.42], disc: [2.7, 3.6], inner: k => 3.65 + k * .3,
  mod: k => 5.5 + k * .75, ring: [10.2, 11.4], omni: [11.2, 11.7], scm: [11.65, 12.15],
  panel: [12.5, 13.4], ch: k => 13.6 + k * 2.3, flow: 22.9, hit: 24.15, spin: [23.8, 25.1], out: 24.35,
  be: k => [24.9, 28.3, 31.1, 35.4][k], settle: 39.7, end: DURATION
};
// Kamera: fährt nur zwischen den Phasen. Solange Text aufgebaut wird oder steht, steht auch die Kamera (Hausregel „Text steht still“).
const sine = u => .5 - .5 * Math.cos(Math.PI * u);
const K = [];
const key = (t, z, cx = 0, cy = 0, rot = 0, e = sine) => K.push({ t, z, cx, cy, rot, e });
key(0, 3.5, 0, 0, -.05);
key(1.5, 3.05, 0, 0, -.02, outCubic);
key(2.6, 2.9, 0, 0, 0);
key(3.6, 2.0, 0, 0, 0, inOutCubic);
key(4.8, 2.0, 0, 0, 0);
key(5.5, 1.5, 0, 0, 0, inOutCubic);
key(10.1, 1.5, 0, 0, 0);
key(11.1, 1.12, 0, 0, 0, inOutCubic);
key(12.4, 1.12, 0, 0, 0);
key(13.3, 1, 0, 0, 0, inOutCubic);
key(DURATION + 1, 1, 0, 0, 0);
export function camAt(t) {
  let i = 0; while (i < K.length - 2 && t >= K[i + 1].t) i++;
  const a = K[i], b = K[i + 1], u = b.e(Math.min(1, Math.max(0, (t - a.t) / (b.t - a.t)))), L = (p) => a[p] + (b[p] - a[p]) * u;
  return { z: Math.exp(Math.log(a.z) + (Math.log(b.z) - Math.log(a.z)) * u), cx: L('cx'), cy: L('cy'), rot: L('rot') };
}
const seq = (f, n) => Array.from({ length: n }, (_, k) => f(k));
export const cues = () => ({
  duration: DURATION, petals: seq(T.petal, 6), hex: T.hex, ai: T.ai, disc: T.disc, inner: seq(T.inner, 4), mods: seq(T.mod, 6),
  ring: T.ring, omni: T.omni, scm: T.scm, panel: T.panel, ch: seq(T.ch, 4), flow: T.flow, hit: T.hit, spin: T.spin, out: T.out, be: seq(T.be, 4), settle: T.settle
});
