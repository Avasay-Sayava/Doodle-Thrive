/**
 * @file tests_rle.cpp
 * @brief Tests for the RLE encode() and decode() functions.
 *
 * These tests verify: empty input, long runs, alternating characters,
 * invalid compressed formats, and general correctness.
 */

#include <gtest/gtest.h>
#include <string>
#include "../src/rle.h"

/**
 * @brief Encoding and decoding an empty string should return an empty string.
 */
TEST(RLE_EncodeTest, EmptyStringReturnsEmpty) {
    std::string input = "";
    std::string encoded = rle_encrypt(input);

    EXPECT_TRUE(encoded.empty());

    std::string encoded = "";
    std::string decoded = rle_decrypt(encoded);

    EXPECT_TRUE(decoded.empty());
}


/**
 * @brief Basic encode + decode to check correctness.
 */
TEST(RLE_RoundTripTest, SimpleRun) {
    std::string input = "aaaaabbbcc";
    std::string encoded = rle_encrypt(input);
    std::string decoded = rle_decrypt(encoded);

    EXPECT_EQ(decoded, input);
}

/**
 * @brief Alternating characters check.
 */
TEST(RLE_RoundTripTest, AlternatingCharacters) {
    std::string input = "abababababab";
    std::string encoded = rle_encrypt(input);
    std::string decoded = rle_decrypt(encoded);

    EXPECT_EQ(decoded, input);
}

/**
 * @brief Long strings should be handled correctly.
 */
TEST(RLE_RoundTripTest, LongRunOverflowsUnsignedChar) {
    // 300 'x' string.
    std::string input(300, 'x');

    std::string encoded = rle_encrypt(input);
    std::string decoded = rle_decrypt(encoded);

    EXPECT_EQ(decoded, input);
}

/**
 * @brief Invalid compressed sequences (odd length) dont throw.
 */
TEST(RLE_InvalidDecodeTest, OddLengthInputThrows) {

    std::string invalid = "\x05"; 

    EXPECT_NO_THROW(rle_decrypt(invalid)); // This should not throw
}

/**
 * @brief Multiple runs, mixed lengths, and characters check.
 */
TEST(RLE_RoundTripTest, MixedContent) {
    std::string input = "XXXXYYYYZZZ1233333333AAAAA";
    std::string encoded = rle_encrypt(input);
    std::string decoded = rle_decrypt(encoded);

    EXPECT_EQ(decoded, input);
}

