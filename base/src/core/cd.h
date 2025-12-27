#ifndef DOODLE_DRIVE_CD_H
#define DOODLE_DRIVE_CD_H

#include <functional>
#include <string>
#include <unordered_map>
#include <vector>

#include "splitter.h"
#include "storage.h"

namespace ddrive
{

    class CommandDirector
    {
    public:
        /**
         * @brief Construct a CommandDirector with a handler map.
         *
         * @param storage Shared storage object used by all handlers.
         * @param handlerMap A map from command names to handler functions,
         * command names need to be uppercase.
         *
         */
        CommandDirector(
            Storage& storage,
            const std::unordered_map<
                std::string,
                std::function<std::string(const std::vector<std::string>&,
                                          Storage&)>>& handlerMap,
            Splitter splitter);

        /**
         * @brief Process one line of client input.
         *
         * @param line Raw input string.
         * @return Full response string returned by the matched handler.
         * If no handler matches, returns a "400 Bad Request" formatted string.
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
                           std::function<std::string(
                               const std::vector<std::string>&, Storage&)>>
            handlers;
    };

} // namespace ddrive

#endif // DOODLE_DRIVE_CD_H
