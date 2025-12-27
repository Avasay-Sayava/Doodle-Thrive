#ifndef DOODLE_DRIVE_SPLITTER_H
#define DOODLE_DRIVE_SPLITTER_H

#include <string>
#include <unordered_map>
#include <vector>

namespace ddrive
{

    /**
     * @brief Splits a raw input line into command + arguments
     *        based on a configured command, arg count map.
     *
     * General rules:
     *  - The command name (first token) is uppercased.
     *  - If the command is unknown (not in the map), returns empty vector.
     *  - If the format does not match the expected arg count, returns empty
     * vector.
     *  - For commands with N ≥ 2 arguments:
     *      * args[0] = COMMAND (uppercased)
     *      * args[1..N-2] are single tokens with no spaces.
     *      * args[N-1] (the last argument) is the rest of the line
     *        after skipping spaces, it may contain spaces and may be empty.
     */
    class splitter
    {
    public:
        using command_arity_map = std::unordered_map<std::string, size_t>;

        /**
         * @brief Construct a Splitter with a map from command name (UPPERCASE)
         *        to expected argument count.
         */
        explicit splitter(command_arity_map command_arg_counts);

        /**
         * @brief Split a raw line into [COMMAND, arg1, arg2, ...].
         *
         * On failure (unknown command, wrong number of parts, invalid spacing),
         * returns an empty vector.
         */
        std::vector<std::string> split(const std::string& line) const;

    private:
        command_arity_map _command_arg_counts;
    };

} // namespace ddrive

#endif // DOODLE_DRIVE_SPLITTER_H
