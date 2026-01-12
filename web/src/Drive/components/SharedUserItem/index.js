import Avatar from "../Avatar";
import PermissionSelect from "../PermissionSelect";
import "./style.css";

/**
 * SharedUserItem - displays a single shared user with permission controls
 * @param {Object} entry - user entry with userId, username, imageUrl, role, isOwner
 * @param {string} currentUserId - logged-in user ID
 * @param {Array} roleOptions - available permission options
 * @param {Function} onRoleChange - callback when role changes
 * @param {Object} labels - role label map
 * @param {boolean} showAddButton - show add button instead of select
 * @param {Function} onAddUser - callback when add button is clicked
 */
export default function SharedUserItem({
  entry,
  currentUserId,
  roleOptions,
  onRoleChange,
  labels = {},
  showAddButton = false,
  onAddUser,
}) {
  return (
    <div className="shared-user-item">
      <Avatar username={entry.username} imageUrl={entry.imageUrl} size={38} />

      <div className="shared-user-item__info">
        <div className="shared-user-item__name">
          <span>{entry.username}</span>
          {entry.isOwner && (
            <span className="shared-user-item__badge shared-user-item__badge--owner">
              Owner
            </span>
          )}
          {entry.userId === currentUserId && (
            <span className="shared-user-item__badge">You</span>
          )}
        </div>
        <div className="shared-user-item__meta">
          {entry.isOwner ? "Owner access" : labels[entry.role] || entry.role}
        </div>
      </div>

      {showAddButton ? (
        <button
          type="button"
          className="shared-user-item__add-btn"
          onClick={() => onAddUser(entry.username)}
        >
          Add
        </button>
      ) : entry.isOwner ? (
        <span className="shared-user-item__role-label">Owner</span>
      ) : (
        <PermissionSelect
          value={entry.role}
          onChange={(newRole) => onRoleChange(entry, newRole)}
          options={roleOptions}
        />
      )}
    </div>
  );
}
