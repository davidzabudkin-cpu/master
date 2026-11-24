---
name: remira-phosphor-icons
description: Icons für alles, was für Remira entsteht (Erklärvideos, Motion-Grafiken, Plattform-Grafiken, Folien, Websites, Mockups). Remira nutzt Phosphor Icons; dieser Skill sagt, welche Quelle, Version und welches Gewicht, wie man ein Icon per Name holt (SVG oder Canvas-Path2D), wie es in Canvas-Videos und HTML eingesetzt wird und welche Icons im OMS-Video stecken. Nutzen, sobald in einem Remira-Projekt ein Icon gebraucht wird, wenn David „Phosphor“, „Remira-Icons“, „Icon-Bibliothek“ sagt oder Icons „wie bei Remira“ aussehen sollen. Nie Icons nachzeichnen, immer die Original-SVGs.
---

# Remira – Phosphor Icons

Remira verwendet in der Asset-Bibliothek die Phosphor-Icons (phosphoricons.com, Screenshots von David: acorn, address-book, airplane …). Für Remira-Arbeiten **immer die Original-SVGs** nehmen, nichts nachzeichnen, keine anderen Icon-Sets mischen.

## Quelle und Version
- Paket `@phosphor-icons/core`, **Version fest 2.1.1** (gleich bleiben, damit alle Videos dieselben Formen haben).
- Abruf: `https://unpkg.com/@phosphor-icons/core@2.1.1/assets/<gewicht>/<name>[-<gewicht>].svg` (bei regular ohne Suffix, z. B. `assets/bold/truck-bold.svg`) oder `npm pack @phosphor-icons/core@2.1.1` in einen eigenen, leeren Ordner.
- Namen und englische Tags stehen in `dist/index.mjs` des Pakets (das Skript liest sie).

## Gewicht: light (Standard seit 23.11.2026)
- **Standard ist light** (`--weight light`, Dateien `assets/light/<name>-light.svg`). Marketing-Feedback zum WWS-Video v3: bold wirkt zu dick und „knubbelig“, REMIRA nutzt schmale Icons. thin (8/256) ist bei 38–46 px im Video kaum lesbar (≈ 1,4 px Linie), light (12/256 ≈ 2 px) ist der Kompromiss.
- Davor (12.11., OMS-Video) war bold Standard, weil regular neben fetter Schrift zu dünn wirkte. OMS- und Plattform-Video nutzen noch bold; bei der nächsten Überarbeitung auf light umstellen.
- **Ausnahme bold:** kleine Symbole auf farbig gefüllten Plaketten (Häkchen in grünen Kreisen, Kreuz in roten Kreisen, Chip-Icons, erledigte Schritt-Nummern) bleiben bold, light ist dort zu dünn (Marketing 24.11.). Im WWS-Projekt: `src/phosphor-icons-bold.js` (`BOLD.check`, `BOLD.x`).
- In Videos Icons ca. 10–15 % größer setzen als die reine Kreisgröße nahelegt (Faktor 1,12 in `drawIcon`); Icons in Chips mindestens 22 px.
- Ohne Netz zu unpkg: `npm pack @phosphor-icons/core@2.1.1` in einen leeren Ordner, entpacken und `package/` nach `~/.cache/phosphor-core-2.1.1` kopieren, dann läuft `scripts/phosphor.py` offline.

