#ifndef DOODLE_DRIVE_RLE_H
#define DOODLE_DRIVE_RLE_H

#include <string>

namespace storage_methods
{

    /**
     * @brief Compresses a string using Run-Length Encoding (RLE).
     *
     * Compresses sequences of identical characters into a Count-Character pair.
     * The count is stored as a raw byte (unsigned char), limiting single runs
     * to 255 characters.
     *
     * @param text The input string to compress.
     * @return The compressed binary string.
     */
    std::string rle_encrypt(const std::string& text);

    /**
     * @brief Decompresses an RLE-encoded string.
     *
     * Reads Count-Character pairs and expands them back to the original string.
     *
     * @param text The compressed binary string.
     * @return The original plain text string.
     */
    std::string rle_decrypt(const std::string& text);

} // namespace storage_methods

#endif // DOODLE_DRIVE_RLE_H
