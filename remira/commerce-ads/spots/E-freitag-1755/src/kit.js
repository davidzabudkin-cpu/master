// REMIRA Commerce Ad-Kit (26.11.2026): gemeinsamer Rahmen aller Kampagnen-Spots.
// Format über ?variant=9x16 | 16x9 | 1x1 (Renderer: --variant), Sprache über ?lang=de|en (--lang).
// Alles Vektor in Canvas, jedes Bild hängt nur von t ab. Regeln: Text steht still (ganze Pixel, nur einmaliges Einblenden),
// ein Blickfang pro Moment, REMIRA-Farben, Phosphor light, Logo nur als Original-Datei.
import { prog, clamp, lerp, outCubic, outBack } from './lib/ease.js';
import { phosphorPath } from './phosphor-icons.js';
import { phosphorPathBold } from './phosphor-icons-bold.js';

const q = new URLSearchParams(globalThis.location?.search || '');
export const FMT = q.get('variant') || '9x16';
export const SIZES = { '9x16': [1080, 1920], '16x9': [1920, 1080], '1x1': [1080, 1080] };
export const [W, H] = SIZES[FMT] || SIZES['9x16'];
export { LANG, pick } from './lang.js';
export const BLUE = '#41B6E6', PETROL = '#28ABBA', GREEN = '#61BD47', YELLOW = '#FCDA34', ORANGE = '#FF9524', RED = '#F53D47', GREY = '#A8A8A8', SOFT = '#C9D3DE';
export const FONT = '"Source Sans 3"';
export const font = (px, w = 700) => `${w} ${px}px ${FONT}`;

const scale = Number(q.get('scale')) || 1;
const canvas = document.getElementById('c');
canvas.width = Math.max(2, 2 * Math.round(W * scale / 2)); canvas.height = Math.max(2, 2 * Math.round(H * scale / 2));
export const g = canvas.getContext('2d');

