#!/bin/sh
set -e
URL="${1:-https://samdu.uz/uz}"
OUT="${2:-output/httrack}"
mkdir -p "$OUT"
httrack "$URL" \
  -O "$OUT" \
  "+*.samdu.uz/*" \
  "-*.zip" "-*.rar" "-*.mp4" \
  --depth=3 \
  --ext-depth=1 \
  --sockets=2 \
  --max-rate=250000 \
  --robots=2 \
  --user-agent="Mozilla/5.0 (SamDU redesign research bot)" \
  --verbose
