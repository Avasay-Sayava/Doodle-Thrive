import { useState, useCallback } from "react";
import shareFile from "./shareFile";

const API_BASE = process.env.API_BASE_URL || "http://localhost:3300";

const wait = (ms = 350) => new Promise((resolve) => setTimeout(resolve, ms));

const emptyPerms = () => ({
  self: { read: false, write: false },
  content: { read: false, write: false },
  permissions: { read: false, write: false },
});

const mergePermissions = (data) => {
  const merged = {};
  Object.values(data || {}).forEach((entry) => {
    Object.entries(entry || {}).forEach(([userId, perms]) => {
      const current = merged[userId] ?? emptyPerms();
      merged[userId] = {
        self: {
          read: current.self.read || Boolean(perms?.self?.read),
          write: current.self.write || Boolean(perms?.self?.write),
        },
        content: {
          read: current.content.read || Boolean(perms?.content?.read),
          write: current.content.write || Boolean(perms?.content?.write),
        },
        permissions: {
          read: current.permissions.read || Boolean(perms?.permissions?.read),
          write:
            current.permissions.write || Boolean(perms?.permissions?.write),
        },
      };
    });
  });
  return merged;
};

export const roleFromPermissions = (perms) => {
  // Never return "owner" from permissions - owner is determined by file.owner field
  // Return "admin" as the highest role from permissions
  if (perms?.permissions?.write) return "admin";
  if (perms?.self?.write || perms?.content?.write) return "editor";
  if (perms?.self?.read || perms?.content?.read) return "viewer";
  return "viewer";
};

export const findUserIdByUsername = async (username) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_BASE}/api/users`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ username }),
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Failed to find user (HTTP ${res.status}): ${txt}`);
  }

  const data = await res.json();
  const match = Object.entries(data || {}).find(
    ([, user]) => user.username === username
  );
  if (!match) throw new Error("User not found");
  return match[0];
};

