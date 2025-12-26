const { randomUUID: uuid } = require("node:crypto");

const Storage = require("./storage");

const files = {};

/**
 * Creates a new file with given name and content.
 * @param {{name: string, content: string, parent?: string}} param0 
 * @returns {Promise<string>} File ID.
 */
exports.createFile = async ({ name, content, parent }) => {
    const UUID = uuid();

    if (files[UUID])
        throw new Error("Unexpected ID collision, try again");

    const response = await Storage.post(UUID, content);

    if (response.status === 201) {
        files[UUID] = {
            id: UUID,
            name: name,
            type: "file",
            parent: parent || null
        };

        parent && files[parent]?.children?.push(UUID);

        return UUID;
    } else throw new Error("Failed to create file");
}

/**
 * Creates a new folder with given name.
 * @param {{name: string, parent?: string}} param0 
 * @returns {string} Folder ID.
 */
exports.createFolder = ({ name, parent }) => {
    const UUID = uuid();

    if (files[UUID])
        throw new Error("Unexpected ID collision, try again");

    files[UUID] = {
        id: UUID,
        name: name,
        type: "folder",
        parent: parent || null,
        children: []
    };

    parent && files[parent]?.children?.push(UUID);

    return UUID;
}

/**
 * Gets all files and folders.
 * @returns {Promise<Object>} All files and folders with their content.
 */
exports.getAll = async () => {
    const copy = files;

    const promises = Object.keys(copy).map(async (file) => {
        if (copy[file].type === "file") {
            try {
                const buffer = await Storage.get(file);
                copy[file].content = buffer.response;
            } catch (err) {
                throw new Error("Failed to retrieve file content");
            }
        }
    });

    await Promise.all(promises);

    return copy;
}

/**
 * Gets a file or folder by ID.
 * @param {string} id 
 * @returns {Promise<Object>} file or folder with its content.
 */
exports.get = async (id) => {
    if (files[id].type === "file") {
        try {
            const buffer = await Storage.get(id);
            return {
                ...files[id],
                content: buffer.response
            };
        } catch (err) {
            throw new Error("Failed to retrieve file content");
        }
    }

    return files[id];
}

/**
 * Updates a file or folder.
 * @param {string} id 
 * @param {{name?: string, content?: string, parent?: string}} param1 
 * @returns {Promise<boolean>} Whether the update was successful.
 */
exports.update = async (id, { name, content, parent }) => {
    const file = files[id];

    if (content) {
        const response = await Storage.delete(id);
        if (response.status !== 204)
            return false;

        const responsePost = await Storage.post(id, content);
        if (responsePost.status !== 201)
            return false;
    }

    if (name)
        file.name = name;

    if (parent) {
        files[files[id].parent].children = files[files[id].parent].children
            .filter(childId => childId !== id);
        files[parent].children.push(id);
        file.parent = parent;
    }

    files[id] = file;

    return true;
}

/**
 * Deletes a file or folder.
 * @param {string} id 
 * @returns {Promise<boolean>} Whether the deletion was successful.
 */
exports.delete = async (id) => {
    const file = files[id];
    if (file.type === "folder") {
        const promises = file.children
            .map(async (childId) => {
                const response = await exports.delete(childId);
                if (!response)
                    throw new Error("Failed to delete child file/folder");
            });

        await Promise.all(promises);
    }

    if (files[id].type === "file") {
        const response = await Storage.delete(id);
        if (response.status !== 204)
            return false;
    }

    if (file.parent)
        files[file.parent].children = files[file.parent].children
            .filter(childId => childId !== id);

    delete files[id];

    return true;
}

/**
 * Searches for files and folders matching the query.
 * @param {string} query 
 * @returns {Promise<Object[]>} Matching files and folders.
 */
exports.search = async (query) => {
    const response = await Storage.search(query);
    if (response.status !== 200)
        return [];

    const results = response.response
        .map(id => files[id])
        .filter(file => file !== undefined);

    return results;
}

/**
 * Gets info about a file or folder.
 * @param {string} id 
 * @returns {Object|null} file or folder info.
 */
exports.info = (id) => {
    return files[id] || null;
}
