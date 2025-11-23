#include "add.h"
#include <string>
#include <cstdlib>
#include "rle_fstream.h"

#include "rle_fstream.h"
using namespace std;

void add(const string& file_name, const string& text)
{
    // open stream to file
    rle_fstream file(getenv("DOODLE_DRIVE_PATH"), file_name);

    // input text to stream
    file << text;
}
