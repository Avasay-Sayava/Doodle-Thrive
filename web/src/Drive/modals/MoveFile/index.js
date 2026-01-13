import "./style.css";
import { useEffect, useState, useCallback } from "react";
import Modal from "../Modal";
import { roleFromPermissions } from "../../utils/useFilePermissions";
import IconFolder from "../../components/icons/IconFolder";

const API_BASE = process.env.API_BASE_URL || "http://localhost:3300";

export default function MoveFile({ file, onSubmit = () => {}, children }) {
  const [folders, setFolders] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [folderPath, setFolderPath] = useState({});
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSelectedId(file?.parent ?? null);
    }
  }, [isOpen, file?.parent]);

  useEffect(() => {
    if (!isOpen) return;

    const fetchFolders = async () => {
      try {
        setLoading(true);
        
        const jwt = localStorage.getItem("token");
        if (!jwt) {
          return;
        }

        const res = await fetch(`${API_BASE}/api/files`, {
          method: "GET",
          headers: { Authorization: `Bearer ${jwt}` },
        });

        if (!res.ok) {
          return;
        }

        const allFiles = await res.json();
        const filesArray = Array.isArray(allFiles) ? allFiles : Object.values(allFiles);

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

        const foldersList = filesArray.filter(
          (f) => f.type === "folder" && f.trashed !== true && f.id !== file?.id
        );

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
                            
              let userPerms = null;
              const ownerId = folder.owner;
              
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
                  const perms = permEntry[currentUserId];
                  userPerms.self.read = userPerms.self.read || perms?.self?.read || false;
                  userPerms.self.write = userPerms.self.write || perms?.self?.write || false;
                  userPerms.content.read = userPerms.content.read || perms?.content?.read || false;
                  userPerms.content.write = userPerms.content.write || perms?.content?.write || false;
                  userPerms.permissions.read = userPerms.permissions.read || perms?.permissions?.read || false;
                  userPerms.permissions.write = userPerms.permissions.write || perms?.permissions?.write || false;
                }
              }

              const isOwner = ownerId === currentUserId;

              let userRole;
              if (isOwner) {
                userRole = "owner";
              } else if (userPerms) {
                userRole = roleFromPermissions(userPerms);
              } else {
                userRole = null;
              }

              
              const canWrite = ["editor", "admin", "owner"].includes(userRole);

              if (!canWrite) {
                                return null;
              }

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

        const writableFolders = foldersWithPerms.filter((f) => f !== null);

        setFolders(writableFolders);

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
                className="move-file-btn move-file-btn-cancel"
                onClick={close}
              >
                Cancel
              </button>
              <button
                type="button"
                className="move-file-btn move-file-btn-primary"
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
