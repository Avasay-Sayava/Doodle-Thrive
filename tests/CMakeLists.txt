cmake_minimum_required(VERSION 3.10)
project(tests)

set(CMAKE_CXX_STANDARD 17)

include(FetchContent)
FetchContent_Declare(
  googletest
  URL https://github.com/google/googletest/archive/refs/tags/release-1.11.0.zip
)

# For Windows: Prevent overriding the parent project's compiler/linker settings
set(gtest_force_shared_crt ON CACHE BOOL "" FORCE)
FetchContent_MakeAvailable(googletest)

set(PROJECT_DIR "..")
file(GLOB_RECURSE SRC_FILES "${PROJECT_DIR}/src/*.*")
list(FILTER SRC_FILES INCLUDE REGEX "\\.(cpp|h)$")
list(FILTER SRC_FILES EXCLUDE REGEX "main\\..*$")
file(GLOB_RECURSE TESTS_FILES "*.*")
list(FILTER TESTS_FILES INCLUDE REGEX "\\.(cpp|h)$")

add_executable(tests
    ${TESTS_FILES}
    ${SRC_FILES}
)

target_link_libraries(tests gtest_main)
