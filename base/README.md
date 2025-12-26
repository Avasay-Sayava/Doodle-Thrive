# Base Storage Server (C++)
The base server is a C++ TCP server that handles persistent file storage operations. The server is working on a request-response model, where clients can send commands to create, read, search, and delete files stored on the server.

Every client has its own connection to the server, and the server can handle multiple clients concurrently. For every request, the server opens a new thread to handle the request, ensuring non-blocking operations for other clients. The threads are managed using a thread pool to optimize resource usage.

Clients can interact with the server using a TCP protocol, hence you can write clients in any programming language that supports TCP sockets. To demonstrate this, we provide both a C++ client and a Python client that can communicate with the server.

## Installation & Running
The project is containerized using Docker. For running parts of the project, there are predefined bash files.
* **To enable the usage of the bash files**, you need to run this command in the root directory:
    ```bash
    chmod +x ./api-server.sh ./api-console.sh ./api-tests.sh ./base-server.sh ./base-client.sh ./base-tests.sh
    ```

* **To start the backend base C++ server**, you need to run the `./base-server.sh` file:
    ```bash
    build=<true|false> name=<host_name> port=<port> threads=<thread_count> ./base-server.sh
    ```
    You can run the file without defining the `build`, `name`, `port`, `threads` variables, and it will sign them the default values `true`, `base-server`, `3000`, `10` each.

* **To run a C++/Python client on a base server**, you need to run the `./base-client.sh` file:
   ```bash
   build=<true|false> type=<1=cpp|2=python> name=<cpp_server_host_name> port=<cpp_server_port> ./base-client.sh
   ```
   You can run the file without defining the `build`, `type` variables, and it will sign them the default values `true`, and ask for the client type on runtime. Note that you are required to define the `name` and `port` variables to connect the client to the C++ backend server.

* **To run the tests for the backend base C++ server**, you need to run the `./base-tests.sh` file:
   ```bash
   build=<true|false> ./base-tests.sh
   ```
   You can run the file without defining the `build` variable, and it will sign it the default value `true`.

## Commands
* **Create a file:** The client sends the following command to the server:
    ```
    POST FILE_NAME FILE_CONTENT
    ```
    On success, the server prints
    ```
    201 Created
    ```

* **Read a file:** The client sends the following command to the server:
    ```
    GET FILE_NAME
    ```
    On success, the server prints
    ```
    200 Ok

    FILE_CONTENT
    ```

* **SEARCH A STRING** in the server's files: The client sends the following command to the server:
    ```
    SEARCH FILE_CONTENT
    ```
    On success, the server prints
    ```
    200 Ok

    FILE_NAME_1
    FILE_NAME_2
    ...
    ```
    If no files contain the string, the server responds with
    ```
    200 Ok


    ```

* **Delete a file:** The client sends the following command to the server:
    ```
    DELETE FILE_NAME
    ```
    On success, the server prints
    ```
    204 No Content
    ```