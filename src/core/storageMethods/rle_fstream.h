#ifndef RLE_FSTREAM_H
#define RLE_FSTREAM_H

#include <optional>
#include <string>
#include <fstream>

/**
 * @brief A custom file stream operator warper that uses RLE.
 */
namespace storageMethods {
class rle_fstream
{
public:
    /**
     * @brief Constructs an rle_fstream object.
     *
     * @param file_path The path to the directory containing the file.
     * @param file_name The name of the file.
     */
    rle_fstream(const std::string& file_path, const std::string& file_name);

    /**
     * @brief Reads the entire contents of the file, decodes it using RLE decryption,
     * and stores the result in the provided string.
     *
     * @param str A reference to the string where the decrypted content will be stored.
     * @return A reference to itself.
     */
    rle_fstream& operator>>(std::optional<std::string>& str);

    /**
     * @brief Encrypts the provided string using RLE encryption and writes the
     * compressed data to the file.
     *
     * @param str The string containing the raw data to be encrypted and written.
     * @return A reference to itself.
     */
    rle_fstream& operator<<(const std::string& str);

private:
    std::fstream fstream;
    std::string path;
};
}
#endif // RLE_FSTREAM_H