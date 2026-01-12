#!/bin/bash

# COLOR STYLE
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
ORANGE='\033[0;33m'
CYAN='\033[0;36m'
NC='\033[0m'

# ... [Previous setup logic for build, name, and port remains the same] ...

# NEW: API PORT SETUP
default_api_port=8080
if [ -z "${api_port}" ]; then
    echo -e "${CYAN}No API port provided, using default: ${ORANGE}${default_api_port}${NC}"
    api_port=$default_api_port
else
    echo -e "${CYAN}Using provided API port: ${ORANGE}${api_port}${NC}"
fi

# ... [Previous logic for deleting existing container remains the same] ...

echo

# START NEW CONTAINER
echo -e "${CYAN}Starting the new website container...${NC}"

# Added -e API_BASE_URL to the command
if docker-compose run \
    $build_arg \
    -d \
    -p "$port:$port" \
    --name "$name" \
    -e API_BASE_URL="http://localhost:$api_port" \
    web "$port"; then
    
    echo -e "${GREEN}Success! ${CYAN}Container ${GREEN}'${name}'${CYAN} started on port ${ORANGE}${port}${NC}"
    echo -e "${CYAN}API Base URL set to: ${ORANGE}http://localhost:${api_port}${NC}"
else
    echo -e "${RED}Error: Failed to start container.${NC}"
    exit 1
fi
