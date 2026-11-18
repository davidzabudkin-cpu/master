"""motion-kit – Motion Graphics per Code (Python + Pillow + numpy + ffmpeg, 0 Credits).

Jedes Bild hängt nur von der Zeit t ab (deterministisch). Eine Szene ist eine
Funktion draw(c, t), die auf eine Leinwand zeichnet. Der Stil (Farben, Schriften,
Hintergrund, Sounds) kommt aus einer style.json, damit derselbe Code in jedem
Look funktioniert.

Kurzbeispiel:
    import mk
    v = mk.Video(mk.Style.load("../stile/clean-hell/style.json"), size=(1920, 1080), fps=30)
    def s1(c, t):
        c.bg()
        c.title("WOHIN 5 € FÜR EINEN KAFFEE GEHEN", t, t0=0.1)
        c.counter(960, 560, t, 0.6, 2.4, 0, 5, fmt="{:.2f} €", size=200)
    v.scene(0, 4, s1)
    v.sfx("marimba", 0.6, note=4)
    v.render("out/demo.mp4")

Mehr: README.md im selben Ordner.
"""
from __future__ import annotations

import json
import math
import os
import shutil
import subprocess
import sys
import wave
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

HERE = Path(__file__).resolve().parent

# --------------------------------------------------------------------------- Easing
def clamp(x, a=0.0, b=1.0):
    return a if x < a else b if x > b else x

def prog(t, t0, dur):
    """0..1 zwischen t0 und t0+dur."""
    return clamp((t - t0) / dur) if dur > 0 else float(t >= t0)

def ease_out(x):      return 1 - (1 - x) ** 3
def ease_in_out(x):   return 4 * x ** 3 if x < 0.5 else 1 - (-2 * x + 2) ** 3 / 2
def ease_back(x, s=1.7):
    x -= 1
    return 1 + (s + 1) * x ** 3 + s * x ** 2

def pop(t, t0, dur=0.25):
    """Skala für Aufploppen mit leichtem Überschwingen (0 vor t0)."""
    return 0.0 if t < t0 else ease_back(prog(t, t0, dur))

def slam(t, t0, dur=0.28, big=1.8):
    """Skala für „Reinknallen“: groß → 1 mit Nachfedern."""
    if t < t0:
        return 0.0
    x = prog(t, t0, dur)
    if x >= 1:
        return 1.0
    return 1.0 + (big - 1.0) * (1 - ease_out(x)) - 0.06 * math.sin(math.pi * x)

def fade(t, t0, dur=0.25):
    return ease_out(prog(t, t0, dur))

def lerp(a, b, x):
    return a + (b - a) * x

# --------------------------------------------------------------------------- Farben
def rgb(c, a=255):
    """'#rrggbb' | (r,g,b) | (r,g,b,a) → RGBA-Tupel."""
    if isinstance(c, str):
        c = c.lstrip("#")
        return (int(c[0:2], 16), int(c[2:4], 16), int(c[4:6], 16), a)
    if len(c) == 3:
        return (*c, a)
    return tuple(c)

def with_alpha(c, a):
    r, g, b, _ = rgb(c)
    return (r, g, b, int(a))

# --------------------------------------------------------------------------- Stil
FONT_DIRS = [HERE / "fonts", Path(os.environ.get("WINDIR", "C:/Windows")) / "Fonts",
             Path.home() / "AppData/Local/Microsoft/Windows/Fonts",
             Path("/Library/Fonts"), Path("/System/Library/Fonts"), Path.home() / "Library/Fonts",
             Path("/usr/share/fonts"), Path.home() / ".fonts"]

class Style:
    """Lädt style.json: Farben, Schriften, Hintergrund, Bewegung, Ton."""

    DEFAULT = {
        "name": "neutral",
        "colors": {"bg": "#F6F2EA", "bg2": "#E9E1D3", "ink": "#1E1E1E", "accent": "#E8A33A",
                   "accent2": "#2E7D4F", "warn": "#C8402F", "muted": "#8A8A8A", "card": "#FFFFFF"},
        "fonts": {"head": ["Fredoka-Bold.ttf"], "body": ["Nunito-Regular.ttf"],
                  "caption": ["Nunito-Black.ttf"], "hand": ["segoepr.ttf", "Fredoka-Regular.ttf"]},
        "background": {"type": "paper", "grain": 0.04, "vignette": 0.0},
        "line_width": 6, "corner": 18, "shadow": True,
        "motion": {"push": 0.004, "crossfade": 0.2, "kick": 1.0},
        "sound": {"palette": "soft", "music_gain": 0.10, "sfx_gain": 0.5},
    }

    def __init__(self, data: dict, base: Path | None = None):
        d = json.loads(json.dumps(self.DEFAULT))
        for k, v in data.items():
            if isinstance(v, dict) and isinstance(d.get(k), dict):
                d[k].update(v)
            else:
                d[k] = v
        self.d = d
        self.base = base
        self.c = {k: rgb(v) for k, v in d["colors"].items()}
        self._fonts = {}

    @classmethod
    def load(cls, path):
        p = Path(path)
        if p.is_dir():
            p = p / "style.json"
        return cls(json.loads(p.read_text(encoding="utf-8")), p.parent)

    def col(self, name_or_value, a=255):
        if isinstance(name_or_value, str) and name_or_value in self.c:
            return with_alpha(self.c[name_or_value], a)
        return with_alpha(rgb(name_or_value), a)

    def font(self, role: str, size: int) -> ImageFont.FreeTypeFont:
        key = (role, int(size))
        if key in self._fonts:
            return self._fonts[key]
        names = self.d["fonts"].get(role) or self.d["fonts"]["head"]
        if isinstance(names, str):
            names = [names]
        dirs = ([self.base] if self.base else []) + FONT_DIRS
        f = None
        for n in list(names) + ["Fredoka-Bold.ttf", "arialbd.ttf", "Arial Bold.ttf", "DejaVuSans-Bold.ttf"]:
            for dd in dirs:
                for cand in (dd / n,) if dd and (dd / n).exists() else ():
                    try:
                        f = ImageFont.truetype(str(cand), int(size))
                        break
                    except OSError:
                        pass
                if f:
                    break
            if f:
                break
        if f is None:
            f = ImageFont.load_default(int(size))
        self._fonts[key] = f
        return f

