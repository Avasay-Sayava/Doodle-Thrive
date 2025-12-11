#include "storage.h"

#include "storageMethods/add.h"
#include "storageMethods/get.h" 
#include "storageMethods/search.h"  
#include "storageMethods/fdelete.h" 
#include <filesystem>

namespace ddrive {

bool Storage::add(const std::string& filename, const std::string& content)
{
    // Lock for thread safety
    std::scoped_lock lock(mtx);

    // Ex1 function — returns false if file already exists
    return storageMethods::add(filename, content);
}

std::optional<std::string> Storage::get(const std::string& filename) const
{
    std::scoped_lock lock(mtx);

    // Ex1 function — returns optional<string>
    return storageMethods::get(filename);
}

std::string Storage::search(const std::string& term) const
{
    std::scoped_lock lock(mtx);

    return storageMethods::search(term);
}

bool Storage::remove(const std::string& filename)
{
    std::scoped_lock lock(mtx);
    return storageMethods::fdelete(filename);
}

} // namespace ddrive
