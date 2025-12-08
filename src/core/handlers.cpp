#include "handlers.h"

#include "storageMethods/add.h"
#include "storageMethods/get.h"
#include "storageMethods/search.h"

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
