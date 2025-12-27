#include "../src/core/storage_methods/add.h"
#include "../src/core/storage_methods/search.h"

#include <gtest/gtest.h>
#include <cstdlib>
#include <string>
#include <fstream>
#include <filesystem>

using namespace storage_methods;

/**
 * @brief Test looking for an empty string (should return all files)
 */
TEST(SearchTest, EmptyStringSearch) {
    storage_methods::add("testfile1", "This is a test file.");
    storage_methods::add("testfile2", "Another test file content.");
    std::string results = storage_methods::search("");

    // Check that both files are returned
    std::istringstream iss(results);
    std::string word;
    int count = 0;
    while (iss >> word) {
        if (word == "testfile1" || word == "testfile2") {
            count++;
        }
    }
    ASSERT_EQ(count, 2);
}

/**
 * @brief Test searching for content that does not exist in any file
 */
TEST(SearchTest, TestNonExistantContent) {
    storage_methods::add("testfile3", "Unique content here.");
    std::string results = storage_methods::search("Does Not Exist");

    // Check that no files are returned
    ASSERT_TRUE(results.empty());
}
/**
 * @brief Test searching for content in an empty file
 */
TEST(SearchTest, TestEmptyFile) {
    storage_methods::add("emptyfile", "");
    std::string results = storage_methods::search("Some content");

    // Check that no files are returned
    ASSERT_TRUE(results.empty());
}
/**
 * @brief Test searching for content that exists in multiple files
 */
TEST(SearchTest, TestMultipleFileMatches) {
    storage_methods::add("file1", "Common content in file one.");
    storage_methods::add("file2", "Common content in file two.");
    std::string results = storage_methods::search("Common content");
    std::istringstream iss(results);
    std::string word;
    int count = 0;
    while (iss >> word) {
        if (word == "file1" || word == "file2") {
            count++;
        }
    }
    ASSERT_EQ(count, 2);
}