import { useEffect, useMemo, useRef, useState } from "react";
import "./style.css";
import renameFile from "../../../utils/renameFile";
import downloadFile from "../../../utils/downloadFile";
import shareFile from "../../../utils/shareFile";
import patchFile from "../../../utils/patchFile";
import GetText from "../../modal/GetText";


export default function FileActions({
  children,
  file,
  onOrganise,
  onLeftClick,
  onRefresh,
}) {
  const rootRef = useRef(null);
  const menuRef = useRef(null);

  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const items = useMemo(() => {
    const isFolder = file?.fileType === "folder";

    return [
      {
        key: "download",
        label: "Download",
        disabled: !isFolder,
        onClick: () => downloadFile(file?.id),
        icon: (
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
            <path
              fill="currentColor"
              d="M5 20h14v-2H5v2zm7-18v10.17l3.59-3.58L17 10l-5 5-5-5 1.41-1.41L11 12.17V2h1z"
            />
          </svg>
        ),
      },
      {
        key: "rename",
        label: "Rename",
        onClick: () => renameFile(file).then(() => onRefresh()),
        icon: (
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
            <path
              fill="currentColor"
              d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zm18-11.5a1 1 0 0 0 0-1.41l-1.34-1.34a1 1 0 0 0-1.41 0l-1.13 1.13 3.75 3.75L21 5.75z"
            />
          </svg>
        ),
      },
      { key: "sep-1", type: "separator" },
      {
        key: "share",
        label: "Share",
        onClick: () => shareFile.file?.id,
        rightArrow: true,
        icon: (
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
            <path
              fill="currentColor"
              d="M16 11c1.66 0 3-1.34 3-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zM8 13c1.66 0 3-1.34 3-3S9.66 7 8 7 5 8.34 5 10s1.34 3 3 3zm8 2c-2.33 0-7 1.17-7 3.5V21h14v-2.5C23 16.17 18.33 15 16 15zM8 15c-.29 0-.62.02-.97.05C8.2 15.78 9 16.82 9 18.5V21H1v-2.5C1 16.17 5.67 15 8 15z"
            />
          </svg>
        ),
      },
      {
        key: "description",
        label: "Folder description",
        onClick: () => file?.description,
        rightArrow: true,
        icon: (
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
            <path
              fill="currentColor"
              d="M11 17h2v-6h-2v6zm0-8h2V7h-2v2zm1 13C6.48 22 2 17.52 2 12S6.48 2 12 2s10 4.48 10 10-4.48 10-10 10z"
            />
          </svg>
        ),
      },
      { key: "sep-2", type: "separator" },
      {
        key: "bin",
        label: "Move to bin",
        danger: true,
        onClick: () => patchFile(file.id, { trashed: true }).then(() => onRefresh()),
        icon: (
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
            <path
              fill="currentColor"
              d="M6 7h12l-1 14H7L6 7zm3-3h6l1 2H8l1-2z"
            />
          </svg>
        ),
      },
    ];
  }, [file, onRefresh]);

  const close = () => setOpen(false);

  const openAt = (clientX, clientY) => {
    setPos({ x: clientX, y: clientY });
    setOpen(true);
  };

  const onContextMenu = (e) => {
    if (!rootRef.current?.contains(e.target)) return;

    e.preventDefault();
    e.stopPropagation();

    openAt(e.clientX, e.clientY);
  };

  const onClick = (e) => {
    if (open) return;
    onLeftClick?.(e, file);
  };

  useEffect(() => {
    if (!open) return;

    const onDocMouseDown = (e) => {
      if (menuRef.current?.contains(e.target)) return;
      close();
    };

    const onKeyDown = (e) => {
      if (e.key === "Escape") close();
    };

    const onScroll = () => close();
    const onResize = () => close();

    document.addEventListener("mousedown", onDocMouseDown, true);
    document.addEventListener("keydown", onKeyDown);
    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", onResize);

    return () => {
      document.removeEventListener("mousedown", onDocMouseDown, true);
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", onResize);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const el = menuRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    let x = pos.x;
    let y = pos.y;

    const pad = 8;
    const maxX = window.innerWidth - rect.width - pad;
    const maxY = window.innerHeight - rect.height - pad;

    x = Math.max(pad, Math.min(x, maxX));
    y = Math.max(pad, Math.min(y, maxY));

    if (x !== pos.x || y !== pos.y) setPos({ x, y });
  }, [open]);

  const handleItemClick = (item) => {
    if (item.disabled) return;
    item.onClick?.();
    close();
  };

  const onlyChild = children;

  return (
    <>
      <span
        ref={rootRef}
        className="file-actions__row-sensor"
        onContextMenu={onContextMenu}
        onClick={onClick}
      >
        {onlyChild}
      </span>

      {open && (
        <div
          ref={menuRef}
          className="file-actions__menu"
          style={{ left: pos.x, top: pos.y }}
          role="menu"
          aria-label="File actions"
        >
          {items.map((item) => {
            if (item.type === "separator") {
              return <div key={item.key} className="file-actions__sep" />;
            }

            return (
              <button
                key={item.key}
                type="button"
                className={[
                  "file-actions__item",
                  item.danger ? "is-danger" : "",
                  item.disabled ? "is-disabled" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                onClick={() => handleItemClick(item)}
                role="menuitem"
                disabled={item.disabled}
              >
                <span className="file-actions__icon">{item.icon}</span>

                <span className="file-actions__label">{item.label}</span>

                <span className="file-actions__right">
                  {item.hint ? (
                    <span className="file-actions__hint">{item.hint}</span>
                  ) : null}
                  {item.rightArrow ? (
                    <span className="file-actions__arrow" aria-hidden="true">
                      ▸
                    </span>
                  ) : null}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </>
  );
}
