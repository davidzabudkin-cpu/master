> Aus einem echten Studio-Workflow übernommen. „David“ = der ursprüngliche Auftraggeber/Geschmack, „ZAB“ = seine Studio-Marke, Pfade wie `Davids Studio/…` gibt es hier nicht. Die Regeln gelten allgemein; Geschmacksregeln sind ein erprobter Startpunkt, kein Gesetz.

# Design-System ZAB Studio

Quelle: Davids 25 Referenzen (eigene Referenzsammlung, Beschreibung in `brand/Design-Richtung.md`), Sonata-Website, 10k-websites "Design direction".

## Davids Geschmack (der Maßstab)
1. **Ein großes atmosphärisches Bild trägt die Seite.** Nebel, Licht, Wolken, Unschärfe, eine kleine Figur in einer großen Welt, oder ein Produkt ganz nah. Lieber ein starkes Bild als zehn mittelmäßige.
2. **Große, ruhige Typografie.** Riesiger Wortmark (auch hinter/um das Motiv, wie "VISIONS"), oder Mix aus dünnem und fettem Schnitt in einer Zeile ("KAIRO**KITCHEN**"). Wenig Text, viel Luft.
3. **Glas, Korn, Unschärfe.** Frosted-Glass-Karten und Pill-Navigation, feines Filmkorn, weiche Verläufe, Bewegungsunschärfe in Fotos.
4. **Dunkel und edel mit einer warmen Lichtquelle** (Sonnenaufgang, Kerze, Glut) als Akzent. Für helle Marken: Creme/Elfenbein mit einer satten Markenfarbe (Sonata: Elfenbein + Flaschengrün; Brewed: Creme + Dunkelgrün).
5. **Minimal, aber nie leer.** Kleine Mono-Labels, dünne Linien, Annotation-Pills mit Linie ins Bild, Details für den zweiten Blick.

## Die Signature-Regel (Pflicht)
Jede Seite bekommt genau **ein** Element, das nur sie hat und dessen Fehlen man sofort merken würde. Da geht das Mut-Budget hin, alles andere bleibt ruhig. Beispiele:
- Café: Dampf, der beim Scrollen über die Überschrift zieht; Tasse, die sich füllt; Speisekarte als echtes Papier, das sich aufblättert.
- Friseur: Vorher/Nachher-Schieber im Hero; Preisliste, die wie ein Barber-Schild einrollt.
- Fotograf: Bild taucht aus dem Wasser auf (Unterwasser), Wasseroberfläche als Übergang zwischen Abschnitten.
- ZAB Studio: Glasscheibe, die sich freiwischt; graue Website, die sich in eine schöne verwandelt; Wortmark aus Nebel.
Test: Würde die Seite ohne das Element austauschbar wirken? Wenn nein, ist es kein Signature-Element.

## Verbotene Standard-Looks (außer der Betrieb lebt wirklich so)
- Creme + Serife + Terrakotta-Akzent
- Fast-Schwarz + Neongrün
- **Fast-Schwarz + warmer Amber/Gold-Akzent + kontrastreiche Serife** (Achtung: genau dahin zieht Davids Geschmack. Stimmung behalten, aber Farben aus dem eigenen Bild ziehen und ein echtes Signature-Element bauen.)
- Haarlinien-Brutalismus
- "Container-Suppe": überall Pills, Karten, Serife, blinkender Status-Punkt (Warnung aus dem Claude-Design-Leitfaden)
- Lila-Blau-Verläufe im SaaS-Stil, Emoji-Icons, Stock-Icons in bunten Kreisen

## Farbe
- 3–5 Farben, aus dem Hero-Bild bzw. der echten Marke (Logo, Laden, Insta) gezogen.
- Hintergrund nie `#000`/`#fff`, immer leicht in Richtung der Bildstimmung getönt.
- Akzent selten: Haupt-Button, Fokus, ein bis zwei Betonungen. Ein Akzent überall ist keiner.
- Kontrast messen: Fließtext 4,5:1, große Schrift und Rahmen 3:1.
- Alle Farben als CSS-Variablen (`--bg`, `--ink`, `--muted`, `--accent`, `--line`), nie Hex im Bauteil.

