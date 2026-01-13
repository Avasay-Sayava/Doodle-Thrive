import "./style.css";
import { useCallback, useEffect, useRef, useState } from "react";
import Modal from "../Modal";
import shareFile from "../../utils/shareFile";
import useFilePermissions, {
  findUserIdByUsername,
} from "../../utils/useFilePermissions";
import SharedUserList from "../../components/SharedUserList";
import useUserId from "../../utils/useUserId";

const API_BASE = process.env.API_BASE_URL || "http://localhost:3300";

const PERMISSION_OPTIONS = [
  { value: "none", label: "Remove access" },
  { value: "viewer", label: "Viewer access" },
  { value: "editor", label: "Editor access" },
  { value: "admin", label: "Admin access" },
  { value: "owner", label: "Owner access" },
];

const ROLE_LABELS = {
  viewer: "Viewer access",
  editor: "Editor access",
  admin: "Admin access",
  none: "No access",
  owner: "Owner access",
};

const wait = (ms = 350) => new Promise((resolve) => setTimeout(resolve, ms));

export default function ShareDialog({ file, onRefresh, children }) {
  const fileId = file?.id;
  const currentUserId = useUserId();
  const onRefreshRef = useRef(onRefresh);
  const [error, setError] = useState(null);
  const [userFound, setUserFound] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [userResults, setUserResults] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    onRefreshRef.current = onRefresh;
  }, [onRefresh]);

  const {
    sharedWith,
    loading: sharedLoading,
    error: sharedError,
    ownerId,
    loadShared,
    updatePermission,
  } = useFilePermissions(fileId, currentUserId, onRefresh);

  useEffect(() => {
    if (currentUserId && fileId) {
      loadShared();
    }
  }, [currentUserId, fileId, loadShared]);


  useEffect(() => {
    const trimmed = inputValue.trim();
    if (!trimmed || trimmed.length < 1) {
      setUserResults([]);
      return undefined;
    }

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setLoadingUsers(true);
      try {
        const jwt = localStorage.getItem("token");
        if (!jwt) {
          setUserResults([]);
          return;
        }

        const res = await fetch(`${API_BASE}/api/users`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwt}`,
          },
          body: JSON.stringify({ username: trimmed }),
        });

        if (!res.ok) {
          setUserResults([]);
          return;
        }

        const data = await res.json();
        const excludeUsernames = sharedWith.map((u) => u.username);
        const users = Object.entries(data || {})
          .map(([id, { username }]) => ({ id, username }))
          .filter(({ username }) => !excludeUsernames.includes(username));
        setUserResults(users);
      } catch (err) {
        if (err.name !== "AbortError") {
          setUserResults([]);
        }
      } finally {
        setLoadingUsers(false);
      }
    }, 0);

    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [inputValue, sharedWith]);

  const handleRoleChange = useCallback(
    (entry, nextRole) => {
      if (entry.userId === currentUserId) {
        onRefreshRef.current?.();
      }
      updatePermission(entry, nextRole);
    },
    [updatePermission, currentUserId]
  );

  const handleAddUser = useCallback(
    (username) => {
      if (!fileId) {
        setError("Unable to share: file not found");
        return;
      }

      const existingUser = sharedWith.find((u) => u.username === username);
      if (existingUser) {
        setError("This user already has access to this file");
        return;
      }

      findUserIdByUsername(username)
        .then((targetId) => {
          if (ownerId && targetId === ownerId) {
            setError("The file owner already has full access");
            return;
          }
          return shareFile(fileId, username, "viewer");
        })
        .then(() => wait())
        .then(() => loadShared({ preserveUserId: undefined }))
        .catch((err) => {
          if (err.message.includes("not found") || err.message.includes("404")) {
            setError("User not found");
          } else if (err.message.includes("already has access")) {
            setError("This user already has access to this file");
          } else {
            setError("Failed to share file. Please try again");
          }
        });
    },
    [fileId, sharedWith, ownerId, loadShared]
  );

  const handleSubmit = useCallback(() => {
    setError(null);

    const trimmed = inputValue.trim();
    if (!trimmed || !userFound) return;

    if (!fileId) {
      setError("Unable to share: file not found");
      return Promise.resolve();
    }

    const existingUser = sharedWith.find((u) => u.username === trimmed);
    if (existingUser) {
      setError("This user already has access to this file");
      return Promise.resolve();
    }

    return findUserIdByUsername(trimmed)
      .then((targetId) => {
        setUserFound(true);
        if (ownerId && targetId === ownerId) {
          setError("The file owner already has full access");
          setUserFound(false);
          return Promise.resolve();
        }
        return shareFile(fileId, trimmed, "viewer");
      })
      .then(() => wait())
      .then(() => loadShared({ preserveUserId: undefined }))
      .then(() => {
        setInputValue("");
        setUserResults([]);
      })
      .catch((err) => {
        setUserFound(false);
        if (err.message.includes("not found") || err.message.includes("404")) {
          setError("User not found");
        } else if (err.message) {
          setError("Failed to share file. Please try again");
        }
        return Promise.resolve();
      });
  }, [inputValue, userFound, fileId, sharedWith, ownerId, loadShared]);

  const handleClose = useCallback(() => {
    setInputValue("");
    setUserResults([]);
    setError(null);
    setUserFound(true);
  }, []);

  const renderBody = useCallback(
    (isOpen, shouldRender, close) => {
      if (!shouldRender) return null;

      return (
        <div className="share-dialog-content">
          <div className="share-dialog-input-wrapper">
            <input
              ref={(el) => {
                inputRef.current = el;
                if (el && isOpen) el.focus();
              }}
              className="share-dialog-input"
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                setError(null);
                setUserFound(true);
              }}
              placeholder="Add people by username"
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSubmit();
              }}
              autoFocus
            />
          </div>

          {error && <div className="share-dialog-error">{error}</div>}

          {userResults.length > 0 && (
            <SharedUserList
              title="Search Results"
              users={userResults}
              currentUserId={currentUserId}
              roleOptions={PERMISSION_OPTIONS}
              onRoleChange={handleRoleChange}
              labels={ROLE_LABELS}
              loading={loadingUsers}
              error={null}
              onRefresh={() => {}}
              showAddButton={true}
              onAddUser={handleAddUser}
              hideRefresh={true}
              emptyMessage="No new users found."
            />
          )}

          <SharedUserList
            users={sharedWith}
            currentUserId={currentUserId}
            roleOptions={PERMISSION_OPTIONS}
            onRoleChange={handleRoleChange}
            labels={ROLE_LABELS}
            loading={sharedLoading}
            error={sharedError}
            onRefresh={loadShared}
          />

          <div className="share-dialog-actions">
            <button
              type="button"
              className="share-dialog-btn share-dialog-btn-primary"
              onClick={handleSubmit}
              disabled={!userFound || !inputValue.trim()}
            >
              Share
            </button>
          </div>
        </div>
      );
    },
    [
      inputValue,
      error,
      userResults,
      loadingUsers,
      currentUserId,
      handleRoleChange,
      sharedWith,
      sharedLoading,
      sharedError,
      loadShared,
      handleAddUser,
      handleSubmit,
      userFound,
    ]
  );

  return (
    <Modal
      title="Share"
      onOpen={() => {
        setError(null);
        setUserFound(true);
        loadShared();
      }}
      onClose={handleClose}
      renderBody={renderBody}
      className="share-dialog"
    >
      {(open) => (typeof children === "function" ? children(open) : null)}
    </Modal>
  );
}
