// Remira-Glossar „Order Management System“ als Motion-Video. Alles Vektor in Canvas; jedes Bild hängt nur von t ab (timeline.js).
import { VARIANT, A_SHIFT, REMIRA_INK } from './data.js';
import { S, plain } from './texte.js';
import { W, H, FPS, DURATION, RINGC, BLUE, GREEN, RED, ORANGE, GREY, SOFT, SC, ORDER, LOGO_W, LOGO_S, LOGO_X, LOGO_Y, CLAIM, END_TITLE_Y, END_CTA_Y, ST1, ST2, PB, HW, CN, GN } from './data.js';
import { T, TX, WHIPS, camAt, ringAt, spinAt, heroAt, sceneIndex, FLIGHTS, STREAM, DISP } from './timeline.js';
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

// ---------- Szenen (lokale Koordinaten, Ursprung = Szenenmitte) ----------
const L = (s, t) => { const r = ringAt(t); return { x: r.x - SC[s][0], y: r.y - SC[s][1], r: r.r }; };
const LINE1 = [[ST1.x[0], ST1.y], [ST1.x[3], ST1.y]];

const scenes = {
  intro: {
    pre(t) {
      softGlow(0, -60, 900, 'rgba(40,120,190,A)', .16);
      // Titel, rückt nach oben
      const m = inOutCubic(prog(t, ...T.titleUp));
      g.save(); g.translate(0, lerp(110, -390, m)); g.scale(lerp(1, .66, m), lerp(1, .66, m));
      text(S.titleSmall, 0, -48, 46, t, TX.title[0], 99, { w: 500, col: SOFT });
      text(S.title, 0, 42, 86, t, TX.title[0] + .15, 99, { w: 800 });
      g.restore();
      // Linie + Stationen
      const R = L('intro', t), la = prog(t, 4.5, 5.0);
      chain(ST1.x, ST1.y, 62, R.x, la, t > T.v1(0));
      ST1.x.forEach((x, k) => {
        const lit = prog(t, T.v1(k), T.v1(k) + .3);
        station(x, ST1.y, 62, T.st1(k), lit, R);
        text(ST1.label[k], x, ST1.y + 112, 30, t, T.st1(k) + .2, 99, { w: 600, col: lit > .5 ? '#fff' : SOFT });
      });
      text(S.sub1, 0, 282, 42, t, TX.sub1[0], 99, { w: 500, lh: 56, st: .06 });
    },
    post(t) { ST1.x.forEach((x, k) => drawIcon(ICON[ST1.icon[k]], x, ST1.y, 44, prog(t, T.st1(k) + .1, T.st1(k) + .7), '#fff', 1.7)); }
  },
  steps: {
    pre(t) {
      softGlow(0, 0, 900, 'rgba(40,120,190,A)', .14);
      text(S.head2, 0, -390, 60, t, TX.head2[0], 99, { w: 800 });
      const R = L('steps', t);
      chain(ST2.x, ST2.y, 62, R.x, prog(t, 11.4, 11.9), t > T.v2(0));
      ST2.x.forEach((x, k) => {
        const lit = prog(t, T.v2(k), T.v2(k) + .3);
        station(x, ST2.y, 62, T.st2(k), lit, R);
        text(ST2.label[k].join('\n'), x, ST2.y + 118, 34, t, T.st2(k) + .2, 99, { w: 700, lh: 40, col: lit > .5 ? '#fff' : SOFT });
      });
    },
    post(t) { ST2.x.forEach((x, k) => drawIcon(ICON[ST2.icon[k]], x, ST2.y, 44, prog(t, T.st2(k) + .1, T.st2(k) + .7), '#fff', 1.7)); }
  },
  problem: {
    pre(t) {
      softGlow(0, 40, 1000, 'rgba(200,50,60,A)', .10);
      text(S.label3, 0, -448, 26, t, TX.label3[0], 99, { w: 800, col: RED, ls: 4 });
      text(S.head3, 0, -372, 52, t, TX.head3[0], 99, { w: 700, acc: ORANGE, lh: 62 });
      // Kanäle links
      PB.chY.forEach((y, k) => { station(PB.chX, y, 54, T.pch(k), 0); text(PB.chLabel[k], PB.chX, y + 82, 28, t, T.pch(k) + .2, 99, { w: 600, col: SOFT }); });
      // Bildschirme rechts + Papierstapel
      const landed = [0, 0, 0];
      FLIGHTS.forEach(([c, s], n) => { if (t >= T.flight(n) + .95) landed[s]++; });
      PB.scY.forEach((y, k) => {
        const u = outBack(prog(t, T.psc(k), T.psc(k) + .5), 1.4); if (u <= 0) return;
        g.save(); g.translate(PB.scX, y); g.scale(u, u);
        glass(0, 0, 230, 140, 12, 1, 'rgba(255,255,255,.25)');
        g.fillStyle = ['rgba(65,182,230,.55)', 'rgba(252,218,52,.55)', 'rgba(245,61,71,.55)'][k]; g.beginPath(); g.roundRect(-115, -70, 230, 22, [12, 12, 0, 0]); g.fill();
        g.fillStyle = 'rgba(255,255,255,.18)'; for (let i = 0; i < 3; i++) g.fillRect(-90, -30 + i * 24, [150, 110, 130][(i + k) % 3], 9);
        g.fillStyle = 'rgba(255,255,255,.25)'; g.fillRect(-6, 70, 12, 22); g.fillRect(-40, 90, 80, 6);
        g.restore();
        for (let i = 0; i < Math.min(landed[k], 6); i++) { // Stapel
          g.save(); g.translate(PB.scX + 168, y + 58 - i * 11); g.rotate(((i * 37 + k * 11) % 9 - 4) * .02);
          g.fillStyle = '#E9EEF3'; g.strokeStyle = 'rgba(0,0,0,.25)'; g.lineWidth = 1; g.beginPath(); g.rect(-30, -5, 60, 9); g.fill(); g.stroke(); g.restore();
        }
      });
      // Fehlende Verbindung zwischen den Systemen
      const ma = prog(t, T.mism, T.mism + .5);
      if (ma > 0) for (let k = 0; k < 2; k++) {
        const y0 = PB.scY[k] + 40, y1 = PB.scY[k + 1] - 40, xm = PB.scX - 150, blink = .55 + .45 * Math.cos((t - T.mism) * 5 + k);
        g.save(); g.globalAlpha = ma * blink; g.strokeStyle = RED; g.lineWidth = 2.4; g.setLineDash([8, 9]); g.beginPath(); g.moveTo(PB.scX - 115, y0 + 10); g.quadraticCurveTo(xm - 40, (y0 + y1) / 2, PB.scX - 115, y1 - 10); g.stroke(); g.setLineDash([]);
        g.fillStyle = RED; g.font = font(30, 800); g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('?', xm - 42, (y0 + y1) / 2); g.restore();
      }
      // Schlagworte
      S.kw3.forEach((s, k) => {
        const x = [-560, 0, 560][k], w = text(s, x + 14, 412, 40, t, T.kw(k), 99, { w: 700 });
        const u = outBack(prog(t, T.kw(k), T.kw(k) + .4), 2); if (u > 0 && w) { g.fillStyle = RED; g.beginPath(); g.arc(x + 14 - w / 2 - 22, 412 + capMid(40, 700), 8 * u, 0, 7); g.fill(); }
      });
    },
    post(t) {
      PB.chY.forEach((y, k) => drawIcon(ICON[PB.chIcon[k]], PB.chX, y, 42, prog(t, T.pch(k) + .1, T.pch(k) + .7), '#fff', 1.7));
      // Uhrzeiger im grauen Ring
      const R = L('problem', t), ca = prog(t, 20.2, 20.8) * (1 - prog(t, T.recolor[0], T.recolor[0] + .4));
      if (ca > 0) {
        const ticks = Math.max(0, Math.floor((t - T.tick0) * 2)), frac = (t - T.tick0) * 2 - ticks, snap = t > T.tick0 ? outBack(clamp(frac * 6), 2.5) : 0;
        const am = ((ticks + snap) * 30) * Math.PI / 180, ah = (t - 20) * .25;
        g.save(); g.translate(R.x, R.y); g.globalAlpha = ca; g.strokeStyle = '#fff'; g.lineCap = 'round';
        g.lineWidth = 4; g.beginPath(); g.moveTo(0, 0); g.lineTo(Math.sin(ah) * 18, -Math.cos(ah) * 18); g.stroke();
        g.lineWidth = 3; g.beginPath(); g.moveTo(0, 0); g.lineTo(Math.sin(am) * 30, -Math.cos(am) * 30); g.stroke();
        g.fillStyle = '#fff'; g.beginPath(); g.arc(0, 0, 4.5, 0, 7); g.fill(); g.restore();
      }
      // Zettel fliegen von den Kanälen auf die Bildschirme
      FLIGHTS.forEach(([c, s], n) => {
        const t0 = T.flight(n), u = prog(t, t0, t0 + .95); if (u <= 0 || u >= 1) return;
        const p0 = [PB.chX + 60, PB.chY[c]], p3 = [PB.scX - 120, PB.scY[s] + 10], up = (n % 2 ? -1 : 1) * 170;
        const e = inOutCubic(u), [x, y] = bez(p0, [p0[0] + 300, p0[1] + up], [p3[0] - 300, p3[1] - up], p3, e);
        g.save(); g.translate(x, y); g.rotate(Math.sin(e * 6 + n) * .5); g.globalAlpha = Math.min(1, u * 8, (1 - u) * 8);
        g.fillStyle = '#F2F5F8'; g.beginPath(); g.roundRect(-14, -18, 28, 36, 3); g.fill();
        g.fillStyle = 'rgba(30,40,55,.45)'; for (let i = 0; i < 3; i++) g.fillRect(-9, -10 + i * 8, i === 2 ? 11 : 18, 3);
        g.restore();
      });
    }
  },
  how: {
    pre(t) {
      softGlow(HW.hub[0], HW.hub[1], 900, 'rgba(40,140,210,A)', .2 * prog(t, 30.4, 31.4));
      text(S.head4, 0, -445, 56, t, TX.head4[0], 99, { w: 800 });
      const [hx, hy] = HW.hub, R = HW.hubR;
      // Bahnen
      HW.chY.forEach((y, k) => { dotted(CH_IN[k], 0, inOutCubic(prog(t, T.hch(k) + .3, T.hch(k) + .9)), .35); });
      HW.dY.forEach((y, k) => { dotted(D_OUT[k], 0, inOutCubic(prog(t, T.hd(k) + .2, T.hd(k) + .8)), .35); });
      // Kanäle
      HW.chY.forEach((y, k) => { station(HW.chX, y, 48, T.hch(k), 0); text(HW.chLabel[k], HW.chX, y + 72, 26, t, T.hch(k) + .2, 99, { w: 600, col: SOFT }); });
      // Ziele
      HW.dY.forEach((y, k) => {
        let fl = 0; DISP.forEach((d, n) => { if (d === k) fl = Math.max(fl, decay(t, T.disp(n) + .8, .35)); });
        station(HW.dX, y, 54, T.hd(k), clamp(fl * 1.5)); text(HW.dLabel[k], HW.dX, y + 82, 28, t, T.hd(k) + .2, 99, { w: 600, col: SOFT });
        if (fl > .02) softGlow(HW.dX, y, 120, 'rgba(65,182,230,A)', .35 * fl);
      });
      // Bestandskarte
      const cu = outBack(prog(t, T.card, T.card + .5), 1.3);
      if (cu > 0) {
        const [cx, cy] = HW.card;
        dotted([[hx, hy + R + 8], [cx, cy - 62]], 0, 1, .5 * cu);
        g.save(); g.translate(cx, cy); g.scale(cu, cu);
        glass(0, 0, 440, 118, 18, 1);
        g.font = font(26, 700); g.textAlign = 'left'; g.textBaseline = 'middle'; g.fillStyle = SOFT; g.fillText(S.stock, -196, -26); const stockW = g.measureText(S.stock).width;
        g.font = font(20, 600); g.fillStyle = BLUE; g.fillText(S.realtime, Math.max(-84, -196 + stockW + 18), -26);
        // Füllstand bewegt sich mit jeder ankommenden Bestellung
        const lvl = .72, fillU = outCubic(prog(t, T.card + .25, T.card + 1.6));   // eine monotone Füllung, kein Zurückspringen
        g.fillStyle = 'rgba(255,255,255,.12)'; g.beginPath(); g.roundRect(-196, 14, 392, 16, 8); g.fill();
        const bg2 = g.createLinearGradient(-196, 0, 196, 0); bg2.addColorStop(0, BLUE); bg2.addColorStop(1, GREEN); g.fillStyle = bg2; g.beginPath(); g.roundRect(-196, 14, 392 * lvl * fillU, 16, 8); g.fill();
        const ok = prog(t, T.avail, T.avail + .25);
        if (ok < 1) { g.globalAlpha = 1 - ok; g.font = font(22, 600); g.fillStyle = SOFT; g.textAlign = 'right'; g.fillText(S.checking, 196, -26); g.globalAlpha = 1; }
        if (ok > 0) {
          g.font = font(22, 700); const tw = g.measureText(S.available).width, padL = 12, ico = 20, gap = 6, padR = 16, cw = padL + ico + gap + tw + padR;
          const s = outBack(ok, 2.2); g.save(); g.translate(196 - cw / 2, -26); g.scale(s, s); g.fillStyle = GREEN; g.beginPath(); g.roundRect(-cw / 2, -17, cw, 34, 17); g.fill();
          g.save(); g.translate(-cw / 2 + padL, -ico / 2); g.scale(ico / 256, ico / 256); g.fillStyle = '#fff'; g.fill(ICON.check); g.restore();
          g.fillStyle = '#fff'; g.textAlign = 'left'; g.textBaseline = 'middle'; g.fillText(S.available, -cw / 2 + padL + ico + gap, 1); g.restore();
        }
        g.restore();
      }
      // Bildunterschriften 1–3 mit Nummer
      caption(t, 1, S.cap1, TX.cap1);
      caption(t, 2, S.cap2, TX.cap2);
      caption(t, 3, S.cap3, TX.cap3, S.cap3sub);
    },
    post(t) {
      HW.chY.forEach((y, k) => drawIcon(ICON[HW.chIcon[k]], HW.chX, y, 38, prog(t, T.hch(k) + .1, T.hch(k) + .7), '#fff', 1.7));
      HW.dY.forEach((y, k) => drawIcon(ICON[HW.dIcon[k]], HW.dX, y, 42, prog(t, T.hd(k) + .1, T.hd(k) + .7), '#fff', 1.7));
      // Bestellungen strömen ein
      STREAM.forEach(s => { const u = prog(t, s.t, s.t + .9); if (u <= 0 || u >= 1) return; const [x, y] = ptAt(CH_IN[s.c], inOutCubic(u)); glowDot(x, y, 6.5, RINGC[s.c], Math.min(1, u * 6, (1 - u) * 5)); });
      // Aufträge gehen raus
      DISP.forEach((d, n) => { const u = prog(t, T.disp(n), T.disp(n) + .8); if (u <= 0 || u >= 1) return; const [x, y] = ptAt(D_OUT[d], inOutCubic(u)); glowDot(x, y, 7, RINGC[(n + 2) % 6], Math.min(1, u * 6, (1 - u) * 5)); });
      hubLabel(t, 'how');
    }
  },
  can: {
    pre(t) {
      softGlow(CN.hub[0], CN.hub[1], 900, 'rgba(40,140,210,A)', .18);
      text(S.head5, 0, -440, 56, t, TX.head5[0], 99, { w: 800 });
      CN.pos.forEach(([x, y], k) => {
        const t0 = T.cards(k), u = outBack(prog(t, t0, t0 + .5), 1.4); if (u <= 0) return;
        const pts = C_OUT[k]; dotted(pts, 0, inOutCubic(prog(t, t0 - .25, t0 + .15)), .4);
        for (let j = 0; j < 3; j++) { const q = ((t - t0 - .3) * .55 + j / 3) % 1; if (t > t0 + .3) glowDot(...ptAt(pts, q), 4.5, RINGC[k + 1], .8 * Math.min(1, q * 6, (1 - q) * 6)); }
        g.save(); g.translate(x, y); g.scale(u, u);
        glass(0, 0, 548, 150, 22, 1);
        g.beginPath(); g.arc(-200, 0, 46, 0, 7); g.fillStyle = 'rgba(65,182,230,.16)'; g.fill(); g.strokeStyle = 'rgba(65,182,230,.6)'; g.lineWidth = 2; g.stroke();
        g.restore();
        const ln = CN.lines[k];
        text(ln.join('\n'), x - 130, y - (ln.length - 1) * 20, 36, t, t0 + .15, 99, { w: 700, align: 'left', lh: 40 });
      });
      text(S.foot5, 0, 405, 50, t, TX.foot5[0], 99, { w: 700 });
    },
    post(t) {
      CN.pos.forEach(([x, y], k) => drawIcon(ICON[CN.icon[k]], x - 200, y, 46, prog(t, T.cards(k) + .1, T.cards(k) + .7), '#fff', 1.7));
      hubLabel(t, 'can');
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
      g.save(); g.globalAlpha = prog(t, 55.8, 56.3) * .35; g.strokeStyle = '#fff'; g.lineWidth = 2; g.beginPath(); g.moveTo(250, GN.base + 2); g.lineTo(770, GN.base + 2); g.stroke(); g.restore();
      GN.bx.forEach((x, k) => {
        const h = GN.bh[k] * outCubic(prog(t, T.bar(k), T.bar(k) + 1.0)); if (h <= 0) return;
        const gr = g.createLinearGradient(0, GN.base - h, 0, GN.base); gr.addColorStop(0, RINGC[k]); gr.addColorStop(1, 'rgba(255,255,255,.04)');
        g.fillStyle = gr; g.beginPath(); g.roundRect(x - 38, GN.base - h, 76, h, [12, 12, 0, 0]); g.fill();
      });
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
        g.font = font(100, 300); const mc = g.measureText(S.claim), px = 100 * (CLAIM.right - CLAIM.x) / mc.actualBoundingBoxRight;  // feste Breite wie im freigegebenen Video (unabhängig von der Browser-Version)
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
  if (t < t0 || (t > t1 && t1 < WHIPS[3][0])) return;
  g.save(); g.font = font(46, 700); const plain = s.replace(/\*/g, ''), w = g.measureText(plain).width; g.restore();
  const y = sub ? 380 : 400, bx = -w / 2 - 44, fadeOut = t1 >= WHIPS[3][0] ? 1 : 1 - prog(t, t1 - .3, t1);
  const u = outBack(prog(t, t0, t0 + .4), 2) * fadeOut;
  if (u > 0) { g.save(); g.globalAlpha = fadeOut; g.translate(bx, Math.round(y) + capMid(46, 700)); g.scale(u, u); g.fillStyle = BLUE; g.beginPath(); g.arc(0, 0, 25, 0, 7); g.fill(); g.fillStyle = '#fff'; g.font = font(28, 800); g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(String(n), 0, 1); g.restore(); }
  text(s, 22, y, 46, t, t0 + .1, t1, { w: 700, fade: t1 < WHIPS[3][0] });
  if (sub) text(sub, 0, y + 58, 34, t, t0 + 1.2, t1, { w: 500, col: SOFT });
}
function hubLabel(t, s) {
  const R = L(s, t), a = prog(t, 30.5, 31.1); if (a <= 0) return;
  g.save(); g.globalAlpha = a; g.font = font(R.r * .27, 800); g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = '#fff'; g.fillText('OMS', R.x, R.y + 1); g.restore();
}
// Bahnen Szene 4/5
const hubEdge = (hub, r, dy, side) => [hub[0] + side * Math.sqrt(r * r - dy * dy), hub[1] + dy];
const CH_IN = HW.chY.map(y => { const dy = (y + 15) * .28, e = hubEdge(HW.hub, HW.hubR - 6, dy, -1); return curve([[HW.chX + 54, y], [HW.chX + 260, y], [e[0] - 200, e[1]], e]); });
const D_OUT = HW.dY.map(y => { const dy = (y + 10) * .3, e = hubEdge(HW.hub, HW.hubR - 6, dy, 1); return curve([e, [e[0] + 200, e[1]], [HW.dX - 260, y], [HW.dX - 60, y]]); });
const C_OUT = CN.pos.map(([x, y]) => { const sx = Math.sign(x), dy = clamp(y * .35, -80, 80), e = hubEdge(CN.hub, CN.hubR - 4, dy, sx); return curve([e, [e[0] + sx * 140, e[1]], [x - sx * 380, y], [x - sx * 276, y]]); });

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
  for (const [a, b] of WHIPS) if (t > a && t < b && a !== WHIPS[2][0]) {
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
