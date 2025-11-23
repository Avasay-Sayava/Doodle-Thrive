#include "search.h"
#include "rle_fstream.h"
#include "get.h"
#include <cstdlib>
#include <sstream>
#include <filesystem>
#include <fstream>

using namespace std;
using namespace std::filesystem;

string search(const std::string& content) {
    const char* env = std::getenv("DOODLE_DRIVE_PATH");
    // If environment variable does not exist, return an empty string.
    if (!env) return "";

    path directory = env;
    if (!exists(directory) || !is_directory(directory)) return "";

    std::string result = "";

    for (const auto& entry : directory_iterator(directory)) {
        if (!is_regular_file(entry.path())) continue;

        std::string file_name = entry.path().filename().string();

        std::string file_content = get(file_name);
        if (file_content.find(content) == std::string::npos) {
            // The file does not contain "content"
            continue;
        }
        // The file contains "content"
        result += file_name + "\n";
    }
    return result;
}