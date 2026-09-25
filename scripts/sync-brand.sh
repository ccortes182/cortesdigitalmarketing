#!/usr/bin/env bash
# Re-sync Refractive brand tokens into this site (one-way, read-only on Refractive).
# Usage: scripts/sync-brand.sh [path-to-Refractive-site]
set -euo pipefail
here="$(cd "$(dirname "$0")/.." && pwd)"
src="${1:-$here/../../Refractive-site}"
[ -d "$src/docs/css" ] || { echo "Refractive repo not found at $src" >&2; exit 1; }
rev="$(git -C "$src" rev-parse --short HEAD)"

copy() {
  { echo "/* Source: Refractive-site docs/$1 @ $rev — do not edit here; run scripts/sync-brand.sh */"
    cat "$src/docs/$1"; } > "$here/$2"
  echo "synced $1 -> $2"
}

copy css/variables.css css/brand/variables.css
copy css/base.css      css/brand/base.css
copy js/nav.js         js/nav.js
cp "$src/docs/images/REFRACTIVE.svg" "$here/images/refractive-prism.svg"
echo "synced images/REFRACTIVE.svg -> images/refractive-prism.svg"
