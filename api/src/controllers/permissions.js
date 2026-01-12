const jwt = require("jsonwebtoken");

const Permissions = require("../models/permissions");
const Files = require("../models/files");
const Regex = require("../models/regex");
const Users = require("../models/users");

const exists = (x) => x !== undefined && x !== null;

/**
 * Adds new permission settings to a specific file.
 * @param {import("express").Request} req The Express Request object.
 * @param {import("express").Response} res The Express Response object.
 * @return {Promise<void>}
 */
exports.add = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!exists(token))
      return res.status(403).json({ error: "Authorization token required" });

    const userId = (() => {try {return jwt.verify(token, process.env.JWT_SECRET)} catch(err) {return undefined} })();
    if (!exists(userId) || !Regex.id.test(userId) || !Users.get(userId))
      return res.status(401).json({ error: "Invalid authorization token" });

    const { id } = req.params;

    if (!Regex.id.test(id))
      return res.status(400).json({ error: "Invalid file id format" });

    if (!Files.info(id))
      return res.status(404).json({ error: "File not found" });

    if (!Permissions.check(userId, id, "self", "read"))
      return res.status(404).json({ error: "File not found" });

    if (!Permissions.check(userId, id, "permissions", "write"))
      return res.status(403).json({ error: "Insufficient permissions" });

    const { options } = req.body;
    if (!exists(options))
      return res.status(400).json({ error: "Permission options are required" });

    const trimmedOptions = trimOptions(options);
    if (!exists(trimmedOptions))
      return res.status(400).json({ error: "Invalid permission data" });

    const pId = Permissions.add(id, trimmedOptions);

    if (!exists(pId))
      return res.status(400).json({ error: "Invalid permission data" });
    return res.status(201).location(`${req.originalUrl}/${pId}`).end();
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

/**
 * Retrieves all permissions associated with a file.
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
      return res.status(400).json({ error: "Invalid file id format" });

    if (!Files.info(id))
      return res.status(404).json({ error: "File/Folder not found" });

    if (!Permissions.check(userId, id, "self", "read"))
      return res.status(404).json({ error: "File/Folder not found" });

    if (!Permissions.check(userId, id, "permissions", "read"))
      return res.status(403).json({ error: "Insufficient permissions" });

    const permissions = Permissions.get(id);
    return res.status(200).json(permissions);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

/**
 * Updates a specific permission entry for a file.
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

    const { id, pId } = req.params;

    if (!Regex.id.test(id))
      return res.status(400).json({ error: "Invalid file id format" });

    if (!Files.info(id))
      return res.status(404).json({ error: "File not found" });

    if (!Permissions.check(userId, id, "self", "read"))
      return res.status(404).json({ error: "File not found" });

    if (!Permissions.check(userId, id, "permissions", "write"))
      return res.status(403).json({ error: "Insufficient permissions" });

    if (!Regex.id.test(pId))
      return res.status(400).json({ error: "Invalid permissions id format" });

    if (!Permissions.get(id, pId))
      return res.status(404).json({ error: "Permissions not found" });

    const { options } = req.body;
    if (!exists(options))
      return res.status(400).json({ error: "Permission options are required" });

    const trimmedOptions = trimOptions(options);
    if (!exists(trimmedOptions))
      return res.status(400).json({ error: "Invalid permission data" });

    const updated = Permissions.update(id, pId, trimmedOptions);

    if (!exists(updated))
      return res.status(400).json({ error: "Invalid permission data" });
    return res.status(200).end();
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

/**
 * Deletes a specific permission from a file.
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

    const { id, pId } = req.params;

    if (!Regex.id.test(id))
      return res.status(400).json({ error: "Invalid file id format" });

    if (!Files.info(id))
      return res.status(404).json({ error: "File not found" });

    if (!Permissions.check(userId, id, "self", "read"))
      return res.status(404).json({ error: "File not found" });

    if (!Permissions.check(userId, id, "permissions", "write"))
      return res.status(403).json({ error: "Insufficient permissions" });

    if (!Regex.id.test(pId))
      return res.status(400).json({ error: "Invalid permissions id format" });

    if (!Permissions.get(id, pId))
      return res.status(404).json({ error: "Permissions not found" });

    Permissions.delete(id, pId);
    return res.status(204).end();
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

/**
 * Trims and validates the structure of permission options.
 * The options object is a map where keys are User IDs and values are permission settings.
 * @param {object} options Raw permission options.
 * @return {object|null} Sanitized options map or null if validation fails.
 */
function trimOptions(options) {
  const trimmed = {};

  for (const key in options) {
    if (!Regex.id.test(key)) return null;

    if (options[key].self) {
      if (
        exists(options[key].self.read) &&
        typeof options[key].self.read !== "boolean"
      )
        return null;
      if (
        exists(options[key].self.write) &&
        typeof options[key].self.write !== "boolean"
      )
        return null;
    }

    if (options[key].content) {
      if (
        exists(options[key].content.read) &&
        typeof options[key].content.read !== "boolean"
      )
        return null;
      if (
        exists(options[key].content.write) &&
        typeof options[key].content.write !== "boolean"
      )
        return null;
    }

    if (options[key].permissions) {
      if (
        exists(options[key].permissions.read) &&
        typeof options[key].permissions.read !== "boolean"
      )
        return null;
      if (
        exists(options[key].permissions.write) &&
        typeof options[key].permissions.write !== "boolean"
      )
        return null;
    }

    trimmed[key] = {
      /*
       * read: see file/folder.
       * write: edit metadata.
       */
      self: {
        read: options[key].self?.read,
        write: options[key].self?.write,
      },
      /*
       * read: view permissions.
       * write: edit permissions.
       */
      permissions: {
        read: options[key].permissions?.read,
        write: options[key].permissions?.write,
      },
      /*
       * read: view content.
       * write: edit content.
       */
      content: {
        read: options[key].content?.read,
        write: options[key].content?.write,
      },
    };
  }

  return trimmed;
}
