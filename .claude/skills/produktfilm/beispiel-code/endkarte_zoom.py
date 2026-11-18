"""ZIGZAB-Endkarte für einen fertigen Durchgang (0 Credits): ab z0 zoomt das Bild weich auf dem flachen Kobalt-Hintergrund zurück,
ab t0 blendet ZIGZAB unten ein (Archivo 900/118, Creme). Der Originalton bleibt und wird auf -14 LUFS / -1,5 dBTP gebracht.
Aufruf (im Ordner film-v2): python tools/endkarte_zoom.py <eingang.mp4> <ausgang.mp4> <z0> [t0=z0+0.45] [endgroesse=0.64]"""
import sys, subprocess, json, pathlib
import numpy as np
from PIL import Image, ImageDraw, ImageFont

SRC, OUT, Z0 = sys.argv[1], sys.argv[2], float(sys.argv[3])
T0 = float(sys.argv[4]) if len(sys.argv) > 4 else Z0 + .45
S1 = float(sys.argv[5]) if len(sys.argv) > 5 else .64
ZD, TD = .6, .45
info = json.loads(subprocess.run(['ffprobe', '-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height,r_frame_rate',
                                  '-of', 'json', SRC], capture_output=True, text=True, check=True).stdout)['streams'][0]
W, H = info['width'], info['height']; n, d = map(int, info['r_frame_rate'].split('/')); FPS = n / d
font = ImageFont.truetype(str(pathlib.Path(__file__).resolve().parent.parent / 'v3' / 'archivo-wdth.ttf'), round(H * .11))
font.set_variation_by_axes([900, 118])
txt = Image.new('RGBA', (W, H), (0, 0, 0, 0)); dr = ImageDraw.Draw(txt); bb = dr.textbbox((0, 0), 'ZIGZAB', font=font)
dr.text(((W - (bb[2] - bb[0])) // 2 - bb[0], round(H * .845 - (bb[3] - bb[1]) / 2) - bb[1]), 'ZIGZAB', font=font, fill=(244, 237, 224, 255))
ease_io = lambda x: 4 * x ** 3 if x < .5 else 1 - (-2 * x + 2) ** 3 / 2
ease_out = lambda x: 1 - (1 - x) ** 3


def feather(w, h, r=22):
    x = np.minimum(np.arange(w), np.arange(w)[::-1]); y = np.minimum(np.arange(h), np.arange(h)[::-1])
    return (np.clip(np.minimum.outer(y, x) / r, 0, 1) * 255).astype(np.uint8)


src = subprocess.Popen(['ffmpeg', '-v', 'error', '-i', SRC, '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], stdout=subprocess.PIPE)
enc = subprocess.Popen(['ffmpeg', '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{H}', '-r', str(FPS), '-i', '-',
                        '-c:v', 'libx264', '-crf', '16', '-preset', 'slow', '-pix_fmt', 'yuv420p', OUT + '.video.mp4'], stdin=subprocess.PIPE)
i = 0; shift = None
while True:
    raw = src.stdout.read(W * H * 3)
    if len(raw) < W * H * 3:
        break
    fr = np.frombuffer(raw, np.uint8).reshape(H, W, 3); t = i / FPS; img = Image.fromarray(fr)
    if t >= Z0:
        k = ease_io(min(1, (t - Z0) / ZD)); s = 1 - (1 - S1) * k
        band = np.concatenate([fr[:12].reshape(-1, 3), fr[:, :12].reshape(-1, 3), fr[:, -12:].reshape(-1, 3)])
        bg = tuple(int(v) for v in np.median(band, axis=0))
        if shift is None:
            m = np.abs(fr.astype(int) - np.array(bg)).sum(axis=2) > 90
            cols = np.where(m.mean(axis=0) > .02)[0]; shift = (W / 2 - (cols.min() + cols.max()) / 2) if len(cols) else 0
        sw, sh = round(W * s), round(H * s); canvas = Image.new('RGB', (W, H), bg)
        canvas.paste(img.resize((sw, sh), Image.LANCZOS), (round(W / 2 + shift * s * k - sw / 2), round(H / 2 - H * .115 * k - sh / 2)),
                     Image.fromarray(feather(sw, sh)))
        img = canvas
    if t >= T0:
        a = min(1, (t - T0) / TD); lay = Image.new('RGBA', (W, H), (0, 0, 0, 0)); lay.paste(txt, (0, round(14 * (1 - ease_out(a)))))
        lay.putalpha(Image.fromarray((np.asarray(lay)[..., 3] * ease_out(a)).astype(np.uint8)))
        img = Image.alpha_composite(img.convert('RGBA'), lay).convert('RGB')
    enc.stdin.write(np.asarray(img, np.uint8).tobytes()); i += 1
enc.stdin.close(); enc.wait(); src.wait()
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', OUT + '.video.mp4', '-i', SRC, '-map', '0:v', '-map', '1:a',
                '-af', 'alimiter=limit=0.84:attack=3:release=80,loudnorm=I=-14:TP=-1.5:LRA=9', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k',
                '-ar', '48000', '-shortest', '-movflags', '+faststart', OUT], check=True)
pathlib.Path(OUT + '.video.mp4').unlink()
print('fertig:', OUT, f'({i} Frames, Zoom ab {Z0}s, Schrift ab {T0}s)')
