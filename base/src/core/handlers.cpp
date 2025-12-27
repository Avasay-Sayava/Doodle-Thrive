#include "handlers.h"

#include <optional>

namespace ddrive
{

    namespace
    {

        std::string makeBadRequest()
        {
            return ddrive::codeToString(StatusCode::BadRequest);
        }

        std::string makeNotFound()
        {
            return ddrive::codeToString(StatusCode::NotFound);
        }

        std::string makeNoContent()
        {
            return ddrive::codeToString(StatusCode::NoContent);
        }

        std::string makeOk(const std::string& body)
        {
            std::string output = ddrive::codeToString(StatusCode::Ok);
            output += "\n";
            output += body;
            output += "\n";
            return output;
        }

        std::string makeCreated(const std::string& body = "")
        {
            return ddrive::codeToString(StatusCode::Created);
        }

        // Common validation helpers

        bool ensureExactArgs(const std::vector<std::string>& args,
                             std::size_t expected, std::string& out)
        {
            if (args.size() != expected)
            {
                out = makeBadRequest();
                return false;
            }
            return true;
        }

        bool ensureNonEmpty(const std::string& s, std::string& out)
        {
            if (s.empty())
            {
                out = makeBadRequest();
                return false;
            }
            return true;
        }

        bool ensureNoSpaces(const std::string& s, std::string& out)
        {
            if (s.find(' ') != std::string::npos)
            {
                out = makeBadRequest();
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
    std::string handlePost(const std::vector<std::string>& args,
                           Storage& storage)
    {
        std::string result;

        // Expect exactly ["POST", filename, content]
        if (!ensureExactArgs(args, 3, result))
        {
            return result;
        }

        const std::string& filename = args[1];
        const std::string& content = args[2];

        if (!ensureNonEmpty(filename, result))
        {
            return result;
        }

        try
        {
            const bool created = storage.add(filename, content);
            if (!created)
            {
                // e.g., file already exists or low-level error, map to 400
                return makeBadRequest();
            }

            return makeCreated();
        }
        catch (...)
        {
            return makeBadRequest();
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
    std::string handleGet(const std::vector<std::string>& args,
                          Storage& storage)
    {
        std::string result;

        // Expect exactly ["GET", rawFilenameTail]
        if (!ensureExactArgs(args, 2, result))
        {
            return result;
        }

        // rawTail may contain trailing spaces – we reject any filename with
        // spaces.
        const std::string& rawTail = args[1];
        if (!ensureNonEmpty(rawTail, result))
        {
            return result;
        }
        if (!ensureNoSpaces(rawTail, result))
        {
            return result;
        }

        const std::string& filename = rawTail;

        try
        {
            std::optional<std::string> contentOpt = storage.get(filename);
            if (!contentOpt.has_value())
            {
                return makeNotFound();
            }
            return makeOk(contentOpt.value());
        }
        catch (...)
        {
            return makeBadRequest();
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
    std::string handleSearch(const std::vector<std::string>& args,
                             Storage& storage)
    {
        std::string result;

        // Expect exactly ["SEARCH", term]
        if (!ensureExactArgs(args, 2, result))
        {
            return result;
        }

        const std::string& term = args[1]; // may be empty (allowed)

        try
        {
            // Assumes Storage::search(term) returns the same matches string as
            // Ex1.
            std::string matches = storage.search(term);
            return makeOk(matches);
        }
        catch (...)
        {
            return makeBadRequest();
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
    std::string handleDelete(const std::vector<std::string>& args,
                             Storage& storage)
    {
        std::string result;

        // Expect exactly ["DELETE", rawFilenameTail]
        if (!ensureExactArgs(args, 2, result))
        {
            return result;
        }

        const std::string& rawTail = args[1];
        if (!ensureNonEmpty(rawTail, result))
        {
            return result;
        }
        if (!ensureNoSpaces(rawTail, result))
        {
            return result;
        }

        const std::string& filename = rawTail;

        try
        {
            const bool removed = storage.remove(filename);
            if (!removed)
            {
                return makeNotFound();
            }
            return makeNoContent();
        }
        catch (...)
        {
            return makeBadRequest();
        }
    }

} // namespace ddrive
