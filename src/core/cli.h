#ifndef CLI_H
#define CLI_H

#include <string>
#include <vector>

/**
 * @brief Command-line interface for the RLE system.
 *
 * Responsible for reading commands from standard input, parsing them,
 * and calling to the existing add/get/search functions.
 */
class CLI {
public:
    /**
     * @brief Starts the infinite CLI loop.
     *
     * Reads one line per command from standard input and processes it.
     * The program does not exit unless terminated.
     */
    void cli_loop() const;

    /**
     * @brief Parses a single CLI command into arguments.
     *
     * Breaks the command into its logical arguments (command name,
     * file name, and content). If the command is invalid
     * (wrong format, unknown command, bad spacing and so on..), returns
     * an empty vector.
     *
     * @param command The raw command line.
     * @return A vector of parsed arguments, or an empty vector if invalid.
     */
    static std::vector<std::string> cli_command(const std::string& command);
};

#endif 
