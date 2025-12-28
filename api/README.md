# API Server (NodeJS)
The API Server is a NodeJS application built with the Express framework using the Model-View-Controller (MVC) architecture. It acts as the gateway for the Doodle Drive system, handling user authentication, managing file metadata, and acting as a client to the C++ Base Server for physical file storage.

The server exposes a RESTful API that returns JSON responses. While the Base Server handles raw storage, the API Server manages the hierarchy (folders/files), permissions, and user accounts.

## Installation & Running
The project is containerized using Docker. For running parts of the project, there are predefined bash files.
* **To enable the usage of the bash files**, you need to run this command in the root directory:
    ```bash
    chmod +x ./api-server.bash ./api-console.bash ./api-tests.bash ./base-server.bash ./base-client.bash ./base-tests.bash
    ```

    For the objectively fake programmers who don't have bash (or even don't have git bash while using GitHub), each section that uses a bash file is accompanied by the commands to run it.

* **To start the backend base C++ server**, you need to run the `./base-server.bash` file:
    ```bash
    build=<true|false> name=<host_name> port=<port> threads=<thread_count> ./base-server.bash
    ```
    You can run the file without defining the `build`, `name`, `port`, `threads` variables, and it will sign them the default values `true`, `base-server`, `3000`, `10` each.

    If you don't have bash, you can run the following command:
    ```cmd
    docker-compose run <--build|> -d -e THREADS=<thread_count> --name <host_name> base-server <port>
    ```

* **To start the API server**, you need to run the `./api-server.bash` file:
    ```bash
    build=<true|false> server_name=<cpp_server_host_name> server_port=<cpp_server_port> name=<host_name> port=<port> timeout=<requests_timeout_ms> ./api-server.bash
    ```
    You can run the file without defining the `build`, `name`, `port`, `timeout` variables, and it will sign them the default values `true`, `api-server`, `3300`, `100` each. Note that you are required to define the `server_name` and `server_port` variables to connect the API server to the C++ backend server.

    If you don't have bash, you can start the server as shown above and run the following command:
    ```cmd
    docker-compose run <--build|> -d --service-ports --name <host_name> api-server <base_server_host_name> <base_server_port> <port> <timeout>
    ```

* **To get to an API server's console**, you can reply 'Y' in the end of `./api-server.bash` execution, or run the `./api-console.bash` file:
    ```bash
    name=<api_host_name> port=<api_port> ./api-console.bash
    ```
    You can run the file without defining the `name`, `port` variables, and it will sign them the default values `api-server`, `3300` each.

    If you don't have bash, you need first to run the base, API servers and then you can run the following command:
    ```cmd
    docker exec -it <api_server_name> sh
    ```
    TIP: Using the `bash` file you have a predefined sh console that is much more easy to use.

* **To run the tests for the API server**, you need to run the `./api-tests.bash` file:
    ```bash
    build=<true|false> server_name=<cpp_server_host_name> server_port=<cpp_server_port> threads=<cpp_server_thread_count> name=<api_server_host_name> port=<api_server_port> timeout=<requests_timeout_ms> ./api-tests.bash
    ```
    You can run the file without defining the `build`, `server_name`, `server_port`, `threads`, `name`, `port`, `timeout` variables, and it will sign them the default values `true`, `base-server`, `3000`, `10`, `api-server`, `3300`, `100` each.

    If you don't have bash, after running the base and API servers, you can run the following command:
    ```cmd
    docker-compose run $build_arg -e API_SERVER_HOST=<api_server_host_name> -e API_SERVER_PORT=<api_server_port> --remove-orphans api-tests
    ```

## API Endpoints & Usage

### Authentication
Most operations regarding files and folders require user authentication. For this exercise, authentication is performed by passing the headers `Username` and `Password` with the request.

### Users
* **Create a user:**
    ```bash
    curl -i -X POST http://localhost:3300/api/users -H "Content-Type: application/json" -d '{"username": "USERNAME", "password": "PASSWORD", "info": {"image": "data:image/png;base64,...", "description": "DESC"}}'
    ```
    **Response:** `201 Created` with `Location` header.

