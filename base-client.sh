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

if [ -z "${name}" ]; then
    echo -e "${CYAN}No name provided.${NC}"
    echo -e "${CYAN}Must provide the server's name to the variable ${GREEN}'${RED}name${GREEN}'${CYAN}. ${NC}(e.g. running '${RED}name${NC}=${GREEN}base-server${NC} ./base-client.sh')"
    exit 1
fi

if [ -z "${port}" ]; then
    echo -e "${CYAN}No port provided.${NC}"
    echo -e "${CYAN}Must provide the server's port to the variable ${GREEN}'${RED}port${GREEN}'${CYAN}. ${NC}(e.g. running '${RED}port${NC}=${ORANGE}3000${NC} ./base-client.sh')"
    exit 1
fi

# ASK FOR CLIENT TYPE IF NOT PROVIDED
if [ -z "${type}" ]; then
    echo -e "${CYAN}Which client implementation would you like to run?${NC}"
    echo -e "    1. C++    (${ORANGE}base-client-cpp${NC})"
    echo -e "    2. Python (${ORANGE}base-client-py${NC})"
    echo -n -e "${CYAN}Enter choice (1/2): ${NC}"
    read -r type
fi

# CHOOSE CLIENT SERVICE BASED ON SELECTION
case $type in
    1)
        client_service="base-client-cpp"
        ;;
    2)
        client_service="base-client-py"
        ;;
    *)
        echo -e "${RED}Invalid client choice '${type}'.${NC}"
        exit 1
        ;;
esac

# CHECK SERVER STATUS
echo -e "${CYAN}Checking for running server container named ${GREEN}'${name}'${CYAN} on port ${ORANGE}${port}${CYAN}...${NC}"

container_id=$(docker ps -q -f name="^${name}$")

if [ -n "$container_id" ]; then
    server_args=$(docker inspect --format '{{.Args}}' "$name")

    if [[ "$server_args" != *"[$port]"* ]]; then
        echo -e "${RED}Warning: Server ${GREEN}'${name}'${RED} is running, but configuration mismatches.${NC}"
        echo -e "    Expected Port: ${GREEN}[$port]${NC}"
        echo -e "    Found Args:    ${RED}$server_args${NC}"

        echo -n -e "${YELLOW}Do you want to DELETE it and restart with port ${port}? (y/n) ${NC}"
        read -r replace_resp

        if [[ "$replace_resp" == "y" || "$replace_resp" == "Y" ]]; then
            echo -e "${RED}Killing mismatched container...${NC}"
            docker rm -f "$name" > /dev/null
            container_id="" 
        else
            echo -e "${CYAN}Exiting. Please fix the port mismatch manually.${NC}"
            exit 1
        fi
    else
        echo -e "${CYAN}Found running server ${GREEN}'${name}'${CYAN} active on port ${ORANGE}${port}${CYAN}.${NC}"
    fi
fi

# START SERVER IF NEEDED
if [ -z "$container_id" ]; then
    echo -e "${RED}Server container ${GREEN}'${name}'${RED} is not currently running.${NC}"
    
    echo -n -e "${YELLOW}Would you like to start the server now? (y/n) ${NC}"
    read -r response

    if [[ "$response" == "y" || "$response" == "Y" ]]; then
        if [ ! -f "./base-server.sh" ]; then
            echo -e "${RED}Error: Cannot find '${YELLOW}./base-server.sh${RED}' in the current directory.${NC}"
            exit 1
        fi

        echo -e "${CYAN}Launching base-server.sh...${NC}"
        echo

        if name="$name" port="$port" ./base-server.sh; then
            echo
            echo -e "${CYAN}base-server.sh executed. Verifying server status...${NC}"
        else
            echo -e "${RED}Error: base-server.sh failed to execute properly.${NC}"
            exit 1
        fi
        
        if [ -z "$(docker ps -q -f name="^${name}$")" ]; then
            echo
            echo -e "${RED}Error: Attempted to start server, but it is still not running.${NC}"
            exit 1
        fi
        
        echo -e "${CYAN}Server started successfully. Proceeding to client...${NC}"
    else
        echo -e "${CYAN}Exiting.${NC}"
        exit 1
    fi
fi

echo

# START NEW CONTAINER
echo -e "${CYAN}Building and starting the client...${NC}"

if docker-compose run $build_arg -it $client_service $name $port; then
    echo -n ""
else
    echo -e "${RED}Error: Failed to start client.${NC}"
    exit 1
fi
