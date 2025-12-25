#include "server.h"
#include "../core/storage.h"
#include "../core/splitter.h"
#include "../core/cd.h"
#include "../core/handlers.h"
#include "../core/ThreadPool.h"

int main(int argc, char* argv[])
{
    if (argc != 2) {
        return 1;
    }
    unsigned int port = static_cast<unsigned int>(std::stoi(argv[1]));
    unsigned int threadCount = static_cast<unsigned int>(std::stoi(getenv("THREADS")));

    ddrive::Splitter::CommandArityMap splitterMap = {
        { "POST",   3 },
        { "SEARCH", 2 },
        { "GET",    2 },
        { "DELETE", 2 }
    };

    std::unordered_map<std::string,
        std::function<std::string(const std::vector<std::string>&, ddrive::Storage&)>> handlerMap = {
        {"POST",    ddrive::handlePost},
        {"SEARCH",  ddrive::handleSearch},
        {"GET",     ddrive::handleGet},
        {"DELETE",  ddrive::handleDelete}
    };

    ddrive::Storage storage;
    ddrive::Splitter splitter(splitterMap);
    ddrive::CommandDirector commandDirector(storage, handlerMap, splitter);

    ddrive::ThreadPool executor = ddrive::ThreadPool(threadCount);
    ddrive::Server server(commandDirector, executor, port);
    server.runServer();
}