---
name: website
description: Hochwertige, mobil-optimierte Websites und Landingpages (Kanal-/Creator-Seite, Portfolio, lokaler Betrieb, Pitch-Demo, Relaunch) mit KI- oder eigenen Bildern, flüssigen Scroll-Animationen und Deploy auf Cloudflare. Nutzen bei „Website“, „Landingpage“, „Portfolio-Seite“, „Link-in-Bio-Seite“, „Demo für einen Kunden“, „Relaunch“ oder „mach eine Seite für …“.
---

# Website

Erprobt an einer Studio-Website („mega flüssig“) und mehreren Kunden-Demos. Du bist Designer, Texter und Entwickler; der Nutzer ist Geschmack und Entscheider.

**Referenzen (je nach Schritt):** `references/design-system.md` (Geschmack, Signature-Regel, verbotene KI-Looks, Typo, Farbe, Bewegung) · `references/vorlagen.md` (Aufbau je Branche) · `references/mobile-und-tempo.md` (Mobile first, Animationstechnik, Tempo, Testliste) · **`references/premium-interaktion.md` (Pflicht bei jeder hochwertigen Seite: Maus-Interaktion, magnetisches Raster, reaktiver Hintergrund, 3D, Leitplanken – Davids Wunsch vom 11.11.2026; bauen mit Fable 5.2)** · `references/buehnen-scroll-v13.md` (Standard für Scroll-Effekte: Bühnen statt Hochschieben) · `references/scroll-welt.md` + `tools/scroll-welt/` (Landschaft folgt dem Scroll) · `references/recht-de.md` (Impressum, Datenschutz, Bildrechte, KI-Kennzeichnung) · `references/deploy-cloudflare.md` · **`references/hubspot.md` (remira.com läuft auf HubSpot: Kategorien a/b/c, Audit-Werkzeug, Netzgrenzen)**.

## Phase 0: Auftrag klären (eine Frage-Runde)
1. Für wen? Eigene Seite / echter Kunde / Pitch-Demo (ohne Auftrag) / Konzept mit erfundener Marke.
2. Stufe: **1** Bilder + CSS-Animationen (am selben Tag, ~10–30 Credits oder 0 mit eigenen Fotos) · **2** + Loop-Hero-Video (~40–70) · **3** Scroll-Film am Desktop (~80–200).
3. Input: bestehende Website, Logo, Fotos, Brand/Stil (`stil-studio`), Referenzen.

## Phase 1: Recherche
Bei echten Betrieben: Bewertungen und Social-Bio nach den Worten der Kunden durchsuchen (was loben sie?) → in die Texte. Bei Relaunch: alle echten Inhalte sichern, Schwächen notieren (= Vorher/Nachher-Beweis). **Nichts erfinden** (Bewertungen, Zahlen, Preise, Auszeichnungen) – Fehlendes als `[FEHLT: …]`.

## Phase 2: Design-Paket (ein Dokument, eine Freigabe, bevor ein Credit fließt)
Ein Satz (was soll der Besucher glauben?) · Gefühl in 3 Wörtern · **Signature-Element** · eine Handlung (der eine Button) · 3–5 Farben (aus Hero-Bild/Marke, kein `#000`/`#fff`) · Schrift-Trio · Abschnitte mit fertigen Texten · Bildliste (Zweck, Prompt-Idee, Modell, Preis) · bei Stufe 2/3 Wireframe zuerst.

## Phase 3: Bilder/Videos
Preis nennen, günstig zuerst (Entwurf → final), Video erst auf freigegebenem Startbild. Alle Bilder einer Seite in **derselben Welt** (Licht, Farbe, Körnung im Prompt ausgeschrieben). „no text, no logos“. Echte Kundenfotos haben Vorrang; generierte Speisen/Räume nie schöner als echt; generierte Menschen nie als „unser Team“/„Kunden“. Loop-Hero: Startbild = Endbild, Kamera steht, nur Dampf/Licht/Stoff bewegt sich, ≤ 6 s, < 3 MB.

## Phase 4: Bauen
- Standard: `index.html`, `styles.css`, `main.js`, `assets/`, `impressum.html`, `datenschutz.html` – reines HTML/CSS/JS, kein Build. Datenbank nötig → Cloudflare Worker + D1.
- **Mobile first** (375 px zuerst). Handy ist die Hauptversion.
- **Flüssig vor Effekt:** ruckelfreie Übergänge sind wichtiger als jeder Effekt. „Bühnen“: Bildschirm steht, Inhalte erscheinen an Ort und Stelle, erst dann scrollt die Szene weg (nichts von unten hochschieben). Texte „schreiben“ sich zeitgesteuert beim Hineinkommen (nicht am Scrollweg hängen). Animationen fertig, bevor man weiterscrollt. Nur `transform`/`opacity`. Maus-Effekte nur auf Text/Widgets, nie auf Hintergründen. Am Handy: Scroll-Fahrten als Bildfolge auf Canvas (gespulte Videos springen), keine Autoplay-Videos, kein großflächiges Live-Blur.
- **Lesbar, wenig Text:** Headlines ~40–70 px Desktop, Leads ein Satz, Leistungen als Symbol + ein Satz, kein ständiger Hell-dunkel-Wechsel (eine Linie pro Seite), helle junge Verläufe.
- **Erst sichtbar, dann schwer:** Bildfolgen/Videos erst nach dem ersten Bild bzw. der ersten Berührung laden, Startbild vorladen, Sparmodus für schwache Geräte.
- Kontakt ist das Wichtigste: Anruf, WhatsApp, Route, Öffnungszeiten sofort; Daumen-Leiste unten am Handy; Formulare max. 3 Felder.
- Abschnitt für Abschnitt bauen und prüfen (Hero zuerst).

## Phase 5: Selbsttest (bevor der Nutzer etwas sieht)
1. Screenshots bei 360, 375, 390, 768, 1440 px: nichts läuft seitlich raus (Grids `minmax(0,1fr)`, Chips umbrechen statt wischen), kein Text abgeschnitten.
2. Alle Links/Buttons, Formular-Erfolgszustand. 3. Reduzierte Bewegung: alles im Endzustand sichtbar. 4. Konsole null Fehler, Bilder AVIF/WebP, Hero vorgeladen.
5. **Text-Tor:** suchen nach Floskeln („nahtlos“, „innovativ“, „maßgeschneidert“, „ganzheitlich“, „Mehrwert“, „Lösungen“, „auf ein neues Level“, „erleben Sie“, „seamless“, „elevate“, „unlock“) → null Treffer.
6. **Recht-Tor:** Impressum + Datenschutz, keine externen Tracker/Google-Fonts-Einbindung, Pitch-Demos `noindex` + „Konzeptentwurf“.
7. Scroll-Test langsam + schnell (keine Rücksprünge, keine dunklen Lücken).
8. Frischer Blick: Wirkt es wie für genau diesen Zweck gemacht?

## Phase 6: Online stellen
`deploy-cloudflare.md`. Danach selbst prüfen (alle Unterseiten, noindex bei Demos), PageSpeed mobil messen. Nichts veröffentlichen/indexierbar machen ohne OK des Nutzers.

## Phase 7: Feedback
Eine Dimension pro Runde (Struktur → Optik → Bewegung). Kleine Änderungen direkt im Code. Großes Projekt → `STATUS.md` für die nächste Session.

## Pitch-Regel (Deutschland)
Demo bauen → noindex → persönlich zeigen → Link nur nach „Ja, schick mir das“. Kalte Werbe-Mails an Firmen ohne Einwilligung sind in DE unzulässig.
