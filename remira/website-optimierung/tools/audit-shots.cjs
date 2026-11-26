// Audit-Screenshots + Messwerte für remira.com (Desktop 1440, Handy 390)
// Aufruf: node audit-shots.cjs <ausgabeordner>
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const OUT = process.argv[2] || 'audit';
const PAGES = {
  start: 'https://remira.com/de/',
  plattform: 'https://remira.com/de/supply-chain-und-omnichannel-commerce-plattform',
  commerce: 'https://remira.com/de/omnichannel-commerce-software',
  produkt_oms: 'https://remira.com/de/ordermanagement-software',
  branche_fashion: 'https://remira.com/de/software/fashion-und-schuhe',
  webinare: 'https://remira.com/de/webinare',
  kontakt: 'https://remira.com/de/kontakt',
};
const VPS = { desktop: { width: 1440, height: 900 }, mobil: { width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 1 } };
(async () => {
  const browser = await chromium.launch();
  const results = [];
  for (const [vpName, vp] of Object.entries(VPS)) {
    for (const [name, url] of Object.entries(PAGES)) {
      const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, isMobile: !!vp.isMobile, hasTouch: !!vp.hasTouch, deviceScaleFactor: vp.deviceScaleFactor || 1, locale: 'de-DE' });
      const page = await ctx.newPage();
      let bytes = 0, reqs = 0; const byType = {}; const hosts = new Set();
      page.on('response', async r => { try { const len = Number(r.headers()['content-length'] || 0) || (await r.body().catch(() => Buffer.alloc(0))).length; bytes += len; reqs++; const t = r.request().resourceType(); byType[t] = (byType[t] || 0) + len; hosts.add(new URL(r.url()).host); } catch {} });
      const t0 = Date.now();
      await page.goto(url, { waitUntil: 'load', timeout: 60000 }).catch(e => console.error(url, e.message));
      const loadMs = Date.now() - t0;
      await page.waitForTimeout(2500);
      const nav = await page.evaluate(() => { const n = performance.getEntriesByType('navigation')[0]; const p = performance.getEntriesByType('paint').find(e => e.name === 'first-contentful-paint'); return { ttfb: Math.round(n.responseStart), dcl: Math.round(n.domContentLoadedEventEnd), load: Math.round(n.loadEventEnd), fcp: p ? Math.round(p.startTime) : null }; });
      await page.screenshot({ path: path.join(OUT, `${name}-${vpName}-erstansicht-mit-cookiebanner.png`) });
      // Cookie-Banner (Usercentrics) für saubere Screenshots ausblenden, ohne zuzustimmen
      await page.evaluate(() => { document.querySelectorAll('#usercentrics-cmp-ui, #usercentrics-root, aside#usercentrics-cmp-ui').forEach(e => e.remove()); document.body.style.overflow = 'auto'; });
      await page.screenshot({ path: path.join(OUT, `${name}-${vpName}-erstansicht.png`) });
      // langsam scrollen, damit Lazy-Load/Animationen auslösen
      const h = await page.evaluate(() => document.documentElement.scrollHeight);
      for (let y = 0; y < h; y += vp.height * 0.7) { await page.evaluate(yy => window.scrollTo(0, yy), y); await page.waitForTimeout(250); }
      await page.evaluate(() => window.scrollTo(0, 0)); await page.waitForTimeout(800);
      // Datenschutz: Kundenzitate mit Personennamen unkenntlich machen, bevor ganze Seiten gespeichert werden
      await page.addStyleTag({ content: '[class*=testimonial], .quote, blockquote { filter: blur(9px) !important; }' });
      await page.screenshot({ path: path.join(OUT, `${name}-${vpName}-ganz.jpg`), fullPage: true, type: 'jpeg', quality: 70 });
      const info = await page.evaluate(() => {
        const imgs = [...document.images].filter(i => i.naturalWidth > 0 && i.getBoundingClientRect().width > 0).map(i => ({ src: (i.currentSrc || i.src).split('?')[0].slice(-80), nat: i.naturalWidth + 'x' + i.naturalHeight, shown: Math.round(i.getBoundingClientRect().width) + 'x' + Math.round(i.getBoundingClientRect().height), ratio: +(i.naturalWidth / Math.max(1, i.getBoundingClientRect().width * devicePixelRatio)).toFixed(1), lazy: i.loading, fmt: ((i.currentSrc || i.src).split('?')[0].match(/\.(\w+)$/) || [])[1] || '?' }));
        const hs = [...document.querySelectorAll('h1,h2,h3')].map(e => e.tagName + ': ' + e.innerText.trim().replace(/\s+/g, ' ').slice(0, 90)).filter(s => s.length > 4);
        const ctas = [...document.querySelectorAll('a.button, a[class*=btn], a[class*=button], button, .hs-cta-wrapper a, a.cta_button')].filter(e => e.getBoundingClientRect().width > 0).map(e => e.innerText.trim().replace(/\s+/g, ' ')).filter(Boolean);
        const body = getComputedStyle(document.body); const p = document.querySelector('main p, .body-container p, p');
        const ps = p ? getComputedStyle(p) : null;
        const overflowX = document.documentElement.scrollWidth > window.innerWidth;
        const smallTap = [...document.querySelectorAll('a,button')].filter(e => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0 && (r.height < 32 || r.width < 32); }).length;
        return { title: document.title, metaDesc: (document.querySelector('meta[name=description]') || {}).content || '', h1count: document.querySelectorAll('h1').length, heads: hs.slice(0, 40), ctas: [...new Set(ctas)].slice(0, 30), fontBody: body.fontFamily, pSize: ps ? ps.fontSize : null, pLine: ps ? ps.lineHeight : null, pColor: ps ? ps.color : null, overflowX, scrollW: document.documentElement.scrollWidth, height: document.documentElement.scrollHeight, smallTap, imgs, words: document.body.innerText.split(/\s+/).length };
      });
      results.push({ name, url, vp: vpName, loadMs, ...nav, bytes, reqs, byType, hosts: [...hosts], ...info });
      console.log(vpName, name, loadMs + 'ms', (bytes / 1e6).toFixed(2) + 'MB', reqs + ' req', 'overflowX=' + info.overflowX);
      await ctx.close();
    }
  }
  fs.writeFileSync(path.join(OUT, '..', 'messwerte.json'), JSON.stringify(results, null, 1));
  await browser.close();
})();
