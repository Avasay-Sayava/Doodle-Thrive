# API Server (NodeJS)
The API Server is a NodeJS application built with the Express framework using the Model-View-Controller (MVC) architecture. It acts as the gateway for the Doodle Drive system, handling user authentication, managing file metadata, and acting as a client to the C++ Base Server for physical file storage.

The server exposes a RESTful API that returns JSON responses. While the Base Server handles raw storage, the API Server manages the hierarchy (folders/files), permissions, and user accounts.

## Installation & Running
The project is containerized using Docker. For running parts of the project, there are predefined bash files.

* **To enable the usage of the bash files**, you need to run this command in the root directory:
    ```bash
    chmod +x ./api-server.bash ./api-console.bash ./api-tests.bash
    ```

* **To start the API server**, you need to run the `./api-server.bash` file:
    ```bash
    build=<true|false> server_name=<cpp_server_host_name> server_port=<cpp_server_port> name=<host_name> port=<port> timeout=<requests_timeout_ms> ./api-server.bash
    ```
    You can run the file without defining the `build`, `name`, `port`, `timeout` variables, and it will sign them the default values `true`, `api-server`, `3300`, `5` each. Note that you are required to define the `server_name` and `server_port` variables to connect the API server to the C++ backend server.

* **To get to an API server's console**, you can reply 'Y' in the end of `./base-server.bash` execution, or run the `./api-console.bash` file:
    ```bash
    name=<api_host_name> port=<api_port> ./api-console.bash
    ```
    You can run the file without defining the `name`, `port` variables, and it will sign them the default values `api-server`, `3300` each.

* **To run the tests for the API server**, you need to run the `./api-tests.bash` file:
    ```bash
    build=<true|false> ./api-tests.bash
    ```
    You can run the file without defining the `build` variable, and it will sign it the default value `true`.

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
    **Response:** `200 OK` with a list of file IDs containing the query string in their name or content.