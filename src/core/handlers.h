#pragma once

#include <string>
#include <vector>
#include "statusCodes.h"

namespace ddrive {


using HandlerResult = std::pair<std::string, StatusCode>;

HandlerResult handlePost(const std::vector<std::string>& args);
HandlerResult handleGet(const std::vector<std::string>& args);
HandlerResult handleSearch(const std::vector<std::string>& args);
HandlerResult handleDelete(const std::vector<std::string>& args);

} // namespace ddrive
