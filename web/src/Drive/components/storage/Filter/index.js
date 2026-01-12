import "./style.css";
import { useEffect, useRef, useState } from "react";
import { sortFiles } from "../../../utils/sortFiles";

export default function Filter({ 
  files, 
  setFiles, 
  sortBy = "name", 
  sortDir = "asc", 
  foldersMode = "mixed",
  onSortChange 
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    if (!open) return;

    const onMouseDown = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false);
    };
    const onKeyDown = (e) => e.key === "Escape" && setOpen(false);

    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const applySort = (nextSortBy = sortBy, nextSortDir = sortDir, nextFoldersMode = foldersMode) => {
    if (onSortChange) {
      onSortChange({ sortBy: nextSortBy, sortDir: nextSortDir, foldersMode: nextFoldersMode });
    }
    setFiles((prev) => sortFiles(prev, nextSortBy, nextSortDir, nextFoldersMode));
  };

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
              d="M4 7h14a1 1 0 0 0 0-2H4a1 1 0 0 0 0 2Zm0 6h10a1 1 0 0 0 0-2H4a1 1 0 0 0 0 2Zm0 6h16a1 1 0 0 0 0-2H4a1 1 0 0 0 0 2Z"
            />
          </svg>
        </span>
        <span className="gd-sort__label">Sort</span>
      </button>

      {open && (
        <div className="gd-sort__menu" role="menu" aria-label="Sort options">
          <div className="gd-sort__section">
            <div className="gd-sort__title">Sort by</div>
            <MenuItem checked={sortBy === "name"} label="Name" onClick={() => applySort("name", sortDir, foldersMode)} />
            <MenuItem checked={sortBy === "modified"} label="Last modified" onClick={() => applySort("modified", sortDir, foldersMode)} />
          </div>

          <div className="gd-sort__divider" />

          <div className="gd-sort__section">
            <div className="gd-sort__title">Sort direction</div>
            <MenuItem checked={sortDir === "asc"} label={sortBy === "name" ? "A to Z" : "New to Old"} onClick={() => applySort(sortBy, "asc", foldersMode)} />
            <MenuItem checked={sortDir === "desc"} label={sortBy === "name" ? "Z to A" : "Old to New"} onClick={() => applySort(sortBy, "desc", foldersMode)} />
          </div>

          <div className="gd-sort__divider" />

          <div className="gd-sort__section">
            <div className="gd-sort__title">Folders</div>
            <MenuItem checked={foldersMode === "folders-first"} label="On top" onClick={() => applySort(sortBy, sortDir, "folders-first")} />
            <MenuItem checked={foldersMode === "mixed"} label="Mixed with files" onClick={() => applySort(sortBy, sortDir, "mixed")} />
          </div>
        </div>
      )}
    </div>
  );
}

function MenuItem({ checked, label, onClick, disabled = false }) {
  return (
    <button
      type="button"
      className={`gd-sort__item ${checked ? "is-selected" : ""} ${disabled ? "is-disabled" : ""}`}
      role="menuitemradio"
      aria-checked={checked}
      disabled={disabled}
      onClick={disabled ? undefined : onClick}
    >
      <span className="gd-sort__check" aria-hidden="true">
        {checked && (
          <svg viewBox="0 0 24 24" width="18" height="18">
            <path fill="currentColor" d="M9 16.17 4.83 12 3.41 13.41 9 19 21 7 19.59 5.59 9 16.17Z" />
          </svg>
        )}
      </span>
      <span className="gd-sort__text">{label}</span>
    </button>
  );
}
