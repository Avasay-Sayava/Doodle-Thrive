#ifndef DOODLE_DRIVE_SEARCH_H
#define DOODLE_DRIVE_SEARCH_H

#include <string>

namespace storageMethods
{
    /**
     * @brief Search for files containing specific content
     *
     * @param content The content to search
     */
    std::string search(const std::string& content);

} // namespace storageMethods

#endif // DOODLE_DRIVE_SEARCH_H
