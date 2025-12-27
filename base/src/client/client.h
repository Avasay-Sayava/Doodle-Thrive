#ifndef DOODLE_DRIVE_CLIENT_H
#define DOODLE_DRIVE_CLIENT_H

#include <netinet/in.h>
#include <string>

#define BUFFER_SIZE 4096

class client
{
public:
    /**
     * @brief Constructor to initialize client with host and port.
     * @param host Server hostname or IP address.
     * @param port Server port number.
     */
    client(const std::string& host, int port);

    /**
     * @brief Runs the client to interact with the server.
     */
    void run();

    /**
     * @brief Sends a command to the server and returns the response.
     * @param command The command string to send.
     * @return The response string from the server.
     */
    std::string send(const std::string& command);

private:
    int _client_socket;
    struct sockaddr_in _server_addr;
    std::string _host;
    int _port;
    char _buffer[BUFFER_SIZE];
};

#endif // DOODLE_DRIVE_CLIENT_H
