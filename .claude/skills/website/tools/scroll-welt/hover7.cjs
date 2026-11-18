// Prüft, ob Hover-Effekte reagieren und ob die Welt beim Scrollen mitläuft (und beim Stoppen stehen bleibt)
const puppeteer = require('puppeteer-core')  // npm install puppeteer-core;
const W8 = ms => new Promise(r => setTimeout(r, ms)), OUT = process.argv[2];
(async () => { const b = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true, args: ['--autoplay-policy=no-user-gesture-required'] });
  const p = await b.newPage(); await p.setViewport({ width: 1440, height: 900 }); const o = [];
  p.on('pageerror', e => o.push('JS ' + e.message));
  await p.goto('http://localhost:8794/', { waitUntil: 'load', timeout: 90000 }); await W8(6000);
  const to = async (id, f) => { await p.evaluate((id, f) => { const e = document.getElementById(id); scrollTo(0, e.offsetTop + f * (e.offsetHeight - innerHeight)); }, id, f); await W8(1800); };
  const hov = async (sel, name) => { const el = await p.$(sel); const bb = await el.boundingBox(); await p.mouse.move(bb.x + bb.width * .3, bb.y + bb.height * .5); await W8(250); await p.mouse.move(bb.x + bb.width * .35, bb.y + bb.height * .45, { steps: 6 }); await W8(700);
    const r = await p.evaluate(sel => { const el = document.querySelector(sel); const cs = getComputedStyle(el); const ch = el.querySelector('.ch[style*="transform"]'); return { transform: cs.transform.slice(0, 40), hover: el.matches(':hover'), letters: el.querySelectorAll('.ch[style*="translate"]').length }; }, sel);
    o.push(name + ': ' + JSON.stringify(r)); if (OUT) await p.screenshot({ path: `${OUT}/h-${name}.jpg`, type: 'jpeg', quality: 65 }); };
  await to('intro', .8); await hov('#claimTxt', 'satz');
  await to('rot', .3); await hov('.rot__panel', 'wortwechsler');
  await to('stand', .5); await hov('.stand__h.w-reise', 'abheben');
  await to('warum', .1); await hov('.w.b1', 'widget');
  // Scroll-Kopplung: kleines Stück scrollen, warten, prüfen ob Video steht und nah dran ist
  await to('view', 0); await W8(4000);
  const rd = () => p.evaluate(() => [W.T.toFixed(2), (W.cur || 0).toFixed(2), [...document.querySelectorAll('#world video.wvid.on')].map(v => v.paused)]);
  o.push('Start ' + JSON.stringify(await rd()));
  for (let k = 0; k < 5; k++) { await p.mouse.wheel({ deltaY: 220 }); await W8(120); }
  o.push('direkt nach Scrollen ' + JSON.stringify(await rd())); await W8(1500); o.push('1,5 s später ' + JSON.stringify(await rd())); await W8(1500); o.push('3 s später ' + JSON.stringify(await rd()));
  console.log(o.join('\n')); await b.close(); })();
