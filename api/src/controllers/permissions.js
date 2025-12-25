const Permissions = require("../models/permissions");
const Files = require("../models/files");
const Regex = require("../models/regex");

/**
 * Adds new permissions to a file.
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 * @returns {Promise<void>}
 */
exports.add = async (req, res) => {
    try {
        const { id } = req.params;

        if (!Regex.id.test(id))
            return res.status(400).json({ error: "Invalid file id format" });

        if (!Files.info(id))
            return res.status(404).json({ error: "File not found" });

        const { options } = req.body;
        if (!options)
            return res.status(400).json({ error: "Permission options are required" });

        const trimmedOptions = trimOptions(options);
        if (!trimmedOptions)
            return res.status(400).json({ error: "Invalid permission data" });

        const pId = Permissions.add(id, trimmedOptions);

        if (!pId)
            return res.status(400).json({ error: "Invalid permission data" });
        return res.status(201).location(`${req.originalUrl}/${pId}`).end();
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}

/**
 * Retrieves permissions for a file.
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 * @returns {Promise<void>}
 */
exports.get = async (req, res) => {
    try {
        const { id } = req.params;

        if (!Regex.id.test(id))
            return res.status(400).json({ error: "Invalid file id format" });

        if (!Files.info(id))
            return res.status(404).json({ error: "File not found" });

        const permissions = Permissions.get(id);
        return res.status(200).json(permissions);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}

/**
 * Updates a permission for a file.
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 * @returns {Promise<void>}
 */
exports.update = async (req, res) => {
    try {
        const { id, pId } = req.params;

        if (!Regex.id.test(id))
            return res.status(400).json({ error: "Invalid file id format" });

        if (!Files.info(id))
            return res.status(404).json({ error: "File not found" });

        if (!Regex.id.test(pId))
            return res.status(400).json({ error: "Invalid permissions id format" });

        if (!Permissions.get(id, pId))
            return res.status(404).json({ error: "Permissions not found" });

        const { options } = req.body;
        if (!options)
            return res.status(400).json({ error: "Permission options are required" });

        const trimmedOptions = trimOptions(options);
        if (!trimmedOptions)
            return res.status(400).json({ error: "Invalid permission data" });

        const updated = Permissions.update(id, pId, trimmedOptions);

        if (!updated)
            return res.status(400).json({ error: "Invalid permission data" });
        return res.status(200).end();
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}

/**
 * Deletes a permission from a file.
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 * @returns {Promise<void>}
 */
exports.delete = async (req, res) => {
    try {
        const { id, pId } = req.params;

        if (!Regex.id.test(id))
            return res.status(400).json({ error: "Invalid file id format" });

        if (!Files.info(id))
            return res.status(404).json({ error: "File not found" });

        if (!Regex.id.test(pId))
            return res.status(400).json({ error: "Invalid permissions id format" });

        if (!Permissions.get(id, pId))
            return res.status(404).json({ error: "Permissions not found" });

        Permissions.delete(id, pId);
        return res.status(204).end();
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}

/**
 * Trims and validates permission options.
 * @param {object} options 
 * @returns {object|null}
 */
function trimOptions(options) {
    const trimmed = {};

    for (const key in options) {
        if (!Regex.id.test(key))
            return null;
        if (options[key].write && typeof options[key].write !== 'boolean')
            return null;
        if (options[key].read && typeof options[key].read !== 'boolean')
            return null;
        if (options[key].permissions) {
            if (options[key].permissions.read && typeof options[key].permissions.read !== 'boolean')
                return null;
            if (options[key].permissions.write && typeof options[key].permissions.write !== 'boolean')
                return null;
        }

        trimmed[key] = {
            write: options[key].write === true,
            read: options[key].read === true,
            permissions: {
                read: options[key].permissions?.read === true,
                write: options[key].permissions?.write === true
            }
        }
    }

    return trimmed;
}
