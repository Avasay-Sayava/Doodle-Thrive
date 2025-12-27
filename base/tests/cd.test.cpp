#include <functional>
#include <gtest/gtest.h>
#include <string>
#include <unordered_map>
#include <vector>

#include "../src/core/command_director.h"
#include "../src/core/splitter.h"
#include "../src/core/status_codes.h"
#include "../src/core/storage.h"

namespace ddrive
{

    using handler_fn =
        std::function<std::string(const std::vector<std::string>&, storage&)>;

    static splitter make_splitter()
    {
        ddrive::splitter::command_arity_map splitterMap = {{"PING", 2},
                                                         {"ECHO", 2}};
        return splitter(splitterMap);
    }

    static storage make_storage()
    {
        return storage();
    }

    /**
     * - Splitter only knows about PING and ECHO.
     * - Input line uses an unknown command "FOO".
     * - Splitter returns an empty args vector for this line.
     * - command_director should map that to a 400 BadRequest response.
     */
    TEST(command_directorTest, UnknownCommand_ReturnsBadRequest)
    {
        storage storage = make_storage();

        // Splitter only knows PING/ECHO
        splitter splitter = make_splitter();

        std::unordered_map<std::string, handler_fn> handlers;

        command_director cd(storage, handlers, splitter);

        const std::string response = cd.process("FOO something");

        EXPECT_EQ(response, code_to_string(status_code::BAD_REQUEST));
    }

    /**
     * - Empty input line should produce an empty args vector from Splitter.
     * - command_director should respond with 400 BadRequest.
     */
    TEST(command_directorTest, EmptyLine_ReturnsBadRequest)
    {
        storage storage = make_storage();
        splitter splitter = make_splitter();
        std::unordered_map<std::string, handler_fn> handlers;

        command_director cd(storage, handlers, splitter);

        const std::string response = cd.process("");

        EXPECT_EQ(response, code_to_string(status_code::BAD_REQUEST));
    }

    /**
     * - Splitter knows the command PING (in its COMMAND→argCount map).
     * - handlerMap does NOT contain a handler for "PING".
     * - Splitter returns args[0] = "PING", but command_director cannot find a
     * handler.
     * - Should return 400 BadRequest.
     */
    TEST(command_directorTest, KnownCommandWithoutHandler_ReturnsBadRequest)
    {
        storage storage = make_storage();
        splitter splitter = make_splitter();

        std::unordered_map<std::string, handler_fn> handlers;

        command_director cd(storage, handlers, splitter);

        const std::string response = cd.process("PING payload");

        EXPECT_EQ(response, code_to_string(status_code::BAD_REQUEST));
    }

    /**
     * - Splitter knows PING with 2 tokens: ["PING", <payload>].
     * - handlerMap registers a handler for "PING".
     * - Input line "PING hello world" should be split into:
     *     args[0] = "PING"
     *     args[1] = "hello world"  (because argCount=2 so last arg is "rest of
     * line")
     * - command_director should call the correct handler and return its string.
     */
    TEST(command_directorTest, RoutesToCorrectHandler)
    {
        storage st = make_storage();
        splitter splitter = make_splitter();

        std::unordered_map<std::string, handler_fn> handlers;

        handlers.emplace(
            "PING",
            [](const std::vector<std::string>& args, storage&) -> std::string
            {
                if (args.size() != 2)
                {
                    return "BAD_ARGS";
                }
                return std::string("HANDLER_PING:") + args[0] + ":" + args[1];
            });

        command_director cd(st, handlers, splitter);

        const std::string response = cd.process("PING hello world");

        EXPECT_EQ(response, "HANDLER_PING:PING:hello world");
    }

    /**
     * - Splitter uppercases the command token.
     * - handlerMap is keyed by "PING".
     * - Input line uses lowercase "ping".
     * - Splitter should output args[0] == "PING", and command_director
     *   should still find the handler and execute it.
     */
    TEST(command_directorTest, CommandCaseInsensitiveViaSplitter)
    {
        storage st = make_storage();
        splitter splitter = make_splitter();

        std::unordered_map<std::string, handler_fn> handlers;

        handlers.emplace(
            "PING",
            [](const std::vector<std::string>& args, storage&) -> std::string
            {
                if (args.size() != 2)
                {
                    return "BAD_ARGS";
                }
                return args[0] + ":" + args[1];
            });

        command_director cd(st, handlers, splitter);

        const std::string response = cd.process("ping SomePayload");

        EXPECT_EQ(response, "PING:SomePayload");
    }

} // namespace ddrive
