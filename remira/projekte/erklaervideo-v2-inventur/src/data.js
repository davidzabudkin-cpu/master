// Maße, Farben (Remira-Branding), Wortzeiten aus der Stimme (plan/words.json).
import vo from '../plan/words.json' with { type: 'json' };
export const W = 1920, H = 1080, FPS = 30, TAIL = 3.0, F = 1700;
export const words = vo.words;
export const w0 = i => vo.words[i].t0;
export const w1 = i => vo.words[i].t1;
export const DURATION = Math.ceil((vo.words.at(-1).t1 + TAIL) * 10) / 10;
export const C = { black: '#000000', bg: '#05080F', navy: '#0B1524', text: '#FFFFFF', grey: '#A8A8A8', dark: '#3D3C3C', blue: '#41B6E6', blue2: '#1A82CB', orange: '#FF9524', green: '#61BD47' };
// Logo-Ring im Uhrzeigersinn ab oben: Petrol, Rot, Gelb, Grün, Orange, Blau (hell, mittel, dunkel)
export const RING = [['#28ABBA', '#188C9B', '#076B79'], ['#FF5869', '#F53D47', '#E10600'], ['#F7EA48', '#FCDA34', '#FFCD24'], ['#A1D884', '#61BD47', '#43B02A'], ['#FFB25B', '#FF9524', '#FF8200'], ['#41B6E6', '#1A82CB', '#005EB8']];
