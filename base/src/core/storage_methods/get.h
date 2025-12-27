#ifndef DOODLE_DRIVE_GET_H
#define DOODLE_DRIVE_GET_H

#include <optional>
#include <string>

namespace storage_methods
{

    /**
     * @brief Retrieves content from a file using an rle_fstream.
     *
     * The base path for the data directory is read from the "DOODLE_DRIVE_PATH"
     * environment variable.
     *
     * @param file_name The name of the file to retrieve.
     * @return The string content of the file.
     */
    std::optional<std::string> get(const std::string& file_name);

}

#endif // DOODLE_DRIVE_GET_H
