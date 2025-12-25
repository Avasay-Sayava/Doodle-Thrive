const { randomUUID: uuid } = require("node:crypto");

const permissions = {};
const filePermissions = {};

/**
 * Adds a new permission to a file.
 * @param {string} fileId 
 * @param {{read?: boolean, write?: boolean, permissions?: {read?: boolean, write?: boolean}}} options 
 * @returns {string} Permission ID.
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
 * Gets permissions for a file.
 * @param {string} fileId 
 * @param {string|null} pId 
 * @returns {Object|Object[]|null} Permission(s) object(s).
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
 * Updates a permission for a file.
 * @param {string} fileId 
 * @param {string} pId 
 * @param {{read?: boolean, write?: boolean, permissions?: {read?: boolean, write?: boolean}}} options 
 * @returns {boolean} Whether the permission was successfully updated.
 */
exports.update = (fileId, pId, options) => {
    if (!filePermissions[fileId]?.includes(pId))
        return false;

    permissions[pId] = options;
    return true;
}

/**
 * Deletes a permission from a file.
 * @param {string} fileId 
 * @param {string} pId 
 * @returns {boolean} Whether the permission was successfully deleted.
 */
exports.delete = (fileId, pId) => {
    if (!filePermissions[fileId]?.includes(pId))
        return false;

    delete permissions[pId];
    filePermissions[fileId] = filePermissions[fileId].filter(id => id !== pId);
    return true;
}
