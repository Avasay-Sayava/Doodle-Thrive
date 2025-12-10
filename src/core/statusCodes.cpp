#include "statusCodes.h"

namespace ddrive {

constexpr std::string_view codeToString(StatusCode code)
{
    switch (code) {
        case StatusCode::Ok:
            return "200 OK\n";
        case StatusCode::Created:
            return "201 Created\n";
        case StatusCode::NoContent:
            return "204 No Content\n";
        case StatusCode::BadRequest:
            return "400 Bad Request\n";
        case StatusCode::NotFound:
            return "404 Not Found\n";
        case StatusCode::InternalServerError:
            return "500 Internal Server Error\n";
        default:
            return "500 Internal Server Error\n";
    }
}

} // namespace ddrive
