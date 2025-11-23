#include <gtest/gtest.h>
#include <cstdlib>
#include <string>
#include <fstream>
#include <filesystem>
#include "../src/add.h"
#include "../src/search.h"

/**
 * @brief Test looking for an empty string (should return all files)
 */
TEST(SearchTest, EmptyStringSearch) {
    add("testfile1", "This is a test file.");
    add("testfile2", "Another test file content.");
    std::string results = search("");

    // Check that both files are returned
    std::istringstream iss(results);
    std::string line;
    int count = 0;
    while (std::getline(iss, line)) {
        if (line == "testfile1" || line == "testfile2") {
            count++;
        }
    }
    ASSERT_EQ(count, 2);
}

/**
 * @brief Test searching for content that does not exist in any file
 */
TEST(SearchTest, TestNonExistantContent) {
    add("testfile3", "Unique content here.");
    std::string results = search("Does Not Exist");

    // Check that no files are returned
    ASSERT_TRUE(results.empty());
}
/**
 * @brief Test searching for content in an empty file
 */
TEST(SearchTest, TestEmptyFile) {
    add("emptyfile", "");
    std::string results = search("Some content");

    // Check that no files are returned
    ASSERT_TRUE(results.empty());
}
/**
 * @brief Test searching for content that exists in multiple files
 */
TEST(SearchTest, TestMultipleFileMatches) {
    add("file1", "Common content in file one.");
    add("file2", "Common content in file two.");
    std::string results = search("Common content");
    std::istringstream iss(results);
    std::string line;
    int count = 0;
    while (std::getline(iss, line)) {
        if (line == "file1" || line == "file2") {
            std::cout << line << std::endl;
            count++;
        }
    }
    ASSERT_EQ(count, 2);
}