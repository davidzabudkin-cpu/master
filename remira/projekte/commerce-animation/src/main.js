// REMIRA-Commerce-Plattform als Motion-Video (25.11.2026, aus der Plattform-Animation abgeleitet). Alles Vektor in Canvas, jede Frame hängt nur von t ab (timeline.js).
// Hausregeln (Skill remira-erklaervideo): regelmäßige Sechsecke, Phosphor light (bold nur auf farbigen Flächen), Text steht still, kein Motion Blur, erst lesen lassen, Blickführung.
import { W, H, C, RINGC, CHALLENGES, BENEFITS, MODULES, MOD_A, NMOD, INNER, RING_TOP, RING_BOTTOM, CHIP } from './data.js';
import { T, camAt, out as outro } from './timeline.js';
import { phosphorPath } from './phosphor-icons.js';
import { phosphorPathBold } from './phosphor-icons-bold.js';
import { prog, clamp, lerp, outCubic, outBack, inOutCubic, rng } from './lib/ease.js';

const scale = Number(new URLSearchParams(location.search).get('scale')) || 1;
const canvas = document.getElementById('c');
canvas.width = Math.max(2, 2 * Math.round(W * scale / 2)); canvas.height = Math.max(2, 2 * Math.round(H * scale / 2));
const out = canvas.getContext('2d');
const scn = new OffscreenCanvas(canvas.width, canvas.height);
const g = scn.getContext('2d');

// ---------- Assets ----------
const FONT = '"Source Sans 3"';
{ const f = new FontFace('Source Sans 3', 'url(../assets/fonts/SourceSans3/SourceSans3-wght-latin.woff2)', { weight: '200 900' }); await f.load(); document.fonts.add(f); await document.fonts.ready; }
const font = (px, w = 700) => `${w} ${px}px ${FONT}`;
// Logo-Ring: Original-SVG lesen → sechs Blätter mit ihren Verläufen
const LOGO = { cx: 159.5, cy: 146, petals: [] };
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
}

// ---------- Icons: Phosphor light (Original-Pfade, Flächen im 256er-Raster); kleine Icons auf dem grünen Kreis bold ----------
const ICON = new Proxy({}, { get: (c, n) => c[n] || (c[n] = phosphorPath(n)) });
const BOLD = new Proxy({}, { get: (c, n) => c[n] || (c[n] = phosphorPathBold(n)) });
function drawIcon(name, x, y, size, u, col = '#fff') {       // u = 0…1: Pop + Wischblende, Mittelpunkt (x, y)
  if (u <= 0) return;
  const e = outBack(clamp(u * 1.4), 1.6), wipe = clamp(u * 1.6);
  g.save(); g.translate(x, y); g.scale(e, e); g.globalAlpha *= clamp(u * 2.2);
  if (wipe < 1) { g.beginPath(); g.rect(-size / 2 - 2, -size / 2 - 2, (size + 4) * wipe, size + 4); g.clip(); }
  g.translate(-size / 2, -size / 2); g.scale(size / 256, size / 256); g.fillStyle = col; g.fill(typeof name === 'string' ? ICON[name] : name); g.restore();
}

