#include "server.h"

#include <iostream>

#define BUFFER_SIZE 4096

ddrive::server::server(command_director cd, executor& ex, unsigned int port)
    : _command_director(cd), _executor(ex), _port(port)
{
    if (init() < 0)
    {
        exit(EXIT_FAILURE);
    }
}

int ddrive::server::init()
{
    memset(&_sin, 0, sizeof(_sin));

    _sin.sin_family = AF_INET;
    _sin.sin_addr.s_addr = INADDR_ANY;
    _sin.sin_port = htons(_port);

    _sock = socket(AF_INET, SOCK_STREAM, 0);
    if (_sock < 0)
    {
        return -1;
    }

    return 0;
}

int ddrive::server::run()
{

    // Bind to the socket
    if (bind(_sock, (struct sockaddr*)&_sin, sizeof(_sin)) < 0)
    {
        close(_sock);
        return -1;
    }

    // Listen for incoming connections from clients
    if (listen(_sock, 5) < 0)
    {
        close(_sock);
        return -1;
    }

    while (true)
    {
        struct sockaddr_in client_address;
        socklen_t client_address_len = sizeof(client_address);
        int client_sock = accept(_sock, (struct sockaddr*)&client_address,
                                 &client_address_len);
        if (client_sock < 0)
        {
            continue;
        }

        _executor.execute(
            [this, client_sock]()
            {
                handle(client_sock);
                close(client_sock);
            });
    }
    return 0;
}

void ddrive::server::handle(int client_sock)
{
    char buffer[BUFFER_SIZE];
    while (true)
    {
        memset(buffer, 0, BUFFER_SIZE);

        ssize_t bytes_received = recv(client_sock, buffer, BUFFER_SIZE - 1, 0);
        if (bytes_received < 0)
        {
            close(client_sock);
            return;
        }

        std::string request_line(buffer);
        auto result = _command_director.process(request_line);
        std::string response = result;
        send(client_sock, response.c_str(), response.size(), 0);
    }
}
