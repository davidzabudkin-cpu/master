// Headless-Test der Kimo-Seite: Screenshots Desktop + Handy, Konsolenfehler sammeln
import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
const OUT = new URL('./out/', import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1');
fs.mkdirSync(OUT, { recursive: true });
const URL_ = process.argv[2] || 'http://localhost:8793/';
const only = process.argv[3] || 'all';
const browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true, args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--autoplay-policy=no-user-gesture-required'] });
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const errors = [];

async function run(name, vp, steps) {
  const page = await browser.newPage();
  await page.setViewport(vp);
  page.on('console', (m) => { if (m.type() === 'error') errors.push(`${name}: ${m.text()}`); });
  page.on('pageerror', (e) => errors.push(`${name}: ${e.message}`));
  await page.goto(URL_, { waitUntil: 'networkidle0' });
  await wait(1500);
  for (const [label, fn, ms] of steps) {
    await page.evaluate(fn);
    await wait(ms ?? 1600);
    await page.screenshot({ path: `${OUT}${name}-${label}.png` });
  }
  await page.close();
}
const heroAt = (p) => `(() => { const t=document.querySelector('.hero__track'); scrollTo({top:t.offsetTop+(t.offsetHeight-innerHeight)*${p},behavior:'instant'}); })()`;
const to = (sel, extra = 0) => `(() => { const e=document.querySelector('${sel}'); scrollTo({top:e.getBoundingClientRect().top+scrollY+${extra},behavior:'instant'}); })()`;
const reelAt = (p) => `(() => { const r=document.getElementById('reel'); scrollTo({top:r.offsetTop+(r.offsetHeight-innerHeight)*${p},behavior:'instant'}); })()`;
const desk = [
  ['01-hero', heroAt(0), 2500], ['02-hero45', heroAt(0.45), 2200], ['03-hero90', heroAt(0.92), 2600],
  ['04-spur', to('#spur', -40), 4500], ['05-portfolio', to('#portfolio', 0), 2200],
  ['06-filter', `(() => { document.querySelector('.filters [data-cat=mermaid]').click(); })()`, 2200],
  ['07-lightbox', `(() => { document.querySelector('.tile').click(); })()`, 1800],
  ['08-reel', `(() => { document.getElementById('lightbox').close(); ${reelAt(0.5)}; })()`, 1800],
  ['09-ueber', to('#ueber', 0), 2000], ['10-ablauf', to('#ablauf', -200), 2000],
  ['11-preise', `(() => { ${to('#preise', 0)}; })()`, 1800],
  ['12-preise-wahl', `(() => { document.querySelector('input[name=typ][value="449"]').click(); document.querySelector('input[name=sicher][value="250"]').click(); })()`, 1400],
  ['13-kontakt', to('#kontakt', 0), 1800]
];
const mob = [
  ['01-hero', heroAt(0), 2000], ['02-hero50', heroAt(0.5), 1600], ['03-hero95', heroAt(0.96), 1800],
  ['04-spur', to('#spur', 0), 4500], ['05-portfolio', to('#portfolio', 0), 2200], ['06-reel', to('#reel', 0), 1800],
  ['07-ueber', to('#ueber', 0), 1800], ['08-ablauf', to('#ablauf', 0), 1800], ['09-preise', to('#preise', 0), 1800],
  ['10-preise-unten', to('.safety', -100), 1600], ['11-kontakt', to('#kontakt', 0), 1800]
];
if (only === 'all' || only === 'desk') await run('desk', { width: 1440, height: 900 }, desk);
if (only === 'all' || only === 'mob') await run('mob', { width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 1 }, mob);
await browser.close();
console.log(errors.length ? errors.join('\n') : 'Keine Konsolenfehler');
