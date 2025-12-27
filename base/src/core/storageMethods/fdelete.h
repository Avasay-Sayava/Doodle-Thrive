#ifndef DOODLE_DRIVE_FDELETE_H
#define DOODLE_DRIVE_FDELETE_H

#include <string>

namespace storageMethods
{

    /**
     * @brief Deletes the file with the specified name.
     * @param file_name The name of the file to delete.
     * @return true if the file was successfully deleted, false otherwise.
     */
    bool fdelete(const std::string& file_name);

} // namespace storageMethods

#endif // DOODLE_DRIVE_FDELETE_H
