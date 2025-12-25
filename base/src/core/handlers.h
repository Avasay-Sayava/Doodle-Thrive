#ifndef HANDLERS_H
#define HANDLERS_H

#include <string>
#include <vector>
#include "statusCodes.h"
#include "storage.h"

namespace ddrive {

/**
 * @brief Handle POST command.
 */
std::string handlePost(const std::vector<std::string>& args, Storage& storage);

/**
 * @brief Handle GET command.
 */
std::string handleGet(const std::vector<std::string>& args, Storage& storage);

/**
 * @brief Handle SEARCH command.
 */
std::string handleSearch(const std::vector<std::string>& args, Storage& storage);

/**
 * @brief Handle DELETE command.
 */
std::string handleDelete(const std::vector<std::string>& args, Storage& storage);

} // namespace ddrive

#endif // HANDLERS_H
