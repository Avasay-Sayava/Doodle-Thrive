#include <string>
#include "get.h"
#include "rle_fstream.h"

using namespace std;

string get(const string& file_name)
{
    // open stream to file
    rle_fstream file(getenv("DOODLE_DRIVE_PATH"), file_name);

    // get text from stream
    string text;
    file >> text;
    return text;
}
