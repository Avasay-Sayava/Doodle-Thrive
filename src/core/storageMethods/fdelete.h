#ifndef FDELETE_H
#define FDELETE_H

#include <filesystem>
#include <string>

/**
 * @brief Deletes the file with the specified name.
 * @param file_name The name of the file to delete.
 * @return true if the file was successfully deleted, false otherwise.
 */
namespace storageMethods {
bool fdelete(const std::string& file_name);
}

#endif