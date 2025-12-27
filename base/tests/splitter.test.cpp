#include "../src/core/splitter.h"

#include <gtest/gtest.h>

using ddrive::Splitter;

// Helper to build a “standard” arity map for tests.
static Splitter makeDefaultSplitter()
{
    Splitter::CommandArityMap map = {
        {"POST", 3},   // POST <filename> <content>
        {"SEARCH", 2}, // SEARCH <term...>
        {"GET", 2},    // GET <something...>
        {"DELETE", 2}  // DELETE <something...>
    };
    return Splitter(map);
}

/**
 * POST tests
 */

// Simple valid POST with single-word content.
TEST(SplitterTest, Post_SimpleValid)
{
    auto splitter = makeDefaultSplitter();

    auto tokens = splitter.split("POST MyFile Hello");

    ASSERT_EQ(tokens.size(), 3u);
    EXPECT_EQ(tokens[0], "POST");
    EXPECT_EQ(tokens[1], "MyFile");
    EXPECT_EQ(tokens[2], "Hello");
}

// POST with content containing spaces – last arg is full remainder.
TEST(SplitterTest, Post_ContentWithSpaces)
{
    auto splitter = makeDefaultSplitter();

    auto tokens = splitter.split("POST MyFile This is some content");

    ASSERT_EQ(tokens.size(), 3u);
    EXPECT_EQ(tokens[0], "POST");
    EXPECT_EQ(tokens[1], "MyFile");
    EXPECT_EQ(tokens[2], "This is some content");
}

// POST with leading spaces in content – content is exact remainder.
TEST(SplitterTest, Post_ContentLeadingSpacePreserved)
{
    auto splitter = makeDefaultSplitter();

    auto tokens = splitter.split("POST MyFile  Hello");

    ASSERT_EQ(tokens.size(), 3u);
    EXPECT_EQ(tokens[0], "POST");
    EXPECT_EQ(tokens[1], "MyFile");
    EXPECT_EQ(tokens[2], " Hello"); // leading space is part of content
}

// POST with trailing spaces in content – trailing spaces preserved.
TEST(SplitterTest, Post_ContentTrailingSpacesPreserved)
{
    auto splitter = makeDefaultSplitter();

    auto tokens = splitter.split("POST MyFile Hello  ");

    ASSERT_EQ(tokens.size(), 3u);
    EXPECT_EQ(tokens[0], "POST");
    EXPECT_EQ(tokens[1], "MyFile");
    EXPECT_EQ(tokens[2], "Hello  "); // two spaces at the end
}

// POST with empty content: "POST MyFile " → last arg is empty string.
TEST(SplitterTest, Post_EmptyContentAllowed)
{
    auto splitter = makeDefaultSplitter();

    auto tokens = splitter.split("POST MyFile ");

    ASSERT_EQ(tokens.size(), 3u);
    EXPECT_EQ(tokens[0], "POST");
    EXPECT_EQ(tokens[1], "MyFile");
    EXPECT_EQ(tokens[2], ""); // empty content
}

// POST with double space in header area ("POST  MyFile ...") is invalid.
TEST(SplitterTest, Post_DoubleSpaceBetweenCommandAndFilenameInvalid)
{
    auto splitter = makeDefaultSplitter();

    auto tokens = splitter.split("POST  MyFile Content");

    EXPECT_TRUE(tokens.empty()); // header arg would be "", so invalid
}

// POST missing content is invalid (we expect 3 tokens total).
TEST(SplitterTest, Post_MissingContentInvalid)
{
    auto splitter = makeDefaultSplitter();

    auto tokens1 = splitter.split("POST MyFile"); // only one arg
    auto tokens2 = splitter.split("POST");        // no args

    EXPECT_TRUE(tokens1.empty());
    EXPECT_TRUE(tokens2.empty());
}

/**
 * Command name / unknown command / leading space
 */

// Command is uppercased, map keys are uppercase.
TEST(SplitterTest, Command_IsUppercasedForLookupAndResult)
{
    auto splitter = makeDefaultSplitter();

    auto tokens = splitter.split("post MyFile Hello");

    ASSERT_EQ(tokens.size(), 3u);
    EXPECT_EQ(tokens[0], "POST");
    EXPECT_EQ(tokens[1], "MyFile");
    EXPECT_EQ(tokens[2], "Hello");
}

// Unknown command returns empty vector.
TEST(SplitterTest, UnknownCommandRejected)
{
    auto splitter = makeDefaultSplitter();

    auto tokens = splitter.split("UNKNOWN something");

    EXPECT_TRUE(tokens.empty());
}

