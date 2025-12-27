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
    void run_client();

    /**
     * @brief Sends a command to the server and returns the response.
     * @param command The command string to send.
     * @return The response string from the server.
     */
    std::string send_command(const std::string& command);

private:
    /**
     * @brief Client socket descriptor.
     */
    int _client_socket;

    /**
     * @brief Server address structure.
     */
    struct sockaddr_in _server_addr;

    /**
     * @brief Server host.
     */
    std::string _host;

    /**
     * @brief Server port number.
     */
    int _port;

    /**
     * @brief Buffer for receiving data from the server.
     */
    char _buffer[BUFFER_SIZE];
};

#endif // DOODLE_DRIVE_CLIENT_H
