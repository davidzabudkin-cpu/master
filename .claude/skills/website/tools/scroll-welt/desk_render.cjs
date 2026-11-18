// Desktop (Hintergrund + Ordner + Menüleiste + Dock) als 1920x1080-Bild rendern: node tools/desk_render.cjs <hintergrund.webp> <datei>
const puppeteer = require('puppeteer-core')  // npm install puppeteer-core;
const [wp, out] = process.argv.slice(2);
(async () => { const b = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
  const p = await b.newPage(); await p.setViewport({ width: 1280, height: 720, deviceScaleFactor: 1.5 });
  await p.goto('http://localhost:8794/', { waitUntil: 'load' }); await new Promise(r => setTimeout(r, 3000));
  await p.evaluate(() => { const e = document.getElementById('intro'); scrollTo(0, e.offsetTop + .5 * (e.offsetHeight - innerHeight)); }); await new Promise(r => setTimeout(r, 1200));
  await p.evaluate(wp => { const i = document.getElementById('deskWp'); i.src = 'assets/img/v4/' + wp; i.style.opacity = 1; }, wp);
  await p.addStyleTag({ content: '.nav,.introswitch,.intro__bar,#cursor,.claim,#ring,.skip{display:none!important}#desk{opacity:1!important;visibility:visible!important;--ui:1!important}.desk__ui{opacity:1!important}#desk .desk__bar,#desk .desk__dock,#desk .dicon:not(.zab),#desk .dicon{display:flex!important}.dicon.zab{opacity:1!important}' });
  await new Promise(r => setTimeout(r, 1500)); await p.screenshot({ path: out, type: 'png' }); await b.close(); })();
