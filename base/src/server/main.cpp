#include "../core/command_director.h"
#include "../core/executor/thread_pool.h"
#include "../core/handlers.h"
#include "../core/splitter.h"
#include "../core/storage.h"
#include "server.h"

#include <cstdlib>

int main(int argc, char* argv[])
{
    if (argc != 2)
    {
        return 1;
    }
    unsigned int port = static_cast<unsigned int>(std::stoi(argv[1]));
    unsigned int threadCount =
        static_cast<unsigned int>(std::stoi(getenv("THREADS")));

    ddrive::splitter::command_arity_map splitterMap = {
        {"POST", 3}, {"SEARCH", 2}, {"GET", 2}, {"DELETE", 2}};

    std::unordered_map<std::string,
                       std::function<std::string(
                           const std::vector<std::string>&, ddrive::storage&)>>
        handlerMap = {{"POST", ddrive::handle_post},
                      {"SEARCH", ddrive::handle_search},
                      {"GET", ddrive::handle_get},
                      {"DELETE", ddrive::handle_delete}};

    ddrive::storage storage;
    ddrive::splitter splitter(splitterMap);
    ddrive::command_director commandDirector(storage, handlerMap, splitter);

    ddrive::thread_pool executor = ddrive::thread_pool(threadCount);
    ddrive::server server(commandDirector, executor, port);
    server.run();
}
