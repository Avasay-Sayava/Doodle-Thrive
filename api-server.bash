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

default_timeout=50
if [ -z "${timeout}" ]; then
    echo -e "${CYAN}No timeout provided, using default timeout: ${ORANGE}${default_timeout}${NC}"
    timeout=$default_timeout
else
    echo -e "${CYAN}Using provided timeout: ${ORANGE}${timeout}${NC}"
fi

if [ -z "${server_name}" ]; then
    echo -e "${CYAN}No server name provided.${NC}"
    echo -e "${CYAN}Must provide the server's name to the variable ${GREEN}'${RED}server_name${GREEN}'${CYAN}. ${NC}(e.g. running '${RED}server_name${NC}=${GREEN}base-server${NC} ./api-server.bash')"
    exit 1
fi

if [ -z "${server_port}" ]; then
    echo -e "${CYAN}No server port provided.${NC}"
    echo -e "${CYAN}Must provide the server's port to the variable ${GREEN}'${RED}server_port${GREEN}'${CYAN}. ${NC}(e.g. running '${RED}server_port${NC}=${ORANGE}3000${NC} ./api-server.bash')"
    exit 1
fi

echo

# CHECK SERVER STATUS
echo -e "${CYAN}Checking for running server container named ${GREEN}'${server_name}'${CYAN} on port ${ORANGE}${server_port}${CYAN}...${NC}"

container_id=$(docker ps -q -f name="^${server_name}$")

if [ -n "$container_id" ]; then
    server_args=$(docker inspect --format '{{.Args}}' "$server_name")

    if [[ "$server_args" != *"[$server_port]"* ]]; then
        echo -e "${RED}Warning: Server ${GREEN}'${server_name}'${RED} is running, but configuration mismatches.${NC}"
        echo -e "    Expected Port: ${GREEN}[$server_port]${NC}"
        echo -e "    Found Args:    ${RED}$server_args${NC}"

        echo -n -e "${YELLOW}Do you want to DELETE it and restart with port ${server_port}? (y/n) ${NC}"
        read -r replace_resp

        if [[ "$replace_resp" == "y" || "$replace_resp" == "Y" ]]; then
            echo -e "${RED}Killing mismatched container...${NC}"
            docker rm -f "$server_name" > /dev/null
            container_id="" 
        else
            echo -e "${CYAN}Exiting. Please fix the port mismatch manually.${NC}"
            exit 1
        fi
    else
        echo -e "${CYAN}Found running server ${GREEN}'${server_name}'${CYAN} active on port ${ORANGE}${server_port}${CYAN}.${NC}"
    fi
fi

# START SERVER IF NEEDED
if [ -z "$container_id" ]; then
    echo -e "${RED}Server container ${GREEN}'${server_name}'${RED} is not currently running.${NC}"
    
    echo -n -e "${YELLOW}Would you like to start the server now? (y/n) ${NC}"
    read -r response

    if [[ "$response" == "y" || "$response" == "Y" ]]; then
        if [ ! -f "./base-server.bash" ]; then
            echo -e "${RED}Error: Cannot find '${YELLOW}./base-server.bash${RED}' in the current directory.${NC}"
            exit 1
        fi

        echo -e "${CYAN}Launching base-server.bash...${NC}"
        echo

        if name="$server_name" port="$server_port" ./base-server.bash; then
            echo
            echo -e "${CYAN}base-server.bash executed. Verifying server status...${NC}"
        else
            echo -e "${RED}Error: base-server.bash failed to execute properly.${NC}"
            exit 1
        fi
        
        if [ -z "$(docker ps -q -f name="^${server_name}$")" ]; then
            echo
            echo -e "${RED}Error: Attempted to start server, but it is still not running.${NC}"
            exit 1
        fi
        
        echo -e "${CYAN}Server started successfully. Proceeding to API server...${NC}"
    else
        echo -e "${CYAN}Exiting.${NC}"
        exit 1
    fi
fi

echo

# DELETE EXISTING CONTAINER IF NEEDED
if [ "$(docker ps -aq -f name="^${name}$")" ]; then
    echo -e "${YELLOW}Found existing container named ${GREEN}'${name}'${YELLOW}.${NC}"

    echo -n -e "${YELLOW}Do you want to delete it? (y/n) ${NC}" 
    read -r response

    if [[ "${response}" == "y" || "${response}" == "Y" ]]; then
        echo -e "${RED}Deleting existing container...${NC}"
        docker rm -f ${name} > /dev/null 2>&1
        echo -e "${CYAN}Existing container deleted.${NC}"
    else
        echo -e "${CYAN}Skipping deletion. Note: Starting the new one might fail if names collide.${NC}"
    fi
else
    echo -e "${CYAN}No existing container named ${GREEN}'${name}'${CYAN} found. Proceeding.${NC}"
fi

echo

# START NEW CONTAINER
echo -e "${CYAN}Starting the new API server...${NC}"

if docker-compose run $build_arg -d --service-ports --name $name api-server $server_name $server_port $port $timeout; then
    echo -e "${GREEN}Success! ${CYAN}Container ${GREEN}'${name}'${CYAN} started on port ${ORANGE}${port}${CYAN}.${NC}"
else
    echo -e "${RED}Error: Failed to start API server.${NC}"
    exit 1
fi

echo

# START CURL TERMINAL
echo -n -e "${YELLOW}Would you like to open a curl terminal to interact with the API server? (y/n) ${NC}"
read -r curl_response
if [[ "$curl_response" == "y" || "$curl_response" == "Y" ]]; then
    echo -e "${CYAN}Running ${NC}api-console.bash${CYAN}...${NC}"
    name="$name" port="$port" ./api-console.bash
else
    echo -e "${CYAN}Exiting.${NC}"
    exit 0
fi