* **Get user info:**
    ```bash
    curl -i http://localhost:3300/api/users/<USER_ID>
    ```
    **Response:** `200 OK` containing user details (excluding password).

* **Check if can login (Get User ID):**
    ```bash
    curl -i -X POST http://localhost:3300/api/tokens -H "Content-Type: application/json" -d '{"username": "USERNAME", "password": "PASSWORD"}'
    ```
    **Response:** `200 OK` containing `{"id": "USER_ID"}`.

### Files & Folders
* **Get file list (Root):**
    ```bash
    curl -i http://localhost:3300/api/files -H "Username: USERNAME" -H "Password: PASSWORD"
    ```
    **Response:** `200 OK` with a JSON list of files/folders in the root directory.

* **Create a Folder:**
    ```bash
    curl -i -X POST http://localhost:3300/api/files -H "Username: USERNAME" -H "Password: PASSWORD" -H "Content-Type: application/json" -d '{"name": "folder_name", "parent": "PARENT_ID"}'
    ```
    **Response:** `201 Created` with `Location` header.

* **Create a File:**
    ```bash
    curl -i -X POST http://localhost:3300/api/files -H "Username: USERNAME" -H "Password: PASSWORD" -H "Content-Type: application/json" -d '{"name": "file.txt", "parent": "PARENT_ID", "content": "Hello World"}'
    ```
    **Response:** `201 Created`.

* **Get File/Folder Content/Details:**
    ```bash
    curl -i http://localhost:3300/api/files/<FILE_ID> -H "Username: USERNAME" -H "Password: PASSWORD"
    ```
    **Response:** `200 OK` with file metadata and content.

* **Update File/Folder (Rename/Content/Parent):**
    ```bash
    curl -i -X PATCH http://localhost:3300/api/files/<FILE_ID> -H "Username: USERNAME" -H "Password: PASSWORD" -H "Content-Type: application/json" -d '{"name": "new_name.txt", "content": "new content", "parent": "NEW_PARENT_ID"}'
    ```
    **Response:** `200 OK`.

* **Delete File/Folder:**
    ```bash
    curl -i -X DELETE http://localhost:3300/api/files/<FILE_ID> -H "Username: USERNAME" -H "Password: PASSWORD"
    ```
    **Response:** `204 No Content`.

### Permissions
* **Get Permissions:**
    ```bash
    curl -i http://localhost:3300/api/files/<FILE_ID>/permissions -H "Username: USERNAME" -H "Password: PASSWORD"
    ```
    **Response:** `200 OK`.

* **Add Permission:**
    ```bash
    curl -i -X POST http://localhost:3300/api/files/<FILE_ID>/permissions -H "Username: USERNAME" -H "Password: PASSWORD" -H "Content-Type: application/json" -d '{"options": {"<USER_ID>": {"read": boolean, "write": boolean, "permissions": {"read": boolean, "write": boolean}}}}'
    ```
    **Response:** `201 Created`.

* **Update Permission:**
    ```bash
        curl -i -X PATCH http://localhost:3300/api/files/<FILE_ID>/permissions/<PERMISSION_ID> -H "Username: USERNAME" -H "Password: PASSWORD" -H "Content-Type: application/json" -d '{"options": {"<USER_ID>": {"read": boolean, "write": boolean, "permissions": {"read": boolean, "write": boolean}}}}'
    ```
    **Response:** `200 OK`.

* **Delete Permission:**
    ```bash
    curl -i -X DELETE http://localhost:3300/api/files/<FILE_ID>/permissions/<PERMISSION_ID> -H "Username: USERNAME" -H "Password: PASSWORD"
    ```
    **Response:** `204 No Content`.

### Search
* **Search for files:**
    ```bash
    curl -i http://localhost:3300/api/search/<QUERY_STRING> -H "Username: USERNAME" -H "Password: PASSWORD"
    ```
    **Response:** `200 OK` with a dictionary of all matching files (by name or content).