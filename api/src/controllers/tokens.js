const jwt = require("jsonwebtoken");

const Regex = require("../models/regex");
const Users = require("../models/users");

const exists = (x) => x !== undefined && x !== null;

/**
 * Authenticates a user and retrieves their User ID.
 * effectively acts as a "login" mechanism by verifying credentials.
 * @param {import("express").Request} req The Express Request object.
 * @param {import("express").Response} res The Express Response object.
 * @return {Promise<void>}
 */
exports.auth = (req, res) => {
  try {
    const { username, password } = req.body;

    if (!exists(username) || !exists(password))
      return res
        .status(400)
        .json({ error: "Username and password are required" });

    if (!Regex.username.test(username))
      return res.status(400).json({ error: "Invalid username format" });

    if (!Regex.password.test(password))
      return res.status(400).json({ error: "Invalid password format" });

    const id = Users.find(username, password);
    if (!exists(id)) return res.status(404).json({ error: "User not found" });

    const token = jwt.sign(id, process.env.JWT_SECRET);

    return res.status(200).json({ token: token, id: id });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.id = (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!exists(token))
      return res.status(403).json({ error: "Authorization token required" });

    const userId = (() => {
      try {
        return jwt.verify(token, process.env.JWT_SECRET);
      } catch (err) {
        return undefined;
      }
    })();

    if (!exists(userId) || !Regex.id.test(userId) || !Users.get(userId))
      return res.status(401).json({ error: "Invalid authorization token" });

    return res.status(200).json({ id: userId });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

