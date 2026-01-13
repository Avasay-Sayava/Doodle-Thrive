import "./style.css";
import { useEffect, useState, useCallback } from "react";
import Modal from "../Modal";
import { roleFromPermissions } from "../../utils/useFilePermissions";
import IconFolder from "../../components/icons/IconFolder";

const API_BASE = process.env.API_BASE_URL || "http://localhost:3300";

/**
 * MoveFile modal - allows user to select a destination folder
 * @param {Object} file - the file/folder to move
 * @param {Function} onSubmit - callback with selected folderId (null for root)
 * @param {Function} children - render prop: (open, close) => JSX for trigger
 */
export default function MoveFile({ file, onSubmit = () => {}, children }) {
  const [folders, setFolders] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [folderPath, setFolderPath] = useState({});
  const [isOpen, setIsOpen] = useState(false);

  // Set initial selection to current parent when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedId(file?.parent ?? null);
    }
  }, [isOpen, file?.parent]);

  // Fetch all folders and their permissions
  useEffect(() => {
    if (!isOpen) return;

    const fetchFolders = async () => {
      try {
        setLoading(true);
        
        const jwt = localStorage.getItem("token");
        if (!jwt) {
          return;
        }

        // Fetch all files
        const res = await fetch(`${API_BASE}/api/files`, {
          method: "GET",
          headers: { Authorization: `Bearer ${jwt}` },
        });

        if (!res.ok) {
          return;
        }

        const allFiles = await res.json();
        // Convert object format to array if needed
        const filesArray = Array.isArray(allFiles) ? allFiles : Object.values(allFiles);

        // Get current user ID from token
        const tokenRes = await fetch(`${API_BASE}/api/tokens`, {
          method: "GET",
          headers: { Authorization: `Bearer ${jwt}` },
        });

        if (!tokenRes.ok) {
          console.error("Token response not ok:", tokenRes.status);
          return;
        }
        const tokenData = await tokenRes.json();
        const currentUserId = tokenData.id;

        // Filter to folders only
        const foldersList = filesArray.filter(
          (f) => f.type === "folder" && f.trashed !== true && f.id !== file?.id
        );

        // Fetch permissions for each folder
        const foldersWithPerms = await Promise.all(
          foldersList.map(async (folder) => {
            try {
              const permRes = await fetch(`${API_BASE}/api/files/${folder.id}/permissions`, {
                method: "GET",
                headers: { Authorization: `Bearer ${jwt}` },
              });

              if (!permRes.ok) {
                return null;
              }

              const data = await permRes.json();
                            
              // Parse permissions structure: { permissionId: { userId: perms } }
              let userPerms = null;
              const ownerId = folder.owner;
              
              // Merge all permissions for current user across all permission entries
              for (const permId in data) {
                const permEntry = data[permId];
                if (permEntry[currentUserId]) {
                  if (!userPerms) {
                    userPerms = {
                      self: { read: false, write: false },
                      content: { read: false, write: false },
                      permissions: { read: false, write: false }
                    };
                  }
                  // Merge permissions
                  const perms = permEntry[currentUserId];
                  userPerms.self.read = userPerms.self.read || perms?.self?.read || false;
                  userPerms.self.write = userPerms.self.write || perms?.self?.write || false;
                  userPerms.content.read = userPerms.content.read || perms?.content?.read || false;
                  userPerms.content.write = userPerms.content.write || perms?.content?.write || false;
                  userPerms.permissions.read = userPerms.permissions.read || perms?.permissions?.read || false;
                  userPerms.permissions.write = userPerms.permissions.write || perms?.permissions?.write || false;
                }
              }

              // Check if current user is owner
              const isOwner = ownerId === currentUserId;

              // Determine user role based on permissions
              let userRole;
              if (isOwner) {
                userRole = "owner";
              } else if (userPerms) {
                userRole = roleFromPermissions(userPerms);
              } else {
                userRole = null;
              }

              
              // User can move to this folder if they have write permission (editor, admin, or owner)
              const canWrite = ["editor", "admin", "owner"].includes(userRole);

              if (!canWrite) {
                                return null;
              }

              // Only show folders owned by the file's owner
              if (file?.owner !== ownerId) {
                                return null;
              }

                            return { ...folder, canWrite: true };
            } catch (err) {
              console.error("[MoveFile] Error processing folder:", folder.name, err);
              return null;
            }
          })
        );

        // Filter out null values (folders without write permission)
        const writableFolders = foldersWithPerms.filter((f) => f !== null);

        setFolders(writableFolders);

        // Build folder paths for display
        const paths = {};
        const buildPath = (folderId, allFolders) => {
          if (paths[folderId]) return paths[folderId];

          const folder = allFolders.find((f) => f.id === folderId);
          if (!folder) return "";

          if (!folder.parent) {
            paths[folderId] = folder.name;
            return folder.name;
          }

          const parentPath = buildPath(folder.parent, allFolders);
          paths[folderId] = parentPath ? `${parentPath} > ${folder.name}` : folder.name;
          return paths[folderId];
        };

        writableFolders.forEach((folder) => buildPath(folder.id, filesArray));
        setFolderPath(paths);
      } catch (err) {
        console.error("Error fetching folders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFolders();
  }, [isOpen, file?.id, file?.owner]);

  const handleSubmit = useCallback(
    async (close) => {
      await onSubmit(selectedId);
      close();
    },
    [selectedId, onSubmit]
  );

  // Check if current user ID is available
  const [currentUserId, setCurrentUserId] = useState(null);
  
  useEffect(() => {
    if (!isOpen) return;
    const fetchUserId = async () => {
      try {
        const jwt = localStorage.getItem("token");
        if (!jwt) return;
        
        const tokenRes = await fetch(`${API_BASE}/api/tokens`, {
          method: "GET",
          headers: { Authorization: `Bearer ${jwt}` },
        });
        
        if (tokenRes.ok) {
          const tokenData = await tokenRes.json();
          setCurrentUserId(tokenData.id);
        }
      } catch (err) {
        console.error("Failed to fetch user ID:", err);
      }
    };
    fetchUserId();
  }, [isOpen]);

  const renderBody = useCallback(
    (isOpen, shouldRender, close) => (
      <div className="move-file-modal">
        {loading ? (
          <div className="move-file-loading">Loading folders...</div>
        ) : (
          <>
            <div className="move-file-folders">
              {/* Only show "My Drive (Root)" if the file is owned by the current user */}
              {file?.owner === currentUserId && (
                <div
                  className={`move-file-folder-item ${
                    selectedId === null ? "move-file-folder-selected" : ""
                  }`}
                  onClick={() => setSelectedId(null)}
                >
                  <span className="move-file-folder-icon"><IconFolder /></span>
                  <span className="move-file-folder-name">My Drive (Root)</span>
                </div>
              )}
              {folders.length === 0 ? (
                <div className="move-file-empty">
                  No folders available. You can only move files to folders where you have write
                  permission, and cannot move files across different owners.
                </div>
              ) : (
                folders.map((folder) => (
                  <div
                    key={folder.id}
                    className={`move-file-folder-item ${
                      selectedId === folder.id ? "move-file-folder-selected" : ""
                    }`}
                    onClick={() => setSelectedId(folder.id)}
                  >
                    <span className="move-file-folder-icon"><IconFolder /></span>
                    <span className="move-file-folder-name">
                      {folderPath[folder.id] || folder.name}
                    </span>
                  </div>
                ))
              )}
            </div>
            <div className="move-file-actions">
              <button
                type="button"
                className="move-file-btn move-file-btn--cancel"
                onClick={close}
              >
                Cancel
              </button>
              <button
                type="button"
                className="move-file-btn move-file-btn--primary"
                onClick={() => handleSubmit(close)}
                disabled={selectedId === undefined || selectedId === file?.parent}
              >
                Move
              </button>
            </div>
          </>
        )}
      </div>
    ),
    [loading, folders, selectedId, folderPath, file?.parent, file?.owner, currentUserId, handleSubmit]
  );

  return (
    <Modal
      title="Move to folder"
      renderBody={renderBody}
      className="move-file-dialog"
      onOpen={() => setIsOpen(true)}
      onClose={() => {
        setIsOpen(false);
        setSelectedId(null);
      }}
    >
      {(open) => typeof children === "function" && children(open)}
    </Modal>
  );
}
