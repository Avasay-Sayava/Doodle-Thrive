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

echo -e "${YELLOW}Cleaning up old containers...${NC}"
docker rm -f base-server api-server >/dev/null 2>&1

docker-compose run $build_arg -d -e THREADS=10 --name base-server base-server 3000
docker-compose run $build_arg -d --service-ports --name api-server api-server base-server 3000 3300 50
docker-compose run $build_arg --remove-orphans api-tests
