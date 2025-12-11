# Doodle-Drive
Doodle-Drive is divided into two main components: A server that handles file storage and retrieval, and two command-line interface (CLI) clients that allows users to interact with the server. The server uses RLE compression to store files efficiently.

This app was developed by Iddo Ben-Ari, Shahar Zuckerman, and Aviv Sayer
## Running
To run the application, start by initializing the server with Docker Compose:
```bash
docker-compose run -d --build --remove-orphans --name server server <port>
```
If you did it once, you dont need to build again, so you can run:
```bash
docker-compose run -d --remove-orphans --name server server <port>
```
Replace `<port>` with the desired port number for the server to listen on.
Next, you can use either of the two CLI clients to interact with the server. To use the python client, run:
```bash
docker-compose run --build --remove-orphans py-client <server-name> <server-port>
```
Or, if you did it once, you can run:
```bash
docker-compose run --remove-orphans py-client <server-name> <server-port>
```
To use the C++ client, run:
```bash
docker-compose run --build --remove-orphans cpp-client <server-name> <server-port>
```
Or, if you did it once, you can run:
```bash
docker-compose run --remove-orphans cpp-client <server-name> <server-port>
```
Replace `<server-name>` with the server's hostname; if using the commands above, use `server`. Replace `<server-port>` with the port number you specified when starting the server.

## Commands

The following commands are supported, keep in mind that commands and filenames are not case-sensitive:
**POST** - Add a new file with specified content.
```
POST <filename> <content>
```
Example:
``` 
POST notes Important meeting tomorrow at 2 PM
POST todo Buy groceries and milk
```

**GET** - Retrieve a file's contents. If the file does not exist, command is ignored.
```
GET <filename>
```
Example:
``` 
GET notes
```
**SEARCH** - Find files that contain a string (returns space-separated filenames). The content can be anything, and could even be empty by putting a space and then no content after it (would return all of the files)
```
SEARCH <search-term>
```
Example:
``` 
SEARCH milk
```
**DELETE** - Delete a specified file. If the file does not exist, command is ignored.
```
DELETE <filename>
```
Example:
``` 
DELETE todo
```

## Example
<img src="./images/full_example.png" alt="Docker Compose command to start the Doodle-Drive application in an interactive terminal with build and orphan removal flags" width="1200" />

## Tests
Run tests with Docker Compose:
```bash
docker-compose run --build --remove-orphans gtest
```
If you did it once, you dont need to build again, so you can run:
```bash
docker-compose run --remove-orphans gtest
```
Tests are located in the `tests` directory.
### Example Test Output
<img src="./images/tests.png"/>

# Loose-coupling and SOLID principles questions:
In Ex2 we refactored Ex1 with a core folder that included storage, handlers, cd, splitter and statusCodes. For I/O we used the clients and server, and the server is pretty much dumb, it takes messages from the user, gives the string to the cd, and returns the output from the cd (while also accounting for multiple clients). Storage was added for dealing with multi-threading, to use any sort of function that alters a file you have to use a storage object, which is locked when you call a function that uses file logic (all functions from Ex1).

These changes, mainly the ones to the Ex1 code, were done for abstraction purposes, we realised when looking at the task that if we wanted to complete it without changing the code, we would need to reorder some logic.

This is the new logic we used, we have a CommandDirector which gets a map at the start of the server of the commands and their handler (explained later), the command director splits the string it receives using the splitter, and calls the handler that match the first arg from the vector that splitter returned. Splitter gets a map of commands, and the amount of argos they receive, and it splits them accordingly, and returns a vector of args, it also uppers the first arg this time, since we are case-insensitive, new splitters can be added for different logic. Finally handlers: each command has a handler which is responsible for the correct output and validation of the command, it gets a vector of arg, it validates that it fits our command, then calls the right function from Ex1. so if we want to change commands, we only need to change their handler, not implementation.

Now with this new logic, we were able to address the mentioned problems. 
## Changing command names
To change command names, we simply needed to pass to the splitter and cd a map with the needed command names, and create a handler for each, which did not require any changes to Ex1 code.
## Adding new commands
In order to add delete, or any new command, we simply need to add its logic, add a simple method for it to Storage, to address multi-threading, then add a handler for it, pass its name and its handler to cd, and its name and arg count to splitter. We only need to add new code.
## Changing output format
The output is simply decided in the handler, so if we want a different output for a command, we just change its handler.
## Switching from console to sockets
This required us to add clients, and a server of course. And we did get rid of our cli code, since we realised it was not up to standard with loose-coupling and SOLID principles, instead we added a file name cd (CommandDirector), which is up to standard.
