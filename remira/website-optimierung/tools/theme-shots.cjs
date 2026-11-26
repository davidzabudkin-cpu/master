// Beispielseiten des Themes: Screenshots 1440/390, Mega-Menü, Messwerte, Typo/Farben, Bibliotheken
// Aufruf: node theme-shots.cjs <ordner-erstansicht> <ordner-ganzseiten> <messwerte.json>
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const [OUT, FULL, JSONOUT] = process.argv.slice(2);
const PAGES = {
  'cleanpro-start': 'https://www.clean.pro/',
  'cleanpro-module': 'https://www.clean.pro/modules',
  'cleanpro-home-opt-1': 'https://www.clean.pro/template/home-opt-1',
  'cleanpro-home-opt-3': 'https://www.clean.pro/template/home-opt-3',
  'cleanpro-event': 'https://www.clean.pro/template/event',
  'cleanpro-kontakt': 'https://www.clean.pro/template/contact-us',
  'cleanpro-casestudy': 'https://www.clean.pro/template/case-study',
  'cleanpro-vergleich': 'https://www.clean.pro/template/feature-comparison',
  'momentum-start': 'https://momentumamp.com/',
  'momentum-produkt-ams': 'https://momentumamp.com/ams',
  'momentum-preise': 'https://momentumamp.com/pricing',
  'momentum-events': 'https://momentumamp.com/events',
  'flipside-start': 'https://www.flipsidegroup.com.au/',
  'cloudcapsule-start': 'https://www.cloudcapsule.io/',
  'cloudcapsule-preise': 'https://www.cloudcapsule.io/pricing/',
};
const VPS = { desktop: { width: 1440, height: 900 }, mobil: { width: 390, height: 844, isMobile: true, hasTouch: true } };
const PRIV = '[class*=testimonial i], [class*=review i], [class*=quote i], blockquote, [class*=team i] img, [class*=profile i] { filter: blur(9px) !important; }';
(async () => {
  const browser = await chromium.launch();
  const results = [];
  for (const [vpName, vp] of Object.entries(VPS)) for (const [name, url] of Object.entries(PAGES)) {
    const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, isMobile: !!vp.isMobile, hasTouch: !!vp.hasTouch, locale: 'en-US' });
    const page = await ctx.newPage();
    let bytes = 0, reqs = 0; const blocked = new Set(); const libs = new Set();
    page.on('response', async r => { reqs++; const l = Number(r.headers()['content-length'] || 0); bytes += l; const u = r.url();
      const m = u.match(/(gsap|ScrollTrigger|aos|lottie|swiper|slick|owl\.carousel|jquery[^/]*|three|lenis|locomotive|splide|glide|anime|typed|morph-text|count-up|parallax|rellax|wow)[^/]*\.js/i); if (m) libs.add(m[0].slice(0, 50)); });
    page.on('requestfailed', r => { try { blocked.add(new URL(r.url()).host); } catch {} });
    const t0 = Date.now();
    await page.goto(url, { waitUntil: 'load', timeout: 60000 }).catch(e => console.error(name, e.message));
    const loadMs = Date.now() - t0;
    await page.waitForTimeout(3000);
    const nav = await page.evaluate(() => { const n = performance.getEntriesByType('navigation')[0] || {}; const p = performance.getEntriesByType('paint').find(e => e.name === 'first-contentful-paint'); return { ttfb: Math.round(n.responseStart || 0), load: Math.round(n.loadEventEnd || 0), fcp: p ? Math.round(p.startTime) : null }; });
    // Cookie-Banner ausblenden, ohne zuzustimmen
    await page.evaluate(() => document.querySelectorAll('#hs-eu-cookie-confirmation, [id*=cookie i], [class*=cookie-banner i], #onetrust-banner-sdk, #CybotCookiebotDialog').forEach(e => e.remove()));
    await page.screenshot({ path: path.join(OUT, `${name}-${vpName}.jpg`), type: 'jpeg', quality: 78 });
    const style = await page.evaluate(() => {
      const cs = s => { const e = document.querySelector(s); if (!e) return null; const c = getComputedStyle(e); return { font: c.fontFamily.split(',')[0].replace(/"/g, ''), size: c.fontSize, weight: c.fontWeight, line: c.lineHeight, color: c.color, ls: c.letterSpacing, tt: c.textTransform }; };
      const btn = [...document.querySelectorAll('a[class*=button i], a[class*=btn i], .cta_button, button')].find(e => e.getBoundingClientRect().width > 60);
      const b = btn ? getComputedStyle(btn) : null;
      const colors = {}; [...document.querySelectorAll('section, div, a, h1, h2, h3, p, span')].slice(0, 2500).forEach(e => { const c = getComputedStyle(e); [c.backgroundColor, c.color].forEach(v => { if (v && !v.includes('rgba(0, 0, 0, 0)')) colors[v] = (colors[v] || 0) + 1; }); });
      const top = Object.entries(colors).sort((a, b) => b[1] - a[1]).slice(0, 10).map(x => x[0]);
      const anim = { aos: document.querySelectorAll('[data-aos]').length, animatedCss: [...document.querySelectorAll('*')].filter(e => { const a = getComputedStyle(e).animationName; return a && a !== 'none'; }).length, video: document.querySelectorAll('video').length, lottie: document.querySelectorAll('lottie-player, dotlottie-player').length, canvas: document.querySelectorAll('canvas').length, sticky: [...document.querySelectorAll('header, nav, [class*=header]')].some(e => ['sticky', 'fixed'].includes(getComputedStyle(e).position)) };
      return { h1: cs('h1'), h2: cs('h2'), p: cs('p'), button: b ? { bg: b.backgroundColor, color: b.color, radius: b.borderRadius, font: b.fontFamily.split(',')[0], weight: b.fontWeight, pad: b.padding } : null, topColors: top, anim, height: document.documentElement.scrollHeight, overflowX: document.documentElement.scrollWidth > innerWidth, h1count: document.querySelectorAll('h1').length, sections: document.querySelectorAll('.dnd-section, section').length };
    });
    // Mega-Menü / Handy-Menü öffnen (best effort)
    try {
      if (vpName === 'desktop') {
        const item = await page.$('header nav li:has(ul) > a, header nav li:has(ul) > span, header [class*=menu] li:has(ul) > a, header [class*=mega] a');
        if (item) { await item.hover(); await page.waitForTimeout(900); await page.screenshot({ path: path.join(OUT, `${name}-${vpName}-menue.jpg`), type: 'jpeg', quality: 78 }); }
      } else {
        const burger = await page.$('header [class*=hamburger i], header [class*=toggle i], header [aria-label*=menu i], header button');
        if (burger && await burger.isVisible()) { await burger.click(); await page.waitForTimeout(900); await page.screenshot({ path: path.join(OUT, `${name}-${vpName}-menue.jpg`), type: 'jpeg', quality: 78 }); await page.reload({ waitUntil: 'load' }).catch(() => {}); await page.waitForTimeout(1500); }
      }
    } catch (e) {}
    await page.mouse.move(5, 5);
    const h = await page.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < h; y += vp.height * 0.7) { await page.evaluate(yy => window.scrollTo(0, yy), y); await page.waitForTimeout(220); }
    await page.evaluate(() => window.scrollTo(0, 0)); await page.waitForTimeout(800);
    await page.addStyleTag({ content: PRIV });
    await page.evaluate(() => document.querySelectorAll('#hs-eu-cookie-confirmation, [id*=cookie i], #onetrust-banner-sdk, #CybotCookiebotDialog').forEach(e => e.remove()));
    let sectionsPos = null;
    if (name === 'cleanpro-module' && vpName === 'desktop') sectionsPos = await page.evaluate(() => [...document.querySelectorAll('h2, h4')].map(e => ({ tag: e.tagName, text: e.innerText.trim().slice(0, 60), y: Math.round(e.getBoundingClientRect().top + scrollY) })));
    await page.screenshot({ path: path.join(FULL, `${name}-${vpName}-ganz.jpg`), fullPage: true, type: 'jpeg', quality: 72 }).catch(e => console.error('full', name, e.message));
    results.push({ name, url, vp: vpName, loadMs, ...nav, bytes, reqs, libs: [...libs], failedHosts: [...blocked], ...style, sectionsPos });
    console.log(vpName, name, loadMs + 'ms', (bytes / 1e6).toFixed(2) + 'MB', 'failed:', [...blocked].join(','));
    await ctx.close();
  }
  fs.writeFileSync(JSONOUT, JSON.stringify(results, null, 1));
  await browser.close();
})();
