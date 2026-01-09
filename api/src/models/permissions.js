const { randomUUID: uuid } = require("node:crypto");

const permissions = {};
const filePermissions = {};

/**
 * Adds a new permission entry to a specific file.
 * @param {string} fileId The ID of the file to attach permissions to.
 * @param {object} options The permission settings.
 * @return {string} The generated Permission ID.
 */
exports.add = (fileId, options) => {
    const pId = uuid();

    if (permissions[pId])
        throw new Error("Unexpected ID collision, try again");

    if (!filePermissions[fileId])
        filePermissions[fileId] = [];

    filePermissions[fileId].push(pId);

    permissions[pId] = options;

    return pId;
}

/**
 * Retrieves permissions for a specific file.
 * @param {string} fileId The ID of the file.
 * @param {string|null} [pId=null] Optional Permission ID to fetch a specific entry.
 * @return {Object|Object[]|null} If pId is provided, returns that specific permission object; otherwise returns a map of all permissions for the file.
 */
exports.get = (fileId, pId = null) => {
    if (!filePermissions[fileId])
        return {};

    if (pId) {
        if (!permissions[pId] || !filePermissions[fileId].includes(pId))
            return null;
        return permissions[pId];
    } else {
        const result = {};
        for (const pId of filePermissions[fileId]) {
            result[pId] = permissions[pId];
        }
        return result;
    }
}

/**
 * Updates an existing permission entry.
 * @param {string} fileId The ID of the file.
 * @param {string} pId The ID of the permission to update.
 * @param {object} options The new permission settings.
 * @return {boolean} True if the permission was found and updated, otherwise false.
 */
exports.update = (fileId, pId, options) => {
    if (!filePermissions[fileId]?.includes(pId))
        return false;

    permissions[pId] = options;
    return true;
}

/**
 * Deletes a permission entry from a file.
 * @param {string} fileId The ID of the file.
 * @param {string} pId The ID of the permission to delete.
 * @return {boolean} True if the permission was found and deleted, otherwise false.
 */
exports.delete = (fileId, pId) => {
    if (!filePermissions[fileId]?.includes(pId))
        return false;

    delete permissions[pId];
    filePermissions[fileId] = filePermissions[fileId].filter(id => id !== pId);
    return true;
}

exports.check = (userId, fileId, type, mode) => {
    const perms = this.get(fileId);

    for (const pId in perms) {
        const options = perms[pId];
        if (options[userId] && options[userId][type] && options[userId][type][mode]) {
            return true;
        }
    }

    return false;
}
