/**
 * @file tests_get.cpp
 * @brief Tests for the get() function, ensuring it retrieves and decodes files correctly.
 *
 * These tests verify: basic retrieval, empty files, complex content,
 * missing files, and independence between multiple stored files.
 */

#include <gtest/gtest.h>
#include <cstdlib>
#include <string>
#include <fstream>
#include <filesystem>

#include "../src/add.h"
#include "../src/get.h"
#include "../src/rle.h"   


/**
 * @brief Ensures get() returns the exact content previously stored by add().
 */
TEST(GetFileTest, GetReturnsSameContentAsAddStored) {
    // Write a file using add, then check get reads the same content.
    std::string content = "aaaaabbbbbbbbbbbbbbbb77788888888dddDDDDDDDDD";

    add("TestFile", content);

    const char* env = std::getenv("DOODLE_DRIVE_PATH");
    ASSERT_NE(env, nullptr);

    std::filesystem::path filePath =
        std::filesystem::path(env) / "TestFile";

    ASSERT_TRUE(std::filesystem::exists(filePath));

    std::string result = get("TestFile");

    EXPECT_EQ(result, content);  // Should match exactly
}

/**
 * @brief Verifies that get() correctly handles files containing empty content.
 */
TEST(GetFileTest, GetReturnsEmptyForEmptyFileCreatedByAdd) {
    // Store an empty string and make sure get returns an empty string.
    std::string content = "";

    add("MyFileForTesting_GetEmpty", content);

    const char* env = std::getenv("DOODLE_DRIVE_PATH");
    ASSERT_NE(env, nullptr);

    std::filesystem::path filePath =
        std::filesystem::path(env) / "MyFileForTesting_GetEmpty";

    ASSERT_TRUE(std::filesystem::exists(filePath));

    std::string result = get("MyFileForTesting_GetEmpty");

    EXPECT_EQ(result, content);  // Should be an empty string
}

/**
 * @brief Confirms that get() can decode complex text (spaces, punctuation, newlines).
 */
TEST(GetFileTest, GetHandlesComplexContent) {
    // Check that special characters and newlines survive the RLE.
    std::string content = "Hello  World!! 777\nNewLineHere\nEND";

    add("MyFileForTesting_GetComplex", content);

    const char* env = std::getenv("DOODLE_DRIVE_PATH");
    ASSERT_NE(env, nullptr);

    std::filesystem::path filePath =
        std::filesystem::path(env) / "MyFileForTesting_GetComplex";

    ASSERT_TRUE(std::filesystem::exists(filePath));

    std::string result = get("MyFileForTesting_GetComplex");

    EXPECT_EQ(result, content);  // Must match exactly
}

/**
 * @brief Checks that get() returns an empty string when the requested file does not exist.
 */
TEST(GetFileTest, GetReturnsEmptyStringForMissingFile) {
    // Ensure the file doesnt exist, then call get().
    const char* env = std::getenv("DOODLE_DRIVE_PATH");
    ASSERT_NE(env, nullptr);

    std::filesystem::path filePath =
        std::filesystem::path(env) / "TestFile";

    if (std::filesystem::exists(filePath)) {
        std::filesystem::remove(filePath);
    }

    std::string result = get("TestFile");

    EXPECT_EQ(result, "");  // Should return an empty string
}

/**
 * @brief Ensures get() retrieves the correct file when multiple files exist.
 */
TEST(GetFileTest, MultipleFilesIndependence) {
    // Make sure two different files dont interfere with each other.
    std::string content1 = "First file content AAAA";
    std::string content2 = "Second file content BBBB";

    add("MyFileForTesting_GetMulti1", content1);
    add("MyFileForTesting_GetMulti2", content2);

    EXPECT_EQ(get("MyFileForTesting_GetMulti1"), content1);
    EXPECT_EQ(get("MyFileForTesting_GetMulti2"), content2);
}
