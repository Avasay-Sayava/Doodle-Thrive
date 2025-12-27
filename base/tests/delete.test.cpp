#include "../src/core/storage_methods/add.h"
#include "../src/core/storage_methods/fdelete.h"

#include <cstdlib>
#include <filesystem>
#include <fstream>
#include <gtest/gtest.h>
#include <string>

using namespace storage_methods;

/**
 * @brief Test a simple deletion.
 */
TEST(DeleteFileTest, SimpleDelete)
{
    // Add a file with some data
    storage_methods::add("file1", "DATA");
    // Delete it and assert it was deleted
    bool deleted = storage_methods::fdelete("file1");
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
    bool deleted = storage_methods::fdelete("non_existent_file");
    EXPECT_FALSE(deleted);
}

/**
 * @brief Test deleting the same file twice.
 */
TEST(DeleteFileTest, DeleteTwice)
{
    // Add a file
    storage_methods::add("file2", "DATA");
    // Try to delete it, the first time should work
    bool first_delete = storage_methods::fdelete("file2");
    // The second time should fail
    bool second_delete = storage_methods::fdelete("file2");
    EXPECT_TRUE(first_delete);
    // Assert that the file does not exist
    EXPECT_FALSE(std::filesystem::exists(
        std::filesystem::path(std::getenv("DOODLE_DRIVE_PATH")) / "file2"));
    EXPECT_FALSE(second_delete);
    // Add it again and delete it again
    storage_methods::add("file2", "DATA");
    bool third_delete = storage_methods::fdelete("file2");
    EXPECT_TRUE(third_delete);
    EXPECT_FALSE(std::filesystem::exists(
        std::filesystem::path(std::getenv("DOODLE_DRIVE_PATH")) / "file2"));
}
