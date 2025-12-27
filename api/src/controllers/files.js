const Regex = require("../models/regex");
const Files = require("../models/files");

/**
 * Handles the creation request for a new file or folder.
 * Validates input, checks parent existence, and delegates to the model.
 * @param {import("express").Request} req The Express Request object.
 * @param {import("express").Response} res The Express Response object.
 * @return {Promise<void>}
 */
exports.create = async (req, res) => {
    try {
        const trimmedInfo = trimInfo(req.body);
        if (!trimmedInfo)
            return res.status(400).json({ error: "Invalid file/folder data" });

        const { name, content, parent } = trimmedInfo;

        if (!name)
            return res.status(400).json({ error: "Missing file/folder name" });

        if (parent &&
            !(Files.info(parent) &&
                Files.info(parent).type === "folder"))
            return res.status(404).json({ error: "Parent file/folder not found" });

        let id;
        if (content) {
            id = await Files.createFile(trimmedInfo);
            if (!id)
                return res.status(400).json({ error: "Invalid file data" });
        } else {
            id = Files.createFolder(trimmedInfo);
            if (!id)
                return res.status(400).json({ error: "Invalid folder data" });
        }

        return res.status(201).location(`${req.originalUrl}/${id}`).end();
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}

/**
 * Retrieves the complete list of files and folders.
 * @param {import("express").Request} req The Express Request object.
 * @param {import("express").Response} res The Express Response object.
 * @return {Promise<void>}
 */
exports.getAll = async (req, res) => {
    try {
        const files = await Files.getAll();
        return res.status(200).json(files);
    } catch (err) {
        return res.status(500).json({ error: "Error retrieving files/folders" });
    }
}

/**
 * Retrieves details and content for a specific file or folder by ID.
 * @param {import("express").Request} req The Express Request object.
 * @param {import("express").Response} res The Express Response object.
 * @return {Promise<void>}
 */
exports.get = async (req, res) => {
    try {
        const { id } = req.params;

        if (!Regex.id.test(id))
            return res.status(400).json({ error: "Invalid file/folder id format" });

        if (!Files.info(id))
            return res.status(404).json({ error: "File/folder not found" });

        const file = await Files.get(id);
        return res.status(200).json(file);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}

/**
 * Updates a file or folder's metadata or content based on the provided body.
 * @param {import("express").Request} req The Express Request object.
 * @param {import("express").Response} res The Express Response object.
 * @return {Promise<void>}
 */
exports.update = async (req, res) => {
    try {
        const { id } = req.params;

        if (!Regex.id.test(id))
            return res.status(400).json({ error: "Invalid file/folder id format" });

        if (!Files.info(id))
            return res.status(404).json({ error: "File/folder not found" });

        const trimmedInfo = trimInfo(req.body);
        if (!trimmedInfo)
            return res.status(400).json({ error: "Invalid file/folder data" });

        const { name, content, parent } = trimmedInfo;

        if (!name && !content && !parent)
            return res.status(400).json({ error: "No changes provided" });

        if (content && Files.info(id).type !== "file")
            return res.status(400).json({ error: "Cannot add content to a folder" });

        if (parent &&
            !(Files.info(parent) &&
                Files.info(parent).type === "folder"))
            return res.status(404).json({ error: "Parent file/folder not found" });

        const updated = await Files.update(id, trimmedInfo);
        if (!updated)
            return res.status(404).json({ error: "File/folder not found" });
        return res.status(200).end();
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}

/**
 * Deletes a file or folder by ID.
 * @param {import("express").Request} req The Express Request object.
 * @param {import("express").Response} res The Express Response object.
 * @return {Promise<void>}
 */
exports.delete = async (req, res) => {
    try {
        const { id } = req.params;

        if (!Regex.id.test(id))
            return res.status(400).json({ error: "Invalid file/folder id format" });

        if (!Files.info(id))
            return res.status(404).json({ error: "File/folder not found" });

        const deleted = await Files.delete(id);

        if (!deleted)
            return res.status(404).json({ error: "File/folder not found" });
        return res.status(204).end();
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}

/**
 * Helper function to trim and validate file/folder input data.
 * @param {object} info Raw body data.
 * @param {string} [info.name] File/Folder name.
 * @param {string} [info.parent] Parent ID.
 * @param {string} [info.content] File content.
 * @return {{name?: string, parent?: string, content?: string}|null} Sanitized data object or null if validation fails.
 */
function trimInfo(info) {
    if (info.name &&
        !(typeof info.name === "string" &&
            Regex.filename.test(info.name))) {
        return null;
    }
    if (info.parent &&
        !(typeof info.parent === "string" &&
            Regex.id.test(info.parent))) {
        return null;
    }
    if (info.content &&
        !(typeof info.content === "string" &&
            Regex.filecontent.test(info.content))) {
        return null;
    }

    return {
        name: info.name ? info.name : undefined,
        parent: info.parent ? info.parent : undefined,
        content: info.content ? info.content : undefined
    };
}
