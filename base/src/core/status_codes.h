#ifndef DOODLE_DRIVE_STATUS_CODES_H
#define DOODLE_DRIVE_STATUS_CODES_H

#include <string>

namespace ddrive
{

    /**
     * @brief Status codes for network responses.
     */
    enum class status_code
    {
        OK = 200,
        CREATED = 201,
        NO_CONTENT = 204,
        BAD_REQUEST = 400,
        NOT_FOUND = 404,
        INTERNAL_SERVER_ERROR = 500
    };

    /**
     * @brief Converts a status_code to its string representation.
     *
     * @param code The status_code to convert.
     * @return A string representing the status_code with a new line.
     */
    std::string code_to_string(status_code code);

} // namespace ddrive

#endif // DOODLE_DRIVE_STATUS_CODES_H
