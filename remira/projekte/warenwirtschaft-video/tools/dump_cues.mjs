// node tools/dump_cues.mjs → plan/cues.json (Zeitpunkte für den Ton) + Lesezeit-Prüfung (1 s pro 2,5 Wörter + 1 s, WWS-Feedback 23.11.)
import { writeFileSync } from 'node:fs';
import { cues, TX } from '../src/timeline.js';
writeFileSync(new URL('../plan/cues.json', import.meta.url), JSON.stringify(cues(), null, 1));
let bad = 0;
for (const [k, [t0, t1, s]] of Object.entries(TX)) {
  const n = s.split(/\s+/).filter(w => /[\p{L}\d&]/u.test(w)).length, need = n / 2.5 + 1.0, have = t1 - t0 - (t1 < 80 ? .45 : 0);   // Szene blendet .45 s vor der Fahrt aus
  const ok = have >= need; if (!ok) bad++;
  console.log(`${ok ? 'ok ' : 'ZU KURZ'} ${k.padEnd(7)} ${n} Wörter, steht ${have.toFixed(1)} s, braucht ${need.toFixed(1)} s`);
}
console.log(bad ? `${bad} Texte zu kurz` : 'Lesezeit: alle Texte ok'); console.log('plan/cues.json geschrieben');
