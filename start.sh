#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
export PORT="${PORT:-8765}"
if command -v python3 >/dev/null 2>&1; then
  python3 serve.py
elif command -v python >/dev/null 2>&1; then
  python serve.py
else
  echo "Python is required."
  exit 1
fi
