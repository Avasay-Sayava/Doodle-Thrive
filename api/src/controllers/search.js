const jwt = require("jsonwebtoken");

const Regex = require("../models/regex");
const Files = require("../models/files");

/**
 * Searches for files containing the specified query string.
 * @param {import("express").Request} req The Express Request object.
 * @param {import("express").Response} res The Express Response object.
 * @return {Promise<void>}
 */
exports.search = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token)
            return res.status(403).json({ error: "Authorization token required" });

        const userId = jwt.verify(token, process.env.JWT_SECRET);
        if (!userId || !Regex.id.test(userId) || !Users.get(userId))
            return res.status(401).json({ error: "Invalid authorization token" });

        const { query } = req.params;
        if (!query)
            return res.status(400).json({ error: "Search query is required" });

        if (!Regex.filecontent.test(query))
            return res.status(400).json({ error: "Invalid search query format, newlines are not allowed" });

        const results = await Files.search(query);
        const out = {};

        for (const fileId of results)
            if (Permissions.check(userId, fileId, "content", "read"))
                out[fileId] = results[fileId];

        return res.status(200).json(out);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}
