# Stimme, Sounds, Musik, Schnitt, Endkontrolle

## Stimme
- **Pro Satz eine Aufnahme** (eigene Stimme, ElevenLabs, Higgsfield-TTS …). Vorteil: nur geänderte Sätze neu, Schnitt nach Sätzen möglich.
- Neue Figur: 3–4 Stimmen als Hörprobe (je 1 Satz), Nutzer entscheidet. Neutrale Tonlagen wählen; Nebenfiguren mit Stimme, die sonst nicht vorkommt.
- **Alle Stimmen gleich laut und ähnlich hoch.** Lautheit pro Satz angleichen (loudnorm); auffällige Stimme mit Tonhöhe (z. B. 0,93) und −2,5 dB angleichen statt neu zu generieren.
- Realistisch klingt: Tonhöhen-Variation, Pausen an wichtigen Stellen, Betonung, menschlich geschriebener Text. ElevenLabs: „…“ zögerlich, „!“ begeistert.
- Für deutsche Stimmen ohne Akzent: Muttersprachler-Stimme oder geklonte eigene Stimme – viele Presets haben Akzent.
- Nie eine Vorschau mit Platzhalter-Stimme (System-TTS) zeigen – dann lieber ohne Ton.
- **Sätze an der Stille in der Tonspur schneiden, nie nach Whisper-Zeiten** (sonst fehlen Silben, z. B. „Dollar“ am Satzende).
- Falsch ausgesprochenes Wort (TTS) → Satz neu oder weglassen, nicht nur den Untertitel korrigieren.

## Soundeffekte
- **Ein Sound pro Ereignis, nur wenn das Bild genau diese Handlung zeigt.** Pro Minute höchstens 2–3 (Erklärvideo); Werbe-Reels dürfen kräftiger sein (Whoosh/Riser/Drop an Übergängen).
- Weich und echt statt scharf: keine Pop-Töne, kein Papier-/Stift-Rascheln (klingt wie Rauschen), keine „Ball fällt“-Bloops mit Tonhöhen-Rutsch.
- Weiche musikalische Töne (Marimba/Glocke in Pentatonik, `motion-kit`) 50–70 ms **vor** dem Bild-Ereignis. Nie einen Sound auf ein gesprochenes Wort legen.
- Getippter Text = durchgehendes leises Tippen. Effekte normiert, ca. 7–8 dB unter der Stimme.
- KI-Effekte vorher anhören/Hüllkurve prüfen: viele sind fast nur Rauschen.

## Musik
- Leise unter der Stimme (Gain ~0,08–0,12), Stimmung pro Abschnitt (verspielt → geheimnisvoll ab der Wendung), Stille beim Schock.
- Ein durchgehender Lauf, kein Stopp mitten im Fluss; Drops auf Schlüssel-Schnitte legen; am Ende weich ausklingen, kein abruptes Ende, kein Netflix-„Ta-dum“.
- Kein Ducking unter Effekten (stört), Musik gleichmäßig laut bis zum Outro.
- Lizenz klären: generierte/lizenzfreie Musik; lizenzierte Songs nur intern, zum Posten Fassung ohne Musik.

## Schnitt (nach Sätzen)
- Pro Shot: Bild/Clip/Grafik, Schnittwort (`at`), Effekt (`type`/`fade`), Sound. Pro Satz: Pause, Tempo, Tonhöhe, Gain.
- Grenzen: min. ~1,4–1,9 s Rohzeit pro Shot, max. ~5–6 s (sonst teilen). Animationen laufen zu Ende.
- Schnittwörter: nie Zahlen (Whisper schreibt Ziffern), keine Wörter, die mit anderen beginnen („So“ trifft „Social“) – Nachbarwort nehmen.
- Kapitelkarten mind. ~2 s, Kapitel-Titel getippt.
- Nach Skript-/Stimmenänderung alle betroffenen Clips/Grafiken **neu** rendern (alte Längen!).

## Endkontrolle (vor jedem Versand)
1. Kontaktbogen (`werkzeuge/kontaktbogen.py`) + letztes Bild jeder Animation.
2. `qualitaets-checkliste.md` durchgehen.
3. Stille messen: `ffmpeg -i video.mp4 -af silencedetect=n=-40dB:d=1.2 -f null -` → nirgends > 1,2 s, Ende max. 1 s nach letztem Satz.
4. Tempo-Fassung (oft 1,2–1,3× für Erklärvideos) nur mit `werkzeuge/tempo.py` (Bild/Ton getrennt + Längenprüfung). Lautheit −16 LUFS lang, −14 LUFS Shorts.
5. Kapitel-Zeitstempel aus der finalen Timeline (÷ Tempo-Faktor) – bei jeder neuen Fassung neu berechnen.
6. Du kannst nicht hören: dem Nutzer sagen „gemessen, nicht angehört“.