// ---------- Geometrie: alle Sechsecke regelmäßig (Umkreisradius R, Breite 2R, Höhe √3·R) ----------
const D2R = Math.PI / 180, S3 = Math.sqrt(3);
const pol = (r, aDeg) => [r * Math.sin(aDeg * D2R), -r * Math.cos(aDeg * D2R)];
function roundPoly(pts, r) {
  const p = new Path2D(), n = pts.length, m = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2], s = m(pts[n - 1], pts[0]);
  p.moveTo(s[0], s[1]);
  for (let i = 0; i < n; i++) { const a = pts[i], b = m(a, pts[(i + 1) % n]); p.arcTo(a[0], a[1], b[0], b[1], r); }
  p.closePath(); return p;
}
const hexReg = (R, rot = 0) => Array.from({ length: 6 }, (_, i) => [R * Math.cos((rot + i * 60) * D2R), R * Math.sin((rot + i * 60) * D2R)]);   // rot 0: Spitzen links/rechts
const GEO = { BLK: 500, GO: 432, GI: 330, RC: 140, RM: 218, WH: 86, RT: 112 };
const hh = R => R * S3 / 2;
const RND = .36;      // Eckenradius als Anteil des Umkreisradius, für alle Sechsecke gleich (weich wie im Original)
const BLK = roundPoly(hexReg(GEO.BLK), GEO.BLK * RND), GO = roundPoly(hexReg(GEO.GO), GEO.GO * RND), GI = roundPoly(hexReg(GEO.GI), GEO.GI * RND), WHX = roundPoly(hexReg(GEO.WH, 30), GEO.WH * .3);
const GREEN = new Path2D(); GREEN.addPath(GO); GREEN.addPath(GI);
const RINGY = Math.round((hh(GEO.GO) + hh(GEO.GI)) / 2);
const PANEL = { x: 910, y: 380, r: 34 };
const LX = -792, LIX = -852, RX = 808, RIX = 862, TXT = 32, LH = 38, SIC = 58;
g.font = font(TXT);
const CHW = CHALLENGES.map(c => Math.max(...c.lines.map(l => g.measureText(l).width)));
const BEW = BENEFITS.map(c => Math.max(...c.lines.map(l => g.measureText(l).width)));
// Impuls-Bahnen: links von den Herausforderungen bis an den Rand des grünen Rings, rechts vom Rand zu den Vorteilen
const bez = (p0, p1, p2, p3, n = 56) => Array.from({ length: n + 1 }, (_, i) => { const u = i / n, v = 1 - u; return [v * v * v * p0[0] + 3 * v * v * u * p1[0] + 3 * v * u * u * p2[0] + u * u * u * p3[0], v * v * v * p0[1] + 3 * v * v * u * p1[1] + 3 * v * u * u * p2[1] + u * u * u * p3[1]]; });
const edgeX = ye => { const r = GEO.GO * RND, cx = GEO.GO - r * 2 / S3, y = Math.abs(ye); return (y < r / 2 ? cx + Math.sqrt(r * r - y * y) : GEO.GO - y / S3) + 6; };   // Rand des grünen Rings inkl. Rundung
const FLOW_L = CHALLENGES.map((c, k) => { const ye = c.y * .3, xe = -edgeX(ye), x0 = LX + CHW[k] + 26; return bez([x0, c.y], [x0 + 100, c.y], [xe - 130, ye], [xe, ye]); });
const FLOW_R = BENEFITS.map((c, k) => { const ye = c.y * .3, xe = edgeX(ye), x1 = RX - BEW[k] - 26; return bez([xe, ye], [xe + 130, ye], [x1 - 100, c.y], [x1, c.y]); });
function polyPart(pts, a, b) {
  a = clamp(a); b = clamp(b); if (b <= a) return false;
  const n = pts.length - 1, at = u => { const f = u * n, i = Math.min(n - 1, Math.floor(f)), q = f - i; return [lerp(pts[i][0], pts[i + 1][0], q), lerp(pts[i][1], pts[i + 1][1], q)]; };
  g.beginPath(); const s = at(a); g.moveTo(s[0], s[1]);
  for (let i = Math.ceil(a * n + 1e-6); i < b * n; i++) g.lineTo(pts[i][0], pts[i][1]);
  const e = at(b); g.lineTo(e[0], e[1]); return true;
}

