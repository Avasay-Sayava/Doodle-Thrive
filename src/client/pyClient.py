# client_py/pyClient.py

import sys
from socket import socket

class Client:
    SIZE = 4096
    def __init__(self, host, port):
        self.host = host
        self.port = port

        # Initialize the socket
        self.client_socket = socket()
        self.client_socket.connect((self.host, self.port))

    def run_client(self):
        # User interaction loop
        while True:
            command = input()
            response = self.send_command(command)
            print(response)

    
    def send_command(self, command):
        self.client_socket.sendall(command.encode())
        response = self.client_socket.recv(self.SIZE).decode()
        return response

if __name__ == "__main__":
    # Get the arguments given by the user (host, port)
    if len(sys.argv) != 3:
        sys.exit(1)

    host = sys.argv[1]
    port = int(sys.argv[2])
    client = Client(host, port)
    client.run_client()