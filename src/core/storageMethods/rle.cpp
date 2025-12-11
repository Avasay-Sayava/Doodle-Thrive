#include <string>
#include <climits>
#include "rle.h"

using namespace storageMethods;
using namespace std;

string rle_encrypt(const string& text)
{
    // empty edge case
    if (text.empty()) return text;

    // init values
    string encrypted;
    char last = text[0];
    unsigned char count = 1;

    // compression loop
    for (size_t i = 1; i <= text.length(); ++i)
    {
        // if in a char sequence. don't compress '\1'
        if (text[i] == last && count + 1 <= UCHAR_MAX)
        {
            count++;
        }
        // stop the char sequence
        else
        {
            encrypted.push_back(static_cast<char>(count));
            encrypted.push_back(last);

            // update last
            last = text[i];

            // reset count
            count = 1;
        }
    }

    return encrypted;
}

string rle_decrypt(const string& text)
{
    // empty edge case
    if (text.empty()) return text;

    // init value
    string decrypted;

    // decompression loop
    for (size_t i = 0; i < text.length(); i += 2)
    {
        // for every compressed sequence decompress the sequence
        for (unsigned char j = static_cast<unsigned char>(text.substr(i, 1)[0]); j > 0; --j)
        {
            decrypted.push_back(text[i + 1]);
        }
    }

    return decrypted;
}
