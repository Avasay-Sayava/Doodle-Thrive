const users = {};
const { randomUUID: uuid } = require("node:crypto");

/**
 * Creates a new user with given username and password.
 * @param {{username: string, password: string, info?: object}} param0 
 * @returns {string|null} user ID.
 */
exports.create = ({ username, password, info = {} }) => {
    const id = uuid();

    if (users[id])
        throw new Error("Unexpected ID collision, try again");

    if (exports.find(username, password))
        return null;

    users[id] = {
        id: id,
        username: username,
        password: password,
        info: info
    };

    return id;
}

/**
 * Finds a user by username and password.
 * @param {string} username 
 * @param {string} password 
 * @returns {string|null} user ID.
 */
exports.find = (username, password) => {
    for (const id in users) {
        if (users[id].username === username &&
            users[id].password === password)
            return id;
    }
    return null;
}

/**
 * Gets a user by ID.
 * @param {string} id 
 * @returns {Object|null} user object.
 */
exports.get = (id) => {
    if (!users[id])
        return null;

    const { password, ...user } = users[id];

    return user;
}

/**
 * Gets all users.
 * @returns {Array<Object>} All users without their passwords.
 */
exports.getAll = () => {
    const result = [];

    for (const id in users) {
        const { password, ...user } = users[id];
        result.push(user);
    }

    return result;
}
