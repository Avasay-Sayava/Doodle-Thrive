#!/bin/bash

set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
ORANGE='\033[0;33m'
CYAN='\033[0;36m'
NC='\033[0m'

BASE_NAME="base-server"
BASE_PORT=3000
BASE_THREADS=10

API_NAME="api-server"
API_PORT=3300
API_TIMEOUT=100
API_JWT="abcd"

WEB_NAME="website"
WEB_PORT=8080
WEB_API_PORT=${API_PORT}

if [ -n "$(docker ps -aq)" ]; then
    docker rm -f $(docker ps -aq) >/dev/null 2>&1
fi

echo -e "${CYAN}Starting base server with defaults...${NC}"
build=true name="$BASE_NAME" port="$BASE_PORT" threads="$BASE_THREADS" ./base-server.bash

echo -e "${CYAN}Starting API server with defaults...${NC}"
build=true \
  name="$API_NAME" \
  port="$API_PORT" \
  timeout="$API_TIMEOUT" \
  jwt_secret="$API_JWT" \
  server_name="$BASE_NAME" \
  server_port="$BASE_PORT" \
  ./api-server.bash

echo -e "${CYAN}Starting website with defaults...${NC}"
name="$WEB_NAME" \
  api_port="$WEB_API_PORT" \
  port="$WEB_PORT" \
  build_arg="--build" \
  ./website.bash

echo -e "${GREEN}All services started with default configuration.${NC}"
