#ifndef DOODLE_DRIVE_HANDLERS_H
#define DOODLE_DRIVE_HANDLERS_H

#include "status_codes.h"
#include "storage.h"

#include <string>
#include <vector>

namespace ddrive
{

    /**
     * @brief Processes a POST request to create a new file.
     * 
     * Validates the argument count and filename format. If valid, attempts to 
     * create the file in storage.
     * 
     * @param args The tokenized command arguments (e.g. ["POST", "filename", "content"]).
     * @param storage The storage instance to execute the operation on.
     * @return A formatted response string (e.g. "201 Created\n").
     */
    std::string handle_post(const std::vector<std::string>& args,
                           storage& storage);

    /**
     * @brief Processes a GET request to retrieve file content.
     * 
     * @param args The tokenized command arguments (e.g. ["GET", "filename"]).
     * @param storage The storage instance to execute the operation on.
     * @return A formatted response containing the file content or an error code.
     */
    std::string handle_get(const std::vector<std::string>& args,
                          storage& storage);

    /**
     * @brief Processes a SEARCH request to find files containing a specific string.
     * 
     * @param args The tokenized command arguments (e.g. ["SEARCH", "query"]).
     * @param storage The storage instance to execute the operation on.
     * @return std::string A formatted response listing matching filenames.
     */
    std::string handle_search(const std::vector<std::string>& args,
                             storage& storage);

    /**
     * @brief Processes a DELETE request to remove a file.
     * 
     * @param args The tokenized command arguments (e.g. ["DELETE", "filename"]).
     * @param storage The storage instance to execute the operation on.
     * @return A formatted response indicating success or failure.
     */
    std::string handle_delete(const std::vector<std::string>& args,
                             storage& storage);

} // namespace ddrive

#endif // DOODLE_DRIVE_HANDLERS_H
