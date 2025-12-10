#include "cppClient.h"

Client::Client(const std::string& host, int port) {
    // Initialize the socket
    client_socket = socket(AF_INET, SOCK_STREAM, 0);
    if (client_socket < 1) {
        return;
    }
    // Set address
    memset(&server_addr, 0, sizeof(server_addr));
    server_addr.sin_family = AF_INET;
    // Set port and IP address
    server_addr.sin_port = htons(port);
    server_addr.sin_addr.s_addr = inet_addr(host.c_str());
    if (connect(client_socket, (struct sockaddr*)&server_addr, sizeof(server_addr)) < 0) {
        close(client_socket);
        return;
    }
}

void Client::run_client() {
    // User interaction loop
    while (true) {
        std::string user_request;
        std::getline(std::cin, user_request);
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

int main(int argc, char* argv[]) {
    // Get the arguments given by the user (host, port)
    if (argc != 3) {
        return 1;
    }
    std::string host = argv[1];
    int port = std::stoi(argv[2]);
    Client client(host, port);
    client.run_client();
    return 0;
}