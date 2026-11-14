#!/usr/bin/env bash
# Serves the site locally (YouTube embeds need a real web address, not file://).
# Uses port 8765, or the next free one if that's taken.
cd "$(dirname "$0")"
PORT="${PORT:-8765}"
while ! python3 -c "import socket,sys; s=socket.socket(); s.bind(('127.0.0.1', int(sys.argv[1])))" "$PORT" 2>/dev/null; do
  PORT=$((PORT + 1))
done
URL="http://localhost:$PORT"
echo "Workouts running at $URL  (Ctrl+C to stop)"
( sleep 1; xdg-open "$URL" >/dev/null 2>&1 || open "$URL" >/dev/null 2>&1 ) &
exec python3 -m http.server "$PORT" --bind 127.0.0.1
