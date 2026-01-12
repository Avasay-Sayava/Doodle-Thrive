import "./style.css";
import { useEffect, useState } from "react";
import setStarred from "../../../utils/setStarred";
import downloadFile from "../../../utils/downloadFile";
import renameFile from "../../../utils/renameFile";
import GetText from "../../../modals/GetText";
import FileActions from "../FileActions";
import ShareDialog from "../../../modals/ShareDialog";

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
const fetchFilePermissions = async (fileId) => {
  try {
    const jwt = localStorage.getItem("token");
    const currentUserId = localStorage.getItem("id");
    
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

function FileSelect({ file, onRefresh }) {
  const { id, starred } = file;

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
    // Fetch permissions when component mounts or file id changes
    fetchFilePermissions(id).then((perms) => {
      const currentUserId = localStorage.getItem("id");
      // Get the current user's permissions from the response
      setUserPermissions(perms[currentUserId] || {});
    });
  }, [id]);

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
      <ShareDialog file={file} onRefresh={onRefresh}>
        {(open) => (
          <button
            className="file-action-btn file-action-btn--hover"
            title={canShare ? "Share" : "No permission to share"}
            onClick={(e) => {
              e.stopPropagation();
              if (canShare) open();
            }}
            disabled={!canShare}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="currentColor"
                d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7a2.5 2.5 0 0 0 0-1.39l7.02-4.11A2.99 2.99 0 1 0 14 5a2.5 2.5 0 0 0 .04.39L7.02 9.5a3 3 0 1 0 0 5l7.02 4.11c-.03.12-.04.25-.04.39a3 3 0 1 0 3-2.92Z"
              />
            </svg>
          </button>
        )}
      </ShareDialog>

      <button
        className="file-action-btn file-action-btn--hover"
        title={canDownload ? "Download" : "No permission to download"}
        onClick={() => canDownload && downloadFile(id)}
        disabled={!canDownload}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill="currentColor"
            d="M5 20h14v-2H5v2Zm7-18v10.17l3.59-3.58L17 10l-5 5-5-5 1.41-1.41L11 12.17V2h1Z"
          />
        </svg>
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
            className="file-action-btn file-action-btn--hover"
            title={canRename ? "Rename" : "No permission to rename"}
            onClick={(e) => {
              e.stopPropagation();
              if (canRename) open();
            }}
            disabled={!canRename}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="currentColor"
                d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25Zm18.71-11.04a1.003 1.003 0 0 0 0-1.42l-2.5-2.5a1.003 1.003 0 0 0-1.42 0l-1.83 1.83 3.75 3.75 2-1.66Z"
              />
            </svg>
          </button>
        )}
      </GetText>

      {isStarred && (
        <button
          className="file-action-btn file-action-btn--starred"
          title={isStarred ? "Unstar" : "Star"}
          onClick={onToggleStar}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="currentColor"
              d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27Z"
            />
          </svg>
        </button>
      )}
      {!isStarred && (
        <button
          className={`file-action-btn file-action-btn--hover ${
            isStarred ? "file-action-btn--starred" : ""
          }`}
          title={isStarred ? "Unstar" : "Star"}
          onClick={onToggleStar}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="currentColor"
              d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27Z"
            />
          </svg>
        </button>
      )}

      <FileActions file={file} onRefresh={onRefresh} openOnLeftClick>
        <button
          className="file-action-btn"
          title="More"
          onClick={(e) => e.stopPropagation()}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="currentColor"
              d="M12 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm0 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm0 6a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z"
            />
          </svg>
        </button>
      </FileActions>
    </div>
  );
}

export default FileSelect;
