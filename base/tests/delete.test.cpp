#include "../src/core/storageMethods/add.h"
#include "../src/core/storageMethods/fdelete.h"

#include <cstdlib>
#include <filesystem>
#include <fstream>
#include <gtest/gtest.h>
#include <string>

using namespace storageMethods;

/**
 * @brief Test a simple deletion.
 */
TEST(DeleteFileTest, SimpleDelete)
{
    // Add a file with some data
    storageMethods::add("file1", "DATA");
    // Delete it and assert it was deleted
    bool deleted = storageMethods::fdelete("file1");
    EXPECT_TRUE(deleted);
    EXPECT_FALSE(std::filesystem::exists(
        std::filesystem::path(std::getenv("DOODLE_DRIVE_PATH")) / "file1"));
}

/**
 * @brief Test deleting a file that does not exist.
 */
TEST(DeleteFileTest, NonExistentFile)
{
    // Use the deletion function on a file that does not exist it should return
    // false
    bool deleted = storageMethods::fdelete("non_existent_file");
    EXPECT_FALSE(deleted);
}

/**
 * @brief Test deleting the same file twice.
 */
TEST(DelteFileTest, DeleteTwice)
{
    // Add a file
    storageMethods::add("file2", "DATA");
    // Try to delete it, the first time should work
    bool first_delete = storageMethods::fdelete("file2");
    // The second time should fail
    bool second_delete = storageMethods::fdelete("file2");
    EXPECT_TRUE(first_delete);
    // Assert that the file does not exist
    EXPECT_FALSE(std::filesystem::exists(
        std::filesystem::path(std::getenv("DOODLE_DRIVE_PATH")) / "file2"));
    EXPECT_FALSE(second_delete);
    // Add it again and delete it again
    storageMethods::add("file2", "DATA");
    bool third_delete = storageMethods::fdelete("file2");
    EXPECT_TRUE(third_delete);
    EXPECT_FALSE(std::filesystem::exists(
        std::filesystem::path(std::getenv("DOODLE_DRIVE_PATH")) / "file2"));
}