# --------------------------------------------------------------------------- Leinwand
class Canvas:
    """Eine Bildfläche pro Frame mit Bausteinen. Koordinaten in Pixeln, Mitte-Anker."""

    def __init__(self, video: "Video"):
        self.v = video
        self.s = video.style
        self.W, self.H = video.size
        self.im = Image.new("RGBA", video.size, self.s.col("bg"))
        self.d = ImageDraw.Draw(self.im)
        self.k = min(video.size) / 1080  # Skalierung relativ zu 1080p (kurze Seite), gilt für 16:9 und 9:16

    # ---------------- Grundlagen
    def px(self, v):
        return int(round(v * self.k))

    def num(self, fmt, val):
        """Zahl formatieren; bei thousands='.' Komma als Dezimalzeichen (deutsch)."""
        out = fmt.format(val)
        if self.v.thousands == ".":
            out = out.replace(",", "§").replace(".", ",").replace("§", ".")
        return out

    def paste(self, img: Image.Image, cx, cy, scale=1.0, rot=0.0, alpha=1.0):
        if img is None or scale <= 0.01 or alpha <= 0.01:
            return
        im = img
        if scale != 1.0:
            im = im.resize((max(1, int(im.width * scale)), max(1, int(im.height * scale))), Image.BICUBIC)
        if rot:
            im = im.rotate(rot, resample=Image.BICUBIC, expand=True)
        if alpha < 1.0:
            im = im.copy()
            im.putalpha(im.getchannel("A").point(lambda a: int(a * alpha)))
        self.im.alpha_composite(im, (int(cx - im.width / 2), int(cy - im.height / 2)))

    def layer(self):
        """Leere Ebene in Bildgröße (für Elemente mit eigener Deckkraft)."""
        return Image.new("RGBA", self.v.size, (0, 0, 0, 0))

    # ---------------- Hintergründe
    def bg(self, kind=None, colors=None):
        """Hintergrund laut Stil: paper | solid | gradient | spotlight | image:<pfad>."""
        b = self.s.d["background"]
        kind = kind or b.get("type", "paper")
        key = ("bg", kind, tuple(colors or ()))
        cached = self.v._cache.get(key)
        if cached is None:
            cached = self._make_bg(kind, b, colors)
            self.v._cache[key] = cached
        self.im.paste(cached)
        self.d = ImageDraw.Draw(self.im)

    def _make_bg(self, kind, b, colors):
        W, H = self.W, self.H
        if kind.startswith("image:"):
            p = Path(kind[6:])
            if not p.is_absolute() and self.s.base:
                p = self.s.base / p
            im = Image.open(p).convert("RGBA")
            sc = max(W / im.width, H / im.height)
            im = im.resize((int(im.width * sc) + 1, int(im.height * sc) + 1), Image.LANCZOS)
            return im.crop(((im.width - W) // 2, (im.height - H) // 2, (im.width - W) // 2 + W, (im.height - H) // 2 + H))
        cols = [rgb(c) for c in (colors or b.get("colors") or [self.s.d["colors"]["bg"], self.s.d["colors"]["bg2"]])]
        y, x = np.mgrid[0:H, 0:W].astype(np.float32)
        if kind == "solid" or kind == "paper":
            arr = np.zeros((H, W, 3), np.float32) + np.array(cols[0][:3], np.float32)
        elif kind == "gradient":
            ang = math.radians(b.get("angle", 160))
            u = ((x - W / 2) * math.sin(ang) - (y - H / 2) * math.cos(ang)) / max(W, H) + 0.5
            u = np.clip(u, 0, 1)
            arr = _ramp(u, cols)
        elif kind == "spotlight":
            r = np.sqrt(((x - W / 2) / (W * 0.7)) ** 2 + ((y - H * 0.45) / (H * 0.7)) ** 2)
            arr = _ramp(np.clip(r, 0, 1), cols)
        elif kind == "mesh":
            # weicher Verlauf aus bis zu 4 Farbflecken (Ecken), wirkt wie "Mesh-Gradient"
            pts = [(0.15, 0.2), (0.85, 0.15), (0.2, 0.9), (0.9, 0.85)]
            acc = np.zeros((H, W, 3), np.float32); wsum = np.zeros((H, W, 1), np.float32)
            for (px_, py_), c in zip(pts, cols + cols[:4]):
                dist = ((x / W - px_) ** 2 + (y / H - py_) ** 2)[..., None]
                w_ = 1.0 / (dist + 0.04) ** 2
                acc += w_ * np.array(c[:3], np.float32); wsum += w_
            arr = acc / wsum
        else:
            raise ValueError(f"Unbekannter Hintergrund: {kind}")
        g = float(b.get("grain", 0))
        if g > 0:
            rng = np.random.default_rng(7)
            arr = arr + rng.normal(0, 255 * g, (H, W, 1)).astype(np.float32)
        vg = float(b.get("vignette", 0))
        if vg > 0:
            r = np.sqrt(((x - W / 2) / (W * 0.62)) ** 2 + ((y - H / 2) / (H * 0.62)) ** 2)
            arr = arr * (1 - np.clip((r - 0.55) / 0.7, 0, 1)[..., None] * vg)
        arr = np.clip(arr, 0, 255).astype(np.uint8)
        return Image.fromarray(arr, "RGB").convert("RGBA")

    # ---------------- Text
    def text_img(self, text, size=80, color="ink", role="head", stroke=0, stroke_color="bg",
                 shadow=None, max_w=None, align="center", line_gap=0.12):
        """Text als freigestelltes Bild (mehrzeilig mit \\n oder automatisch bei max_w)."""
        shadow = self.s.d.get("shadow", True) if shadow is None else shadow
        key = ("txt", text, size, str(color), role, stroke, str(stroke_color), shadow, max_w, align)
        if key in self.v._cache:
            return self.v._cache[key]
        f = self.s.font(role, self.px(size))
        lines = []
        for para in text.split("\n"):
            if max_w:
                cur = ""
                for w in para.split():
                    t2 = (cur + " " + w).strip()
                    if f.getlength(t2) > self.px(max_w) and cur:
                        lines.append(cur); cur = w
                    else:
                        cur = t2
                lines.append(cur)
            else:
                lines.append(para)
        asc, desc = f.getmetrics()
        lh = int((asc + desc) * (1 + line_gap))
        st = self.px(stroke)
        wmax = max(int(f.getlength(l)) for l in lines) + 2 * st + self.px(16)
        hh = lh * len(lines) + 2 * st + self.px(16)
        im = Image.new("RGBA", (wmax, hh), (0, 0, 0, 0))
        d = ImageDraw.Draw(im)
        for i, l in enumerate(lines):
            lw = f.getlength(l)
            x0 = {"center": (wmax - lw) / 2, "left": st + self.px(8), "right": wmax - lw - st - self.px(8)}[align]
            y0 = st + self.px(8) + i * lh
            if shadow:
                off = max(2, self.px(6))
                d.text((x0 + off, y0 + off), l, font=f, fill=(0, 0, 0, 70))
            d.text((x0, y0), l, font=f, fill=self.s.col(color),
                   stroke_width=st, stroke_fill=self.s.col(stroke_color))
        bb = im.getbbox()
        im = im.crop(bb) if bb else im
        self.v._cache[key] = im
        return im

    def text(self, text, x, y, size=80, color="ink", role="head", scale=1.0, alpha=1.0, rot=0.0, fit=True, **kw):
        """Text zentriert auf (x, y). fit=True verkleinert, damit nichts näher als 60 px am Rand ist."""
        img = self.text_img(text, size, color, role, **kw)
        if fit and img.width * scale > self.W - 2 * self.px(60):
            scale *= (self.W - 2 * self.px(60)) / (img.width * scale)
        self.paste(img, x, y, scale, rot, alpha)

    def typed(self, text, x, y, t, t0, cps=22, size=60, color="ink", role="hand", cursor=True, **kw):
        """Schreibmaschinen-Text, linksbündig ab x. Gibt True zurück, solange getippt wird."""
        n = int(max(0.0, t - t0) * cps)
        if t < t0:
            return False
        part = text[:n]
        f = self.s.font(role, self.px(size))
        if part:
            img = self.text_img(part, size, color, role, shadow=False, align="left", **kw)
            self.im.alpha_composite(img, (int(x), int(y - img.height / 2)))
        if cursor and n < len(text) and int(t * 3) % 2 == 0:
            cx = x + f.getlength(part) + self.px(6)
            self.d.rectangle((cx, y - self.px(size) * 0.45, cx + self.px(4), y + self.px(size) * 0.45), fill=self.s.col(color))
        return n < len(text)

    def slam_word(self, text, x, y, t, t0, size=160, color="accent", **kw):
        """Hero-Wort knallt rein (Kinetic Type)."""
        sc = slam(t, t0)
        if sc > 0:
            self.text(text, x, y, size, color, scale=sc, stroke=kw.pop("stroke", 4), **kw)

    def pop_text(self, text, x, y, t, t0, size=80, color="ink", **kw):
        sc = pop(t, t0)
        if sc > 0:
            self.text(text, x, y, size, color, scale=sc, **kw)

    def title(self, text, t, t0=0.0, y=None, size=64, color="ink", marker="accent"):
        """Grafik-Titel = Aussage (nicht Thema), mit Textmarker darunter."""
        y = self.px(110) if y is None else y
        a = fade(t, t0, 0.3)
        if a <= 0:
            return
        img = self.text_img(text, size, color, "head", shadow=False)
        while img.width > self.W - 2 * self.px(80) and size > 24:
            size -= 4
            img = self.text_img(text, size, color, "head", shadow=False)
        w = img.width * prog(t, t0 + 0.1, 0.45)
        if marker:
            lay = self.layer(); dl = ImageDraw.Draw(lay)
            dl.rounded_rectangle((self.W / 2 - img.width / 2 - self.px(14), y + img.height * 0.05,
                                  self.W / 2 - img.width / 2 - self.px(14) + w + self.px(28), y + img.height * 0.55),
                                 self.px(8), fill=self.s.col(marker, 140))
            self.im.alpha_composite(lay)
        self.paste(img, self.W / 2, y, 1.0, 0, a)

    def tag(self, text, t, t0=0.0, pos="bl", color="ink", fill="card"):
        """Kleines Schild (EXAMPLE, QUELLE, ORT + JAHR) in einer Ecke."""
        a = fade(t, t0, 0.25)
        if a <= 0:
            return
        img = self.text_img(text, 30, color, "caption", shadow=False)
        pad = self.px(14)
        box = Image.new("RGBA", (img.width + 2 * pad, img.height + 2 * pad), (0, 0, 0, 0))
        ImageDraw.Draw(box).rounded_rectangle((0, 0, box.width - 1, box.height - 1), self.px(10),
                                              fill=self.s.col(fill), outline=self.s.col("ink"), width=max(2, self.px(3)))
        box.alpha_composite(img, (pad, pad))
        m = self.px(60)
        x = {"l": m + box.width / 2, "r": self.W - m - box.width / 2, "c": self.W / 2}[pos[1] if len(pos) > 1 else "c"]
        y = {"t": m + box.height / 2, "b": self.H - m - box.height / 2}[pos[0]]
        self.paste(box, x, y, 1.0, 0, a)

    # ---------------- Zahlen und Diagramme
    def counter(self, x, y, t, t0, t1, v0, v1, fmt="{:,.0f}", size=180, color="ink", **kw):
        """Zähler läuft von v0 nach v1 zwischen t0 und t1 (nur Zahlen zählen, keine Jahre!)."""
        if t < t0:
            return
        val = lerp(v0, v1, ease_out(prog(t, t0, t1 - t0)))
        self.text(self.num(fmt, val), x, y, size, color, **kw)

    def bars(self, data, t, t0=0.0, step=0.35, box=None, horizontal=False, fmt="{:,.0f}", max_value=None):
        """Balken wachsen nacheinander. data = [(label, wert, farbe?), ...]."""
        x0, y0, x1, y1 = box or (self.px(260), self.px(260), self.W - self.px(260), self.H - self.px(170))
        n = len(data)
        mv = max_value or max(d[1] for d in data) or 1
        lw = max(2, self.px(self.s.d["line_width"]))
        for i, item in enumerate(data):
            label, val = item[0], item[1]
            col = item[2] if len(item) > 2 else ("accent" if i == n - 1 else "accent2")
            g = ease_out(prog(t, t0 + i * step, 0.6))
            if g <= 0:
                continue
            if horizontal:
                bh = (y1 - y0) / n * 0.6
                cy = y0 + (i + 0.5) * (y1 - y0) / n
                lab_w = self.px(260)
                w = (x1 - x0 - lab_w) * (val / mv) * g
                self.d.rounded_rectangle((x0 + lab_w, cy - bh / 2, x0 + lab_w + max(w, 2), cy + bh / 2),
                                         self.px(self.s.d["corner"]), fill=self.s.col(col), outline=self.s.col("ink"), width=lw)
                self.text(label, x0 + lab_w / 2, cy, 40, "ink", "body", shadow=False)
                self.text(self.num(fmt, val * g), x0 + lab_w + w + self.px(90), cy, 46, "ink", alpha=g)
            else:
                bw = (x1 - x0) / n * 0.55
                cx = x0 + (i + 0.5) * (x1 - x0) / n
                h = (y1 - y0 - self.px(120)) * (val / mv) * g
                self.d.rounded_rectangle((cx - bw / 2, y1 - max(h, 2), cx + bw / 2, y1),
                                         self.px(self.s.d["corner"]), fill=self.s.col(col), outline=self.s.col("ink"), width=lw)
                self.text(label, cx, y1 + self.px(45), 40, "ink", "body", shadow=False)
                self.text(self.num(fmt, val * g), cx, y1 - h - self.px(55), 52, "ink", alpha=g)

    def pie(self, parts, x, y, r, t, t0=0.0, step=0.5, labels=True):
        """Torte, Stücke kommen nacheinander. parts = [(label, anteil, farbe), ...] (Summe 1)."""
        start = -90.0
        lw = max(2, self.px(self.s.d["line_width"]))
        for i, (label, share, col) in enumerate(parts):
            g = ease_out(prog(t, t0 + i * step, 0.5))
            if g <= 0:
                break
            end = start + 360 * share * g
            self.d.pieslice((x - r, y - r, x + r, y + r), start, end, fill=self.s.col(col), outline=self.s.col("ink"), width=lw)
            if labels and g > 0.6:
                mid = math.radians((start + end) / 2)
                self.text(f"{label}\n{share * 100:.0f} %", x + math.cos(mid) * r * 1.35, y + math.sin(mid) * r * 1.35, 36, "ink", "body", shadow=False)
            start += 360 * share

    def timeline(self, points, t, t0=0.0, step=0.5, y=None, x0=None, x1=None):
        """Zeitleiste: Linie zeichnet sich, Punkte + Beschriftung erscheinen nacheinander. points = [(jahr, text), ...]."""
        y = y or self.H * 0.55
        x0 = x0 or self.px(180); x1 = x1 or self.W - self.px(180)
        lw = max(2, self.px(self.s.d["line_width"]))
        g = ease_in_out(prog(t, t0, step * len(points)))
        self.d.line((x0, y, x0 + (x1 - x0) * g, y), fill=self.s.col("ink"), width=lw)
        n = len(points)
        for i, (yr, txt) in enumerate(points):
            px_ = x0 + (x1 - x0) * (i + 0.5) / n
            p = pop(t, t0 + (i + 0.5) * step)
            if p <= 0:
                continue
            r = self.px(16) * p
            self.d.ellipse((px_ - r, y - r, px_ + r, y + r), fill=self.s.col("accent"), outline=self.s.col("ink"), width=lw // 2)
            up = i % 2 == 0
            sgn = -1 if up else 1
            yi = self.text_img(str(yr), 48, "ink")
            ti = self.text_img(txt, 34, "ink", "body", shadow=False, max_w=300)
            yy = y + sgn * (self.px(34) + yi.height / 2)
            self.paste(yi, px_, yy, p)
            self.paste(ti, px_, yy + sgn * (yi.height / 2 + self.px(12) + ti.height / 2), 1.0, 0, min(1, p))

    def versus(self, left, right, t, t0=0.0, t_win=None, winner=None, y=None):
        """Zwei Karten nebeneinander, Gewinner wird hervorgehoben. left/right = {label, big, note}."""
        y = y or self.H * 0.56
        cw, ch = self.px(560), self.px(520)
        for side, item, dx in (("left", left, -1), ("right", right, 1)):
            p = pop(t, t0 + (0 if side == "left" else 0.25))
            if p <= 0:
                continue
            win = t_win is not None and t >= t_win
            dim = win and winner and winner != side
            card = Image.new("RGBA", (cw, ch), (0, 0, 0, 0)); d = ImageDraw.Draw(card)
            outline = self.s.col("accent" if (win and winner == side) else "ink")
            d.rounded_rectangle((4, 4, cw - 5, ch - 5), self.px(28), fill=self.s.col("card"), outline=outline,
                                width=self.px(10 if (win and winner == side) else 5))
            lab = self.text_img(item.get("label", ""), 52, "ink", shadow=False, max_w=480)
            card.alpha_composite(lab, ((cw - lab.width) // 2, self.px(40)))
            bs = 150
            big = self.text_img(str(item.get("big", "")), bs, item.get("color", "accent"))
            while big.width > cw - self.px(60) and bs > 50:
                bs -= 10
                big = self.text_img(str(item.get("big", "")), bs, item.get("color", "accent"))
            card.alpha_composite(big, ((cw - big.width) // 2, (ch - big.height) // 2 + self.px(10)))
            if item.get("note"):
                nt = self.text_img(item["note"], 34, "muted", "body", shadow=False, max_w=480)
                card.alpha_composite(nt, ((cw - nt.width) // 2, ch - nt.height - self.px(40)))
            sc = p * (1.06 if (win and winner == side) else 1.0)
            self.paste(card, self.W / 2 + dx * self.px(330), y, sc, 0, 0.45 if dim else 1.0)
        if pop(t, t0 + 0.4) > 0:
            self.text("VS", self.W / 2, y, 70, "warn", scale=pop(t, t0 + 0.4))

    def checklist(self, items, t, times, x=None, y0=None, gap=None, size=54, focus=True):
        """Liste: jeder Punkt erscheint zu seiner Zeit, der aktuelle ist hervorgehoben (Fokus-Liste)."""
        x = x or self.px(420); y0 = y0 or self.px(300); gap = gap or self.px(120)
        cur = max([i for i, tt in enumerate(times) if t >= tt], default=-1)
        for i, (it, tt) in enumerate(zip(items, times)):
            p = pop(t, tt)
            if p <= 0:
                continue
            a = 1.0 if (not focus or i == cur) else 0.4
            cy = y0 + i * gap
            self.check(x - self.px(70), cy, t, tt, size=self.px(34), alpha=a)
            img = self.text_img(it, size, "ink", "head", shadow=False)
            lay = self.layer(); lay.alpha_composite(img, (int(x), int(cy - img.height / 2)))
            if a < 1:
                lay.putalpha(lay.getchannel("A").point(lambda v: int(v * a)))
            self.im.alpha_composite(lay)

    def receipt(self, rows, t, t0=0.0, step=0.4, x=None, y0=None, width=760, stamp=None, t_stamp=None):
        """Kassenzettel: Zeilen drucken nacheinander, letzte Zeile = Summe. rows = [(links, rechts) | '---']."""
        x = x or self.W / 2; y0 = y0 or self.px(210)
        lh = self.px(74); w = self.px(width)
        n_vis = sum(1 for i in range(len(rows)) if t >= t0 + i * step)
        h = self.px(80) + lh * max(n_vis, 1)
        self.d.rectangle((x - w / 2, y0, x + w / 2, y0 + h), fill=self.s.col("card"), outline=self.s.col("ink"), width=max(2, self.px(4)))
        for i, r in enumerate(rows[:n_vis]):
            cy = y0 + self.px(60) + i * lh
            if r == "---":
                self.d.line((x - w / 2 + self.px(30), cy, x + w / 2 - self.px(30), cy), fill=self.s.col("muted"), width=max(2, self.px(3)))
                continue
            last = i == len(rows) - 1
            sz = 58 if last else 44
            l = self.text_img(r[0], sz, "ink", "body" if not last else "head", shadow=False)
            rr = self.text_img(r[1], sz, r[2] if len(r) > 2 else "ink", "head", shadow=False)
            self.im.alpha_composite(l, (int(x - w / 2 + self.px(40)), int(cy - l.height / 2)))
            self.im.alpha_composite(rr, (int(x + w / 2 - self.px(40) - rr.width), int(cy - rr.height / 2)))
        if stamp and t_stamp is not None and t >= t_stamp:
            self.slam_word(stamp, x + w * 0.25, y0 + h + self.px(80), t, t_stamp, 90, "warn", rot=-8)

    # ---------------- Formen
    def arrow(self, p0, p1, t, t0=0.0, dur=0.5, color="ink", width=None, head=None, bend=0.0):
        """Pfeil zeichnet sich von p0 nach p1, Spitze erst am Ende (saubere Spitze)."""
        g = ease_in_out(prog(t, t0, dur))
        if g <= 0:
            return
        width = width or max(3, self.px(self.s.d["line_width"]))
        head = head or self.px(34)
        (x0, y0), (x1, y1) = p0, p1
        mx, my = (x0 + x1) / 2 - (y1 - y0) * bend, (y0 + y1) / 2 + (x1 - x0) * bend
        pts = []
        for i in range(41):
            u = i / 40 * g
            pts.append(((1 - u) ** 2 * x0 + 2 * (1 - u) * u * mx + u ** 2 * x1,
                        (1 - u) ** 2 * y0 + 2 * (1 - u) * u * my + u ** 2 * y1))
        self.d.line(pts, fill=self.s.col(color), width=width, joint="curve")
        if g > 0.92:
            (ax, ay), (bx, by) = pts[-2], pts[-1]
            ang = math.atan2(by - ay, bx - ax)
            tri = [(bx + math.cos(ang) * head * 0.4, by + math.sin(ang) * head * 0.4),
                   (bx + math.cos(ang + 2.5) * head, by + math.sin(ang + 2.5) * head),
                   (bx + math.cos(ang - 2.5) * head, by + math.sin(ang - 2.5) * head)]
            self.d.polygon(tri, fill=self.s.col(color))

    def check(self, x, y, t, t0, size=40, color="accent2", alpha=1.0):
        g = ease_out(prog(t, t0, 0.3))
        if g <= 0:
            return
        lay = self.layer(); d = ImageDraw.Draw(lay)
        a = (x - size, y); b = (x - size * 0.25, y + size * 0.7); c = (x + size, y - size * 0.8)
        pts = [a, b] if g < 0.4 else [a, b, (lerp(b[0], c[0], (g - 0.4) / 0.6), lerp(b[1], c[1], (g - 0.4) / 0.6))]
        d.line(pts, fill=self.s.col(color, int(255 * alpha)), width=max(3, int(size * 0.28)), joint="curve")
        self.im.alpha_composite(lay)

    def cross(self, x, y, t, t0, size=60, color="warn"):
        g = ease_out(prog(t, t0, 0.3))
        if g <= 0:
            return
        w = max(4, int(size * 0.3))
        self.d.line((x - size, y - size, x - size + 2 * size * min(1, g * 2), y - size + 2 * size * min(1, g * 2)), fill=self.s.col(color), width=w)
        if g > 0.5:
            u = (g - 0.5) * 2
            self.d.line((x + size, y - size, x + size - 2 * size * u, y - size + 2 * size * u), fill=self.s.col(color), width=w)

    def strike(self, x0, y, x1, t, t0, color="warn"):
        """Rote Durchstreich-Linie (z. B. Mythos)."""
        g = ease_out(prog(t, t0, 0.35))
        if g > 0:
            self.d.line((x0, y, lerp(x0, x1, g), y - self.px(6)), fill=self.s.col(color), width=max(4, self.px(12)))

    def card(self, x, y, w, h, t, t0=0.0, fill="card", outline="ink", radius=None):
        p = pop(t, t0)
        if p <= 0:
            return
        img = Image.new("RGBA", (int(self.px(w)), int(self.px(h))), (0, 0, 0, 0))
        ImageDraw.Draw(img).rounded_rectangle((2, 2, img.width - 3, img.height - 3), self.px(radius or self.s.d["corner"] * 1.5),
                                              fill=self.s.col(fill), outline=self.s.col(outline), width=max(2, self.px(5)))
        self.paste(img, x, y, p)

    # ---------------- Bilder / Figuren
    def image(self, path, x, y, h=None, t=None, t0=0.0, anim="pop", alpha=1.0, rot=0.0):
        """PNG/JPG einsetzen (Figur, Logo, Szene). anim: pop | fade | slide-l | slide-r | none."""
        key = ("img", str(path), h)
        img = self.v._cache.get(key)
        if img is None:
            img = Image.open(path).convert("RGBA")
            if h:
                img = img.resize((int(img.width * self.px(h) / img.height), int(self.px(h))), Image.LANCZOS)
            self.v._cache[key] = img
        sc, a, dx = 1.0, alpha, 0
        if t is not None and anim != "none":
            if t < t0:
                return
            if anim == "pop":
                sc = pop(t, t0)
            elif anim == "fade":
                a *= fade(t, t0, 0.35)
            elif anim.startswith("slide"):
                g = ease_out(prog(t, t0, 0.45))
                dx = (1 - g) * self.px(500) * (-1 if anim.endswith("l") else 1); a *= g
        self.paste(img, x + dx, y, sc, rot, a)

    def sprite(self, poses, t, x, y, h, breathe=True, flip=False):
        """Figur mit Posenwechsel auf dem Wort. poses = [(t_ab, "figur_zeigt.png"), (t_ab, "figur_schock.png"), ...].
        Freigestellte PNGs (z. B. aus einem KI-Figurenblatt). Wechsel mit kurzem Stauchen, leichtes Atmen. y = Fußpunkt."""
        cur = [p for p in poses if t >= p[0]]
        if not cur:
            return
        t_sw, path = cur[-1]
        key = ("sprite", str(path), h, flip)
        img = self.v._cache.get(key)
        if img is None:
            img = Image.open(path).convert("RGBA")
            img = img.resize((int(img.width * self.px(h) / img.height), int(self.px(h))), Image.LANCZOS)
            if flip:
                img = img.transpose(Image.FLIP_LEFT_RIGHT)
            self.v._cache[key] = img
        dt = t - t_sw
        squash = 1 - 0.06 * math.sin(math.pi * clamp(dt / 0.18)) if dt < 0.18 else 1.0
        br = 1 + (0.006 * math.sin(t * 2 * math.pi / 3.2) if breathe else 0)
        sx, sy = 1 / squash ** 0.5, squash * br
        im = img.resize((max(1, int(img.width * sx)), max(1, int(img.height * sy))), Image.BICUBIC)
        self.im.alpha_composite(im, (int(x - im.width / 2), int(y - im.height)))

    def scene_card(self, path, t, t0=0.0, w=None, frame=True, zoom=0.03, dur=4.0):
        """Ganzes Szenenbild als Karte mit Rahmen und langsamem Push-in (für Shorts / Rückgriffe)."""
        w = w or self.W * 0.9
        key = ("scard", str(path), int(w), frame)
        img = self.v._cache.get(key)
        if img is None:
            src = Image.open(path).convert("RGBA")
            src = src.resize((int(w), int(w * src.height / src.width)), Image.LANCZOS)
            if frame:
                b = self.px(10)
                fr = Image.new("RGBA", (src.width + 2 * b, src.height + 2 * b), self.s.col("ink"))
                fr.alpha_composite(src, (b, b)); src = fr
            img = src
            self.v._cache[key] = img
        g = prog(t, t0, dur)
        self.paste(img, self.W / 2, self.H / 2, (1 + zoom * g) * min(1, pop(t, t0, 0.3) + 0.0001), 0, fade(t, t0, 0.2))

    # ---------------- Untertitel
    def captions(self, words, t, y=None, size=70, max_words=4, hot=(), hot_color="accent", box=False):
        """Wort-für-Wort-Untertitel. words = [{'word','start','end'}, ...] (z. B. aus whisper_words.py)."""
        if not words:
            return
        groups = self.v._caption_groups(words, max_words)
        y = y or self.H * 0.8
        for g in groups:
            if g[0]["start"] - 0.05 <= t < g[-1]["end"] + 0.15:
                sz = size
                while True:
                    f = self.s.font("caption", self.px(sz))
                    sp = f.getlength(" ")
                    widths = [f.getlength(w["word"]) for w in g]
                    total = sum(widths) + sp * (len(g) - 1)
                    if total <= self.W - 2 * self.px(70) or sz <= 30:
                        break
                    sz -= 4
                x = self.W / 2 - total / 2
                if box:
                    pad = self.px(18)
                    self.d.rounded_rectangle((x - pad, y - self.px(size) * 0.7, x + total + pad, y + self.px(size) * 0.7),
                                             self.px(16), fill=self.s.col("ink", 170))
                for w, wd in zip(g, widths):
                    active = w["start"] - 0.03 <= t
                    clean = w["word"].strip(".,!?;:").lower()
                    col = hot_color if clean in hot else ("bg" if box else "ink")
                    alpha = 255 if active else 90
                    self.d.text((x, y), w["word"], font=f, anchor="lm", fill=self.s.col(col, alpha),
                                stroke_width=self.px(5) if not box else 0, stroke_fill=self.s.col("bg" if not box else "ink", alpha))
                    x += wd + sp
                break

# --------------------------------------------------------------------------- Audio
SR = 48000

def _tone(f, dur, decay, partials=((1, 1.0), (2, 0.3), (3, 0.12)), att=0.004):
    t = np.arange(int(dur * SR)) / SR
    s = sum(a * np.sin(2 * np.pi * f * m * t) for m, a in partials)
    env = np.minimum(t / att, 1) * np.exp(-t / decay)
    return (s * env).astype(np.float32)

PENTA = [261.6, 293.7, 329.6, 392.0, 440.0, 523.3, 587.3, 659.3, 784.0]

def synth(name, note=4, dur=None):
    """Weiche, musikalische Effekte (prozedural, lizenzfrei)."""
    f = PENTA[int(note) % len(PENTA)]
    if name == "marimba":
        return _tone(f, 0.35, 0.07, ((1, 1), (4, 0.25), (10, 0.05)))
    if name == "bell":
        return _tone(f, 1.2, 0.35, ((1, 1), (2.4, 0.4), (5.95, 0.15)))
    if name == "pluck":
        return _tone(f, 0.25, 0.05, ((1, 1), (2, 0.5), (3, 0.2)))
    if name == "thump":
        return _tone(55, 0.6, 0.18, ((1, 1), (2, 0.35)), att=0.006)
    if name == "chord":
        return sum(_tone(PENTA[(int(note) + k) % 9], 1.4, 0.5, ((1, 1), (2, 0.2))) for k in (0, 2, 4)) / 3
    if name in ("swish", "whoosh"):
        n = int((dur or 0.4) * SR)
        x = np.random.default_rng(2).normal(0, 1, n).astype(np.float32)
        x = np.convolve(x, np.ones(40) / 40, mode="same")
        return x * np.sin(np.linspace(0, np.pi, n)) ** 2 * 0.6
    if name == "tick":
        return _tone(1800, 0.05, 0.01, ((1, 1),), att=0.001) * 0.5
    if name == "riser":
        n = int((dur or 1.2) * SR); t = np.arange(n) / SR
        fr = 200 + 1400 * (t / t[-1]) ** 2
        x = np.sin(2 * np.pi * np.cumsum(fr) / SR) * 0.25 + np.random.default_rng(3).normal(0, 0.08, n)
        return (x * (t / t[-1]) ** 1.5).astype(np.float32)
    if name == "boom":
        return _tone(45, 1.2, 0.35, ((1, 1), (1.5, 0.4), (2, 0.2)), att=0.002)
    raise ValueError(f"Unbekannter Sound: {name}")

def read_audio(path):
    """Beliebige Audiodatei → mono float32 @ 48 kHz (über ffmpeg)."""
    raw = subprocess.run([ffmpeg_bin(), "-v", "error", "-i", str(path), "-f", "f32le", "-ac", "1", "-ar", str(SR), "-"],
                         capture_output=True, check=True).stdout
    return np.frombuffer(raw, np.float32).copy()

def write_wav(path, x):
    x = np.clip(x, -1, 1)
    with wave.open(str(path), "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((x * 32767).astype(np.int16).tobytes())

# --------------------------------------------------------------------------- Werkzeuge
def ffmpeg_bin():
    p = shutil.which("ffmpeg")
    if not p:
        sys.exit("ffmpeg nicht gefunden. Installieren: Windows `winget install Gyan.FFmpeg`, Mac `brew install ffmpeg`.")
    return p

def load_words(path):
    """Wortzeiten laden: [{'word','start','end'}, ...] (Format von tools/whisper_words.py)."""
    data = json.loads(Path(path).read_text(encoding="utf-8"))
    return data["words"] if isinstance(data, dict) else data

def word_time(words, word, n=1, after=0.0, default=None):
    """Startzeit des n-ten Vorkommens von `word` ab Sekunde `after` (Grafik landet auf dem Wort)."""
    k = 0
    target = word.lower().strip(".,!?")
    for w in words:
        if w["start"] >= after and w["word"].lower().strip(".,!?;:\"'") == target:
            k += 1
            if k == n:
                return w["start"]
    if default is not None:
        return default
    raise KeyError(f"Wort nicht gefunden: {word!r} (#{n} ab {after}s) – Zahlen stehen oft als Ziffern in den Wortzeiten")

# --------------------------------------------------------------------------- Video
class Video:
    """Szenen + Ton → MP4. Szenen sind (start, ende, draw(c, t_lokal, t_global))."""

    def __init__(self, style: Style, size=(1920, 1080), fps=30, thousands=","):
        """thousands="." → deutsches Zahlenformat (1.000,50), "," → englisch (1,000.50)."""
        self.style, self.size, self.fps = style, tuple(size), fps
        self.thousands = thousands
        self.scenes, self.cues, self.kicks = [], [], []
        self.voice_path, self.music_path, self.music_gain = None, None, None
        self._cache = {}
        self._cg = None

    # Aufbau
    def scene(self, start, end, draw, push=None, fade_in=None):
        self.scenes.append({"start": start, "end": end, "draw": draw,
                            "push": self.style.d["motion"]["push"] if push is None else push,
                            "fade": self.style.d["motion"]["crossfade"] if fade_in is None else fade_in})
        return draw

    def sfx(self, name_or_path, at, gain=None, note=4, lead=0.06, dur=None):
        """Effekt setzen. Weiche Sounds 50–70 ms VOR dem Bild-Ereignis (lead)."""
        self.cues.append((max(0.0, at - lead), name_or_path, gain, note, dur))

    def kick(self, at, strength=14):
        """Kurzer Kamera-Stoß auf einem Schlag-Wort (sparsam!)."""
        self.kicks.append((at, strength))

    def voice(self, path):
        self.voice_path = path

    def music(self, path, gain=None):
        self.music_path, self.music_gain = path, gain

    @property
    def duration(self):
        return max(s["end"] for s in self.scenes)

    def _caption_groups(self, words, max_words):
        if self._cg is None or self._cg[0] is not words:
            groups, cur = [], []
            for w in words:
                cur.append(w)
                if len(cur) >= max_words or w["word"].rstrip().endswith((".", "!", "?", ",")):
                    groups.append(cur); cur = []
            if cur:
                groups.append(cur)
            self._cg = (words, groups)
        return self._cg[1]

    # Bild
    def frame(self, t):
        sc = [s for s in self.scenes if s["start"] <= t < s["end"]] or [self.scenes[-1]]
        s = sc[-1]
        img = self._draw(s, t)
        if s["fade"] > 0 and t - s["start"] < s["fade"]:
            prev = [p for p in self.scenes if p["end"] >= s["start"] - 1e-6 and p is not s and p["start"] < s["start"]]
            if prev:
                a = (t - s["start"]) / s["fade"]
                img = Image.blend(self._draw(prev[-1], min(t, prev[-1]["end"] - 1e-3)), img, ease_in_out(a))
        return img

    def _draw(self, s, t):
        c = Canvas(self)
        s["draw"](c, t - s["start"]) if s["draw"].__code__.co_argcount == 2 else s["draw"](c, t - s["start"], t)
        im = c.im
        z = 1 + s["push"] * (t - s["start"]) * self.fps / 10
        dx = dy = 0
        for t0, g in self.kicks:
            if 0 <= t - t0 < 7 / self.fps:
                k = int((t - t0) * self.fps)
                amp = g * self.style.d["motion"]["kick"] * (1 - k / 7) * (1 if k % 2 == 0 else -1)
                dx += amp; dy -= amp * 0.5
        if z != 1 or dx or dy:
            W, H = self.size
            cw, ch = W / z, H / z
            x0, y0 = (W - cw) / 2 - dx, (H - ch) / 2 - dy
            im = im.transform(self.size, Image.EXTENT, (x0, y0, x0 + cw, y0 + ch), Image.BICUBIC)
        return im.convert("RGB")

    def still(self, t, path):
        Path(path).parent.mkdir(parents=True, exist_ok=True)
        self.frame(t).save(path)

    def contact_sheet(self, path, times=None, cols=4, width=480):
        """Kontaktbogen zum Prüfen (Anfang/Mitte/Ende jeder Szene), BEVOR voll gerendert wird."""
        if times is None:
            times = []
            for s in self.scenes:
                d = s["end"] - s["start"]
                times += [s["start"] + min(0.5, d * 0.2), (s["start"] + s["end"]) / 2, s["end"] - 0.05]
        h = int(width * self.size[1] / self.size[0])
        rows = math.ceil(len(times) / cols)
        sheet = Image.new("RGB", (cols * width, rows * (h + 28)), (30, 30, 30))
        d = ImageDraw.Draw(sheet)
        for i, t in enumerate(times):
            im = self.frame(t).resize((width, h))
            x, y = (i % cols) * width, (i // cols) * (h + 28)
            sheet.paste(im, (x, y + 28))
            d.text((x + 6, y + 6), f"{t:.2f}s", fill=(255, 255, 255))
        Path(path).parent.mkdir(parents=True, exist_ok=True)
        sheet.save(path)
        return path

    # Ton
    def mix_audio(self, dur):
        n = int(dur * SR) + SR
        mix = np.zeros(n, np.float32)
        snd = self.style.d["sound"]
        if self.voice_path:
            v = read_audio(self.voice_path)[:n]
            mix[: len(v)] += v
        for at, name, gain, note, d in self.cues:
            p = Path(str(name))
            x = read_audio(p) if p.suffix else synth(name, note, d)
            g = snd["sfx_gain"] if gain is None else gain
            i0 = int(at * SR)
            x = x[: max(0, n - i0)]
            mix[i0:i0 + len(x)] += x * g
        if self.music_path:
            m = read_audio(self.music_path)
            if len(m) < n:
                m = np.tile(m, n // len(m) + 1)
            m = m[:n] * (snd["music_gain"] if self.music_gain is None else self.music_gain)
            fo = int(1.5 * SR); m[-fo:] *= np.linspace(1, 0, fo)
            mix += m
        return mix[: int(dur * SR)]

    # Ausgabe
    def render(self, out, start=0.0, end=None, preview=False, loudness=-14):
        """Rendert MP4. preview=True → halbe Auflösung, schneller. loudness: −14 LUFS (Shorts), −16 (lange Videos)."""
        out = Path(out); out.parent.mkdir(parents=True, exist_ok=True)
        end = end or self.duration
        W, H = self.size
        ow, oh = (W // 2 // 2 * 2, H // 2 // 2 * 2) if preview else (W, H)
        tmp_v = out.with_suffix(".video.mp4"); tmp_a = out.with_suffix(".audio.wav")
        cmd = [ffmpeg_bin(), "-y", "-v", "error", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{ow}x{oh}",
               "-r", str(self.fps), "-i", "-", "-c:v", "libx264", "-preset", "veryfast" if preview else "medium",
               "-crf", "23" if preview else "18", "-pix_fmt", "yuv420p", str(tmp_v)]
        proc = subprocess.Popen(cmd, stdin=subprocess.PIPE)
        nfr = int(round((end - start) * self.fps))
        for i in range(nfr):
            im = self.frame(start + i / self.fps)
            if preview:
                im = im.resize((ow, oh), Image.BILINEAR)
            proc.stdin.write(im.tobytes())
            if i % (self.fps * 2) == 0:
                print(f"\r  Bild {i}/{nfr}", end="", flush=True)
        proc.stdin.close(); proc.wait()
        print(f"\r  Bild {nfr}/{nfr} fertig")
        has_audio = self.voice_path or self.cues or self.music_path
        if has_audio:
            write_wav(tmp_a, self.mix_audio(self.duration)[int(start * SR): int(end * SR)])
            subprocess.run([ffmpeg_bin(), "-y", "-v", "error", "-i", str(tmp_v), "-i", str(tmp_a),
                            "-map", "0:v:0", "-map", "1:a:0", "-c:v", "copy", "-c:a", "aac", "-b:a", "192k",
                            "-af", f"alimiter=limit=0.89,loudnorm=I={loudness}:TP=-1.5:LRA=11", "-ar", "48000",
                            "-shortest", "-movflags", "+faststart", str(out)], check=True)
            tmp_a.unlink(missing_ok=True); tmp_v.unlink(missing_ok=True)
        else:
            tmp_v.replace(out)
        print(f"  -> {out}")
        return out

def _ramp(u, cols):
    """Farbverlauf über mehrere Stopps, u in 0..1 (Array)."""
    n = len(cols) - 1
    if n == 0:
        return np.zeros(u.shape + (3,), np.float32) + np.array(cols[0][:3], np.float32)
    idx = np.clip((u * n).astype(int), 0, n - 1)
    frac = (u * n - idx)[..., None]
    a = np.array([c[:3] for c in cols], np.float32)
    return a[idx] * (1 - frac) + a[idx + 1] * frac
