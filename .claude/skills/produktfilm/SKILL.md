---
name: produktfilm
description: Ablauf für Produkt-, Brand-, Launch- und Showcase-Filme sowie Werbe-Reels – ein KI-Film (z. B. Seedance) wird per Code mit Motion-Design und Sounddesign aus Ebenen fusioniert, Schnitt auf den gemessenen Beat. Erprobt an einem Produktfilm über 21 Versionen („richtig krass“). Nutzen bei Produktfilm, Produkt-Reel, Brand-Film, Launch-Video, Herstellungsfilm, Werbespot, Logo-Reveal, wenn ein Produktvideo verbessert oder auf Musik geschnitten werden soll.
---

# Produktfilm: KI-Film + Motion-Design + Sounddesign

Die KI liefert realistische Bilder, der Code liefert Timing, Markenzeichen und Effekte genau auf den Punkt, der Ton wird aus Ebenen neu gebaut. Zusammen wirkt das wie eine teure Studio-Produktion. Der Nutzer ist der Geschmack, du bist Regie, Schnitt und Ton: du schlägst vor, er wählt.

**Fallstudie lesen, bevor das erste Storyboard entsteht:** `references/zigzab-fallstudie.md` (alle 21 Versionen mit Feedback und Änderung). **Beispiel-Code** (eigener Code aus dem Projekt, frei nutzbar, an das neue Projekt anpassen): `beispiel-code/` – `motion_lib.py` (Glow, Funken, Blitz, Labels, Shake), `glory_v19.py` (Segment-Schnitt auf Beat-Raster + optischer Fluss + Ton-Ebenen), `glory_analyse.py`/`beat_analyse.py` (BPM, Pausen, Drops messen), `endkarte_zoom.py`, `pruefen.py` (Kontaktbogen, Lautheit, 9:16-Fassung).

## 1. Brief + Vorbild (0 Credits)
- Diktat → Brief (Skill `brief`). Credit-Kosten jeder Stufe nennen.
- Vorbild-Film (vom Nutzer) analysieren: Szenenfolge, Kamera, Tempo, Prompt-Aufbau – auf die Marke umschreiben. Was genau an jedem Screenshot gefällt, notieren.
- Produktreferenzen sauber: Produktfotos, Logo als flache Zeichnung (nur für die Form).

## 2. Storyboard als Standbilder (je ~1 Credit)
- Ein Bild pro Shot, als Raster-Übersicht zeigen.
- **Physik-Check jedes Bilds, bevor der Nutzer es sieht:** nichts schwebt (Schere, Fäden), Werkzeug wirkt dort, wo das Ergebnis entsteht (Nadel sticht, wo der Stich entsteht), Logo in richtiger Form/Dicke, nichts taucht aus dem Nichts auf, Laufrichtungen stimmen. „Was fertig ist, bleibt fertig.“
- Logo/Druck nie „entstehen“ lassen (KI macht das falsch) – fertig enthüllen (Presse hebt sich, Licht wischt drüber).
- Mag der Nutzer ein Bild bis auf ein Detail: lokal retuschieren statt neu generieren.
- Freigabe, dann rendern.

## 3. Ein KI-Film-Durchgang
- Ganze Filme lieber **in einem Durchgang** (Schnitt + Beat + Effekte zusammen, z. B. Seedance 2.5, 15 s 720p ≈ 105 Credits, bis 11 Bild-Referenzen), danach nur Shots herausschneiden. Unerwünschte Presets ausdrücklich ablehnen.
- Prompt-Aufbau: **PRODUCT** (jedes Produkt genau, Logo-Form/-Position) · **REFERENCE IMAGES** (Bild für Bild, wofür) · **SHOT SEQUENCE** (Zeitcode, Kamera, Bewegung, „Hard cut“/„Whip“) · **FORMAT AND LOOK** · **AUDIO** (Maschinen-Ton je Shot, Musik-Einsatz) · **LOCKS** (Physik-Regeln als harte Verbote).
- Misslungene Shots nicht alles neu: 4-s-Ersatz mit Startbild oder im Schnitt herausnehmen. Kling war für Präzisionsarbeit schlechter (stickte ins Leere, ruckelte).
- Nach jeder Generierung echte Abbuchung prüfen (`higgsfield-praxis` §4).

## 4. Hook (erste 2 Sekunden)
4 Hook-Ideen als Standbilder → Nutzer wählt → beste 1–2 als 4-s-Clips. Clip Bild für Bild prüfen, ab wann alles stimmt (erst ab dort verwenden).

