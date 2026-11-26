#!/usr/bin/env python3
"""Mastering (WWS, 18.11.2026): Lautheit messen → linear auf −16 LUFS → Limiter, Spitze ≤ −1,5 dBFS.
Ersetzt das zweistufige loudnorm des OMS-Videos: loudnorm fiel je nach Material in den dynamischen Modus und hob das leise Intro um bis zu 10 dB an.
Aufruf: python tools/master.py cache/audio/mix.wav cache/audio/master.wav"""
import sys, subprocess, re
src, dst = sys.argv[1:3]
def lufs(path):
    e = subprocess.run(['ffmpeg', '-hide_banner', '-nostats', '-i', path, '-af', 'ebur128=peak=true', '-f', 'null', '-'], capture_output=True, text=True).stderr
    return float(re.findall(r'I:\s+(-?[\d.]+) LUFS', e)[-1]), float(re.findall(r'Peak:\s+(-?[\d.]+) dBFS', e)[-1])
i0, _ = lufs(src)
gain = -16.0 - i0
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', src, '-af', f'volume={gain:.2f}dB,alimiter=limit=0.84:attack=2:release=60:level=disabled', '-ar', '48000', '-c:a', 'pcm_s16le', dst], check=True)
i1, tp = lufs(dst)
print(f'{dst}: {i1:.1f} LUFS integriert, True Peak {tp:.1f} dBFS (Verstärkung {gain:+.1f} dB)')
