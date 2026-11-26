// Spot A „Das letzte Paar“ (Overselling, Omnichannel Commerce + OMS), Prototyp v1, 26.11.2026. 16,8 s, ohne Stimme.
import { g, W, H, FMT, BLUE, GREEN, RED, ORANGE, YELLOW, GREY, SOFT, begin, withA, text, textW, capMid, glass, chip, stamp, icon, iconPath, line, ring, softGlow, endCard, endRing, mount, font } from './kit.js';
import { T, DURATION } from './data.js';
import { S } from './texte.js';
import { phosphorPathFill } from './phosphor-icons-fill.js';
import { prog, clamp, lerp, outCubic, inOutCubic, outBack } from './lib/ease.js';

const STAR = phosphorPathFill('star');
// ---------- Layout je Format ----------
const LAYOUTS = {
  // 9:16: Ring landet oben mittig (wo der Karton war), Linien laufen schräg zu den Karten (Dreieck)
  '9x16': { hookY: 300, hookPx: 110, box: [540, 760], boxS: 400, store: [300, 1210], storeWH: [440, 400], phone: [800, 1210], phoneWH: [330, 600], countY: 1565, starsY: 1635, ring: [540, 720], ringR: 96, aStore: [300, 1000], aPhone: [800, 900], solY: 300, solPx: 92, agitPx: 92, stampPx: 46 },
  '16x9': { hookY: 150, hookPx: 96, box: [960, 470], boxS: 300, store: [500, 640], storeWH: [420, 360], phone: [1420, 610], phoneWH: [300, 540], countY: 925, starsY: 990, ring: [960, 625], ringR: 92, aStore: [720, 625], aPhone: [1260, 625], solY: 150, solPx: 80, agitPx: 80, stampPx: 40 },
  '1x1': { hookY: 120, hookPx: 76, box: [500, 360], boxS: 220, store: [270, 630], storeWH: [340, 300], phone: [810, 615], phoneWH: [250, 450], countY: 895, starsY: 955, ring: [557, 620], ringR: 64, aStore: [450, 620], aPhone: [675, 620], solY: 120, solPx: 62, agitPx: 60, stampPx: 34 }
};
const L = LAYOUTS[FMT] || LAYOUTS['9x16'];
// Hook steht in 16:9 und 1:1 einzeilig, in 9:16 zweizeilig
const oneLine = s => FMT === '9x16' ? s : s.replace('\n', ' ');
const DIM = .28;
const dimAt = t => 1 - (1 - DIM) * (prog(t, T.dim, T.dim + .35) - prog(t, T.undim, T.undim + .4));

