const Client = require("../../lib/tcp/client");

const client = new Client();

const host = process.argv[2];
const port = parseInt(process.argv[3]);
const timeout = parseInt(process.argv[5]);
if (!host || !port || !timeout) throw new Error("Arguments must be: <server_host> <server_port> <api_port> <timeout>");


client.connect = client.connect(host, port);

/**
 * 
 * @param {string} name
 * @returns {Promise<{status:number,response:string|null}>}
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
 * 
 * @param {string} name 
 * @param {string} content 
 * @returns {Promise<{status:number,response:null}>}
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
 * 
 * @param {string} name
 * @returns {Promise<{status:number,response:null}>}
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
 * 
 * @param {string} query 
 * @returns {Promise<{status:number,response:string[]}>}
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
