#include "cd.h"
#include "statusCodes.h"

namespace ddrive
{

    CommandDirector::CommandDirector(
        Storage& storage,
        const std::unordered_map<
            std::string,
            std::function<std::string(const std::vector<std::string>&,
                                      Storage&)>>& handlerMap,
        Splitter splitter)
        : storage(storage), handlers(handlerMap), splitter(splitter)
    {
    }

    std::string CommandDirector::process(const std::string& line) const
    {
        const std::vector<std::string> args = splitter.split(line);
        if (args.empty())
        {
            return ddrive::codeToString(StatusCode::BadRequest);
        }
        auto it = handlers.find(args[0]);
        if (it == handlers.end())
        {
            // no such command
            return ddrive::codeToString(StatusCode::BadRequest);
        }

        return it->second(args, storage);
    }

} // namespace ddrive
