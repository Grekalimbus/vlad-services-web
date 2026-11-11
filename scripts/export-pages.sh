#!/bin/sh
set -eu
root=$(CDPATH= cd -- "$(dirname "$0")/.." && pwd)
api="$root/src/app/api"
hidden="$root/src/app/_api_dev"
cms_dir="$root/.cms"
cms_file="$cms_dir/content.json"
restore() {
  if [ -d "$hidden" ] && [ ! -d "$api" ]; then
    mv "$hidden" "$api"
  fi
}
trap restore EXIT
if [ -d "$api" ]; then
  mv "$api" "$hidden"
fi
cd "$root"
mkdir -p "$cms_dir"
if curl -fsSL -A "PrimeFixExport/1.0" "https://primefixpros.com/api/content" -o "$cms_file.tmp"; then
  mv "$cms_file.tmp" "$cms_file"
else
  rm -f "$cms_file.tmp"
  echo "warning: could not refresh .cms/content.json from production; using local copy if present" >&2
fi
STATIC_EXPORT=true npx next build
restore
trap - EXIT
