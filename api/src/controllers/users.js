const Regex = require("../models/regex");
const Users = require("../models/users");

const exists = (x) => x !== undefined && x !== null;

/**
 * Handles the creation of a new user account.
 * Validates the username, password, and optional profile info before creating the user.
 * @param {import("express").Request} req The Express Request object.
 * @param {import("express").Response} res The Express Response object.
 * @return {Promise<void>}
 */
exports.create = (req, res) => {
  try {
    const trimmedData = trimData(req.body);
    if (!exists(trimmedData))
      return res.status(400).json({ error: "Invalid user data" });

    const { username, password } = trimmedData;

    if (!exists(username) || !exists(password))
      return res
        .status(400)
        .json({ error: "Username and password are required" });

    const id = Users.create(trimmedData);

    if (!exists(id))
      return res.status(400).json({ error: "Invalid user data" });
    return res.status(201).location(`${req.originalUrl}/${id}`).end();
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

/**
 * Retrieves public user information by ID.
 * @param {import("express").Request} req The Express Request object.
 * @param {import("express").Response} res The Express Response object.
 * @return {Promise<void>}
 */
exports.get = (req, res) => {
  try {
    const { id } = req.params;

    if (!Regex.id.test(id))
      return res.status(400).json({ error: "Invalid user id format" });

    const user = Users.get(id);
    if (!exists(user)) return res.status(404).json({ error: "User not found" });
    return res.status(200).json(user);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 * @returns 
 */
exports.find = (req, res) => {
  try {
    const { username } = req.body;

    if (!exists(username))
      return res.status(400).json({ error: "Username is required" });

    if (!Regex.username.test(username))
      return res.status(400).json({ error: "Invalid username format" });

    const users = Users.find(username);
    return res.status(200).json(users);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

/**
 * Trims and validates the user profile information.
 * @param {object} info The raw profile info object.
 * @param {string} [info.image] Base64 encoded image string.
 * @param {string} [info.description] User description/bio.
 * @return {{image: string|null, description: string}|null} Sanitized info object or null if invalid.
 */
function trimInfo(info) {
  if (
    exists(info.image) &&
    !(typeof info.image === "string" && Regex.image.test(info.image))
  ) {
    return null;
  }
  if (
    exists(info.description) &&
    !(
      typeof info.description === "string" &&
      Regex.description.test(info.description)
    )
  ) {
    return null;
  }

  return {
    image: info.image || null,
    description: info.description || "",
  };
}

/**
 * Trims and validates the full user creation data.
 * @param {object} data The raw request body.
 * @param {string} [data.username] The desired username.
 * @param {string} [data.password] The desired password.
 * @param {object} [data.info] The profile info object.
 * @return {{username?: string, password?: string, info: object}|null} Sanitized user data or null if invalid.
 */
function trimData(data) {
  if (exists(data.info) && !exists(trimInfo(data.info))) return null;

  if (
    exists(data.username) &&
    !(typeof data.username === "string" && Regex.username.test(data.username))
  )
    return null;

  if (
    exists(data.password) &&
    !(typeof data.password === "string" && Regex.password.test(data.password))
  )
    return null;

  return {
    username: exists(data.username) ? data.username : undefined,
    password: exists(data.password) ? data.password : undefined,
    info: exists(data.info) ? trimInfo(data.info) : {},
  };
}
