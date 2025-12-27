#include "server.h"

#include <algorithm>
#include <iostream>
#include <sys/select.h>

#define BUFFER_SIZE 4096
#define LISTEN_BACKLOG 5
#define SCAN_TIMEOUT_SEC 0
#define SCAN_TIMEOUT_USEC 100000

ddrive::server::server(command_director cd, executor& ex, unsigned int port)
    : _command_director(cd), _executor(ex), _port(port)
{
    if (!init())
    {
        exit(EXIT_FAILURE);
    }
}

bool ddrive::server::init()
{
    memset(&_sin, 0, sizeof(_sin));

    _sin.sin_family = AF_INET;
    _sin.sin_addr.s_addr = INADDR_ANY;
    _sin.sin_port = htons(_port);

    _sock = socket(AF_INET, SOCK_STREAM, 0);
    if (_sock < 0)
    {
        return false;
    }

    return true;
}

bool ddrive::server::run()
{
    // Bind to the socket
    if (bind(_sock, (struct sockaddr*)&_sin, sizeof(_sin)) < 0)
    {
        close(_sock);
        return false;
    }

    // Listen for incoming connections from clients
    if (listen(_sock, LISTEN_BACKLOG) < 0)
    {
        close(_sock);
        return false;
    }

    /*
     * Multiplexing Loop.
     * Explanation (nontrivial):
     * - If a socket has data available to read, the system marks it as
     *   readable.
     * - The function select(max_int, readable_set, writable_set,
     *   exception-able_set, timeout) doesn't exit until one int in a set it got
     *   is marked as readable/writable/exception-able, or the timeout expires.
     * Because of that, if we add our listening socket and all client sockets to
     * the readable_set, we can wait for any of them to have data available.
     */
    while (true)
    {
        fd_set readfds;    // A "watch-list" for select
        FD_ZERO(&readfds); // Clear watch-list

        // Add listener socket
        FD_SET(_sock, &readfds);
        int max_fd = _sock; // Max socket ID (for now)

        // Add client sockets from our vector
        {
            std::lock_guard<std::mutex> lock(_clients_mtx);
            for (int client_sock : _clients)
            {
                FD_SET(client_sock, &readfds);
                max_fd = std::max(max_fd, client_sock);
            }
        }

        // Set select timeout
        struct timeval tv;
        tv.tv_sec = SCAN_TIMEOUT_SEC;   // s
        tv.tv_usec = SCAN_TIMEOUT_USEC; // μs

        // We want select to return if a socket is readable
        int activity = select(max_fd + 1, &readfds, nullptr, nullptr, &tv);

        // If select failed, server run failed
        if (activity < 0)
        {
            return false;
        }

        // Check if _sock is readable (new connection)
        if (FD_ISSET(_sock, &readfds))
        {
            // Connect new client
            struct sockaddr_in client_address;
            socklen_t client_address_len = sizeof(client_address);
            int client_sock = accept(_sock, (struct sockaddr*)&client_address,
                                     &client_address_len);
            // If client accepted
            if (client_sock >= 0)
            {
                std::lock_guard<std::mutex> lock(_clients_mtx);
                _clients.push_back(client_sock);
            }
        }

        // Check if the clients' sockets were readable
        {
            // Lock for iterator safety
            std::lock_guard<std::mutex> lock(_clients_mtx);

            bool increment;
            for (auto it = _clients.begin(); it != _clients.end();
                 increment ? ++it : it)
            {
                increment = true;
                int client_socket = *it;
                // Check if the client socket is readable
                if (FD_ISSET(client_socket, &readfds))
                {
                    // Remove from monitoring list (will be re-added after
                    // handling)
                    it = _clients.erase(it);
                    // Prevent iterator increment if we erased the current
                    // element
                    increment = false;

                    // Execute response handling in thread pool
                    _executor.execute([this, client_socket]()
                                      { handle(client_socket); });
                }
            }
        }
    }

    return true;
}

void ddrive::server::handle(int client_sock)
{
    char buffer[BUFFER_SIZE];
    memset(buffer, 0, BUFFER_SIZE);

    // Receive request
    ssize_t bytes_received = recv(client_sock, buffer, BUFFER_SIZE - 1, 0);

    // Client disconnected or error
    if (bytes_received <= 0)
    {
        close(client_sock);
        return;
    }

    // Process request
    std::string request_line(buffer);
    std::string response = _command_director.process(request_line);
    send(client_sock, response.c_str(), response.size(), 0);

    // Add to monitoring list to handle next request
    {
        std::lock_guard<std::mutex> lock(_clients_mtx);
        _clients.push_back(client_sock);
    }
}