## Schrift
- Trio: Display mit Charakter + ruhige Text-Schrift + Mono für kleine Labels. Nie Inter/Roboto als Headline.
- Ideen nach Stimmung (frei lizenziert, lokal einbinden, siehe `recht-de.md`):
  - Editorial/edel: Fraunces, Instrument Serif, Cormorant (sparsam, Serifen-Falle beachten)
  - Modern/clean: Manrope, Satoshi, General Sans, Geist, Plus Jakarta Sans
  - Schmal/laut (Barber, Mode): Anton, Bebas Neue, Oswald, Archivo Narrow/Expanded
  - Mono: JetBrains Mono, IBM Plex Mono, Geist Mono
- Headlines groß und eng (letter-spacing leicht negativ), Labels klein, Großbuchstaben, weite Laufweite.
- Nur benutzte Schnitte laden, `font-display: swap`.
- **Umlaute und ß in der Display-Schrift prüfen** (Screenshot + Zoom). Syne zeichnet ß wie "ʒ": in Syne-Headlines kein ß verwenden oder umformulieren. Gelernt bei Kimo, 20.10.2026.

## Layout
- Keine zwei Nachbar-Abschnitte mit demselben Grundgerüst.
- Text-Blöcke in `ch` auf dem Text-Element begrenzen (ca. 32–60ch).
- Eine feste Hintergrund-Ebene für die ganze Seite (langsamer Verlauf, Korn, sanftes Glühen, Zyklus ≥ 60 s), damit Scrollen sich wie ein Ort anfühlt.
- Deko kollidiert nie mit Inhalt; auf kleinen Bildschirmen ausblenden.

## Bewegung
- Nichts springt: zwei Easing-Kurven als Tokens (`--ease-out: cubic-bezier(.16,1,.3,1)`, `--ease-io: cubic-bezier(.65,0,.35,1)`).
- Entrances gestaffelt (60–150 ms), danach Verzögerungen zurücksetzen.
- Ein leises lebendiges Element pro Abschnitt (≥ 4 s Zyklus), pausiert außerhalb des Bildschirms.
- Ein designtes interaktives Moment pro Seite, passend zur Marke (Halten zum Aufgießen, Schieber für Vorher/Nachher).
- Nur `transform` und `opacity` animieren. `prefers-reduced-motion` komplett respektieren.

## Gelernt bei Kimo (21.10.2026)
- David mag **feine, leichte Schrift** (Geist 300 + Fraunces-Italic-Akzent), nicht fette Display-Schriften. Preise in Light, €-Zeichen klein und hochgestellt.
- Zu viel Leerraum stört ihn. Abschnittsabstand eher 56–112 px als 160 px, keine versetzten Raster mit Löchern.
- "Nach dem Hero wird es langweilig" vermeiden: in jedem Abschnitt etwas, das reagiert (Maus/Finger-Effekte, Hover-Glanz, Magnet-Buttons, scroll-getriebene Elemente).
- Kleine Labels nie in Akzentfarbe auf ähnlichem Grund (blau auf blau unlesbar). Labels in Hellweiß, Farbe nur als Punkt davor.
- Bausteine, die gut ankamen: WebGL-Wasser mit Wellen an der Maus, Bilderspur (Fotos folgen Maus/Finger, ohne Interaktion automatisch), Masonry-Portfolio mit Filtern + Lightbox, horizontaler Reel per Scroll, Preis-Karten zum Antippen mit hochzählender Summe.

