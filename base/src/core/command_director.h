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

    /**
     * @brief Routes parsed commands to their appropriate handlers.
     *
     * Takes raw input strings, splits them into arguments, and invokes the
     * registered handler function.
     */
    class command_director
    {
    public:
        /**
         * @brief Constructs a command_director.
         *
         * @param _storage Shared storage object to be passed to handlers.
         * @param _handler_map Map linking UPPERCASE command strings to handler
         * functions.
         * @param _splitter Utility for tokenizing raw input strings.
         */
        command_director(
            storage& _storage,
            const std::unordered_map<
                std::string,
                std::function<std::string(const std::vector<std::string>&,
                                          storage&)>>& _handler_map,
            splitter _splitter);

        /**
         * @brief Processes a raw input line from a client.
         *
         * @param line The raw command string received from the network.
         * @return The final response string to be sent back to the
         * client. Returns "400 Bad Request" if the command is unknown or
         * malformed.
         */
        std::string process(const std::string& line) const;

    private:
        storage& _storage;
        splitter _splitter;
        std::unordered_map<std::string,
                           std::function<std::string(
                               const std::vector<std::string>&, storage&)>>
            _handlers;
    };

} // namespace ddrive

#endif // DOODLE_DRIVE_CD_H