// Line starting with a space has empty command token → invalid.
TEST(SplitterTest, LeadingSpaceBeforeCommandInvalid)
{
    auto splitter = makeDefaultSplitter();

    auto tokens = splitter.split(" POST MyFile Hello");

    EXPECT_TRUE(tokens.empty());
}

/**
 * SEARCH tests
 */

// Simple SEARCH – single space after command, term has no leading space.
TEST(SplitterTest, Search_SimpleValid)
{
    auto splitter = makeDefaultSplitter();

    auto tokens = splitter.split("SEARCH hello");

    ASSERT_EQ(tokens.size(), 2u);
    EXPECT_EQ(tokens[0], "SEARCH");
    EXPECT_EQ(tokens[1], "hello");
}

// SEARCH with double space after command – leading space is part of term.
TEST(SplitterTest, Search_DoubleSpaceAfterCommandIsPartOfTerm)
{
    auto splitter = makeDefaultSplitter();

    auto tokens = splitter.split("SEARCH  hello");

    ASSERT_EQ(tokens.size(), 2);
    EXPECT_EQ(tokens[0], "SEARCH");
    EXPECT_EQ(tokens[1], " hello"); // term starts with a space
}

// SEARCH with more spaces and trailing spaces – all preserved in last arg.
TEST(SplitterTest, Search_TermWithLeadingAndTrailingSpacesPreserved)
{
    auto splitter = makeDefaultSplitter();

    auto tokens = splitter.split("SEARCH   hello world  ");

    ASSERT_EQ(tokens.size(), 2u);
    EXPECT_EQ(tokens[0], "SEARCH");
    EXPECT_EQ(tokens[1], "  hello world  ");
    // Explanation:
    // "SEARCH   hello world  "
    // -> firstSpace after "SEARCH" → rest = "  hello world  "
    // headerArgs = 0 → remaining = rest → last arg unchanged
}

// SEARCH with no term – last arg is empty string (handler should treat as 400).
TEST(SplitterTest, Search_NoTerm_GivesEmptyLastArg)
{
    auto splitter = makeDefaultSplitter();

    auto tokens = splitter.split("SEARCH");

    ASSERT_EQ(tokens.size(), 0u);
}

/**
 * GET tests (same arity pattern as SEARCH)
 */

TEST(SplitterTest, Get_SimpleValid)
{
    auto splitter = makeDefaultSplitter();

    auto tokens = splitter.split("GET MyFile");

    ASSERT_EQ(tokens.size(), 2u);
    EXPECT_EQ(tokens[0], "GET");
    EXPECT_EQ(tokens[1], "MyFile");
}

// GET with double space after command – leading space part of argument.
TEST(SplitterTest, Get_DoubleSpaceAfterCommandIsPartOfArg)
{
    auto splitter = makeDefaultSplitter();

    auto tokens = splitter.split("GET  MyFile");

    ASSERT_EQ(tokens.size(), 2u);
    EXPECT_EQ(tokens[0], "GET");
    EXPECT_EQ(tokens[1], " MyFile");
}

// GET with no arg – empty last arg (handler can decide if that's 400).
TEST(SplitterTest, Get_NoArg_GivesEmptyLastArg)
{
    auto splitter = makeDefaultSplitter();

    auto tokens = splitter.split("GET");

    ASSERT_EQ(tokens.size(), 0u);
}

/**
 * DELETE tests (same arity pattern as GET)
 */

TEST(SplitterTest, Delete_SimpleValid)
{
    auto splitter = makeDefaultSplitter();

    auto tokens = splitter.split("DELETE MyFile");

    ASSERT_EQ(tokens.size(), 2u);
    EXPECT_EQ(tokens[0], "DELETE");
    EXPECT_EQ(tokens[1], "MyFile");
}

// DELETE with double space after command – leading space part of argument.
TEST(SplitterTest, Delete_DoubleSpaceAfterCommandIsPartOfArg)
{
    auto splitter = makeDefaultSplitter();

    auto tokens = splitter.split("DELETE  MyFile");

    ASSERT_EQ(tokens.size(), 2u);
    EXPECT_EQ(tokens[0], "DELETE");
    EXPECT_EQ(tokens[1], " MyFile");
}

// DELETE with no arg – empty last arg (handler can decide if that's 404 / 400).
TEST(SplitterTest, Delete_NoArg_GivesEmptyLastArg)
{
    auto splitter = makeDefaultSplitter();

    auto tokens = splitter.split("DELETE");

    ASSERT_EQ(tokens.size(), 0u);
}

/**
 * General edge cases
 */

// Empty line returns empty vector (invalid).
TEST(SplitterTest, EmptyLineInvalid)
{
    auto splitter = makeDefaultSplitter();

    auto tokens = splitter.split("");

    EXPECT_TRUE(tokens.empty());
}
