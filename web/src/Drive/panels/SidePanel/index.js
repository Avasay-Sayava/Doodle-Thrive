import "./style.css";
import { NavLink } from "react-router-dom";
import New from "../../components/storage/New";

export default function SidePanel({ onCreated }) {
  const items = [
    { to: "/drive", end: true, label: "Home", icon: IconHome },
    { to: "/drive/mydrive", end: true, label: "My Drive", icon: IconDrive },
    { to: "/drive/starred", label: "Starred", icon: IconStar },
    { to: "/drive/shared", label: "Shared with me", icon: IconShared },
    { to: "/drive/recent", label: "Recent", icon: IconRecent },
    { to: "/drive/bin", label: "Bin", icon: IconBin },
  ];

  return (
    
    <div className="drive-sidebar" aria-label="Sidebar">
      <div className="drive-sidebar__section">
        <New onCreated={onCreated}/>

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

function IconHome() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18">
      <path
        fill="currentColor"
        d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"
      />
    </svg>
  );
}

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
        d="M12 2 A10 10 0 1 1 11.999 2 Z M11 7 V13 L16.25 16.15 L17.25 14.42 L13 11.9 V7 H11"
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
