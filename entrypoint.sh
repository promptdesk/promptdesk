#!/bin/sh

# Determine if the user has specified the protocol (HTTP or HTTPS)
if [ -n "$USE_HTTPS" ]; then
  PROTOCOL="https"
else
  PROTOCOL="http"
fi

# Determine the hostname to use (localhost or IP address)
if [ -n "$HOST_IP" ]; then
  HOST="$HOST_IP"
else
  HOST="localhost"
fi

# Determine the hostname to use (localhost or IP address)
if [ -n "$PROMPT_SERVER_PORT" ]; then
  PORT="$PROMPT_SERVER_PORT"
else
  PORT="4000"
fi

# Set the PROMPT_SERVER_URL using the determined protocol, hostname, and port number
export PROMPT_SERVER_URL="${PROTOCOL}://${HOST}:${PORT}"

# call the following in bash RUN cd frontend && npm install && npm run build
cd frontend && npm run build
cd ..
cp -r ./frontend/dist ./backend/dist

echo "PROMPT_SERVER_URL=${PROMPT_SERVER_URL}"

# Execute the command provided as arguments (e.g., your application)
exec "$@"