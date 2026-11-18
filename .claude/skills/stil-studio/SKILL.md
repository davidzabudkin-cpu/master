---
name: stil-studio
description: Findet, analysiert, baut und speichert einen visuellen Stil oder eine Marke (Branding) für Videos, Thumbnails, Shorts und Websites – aus Referenzvideos, Screenshots, Kanälen oder Worten. Erzeugt eine Style-Bible (STYLE.md), eine style.json für die Code-Animation, einen Bild-Prompt-Anker für KI-Bilder, Thumbnail- und Sound-Regeln, Vorschaubilder in mehreren Varianten und auf Wunsch Logo/Brandboard. Nutzen bei „welcher Stil“, „bau diesen Stil nach“, „so wie Kanal X aussehen“, „Branding“, „Logo“, „Farben/Schriften“, „Look für meinen Kanal“, „Stil auswählen“ oder bevor ein neues Video-/Kanalprojekt ohne festen Stil startet.
---

# Stil-Studio: Stil verstehen, nachbauen, festhalten

Ein fester Stil ist die Voraussetzung für alles andere: ohne ihn sieht jedes Bild anders aus und jede Grafik muss neu erfunden werden. Ergebnis ist immer ein Ordner `stile/<name>/`, den alle anderen Skills lesen.

## Was am Ende im Stil-Ordner liegt
```
stile/<name>/
├── STYLE.md              Style-Bible (Vorlage: stile/_vorlage/STYLE.md)
├── style.json            Farben, Schriften, Hintergrund, Bewegung, Ton → motion-kit
├── vorschau.jpg          Kontaktbogen der Demo-Szenen in diesem Stil
├── referenzen/           Screenshots/Frames, die den Stil zeigen (mit Notiz, was daran wichtig ist)
├── figuren/              (optional) Figurenblätter + freigestellte Posen
├── thumbnail-prompts.md  (wächst mit) Gewinner-Prompts
└── marke/                (optional) Logo-SVG, Brandboard
```

## Ablauf
### 1. Input sammeln (eine Frage-Runde, mit Empfehlung)
- **Referenzen:** YouTube-Links, Screenshots, Kanalname, Website, Pinterest-Board – oder nur Worte („wie Kurzgesagt, aber dunkler“).
- **Zweck:** Erklärvideo, Story, Shorts, Produkt, Website? Zielgruppe? Sprache?
- **Budget:** reiner Code (0 Credits) / Hybrid (gratis KI-Bilder + Code) / KI-lastig (Clips).
Keine Referenzen? → Die 5 fertigen Stile zeigen (`stile/*/vorschau.jpg`, bei Bedarf mit `python motion-kit/demo_explainer.py stile/<name> --sheet` erzeugen) und wählen lassen, oder Mischung vorschlagen.

### 2. Referenzen analysieren (`references/stil-analyse.md`)
- Bei Videos: 8–12 Frames ziehen (`ffmpeg -i video.mp4 -vf "fps=1/10,scale=640:-2" frames/f_%03d.jpg` bzw. Screenshots vom Nutzer) und **ansehen**.
- Pro Merkmal notieren, *was genau* wirkt – Farben (Hex messen), Linien, Schrift, Figurenbau, Hintergrund, Bewegung, Schnitt-Tempo, Ton.
- **Mechanik statt Kopie:** Wir übernehmen Prinzipien (z. B. „flache Farben, dicke Kontur, ein Akzent“), nie Figuren, Logos, Namen oder erkennbare Motive eines fremden Kanals. Eigener Twist ist Pflicht (Farbe, Figur, Markenzeichen).

### 3. Stil schreiben
- `STYLE.md` nach Vorlage `stile/_vorlage/STYLE.md` ausfüllen: Ein-Satz-Gefühl, Palette mit Rollen, Schriften (Rolle head/body/caption/hand), Hintergrund, Linien/Formen, Figuren, Bewegung, Schnitt, Ton, Thumbnail, **Bild-Prompt-Anker** (englischer Absatz für KI-Bilder), Verbote.
- `style.json` aus `stile/_vorlage/style.json` ableiten (Hex-Farben, Schriften, `background.type`: paper/solid/gradient/spotlight/mesh/image).
- Schriften: frei lizenzierte nehmen (Google Fonts, OFL) und als TTF in den Stil-Ordner legen; Systemschriften nur für den eigenen Rechner.

### 4. Vorschau bauen und wählen lassen
- `python motion-kit/demo_explainer.py stile/<name> --sheet` → `vorschau.jpg`. Bei Bedarf 2–3 Varianten (z. B. A hell/B dunkel/C anderer Akzent) als eigene Stil-Ordner und nebeneinander zeigen.
- Bei Hybrid-Stilen zusätzlich 2–4 KI-Testbilder mit dem Prompt-Anker (gratis zuerst, `higgsfield-praxis`) + ein Figurenblatt der Hauptfigur.
- Nutzer wählt/kombiniert → Gewinner behalten, Rest löschen.

### 5. Branding (optional, `references/branding.md`)
Name, Markenzeichen (ein Element, das man vermissen würde), Logo als SVG per Code, Farbsystem mit Verläufen, Schrift-Trio, Brandboard-HTML, Profilbild/Banner (`yt-thumbnail`). Mit Higgsfield: Skill `higgsfield-brandkit` (falls installiert).

### 6. Festhalten und pflegen
- In `CLAUDE.md` des Kits (Abschnitt „Mein Kanal“) eintragen, welcher Stil Standard ist.
- Jedes Stil-Feedback des Nutzers („zu dunkel“, „Schrift zu verspielt“) sofort in `STYLE.md` → Abschnitt „Gelernt“.

## Die 5 mitgelieferten Stile
| Stil | Gefühl | gut für |
|---|---|---|
| `doodle-papier` | handgezeichnetes Notizbuch, warm, freundlich | Erklärvideos, Finanzen, Bildung |
| `clean-hell` | Apple-clean, viel Luft, ein Akzent | Tech, Business, Produkt |
| `dunkel-kino` | Nachtblau, Spotlight, Filmkorn, Gold | Geschichte, Story, Mystery |
| `mesh-pastell` | weiche körnige Pastell-Verläufe, Serif | Brand-Reels, Lifestyle, Studio |
| `kreidetafel` | Tafelgrün, Kreide, Gelb | Lernen, Mathe, Wissenschaft |
