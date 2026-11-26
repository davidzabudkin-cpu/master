#!/usr/bin/env node
// REMIRA-Renderer (eigener Code, MIT – siehe LIZENZEN.md).
// Öffnet src/index.html eines Projekts im Headless-Chromium, ruft pro Frame window.renderFrame(t) auf,
// holt das Bild mit window.grab(type) und gibt es an ffmpeg (MP4) oder speichert JPGs.
//
// Aufruf im Projektordner (über src/render.js):
//   node src/render.js --from 0 --to 3 --fps 30 --scale 0.5 --out cache/probe --jpg
//   node src/render.js --out . --name "REMIRA-OMS-Erklaervideo-neu" --audio cache/audio/master.wav
// Optionen: --from/--to (Sekunden), --fps, --scale (0–1), --out, --name, --audio (WAV oder MP4/M4A = Ton bitgenau übernehmen), --jpg, --variant, --lang (de|en)
// Umgebung (optional): CHROMIUM_PATH = eigener Browser, PLAYWRIGHT_DIR = Ordner mit node_modules/playwright,
//                      FFMPEG = Pfad zu ffmpeg
import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import { existsSync } from 'node:fs';
import { mkdir, readFile, readdir, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { parseArgs } from 'node:util';

const { values: o } = parseArgs({
  options: {
    from: { type: 'string', default: '0' }, to: { type: 'string' }, fps: { type: 'string', default: '30' },
    scale: { type: 'string', default: '1' }, out: { type: 'string', default: 'cache/probe' },
    name: { type: 'string' }, audio: { type: 'string' }, variant: { type: 'string' }, lang: { type: 'string' }, jpg: { type: 'boolean', default: false },
  },
});

const projekt = process.cwd();
const quelle = path.join(projekt, 'src');
if (!existsSync(path.join(quelle, 'index.html'))) fehler('Kein src/index.html – bitte im Projektordner starten.');

const { DURATION } = await import(pathToFileURL(path.join(quelle, 'data.js')).href);
const von = Number(o.from), bis = Number(o.to ?? DURATION), fps = Number(o.fps), scale = Number(o.scale);
if (![von, bis, fps, scale].every(Number.isFinite) || von < 0 || bis <= von || fps <= 0 || scale <= 0 || scale > 1)
  fehler('Ungültige Werte für --from/--to/--fps/--scale.');
const anzahl = Math.ceil((bis - von) * fps - 1e-9);
const ziel = path.resolve(o.out);

let mp4 = null;
if (!o.jpg) {
  if (!o.name || /[\\/:*?"<>|]/.test(o.name)) fehler('Für MP4 bitte --name ohne Pfadzeichen angeben.');
  mp4 = path.join(ziel, `${o.name}.mp4`);
  if (existsSync(mp4)) fehler(`${mp4} gibt es schon – neuen Namen (z. B. -v2) wählen, alte Fassungen bleiben erhalten.`);
  if (o.audio && !existsSync(o.audio)) fehler(`Tondatei fehlt: ${o.audio}`);
}
await mkdir(ziel, { recursive: true });
if (o.jpg && (await readdir(ziel)).some(f => /^\d{5}\.jpg$/.test(f))) fehler(`In ${ziel} liegen schon Frames – leeren Ordner wählen.`);

const { chromium } = await ladePlaywright();
const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
let ffmpeg = null, ffmpegFertig = null;
try {
  const seite = await browser.newPage();
  const probleme = [];
  seite.on('pageerror', e => probleme.push(e.message));
  seite.on('console', m => { if (m.type() === 'error') probleme.push(m.text()); });

  // Dateien direkt aus dem Projektordner liefern (kein lokaler Server). Versteckte Ordner (.env, .git …) bleiben gesperrt.
  const HOST = 'http://projekt.local';
  const typen = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json', '.png': 'image/png',
    '.jpg': 'image/jpeg', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.woff': 'font/woff', '.ttf': 'font/ttf', '.mp4': 'video/mp4' };
  await seite.route(`${HOST}/**`, async route => {
    const teil = decodeURIComponent(new URL(route.request().url()).pathname);
    const datei = path.resolve(projekt, '.' + teil);
    const erlaubt = datei.startsWith(projekt + path.sep) && !path.relative(projekt, datei).split(path.sep).some(s => s.startsWith('.'));
    if (!erlaubt || !(await stat(datei).catch(() => null))?.isFile()) return route.fulfill({ status: 404, body: '' });
    route.fulfill({ status: 200, contentType: typen[path.extname(datei)] ?? 'application/octet-stream', body: await readFile(datei) });
  });
  seite.on('requestfailed', r => probleme.push('nicht geladen: ' + r.url()));
  seite.on('response', r => { if (r.status() >= 400) probleme.push(`${r.status()} ${r.url()}`); });

  const parameter = new URLSearchParams({ scale: String(scale), ...(o.variant ? { variant: o.variant } : {}), ...(o.lang ? { lang: o.lang } : {}) });
  await seite.goto(`${HOST}/src/index.html?${parameter}`);
  await seite.waitForFunction(() => window.__ready === true || window.__err, null, { timeout: 60_000 })
    .catch(() => fehler('Szene wurde nicht bereit: ' + probleme.join(' | ')));
  if (probleme.length) fehler(probleme.join('\n'));

  if (mp4) {
    const args = ['-hide_banner', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(fps), '-i', 'pipe:0'];
    // Ton: WAV wird als AAC kodiert. Ist --audio schon ein Video/AAC (.mp4/.m4a/.aac), wird die Tonspur bitgenau übernommen.
    const kopieren = o.audio && /\.(mp4|m4a|aac)$/i.test(o.audio);
    if (kopieren && von !== 0) fehler('Tonspur kopieren geht nur ab --from 0.');
    if (o.audio) args.push(...(kopieren ? [] : ['-ss', String(von), '-t', String(bis - von)]), '-i', path.resolve(o.audio), '-map', '0:v', '-map', '1:a:0',
      ...(kopieren ? ['-c:a', 'copy'] : ['-af', 'apad', '-c:a', 'aac', '-b:a', '192k', '-ar', '48000']));
    args.push('-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-pix_fmt', 'yuv420p', '-frames:v', String(anzahl),
      '-movflags', '+faststart', mp4);
    ffmpeg = spawn(process.env.FFMPEG || 'ffmpeg', args, { stdio: ['pipe', 'inherit', 'inherit'] });
    ffmpegFertig = new Promise((ok, nein) => {
      ffmpeg.on('error', nein);
      ffmpeg.on('close', code => (code === 0 ? ok() : nein(new Error(`ffmpeg beendet mit Code ${code}`))));
    });
    ffmpegFertig.catch(() => {});
    ffmpeg.stdin.on('error', () => {});
  }

  const typ = o.jpg ? 'image/jpeg' : 'image/png';
  for (let i = 0; i < anzahl; i++) {
    const t = von + i / fps;
    await seite.evaluate(zeit => window.renderFrame(zeit), t);
    if (probleme.length) fehler(`Fehler bei ${t.toFixed(2)} s: ${probleme.join(' | ')}`);
    const dataUrl = await seite.evaluate(art => window.grab(art), typ);
    const bild = Buffer.from(dataUrl.slice(dataUrl.indexOf(',') + 1), 'base64');
    if (o.jpg) await writeFile(path.join(ziel, `${String(i).padStart(5, '0')}.jpg`), bild);
    else if (!ffmpeg.stdin.write(bild)) await new Promise((ok, nein) => { ffmpeg.stdin.once('drain', ok); ffmpegFertig.catch(nein); });
    if (anzahl >= 300 && i % 300 === 299) console.log(`… ${i + 1}/${anzahl} Frames`);
  }
  if (ffmpeg) { ffmpeg.stdin.end(); await ffmpegFertig; }
  console.log(`Fertig: ${anzahl} Frames bei ${fps} fps → ${mp4 ?? ziel}${mp4 && !o.audio ? ' (ohne Ton, --audio angeben)' : ''}`);
} finally {
  if (ffmpeg && ffmpeg.exitCode === null) ffmpeg.kill();
  await browser.close();
}

async function ladePlaywright() {
  if (process.env.PLAYWRIGHT_DIR) return createRequire(path.join(path.resolve(process.env.PLAYWRIGHT_DIR), 'x.js'))('playwright');
  try { return createRequire(path.join(projekt, 'package.json'))('playwright'); }
  catch { fehler('Playwright fehlt: im Projektordner „npm install“ und „npx playwright install chromium“ ausführen.'); }
}

function fehler(text) { console.error('Fehler: ' + text); process.exit(1); }
