import { useCallback, useMemo, useEffect, useRef } from "react";
import GetText from "../GetText";
import shareFile from "../../utils/shareFile";
import useFilePermissions, { findUserIdByUsername } from "../../utils/useFilePermissions";
import SharedUserList from "../../components/SharedUserList";

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
  const currentUserId = useMemo(() => localStorage.getItem("id"), []);
  const onRefreshRef = useRef(onRefresh);

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

  const handleRoleChange = useCallback(
    (entry, nextRole) => {
      updatePermission(entry, nextRole);
    },
    [updatePermission]
  );

  const excludeUsernames = useMemo(() => sharedWith.map((u) => u.username), [sharedWith]);

  return (
    <GetText
      title="Share"
      placeholder="Add people by username"
      submitLabel="Share"
      showUserSearch
      onOpen={loadShared}
      extraContent={
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
      }
      excludeUsernames={excludeUsernames}
      onSubmit={(username) => {
        if (!fileId) {
          return Promise.reject(new Error("Missing file id"));
        }

        const existingUser = sharedWith.find((u) => u.username === username);
        if (existingUser) {
          return Promise.reject(new Error(`${username} already has access`));
        }

        const action = findUserIdByUsername(username).then((targetId) => {
          if (ownerId && targetId === ownerId) {
            throw new Error("Owner already has full access.");
          }
          return shareFile(fileId, username, "viewer");
        });

        return Promise.resolve(action)
          .then(() => wait())
          .then(() => loadShared({ preserveUserId: undefined }))
          .then(() => onRefreshRef.current?.())
          .catch((err) => {
            throw err;
          });
      }}
    >
      {(open) => (typeof children === "function" ? children(open) : null)}
    </GetText>
  );
}
