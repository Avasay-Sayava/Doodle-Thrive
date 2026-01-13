import SharedUserItem from "../SharedUserItem";
import "./style.css";

/**
 * SharedUserList - displays list of shared users with permission management
 * @param {Array} users - array of shared user entries
 * @param {string} currentUserId - logged-in user ID
 * @param {Array} roleOptions - available permission options
 * @param {Function} onRoleChange - callback when role changes
 * @param {Object} labels - role label map
 * @param {boolean} loading - show loading state
 * @param {string} error - error message
 * @param {Function} onRefresh - refresh button callback
 * @param {string} title - custom title for the list
 * @param {boolean} showAddButton - show add button instead of select
 * @param {Function} onAddUser - callback when add button is clicked
 * @param {boolean} hideRefresh - hide the refresh button
 * @param {string} emptyMessage - custom empty state message
 */
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
      <div className="shared-user-list__header">
        <span>{title}</span>
        <div className="shared-user-list__header-actions">
          {!hideRefresh && (
            <button
              type="button"
              className="shared-user-list__refresh-btn"
              onClick={onRefresh}
              title="Refresh"
            >
              ↻
            </button>
          )}
          {loading && <span className="shared-user-list__status">Loading</span>}
        </div>
      </div>

      {error && <div className="shared-user-list__error">{error}</div>}

      <div className={`shared-user-list__items`}>
        {users.length === 0 && !loading && !error ? (
          <div className="shared-user-list__empty">{emptyMessage}</div>
        ) : null}

        {[...users].sort((a, b) => {
          // Owner always first
          if (a.isOwner) return -1;
          if (b.isOwner) return 1;
          // Current user second (if not owner)
          if (a.userId === currentUserId) return -1;
          if (b.userId === currentUserId) return 1;
          // Others by username
          return (a.username || '').localeCompare(b.username || '');
        }).map((entry) => {
          // Filter role options based on entry type
          const filteredOptions = entry.isOwner 
            ? [] 
            : roleOptions.filter(opt => {
                // If user can't be owner, filter out owner option
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
