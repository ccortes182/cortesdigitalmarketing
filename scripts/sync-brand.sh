#!/usr/bin/env bash
# Re-sync shared brand tokens into this site (one-way, read-only on the brand repo).
# Usage: scripts/sync-brand.sh [path-to-brand-repo]
set -euo pipefail
here="$(cd "$(dirname "$0")/.." && pwd)"
src="${1:-$here/../../Refractive-site}"
[ -d "$src/docs/css" ] || { echo "Brand repo not found at $src" >&2; exit 1; }
rev="$(git -C "$src" rev-parse --short HEAD)"

copy() {
  { echo "/* Source: brand repo docs/$1 @ $rev — do not edit here; run scripts/sync-brand.sh */"
    sed 's/Design Tokens — Refractive/Design Tokens/' "$src/docs/$1"; } > "$here/$2"
  echo "synced $1 -> $2"
}

copy css/variables.css css/brand/variables.css
copy css/base.css      css/brand/base.css
copy js/nav.js         js/nav.js
cp "$src/docs/images/REFRACTIVE.svg" "$here/images/prism-mark.svg"
echo "synced images/REFRACTIVE.svg -> images/prism-mark.svg"
cp "$src/docs/images/REFRACTIVE-DIGITAL.svg" "$here/images/refractive-wordmark.svg"
echo "synced images/REFRACTIVE-DIGITAL.svg -> images/refractive-wordmark.svg"