## Gelernt beim ZAB-Brand-Board (21.10.2026)
- **Text muss lesbar sein, solange er im Bild ist.** Ein Fokus-/Blur-Effekt auf einer Headline ist spätestens fertig (ganz scharf), bevor die Headline 25 % nach oben gewandert ist. Besser: Schärfe beim Laden in ca. 1,2 s ziehen und Scroll nur für Bild/Hintergrund nutzen. Fehler im Board v0.1: "Gesehen werden." wurde erst scharf, als es schon fast aus dem Bild war.
- **Hover-Effekte klein und sauber:** Blur max. 2–4 px, Cursor-Glow ca. 200–300 px, Bewegung max. 4–6°. Clean und minimalistisch bleibt Vorrang vor "noch ein Effekt".
- **David mag helle Seiten mit dunklen Einschüben** (Mix hell/dunkel), nicht durchgehend Mitternacht-Hintergrund.
- Auf dem Handy gibt es kein Hover: jeder Maus-Effekt braucht eine Touch- oder Scroll-Entsprechung (Tippen, Scroll-Fortschritt) oder fällt weg.

## Gelernt bei der ZAB-Website (21.10.2026)
- **Glas-Text** (Davids Wunsch): unter der Maus bleibt die Kontur scharf, die Füllung wird milchig-durchsichtig mit weichem Schein. Nicht die ganze Schrift transparent machen (das hat er abgelehnt).
- Maus-Effekt je Zone: Glow nur auf freien Flächen, über Widgets aus (dort Neigung/Glanz/Anheben), über Bildern ein Ring „Ansehen“.
- Gestapelte Karten brauchen lange Pausen (margin-bottom ~120vh), sonst kommt die nächste Karte zu früh.
- Abschnitte mit `position:sticky`-Innenleben (Story, Wort-Wechsler) ohne Section-Padding bauen, sonst entsteht eine leere Lücke.
- Fokuspunkte in generierten Bildern immer im Bild nachmessen (Kontaktbogen ansehen), nicht schätzen.
- Higgsfield „Unbegrenzt“ im Browser: max. 8 Aufträge in der Warteschlange, einer läuft gleichzeitig. Eingabefeld-Position per JS (`[contenteditable=true]` getBoundingClientRect) bestimmen, dann echte Tasten Strg+A/Entf.

## Learnings v4 (21.10.2026)
- Fester Hintergrund mit `z-index:-1` (Video/WebGL-Welt): `body` muss `background:transparent` haben, sonst liegt der Body-Hintergrund darüber. Farbe auf `html` setzen.
- Scroll-Video als Seitenhintergrund: mehrere Kling-Clips (Start-/Endbild verkettet) zu einem Video zusammenfügen, Fahrplan „Abschnitt-Oberkante → Sekunde“. Keyframe alle 12 Bilder reicht für den Hintergrund, Intro-Videos alle 6.
- Lade-Wächter nie mit leerem String starten, wenn der Desktop-Suffix auch leer ist (`vk = null`).
- Handy-Ausschnitt aus 16:9: Crop mit `x` als Funktion von `t`, damit der Ausschnitt dem Motiv folgt (`crop=w='trunc(ih*9/32)*2':h=ih:x='…t…'`).
- Text über Bildwelten: Glas (blur 16–22 px) + Abdunklung je Abschnitt, Fließtext immer auf eigener Glasfläche.

## Learnings v5 (21.10.2026)
- Scroll-Video-Hintergründe über viele Szenen NICHT spulen (ruckelt, springt). Besser: Standbild je Szene = exakt letztes Videobild, Übergang als Film abspielen, wenn ein Abschnitt mit neuer Szene erreicht wird. Weite Sprünge: überblenden + nur letzten Film. Zurück: überblenden.
- Bei zwei Bild-Ebenen zum Überblenden: `onload` nach dem Feuern löschen, sonst schaltet ein alter Handler beim nächsten Bildwechsel das sichtbare Bild aus.
- Inhalt auf einem Bildschirm im Video ersetzen: Bildschirm Bild für Bild vermessen (Farbmaske + Scanlinien, Median über 5 Bilder), Rechtecke als JSON, Overlay per `requestAnimationFrame` an `video.currentTime` koppeln; am Rand über das Bild hinaus verlängern. Klappt bei frontalen Monitoren, nicht bei gewölbten Röhren (dort am Ende überblenden).
- David will Maus-Effekte nur auf Text und Widgets, nicht auf Hintergründen.
- Videogröße: Kling-Quellen sind weich; crf 27 bei 1920 sieht aus wie das Original.

