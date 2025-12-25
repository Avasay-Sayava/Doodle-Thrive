// @ts-check

/**
 * @file lib/tcp.js
 */

/**
 * Namespace for TCP networking utilities.
 * @namespace TCP
 * @description This namespace contains classes and utilities for handling TCP connections.
 */
const TCP = {
    Client: require("./tcp/client")
};

module.exports = TCP;
