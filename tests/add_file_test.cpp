#include <gtest/gtest.h>
#include <cstdlib>
#include <string>
#include <fstream>
#include <filesystem>
#include "../src/rle.h"
#include "../src/add.h"

TEST(AddFileTest, FileExists) {
    // Create file
    add("MyFileForTesting_Exists", "content");

    const char* env = std::getenv("DOODLE_DRIVE_PATH");
    ASSERT_NE(env, nullptr); // Make sure env variable exists

    std::filesystem::path filePath = std::filesystem::path(env) / "MyFileForTesting_Exists";

    // Assert existance of the file
    EXPECT_TRUE(std::filesystem::exists(filePath));
}

TEST(AddFileTest, CorrespondenceToEncryption) {
    std::string content = "aaaaabbbbbbbbbbbbbbbb77788888888dddDDDDDDDDD";

    add("MyFileForTesting_Correspondence", content);

    const char* env = std::getenv("DOODLE_DRIVE_PATH");
    ASSERT_NE(env, nullptr);

    std::filesystem::path filePath = std::filesystem::path(env) / "MyFileForTesting_Correspondence";

    ASSERT_TRUE(std::filesystem::exists(filePath));

    std::ifstream file(filePath, std::ios::binary);
    ASSERT_TRUE(file.is_open());

    std::string encrypted(
        (std::istreambuf_iterator<char>(file)),
        std::istreambuf_iterator<char>()
    );

    std::string decrypted = rle_decrypt(encrypted);

    EXPECT_EQ(decrypted, content);
}

TEST(AddFileTest, TestEmptyFile) {
    // Create an empty string to use as the content
    std::string content = "";

    // Add the file using the add function
    add("MyFileForTesting_Empty", content);

    // Get the env variable and make sure it exists
    const char* env = std::getenv("DOODLE_DRIVE_PATH");
    ASSERT_NE(env, nullptr);

    // Create the path to the file
    std::filesystem::path filePath = std::filesystem::path(env) / "MyFileForTesting_Empty";

    // Assert the file exists
    ASSERT_TRUE(std::filesystem::exists(filePath));

    // Assert that the file is empty
    std::ifstream file(filePath, std::ios::binary);
    ASSERT_TRUE(file.is_open());

    std::string encrypted(
        (std::istreambuf_iterator<char>(file)),
        std::istreambuf_iterator<char>()
    );

    std::string decrypted = rle_decrypt(encrypted);

    EXPECT_EQ(decrypted, content);
}
