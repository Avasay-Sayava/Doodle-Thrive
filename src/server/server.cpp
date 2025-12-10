#include "server.h"
    
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
    // Bind to the socket
    if (bind(sock, (struct sockaddr *) &sin, sizeof(sin)) < 0) {
        return -1;
    }

    // Listen for incoming connections from clients
    if (listen(sock, 5) < 0) {
        return -1;
    }
    while (true) {
        int client_sock = accept(sock, nullptr, nullptr);
        if (client_sock < 0) {
            continue;
        }

        executor.execute([this, client_sock]() {
            handleClient(client_sock);
            close(client_sock);
        });
    }
    return 0;
}
void ddrive::Server::handleClient(int client_sock)
{
    while (true) {
        char buffer[BUFFER_SIZE];
        memset(buffer, 0, BUFFER_SIZE);

        ssize_t bytes_received = recv(client_sock, buffer, BUFFER_SIZE - 1, 0);
        if (bytes_received < 0) {
            close(client_sock);
            return;
        }

        std::string request_line(buffer);
        auto result = commandDirector.process(request_line);

        std::string response = result;
        send(client_sock, response.c_str(), response.size(), 0);
    }
}
