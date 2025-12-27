#ifndef DOODLE_DRIVE_CLIENT_H
#define DOODLE_DRIVE_CLIENT_H

#include <netinet/in.h>
#include <string>

#define BUFFER_SIZE 4096

class Client
{
public:
    /**
     * @brief Constructor to initialize client with host and port.
     * @param host Server hostname or IP address.
     * @param port Server port number.
     */
    Client(const std::string& host, int port);

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
    int client_socket;
    /**
     * @brief Server address structure.
     */
    struct sockaddr_in server_addr;
    /**
     * @brief Server host.
     */
    std::string host;
    /**
     * @brief Server port number.
     */
    int port;
    /**
     * @brief Buffer for receiving data from the server.
     */
    char buffer[BUFFER_SIZE];
};

#endif // DOODLE_DRIVE_CLIENT_H
