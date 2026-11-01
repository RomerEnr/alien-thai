#!/usr/bin/env bash
# Codifica un máster de vídeo para la web: H.264, sin audio, faststart y GOP
# corto (keyframes frecuentes, para que el scrub con scroll busque rápido).
#
# Uso: tools/encode-video.sh <preset> <entrada> [salida]
#   story-landscape  720×960, crf 23, g 8  → public/media/video/story-landscape.mp4
#   story-portrait   540×960, crf 26, g 4  → public/media/video/story-portrait.mp4
#   plan             480×640, crf 27, g 6  → public/media/video/plan-<nombre>.mp4
#   gallery          540×676, crf 27, g 48 → public/media/video/gallery-<nombre>.mp4
set -euo pipefail

readonly OUTPUT_DIR="public/media/video"

usage() {
  sed -n '2,10p' "$0" | sed 's/^# \{0,1\}//' >&2
  exit 1
}

# Imprime "ancho alto crf gop" para un preset.
preset_settings() {
  case "$1" in
    story-landscape) echo "720 960 23 8" ;;
    story-portrait)  echo "540 960 26 4" ;;
    plan)            echo "480 640 27 6" ;;
    gallery)         echo "540 676 27 48" ;;
    *) echo "Preset desconocido: $1" >&2; usage ;;
  esac
}

default_output() {
  local preset="$1" input="$2"
  case "$preset" in
    plan | gallery) echo "$OUTPUT_DIR/$preset-$(basename "${input%.*}").mp4" ;;
    *)    echo "$OUTPUT_DIR/$preset.mp4" ;;
  esac
}

encode() {
  local input="$1" output="$2" width="$3" height="$4" crf="$5" gop="$6"
  ffmpeg -hide_banner -loglevel error -y -i "$input" \
    -an \
    -vf "scale=${width}:${height}:force_original_aspect_ratio=increase,crop=${width}:${height},fps=24" \
    -c:v libx264 -preset slow -profile:v high -pix_fmt yuv420p \
    -crf "$crf" -g "$gop" -keyint_min "$gop" -sc_threshold 0 \
    -movflags +faststart \
    "$output"
}

main() {
  [[ $# -ge 2 ]] || usage
  command -v ffmpeg >/dev/null || { echo "Falta ffmpeg (brew install ffmpeg)" >&2; exit 1; }

  local preset="$1" input="$2"
  local output="${3:-$(default_output "$preset" "$input")}"
  read -r width height crf gop <<<"$(preset_settings "$preset")"

  mkdir -p "$(dirname "$output")"
  encode "$input" "$output" "$width" "$height" "$crf" "$gop"
  echo "✓ $output ($(du -h "$output" | cut -f1))"
}

main "$@"
