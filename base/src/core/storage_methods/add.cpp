#include "add.h"
#include "get.h"
#include "rle_fstream.h"

#include <cstdlib>

using namespace storage_methods;
using namespace std;

namespace storage_methods
{

    bool add(const string& file_name, const string& text)
    {
        // open stream to file
        rle_fstream file(getenv("DOODLE_DRIVE_PATH"), file_name);

        // if file doesn't exist yet
        if (get(file_name) == nullopt)
        {
            // input text to stream
            file << text;
            return true;
        }

        return false;
    }

} // namespace storage_methods
