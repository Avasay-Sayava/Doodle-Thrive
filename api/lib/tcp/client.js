const { createConnection, Socket } = require("node:net");
const { EventEmitter } = require("node:events");

/**
 * A TCP client that connects to a server, sends/receives data, and handles disconnections.
 * Wraps Node.js native net.Socket to provide a simpler, event-driven API.
 *
 * @extends EventEmitter
 */
class Client extends EventEmitter {
    /**
     * The underlying socket connection.
     * @type {Socket|null}
     * @private
     */
    #socket = null;

    /**
     * A promise chain to ensure requests are processed strictly one by one.
     * @type {Promise<any>}
     * @private
     */
    #queue = Promise.resolve();

    /**
     * Connects to the server.
     * @param {string} host The server host.
     * @param {number} port The server port.
     * @return {Promise<Socket>} Resolves with the raw net.Socket instance when connected.
     */
    async connect(host, port) {
        return new Promise((resolve, reject) => {
            const socket = createConnection({ host: host, port: port }, () => {
                this.emit("ready");
                resolve(socket);
            });

            this.#socket = socket;

            socket.on("data", (data) => {
                this.emit("data", data);
            });

            socket.on("error", (err) => {
                this.emit("error", err);
                reject(err);
            });

            socket.on("close", () => {
                if (this.#socket !== socket) return;

                this.#socket = null;
                this.emit("close");
            });
        });
    }

    /**
     * Sends data to the connected server.
     * @param {string|Uint8Array|Buffer} buffer The data payload to send.
     * @return {Promise<void>} Resolves when the data has been flushed to the kernel buffer.
     * @throws {Error} Throws if the client is not currently connected.
     */
    async send(buffer) {
        const socket = this.#socket;

        if (!socket || socket.destroyed)
            throw new Error("Client is not connected.");

        return new Promise((resolve, reject) => {
            socket.write(buffer, (err) => {
                if (err) reject(err);
                else resolve();
            });
        });
    }

    /**
     * Sends data to the server and waits for a response.
     * @param {string|Uint8Array|Buffer} buffer The data payload to send.
     * @param {number} [milliseconds] Time in milliseconds to wait for a response before throwing an error.
     * @return {Promise<string|Buffer>} Response with the data received from the server.
     * @throws {Error} Throws if not connected, if the send fails, or if the request times out.
     */
    async request(buffer, milliseconds) {
        const performRequest = () => new Promise((resolve, reject) => {
            let timer = null;

            const cleanup = () => {
                this.off("data", onData);
                this.off("error", onError);
                if (timer) clearTimeout(timer);
            };

            const onData = (data) => {
                cleanup();
                resolve(data);
            };

            const onError = (err) => {
                cleanup();
                reject(err);
            };

            this.once("data", onData);
            this.once("error", onError);

            if (milliseconds) {
                timer = setTimeout(() => {
                    cleanup();
                    reject(new Error(`Request timed out after ${milliseconds}ms`));
                }, milliseconds);
            }

            this.send(buffer).catch((err) => {
                cleanup();
                reject(err);
            });
        });

        const currentRequest = this.#queue.then(performRequest);
        this.#queue = currentRequest.catch(() => { });

        return currentRequest;
    }

    /**
     * Disconnects gracefully from the server.
     * @return {Promise<void>} Resolves when the connection is fully closed.
     * @throws {Error} Throws if the client is not currently connected.
     */
    async disconnect() {
        const socket = this.#socket;

        if (!socket || socket.destroyed)
            throw new Error("Client is not connected");

        return new Promise((resolve) => {
            socket.once("close", resolve);
            socket.end();
        });
    }
}

module.exports = Client;
