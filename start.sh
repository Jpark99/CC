#!/usr/bin/env bash
set -e
cd "$(dirname "$0")"

if [ ! -d node_modules ]; then
  echo "Installing dependencies for the first time - this only happens once..."
  npm install
fi

echo "Starting Fight Universe..."
( sleep 2 && (open http://localhost:5173 2>/dev/null || xdg-open http://localhost:5173 2>/dev/null || true) ) &
npm run dev
