// REMIRA-Glossar „POS (Point of Sale)“ als Motion-Video (v1, 25.11.2026, Technik aus dem WWS-Video). Alles Vektor in Canvas; jedes Bild hängt nur von t ab (timeline.js).
import { VARIANT, A_SHIFT, REMIRA_INK } from './data.js';
import { S, plain } from './texte.js';
import { W, H, FPS, DURATION, RINGC, BLUE, GREEN, RED, ORANGE, GREY, SOFT, SC, ORDER, LOGO_W, LOGO_S, LOGO_X, LOGO_Y, CLAIM, END_TITLE_Y, END_CTA_Y, HK, PL, SY, PR, HW, TP, GN } from './data.js';
import { T, TX, WHIPS, camAt, ringAt, spinAt, heroAt, sceneIndex } from './timeline.js';
import { phosphorPath } from './phosphor-icons.js';
import { phosphorPathBold } from './phosphor-icons-bold.js';
import { prog, clamp, lerp, outCubic, inCubic, outBack, inOutCubic, rng } from './lib/ease.js';

const scale = Number(new URLSearchParams(location.search).get('scale')) || 1;
const BUG = new URLSearchParams(location.search).get('bug') || 'logo';
// v6: Headlines der Szenen 50 px tiefer, damit oben rechts Platz für das Logo ist (Referenz: frühere REMIRA-Videos)
const TOP = 50, LOGO_BUG = { w: 290, margin: 44, top: 40 };   // v7: Logo 290 px breit (≈ 53 px hoch), 44 px vom rechten, 40 px vom oberen Rand
const canvas = document.getElementById('c');
canvas.width = Math.max(2, 2 * Math.round(W * scale / 2)); canvas.height = Math.max(2, 2 * Math.round(H * scale / 2));
const out = canvas.getContext('2d');
const scn = new OffscreenCanvas(canvas.width, canvas.height);
let g = scn.getContext('2d');
const sceneCtx = g, lay = new OffscreenCanvas(canvas.width, canvas.height), layCtx = lay.getContext('2d');

