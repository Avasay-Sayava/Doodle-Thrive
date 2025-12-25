// @ts-check

/**
 * @file lib/tcp/client.js
 */

const { createConnection, Socket } = require("node:net");
const { EventEmitter } = require("node:events");

/**
 * A TCP client that connects to a server, sends/receives data, and handles disconnections.
 * 
 * @class Client
 * @memberof TCP
 * @extends EventEmitter
 * @summary High-level TCP Client wrapper.
 * @description This class wraps Node.js native net.Socket to provide a simpler, event-driven API.
 * 
 * @fires TCP.Client#ready
 * @fires TCP.Client#data
 * @fires TCP.Client#error
 * @fires TCP.Client#close
 */
class Client extends EventEmitter {
    /**
     * The underlying socket connection.
     * @type {Socket|null}
     */
    #socket = null;

    /**
     * A promise chain to ensure requests are processed strictly one by one.
     * @type {Promise<any>}
     */
    #queue = Promise.resolve();

    /**
     * Fired when the client successfully connects to the server.
     * @event TCP.Client#ready
     * @memberof TCP.Client
     */

    /**
     * Fired when data is received from the server.
     * @event TCP.Client#data
     * @memberof TCP.Client
     * @type {object}
     * @property {Buffer|string} data The raw data payload received from the server.
     */

    /**
     * Fired when a connection error occurs.
     * @event TCP.Client#error
     * @memberof TCP.Client
     * @type {object}
     * @property {Error} error The error object thrown by the socket.
     */

    /**
     * Fired when the connection is closed.
     * @event TCP.Client#close
     * @memberof TCP.Client
     */

    /**
     * Connects to the server.
     * 
     * @async
     * @method connect
     * @memberof TCP.Client#
     * @param {string} host The server host.
     * @param {number} port The server port.
     * @returns {Promise<Socket>} Resolves with the raw net.Socket instance when connected.
     * @throws {Error} If the connection fails or times out.
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
     * 
     * @async
     * @method send
     * @memberof TCP.Client#
     * @param {string|Uint8Array|Buffer} buffer The data payload to send.
     * @returns {Promise<void>} Resolves when the data has been flushed to the kernel buffer.
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
     * 
     * @async
     * @method request
     * @memberof TCP.Client#
     * @param {string|Uint8Array|Buffer} buffer The data payload to send.
     * @param {number} [milliseconds] Time in milliseconds to wait for a response before throwing an error.
     * @returns {Promise<string|Buffer>} Response with the data received from the server.
     * @throws {Error} Throws if not connected, if the send fails, or if the request times out.
     */
    async request(buffer, milliseconds) {
        /**
         * Performs the actual request operation.
         * @returns {Promise<string|Buffer>}
         */
        const performRequest = () => new Promise((resolve, reject) => {
            /**
             * @type {null|NodeJS.Timeout}
             */
            let timer = null;

            /**
             * Removes listeners and clears timeout.
             */
            const cleanup = () => {
                this.off("data", onData);
                this.off("error", onError);
                if (timer) clearTimeout(timer);
            };

            /**
             * Data response handler.
             * @param {string|Buffer} data
             */
            const onData = (data) => {
                cleanup();
                resolve(data);
            };

            /**
             * Error handler.
             * @param {Error} err
             */
            const onError = (err) => {
                cleanup();
                reject(err);
            };

            // Setup Listeners
            this.once("data", onData);
            this.once("error", onError);

            // Setup Timeout (if provided)
            if (milliseconds) {
                timer = setTimeout(() => {
                    cleanup();
                    reject(new Error(`Request timed out after ${milliseconds}ms`));
                }, milliseconds);
            }

            // Send Data
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
     * 
     * @async
     * @method disconnect
     * @memberof TCP.Client#
     * @returns {Promise<void>} Resolves when the connection is fully closed and the "close" event has emitted.
     * @throws {Error} Throws if the client is not currently connected.
     */
    async disconnect() {
        const socket = this.#socket;

        if (!socket || socket.destroyed)
            throw new Error("Client is not connected.");

        return new Promise((resolve) => {
            socket.once("close", resolve);
            socket.end();
        });
    }
}

module.exports = Client;
