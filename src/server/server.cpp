#include "server.h"
#include <iostream>
    
ddrive::Server::Server(CommandDirector cd, Executor& ex, unsigned int port) : commandDirector(cd), executor(ex), port(port)
{
    if (initServer() < 0) {
        exit(EXIT_FAILURE);
    }
}

int ddrive::Server::initServer() {
    memset(&sin, 0, sizeof(sin));

    sin.sin_family = AF_INET;
    sin.sin_addr.s_addr = INADDR_ANY;
    sin.sin_port = htons(port);

    sock = socket(AF_INET, SOCK_STREAM, 0);
    if (sock < 0) {
        return -1;
    }

    return 0;
}

int ddrive::Server::runServer()
{
    std::cout << "Server is running on port " << port << std::endl;

    // Bind to the socket
    if (bind(sock, (struct sockaddr *) &sin, sizeof(sin)) < 0) {
        std::cerr << "Failed to bind socket." << std::endl;
        close(sock);
        return -1;
    }

    std::cout << "Socket successfully bound." << std::endl;

    // Listen for incoming connections from clients
    if (listen(sock, 5) < 0) {
        std::cerr << "Failed to listen on socket." << std::endl;
        close(sock);
        return -1;
    }

    std::cout << "Listening for incoming connections..." << std::endl;
    
    while (true) {
        std::cout << "Listening for incoming connections loop" << std::endl;
        struct sockaddr_in client_address;
        socklen_t client_address_len = sizeof(client_address);
        int client_sock = accept(sock, (struct sockaddr *)&client_address, &client_address_len);
        if (client_sock < 0) {
            std::cerr << "Failed to accept client connection." << std::endl;
            continue;
        }
        std::cout << "Accepted new client connection." << std::endl;

        executor.execute([this, client_sock]() {
            handleClient(client_sock);
            close(client_sock);
        });
    }
    return 0;
}

void ddrive::Server::handleClient(int client_sock)
{
    std::cout << "Handling client in thread: " << std::this_thread::get_id() << std::endl;
    char buffer[BUFFER_SIZE];
    while (true) {
        memset(buffer, 0, BUFFER_SIZE);

        std::cout <<" Waiting to receive data from client..." << std::endl;
        ssize_t bytes_received = recv(client_sock, buffer, BUFFER_SIZE - 1, 0);
        if (bytes_received < 0) {
            close(client_sock);
            return;
        }

        std::string request_line(buffer);
        std::cout << "Received request: " << request_line << std::endl;
        auto result = commandDirector.process(request_line);
        std::cout << "Sending response: " << result << std::endl;
        std::string response = result;
        send(client_sock, response.c_str(), response.size(), 0);
    }
}