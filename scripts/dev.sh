#!/usr/bin/env bash
# Starts the full local dev stack: Postgres (Podman), NestJS server (watch),
# Next.js client (watch), and an ngrok tunnel to the client so Clerk's
# webhook can reach it.
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

DB_CONTAINER="instafam"
DB_USER="postgres"
DB_PASSWORD="postgres"
DB_NAME="instafam"
DB_PORT="5432"
CLIENT_PORT="3000"
NGROK_API="http://127.0.0.1:4040/api/tunnels"

SERVER_PID=""
CLIENT_PID=""
NGROK_PID=""

cleanup() {
  echo
  echo "Shutting down dev processes..."
  for pid in "$NGROK_PID" "$CLIENT_PID" "$SERVER_PID"; do
    if [[ -n "$pid" ]] && kill -0 "$pid" 2>/dev/null; then
      kill "$pid" 2>/dev/null || true
      wait "$pid" 2>/dev/null || true
    fi
  done
  echo "Postgres container '$DB_CONTAINER' left running (stop it yourself with: podman stop $DB_CONTAINER)"
}
trap cleanup EXIT INT TERM

require_cmd() {
  if ! command -v "$1" >/dev/null 2>&1; then
    echo "Error: '$1' is required but not installed." >&2
    exit 1
  fi
}

require_cmd podman
require_cmd pnpm
require_cmd curl

if ! command -v ngrok >/dev/null 2>&1; then
  echo "Error: 'ngrok' is required but not installed (https://ngrok.com/download)." >&2
  echo "Make sure you've also run 'ngrok config add-authtoken <token>' once." >&2
  exit 1
fi

echo "==> Postgres"
if podman container exists "$DB_CONTAINER" 2>/dev/null; then
  status="$(podman inspect -f '{{.State.Status}}' "$DB_CONTAINER")"
  if [[ "$status" != "running" ]]; then
    echo "Starting existing container '$DB_CONTAINER'..."
    podman start "$DB_CONTAINER" >/dev/null
  else
    echo "Container '$DB_CONTAINER' already running."
  fi
else
  echo "Creating container '$DB_CONTAINER'..."
  podman run -d \
    --name "$DB_CONTAINER" \
    -e POSTGRES_USER="$DB_USER" \
    -e POSTGRES_PASSWORD="$DB_PASSWORD" \
    -e POSTGRES_DB="$DB_NAME" \
    -p "$DB_PORT:5432" \
    -v pgdata:/var/lib/postgresql/data \
    postgres:16 >/dev/null
fi

echo -n "Waiting for Postgres to accept connections..."
until podman exec "$DB_CONTAINER" pg_isready -U "$DB_USER" >/dev/null 2>&1; do
  echo -n "."
  sleep 1
done
echo " ready."

echo "==> NestJS server (watch mode)"
(cd "$ROOT_DIR/server" && pnpm start:dev) &
SERVER_PID=$!
echo "server pid=$SERVER_PID"

echo "==> Next.js client (watch mode)"
(cd "$ROOT_DIR/client" && pnpm dev) &
CLIENT_PID=$!
echo "client pid=$CLIENT_PID"

echo "==> ngrok tunnel -> localhost:$CLIENT_PORT"
ngrok http "$CLIENT_PORT" --log=stdout &
NGROK_PID=$!

echo -n "Waiting for ngrok tunnel..."
NGROK_URL=""
for _ in $(seq 1 30); do
  NGROK_URL="$(curl -s "$NGROK_API" 2>/dev/null | grep -o '"public_url":"https:[^"]*"' | head -n1 | cut -d'"' -f4 || true)"
  if [[ -n "$NGROK_URL" ]]; then
    break
  fi
  echo -n "."
  sleep 1
done
echo

if [[ -z "$NGROK_URL" ]]; then
  echo "Warning: could not read ngrok's public URL from $NGROK_API -- check its output above" >&2
else
  echo
  echo "================================================================"
  echo " ngrok URL:      $NGROK_URL"
  echo " Webhook URL:    $NGROK_URL/api/webhooks"
  echo
  echo " Set the webhook URL above in the Clerk Dashboard:"
  echo " https://dashboard.clerk.com -> Webhooks -> your endpoint"
  echo "================================================================"
  echo
fi

echo "All processes running. Press Ctrl+C to stop server, client, and ngrok."

wait "$SERVER_PID" "$CLIENT_PID" "$NGROK_PID"
