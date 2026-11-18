#!/usr/bin/env bash
# Kontaktbogen aus dem Code: bash tools/sheet.sh <name> <von> <bis> <fps> [scale] [spalten] [breite]
set -e; N=$1; rm -rf cache/$N; node src/render.js --from $2 --to $3 --fps $4 --scale ${5:-.4} --out cache/$N --jpg
python tools/sheet.py cache/$N $2 $4 ${6:-5} cache/$N.jpg ${7:-480}
