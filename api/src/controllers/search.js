const Regex = require("../models/regex");
const Files = require("../models/files");

/**
 * Searches files by content.
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 * @returns {Promise<void>}
 */
exports.search = async (req, res) => {
    try {
        const { query } = req.params;
        if (!query)
            return res.status(400).json({ error: "Search query is required" });

        if (!Regex.filecontent.test(query))
            return res.status(400).json({ error: "Invalid search query format, newlines are not allowed" });

        const results = await Files.search(query);
        return res.status(200).json(results);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}