// ---------- Assets ----------
const FONT = '"Source Sans 3"';
{ const f = new FontFace('Source Sans 3', 'url(../assets/fonts/SourceSans3/SourceSans3-wght-latin.woff2)', { weight: '200 900' }); await f.load(); document.fonts.add(f); await document.fonts.ready; }
const font = (px, w = 700) => `${w} ${px}px ${FONT}`;
// Original-Logo lesen: 6 Ring-Blätter mit Verläufen + weißer Schriftzug (cls-1)
const LOGO = { petals: [], word: [] };
{
  const txt = await (await fetch('../assets/brand/remira-logo-claim-white.svg')).text();
  const doc = new DOMParser().parseFromString(txt, 'image/svg+xml'), grads = {}, cls = {};
  doc.querySelectorAll('radialGradient').forEach(e => { grads[e.id] = { cx: +e.getAttribute('cx'), cy: +e.getAttribute('cy'), r: +e.getAttribute('r'), stops: [...e.querySelectorAll('stop')].map(s => [+s.getAttribute('offset'), s.getAttribute('stop-color')]) }; });
  for (const m of txt.matchAll(/\.(cls-\d)\{fill:url\(#([^)]+)\)/g)) cls[m[1]] = grads[m[2]];
  const ps = [...doc.querySelectorAll('path')].map(p => ({ c: p.getAttribute('class'), d: new Path2D(p.getAttribute('d')) }));
  for (const c of ['cls-2', 'cls-3', 'cls-6', 'cls-4', 'cls-5', 'cls-7']) {
    const p = ps.find(q => q.c === c), gr = cls[c], grad = g.createRadialGradient(gr.cx, gr.cy, 0, gr.cx, gr.cy, gr.r);
    gr.stops.forEach(([o, col]) => grad.addColorStop(o, col)); LOGO.petals.push({ d: p.d, grad });
  }
  // nur „REMIRA“ (obere Zeile); der Claim wird durch „Order Management System“ ersetzt
  LOGO.word = [...doc.querySelectorAll('path')].filter(e => e.getAttribute('class') === 'cls-1' && +e.getAttribute('d').match(/^M[\d.]+,([\d.]+)/)[1] < 200).map(e => new Path2D(e.getAttribute('d')));
}
const LOGO_W_IMG = await createImageBitmap(await (await fetch('../assets/brand/REMIRA_Logo_white.png')).blob());
const HERO = await createImageBitmap(await (await fetch('../assets/brand/remira-heldin-freigestellt.png')).blob());

// ---------- Icons: Original-Phosphor-Icons (MIT), Gewicht light (schmal wie bei REMIRA, Marketing 23.11.), siehe Skill remira-phosphor-icons ----------
const ICON = new Proxy({}, { get: (c, n) => c[n] || (c[n] = phosphorPath(n)) });
// Kleine Symbole auf farbigen Plaketten (Häkchen, Kreuz, Chips) bleiben bold, sonst wirken sie zu dünn (Marketing 24.11.)
const BOLD = new Proxy({}, { get: (c, n) => c[n] || (c[n] = phosphorPathBold(n)) });
// Phosphor-Icons sind Flächen (keine Striche): Einblenden per Pop (Skalierung + Deckkraft) und weicher Wischblende von links.
function drawIcon(icon, x, y, size, u, col) {
  if (u <= 0) return; size *= 1.12;   // etwas größer als der Kreis nahelegt, damit die schmalen light-Icons gut lesbar bleiben
  const e = outBack(clamp(u * 1.4), 1.6), a = clamp(u * 2.2), wipe = clamp(u * 1.6);
  g.save(); g.translate(x, y); g.scale(e, e); g.globalAlpha *= a;
  if (wipe < 1) { g.beginPath(); g.rect(-size / 2 - 2, -size / 2 - 2, (size + 4) * wipe, size + 4); g.clip(); }
  g.translate(-size / 2, -size / 2); g.scale(size / 256, size / 256); g.fillStyle = col; g.fill(icon); g.restore();
}

// ---------- Helfer ----------
const decay = (t, t0, d) => t < t0 ? 0 : Math.exp(-(t - t0) / d);
const bez = (p0, p1, p2, p3, u) => { const v = 1 - u; return [v * v * v * p0[0] + 3 * v * v * u * p1[0] + 3 * v * u * u * p2[0] + u * u * u * p3[0], v * v * v * p0[1] + 3 * v * v * u * p1[1] + 3 * v * u * u * p2[1] + u * u * u * p3[1]]; };
const curve = (c, n = 48) => Array.from({ length: n + 1 }, (_, i) => bez(...c, i / n));
function polyPart(pts, a, b) {
  a = clamp(a); b = clamp(b); if (b <= a) return false;
  const n = pts.length - 1, at = u => { const f = u * n, i = Math.min(n - 1, Math.floor(f)), q = f - i; return [lerp(pts[i][0], pts[i + 1][0], q), lerp(pts[i][1], pts[i + 1][1], q)]; };
  g.beginPath(); const s = at(a); g.moveTo(s[0], s[1]);
  for (let i = Math.ceil(a * n + 1e-6); i < b * n; i++) g.lineTo(pts[i][0], pts[i][1]);
  const e = at(b); g.lineTo(e[0], e[1]); return true;
}
const ptAt = (pts, u) => { const n = pts.length - 1, f = clamp(u) * n, i = Math.min(n - 1, Math.floor(f)), q = f - i; return [lerp(pts[i][0], pts[i + 1][0], q), lerp(pts[i][1], pts[i + 1][1], q)]; };
function dotted(pts, a, b, alpha, col = '#fff', lw = 2.4, gap = 9) { if (alpha <= 0) return; g.save(); g.globalAlpha *= alpha; g.strokeStyle = col; g.lineWidth = lw; g.lineCap = 'round'; g.setLineDash([.01, gap]); if (polyPart(pts, a, b)) g.stroke(); g.restore(); }
function glowDot(x, y, r, col, a = 1) { g.save(); g.globalAlpha *= a; const gr = g.createRadialGradient(x, y, 0, x, y, r * 3.2); gr.addColorStop(0, col); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.globalCompositeOperation = 'lighter'; g.globalAlpha *= .55; g.fillStyle = gr; g.beginPath(); g.arc(x, y, r * 3.2, 0, 7); g.fill(); g.restore(); g.save(); g.globalAlpha *= a; g.fillStyle = '#fff'; g.beginPath(); g.arc(x, y, r, 0, 7); g.fill(); g.restore(); }
function softGlow(x, y, r, col, a) { if (a <= 0) return; g.save(); g.globalCompositeOperation = 'lighter'; const gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, col.replace('A', a)); gr.addColorStop(1, col.replace('A', 0)); g.fillStyle = gr; g.beginPath(); g.arc(x, y, r, 0, 7); g.fill(); g.restore(); }

// Text: Zeilen mit \n, Akzent mit *…*. Wörter steigen gestaffelt ein. fade=true blendet am Ende aus (sonst trägt die Kamera den Text weg).
function text(str, x, y, px, t, t0, t1, o = {}) {
  if (t < t0) return 0;
  const { w = 700, col = '#fff', acc = BLUE, align = 'center', lh = px * 1.18, st = .045, fade = false, ls = 0 } = o;
  const outA = fade ? 1 - prog(t, t1 - .3, t1) : 1; if (outA <= 0) return 0;
  g.save(); const baseA = g.globalAlpha; g.font = font(px, w); g.textBaseline = 'middle'; g.textAlign = 'left'; if (ls) g.letterSpacing = ls + 'px';
  const space = g.measureText(' ').width; let idx = 0, maxW = 0;
  str.split('\n').forEach((line, li) => {
    const words = []; let accent = false;
    line.split(' ').forEach(wd => { const parts = wd.split('*'); let s = ''; const segs = []; parts.forEach((p, pi) => { if (pi) accent = !accent; if (p) segs.push([p, accent]); }); words.push(segs); });
    const widths = words.map(sg => sg.reduce((a, [p]) => a + g.measureText(p).width, 0)), tot = widths.reduce((a, b) => a + b, 0) + space * (words.length - 1);
    maxW = Math.max(maxW, tot);
    let cx = Math.round(align === 'center' ? x - tot / 2 : align === 'right' ? x - tot : x); const cy = Math.round(y + li * lh);   // stehender Text auf ganzen Pixeln
    words.forEach((sg, i) => {
      const u = outCubic(prog(t, t0 + idx * st, t0 + idx * st + .5)); idx++;
      if (u > 0) { g.globalAlpha = baseA * u * outA; let xx = Math.round(cx); for (const [p, a] of sg) { g.fillStyle = a ? acc : col; g.fillText(p, xx, cy + (u >= 1 ? 0 : (1 - u) * px * .35)); xx += g.measureText(p).width; } }
      cx += widths[i] + space;
    });
  });
  g.restore(); return maxW;
}
function glass(x, y, w, h, r, a = 1, stroke = 'rgba(255,255,255,.16)') {
  g.save(); g.globalAlpha *= a; g.beginPath(); g.roundRect(x - w / 2, y - h / 2, w, h, r);
  const gr = g.createLinearGradient(0, y - h / 2, 0, y + h / 2); gr.addColorStop(0, 'rgba(255,255,255,.09)'); gr.addColorStop(1, 'rgba(255,255,255,.035)');
  g.fillStyle = gr; g.fill(); g.strokeStyle = stroke; g.lineWidth = 1.6; g.stroke(); g.restore();
}
// Station: Glaskreis, Label; Icon später über dem Ring (postRing)
function station(x, y, r, tA, lit, R = null) {
  const u = outBack(prog(tNow, tA, tA + .5), 1.5); if (u <= 0) return;
  // Sitzt die Bildmarke (Ring) auf dem Kreis, verschwindet der Kreis dahinter; beim Weiterwandern kommt er als „erledigt“ zurück
  const vis = R ? clamp((Math.hypot(R.x - x, R.y - y) - R.r * .35) / (R.r * .55)) : 1; if (vis <= 0) return;
  g.save(); g.translate(x, y); g.scale(u, u); g.globalAlpha *= vis;
  g.beginPath(); g.arc(0, 0, r, 0, 7); g.fillStyle = lit > 0 ? `rgba(65,182,230,${.06 + .1 * lit})` : 'rgba(255,255,255,.06)'; g.fill();
  g.lineWidth = 2; g.strokeStyle = lit > 0 ? `rgba(65,182,230,${.3 + .7 * lit})` : 'rgba(255,255,255,.22)'; g.stroke();
  g.restore();
}
let tNow = 0;
// Blickführung (v4): Was gerade erklärt wird, ist hell; der Rest wird auf DIM abgedunkelt. dimAt = 1 → DIM ab t0 (weich, .4 s), zurück ab t1.
const DIM = .32;
const dimAt = (t, t0, t1 = 1e9) => 1 - (1 - DIM) * (prog(t, t0 - .2, t0 + .2) - prog(t, t1 - .2, t1 + .2));
function withA(a, fn) { if (a <= 0) return; g.save(); g.globalAlpha *= a; try { fn(); } finally { g.restore(); } }
// Optische Zeilenmitte: Mitte der Großbuchstaben (H) relativ zur y-Position bei textBaseline 'middle' – dort sitzen Badges, Häkchen und Bullets
function capMid(px, w = 700) { g.save(); g.font = font(px, w); g.textBaseline = 'middle'; const m = g.measureText('H'); g.restore(); return (m.actualBoundingBoxDescent - m.actualBoundingBoxAscent) / 2; }
// Linien-Kette: Segmente nur zwischen den Kreisen (Kreisrand + 6 px), blau gefüllt bis zur Bildmarke
function chain(xs, y, r, ringX, alpha, active) {
  for (let k = 0; k < xs.length - 1; k++) {
    const a = xs[k] + r + 6, b = xs[k + 1] - r - 6;
    dotted([[a, y], [b, y]], 0, 1, alpha * .35);
    if (active && ringX > a) { g.save(); g.strokeStyle = BLUE; g.lineWidth = 3; g.globalAlpha *= .9; g.lineCap = 'round'; g.beginPath(); g.moveTo(a, y); g.lineTo(Math.min(ringX, b), y); g.stroke(); g.restore(); }
  }
}
// Szene blendet vor ihrer Kamerafahrt ruhig aus (Text, Icons, Grafik), damit in der Fahrt nur die Bildmarke Blickfang ist
const sceneAlpha = (s, t) => { const i = ORDER.indexOf(s); return i < WHIPS.length ? 1 - prog(t, WHIPS[i][0] - .45, WHIPS[i][0] - .05) : 1; };
function layered(alpha, fn) {
  if (alpha >= 1) return fn(); if (alpha <= 0) return;
  layCtx.setTransform(1, 0, 0, 1, 0, 0); layCtx.clearRect(0, 0, lay.width, lay.height); layCtx.setTransform(sceneCtx.getTransform());
  g = layCtx; try { fn(); } finally { g = sceneCtx; }
  g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = alpha; g.drawImage(lay, 0, 0); g.restore();
}

// ---------- Ring ----------
function drawRing(t) {
  const R = ringAt(t), spin = spinAt(t), s = R.r / 160;
  // Leuchten hinter dem Ring
  softGlow(R.x, R.y, R.r * 2.4, `rgba(65,182,230,A)`, .22 * (1 - R.grey) * prog(t, .2, 1.2));
  LOGO.petals.forEach((p, k) => {
    const u = prog(t, T.petal(k), T.petal(k) + .8); if (u <= 0) return;
    const e = outBack(u, 1.3);
    g.save(); g.translate(R.x, R.y); g.rotate(spin - (1 - outCubic(u)) * 1.9); g.scale(s * e, s * e); g.translate(-159.5, -146); g.globalAlpha = clamp(u * 3);
    if (u < 1) { g.shadowColor = RINGC[k]; g.shadowBlur = 30 * scale * (1 - u); }
    g.fillStyle = p.grad; g.fill(p.d);
    if (R.grey > .01) { g.shadowColor = 'transparent'; g.fillStyle = `rgba(104,112,124,${.92 * R.grey})`; g.fill(p.d); }
    g.restore();
  });
}

// Icon ohne Animation (z. B. in Karten)
function drawIconAt(icon, x, y, size, col, a = 1) { g.save(); g.globalAlpha *= a; g.translate(x - size / 2, y - size / 2); g.scale(size / 256, size / 256); g.fillStyle = col; g.fill(icon); g.restore(); }

// ---------- Szenen (lokale Koordinaten, Ursprung = Szenenmitte) ----------
const L = (s, t) => { const r = ringAt(t); return { x: r.x - SC[s][0], y: r.y - SC[s][1], r: r.r }; };

// Karton (die „Ware“): Ringfarbe, Klebeband, weiche Kante
function carton(x, y, w, col, a = 1, rot = 0, sq = 1) {
  if (a <= 0) return; const h = w * .82;
  g.save(); g.translate(x, y); g.rotate(rot); g.scale(1, sq); g.globalAlpha *= a;
  const gr = g.createLinearGradient(0, -h / 2, 0, h / 2); gr.addColorStop(0, col); gr.addColorStop(1, shade(col, -.28));
  g.beginPath(); g.roundRect(-w / 2, -h / 2, w, h, w * .1); g.fillStyle = gr; g.fill();
  g.fillStyle = 'rgba(255,255,255,.28)'; g.fillRect(-w * .09, -h / 2, w * .18, h * .55);
  g.fillStyle = 'rgba(0,0,0,.14)'; g.fillRect(-w / 2 + w * .06, -h / 2 + h * .24, w - w * .12, 2);
  g.restore();
}
function shade(hex, f) { const n = parseInt(hex.slice(1), 16), c = [n >> 16, n >> 8 & 255, n & 255].map(v => Math.round(f < 0 ? v * (1 + f) : v + (255 - v) * f)); return `rgb(${c})`; }
// Regal: Böden + Seitenpfosten, baut sich von links auf
function shelf(sh, u) {
  if (u <= 0) return; const w = sh.cw * sh.cols, hh = sh.ch * sh.rows;
  g.save(); g.strokeStyle = 'rgba(255,255,255,.32)'; g.lineWidth = 4; g.lineCap = 'round';
  for (let r = 0; r <= sh.rows; r++) { const y = sh.y0 + r * sh.ch; g.beginPath(); g.moveTo(sh.x0, y); g.lineTo(sh.x0 + w * outCubic(u), y); g.stroke(); }
  g.globalAlpha *= outCubic(u); g.lineWidth = 3; g.strokeStyle = 'rgba(255,255,255,.18)';
  for (let c = 0; c <= sh.cols; c++) { const x = sh.x0 + c * sh.cw; g.beginPath(); g.moveTo(x, sh.y0); g.lineTo(x, sh.y0 + hh); g.stroke(); }
  g.restore();
}
const slot = (sh, k) => ({ x: sh.x0 + sh.cw * (k % sh.cols + .5), y: sh.y0 + sh.ch * (Math.floor(k / sh.cols) + 1) - 6 - sh.box * .41 });
function tile(x, y, s, tA, lit) {
  const u = outBack(prog(tNow, tA, tA + .5), 1.5); if (u <= 0) return;
  g.save(); g.translate(x, y); g.scale(u, u);
  g.beginPath(); g.roundRect(-s / 2, -s / 2, s, s, s * .22); g.fillStyle = `rgba(65,182,230,${.05 + .12 * lit})`; g.fill();
  g.lineWidth = 2; g.strokeStyle = lit > .02 ? `rgba(65,182,230,${.35 + .65 * lit})` : 'rgba(255,255,255,.22)'; g.stroke(); g.restore();
}
function chip(x, y, label, col, u, align = 'center', icon = null) {
  if (u <= 0) return; g.save(); g.font = font(22, 700);
  const tw = g.measureText(label).width, ico = icon ? 22 : 0, gap = icon ? 6 : 0, padL = 14, padR = 16, cw = padL + ico + gap + tw + padR;
  const cx = align === 'right' ? x - cw / 2 : align === 'left' ? x + cw / 2 : x, s = outBack(clamp(u), 2.2);
  g.translate(cx, y); g.scale(s, s); g.globalAlpha *= clamp(u * 2); g.fillStyle = col; g.beginPath(); g.roundRect(-cw / 2, -17, cw, 34, 17); g.fill();
  if (icon) { g.save(); g.translate(-cw / 2 + padL, -ico / 2); g.scale(ico / 256, ico / 256); g.fillStyle = '#fff'; g.fill(icon); g.restore(); }
  g.fillStyle = '#fff'; g.textAlign = 'left'; g.textBaseline = 'middle'; g.fillText(label, -cw / 2 + padL + ico + gap, 1); g.restore();
}
const lerpPt = (a, b, u) => [lerp(a[0], b[0], u), lerp(a[1], b[1], u)];

// ---------- POS-Szenen (lokale Koordinaten, Ursprung = Szenenmitte) ----------
// Kassenbon-Papier: Zeilen als graue Balken, optional Kopf und Summe
function paper(x, y, w, h, rows, o = {}) {
  const { head = null, total = null, a = 1, checks = 0 } = o; if (a <= 0) return;
  g.save(); g.globalAlpha *= a; g.translate(x, y);
  g.fillStyle = '#E9EEF3'; g.beginPath(); g.roundRect(-w / 2, 0, w, h, 6); g.fill();
  // gezackte Abrisskante unten
  g.fillStyle = '#E9EEF3'; g.beginPath(); g.moveTo(-w / 2, h - 2); for (let i = 0; i <= 12; i++) g.lineTo(-w / 2 + i * w / 12, h + (i % 2 ? 7 : -2)); g.lineTo(w / 2, h - 2); g.fill();
  let yy = 26;
  if (head) { g.font = font(20, 800); g.fillStyle = '#1E2A38'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(head, 0, yy); yy += 28; }
  g.fillStyle = 'rgba(30,40,55,.32)';
  for (let i = 0; i < rows; i++) { if (yy > h - 40) break; g.fillRect(-w / 2 + 22, yy, w * .42, 7); g.fillRect(w / 2 - 22 - w * .18, yy, w * .18, 7);
    if (i < checks) { g.save(); g.fillStyle = GREEN; g.beginPath(); g.arc(w / 2 - 22 - w * .18 - 18, yy + 3.5, 7, 0, 7); g.fill(); g.restore(); g.fillStyle = 'rgba(30,40,55,.32)'; }
    yy += 24; }
  if (total && yy + 30 < h) { g.strokeStyle = 'rgba(30,40,55,.4)'; g.setLineDash([5, 5]); g.lineWidth = 1.5; g.beginPath(); g.moveTo(-w / 2 + 18, yy + 4); g.lineTo(w / 2 - 18, yy + 4); g.stroke(); g.setLineDash([]);
    g.font = font(19, 800); g.fillStyle = '#1E2A38'; g.textAlign = 'left'; g.textBaseline = 'middle'; g.fillText(total, -w / 2 + 22, yy + 24); g.fillRect(w / 2 - 22 - w * .22, yy + 20, w * .22, 9); }
  g.restore();
}
// Barcode-Etikett
function barcodeLabel(x, y, w, h) {
  g.save(); g.fillStyle = '#F4F7FA'; g.beginPath(); g.roundRect(x - w / 2, y - h / 2, w, h, 4); g.fill();
  const r = rng(11); g.fillStyle = '#1E2A38'; let xx = x - w / 2 + 8; while (xx < x + w / 2 - 10) { const bw = 1.5 + r() * 3.5; g.fillRect(xx, y - h / 2 + 6, bw, h - 12); xx += bw + 1.5 + r() * 3; }
  g.restore();
}
// Glas-Panel mit Kopf (Icon + Label) für Filiale / Online-Shop
function panel(P, iconName, label, a, stroke) {
  if (a <= 0) return; const s = outBack(clamp(a), 1.2);
  g.save(); g.translate(P.x, P.y); g.scale(s, s); glass(0, 0, P.w, P.h, 20, clamp(a * 2), stroke);
  drawIconAt(ICON[iconName], -P.w / 2 + 40, -P.h / 2 + 38, 34, '#fff', clamp(a * 2));
  g.globalAlpha *= clamp(a * 2); g.font = font(28, 700); g.fillStyle = '#fff'; g.textAlign = 'left'; g.textBaseline = 'middle'; g.fillText(label, -P.w / 2 + 68, -P.h / 2 + 39);
  g.restore();
}
function bar(x, y, w, lvl, col = null) {
  g.save(); g.fillStyle = 'rgba(255,255,255,.1)'; g.beginPath(); g.roundRect(x, y - 9, w, 18, 9); g.fill();
  if (lvl > .005) { const gr = g.createLinearGradient(x, 0, x + w, 0); gr.addColorStop(0, BLUE); gr.addColorStop(1, GREEN); g.fillStyle = col || gr; g.beginPath(); g.roundRect(x, y - 9, w * lvl, 18, 9); g.fill(); }
  g.restore();
}
// Person (Warteschlange): Glaskreis + Icon
function person(x, y, a, lit = 0) { if (a <= 0) return; g.save(); g.globalAlpha *= a; g.beginPath(); g.arc(x, y, 36, 0, 7); g.fillStyle = lit ? 'rgba(65,182,230,.18)' : 'rgba(255,255,255,.07)'; g.fill(); g.lineWidth = 2; g.strokeStyle = lit ? BLUE : 'rgba(255,255,255,.25)'; g.stroke(); g.restore(); drawIconAt(ICON['user-circle'], x, y, 44, '#fff', a); }
// Kontaktlos-Wellen
function waves(x, y, u, col = BLUE) { if (u <= 0 || u >= 1) return; g.save(); g.lineCap = 'round'; for (let i = 0; i < 3; i++) { const q = clamp(u * 1.6 - i * .25); if (q <= 0 || q >= 1) continue; g.globalAlpha = (1 - q) * .9; g.strokeStyle = col; g.lineWidth = 3; g.beginPath(); g.arc(x, y, 24 + q * 70, -Math.PI * .3, Math.PI * .3); g.stroke(); } g.restore(); }
const decayIn = (t, t0, d = .35) => t < t0 ? 0 : clamp((t - t0) / .12) * Math.exp(-Math.max(0, t - t0 - .12) / d);

// Szene 2: Bögen vom Ring zu den Orten
const PL_LINE = PL.x.map(x => { const r0 = PL.ringR + 10, top = [x, PL.y - PL.r - 10]; const a = Math.atan2(top[1] - PL.ring[1], top[0] - PL.ring[0]); return curve([[PL.ring[0] + Math.cos(a) * r0, PL.ring[1] + Math.sin(a) * r0], [PL.ring[0] + Math.cos(a) * r0 * 2, PL.ring[1] + 40], [x, PL.y - 160], top]); });
const placeCur = (t, k) => { const nx = k < 3 ? T.place(k + 1) : T.place(3) + 1.4; return prog(t, T.place(k), T.place(k) + .3) * (1 - prog(t, nx - .2, nx + .2)); };
const placeA = (t, k) => { const all = prog(t, T.place(3) + 1.2, T.place(3) + 1.6); return Math.max(all, placeCur(t, k), t < T.place(k) + .3 ? 1 : .45); };
// Szene 3: Andock-Positionen
const sysPos = (t, k) => { const d = T.sys(k) + T.dock, u = outCubic(prog(t, d, d + .6)), [px, py] = SY.pos[k], dx = px - SY.ring[0], dy = py - SY.ring[1]; return [SY.ring[0] + dx * (1 + .9 * (1 - u)), SY.ring[1] + dy * (1 + .9 * (1 - u)), u]; };
const sysEdge = k => { const [px, py] = SY.pos[k], dx = px - SY.ring[0], dy = py - SY.ring[1], d = Math.hypot(dx, dy), ux = dx / d, uy = dy / d; return [[SY.ring[0] + ux * (SY.ringR + 10), SY.ring[1] + uy * (SY.ringR + 10)], [px - ux * (SY.r + 8), py - uy * (SY.r + 8)]]; };
// Szene 5: Wege
const HW_SL = HW.store.x - HW.store.w / 2, HW_HUB = HW.hub, HR = HW.hubR;
const PATH_PRICE = [[HW.central[0] + 64, HW.central[1]], [HW_HUB[0] - HR - 10, HW_HUB[1]], [HW_HUB[0] + HR + 10, HW_HUB[1] - 20], [HW_SL - 10, HW.store.y]];
const PATH_SYNC = [[HW_SL - 10, HW.store.y + 20], [HW_HUB[0] + HR + 10, HW_HUB[1] - 10], [HW_HUB[0] + HR + 10, HW_HUB[1] + 10], [HW_SL - 10, HW.shop.y]];
const HW_R = HW.store.x + HW.store.w / 2, ARC = curve([[HW_R + 8, HW.shop.y], [HW_R + 110, HW.shop.y], [HW_R + 110, HW.store.y], [HW_R + 8, HW.store.y]]);
const polyAt = (pts, u) => { const segs = []; let L = 0; for (let i = 0; i < pts.length - 1; i++) { const l = Math.hypot(pts[i + 1][0] - pts[i][0], pts[i + 1][1] - pts[i][1]); segs.push(l); L += l; } let d = clamp(u) * L; for (let i = 0; i < segs.length; i++) { if (d <= segs[i]) return lerpPt(pts[i], pts[i + 1], d / segs[i]); d -= segs[i]; } return pts[pts.length - 1]; };
const shopLvl = t => lerp(.7, .55, inOutCubic(prog(t, ...T.drop))), storeLvl = shopLvl;

const scenes = {
  hook: {
    pre(t) {
      softGlow(0, -40, 950, 'rgba(40,120,190,A)', .16);
      text(S.titleSmall, 0, -190, 44, t, T.titleIn, 99, { w: 700, col: SOFT });
      text(S.title, 0, -115, 80, t, T.titleIn + .15, 99, { w: 800 });
      // Karton mit Barcode
      const bu = outBack(prog(t, T.box, T.box + .5), 1.4), [bx, by] = HK.box, bw = HK.boxW;
      if (bu > 0) { g.save(); g.translate(bx, by); g.scale(bu, bu); carton(0, 0, bw, RINGC[1], clamp(bu * 2)); barcodeLabel(0, 14, bw * .56, bw * .26); g.restore(); }
      const fl = decayIn(t, T.beep, .3); if (fl > 0) { g.save(); g.globalAlpha = fl; g.strokeStyle = GREEN; g.lineWidth = 4; g.beginPath(); g.roundRect(bx - bw / 2 - 10, by - bw * .41 - 10, bw + 20, bw * .82 + 20, 16); g.stroke(); g.restore(); }
      // Scan-Linie
      const su = prog(t, ...T.scan); if (su > 0 && su < 1) { const x = lerp(bx - bw / 2 - 24, bx + bw / 2 + 24, inOutCubic(su)); g.save(); g.globalCompositeOperation = 'lighter';
        const gr = g.createLinearGradient(x - 16, 0, x + 16, 0); gr.addColorStop(0, 'rgba(245,61,71,0)'); gr.addColorStop(.5, 'rgba(245,61,71,.9)'); gr.addColorStop(1, 'rgba(245,61,71,0)'); g.fillStyle = gr; g.fillRect(x - 16, by - bw * .55, 32, bw * 1.1); g.restore(); }
      // Daten-Punkt Karton → Drucker
      const du = prog(t, T.beep, T.beep + .35); if (du > 0 && du < 1) glowDot(lerp(bx + bw / 2 + 10, HK.printer[0] - HK.pw / 2 - 6, inOutCubic(du)), lerp(by, HK.printer[1], inOutCubic(du)), 6, BLUE, Math.min(1, du * 6, (1 - du) * 6));
      // Drucker-Schlitz + Bon
      const pu = prog(t, T.box + .1, T.box + .5), [px, py] = HK.printer;
      const pr = outCubic(prog(t, ...T.print)), ph = HK.paperH * pr;
      if (ph > 1) { g.save(); g.beginPath(); g.rect(px - HK.paperW / 2 - 10, py + 14, HK.paperW + 20, ph + 12); g.clip(); paper(px, py + 14 + ph - HK.paperH, HK.paperW, HK.paperH, 6, { head: S.receipt, total: S.total }); g.restore(); }
      if (pu > 0) { g.save(); g.globalAlpha = pu; g.fillStyle = '#1B2A3C'; g.beginPath(); g.roundRect(px - HK.pw / 2, py - 22, HK.pw, 44, 14); g.fill(); g.strokeStyle = 'rgba(255,255,255,.22)'; g.lineWidth = 1.6; g.stroke(); g.fillStyle = '#05080D'; g.fillRect(px - HK.paperW / 2 - 6, py + 6, HK.paperW + 12, 8); g.restore(); }
    },
    post() {}
  },
  place: {
    pre(t) {
      softGlow(0, 60, 950, 'rgba(40,120,190,A)', .14);
      text(S.head1, 0, -390, 54, t, T.head1, 99, { w: 800 });
      text(S.eg, 0, -320, 38, t, T.eg, 99, { w: 600, col: SOFT });
      PL.x.forEach((x, k) => {
        const t0 = T.place(k), cur = placeCur(t, k);
        withA(placeA(t, k), () => {
          dotted(PL_LINE[k], 0, inOutCubic(prog(t, t0 - .5, t0 + .1)), .4);
          station(x, PL.y, PL.r, t0, .3 + .7 * cur);
          text(S.places[k], x, PL.y + PL.r + 42, 36, t, t0 + .15, 99, { w: 700, col: cur > .3 ? '#fff' : SOFT });
        });
      });
    },
    post(t) {
      PL.x.forEach((x, k) => {
        const t0 = T.place(k);
        withA(placeA(t, k), () => drawIcon(ICON[PL.icon[k]], x, PL.y, 64, prog(t, t0 + .1, t0 + .7), '#fff'));
        const u = prog(t, t0 - .45, t0 + .05); if (u > 0 && u < 1) glowDot(...ptAt(PL_LINE[k], inOutCubic(u)), 6, RINGC[k + 1], Math.min(1, u * 6, (1 - u) * 6));
      });
    }
  },
  sys: {
    pre(t) {
      softGlow(SY.ring[0], SY.ring[1], 900, 'rgba(40,140,210,A)', .16);
      text(S.head2, 0, -390, 56, t, T.head2, 99, { w: 800 });
      S.parts.forEach((s, k) => {
        const y = SY.iy[k], t0 = T.sys(k), u = outBack(prog(t, t0, t0 + .4), 1.8); if (u <= 0) return;
        const cy = y + capMid(48, 700);
        g.save(); g.translate(-762, cy); g.scale(u, u); g.fillStyle = BLUE; g.beginPath(); g.arc(0, 0, 27, 0, 7); g.fill(); g.restore();
        const c = prog(t, t0 + .12, t0 + .45);
        if (c > 0) { g.save(); g.translate(-762, cy); g.beginPath(); g.rect(-18, -18, 36 * c, 36); g.clip(); g.translate(-16, -16); g.scale(32 / 256, 32 / 256); g.fillStyle = '#fff'; g.fill(BOLD.check); g.restore(); }
        text(s, -710, y, 48, t, t0 + .08, 99, { w: 700, align: 'left' });
        // Teil dockt an den Ring an (erst nach dem Text)
        const [x, yy, du] = sysPos(t, k); if (du <= 0) return;
        const nx = k < 3 ? T.sys(k + 1) + T.dock : T.sys(3) + T.dock + 1.6, cur = prog(t, T.sys(k) + T.dock + .4, T.sys(k) + T.dock + .7) * (1 - prog(t, nx - .2, nx + .2));
        dotted(sysEdge(k), 0, inOutCubic(prog(t, T.sys(k) + T.dock + .4, T.sys(k) + T.dock + .8)), .5, cur > .1 ? BLUE : '#fff');
        g.save(); g.globalAlpha *= clamp(du * 2); g.translate(x, yy); g.beginPath(); g.arc(0, 0, SY.r, 0, 7); g.fillStyle = `rgba(65,182,230,${.06 + .14 * cur})`; g.fill(); g.lineWidth = 2; g.strokeStyle = `rgba(65,182,230,${.35 + .65 * cur})`; g.stroke(); g.restore();
      });
    },
    post(t) {
      S.parts.forEach((s, k) => { const [x, y, du] = sysPos(t, k); if (du > 0) drawIconAt(ICON[SY.icon[k]], x, y, 56, '#fff', clamp(du * 2)); });
      hubLabel(t, 'sys', T.sys(0) + T.dock + .4);
    }
  },
  problem: {
    pre(t) {
      softGlow(0, 60, 1000, 'rgba(200,50,60,A)', .10);
      text(S.q3, 0, -390, 56, t, T.q3, 99, { w: 800, acc: ORANGE });
      text(S.head3, 0, -305, 36, t, T.head3, 99, { w: 600, col: SOFT, acc: ORANGE, lh: 48 });
      // Gruppe: erst mittig (A), dann rechts (B), damit links die Liste Platz hat
      const pm = inOutCubic(prog(t, ...T.pmove)), po = lerpPt(PR.A.o, PR.B.o, pm), ps = lerp(PR.A.s, PR.B.s, pm), gA = dimAt(t, T.kw(0));
      g.save(); g.translate(...po); g.scale(ps, ps); g.translate(-PR.ctr[0], -PR.ctr[1]); g.globalAlpha *= gA;
      const wa = [prog(t, T.win, T.win + .5), prog(t, T.win + .2, T.win + .7)], [sw, ow] = PR.win, hw = PR.ww / 2, hh = PR.wh / 2;
      // Verbindung (Abgleich nur nachts): gestrichelt, grau
      dotted([[sw[0] + hw + 10, sw[1]], [PR.ring[0] - PR.ringR - 10, PR.ring[1]]], 0, prog(t, T.still - .3, T.still + .2), .3, SOFT);
      dotted([[PR.ring[0] + PR.ringR + 10, ow[1]], [ow[0] - hw - 10, ow[1]]], 0, prog(t, T.still - .1, T.still + .4), .3, SOFT);
      const dbl = prog(t, T.double, T.double + .3);
      panel({ x: sw[0], y: sw[1], w: PR.ww, h: PR.wh }, 'storefront', S.store, wa[0]);
      panel({ x: ow[0], y: ow[1], w: PR.ww, h: PR.wh }, 'laptop', S.shop, wa[1], dbl > 0 ? `rgba(245,61,71,${(.16 + .84 * dbl).toFixed(3)})` : undefined);
      // Bestand: große Zahl + Chip
      const num = (x, y, v, a) => { if (a <= 0) return; g.save(); g.globalAlpha *= a; g.font = font(112, 800); g.fillStyle = '#fff'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(v, x, y); g.restore(); };
      const sold = prog(t, T.sale + .3, T.sale + .6);
      num(sw[0] - 70, sw[1] + 20, '1', wa[0] * (1 - sold)); num(sw[0] - 70, sw[1] + 20, '0', sold);
      num(ow[0] - 70, ow[1] + 20, '1', wa[1]);
      chip(sw[0] + 10, sw[1] + 20, S.available, GREEN, wa[0] * (1 - sold), 'left', BOLD.check);
      chip(sw[0] + 10, sw[1] + 20, S.soldout, 'rgba(168,168,168,.9)', sold, 'left');
      chip(ow[0] + 10, ow[1] + 20, S.available, GREEN, wa[1] * (1 - dbl), 'left', BOLD.check);
      chip(ow[0] + 10, ow[1] + 20, S.double, RED, dbl, 'left', BOLD.x);
      // Verkauf in der Filiale (Bon), Bestellung im Online-Shop (Wagen fällt ein)
      const sp = decayIn(t, T.sale, .6); if (sp > 0) drawIconAt(ICON.receipt, sw[0] + hw - 40, sw[1] - hh + 38, 34, GREEN, sp);
      const ou = prog(t, T.order, T.order + .5); if (ou > 0) { drawIconAt(ICON['shopping-cart'], ow[0] + hw - 44, ow[1] - hh + 38 - (1 - outCubic(ou)) * 60, 34, ORANGE, clamp(ou * 2)); }
      g.restore();
      // Liste links (wie Vorteile am Ende): rote Kreise mit Kreuz
      S.kw3.forEach((s, k) => {
        const y = PR.kwY[k], t0 = T.kw(k), u = outBack(prog(t, t0, t0 + .4), 1.8); if (u <= 0) return;
        const cy = y + capMid(44, 700);
        g.save(); g.translate(-762, cy); g.scale(u, u); g.fillStyle = RED; g.beginPath(); g.arc(0, 0, 26, 0, 7); g.fill(); g.restore();
        const c = prog(t, t0 + .12, t0 + .45);
        if (c > 0) { g.save(); g.translate(-762, cy); g.beginPath(); g.rect(-18, -18, 36 * c, 36); g.clip(); g.translate(-15, -15); g.scale(30 / 256, 30 / 256); g.fillStyle = '#fff'; g.fill(BOLD.x); g.restore(); }
        text(s, -712, y, 44, t, t0 + .08, 99, { w: 700, align: 'left' });
      });
    },
    post(t) {
      const R = L('problem', t), a = prog(t, T.still - .3, T.still + .3) * (1 - prog(t, T.recolor[0], T.recolor[0] + .4)) * dimAt(t, T.kw(0));
      if (a > 0) drawIconAt(ICON.moon, R.x, R.y, R.r * .78, SOFT, a);
    }
  },
  how: {
    pre(t) {
      softGlow(HW.hub[0], HW.hub[1], 900, 'rgba(40,140,210,A)', .2 * prog(t, T.hubHit - 1.2, T.hubHit - .2));
      text(S.head4, 0, -395, 56, t, T.head4, 99, { w: 800 });
      stepRow(t);
      const cA = dimAt(t, T.step[1]), stA = dimAt(t, T.step[2] + 1.2, T.cap3sub + 1.2), [cx, cy] = HW.central;
      // ① Zentrale
      withA(cA, () => {
        station(cx, cy, 58, T.central, 0); text(S.central, cx, cy + 58 + 36, 30, t, T.central + .2, 99, { w: 700, col: SOFT });
        dotted([PATH_PRICE[0], PATH_PRICE[1]], 0, inOutCubic(prog(t, T.central + .2, T.central + .6)), .4);
      });
      // Panels
      const sa = prog(t, T.store, T.store + .5), oa = prog(t, T.shop, T.shop + .5), live = prog(t, T.drop[0], T.drop[0] + .3);
      dotted([PATH_PRICE[2], PATH_PRICE[3]], 0, inOutCubic(prog(t, T.store, T.store + .4)), .4);
      dotted([PATH_SYNC[2], PATH_SYNC[3]], 0, inOutCubic(prog(t, T.shop, T.shop + .4)), .4);
      const P1 = HW.store, P2 = HW.shop, fr1 = prog(t, T.rtChip, T.rtChip + .3) * (1 - prog(t, T.step[1] - .2, T.step[1] + .2)) + prog(t, T.sale2, T.sale2 + .3) * (1 - prog(t, T.drop[1] + .6, T.drop[1] + 1));
      const fr2 = prog(t, T.drop[0], T.drop[0] + .3) * (1 - prog(t, T.drop[1] + .6, T.drop[1] + 1));
      const st = c => `rgba(65,182,230,${(.16 + .7 * c).toFixed(3)})`;
      withA(stA, () => panel(P1, 'storefront', S.store, sa, st(fr1)));
      withA(stA, () => panel(P2, 'laptop', S.shop, oa, st(fr2)));
      const rowY = P => P.y + 30, bx = P => P.x - P.w / 2 + 84, bw = 300;
      if (sa >= 1) withA(stA, () => { drawIconAt(ICON.package, bx(P1) - 34, rowY(P1), 30, '#fff', .9); bar(bx(P1), rowY(P1), bw, storeLvl(t));
        chip(P1.x + P1.w / 2 - 30, rowY(P1), S.newPrice, BLUE, prog(t, T.price[1], T.price[1] + .3), 'right', BOLD.tag);
        g.save(); g.globalAlpha *= prog(t, T.rtChip, T.rtChip + .3); g.font = font(21, 600); g.fillStyle = BLUE; g.textAlign = 'right'; g.textBaseline = 'middle'; g.fillText(live > 0 ? S.live : S.realtime, P1.x + P1.w / 2 - 30, P1.y - P1.h / 2 + 39); g.restore();
        const sp = decayIn(t, T.sale2, .7); if (sp > 0) chip(bx(P1) + bw + 20, rowY(P1) - 42, S.paid, GREEN, sp, 'left', BOLD.check); });
      if (oa >= 1) withA(stA, () => { drawIconAt(ICON.package, bx(P2) - 34, rowY(P2), 30, '#fff', .9); bar(bx(P2), rowY(P2), bw, shopLvl(t));
        chip(P2.x + P2.w / 2 - 30, rowY(P2), S.available, GREEN, 1, 'right', BOLD.check);
        g.save(); g.globalAlpha *= live; g.font = font(21, 600); g.fillStyle = BLUE; g.textAlign = 'right'; g.textBaseline = 'middle'; g.fillText(S.live, P2.x + P2.w / 2 - 30, P2.y - P2.h / 2 + 39); g.restore(); });
      // ③ Filiale ↔ Online-Shop: Bogen rechts, Paket hin (Click & Collect) und zurück (Return-in-Store)
      const arcA = prog(t, T.cc[0] - .4, T.cc[0]); if (arcA > 0) dotted(ARC, 0, inOutCubic(arcA), .5, BLUE);
      const cu = prog(t, ...T.cc), ru = prog(t, ...T.ris);
      if (cu > 0 && cu < 1) carton(...ptAt(ARC, inOutCubic(cu)), 34, RINGC[4], Math.min(1, cu * 6, (1 - cu) * 6));
      if (ru > 0 && ru < 1) carton(...ptAt(ARC, 1 - inOutCubic(ru)), 34, RINGC[2], Math.min(1, ru * 6, (1 - ru) * 6));
      chip(HW_R + 24, (HW.store.y + HW.shop.y) / 2 - 22, S.cc, BLUE, prog(t, T.cc[0], T.cc[0] + .3), 'left', BOLD.package);
      chip(HW_R + 24, (HW.store.y + HW.shop.y) / 2 + 22, S.ris, 'rgba(97,189,71,.95)', prog(t, T.ris[0], T.ris[0] + .3), 'left', BOLD['arrow-u-up-left']);
      caption(t, S.cap1, TX.cap1); caption(t, S.cap2, TX.cap2); caption(t, S.cap3, [TX.cap3[0], WHIPS[4][0]], S.cap3sub, TX.cap3sub[0]);
    },
    post(t) {
      withA(dimAt(t, T.step[1]), () => drawIcon(ICON.buildings, ...HW.central, 46, prog(t, T.central + .1, T.central + .7), '#fff'));
      // Preis wandert Zentrale → POS → Filiale
      const pu = prog(t, ...T.price); if (pu > 0 && pu < 1) { const [x, y] = polyAt(PATH_PRICE, inOutCubic(pu)); chip(x, y, S.newPrice, BLUE, Math.min(1, pu * 8, (1 - pu) * 8), 'center', BOLD.tag); }
      const su = prog(t, ...T.syncDot); if (su > 0 && su < 1) glowDot(...polyAt(PATH_SYNC, inOutCubic(su)), 7, BLUE, Math.min(1, su * 6, (1 - su) * 6));
      hubLabel(t, 'how', T.recolor[0]);
    }
  },
  tap: {
    pre(t) {
      softGlow(TP.phone[0], TP.phone[1], 800, 'rgba(40,140,210,A)', .14);
      text(S.head5, 0, -390, 56, t, T.head5, 99, { w: 800 });
      text(S.sub5a, 0, -318, 36, t, T.sub5a, 99, { w: 600, col: SOFT });
      text(S.sub5b, 0, -268, 36, t, T.sub5b, 99, { w: 600, col: SOFT });
      // feste Kasse + Warteschlange
      const [kx, ky] = TP.checkout;
      withA(dimAt(t, T.phone + .2), () => { station(kx, ky, 62, T.queue(0) - .3, 0); text(S.checkout, kx, ky + 62 + 36, 30, t, T.queue(0) - .1, 99, { w: 700, col: SOFT }); });
      for (let k = 0; k < TP.n; k++) {
        const a = prog(t, T.queue(k), T.queue(k) + .3); if (a <= 0) continue;
        const j = TP.n - 1 - k; let [x, y] = TP.queue(k), leave = 1, lit = 0;
        if (j < 2) { const [w0, w1] = T.walk(j), u = inOutCubic(prog(t, w0, w1)), tx = TP.phone[0] - 150, ty = TP.phone[1] + 40; x = lerp(x, tx, u); y = lerp(y, ty, u) - Math.sin(Math.PI * u) * 40; lit = u > 0 && t < T.tap(j) + .9 ? 1 : 0; leave = 1 - prog(t, T.tap(j) + .8, T.tap(j) + 1.2); }
        person(x, y, a * leave, lit);
      }
      // Smartphone als Kartenterminal
      const pu = outBack(prog(t, T.phone, T.phone + .5), 1.3), [px, py] = TP.phone;
      if (pu > 0) { g.save(); g.translate(px, py); g.scale(pu, pu); g.fillStyle = '#0B1522'; g.beginPath(); g.roundRect(-TP.pw / 2, -TP.ph / 2, TP.pw, TP.ph, 24); g.fill(); g.lineWidth = 3; g.strokeStyle = 'rgba(255,255,255,.55)'; g.stroke();
        g.fillStyle = 'rgba(65,182,230,.10)'; g.beginPath(); g.roundRect(-TP.pw / 2 + 10, -TP.ph / 2 + 26, TP.pw - 20, TP.ph - 52, 14); g.fill();
        g.translate(-34, -34); g.scale(68 / 256, 68 / 256); g.fillStyle = '#fff'; g.fill(BOLD['contactless-payment']); g.restore(); }
      for (let j = 0; j < 2; j++) { const tt = T.tap(j); waves(px + 10, py, prog(t, tt, tt + .8)); chip(px, py + TP.ph / 2 + 36, S.paid, GREEN, decayIn(t, tt + .3, .9), 'center', BOLD.check); }
    },
    post(t) {
      withA(dimAt(t, T.phone + .2), () => drawIcon(ICON['cash-register'], ...TP.checkout, 48, prog(t, T.queue(0) - .2, T.queue(0) + .4), '#fff'));
      // Karte tippt ans Smartphone
      for (let j = 0; j < 2; j++) { const tt = T.tap(j), u = prog(t, tt - .5, tt), back = prog(t, tt + .4, tt + .8); if (u <= 0 || back >= 1) continue;
        const x = TP.phone[0] - 150 + 40 + (110 * outCubic(u)) * (1 - back), y = TP.phone[1] + 40 - 20 * u; drawIconAt(ICON['credit-card'], x, y, 54, '#fff', 1 - back); }
    }
  },
  gain: {
    pre(t) {
      softGlow(300, 0, 900, 'rgba(60,170,120,A)', .14);
      text(S.head6, 0, -390, 56, t, T.head6, 99, { w: 800 });
      GN.items.forEach((s, k) => {
        const y = GN.iy[k], t0 = T.check(k), u = outBack(prog(t, t0, t0 + .4), 1.8); if (u <= 0) return;
        g.save(); g.translate(-762, y + capMid(48, 700)); g.scale(u, u); g.fillStyle = GREEN; g.beginPath(); g.arc(0, 0, 27, 0, 7); g.fill(); g.restore();
        const c = prog(t, t0 + .12, t0 + .45);
        if (c > 0) { g.save(); g.translate(-762, y + capMid(48, 700)); g.beginPath(); g.rect(-18, -18, 36 * c, 36); g.clip(); g.translate(-16, -16); g.scale(32 / 256, 32 / 256); g.fillStyle = '#fff'; g.fill(BOLD.check); g.restore(); }
        text(s, -710, y, 48, t, t0 + .08, 99, { w: 700, align: 'left' });
      });
      // Drucker unter dem Ring, Bon wächst mit jedem Häkchen; am Ende wird er zum digitalen Bon auf dem Smartphone
      const [rx, ry] = GN.receipt, slotY = GN.ring[1] + GN.ringR + 26, n = [0, 1, 2, 3].filter(k => t > T.check(k) + .2).length;
      const hTarget = 100 + 52 * n, h = lerp(100 + 52 * Math.max(0, n - 1), hTarget, outCubic(prog(t, T.check(Math.max(0, n - 1)) + .2, T.check(Math.max(0, n - 1)) + .6)));
      const pa = prog(t, T.head6 + .4, T.head6 + .8), mv = inOutCubic(prog(t, ...T.toPhone)), phx = rx + 300, phy = ry + 60;
      if (pa > 0) { g.save(); g.globalAlpha = pa; g.fillStyle = '#1B2A3C'; g.beginPath(); g.roundRect(rx - 150, slotY - 22, 300, 44, 14); g.fill(); g.strokeStyle = 'rgba(255,255,255,.22)'; g.lineWidth = 1.6; g.stroke(); g.restore(); }
      const pw = 220 * (1 - .55 * mv), px = lerp(rx, phx, mv), py = lerp(slotY + 14, phy - 90, mv);
      if (pa > 0 && h > 1) { g.save(); if (mv <= 0) { g.beginPath(); g.rect(rx - 130, slotY + 14, 260, h + 12); g.clip(); }
        g.translate(px, py); g.scale(1 - .55 * mv, 1 - .55 * mv); paper(0, 0, 220, Math.max(h, 1), n + 1, { head: S.receipt, checks: n, a: pa }); g.restore(); }
      // Smartphone
      const sa = outBack(prog(t, T.toPhone[0] - .4, T.toPhone[0] + .1), 1.3);
      if (sa > 0) { g.save(); g.translate(phx, phy); g.scale(sa, sa); g.lineWidth = 3; g.strokeStyle = 'rgba(255,255,255,.55)'; g.beginPath(); g.roundRect(-75, -135, 150, 270, 24); g.stroke(); g.restore();
        chip(phx, phy + 135 + 36, S.digital, BLUE, prog(t, T.toPhone[1], T.toPhone[1] + .3), 'center', BOLD.check); }
    },
    post() {}
  },

  end: {
    pre(t) {
      softGlow(0, -120, 1000, 'rgba(40,120,190,A)', .18);
      // „REMIRA“ wischt ein (Original-Pfade, Ring kommt aus drawRing). Claim ersetzt durch „Order Management System“:
      // Source Sans 3 Light, gleiche x-Höhe, gleiche linke Kante und Grundlinie wie der Original-Claim, weiß.
      const wu = inOutCubic(prog(t, ...T.wipe));
      if (wu > 0) {
        g.save(); g.translate(LOGO_X, LOGO_Y); g.scale(LOGO_S, LOGO_S);
        g.beginPath(); g.rect(330, -20, 960 * wu, 340); g.clip(); g.fillStyle = '#fff'; LOGO.word.forEach(d => g.fill(d)); g.restore();
      }
      const cu = prog(t, TX.end1[0], TX.end1[0] + .6);
      if (cu > 0) {
        g.save(); g.translate(LOGO_X, LOGO_Y); g.scale(LOGO_S, LOGO_S);
        g.font = font(100, 300); const mc = g.measureText('Order Management System'), px = 100 * (CLAIM.right - CLAIM.x) / mc.actualBoundingBoxRight;  // gleiche Claim-Größe wie im OMS-Video (Referenzbreite, browserunabhängig)
        g.beginPath(); g.rect(CLAIM.x - 10, 190, (1261.55 - CLAIM.x + 20) * outCubic(cu), 120); g.clip();
        g.font = font(px, 300); g.fillStyle = '#fff'; g.textAlign = 'left'; g.textBaseline = 'alphabetic'; g.fillText(S.claim, CLAIM.x, CLAIM.base); g.restore();
      }
      // Satz exakt so breit wie der Logo-Block (Ring links bis Schriftzug rechts)
      // Breite aus der Tinte (actualBoundingBox), nicht aus der Vorschubbreite, damit die sichtbaren Kanten bündig sind
      g.save(); g.font = font(100, 800); const m100 = g.measureText(plain(S.end2)); g.restore();
      const ink = m100.actualBoundingBoxLeft + m100.actualBoundingBoxRight, k = LOGO_W / ink, shift = (m100.width / 2 - (m100.actualBoundingBoxRight - m100.actualBoundingBoxLeft) / 2) * k;
      if (VARIANT === 'B') { endB(t); return; }
      if (VARIANT === 'A') {
        // gleiche Größe wie v3, ohne Schlusspunkt; Tinten-Mitte auf Bildmitte + A_SHIFT (Kompromiss Richtung Mitte des Schriftzugs)
        g.save(); g.font = font(100 * k, 800); const ma = g.measureText(plain(S.end2A)); g.restore();
        const xa = -(ma.actualBoundingBoxRight - ma.actualBoundingBoxLeft) / 2 + A_SHIFT;
        text(S.end2A, xa, END_TITLE_Y, 100 * k, t, TX.end2[0], 99, { w: 800, st: .07, align: 'left' });
      } else text(S.end2, shift + 1, END_TITLE_Y, 100 * k, t, TX.end2[0], 99, { w: 800, st: .07 });
      const pu = outCubic(prog(t, TX.end3[0], TX.end3[0] + .5));
      if (pu > 0) {
        g.save(); g.font = font(34, 600); const w = g.measureText(plain(S.cta)).width + 70; g.globalAlpha = pu;
        g.beginPath(); g.roundRect(-w / 2, END_CTA_Y - 32 + (1 - pu) * 12, w, 64, 32); g.strokeStyle = BLUE; g.lineWidth = 2.5; g.stroke(); g.fillStyle = 'rgba(65,182,230,.12)'; g.fill(); g.restore();
      }
      text(S.cta, 0, END_CTA_Y, 34, t, TX.end3[0] + .1, 99, { w: 600 });
    },
    post() {}
  }
};
// Variante B: Ring links, Textspalte linksbündig an der linken Tintenkante von „REMIRA“
function endB(t) {
  const left = Math.round(LOGO_X + REMIRA_INK.x0 * LOGO_S), inkW = (REMIRA_INK.x1 - REMIRA_INK.x0) * LOGO_S, claimBottom = LOGO_Y + 288.3 * LOGO_S;
  const s = plain(S.end2);
  g.save(); g.font = font(100, 800); const m = g.measureText(s); g.restore();
  const px = 100 * inkW / (m.actualBoundingBoxLeft + m.actualBoundingBoxRight), capH = .66 * px, ty = Math.round(claimBottom + 50 + capH / 2);
  text(S.end2, left + m.actualBoundingBoxLeft * px / 100, ty, px, t, TX.end2[0], 99, { w: 800, st: .07, align: 'left' });
  const by = Math.round(ty + capH / 2 + 44 + 24), pu = outCubic(prog(t, TX.end3[0], TX.end3[0] + .5)), label = plain(S.cta);
  g.save(); g.font = font(26, 600); const w = g.measureText(label).width + 52; g.restore();
  if (pu > 0) { g.save(); g.globalAlpha = pu; g.beginPath(); g.roundRect(left + 1.25, by - 24 + (1 - pu) * 10, w, 48, 24); g.strokeStyle = BLUE; g.lineWidth = 2.5; g.stroke(); g.fillStyle = 'rgba(65,182,230,.12)'; g.fill(); g.restore(); }
  text(S.cta, left + 26, by, 26, t, TX.end3[0] + .1, 99, { w: 600, align: 'left' });
}
// Schritt-Nummern ①②③ (v4, Marketing 23.11.): groß und mittig zwischen Headline und Grafik statt klein links vor dem Satz.
// Alle drei erscheinen mit Schritt 1 (man sieht die Reihenfolge), der aktuelle ist blau gefüllt, erledigte bekommen ein Häkchen, kommende sind nur Umriss.
function stepRow(t) {
  const y0 = T.step[0], a = prog(t, y0 - .1, y0 + .3); if (a <= 0) return;
  const R = 30, gapX = 110, y = HW.stepY + TOP, xs = [-gapX, 0, gapX];
  g.save(); g.globalAlpha *= a;
  for (let k = 0; k < 2; k++) { const on = prog(t, T.step[k + 1] - .3, T.step[k + 1] + .2); g.save(); g.lineWidth = 2.4; g.lineCap = 'round';
    g.strokeStyle = 'rgba(255,255,255,.25)'; g.setLineDash([.01, 9]); g.beginPath(); g.moveTo(xs[k] + R + 10, y); g.lineTo(xs[k + 1] - R - 10, y); g.stroke();
    if (on > 0) { g.setLineDash([]); g.strokeStyle = BLUE; g.beginPath(); g.moveTo(xs[k] + R + 10, y); g.lineTo(lerp(xs[k] + R + 10, xs[k + 1] - R - 10, on), y); g.stroke(); } g.restore(); }
  xs.forEach((x, k) => {
    const act = prog(t, T.step[k] - .1, T.step[k] + .3), done = k < 2 ? prog(t, T.step[k + 1] - .1, T.step[k + 1] + .3) : 0, cur = act * (1 - done);
    const s = 1 + .12 * cur + .12 * Math.exp(-Math.max(0, t - T.step[k]) / .15) * (t > T.step[k] ? 1 : 0);
    g.save(); g.translate(x, y); g.scale(s, s);
    if (cur > 0) softGlow(0, 0, R * 2.6, 'rgba(65,182,230,A)', .35 * cur);
    g.beginPath(); g.arc(0, 0, R, 0, 7); g.fillStyle = `rgba(65,182,230,${(act * (1 - .82 * done)).toFixed(3)})`; g.fill();
    g.lineWidth = 2.4; g.strokeStyle = act > 0 ? BLUE : 'rgba(255,255,255,.35)'; g.stroke();
    if (done > .5) { g.translate(-14, -14); g.scale(28 / 256, 28 / 256); g.fillStyle = BLUE; g.fill(BOLD.check); }
    else { g.fillStyle = act > .5 ? '#fff' : 'rgba(255,255,255,.55)'; g.font = font(32, 800); g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(String(k + 1), 0, 2); }
    g.restore();
  });
  g.restore();
}
// Satz des Schritts: mittig unter den Nummern, Unterzeile kleiner darunter
function caption(t, s, [t0, t1], sub, subAt) {
  if (t < t0 || (t > t1 && t1 < WHIPS[4][0])) return;
  const y = HW.capY + TOP, fade = t1 < WHIPS[4][0];
  text(s, 0, y, 46, t, t0 + .1, t1, { w: 700, fade });
  if (sub) text(sub, 0, y + 54, 32, t, subAt ?? t0 + 1.2, t1, { w: 600, col: SOFT });
}
function hubLabel(t, s, t0) {
  const R = L(s, t), a = prog(t, t0, t0 + .6); if (a <= 0) return;
  g.save(); g.globalAlpha = a; g.font = font(R.r * .27, 800); g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = '#fff'; g.fillText(S.hub, R.x, R.y + 1); g.restore();
}

// ---------- Hintergrund ----------
const STREAKS = (() => { const r = rng(19); return Array.from({ length: 7 }, () => ({ p: r(), v: .6 + r() * .8, o: (r() - .5) * 900, l: 160 + r() * 260, w: 1 + r() * 1.5, a: .1 + r() * .15, c: RINGC[Math.floor(r() * 6)] })); })();
const DOTS = (() => { const r = rng(7); return Array.from({ length: 1300 }, () => ({ x: -1400 + r() * 8600, y: -1000 + r() * 6800, d: .25 + r() * .6, s: .8 + r() * 2.4, c: RINGC[Math.floor(r() * 6)], a: .1 + r() * .28 })); })();

function drawScene(t) {
  tNow = t;
  const cam = camAt(t);
  g.setTransform(scale, 0, 0, scale, 0, 0); g.globalAlpha = 1; g.globalCompositeOperation = 'source-over'; g.setLineDash([]); g.shadowColor = 'transparent'; g.filter = 'none';
  const bg = g.createRadialGradient(W / 2, H * .45, 0, W / 2, H / 2, W * .65); bg.addColorStop(0, '#0F1D2F'); bg.addColorStop(1, '#03060B'); g.fillStyle = bg; g.fillRect(0, 0, W, H);
  for (const s of DOTS) {
    const zz = 1 + (cam.z - 1) * s.d, x = W / 2 + (s.x - cam.x * s.d - t * 9 * s.d) * zz,   // nur die Partikel driften langsam
      y = H / 2 + (s.y - cam.y * s.d) * zz;
    if (x < -10 || x > W + 10 || y < -10 || y > H + 10) continue; g.globalAlpha = s.a; g.fillStyle = s.c; g.beginPath(); g.arc(x, y, s.s * (.6 + s.d), 0, 7); g.fill();
  }
  g.globalAlpha = 1;
  g.translate(W / 2, H / 2); g.scale(cam.z, cam.z); g.translate(-cam.x, -cam.y);
  // Nur Szenen in Sichtweite zeichnen
  const vis = ORDER.filter(s => Math.abs(SC[s][0] - cam.x) < 2400 / cam.z && Math.abs(SC[s][1] - cam.y) < 1700 / cam.z);
  for (const s of vis) { g.save(); g.translate(...SC[s]); layered(sceneAlpha(s, t), () => scenes[s].pre(t)); g.restore(); }
  drawRing(t);
  for (const s of vis) { g.save(); g.translate(...SC[s]); layered(sceneAlpha(s, t), () => scenes[s].post(t)); g.restore(); }
  // Lichtstreifen in Fahrtrichtung während der Kamerafahrten: kein leeres Bild in der Mitte der Fahrt
  for (const [a, b] of WHIPS) if (t > a && t < b && a !== WHIPS[3][0]) {
    const q = (t - a) / (b - a), A = camAt(a), B = camAt(b), dx = B.x - A.x, dy = B.y - A.y, L0 = Math.hypot(dx, dy), ux = dx / L0, uy = dy / L0, al = Math.sin(Math.PI * q) ** 2;
    g.save(); g.setTransform(scale, 0, 0, scale, 0, 0); g.globalCompositeOperation = 'lighter'; g.lineCap = 'round';
    STREAKS.forEach(s => {
      const off = ((s.p - q * 2.2 * s.v) % 1 + 1) % 1, cx = W / 2 + (off - .5) * 2600 * ux - s.o * uy * 1.0, cy = H / 2 + (off - .5) * 2600 * uy + s.o * ux * 1.0, len = s.l;
      const gr = g.createLinearGradient(cx - ux * len, cy - uy * len, cx + ux * len, cy + uy * len); gr.addColorStop(0, 'rgba(0,0,0,0)'); gr.addColorStop(.5, s.c); gr.addColorStop(1, 'rgba(0,0,0,0)');
      g.globalAlpha = al * s.a; g.strokeStyle = gr; g.lineWidth = s.w; g.beginPath(); g.moveTo(cx - ux * len, cy - uy * len); g.lineTo(cx + ux * len, cy + uy * len); g.stroke();
    });
    g.restore();
  }
  // v5: REMIRA-Logo klein oben rechts (Original-Pfade), sichtbar zwischen Intro und Endkarte (Marketing 24.11.). ?bug=url zeigt nur „REMIRA.COM“.
  const ba = prog(t, WHIPS[0][1], WHIPS[0][1] + .6) * (1 - prog(t, WHIPS[6][0] - .4, WHIPS[6][0]));
  if (ba > 0) {
    g.save(); g.setTransform(scale, 0, 0, scale, 0, 0); g.globalAlpha = ba;
    if (BUG === 'url') { g.font = font(28, 700); g.textAlign = 'right'; g.textBaseline = 'alphabetic'; g.fillStyle = '#fff'; g.fillText('REMIRA.COM', W - LOGO_BUG.margin, LOGO_BUG.top + 40); }
    else {
      // v7: offizielles Logo ohne Claim (Logo-Pack Marketing, REMIRA_Logo_white.png), unverändert skaliert
      const bw = LOGO_BUG.w, bh = bw * LOGO_W_IMG.height / LOGO_W_IMG.width; g.imageSmoothingQuality = 'high';
      g.drawImage(LOGO_W_IMG, W - LOGO_BUG.margin - bw, LOGO_BUG.top, bw, bh);
    }
    g.restore();
  }
  // Heldin (Bildschirm-Raum, unverzerrt)
  const h = heroAt(t);
  if (h) { g.setTransform(scale, 0, 0, scale, 0, 0); const hh = h.w * HERO.height / HERO.width; g.translate(h.x, h.y); g.rotate(h.rot); g.drawImage(HERO, -h.w / 2, -hh / 2, h.w, hh); }
}

// ---------- Frame: Bewegungsunschärfe (Teilbilder), Vignette, Korn ----------
const SHUTTER = .5;
function speed(t) {
  const pr = tt => { const c = camAt(tt); return [[800, 400], [-800, -400]].map(([x, y]) => [(x - c.x) * c.z, (y - c.y) * c.z]); };
  const a = pr(t), b = pr(t + SHUTTER / FPS); let m = 0; a.forEach((p, i) => { m = Math.max(m, Math.hypot(p[0] - b[i][0], p[1] - b[i][1])); });
  const h0 = heroAt(t), h1 = heroAt(t + SHUTTER / FPS); if (h0 && h1) m = Math.max(m, Math.hypot(h1.x - h0.x, h1.y - h0.y));
  const r0 = ringAt(t), r1 = ringAt(t + SHUTTER / FPS), c0 = camAt(t); m = Math.max(m, Math.hypot(r1.x - r0.x, r1.y - r0.y) * c0.z * .6);
  return m;
}
const grainCv = new OffscreenCanvas(256, 256); { const c = grainCv.getContext('2d'), id = c.createImageData(256, 256), r = rng(3); for (let i = 0; i < id.data.length; i += 4) { const v = r() * 255; id.data[i] = id.data[i + 1] = id.data[i + 2] = v; id.data[i + 3] = 10; } c.putImageData(id, 0, 0); }
window.renderFrame = async t => {
  const n = clamp(Math.round(speed(t) / 6), 1, 10);
  out.setTransform(1, 0, 0, 1, 0, 0); out.globalCompositeOperation = 'source-over';
  for (let k = 0; k < n; k++) { drawScene(t + (n === 1 ? 0 : (k + .5) / n * SHUTTER / FPS)); out.globalAlpha = 1 / (k + 1); out.drawImage(scn, 0, 0); }
  out.globalAlpha = 1; out.setTransform(canvas.width / W, 0, 0, canvas.height / H, 0, 0);
  const vg = out.createRadialGradient(W / 2, H / 2, H * .5, W / 2, H / 2, W * .74); vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(0,0,0,.4)'); out.fillStyle = vg; out.fillRect(0, 0, W, H);
  const f = 1 - prog(t, 0, .4); if (f > 0) { out.globalAlpha = clamp(f); out.fillStyle = '#000'; out.fillRect(0, 0, W, H); out.globalAlpha = 1; }
  out.save(); const pat = out.createPattern(grainCv, 'repeat'), o = 0;   // Korn steht still (sonst flimmert stehender Text)
  out.translate(o, o * .7); out.fillStyle = pat; out.globalCompositeOperation = 'overlay'; out.fillRect(-o, -o, W + 300, H + 300); out.restore();
};
window.grab = (type, quality = .93) => canvas.toDataURL(type, quality);
window.__ready = true;
