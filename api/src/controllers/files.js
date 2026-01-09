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
        const trimmedData = trimData(req.body);
        if (!trimmedData)
            return res.status(400).json({ error: "Invalid file/folder data" });

        const { name, content, parent, description } = trimmedData;

        if (!name)
            return res.status(400).json({ error: "Missing file/folder name" });

        if (parent &&
            !(Files.info(parent) &&
                Files.info(parent).type === "folder"))
            return res.status(404).json({ error: "Parent file/folder not found" });

        trimmedData.owner = req.user.id;

        if (!description)
            trimmedData.description = "";

        let id;
        if (content) {
            id = await Files.createFile(trimmedData);
            if (!id)
                return res.status(400).json({ error: "Invalid file data" });
        } else {
            id = Files.createFolder(trimmedData);
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

        const trimmedData = trimData(req.body);
        if (!trimmedData)
            return res.status(400).json({ error: "Invalid file/folder data" });

        const { name, owner, content, parent, description } = trimmedData;

        if (!name && !content && !parent && !owner && !description)
            return res.status(400).json({ error: "No changes provided" });
        
        if (owner && !Regex.id.test(owner))
            return res.status(400).json({ error: "Invalid owner id format" });

        if (content && Files.info(id).type !== "file")
            return res.status(400).json({ error: "Cannot add content to a folder" });

        if (parent &&
            !(Files.info(parent) &&
                Files.info(parent).type === "folder"))
            return res.status(404).json({ error: "Parent file/folder not found" });

        const updated = await Files.update(id, trimmedData);
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
 * @param {object} data Raw body data.
 * @param {string} [data.name] File/Folder name.
 * @param {string} [data.owner] Owner ID.
 * @param {string} [data.parent] Parent ID.
 * @param {string} [data.content] File content.
 * @param {string} [data.description] File/Folder description.
 * @return {{name?: string, parent?: string, content?: string, owner?: string, description?: string}|null} Sanitized data object or null if validation fails.
 */
function trimData(data) {
    if (data.name !== undefined &&
        !(typeof data.name === "string" &&
            Regex.filename.test(data.name))) {
        return null;
    }
    if (data.owner !== undefined &&
        !(typeof data.owner === "string" &&
            Regex.id.test(data.owner))) {
        return null;
    }
    if (data.parent !== undefined &&
        !(typeof data.parent === "string" &&
            Regex.id.test(data.parent))) {
        return null;
    }
    if (data.content !== undefined &&
        !(typeof data.content === "string" &&
            Regex.filecontent.test(data.content))) {
        return null;
    }
    if (data.description !== undefined &&
        !(typeof data.description === "string" &&
            Regex.description.test(data.description))) {
        return null;
    }

    return {
        name: data.name,
        owner: data.owner,
        parent: data.parent,
        content: data.content,
        description: data.description,
    };
}
