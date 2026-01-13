import SharedUserItem from "../SharedUserItem";
import "./style.css";

export default function SharedUserList({
  users = [],
  currentUserId,
  roleOptions,
  onRoleChange,
  labels = {},
  loading = false,
  error = "",
  onRefresh,
  title = "Shared with",
  showAddButton = false,
  onAddUser,
  hideRefresh = false,
  emptyMessage = "No one else has access yet.",
}) {
  return (
    <div className="shared-user-list">
      <div className="shared-user-list-header">
        <span>{title}</span>
        <div className="shared-user-list-header-actions">
          {!hideRefresh && (
            <button
              type="button"
              className="shared-user-list-refresh-btn"
              onClick={onRefresh}
              title="Refresh"
            >
              ↻
            </button>
          )}
          {loading && <span className="shared-user-list-status">Loading</span>}
        </div>
      </div>

      {error && <div className="shared-user-list-error">{error}</div>}

      <div className={`shared-user-list-items`}>
        {users.length === 0 && !loading && !error ? (
          <div className="shared-user-list-empty">{emptyMessage}</div>
        ) : null}

        {[...users].sort((a, b) => {
          if (a.isOwner) return -1;
          if (b.isOwner) return 1;
          if (a.userId === currentUserId) return -1;
          if (b.userId === currentUserId) return 1;
          return (a.username || '').localeCompare(b.username || '');
        }).map((entry) => {
          const filteredOptions = entry.isOwner 
            ? [] 
            : roleOptions.filter(opt => {
                if (opt.value === "owner" && entry.userId === currentUserId) {
                  return false;
                }
                return true;
              });
          
          return (
            <SharedUserItem
              key={entry.userId}
              entry={entry}
              currentUserId={currentUserId}
              roleOptions={filteredOptions}
              onRoleChange={onRoleChange}
              labels={labels}
              showAddButton={showAddButton}
              onAddUser={onAddUser}
            />
          );
        })}
      </div>
    </div>
  );
}
