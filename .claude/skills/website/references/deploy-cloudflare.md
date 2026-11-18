> Aus einem echten Studio-Workflow übernommen. „David“ = der ursprüngliche Auftraggeber/Geschmack, „ZAB“ = seine Studio-Marke, Pfade wie `Davids Studio/…` gibt es hier nicht. Die Regeln gelten allgemein; Geschmacksregeln sind ein erprobter Startpunkt, kein Gesetz.

# Deploy auf Cloudflare

Dein Account: Workers unter `*.<dein-account>.workers.dev` (Sonata läuft dort). Kostenlos im Free-Plan für statische Seiten.

## Wichtige Eigenheiten auf Davids PC (Windows)
- Wrangler nur über `npx.cmd --yes wrangler@4 …` (PowerShell blockiert `.ps1`).
- Aus dem Kit-Ordner ausführen und die Config mit `-c` angeben (in manchen App-Ordnern bricht npx wegen `overrides` ab).

## Projektstruktur (Standard, statisch)
```
projekte/<slug>/
├── design-paket.md
├── STATUS.md
├── wrangler.jsonc
├── review/            ← Rohdaten, Video-Rohfassungen (wird NICHT deployt)
└── site/              ← nur das wird deployt
    ├── index.html, styles.css, main.js
    ├── impressum.html, datenschutz.html
    ├── _headers
    └── assets/
```

`wrangler.jsonc`:
```jsonc
{
  "name": "<slug>",              // klein, Bindestriche, 3–63 Zeichen
  "compatibility_date": "2025-05-01",
  "assets": { "directory": "./site", "not_found_handling": "404-page" }
}
```

`site/_headers` für Pitch-Demos (noindex):
```
/*
  X-Robots-Tag: noindex, nofollow
  Referrer-Policy: strict-origin-when-cross-origin
  X-Content-Type-Options: nosniff
/assets/*
  Cache-Control: public, max-age=31536000, immutable
```
Plus `<meta name="robots" content="noindex, nofollow">` im `<head>`. Bei echten, freigegebenen Kundenseiten beides entfernen.

## Befehle (im Kit-Ordner)
- Vorschau lokal: `.claude/launch.json` um einen Eintrag mit `python -m http.server <port> -d "projekte/<slug>/site"` ergänzen und per `preview_start` öffnen.
- Deploy: `npx.cmd --yes wrangler@4 deploy -c "projekte\<slug>\wrangler.jsonc"`
- Ergebnis-URL: `https://<slug>.<dein-account>.workers.dev`

## Formulare
- Standard für kleine Betriebe: kein Formular, sondern Anruf/WhatsApp/`mailto:`.
- Wenn Formular nötig: kleiner Worker mit D1 wie bei Sonata (`Sonata Website/app/wrangler.sonata.jsonc`, Tabelle `inquiries`), oder ein Formular-Dienst (z. B. Formspree) mit Konto des Kunden. Immer ehrlich sagen, wo Nachrichten landen, Erfolgsmeldung muss der Wahrheit entsprechen. Datenschutzerklärung anpassen.

## Eigene Domain (wenn Kunde zahlt)
Domain beim Registrar des Kunden oder über Cloudflare Registrar; in Cloudflare als Custom Domain an den Worker hängen. Domainkauf macht immer der Mensch.

## Nach dem Deploy
1. Live-Seite selbst prüfen (Startseite, Impressum, Datenschutz, 404, Assets laden).
2. `curl -sI https://<slug>.<dein-account>.workers.dev | grep -i robots` bei Demos: noindex muss da sein.
3. PageSpeed Insights mobil (https://pagespeed.web.dev) oder Lighthouse, Werte in `STATUS.md` und an David.
4. David testet auf seinem Handy im echten Netz.
