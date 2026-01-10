import "./style.css";
import { useEffect, useRef, useState } from "react";

const SORT = {
  "name-asc": { field: "name", dir: "asc" },
  "name-desc": { field: "name", dir: "desc" },
  "date-oldest": { field: "modified", dir: "asc" },
  "date-newest": { field: "modified", dir: "desc" },
};

const sortyBy = (field, dir) => {
  field === "modified"
    ? dir === "asc"
      ? "date-oldest"
      : "date-newest"
    : dir === "asc"
      ? "name-asc"
      : "name-desc"
};

function toTimestamp(v) {
  if (!v) return 0;
  const t = new Date(v).getTime();
  return Number.isFinite(t) ? t : 0;
}

function sortComparator(sortBy) {
  switch (sortBy) {
    case "name-asc":
      return (a, b) => String(a.name ?? "").localeCompare(String(b.name ?? ""));
    case "name-desc":
      return (a, b) => String(b.name ?? "").localeCompare(String(a.name ?? ""));
    case "date-newest":
      return (a, b) => toTimestamp(b.lastModified) - toTimestamp(a.lastModified);
    case "date-oldest":
      return (a, b) => toTimestamp(a.lastModified) - toTimestamp(b.lastModified);
    default:
      return () => 0;
  }
}


export default function Filter({
  sortBy,
  setSortBy,
  folderPosition,
  setFolderPosition,
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  const { field, dir } = SORT[sortBy] ?? SORT["name-asc"];

  useEffect(() => {
    if (!open) return;

    const closeIfOutside = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false);
    };
    const closeOnEsc = (e) => e.key === "Escape" && setOpen(false);

    document.addEventListener("mousedown", closeIfOutside);
    document.addEventListener("keydown", closeOnEsc);
    return () => {
      document.removeEventListener("mousedown", closeIfOutside);
      document.removeEventListener("keydown", closeOnEsc);
    };
  }, [open]);

  return (
    <div className="gd-sort" ref={rootRef}>
      <button
        type="button"
        className={`gd-sort__button ${open ? "is-open" : ""}`}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="gd-sort__icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="16" height="16">
            <path
              fill="currentColor"
              d="M10 18h4v-2h-4v2ZM3 12h18v-2H3v2Zm3-6v2h12V6H6Z"
            />
          </svg>
        </span>
        <span className="gd-sort__label">Sort</span>
      </button>

      {open && (
        <div className="gd-sort__menu" role="menu" aria-label="Sort options">
          <div className="gd-sort__section">
            <div className="gd-sort__title">Sort by</div>
            <MenuItem
              checked={field === "name"}
              label="Name"
              onClick={() => setSortBy(keyFor("name", dir))}
            />
            <MenuItem
              checked={field === "modified"}
              label="Date modified"
              onClick={() => setSortBy(keyFor("modified", dir))}
            />
          </div>

          <div className="gd-sort__divider" />

          <div className="gd-sort__section">
            <div className="gd-sort__title">Sort direction</div>
            <MenuItem
              checked={dir === "asc"}
              label="A to Z"
              onClick={() => setSortBy(keyFor(field, "asc"))}
            />
            <MenuItem
              checked={dir === "desc"}
              label="Z to A"
              onClick={() => setSortBy(keyFor(field, "desc"))}
            />
          </div>

          <div className="gd-sort__divider" />

          <div className="gd-sort__section">
            <div className="gd-sort__title">Folders</div>
            <MenuItem
              checked={folderPosition === "folders-first"}
              label="On top"
              onClick={() => setFolderPosition("folders-first")}
            />
            <MenuItem
              checked={folderPosition === "mixed"}
              label="Mixed with files"
              onClick={() => setFolderPosition("mixed")}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function MenuItem({ checked, label, onClick }) {
  return (
    <button
      type="button"
      className="gd-sort__item"
      role="menuitemradio"
      aria-checked={checked}
      onClick={onClick}
    >
      <span className="gd-sort__check" aria-hidden="true">
        {checked && (
          <svg viewBox="0 0 24 24" width="18" height="18">
            <path
              fill="currentColor"
              d="M9 16.17 4.83 12 3.41 13.41 9 19 21 7 19.59 5.59 9 16.17Z"
            />
          </svg>
        )}
      </span>
      <span className="gd-sort__text">{label}</span>
    </button>
  );
}
