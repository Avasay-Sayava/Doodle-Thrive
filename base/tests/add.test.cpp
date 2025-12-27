#include "../src/core/storage_methods/add.h"
#include "../src/core/storage_methods/get.h"
#include "../src/core/storage_methods/rle.h"

#include <cstdlib>
#include <filesystem>
#include <fstream>
#include <gtest/gtest.h>
#include <string>

using namespace storage_methods;

/**
 * @brief Test existence of a file added through add command
 */
TEST(AddFileTest, FileExists)
{
    // Create file
    storage_methods::add("MyFileForTesting_Exists", "content");

    const char* env = std::getenv("DOODLE_DRIVE_PATH");
    ASSERT_NE(env, nullptr); // Make sure env variable exists

    std::filesystem::path filePath =
        std::filesystem::path(env) / "MyFileForTesting_Exists";

    // Assert existence of the file
    EXPECT_TRUE(std::filesystem::exists(filePath));
}

/**
 * @brief Test correspondence to content added
 */
TEST(AddFileTest, CorrespondenceToEncryption)
{
    // Create the content of the file
    std::string content = "aaaaabbbbbbbbbbbbbbbb77788888888dddDDDDDDDDD";

    // Create file
    storage_methods::add("MyFileForTesting_Correspondence", content);

    // Assert existence of the env variable
    const char* env = std::getenv("DOODLE_DRIVE_PATH");
    ASSERT_NE(env, nullptr);

    std::filesystem::path filePath =
        std::filesystem::path(env) / "MyFileForTesting_Correspondence";

    // Assert existence of file
    ASSERT_TRUE(std::filesystem::exists(filePath));

    // Assert equality of the added content with the content of the file
    std::ifstream file(filePath, std::ios::binary);
    ASSERT_TRUE(file.is_open());

    std::string encrypted((std::istreambuf_iterator<char>(file)),
                          std::istreambuf_iterator<char>());

    std::string decrypted = rle_decrypt(encrypted);

    EXPECT_EQ(decrypted, content);
}

/**
 * @brief Test adding an empty file
 */
TEST(AddFileTest, TestEmptyFile)
{
    // Create an empty string to use as the content
    std::string content = "";

    // Add the file using the add function
    storage_methods::add("MyFileForTesting_Empty", content);

    // Get the env variable and make sure it exists
    const char* env = std::getenv("DOODLE_DRIVE_PATH");
    ASSERT_NE(env, nullptr);

    // Create the path to the file
    std::filesystem::path filePath =
        std::filesystem::path(env) / "MyFileForTesting_Empty";

    // Assert the file exists
    ASSERT_TRUE(std::filesystem::exists(filePath));

    // Assert that the file is empty
    std::ifstream file(filePath, std::ios::binary);
    ASSERT_TRUE(file.is_open());

    std::string encrypted((std::istreambuf_iterator<char>(file)),
                          std::istreambuf_iterator<char>());

    std::string decrypted = rle_decrypt(encrypted);

    EXPECT_EQ(decrypted, content);
}

/**
 * @brief Test adding two files with the same name
 */
TEST(AddFileTest, TestDuplicateFileNames)
{
    // Create content for the files
    std::string content1 = "First content";
    std::string content2 = "Second content";

    // Add the first file
    storage_methods::add("MyFileForTesting_Duplicate", content1);

    // Add the second file with the same name
    try
    {
        // Should not throw an exception. Should instead ignore the second add.
        storage_methods::add("MyFileForTesting_Duplicate", content2);
    }
    catch (const std::exception& e)
    {
        // If an exception is thrown, the test should fail
        FAIL() << "Exception thrown when adding duplicate file names: "
               << e.what();
    }
    // Get the file using get()
    std::string content =
        storage_methods::get("MyFileForTesting_Duplicate").value();
    EXPECT_EQ(content, content1);
}

/**
 * @brief Test adding two files with the same name when the first file is empty
 */
TEST(AddFileTest, TestDuplicateFileNames_EmptyFirst)
{
    // Create content for the files
    std::string content1 = "";
    std::string content2 = "Second content";

    // Add the first file
    storage_methods::add("MyFileForTesting_Duplicate_EmptyFirst", content1);

    // Add the second file with the same name
    try
    {
        // Should not throw an exception. Should instead ignore the second add.
        storage_methods::add("MyFileForTesting_Duplicate_EmptyFirst", content2);
    }
    catch (const std::exception& e)
    {
        // If an exception is thrown, the test should fail
        FAIL() << "Exception thrown when adding duplicate file names: "
               << e.what();
    }
    // Get the file using get()
    std::string content =
        storage_methods::get("MyFileForTesting_Duplicate_EmptyFirst").value();
    EXPECT_EQ(content, content1);
}
