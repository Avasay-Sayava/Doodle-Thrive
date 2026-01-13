import "./style.css";

/**
 * Avatar component - displays a profile picture or initial letter.
 * @param {string} username - the username for the initial
 * @param {string} imageUrl - image url for profile picture
 * @param {number} size - size in pixels (default 38)
 */
export default function Avatar({ username, imageUrl, size = 38 }) {
  const initial = (username || "?").slice(0, 1).toUpperCase();

  return (
    <div
      className="avatar"
      style={{ width: `${size}px`, height: `${size}px` }}
      aria-hidden="true"
    >
      {imageUrl ? (
        <img src={imageUrl} alt={username} className="avatar-image" />
      ) : (
        <span className="avatar-initial">{initial}</span>
      )}
    </div>
  );
}
