// node tools/dump_cues.mjs → plan/cues.json (Zeitpunkte für den Ton) + Lesezeit-Prüfung (2,5 Wörter/s + 1 s). Sprache: VIDEO_LANG=en
import { writeFileSync } from 'node:fs';
import { T, TX, DURATION, BPM, BEAT, DROP0 } from '../src/data.js';
import { S } from '../src/texte.js';
const flat = {}; for (const [k, v] of Object.entries(T)) flat[k] = v;
writeFileSync('plan/cues.json', JSON.stringify({ duration: DURATION, bpm: BPM, beat: BEAT, drop0: DROP0, T: flat }, null, 1));
let ok = true;
for (const [k, [t0, t1, key]] of Object.entries(TX)) {
  const words = S[key].replace(/\*/g, '').split(/\s+/).filter(Boolean).length, need = words / 2.5 + 1, have = t1 - t0;
  const pass = have >= need - 1e-6; ok &&= pass;
  console.log(`${pass ? 'ok ' : 'ZU KURZ'} ${k.padEnd(6)} ${words} Wörter: ${have.toFixed(2)} s sichtbar, nötig ${need.toFixed(2)} s`);
}
console.log(ok ? 'Lesezeit: alles ok' : 'Lesezeit: nicht ok'); process.exit(ok ? 0 : 1);
