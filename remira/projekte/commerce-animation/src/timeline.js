// Eine Quelle für alle Zeitpunkte: Bild (main.js) und Ton (tools/dump_cues.mjs → plan/cues.json) lesen dasselbe.
// Commerce-Fassung (25.11.2026): Regeln seit WWS v4: erst lesen lassen, dann weiter; Punkte links/rechts einzeln mit Lesezeit (2,5 Wörter/s + 1 s).
import { DURATION } from './data.js';
import { inOutCubic, outCubic } from './lib/ease.js';
// v2 (26.11., David): Tempo wie die Plattform-Animation (keine Lese-Pausen), danach Loop: Schlussbild steht, dann läuft alles zurück bis zum Anfang (Schwarz).
export const T = {
  petal: k => .35 + k * .14, hex: 1.5, ai: [2.0, 2.42], disc: [2.7, 3.6], inner: k => 3.65 + k * .25,
  mod: k => 5.2 + k * .68, ring: [9.4, 10.6], omni: [10.4, 11.0], scm: [10.85, 11.5],
  panel: [11.7, 12.6], ch: k => 12.6 + k * .4, flow: 14.3, hit: 15.55, spin: [15.2, 16.5], out: 15.75,
  be: k => 16.3 + k * .42, settle: 18.4,
  // Loop: Vorteile + Impulse blenden aus, dann Rücklauf des Aufbaus (Bildzeit REW[0] → 0) bis ins Schwarz
  fadeBe: [21.0, 21.5], rew: [21.5, 26.5], rewFrom: 14.2, end: DURATION
};
// Bildzeit im Rücklauf: von „alles aufgebaut, vor den Impulsen“ zurück bis 0
export const sceneTime = t => t < T.rew[0] ? t : T.rewFrom * (.5 + .5 * Math.cos(Math.PI * Math.min(1, (t - T.rew[0]) / (T.rew[1] - T.rew[0]))));   // weiche Kurve, kurzes Schwarz am Ende (Loop-Übergang)
// Kamera: fährt nur zwischen den Phasen. Solange Text aufgebaut wird oder steht, steht auch die Kamera (Hausregel „Text steht still“).
const sine = u => .5 - .5 * Math.cos(Math.PI * u);
const K = [];
const key = (t, z, cx = 0, cy = 0, rot = 0, e = sine) => K.push({ t, z, cx, cy, rot, e });
key(0, 3.5, 0, 0, -.05);
key(1.5, 3.05, 0, 0, -.02, outCubic);
key(2.6, 2.9, 0, 0, 0);
key(3.6, 2.0, 0, 0, 0, inOutCubic);
key(4.65, 2.0, 0, 0, 0);
key(5.2, 1.5, 0, 0, 0, inOutCubic);
key(9.3, 1.5, 0, 0, 0);
key(10.3, 1.12, 0, 0, 0, inOutCubic);
key(11.6, 1.12, 0, 0, 0);
key(12.5, 1, 0, 0, 0, inOutCubic);
key(DURATION + 1, 1, 0, 0, 0);
export function camAt(t) {
  let i = 0; while (i < K.length - 2 && t >= K[i + 1].t) i++;
  const a = K[i], b = K[i + 1], u = b.e(Math.min(1, Math.max(0, (t - a.t) / (b.t - a.t)))), L = (p) => a[p] + (b[p] - a[p]) * u;
  return { z: Math.exp(Math.log(a.z) + (Math.log(b.z) - Math.log(a.z)) * u), cx: L('cx'), cy: L('cy'), rot: L('rot') };
}
const seq = (f, n) => Array.from({ length: n }, (_, k) => f(k));
export const cues = () => ({
  duration: DURATION, petals: seq(T.petal, 6), hex: T.hex, ai: T.ai, disc: T.disc, inner: seq(T.inner, 4), mods: seq(T.mod, 6),
  ring: T.ring, omni: T.omni, scm: T.scm, panel: T.panel, ch: seq(T.ch, 4), flow: T.flow, hit: T.hit, spin: T.spin, out: T.out, be: seq(T.be, 4), settle: T.settle, fadeBe: T.fadeBe, rew: T.rew
});
