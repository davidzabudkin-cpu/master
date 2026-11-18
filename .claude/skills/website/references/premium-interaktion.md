# Premium-Interaktion: Websites, die nach 10.000 € aussehen (David, 11.11.2026)

## Davids Wunsch (sinngemäß, Diktat 11.11.)
„Richtig krasse Animationen, so dass es wirklich aussieht wie eine 10.000-Euro-Website. Wenn man mit der Maus über Text geht, passiert was. Im Hintergrund krasse Elemente, der Hintergrund reagiert auf die Maus. Wenn man etwas erklärt, z. B. mit einem Gitter/Raster, hat das beim Drüberfahren einen magnetischen Effekt. Nicht einfach stumpf runterscrollen, sondern interessant und **passend zum Thema** gestaltet. Gern auch richtig gute 3D-Objekte und -Animationen planen.“
Modell: Websites und Motion-Videos mit **Fable 5.2** bauen (bestes Modell für Design und Code).

## Grundsatz
Jeder Effekt muss **zum Thema passen** und eine Aussage tragen (Inventur → Raster aus Kisten, das sich magnetisch zur Maus neigt; Commerce → Kanäle, die sich beim Hovern verbinden). Effekte ohne Bedeutung wirken billig. **Eine** große Signature-Idee pro Seite, dazu 3–5 Mikro-Interaktionen, die überall gleich funktionieren.

## Baukasten (Desktop mit Maus)
| Effekt | Wofür | Technik |
|---|---|---|
| **Magnetisches Raster** | Erklär-Abschnitte, Daten, Lager | Canvas/WebGL-Punkt- oder Kachelgitter; Punkte im Radius 120–200 px werden zur Maus gezogen bzw. weggedrückt, Federung (Spring, Dämpfung 0.12–0.2), Farbe/Größe nach Distanz |
| **Hintergrund reagiert auf Maus** | Hero, Abschnittswechsel | Partikelfeld, Linien-Netz, weicher Spotlight-Verlauf, Gradient-Mesh, das der Maus träge folgt (Lerp 0.06–0.1) |
| **Text-Hover** | Headlines, Schlüsselwörter | Buchstaben weichen der Maus aus oder heben sich (Split in Spans), variable Font-Weight an der Maus, Scramble/Decode, Farbverlauf folgt der Maus, Unterstreichung „wächst“ |
| **Magnetische Buttons** | CTA | Button zieht sich 6–12 px zur Maus, Inhalt doppelt so stark (Parallax im Button), Ripple beim Klick |
| **Custom Cursor** | ganze Seite | kleiner Punkt + nachziehender Ring, wird über Links/Bildern größer mit Label („Ansehen“, „Ziehen“) |
| **Tilt-Karten** | Vorteile, Module | 3D-Neigung ±8° zur Maus, Glanzlicht wandert mit, Schatten verschiebt sich |
| **Scroll-Bühnen** | Storytelling | Bildschirm bleibt stehen, Inhalte bauen sich an Ort und Stelle auf (siehe `buehnen-scroll-v13.md`), Kamera-Fahrt durch 3D-Szene |
| **Signature-Element wandert mit** | roter Faden | ein Objekt (z. B. Remira-Ring) begleitet den Scroll durch alle Abschnitte und verwandelt sich |

## 3D
- **Three.js** (UMD von cdnjs, feste Version) für echte 3D-Objekte: Logo/Ring als extrudiertes 3D-Objekt mit Glas-/Metall-Material, Kisten-Lager, Globus mit Standorten, Partikelwolken. Kamera am Scroll, Objekt reagiert leicht auf Maus.
- GLB-Modelle: selbst modellieren lassen (Three.js-Geometrie), oder Higgsfield `generate_3d` (Credits vorher prüfen und nennen).
- Licht: Environment-Map + ein Key-Light, sanfte Schatten. Postprocessing (Bloom) nur dezent.
- Vorher **planen**: Szene, Kamera-Pfad, was der Nutzer mit Maus/Scroll steuert – als kurze Skizze im Design-Paket, bevor gebaut wird.

## Leitplanken (Davids ältere Regeln bleiben gültig)
- **Flüssig vor Effekt:** 60 fps auf normalem Laptop, kein Ruckeln, kein Flackern. Mit 4× CPU-Drossel testen. Nur `transform`/`opacity` animieren, Canvas mit `requestAnimationFrame`, Maus-Events drosseln.
- **Hintergrund:** Erlaubt sind eigene Hintergrund-Ebenen (Partikel, Raster, Linien, Licht), die auf die Maus reagieren. **Nicht** erlaubt: Fotos/Videos im Hintergrund verzerren, verwischen oder „wellen“ (hat David am 21.10. gestört).
- **Handy zuerst:** Es gibt keine Maus → jeder Maus-Effekt braucht eine Handy-Fassung: auf Berührung/Scroll/Neigung reagieren oder ruhig stehen. Keine großen Live-Blur-Flächen am Handy. 3D am Handy vereinfacht oder als Standbild.
- **Lesbarkeit:** Text bleibt immer lesbar, Effekte nie über Fließtext. Wenig Text.
- `prefers-reduced-motion` respektieren (Effekte aus, Inhalt bleibt).
- Laden: „Erst sichtbar, dann schwer“ – 3D/Canvas erst nach dem ersten Bild starten.
- Branding des Kunden streng einhalten (Farben, Schrift, Signature aus dem Logo).

## Prüfen vor Übergabe
Desktop 1440 + Handy 390/360 ansehen, Hover-Zustände per Screenshot belegen, Konsole fehlerfrei, kein seitlicher Überstand, Bildrate gemessen.
