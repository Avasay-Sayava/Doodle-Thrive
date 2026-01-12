const API_BASE = process.env.API_BASE_URL || "http://localhost:3300";

/**
 * Shares a file with another user.
 * @param {string} id 
 * @param {string} username 
 * @param {"viewer"|"editor"|"admin"} option 
 */
export default async function shareFile(id, username, option) {
    const token = localStorage.getItem("token");

    const permissions = await fetch(`${API_BASE}/api/files/${id}/permissions`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!permissions.ok) {
        throw new Error("Failed to retrieve file permissions");
    }

    const permissionsData = await permissions.json();

    // Build mergedOptions from existing permissions
    // permissionsData is {permissionId: {userId: permissionObject}}
    const oldPermissionIds = Object.keys(permissionsData);
    const mergedOptions = {};
    for (const pId of oldPermissionIds) {
        for (const userId of Object.keys(permissionsData[pId])) {
            mergedOptions[userId] = mergedOptions[userId] ?? { self: {}, content: {}, permissions: {} };
            mergedOptions[userId].self.read = permissionsData[pId][userId].self?.read || false;
            mergedOptions[userId].self.write = permissionsData[pId][userId].self?.write || false;
            mergedOptions[userId].content.read = permissionsData[pId][userId].content?.read || false;
            mergedOptions[userId].content.write = permissionsData[pId][userId].content?.write || false;
            mergedOptions[userId].permissions.read = permissionsData[pId][userId].permissions?.read || false;
            mergedOptions[userId].permissions.write = permissionsData[pId][userId].permissions?.write || false;
        }
    }

    const uuidRes = await fetch(`${API_BASE}/api/users`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ username }),
    });

    if (!uuidRes.ok) {
        throw new Error("Failed to find user by username");
    }
    const uuidData = await uuidRes.json();
    const uuidEntries = Object.entries(uuidData).filter(([_, user]) => user.username === username);
    if (uuidEntries.length === 0) {
        throw new Error("No user found with the specified username");
    }

    const uuid = uuidEntries[0][0];

    if (option === "viewer") {
        mergedOptions[uuid] = {
            self: { read: true, write: false },
            content: { read: true, write: false },
            permissions: { read: false, write: false },
        };
    } else if (option === "editor") {
        mergedOptions[uuid] = {
            self: { read: true, write: true },
            content: { read: true, write: true },
            permissions: { read: false, write: false },
        };
    } else if (option === "admin") {
        mergedOptions[uuid] = {
            self: { read: true, write: true },
            content: { read: true, write: true },
            permissions: { read: true, write: true },
        };
    }

    const res = await fetch(`${API_BASE}/api/files/${id}/permissions`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({options: mergedOptions}),
    });

    if (!res.ok) {
        throw new Error("Failed to update file permissions");
    }

    // Now delete old permission entries (after adding new ones to avoid losing access)
    for (const pId of oldPermissionIds) {
        await fetch(`${API_BASE}/api/files/${id}/permissions/${pId}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    }
}
