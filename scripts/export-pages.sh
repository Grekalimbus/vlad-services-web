#!/bin/sh
set -eu
root=$(CDPATH= cd -- "$(dirname "$0")/.." && pwd)
api="$root/src/app/api"
hidden="$root/src/app/_api_dev"
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
STATIC_EXPORT=true npx next build
restore
trap - EXIT