// ---------- Text ----------
// Innerer Kreis: Icon + Wort als eine Gruppe auf der Mittellinie des Bogens, Gruppe mittig im Segment.
// dir 1: im Uhrzeigersinn, Köpfe außen; −1: gegen den Uhrzeigersinn, Köpfe innen (unten lesbar). Icon immer direkt vor dem Wort.
const ARC = { px: 19, ic: 22, gap: 8, sp: .8 };
function arcGroup(s, t, tIn) {
  const r = GEO.RT, u = outCubic(prog(t, tIn, tIn + .45)); if (u <= 0) return;
  g.save(); g.globalAlpha *= u;
  g.font = font(ARC.px, 700); g.fillStyle = C.ink; g.textAlign = 'center'; g.textBaseline = 'middle';
  const ch = [...s.label], ws = ch.map(c => g.measureText(c).width + ARC.sp), tot = ARC.ic + ARC.gap + ws.reduce((a, b) => a + b, 0);
  let a = s.a * D2R - s.dir * tot / 2 / r;
  const place = (ang, fn) => { g.save(); g.rotate(ang); g.translate(0, -r); if (s.dir < 0) g.rotate(Math.PI); fn(); g.restore(); };
  place(a + s.dir * ARC.ic / 2 / r, () => drawIcon(BOLD[s.icon], 0, 0, ARC.ic, prog(t, tIn, tIn + .5), C.ink));
  a += s.dir * (ARC.ic + ARC.gap) / r;
  ch.forEach((c, i) => { place(a + s.dir * ws[i] / 2 / r, () => g.fillText(c, 0, 1)); a += s.dir * ws[i] / r; });
  g.restore();
}
function typeText(s, x, y, px, col, u) {                // schreibt sich Buchstabe für Buchstabe, mittig, steht dabei still
  if (u <= 0) return;
  g.font = font(px, 700); g.textAlign = 'left'; g.textBaseline = 'middle'; g.fillStyle = col;
  const tot = g.measureText(s).width, n = s.length, f = u * n, cx = Math.round(x - tot / 2);
  const b0 = g.globalAlpha;
  for (let i = 0; i < n; i++) { const a = clamp(f - i); if (a <= 0) break; g.globalAlpha = b0 * a; g.fillText(s[i], cx + g.measureText(s.slice(0, i)).width, y); }
  g.globalAlpha = b0;
  if (u < 1) { const w = g.measureText(s.slice(0, Math.ceil(f))).width; g.globalAlpha = b0 * .7; g.fillRect(cx + w + 3, y - px * .42, 2.5, px * .84); g.globalAlpha = b0; }
}
function wedge(a0, a1, r0, r1) { g.beginPath(); g.arc(0, 0, r1, a0 * D2R - Math.PI / 2, a1 * D2R - Math.PI / 2); g.arc(0, 0, r0, a1 * D2R - Math.PI / 2, a0 * D2R - Math.PI / 2, true); g.closePath(); }
const decay = (t, t0, d) => t < t0 ? 0 : Math.exp(-(t - t0) / d);

// ---------- Szene ----------
function sideItem(c, k, left, t) {
  const t0 = left ? T.ch(k) : T.be(k); if (t < t0) return;
  const u = outCubic(prog(t, t0, t0 + .5)), a = prog(t, t0, t0 + .3), dx = Math.round((left ? -1 : -1) * (1 - u) * 70);
  const n = c.lines.length, y0 = c.y - (n - 1) * LH / 2;
  // Blickführung: der gerade erscheinende Punkt ist hell, die vorherigen treten zurück, bis alle Punkte einer Seite da sind
  const tn = left ? (k < 3 ? T.ch(k + 1) : T.flow) : (k < 3 ? T.be(k + 1) : T.settle), tAll = left ? T.flow : T.settle - .6;
  const foc = outro(t, T.oText);   // Loop-Ende: Texte links/rechts blenden zuerst aus
  g.save(); g.globalAlpha = a * foc; g.translate(dx, 0);
  g.font = font(TXT, 700); g.fillStyle = '#fff'; g.textBaseline = 'middle'; g.textAlign = left ? 'left' : 'right';
  g.shadowColor = 'rgba(8,50,70,.35)'; g.shadowBlur = 10 * scale; g.shadowOffsetY = 2 * scale;
  c.lines.forEach((l, i) => g.fillText(l, left ? LX : RX, Math.round(y0 + i * LH) + 1));
  g.shadowColor = 'transparent';
  drawIcon(c.icon, left ? LIX : RIX, c.y, SIC, prog(t, t0 + .1, t0 + .6), '#fff');     // Icon vertikal mittig zum Textblock
  g.restore();
}

