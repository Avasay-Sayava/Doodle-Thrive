cmake_minimum_required(VERSION 3.10)
project(app)

set(CMAKE_CXX_STANDARD 11)

file(GLOB_RECURSE SRC_FILES "*.*")
list(FILTER SRC_FILES INCLUDE REGEX "\\.(cpp|h)$")

add_executable(app
    ${SRC_FILES}
)
