#include "splitter.h"

#include <algorithm> // std::transform
#include <cctype>    // std::toupper

#include <algorithm> // std::transform
#include <cctype>    // std::toupper

namespace ddrive {

Splitter::Splitter(CommandArityMap commandArgCounts)
    : commandArgCounts(std::move(commandArgCounts))
{
}

// helper: uppercase a string in-place
static void toUpperInPlace(std::string& s)
{
    std::transform(
        s.begin(), s.end(), s.begin(),
        [](unsigned char c) { return static_cast<char>(std::toupper(c)); }
    );
}

Splitter::Splitter(CommandArityMap commandArgCounts)
    : commandArgCounts(std::move(commandArgCounts))
{
}

// helper: uppercase a string in-place
static void toUpperInPlace(std::string& s)
{
    std::transform(
        s.begin(), s.end(), s.begin(),
        [](unsigned char c) { return static_cast<char>(std::toupper(c)); }
    );
}

std::vector<std::string> Splitter::split(const std::string& line) const
{
    std::vector<std::string> args;

    if (line.empty()) {
        return args;
    }

    // 1. Extract first token (command) up to first space.
    std::size_t firstSpace = line.find(' ');
    std::string commandToken;
    std::string rest;

    if (firstSpace == std::string::npos) {
        // No spaces at all, whole line is the command token.
        commandToken = line;
        rest.clear();
    } else {
        commandToken = line.substr(0, firstSpace);
        rest = line.substr(firstSpace + 1); // everything after the first space, unchanged
    }

    if (commandToken.empty()) {
        return {};
    }

    toUpperInPlace(commandToken);

    auto it = commandArgCounts.find(commandToken);
    if (it == commandArgCounts.end()) {
        // Unknown command.
        return {};
    }

    int expectedCount = it->second; // total tokens: COMMAND + args
    if (expectedCount <= 0) {
        return {};
    }

    args.reserve(static_cast<std::size_t>(expectedCount));
    args.push_back(commandToken); // args[0] = COMMAND (uppercased)

    // 2. If expectedCount == 1, we require no extra text.
    if (expectedCount == 1) {
        if (!rest.empty()) {
            // Extra text after command that expects no args → invalid.
            return {};
        }
        return args;
    }

    // 3. For expectedCount >= 2:
    // We need (expectedCount - 2) "header" args, all the args before content.
    // The last argument is the rest of the line after skipping spaces.

    std::string remaining = rest;
    int headerArgs = expectedCount - 2; // how many single-token args to parse

    // Parse headerArgs single-token arguments.
    for (int i = 0; i < headerArgs; ++i) {
        if (remaining.empty()) {
            // Not enough text to extract required header args.
            return {};
        }

        std::size_t spacePos = remaining.find(' ');
        if (spacePos == std::string::npos) {
            // We still need header args AND a final content arg, but no space left = invalid.
            return {};
        }

        std::string arg = remaining.substr(0, spacePos);

        // Empty arg means something like "CMD  Arg" (double space) = invalid.
        if (arg.empty()) {
            return {};
        }

        args.push_back(arg);

        // Advance remaining to character after the space we just used.
        remaining = remaining.substr(spacePos + 1);
    }
    if (headerArgs == 0) {
        if (remaining.empty() || remaining[0] == ' ') {
            // Either no argument at all ("GET") or a double space after command ("GET  X").
            return {};
        }
    }
    args.push_back(remaining);

    // We must have exactly expectedCount tokens now.
    if (static_cast<int>(args.size()) != expectedCount) {
        return {};
    }

    return args;
}

} // namespace ddrive
