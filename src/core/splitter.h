#pragma once

#include <string>
#include <vector>

namespace ddrive {

class Splitter {
public:
    std::vector<std::string> split(const std::string& line) const;
};

} // namespace ddrive
