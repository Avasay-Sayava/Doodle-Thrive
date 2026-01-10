import "./style.css";
import { NavLink } from "react-router-dom";

export default function SidePanel() {
  const items = [
    { to: "/drive", end: true, label: "My Drive", icon: IconDrive },
    { to: "/drive/starred", label: "Starred", icon: IconStar },
    { to: "/drive/shared", label: "Shared with me", icon: IconShared },
    { to: "/drive/recent", label: "Recent", icon: IconRecent },
    { to: "/drive/bin", label: "Bin", icon: IconBin },
  ];

  return (
    <div className="drive-sidebar" aria-label="Sidebar">
      <div className="drive-sidebar__section">
        {items.map((it) => {
          const Icon = it.icon;

          return (
            <NavLink
              key={it.to}
              to={it.to}
              end={it.end}
              className={({ isActive }) =>
                `drive-sidebar__item ${isActive ? "is-active" : ""}`
              }
            >
              <span className="drive-sidebar__icon" aria-hidden="true">
                <Icon />
              </span>
              <span className="drive-sidebar__label">{it.label}</span>
            </NavLink>
          );
        })}
      </div>
    </div>
  );
}

/* icons */

function IconDrive() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18">
      <path
        fill="currentColor"
        d="M6 2h8l4 6v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Zm8 2H6v16h10V9h-3V4Z"
      />
    </svg>
  );
}

function IconStar() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18">
      <path
        fill="currentColor"
        d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27Z"
      />
    </svg>
  );
}

function IconShared() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18">
      <path
        fill="currentColor"
        d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3Zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3Zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5C15 14.17 10.33 13 8 13Zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5Z"
      />
    </svg>
  );
}

function IconRecent() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18">
      <path
        fill="currentColor"
        d="M13 3a9 9 0 1 0 8.95 10h-2.02A7 7 0 1 1 13 5V3Zm-1 5v6l5.25 3.15 1-1.73-4.25-2.52V8h-2Zm8-2V3h-2v5h5V6h-3Z"
      />
    </svg>
  );
}

function IconBin() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18">
      <path
        fill="currentColor"
        d="M6 7h12l-1 14H7L6 7Zm3-4h6l1 2h4v2H4V5h4l1-2Z"
      />
    </svg>
  );
}
