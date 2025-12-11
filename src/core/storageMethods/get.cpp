#include "get.h"
#include <string>
#include <cstdlib>
#include <optional>
#include "rle_fstream.h"

using namespace storageMethods;
using namespace std;

optional<string> get(const string& file_name)
{
    // open stream to file
    rle_fstream file(getenv("DOODLE_DRIVE_PATH"), file_name);

    // get text from stream
    optional<string> text;
    file >> text;
    return text;
}
