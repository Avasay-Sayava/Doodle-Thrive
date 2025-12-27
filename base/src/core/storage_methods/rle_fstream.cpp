#include "rle_fstream.h"
#include "rle.h"

#include <streambuf>

using namespace storage_methods;
using namespace std;

namespace storage_methods
{

    rle_fstream::rle_fstream(const string& file_path, const string& file_name)
    {
        // save the full file path
        _path = file_path + file_name;
    }

    rle_fstream& rle_fstream::operator>>(optional<string>& str)
    {
        // if the path was initialized
        if (!_path.empty())
        {
            // open warped fstream (input binary mode)
            _fstream.open(_path, ios_base::in | ios_base::binary);

            // ensure fstream has opened
            if (_fstream.is_open())
            {
                // input the file content into str
                const string content((istreambuf_iterator<char>(_fstream)),
                                     istreambuf_iterator<char>());
                str = rle_decrypt(content);
                _fstream.close();
            }
        }
        else
        {
            str = nullopt;
        }

        // return itself for chain calls
        return *this;
    }

    rle_fstream& rle_fstream::operator<<(const string& str)
    {
        // if the path was initialized
        if (!_path.empty())
        {
            // open warped fstream (input binary mode)
            _fstream.open(_path, ios_base::out | ios_base::binary);

            // ensure fstream has opened
            if (_fstream.is_open())
            {
                // output the str content into the file
                _fstream << rle_encrypt(str);
                _fstream.close();
            }
        }

        // return itself for chain calls
        return *this;
    }

} // namespace storage_methods
