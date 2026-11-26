// node tools/stills.mjs <ordner> <t1> <t2> … → JPG-Standbilder in voller Auflösung. Umgebung: VARIANT=9x16|16x9|1x1, VIDEO_LANG=de|en, PLAYWRIGHT_DIR
import path from 'node:path'; import { readFile, mkdir, writeFile, stat } from 'node:fs/promises'; import { createRequire } from 'node:module';
const root = process.cwd(), [outDir, ...ts] = process.argv.slice(2);
const { chromium } = createRequire(process.env.PLAYWRIGHT_DIR ? path.resolve(process.env.PLAYWRIGHT_DIR, 'x.js') : path.join(root, 'package.json'))('playwright');
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.png': 'image/png', '.svg': 'image/svg+xml', '.woff2': 'font/woff2' };
await mkdir(outDir, { recursive: true });
const b = await chromium.launch(); const p = await b.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
await p.route('http://projekt.local/**', async r => { const f = path.resolve(root, '.' + decodeURIComponent(new URL(r.request().url()).pathname)); try { if (!f.startsWith(root) || !(await stat(f)).isFile()) throw 0; r.fulfill({ status: 200, contentType: mime[path.extname(f)] || 'application/octet-stream', body: await readFile(f) }); } catch { r.fulfill({ status: 404, body: '' }); } });
const v = process.env.VARIANT || '9x16', lang = process.env.VIDEO_LANG || 'de';
await p.goto(`http://projekt.local/src/index.html?variant=${v}&lang=${lang}`); await p.waitForFunction(() => window.__ready === true, {}, { timeout: 30000 }).catch(() => { console.error(errs.join('\n')); process.exit(1); });
for (const t of ts) { await p.evaluate(t => window.renderFrame(t), +t); const d = await p.evaluate(() => window.grab('image/jpeg')); await writeFile(path.join(outDir, `${v}-${lang}-t${(+t).toFixed(2).padStart(6, '0')}.jpg`), Buffer.from(d.split(',')[1], 'base64')); }
if (errs.length) console.error(errs.join('\n')); await b.close(); console.log('ok', ts.length);
