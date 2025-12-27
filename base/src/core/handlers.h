#ifndef DOODLE_DRIVE_HANDLERS_H
#define DOODLE_DRIVE_HANDLERS_H

#include "status_codes.h"
#include "storage.h"

#include <string>
#include <vector>

namespace ddrive
{

    /**
     * @brief Handle POST command.
     */
    std::string handle_post(const std::vector<std::string>& args,
                           storage& storage);

    /**
     * @brief Handle GET command.
     */
    std::string handle_get(const std::vector<std::string>& args,
                          storage& storage);

    /**
     * @brief Handle SEARCH command.
     */
    std::string handle_search(const std::vector<std::string>& args,
                             storage& storage);

    /**
     * @brief Handle DELETE command.
     */
    std::string handle_delete(const std::vector<std::string>& args,
                             storage& storage);

} // namespace ddrive

#endif // DOODLE_DRIVE_HANDLERS_H
