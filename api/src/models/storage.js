const Client = require("../../lib/tcp/client");

const client = new Client();

const host = process.argv[2];
const port = parseInt(process.argv[3]);
const timeout = parseInt(process.argv[5]);

if (!host || !port || !timeout) throw new Error("Arguments must be: <server_host> <server_port> <api_port> <timeout>");

// Initialize connection
client.connect(host, port);

/**
 * Retrieves raw data from the storage server.
 * @param {string} name The unique identifier (UUID) of the file/object.
 * @return {Promise<{status: number, response: string|null}>} An object containing the HTTP-like status code and the response body (if successful).
 */
exports.get = async (name) => {
    const response = (await client.request(`GET ${name}`, timeout))
        .toString();
    if (!response.startsWith("200 Ok"))
        return {
            status: parseInt(response.split(" ")[0]) || 500,
            response: null
        };
    return {
        status: 200,
        response: response.substring("200 Ok\n\n".length, response.length - 1)
    };
}

/**
 * Stores raw data on the storage server.
 * @param {string} name The unique identifier (UUID) for the new entry.
 * @param {string} content The raw string content to be stored.
 * @return {Promise<{status: number, response: null}>} An object containing the status code.
 */
exports.post = async (name, content) => {
    const response = (await client.request(`POST ${name} ${content}`, timeout))
        .toString();
    return {
        status: parseInt(response.split(" ")[0]) || 500,
        response: null
    };
}

/**
 * Deletes data from the storage server.
 * @param {string} name The unique identifier (UUID) of the file to delete.
 * @return {Promise<{status: number, response: null}>} An object containing the status code.
 */
exports.delete = async (name) => {
    const response = (await client.request(`DELETE ${name}`, timeout))
        .toString();
    return {
        status: parseInt(response.split(" ")[0]) || 500,
        response: null
    };
}

/**
 * Searches the storage server for a specific query string.
 * @param {string} query The search term to look for within stored files.
 * @return {Promise<{status: number, response: string[]}>} An object containing the status code and an array of matching file IDs.
 */
exports.search = async (query) => {
    const response = (await client.request(`SEARCH ${query}`, timeout))
        .toString();
    if (!response.startsWith("200 Ok"))
        return {
            status: parseInt(response.split(" ")[0]) || 500,
            response: []
        };
    const results = response.substring("200 Ok\n\n".length, response.length - 1)
        .split(" ").filter(line => line.length > 0);
    return {
        status: 200,
        response: results
    };
}
