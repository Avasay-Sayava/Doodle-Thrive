const users = {};
const { randomUUID: uuid } = require("node:crypto");

/**
 * Creates a new user in the in-memory database.
 * @param {object} userData The user creation data.
 * @param {string} userData.username The desired username.
 * @param {string} userData.password The user's password.
 * @param {object} [userData.info] Optional profile information.
 * @return {string|null} The generated User ID, or null if the user already exists.
 */
exports.create = ({ username, password, info = {} }) => {
  const id = uuid();

  if (users[id]) throw new Error("Unexpected ID collision, try again");

  if (exports.find(username, password)) return null;

  users[id] = {
    id: id,
    username: username,
    password: password,
    info: info,
    starred: [],
  };

  return id;
};

/**
 * Finds a user's ID matching the provided credentials.
 * @param {string} username The username to search for.
 * @param {string} password The password to verify against.
 * @return {string|null} The User ID if credentials match, otherwise null.
 */
exports.find = (username, password) => {
  for (const id in users) {
    if (users[id].username === username && users[id].password === password)
      return id;
  }
  return null;
};

/**
 * Retrieves a user object by ID, excluding sensitive data.
 * @param {string} id The unique identifier of the user.
 * @return {Object|null} The user object (without password), or null if not found.
 */
exports.get = (id) => {
  if (!users[id]) return null;

  const { password, starred, ...user } = users[id];

  return user;
};

/**
 * Retrieves all registered users.
 * @return {Array<Object>} An array of all user objects (excluding passwords).
 */
exports.getAll = () => {
  const result = [];

  for (const id in users) {
    const { password, starred, ...user } = users[id];
    result.push(user);
  }

  return result;
};

exports.star = (id, fileId) => {
  if (!users[id]) return false;

  if (!users[id].starred.includes(fileId)) {
    users[id].starred.push(fileId);
    return true;
  }

  return false;
};

/**
 *
 * @param {string} id The unique identifier of the user.
 * @param {string} fileId The unique identifier of the file to unstar.
 * @returns {boolean} True if the file was unstarred, false otherwise.
 */
exports.unstar = (id, fileId) => {
  if (!users[id]) return false;

  if (users[id].starred.includes(fileId)) {
    users[id].starred = users[id].starred.filter((fId) => fId !== fileId);
    return true;
  }

  return false;
};

/**
 * Retrieves the list of starred file IDs for a user.
 * @param {string} id The unique identifier of the user.
 * @return {Array<string>|null} An array of starred file IDs, or null if user not found.
 */
exports.getStarred = (id) => {
  if (!users[id]) return null;

  return users[id].starred;
};
