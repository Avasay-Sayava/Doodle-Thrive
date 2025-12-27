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
default_build=true
if [ -z "${build}" ]; then
    echo -e "${CYAN}No build option provided, defaulting to build: ${GREEN}${default_build}${NC}"
    build=$default_build
else
    echo -e "${CYAN}Using provided build option: ${GREEN}${build}${NC}"
fi

# SET BUILD ARG
case $build in
    true)
        build_arg="--build"
        ;;
    false)
        build_arg=""
        ;;
    *)
        echo -e "${RED}Invalid build choice '${build}'.${NC}"
        exit 1
        ;;
esac

default_name="base-server"
if [ -z "${name}" ]; then
    echo -e "${CYAN}No name provided, using default name: ${GREEN}'${default_name}'${NC}"
    name=$default_name
else
    echo -e "${CYAN}Using provided name: ${GREEN}'${name}'${NC}"
fi

default_port=3000
if [ -z "${port}" ]; then
    echo -e "${CYAN}No port provided, using default port: ${ORANGE}${default_port}${NC}"
    port=$default_port
else
    echo -e "${CYAN}Using provided port: ${ORANGE}${port}${NC}"
fi

default_threads=10
if [ -z "${threads}" ]; then
    echo -e "${CYAN}No thread count provided, using default thread count: ${ORANGE}${default_threads}${NC}"
    threads=$default_threads
else
    echo -e "${CYAN}Using provided thread count: ${ORANGE}${threads}${NC}"
fi

echo

# DELETE EXISTING CONTAINER IF NEEDED
if [ "$(docker ps -aq -f name="^${name}$")" ]; then
    echo -e "${YELLOW}Found existing container named ${GREEN}'${name}'${YELLOW}.${NC}"

    echo -n -e "${YELLOW}Do you want to delete it? (y/n) ${NC}" 
    read -r response

    if [[ "${response}" == "y" || "${response}" == "Y" ]]; then
        echo -e "${RED}Deleting existing container...${NC}"
        docker rm -f ${name} > /dev/null
        echo -e "${CYAN}Existing container deleted.${NC}"
    else
        echo -e "${CYAN}Skipping deletion. Note: Starting the new one might fail if names collide.${NC}"
    fi
else
    echo -e "${CYAN}No existing container named ${GREEN}'${name}'${CYAN} found. Proceeding.${NC}"
fi

echo

# START NEW CONTAINER
echo -e "${CYAN}Starting the new server...${NC}"

if docker-compose run $build_arg -d -e THREADS=$threads --name $name base-server $port; then
    echo -e "${GREEN}Success! ${CYAN}Container ${GREEN}'${name}'${CYAN} started on port ${ORANGE}${port}${CYAN}.${NC}"
else
    echo -e "${RED}Error: Failed to start container.${NC}"
    exit 1
fi
