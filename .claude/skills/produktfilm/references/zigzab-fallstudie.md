# Fallstudie ZIGZAB-Produktfilm (27.–28.10.2026)

Projekt: früheres Konzeptprojekt (nicht im Kit, nur die Lehren zählen).
Marke: ZIGZAB ist eine erfundene Konzept-Marke von ZAB Studio. Produkte: Tee in Creme (Heavyweight) und Cap in Puderblau, jeweils mit einem Blitz in Glut-Orange als Satinstich-Stickerei, der in einem Punkt rechts oben endet. Claim: „Stitched electric.“
**Final:** `renders/final/ZIGZAB Produktfilm FINAL 16x9.mp4` + `9x16` (= v21 „alte Musik“, 14,3 s). Davids Wahl: das Querformat. Es wird für den Instagram-Post und die Website genutzt.

## Ablauf in Stichworten
1. v1 war zu laut, die Effekte zu plötzlich, der Punkt-Sound gefiel ihm nicht. Die Nadel stoppte, und der Punkt saß in der Mitte. → Neustart nach dem Vorbild des HIGGS-Herstellungsfilms (David schickte den Prompt + Screenshots).
2. Storyboards v1–v8 als Standbilder, jedes Bild auf Physik geprüft. Fehler, die wir gefunden haben:
   - schwebende Schere und Fäden;
   - die Nadel stach nicht dort, wo der Stich entsteht;
   - der Blitz war zu dick bzw. in der falschen Form;
   - der Punkt tauchte aus dem Nichts auf.
3. Renders:
   - Seedance 2.0 (13 s, 58,5 Credits): Musik nicht durchgehend, Nadelbilder uneinheitlich.
   - Kling-Korrekturen: abgelehnt.
   - **Seedance 2.5 in einem Durchgang** (15 s, 11 Referenzen, 105 Credits, Job ddb76d9b): die Basis von allem.
4. Schnitt + Ton aus Ebenen (v9–v13).
5. Motion-Design (v14–v17).
6. Neue Hook + Musik-Varianten (v18–v21).

## Versionen, Feedback, Änderung
| Version | Davids Feedback davor | Änderung |
|---|---|---|
| v8 | will HIGGS-Qualität, coole Beats mit Low Vibes, schnellere Nadel, längere Makros, Maschine stoppt am Punkt | 15-s-Durchgang mit Seedance 2.5, Prompt mit PRODUCT/REFERENCE/SHOT SEQUENCE/FORMAT/AUDIO/LOCKS |
| v9 | Laufband zerstört den Rhythmus; Folge Logo → Cap → T-Shirt; Musik erst bei den Übergängen | Laufband raus, eigener Dreh-Whip (Bild und Ton gleich lang geschnitten, Frame für Frame in Python, sonst Versatz) |
| v10 A/B | Musik verwirrend (Beat, Pause, dann echte Musik); nur Musik neu | zwei Seed-Audio-Beats; A ging in die richtige Richtung, sollte aber an der alten Musik orientiert sein |
| v11 | mehr Sounddesign, Wind am T-Shirt, Licht-Sound | Ebenen-Ton mit Wind und Schimmer → zu viel |
| v12 | zu viele Whooshes/Wind, Schimmer komisch, Musik erst ab Cap/T-Shirt, Riser für Spannung, dezente SFX an jedem wichtigen Punkt | Musik ab Cap, Riser davor, je ein Sound pro Ereignis |
| v13 | Musik soll bis zum Logo laufen, Riser lauter, cooler Sound am Punkt, Blitz-Sound am Ende | Groove um 2 Schläge verlängert (Sprung verdeckt), Zap am Punkt, Blitzeinschlag auf ZIGZAB |
| v14 | eine Variante mit Motion-Design | Glow + Ring am Punkt, Blitz-Übergang beim Drop, Spruch Wort für Wort, Blitz in den Punkt → **„richtig krass“, „das öfter machen“** |
| v15 | mehr Effekte | Intro-Stichlinie, Labels, Zoom-Punches, Funken am Logo, Shake, RGB-Versatz, Schockwellen (Funken zuerst wie lose Fäden → nur kurze Bögen zwischen nahen Kantenpunkten) |
| v16 | Intro-Linie raus, Stricken und Zuschnitt zu lang, Motion an der Schnittlinie, elektrischer Drop am Punkt, Beats anteasern, Anfang langweilig | kürzer geschnitten, Zoom-out am Start, Leuchten an der Schnittlinie, Zap-Drop, Bass-Teaser ab Sekunde 0 |
| v17 | orange Linie beim Schnitt weglassen | Schnittlinien-Leuchten aus |
| v18 | neue Hook (A + B freigegeben, 56 Credits), GLORY-MP3 (Ogryzek) als Test | Song gemessen (171,55 BPM, Pause 44,86 s, Drop 47,65 s), Schnitt per Segmentliste auf die Schläge, Zwischenbilder per optischem Fluss; Fassung mit Song nur intern, eine ohne Musik zum Posten |
| v19 | Maschinen-Sounds fehlen, Windstoß bei 11 s (Licht übers T-Shirt), Whooshes fehlen, Musik nicht aus dem Nichts; Variante mit alter Musik | echter Shot-Ton im Bild-Tempo, Wind/Whip/Woosh, GLORY dumpf ab Sekunde 0 und beim Eintauchen auf; drei Fassungen (GLORY / ohne / alte Musik) |
| v20 | eigene Musik, Mischung aus GLORY-Vibe und Blitz-Sound | 3 Phonk-Beats per Seed Audio (11,9 Credits), Beat 2 auf 171,55 BPM gestreckt (+4 %), Pause/Drop im Code nachgebaut |
| v21 | Musik nicht am Anfang, erst ab dem Kreis langsam lauter, beim Aufladen des Blitzes (ca. 8 s) voll da; bei eigenem Beat, alter Musik und GLORY | Funktion `late` in `glory_v19.py`: vorher nur Maschinen (lauter), Einblenden ab 0,5 s vor dem Punkt, voll beim Logo, Bass-Schlag auf dem Punkt bleibt; **Final = v21 alte Musik** |

