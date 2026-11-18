// node tools/dump_cues.mjs → plan/cues.json (Zeitpunkte für den Ton)
import { writeFileSync } from 'node:fs';
import { cues } from '../src/timeline.js';
writeFileSync(new URL('../plan/cues.json', import.meta.url), JSON.stringify(cues(), null, 1));
console.log('plan/cues.json geschrieben');
