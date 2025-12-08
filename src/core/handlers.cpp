#include "handlers.h"

#include "add.h"
#include "get.h"
#include "search.h"

#include <filesystem>

namespace ddrive {

HandlerResult handlePost(const std::vector<std::string>& args)
{

    (void)args;
    return {"", StatusCode::BadRequest};
}

HandlerResult handleGet(const std::vector<std::string>& args)
{

    (void)args;
    return {"", StatusCode::BadRequest};
}

HandlerResult handleSearch(const std::vector<std::string>& args)
{

    (void)args;
    return {"", StatusCode::BadRequest};
}

HandlerResult handleDelete(const std::vector<std::string>& args)
{

    (void)args;
    return {"", StatusCode::BadRequest};
}

} // namespace ddrive
