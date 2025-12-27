#include "splitter.h"

#include <algorithm>
#include <cctype>

namespace ddrive
{

    splitter::splitter(command_arity_map command_arg_counts)
        : _command_arg_counts(std::move(command_arg_counts))
    {
    }

    std::vector<std::string> splitter::split(const std::string& line) const
    {
        std::vector<std::string> args;

        if (line.empty())
        {
            return args;
        }

        // 1. Extract first token (command) up to first space.
        std::size_t first_space = line.find(' ');
        std::string command_token;
        std::string rest;

        if (first_space == std::string::npos)
        {
            // No spaces at all, whole line is the command token.
            command_token = line;
            rest.clear();
        }
        else
        {
            command_token = line.substr(0, first_space);
            rest = line.substr(
                first_space + 1); // everything after the first space, unchanged
        }

        if (command_token.empty())
        {
            return {};
        }

        std::transform(command_token.begin(), command_token.end(),
                       command_token.begin(), [](unsigned char c)
                       { return static_cast<char>(std::toupper(c)); });

        auto it = _command_arg_counts.find(command_token);
        if (it == _command_arg_counts.end())
        {
            // Unknown command.
            return {};
        }

        int expected_count = it->second; // total tokens: COMMAND + args
        if (expected_count <= 0)
        {
            return {};
        }

        if (expected_count > 1 && first_space == std::string::npos)
        {
            return {};
        }

        args.reserve(static_cast<std::size_t>(expected_count));
        args.push_back(command_token); // args[0] = COMMAND (uppercased)

        // 2. If expectedCount == 1, we require no extra text.
        if (expected_count == 1)
        {
            if (!rest.empty())
            {
                // Extra text after command that expects no args → invalid.
                return {};
            }
            return args;
        }

        // 3. For expectedCount >= 2:
        // We need (expectedCount - 2) "header" args, all the args before
        // content. The last argument is the rest of the line after skipping
        // spaces.

        std::string remaining = rest;
        int header_args =
            expected_count - 2; // how many single-token args to parse

        // Parse header_args single-token arguments.
        for (int i = 0; i < header_args; ++i)
        {
            if (remaining.empty())
            {
                // Not enough text to extract required header args.
                return {};
            }

            std::size_t spacePos = remaining.find(' ');
            if (spacePos == std::string::npos)
            {
                // We still need header args AND a final content arg, but no
                // space left = invalid.
                return {};
            }

            std::string arg = remaining.substr(0, spacePos);

            // Empty arg means something like "CMD  Arg" (double space) =
            // invalid.
            if (arg.empty())
            {
                return {};
            }

            args.push_back(arg);

            // Advance remaining to character after the space we just used.
            remaining = remaining.substr(spacePos + 1);
        }

        args.push_back(remaining);

        // We must have exactly expectedCount tokens now.
        if (static_cast<int>(args.size()) != expected_count)
        {
            return {};
        }

        return args;
    }

} // namespace ddrive
