#include "fdelete.h"

#include <filesystem>

using namespace storage_methods;

namespace storage_methods
{

    bool fdelete(const std::string& file_name)
    {
        // Check if the file exists and delete it
        std::filesystem::path file_path =
            std::filesystem::path(std::getenv("DOODLE_DRIVE_PATH")) / file_name;
        if (std::filesystem::exists(file_path))
        {
            return std::filesystem::remove(file_path);
        }
        return false;
    }

} // namespace storage_methods
