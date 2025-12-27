#include "status_codes.h"

namespace ddrive
{

    std::string code_to_string(status_code code)
    {
        switch (code)
        {
        case status_code::OK:
            return "200 Ok\n";
        case status_code::CREATED:
            return "201 Created\n";
        case status_code::NO_CONTENT:
            return "204 No Content\n";
        case status_code::BAD_REQUEST:
            return "400 Bad Request\n";
        case status_code::NOT_FOUND:
            return "404 Not Found\n";
        default:
            return "500 Internal Server Error\n"; // Fallback for unknown codes
        }
    }

} // namespace ddrive
