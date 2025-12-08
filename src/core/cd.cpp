#include "cd.h"

namespace ddrive {

void cd::registerHandler(const std::string& command, HandlerFn handler)
{
    // Empty implementation for TDD purposes
    (void)command;
    (void)handler;
}

HandlerResult cd::process(const std::string& line) const
{
    // Empty implementation for TDD purposes
    (void)line;
    return HandlerResult{"", StatusCode::BadRequest};
}

std::string cd::normalize(const std::string& cmd) const
{
    // Empty implementation for TDD purposes
    return cmd;
}

} // namespace ddrive
