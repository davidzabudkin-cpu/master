#!/usr/bin/env python3
"""Mastering: +3 dB → Limiter (−1,9 dBFS) → zweistufiges loudnorm linear auf −16 LUFS / −1,5 dBTP.
Aufruf: python tools/master.py cache/audio/mix-v2.wav cache/audio/master-v2.wav"""
import json, re, subprocess, sys, pathlib
src, dst = map(pathlib.Path, sys.argv[1:3])
lim = dst.with_name(dst.stem + '-lim.wav')
run = lambda a: subprocess.run(['ffmpeg', '-hide_banner', '-v', 'info'] + a, capture_output=True, text=True, check=True)
run(['-y', '-i', str(src), '-af', 'volume=3dB,alimiter=limit=0.80:attack=2:release=60:level=disabled', '-ar', '48000', str(lim)])
m = json.loads(re.search(r'\{[^{}]*"input_i"[^{}]*\}', run(['-i', str(lim), '-af', 'loudnorm=I=-16:TP=-1.5:LRA=11:print_format=json', '-f', 'null', '-']).stderr).group(0))
af = f"loudnorm=I=-16:TP=-1.5:LRA=11:measured_I={m['input_i']}:measured_TP={m['input_tp']}:measured_LRA={m['input_lra']}:measured_thresh={m['input_thresh']}:offset={m['target_offset']}:linear=true"
run(['-y', '-i', str(lim), '-af', af, '-ar', '48000', str(dst)])
lim.unlink()
r = run(['-i', str(dst), '-af', 'ebur128=peak=true', '-f', 'null', '-']).stderr
I = re.findall(r'I:\s+(-?[\d.]+) LUFS', r)[-1]; P = re.findall(r'Peak:\s+(-?[\d.]+) dBFS', r)[-1]
print(f'{dst}: {I} LUFS integriert, True Peak {P} dBFS')
