import "./style.css";
import { useEffect, useRef, useState } from "react";
import ActionsMenu from "./ActionsMenu";

export default function New({ onCreated, hidden = false, folderId = null, ...rest }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    const onDown = (e) => {
      if (!rootRef.current?.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  return (
    <div className="new" ref={rootRef} {...rest}>
      <div className={hidden ? "new-hidden-trigger" : ""}>
        <button
          type="button"
          className="new-button"
          onClick={() => setMenuOpen((v) => !v)}
          aria-haspopup="menu"
          aria-expanded={menuOpen}
        >
          <span className="new-plus">+</span>
          <span>New</span>
        </button>
      </div>

      <ActionsMenu
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        onCreated={onCreated}
        folderId={folderId}
      />
    </div>
  );
}
