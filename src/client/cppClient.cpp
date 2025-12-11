#include "cppClient.h"

Client::Client(const std::string& host, int port) {
    struct addrinfo hints{}, *res = nullptr;

    hints.ai_family = AF_INET;
    hints.ai_socktype = SOCK_STREAM;

    std::string port_str = std::to_string(port);

    int status = getaddrinfo(host.c_str(), port_str.c_str(), &hints, &res);
    if (status != 0) {
        return;
    }

    client_socket = socket(res->ai_family, res->ai_socktype, res->ai_protocol);
    if (client_socket < 0) {
        freeaddrinfo(res);
        return;
    }

    if (connect(client_socket, res->ai_addr, res->ai_addrlen) < 0) {
        close(client_socket);
        freeaddrinfo(res);
        return;
    }

    freeaddrinfo(res);
}

void Client::run_client() {
    // User interaction loop
    while (true) {
        std::string user_request;
        std::getline(std::cin, user_request);
        if (user_request.empty()) {
            continue;
        }
        std::string response = send_command(user_request);
        std::cout << response;
    }
    close(client_socket);
}

std::string Client::send_command(const std::string& command) {
    // Send command to the server
    send(client_socket, command.c_str(), command.size(), 0);
    int expected_data_len = sizeof(buffer);
    int read_bytes = recv(client_socket, buffer, expected_data_len, 0); // Recieve data from the server
    
    if (read_bytes < 0) {
        return ""; // Connection closed
    }
    std::string response(buffer, read_bytes);
    return response;
}