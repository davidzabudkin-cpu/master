#!/usr/bin/env python3
"""Phosphor-Icons (MIT) für Remira holen – Original-SVGs, Version fest 2.1.1.

  python phosphor.py search lager versand          → passende Namen (Name + Tags)
  python phosphor.py get truck warehouse --out assets/icons [--weight bold]   (Standard: bold, Davids Wunsch 12.11.)
  python phosphor.py js truck warehouse --out src/phosphor-icons.js   → ES-Modul für Canvas (Path2D)

Quelle: https://unpkg.com/@phosphor-icons/core@2.1.1/ (gleiches Paket wie npm @phosphor-icons/core).
Cache: ~/.cache/phosphor-core-2.1.1 . Nur Standardbibliothek."""
import argparse, json, pathlib, re, sys, urllib.request

VER = '2.1.1'
BASE = f'https://unpkg.com/@phosphor-icons/core@{VER}'
CACHE = pathlib.Path.home() / '.cache' / f'phosphor-core-{VER}'
LICENSE_NOTE = 'Phosphor Icons (https://phosphoricons.com), MIT License, Copyright (c) 2023 Phosphor Icons'


def fetch(rel):
    f = CACHE / rel
    if not f.exists():
        f.parent.mkdir(parents=True, exist_ok=True)
        req = urllib.request.Request(f'{BASE}/{rel}', headers={'User-Agent': 'phosphor-fetch'})
        with urllib.request.urlopen(req, timeout=30) as r:
            if r.status != 200: raise SystemExit(f'Nicht gefunden: {rel}')
            f.write_bytes(r.read())
    return f.read_text(encoding='utf-8')


def svg(name, weight):
    suffix = '' if weight == 'regular' else f'-{weight}'
    try: return fetch(f'assets/{weight}/{name}{suffix}.svg')
    except Exception as e: raise SystemExit(f'Icon "{name}" ({weight}) nicht gefunden – erst mit "search" den Namen prüfen. ({e})')


def catalog():
    src = fetch('dist/index.mjs')
    out = []
    for m in re.finditer(r'name:\s*"([^"]+)",\s*pascal_name:[^\n]*\n(?:.*\n){0,3}?\s*tags:\s*\[([^\]]*)\]', src):
        out.append((m.group(1), re.findall(r'"([^"]+)"', m.group(2))))
    return out


def main():
    ap = argparse.ArgumentParser(); ap.add_argument('cmd', choices=['search', 'get', 'js']); ap.add_argument('names', nargs='+')
    ap.add_argument('--weight', default='bold', choices=['thin', 'light', 'regular', 'bold', 'fill', 'duotone']); ap.add_argument('--out')
    a = ap.parse_args()
    if a.cmd == 'search':
        terms = [t.lower() for t in a.names]
        for n, tags in catalog():
            hay = ' '.join([n] + tags).lower()
            if all(t in hay for t in terms): print(f'{n:32} {", ".join(tags[:8])}')
        return
    if a.cmd == 'get':
        d = pathlib.Path(a.out or '.'); d.mkdir(parents=True, exist_ok=True)
        for n in a.names: (d / f'{n}.svg').write_text(svg(n, a.weight), encoding='utf-8'); print('geschrieben', d / f'{n}.svg')
        (d / 'PHOSPHOR-LICENSE.txt').write_text(fetch('LICENSE'), encoding='utf-8'); return
    icons = {n: re.findall(r'\bd="([^"]+)"', svg(n, a.weight)) for n in a.names}
    js = f'// {LICENSE_NOTE}\n// Gewicht: {a.weight}, Version {VER}, viewBox 0 0 256 256, Flächen (fill), nicht Striche.\n'
    js += 'export const PHOSPHOR = ' + json.dumps(icons, indent=1) + ';\n'
    js += 'export const phosphorPath = name => { const p = new Path2D(); for (const d of PHOSPHOR[name]) p.addPath(new Path2D(d)); return p; };\n'
    pathlib.Path(a.out or 'phosphor-icons.js').write_text(js, encoding='utf-8'); print('geschrieben', a.out or 'phosphor-icons.js', f'({len(icons)} Icons)')


if __name__ == '__main__': main()
