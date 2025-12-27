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

    class command_director
    {
    public:
        /**
         * @brief Construct a command_director with a handler map.
         *
         * @param _storage Shared storage object used by all handlers.
         * @param _handler_map A map from command names to handler functions,
         * command names need to be uppercase.
         *
         */
        command_director(
            storage& _storage,
            const std::unordered_map<
                std::string,
                std::function<std::string(const std::vector<std::string>&,
                                          storage&)>>& _handler_map,
            splitter _splitter);

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
        storage& _storage;

        /**
         * @brief Splits raw input lines into arguments.
         */
        splitter _splitter;

        /**
         * @brief Map from command names to their handler functions.
         */
        std::unordered_map<std::string,
                           std::function<std::string(
                               const std::vector<std::string>&, storage&)>>
            _handlers;
    };

} // namespace ddrive

#endif // DOODLE_DRIVE_CD_H
