const jwt = require("jsonwebtoken");

const Regex = require("../models/regex");
const Users = require("../models/users");

/**
 * Authenticates a user and retrieves their User ID.
 * effectively acts as a "login" mechanism by verifying credentials.
 * @param {import("express").Request} req The Express Request object.
 * @param {import("express").Response} res The Express Response object.
 * @return {Promise<void>}
 */
exports.find = (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password)
            return res.status(400).json({ error: "Username and password are required" });

        if (!Regex.username.test(username))
            return res.status(400).json({ error: "Invalid username format" });

        if (!Regex.password.test(password))
            return res.status(400).json({ error: "Invalid password format" });

        const id = Users.find(username, password);
        const token = jwt.sign(id, process.env.JWT_SECRET);

        if (!id)
            return res.status(404).end();
        return res.status(200).json({ token: token });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}