## Farbe und Strich im Remira-Branding
- Auf dunklem Grund weiß (#FFFFFF), auf hellem Grund schwarz (#000000). Akzent nur für Hervorhebung: #41B6E6. Ringfarben (#41B6E6 #28ABBA #61BD47 #FCDA34 #FF9524 #F53D47) nicht für Icons, sondern für Punkte/Flächen.
- Strichstärke nie ändern: Phosphor-SVGs sind **Flächen** (`fill`), keine Striche. Größe nur über Skalierung des 256er-Rasters.
- Typische Größen im 1080p-Video: 38–46 px in Kreisen von 48–62 px Radius; im Fließtext ca. 1,0–1,2 × Schriftgröße.
- Icon-Behälter wie im OMS-Video: Glaskreis `rgba(255,255,255,.06)` mit 2 px Rand `rgba(255,255,255,.22)`, aktiv Rand #41B6E6.

## Werkzeug: `scripts/phosphor.py`
```
python scripts/phosphor.py search truck delivery        # Namen finden (Tags sind Englisch: „warehouse“, nicht „Lager“)
python scripts/phosphor.py get truck warehouse --weight light --out assets/icons   # SVG-Dateien + PHOSPHOR-LICENSE.txt
python scripts/phosphor.py js truck warehouse --weight light --out src/phosphor-icons.js   # ES-Modul für Canvas
python scripts/phosphor.py js truck --weight regular --out src/icons-regular.js   # nur für sehr große Icons
```
Cache: `~/.cache/phosphor-core-2.1.1`. Nur Python-Standardbibliothek.

## Einsatz im Canvas-Video (Code-Animation)
```js
import { phosphorPath } from './phosphor-icons.js';            // vom Skript erzeugt
const ICON = new Proxy({}, { get: (c, n) => c[n] || (c[n] = phosphorPath(n)) });
function drawIcon(name, x, y, size, u, col = '#fff') {            // u = 0…1 Einblende-Fortschritt
  if (u <= 0) return;
  const e = outBack(clamp(u * 1.4), 1.6), wipe = clamp(u * 1.6);
  g.save(); g.translate(x, y); g.scale(e, e); g.globalAlpha *= clamp(u * 2.2);
  if (wipe < 1) { g.beginPath(); g.rect(-size / 2 - 2, -size / 2 - 2, (size + 4) * wipe, size + 4); g.clip(); }
  g.translate(-size / 2, -size / 2); g.scale(size / 256, size / 256); g.fillStyle = col; g.fill(ICON[name]); g.restore();
}
```
Weil es Flächen sind, funktioniert „Linie zeichnet sich“ (setLineDash) nicht. Einblenden per Pop + Wischblende (wie oben) oder Maske.

## Einsatz in HTML / Website
- SVG inline einfügen (`fill="currentColor"` steht schon drin), Farbe über CSS `color`, Größe über `width/height` (`viewBox 0 0 256 256` bleibt).
- Alternativ Web-Paket `@phosphor-icons/web@2.1.1` von unpkg (Icon-Font, Klasse `ph ph-truck`), Version immer fest angeben.

## Lizenz
MIT (Copyright (c) 2023 Phosphor Icons). Erlaubt kommerzielle Nutzung und Änderung; **Lizenzhinweis mitliefern**: `PHOSPHOR-LICENSE.txt` bzw. `assets/phosphor/LICENSE.txt` im Projekt behalten, Kopfzeile im erzeugten JS-Modul nicht löschen. Im fertigen Video ist kein sichtbarer Hinweis nötig.

## Im OMS-Video verwendet (schulung/oms-video, ab Runde 3 bold)
| Stelle | Phosphor-Name (Gewicht bold) |
|---|---|
| Intro: Bestellung, Lager, Versand, Lieferung | `shopping-cart`, `warehouse`, `package`, `house` |
| Schritte: Auftrag erfassen, Bestand prüfen, Ware versenden, Rechnung stellen, Kunden betreuen | `clipboard-text`, `barcode`, `truck`, `receipt`, `headset` |
| Kanäle: Online-Shop, Marktplatz, Filiale, App | `laptop`, `squares-four`, `storefront`, `device-mobile` |
| Ziele: Lager, Filiale, Logistikpartner | `warehouse`, `storefront`, `truck` |
| Ship-from-Store, Click & Collect, Auftragsweiterleitung, ERP-Anbindung | `package`, `shopping-bag`, `arrows-split`, `plugs-connected` |
| Häkchen (Vorteile, Chip „verfügbar“) | `check` |
Nicht als Icon: Bildschirme, Uhrzeiger und Papierzettel im Problem-Teil sind Illustrationen.

## Fehler, die nicht wieder passieren
- Icons nachgezeichnet statt Original (Runde 1 des OMS-Videos) → immer Skript `get`/`js`.
- Gewicht regular im Video zu dünn (Runde 2) → bold; bold zu „knubbelig“ (Marketing 23.11.) → light als Standard.
- Chip/Box mit fester Breite → Breite aus `measureText` + Padding berechnen, damit Text und Icon drin bleiben.
