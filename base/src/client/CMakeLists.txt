cmake_minimum_required(VERSION 3.10)
project(cpp-client)

set(CMAKE_CXX_STANDARD 17)

file(GLOB_RECURSE SRC_FILES "*.*")
list(FILTER SRC_FILES INCLUDE REGEX "\\.(cpp|h)$")
add_executable(cpp-client
    ${SRC_FILES}
)