#include "add.h"
#include "get.h"
#include <string>
#include <cstdlib>
#include "rle_fstream.h"

using namespace std;

void add(const string& file_name, const string& text)
{
    // open stream to file
    rle_fstream file(getenv("DOODLE_DRIVE_PATH"), file_name);

    // if file doesn't exist yet
    if (get(file_name) == nullopt) {
        // input text to stream
        file << text;
    }
}