## Learnings v6 (22.10.2026)
- David will die Landschaft selbst per Scrollen steuern (kein Autoplay). Ruckelfrei: ein Film pro Szene, vorwärts `play()` mit `playbackRate` = Abstand zur Scroll-Zeit (0,35–5), rückwärts kleine `currentTime`-Schritte (Keyframe alle 12 Bilder), bei > 2 s Abstand nah ans Ziel springen. Nachbar-Filme vorbereitet halten.
- Was auf einem Bildschirm im Intro zu sehen ist, gehört ins Startbild des Videos (einsetzen bzw. per Bild-Edit), nicht als Overlay.

## Learnings v9/v10 (22.10.2026)
- David mag als Hintergrund eine **Mischung**: Branding-Verläufe + Raster im Wechsel mit wenigen gemalten Bildern; nicht durchgehend Bilder/Video. Gemalte Himmel/Blumen mit GPT Image 2.5 medium (1 Credit) reichen.
- Bild „wird zum Leuchten gebracht“: zwei identische Fassungen (Bild-Edit „gleiches Bild, ohne Leuchten/Lichtstrahl“) überblenden – nie einen eigenen CSS-Lichtstrahl über ein gemaltes Licht legen (Winkel passt nicht).
- Vollflächige Hintergrundbilder größer als 100 %: `max-width:none` setzen, sonst Streifen am Rand.
- Chat-Widgets: Verlauf mit fester Höhe (`flex:0 0 auto`), sonst wächst das Widget beim Tippen und springt.

## Learnings v11 (22.10.2026)
- **Inhalt im Video tauschen:** Nie ein Bild über ein Video legen (passt beim Scrollen nicht). Entweder neu rendern (Kling 3.0 pro, Start- und Endbild mit dem neuen Inhalt, 17,5 Credits/10 s) oder lokal Bild für Bild ersetzen: SIFT-Merkmale des alten Inhalts finden → Homographie → neuen Inhalt verzerrt einsetzen, Licht über weiches Helligkeitsverhältnis übernehmen, Rand/Gehäuse bleiben original (`projekte/zab-studio/gen/v4/comp2.py`, Startbild `still_comp.py`). Flaches Rechteck einkleben sieht falsch aus (David: „man sieht den Rand nicht“).
- **Ein Bild, eine Geschichte:** Desktop-Hintergrund = erstes Seitenbild; nach dem Klick auf 1,08 zoomen (gleiche Größe wie der Seiten-Hintergrund mit 108 %), dann weich überblenden → kein Bildwechsel.
- **Davids Hintergründe:** Brand-Verläufe aus dem Brandboard (Morgennebel, Pfirsich, Blaue Stunde) + Papier-Korn + ein weicher, unscharfer Farbschwung (SVG-Pfad mit Blur, Ref. 43). Kein Weltall (keine Sterne), Raster nur gezielt und selten.
- **Helle Abschnitte:** Tokens lokal umschalten (`data-ink="hell"`), nicht das ganze Theme. `.btn.primary` nutzt `var(--text)` als Hintergrund → in hellen Abschnitten explizit dunkel setzen.
- **Überschriften-Reveal je Abschnitt anders** (mitlesen, Maske, Schärfe, Wisch, Buchstaben, Tippen, Zoom). Für Effekte auf Buchstaben `translate`/`scale` statt `transform` nutzen, damit Maus-Effekte nicht kollidieren.
- **Coverflow:** Position aus `offsetLeft` + Track-Rect rechnen (nicht aus dem schon skalierten Rect, sonst schwingt es). Track links/rechts so polstern, dass die erste und letzte Karte mittig stehen können.
