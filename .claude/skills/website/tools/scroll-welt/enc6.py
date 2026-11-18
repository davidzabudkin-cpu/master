# v6: Filme je Szene für scroll-gesteuertes Abspielen (Keyframe alle 12 Bilder, damit Zurückscrollen weich bleibt)
# Aufruf: python enc6.py r | g | intro
import subprocess, os, sys
from PIL import Image
OUT_V, OUT_I = '../../site/assets/video/v4', '../../site/assets/img/v4'
SETS = {
 'r': [('v-1.mp4', .5, .5), ('v-2b.mp4', .5, .655), ('v-3b.mp4', .655, .45), ('v-4.mp4', .45, .45), ('v-5.mp4', .45, .5)],
 'g': [('v-wt2.mp4', .61, .61), ('v-w2.mp4', .61, .665), ('v-wc.mp4', .665, .3), ('v-wd.mp4', .3, .3)],
}
X = ['-c:v', 'libx264', '-preset', 'slow', '-tune', 'film', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', '-an']
def mcrop(cx0, cx1, D=10, size='720:1280'):
    u = f'min(1,t/{D})'
    return f"crop=w='trunc(ih*9/32)*2':h=ih:x='max(0,min(iw-ow,({cx0}+({cx1}-{cx0})*{u}*{u}*(3-2*{u}))*iw-ow/2))':y=0,scale={size}:flags=lanczos"
def run(a): subprocess.run(['ffmpeg', '-v', 'error', '-y'] + a, check=True)
def frame(src, dst, last):
    run((['-sseof', '-0.06'] if last else []) + ['-i', src, '-frames:v', '1', '-update', '1', '_f.png'])
    Image.open('_f.png').convert('RGB').save(dst, 'WEBP', quality=88, method=6)
G = ['-g', '12', '-keyint_min', '12', '-sc_threshold', '0']
for key in sys.argv[1:]:
    if key == 'intro':  # Intro-Videos je Welt (gespult, daher Keyframe alle 6 Bilder)
        for name, src, cx in (('k-ar', 'v-kar.mp4', .61), ('k-aw', 'v-kaw.mp4', .61), ('k-br', 'v-kbr.mp4', .625), ('k-bw', 'v-kbw.mp4', .625)):
            if not os.path.exists(src): print('fehlt', src); continue
            run(['-i', src, '-vf', 'scale=1600:900:flags=lanczos', '-crf', '23', '-g', '6', '-keyint_min', '6'] + X + [f'{OUT_V}/{name}.mp4'])
            run(['-i', src, '-vf', mcrop(cx, .5, 8, '540:960'), '-crf', '23', '-g', '6', '-keyint_min', '6'] + X + [f'{OUT_V}/{name}-m.mp4'])
            print(name, os.path.getsize(f'{OUT_V}/{name}.mp4') // 1024, 'KB')
        continue
    for i, (src, a, b) in enumerate(SETS[key], 1):
        if not os.path.exists(src): print('fehlt', src); continue
        d, m = f'{OUT_V}/{key}{i}.mp4', f'{OUT_V}/{key}{i}-m.mp4'
        run(['-i', src, '-vf', 'scale=1920:1080:flags=lanczos', '-crf', '28'] + G + X + [d])
        run(['-i', src, '-vf', mcrop(a, b), '-crf', '28'] + G + X + [m])
        if i == 1: frame(d, f'{OUT_I}/{key}s0.webp', False); frame(m, f'{OUT_I}/{key}s0-m.webp', False)
        frame(d, f'{OUT_I}/{key}s{i}.webp', True); frame(m, f'{OUT_I}/{key}s{i}-m.webp', True)
        print(key, i, os.path.getsize(d) // 1024, 'KB', os.path.getsize(m) // 1024, 'KB')
