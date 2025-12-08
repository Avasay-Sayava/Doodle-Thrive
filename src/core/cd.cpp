#include "cd.h"
#include "statusCodes.h"

namespace ddrive {

CommandDirector::CommandDirector(
    Storage& storage,
    const std::unordered_map<std::string,
        std::function<std::string(const std::vector<std::string>&, Storage&)>>& handlerMap)
    : storage(storage)
{

}

std::string CommandDirector::process(const std::string& line) const
{
    // Empty implementation for TDD purposes
    return "";
}

} // namespace ddrive
