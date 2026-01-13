const jwt = require("jsonwebtoken");

const Regex = require("../models/regex");
const Files = require("../models/files");
const Users = require("../models/users");
const Permissions = require("../models/permissions");

const exists = (x) => x !== undefined && x !== null;

/**
 * Check if user has access to a file/folder via parent folder permissions
 * @param {string} userId The user ID
 * @param {string} fileId The file/folder ID
 * @returns {boolean} True if user has access via any parent
 */
const hasAccessViaParent = (userId, fileId) => {
  let current = Files.info(fileId);
  
  while (current && current.parent) {
    const parent = Files.info(current.parent);
    if (!parent) break;
    
    // If user has content.read on parent, they can access this file
    if (Permissions.check(userId, parent.id, "content", "read")) {
      return true;
    }
    
    current = parent;
  }
  
  return false;
};

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
    if (!exists(token))
      return res.status(403).json({ error: "Authorization token required" });

    const userId = (() => {try {return (() => {try {return jwt.verify(token, process.env.JWT_SECRET)} catch(err) {return undefined} })(); } catch(err) {return undefined} })();
    if (!exists(userId) || !Regex.id.test(userId) || !Users.get(userId))
      return res.status(401).json({ error: "Invalid authorization token" });

    const trimmedData = trimData(req.body);
    if (!exists(trimmedData))
      return res.status(400).json({ error: "Invalid file/folder data" });

    const { name, content, parent, description } = trimmedData;

    if (!exists(name))
      return res.status(400).json({ error: "Missing file/folder name" });

    if (
      exists(parent) &&
      !(Files.info(parent) && Files.info(parent).type === "folder")
    )
      return res.status(404).json({ error: "Parent file/folder not found" });

    if (exists(parent)) {
      if (!Permissions.check(userId, parent, "self", "read"))
        return res.status(404).json({ error: "Parent file/folder not found" });

      if (!Permissions.check(userId, parent, "content", "write"))
        return res.status(403).json({ error: "Insufficient permissions" });
    }

    trimmedData.owner = userId;

    if (!exists(description)) trimmedData.description = "";

    let id;
    if (exists(content)) {
      id = await Files.createFile(trimmedData);
      if (!id) return res.status(400).json({ error: "Invalid file data" });
    } else {
      id = Files.createFolder(trimmedData);
      if (!id) return res.status(400).json({ error: "Invalid folder data" });
    }

    Permissions.add(id, {
      [userId]: {
        self: { read: true, write: true },
        permissions: { read: true, write: true },
        content: { read: true, write: true },
      },
    });

    return res.status(201).location(`${req.originalUrl}/${id}`).end();
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

/**
 * Retrieves the complete list of files and folders.
 * @param {import("express").Request} req The Express Request object.
 * @param {import("express").Response} res The Express Response object.
 * @return {Promise<void>}
 */
exports.getAll = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!exists(token))
      return res.status(403).json({ error: "Authorization token required" });

    const userId = (() => {try {return jwt.verify(token, process.env.JWT_SECRET)} catch(err) {return undefined} })();
    if (!exists(userId) || !Regex.id.test(userId) || !Users.get(userId))
      return res.status(401).json({ error: "Invalid authorization token" });

    const files = await Files.getAll();
    const out = {};

    // add files user owns or has direct permissions to
    for (const file of Object.values(files))
      if (
        Permissions.check(userId, file.id, "self", "read") &&
        (file.trashed === false || file.owner === userId)
      )
        out[file.id] = {
          ...file,
          starred: Users.getStarred(userId).includes(file.id),
        };

    // recursively add descendants of folders user has content.read access to
    const addDescendants = (parentId) => {
      for (const file of Object.values(files)) {
        if (file.parent === parentId && !out[file.id] && file.trashed === false) {
          out[file.id] = {
            ...file,
            starred: Users.getStarred(userId).includes(file.id),
          };
          // If this child is a folder, recursively add its descendants
          if (file.type === "folder") {
            addDescendants(file.id);
          }
        }
      }
    };

    const accessibleFolders = Object.values(out).filter(f => f.type === "folder");
    for (const folder of accessibleFolders) {
      if (Permissions.check(userId, folder.id, "content", "read")) {
        addDescendants(folder.id);
      }
    }

    return res.status(200).json(out);
  } catch (err) {
    return res.status(500).json({ error: "Error retrieving files/folders" });
  }
};

