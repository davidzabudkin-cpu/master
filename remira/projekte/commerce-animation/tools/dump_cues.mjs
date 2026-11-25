// node tools/dump_cues.mjs → plan/cues.json (Zeitpunkte für den Ton) + Lesezeit-Prüfung der Punkte links/rechts (2,5 Wörter/s + 1 s bis zum nächsten Punkt bzw. Ende)
import { writeFileSync } from 'node:fs';
import { cues, T } from '../src/timeline.js';
import { CHALLENGES, BENEFITS, DURATION } from '../src/data.js';
writeFileSync(new URL('../plan/cues.json', import.meta.url), JSON.stringify(cues(), null, 1));
let bad = 0;
const chk = (name, items, t0, tEnd) => items.forEach((c, k) => { const n = c.lines.join(' ').split(/\s+/).filter(w => /[\p{L}&]/u.test(w)).length, need = n / 2.5 + 1, have = (k < 3 ? t0(k + 1) : tEnd) - t0(k), ok = have >= need; if (!ok) bad++; console.log(`${ok ? 'ok ' : 'ZU KURZ'} ${name}${k + 1} ${n} Wörter, eigene Zeit ${have.toFixed(1)} s, braucht ${need.toFixed(1)} s`); });
chk('Herausforderung ', CHALLENGES, T.ch, T.flow); chk('Vorteil ', BENEFITS, T.be, T.settle);
console.log(bad ? `${bad} zu kurz` : 'Lesezeit: alle ok'); console.log('plan/cues.json geschrieben');