// ---------- Schuhkarton (Vektor) ----------
function shoeBox(x, y, s, a) {
  if (a <= 0) return;
  const w = s, h = s * .62, lid = h * .26;
  g.save(); g.globalAlpha *= a; g.translate(Math.round(x), Math.round(y));
  g.beginPath(); g.roundRect(-w / 2, -h / 2 + lid * .55, w, h - lid * .55, 10); g.fillStyle = '#16263A'; g.fill(); g.lineWidth = 3; g.strokeStyle = 'rgba(255,255,255,.75)'; g.stroke();
  g.beginPath(); g.roundRect(-w / 2 - 8, -h / 2, w + 16, lid, 8); g.fillStyle = ORANGE; g.fill();
  g.restore();
  withA(a, () => icon('sneaker', x, y + lid * .35, s * .42, 1, '#fff'));
}
// ---------- Laden-Karte ----------
function store(t, a) {
  const [x, y] = L.store, [w, h] = L.storeWH, u = prog(t, T.store, T.store + .5);
  if (u <= 0 || a <= 0) return;
  withA(a * clamp(u * 2), () => {
    const e = u >= 1 ? 1 : outBack(u, 1.4); g.save(); g.translate(x, y); g.scale(e, e); g.translate(-x, -y);
    glass(x, y, w, h, 24, 1);
    icon('storefront', x, y - h * .1, h * .42, 1, '#fff');
    text(S.store, x, y + h * .3, Math.round(h * .12), t, T.store, { st: 0 });
    g.restore();
  });
}
// ---------- Smartphone mit Shop ----------
function phone(t, a, state) {
  const [x, y] = L.phone, [w, h] = L.phoneWH, u = prog(t, T.shop, T.shop + .5);
  if (u <= 0 || a <= 0) return;
  withA(a * clamp(u * 2), () => {
    const e = u >= 1 ? 1 : outBack(u, 1.4); g.save(); g.translate(x, y); g.scale(e, e); g.translate(-x, -y);
    g.beginPath(); g.roundRect(Math.round(x - w / 2), Math.round(y - h / 2), w, h, 36); g.fillStyle = '#0B1522'; g.fill(); g.lineWidth = 4; g.strokeStyle = 'rgba(255,255,255,.8)'; g.stroke();
    g.beginPath(); g.roundRect(Math.round(x - w * .12), Math.round(y - h / 2 + 14), Math.round(w * .24), 10, 5); g.fillStyle = 'rgba(255,255,255,.35)'; g.fill();
    text(S.shop, x, y - h * .36, Math.round(w * .085), t, T.shop, { st: 0, col: SOFT, w: 600 });
    icon('sneaker', x, y - h * .13, w * .5, 1, '#fff');
    const px = Math.max(26, Math.round(w * .088)), by = y + h * .3, bw = w * .8, bh = px * 2.2;
    if (state.soldOut > 0) {
      // nach der Synchronisierung: Shop zeigt sofort „Ausverkauft“ (grauer Button)
      withA(1 - state.soldOut, () => { text(S.tag, x, y + h * .1, px, t, T.shop, { st: 0, col: ORANGE }); });
      withA(state.soldOut, () => { text(S.soldOut, x, y + h * .1, px, t, T.shop, { st: 0, col: GREY }); });
    } else text(S.tag, x, y + h * .1, px, t, T.shop, { st: 0, col: ORANGE });
    const press = state.press;
    g.save(); g.translate(x, by); g.scale(1 - .06 * press, 1 - .06 * press);
    g.beginPath(); g.roundRect(-bw / 2, -bh / 2, bw, bh, bh / 2); g.fillStyle = state.soldOut > .5 ? 'rgba(168,168,168,.35)' : BLUE; g.fill(); g.restore();
    // Button-Text auf die Button-Breite einpassen (lange Übersetzungen)
    const btn = state.soldOut > .5 ? S.soldOut : S.cart, bpx = Math.min(px, Math.floor(px * bw * .84 / textW(btn, px)));
    text(btn, x, by, bpx, t, T.shop, { st: 0 });
    g.restore();
  });
}
function counter(x, y, n, col, u, t, t0, iconName = null) {
  if (u <= 0) return;
  const px = FMT === '9x16' ? 46 : FMT === '1x1' ? 34 : 38, str = `${S.stock}: ${n}`;
  withA(clamp(u * 2), () => {
    const tw = textW(str, px), iw = iconName ? px * 1.1 : 0, gap = iconName ? px * .35 : 0, x0 = Math.round(x - (tw + iw + gap) / 2);
    if (iconName) icon(iconName, x0 + iw / 2, y + capMid(px), iw, 1, col, iconName === 'check');
    text(str, x0 + iw + gap, y, px, t, t0, { align: 'left', col, st: 0 });
  });
}
function stars(t, a) {
  const [x0, x1] = T.stars; if (t < x0 - .4 || a <= 0) return;
  const n = 5, sz = FMT === '9x16' ? 48 : 36, gap = sz * 1.15, cx = L.phone[0], y = L.starsY, ap = prog(t, x0 - .4, x0);
  withA(a * ap, () => {
    for (let k = 0; k < n; k++) {
      const x = cx + (k - (n - 1) / 2) * gap;
      // von rechts nach links werden 3 Sterne grau: Bewertung fällt von 5 auf 2
      const off = k >= 2 ? prog(t, x0 + (4 - k) * .25, x0 + (4 - k) * .25 + .2) : 0;
      iconPath(STAR, x, y, sz, off > .5 ? 'rgba(168,168,168,.45)' : YELLOW);
    }
  });
}

