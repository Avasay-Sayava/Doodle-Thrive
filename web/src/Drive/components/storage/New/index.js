import "./style.css";
import { useEffect, useRef, useState } from "react";

import newFile from "../../../utils/newFile";
import GetText from "../../../modals/GetText";
import uploadFile from "../../../utils/uploadFile";

function IconFile() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18">
      <path
        fill="currentColor"
        d="M6 2h8l4 6v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Zm8 2H6v16h10V9h-3V4Z"
      />
    </svg>
  );
}

function IconFolder() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18">
      <path
        fill="currentColor"
        d="M10 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"
      />
    </svg>
  );
}

function IconUpload() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18">
      <path
        fill="currentColor"
        d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"
      />
    </svg>
  );
}

export default function New({ onCreated, hidden = false }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const rootRef = useRef(null);

  const openFolderRef = useRef(null);
  const openFileRef = useRef(null);

  const fileInputRef = useRef(null);

  useEffect(() => {
    const onDown = (e) => {
      if (!rootRef.current?.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  const refresh = () => {
    setMenuOpen(false);
    onCreated?.();
  };

  const create = async (name, fileType) => {
    await newFile({ fileName: name, fileType });
    refresh();
  };

  const pickFiles = async (e) => {
    const files = Array.from(e.target.files || []);
    e.target.value = "";
    if (!files.length) return;

    for (const f of files) await uploadFile(f);
    refresh();
  };

  return (
    <div className="new" ref={rootRef}>

      <GetText
        title="New file"
        placeholder="Untitled file"
        submitLabel="Create"
        onSubmit={(name) => create(name, "file")}
      >
        {(open) => (openFileRef.current = open, null)}
      </GetText>

      <GetText
        title="New folder"
        placeholder="Untitled folder"
        submitLabel="Create"
        onSubmit={(name) => create(name, "folder")}
      >
        {(open) => (openFolderRef.current = open, null)}
      </GetText>

      <input ref={fileInputRef} type="file" multiple accept=".txt" style={{ display: "none" }} onChange={pickFiles} />

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
          <button type="button" className="new__menu-item" onClick={() => (setMenuOpen(false), openFileRef.current?.())}>
            <span className="new__menu-icon" aria-hidden="true">
              <IconFile />
            </span>
            New file
          </button>

          <button type="button" className="new__menu-item" onClick={() => (setMenuOpen(false), openFolderRef.current?.())}>
            <span className="new__menu-icon" aria-hidden="true">
              <IconFolder />
            </span>
            New folder
          </button>

          <div className="new__menu-sep" />

          <button type="button" className="new__menu-item" onClick={() => (setMenuOpen(false), fileInputRef.current?.click())}>
            <span className="new__menu-icon" aria-hidden="true">
              <IconUpload />
            </span>
            Upload file
          </button>
        </div>
      )}
    </div>
  );
}
