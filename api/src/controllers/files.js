const jwt = require("jsonwebtoken");

const Regex = require("../models/regex");
const Files = require("../models/files");
const Users = require("../models/users");
const Permissions = require("../models/permissions");

/**
 * Handles the creation request for a new file or folder.
 * Validates input, checks parent existence, and delegates to the model.
 * @param {import("express").Request} req The Express Request object.
 * @param {import("express").Response} res The Express Response object.
 * @return {Promise<void>}
 */
exports.create = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token)
            return res.status(403).json({ error: "Authorization token required" });

        const userId = jwt.verify(token, process.env.JWT_SECRET);
        if (!userId || !Regex.id.test(userId) || !Users.get(userId))
            return res.status(401).json({ error: "Invalid authorization token" });

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

        if (parent) {
            if (!Permissions.check(userId, parent, "self", "read"))
                return res.status(404).json({ error: "Parent file/folder not found" });

            if (!Permissions.check(userId, parent, "content", "write"))
                return res.status(403).json({ error: "Insufficient permissions" });
        }

        trimmedData.owner = userId;

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

        Permissions.add(id, {
            [userId]: {
                self: { read: true, write: true },
                permissions: { read: true, write: true },
                content: { read: true, write: true },
            }
        });

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
        const token = req.headers.authorization?.split(" ")[1];
        if (!token)
            return res.status(403).json({ error: "Authorization token required" });

        const userId = jwt.verify(token, process.env.JWT_SECRET);
        if (!userId || !Regex.id.test(userId) || !Users.get(userId))
            return res.status(401).json({ error: "Invalid authorization token" });

        const files = await Files.getAll();
        const out = {};

        for (const file of files)
            if (Permissions.check(userId, file.id, "self", "read")
                && (file.trashed === false || file.owner === userId))
                out[file.id] = { ...file, starred: Users.getStarred(userId).includes(file.id) };

        return res.status(200).json(out);
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
        const token = req.headers.authorization?.split(" ")[1];
        if (!token)
            return res.status(403).json({ error: "Authorization token required" });

        const userId = jwt.verify(token, process.env.JWT_SECRET);
        if (!userId || !Regex.id.test(userId) || !Users.get(userId))
            return res.status(401).json({ error: "Invalid authorization token" });

        const { id } = req.params;

        if (!Regex.id.test(id))
            return res.status(400).json({ error: "Invalid file/folder id format" });

        if (!Files.info(id))
            return res.status(404).json({ error: "File/folder not found" });

        if (Files.info(id).trashed === true &&
            Files.info(id).owner !== userId)
            return res.status(404).json({ error: "File/folder not found" });

        if (!Permissions.check(userId, id, "self", "read"))
            return res.status(404).json({ error: "File/folder not found" });

        if (!Permissions.check(userId, id, "content", "read"))
            return res.status(403).json({ error: "Insufficient permissions" });

        const file = await Files.get(id);
        return res.status(200).json({ ...file, starred: Users.getStarred(userId).includes(file.id) });
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
        const token = req.headers.authorization?.split(" ")[1];
        if (!token)
            return res.status(403).json({ error: "Authorization token required" });

        const userId = jwt.verify(token, process.env.JWT_SECRET);
        if (!userId || !Regex.id.test(userId) || !Users.get(userId))
            return res.status(401).json({ error: "Invalid authorization token" });

        const { id } = req.params;

        if (!Regex.id.test(id))
            return res.status(400).json({ error: "Invalid file/folder id format" });

        if (!Files.info(id))
            return res.status(404).json({ error: "File/folder not found" });

        const trimmedData = trimData(req.body);
        if (!trimmedData)
            return res.status(400).json({ error: "Invalid file/folder data" });

        const { name, owner, content, trashed, parent, description } = trimmedData;
        const { starred } = req.body;

        if (!name && !content && !parent && !owner && !description && trashed === undefined && starred === undefined)
            return res.status(400).json({ error: "No changes provided" });

        if (Files.info(id).trashed === true &&
            Files.info(id).owner !== userId)
            return res.status(404).json({ error: "File/folder not found" });

        if (trashed !== undefined) {
            if (name || owner || content || parent || description || starred !== undefined)
                return res.status(400).json({ error: "Cannot change other properties while trashing/untrashing" });
            if (Files.info(id).trashed === false &&
                !Permissions.check(userId, Files.info(id).parent, "content", "write"))
                return res.status(403).json({ error: "Insufficient permissions" });
        }

        if (owner && Files.info(id)?.owner !== userId)
            return res.status(403).json({ error: "Insufficient permissions" });

        if (!Permissions.check(userId, id, "self", "read"))
            return res.status(404).json({ error: "File/folder not found" });

        if ((description || name) && !Permissions.check(userId, id, "self", "write"))
            return res.status(403).json({ error: "Insufficient permissions" });

        if (content && !Permissions.check(userId, id, "content", "write"))
            return res.status(403).json({ error: "Insufficient permissions" });

        if (content && Files.info(id).type !== "file")
            return res.status(400).json({ error: "Cannot add content to a folder" });

        if (parent) {
            if (!(Files.info(parent) &&
                Files.info(parent).type === "folder"))
                return res.status(404).json({ error: "Parent file/folder not found" });

            if (!Permissions.check(userId, parent, "self", "read"))
                return res.status(404).json({ error: "Parent file/folder not found" });

            if (!Permissions.check(userId, parent, "content", "write"))
                return res.status(403).json({ error: "Insufficient permissions" });
        }

        const updated = await Files.update(id, trimmedData);
        if (!updated)
            return res.status(404).json({ error: "File/folder not found" });

        if (starred !== undefined) {
            if (starred) {
                Users.star(userId, id);
            } else {
                Users.unstar(userId, id);
            }
        }

        if (trashed === true) {
            Users.unstar(userId, id);
        }

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
        const token = req.headers.authorization?.split(" ")[1];
        if (!token)
            return res.status(403).json({ error: "Authorization token required" });

        const userId = jwt.verify(token, process.env.JWT_SECRET);
        if (!userId || !Regex.id.test(userId) || !Users.get(userId))
            return res.status(401).json({ error: "Invalid authorization token" });

        const { id } = req.params;

        if (!Regex.id.test(id))
            return res.status(400).json({ error: "Invalid file/folder id format" });

        if (!Files.info(id))
            return res.status(404).json({ error: "File/folder not found" });

        if (!Permissions.check(userId, id, "self", "read"))
            return res.status(404).json({ error: "File/folder not found" });

        if (Files.info(id).trashed === false)
            return res.status(400).json({ error: "Cannot delete a file/folder that is not trashed" });

        if (Files.info(id).owner !== userId)
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
    if (data.trashed !== undefined &&
        typeof data.trashed !== "boolean") {
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
        trashed: data.trashed,
        description: data.description,
    };
}
