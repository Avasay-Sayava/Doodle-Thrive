#include "get.h"
#include "rle_fstream.h"

#include <cstdlib>

using namespace storageMethods;
using namespace std;

namespace storageMethods
{

    optional<string> get(const string& file_name)
    {
        // open stream to file
        rle_fstream file(getenv("DOODLE_DRIVE_PATH"), file_name);

        // get text from stream
        optional<string> text;
        file >> text;
        return text;
    }

} // namespace storageMethods
