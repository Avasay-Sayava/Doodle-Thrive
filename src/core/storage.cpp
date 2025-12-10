#include "storage.h"

#include "storageMethods/add.h"      // bool add_file(const std::string&, const std::string&)
#include "storageMethods/get.h"      // std::optional<std::string> get_file(const std::string&)
#include "storageMethods/search.h"   // std::vector<std::string> search_files(const std::string&)

#include <filesystem>

namespace ddrive {

bool Storage::add(const std::string& filename, const std::string& content)
{
    // Lock for thread safety
    std::scoped_lock lock(mtx);

    // Ex1 function — returns false if file already exists
    return add(filename, content);
}

std::optional<std::string> Storage::get(const std::string& filename) const
{
    std::scoped_lock lock(mtx);

    // Ex1 function — returns optional<string>
    return get(filename);
}

std::string Storage::search(const std::string& term) const
{
    std::scoped_lock lock(mtx);

    return search(term);
}

bool Storage::remove(const std::string& filename)
{
    // Empty implementation for TDD purposes
    return false;
}

} // namespace ddrive
