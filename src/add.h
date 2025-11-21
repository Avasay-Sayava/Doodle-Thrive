#ifndef ADD_H
#define ADD_H

#include <string>

/**
 * @brief Saves text in a file using an rle_fstream.
 *
 * The base path for the data directory is read from the "DOODLE_DRIVE_PATH" environment variable.
 *
 * @param file_name The name of the file to create or overwrite.
 * @param text The plain text content to encrypt and store.
 */
void add(const std::string& file_name, const std::string& text);

#endif // ADD_H
