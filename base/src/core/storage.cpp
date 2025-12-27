#include "storage.h"

#include "./storage_methods/add.h"
#include "./storage_methods/fdelete.h"
#include "./storage_methods/get.h"
#include "./storage_methods/search.h"

#include <filesystem>

namespace ddrive
{

    bool storage::add(const std::string& filename, const std::string& content)
    {
        // Lock for thread safety
        std::scoped_lock lock(_mtx);

        // Ex1 function — returns false if file already exists
        return storage_methods::add(filename, content);
    }

    std::optional<std::string> storage::get(const std::string& filename) const
    {
        std::scoped_lock lock(_mtx);

        // Ex1 function — returns optional<string>
        return storage_methods::get(filename);
    }

    std::string storage::search(const std::string& term) const
    {
        std::scoped_lock lock(_mtx);

        return storage_methods::search(term);
    }

    bool storage::remove(const std::string& filename)
    {
        std::scoped_lock lock(_mtx);
        return storage_methods::fdelete(filename);
    }

} // namespace ddrive
