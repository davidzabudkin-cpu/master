// 2.5D-Kamera: Keyframes als Orbit-Parameter (Zielpunkt, Abstand, Azimut, Höhe) → Position + Projektion.
import { W, H, F, w0 } from '../data.js';
import { T, SET, STX } from '../timeline.js';
import { lerp, prog, inOutCubic, inCubic, outCubic } from './ease.js';

export const whip = u => u < .5 ? 8 * u ** 4 : 1 - Math.pow(-2 * u + 2, 4) / 2;   // inOutQuart: harter Whip
const sine = u => .5 - .5 * Math.cos(Math.PI * u);
const lin = u => u;
const K = [];
const key = (t, O, o = {}, e = sine) => K.push({ t, cx: O[0] + (o.x || 0), cy: O[1] + (o.y || 0), cz: O[2] + (o.z || 0), R: o.R ?? F, az: o.az || 0, el: o.el || 0, e });
const FIELD = { y: 200, z: 480 };
// 1 Lager: nah und tief → Kran hoch, Rückfahrt
key(0, SET.WH1, { x: -560, y: 170, z: 0, R: 620, az: .9, el: .16 });
key(4.2, SET.WH1, { ...FIELD, y: 120, R: 2150, el: .42 }, inOutCubic);
key(T.whip1[0], SET.WH1, { ...FIELD, y: 120, R: 2450, el: .40 }, lin);
// 2 Heldin (Whip nach rechts), langsamer Push, dann durch den Ring
key(T.whip1[1], SET.HERO, {}, whip);
key(T.push[0], SET.HERO, { R: 1600 }, lin);
key(T.push[0] + .44, SET.HERO, { z: 2600, R: 1600 }, u => u * u);
key(T.push[1], SET.WH2, { ...FIELD, R: 2450, az: -.32, el: .44 }, outCubic);
// 3 Stichprobe: Orbit, dann Kran hoch
key(w0(30) - .1, SET.WH2, { ...FIELD, R: 2450, az: .10, el: .44 }, sine);
key(T.whip2[0], SET.WH2, { ...FIELD, R: 3150, az: .30, el: .66 }, sine);
// 4 Zahl (Whip nach oben), Push-in
key(T.whip2[1], SET.STAT, {}, whip);
key(T.whip3[0], SET.STAT, { R: 1500 }, lin);
// 5 Ablauf (Whip nach rechts), Fahrt von Station zu Station, Rückfahrt
const LEAD = 60;
key(T.whip3[1], SET.FLOW, { x: LEAD }, whip);
for (let i = 1; i < 4; i++) { key(T.st[i] - .46, SET.FLOW, { x: STX * (i - 1) + LEAD + 40 }, lin); key(T.st[i] + .08, SET.FLOW, { x: STX * i + LEAD }, inOutCubic); }
key(T.pull[0], SET.FLOW, { x: STX * 3 + LEAD + 30 }, lin);
key(T.pull[1], SET.FLOW, { x: STX * 1.5, y: 60, R: 2750 }, inOutCubic);
// 6 Siegel (Whip nach rechts), Push, Rückfahrt zum Logo
key(T.whip4[1], SET.SEAL, {}, whip);
key(T.logo[0], SET.SEAL, { R: 1570 }, lin);
key(T.logo[1], SET.SEAL, { R: 1700 }, inOutCubic);
key(T.end, SET.SEAL, { R: 1650 }, lin);

export function camAt(t) {
  let i = 0; while (i < K.length - 2 && t >= K[i + 1].t) i++;
  const a = K[i], b = K[i + 1], u = b.e(prog(t, a.t, b.t)), L = k => lerp(a[k], b[k], u);
  const c = { cx: L('cx'), cy: L('cy'), cz: L('cz'), R: L('R'), az: L('az') + .004 * Math.sin(t * .9), el: L('el') + .003 * Math.sin(t * 1.3 + 1) };
  c.sa = Math.sin(c.az); c.ca = Math.cos(c.az); c.se = Math.sin(c.el); c.ce = Math.cos(c.el);
  c.x = c.cx - c.R * c.sa * c.ce; c.y = c.cy - c.R * c.se; c.z = c.cz - c.R * c.ca * c.ce;
  return c;
}
export function proj(c, x, y, z) {
  const vx = x - c.x, vy = y - c.y, vz = z - c.z;
  const x1 = vx * c.ca - vz * c.sa, z1 = vx * c.sa + vz * c.ca, y2 = vy * c.ce - z1 * c.se, z2 = vy * c.se + z1 * c.ce;
  if (z2 < 40) return null;
  const s = F / z2; return { x: W / 2 + x1 * s, y: H / 2 + y2 * s, s, z: z2 };
}
// Kamera-Raum (für Near-Clipping von Linien)
export function toCam(c, x, y, z) {
  const vx = x - c.x, vy = y - c.y, vz = z - c.z, x1 = vx * c.ca - vz * c.sa, z1 = vx * c.sa + vz * c.ca;
  return [x1, vy * c.ce - z1 * c.se, vy * c.se + z1 * c.ce];
}
export const camKeys = K;