## 5. Schnitt per Code (0 Credits)
- Film als **Segmentliste** (Quelle, Quellbilder, Filmbilder). Abweichende Längen per optischem Fluss zwischenrechnen (OpenCV DIS, Faktor 0,85–1,45) → kein Ruckeln. Schwache Teile rauslassen statt verlangsamen.
- **Jeder Schnitt auf einem Schlag** (±1 Bild bei 24 fps); Schlag-Zeiten vorher messen.
- Nach dem Beat-Einsatz keine Szene ohne Beat dazwischen. Störende Shots raus (z. B. ein Laufband, das den Rhythmus zerstörte). Eigene Whips (2 Bilder). Endkarte: Zoom-out auf Markenfarbe + Schriftzug.

## 6. Motion-Design per Code (0 Credits, `beispiel-code/motion_lib.py` oder `motion-kit`)
Deterministisch (nur Zeit + Seed). Bausteine: Labels (`01 KNIT` in Mono, tippen sich ein, leise Ticks) · Zoom-Punch (7 % → 0 in 6 Bildern) + kurzer Lichtblitz · Markenmoment (Glow + Ring + Funken) · Funkenüberschläge an Kanten (nur zwischen nahen Kantenpunkten, sonst wirken sie wie lose Fäden) · Drop (1 Bild Vorlauf, Blitz, 3 Bilder Abklingen, Shake 14 px, RGB-Versatz) · Spruch Wort für Wort im Takt · Schluss-Blitz mit Schockwellen. **Blitze normal überlagern, nicht additiv.** Wenig Text, die Markenelemente animieren.

## 7. Ton aus Ebenen
- **Maschinen/Produkt-Ton** jedes Shots im Bild-Tempo (`atempo`), gleiche Pegel – muss hörbar sein.
- **Musik-Platzierung (bewährt):** Anfang nur Maschinen + Effekte → Musik blendet 0,5 s vor dem Markenmoment ein → voll beim Aufladen → 0,3 s Stille → **Drop auf der Produkt-Enthüllung** → gefiltert ausklingen.
- **Ein Sound pro Ereignis:** Whoosh beim Eintauchen/an Schnitten, Zap + Bass am Markenmoment, Knistern unter Funken (endet hart auf dem Drop), Knall beim Drop-Blitz, Riser davor. Nicht zu viele Whooshes/Wind auf einmal, kein Schimmer-Sound.
- Einzelsounds per KI (ein Prompt pro Ebene) – Spitze per Hüllkurve messen und aufs Bild legen.
- Mischung: `alimiter=limit=0.84,loudnorm=I=-14:TP=-1.5:LRA=9`; Fassung ohne Song für App-Musik bei −16 bis −20 LUFS.
- Prüfen: Pegel über die Zeit, Sync per Kreuzkorrelation (±5 ms). **„Gemessen, nicht angehört“** sagen.

## 8. Musik-Optionen
1. Musik des KI-Films neu arrangieren (Drop verschieben, Groove verlängern) – war am Ende der Favorit.
2. Eigener Beat (KI-Musik, 3 Varianten, Ziel-BPM im Prompt), nur ≤ 5 % strecken, Kicks auf Pause/Markenmoment/Drop/Schluss.
3. Lizenzierter Song: Schnitt auf sein Raster, wichtigsten Moment auf die Song-Pause, Drop auf die Enthüllung – **nur intern**; zum Posten Fassung ohne Musik, Song in der App darunterlegen (öffentliche Zugänglichmachung braucht Lizenz).

## 9. Ausgabe
- Immer 16:9 + 9:16 (9:16 = 16:9 scharf in der Mitte, weichgezeichnete Kopie oben/unten), Kontaktbogen, Lautheit.
- 2–3 Varianten zur Wahl (z. B. Musik A/B/C). Dateinamen `<Marke> Film vNN <Variante> 16x9.mp4`, Gewinner als `… FINAL …`.
- Jede Version mit Feedback, Änderung, Jobs, Credits, Messwerten loggen. Konzept-Marken als „Konzept“/„Arbeitsprobe“ kennzeichnen.

## Launch-/Werbe-Reels (Unterschiede)
Kräftige Effekte (Whoosh, Drop, Riser an jedem Übergang), durchgehende generierte Musik ohne Stopp (Drops auf Schlüssel-Schnitte, Breaks per Takt-Schleife überspringen), am Ende unter dem CTA weiter, ab „Link in Bio“ leiser/dumpfer, mit Logo ausklingen (kein Tape-Stop, kein „Ta-dum“). Websites quer im Browser-Fenster zeigen (Aufnahme per Playwright). Logo immer wie auf Visitenkarte/Website.
