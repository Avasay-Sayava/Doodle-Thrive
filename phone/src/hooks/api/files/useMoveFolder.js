import { useState, useCallback, useEffect } from "react";
import { useApi } from "@/src/contexts/ApiContext";
import { useAuth } from "@/src/contexts/AuthContext";

const roleFromPermissions = (perms) => {
  if (perms?.permissions?.write) return "admin";
  if (perms?.self?.write || perms?.content?.write) return "editor";
  if (perms?.self?.read || perms?.content?.read) return "viewer";
  return "viewer";
};

export function useMoveFolder(folderId, fileToMoveId) {
  const { api } = useApi();
  const { uuid: currentUserId } = useAuth();

  const [files, setFiles] = useState([]);
  const [currentFolder, setCurrentFolder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFolders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (folderId && folderId !== "root") {
        const folderRes = await api.files.get(folderId);
        if (folderRes.ok) {
          const folderData = await folderRes.json();
          setCurrentFolder(folderData);
        }
      } else {
        setCurrentFolder({ id: "root", name: "My Drive" });
      }

      const res = await api.files.getAll();
      if (!res.ok) throw new Error("Failed to fetch files");

      const allFiles = await res.json();
      const filesArray = Array.isArray(allFiles)
        ? allFiles
        : Object.values(allFiles);

      const targetParentId = folderId === "root" ? null : folderId;

      const potentialFolders = filesArray.filter(
        (f) =>
          f.type === "folder" &&
          f.trashed !== true &&
          f.id !== fileToMoveId &&
          f.parent === targetParentId,
      );

      const writableFolders = await Promise.all(
        potentialFolders.map(async (folder) => {
          try {
            if (folder.owner === currentUserId) return folder;

            const permRes = await api.permissions.getAll(folder.id);

            const data = await permRes.json();

            let userPerms = null;
            for (const permId in data) {
              const permEntry = data[permId];
              if (permEntry[currentUserId]) {
                userPerms = permEntry[currentUserId];
                break;
              }
            }

            const userRole = roleFromPermissions(userPerms);
            const canWrite = ["editor", "admin", "owner"].includes(userRole);

            if (!canWrite) return null;

            return folder;
          } catch (e) {
            console.warn("Error checking permissions for folder", folder.id, e);
            return null;
          }
        }),
      );

      const validFolders = writableFolders.filter((f) => f !== null);

      validFolders.sort((a, b) => a.name.localeCompare(b.name));

      setFiles(validFolders);
    } catch (err) {
      console.error(err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [folderId, fileToMoveId, currentUserId, api.files, api.permissions]);

  useEffect(() => {
    fetchFolders();
  }, [fetchFolders]);

  return { files, currentFolder, loading, error, refresh: fetchFolders };
}
