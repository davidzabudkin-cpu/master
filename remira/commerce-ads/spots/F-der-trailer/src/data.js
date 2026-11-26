// Spot A „Das letzte Paar“: eine Quelle für alle Zeitpunkte (Bild in main.js, Ton über tools/dump_cues.mjs → plan/cues.json → tools/mix.py).
// Muster: Text zeigen → Lesezeit → Bild-Ereignis → nächstes Ereignis (nie zwei Bewegungen gleichzeitig).
// Musik 123,8 BPM: Beat-Raster ab dem ersten Kick (2,7 s); Ring landet auf Beat 13 (9,0 s), Logo auf Beat 21 (12,88 s).
export const BPM = 123.8, BEAT = 60 / BPM, DROP0 = 2.7;
export const DURATION = 17.3, FPS = 30;
export const T = {
  // Hook: Karton mit „Nur noch 1“, Satz, dann Laden und Online-Shop nacheinander
  box: .1, tag: .35, hook: .45, store: 1.2, shop: 1.6,
  // Doppelverkauf: Karton geht in den Laden → „Verkauft“; Tipp im Shop → „Verkauft“; Shop-Verkauf wird storniert
  fly: [2.7, 3.2], sold1: 3.2, tap: 3.55, sold2: 3.75, cancel: 4.3, hookOut: 4.6,
  // Problem: Satz → Bestandszähler (0 gegen 1) → Bewertung fällt
  agit: 4.95, count: 5.8, stars: [6.7, 7.5], agitOut: 8.0, dim: 8.0,
  // Wendung: Ring fliegt ein (Riser), landet auf Beat 13, verbindet Laden und Shop
  ring: [8.2, 9.0], links: [9.0, 9.5], undim: 9.0,
  // Lösung: Satz → Impuls Laden → Ring → Shop, Shop zeigt sofort „Ausverkauft“, Zähler synchron → Chip „Echtzeit“
  sol: 9.0, pulse: [10.6, 11.2], sync: 11.2, chip: 11.6, solOut: 12.45,
  // Endkarte: Ring fährt ins Original-Logo
  end: 12.88
};
// Texte mit Zeitfenster (für die Lesezeit-Prüfung: 2,5 Wörter/s + 1 s)
export const TX = {
  hook: [T.hook, T.hookOut, 'hook'],
  agit: [T.agit, T.agitOut, 'agit'],
  sol: [T.sol, T.solOut, 'sol'],
  claim: [T.end + .9, DURATION, 'claim']
};
