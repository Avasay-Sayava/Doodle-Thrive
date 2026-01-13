import { useCallback, useMemo, useEffect, useRef, useState } from "react";
import GetText from "../GetText";
import shareFile from "../../utils/shareFile";
import useFilePermissions, {
  findUserIdByUsername,
} from "../../utils/useFilePermissions";
import SharedUserList from "../../components/SharedUserList";
import useUserId from "../../utils/useUserId";

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
  const [searchUsername, setSearchUsername] = useState("");
  const [userFound, setUserFound] = useState(false);

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

  // Reload shared users when currentUserId becomes available
  useEffect(() => {
    if (currentUserId && fileId) {
      loadShared();
    }
  }, [currentUserId, fileId, loadShared]);

  const handleRoleChange = useCallback(
    (entry, nextRole) => {
      updatePermission(entry, nextRole);
    },
    [updatePermission]
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
        .then(() => onRefreshRef.current?.())
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

  const excludeUsernames = useMemo(
    () => sharedWith.map((u) => u.username),
    [sharedWith]
  );

  const renderExtra = useCallback(
    ({ userResults, loadingUsers }) => (
      <>
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
      </>
    ),
    [
      sharedWith,
      currentUserId,
      handleRoleChange,
      sharedLoading,
      sharedError,
      loadShared,
      handleAddUser,
    ]
  );

  return (
    <GetText
      title="Share"
      placeholder="Add people by username"
      submitLabel="Share"
      showUserSearch
      onOpen={() => {
        setError(null);
        setUserFound(true);
        loadShared();
      }}
      onInputChange={() => {
        setError(null);
        setUserFound(true);
      }}
      renderExtra={renderExtra}
      excludeUsernames={excludeUsernames}
      error={error}
      userFound={userFound}
      onSubmit={(username) => {
        setError(null);
        setSearchUsername(username);

        if (!fileId) {
          setError("Unable to share: file not found");
          return Promise.resolve();
        }

        const existingUser = sharedWith.find((u) => u.username === username);
        if (existingUser) {
          setError("This user already has access to this file");
          return Promise.resolve();
        }

        return findUserIdByUsername(username)
          .then((targetId) => {
            setUserFound(true);
            if (ownerId && targetId === ownerId) {
              setError("The file owner already has full access");
              setUserFound(false);
              return Promise.resolve();
            }
            return shareFile(fileId, username, "viewer");
          })
          .then(() => wait())
          .then(() => loadShared({ preserveUserId: undefined }))
          .then(() => onRefreshRef.current?.())
          .catch((err) => {
            setUserFound(false);
            if (err.message.includes("not found") || err.message.includes("404")) {
              setError("User not found");
            } else if (err.message) {
              setError("Failed to share file. Please try again");
            }
            return Promise.resolve();
          });
      }}
    >
      {(open) => (typeof children === "function" ? children(open) : null)}
    </GetText>
  );
}
