// Eine Quelle für alle Zeitpunkte: Bild (main.js) und Ton (tools/dump_cues.mjs → plan/cues.json) lesen dasselbe.
import { w0, w1, DURATION } from './data.js';
export const SET = { WH1: [0, 0, 0], HERO: [7000, 0, 0], WH2: [7000, 0, 9000], STAT: [7000, -6000, 9000], FLOW: [14000, -6000, 9000], SEAL: [18600, -6000, 9000] };
export const STX = 760;                                     // Abstand der Ablauf-Stationen
export const T = {
  countStart: .7, countStep: .24, tedious: w0(7), shutter: [w0(8), w0(12) + .28],
  whip1: [w0(13) - .52, w0(13) - .04], heroIn: [w0(13) - .34, w0(13) + .55], better: w0(16),
  title: w0(18), push: [w0(23) - .64, w0(23) + .1],
  sample: k => w0(24) + k * .3, extra: w0(32),
  whip2: [w0(35) - .55, w0(35) - .05], n99: [w0(37), w0(37) + .75],
  whip3: [w0(42) - .55, w0(42) - .05], st: [w0(43), w0(47), w0(52) - .05, w0(55)], pull: [w0(58), w0(61) - .55],
  whip4: [w0(61) - .55, w0(61) - .05], pwc: w0(63),
  logo: [w0(64) - .72, w0(64) - .1], pill: w0(67), brand: w0(70), end: DURATION
};
export const NCOUNT = Math.floor((T.tedious - .05 - T.countStart) / T.countStep) + 1;  // so viele Kisten schafft der Ring
export const tc = n => T.countStart + n * T.countStep;
export const cues = () => ({
  duration: DURATION, ticks: Array.from({ length: NCOUNT }, (_, n) => tc(n)), tedious: T.tedious, shutter: T.shutter,
  whips: [T.whip1, T.whip2, T.whip3, T.whip4], heroIn: T.heroIn, better: T.better, title: T.title, push: T.push,
  samples: [0, 1, 2, 3, 4, 5].map(T.sample), software: w0(31), extra: T.extra, n99: T.n99, stations: T.st, rolls: [1, 2, 3].map(i => T.st[i] - .42), ready: w0(60),
  seal: T.whip4[1], pwc: T.pwc, logo: T.logo, heroine2: T.logo[0] + .35, pill: T.pill, brand: T.brand,
  scenes: [0, T.tedious, T.whip1[1], T.title, T.push[1], w0(30), T.whip2[1], T.whip3[1], T.st[1], T.st[3], T.whip4[1], T.logo[1], T.brand]
});
