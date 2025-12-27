#ifndef DOODLE_DRIVE_SEARCH_H
#define DOODLE_DRIVE_SEARCH_H

#include <string>

namespace storage_methods
{
    /**
     * @brief Search for files containing specific content
     *
     * @param content The content to search
     */
    std::string search(const std::string& content);

} // namespace storage_methods

#endif // DOODLE_DRIVE_SEARCH_H
