const { randomUUID: uuid } = require("node:crypto");
const Storage = require("./storage");

const files = {};

/**
 * Creates a new file record and saves content to storage.
 * @param {object} fileData The file creation data.
 * @param {string} fileData.name The name of the file.
 * @param {string} fileData.content The content of the file.
 * @param {string} [fileData.parent] The ID of the parent folder (optional).
 * @return {Promise<string>} The generated File ID.
 * @throws {Error} If creation fails on the storage server.
 */
exports.createFile = async ({ name, owner, content, starred, parent, description }) => {
    const UUID = uuid();

    if (files[UUID])
        throw new Error("Unexpected ID collision, try again");

    const response = await Storage.post(UUID, content);

    if (response.status === 201) {
        files[UUID] = {
            id: UUID,
            name: name,
            type: "file",
            owner: owner,
            parent: parent || null,
            starred: starred || false,
            created: Date.now(),
            modified: Date.now(),
            description: description
        };

        parent && files[parent]?.children?.push(UUID);

        return UUID;
    } else throw new Error("Failed to create file");
}

/**
 * Creates a new virtual folder structure.
 * @param {object} folderData The folder creation data.
 * @param {string} folderData.name The name of the folder.
 * @param {string} [folderData.parent] The ID of the parent folder (optional).
 * @return {string} The generated Folder ID.
 */
exports.createFolder = ({ name, owner, starred, parent, description }) => {
    const UUID = uuid();

    if (files[UUID])
        throw new Error("Unexpected ID collision, try again");

    files[UUID] = {
        id: UUID,
        name: name,
        type: "folder",
        owner: owner,
        starred: starred || false,
        created: Date.now(),
        modified: Date.now(),
        parent: parent || null,
        children: [],
        description: description
    };

    parent && files[parent]?.children?.push(UUID);

    return UUID;
}

/**
 * Retrieves all files and folders, fetching content for files from storage.
 * @param {string[]} [ids=Object.keys(files)] Optional list of specific IDs to retrieve.
 * @return {Promise<Object>} A dictionary of all file objects, including their content.
 */
exports.getAll = async (ids) => {
    ids = ids || Object.keys(files);

    const copy = {};

    const promises = ids.map(async (file) => {
        copy[file] = { ...files[file] };
        if (files[file].type === "file") {
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
 * Retrieves a specific file or folder by ID.
 * If it is a file, the content is fetched from storage.
 * @param {string} id The ID of the file or folder.
 * @return {Promise<Object>} The file or folder object containing metadata and content.
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
 * Updates a file or folder's metadata or content.
 * @param {string} id The ID of the file/folder to update.
 * @param {object} changes The properties to update.
 * @return {Promise<boolean>} True if successful, False if storage update failed.
 */
exports.update = async (id, { name, owner, content, starred, parent, description }) => {
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

    if (owner)
        file.owner = owner;

    if (description)
        file.description = description;

    if (starred !== undefined)
        file.starred = starred;

    file.modified = Date.now();

    files[id] = file;

    return true;
}

/**
 * Deletes a file or folder and all its descendants.
 * @param {string} id The ID of the file/folder to delete.
 * @return {Promise<boolean>} True if successful.
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
 * Searches the storage layer for files matching the query and resolves them to file objects.
 * @param {string} query The search term.
 * @return {Promise<Object>} A dictionary of matching file objects.
 */
exports.search = async (query) => {
    const response = await Storage.search(query);
    if (response.status !== 200)
        return {};

    const results = Object.keys(files).filter(id => files[id].name.includes(query));
    const searchResults = response.response.filter(id => !results.includes(id));
    const outSearchResults = await exports.getAll(searchResults);

    const outSearchResultsValues = Object.values(outSearchResults);
    for (const value of outSearchResultsValues) {
        if (!value.name.includes(query) &&
            !value.content.includes(query)) {
            delete outSearchResults[value.id];
        }
    }

    const outResults = await exports.getAll(results);

    return { ...outResults, ...outSearchResults };
}

/**
 * Retrieves metadata for a file or folder synchronously (no content fetch).
 * @param {string} id The ID of the item.
 * @return {Object|null} The metadata object or null if not found.
 */
exports.info = (id) => {
    return files[id] || null;
}
