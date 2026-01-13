#!/bin/bash

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
ORANGE='\033[0;33m'
CYAN='\033[0;36m'
BLUE='\033[1;34m'
NC='\033[0m'

default_build=true
if [ -z "${build}" ]; then
    echo -e "${CYAN}No build option provided, defaulting to build: ${GREEN}${default_build}${NC}"
    build=$default_build
else
    echo -e "${CYAN}Using provided build option: ${GREEN}${build}${NC}"
fi

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
    read -p "Enter the base server port to use (default: ${default_port}): " user_port
    port=${user_port:-$default_port}
    echo -e "${CYAN}Using base server port: ${ORANGE}${port}${NC}"
else
    echo -e "${CYAN}Using provided port: ${ORANGE}${port}${NC}"
fi

default_threads=10
if [ -z "${threads}" ]; then
    read -p "Enter number of server threads (default: ${default_threads}): " user_threads
    threads=${user_threads:-$default_threads}
    echo -e "${CYAN}Using thread count: ${ORANGE}${threads}${NC}"
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

echo -e "${CYAN}Starting the new server...${NC}"

if docker-compose run $build_arg -d -p $port:$port -e THREADS=$threads --name $name base-server $port; then
    echo -e "${GREEN}Success! ${CYAN}Container ${GREEN}'${name}'${CYAN} started on port ${ORANGE}${port}${CYAN}.${NC}"
else
    echo -e "${RED}Error: Failed to start container.${NC}"
    exit 1
fi
