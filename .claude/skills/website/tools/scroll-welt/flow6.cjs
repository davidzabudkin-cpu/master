// Scroll-Test v6: Welt folgt dem Scrollen. Misst Rücksprünge der angezeigten Zeit beim Runterscrollen und den Abstand zur Scroll-Position.
// node tools/flow6.cjs [query]
const puppeteer = require('puppeteer-core')  // npm install puppeteer-core;
const QS = process.argv[2] || '';
const W8 = ms => new Promise(r => setTimeout(r, ms));
(async () => {
  const b = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true, args: ['--autoplay-policy=no-user-gesture-required'] });
  const p = await b.newPage(); await p.setViewport({ width: 1440, height: 900 }); const out = [];
  p.on('pageerror', e => out.push('JS ' + e.message)); p.on('response', r => { if (r.status() >= 400) out.push(r.status() + ' ' + r.url()); });
  await p.goto('http://localhost:8794/' + QS, { waitUntil: 'load', timeout: 120000 }); await W8(9000);
  await p.evaluate(() => { window.__l = []; setInterval(() => window.__l.push([W.T, W.cur || 0]), 50); });
  const H = await p.evaluate(() => document.body.scrollHeight - innerHeight);
  for (const [name, step, pause] of [['langsam', 40, 30], ['mittel', 160, 30], ['schnell', 700, 25]]) {
    await p.evaluate(() => scrollTo(0, document.getElementById('view').offsetTop)); await W8(6000); await p.evaluate(() => window.__l = []);
    const y0 = await p.evaluate(() => scrollY);
    for (let y = y0; y < H; y += step) { await p.evaluate(y => scrollTo(0, y), y); await W8(pause); }
    await W8(5000);
    const l = await p.evaluate(() => window.__l); let back = 0, maxGap = 0, prev = 0;
    for (const [t, c] of l) { if (c < prev - .15) back++; prev = Math.max(prev, c); maxGap = Math.max(maxGap, t - c); }
    out.push(`${name}: ${l.length} Proben, Ziel ${l[l.length - 1][0].toFixed(1)} s, angezeigt ${l[l.length - 1][1].toFixed(1)} s, Rücksprünge ${back}, größter Rückstand ${maxGap.toFixed(1)} s`);
  }
  // hoch scrollen: angezeigte Zeit muss folgen
  for (let y = H; y > 0; y -= 200) { await p.evaluate(y => scrollTo(0, y), y); await W8(30); }
  await W8(8000); out.push('nach oben: ' + (await p.evaluate(() => [W.T, W.cur])).map(x => (x || 0).toFixed(1)).join(' / '));
  console.log(out.join('\n')); await b.close();
})();
