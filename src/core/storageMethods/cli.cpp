#include "cli.h"
#include "add.h"
#include "get.h"
#include "search.h"
#include <iostream>
#include <vector>
#include <string>


/**
 * @brief Parses a single CLI command into arguments.
 *
 * Expected formats (exactly):
 *   - add <fileName> <content>
 *       * <fileName> has no spaces.
 *       * <content> may be empty or contain spaces.
 *       * "add MyFile "  -> content is empty string.
 *
 *   - get <fileName>
 *       * <fileName> has no spaces.
 *
 *   - search <term>
 *       * <term> is non-empty, may contain spaces.
 *
 * Any wrong command results in an empty vector.
 */
std::vector<std::string> CLI::cli_command(const std::string& command) {
    std::vector<std::string> empty_result = {};


    if (command.empty()) {
        return empty_result;
    }


    // Reject commands that are only spaces or contain control whitespace.
    bool only_spaces = true;
    for (char c : command) {
        if (c == '\n' || c == '\r' || c == '\t') {
            return empty_result;
        }
        if (c != ' ') {
            only_spaces = false;
        }
    }
    if (only_spaces) {
        return empty_result;
    }


    // ADD command: "add <fileName> <content>"
    if (command.rfind("add ", 0) == 0) {
        const std::size_t filename_start = 4;
        // Find the space that ends the filename.
        std::size_t filename_end = command.find(' ', filename_start);
        if (filename_end == std::string::npos) {
            // There should be at least a space after the filename (even for empty content).
            return empty_result;
        }


        std::string filename = command.substr(filename_start, filename_end - filename_start);
        if (filename.empty()) {
            // incase of a double space after add
            return empty_result;
        }


        std::size_t content_start = filename_end + 1;


        std::string content = command.substr(content_start);


        return {"add", filename, content};
    }


    // GET command: "get <fileName>"
    if (command.rfind("get ", 0) == 0) {
        std::string rest = command.substr(4);
        if (rest.empty()) {
            // Missing filename.
            return empty_result;
        }


        // No spaces allowed in filename, and no trailing spaces.
        if (rest.find(' ') != std::string::npos) {
            return empty_result;
        }


        return {"get", rest};
    }


    // SEARCH command: "search <term>"
    if (command.rfind("search ", 0) == 0) {
        std::string term = command.substr(7);
        return {"search", term};
    }


    // Unknown command.
    return empty_result;
}




/**
 * @brief Starts the infinite CLI loop.
 *
 * Reads one line per command from standard input and processes it.
 * The never stops.
 *
 * Valid commands (exactly):
 *   - add <fileName> <content>
 *       * <fileName> has no spaces.
 *       * <content> may be empty or contain spaces.
 *       * "add MyFile "  -> content is empty string.
 *
 *   - get <fileName>
 *       * <fileName> has no spaces.
 *
 *   - search <term>
 *       * <term> is non-empty, may contain spaces.
 *
 * The CLI will ignore all wrong commands.
 */
void CLI::cli_loop() const {
    std::string line;


    //Infinite loop
    while (true) {
        std::getline(std::cin, line);


        // Parse the command.
        std::vector<std::string> args = CLI::cli_command(line);


        if (args.empty()) {
            continue;
        }


        const std::string& cmd = args[0];


        if (cmd == "add") {
            // Expected: add <fileName> <content>
            if (args.size() == 3) {
                add(args[1], args[2]);
            }
            // If size is wrong, silently ignore.


        } else if (cmd == "get") {
            // Expected: get <fileName>
            if (args.size() == 2) {
                std::optional<std::string> result = get(args[1]);
                if (result.has_value()) {
                    std::cout << result.value() << std::endl;
                }
            }


        } else if (cmd == "search") {
            // Expected: search <term>
            if (args.size() == 2) {
                std::string matches = search(args[1]);
                std::cout << matches << std::endl;
            }


        } else {
            // Unknown command, ignore.
            continue;
        }
    }
}





