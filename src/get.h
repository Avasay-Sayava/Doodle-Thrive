#ifndef GET_H
#define GET_H

#include <string>

/**
 * @brief Retrieves content from a file using an rle_fstream.
 *
 * The base path for the data directory is read from the "DOODLE_DRIVE_DATA_PATH" environment variable.
 *
 * @param file_name The name of the file to retrieve.
 * @return The string content of the file.
 */
std::string get(const std::string& file_name);

#endif // GET_H