#!/bin/bash

                    # COLOR     STYLE
RED='\033[0;31m'    # RED       REGULAR
GREEN='\033[0;32m'  # GREEN     REGULAR
YELLOW='\033[1;33m' # ORANGE    BOLD
ORANGE='\033[0;33m' # ORANGE    REGULAR
CYAN='\033[0;36m'   # CYAN      REGULAR
BLUE='\033[1;34m'   # BLUE      BOLD
NC='\033[0m'        # NO COLOR

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

default_server_name="base-server"
if [ -z "${server_name}" ]; then
    echo -e "${CYAN}No base server name provided, defaulting to name: ${GREEN}${default_server_name}${NC}"
    server_name=$default_server_name
else
    echo -e "${CYAN}Using provided base server name: ${GREEN}${server_name}${NC}"
fi

default_server_port=3000
if [ -z "${server_port}" ]; then
    echo -e "${CYAN}No base server port provided, defaulting to port: ${ORANGE}${default_server_port}${NC}"
    server_port=$default_server_port
else
    echo -e "${CYAN}Using provided base server port: ${ORANGE}${server_port}${NC}"
fi

default_threads=10
if [ -z "${threads}" ]; then
    echo -e "${CYAN}No base server thread count provided, defaulting to thread count: ${ORANGE}${default_threads}${NC}"
    threads=$default_threads
else
    echo -e "${CYAN}Using provided base server thread count: ${ORANGE}${threads}${NC}"
fi

default_name="api-server"
if [ -z "${name}" ]; then
    echo -e "${CYAN}No API server name provided, defaulting to name: ${GREEN}${default_name}${NC}"
    name=$default_name
else
    echo -e "${CYAN}Using provided API server name: ${GREEN}${name}${NC}"
fi

default_port=3300
if [ -z "${port}" ]; then
    echo -e "${CYAN}No API server port provided, defaulting to port: ${ORANGE}${default_port}${NC}"
    port=$default_port
else
    echo -e "${CYAN}Using provided API server port: ${ORANGE}${port}${NC}"
fi

default_timeout=100
if [ -z "${timeout}" ]; then
    echo -e "${CYAN}No API timeout provided, defaulting to timeout: ${ORANGE}${default_timeout}${NC}"
    timeout=$default_timeout
else
    echo -e "${CYAN}Using provided API timeout: ${ORANGE}${timeout}${NC}"
fi

# Delete existing containers if they exist
if [ $(docker ps -a -q -f name=$server_name) ]; then
    echo -e -n "${YELLOW}A container with the name ${GREEN}${server_name}${YELLOW} already exists. Do you want to remove it? (y/n) ${NC}"
    read -r response
    if [[ "$response" == "y" || "$response" == "Y" ]]; then
        echo -e "${CYAN}Removing existing container ${GREEN}${server_name}${CYAN}...${NC}"
        docker rm -f "$server_name" > /dev/null
        echo -e "${CYAN}Removed existing container ${GREEN}${server_name}${CYAN}.${NC}"
    else
        echo -e "${RED}Cannot proceed with existing container. Exiting.${NC}"
        exit 1
    fi
fi

if [ $(docker ps -a -q -f name=$name) ]; then
    echo -e -n "${YELLOW}A container with the name ${GREEN}${name}${YELLOW} already exists. Do you want to remove it? (y/n) ${NC}"
    read -r response
    if [[ "$response" == "y" || "$response" == "Y" ]]; then
        echo -e "${CYAN}Removing existing container ${GREEN}${name}${CYAN}...${NC}"
        docker rm -f "$name" > /dev/null
        echo -e "${CYAN}Removed existing container ${GREEN}${name}${CYAN}.${NC}"
    else
        echo -e "${RED}Cannot proceed with existing container. Exiting.${NC}"
        exit 1
    fi
fi

docker-compose run $build_arg -d -e THREADS=$threads --name $server_name base-server $server_port
docker-compose run $build_arg -d --service-ports --name $name api-server $server_name $server_port $port $timeout
docker-compose run $build_arg -e API_SERVER_HOST=$name -e API_SERVER_PORT=$port --remove-orphans api-tests
