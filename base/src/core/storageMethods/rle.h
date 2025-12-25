#ifndef RLE_H
#define RLE_H

#include <string>

namespace storageMethods {
/**
 * @brief Encrypts a string using RLE.
 *
 * The function compresses sequences of identical characters into a Count-Character pair.
 * The count is stored as an unsigned char, limiting runs to UCHAR_MAX characters.
 *
 * @param text The input string to be compressed.
 * @return The compressed string.
 */
std::string rle_encrypt(const std::string& text);

/**
 * @brief Decrypts a string using RLE.
 *
 * The function decompresses the string by repeating each character based on the preceding count value.
 *
 * @param text The compressed string.
 * @return The decompressed string.
 */
std::string rle_decrypt(const std::string& text);

}
#endif // RLE_H