#ifndef CD_H
#define CD_H

#include <string>
#include <unordered_map>
#include <functional>
#include <vector>

#include "splitter.h"
#include "storage.h"

namespace ddrive {

/**
 * @brief Routes raw client input to the correct command handler.
 */
class CommandDirector {
public:
    /**
     * @brief Construct a CommandDirector with a handler map.
     *
     * @param storage Shared storage object used by all handlers.
     * @param handlerMap A map from command names to handler functions.
     *
     */
    CommandDirector(Storage& storage,const std::unordered_map<std::string, 
        std::function<std::string(const std::vector<std::string>&, Storage&)>>& handlerMap);

    /**
     * @brief Process one line of client input.
     *
     * @param line Raw input string.
     * @return Full response string returned by the matched handler.
     *         If no handler matches, returns a "400 Bad Request" formatted string.
     */
    std::string process(const std::string& line) const;

private:
    /**
     * @brief Shared storage object for file operations.
     */
    Storage& storage; 

    /**
     * @brief Splits raw input lines into arguments.
     */
    Splitter splitter;

    /**
     * @brief Map from command names to their handler functions.
     */
    std::unordered_map<std::string,
        std::function<std::string(const std::vector<std::string>&, Storage&)>> handlers; 
};

} // namespace ddrive

#endif // CD_H