function flows(t) {
  g.save(); g.lineCap = 'round'; g.lineJoin = 'round';
  const aL = 1 - prog(t, T.hit + .35, T.hit + 1.05), aR = 1 - prog(t, T.settle - .45, T.settle);
  if (t >= T.flow && aL > 0) FLOW_L.forEach((pts, k) => {
    const u = inOutCubic(prog(t, T.flow + k * .08, T.flow + k * .08 + .6));
    g.globalAlpha = aL * .55; g.strokeStyle = '#fff'; g.lineWidth = 2.4; g.setLineDash([.01, 8]); if (polyPart(pts, 0, u)) g.stroke(); g.setLineDash([]);
    for (const d of [0, .32, .64]) pulse(pts, prog(t, T.flow + .42 + k * .06 + d, T.hit + k * .06 + d), aL, RINGC[(k + 5) % 6]);
  });
  if (t >= T.out && aR > 0) FLOW_R.forEach((pts, k) => {
    const u = inOutCubic(prog(t, T.out + k * .08, T.out + k * .08 + .55));
    g.globalAlpha = aR * .55; g.strokeStyle = '#fff'; g.lineWidth = 2.4; g.setLineDash([.01, 8]); if (polyPart(pts, 0, u)) g.stroke(); g.setLineDash([]);
    for (const d of [0, .3]) pulse(pts, prog(t, T.be(k) - .52 + d, T.be(k) + .04 + d), aR, RINGC[(k + 2) % 6]);
  });
  g.restore();
}
function pulse(pts, q, a, col) {
  if (q <= 0 || q >= 1) return;
  const e = inOutCubic(q), fade = Math.min(1, q * 6, (1 - q) * 6);
  g.save(); g.globalAlpha = a * fade; g.shadowColor = col; g.shadowBlur = 16 * scale; g.strokeStyle = '#fff'; g.lineWidth = 4.2;
  if (polyPart(pts, e - .13, e)) g.stroke(); g.restore();
}

