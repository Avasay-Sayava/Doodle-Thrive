#include "command_director.h"
#include "status_codes.h"

namespace ddrive
{

    command_director::command_director(
        storage& _storage,
        const std::unordered_map<
            std::string,
            std::function<std::string(const std::vector<std::string>&,
                                      storage&)>>& handlerMap,
        splitter _splitter)
        : _storage(_storage), _handlers(handlerMap), _splitter(_splitter)
    {
    }

    std::string command_director::process(const std::string& line) const
    {
        const std::vector<std::string> args = _splitter.split(line);
        if (args.empty())
        {
            return ddrive::code_to_string(status_code::BAD_REQUEST);
        }
        auto it = _handlers.find(args[0]);
        if (it == _handlers.end())
        {
            // no such command
            return ddrive::code_to_string(status_code::BAD_REQUEST);
        }

        return it->second(args, _storage);
    }

} // namespace ddrive
