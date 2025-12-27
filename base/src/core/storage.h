#ifndef DOODLE_DRIVE_STORAGE_H
#define DOODLE_DRIVE_STORAGE_H

#include <mutex>
#include <optional>
#include <string>
#include <vector>

namespace ddrive
{

    /**
     * @brief Thread-safe storage layer acting as the high-level Model.
     *
     * Wraps the low-level file operations (POST/GET/SEARCH/DELETE).
     * Uses a mutex to ensure that concurrent access from multiple client
     * threads does not cause race conditions on the filesystem or internal
     * state.
     */
    class storage
    {
    public:
        /**
         * @brief Attempts to create a new file with the given content.
         *
         * @param filename The unique name of the file.
         * @param content The text content to store.
         * @return If the file was successfully created.
         */
        bool add(const std::string& filename, const std::string& content);

        /**
         * @brief Retrieves the contents of an existing file.
         *
         * @param filename The name of the file to read.
         * @return Contains the file content if found, otherwise nullopt.
         */
        std::optional<std::string> get(const std::string& filename) const;

        /**
         * @brief Searches for files containing the specified term.
         *
         * @param term The substring to search for within all stored files.
         * @return A newline-separated or space-separated list of matching
         * filenames.
         */
        std::string search(const std::string& term) const;

        /**
         * @brief Deletes a file from storage.
         *
         * @param filename The name of the file to remove.
         * @return If the file existed and was deleted.
         */
        bool remove(const std::string& filename);

    private:
        mutable std::mutex _mtx;
    };

} // namespace ddrive

#endif // DOODLE_DRIVE_STORAGE_H
