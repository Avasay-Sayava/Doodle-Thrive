/**
 * @brief Tests for the CLI command parsing (cli_command).
 *
 * These tests verify that the CLI:
 *  - Accepts only valid commands (add/get/search) with exact format.
 *  - Rejects all other commands, bad spacing, and invalid arguments.
 *  - Properly parses the arguments for each command.
 */

#include <gtest/gtest.h>
#include <string>
#include <vector>

#include "../src/cli.h"

/**
 * @brief Ensures a simple valid add command is parsed correctly.
 */
TEST(CLICommandTest, AddCommand_ValidSimple) {
    std::string command = "add MyFile Hello";
    std::vector<std::string> args = CLI::cli_command(command);

    ASSERT_EQ(args.size(), 3u);
    EXPECT_EQ(args[0], "add");
    EXPECT_EQ(args[1], "MyFile");
    EXPECT_EQ(args[2], "Hello");
}

/**
 * @brief Ensures add command parses content with spaces correctly.
 */
TEST(CLICommandTest, AddCommand_ContentWithSpaces) {
    std::string command = "add MyFile This is some content";
    std::vector<std::string> args = CLI::cli_command(command);

    ASSERT_EQ(args.size(), 3u);
    EXPECT_EQ(args[0], "add");
    EXPECT_EQ(args[1], "MyFile");
    EXPECT_EQ(args[2], "This is some content");
}

/**
 * @brief Ensures add command supports empty content.
 *
 * The filename cant be empty, but the content may be.
 */
TEST(CLICommandTest, AddCommand_EmptyContentAllowed) {
    std::string command = "add MyFile ";
    std::vector<std::string> args = CLI::cli_command(command);

    ASSERT_EQ(args.size(), 3u);
    EXPECT_EQ(args[0], "add");
    EXPECT_EQ(args[1], "MyFile");
    EXPECT_EQ(args[2], "");  
}

/**
 * @brief Ensures add command rejects missing filename or content.
 */
TEST(CLICommandTest, AddCommand_MissingArgsInvalid) {
    EXPECT_TRUE(CLI::cli_command("add").empty());

    EXPECT_TRUE(CLI::cli_command("add MyFile").empty());
}

/**
 * @brief Ensures add command rejects filenames containing spaces.
 */
TEST(CLICommandTest, AddCommand_FilenameWithSpacesInvalid) {
    std::string command = "add My File somecontent";
    std::vector<std::string> args = CLI::cli_command(command);

    EXPECT_TRUE(args.empty());
}

/**
 * @brief Ensures add command rejects extra / weird spacing.
 */
TEST(CLICommandTest, AddCommand_ExtraSpacesInvalid) {

    EXPECT_TRUE(CLI::cli_command(" add MyFile SomeContent").empty());

    EXPECT_TRUE(CLI::cli_command("add  MyFile SomeContent").empty());

    EXPECT_TRUE(CLI::cli_command("add MyFile SomeContent  ").empty());
}

/**
 * @brief Ensures get command args are understood correctly.
 */
TEST(CLICommandTest, GetCommand_Valid) {
    std::string command = "get MyFile";
    std::vector<std::string> args = CLI::cli_command(command);

    ASSERT_EQ(args.size(), 2u);
    EXPECT_EQ(args[0], "get");
    EXPECT_EQ(args[1], "MyFile");
}

/**
 * @brief Ensures get command rejects missing or extra arguments.
 */
TEST(CLICommandTest, GetCommand_InvalidFormats) {

    EXPECT_TRUE(CLI::cli_command("get").empty());


    EXPECT_TRUE(CLI::cli_command("get MyFile Extra").empty());

    EXPECT_TRUE(CLI::cli_command(" get MyFile").empty());
    EXPECT_TRUE(CLI::cli_command("get  MyFile").empty());
}

/**
 * @brief Ensures get command args are understood correctly.
 */
TEST(CLICommandTest, SearchCommand_ValidWithSpacesInTerm) {
    std::string command = "search some term with spaces";
    std::vector<std::string> args = CLI::cli_command(command);

    ASSERT_EQ(args.size(), 2u);
    EXPECT_EQ(args[0], "search");
    EXPECT_EQ(args[1], "some term with spaces");
}

/**
 * @brief Ensures search command rejects missing term or bad spacing.
 */
TEST(CLICommandTest, SearchCommand_InvalidFormats) {
    // Missing term
    EXPECT_TRUE(CLI::cli_command("search").empty());

    // Leading / double spaces
    EXPECT_TRUE(CLI::cli_command(" search something").empty());
    EXPECT_TRUE(CLI::cli_command("search  something").empty());
}

/**
 * @brief Ensures unknown commands are rejected.
 */
TEST(CLICommandTest, UnknownCommandRejected) {
    EXPECT_TRUE(CLI::cli_command("delete MyFile").empty());
    EXPECT_TRUE(CLI::cli_command("ADD MyFile Content").empty()); // wrong case
}

/**
 * @brief Ensures empty or whitespace-only input is rejected.
 */
TEST(CLICommandTest, EmptyOrWhitespaceOnlyInputRejected) {
    EXPECT_TRUE(CLI::cli_command("").empty());
    EXPECT_TRUE(CLI::cli_command("   ").empty());
}

/**
 * @brief Ensures commands with trailing or leading newlines/tabs are rejected.
 */
TEST(CLICommandTest, CommandsWithControlWhitespaceRejected) {
    EXPECT_TRUE(CLI::cli_command("add MyFile Content\n").empty());
    EXPECT_TRUE(CLI::cli_command("\tget MyFile").empty());
}
