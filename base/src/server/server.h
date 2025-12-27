#ifndef DOODLE_DRIVE_SERVER_H
#define DOODLE_DRIVE_SERVER_H

#include "../core/cd.h"
#include "../core/executor.h"
#include "../core/handlers.h"

#include <arpa/inet.h>
#include <netinet/in.h>
#include <string.h>
#include <sys/socket.h>
#include <thread>
#include <unistd.h>

namespace ddrive
{
    class Server
    {
    public:
        Server(ddrive::CommandDirector cd, ddrive::Executor& ex,
               unsigned int port);
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
} // namespace ddrive

#endif // DOODLE_DRIVE_SERVER_H
