#ifndef SPLITTER_H
#define SPLITTER_H

#include <string>
#include <vector>

namespace ddrive {

/**
 * @brief Splits a raw input line into space separated arguments.
 */
class Splitter {
public:
    /**
     * @brief Split an input line into components.
     *
     * @param line Raw input string.
     * @return A vector of tokens in the order they appear in the line.
     */
    std::vector<std::string> split(const std::string& line) const;
};

} // namespace ddrive

#endif // SPLITTER_H
