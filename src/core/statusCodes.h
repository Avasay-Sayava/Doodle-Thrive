#ifndef STATUSCODES_H
#define STATUSCODES_H

#include <string>

namespace ddrive {

/**
 * @brief Status codes for network responses.
 */
enum class StatusCode {
    Ok = 200,
    Created = 201,
    NoContent = 204,
    BadRequest = 400,
    NotFound = 404,
    InternalServerError = 500
};

/**
 * @brief Converts a StatusCode to its string representation.
 *
 * @param code The StatusCode to convert.
 * @return A string representing the StatusCode with a new line.
 */
std::string codeToString(StatusCode code);


} // namespace ddrive

#endif // STATUSCODES_H
