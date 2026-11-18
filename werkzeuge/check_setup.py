"""Prüft, ob alles für das Creator-Kit installiert ist, und zeigt bei Fehlern den Befehl zum Beheben.

    python werkzeuge/check_setup.py
"""
import importlib
import shutil
import sys

ok = True


def row(name, good, fix=""):
    global ok
    optional = fix.startswith("(optional)")
    if not good and not optional:
        ok = False
    print(f"  {'OK   ' if good else 'FEHLT'}  {name}" + ("" if good else f"   ->  {fix}"))


print("Creator-Kit Setup-Check\n")
row(f"Python {sys.version.split()[0]} (>= 3.10)", sys.version_info >= (3, 10), "https://python.org installieren")
for mod, pipname in (("PIL", "pillow"), ("numpy", "numpy")):
    try:
        importlib.import_module(mod)
        row(pipname, True)
    except ImportError:
        row(pipname, False, f"pip install {pipname}")
row("ffmpeg", bool(shutil.which("ffmpeg")), "Windows: winget install Gyan.FFmpeg | Mac: brew install ffmpeg")
try:
    importlib.import_module("faster_whisper")
    row("faster-whisper (Wortzeiten)", True)
except ImportError:
    row("faster-whisper (Wortzeiten)", False, "(optional) pip install faster-whisper")
row("Node.js (Websites, Sirio-Boards, 3D-Shorts)", bool(shutil.which("node")), "(optional) https://nodejs.org")
row("git (Kit aktuell halten)", bool(shutil.which("git")), "(optional) https://git-scm.com")
row("Higgsfield CLI (KI-Bilder/Videos/Stimmen)", bool(shutil.which("hf") or shutil.which("higgsfield")),
    "(optional) siehe .claude/skills/higgsfield-praxis/SKILL.md")
print("\nAlles Noetige ist da." if ok else "\nBitte die FEHLT-Zeilen ohne (optional) beheben.")
