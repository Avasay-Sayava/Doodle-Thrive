#include <gtest/gtest.h>
#include <cstdlib>
#include <string>
#include <fstream>
#include <filesystem>
#include "../src/core/storageMethods/add.h"
#include "../src/core/storageMethods/search.h"

using namespace storageMethods;
/**
 * @brief Test looking for an empty string (should return all files)
 */
TEST(SearchTest, EmptyStringSearch) {
    storageMethods::add("testfile1", "This is a test file.");
    storageMethods::add("testfile2", "Another test file content.");
    std::string results = storageMethods::search("");

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
    storageMethods::add("testfile3", "Unique content here.");
    std::string results = storageMethods::search("Does Not Exist");

    // Check that no files are returned
    ASSERT_TRUE(results.empty());
}
/**
 * @brief Test searching for content in an empty file
 */
TEST(SearchTest, TestEmptyFile) {
    storageMethods::add("emptyfile", "");
    std::string results = storageMethods::search("Some content");

    // Check that no files are returned
    ASSERT_TRUE(results.empty());
}
/**
 * @brief Test searching for content that exists in multiple files
 */
TEST(SearchTest, TestMultipleFileMatches) {
    storageMethods::add("file1", "Common content in file one.");
    storageMethods::add("file2", "Common content in file two.");
    std::string results = storageMethods::search("Common content");
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