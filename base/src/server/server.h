#ifndef DOODLE_DRIVE_SERVER_H
#define DOODLE_DRIVE_SERVER_H

#include "../core/command_director.h"
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
    class server
    {
    public:
        server(ddrive::command_director cd, ddrive::executor& ex,
               unsigned int port);
        int init();
        int run();

    private:
        unsigned int _port;
        ddrive::executor& _executor;
        void handle(int client_sock);
        ddrive::command_director _command_director;
        sockaddr_in _sin;
        int _sock;
    };

} // namespace ddrive

#endif // DOODLE_DRIVE_SERVER_H
