(() => {
  'use strict';
  const root = document.documentElement;
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const ss = t => { t = clamp(t); return t * t * (3 - 2 * t); };
  const fmt = n => Math.round(n).toLocaleString('de-DE');
  history.scrollRestoration = 'manual';

  // Feste Bildschirm-Einheit (kein Springen durch die Adressleiste)
  let lastW = 0;
  function setUnit() {
    if (innerWidth === lastW) return;
    lastW = innerWidth;
    root.style.setProperty('--u', (innerHeight / 100) + 'px');
  }
  setUnit();

  // Style-Cache: nur schreiben, wenn sich etwas ändert
  const cache = new WeakMap();
  function css(el, k, v) {
    let c = cache.get(el); if (!c) cache.set(el, c = {});
    if (c[k] === v) return; c[k] = v; el.style[k] = v;
  }

  // Wörter in Spans zerlegen
  function split(el) {
    const out = [];
    const walk = node => {
      [...node.childNodes].forEach(ch => {
        if (ch.nodeType === 3) {
          const frag = document.createDocumentFragment();
          ch.textContent.split(/(\s+)/).forEach(part => {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(' ')); return; }
            const s = document.createElement('span'); s.className = 'w'; s.textContent = part;
            frag.appendChild(s); out.push(s);
          });
          ch.replaceWith(frag);
        } else if (ch.nodeType === 1 && ch.tagName !== 'BR') walk(ch);
      });
    };
    walk(el);
    return out;
  }

  // Wort-Reveals: am Scroll (data-a/b) oder per Sichtbarkeit (data-io)
  const scrubWords = [];
  document.querySelectorAll('.rm-words').forEach(el => {
    const ws = split(el);
    if (el.hasAttribute('data-io')) {
      ws.forEach((w, i) => { w.style.transition = `opacity .8s cubic-bezier(.16,1,.3,1) ${i * 60}ms, translate .8s cubic-bezier(.16,1,.3,1) ${i * 60}ms`; });
      el.classList.add('rm-io');
    } else {
      scrubWords.push({ el, ws, a: +el.dataset.a, b: +el.dataset.b, stage: el.closest('.rm-stage') });
    }
  });
  const ioStyle = document.createElement('style');
  ioStyle.textContent = '.rm-io.in .w{opacity:1;translate:0 0}';
  document.head.appendChild(ioStyle);

  // Einblendungen, die beim Zurückscrollen wiederkommen
  const io = new IntersectionObserver(es => es.forEach(e => e.target.classList.toggle('in', e.isIntersecting)), { rootMargin: '0px 0px -12% 0px' });
  document.querySelectorAll('.rm-reveal, .rm-io').forEach(el => io.observe(el));

  // Bühnen-Fortschritt
  const stages = [...document.querySelectorAll('.rm-stage')];
  const prog = new Map();
  function measure() {
    const H = innerHeight;
    stages.forEach(s => {
      const r = s.getBoundingClientRect();
      prog.set(s, -r.top / Math.max(1, r.height - H));
    });
  }

  // ---------- Signature: Punkte-Lager ----------
  const sig = document.querySelector('.rm-sig');
  const cv = sig.querySelector('canvas');
  const ctx = cv.getContext('2d');
  const num = sig.querySelector('.rm-count-num');
  const copyA = sig.querySelector('.rm-sig-a');
  const PAL = ['#2F8CFF', '#12B8A6', '#86C23A', '#F5B321', '#F2702A', '#E23B53'];
  let dots = [], W = 0, H = 0, dpr = 1, nSample = 0, lastSigP = null;
  function setupDots() {
    dpr = Math.min(devicePixelRatio || 1, 2);
    W = cv.clientWidth; H = cv.clientHeight;
    cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
    const sp = W < 700 ? 15 : 19;
    const cols = Math.floor((W - 20) / sp), rows = Math.floor((H - 20) / sp);
    const ox = (W - (cols - 1) * sp) / 2, oy = (H - (rows - 1) * sp) / 2;
    let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    dots = []; nSample = 0;
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
      const sample = rnd() < 0.011;
      if (sample) nSample++;
      dots.push({ x: ox + c * sp, y: oy + r * sp, o: (c / cols) * 0.75 + (r / rows) * 0.25 + rnd() * 0.05, s: sample, col: PAL[(r * 7 + c) % 6] });
    }
    lastSigP = null;
  }
  function drawSig(p) {
    if (p === lastSigP) return; lastSigP = p;
    const a = RM ? 1 : ss((p + 0.12) / 0.34);       // Lager füllt sich
    const b = RM ? 1 : ss((p - 0.34) / 0.22);       // nur Stichproben bleiben
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    const base = W < 700 ? 2.6 : 3.2;
    // graue Artikel
    for (const d of dots) {
      if (d.s) continue;
      const k = clamp((a * 1.25 - d.o) / 0.25);
      const al = k * (0.5 - 0.42 * b);
      if (al <= 0.01) continue;
      ctx.fillStyle = `rgba(150,162,186,${al.toFixed(3)})`;
      ctx.fillRect(d.x - base / 2, d.y - base / 2, base, base);
    }
    // Stichproben
    for (const d of dots) {
      if (!d.s) continue;
      const k = clamp((a * 1.25 - d.o) / 0.25);
      if (k <= 0.01) continue;
      const sz = base * (1 + 1.3 * b);
      if (b > 0.01) {
        ctx.globalAlpha = 0.22 * b * k;
        ctx.fillStyle = d.col;
        ctx.beginPath(); ctx.arc(d.x, d.y, sz * 2.6, 0, 6.2832); ctx.fill();
      }
      ctx.globalAlpha = k * (0.5 + 0.5 * b);
      ctx.fillStyle = b > 0.5 ? d.col : '#96A2BA';
      ctx.beginPath(); ctx.arc(d.x, d.y, sz / 1.6, 0, 6.2832); ctx.fill();
      ctx.globalAlpha = 1;
    }
    // Abdunklung hinter dem Text
    const g = ctx.createLinearGradient(0, 0, 0, H * 0.55);
    g.addColorStop(0, 'rgba(10,15,30,.92)'); g.addColorStop(1, 'rgba(10,15,30,0)');
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H * 0.55);
    // Zähler
    const total = dots.length;
    const n = b > 0 ? total - (total - nSample) * b : total * a;
    num.textContent = fmt(n);
    css(copyA, 'opacity', String(1 - ss((p - 0.27) / 0.08)));
  }

  // ---------- Ablauf ----------
  const flow = document.querySelector('.rm-flow');
  const line = flow.querySelector('.rm-line i');
  const steps = [...flow.querySelectorAll('.rm-step')];
  const wide = matchMedia('(min-width:900px)');
  function drawFlow(p) {
    const l = RM ? 1 : ss((p - 0.02) / 0.75);
    css(line, 'transform', wide.matches ? `scaleX(${l.toFixed(4)})` : `scaleY(${l.toFixed(4)})`);
    steps.forEach((s, k) => s.classList.toggle('on', RM || p > 0.04 + k * 0.2));
  }

  // ---------- Rechner ----------
  const inp = document.getElementById('rmN');
  const out = document.getElementById('rmNout');
  const full = document.getElementById('rmFull');
  const samp = document.getElementById('rmSample');
  const fillS = document.querySelector('.rm-fill-sample');
  function calc() {
    const n = +inp.value;
    out.textContent = fmt(n);
    full.textContent = fmt(n);
    samp.textContent = fmt(n * 0.01);
    fillS.style.transform = 'scaleX(0.01)';
  }
  inp.addEventListener('input', calc); calc();

  // ---------- CTA ----------
  document.getElementById('rmCta').addEventListener('click', () => { document.getElementById('rmDone').hidden = false; });

  // ---------- Hero-Figuren: Bild in assets/ ablegen und hier den Dateinamen eintragen ----------
  const HEROES = { frau: '', mann: '' }; // z. B. { frau: 'hero-frau.webp', mann: 'hero-mann.webp' }
  document.querySelectorAll('[data-hero]').forEach(slot => {
    const name = slot.dataset.hero.replace('-cta', '');
    if (!HEROES[name]) return;
    const img = new Image();
    img.alt = ''; img.decoding = 'async';
    img.onload = () => { slot.prepend(img); slot.classList.add('has-img'); slot.style.borderStyle = 'none'; slot.querySelector('figcaption').hidden = true; slot.querySelector('.rm-slot-ring').hidden = true; };
    img.onerror = () => {};
    img.src = 'assets/' + HEROES[name];
  });

  // ---------- Schleife ----------
  let lastY = -1, dirty = true;
  function frame() {
    if (dirty || scrollY !== lastY) {
      lastY = scrollY; dirty = false;
      measure();
      scrubWords.forEach(o => {
        const p = prog.get(o.stage); const n = o.ws.length; const D = 0.3;
        o.ws.forEach((w, i) => {
          const st = (1 - D) * (n > 1 ? i / (n - 1) : 0);
          const k = RM ? 1 : ss(((p - o.a) / (o.b - o.a) - st) / D);
          css(w, 'opacity', k.toFixed(3));
          css(w, 'translate', `0 ${((1 - k) * 0.5).toFixed(3)}em`);
        });
      });
      const sp = prog.get(sig);
      if (sp > -1.2 && sp < 1.2) drawSig(+sp.toFixed(4));
      const fp = prog.get(flow);
      if (fp > -1.2 && fp < 1.2) drawFlow(fp);
    }
    requestAnimationFrame(frame);
  }
  addEventListener('resize', () => { const w = innerWidth; setUnit(); if (Math.abs(cv.width / dpr - cv.clientWidth) > 2) setupDots(); dirty = true; void w; });
  setupDots();
  requestAnimationFrame(frame);
})();
