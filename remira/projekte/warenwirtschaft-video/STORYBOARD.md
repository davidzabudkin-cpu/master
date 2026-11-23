# REMIRA Glossar-Erklärvideo „Warenwirtschaftssystem (WWS)“ – Storyboard v3

**v3 23.11.2026:** Feedback umgesetzt: eigene Musik (100 BPM, Marimba, Shaker, gebrochener Beat), Szenen gestaffelt (Warenstrom: erst Satz, dann Kacheln, dann 4 Kartons; So funktioniert's: ① Datenstrom → ② Dashboard → ③ Nachbestellung → Umlagerung), 81 s, strengere Lesezeit. Beat-Zeiten unten sind v2, aktuelle Zeiten in `src/timeline.js`.

**18.11.2026, v2 (eigenständiger Aufbau).** v1 war fast 1:1 das OMS-Video; Wunsch: eigener Aufbau, der zum Thema passt, OMS nur als Orientierung.
Texte und Quellen: `SKRIPT.md`, `src/texte.js` (G = Glossar, P = Produktseite remira.com). 16:9, 30 fps, 74,5 s, ohne Stimme, DE + EN.

**Ein Satz:** Wer das Video sieht, versteht: Ein WWS bildet den Weg der Ware ab, hält Bestände exakt und sorgt automatisch für Nachschub – und REMIRA hat so ein System.
**Ende zuerst:** Endkarte B „REMIRA · Warenwirtschaft · Alle Waren. Ein System.“ (Reihenmerkmal wie OMS).
**Bildsprache (neu, themenbezogen):** Kartons in Ringfarben als „Ware“, Regal, Warenstrom auf einer Bahn, Kreislauf, Bestands-Dashboard mit Mindestbestand, Datendrehscheibe, Bestandsverlauf. Der REMIRA-Ring bleibt roter Faden (Reihe), hat hier aber andere Rollen: Beobachter über dem Warenstrom → Mitte des Kreislaufs → graue Uhr → Hub → Drehscheibe → Ende der Bestandslinie → Logo.
**Kamera (anders als OMS):** Welt im Zickzack: runter → rechts → runter → rechts → rechts → hoch → rechts.

## Hook-Varianten
1. Regal füllt sich Karton für Karton, Titel „Was ist ein Warenwirtschaftssystem?“ (gewählt: Thema sofort im Bild + Text, ohne Ton verständlich)
2. Leeres Regalfach blinkt rot → Frage (verworfen: Problem vor Definition verwirrt bei Glossar-Video)
3. Karton fährt ins Bild (verworfen: zu wenig Information in 3 s)

## Beats
| # | Zeit (s) | Zweck | Key Visual | Text im Bild | Motion / Kamera | Ton |
|---|---|---|---|---|---|---|
| 1 | 0–7,6 | Hook | Ring setzt sich zusammen, darunter Titel, darunter Regal: 10 Kartons in Ringfarben poppen nacheinander in die Fächer | „Was ist ein **Warenwirtschaftssystem** (WWS)?“ | Kartons fallen weich ein (ease-out, steht 0,5 s) | leises Intro, Tap je Karton, keine Claps |
| 2 | 8,4–16,8 | Kontext | Warenstrom: Bahn mit 4 Kacheln Lieferant → Lager → Filiale → Kunde, Kartons fahren durchgehend; Ring darüber, Datenpunkte steigen von jeder Kachel zum Ring („abbilden“) | Definition (G) | Fahrt nach unten; Kartons fahren mit 300 px/s, Text steht | Beat setzt ein, Tap pro Station |
| 3 | 17,6–25,6 | Beleg | Kreislauf: Ring groß in der Mitte („WWS“), 5 Bereiche im Kreis, ein Karton läuft eine Runde, Bereiche leuchten nacheinander, Pfeile zeigen Richtung | „Ein WWS verbindet alle Bereiche:“ Einkauf, Wareneingang, Lager, Warenausgang, Verkauf (G) | Fahrt nach rechts | aufsteigende Taps |
| 4 | 26,8–35,6 | Wendung (Problem) | dasselbe Regal wie im Hook, aber kaputt: Fächer leer (rot) und überfüllt (orange), daneben 3 lose Listen mit roten „?“-Verbindungen; Ring grau als tickende Uhr | DAS PROBLEM · Satz · 3 Schlagworte | Fahrt nach unten, rötliches Licht | Moll, Papier, Ticken |
| 5 | 36,6–52,4 | Auflösung | Heldin fliegt durch, Ring wird bunt = Hub; links 4 Quellen strömen ein; rechts Bestands-Dashboard: 3 Artikel mit Balken + Mindestbestand. ① Daten laufen zusammen ② Balken füllen sich exakt, Chip „aktuell“ ③ ein Balken fällt unter Mindestbestand (rot) → Chip „nachbestellt“, Balken füllt sich; zwei Filialen, Karton wechselt per „Umlagerung“ | ①②③ (P) | Fahrt nach rechts, danach Stand | Drop auf den Hub, Glocke bei „aktuell“ |
| 6 | 53,2–61,0 | Rehook/Nutzen | Datendrehscheibe: Ring dreht sich spürbar, 4 Knoten im Bogen (Omnichannel-Handel, Echtzeit-Auswertungen, Zentrale Datendrehscheibe, EDI-Kommunikation), Punkte laufen auf Speichen in beide Richtungen | „Was dadurch möglich wird:“ + Fußzeile (P) | Fahrt nach rechts | Pop + Tap je Knoten |
| 7 | 61,8–67,6 | Auflösung | Bestandsverlauf: Zickzack zwischen Überbestand (orange) und Fehlbestand (rot) glättet sich mit jedem Häkchen in den grünen Korridor; Ring sitzt am Linienende | „Ein Warenwirtschaftssystem sorgt für:“ 4 Häkchen (G) | Fahrt nach oben | Häkchen-Taps |
| 8 | 68,3–74,5 | CTA | Endkarte B | REMIRA · Warenwirtschaft · Alle Waren. Ein System. · Jetzt mehr erfahren auf REMIRA.COM | Ring rastet ins Logo, Stand ≥ 4,5 s | Impact, Drums stoppen |

## Gates
- Hook: Thema in Bild (Regal/Kartons) + Text gleichzeitig, ohne Ton verständlich, kein Logo am Anfang. ✔
- Kein Beat wiederholt ein Bild: Regal kehrt nur als bewusster Rückbezug kaputt wieder. ✔
- Alle 2–3 s ändert sich etwas, Lesezeit in DE und EN geprüft (`tools/dump_cues.mjs`). ✔
- Machbarkeit: alles Canvas-Code, Icons Phosphor bold, keine neuen KI-Assets. ✔
- OMS-Lehren: Text steht still, Linien nur zwischen Kreisen/Kacheln, Punkte auf Großbuchstaben-Mitte, Endkarte B mit fester Claim-Größe, keine Claps, Intro leise, Zeichensetzung (keine Gedankenstriche, Listen ohne Punkt). ✔