function drawScene(t) {
  const cam = camAt(t);
  g.setTransform(scale, 0, 0, scale, 0, 0); g.globalAlpha = 1; g.globalCompositeOperation = 'source-over'; g.setLineDash([]); g.shadowColor = 'transparent'; g.filter = 'none';
  // Hintergrund: dasselbe Schwarz wie das große Sechseck, damit es mit dem Grund verschmilzt (wie im Original)
  g.fillStyle = '#000'; g.fillRect(0, 0, W, H);
  g.translate(W / 2, H / 2); g.rotate(cam.rot); g.scale(cam.z, cam.z);

  // Blaue Fläche: öffnet sich hinter dem Sechseck nach beiden Seiten
  const pu = inOutCubic(prog(t, T.panel[0], T.panel[1])) * outro(t, T.oPanel);   // Loop-Ende: blaue Fläche schließt sich hinter dem Sechseck
  if (pu > 0) {
    const hw = lerp(300, PANEL.x + 2, pu);
    g.save(); g.globalAlpha *= outro(t, [T.oPanel[0] + .3, T.oPanel[1]]); g.beginPath(); g.rect(-hw, -600, 2 * hw, 1200); g.clip();   // Loop-Ende: schließt und blendet aus (keine blauen Reste)
    const bl = g.createLinearGradient(-PANEL.x, -PANEL.y, PANEL.x, PANEL.y); bl.addColorStop(0, '#31A6D1'); bl.addColorStop(.5, '#2A9AC4'); bl.addColorStop(1, '#2189B4');
    g.fillStyle = bl; g.beginPath(); g.roundRect(-PANEL.x, -PANEL.y, 2 * PANEL.x, 2 * PANEL.y, PANEL.r); g.fill();
    const sh = g.createLinearGradient(0, -PANEL.y, 0, PANEL.y); sh.addColorStop(0, 'rgba(255,255,255,.10)'); sh.addColorStop(.35, 'rgba(255,255,255,0)'); sh.addColorStop(1, 'rgba(0,20,40,.12)'); g.fillStyle = sh; g.fill();
    CHALLENGES.forEach((c, k) => sideItem(c, k, true, t));
    BENEFITS.forEach((c, k) => sideItem(c, k, false, t));
    g.restore();
  }
  // Schwarzes Sechseck
  g.save(); if (pu > 0) { g.shadowColor = 'rgba(0,0,0,.45)'; g.shadowBlur = 40 * scale * cam.z; } g.fillStyle = '#000'; g.fill(BLK); g.restore();
  flows(t);

  // Grüner Ring: zwei Arme von unten, schließen sich oben
  const ru = inOutCubic(prog(t, T.ring[0], T.ring[1])), rA = outro(t, T.oRing);   // Loop-Ende: Ring blendet weich nach außen aus
  if (ru > 0 && rA > 0) {
    g.save(); g.globalAlpha *= rA; const rs = lerp(1.07, 1, rA); g.scale(rs, rs);
    g.save();
    if (ru < 1) { const sw = ru * Math.PI; g.beginPath(); g.moveTo(0, 0); g.arc(0, 0, 700, Math.PI / 2 - sw, Math.PI / 2 + sw); g.closePath(); g.clip(); }
    const gg = g.createLinearGradient(0, -hh(GEO.GO), 0, hh(GEO.GO)); gg.addColorStop(0, '#B6DFA8'); gg.addColorStop(.5, '#A8D59A'); gg.addColorStop(1, '#9ACB8B');
    g.fillStyle = gg; g.fill(GREEN, 'evenodd');
    const fl = decay(t, T.ring[1] - .05, .35) * prog(t, T.ring[1] - .12, T.ring[1] - .05) * .45 + decay(t, T.hit, .4) * prog(t, T.hit - .06, T.hit) * .4;
    if (fl > .01) { g.save(); g.globalAlpha *= fl; g.fillStyle = '#fff'; g.fill(GREEN, 'evenodd'); g.restore(); }
    g.strokeStyle = '#fff'; g.lineWidth = 2.6; g.lineCap = 'round'; g.setLineDash([.01, 6.6]); g.stroke(GO); g.stroke(GI); g.setLineDash([]);
    g.restore();
    if (ru < 1) for (const s of [-1, 1]) { const [x, y] = pol(RINGY + 20, 180 + s * ru * 180); const gl = g.createRadialGradient(x, y, 0, x, y, 70); gl.addColorStop(0, 'rgba(255,255,255,.4)'); gl.addColorStop(1, 'rgba(200,255,190,0)'); g.fillStyle = gl; g.globalCompositeOperation = 'lighter'; g.beginPath(); g.arc(x, y, 70, 0, 7); g.fill(); g.globalCompositeOperation = 'source-over'; }
    typeText(RING_TOP, 0, -RINGY, 30, C.ink, prog(t, T.omni[0], T.omni[1]));
    typeText(RING_BOTTOM, 0, RINGY, 30, C.ink, prog(t, T.scm[0], T.scm[1]));
    g.restore();
  }

  // Module im inneren Sechseck
  const mA = outro(t, T.oMods); g.save(); g.globalAlpha *= mA; g.clip(GI);
  for (let k = 0; k < NMOD; k++) {
    const tm = T.mod(k), a = MOD_A(k), half = 180 / NMOD; if (t < tm - .05) continue;
    const hl = prog(t, tm - .05, tm + .12) * decay(t, tm + .12, .55);
    if (hl > .01) { const rg = g.createRadialGradient(0, 0, 130, 0, 0, 320); rg.addColorStop(0, `rgba(168,213,154,${.38 * hl})`); rg.addColorStop(1, 'rgba(168,213,154,0)'); g.fillStyle = rg; wedge(a - half, a + half, 130, 340); g.fill(); }
  }
  // gepunktete Trenner: beginnen am Kreisrand + 12 px, enden an der Sechseck-Kante (Clip)
  g.strokeStyle = '#fff'; g.lineWidth = 2.5; g.lineCap = 'round'; g.lineJoin = 'round';
  for (let k = 0; k < NMOD; k++) {
    const td = k === NMOD - 1 ? T.mod(0) : T.mod(k) + .1, u = outCubic(prog(t, td, td + .5)); if (u <= 0) continue;
    const a = MOD_A(k) + 180 / NMOD, p0 = pol(GEO.RC + 14, a), p2 = pol(GEO.RC + 14 + 220 * u, a);
    g.setLineDash([.01, 7]); g.beginPath(); g.moveTo(p0[0], p0[1]); g.lineTo(p2[0], p2[1]); g.stroke();
  }
  g.setLineDash([]); g.restore();
  // jedes Modul gleich aufgebaut: Icon 42 px mittig über dem Label, fester Abstand, Label zweizeilig zentriert
  g.save(); g.globalAlpha *= mA; const ms = lerp(.92, 1, mA); g.scale(ms, ms);
  MODULES.forEach((m, k) => {
    const tm = T.mod(k); if (t < tm) return;
    // Seitliche Module: Gruppe waagerecht mittig zwischen innerem Kreis und Sechseck-Kante (sonst berühren lange Labels wie „Merchandise“ eine Kante)
    let p = pol(GEO.RM, MOD_A(k));
    if (MOD_A(k) % 180 !== 0) {
      const y = pol(200, MOD_A(k))[1]; g.save(); g.font = font(20, 700); const hw = Math.max(...m.lines.map(l => g.measureText(l).width)) / 2; g.restore();
      const yb = Math.abs(y) + (y > 0 ? 36 : 12), xout = GEO.GI - yb / S3 - 16, xin = Math.sqrt(Math.max(0, (GEO.RC + 10) ** 2 - (y < 0 ? Math.abs(y) - 36 : Math.abs(y) + 11) ** 2));   // Label-Zeile, die dem Kreis am nächsten ist
      p = [Math.sign(p[0]) * Math.max(xin + hw, Math.min((xin + xout) / 2, xout - hw)), y];   // Label: ≥ 16 px zur Sechseck-Kante, ≥ 10 px zum Kreis
    }
    const mx = Math.round(p[0]), my = Math.round(p[1]);
    drawIcon(m.icon, mx, my - 30, 42, prog(t, tm, tm + .5), C.green);
    g.save(); g.font = font(20, 700); g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = '#fff';
    m.lines.forEach((l, i) => { const u = outCubic(prog(t, tm + .16 + i * .1, tm + .5 + i * .1)); if (u <= 0) return; g.globalAlpha = u * mA; g.fillText(l, mx, my + 11 + i * 24 + Math.round((1 - u) * 8)); });
    g.restore();
  });

  // Innerer grüner Kreis: dreht sich ein, danach erscheinen die vier Segment-Gruppen
  g.restore();
  const du = prog(t, T.disc[0], T.disc[1]) * outro(t, T.oDisc);   // Loop-Ende: innerer Kreis dreht sich heraus
  if (du > 0) {
    const e = outCubic(du), sc = lerp(.55, 1, outBack(clamp(du * 1.25), 1.2)), R = GEO.RC;
    g.save(); g.rotate(-(1 - e) * 2.6); g.scale(sc, sc); g.globalAlpha = clamp(du * 4);
    const dg = g.createRadialGradient(0, 0, 60, 0, 0, R); dg.addColorStop(0, '#B9E0AB'); dg.addColorStop(1, '#A3D194'); g.fillStyle = dg; g.beginPath(); g.arc(0, 0, R, 0, 7); g.fill();
    g.strokeStyle = '#fff'; g.lineWidth = 4; g.lineCap = 'butt'; g.beginPath(); g.arc(0, 0, R, 0, 7); g.stroke();
    g.lineWidth = 3; for (const a of [0, 90, 180, 270]) { const p0 = pol(60, a), p1 = pol(R, a); g.beginPath(); g.moveTo(p0[0], p0[1]); g.lineTo(p1[0], p1[1]); g.stroke(); }
    INNER.forEach((s, k) => arcGroup(s, t, T.inner(k)));
    g.restore();
  }

  // Zentrum: Leuchten, weißes Sechseck, Ring aus der Bildmarke, AI-Chip
  const lit = prog(t, .3, 1.3) * outro(t, [T.oPetal(5)[0], T.oPetal(5)[1] + .2]), hx = prog(t, T.hex, T.hex + .5) * outro(t, T.oHex);
  const glowA = .5 * lit * (1 - .75 * prog(t, 2.6, 4.2)) + .5 * decay(t, T.hex, .35) * (t >= T.hex ? 1 : 0) + .45 * decay(t, T.hit, .5) * prog(t, T.hit - .08, T.hit);
  if (glowA > .01) {
    g.save(); g.globalCompositeOperation = 'lighter';
    const gl = g.createRadialGradient(0, 0, 10, 0, 0, 300); gl.addColorStop(0, `rgba(120,210,255,${.55 * glowA})`); gl.addColorStop(.4, `rgba(65,182,230,${.22 * glowA})`); gl.addColorStop(1, 'rgba(65,182,230,0)');
    g.fillStyle = gl; g.beginPath(); g.arc(0, 0, 300, 0, 7); g.fill(); g.restore();
  }
  if (hx > 0) { const s = outBack(hx, 1.4); g.save(); g.scale(s, s); g.shadowColor = 'rgba(0,0,0,.28)'; g.shadowBlur = 14 * scale * cam.z; g.fillStyle = '#fff'; g.fill(WHX); g.restore(); }
  const spin = 2 * Math.PI * inOutCubic(prog(t, T.spin[0], T.spin[1]));
  LOGO.petals.forEach((p, k) => {
    const u = prog(t, T.petal(k), T.petal(k) + .7) * outro(t, T.oPetal(k)); if (u <= 0) return;   // Loop-Ende: Blätter drehen sich heraus wie sie hereinkamen
    const e = outBack(u, 1.3), s = 57 / 150;
    g.save(); g.rotate(spin - (1 - outCubic(u)) * 1.9); g.scale(s * e, s * e); g.translate(-LOGO.cx, -LOGO.cy); g.globalAlpha = clamp(u * 3);
    if (hx < 1) { g.shadowColor = RINGC[k]; g.shadowBlur = 26 * scale * cam.z * (1 - hx); }
    g.fillStyle = p.grad; g.fill(p.d); g.restore();
  });
  const au = prog(t, T.ai[0] - .25, T.ai[0] + .15) * outro(t, T.oAI);
  if (au > 0) {
    const bl = Math.max(...T.ai.map(a => decay(t, a, .16) * (t >= a ? 1 : 0)), decay(t, T.hit, .3) * (t >= T.hit ? 1 : 0)), s = .86 * outBack(au, 1.6) * (1 + .14 * bl);
    for (const a of T.ai) { const q = prog(t, a, a + .55); if (q > 0 && q < 1) { g.save(); g.globalAlpha = (1 - q) * .8; g.strokeStyle = '#41B6E6'; g.lineWidth = 3 * (1 - q) + .6; g.beginPath(); g.arc(0, 0, 24 + outCubic(q) * 56, 0, 7); g.stroke(); g.restore(); } }
    g.save(); g.scale(s, s);
    g.fillStyle = '#fff'; g.beginPath(); g.arc(0, 0, 27, 0, 7); g.fill();
    const col = bl > .05 ? `rgb(${Math.round(lerp(18, 26, bl))},${Math.round(lerp(22, 130, bl))},${Math.round(lerp(28, 203, bl))})` : '#12161C';
    g.strokeStyle = col; g.fillStyle = col; g.lineWidth = 2.4; g.lineCap = 'round'; g.lineJoin = 'round';
    g.beginPath(); g.roundRect(-14.5, -14.5, 29, 29, 5.5); g.stroke();
    g.beginPath(); for (const o of [-8, 0, 8]) { g.moveTo(o, -14.5); g.lineTo(o, -20); g.moveTo(o, 14.5); g.lineTo(o, 20); g.moveTo(-14.5, o); g.lineTo(-20, o); g.moveTo(14.5, o); g.lineTo(20, o); } g.stroke();
    g.font = font(16.5, 800); g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(CHIP, 0, 1.2);
    g.restore();
  }
  // Welle durch die Module, wenn die Impulse ankommen
  const wq = prog(t, T.hit, T.hit + .9);
  if (wq > 0 && wq < 1) { g.save(); g.clip(GI); g.globalAlpha = (1 - wq) * .45; g.strokeStyle = '#fff'; g.lineWidth = 8 * (1 - wq) + 1; g.beginPath(); g.arc(0, 0, lerp(140, 330, outCubic(wq)), 0, 7); g.stroke(); g.restore(); }
}