// ---------- Bild ----------
function draw(t) {
  begin();
  const dim = dimAt(t), sceneA = 1 - prog(t, T.solOut, T.solOut + .4);
  // Hook-Satz → Problem-Satz → Lösungs-Satz (je einzeln, Satz steht still)
  text(oneLine(S.hook), W / 2, L.hookY, L.hookPx, t, T.hook, { w: 800, tOut: T.hookOut, st: .09 });
  text(oneLine(S.agit), W / 2, L.hookY, L.agitPx, t, T.agit, { w: 800, tOut: T.agitOut, st: .06 });
  text(oneLine(S.sol), W / 2, L.solY, L.solPx, t, T.sol, { w: 800, tOut: T.solOut, st: .06, acc: BLUE });

  withA(sceneA, () => {
    // Karton: erscheint mittig mit Etikett „Nur noch 1“, fliegt dann in den Laden und verschwindet dort
    const bu = prog(t, T.box, T.box + .45), fu = inOutCubic(prog(t, ...T.fly));
    const bx = lerp(L.box[0], L.store[0], fu), by = lerp(L.box[1], L.store[1] - L.storeWH[1] * .1, fu), bs = L.boxS * lerp(1, .45, fu);
    const ba = clamp(bu * 2) * (1 - prog(t, T.fly[1] - .15, T.fly[1]));
    if (ba > 0) {
      const e = bu >= 1 ? 1 : outBack(bu, 1.5);
      shoeBox(bx, by, bs * e, ba);
      const tu = prog(t, T.tag, T.tag + .35) * (1 - prog(t, T.fly[0], T.fly[0] + .2));
      chip(S.tag, bx + bs * .42, by - bs * .36, FMT === '9x16' ? 46 : FMT === '1x1' ? 32 : 38, tu, { fill: RED });
    }
    withA(dim, () => {
      store(t, 1);
      const press = prog(t, T.tap - .12, T.tap) - prog(t, T.tap, T.tap + .15), soldOut = prog(t, T.sync, T.sync + .3);
      phone(t, 1, { press, soldOut });
      // Stempel: Laden „Verkauft“, Shop „Verkauft“ → „Storniert“; nach der Lösung verschwinden sie
      const stA = 1 - prog(t, T.sol - .2, T.sol + .2), px = L.stampPx;
      withA(stA, () => {
        stamp(S.sold, L.store[0], L.store[1] - L.storeWH[1] / 2, px, prog(t, T.sold1, T.sold1 + .3), GREEN);
        const c = prog(t, T.cancel, T.cancel + .3);
        if (c <= 0) stamp(S.sold, L.phone[0], L.phone[1] - L.phoneWH[1] / 2 + px * .4, px, prog(t, T.sold2, T.sold2 + .3), GREEN, .12);
        else stamp(S.cancel, L.phone[0], L.phone[1] - L.phoneWH[1] / 2 + px * .4, px, c, RED, .12);
        // Tipp-Welle auf dem Button
        const r = prog(t, T.tap, T.tap + .45);
        if (r > 0 && r < 1) { g.save(); g.globalAlpha *= (1 - r) * .8; g.strokeStyle = '#fff'; g.lineWidth = 3; g.beginPath(); g.arc(L.phone[0], L.phone[1] + L.phoneWH[1] * .3, 20 + 70 * outCubic(r), 0, 7); g.stroke(); g.restore(); }
      });
      // Zähler: getrennt (0 gegen 1, rot) → synchron (0 und 0, blau mit Häkchen)
      const cu = prog(t, T.count, T.count + .4), sy = prog(t, T.sync, T.sync + .3);
      withA(1 - sy, () => { counter(L.store[0], L.countY, 0, '#fff', cu, t, T.count); counter(L.phone[0], L.countY, 1, RED, cu, t, T.count, 'warning-circle'); });
      withA(sy, () => { counter(L.store[0], L.countY, 0, BLUE, 1, t, T.sync, 'check'); counter(L.phone[0], L.countY, 0, BLUE, 1, t, T.sync, 'check'); });
      // Bewertung fällt (nur im Problem-Teil)
      stars(t, 1 - prog(t, T.agitOut, T.agitOut + .3));
    });
    // Ring fliegt von oben ein und landet zwischen Laden und Shop; Linien verbinden beide
    const [r0, r1] = T.ring, ru = outCubic(prog(t, r0, r1));
    if (t >= r0) {
      const rx = L.ring[0], ry = lerp(L.ring[1] - H * .35, L.ring[1], ru);
      const lu = prog(t, ...T.links);
      // Linien vom Ringrand (+12 px) zu den Ankerpunkten an den Karten
      const edge = (a) => { const dx = a[0] - rx, dy = a[1] - ry, d = Math.hypot(dx, dy); return [rx + dx / d * (L.ringR + 12), ry + dy / d * (L.ringR + 12)]; };
      const es = edge(L.aStore), ep = edge(L.aPhone);
      line(es[0], es[1], L.aStore[0], L.aStore[1], lu, BLUE, 5);
      line(ep[0], ep[1], L.aPhone[0], L.aPhone[1], lu, BLUE, 5);
      // Impuls Laden → Ring → Shop
      const pu = prog(t, ...T.pulse);
      if (pu > 0 && pu < 1) {
        const path = [L.aStore, [rx, ry], L.aPhone], f = pu * 2, i = Math.min(1, Math.floor(f)), qq = f - i;
        const px_ = lerp(path[i][0], path[i + 1][0], qq), py_ = lerp(path[i][1], path[i + 1][1], qq);
        softGlow(px_, py_, 50, '255,255,255', .9); g.save(); g.fillStyle = '#fff'; g.beginPath(); g.arc(px_, py_, 10, 0, 7); g.fill(); g.restore();
      }
      // Chip „Echtzeit“ unter dem Ring
      chip(S.realtime, rx, FMT === '9x16' ? ry - L.ringR - 58 : ry + L.ringR + 48, FMT === '9x16' ? 36 : 30, prog(t, T.chip, T.chip + .35), { fill: BLUE, iconName: null });
    }
  });
  // Ring außerhalb der Szenen-Blende: bleibt stehen, bis er in der Endkarte ins Logo fährt
  if (t >= T.ring[0] && t < T.end) {
    const [r0, r1] = T.ring, ru = outCubic(prog(t, r0, r1)), landed = prog(t, r1, r1 + .5);
    ring(L.ring[0], lerp(L.ring[1] - H * .35, L.ring[1], ru), L.ringR * (1 + .15 * (1 - ru)), { intro: prog(t, r0, r0 + .5), spin: (1 - ru) * 3.2, glow: .3 + .5 * (1 - landed) });
  }
  if (t >= T.end) endCard(t, T.end, S, { x: L.ring[0], y: L.ring[1], r: L.ringR });
}
mount(draw);
