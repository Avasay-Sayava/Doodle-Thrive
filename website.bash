#!/bin/bash

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
ORANGE='\033[0;33m'
CYAN='\033[0;36m'
NC='\033[0m'


default_name="website"
default_api_port=3300
default_port=8080
if [ -z "${name}" ]; then
    echo -e "${CYAN}No name provided, using default name: ${GREEN}'${default_name}'${NC}"
    name=$default_name
else
    echo -e "${CYAN}Using provided name: ${GREEN}'${name}'${NC}"
fi

if [ -z "${api_port}" ]; then
    read -p "Enter the API port to connect to (default: ${default_api_port}): " user_api_port
    api_port=${user_api_port:-$default_api_port}
    echo -e "${CYAN}Using API port: ${ORANGE}${api_port}${NC}"
fi

if [ -z "${port}" ]; then
    read -p "Enter the website port to use (default: ${default_port}): " user_port
    port=${user_port:-$default_port}
    echo -e "${CYAN}Using website port: ${ORANGE}${port}${NC}"
fi

existing_container=$(docker ps -a --filter "name=$name" --format "{{.ID}}")
if [ -n "$existing_container" ]; then
    echo -e "${YELLOW}Removing existing container with name '${name}'...${NC}"
    docker rm -f "$existing_container"
fi

echo -e "${CYAN}Starting the new website container...${NC}"

if docker-compose run \
    $build_arg \
    -d \
    -p "$port:$port" \
    --name "$name" \
    -e API_BASE_URL="http://localhost:$api_port" \
    web "$port"; then
    
    echo -e "${GREEN}Success! ${CYAN}Container ${GREEN}'${name}'${CYAN} started on port ${ORANGE}${port}${NC}"
    echo -e "${CYAN}API Base URL set to: ${ORANGE}http://localhost:${api_port}${NC}"
    echo -e "${CYAN}You can access the website at: ${ORANGE}http://localhost:${port}${NC}"
else
    echo -e "${RED}Error: Failed to start container.${NC}"
    exit 1
fi