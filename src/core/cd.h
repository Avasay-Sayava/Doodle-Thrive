#pragma once

#include <string>
#include <unordered_map>
#include <vector>
#include <functional>

#include "statusCodes.h"
#include "splitter.h"

namespace ddrive {

// HandlerResult = (body, status)
using HandlerResult = std::pair<std::string, StatusCode>;

// HandlerFn = function taking arg vector
using HandlerFn = std::function<HandlerResult(const std::vector<std::string>&)>;

/**
 * @brief Responsible for routing commands to handlers.
 */
class cd {
public:
    cd();

    void registerHandler(const std::string& command, HandlerFn handler);

    HandlerResult process(const std::string& line) const;

private:
    std::unordered_map<std::string, HandlerFn> handlers;
    Splitter splitter;

    std::string normalize(const std::string& cmd) const;
};

} // namespace ddrive
