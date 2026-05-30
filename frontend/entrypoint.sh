#!/bin/sh
set -e

# Write runtime env vars into .env.local so Vite picks them up at startup.
# This runs INSIDE the container where Docker environment vars are available.
ENV_FILE="/app/.env.local"

echo "# Auto-generated at container startup from Docker environment" > "$ENV_FILE"

# API URL: use VITE_API_URL if set, otherwise fall back to localhost:8086
# (the host-mapped port of the backend container)
API_URL="${VITE_API_URL:-http://localhost:8086/api}"
echo "VITE_API_URL=${API_URL}" >> "$ENV_FILE"

# Pass through any other VITE_ vars from the environment
if [ -n "${VITE_USERWAY_KEY}" ]; then
  echo "VITE_USERWAY_KEY=${VITE_USERWAY_KEY}" >> "$ENV_FILE"
fi

echo "[entrypoint] Written ${ENV_FILE}:"
cat "$ENV_FILE"
echo ""

exec npm run dev -- --host 0.0.0.0 --port 5173
