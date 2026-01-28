import { useState, useCallback } from "react";
import { usePermissionsActions } from "@/src/hooks/api/permissions/usePermissionsActions";
import { useUsersActions } from "@/src/hooks/api/users/useUsersActions";
import { useAuth } from "@/src/contexts/AuthContext";

const ROLES = {
  viewer: {
    self: { read: true, write: false },
    content: { read: true, write: false },
    permissions: { read: true, write: false },
  },
  editor: {
    self: { read: true, write: true },
    content: { read: true, write: true },
    permissions: { read: true, write: false },
  },
  admin: {
    self: { read: true, write: true },
    content: { read: true, write: true },
    permissions: { read: true, write: true },
  },
};

const roleFromPermissions = (perms) => {
  if (perms?.permissions?.write) return "admin";
  if (perms?.self?.write || perms?.content?.write) return "editor";
  return "viewer";
};

export function useShareFile(fileId) {
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { user: currentUser } = useAuth();
  const permissionsActions = usePermissionsActions();
  const usersActions = useUsersActions();

  const loadPermissions = useCallback(async () => {
    if (!fileId) return;
    setLoading(true);
    setError(null);

    try {
      const rawPerms = await permissionsActions.getAll(fileId);

      const resolved = [];

      const permEntries = Object.entries(rawPerms || {});

      for (const [permId, userMap] of permEntries) {
        for (const [userId, perms] of Object.entries(userMap)) {
          try {
            const userData = await usersActions.get(userId);

            resolved.push({
              permissionId: permId,
              userId,
              username: userData.username,
              image: userData.info?.image,
              role: roleFromPermissions(perms),
              isCurrentUser: userId === currentUser?.id,
            });
          } catch (err) {
            console.warn(`Failed to resolve user ${userId}`, err);
          }
        }
      }

      resolved.sort((a, b) => {
        if (a.isCurrentUser) return -1;
        if (b.isCurrentUser) return 1;
        return (a.username || "").localeCompare(b.username || "");
      });

      setPermissions(resolved);
    } catch (err) {
      console.error("Failed to load permissions", err);
      setError("Failed to load permissions");
    } finally {
      setLoading(false);
    }
  }, [fileId, permissionsActions, usersActions, currentUser?.id]);

  const addShare = useCallback(
    async (username, role = "viewer") => {
      try {
        const usersFound = await usersActions.find(username);
        const targetUser = Object.entries(usersFound || {}).find(
          ([_, u]) => u.username === username,
        );

        if (!targetUser) {
          throw new Error("User not found");
        }

        const userId = targetUser[0];

        if (permissions.some((p) => p.userId === userId)) {
          throw new Error("User already has access");
        }

        const options = ROLES[role];
        await permissionsActions.create(fileId, userId, options);

        await loadPermissions();
      } catch (err) {
        throw err;
      }
    },
    [fileId, permissions, usersActions, loadPermissions],
  );

  const updateRole = useCallback(
    async (permissionId, userId, newRole) => {
      try {
        if (newRole === "remove") {
          await permissionsActions.remove(fileId, permissionId);
        } else {
          const options = ROLES[newRole];
          await permissionsActions.update(
            fileId,
            permissionId,
            userId,
            options,
          );
        }
        await loadPermissions();
      } catch (err) {
        console.error("Update failed", err);
        throw err;
      }
    },
    [fileId, permissionsActions, loadPermissions],
  );

  return {
    permissions,
    loading,
    error,
    refresh: loadPermissions,
    addShare,
    updateRole,
  };
}
