const Regex = require("../models/regex");
const Users = require("../models/users");

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
        if (!trimmedData)
            return res.status(400).json({ error: "Invalid user data" });

        const { username, password, info } = trimmedData;

        if (!username || !password)
            return res.status(400).json({ error: "Username and password are required" });

        const id = Users.create(trimmedData);

        if (!id)
            return res.status(400).json({ error: "Invalid user data" });
        return res.status(201).location(`${req.originalUrl}/${id}`).end();
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}

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
        if (!user)
            return res.status(404).json({ error: "User not found" });
        return res.status(200).json(user);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}

/**
 * Trims and validates the user profile information.
 * @param {object} info The raw profile info object.
 * @param {string} [info.image] Base64 encoded image string.
 * @param {string} [info.description] User description/bio.
 * @return {{image: string|null, description: string}|null} Sanitized info object or null if invalid.
 */
function trimInfo(info) {
    if (info.image &&
        !(typeof info.image === "string"
            && Regex.image.test(info.image))) {
        return null;
    }
    if (info.description &&
        !(typeof info.description === "string"
            && Regex.description.test(info.description))) {
        return null;
    }

    return {
        image: info.image || null,
        description: info.description || ""
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
    if (data.info && !trimInfo(data.info))
        return null;

    if (data.username &&
        !(typeof data.username === "string" &&
            Regex.username.test(data.username)))
        return null;

    if (data.password &&
        !(typeof data.password === "string" &&
            Regex.password.test(data.password)))
        return null;

    return {
        username: data.username ? data.username : undefined,
        password: data.password ? data.password : undefined,
        info: data.info ? trimInfo(data.info) : {}
    };
}