/**
 * Retrieves details and content for a specific file or folder by ID.
 * @param {import("express").Request} req The Express Request object.
 * @param {import("express").Response} res The Express Response object.
 * @return {Promise<void>}
 */
exports.get = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!exists(token))
      return res.status(403).json({ error: "Authorization token required" });

    const userId = (() => {try {return jwt.verify(token, process.env.JWT_SECRET)} catch(err) {return undefined} })();
    if (!exists(userId) || !Regex.id.test(userId) || !Users.get(userId))
      return res.status(401).json({ error: "Invalid authorization token" });

    const { id } = req.params;

    if (!Regex.id.test(id))
      return res.status(400).json({ error: "Invalid file/folder id format" });

    if (!Files.info(id))
      return res.status(404).json({ error: "File/folder not found" });

    if (Files.info(id).trashed === true && Files.info(id).owner !== userId)
      return res.status(404).json({ error: "File/folder not found" });

    // Check if user has direct permission or access via parent folder
    if (!Permissions.check(userId, id, "self", "read") && !hasAccessViaParent(userId, id))
      return res.status(404).json({ error: "File/folder not found" });

    if (!Permissions.check(userId, id, "content", "read") && !hasAccessViaParent(userId, id))
      return res.status(403).json({ error: "Insufficient permissions" });

    const file = await Files.get(id);
    return res
      .status(200)
      .json({ ...file, starred: Users.getStarred(userId).includes(file.id) });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

/**
 * Updates a file or folder's metadata or content based on the provided body.
 * @param {import("express").Request} req The Express Request object.
 * @param {import("express").Response} res The Express Response object.
 * @return {Promise<void>}
 */
exports.update = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!exists(token))
      return res.status(403).json({ error: "Authorization token required" });

    const userId = (() => {try {return jwt.verify(token, process.env.JWT_SECRET)} catch(err) {return undefined} })();
    if (!exists(userId) || !Regex.id.test(userId) || !Users.get(userId))
      return res.status(401).json({ error: "Invalid authorization token" });

    const { id } = req.params;

    if (!Regex.id.test(id))
      return res.status(400).json({ error: "Invalid file/folder id format" });

    if (!Files.info(id))
      return res.status(404).json({ error: "File/folder not found" });

    const trimmedData = trimData(req.body);
    if (!exists(trimmedData))
      return res.status(400).json({ error: "Invalid file/folder data" });

    const ownerChange = exists(trimmedData.owner) && trimmedData.owner !== Files.info(id).owner;

    if (ownerChange && !Users.get(trimmedData.owner))
      return res.status(404).json({ error: "New owner not found" });

    if (ownerChange) trimmedData.parent = null;

    const { name, owner, content, trashed, parent, description } = trimmedData;
    const { starred } = req.body;

    if (
      !exists(name) &&
      !exists(content) &&
      !("parent" in trimmedData) &&
      !exists(owner) &&
      !exists(description) &&
      !exists(trashed) &&
      !exists(starred)
    )
      return res.status(400).json({ error: "No changes provided" });

    if (Files.info(id).trashed === true && Files.info(id).owner !== userId)
      return res.status(404).json({ error: "File/folder not found" });

    if (exists(trashed)) {
      if (
        exists(name) ||
        exists(owner) ||
        exists(content) ||
        exists(parent) ||
        exists(description) ||
        exists(starred)
      )
        return res.status(400).json({
          error: "Cannot change other properties while trashing/untrashing",
        });
      if (
        Files.info(id).trashed === false &&
        !Permissions.check(userId, Files.info(id).parent || Files.info(id).owner, "content", "write")
      )
        return res.status(403).json({ error: "Insufficient permissions" });
    }

    if (exists(owner) && Files.info(id)?.owner !== userId)
      return res.status(403).json({ error: "Insufficient permissions" });

    if (!Permissions.check(userId, id, "self", "read"))
      return res.status(404).json({ error: "File/folder not found" });

    if (
      (exists(description) || exists(name)) &&
      !Permissions.check(userId, id, "self", "write")
    )
      return res.status(403).json({ error: "Insufficient permissions" });

    if (exists(content) && !Permissions.check(userId, id, "content", "write"))
      return res.status(403).json({ error: "Insufficient permissions" });

    if (exists(content) && Files.info(id).type !== "file")
      return res.status(400).json({ error: "Cannot add content to a folder" });

    if (exists(parent)) {
      if (!(Files.info(parent) && Files.info(parent).type === "folder"))
        return res.status(404).json({ error: "Parent file/folder not found" });

      if (!Permissions.check(userId, parent, "self", "read"))
        return res.status(404).json({ error: "Parent file/folder not found" });

      if (!Permissions.check(userId, parent, "content", "write"))
        return res.status(403).json({ error: "Insufficient permissions" });
    }

    const updated = await Files.update(id, trimmedData);
    if (!exists(updated))
      return res.status(404).json({ error: "File/folder not found" });

    if (exists(starred)) {
      if (starred === true) {
        Users.star(userId, id);
      } else {
        Users.unstar(userId, id);
      }
    }

    if (exists(trashed) && trashed === true) {
      Users.unstar(userId, id);
    }

    return res.status(200).end();
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

