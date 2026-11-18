// Remira „Inventory Sampling“ v2 – 2.5D-Kamerafilm in Canvas. Jede Zeit hängt an Wortzeiten (timeline.js).
import { W, H, FPS, F, C, RING, w0, w1, DURATION } from './data.js';
import { T, SET, STX, NCOUNT, tc } from './timeline.js';
import { camAt, proj, toCam, whip } from './lib/cam.js';
import { prog, clamp, lerp, outCubic, inCubic, outBack, inOutCubic, outExpo, rng } from './lib/ease.js';

const scale = Number(new URLSearchParams(location.search).get('scale')) || 1;
const canvas = document.getElementById('c');
canvas.width = Math.max(2, 2 * Math.round(W * scale / 2)); canvas.height = Math.max(2, 2 * Math.round(H * scale / 2));
const out = canvas.getContext('2d');
const scn = new OffscreenCanvas(canvas.width, canvas.height);
const g = scn.getContext('2d');
let cam, fsc = scale;            // aktuelle Kamera, Pixel-Faktor für Filter

// ---------- Assets ----------
const FONT = '"Source Sans 3"';
{ const f = new FontFace('Source Sans 3', 'url(../assets/fonts/SourceSans3/SourceSans3-wght-latin.woff2)', { weight: '200 900' }); await f.load(); document.fonts.add(f); await document.fonts.ready; }
const font = (px, w = 600) => `${w} ${px}px ${FONT}`;
const loadImg = src => new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = src; });
const HM = await (await fetch('../assets/heroes/meta.json')).json();
const HERO = {};
for (const n of Object.keys(HM)) { HERO[n] = []; for (let i = 0; i < HM[n].frames; i++) HERO[n].push(await createImageBitmap(await (await fetch(`../assets/heroes/${n}/${String(i).padStart(2, '0')}.webp`)).blob())); }
// Logo: Original-SVG lesen → Ring-Blätter (mit Verläufen), Wortmarke, Claim als Pfade
const LOGO = { cx: 159.5, cy: 146, R: 160, petals: [], letters: [], claim: [] };
{
  const txt = await (await fetch('../assets/brand/remira-logo-claim-white.svg')).text();
  const doc = new DOMParser().parseFromString(txt, 'image/svg+xml'), grads = {}, cls = {};
  doc.querySelectorAll('radialGradient').forEach(e => { grads[e.id] = { cx: +e.getAttribute('cx'), cy: +e.getAttribute('cy'), r: +e.getAttribute('r'), stops: [...e.querySelectorAll('stop')].map(s => [+s.getAttribute('offset'), s.getAttribute('stop-color')]) }; });
  for (const m of txt.matchAll(/\.(cls-\d)\{fill:url\(#([^)]+)\)/g)) cls[m[1]] = grads[m[2]];
  const ps = [...doc.querySelectorAll('path')].map(p => ({ c: p.getAttribute('class'), d: new Path2D(p.getAttribute('d')) }));
  const white = ps.filter(p => p.c === 'cls-1'); LOGO.letters = white.slice(0, 6).map(p => p.d); LOGO.claim = white.slice(6).map(p => p.d);
  for (const c of ['cls-2', 'cls-3', 'cls-6', 'cls-4', 'cls-5', 'cls-7']) {   // im Uhrzeigersinn ab oben
    const p = ps.find(q => q.c === c), gr = cls[c], grad = g.createRadialGradient(gr.cx, gr.cy, 0, gr.cx, gr.cy, gr.r);
    gr.stops.forEach(([o, col]) => grad.addColorStop(o, col)); LOGO.petals.push({ d: p.d, grad });
  }
}

// ---------- Helfer ----------
const LEADT = .07;
const hex = h => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
const mixc = (a, b, u) => { const A = typeof a === 'string' ? hex(a) : a, B = typeof b === 'string' ? hex(b) : b; return [0, 1, 2].map(i => A[i] + (B[i] - A[i]) * u); };
const u8 = v => Math.max(0, Math.min(255, v | 0));
const rgb = (c, a = 1) => `rgba(${u8(c[0])},${u8(c[1])},${u8(c[2])},${a})`;
function grad(x0, y0, x1, y1, cols) { const gr = g.createLinearGradient(x0, y0, x1, y1); cols.forEach((c, i) => gr.addColorStop(i / (cols.length - 1), c)); return gr; }
const P = (O, x = 0, y = 0, z = 0) => proj(cam, O[0] + x, O[1] + y, O[2] + z);
function onPlane(O, x, y, z, fn) { const p = P(O, x, y, z); if (!p || p.s > 30) return; g.save(); g.translate(p.x, p.y); g.scale(p.s, p.s); const k = fsc; fsc = scale * p.s; fn(p); fsc = k; g.restore(); }
// Kinetic Type: ein Wort, blendet auf seinem gesprochenen Zeitpunkt ein (Blur, von unten, Schriftgewicht wächst)
function kw(s, x, y, t, tIn, o = {}) {
  const u = outCubic(prog(t, tIn - LEADT, tIn - LEADT + (o.dur ?? .36)));
  let a = u * (o.a ?? 1), up = 0;
  if (o.out != null) { const q = inCubic(prog(t, o.out, o.out + .24)); a *= 1 - q; up = q * o.size * .25; }
  if (a <= .004) return;
  const wt = Math.round(lerp(o.wFrom ?? Math.max(200, (o.w ?? 600) - 300), o.w ?? 600, outCubic(prog(t, tIn - LEADT, tIn - LEADT + .5))));
  g.save(); g.globalAlpha *= a; g.font = font(o.size, wt); g.textAlign = o.align ?? 'left'; g.textBaseline = 'alphabetic'; g.letterSpacing = (o.track ?? 0) + 'px';
  const b = (1 - u) * o.size * .1 * fsc; if (b > .5) g.filter = `blur(${b.toFixed(2)}px)`;
  let fill = o.fill ?? C.text;
  if (Array.isArray(fill)) { const m = g.measureText(s).width, x0 = o.align === 'center' ? x - m / 2 : x; fill = grad(x0, 0, x0 + m, 0, fill); }
  if (o.shadow) { g.shadowColor = 'rgba(0,0,0,.75)'; g.shadowBlur = 28 * fsc; }
  g.fillStyle = fill; g.fillText(s, x, y + (1 - u) * o.size * .3 - up); g.restore();
}
// Zeile aus Wörtern: [Text, Zeit, {w, fill, size}]
function kline(t, x, y, size, items, o = {}) {
  const ms = items.map(([s, , io = {}]) => { g.save(); g.font = font(io.size ?? size, io.w ?? o.w ?? 600); g.letterSpacing = (io.track ?? o.track ?? 0) + 'px'; const m = g.measureText(s).width; g.restore(); return m; });
  const sp = size * (o.space ?? .25); let cx = o.align === 'center' ? x - (ms.reduce((a, b) => a + b, 0) + sp * (items.length - 1)) / 2 : x;
  items.forEach(([s, ti, io = {}], i) => { kw(s, cx, y, t, ti, { size: io.size ?? size, w: io.w ?? o.w ?? 600, fill: io.fill ?? o.fill, out: o.out, track: io.track ?? o.track, shadow: o.shadow, wFrom: io.wFrom ?? o.wFrom, a: io.a ?? o.a }); cx += ms[i] + sp; });
}
function check(pts, a, col, lw) {   // Haken durch 3 Bildschirmpunkte, zeichnet sich
  if (a <= 0) return; const k = clamp(a); g.save(); g.strokeStyle = col; g.lineWidth = lw; g.lineCap = 'round'; g.lineJoin = 'round'; g.beginPath(); g.moveTo(...pts[0]);
  if (k < .4) g.lineTo(lerp(pts[0][0], pts[1][0], k / .4), lerp(pts[0][1], pts[1][1], k / .4));
  else { g.lineTo(...pts[1]); g.lineTo(lerp(pts[1][0], pts[2][0], (k - .4) / .6), lerp(pts[1][1], pts[2][1], (k - .4) / .6)); }
  g.stroke(); g.restore();
}
// Der Ring = Bildmarke aus dem Original-SVG. o: alpha, grey (0..1), pet(i) → Blatt-Skalierung, glow
function mark(x, y, r, rot = 0, o = {}) {
  const A = o.alpha ?? 1; if (A <= .003 || r < .5) return;
  g.save(); g.translate(x, y);
  if (o.glow) { g.save(); g.globalCompositeOperation = 'lighter'; const gl = g.createRadialGradient(0, 0, r * .3, 0, 0, r * 2.3); gl.addColorStop(0, `rgba(90,180,255,${.30 * o.glow * A})`); gl.addColorStop(1, 'rgba(90,180,255,0)'); g.fillStyle = gl; g.beginPath(); g.arc(0, 0, r * 2.3, 0, 7); g.fill(); g.restore(); }
  g.rotate(rot); const k = r / LOGO.R; g.scale(k, k); g.translate(-LOGO.cx, -LOGO.cy);
  LOGO.petals.forEach((p, i) => {
    const s = o.pet ? o.pet(i) : 1; if (s <= .01) return; g.save();
    if (s !== 1) { g.translate(LOGO.cx, LOGO.cy); g.scale(s, s); g.rotate((1 - s) * -1.4); g.translate(-LOGO.cx, -LOGO.cy); }
    g.globalAlpha *= A; g.fillStyle = p.grad; g.fill(p.d);
    if (o.grey) { g.globalAlpha *= o.grey; g.fillStyle = '#8D97A8'; g.fill(p.d); }
    g.restore();
  });
  g.restore();
}
function hero(name, cx, cy, w, t, o = {}) {   // cx, cy = Mitte; Schleife 12,5 Bilder/s
  const m = HM[name], fr = HERO[name][Math.floor(((t * 12.5) % m.frames + m.frames) % m.frames)], h = w * m.h / m.w;
  g.save(); g.translate(cx, cy + 9 * Math.sin(t * 2.0 + (o.ph ?? 0))); g.rotate((o.rot ?? 0) + .012 * Math.sin(t * 1.4 + (o.ph ?? 0))); if (o.flip) g.scale(-1, 1);
  g.globalAlpha *= o.alpha ?? 1; g.imageSmoothingQuality = 'high'; g.drawImage(fr, -w / 2, -h / 2, w, h); g.restore();
}
const emblem = (name, cx, cy, w, t, o = {}) => { const m = HM[name], h = w * m.h / m.w; return [cx + (m.emblem[0] - .5) * w * (o.flip ? -1 : 1), cy + 9 * Math.sin(t * 2.0 + (o.ph ?? 0)) + (m.emblem[1] - .5) * h, m.emblem[2] * w]; };

// ---------- Welt: Staub + Lichtflecken ----------
const R0 = rng(11), DUST = [], GLOW = [];
for (let i = 0; i <= 150; i++) { const c = camAt(DURATION * i / 150); for (let k = 0; k < 7; k++) DUST.push([c.cx + (R0() - .5) * 5200, c.cy + (R0() - .5) * 3400, c.cz + (R0() - .5) * 5200 - 600, 1.5 + R0() * 3.5, .25 + R0() * .6]); }
for (const [n, cols] of [['WH1', [5, 0]], ['HERO', [5, 1, 2]], ['WH2', [0, 3]], ['STAT', [4, 1, 2]], ['FLOW', [5, 0, 3]], ['SEAL', [5, 0, 4]]])
  cols.forEach((ci, j) => GLOW.push([SET[n][0] + (j - (cols.length - 1) / 2) * 3000 + (R0() - .5) * 800, SET[n][1] + (R0() - .5) * 1300 - (n.startsWith('WH') ? 900 : 0), SET[n][2] + 2600, RING[ci][1], 1500 + R0() * 700]));
for (let i = 1; i < 4; i++) GLOW.push([SET.FLOW[0] + STX * i + 500, SET.FLOW[1] + (i % 2 ? -600 : 500), SET.FLOW[2] + 2600, RING[[0, 2, 3][i - 1]][1], 1500]);
function world(t) {
  g.fillStyle = C.bg; g.fillRect(0, 0, W, H);
  const bgG = g.createRadialGradient(W / 2, H * .45, 0, W / 2, H * .45, W * .75); bgG.addColorStop(0, '#0C1626'); bgG.addColorStop(1, '#020409'); g.fillStyle = bgG; g.fillRect(0, 0, W, H);
  g.save(); g.globalCompositeOperation = 'lighter';
  for (const [x, y, z, col, r] of GLOW) { const p = proj(cam, x, y, z); if (!p || p.s > 3) continue; const rr = r * p.s; if (p.x < -rr || p.x > W + rr || p.y < -rr || p.y > H + rr) continue; const gl = g.createRadialGradient(p.x, p.y, 0, p.x, p.y, rr); gl.addColorStop(0, col + '24'); gl.addColorStop(1, col + '00'); g.fillStyle = gl; g.fillRect(p.x - rr, p.y - rr, rr * 2, rr * 2); }
  for (const [x, y, z, r, a] of DUST) { const p = proj(cam, x, y, z); if (!p || p.z < 220 || p.z > 7000 || p.x < -20 || p.x > W + 20 || p.y < -20 || p.y > H + 20) continue; g.globalAlpha = a * clamp(1.6 - p.z / 4500) * clamp((p.z - 220) / 500); g.fillStyle = '#9FD0FF'; g.beginPath(); g.arc(p.x, p.y, Math.max(.7, r * p.s), 0, 7); g.fill(); }
  g.restore();
}

// ---------- Lager (3D-Kisten) ----------
const COLS = 12, ROWS = 7, PITCH = 160, CS = 110, FLOOR = 260, NB = COLS * ROWS;
const crate = (c, r) => [(c - (COLS - 1) / 2) * PITCH, r * PITCH];
const countCR = n => n < COLS ? [n, 0] : [COLS - 1 - (n - COLS), 1];           // Zählweg: Schlangenlinie
const SAMPLE = [[1, 1], [4, 4], [6, 0], [8, 5], [10, 2], [3, 6]];
const NEAR = Array.from({ length: NB }, (_, i) => { const c = i % COLS, r = Math.floor(i / COLS); let best = 0, bd = 1e9; SAMPLE.forEach(([sc, sr], k) => { const d = Math.hypot(sc - c, sr - r); if (d < bd) { bd = d; best = k; } }); return [best, bd]; });
function line3(O, a, b, col, lw) {   // Linie mit Near-Clipping
  let A = toCam(cam, O[0] + a[0], O[1] + a[1], O[2] + a[2]), B = toCam(cam, O[0] + b[0], O[1] + b[1], O[2] + b[2]); const n = 60;
  if (A[2] < n && B[2] < n) return; if (A[2] < n) { const u = (n - A[2]) / (B[2] - A[2]); A = [0, 1, 2].map(i => A[i] + (B[i] - A[i]) * u); } if (B[2] < n) { const u = (n - B[2]) / (A[2] - B[2]); B = [0, 1, 2].map(i => B[i] + (A[i] - B[i]) * u); }
  g.strokeStyle = col; g.lineWidth = lw; g.beginPath(); g.moveTo(W / 2 + A[0] * F / A[2], H / 2 + A[1] * F / A[2]); g.lineTo(W / 2 + B[0] * F / B[2], H / 2 + B[1] * F / B[2]); g.stroke();
}
function poly(pts, fill, stroke, lw = 1) { g.beginPath(); pts.forEach((p, i) => i ? g.lineTo(p.x, p.y) : g.moveTo(p.x, p.y)); g.closePath(); if (fill) { g.fillStyle = fill; g.fill(); } if (stroke) { g.strokeStyle = stroke; g.lineWidth = lw; g.stroke(); } }
const BOX = { top: hex('#263A5C'), front: hex('#182943'), side: hex('#101C30'), fog: hex('#05080F') };
function warehouse(t, O, state, A = 1) {
  g.save(); g.globalAlpha = A;
  // Boden: Lichtfleck + Raster
  const pc = P(O, 0, FLOOR, 480);
  if (pc) { g.save(); g.globalCompositeOperation = 'lighter'; g.translate(pc.x, pc.y); g.scale(1, Math.max(.12, cam.se)); const fg = g.createRadialGradient(0, 0, 0, 0, 0, 1700 * pc.s); fg.addColorStop(0, 'rgba(40,90,150,.22)'); fg.addColorStop(1, 'rgba(40,90,150,0)'); g.fillStyle = fg; g.beginPath(); g.arc(0, 0, 1700 * pc.s, 0, 7); g.fill(); g.restore(); }
  for (let c = -8; c <= COLS + 8; c++) line3(O, [(c - COLS / 2) * PITCH, FLOOR, -900], [(c - COLS / 2) * PITCH, FLOOR, 2600], 'rgba(90,130,190,.10)', 1.2);
  for (let r = -5; r <= ROWS + 9; r++) line3(O, [-2300, FLOOR, (r - .5) * PITCH], [2300, FLOOR, (r - .5) * PITCH], 'rgba(90,130,190,.10)', 1.2);
  const list = [];
  for (let i = 0; i < NB; i++) { const c = i % COLS, r = Math.floor(i / COLS), [x, z] = crate(c, r), p = P(O, x, FLOOR - CS / 2, z); if (p) list.push([p.z, i, x, z]); }
  list.sort((a, b) => b[0] - a[0]);
  const h = CS / 2, cxl = cam.x - O[0], czl = cam.z - O[2];
  for (const [zd, i, x, z] of list) {
    const st = state(i), V = (dx, dy, dz) => P(O, x + dx * h, FLOOR - CS / 2 + dy * h, z + dz * h);
    const v = [V(-1, -1, -1), V(1, -1, -1), V(1, -1, 1), V(-1, -1, 1), V(-1, 1, -1), V(1, 1, -1), V(1, 1, 1), V(-1, 1, 1)];
    if (v.some(q => !q)) continue;
    const fog = clamp((zd - 2300) / 4200) * .75, dim = 1 - (st.dim ?? 0), tint = st.tint, m = st.mix ?? 0;
    const colr = (base, k) => { let c = tint ? mixc(base, mixc(tint, [255, 255, 255], k), m) : base; c = mixc(c, BOX.fog, fog); return rgb([c[0] * dim, c[1] * dim, c[2] * dim]); };
    const edge = `rgba(150,185,235,${(.30 + .5 * m) * (1 - fog) * dim})`, lw = Math.max(.8, 1.6 * v[0].s);
    if (cxl < x - h) poly([v[0], v[3], v[7], v[4]], colr(BOX.side, -.35), edge, lw); else if (cxl > x + h) poly([v[1], v[2], v[6], v[5]], colr(BOX.side, -.35), edge, lw);
    if (czl < z - h) poly([v[0], v[1], v[5], v[4]], colr(BOX.front, -.15), edge, lw);
    poly([v[0], v[1], v[2], v[3]], colr(BOX.top, .12), edge, lw);
    // Klebeband → liest sich als Karton
    const tp = (u, w) => { const a = { x: lerp(v[0].x, v[1].x, u), y: lerp(v[0].y, v[1].y, u) }, b = { x: lerp(v[3].x, v[2].x, u), y: lerp(v[3].y, v[2].y, u) }; return [a, b]; };
    const [a1, b1] = tp(.42), [a2, b2] = tp(.58); poly([a1, a2, b2, b1], `rgba(255,255,255,${.07 * (1 - fog) * dim + .1 * m})`);
    if (st.check > 0) { const f = (u, w) => { const a = { x: lerp(v[0].x, v[1].x, u), y: lerp(v[0].y, v[1].y, u) }, b = { x: lerp(v[3].x, v[2].x, u), y: lerp(v[3].y, v[2].y, u) }; return [lerp(a.x, b.x, w), lerp(a.y, b.y, w)]; }; check([f(.24, .45), f(.44, .22), f(.78, .78)], st.check, st.checkCol ?? '#fff', clamp(9 * v[0].s, 1.5, 13)); }
    if (st.beam > 0 && tint) { const b0 = V(0, -1, 0), b1 = P(O, x, FLOOR - CS - 760, z); if (b0 && b1) { g.save(); g.globalCompositeOperation = 'lighter'; const bg = g.createLinearGradient(0, b0.y, 0, b1.y); bg.addColorStop(0, rgb(tint, .55 * st.beam)); bg.addColorStop(1, rgb(tint, 0)); g.fillStyle = bg; const bw = 46 * b0.s; g.fillRect(b0.x - bw, b1.y, bw * 2, b0.y - b1.y); g.restore(); } }
  }
  g.restore();
}
function floorRing(O, x, z, rad, col, a, lw) { if (a <= .01) return; g.save(); g.globalAlpha *= a; g.strokeStyle = col; g.lineWidth = lw; g.beginPath(); let ok = true; for (let i = 0; i <= 48; i++) { const an = i / 48 * Math.PI * 2, p = P(O, x + rad * Math.cos(an), FLOOR - 2, z + rad * Math.sin(an)); if (!p) { ok = false; break; } i ? g.lineTo(p.x, p.y) : g.moveTo(p.x, p.y); } if (ok) g.stroke(); g.restore(); }

// ---------- Ring-Bahn (Bildschirmkoordinaten, aus Posen gemischt) ----------
const ringW = (O, x, y, z, r) => { const p = P(O, x, y, z); return p ? { x: p.x, y: p.y, r: r * p.s, s: p.s } : { x: W / 2, y: -4000, r: 0, s: 0 }; };
const mixP = (a, b, u) => ({ x: lerp(a.x, b.x, u), y: lerp(a.y, b.y, u), r: lerp(a.r, b.r, u), rot: lerp(a.rot ?? 0, b.rot ?? 0, u), grey: lerp(a.grey ?? 0, b.grey ?? 0, u), alpha: lerp(a.alpha ?? 1, b.alpha ?? 1, u), glow: lerp(a.glow ?? 0, b.glow ?? 0, u), disc: lerp(a.disc ?? 0, b.disc ?? 0, u), s: lerp(a.s ?? 1, b.s ?? 1, u) });
const above = (c, r, dy = 0) => { const [x, z] = crate(c, r); return [x, FLOOR - CS - 92 + dy, z]; };
function hopPose(O, t, pts, times, dur, rad) {   // Ring springt von Punkt zu Punkt und landet auf times[k]
  let m = times.findIndex(tt => tt >= t); if (m < 0) m = times.length - 1;
  const u = prog(t, times[m] - dur, times[m]), a = m > 0 ? pts[m - 1] : [pts[0][0] - 120, pts[0][1] - 900, pts[0][2] - 200], b = pts[m], e = inOutCubic(u);
  const lp = m > 0 && t < times[m] ? m - 1 : m, land = Math.max(0, 1 - Math.abs(t - times[lp] - .05) / .09);
  const q = ringW(O, lerp(a[0], b[0], e), lerp(a[1], b[1], e) - (m > 0 ? 80 : 0) * Math.sin(Math.PI * u), lerp(a[2], b[2], e), rad); q.r *= 1 - .1 * land; return q;
}
const CPTS = Array.from({ length: NCOUNT }, (_, n) => above(...countCR(n))), CT = Array.from({ length: NCOUNT }, (_, n) => tc(n));
const SPTS = SAMPLE.map(([c, r]) => above(c, r)), STM = SAMPLE.map((_, k) => T.sample(k));
const heroineA = t => { const u = outExpo(prog(t, T.heroIn[0], T.heroIn[1])); return { x: lerp(-2700, 452, u), y: lerp(-260, -70, u), w: 840, rot: lerp(-.16, -.02, u), u }; };
const GAUGE = { x: 0, y: -10, R: 320 }, SEALC = [300, 0], LOGOS = .872, LOGOX = 410, LOGOY = 262;
const p99 = t => outExpo(prog(t, T.n99[0], T.n99[1]));
const flowX = t => { let x = 0; for (let i = 1; i < 4; i++) x += STX * inOutCubic(prog(t, T.st[i] - .42, T.st[i])); return x; };
const leaveT = i => i < 3 ? T.st[i + 1] - .62 : T.whip4[0] - .12;
const dock = (t, i) => outBack(prog(t, T.st[i], T.st[i] + .4), 1.2) * (1 - inCubic(prog(t, leaveT(i), leaveT(i) + .2)));
function ringAt(t) {
  if (t < OWN[0]) {            // 1 Zählen (grau)
    const q = hopPose(SET.WH1, t, CPTS, CT, .13, 62), d = outCubic(prog(t, T.tedious, T.tedious + .5));
    return { ...q, y: q.y + 26 * d * q.s, rot: Math.min(t, T.tedious + .3) * .8, grey: 1, alpha: 1 - .5 * d, glow: .5 * (1 - d) };
  }
  if (t < OWN[1]) {                          // 2 Heldin: Brust → schwebt → Bildmitte (Kamera fliegt durch)
    const h = heroineA(t), sc = P(SET.HERO, 0, 0, -160), [ex, ey, er] = emblem('heroine', h.x, h.y, h.w, t);
    const pe = ringW(SET.HERO, ex, ey, -160, er * 1.75), pulse = 1 + .12 * Math.sin(t * 7);
    const a = { ...pe, r: pe.r * pulse, rot: t * 1.4, glow: 1.2 }, b = { ...ringW(SET.HERO, 50, -330, 0, 78), rot: t * 1.4, glow: 1 }, c = { ...ringW(SET.HERO, 0, 0, 0, 104), rot: t * 1.4, glow: .8 };
    return mixP(mixP(a, b, inOutCubic(prog(t, T.title, T.title + .7))), c, inOutCubic(prog(t, w0(22) - .15, w0(22) + .4)));
  }
  const pSample = () => { const q = hopPose(SET.WH2, t, SPTS, STM, .2, 64), ctr = ringW(SET.WH2, 980, -300, 480, 110), bump = 1 + .45 * Math.max(0, 1 - Math.abs(t - T.extra - .08) / .22); const m = mixP({ ...q, rot: t * 1.2, glow: .8 }, { ...ctr, rot: t * 1.2, glow: 1.2 }, inOutCubic(prog(t, w0(31) - .1, w0(31) + .5))); m.r *= bump; return m; };
  const pGauge = () => { const th = -Math.PI / 2 + Math.PI * 2 * (1 - .99 * p99(t)); return { ...ringW(SET.STAT, GAUGE.x + GAUGE.R * Math.cos(th), GAUGE.y + GAUGE.R * Math.sin(th), 0, 56), rot: t * .9 + th, glow: 1 }; };
  const pFlow = () => { let d = 0; for (let i = 0; i < 4; i++) d = Math.max(d, dock(t, i)); const x = flowX(t), q = ringW(SET.FLOW, x, 0, 0, lerp(70, 205, d)); return { ...q, rot: x / 70 + t * .25, glow: .4 + .6 * d, disc: .615 }; };
  const pSeal = () => { const u = outBack(prog(t, T.whip4[1] - .18, T.whip4[1] + .42), 1.3); return { ...ringW(SET.SEAL, SEALC[0], SEALC[1], 0, lerp(70, 330, u)), rot: -3.2 * (1 - outCubic(prog(t, T.whip4[1] - .2, T.whip4[1] + 1.0))), glow: .7, disc: .66 }; };
  const pLogo = () => ({ x: LOGOX + LOGO.cx * LOGOS, y: LOGOY + LOGO.cy * LOGOS, r: LOGO.R * LOGOS, rot: 0, glow: .35 + .8 * Math.max(0, 1 - Math.abs(t - T.brand - .15) / .5), disc: 0, s: 1 });
  if (t < T.whip2[0]) return pSample();
  if (t < T.whip3[0]) return mixP(pSample(), pGauge(), whip(prog(t, T.whip2[0], T.whip2[1])));
  if (t < T.whip4[0]) return mixP(pGauge(), pFlow(), whip(prog(t, T.whip3[0], T.whip3[1])));
  if (t < T.logo[0]) return mixP(pFlow(), pSeal(), whip(prog(t, T.whip4[0], T.whip4[1])));
  return mixP(pSeal(), pLogo(), inOutCubic(prog(t, T.logo[0], T.logo[1])));
}
function drawRing(t) { const r = ringAt(t); if (r.r > 0 && r.r < 4000) mark(r.x, r.y, r.r, r.rot, r); return r; }
const mid = a => (a[0] + a[1]) / 2, OWN = [mid(T.whip1), T.push[0] + .5, mid(T.whip2), mid(T.whip3), mid(T.whip4)];
const HUDX = t => -2600 * whip(prog(t, T.whip1[0], T.whip1[1])), HUDY = t => 1600 * whip(prog(t, T.whip2[0], T.whip2[1]));

// ---------- Szenen ----------
const LX = 130;
function sceneWH1(t) {
  if (t > T.whip1[1]) return;
  const dimAll = .35 * prog(t, T.tedious, T.tedious + .6);
  warehouse(t, SET.WH1, i => {
    const c = i % COLS, r = Math.floor(i / COLS); let n = -1; for (let k = 0; k < NCOUNT; k++) { const [cc, rr] = countCR(k); if (cc === c && rr === r) n = k; }
    if (n < 0) return { dim: dimAll }; const u = prog(t, tc(n), tc(n) + .18);
    return { tint: hex(C.blue), mix: .5 * u * (1 - dimAll), check: u * 1.2, dim: dimAll * .6 };
  });
  if (t < OWN[0]) drawRing(t);
  // Rolltor
  const sd = prog(t, T.shutter[0], T.shutter[1]), drop = sd < .86 ? inCubic(sd / .86) : 1 - .035 * Math.sin((sd - .86) / .14 * Math.PI);
  if (sd > 0) {
    const zs = -620, top = -1300, bot = lerp(top, FLOOR, drop), SL = 58;
    for (let y = bot - SL; y > top - SL; y -= SL) { const a = P(SET.WH1, -1900, y, zs), b = P(SET.WH1, 1900, y, zs), c = P(SET.WH1, 1900, y + SL, zs), d = P(SET.WH1, -1900, y + SL, zs); if (!a || !b || !c || !d) continue; const gy = g.createLinearGradient(0, a.y, 0, d.y); gy.addColorStop(0, '#2C3A52'); gy.addColorStop(.75, '#1A2538'); gy.addColorStop(1, '#0D1420'); poly([a, b, c, d], gy); }
    const a = P(SET.WH1, -1900, bot - 26, zs), b = P(SET.WH1, 1900, bot - 26, zs), c = P(SET.WH1, 1900, bot, zs), d = P(SET.WH1, -1900, bot, zs); if (a && b && c && d) poly([a, b, c, d], C.orange);
    onPlane(SET.WH1, 0, bot - 330, zs, () => { const u = outBack(prog(t, w0(12) - .05, w0(12) + .35)); if (u <= 0) return; g.save(); g.globalAlpha *= clamp(u); g.scale(.92 + .08 * u, .92 + .08 * u); g.strokeStyle = C.orange; g.lineWidth = 8; g.beginPath(); g.roundRect(-330, -105, 660, 190, 14); g.stroke(); g.font = font(150, 800); g.letterSpacing = '22px'; g.textAlign = 'center'; g.fillStyle = C.orange; g.fillText('CLOSED', 11, 50); g.restore(); });
  }
  // Kinetic Type (HUD)
  g.save(); g.translate(HUDX(t), 0);
  const sh = g.createLinearGradient(0, 0, 0, 560); sh.addColorStop(0, 'rgba(2,4,9,.78)'); sh.addColorStop(1, 'rgba(2,4,9,0)'); g.fillStyle = sh; g.fillRect(-200, 0, W + 2800, 600);
  const o1 = T.tedious - .34;
  kline(t, LX, 160, 60, [['Taking', w0(0)], ['inventory', w0(1)], ['means', w0(2)]], { w: 400, fill: '#C9CED6', out: o1 });
  kline(t, LX, 288, 136, [['counting', w0(3)], ['every', w0(4)]], { w: 800, out: o1 + .04 });
  kline(t, LX, 420, 136, [['single', w0(5)], ['item.', w0(6)]], { w: 800, out: o1 + .08 });
  const n = clamp(Math.floor((Math.min(t, T.tedious) - T.countStart) / T.countStep) + 1, 0, NCOUNT);
  g.save(); g.globalAlpha = prog(t, .5, .9) * (1 - prog(t, T.shutter[1] - .5, T.shutter[1])); g.font = font(34, 600); g.letterSpacing = '5px'; g.textAlign = 'right'; g.fillStyle = t > T.tedious ? C.orange : C.grey;
  g.fillText(`COUNTED  ${String(n).padStart(2, '0')} / ${NB}`, W - LX, 170); g.restore();
  kw('Tedious.', LX - 6, 310, t, T.tedious, { size: 190, w: 800, fill: C.orange, shadow: 1 });
  kline(t, LX, 410, 66, [['Often', w0(8)], ['with', w0(9)], ['the', w0(10)], ['warehouse', w0(11)], ['closed.', w0(12), { w: 800 }]], { w: 400, shadow: 1 });
  g.restore();
}
function sceneHERO(t) {
  if (t < T.whip1[0] || t > T.push[1]) return;
  const h = heroineA(t), v = (heroineA(t + .01).x - h.x) / .01;
  // Comic-Lichtkreis + Stoßringe hinter der Heldin
  onPlane(SET.HERO, 452, -70, 200, () => { const a = prog(t, T.heroIn[0] + .3, T.heroIn[1]); g.save(); g.globalCompositeOperation = 'lighter'; const gl = g.createRadialGradient(0, 0, 0, 0, 0, 620); gl.addColorStop(0, `rgba(65,182,230,${.30 * a})`); gl.addColorStop(1, 'rgba(65,182,230,0)'); g.fillStyle = gl; g.beginPath(); g.arc(0, 0, 620, 0, 7); g.fill(); for (let k = 0; k < 3; k++) { const u = prog(t, T.heroIn[0] + .42 + k * .12, T.heroIn[0] + 1.3 + k * .12); if (u > 0 && u < 1) { g.strokeStyle = `rgba(160,220,255,${.5 * (1 - u)})`; g.lineWidth = 5; g.beginPath(); g.arc(0, 0, 120 + 620 * outCubic(u), 0, 7); g.stroke(); } } g.restore(); });
  onPlane(SET.HERO, 0, 0, -160, () => {
    if (v > 300) { g.save(); const r = rng(5); for (let k = 0; k < 9; k++) { const y = h.y - 190 + r() * 380, L = Math.min(1500, v * (.05 + r() * .06)), x0 = h.x - 250 - r() * 150; const lg = g.createLinearGradient(x0 - L, 0, x0, 0); lg.addColorStop(0, 'rgba(255,255,255,0)'); lg.addColorStop(1, `rgba(255,255,255,${Math.min(.55, v / 6000)})`); g.strokeStyle = lg; g.lineWidth = 3 + r() * 5; g.beginPath(); g.moveTo(x0 - L, y); g.lineTo(x0, y); g.stroke(); } g.restore(); }
    hero('heroine', h.x, h.y, h.w, t, { rot: h.rot });
  });
  onPlane(SET.HERO, 0, 0, 0, () => {
    const X = LX - W / 2, o = T.title - .18;
    kline(t, X, -100, 64, [['There', w0(13)], ['is', w0(14)], ['a', w0(15)]], { w: 400, fill: '#C9CED6', out: o });
    kline(t, X, 62, 160, [['better', w0(16)], ['way.', w0(17)]], { w: 800, fill: [C.blue, RING[3][0]], out: o + .05 });
    kw('With', X, -190, t, w0(18), { size: 54, w: 400, fill: C.grey });
    kw('Inventory', X - 6, -40, t, w0(19), { size: 160, w: 800 });
    kw('Sampling', X - 6, 110, t, w0(20), { size: 160, w: 800, fill: [RING[5][0], RING[0][0], RING[3][0]] });
    kline(t, X, 200, 56, [['from', w0(21), { w: 400, fill: C.grey }], ['REMIRA', w0(22), { w: 800, track: 6 }]], {});
  });
  if (t >= OWN[0] && t < OWN[1]) drawRing(t);
}
function sceneWH2(t) {
  if (t < T.push[0] + .2 || t > T.whip2[1]) return;
  const A = prog(t, T.push[0] + .34, T.push[1] - .16);
  warehouse(t, SET.WH2, i => {
    const c = i % COLS, r = Math.floor(i / COLS), k = SAMPLE.findIndex(([sc, sr]) => sc === c && sr === r), focus = prog(t, T.sample(0) - .2, T.sample(0) + .3);
    if (k >= 0) { const u = prog(t, T.sample(k), T.sample(k) + .22); return { tint: hex(RING[k][1]), mix: .92 * outCubic(u), check: u * 1.1, checkCol: '#05080F', beam: u * (.55 + .45 * (1 - prog(t, T.extra + .4, T.extra + 1.4))) }; }
    const [nk, d] = NEAR[i], tw = T.extra + .1 + d * .15, u = prog(t, tw, tw + .3);
    return { tint: hex(RING[nk][0]), mix: .5 * outCubic(u), check: prog(t, tw + .08, tw + .4), dim: .42 * focus * (1 - u) };
  }, A);
  SAMPLE.forEach(([c, r], k) => { const [x, z] = crate(c, r); const u = prog(t, T.sample(k), T.sample(k) + .6); if (u > 0 && u < 1) floorRing(SET.WH2, x, z, 60 + 170 * outCubic(u), RING[k][1], 1 - u, 4); for (let j = 0; j < 2; j++) { const w = prog(t, T.extra + .1 + j * .3, T.extra + 1.7 + j * .3); if (w > 0 && w < 1) floorRing(SET.WH2, x, z, 40 + 1300 * w, RING[k][0], .55 * (1 - w), 3); } });
  if (t >= OWN[1] && t < OWN[2]) drawRing(t);
  g.save(); g.translate(0, HUDY(t));
  const sh = g.createLinearGradient(0, 0, 0, 520); sh.addColorStop(0, 'rgba(2,4,9,.8)'); sh.addColorStop(1, 'rgba(2,4,9,0)'); g.fillStyle = sh; g.fillRect(0, -1700, W, 2220);
  const o = w0(30) - .2;
  kline(t, LX, 170, 56, [['You', w0(23)], ['count', w0(24)], ['just', w0(25)], ['a', w0(26)]], { w: 400, fill: '#C9CED6', out: o });
  kline(t, LX, 290, 120, [['small', w0(27)], ['random', w0(28), { fill: [RING[0][0], RING[5][0], RING[3][0]] }], ['sample.', w0(29), { fill: [RING[2][0], RING[4][0], RING[1][0]] }]], { w: 800, out: o + .05, shadow: 1 });
  kline(t, LX, 170, 56, [['The', w0(30)], ['software', w0(31)]], { w: 400, fill: '#C9CED6' });
  kline(t, LX, 290, 120, [['extrapolates', w0(32), { fill: [RING[0][0], RING[3][0]] }], ['the', w0(33)], ['rest.', w0(34)]], { w: 800, shadow: 1 });
  g.restore();
}
function tnum(s, cx, y, cell) { g.textAlign = 'center'; [...s].forEach((ch, i) => g.fillText(ch, cx + (i - (s.length - 1) / 2) * cell, y)); }
function sceneSTAT(t) {
  if (t < T.whip2[0] || t > T.whip3[1]) return;
  const p = p99(t), hit = Math.max(0, 1 - Math.abs(t - T.n99[1] + .12) / .3);
  onPlane(SET.STAT, GAUGE.x, GAUGE.y, 0, () => {
    const R = GAUGE.R; g.save(); g.scale(1 + .035 * hit, 1 + .035 * hit);
    g.lineWidth = 22; g.strokeStyle = '#18202E'; g.beginPath(); g.arc(0, 0, R, 0, 7); g.stroke();
    g.lineWidth = 2; g.strokeStyle = 'rgba(255,255,255,.10)'; g.beginPath(); g.arc(0, 0, R + 44, 0, 7); g.stroke();
    for (let k = 0; k < 100; k++) { const an = -Math.PI / 2 + k / 100 * Math.PI * 2; g.strokeStyle = `rgba(255,255,255,${k % 10 ? .10 : .32})`; g.lineWidth = 2; g.beginPath(); g.moveTo((R + 30) * Math.cos(an), (R + 30) * Math.sin(an)); g.lineTo((R + (k % 10 ? 40 : 46)) * Math.cos(an), (R + (k % 10 ? 40 : 46)) * Math.sin(an)); g.stroke(); }
    const cg = g.createConicGradient(-Math.PI / 2, 0, 0); [0, 1, 2, 3, 4, 5, 0].forEach((ci, i) => cg.addColorStop(i / 6, RING[ci][1]));
    g.save(); g.globalAlpha *= .16; g.lineWidth = 22; g.strokeStyle = cg; g.beginPath(); g.arc(0, 0, R, 0, 7); g.stroke(); g.restore();
    g.save(); g.shadowColor = 'rgba(80,170,255,.6)'; g.shadowBlur = 30 * fsc; g.lineWidth = 22; g.lineCap = 'round'; g.strokeStyle = cg; g.beginPath(); g.arc(0, 0, R, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * (1 - .99 * p) + .0001); g.stroke(); g.restore();
    g.restore();
    kline(t, 0, -128, 52, [['up', w0(35)], ['to', w0(36)]], { w: 400, fill: C.grey, align: 'center' });
    const a = outCubic(prog(t, T.n99[0] - .1, T.n99[0] + .2)); if (a > 0) { g.save(); g.globalAlpha *= a; g.scale(1 + .05 * hit, 1 + .05 * hit); g.font = font(270, 800); g.fillStyle = '#fff'; g.shadowColor = `rgba(120,200,255,${.25 + .5 * hit})`; g.shadowBlur = 50 * fsc; tnum(String(Math.round(99 * p)).padStart(2, '0'), -62, 96, 132); g.font = font(130, 600); g.fillStyle = C.blue; g.textAlign = 'left'; g.globalAlpha *= .35 + .65 * prog(t, w0(38) - .1, w0(38) + .15); g.fillText('%', 82, 92); g.restore(); }
    kline(t, 0, R + 132, 66, [['less', w0(39), { w: 800 }], ['counting', w0(40)], ['effort', w0(41)]], { w: 400, align: 'center' });
  });
  if (t >= OWN[2] && t < OWN[3]) drawRing(t);
}
function icon(kind, a, t, t0) {   // weiße Linien-Icons, ±58 px
  g.save(); g.globalAlpha *= a; g.strokeStyle = '#fff'; g.fillStyle = '#fff'; g.lineWidth = 6; g.lineCap = 'round'; g.lineJoin = 'round'; const d = prog(t, t0, t0 + .5);
  if (kind === 0) { for (const dy of [-30, 0, 30]) { g.beginPath(); g.ellipse(0, dy, 40, 13, 0, 0, 7); g.stroke(); } g.beginPath(); g.moveTo(-40, -30); g.lineTo(-40, 30); g.moveTo(40, -30); g.lineTo(40, 30); g.stroke(); }
  if (kind === 1) { g.beginPath(); g.roundRect(-38, -50, 76, 100, 8); g.stroke(); [-24, 0, 24].forEach((dy, i) => { const u = prog(d, i * .25, i * .25 + .5); g.beginPath(); g.rect(-24, dy - 6, 12, 12); g.stroke(); if (u > 0) { g.beginPath(); g.moveTo(-2, dy); g.lineTo(-2 + 26 * u, dy); g.stroke(); } }); }
  if (kind === 2) { g.beginPath(); g.moveTo(0, -52); g.lineTo(46, -26); g.lineTo(46, 26); g.lineTo(0, 52); g.lineTo(-46, 26); g.lineTo(-46, -26); g.closePath(); g.moveTo(-46, -26); g.lineTo(0, 0); g.lineTo(46, -26); g.moveTo(0, 0); g.lineTo(0, 52); g.stroke(); g.restore(); g.save(); g.globalAlpha *= a; check([[10, 18], [22, 32], [42, 4]], d * 1.3, RING[3][0], 7); }
  if (kind === 3) { g.beginPath(); g.moveTo(-36, -50); g.lineTo(16, -50); g.lineTo(36, -30); g.lineTo(36, 50); g.lineTo(-36, 50); g.closePath(); g.moveTo(16, -50); g.lineTo(16, -30); g.lineTo(36, -30); g.stroke(); g.font = font(30, 800); g.textAlign = 'center'; g.fillText('PDF', 0, 26); g.beginPath(); g.moveTo(-20, -14); g.lineTo(-20 + 30 * d, -14); g.stroke(); }
  g.restore();
}
const STCOL = [5, 0, 2, 3];
function sceneFLOW(t) {
  if (t < T.whip3[0] || t > T.whip4[1]) return;
  const O = SET.FLOW, rx = flowX(t);
  onPlane(O, 0, 0, 0, () => {
    g.lineCap = 'round';
    for (let i = 0; i < 3; i++) { const x0 = STX * i + 132, x1 = STX * (i + 1) - 132; g.strokeStyle = 'rgba(255,255,255,.14)'; g.lineWidth = 4; g.setLineDash([2, 16]); g.beginPath(); g.moveTo(x0, 0); g.lineTo(x1, 0); g.stroke(); g.setLineDash([]); const u = clamp((rx - x0) / (x1 - x0)); if (u > 0) { g.strokeStyle = grad(x0, 0, x1, 0, [RING[STCOL[i]][1], RING[STCOL[i + 1]][1]]); g.lineWidth = 7; g.beginPath(); g.moveTo(x0, 0); g.lineTo(lerp(x0, x1, u), 0); g.stroke(); } }
    // ERP-Daten fließen in Station 0
    const fa = prog(t, T.whip3[1] - .1, T.st[0]) * (1 - prog(t, T.st[1] - .6, T.st[1])); if (fa > 0) for (let k = 0; k < 15; k++) { const u = ((t * .9 + k / 15) % 1 + 1) % 1, y = [-46, 0, 46][k % 3] * (1 - u * .7); g.globalAlpha = fa * Math.sin(Math.PI * u) * .9; g.fillStyle = k % 2 ? C.blue : '#fff'; g.beginPath(); g.roundRect(-560 + 410 * u, y - 4, 22, 8, 4); g.fill(); } g.globalAlpha = 1;
  });
  if (t >= OWN[3] && t < OWN[4]) drawRing(t);
  const LBL = [[['ERP', w0(43), { w: 800 }], ['data', w0(44), { w: 800 }]], [['Count', w0(47), { w: 800 }], ['lists', w0(48), { w: 800 }]], [['You', w0(51), { w: 800 }], ['count', w0(52), { w: 800 }]], [['Report', w0(55), { w: 800 }]]];
  const SUB = [[['flows', w0(45)], ['in', w0(46)]], [['come', w0(49)], ['out', w0(50)]], [], [['for', w0(56)], ['your', w0(57)], ['auditor', w0(58)]]];
  for (let i = 0; i < 4; i++) onPlane(O, STX * i, 0, 0, () => {
    const vis = prog(t, T.st[i] - .1, T.st[i] + .2), d = dock(t, i), col = RING[STCOL[i]][1];
    g.fillStyle = '#070B14'; g.beginPath(); g.arc(0, 0, 124, 0, 7); g.fill();
    g.lineWidth = 4; g.strokeStyle = vis > 0 ? col : 'rgba(255,255,255,.22)'; g.globalAlpha = vis > 0 ? .35 + .65 * (1 - clamp(d)) : 1; g.beginPath(); g.arc(0, 0, 124, 0, 7); g.stroke(); g.globalAlpha = 1;
    g.save(); g.scale(1.15, 1.15); icon(i, .28 + .72 * vis, t, T.st[i]); g.restore();
    kline(t, 0, 296, 60, LBL[i], { align: 'center' }); if (SUB[i].length) kline(t, 0, 352, 40, SUB[i], { w: 400, fill: C.grey, align: 'center' });
    if (i === 3) { const u = outBack(prog(t, w0(60) - .05, w0(60) + .35)); if (u > 0) { g.save(); g.translate(0, 418); g.scale(u, u); g.globalAlpha = clamp(u); g.fillStyle = RING[3][1]; g.beginPath(); g.roundRect(-92, -30, 184, 60, 30); g.fill(); g.font = font(34, 800); g.textAlign = 'center'; g.fillStyle = '#05080F'; g.fillText('ready', 14, 11); g.restore(); g.save(); g.translate(0, 418); g.globalAlpha = clamp(u); check([[-62, 0], [-52, 10], [-36, -10]], u, '#05080F', 6); g.restore(); } }
  });
  g.save(); g.globalAlpha = prog(t, T.whip3[1] - .15, T.whip3[1] + .2) * (1 - prog(t, T.whip4[0], T.whip4[0] + .2)); g.font = font(30, 600); g.letterSpacing = '8px'; g.fillStyle = C.grey; g.fillText('HOW IT WORKS', LX, 120); g.restore();
}
const heroB = t => { const u = inOutCubic(prog(t, T.logo[0], T.logo[1])), up = outBack(prog(t, T.whip4[1] - .22, T.whip4[1] + .62), 1.1); return { x: lerp(-570, -800, u), y: lerp(40, 120, u) + 1500 * (1 - up), w: lerp(700, 430, u) }; };
const heroineB = t => { const u = outExpo(prog(t, T.logo[0] + .35, T.logo[0] + 1.3)); return { x: lerp(2500, 650, u), y: lerp(-760, -300, u), w: 640, rot: lerp(.2, .03, u), u }; };
function sceneSEAL(t) {
  if (t < T.whip4[0]) return;
  const O = SET.SEAL, lg = prog(t, T.logo[0], T.logo[1]);
  const hb = heroB(t);
  onPlane(O, hb.x + 60, hb.y - 60, 300, () => { g.save(); g.globalCompositeOperation = 'lighter'; const gl = g.createRadialGradient(0, 0, 0, 0, 0, 640); gl.addColorStop(0, 'rgba(65,182,230,.20)'); gl.addColorStop(1, 'rgba(65,182,230,0)'); g.fillStyle = gl; g.beginPath(); g.arc(0, 0, 640, 0, 7); g.fill(); g.restore(); });
  onPlane(O, 0, 0, 0, () => { hero('hero', hb.x, hb.y, hb.w, t, { ph: 1 }); const h2 = heroineB(t); if (h2.u > 0) { const v = Math.abs(heroineB(t + .01).x - h2.x) / .01; if (v > 300) { g.save(); const r = rng(9); for (let k = 0; k < 7; k++) { const y = h2.y - 120 + r() * 240, L = Math.min(1200, v * (.05 + r() * .05)), x0 = h2.x + 160 + r() * 120; const lgd = g.createLinearGradient(x0 + L, 0, x0, 0); lgd.addColorStop(0, 'rgba(255,255,255,0)'); lgd.addColorStop(1, `rgba(255,255,255,${Math.min(.5, v / 6000)})`); g.strokeStyle = lgd; g.lineWidth = 3 + r() * 4; g.beginPath(); g.moveTo(x0 + L, y); g.lineTo(x0, y); g.stroke(); } g.restore(); } hero('heroine', h2.x, h2.y, h2.w, t, { flip: 1, rot: h2.rot, ph: 2 }); } });
  const r = t >= OWN[4] ? drawRing(t) : { r: 0 };
  // Siegel: dunkle Scheibe im Ring + Text
  const dr = r.r * (r.disc ?? 0); if (dr > 2) { g.save(); g.translate(r.x, r.y); g.fillStyle = '#060A12'; g.beginPath(); g.arc(0, 0, dr, 0, 7); g.fill(); g.strokeStyle = `rgba(255,255,255,${.22 * (1 - lg)})`; g.lineWidth = 2; g.beginPath(); g.arc(0, 0, dr * .91, 0, 7); g.stroke(); const k = r.r / 330, ko = fsc; g.scale(k, k); fsc = scale * k; g.globalAlpha = 1 - prog(t, T.logo[0], T.logo[0] + .22);
    kline(t, 0, -92, 36, [['CERTIFIED', w0(61)], ['BY', w0(62)]], { w: 600, fill: C.grey, track: 7, align: 'center' });
    kw('PwC', 0, 62, t, T.pwc, { size: 178, w: 800, align: 'center' });
    kw('IDW PS 880', 0, 128, t, T.pwc + .32, { size: 44, w: 600, fill: '#DDE3EC', track: 3, align: 'center' });
    fsc = ko; g.restore(); }
  // Logo-Moment (Bildschirm-Ebene): CTA, dann Wortmarke aus dem Original-SVG
  kline(t, W / 2, 668, 58, [['Start', w0(64)], ['with', w0(65)], ['a', w0(66)]], { w: 400, fill: '#C9CED6', align: 'center' });
  const pu = outBack(prog(t, T.pill - .1, T.pill + .35), 1.4); if (pu > 0) { g.save(); g.translate(W / 2, 782); g.scale(.6 + .4 * pu, .6 + .4 * pu); g.globalAlpha = clamp(pu * 1.5); g.shadowColor = 'rgba(65,182,230,.55)'; g.shadowBlur = 44 * scale; g.fillStyle = grad(-390, 0, 390, 0, [C.blue, '#7FD0F0']); g.beginPath(); g.roundRect(-390, -64, 780, 128, 64); g.fill(); g.shadowColor = 'transparent'; kline(t, 0, 21, 62, [['Free', w0(67)], ['data', w0(68)], ['analysis', w0(69)]], { w: 800, fill: '#03070D', align: 'center', wFrom: 700 }); g.restore(); }
  g.save(); g.translate(LOGOX, LOGOY); g.scale(LOGOS, LOGOS); g.fillStyle = '#fff';
  LOGO.letters.forEach((d, i) => { const u = outCubic(prog(t, T.brand - .08 + i * .055, T.brand + .3 + i * .055)); if (u <= 0) return; g.save(); g.globalAlpha = u; g.translate(-70 * (1 - u), 0); g.fill(d); g.restore(); });
  g.globalAlpha = prog(t, T.brand + .55, T.brand + 1.0); if (g.globalAlpha > 0) LOGO.claim.forEach(d => g.fill(d));
  g.restore();
}

// ---------- Frame ----------
function drawScene(t) {
  cam = camAt(t); fsc = scale;
  g.setTransform(canvas.width / W, 0, 0, canvas.height / H, 0, 0); g.filter = 'none'; g.globalAlpha = 1; g.globalCompositeOperation = 'source-over'; g.shadowColor = 'transparent'; g.letterSpacing = '0px';
  world(t);
  for (const s of [sceneWH1, sceneHERO, sceneWH2, sceneSTAT, sceneFLOW, sceneSEAL]) { g.save(); s(t); g.restore(); }
}
// Wie schnell bewegt sich das Bild? → Anzahl Sub-Frames für Motion Blur
const SHUTTER = .6;
function speed(t) {
  const pr = tt => { const c = camAt(tt), o = [c.cx, c.cy, c.cz], pts = [[0, 0, 0], [800, 0, 0], [-800, 300, 0], [0, 200, 700]].map(d => proj(c, o[0] + d[0], o[1] + d[1], o[2] + d[2])); cam = c; const r = ringAt(tt); return [...pts.map(p => p ? [p.x, p.y] : null), [r.x, r.y], [heroineA(tt).x * .9, 0], [heroineB(tt).x, heroB(tt).y], [HUDX(tt), HUDY(tt)]]; };
  const a = pr(t), b = pr(t + SHUTTER / FPS); let m = 0; a.forEach((p, i) => { if (!p || !b[i]) m = 400; else m = Math.max(m, Math.hypot(p[0] - b[i][0], p[1] - b[i][1])); }); return m;
}
const grainCv = new OffscreenCanvas(256, 256); { const c = grainCv.getContext('2d'), id = c.createImageData(256, 256), r = rng(3); for (let i = 0; i < id.data.length; i += 4) { const v = r() * 255; id.data[i] = id.data[i + 1] = id.data[i + 2] = v; id.data[i + 3] = 13; } c.putImageData(id, 0, 0); }
window.renderFrame = async t => {
  const n = clamp(Math.round(speed(t) / 7), 1, 16);
  out.setTransform(1, 0, 0, 1, 0, 0); out.globalCompositeOperation = 'source-over';
  for (let k = 0; k < n; k++) { drawScene(t + (n === 1 ? 0 : (k + .5) / n * SHUTTER / FPS)); out.globalAlpha = 1 / (k + 1); out.drawImage(scn, 0, 0); }
  out.globalAlpha = 1; out.setTransform(canvas.width / W, 0, 0, canvas.height / H, 0, 0);
  const vg = out.createRadialGradient(W / 2, H / 2, H * .45, W / 2, H / 2, W * .72); vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(0,0,0,.5)'); out.fillStyle = vg; out.fillRect(0, 0, W, H);
  const f = 1 - prog(t, 0, .22) + prog(t, DURATION - .5, DURATION - .05); if (f > 0) { out.globalAlpha = clamp(f); out.fillStyle = '#000'; out.fillRect(0, 0, W, H); out.globalAlpha = 1; }
  out.save(); const pat = out.createPattern(grainCv, 'repeat'), o = Math.floor(t * 30) % 7 * 37; out.translate(o, o * .7); out.fillStyle = pat; out.globalCompositeOperation = 'overlay'; out.fillRect(-o, -o, W + 300, H + 300); out.restore();
};
window.grab = (type, quality = .93) => canvas.toDataURL(type, quality);
window.__ready = true;
