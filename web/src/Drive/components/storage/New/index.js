import "./style.css";
import { useEffect, useRef, useState, useMemo } from "react";
import ActionsMenu from "./ActionsMenu";

export default function New({
  onCreated,
  hidden = false,
  folderId = null,
  ...rest
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const buttonRef = useRef(null);

  const anchorPoint = useMemo(() => {
    if (!menuOpen || !buttonRef.current) return null;
    const rect = buttonRef.current.getBoundingClientRect();
    return {
      x: rect.left,
      y: rect.bottom + 4,
    };
  }, [menuOpen]);

  useEffect(() => {
    const onDown = (e) => {
      if (!buttonRef.current?.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  return (
    <div className="new" {...rest}>
      <div className={hidden ? "new-hidden-trigger" : ""}>
        <button
          ref={buttonRef}
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
        anchorPoint={anchorPoint}
      />
    </div>
  );
}
