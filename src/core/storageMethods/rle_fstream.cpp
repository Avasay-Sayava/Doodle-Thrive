#include "rle_fstream.h"
#include "rle.h"

#include <fstream>
#include <string>
#include <streambuf>
#include <optional>

using namespace storageMethods;
using namespace std;

rle_fstream::rle_fstream(const string& file_path, const string& file_name)
{
    // save the full file path
    path = file_path + file_name;
}

rle_fstream& rle_fstream::operator>>(optional<string>& str)
{
    // if the path was initialized
    if (!path.empty())
    {
        // open warped fstream (input binary mode)
        fstream.open(path, ios_base::in | ios_base::binary);

        // ensure fstream has opened
        if (fstream.is_open())
        {
            // input the file content into str
            const string content((istreambuf_iterator<char>(fstream)), istreambuf_iterator<char>());
            str = rle_decrypt(content);
            fstream.close();
        }
    } else {
        str = nullopt;
    }

    // return itself for chain calls
    return *this;
}

rle_fstream& rle_fstream::operator<<(const string& str)
{
    // if the path was initialized
    if (!path.empty())
    {
        // open warped fstream (input binary mode)
        fstream.open(path, ios_base::out | ios_base::binary);

        // ensure fstream has opened
        if (fstream.is_open())
        {
            // output the str content into the file
            fstream << rle_encrypt(str);
            fstream.close();
        }
    }

    // return itself for chain calls
    return *this;
}
