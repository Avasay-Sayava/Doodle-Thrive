cmake_minimum_required(VERSION 3.10)
project(server)

set(CMAKE_CXX_STANDARD 17)

file(GLOB_RECURSE SERVER_FILES "../server/*.*")
file(GLOB_RECURSE CORE_FILES "../core/*.*")
list(FILTER SERVER_FILES INCLUDE REGEX "\\.(cpp|h)$")
list(FILTER CORE_FILES INCLUDE REGEX "\\.(cpp|h)$")

add_executable(server
    ${SERVER_FILES}
    ${CORE_FILES}
)