// ---------- Assets ----------
{ const f = new FontFace('Source Sans 3', 'url(../assets/fonts/SourceSans3/SourceSans3-wght-latin.woff2)', { weight: '200 900' }); await f.load(); document.fonts.add(f); await document.fonts.ready; }
// Bildmarke (6 Ring-Blätter mit Verläufen) aus der Original-SVG; Mittelpunkt (159.5, 146), Radius ≈ 160 Einheiten
const PETALS = [];
{
  const txt = await (await fetch('../assets/brand/remira-logo-claim-white.svg')).text();
  const doc = new DOMParser().parseFromString(txt, 'image/svg+xml'), grads = {}, cls = {};
  doc.querySelectorAll('radialGradient').forEach(e => { grads[e.id] = { cx: +e.getAttribute('cx'), cy: +e.getAttribute('cy'), r: +e.getAttribute('r'), stops: [...e.querySelectorAll('stop')].map(s => [+s.getAttribute('offset'), s.getAttribute('stop-color')]) }; });
  for (const m of txt.matchAll(/\.(cls-\d)\{fill:url\(#([^)]+)\)/g)) cls[m[1]] = grads[m[2]];
  const ps = [...doc.querySelectorAll('path')].map(p => ({ c: p.getAttribute('class'), d: new Path2D(p.getAttribute('d')) }));
  for (const c of ['cls-2', 'cls-3', 'cls-6', 'cls-4', 'cls-5', 'cls-7']) {
    const p = ps.find(x => x.c === c), gr = cls[c], grad = g.createRadialGradient(gr.cx, gr.cy, 0, gr.cx, gr.cy, gr.r);
    gr.stops.forEach(([o, col]) => grad.addColorStop(o, col)); PETALS.push({ d: p.d, grad });
  }
}
// Offizielles Logo ohne Claim (Logo-Pack, 1600 × 292 px). Ring darin: Mitte (159.5, 146), Radius 160 px → Übergang Ring → Logo deckungsgleich
const LOGO = await createImageBitmap(await (await fetch('../assets/brand/REMIRA_Logo_white.png')).blob());
export const LOGO_PNG = { w: 1600, h: 292, rx: 159.5, ry: 146, rr: 160 };

// ---------- Icons (Original-Phosphor, MIT) ----------
const ICON = new Proxy({}, { get: (c, n) => c[n] || (c[n] = phosphorPath(n)) });
const BOLD = new Proxy({}, { get: (c, n) => c[n] || (c[n] = phosphorPathBold(n)) });
// u = Einblende-Fortschritt 0…1 (Pop + Wischblende), danach steht das Icon still
export function icon(name, x, y, size, u = 1, col = '#fff', bold = false) {
  if (u <= 0) return;
  const e = u >= 1 ? 1 : outBack(clamp(u * 1.4), 1.6), wipe = clamp(u * 1.6);
  g.save(); g.translate(Math.round(x), Math.round(y)); g.scale(e, e); g.globalAlpha *= clamp(u * 2.2);
  if (wipe < 1) { g.beginPath(); g.rect(-size / 2 - 2, -size / 2 - 2, (size + 4) * wipe, size + 4); g.clip(); }
  g.translate(-size / 2, -size / 2); g.scale(size / 256, size / 256); g.fillStyle = col; g.fill((bold ? BOLD : ICON)[name]); g.restore();
}
export function iconPath(path, x, y, size, col) { g.save(); g.translate(Math.round(x), Math.round(y)); g.translate(-size / 2, -size / 2); g.scale(size / 256, size / 256); g.fillStyle = col; g.fill(path); g.restore(); }

// ---------- Rahmen ----------
export function begin() {
  g.setTransform(canvas.width / W, 0, 0, canvas.height / H, 0, 0);
  g.globalAlpha = 1; g.globalCompositeOperation = 'source-over';
  g.fillStyle = '#000'; g.fillRect(0, 0, W, H);
  // ruhiger Grund: Schwarz mit leichtem Navy-Schimmer in der Mitte (statisch, kein Korn, keine Partikel)
  const gr = g.createRadialGradient(W / 2, H * .48, 0, W / 2, H * .48, Math.max(W, H) * .7);
  gr.addColorStop(0, 'rgba(15,29,47,.95)'); gr.addColorStop(1, 'rgba(3,6,11,1)');
  g.fillStyle = gr; g.fillRect(0, 0, W, H);
}
export function withA(a, fn) { if (a <= 0) return; g.save(); g.globalAlpha *= a; try { fn(); } finally { g.restore(); } }

// ---------- Text ----------
// Zeilen mit \n, Akzent mit *…*. Wörter erscheinen gestaffelt (kurzer Anstieg, ease-out), danach steht der Text auf ganzen Pixeln still.
// tOut: ab hier 0,3 s ausblenden. Rückgabe: größte Zeilenbreite.
export function text(str, x, y, px, t, t0, o = {}) {
  if (t < t0) return 0;
  const { w = 700, col = '#fff', acc = BLUE, align = 'center', lh = px * 1.14, st = .05, tOut = 1e9, ls = 0 } = o;
  const outA = 1 - prog(t, tOut, tOut + .3); if (outA <= 0) return 0;
  g.save(); const baseA = g.globalAlpha; g.font = font(px, w); g.textBaseline = 'middle'; g.textAlign = 'left'; if (ls) g.letterSpacing = ls + 'px';
  const space = g.measureText(' ').width; let idx = 0, maxW = 0;
  str.split('\n').forEach((line, li) => {
    const words = []; let accent = false;
    line.split(' ').forEach(wd => { const parts = wd.split('*'); const segs = []; parts.forEach((p, pi) => { if (pi) accent = !accent; if (p) segs.push([p, accent]); }); words.push(segs); });
    const widths = words.map(sg => sg.reduce((a, [p]) => a + g.measureText(p).width, 0)), tot = widths.reduce((a, b) => a + b, 0) + space * (words.length - 1);
    maxW = Math.max(maxW, tot);
    let cx = Math.round(align === 'center' ? x - tot / 2 : align === 'right' ? x - tot : x); const cy = Math.round(y + li * lh);
    words.forEach((sg, i) => {
      const u = outCubic(prog(t, t0 + idx * st, t0 + idx * st + .45)); idx++;
      if (u > 0) { g.globalAlpha = baseA * u * outA; let xx = Math.round(cx); for (const [p, a] of sg) { g.fillStyle = a ? acc : col; g.fillText(p, xx, cy + (u >= 1 ? 0 : Math.round((1 - u) * px * .3))); xx += g.measureText(p).width; } }
      cx += widths[i] + space;
    });
  });
  g.restore(); return maxW;
}
export function textW(str, px, w = 700) { g.save(); g.font = font(px, w); const m = g.measureText(str.replace(/\*/g, '')).width; g.restore(); return m; }
// Optische Zeilenmitte (Mitte der Großbuchstaben) relativ zu textBaseline 'middle': dort sitzen Icons/Badges neben Text
export function capMid(px, w = 700) { g.save(); g.font = font(px, w); g.textBaseline = 'middle'; const m = g.measureText('H'); g.restore(); return (m.actualBoundingBoxDescent - m.actualBoundingBoxAscent) / 2; }

// ---------- Bausteine ----------
export function glass(x, y, w, h, r, a = 1, stroke = 'rgba(255,255,255,.18)', lw = 2) {
  if (a <= 0) return;
  g.save(); g.globalAlpha *= a; g.beginPath(); g.roundRect(Math.round(x - w / 2), Math.round(y - h / 2), Math.round(w), Math.round(h), r);
  const gr = g.createLinearGradient(0, y - h / 2, 0, y + h / 2); gr.addColorStop(0, 'rgba(255,255,255,.10)'); gr.addColorStop(1, 'rgba(255,255,255,.04)');
  g.fillStyle = gr; g.fill(); g.strokeStyle = stroke; g.lineWidth = lw; g.stroke(); g.restore();
}
// Chip: Pille mit optionalem Icon links; Breite aus gemessener Textbreite
export function chip(str, x, y, px, u, o = {}) {
  if (u <= 0) return;
  const { fill = BLUE, col = '#fff', iconName = null, bold = true, pad = px * .7 } = o;
  const tw = textW(str, px, 700), iw = iconName ? px * 1.15 : 0, gap = iconName ? px * .4 : 0, w = tw + iw + gap + pad * 2, h = px * 1.9;
  const e = u >= 1 ? 1 : outBack(clamp(u), 1.5);
  g.save(); g.translate(Math.round(x), Math.round(y)); g.scale(e, e); g.globalAlpha *= clamp(u * 2);
  g.beginPath(); g.roundRect(-w / 2, -h / 2, w, h, h / 2); g.fillStyle = fill; g.fill();
  let cx = -w / 2 + pad;
  if (iconName) { iconPath((bold ? BOLD : ICON)[iconName], cx + iw / 2, capMid(px), iw, col); cx += iw + gap; }
  g.font = font(px, 700); g.textBaseline = 'middle'; g.fillStyle = col; g.fillText(str, Math.round(cx), 0);
  g.restore(); return w;
}
// Stempel (schräg, Rahmen + Großbuchstaben): springt einmal auf (1,35 → 1), danach still
export function stamp(str, x, y, px, u, col, rot = -.14) {
  if (u <= 0) return;
  const s = u >= 1 ? 1 : lerp(1.35, 1, outCubic(clamp(u * 1.6)));
  g.save(); g.translate(Math.round(x), Math.round(y)); g.rotate(rot); g.scale(s, s); g.globalAlpha *= clamp(u * 3);
  g.font = font(px, 800); g.letterSpacing = px * .08 + 'px'; const tw = g.measureText(str).width, w = tw + px * 1.1, h = px * 1.7;
  g.beginPath(); g.roundRect(-w / 2, -h / 2, w, h, px * .3); g.fillStyle = 'rgba(0,0,0,.55)'; g.fill(); g.lineWidth = px * .12; g.strokeStyle = col; g.stroke();
  g.fillStyle = col; g.textBaseline = 'middle'; g.textAlign = 'center'; g.fillText(str, px * .04, 0); g.restore();
}
export function softGlow(x, y, r, rgb, a) { if (a <= 0) return; g.save(); g.globalCompositeOperation = 'lighter'; const gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, `rgba(${rgb},${a})`); gr.addColorStop(1, `rgba(${rgb},0)`); g.fillStyle = gr; g.beginPath(); g.arc(x, y, r, 0, 7); g.fill(); g.restore(); }
// gerade Linie, die von a nach b „wächst“ (u 0…1)
export function line(ax, ay, bx, by, u, col = BLUE, lw = 4, dash = null) {
  if (u <= 0) return; g.save(); g.strokeStyle = col; g.lineWidth = lw; g.lineCap = 'round'; if (dash) g.setLineDash(dash);
  g.beginPath(); g.moveTo(ax, ay); g.lineTo(lerp(ax, bx, clamp(u)), lerp(ay, by, clamp(u))); g.stroke(); g.restore();
}

// ---------- Bildmarke (Ring) ----------
// Ring mit Radius r an (x, y). intro = Blätter fliegen gestaffelt ein (0…1), spin in Radiant.
export function ring(x, y, r, { intro = 1, spin = 0, alpha = 1, glow = .25 } = {}) {
  if (alpha <= 0 || intro <= 0) return;
  softGlow(x, y, r * 2.4, '65,182,230', glow * alpha * clamp(intro * 1.5));
  const s = r / 160;
  PETALS.forEach((p, k) => {
    const u = clamp(intro * 1.6 - k * .12); if (u <= 0) return;
    const e = outBack(u, 1.3);
    g.save(); g.translate(x, y); g.rotate(spin - (1 - outCubic(u)) * 1.9); g.scale(s * e, s * e); g.translate(-159.5, -146); g.globalAlpha *= alpha * clamp(u * 3);
    g.fillStyle = p.grad; g.fill(p.d); g.restore();
  });
}

// ---------- Endkarte (für alle Spots gleich) ----------
// Logo (Original-PNG) → Kampagnenzeile → CTA-Button → remira.com. ringFrom = {x,y,r}: Ring aus der Szene fährt deckungsgleich ins Logo.
export function endCard(t, T0, S, ringFrom = null) {
  const L = endLayout();
  const lw = L.logoW, k = lw / LOGO_PNG.w, lx = W / 2 - lw / 2, ly = L.logoY - LOGO_PNG.h * k / 2;
  const target = { x: lx + LOGO_PNG.rx * k, y: ly + LOGO_PNG.ry * k, r: LOGO_PNG.rr * k };
  const m = outCubic(prog(t, T0, T0 + .7));
  if (ringFrom && m < 1) ring(lerp(ringFrom.x, target.x, m), lerp(ringFrom.y, target.y, m), lerp(ringFrom.r, target.r, m), { spin: (1 - m) * -1.2, glow: .25 * (1 - m) });
  const a = prog(t, T0 + .45, T0 + .8);
  if (a > 0) {
    if (ringFrom && a < 1) { g.save(); g.globalAlpha *= a; g.drawImage(LOGO, 0, 0, LOGO_PNG.w, LOGO_PNG.h, Math.round(lx), Math.round(ly), Math.round(lw), Math.round(LOGO_PNG.h * k)); g.restore(); }
    else { g.save(); g.globalAlpha *= ringFrom ? 1 : a; g.drawImage(LOGO, 0, 0, LOGO_PNG.w, LOGO_PNG.h, Math.round(lx), Math.round(ly), Math.round(lw), Math.round(LOGO_PNG.h * k)); g.restore(); }
  }
  text(FMT === '9x16' ? S.claim : S.claim.replace('\n', ' '), W / 2, L.claimY, L.claimPx, t, T0 + .9, { w: 800, st: .07 });
  const cu = prog(t, T0 + 1.9, T0 + 2.4);
  if (cu > 0) {
    const bw = textW(S.cta, L.ctaPx) + L.ctaPx * 2.2, bh = L.ctaPx * 2.3, e = cu >= 1 ? 1 : outBack(cu, 1.4);
    g.save(); g.translate(W / 2, L.ctaY); g.scale(e, e); g.globalAlpha *= clamp(cu * 2);
    g.beginPath(); g.roundRect(-bw / 2, -bh / 2, bw, bh, bh / 2); g.fillStyle = BLUE; g.fill(); g.restore();
    text(S.cta, W / 2, L.ctaY, L.ctaPx, t, T0 + 2.0, { st: 0 });
  }
  text(S.url, W / 2, L.urlY, L.urlPx, t, T0 + 2.3, { w: 600, col: SOFT, st: 0 });
}
function endLayout() {
  if (FMT === '16x9') return { logoW: 620, logoY: 380, claimY: 560, claimPx: 64, ctaY: 720, ctaPx: 34, urlY: 818, urlPx: 30 };
  if (FMT === '1x1') return { logoW: 560, logoY: 330, claimY: 520, claimPx: 56, ctaY: 690, ctaPx: 32, urlY: 790, urlPx: 28 };
  return { logoW: 640, logoY: 690, claimY: 880, claimPx: 70, ctaY: 1130, ctaPx: 38, urlY: 1240, urlPx: 32 };
}
export const endRing = () => { const L = endLayout(), k = L.logoW / LOGO_PNG.w; return { x: W / 2 - L.logoW / 2 + LOGO_PNG.rx * k, y: L.logoY - LOGO_PNG.h * k / 2 + LOGO_PNG.ry * k, r: LOGO_PNG.rr * k }; };

// ---------- Renderer-Schnittstelle ----------
export function mount(draw) {
  window.renderFrame = t => draw(t);
  window.grab = type => canvas.toDataURL(type, .92);
  draw(0); window.__ready = true;
}
