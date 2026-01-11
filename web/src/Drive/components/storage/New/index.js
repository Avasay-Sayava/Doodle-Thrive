import "./style.css";
import { useEffect, useRef, useState } from "react";

import newFile from "../../../utils/newFile";
import GetText from "../../modal/GetText";

export default function New({ onCreated, hidden = false }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [kind, setKind] = useState(null);
  const rootRef = useRef(null);

  useEffect(() => {
    const onDocMouseDown = (e) => {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", onDocMouseDown);
    return () => document.removeEventListener("mousedown", onDocMouseDown);
  }, []);

  const create = async (name) => {
    await newFile({
      fileName: name,
      fileType: kind,
    });

    setKind(null);
    setMenuOpen(false);
    onCreated?.();
  };

  return (
    <div className="new" ref={rootRef}>
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
          <GetText
            title="New folder"
            placeholder="Untitled folder"
            submitLabel="Create"
            onSubmit={create}
            onClose={() => setKind(null)}
          >
            {(open) => (
              <button
                type="button"
                className="new__menu-item"
                role="menuitem"
                onClick={() => {
                  setKind("folder");
                  open();
                }}
              >
                New folder
              </button>
            )}
          </GetText>

          <GetText
            title="New file"
            placeholder="Untitled file"
            submitLabel="Create"
            onSubmit={create}
            onClose={() => setKind(null)}
          >
            {(open) => (
              <button
                type="button"
                className="new__menu-item"
                role="menuitem"
                onClick={() => {
                  setKind("file");
                  open();
                }}
              >
                New file
              </button>
            )}
          </GetText>
        </div>
      )}
    </div>
  );
}
