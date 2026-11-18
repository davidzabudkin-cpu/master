> Aus einem echten Studio-Workflow übernommen. „David“ = der ursprüngliche Auftraggeber/Geschmack, „ZAB“ = seine Studio-Marke, Pfade wie `Davids Studio/…` gibt es hier nicht. Die Regeln gelten allgemein; Geschmacksregeln sind ein erprobter Startpunkt, kein Gesetz.

# Mobile first und Tempo

Die meisten Besucher lokaler Betriebe kommen übers Handy aus Google Maps oder Instagram, oft unterwegs mit mittelmäßigem Netz. Die Seite muss dort am besten aussehen.

## Leistungsbudget (nach jedem Deploy messen)
- LCP (Hauptinhalt sichtbar) < 2,5 s mobil, INP (Reaktion) < 200 ms, CLS (Springen) < 0,1.
- Erster Seitenaufruf mobil: < 1,5 MB gesamt (Stufe 1/2), Hero-Bild < 250 KB, Loop-Video < 3 MB.
- Lighthouse mobil: Performance ≥ 90, Accessibility ≥ 95.

## Bauregeln
- Zuerst 375 px, dann größer (`min-width`-Media-Queries).
- `<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">`, `env(safe-area-inset-bottom)` für die Daumen-Leiste.
- Höhen mit `svh`/`dvh` statt `vh` (iOS-Adressleiste).
- `overflow-x: clip` auf `html` und `body` (vorher `hidden` als Fallback).
- Touch-Ziele ≥ 44 px, Abstand zwischen Buttons ≥ 8 px. Kein Hover-only-Inhalt.
- Schrift mobil mind. 16 px Fließtext, Headlines mit `clamp()`.
- Bilder: AVIF mit WebP-Fallback (`<picture>`), `srcset` + `sizes`, `width`/`height` gesetzt (kein Springen), Hero mit `fetchpriority="high"` + `<link rel="preload">`, alles andere `loading="lazy" decoding="async"`.
- `backdrop-filter` (Glas) sparsam: max. 2–3 Flächen gleichzeitig sichtbar, auf schwachen Geräten (`@media (prefers-reduced-transparency)` oder kleiner Viewport) durch halbtransparente Fläche ersetzen.
- Keine schweren Libraries für Effekte, die CSS kann. GSAP/Lenis nur in Stufe 3 und nur, wenn nötig.
- Kein Scroll-Hijacking (kein erzwungenes Einrasten, keine künstliche Scroll-Geschwindigkeit) auf dem Handy.

## Animationstechnik
**Scroll-Animationen per CSS (Chrome seit 2023, Safari seit 26 / Sept. 2025, Firefox noch nicht):**
```css
.reveal { opacity: 1; }
@supports (animation-timeline: view()) {
  @media (prefers-reduced-motion: no-preference) {
    .reveal {
      animation: reveal linear both;
      animation-timeline: view();
      animation-range: entry 0% cover 30%;
    }
  }
}
@keyframes reveal { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: none; } }
```
Ohne Unterstützung ist der Inhalt einfach sichtbar. Für Entrances mit Staffelung zusätzlich IntersectionObserver, der `.in` setzt.

**Hero je Stufe:**
- Stufe 1: Standbild (oder 2–3 Ebenen mit leichtem CSS-Parallax).
- Stufe 2: Loop-Video `<video autoplay muted loop playsinline poster="…">`, mobil eigene kleinere Datei (720p), bei `prefers-reduced-motion` oder `navigator.connection.saveData` nur Poster.
- Stufe 3: Scroll-Scrub nur am Desktop. Mobil-Gates per Medienabfragen (kleiner Viewport, Touch, reduced-motion, Save-Data, langsames Netz), mobil gestaltetes Standbild.

## Reduzierte Bewegung
Bei `prefers-reduced-motion: reduce`: alle Animationen/Transitions aus, alles im Endzustand, kein Video laden. Auch live umschalten können (Change-Event).

## Testliste (Phase 5)
1. Screenshots im eingebauten Browser: 375×812, 390×844, 768×1024, 1280×800, 1440×900 (`resize_window`).
2. Seitlich wegziehen unmöglich? Anker-Links testen.
3. Daumen-Leiste verdeckt keinen Inhalt (Footer hat Abstand).
4. Alle `tel:`, `wa.me`, Maps-Links, Formular-Erfolg.
5. Reduzierte Bewegung an (vor und während dem Laden).
6. Video fehlt / lädt nicht: Seite trotzdem komplett.
7. Konsole null Fehler (mobil und Desktop).
8. Unterlängen (g, y, p) in maskierten Texten nicht abgeschnitten.
9. Kontrast über Bildern am schlechtesten Bildbereich ≥ 4,5:1 (Fließtext) bzw. 3:1 (große Schrift), sonst Scrim.
10. Lighthouse/PageSpeed mobil nach Deploy, Werte notieren.
11. Frischer Blick: 5 Sekunden auf dem Handy, versteht man Laden, Ort, Zeiten, Kontakt?

## Headless-Test (wenn das Browser-Fenster der App versteckt ist oder zu klein)
Versteckte Tabs drosseln rAF/IntersectionObserver, Screenshots sind dann wertlos. Stattdessen `tools/shots.mjs` (puppeteer-core + lokales Chrome):
1. Einmalig im Scratchpad: `npm init -y && npm install puppeteer-core@23`, Skript dorthin kopieren und die Szenen-Listen (`desk`, `mob`) an die Seite anpassen.
2. `node shots.mjs http://localhost:<port>/ all` → PNGs in `out/` + Liste der Konsolenfehler.
3. Mit ffmpeg zu Kontaktbögen kacheln (`tile=2x4`) und ansehen.
Gelernt bei Kimo, 21.10.2026.
