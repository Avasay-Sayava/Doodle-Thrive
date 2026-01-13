import "./style.css";
import { useEffect, useState } from "react";
import setStarred from "../../../utils/setStarred";
import downloadFile from "../../../utils/downloadFile";
import renameFile from "../../../utils/renameFile";
import GetText from "../../../modals/GetText";
import FileActions from "../FileActions";
import ShareDialog from "../../../modals/ShareDialog";
import useUserId from "../../../utils/useUserId";
import IconShare from "../../icons/IconShare";
import IconDownload from "../../icons/IconDownload";
import IconEdit from "../../icons/IconEdit";
import IconStar from "../../icons/IconStar";
import IconMore from "../../icons/IconMore";

const API_BASE = process.env.API_BASE_URL || "http://localhost:3300";

// Helper to check if user has permission
const hasPermission = (permissions, path) => {
  return path.split('.').reduce((obj, key) => obj?.[key], permissions) === true;
};

// Helper to merge permissions from API response
const mergePermissions = (data) => {
  const merged = {};
  Object.values(data || {}).forEach((entry) => {
    Object.entries(entry || {}).forEach(([userId, perms]) => {
      const current = merged[userId] || {
        self: { read: false, write: false },
        content: { read: false, write: false },
        permissions: { read: false, write: false },
      };
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
          write: current.permissions.write || Boolean(perms?.permissions?.write),
        },
      };
    });
  });
  return merged;
};

// Helper to fetch file permissions
const fetchFilePermissions = async (fileId, currentUserId) => {
  try {
    const jwt = localStorage.getItem("token");
    
    // Fetch file metadata to check ownership
    const fileRes = await fetch(`${API_BASE}/api/files/${fileId}`, {
      headers: { Authorization: `Bearer ${jwt}` },
    });
    const fileData = await fileRes.ok ? await fileRes.json() : {};
    const isOwner = fileData.owner === currentUserId;
    
    // If user is owner, return full permissions
    if (isOwner) {
      return {
        [currentUserId]: {
          self: { read: true, write: true },
          content: { read: true, write: true },
          permissions: { read: true, write: true },
        },
      };
    }
    
    // Otherwise fetch and merge permissions
    const res = await fetch(`${API_BASE}/api/files/${fileId}/permissions`, {
      headers: { Authorization: `Bearer ${jwt}` },
    });
    if (!res.ok) return {};
    const data = await res.json();
    return mergePermissions(data);
  } catch (err) {
    console.error("Failed to fetch permissions:", err);
    return {};
  }
};

function FileSelect({ file, onRefresh, isTrashed = false }) {
  const { id, starred } = file;
  const currentUserId = useUserId();

  const [isStarred, setIsStarred] = useState(Boolean(starred));
  const [userPermissions, setUserPermissions] = useState({});

  // Check permissions
  const canShare = hasPermission(userPermissions, 'permissions.write');
  const canDownload = hasPermission(userPermissions, 'content.read');
  const canRename = hasPermission(userPermissions, 'self.write');

  useEffect(() => {
    setIsStarred(Boolean(starred));
  }, [starred]);

  useEffect(() => {
    if (!currentUserId) return;
    // Fetch permissions when component mounts or file id changes
    fetchFilePermissions(id, currentUserId).then((perms) => {
      // Get the current user's permissions from the response
      setUserPermissions(perms[currentUserId] || {});
    });
  }, [id, currentUserId]);

  const onToggleStar = async (e) => {
    e.stopPropagation();

    const next = !isStarred;
    setIsStarred(next);

    try {
      await setStarred(id, next);
    } catch (err) {
      setIsStarred(!next);
      console.error("Failed to update starred:", err);
    }
  };

  return (
    <div className="file-actions">
      {!isTrashed && (
        <>
          <ShareDialog file={file} onRefresh={onRefresh}>
            {(open) => (
              <button
                className="file-action-btn file-action-btn-hover"
                title={canShare ? "Share" : "No permission to share"}
                onClick={(e) => {
                  e.stopPropagation();
                  if (canShare) open();
                }}
                disabled={!canShare}
              >
                <IconShare />
              </button>
            )}
          </ShareDialog>

          <button
            className="file-action-btn file-action-btn-hover"
            title={canDownload ? "Download" : "No permission to download"}
            onClick={() => canDownload && downloadFile(id)}
            disabled={!canDownload}
          >
            <IconDownload />
          </button>

          <GetText
            title="Rename"
            placeholder="New name"
            submitLabel="Rename"
            onSubmit={(newName) =>
              renameFile(id, newName).then(() => onRefresh?.())
            }
          >
            {(open) => (
              <button
                className="file-action-btn file-action-btn-hover"
                title={canRename ? "Rename" : "No permission to rename"}
                onClick={(e) => {
                  e.stopPropagation();
                  if (canRename) open();
                }}
                disabled={!canRename}
              >
                <IconEdit />
              </button>
            )}
          </GetText>

          {isStarred && (
            <button
              className="file-action-btn file-action-btn-starred"
              title={isStarred ? "Unstar" : "Star"}
              onClick={onToggleStar}
            >
              <IconStar />
            </button>
          )}
          {!isStarred && (
            <button
              className={`file-action-btn file-action-btn-hover ${
                isStarred ? "file-action-btn-starred" : ""
              }`}
              title={isStarred ? "Unstar" : "Star"}
              onClick={onToggleStar}
            >
              <IconStar />
            </button>
          )}
        </>
      )}

      <FileActions file={file} onRefresh={onRefresh} currentUserPerms={userPermissions} openOnLeftClick>
        <button
          className="file-action-btn"
          title="More"
          onClick={(e) => e.stopPropagation()}
        >
          <IconMore />
        </button>
      </FileActions>
    </div>
  );
}

export default FileSelect;
