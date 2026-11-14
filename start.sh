#!/usr/bin/env bash
# Serves the site at http://localhost:8765 (YouTube embeds need a real web address, not file://)
cd "$(dirname "$0")"
PORT="${PORT:-8765}"
( sleep 1; xdg-open "http://localhost:$PORT" >/dev/null 2>&1 || open "http://localhost:$PORT" >/dev/null 2>&1 ) &
exec python3 -m http.server "$PORT" --bind 127.0.0.1