const revokeAccess = async (fileId, username) => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Missing auth token");
  const targetUserId = await findUserIdByUsername(username);

  const permissionsRes = await fetch(
    `${API_BASE}/api/files/${fileId}/permissions`,
    {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  if (!permissionsRes.ok) {
    throw new Error("Failed to retrieve file permissions");
  }

  const permissionsData = await permissionsRes.json();
  const oldPermissionIds = Object.keys(permissionsData);

  const mergedOptions = {};
  for (const pId of oldPermissionIds) {
    for (const userId of Object.keys(permissionsData[pId])) {
      if (userId === targetUserId) continue;

      mergedOptions[userId] = mergedOptions[userId] ?? emptyPerms();
      mergedOptions[userId].self.read =
        permissionsData[pId][userId].self?.read || false;
      mergedOptions[userId].self.write =
        permissionsData[pId][userId].self?.write || false;
      mergedOptions[userId].content.read =
        permissionsData[pId][userId].content?.read || false;
      mergedOptions[userId].content.write =
        permissionsData[pId][userId].content?.write || false;
      mergedOptions[userId].permissions.read =
        permissionsData[pId][userId].permissions?.read || false;
      mergedOptions[userId].permissions.write =
        permissionsData[pId][userId].permissions?.write || false;
    }
  }

  const res = await fetch(`${API_BASE}/api/files/${fileId}/permissions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ options: mergedOptions }),
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Failed to remove access (HTTP ${res.status}): ${txt}`);
  }

  for (const pId of oldPermissionIds) {
    await fetch(`${API_BASE}/api/files/${fileId}/permissions/${pId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  return targetUserId;
};

/**
 * useFilePermissions - hook for managing file permissions and sharing
 * @param {string} fileId - file ID
 * @param {string} currentUserId - current user ID
 * @param {Function} onRefresh - callback after permission changes
 */
export default function useFilePermissions(fileId, currentUserId, onRefresh) {
  const [sharedWith, setSharedWith] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [ownerId, setOwnerId] = useState(null);
  const [currentUserPerms, setCurrentUserPerms] = useState(emptyPerms());

  const isCurrentOwner = ownerId && ownerId === currentUserId;

  const loadShared = useCallback(
    async (options = {}) => {
      const { preserveUserId, preserveRole } = options;

      if (!fileId) return;
      setLoading(true);
      setError("");

      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Missing auth token");

        const fileRes = await fetch(`${API_BASE}/api/files/${fileId}`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!fileRes.ok) {
          const txt = await fileRes.text();
          throw new Error(
            `Failed to fetch file (HTTP ${fileRes.status}): ${txt}`
          );
        }

        const fileData = await fileRes.json();
        setOwnerId(fileData.owner);

        // If current user is the owner, set full permissions
        if (fileData.owner === currentUserId) {
          setCurrentUserPerms({
            self: { read: true, write: true },
            content: { read: true, write: true },
            permissions: { read: true, write: true },
          });
        }

        const res = await fetch(`${API_BASE}/api/files/${fileId}/permissions`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          const txt = await res.text();
          throw new Error(
            `Failed to fetch permissions (HTTP ${res.status}): ${txt}`
          );
        }

        const raw = await res.json();
        const merged = mergePermissions(raw);

        if (fileData.owner) {
          merged[fileData.owner] = merged[fileData.owner] ?? {
            self: { read: true, write: true },
            content: { read: true, write: true },
            permissions: { read: true, write: true },
          };
        }

        const entries = await Promise.all(
          Object.entries(merged).map(async ([userId, perms]) => {
            // Store current user's permissions
            if (userId === currentUserId) {
              setCurrentUserPerms(perms);
            }

            let username = userId;
            let imageUrl = null;
            try {
              const res = await fetch(`${API_BASE}/api/users/${userId}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
              });
              if (res.ok) {
                const userData = await res.json();
                username = userData.username || userId;
                imageUrl = userData.info?.image || null;
              }
            } catch (err) {
              console.error("Failed to resolve user data", err);
            }

            const isOwnerEntry = fileData.owner
              ? userId === fileData.owner
              : false;
            const computedRole = isOwnerEntry
              ? "owner"
              : roleFromPermissions(perms);

            return {
              userId,
              username,
              imageUrl,
              role: computedRole,
              isOwner: isOwnerEntry,
            };
          })
        );

        let finalEntries = entries;

        if (preserveUserId && preserveRole) {
          const targetEntry = entries.find((e) => e.userId === preserveUserId);
          finalEntries = entries.filter((e) => e.userId !== preserveUserId);
          if (targetEntry) {
            finalEntries.push({ ...targetEntry, role: preserveRole });
          }
        }

        finalEntries.sort((a, b) => {
          if (a.isOwner && !b.isOwner) return -1;
          if (b.isOwner && !a.isOwner) return 1;
          return a.username.localeCompare(b.username);
        });

        setSharedWith(finalEntries);
      } catch (err) {
        setError(err?.message || "Failed to load shared users");
        setSharedWith([]);
      } finally {
        setLoading(false);
      }
    },
    [currentUserId, fileId]
  );

  const updatePermission = useCallback(
    async (entry, nextRole) => {
      if (!fileId || entry.isOwner) return;

      setSharedWith((prev) =>
        prev.map((item) =>
          item.userId === entry.userId ? { ...item, role: nextRole } : item
        )
      );

      try {
        if (nextRole === "owner") {
          // Get current user's username to grant them admin after transfer
          let currentUsername = null;
          if (currentUserId) {
            try {
              const res = await fetch(
                `${API_BASE}/api/users/${currentUserId}`,
                {
                  method: "GET",
                  headers: { "Content-Type": "application/json" },
                }
              );
              if (res.ok) {
                const userData = await res.json();
                currentUsername = userData.username;
              }
            } catch (err) {
              console.error("Failed to get current user data", err);
            }
          }

          // First give admin permissions to new owner, then transfer ownership
          await shareFile(fileId, entry.username, "admin");
          await wait(200);

          // Give previous owner (current user) admin permissions
          if (currentUsername) {
            await wait(200);
            await shareFile(fileId, currentUsername, "admin");
          }
        } else if (nextRole === "none") {
          await revokeAccess(fileId, entry.username);
        } else {
          await shareFile(fileId, entry.username, nextRole);
        }

        await wait();
        await loadShared({
          preserveUserId: entry.userId,
          preserveRole: nextRole,
        });
        onRefresh?.();
      } catch (err) {
        console.error("[updatePermission] Error:", err);
        setError(err?.message || "Failed to update permissions");
        await loadShared({});
      }
    },
    [fileId, loadShared, onRefresh, currentUserId]
  );

  return {
    sharedWith,
    loading,
    error,
    ownerId,
    isCurrentOwner,
    currentUserPerms,
    loadShared,
    updatePermission,
  };
}
