#!/bin/bash

                    # COLOR     STYLE
RED='\033[0;31m'    # RED       REGULAR
GREEN='\033[0;32m'  # GREEN     REGULAR
YELLOW='\033[1;33m' # ORANGE    BOLD
ORANGE='\033[0;33m' # ORANGE    REGULAR
CYAN='\033[0;36m'   # CYAN      REGULAR
BLUE='\033[1;34m'   # BLUE      BOLD
NC='\033[0m'        # NO COLOR

# SETUP
default_name="api-server"
if [ -z "${name}" ]; then
    echo -e "${CYAN}No name provided, using default name: ${GREEN}'${default_name}'${NC}"
    name=$default_name
else
    echo -e "${CYAN}Using provided name: ${GREEN}'${name}'${NC}"
fi

default_port=3300
if [ -z "${port}" ]; then
    echo -e "${CYAN}No port provided, using default port: ${ORANGE}${default_port}${NC}"
    port=$default_port
else
    echo -e "${CYAN}Using provided port: ${ORANGE}${port}${NC}"
fi

echo

# START CURL TERMINAL
echo -e "${CYAN}Opening curl terminal...${NC}"
echo
echo -e "${CYAN}HINT: If ${NC}http://localhost:${port}/${CYAN} doesn't work, you can always interact with the API server at ${NC}http://${name}:${port}/"
echo -e "${CYAN}Use ${NC}exit${CYAN} to leave the terminal.${NC}"

# CUSTOM SH TERMINAL:
#   ENV: sets a temporary curlrc that defines a custom curl function
#   PS1: before prompt shows container name in green, current dir in blue
#   curl(): custom curl function that calls curl then adds a newline for readability
docker exec -it \
    -e ENV=/tmp/curlrc \
    -e PS1="$(echo -n -e "${GREEN}${name} ${NC}➜ ${BLUE}\$(pwd)${NC}") $ " \
    "$name" \
    sh -c 'echo "curl() { command curl \"\$@\"; echo \"\"; }" > /tmp/curlrc; exec sh'