// ---------- Frame: ein scharfes Bild (kein Motion Blur auf Text), statisches Korn ----------
const grainCv = new OffscreenCanvas(256, 256); { const c = grainCv.getContext('2d'), id = c.createImageData(256, 256), r = rng(3); for (let i = 0; i < id.data.length; i += 4) { const v = r() * 255; id.data[i] = id.data[i + 1] = id.data[i + 2] = v; id.data[i + 3] = 9; } c.putImageData(id, 0, 0); }
window.renderFrame = async t => {
  out.setTransform(1, 0, 0, 1, 0, 0); out.globalCompositeOperation = 'source-over'; out.globalAlpha = 1;
  drawScene(t); out.drawImage(scn, 0, 0);
  out.setTransform(canvas.width / W, 0, 0, canvas.height / H, 0, 0);
  const f = Math.max(1 - prog(t, 0, .3), prog(t, T.end - .25, T.end)); if (f > 0) { out.globalAlpha = clamp(f); out.fillStyle = '#000'; out.fillRect(0, 0, W, H); out.globalAlpha = 1; }
  out.save(); out.fillStyle = out.createPattern(grainCv, 'repeat'); out.globalCompositeOperation = 'overlay'; out.fillRect(0, 0, W, H); out.restore();
};
window.grab = (type, quality = .93) => canvas.toDataURL(type, quality);
window.__ready = true;