## Zeitplan des Finals (v21 alte Musik, 24 fps, 343 Bilder)
| Bild | Zeit | Bild-Inhalt | Ton |
|---|---|---|---|
| 0–48 | 0–2,0 s | Hook A: Nadelring dreht, Sog in die Mitte | Maschine (Hook-A-Ton), Riser + Whoosh beim Eintauchen |
| 48–76 | 2,0–3,2 s | Hook B: eine Masche entsteht, `01 KNIT` | Nadel-Klicken (Hook-B-Ton), Ticks |
| 76–119 | 3,2–5,0 s | Zuschnitt, `02 CUT` | Maschinen-Ton aus v13, Whoosh am Schnitt |
| 119–148 | 5,0–6,2 s | Nadel stickt den Blitz, `03 STITCH` | Maschine, Whoosh |
| 148–178 | 6,2–7,4 s | Nadel fährt zur Spitze und hebt ab | Maschine; Musik blendet ab 6,9 s ein |
| 178 | 7,4 s | Punkt leuchtet auf, Ring + Funken | Zap + tiefer Bass |
| 190–209 | 7,9–8,7 s | Logo im Streiflicht, Funken an der Stickkante | Musik voll da (Filter öffnet sich), Riser, Knistern endet hart |
| 209 | 8,7 s | **Drop:** Cap + Blitz + Shake | Seedance-Musik setzt voll ein, Knall, tiefer Schlag |
| 233 | 9,7 s | Whip → T-Shirt im Wind + Blitz | Whip, Stoff flattert, Knall |
| 262 | 10,9 s | Licht-Makro + „Stitched electric.“ | kleiner Windstoß |
| 288 | 12,0 s | Hero, Zoom-out auf Kobalt | Woosh |
| 316 | 13,2 s | ZIGZAB + Blitzeinschlag in den Punkt | Knistern, Knall, Donner; Musik endet |

## Dateien
- **Prompts/Logs:**
  - `STORYBOARD.md`, `BRIEF-film-v3.md`, `BRIEF-film-v4.md`, `BRIEF-film-glory.md`
  - `v3/PROMPT-v3…v7.md`, `v4/PROMPT-v8.md` (Prompt-Vorlage)
  - `v4/SOUND-v12.md` (Ton- und Motion-Log v12–v21)
- **Werkzeuge** (`tools/`):
  - `glory_v19.py`: alles in einem; Modi `glory|ohne|alt|eigen`, `spaet` = Musik erst ab dem Punkt.
  - `motion_lib.py`: Motion-Bausteine.
  - `glory_analyse.py`: Tempo, Phase, Abschnitte eines Songs.
  - `v9_schnitt.py`: Dreh-Whip.
  - `endkarte_zoom.py`: Endkarte.
  - `musik_v13.py`: Ton-Ebenen der alten Musik.
  - `pruefen.py`: Kontaktbogen, Lautheit, 9:16.
- **Quellen:**
  - `renders/zigzab-film-v8-r1.mp4`: der Seedance-Durchgang.
  - `renders/hook-A-r1.mp4`, `renders/hook-B-r1.mp4`.
  - `ton/`: Seed-Audio-Effekte, Riser, Beats, prozedurale Sounds.
  - `v5/hook-*.png`: Hook-Standbilder.

## Kosten (gemessen, Credits)
- **Video:**
  - Seedance 2.0 13 s: 58,5.
  - Seedance 2.5 15 s: 105.
  - Hook A + B: 56 (ein Fehlversuch wurde erstattet).
  - Kling-Shots: je 9 (`get_cost` sagte 2).
- **Bilder:** Storyboard- und Hook-Standbilder je ca. 1 (GPT Image 2.5 medium 2k), high 2k 2,75.
- **Ton:** Seed Audio je Anfrage 2,1–4,7 (`get_cost` sagte 0,3–1,1). 3 Beats zusammen 11,9.
- **0 Credits:** Schnitt, Motion-Design, Ton-Mischung, 9:16, alle Varianten v9–v21 ohne neue Bilder.

## Gelernt
- Ein guter Durchgang + Schnitt im Code schlägt viele Einzelshots. Einzelne Fehler im Schnitt herausnehmen.
- Bild und Ton immer gemeinsam Frame für Frame schneiden. Ein ffmpeg-concat mit Bildern hat Bilder verloren und den Ton verschoben.
- Laufrichtung nie spiegeln (sonst ist das Logo falsch herum), sondern die Zeit umkehren und die Richtung per Tracking prüfen.
- Bei lauter Musik (Phonk) gehen die Maschinen unter: in der Herstellung die Musik 2,5 dB leiser oder erst ab dem Markenmoment einsetzen lassen.
- Ohne eigenes Gehör: alles messen (Hüllkurven, Onsets, Kreuzkorrelation, LUFS), Zeitpunkte von Sounds vorher in der Datei suchen. Und es David immer sagen.
