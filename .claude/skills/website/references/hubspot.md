# HubSpot CMS (remira.com) – Arbeitsregeln (ab 26.11.2026)

Erster Lauf: `remira/website-optimierung/` (Audit, Relaunch-Konzept mit Theme CLEAN Pro, Mockups).

## Fakten remira.com
- HubSpot-Portal 8189726, ausgeliefert über Cloudflare (Header `x-hs-portal-id`). Heute eigenes Theme auf Basis der HubSpot-Vorlage (`template_main.min.css`, `theme-overrides.css`) mit eigenen Modulen; neues Theme laut Marketing: CLEAN Pro (Helpful Hero), noch unbestätigt.
- Theme/Module einer HubSpot-Seite erkennen: `grep -oE 'hub_generated/(template|module)_assets/[^"]+'` im HTML; Modulnamen stehen als `module_<Name>.min.css` im Pfad.

## Regeln
- Jede Maßnahme einordnen: (a) HubSpot-Editor/Theme-Modul, (b) eigenes Modul/Template (Child-Theme), (c) Entwickler/Agentur. In Mockups pro Sektion als Label anzeigen (Schalter „Module anzeigen“).
- Vor dem Bau von Modulen fragen: Content-Hub-Stufe (Starter/Pro/Enterprise), Theme + Lizenz, Rechte (Design Manager, Menüs, Weiterleitungen, HubDB). In HubSpot nie etwas ändern ohne Freigabe.
- Eigene Effekte immer als Child-Theme-Modul planen, damit Theme-Updates möglich bleiben.
- Bestehende URLs behalten, Änderungen nur mit 301-Liste.

## Audit-Werkzeug
- `remira/website-optimierung/tools/audit-shots.cjs`: Screenshots 1440/390, Messwerte (Ladezeit, Bytes, Bilder zu groß, H1, CTAs) nach `messwerte.json`. Kundenzitate werden vor Ganzseiten-Screenshots per Blur unkenntlich gemacht (Datenschutz, Personennamen).
- Lighthouse: `npm i lighthouse` im Scratchpad, `CHROME_PATH` = Playwright-Chromium, `--chrome-flags="--headless=new --no-sandbox"`.
- Eigene Kontrast-Zählung per Skript ist unzuverlässig bei Text auf Hintergrundbildern → Kontrast nur aus Lighthouse (`color-contrast`) berichten.

## Netz in der Cloud-Umgebung
- Freigegeben waren nur remira.com (+ npm-Registry). Gesperrt: fremde Seiten, HubSpot-CDN (`*.hubspotusercontent-*.net`, `*.hsappstatic.net`), cdnjs, jsdelivr, unpkg, Font Awesome, Usercentrics. Folge: Slider, Logo-Leisten, Cookie-Banner fehlen in Screenshots, Lighthouse-Werte zu gut. Immer als Messgrenze nennen; vollständige Domainliste in `remira/website-optimierung/01-theme-analyse.md`.
