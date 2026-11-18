// node tools/logo_bbox.mjs → Bounding-Boxen der Logo-Teile (Ring, REMIRA, Claim) im SVG-Raster, für data.js
import path from 'node:path'; import { readFile } from 'node:fs/promises'; import { createRequire } from 'node:module';
const { chromium } = createRequire(process.env.PLAYWRIGHT_DIR ? path.resolve(process.env.PLAYWRIGHT_DIR, 'x.js') : path.join(process.cwd(), 'package.json'))('playwright');
const svg = await readFile('assets/brand/remira-logo-claim-white.svg', 'utf8');
const b = await chromium.launch(); const p = await b.newPage(); await p.setContent(`<body>${svg}</body>`);
const r = await p.evaluate(() => [...document.querySelectorAll('path')].map(e => { const bb = e.getBBox(); return { c: e.getAttribute('class'), x: bb.x, y: bb.y, w: bb.width, h: bb.height }; }));
const box = a => ({ x0: Math.min(...a.map(q => q.x)), y0: Math.min(...a.map(q => q.y)), x1: Math.max(...a.map(q => q.x + q.w)), y1: Math.max(...a.map(q => q.y + q.h)) });
const word = r.filter(q => q.c === 'cls-1'); console.log("REMIRA", box(word.filter(q => q.y < 100)), "claim", box(word.filter(q => q.y >= 100)));
console.log('ring', box(r.filter(q => q.c !== 'cls-1')));
await b.close();
