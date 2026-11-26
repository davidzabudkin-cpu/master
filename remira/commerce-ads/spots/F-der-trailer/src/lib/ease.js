export const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const lerp = (a, b, u) => a + (b - a) * u;
export const prog = (t, a, b) => clamp((t - a) / (b - a));
export const outCubic = u => 1 - Math.pow(1 - u, 3);
export const inCubic = u => u * u * u;
export const inOutCubic = u => u < .5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2;
export const outExpo = u => u >= 1 ? 1 : 1 - Math.pow(2, -10 * u);
export const inQuart = u => u * u * u * u;
export const outBack = (u, s = 1.70158) => 1 + (s + 1) * Math.pow(u - 1, 3) + s * Math.pow(u - 1, 2);
// deterministischer Zufall (mulberry32)
export const rng = seed => () => {
  seed |= 0; seed = seed + 0x6D2B79F5 | 0;
  let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
  t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
  return ((t ^ t >>> 14) >>> 0) / 4294967296;
};
