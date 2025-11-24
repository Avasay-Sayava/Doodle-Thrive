//implment empty cli cpp for the tests
#include "cli.h"
#include <iostream>
#include <string>
#include <vector>

//empty implementations
void CLI::cli_loop() const {
    return;
}

std::vector<std::string> CLI::cli_command(const std::string& command) {
    return {};
}