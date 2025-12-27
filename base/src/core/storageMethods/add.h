#ifndef DOODLE_DRIVE_ADD_H
#define DOODLE_DRIVE_ADD_H

#include <string>

namespace storageMethods
{

    /**
     * @brief Saves text in a file using an rle_fstream.
     *
     * The base path for the data directory is read from the "DOODLE_DRIVE_PATH"
     * environment variable.
     *
     * @param file_name The name of the file to create or overwrite.
     * @param text The plain text content to encrypt and store.
     */
    bool add(const std::string& file_name, const std::string& text);

} // namespace storageMethods

#endif // DOODLE_DRIVE_ADD_H
