import "./style.css";
import { NavLink } from "react-router-dom";
import New from "../../components/storage/New";
import IconHome from "../../components/icons/IconHome";
import IconFile from "../../components/icons/IconFile";
import IconStar from "../../components/icons/IconStar";
import IconShared from "../../components/icons/IconShared";
import IconRecent from "../../components/icons/IconRecent";
import IconBin from "../../components/icons/IconBin";

export default function SidePanel({ onCreated }) {
  const items = [
    { to: "/drive/home", end: true, label: "Home", icon: IconHome },
    { to: "/drive/mydrive", end: true, label: "My Drive", icon: IconFile },
    { to: "/drive/starred", label: "Starred", icon: IconStar },
    { to: "/drive/shared", label: "Shared with me", icon: IconShared },
    { to: "/drive/recent", label: "Recent", icon: IconRecent },
    { to: "/drive/bin", label: "Bin", icon: IconBin },
  ];

  return (
    <div className="drive-sidebar" aria-label="Sidebar">
      <div className="drive-sidebar-section">
        <New onCreated={onCreated} data-tutorial="new-button" />

        {items.map((it) => {
          const Icon = it.icon;

          return (
            <NavLink
              key={it.to}
              to={it.to}
              end={it.end}
              className={({ isActive }) =>
                `drive-sidebar-item ${isActive ? "is-active" : ""}`
              }
            >
              <span className="drive-sidebar-icon" aria-hidden="true">
                <Icon />
              </span>
              <span className="drive-sidebar-label">{it.label}</span>
            </NavLink>
          );
        })}
      </div>
    </div>
  );
}
