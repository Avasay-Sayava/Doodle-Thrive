import "./style.css";
import { useEffect, useRef, useState } from "react";

import newFile from "../../../utils/newFile";
import GetText from "../../modal/GetText";

export default function New({ onCreated, hidden = false }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const rootRef = useRef(null);

  const openFolderRef = useRef(null);
  const openFileRef = useRef(null);

  useEffect(() => {
    const onDocMouseDown = (e) => {
      if (!rootRef.current) return;

      // If click is inside the New button/menu, keep it open
      if (rootRef.current.contains(e.target)) return;

      // Otherwise close
      setMenuOpen(false);
    };

    document.addEventListener("mousedown", onDocMouseDown);
    return () => document.removeEventListener("mousedown", onDocMouseDown);
  }, []);

  const create = async (name, fileType) => {
    await newFile({ fileName: name, fileType });
    setMenuOpen(false);
    onCreated?.();
  };

  return (
    <div className="new" ref={rootRef}>
      {/* Keep GetText mounted so open() always works */}
      <GetText
        title="New folder"
        placeholder="Untitled folder"
        submitLabel="Create"
        onSubmit={(name) => create(name, "folder")}
      >
        {(open) => {
          openFolderRef.current = open;
          return null;
        }}
      </GetText>

      <GetText
        title="New file"
        placeholder="Untitled file"
        submitLabel="Create"
        onSubmit={(name) => create(name, "file")}
      >
        {(open) => {
          openFileRef.current = open;
          return null;
        }}
      </GetText>

      <div className={hidden ? "new--hidden-trigger" : ""}>
        <button
          type="button"
          className="new__button"
          onClick={() => setMenuOpen((v) => !v)}
          aria-haspopup="menu"
          aria-expanded={menuOpen}
        >
          <span className="new__plus">+</span>
          <span>New</span>
        </button>
      </div>

      {menuOpen && (
        <div className="new__menu" role="menu" aria-label="New menu">
          <button
            type="button"
            className="new__menu-item"
            role="menuitem"
            onClick={() => {
              setMenuOpen(false);
              openFolderRef.current?.();
            }}
          >
            New folder
          </button>

          <button
            type="button"
            className="new__menu-item"
            role="menuitem"
            onClick={() => {
              setMenuOpen(false);
              openFileRef.current?.();
            }}
          >
            New file
          </button>
        </div>
      )}
    </div>
  );
}
  