import { useState, useCallback } from "react";
import { usePermissionsActions } from "@/src/hooks/api/permissions/usePermissionsActions";
import { useUsersActions } from "@/src/hooks/api/users/useUsersActions";
import { useFilesActions } from "@/src/hooks/api/files/useFilesActions";
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

const wait = (ms = 350) => new Promise((resolve) => setTimeout(resolve, ms));

export function useShareFile(fileId) {
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ownerId, setOwnerId] = useState(null);

  const { user: currentUser } = useAuth();
  const permissionsActions = usePermissionsActions();
  const usersActions = useUsersActions();
  const filesActions = useFilesActions();

  const loadPermissions = useCallback(async () => {
    if (!fileId) return;
    setLoading(true);
    setError(null);

    try {
      const fileData = await filesActions.get(fileId);
      setOwnerId(fileData.owner);

      const rawPerms = await permissionsActions.getAll(fileId);

      const resolved = [];
      const permEntries = Object.entries(rawPerms || {});

      for (const [permId, userMap] of permEntries) {
        for (const [userId, perms] of Object.entries(userMap)) {
          try {
            const userData = await usersActions.get(userId);

            const isOwner = fileData.owner === userId;
            const role = isOwner ? "owner" : roleFromPermissions(perms);

            resolved.push({
              permissionId: permId,
              userId,
              username: userData.username,
              image: userData.info?.image,
              role,
              isCurrentUser: userId === currentUser?.id,
              isOwner,
            });
          } catch (err) {
            console.warn(`Failed to resolve user ${userId}`, err);
          }
        }
      }

      if (fileData.owner && !resolved.some((u) => u.userId === fileData.owner)) {
        try {
          const ownerData = await usersActions.get(fileData.owner);
          resolved.push({
            permissionId: "owner-implicit",
            userId: fileData.owner,
            username: ownerData.username,
            image: ownerData.info?.image,
            role: "owner",
            isCurrentUser: fileData.owner === currentUser?.id,
            isOwner: true,
          });
        } catch (err) {
          console.warn("Failed to resolve owner data", err);
        }
      }

      resolved.sort((a, b) => {
        if (a.isOwner) return -1;
        if (b.isOwner) return 1;
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
  }, [fileId, permissionsActions, usersActions, filesActions, currentUser?.id]);

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
        if (newRole === "owner") {
          const isCurrentOwner = ownerId === currentUser?.id;
          if (!isCurrentOwner) {
            throw new Error("Only the owner can transfer ownership");
          }

          const adminOptions = ROLES["admin"];
          if (permissionId && permissionId !== "owner-implicit") {
            await permissionsActions.update(
              fileId,
              permissionId,
              userId,
              adminOptions,
            );
          } else {
            await permissionsActions.create(fileId, userId, adminOptions);
          }
          await wait(200);

          if (currentUser?.id) {
            const myPerm = permissions.find((p) => p.userId === currentUser.id);
            if (myPerm && myPerm.permissionId !== "owner-implicit") {
              await permissionsActions.update(
                fileId,
                myPerm.permissionId,
                currentUser.id,
                adminOptions,
              );
            } else {
              await permissionsActions.create(
                fileId,
                currentUser.id,
                adminOptions,
              );
            }
            await wait(200);
          }

          await filesActions.transferOwnership(fileId, userId);
          await wait();
          await loadPermissions();
          return;
        }

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
    [fileId, permissions, ownerId, filesActions, loadPermissions, currentUser?.id],
  );

  return {
    permissions,
    loading,
    error,
    refresh: loadPermissions,
    addShare,
    updateRole,
    ownerId,
  };
}
