// REMIRA-Glossar „Warenwirtschaftssystem“ als Motion-Video (v2, eigener Aufbau). Alles Vektor in Canvas; jedes Bild hängt nur von t ab (timeline.js).
import { VARIANT, A_SHIFT, REMIRA_INK } from './data.js';
import { S, plain } from './texte.js';
import { W, H, FPS, DURATION, RINGC, BLUE, GREEN, RED, ORANGE, GREY, SOFT, SC, ORDER, LOGO_W, LOGO_S, LOGO_X, LOGO_Y, CLAIM, END_TITLE_Y, END_CTA_Y, SHELF, FL, CY, PR, HW, HB, GN } from './data.js';
import { T, TX, WHIPS, camAt, ringAt, spinAt, heroAt, sceneIndex, FLOW_BOXES, STREAM } from './timeline.js';
import { phosphorPath } from './phosphor-icons.js';
import { prog, clamp, lerp, outCubic, inCubic, outBack, inOutCubic, rng } from './lib/ease.js';

const scale = Number(new URLSearchParams(location.search).get('scale')) || 1;
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
const HERO = await createImageBitmap(await (await fetch('../assets/brand/remira-heldin-freigestellt.png')).blob());

// ---------- Icons: Original-Phosphor-Icons (MIT), Gewicht regular, siehe Skill remira-phosphor-icons ----------
const ICON = new Proxy({}, { get: (c, n) => c[n] || (c[n] = phosphorPath(n)) });
// Phosphor-Icons sind Flächen (keine Striche): Einblenden per Pop (Skalierung + Deckkraft) und weicher Wischblende von links.
function drawIcon(icon, x, y, size, u, col) {
  if (u <= 0) return; size *= 1.12;   // bold + etwas größer, damit Icons neben fettem Text nicht dünn wirken
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
  g.save(); g.font = font(px, w); g.textBaseline = 'middle'; g.textAlign = 'left'; if (ls) g.letterSpacing = ls + 'px';
  const space = g.measureText(' ').width; let idx = 0, maxW = 0;
  str.split('\n').forEach((line, li) => {
    const words = []; let accent = false;
    line.split(' ').forEach(wd => { const parts = wd.split('*'); let s = ''; const segs = []; parts.forEach((p, pi) => { if (pi) accent = !accent; if (p) segs.push([p, accent]); }); words.push(segs); });
    const widths = words.map(sg => sg.reduce((a, [p]) => a + g.measureText(p).width, 0)), tot = widths.reduce((a, b) => a + b, 0) + space * (words.length - 1);
    maxW = Math.max(maxW, tot);
    let cx = Math.round(align === 'center' ? x - tot / 2 : align === 'right' ? x - tot : x); const cy = Math.round(y + li * lh);   // stehender Text auf ganzen Pixeln
    words.forEach((sg, i) => {
      const u = outCubic(prog(t, t0 + idx * st, t0 + idx * st + .5)); idx++;
      if (u > 0) { g.globalAlpha = u * outA; let xx = Math.round(cx); for (const [p, a] of sg) { g.fillStyle = a ? acc : col; g.fillText(p, xx, cy + (u >= 1 ? 0 : (1 - u) * px * .35)); xx += g.measureText(p).width; } }
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
  g.globalAlpha = outCubic(u); g.lineWidth = 3; g.strokeStyle = 'rgba(255,255,255,.18)';
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
  const tw = g.measureText(label).width, ico = icon ? 20 : 0, gap = icon ? 6 : 0, padL = 14, padR = 16, cw = padL + ico + gap + tw + padR;
  const cx = align === 'right' ? x - cw / 2 : align === 'left' ? x + cw / 2 : x, s = outBack(clamp(u), 2.2);
  g.translate(cx, y); g.scale(s, s); g.globalAlpha *= clamp(u * 2); g.fillStyle = col; g.beginPath(); g.roundRect(-cw / 2, -17, cw, 34, 17); g.fill();
  if (icon) { g.save(); g.translate(-cw / 2 + padL, -ico / 2); g.scale(ico / 256, ico / 256); g.fillStyle = '#fff'; g.fill(icon); g.restore(); }
  g.fillStyle = '#fff'; g.textAlign = 'left'; g.textBaseline = 'middle'; g.fillText(label, -cw / 2 + padL + ico + gap, 1); g.restore();
}
const lerpPt = (a, b, u) => [lerp(a[0], b[0], u), lerp(a[1], b[1], u)];

// Szene 2: Bahn + Datenlinien zum Ring
const FL_TOP = FL.ring[1] + 72 + 8, FL_DATA = FL.x.map(x => curve([[x, FL.y - FL.tile / 2 - 8], [x, FL.y - 120], [x * .25, FL_TOP + 70], [x * .08, FL_TOP]]));
const passTimes = k => FLOW_BOXES.map(tb => tb + (FL.x[k] - FL.x[0]) / FL.speed);
// Szene 3: Positionen auf der Kreisbahn
const DEG = Math.PI / 180, CYP = CY.ang.map(a => [CY.c[0] + CY.R * Math.cos(a * DEG), CY.c[1] + CY.R * Math.sin(a * DEG)]);
const LAP = 5.5, cycAng = t => { const q = t - T.lap0; if (q <= 0) return -90; return q < LAP ? -90 + 360 * q / LAP : -90 + 360 + 360 * (q - LAP) / (LAP * 2); };
const cycPasses = k => { const out = []; for (let n = 0; n < 4; n++) { const a = CY.ang[k] + 90 + 360 * n; out.push(a <= 360 ? T.lap0 + a / 360 * LAP : T.lap0 + LAP + (a - 360) / 360 * LAP * 2); } return out; };
// Szene 5: Bahnen Quellen → Hub, Hub → Panel
const hubEdge = (hub, r, dy, side) => [hub[0] + side * Math.sqrt(r * r - dy * dy), hub[1] + dy];
const SRC_IN = HW.srcY.map(y => { const dy = clamp((y - HW.hub[1]) * .3, -70, 70), e = hubEdge(HW.hub, HW.hubR + 8, dy, -1); return curve([[HW.srcX + 52, y], [HW.srcX + 200, y], [e[0] - 140, e[1]], e]); });
const PANEL_L = HW.panel.x - HW.panel.w / 2;
// Szene 6: Speichen
const SPOKES = HB.pos.map(([x, y]) => { const dx = x - HB.hub[0], dy = y - HB.hub[1], d = Math.hypot(dx, dy), ux = dx / d, uy = dy / d; return [[HB.hub[0] + ux * (HB.hubR + 10), HB.hub[1] + uy * (HB.hubR + 10)], [x - ux * (HB.r + 8), y - uy * (HB.r + 8)]]; });
// Szene 7: Bestandsverlauf
const CH = GN.chart, CX1 = GN.ringX - 62 - 14, CYC = 10;
const zig = x => { const v = (x - CH.x0) / (CX1 - CH.x0); return (Math.sin(v * 21) * .75 + Math.sin(v * 7.3 + 1.2) * .45) * (1 - v ** 3); };

const scenes = {
  hook: {
    pre(t) {
      softGlow(0, -40, 950, 'rgba(40,120,190,A)', .16);
      text(S.titleSmall, 0, -170, 44, t, T.titleIn, 99, { w: 500, col: SOFT });
      text(S.title, 0, -95, 80, t, T.titleIn + .15, 99, { w: 800 });
      shelf(SHELF, prog(t, 1.6, 2.4));
      for (let k = 0; k < 10; k++) {
        const u = prog(t, T.box(k), T.box(k) + .45); if (u <= 0) continue; const p = slot(SHELF, k), e = outCubic(u);
        carton(p.x, p.y - (1 - e) * 70, SHELF.box, RINGC[k % 6], clamp(u * 3), 0, 1 - .08 * Math.sin(Math.PI * clamp(u * 1.4)) );
      }
    },
    post() {}
  },
  flow: {
    pre(t) {
      softGlow(0, 60, 950, 'rgba(40,120,190,A)', .14);
      text(S.sub1, 0, -380, 42, t, TX.sub1[0], 99, { w: 500, lh: 56, st: .06 });
      const ra = prog(t, 9.3, 10.0);
      // Bahn (Förderband): nur zwischen den Kacheln, Muster läuft in Förderrichtung
      for (let k = 0; k < 3; k++) {
        const a = FL.x[k] + FL.tile / 2 + 8, b = FL.x[k + 1] - FL.tile / 2 - 8; if (ra <= 0) break;
        g.save(); g.globalAlpha = ra; g.strokeStyle = 'rgba(255,255,255,.18)'; g.lineWidth = 10; g.lineCap = 'round'; g.beginPath(); g.moveTo(a, FL.y); g.lineTo(lerp(a, b, outCubic(ra)), FL.y); g.stroke();
        g.strokeStyle = 'rgba(65,182,230,.55)'; g.lineWidth = 3; g.setLineDash([10, 14]); g.lineDashOffset = -(t * FL.speed) % 24; g.stroke(); g.restore();
      }
      // Datenlinien Kachel → Ring
      FL_DATA.forEach((pts, k) => dotted(pts, 0, inOutCubic(prog(t, T.node(k) + .4, T.node(k) + 1.1)), .3));
      FL.x.forEach((x, k) => {
        let lit = 0; for (const tp of passTimes(k)) lit = Math.max(lit, decay(t, tp, .4));
        tile(x, FL.y, FL.tile, T.node(k), clamp(lit * 1.4));
        text(FL.label[k], x, FL.y + 102, 30, t, T.node(k) + .2, 99, { w: 600, col: lit > .3 ? '#fff' : SOFT });
      });
      // Kartons auf der Bahn (verschwinden in den Kacheln)
      for (const tb of FLOW_BOXES) {
        const x = FL.x[0] + (t - tb) * FL.speed; if (t < tb || x > FL.x[3]) continue;
        const d = Math.min(...FL.x.map(c => Math.abs(c - x))), a = clamp((d - FL.tile / 2 - 30) / 22) * clamp((t - tb) * 4);
        carton(x, FL.y - 2, 46, RINGC[Math.round((tb - T.flow0) / T.flowEvery) % 6], a);
      }
    },
    post(t) {
      FL.x.forEach((x, k) => drawIcon(ICON[FL.icon[k]], x, FL.y, 46, prog(t, T.node(k) + .1, T.node(k) + .7), '#fff'));
      // Datenpunkte steigen zum Ring, wenn ein Karton eine Kachel erreicht („abbilden“)
      FL.x.forEach((x, k) => { for (const tp of passTimes(k)) { const u = prog(t, tp, tp + .8); if (u > 0 && u < 1) glowDot(...ptAt(FL_DATA[k], inOutCubic(u)), 5.5, RINGC[k + 1], Math.min(1, u * 6, (1 - u) * 5)); } });
    }
  },
  cycle: {
    pre(t) {
      softGlow(CY.c[0], CY.c[1], 950, 'rgba(40,140,210,A)', .18);
      text(S.head2, 0, -440, 60, t, TX.head2[0], 99, { w: 800 });
      // Kreisbahn nur zwischen den Stationen, mit Richtungspfeilen
      const oa = inOutCubic(prog(t, 18.0, 19.0)), gap = (CY.r + 9) / CY.R;
      for (let k = 0; k < 5; k++) {
        const a0 = CY.ang[k] * DEG + gap, a1 = (CY.ang[k] + 72) * DEG - gap, ae = lerp(a0, a1, clamp(oa * 5 - k));
        if (ae <= a0) continue;
        g.save(); g.globalAlpha = .4; g.strokeStyle = '#fff'; g.lineWidth = 2.4; g.lineCap = 'round'; g.setLineDash([.01, 9]); g.beginPath(); g.arc(CY.c[0], CY.c[1], CY.R, a0, ae); g.stroke(); g.restore();
        const am = (a0 + a1) / 2; if (ae > am) { const px = CY.c[0] + CY.R * Math.cos(am), py = CY.c[1] + CY.R * Math.sin(am);
          g.save(); g.translate(px, py); g.rotate(am + Math.PI / 2); g.globalAlpha = .7; g.strokeStyle = BLUE; g.lineWidth = 3; g.lineCap = 'round'; g.lineJoin = 'round'; g.beginPath(); g.moveTo(-6, -7); g.lineTo(3, 0); g.lineTo(-6, 7); g.stroke(); g.restore(); }
      }
      CYP.forEach(([x, y], k) => {
        let lit = 0; for (const tp of cycPasses(k)) lit = Math.max(lit, decay(t, tp, .5));
        const done = t > cycPasses(k)[0] ? .35 : 0;
        station(x, y, CY.r, T.st2(k), Math.max(lit, done));
        const ln = CY.label[k];
        text(ln.join('\n'), x, y + CY.r + 34, 32, t, T.st2(k) + .2, 99, { w: 700, lh: 36, col: lit > .3 ? '#fff' : SOFT });
      });
      // Karton läuft im Kreis (unsichtbar auf den Stationen)
      if (t > T.lap0 - .2) { const a = cycAng(t) * DEG, x = CY.c[0] + CY.R * Math.cos(a), y = CY.c[1] + CY.R * Math.sin(a), d = Math.min(...CYP.map(p => Math.hypot(p[0] - x, p[1] - y)));
        carton(x, y, 40, RINGC[0], clamp((d - CY.r * .6) / 26) * prog(t, T.lap0 - .2, T.lap0 + .1)); }
    },
    post(t) {
      CYP.forEach(([x, y], k) => drawIcon(ICON[CY.icon[k]], x, y, 44, prog(t, T.st2(k) + .1, T.st2(k) + .7), '#fff'));
      hubLabel(t, 'cycle', 17.8);
    }
  },
  problem: {
    pre(t) {
      softGlow(0, 40, 1000, 'rgba(200,50,60,A)', .10);
      text(S.label3, 0, -448, 26, t, TX.label3[0], 99, { w: 800, col: RED, ls: 4 });
      text(S.head3, 0, -372, 52, t, TX.head3[0], 99, { w: 700, acc: ORANGE, lh: 62 });
      const sh = PR.shelf; shelf(sh, prog(t, T.shelf2 - .3, T.shelf2 + .3));
      const ch = prog(t, ...T.chaos);
      PR.state.forEach((st, k) => {
        const p = slot(sh, k), a0 = prog(t, T.shelf2 + k * .04, T.shelf2 + k * .04 + .3), col = RINGC[k % 6];
        if (st < 0) {   // leer: Karton fällt heraus, Fach rot
          const u = prog(t, T.chaos[0] + k * .05, T.chaos[0] + k * .05 + .5);
          carton(p.x, p.y + inCubic(u) * 160, sh.box, col, a0 * (1 - u));
          if (u > .6) { const r = outBack(prog(t, T.chaos[0] + .5 + k * .05, T.chaos[0] + .9 + k * .05), 1.6);
            g.save(); g.globalAlpha = clamp(r); g.strokeStyle = RED; g.lineWidth = 2.4; g.setLineDash([7, 7]); g.beginPath(); g.roundRect(p.x - sh.box / 2, p.y - sh.box * .41, sh.box, sh.box * .82, 9); g.stroke(); g.setLineDash([]);
            g.fillStyle = RED; g.beginPath(); g.arc(p.x, p.y, 15 * r, 0, 7); g.fill(); g.fillStyle = '#fff'; g.font = font(22, 800); g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('!', p.x, p.y + 1); g.restore(); }
        } else {
          carton(p.x, p.y, sh.box, col, a0);
          for (let n = 0; n < st; n++) {   // überfüllt: zusätzliche Kartons quetschen sich ins Fach
            const u = prog(t, T.chaos[0] + .2 + n * .18 + k * .03, T.chaos[0] + .55 + n * .18 + k * .03); if (u <= 0) continue;
            carton(p.x - 34 + n * 30, p.y - 30 - n * 8 - (1 - outCubic(u)) * 60, sh.box * .55, RINGC[(k + n + 2) % 6], clamp(u * 3), (n % 2 ? .18 : -.15));
          }
          if (st > 0 && ch > .5) { g.save(); g.globalAlpha = clamp((ch - .5) * 2) * .9; g.strokeStyle = ORANGE; g.lineWidth = 2.4; g.beginPath(); g.roundRect(p.x - sh.cw / 2 + 8, p.y - sh.ch + 30, sh.cw - 16, sh.ch - 8, 10); g.stroke(); g.restore(); }
        }
      });
      // Lose Listen (Tabellen) flattern rein, rote „?“-Verbindungen
      PR.lists.forEach(([x, y], k) => {
        const u = prog(t, T.list(k), T.list(k) + .7); if (u <= 0) return; const e = outCubic(u), rot = [-.12, .09, -.05][k];
        g.save(); g.translate(x + (1 - e) * 900, y - (1 - e) * 120); g.rotate(rot + (1 - e) * .8); g.globalAlpha = clamp(u * 3);
        g.fillStyle = '#E9EEF3'; g.beginPath(); g.roundRect(-75, -95, 150, 190, 8); g.fill();
        g.fillStyle = ['rgba(65,182,230,.75)', 'rgba(252,218,52,.8)', 'rgba(255,149,36,.8)'][k]; g.fillRect(-75, -95, 150, 22);
        g.fillStyle = 'rgba(30,40,55,.35)'; for (let i = 0; i < 7; i++) { g.fillRect(-58, -58 + i * 21, 40, 6); g.fillRect(-10, -58 + i * 21, [60, 44, 52][(i + k) % 3], 6); }
        g.restore();
      });
      const ma = prog(t, T.mism, T.mism + .5);
      if (ma > 0) [[0, 1], [1, 2]].forEach(([i, j], n) => {
        const [x0, y0] = PR.lists[i], [x1, y1] = PR.lists[j], xm = (x0 + x1) / 2 + (n ? -110 : 110), ym = (y0 + y1) / 2, blink = .55 + .45 * Math.cos((t - T.mism) * 5 + n);
        g.save(); g.globalAlpha = ma * blink; g.strokeStyle = RED; g.lineWidth = 2.4; g.setLineDash([8, 9]); g.beginPath(); g.moveTo(x0 + (n ? -20 : 40), y0 + 60); g.quadraticCurveTo(xm, ym, x1 + (n ? 20 : -40), y1 - 60); g.stroke(); g.setLineDash([]);
        g.fillStyle = RED; g.font = font(30, 800); g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('?', xm + (n ? 10 : -10), ym); g.restore();
      });
      S.kw3.forEach((s, k) => {
        const x = [-560, 0, 560][k], w = text(s, x + 14, 412, 40, t, T.kw(k), 99, { w: 700 });
        const u = outBack(prog(t, T.kw(k), T.kw(k) + .4), 2); if (u > 0 && w) { g.fillStyle = RED; g.beginPath(); g.arc(x + 14 - w / 2 - 22, 412 + capMid(40, 700), 8 * u, 0, 7); g.fill(); }
      });
    },
    post(t) {
      const R = L('problem', t), ca = prog(t, 26.9, 27.5) * (1 - prog(t, T.recolor[0], T.recolor[0] + .4));
      if (ca > 0) {
        const ticks = Math.max(0, Math.floor((t - T.tick0) * 2)), frac = (t - T.tick0) * 2 - ticks, snap = t > T.tick0 ? outBack(clamp(frac * 6), 2.5) : 0;
        const am = ((ticks + snap) * 30) * Math.PI / 180, ah = (t - 27) * .25;
        g.save(); g.translate(R.x, R.y); g.globalAlpha = ca; g.strokeStyle = '#fff'; g.lineCap = 'round';
        g.lineWidth = 4; g.beginPath(); g.moveTo(0, 0); g.lineTo(Math.sin(ah) * 17, -Math.cos(ah) * 17); g.stroke();
        g.lineWidth = 3; g.beginPath(); g.moveTo(0, 0); g.lineTo(Math.sin(am) * 28, -Math.cos(am) * 28); g.stroke();
        g.fillStyle = '#fff'; g.beginPath(); g.arc(0, 0, 4.5, 0, 7); g.fill(); g.restore();
      }
    }
  },
  how: {
    pre(t) {
      softGlow(HW.hub[0], HW.hub[1], 900, 'rgba(40,140,210,A)', .2 * prog(t, 35.4, 36.4));
      text(S.head4, 0, -445, 56, t, TX.head4[0], 99, { w: 800 });
      HW.srcY.forEach((y, k) => { dotted(SRC_IN[k], 0, inOutCubic(prog(t, T.src(k) + .3, T.src(k) + .9)), .35); station(HW.srcX, y, 44, T.src(k), 0); text(HW.srcLabel[k], HW.srcX, y + 70, 26, t, T.src(k) + .2, 99, { w: 600, col: SOFT }); });
      // Hub → Dashboard
      const P0 = HW.panel, pu = outBack(prog(t, T.panel, T.panel + .5), 1.2);
      dotted([[HW.hub[0] + HW.hubR + 10, HW.hub[1]], [PANEL_L - 8, HW.hub[1]]], 0, inOutCubic(prog(t, T.panel - .3, T.panel + .3)), .5);
      if (pu > 0) {
        g.save(); g.translate(P0.x, P0.y); g.scale(pu, pu); glass(0, 0, P0.w, P0.h, 22, 1);
        const lx = -P0.w / 2 + 40, rx = P0.w / 2 - 40, hy = -P0.h / 2 + 46;
        g.font = font(28, 700); g.textAlign = 'left'; g.textBaseline = 'middle'; g.fillStyle = SOFT; g.fillText(S.stock, lx, hy); const sw = g.measureText(S.stock).width;
        g.font = font(21, 600); g.fillStyle = BLUE; g.fillText(S.realtime, lx + sw + 20, hy);
        const ok = prog(t, T.avail, T.avail + .25);
        if (ok < 1) { g.globalAlpha = 1 - ok; g.font = font(22, 600); g.fillStyle = SOFT; g.textAlign = 'right'; g.fillText(S.checking, rx, hy); g.globalAlpha = 1; }
        chip(rx, hy, S.available, GREEN, ok, 'right', ICON.check);
        // Artikelzeilen: Icon, Balken, Mindestbestand
        const bx0 = lx + 64, bw = rx - 170 - bx0, mx = bx0 + bw * HW.min;
        HW.rows.forEach((ry, k) => {
          const y = ry - P0.y + (-10);
          drawIconAt(ICON.package, lx + 18, y, 30, '#fff', .9);
          g.fillStyle = 'rgba(255,255,255,.1)'; g.beginPath(); g.roundRect(bx0, y - 9, bw, 18, 9); g.fill();
          let lvl = HW.fill[k] * outCubic(prog(t, T.card + k * .2, T.card + k * .2 + 1.0)), low = 0;
          if (k === 1) { const d = inOutCubic(prog(t, ...T.dip)), r = inOutCubic(prog(t, ...T.refill)); lvl = lerp(lerp(lvl, .2, d), .82, r); low = d * (1 - r); }
          if (lvl > .005) { const gr = g.createLinearGradient(bx0, 0, bx0 + bw, 0); gr.addColorStop(0, BLUE); gr.addColorStop(1, GREEN); g.fillStyle = gr; g.beginPath(); g.roundRect(bx0, y - 9, bw * lvl, 18, 9); g.fill();
            if (low > 0) { g.globalAlpha = low; g.fillStyle = RED; g.beginPath(); g.roundRect(bx0, y - 9, bw * lvl, 18, 9); g.fill(); g.globalAlpha = 1; } }
          g.save(); g.strokeStyle = 'rgba(255,255,255,.55)'; g.lineWidth = 2; g.setLineDash([4, 5]); g.beginPath(); g.moveTo(mx, y - 18); g.lineTo(mx, y + 18); g.stroke(); g.restore();
        });
        g.restore();
        // Chip „nachbestellt“ neben der kritischen Zeile (außerhalb der Skalierung, steht still)
        chip(P0.x + P0.w / 2 - 40, HW.rows[1] - 10, S.reorder, BLUE, prog(t, T.reorder, T.reorder + .3) * (pu >= 1 ? 1 : 0), 'right', ICON['arrows-clockwise']);
      }
      // Umlagerung zwischen zwei Filialen
      const su = prog(t, T.move[0] - .7, T.move[0] - .2);
      if (su > 0) {
        const [a, b] = HW.stores; HW.stores.forEach(([x, y], k) => station(x, y, 44, T.move[0] - .7 + k * .1, 0));
        dotted([[a[0] + 52, a[1]], [b[0] - 52, b[1]]], 0, inOutCubic(su), .5);
        chip((a[0] + b[0]) / 2, a[1] - 50, S.transfer, 'rgba(65,182,230,.9)', prog(t, T.move[0] - .3, T.move[0]), 'center');
        const mu = prog(t, ...T.move); if (mu > 0 && mu < 1) carton(lerp(a[0] + 52, b[0] - 52, inOutCubic(mu)), a[1], 36, RINGC[4], Math.min(1, mu * 6, (1 - mu) * 6));
      }
      caption(t, 1, S.cap1, TX.cap1); caption(t, 2, S.cap2, TX.cap2); caption(t, 3, S.cap3, TX.cap3, S.cap3sub);
    },
    post(t) {
      HW.srcY.forEach((y, k) => drawIcon(ICON[HW.srcIcon[k]], HW.srcX, y, 38, prog(t, T.src(k) + .1, T.src(k) + .7), '#fff'));
      if (t > T.move[0] - .7) HW.stores.forEach(([x, y], k) => drawIcon(ICON.storefront, x, y, 38, prog(t, T.move[0] - .6 + k * .1, T.move[0] + k * .1), '#fff'));
      STREAM.forEach(s => { const u = prog(t, s.t, s.t + .9); if (u <= 0 || u >= 1) return; glowDot(...ptAt(SRC_IN[s.c], inOutCubic(u)), 6, RINGC[s.c], Math.min(1, u * 6, (1 - u) * 5)); });
      hubLabel(t, 'how', 35.9);
    }
  },
  hubs: {
    pre(t) {
      softGlow(HB.hub[0], HB.hub[1], 950, 'rgba(40,140,210,A)', .18);
      text(S.head5, 0, -440, 56, t, TX.head5[0], 99, { w: 800 });
      HB.pos.forEach(([x, y], k) => {
        const t0 = T.hb(k); dotted(SPOKES[k], 0, inOutCubic(prog(t, t0 - .25, t0 + .2)), .4);
        station(x, y, HB.r, t0, .35);
        text(HB.lines[k].join('\n'), x, y + HB.r + 36, 32, t, t0 + .15, 99, { w: 700, lh: 38 });
      });
      text(S.foot5, 0, 450, 50, t, TX.foot5[0], 99, { w: 700 });
    },
    post(t) {
      HB.pos.forEach(([x, y], k) => {
        drawIcon(ICON[HB.icon[k]], x, y, 46, prog(t, T.hb(k) + .1, T.hb(k) + .7), '#fff');
        if (t > T.hb(k) + .3) for (let j = 0; j < 2; j++) { const q = ((t - T.hb(k) - .3) * .7 + j / 2) % 1, out = j === 0, u = out ? q : 1 - q;
          glowDot(...lerpPt(SPOKES[k][0], SPOKES[k][1], u), 4.5, RINGC[k + 1], .85 * Math.min(1, q * 6, (1 - q) * 6)); }
      });
      hubLabel(t, 'hubs', 52.9);
    }
  },
  gain: {
    pre(t) {
      softGlow(300, 0, 900, 'rgba(60,170,120,A)', .14);
      text(S.head6, 0, -420, 56, t, TX.head6[0], 99, { w: 800 });
      GN.items.forEach((s, k) => {
        const y = GN.iy[k], t0 = T.check(k), u = outBack(prog(t, t0, t0 + .4), 1.8); if (u <= 0) return;
        g.save(); g.translate(-762, y + capMid(48, 700)); g.scale(u, u); g.fillStyle = GREEN; g.beginPath(); g.arc(0, 0, 27, 0, 7); g.fill(); g.restore();
        const c = prog(t, t0 + .12, t0 + .45);
        if (c > 0) { g.save(); g.translate(-762, y + capMid(48, 700)); g.beginPath(); g.rect(-18, -18, 36 * c, 36); g.clip(); g.translate(-16, -16); g.scale(32 / 256, 32 / 256); g.fillStyle = '#fff'; g.fill(ICON.check); g.restore(); }
        text(s, -710, y, 48, t, t0 + .08, 99, { w: 700, align: 'left' });
      });
      // Zonen: Überbestand (oben, orange), Korridor (grün), Fehlbestand (unten, rot)
      const za = prog(t, 61.9, 62.5), B = CH.band; if (za <= 0) return;
      g.save(); g.globalAlpha = za;
      g.fillStyle = 'rgba(255,149,36,.07)'; g.fillRect(CH.x0, CH.y0, CX1 - CH.x0, CYC - B - CH.y0);
      g.fillStyle = 'rgba(245,61,71,.07)'; g.fillRect(CH.x0, CYC + B, CX1 - CH.x0, CH.y1 - CYC - B);
      g.fillStyle = 'rgba(97,189,71,.13)'; g.fillRect(CH.x0, CYC - B, CX1 - CH.x0, 2 * B);
      g.strokeStyle = 'rgba(97,189,71,.55)'; g.lineWidth = 2; g.setLineDash([6, 7]); [CYC - B, CYC + B].forEach(y => { g.beginPath(); g.moveTo(CH.x0, y); g.lineTo(CX1, y); g.stroke(); }); g.setLineDash([]);
      g.strokeStyle = 'rgba(255,255,255,.3)'; g.lineWidth = 2; g.beginPath(); g.moveTo(CH.x0, CH.y0); g.lineTo(CH.x0, CH.y1); g.lineTo(CX1, CH.y1); g.stroke();
      g.restore();
      // Linie: Zickzack → glatt im Korridor, Farbe je nach Zone
      const amp = 200 * (1 - .88 * inOutCubic(prog(t, T.check(0), T.check(3) + .6))), rv = inOutCubic(prog(t, ...T.draw)), n = 90;
      const pts = Array.from({ length: n + 1 }, (_, i) => { const x = lerp(CH.x0, CX1, i / n); return [x, CYC + amp * zig(x)]; });
      g.save(); g.lineWidth = 5; g.lineCap = 'round';
      for (let i = 0; i < n * rv; i++) { const [x0, y0] = pts[i], [x1, y1] = pts[i + 1], ym = (y0 + y1) / 2;
        g.strokeStyle = ym < CYC - B ? ORANGE : ym > CYC + B ? RED : GREEN; g.beginPath(); g.moveTo(x0, y0); g.lineTo(x1, y1); g.stroke(); }
      g.restore();
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
function caption(t, n, s, [t0, t1], sub) {
  if (t < t0 || (t > t1 && t1 < WHIPS[4][0])) return;
  g.save(); g.font = font(46, 700); const plain = s.replace(/\*/g, ''), w = g.measureText(plain).width; g.restore();
  const y = sub ? 380 : 400, bx = -w / 2 - 44, fadeOut = t1 >= WHIPS[4][0] ? 1 : 1 - prog(t, t1 - .3, t1);
  const u = outBack(prog(t, t0, t0 + .4), 2) * fadeOut;
  if (u > 0) { g.save(); g.globalAlpha = fadeOut; g.translate(bx, Math.round(y) + capMid(46, 700)); g.scale(u, u); g.fillStyle = BLUE; g.beginPath(); g.arc(0, 0, 25, 0, 7); g.fill(); g.fillStyle = '#fff'; g.font = font(28, 800); g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(String(n), 0, 1); g.restore(); }
  text(s, 22, y, 46, t, t0 + .1, t1, { w: 700, fade: t1 < WHIPS[4][0] });
  if (sub) text(sub, 0, y + 58, 34, t, t0 + 1.2, t1, { w: 500, col: SOFT });
}
function hubLabel(t, s, t0) {
  const R = L(s, t), a = prog(t, t0, t0 + .6); if (a <= 0) return;
  g.save(); g.globalAlpha = a; g.font = font(R.r * .27, 800); g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = '#fff'; g.fillText(S.hub, R.x, R.y + 1); g.restore();
}

// ---------- Hintergrund ----------
const STREAKS = (() => { const r = rng(19); return Array.from({ length: 7 }, () => ({ p: r(), v: .6 + r() * .8, o: (r() - .5) * 900, l: 160 + r() * 260, w: 1 + r() * 1.5, a: .1 + r() * .15, c: RINGC[Math.floor(r() * 6)] })); })();
const DOTS = (() => { const r = rng(7); return Array.from({ length: 1100 }, () => ({ x: -1400 + r() * 13800, y: -1000 + r() * 3600, d: .25 + r() * .6, s: .8 + r() * 2.4, c: RINGC[Math.floor(r() * 6)], a: .1 + r() * .28 })); })();

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
