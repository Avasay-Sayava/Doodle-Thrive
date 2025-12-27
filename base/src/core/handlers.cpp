#include "handlers.h"

#include <optional>

namespace ddrive
{

    namespace
    {

        std::string make_bad_request()
        {
            return ddrive::code_to_string(status_code::BAD_REQUEST);
        }

        std::string make_not_found()
        {
            return ddrive::code_to_string(status_code::NOT_FOUND);
        }

        std::string make_no_content()
        {
            return ddrive::code_to_string(status_code::NO_CONTENT);
        }

        std::string make_ok(const std::string& body)
        {
            std::string output = ddrive::code_to_string(status_code::OK);
            output += "\n";
            output += body;
            output += "\n";
            return output;
        }

        std::string make_created(const std::string& body = "")
        {
            return ddrive::code_to_string(status_code::CREATED);
        }

        // Common validation helpers

        bool ensure_exact_args(const std::vector<std::string>& args,
                             std::size_t expected, std::string& out)
        {
            if (args.size() != expected)
            {
                out = make_bad_request();
                return false;
            }
            return true;
        }

        bool ensure_non_empty(const std::string& s, std::string& out)
        {
            if (s.empty())
            {
                out = make_bad_request();
                return false;
            }
            return true;
        }

        bool ensure_no_spaces(const std::string& s, std::string& out)
        {
            if (s.find(' ') != std::string::npos)
            {
                out = make_bad_request();
                return false;
            }
            return true;
        }

    } // anonymous namespace

    /**
     * Input issues handled:
     *   - Wrong number of arguments (args.size() != 3) → 400 BadRequest.
     *   - Empty filename → 400 BadRequest.
     *   - Storage layer failure when adding (file already exists, I/O error,
     * etc.) → 400 BadRequest.
     *
     * Content semantics:
     *   - Content may be empty (POST <fileName> with no extra text after).
     *   - All internal spaces and trailing spaces in the content are preserved
     *     because Splitter passes the full tail as args[2].
     */
    std::string handle_post(const std::vector<std::string>& args,
                           storage& storage)
    {
        std::string result;

        // Expect exactly ["POST", filename, content]
        if (!ensure_exact_args(args, 3, result))
        {
            return result;
        }

        const std::string& filename = args[1];
        const std::string& content = args[2];

        if (!ensure_non_empty(filename, result))
        {
            return result;
        }

        try
        {
            const bool created = storage.add(filename, content);
            if (!created)
            {
                // e.g., file already exists or low-level error, map to 400
                return make_bad_request();
            }

            return make_created();
        }
        catch (...)
        {
            return make_bad_request();
        }
    }

    /**
     * Input issues handled:
     *   - Wrong number of arguments (args.size() != 2) → 400 BadRequest.
     *   - Empty filename → 400 BadRequest.
     *   - Filename containing any space (internal or trailing) → 400 BadRequest
     *     (matches Ex1 rule: filename has no spaces, no trailing spaces).
     *   - Non-existing file → 404 NotFound.
     *   - Storage exceptions → 400 BadRequest.
     */
    std::string handle_get(const std::vector<std::string>& args,
                          storage& storage)
    {
        std::string result;

        // Expect exactly ["GET", rawFilenameTail]
        if (!ensure_exact_args(args, 2, result))
        {
            return result;
        }

        // rawTail may contain trailing spaces – we reject any filename with
        // spaces.
        const std::string& rawTail = args[1];
        if (!ensure_non_empty(rawTail, result))
        {
            return result;
        }
        if (!ensure_no_spaces(rawTail, result))
        {
            return result;
        }

        const std::string& filename = rawTail;

        try
        {
            std::optional<std::string> contentOpt = storage.get(filename);
            if (!contentOpt.has_value())
            {
                return make_not_found();
            }
            return make_ok(contentOpt.value());
        }
        catch (...)
        {
            return make_bad_request();
        }
    }

    /**
     * Input issues handled:
     *   - Wrong number of arguments (args.size() != 2) → 400 BadRequest.
     *   - Storage/search exceptions → 400 BadRequest.
     *
     * Semantics:
     *   - Term is passed exactly as received (after command and space
     * normalization done by Splitter), so Storage::search can perform exact
     * substring matching on that term.
     */
    std::string handle_search(const std::vector<std::string>& args,
                             storage& storage)
    {
        std::string result;

        // Expect exactly ["SEARCH", term]
        if (!ensure_exact_args(args, 2, result))
        {
            return result;
        }

        const std::string& term = args[1]; // may be empty (allowed)

        try
        {
            // Assumes Storage::search(term) returns the same matches string as
            // Ex1.
            std::string matches = storage.search(term);
            return make_ok(matches);
        }
        catch (...)
        {
            return make_bad_request();
        }
    }

    /**
     * Input issues handled:
     *   - Wrong number of arguments (args.size() != 2) → 400 BadRequest.
     *   - Empty filename → 400 BadRequest.
     *   - Filename containing spaces → 400 BadRequest.
     *   - Deleting non-existing file → 404 NotFound.
     *   - Storage exceptions → 400 BadRequest.
     *
     * Semantics:
     *   - On success → 204 NoContent with empty body.
     */
    std::string handle_delete(const std::vector<std::string>& args,
                             storage& storage)
    {
        std::string result;

        // Expect exactly ["DELETE", rawFilenameTail]
        if (!ensure_exact_args(args, 2, result))
        {
            return result;
        }

        const std::string& rawTail = args[1];
        if (!ensure_non_empty(rawTail, result))
        {
            return result;
        }
        if (!ensure_no_spaces(rawTail, result))
        {
            return result;
        }

        const std::string& filename = rawTail;

        try
        {
            const bool removed = storage.remove(filename);
            if (!removed)
            {
                return make_not_found();
            }
            return make_no_content();
        }
        catch (...)
        {
            return make_bad_request();
        }
    }

} // namespace ddrive
