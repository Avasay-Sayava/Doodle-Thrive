#ifndef STORAGE_H
#define STORAGE_H

#include <string>
#include <optional>
#include <vector>
#include <mutex>

namespace ddrive {

/**
 * @brief Thread-safe storage layer that wraps Ex1 file operations.
 *
 * This class provides the POST/GET/SEARCH/DELETE operations.
 * Internally it protects file operations using a mutex to ensure thread safety
 * when multiple client threads access the filesystem.
 */
class Storage {
public:
    /**
     * @brief Add a new file with the given content.
     *
     * @param filename The file name.
     * @param content file contents.
     * @return true if file was created false if file already exists.
     */
    bool add(const std::string& filename, const std::string& content);

    /**
     * @brief Retrieve the contents of a file.
     *
     * @param filename The file name.
     * @return File content if exists otherwise nullpt.
     */
    std::optional<std::string> get(const std::string& filename) const;

    /**
     * @brief Search for files by content or filename.
     *
     * @param term The search term.
     * @return List of matching filenames.
     */
    std::vector<std::string> search(const std::string& term) const;

    /**
     * @brief Delete a file.
     *
     * @param filename The name of the file to delete.
     * @return true if file existed and was deleted false otherwise.
     */
    bool remove(const std::string& filename);

private:
    mutable std::mutex mtx; // Protects all file operations.
};

} // namespace ddrive

#endif // STORAGE_H
