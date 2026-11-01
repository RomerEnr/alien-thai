#!/usr/bin/env bash
# Publica la web en GitHub Pages: compila y sube dist/ a la rama gh-pages.
# Pages sirve esa rama tal cual, así que no hace falta ningún workflow.
#
# Uso: tools/deploy-pages.sh
set -euo pipefail

readonly BRANCH="gh-pages"
readonly REMOTE="origin"

main() {
  [[ -z "$(git status --porcelain)" ]] || { echo "Hay cambios sin commit: haz commit antes de publicar." >&2; exit 1; }

  npm run build
  # Sin esto, Jekyll descartaría la carpeta _astro (empieza por guion bajo).
  touch dist/.nojekyll

  local commit
  commit="$(git rev-parse --short HEAD)"
  local tmp
  tmp="$(mktemp -d)"
  trap "rm -rf '$tmp'" EXIT

  cp -R dist/. "$tmp"
  git -C "$tmp" init --quiet --initial-branch="$BRANCH"
  git -C "$tmp" add --all
  git -C "$tmp" commit --quiet -m "Publica $commit"
  git -C "$tmp" push --quiet --force "$(git remote get-url "$REMOTE")" "$BRANCH"

  echo "✓ Publicado $commit en $BRANCH"
}

main "$@"
