#ifndef SERVER_H
#define SERVER_H
#include "../core/cd.h"
#include <sys/socket.h>
#include <netinet/in.h>
#include <arpa/inet.h>
#include <unistd.h>
#include <string.h>
#include <thread>
#include "../core/handlers.h"
#include "../core/executor.h"

#define BUFFER_SIZE 4096

namespace ddrive {
class Server {
public:
    Server(ddrive::CommandDirector cd, ddrive::Executor& ex, unsigned int port);
    int initServer();
    int runServer();
private:
    unsigned int port;
    ddrive::Executor& executor;
    void handleClient(int client_sock);
    ddrive::CommandDirector commandDirector;
    sockaddr_in sin;
    int sock;
};
}
#endif // SERVER_H