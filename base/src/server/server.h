#ifndef DOODLE_DRIVE_SERVER_H
#define DOODLE_DRIVE_SERVER_H

#include "../core/executor/executor.h"
#include "../core/command_director.h"
#include "../core/handlers.h"

#include <arpa/inet.h>
#include <netinet/in.h>
#include <string.h>
#include <sys/socket.h>
#include <thread>
#include <unistd.h>

namespace ddrive
{

    /**
     * @brief TCP Server implementation.
     *
     * Manages the lifecycle of the listening socket, accepts incoming
     * connections, and dispatches requests to the Command Director using a
     * thread pool executor.
     */
    class server
    {
    public:
        /**
         * @brief Constructs the server with required dependencies.
         *
         * @param cd The Command Director responsible for routing requests.
         * @param ex The Executor (Thread Pool) for handling concurrent clients.
         * @param port The port number to listen on.
         */
        server(ddrive::command_director cd, ddrive::executor& ex,
               unsigned int port);

        /**
         * @brief Initializes the server socket and binds to the port.
         *
         * @return Returns if initialization was successful.
         */
        bool init();

        /**
         * @brief Runs the server, accepting and handling client connections.
         * 
         * Blocks indefinitely, accepting new connections and dispatching them
         * to the executor.
         *
         * @return Returns if the server ran successfully.
         */
        bool run();

    private:
        unsigned int _port;
        ddrive::executor& _executor;
        ddrive::command_director _command_director;
        sockaddr_in _sin;
        int _sock;

        /**
         * @brief Handles a single client connection.
         * 
         * Reads data from the socket, processes the request, and sends the
         * response.
         *
         * @param client_sock The file descriptor for the connected client
         * socket.
         */
        void handle(int client_sock);
    };

} // namespace ddrive

#endif // DOODLE_DRIVE_SERVER_H
