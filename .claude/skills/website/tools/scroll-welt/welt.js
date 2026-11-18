// Auszug aus ZAB-Website v8 (main.js): scroll-gesteuerte Welt aus Filmen je Szene. Braucht: mob(), clamp, lerp, smooth, secP, onScrollDo, IMG, VID, $, $$.
/* ================= WELT im Hintergrund =================
   Die Landschaft folgt dem Scrollen. Damit es flüssig bleibt, wird vorwärts nicht gespult, sondern abgespielt –
   so schnell, wie gescrollt wird (das Video holt die Scroll-Position weich ein). Rückwärts geht es in kleinen Schritten.
   Jede Szene ist ein eigener Film (10 s); an den Grenzen übernimmt der nächste Film nahtlos. */
const world = $('#world');
const W = { T: 0 };
if (world) {
  const isSub = document.body.classList.contains('subpage');
  const sfx = () => mob() ? '-m' : '';
  const PRE = WELT === 'wiese' ? 'g' : 'r', N = WELT === 'wiese' ? 4 : 5, SEG = 10;
  // Fahrplan: Abschnitt-Oberkante (oder -Ende) erreicht den Bildschirm → Sekunde der Reise
  const PLAN = WELT === 'wiese'
    ? [['view', 0, 0], ['rot', 0, 10], ['stand', 0, 10], ['stand', .7, 20], ['warum', 0, 20], ['ueber', 0, 30], ['preise', 0, 30], ['faq', 0, 39.9]]
    : [['intro', .82, 0], ['rot', 0, 2.5], ['rot', 1, 10], ['stand', .72, 20], ['warum', .15, 20.6], ['websites', 0, 25], ['ueber', 0, 30], ['branchen', 0, 33], ['preise', 0, 40], ['faq', 0, 45.5], ['kontakt', 0, 49.9]];
  const A1 = $('#wA'), B1 = $('#wB'), loopV = $('#wLoop'), scrim = $('#wScrim'), mark = $('#wMark');
  $('#wVid')?.remove();
  let stops = [], ver = sfx(), cur = 0, active = -1, seeking = false, vids = [], ready = [];
  const still = i => `${IMG}${PRE}s${i}${sfx()}.webp`;
  const measure = () => { stops = PLAN.filter(([id]) => $('#' + id)).map(([id, f, t]) => { const el = $('#' + id), y = el.getBoundingClientRect().top + scrollY; return [y + f * Math.max(0, el.offsetHeight - innerHeight), t]; }); };
  const timeAt = y => { if (!stops.length || y <= stops[0][0]) return 0; for (let i = 1; i < stops.length; i++) if (y <= stops[i][0]) { const [y0, t0] = stops[i - 1], [y1, t1] = stops[i]; return lerp(t0, t1, clamp((y - y0) / Math.max(1, y1 - y0))); } return stops[stops.length - 1][1]; };
  W.measure = measure;
  // Standbild (solange ein Film noch lädt)
  const showStill = i => { const src = still(i); if (A1.dataset.src !== src) { A1.src = src; A1.dataset.src = src; } A1.classList.add('on'); };
  // Filme nacheinander laden (zuerst der, an dem man gerade ist)
  const make = i => { const v = document.createElement('video'); v.className = 'wvid'; v.muted = true; v.playsInline = true; v.preload = 'auto'; v.setAttribute('aria-hidden', 'true'); world.insertBefore(v, scrim); v.addEventListener('seeked', () => { if (i === active) seeking = false; }); return v; };
  const load = async order => { for (const i of order) { if (ready[i] !== undefined) continue; ready[i] = false; try { const r = await fetch(`${VID}${PRE}${i + 1}${sfx()}.mp4`); if (!r.ok) throw 0; const url = URL.createObjectURL(await r.blob()); const v = vids[i] || (vids[i] = make(i)); v.src = url; await new Promise(res => v.readyState >= 2 ? res() : v.addEventListener('loadeddata', res, { once: true })); ready[i] = true; } catch (e) { ready[i] = null; } } };
  const order = from => [from, ...[...Array(N).keys()].filter(i => i > from), ...[...Array(N).keys()].filter(i => i < from).reverse()];
  const activate = (i, t) => { // Film i sichtbar machen, auf Zeit t
    const v = vids[i]; if (!v) return false;
    if (active !== i) { vids.forEach((o, k) => { if (o && k !== i) { o.pause(); o.classList.remove('on'); } }); v.currentTime = t; v.classList.add('on'); active = i; seeking = true; }
    return true;
  };
  const prep = () => { // Nachbar-Filme vorbereiten: nächster am Anfang, vorheriger am Ende
    const n = vids[active + 1], pv = vids[active - 1];
    if (n && ready[active + 1] && n.paused && n.currentTime > .05) n.currentTime = 0;
    if (pv && ready[active - 1] && pv.paused && pv.currentTime < pv.duration - .2) pv.currentTime = pv.duration - .05;
  };
  let loopOn = false;
  const setLoop = on => { // Wiese: ganz am Anfang weht der Wind weiter
    if (WELT !== 'wiese' || rm) on = false; if (on === loopOn) return; loopOn = on;
    if (on) { if (!loopV.src) loopV.src = `${VID}wa${sfx()}.mp4`; loopV.play().catch(() => {}); loopV.classList.add('on'); } else { loopV.classList.remove('on'); setTimeout(() => !loopOn && loopV.pause(), 700); }
  };
  const frame = () => {
    requestAnimationFrame(frame);
    const tgt = rm ? timeAt(scrollY) : timeAt(scrollY); W.T = tgt;
    let seg = Math.min(N - 1, Math.floor(cur / SEG));
    if (!ready[seg]) { // noch nicht geladen: Standbild der nächsten Szene, Zeit springt mit
      cur = tgt; seg = Math.min(N - 1, Math.floor(cur / SEG)); showStill(Math.round(cur / SEG)); vids.forEach(o => o && o.classList.remove('on')); active = -1;
      if (!ready[seg] && ready[seg] !== false && ready[seg] !== null) load(order(seg));
      setLoop(tgt < .05); return;
    }
    if (active !== seg) { activate(seg, clamp(cur - seg * SEG, 0, SEG - .05)); A1.classList.remove('on'); prep(); }
    const v = vids[seg], local = v.currentTime; cur = seg * SEG + local; W.cur = cur;
    setLoop(tgt < .05 && cur < .1);
    const d = tgt - cur;
    if (Math.abs(d) > 1.2 && !seeking) { // weit weg (schnell gescrollt): nah ans Ziel springen, dann weich weiter
      const t2 = clamp(tgt - Math.sign(d) * .3, 0, N * SEG - .06), s2 = Math.min(N - 1, Math.floor(t2 / SEG));
      if (ready[s2]) { v.pause(); if (s2 !== seg) activate(s2, t2 - s2 * SEG); else { seeking = true; v.currentTime = t2 - s2 * SEG; } cur = t2; prep(); return; }
    }
    if (Math.abs(d) < .04 || (d < 0 && d > -.12 && !v.paused)) { if (!v.paused) v.pause(); return; }
    if (d > 0) { // vorwärts: abspielen, Tempo folgt dem Abstand zur Scroll-Position
      if (seeking) return;
      if (local >= v.duration - .07) { if (seg < N - 1 && ready[seg + 1]) { v.pause(); cur = (seg + 1) * SEG; activate(seg + 1, 0); prep(); } return; }
      v.playbackRate = clamp(.6 + d * 3, .6, 6); if (v.paused) v.play().catch(() => {});
    } else { // rückwärts: kleine weiche Schritte
      if (!v.paused) v.pause(); if (seeking) return;
      if (local <= .06) { if (seg > 0 && ready[seg - 1]) { cur = seg * SEG - .06; activate(seg - 1, vids[seg - 1].duration - .06); prep(); } return; }
      const step = Math.min(-d, .1 + -d * .5); seeking = true; v.currentTime = Math.max(0, local - step);
    }
  };
  if (isSub) { A1.src = `${IMG}rs5${sfx()}.webp`; A1.classList.add('on'); world.classList.add('static'); scrim.style.opacity = .62; }
  else {
    measure(); addEventListener('load', () => { measure(); setTimeout(measure, 400); }); addEventListener('resize', () => { measure(); if (sfx() !== ver) { ver = sfx(); vids.forEach(v => v && v.remove()); vids = []; ready = []; active = -1; } });
    cur = timeAt(scrollY); showStill(Math.round(cur / SEG)); load(order(Math.min(N - 1, Math.floor(cur / SEG))));
    if (!rm) requestAnimationFrame(frame); else onScrollDo(() => showStill(Math.round(timeAt(scrollY) / SEG)));
    onScrollDo(() => { world.dataset.scene = Math.round(W.T / SEG); });
  }
  // Abdunklung hinter Text je Abschnitt (weich)
  const scrimSecs = $$('[data-scrim]'); let sc = 0, scrimBusy = false;
  const scrimTick = () => { let tg = isSub ? .62 : 0; scrimSecs.forEach(s => { if (s.getBoundingClientRect().top < innerHeight * .55) tg = parseFloat(s.dataset.scrim); }); sc += (tg - sc) * .08; scrim.style.opacity = sc.toFixed(3); if (Math.abs(tg - sc) > .002) requestAnimationFrame(scrimTick); else scrimBusy = false; };
  if (scrimSecs.length) onScrollDo(() => { if (!scrimBusy) { scrimBusy = true; requestAnimationFrame(scrimTick); } });
  // sanftes Leuchten beim einen Boot / der einen Blume
  const MK = WELT === 'wiese' ? { d: [.665, .45], m: [.5, .45] } : { d: [.66, .64], m: [.515, .638] };
  const placeMark = () => { const M = mob(), iw = M ? 720 : 1920, ih = M ? 1280 : 1080, sc2 = Math.max(innerWidth / iw, innerHeight / ih), ox = (innerWidth - iw * sc2) / 2, oy = (innerHeight - ih * sc2) / 2, k = M ? MK.m : MK.d;
    mark.style.left = (ox + k[0] * iw * sc2) + 'px'; mark.style.top = (oy + k[1] * ih * sc2) + 'px'; mark.style.setProperty('--ms', sc2.toFixed(3)); };
  placeMark(); addEventListener('resize', placeMark);
  const standSec = $('#stand');
  if (standSec && !isSub) { const glowLoop = () => { requestAnimationFrame(glowLoop); const p = secP(standSec), r = standSec.getBoundingClientRect(); const ramp = smooth(clamp((p - .55) / .4)); const near = clamp(1 - Math.abs((W.cur || 0) - 20) / 1.2); const vis = r.top < innerHeight && r.bottom > -innerHeight * .6 ? 1 : 0; mark.style.opacity = (ramp * near * vis).toFixed(3); }; requestAnimationFrame(glowLoop); }
}

