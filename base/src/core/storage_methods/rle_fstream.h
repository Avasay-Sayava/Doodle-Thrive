#ifndef DOODLE_DRIVE_RLE_FSTREAM_H
#define DOODLE_DRIVE_RLE_FSTREAM_H

#include <fstream>
#include <optional>
#include <string>

namespace storage_methods
{

    /**
     * @brief A file stream wrapper that transparently handles RLE encryption/decryption.
     * 
     * This class abstracts the reading and writing of files, ensuring that data
     * is always stored in a compressed format on disk but handled as plain text
     * in memory.
     */
    class rle_fstream
    {
    public:
        /**
         * @brief Constructs the stream wrapper.
         *
         * @param file_path The directory path.
         * @param file_name The specific file name.
         */
        rle_fstream(const std::string& file_path, const std::string& file_name);

        /**
         * @brief Reads and decrypts the entire file content.
         *
         * Opens the file in binary mode, reads all content, decrypts it using RLE,
         * and stores it in the provided optional.
         *
         * @param str [out] Holds the decrypted content if read is successful, otherwise std::nullopt.
         * @return Reference to self for chaining.
         */
        rle_fstream& operator>>(std::optional<std::string>& str);

        /**
         * @brief Encrypts and writes content to the file.
         *
         * Encrypts the input string using RLE and writes the binary result to disk,
         * overwriting any existing content.
         *
         * @param str The plain text content to write.
         * @return Reference to self for chaining.
         */
        rle_fstream& operator<<(const std::string& str);

    private:
        std::fstream _fstream;
        std::string _path;
    };

} // namespace storage_methods

#endif // DOODLE_DRIVE_RLE_FSTREAM_H
