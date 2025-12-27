#include "statusCodes.h"

namespace ddrive
{

    std::string codeToString(StatusCode code)
    {
        switch (code)
        {
        case StatusCode::Ok:
            return "200 Ok\n";
        case StatusCode::Created:
            return "201 Created\n";
        case StatusCode::NoContent:
            return "204 No Content\n";
        case StatusCode::BadRequest:
            return "400 Bad Request\n";
        case StatusCode::NotFound:
            return "404 Not Found\n";
        default:
            return "500 Internal Server Error\n"; // Fallback for unknown codes
        }
    }

} // namespace ddrive
