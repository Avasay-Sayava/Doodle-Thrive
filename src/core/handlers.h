#ifndef HANDLERS_H
#define HANDLERS_H

#include <string>
#include <vector>
#include "statusCodes.h"
#include "storage.h"

namespace ddrive {


/**
 * @brief Result returned by a command handler.
 *
 * body- content (used for GET and SEARCH).
 * code- protocol status code.
 */
using HandlerResult = std::pair<std::string, StatusCode>;

/**
 * @brief Handle POST command.
 */
HandlerResult handlePost(const std::vector<std::string>& args, Storage& storage);

/**
 * @brief Handle GET command.
 */
HandlerResult handleGet(const std::vector<std::string>& args, Storage& storage);

/**
 * @brief Handle SEARCH command.
 */
HandlerResult handleSearch(const std::vector<std::string>& args, Storage& storage);

/**
 * @brief Handle DELETE command.
 */
HandlerResult handleDelete(const std::vector<std::string>& args, Storage& storage);

} // namespace ddrive

#endif // HANDLERS_H
