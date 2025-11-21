#include <gtest/gtest.h>
#include <cstdlib>
#include "rle.h"
#include "../src/add.h"
#include <filesystem>

TEST(AddFileTest, FileExists) {
    // Call the function that should create the file
    add("MyFileForTesting", "content");

    const char* env = std::getenv("DOODLE_DRIVE_DATA_PATH");
    ASSERT_NE(env, nullptr); // Ensure env variable exists

    std::filesystem::path filePath = std::filesystem::path(env) / "MyFileForTesting";

    EXPECT_TRUE(std::filesystem::exists(filePath));
}

TEST(AddFileTest, CorrespondenceToEncryption) {
    std::string content = "aaaaabbbbbbbbbbbbbbbb77788888888dddDDDDDDDDD";
    add("MyFileForTesting2", content);

    const char* env = std::getenv("DOODLE_DRIVE_DATA_PATH");
    ASSERT_NE(env, nullptr);

    std::filesystem::path filePath = std::filesystem::path(env) / "MyFileForTesting2";

    // Ensure the file exists
    ASSERT_TRUE(std::filesystem::exists(filePath));

    // Read the file
    std::ifstream file(filePath, std::ios::binary);
    ASSERT_TRUE(file.is_open());

    std::string encrypted(
        (std::istreambuf_iterator<char>(file)),
        std::istreambuf_iterator<char>()
    );

    // Decrypt and compare
    std::string decrypted = rle_decrypt(encrypted);

    EXPECT_EQ(decrypted, content);
}
TEST(AddFileTest, TestEmptyFile) {
    std::string content = "";
    add("MyFileForTesting2", content);

    const char* env = std::getenv("DOODLE_DRIVE_DATA_PATH");
    ASSERT_NE(env, nullptr);

    std::filesystem::path filePath = std::filesystem::path(env) / "MyFileForTesting2";

    // Ensure the file exists
    ASSERT_TRUE(std::filesystem::exists(filePath));

    // Read the file
    std::ifstream file(filePath, std::ios::binary);
    ASSERT_TRUE(file.is_open());

    std::string encrypted(
        (std::istreambuf_iterator<char>(file)),
        std::istreambuf_iterator<char>()
    );

    // Decrypt and compare
    std::string decrypted = rle_decrypt(encrypted);

    EXPECT_EQ(decrypted, content);
}
