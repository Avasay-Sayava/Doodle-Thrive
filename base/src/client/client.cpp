#include "client.h"

#include <iostream>
#include <netdb.h>
#include <sys/socket.h>
#include <unistd.h>

client::client(const std::string& host, int port)
{
    // Set up the client socket
    struct addrinfo hints{}, *res = nullptr;

    // Set up address-info hints
    hints.ai_family = AF_INET;
    hints.ai_socktype = SOCK_STREAM;

    std::string port_str = std::to_string(port);

    int status = getaddrinfo(host.c_str(), port_str.c_str(), &hints, &res);
    if (status != 0)
    {
        return;
    }

    // Create socket and connect to server
    _client_socket = socket(res->ai_family, res->ai_socktype, res->ai_protocol);
    if (_client_socket < 0)
    {
        freeaddrinfo(res);
        return;
    }

    if (connect(_client_socket, res->ai_addr, res->ai_addrlen) < 0)
    {
        close(_client_socket);
        freeaddrinfo(res);
        return;
    }

    freeaddrinfo(res);
}

void client::run_client()
{
    // User interaction loop
    while (true)
    {
        std::string user_request;
        std::getline(std::cin, user_request);
        if (user_request.empty())
        {
            continue;
        }
        std::string response = send_command(user_request);
        std::cout << response;
    }

    close(_client_socket);
}

std::string client::send_command(const std::string& command)
{
    // Send command to the server
    send(_client_socket, command.c_str(), command.size(), 0);
    int expected_data_len = sizeof(_buffer);
    // Receive data from the server
    int read_bytes = recv(_client_socket, _buffer, expected_data_len, 0);

    if (read_bytes < 0)
    {
        return ""; // Connection closed
    }

    std::string response(_buffer, read_bytes);
    return response;
}
