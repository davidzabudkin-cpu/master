> Aus einem echten Studio-Workflow übernommen. „David“ = der ursprüngliche Auftraggeber/Geschmack, „ZAB“ = seine Studio-Marke, Pfade wie `Davids Studio/…` gibt es hier nicht. Die Regeln gelten allgemein; Geschmacksregeln sind ein erprobter Startpunkt, kein Gesetz.

# Scroll-Welt: Landschaft, die dem Scrollen folgt (ruckelfrei)

Erprobt an der ZAB-Website v4–v8 (Oktober 2026). David: „deutlich flüssiger, viel besser“. Code: `tools/scroll-welt/`.

## Wann einsetzen
Nur für Premium-Seiten (Stufe 3), bei denen eine Bildwelt die Geschichte trägt. Für normale Kundenseiten zu schwer (30–50 MB Video). Vorher fragen: Hilft das dem Besucher, das Angebot zu verstehen, oder ist es nur Effekt? (David selbst hatte genau diese Sorge.)

## Die Regeln, die das Ruckeln beseitigt haben
1. **Ein Film pro Szene (10 s), nicht ein langes Video.** Kling 3.0 pro mit Start- und Endbild; das Endbild eines Films ist das Startbild des nächsten. Standbild je Szene = exakt das letzte Videobild (`enc6.py` zieht es heraus).
2. **Nicht spulen, sondern abspielen.** Vorwärts: `video.play()` mit `playbackRate = clamp(.6 + Abstand·3, .6, 6)`. Rückwärts: kleine Schritte `currentTime -= min(Abstand, .1 + Abstand·.5)`, nächster Schritt erst nach `seeked`.
3. **Großer Abstand (> 1,2 s, schnelles Scrollen):** nah ans Ziel springen (0,3 s davor), dann weich weiter.
4. **Nachbar-Filme vorbereiten:** nächster Film auf 0, vorheriger aufs Ende, damit der Wechsel an der Grenze ohne Lücke passiert.
5. **Kodierung:** 1920×1080, crf 27–28, Keyframe alle 12 Bilder (`-g 12 -keyint_min 12 -sc_threshold 0`), `-movflags +faststart`. Handy: eigener 9:16-Ausschnitt 720×1280, Ausschnitt wandert mit dem Motiv. Filme als Blob laden, nacheinander, aktueller zuerst.
6. **Fahrplan statt Formel:** Liste `[Abschnitt, Anteil, Sekunde]`. Pausen und Tempo pro Abschnitt planen: Landschaft startet schon am Ende des Intros, läuft während Text-Abschnitten langsam weiter, Übergänge bekommen viel Scrollweg (sonst rasen sie). Keine Szene darf auf wenig Scrollweg viel Strecke machen.
7. **Keine Maus-Effekte auf dem Hintergrund.** Hover nur auf Text und Widgets.

## Intro „in den Bildschirm“
- Was am Ende auf dem Bildschirm zu sehen ist (Desktop mit Ordnern, Menüleiste, Dock), gehört **ins Video**: Desktop als Bild rendern (`desk_render.cjs`), in den Monitor des Startbilds einsetzen (Rechteck vermessen) bzw. per Bild-Edit (gewölbte Röhre), als Endbild an Kling geben.
- Übergang Video → scharfes HTML: 0,06 Scroll-Anteil weich überblenden + Unschärfe 5 → 0 px. Klickbares Element liegt unsichtbar exakt auf dem Bild und erscheint erst bei Hover/Klick.

## Testen, bevor David es sieht
- `serve.py` statt `python -m http.server` (no-store), plus Cache-Stempel `?v=…` an CSS/JS. **Sonst sieht David alte Versionen** (passiert in v6).
- `flow6.cjs`: langsam/mittel/schnell durchscrollen → Rücksprünge = 0, Rückstand ≤ 2 s.
- `hover7.cjs`: Hover-Effekte wirklich messen, nicht nur ansehen.
- Screenshots aller Varianten am Desktop **und** 390 px.
