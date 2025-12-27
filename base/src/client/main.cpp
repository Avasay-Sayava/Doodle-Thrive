#include "client.h"

#include <iostream>
#include <string>

int main(int argc, char* argv[])
{
    // Get the arguments given by the user (host, port)
    if (argc != 3)
    {
        return 1;
    }

    std::string host = argv[1];
    int port = std::stoi(argv[2]);

    // Create and run the client
    client client(host, port);
    client.run_client();

    return 0;
}