/**
 * Deletes a file or folder by ID.
 * @param {import("express").Request} req The Express Request object.
 * @param {import("express").Response} res The Express Response object.
 * @return {Promise<void>}
 */
exports.delete = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!exists(token))
      return res.status(403).json({ error: "Authorization token required" });

    const userId = (() => {try {return jwt.verify(token, process.env.JWT_SECRET)} catch(err) {return undefined} })();
    if (!exists(userId) || !Regex.id.test(userId) || !Users.get(userId))
      return res.status(401).json({ error: "Invalid authorization token" });

    const { id } = req.params;

    if (!Regex.id.test(id))
      return res.status(400).json({ error: "Invalid file/folder id format" });

    if (!Files.info(id))
      return res.status(404).json({ error: "File/folder not found" });

    if (!Permissions.check(userId, id, "self", "read"))
      return res.status(404).json({ error: "File/folder not found" });

    if (Files.info(id).trashed === false)
      return res
        .status(400)
        .json({ error: "Cannot delete a file/folder that is not trashed" });

    if (Files.info(id).owner !== userId)
      return res.status(404).json({ error: "File/folder not found" });

    const deleted = await Files.delete(id);

    if (!exists(deleted))
      return res.status(404).json({ error: "File/folder not found" });
    return res.status(204).end();
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

/**
 * Helper function to trim and validate file/folder input data.
 * @param {object} data Raw body data.
 * @return {{name?: string, parent?: string, content?: string, owner?: string, description?: string}|null} Sanitized data object or null if validation fails.
 */
function trimData(data) {
  if (
    exists(data.name) &&
    !(typeof data.name === "string" && Regex.filename.test(data.name))
  ) {
    return null;
  }
  if (
    exists(data.owner) &&
    !(typeof data.owner === "string" && Regex.id.test(data.owner))
  ) {
    return null;
  }
  if (
    exists(data.parent) &&
    !(typeof data.parent === "string" && Regex.id.test(data.parent))
  ) {
    return null;
  }
  if (
    exists(data.content) &&
    !(typeof data.content === "string" && Regex.filecontent.test(data.content))
  ) {
    return null;
  }
  if (exists(data.trashed) && typeof data.trashed !== "boolean") {
    return null;
  }
  if (
    exists(data.description) &&
    !(
      typeof data.description === "string" &&
      Regex.description.test(data.description)
    )
  ) {
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
