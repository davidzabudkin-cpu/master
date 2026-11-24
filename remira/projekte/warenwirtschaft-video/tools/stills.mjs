// node tools/stills.mjs cache/stills 2.5 8 14 … → einzelne PNG-Standbilder (volle Auflösung) zum Prüfen (Sprache: VIDEO_LANG=en)
import http from 'node:http'; import path from 'node:path'; import { readFile, mkdir, writeFile, stat } from 'node:fs/promises'; import { createRequire } from 'node:module';
const root = process.cwd(), [outDir, ...ts] = process.argv.slice(2);
const { chromium } = createRequire(path.join(process.env.PLAYWRIGHT_DIR ? path.resolve(process.env.PLAYWRIGHT_DIR, 'x.js') : path.join(root, 'package.json')))('playwright');
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.png': 'image/png', '.svg': 'image/svg+xml', '.woff2': 'font/woff2' };
const srv = http.createServer(async (q, r) => { try { const f = path.resolve(root, '.' + decodeURIComponent(new URL(q.url, 'http://x').pathname)); if (!f.startsWith(root) || (await stat(f)).isDirectory()) throw 0; r.writeHead(200, { 'Content-Type': mime[path.extname(f)] || 'application/octet-stream' }); r.end(await readFile(f)); } catch { r.writeHead(404); r.end(); } });
await new Promise(res => srv.listen(0, '127.0.0.1', res)); await mkdir(outDir, { recursive: true });
const b = await chromium.launch(); const p = await b.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
await p.goto(`http://127.0.0.1:${srv.address().port}/src/index.html?variant=${process.env.VARIANT||''}&ashift=${process.env.ASHIFT||40}&lang=${process.env.VIDEO_LANG||"de"}&bug=${process.env.BUG||"logo"}`); await p.waitForFunction(() => window.__ready === true, {}, { timeout: 30000 }).catch(() => { console.error(errs.join('\n')); process.exit(1); });
for (const t of ts) { await p.evaluate(t => window.renderFrame(t), +t); const d = await p.evaluate(() => window.grab('image/jpeg')); await writeFile(path.join(outDir, `t${(+t).toFixed(3).padStart(7, "0")}.jpg`), Buffer.from(d.split(',')[1], 'base64')); }
if (errs.length) console.error(errs.join('\n')); await b.close(); srv.close(); console.log('ok', ts.length);
