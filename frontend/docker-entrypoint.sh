#!/bin/sh
set -e

API_URL="${API_URL:-http://localhost:3001/api}"

cat > /usr/share/nginx/html/js/config.js <<EOF
const CONFIG = {
  API_URL: "${API_URL}",
};
EOF

exec "$@"
