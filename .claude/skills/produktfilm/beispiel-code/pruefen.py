"""Prüft einen Render: Kontaktbogen (alle 0,5 s), Lautheit über die Zeit, 9:16-Fassung wie bei HIGGS.
Aufruf (im Ordner film-v2): python tools/pruefen.py renders/zigzab-film-v2-r1.mp4"""
import subprocess, sys, pathlib, json, re, tempfile
from PIL import Image, ImageDraw

src = pathlib.Path(sys.argv[1])
out = src.with_suffix('')
tmp = pathlib.Path(tempfile.mkdtemp(prefix='zz-'))

info = json.loads(subprocess.run(['ffprobe', '-v', 'error', '-show_streams', '-show_format', '-of', 'json', str(src)],
                                 capture_output=True, text=True, check=True).stdout)
dur = float(info['format']['duration'])
v = next(s for s in info['streams'] if s['codec_type'] == 'video')
print(f"Dauer {dur:.2f} s · {v['width']}x{v['height']} · {v.get('r_frame_rate')} fps · Ton: {any(s['codec_type'] == 'audio' for s in info['streams'])}")

# Kontaktbogen: alle 0,5 s ein Bild, 4 Spalten
ts = [round(i * 0.5, 2) for i in range(int(dur / 0.5) + 1) if i * 0.5 < dur - 0.05]
tiles = []
for t in ts:
    p = tmp / f'f{t:05.2f}.png'
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', str(t), '-i', str(src), '-frames:v', '1', '-vf', 'scale=480:-2', str(p)], check=True)
    im = Image.open(p).convert('RGB')
    ImageDraw.Draw(im).text((8, 6), f'{t:.1f}s', fill=(255, 255, 255))
    tiles.append(im)
cols = 4
w, h = tiles[0].size
rows = (len(tiles) + cols - 1) // cols
sheet = Image.new('RGB', (cols * w + (cols - 1) * 6, rows * h + (rows - 1) * 6), (255, 255, 255))
for i, im in enumerate(tiles):
    sheet.paste(im, ((i % cols) * (w + 6), (i // cols) * (h + 6)))
sheet.save(f'{out}-bogen.jpg', quality=84)
print('Bogen:', f'{out}-bogen.jpg', len(tiles), 'Bilder')

# Lautheit: integriert + kurzzeitig je 0,5 s (zeigt plötzliche Sprünge)
r = subprocess.run(['ffmpeg', '-v', 'info', '-i', str(src), '-af', 'ebur128=peak=true', '-f', 'null', '-'], capture_output=True, text=True)
st = [(float(m.group(1)), float(m.group(2))) for m in re.finditer(r't:\s*([\d.]+).*?S:\s*(-?[\d.]+)', r.stderr)]
I = re.search(r'I:\s*(-?[\d.]+) LUFS', r.stderr)
tp = re.search(r'True peak:\s*Peak:\s*(-?[\d.]+)', r.stderr, re.S)
print('Integriert:', I.group(1) if I else '?', 'LUFS · True Peak:', tp.group(1) if tp else '?', 'dBTP')
last = None
for t, s in st:
    if abs(t * 2 - round(t * 2)) < 0.05:
        jump = '' if last is None else f'  ({s - last:+.1f})'
        print(f'  {t:5.1f}s  S {s:6.1f} LUFS{jump}')
        last = s

# 9:16-Fassung: Bild scharf mittig, oben/unten unscharfe Kopie (wie HIGGS)
vert = f'{out}-9x16.mp4'
fc = ('[0:v]split=2[a][b];'
      '[a]scale=-2:1920,crop=1080:1920,boxblur=40:2,eq=brightness=-0.04[bg];'
      '[b]scale=1080:-2[fg];[bg][fg]overlay=(W-w)/2:(H-h)/2,format=yuv420p[v]')
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', str(src), '-filter_complex', fc, '-map', '[v]', '-map', '0:a?',
                '-c:v', 'libx264', '-crf', '18', '-preset', 'slow', '-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart', vert], check=True)
print('9:16:', vert)
