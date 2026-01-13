import Avatar from "../Avatar";
import PermissionSelect from "../PermissionSelect";
import "./style.css";

// displays shared user with permission controls
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

      <div className="shared-user-item-info">
        <div className="shared-user-item-name">
          <span>{entry.username}</span>
          {entry.isOwner && (
            <span className="shared-user-item-badge shared-user-item-badge-owner">
              Owner
            </span>
          )}
          {entry.userId === currentUserId && (
            <span className="shared-user-item-badge">You</span>
          )}
        </div>
        <div className="shared-user-item-meta">
          {entry.isOwner ? "Owner access" : labels[entry.role] || entry.role}
        </div>
      </div>

      {showAddButton ? (
        <button
          type="button"
          className="shared-user-item-add-btn"
          onClick={() => onAddUser(entry.username)}
        >
          Add
        </button>
      ) : entry.isOwner ? (
        <span className="shared-user-item-role-label">Owner</span>
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
