import {
  Children,
  cloneElement,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import "./style.css";

import renameFile from "../../../utils/renameFile";
import downloadFile from "../../../utils/downloadFile";
import patchFile from "../../../utils/patchFile";
import { roleFromPermissions } from "../../../utils/useFilePermissions";
import GetText from "../../../modals/GetText";
import ShareDialog from "../../../modals/ShareDialog";
import MoveFile from "../../../modals/MoveFile";
import ConfirmDialog from "../../../modals/ConfirmDialog";

export default function FileActions({
  children,
  file,
  onLeftClick = null,
  onRefresh,
  currentUserPerms = null,
  openOnLeftClick = false,
}) {
  const menuRef = useRef(null);

  const openRenameModalRef = useRef(null);
  const openShareModalRef = useRef(null);
  const openMoveModalRef = useRef(null);
  const openDeleteConfirmRef = useRef(null);

  const [hoverKey, setHoverKey] = useState(null);
  const [descPos, setDescPos] = useState({ x: 0, y: 0 });

  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [modalOpening, setModalOpening] = useState(false);

  const close = () => {
    setOpen(false);
    setHoverKey(null);
  };

  const openAt = (clientX, clientY) => {
    setPos({ x: clientX, y: clientY });
    setOpen(true);
  };

  const onContextMenu = (e) => {
    e.preventDefault();
    e.stopPropagation();
    openAt(e.clientX, e.clientY);
  };

  const onClick = (e) => {
    if (open || modalOpening) return;

    if (openOnLeftClick) {
      e.preventDefault();
      e.stopPropagation();
      openAt(e.clientX, e.clientY);
      return;
    }

    // Don't trigger onLeftClick if clicking on a button or within the actions column
    if (e.target.closest('button') || e.target.closest('.col-actions') || e.target.closest('.file-actions')) {
      return;
    }

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
    const pad = 8;

    let x = pos.x;
    let y = pos.y;

    x = Math.max(pad, Math.min(x, window.innerWidth - rect.width - pad));
    y = Math.max(pad, Math.min(y, window.innerHeight - rect.height - pad));

    if (x !== pos.x || y !== pos.y) setPos({ x, y });
  }, [open, pos.x, pos.y]);

  const items = useMemo(() => {
    const isFolder = file?.fileType === "folder";
    const userRole = roleFromPermissions(currentUserPerms);
    const canEdit = ["editor", "admin", "owner"].includes(userRole);
    const canShare = ["admin", "owner"].includes(userRole);
    const isTrashed = file?.trashed === true;

    // If file is in bin, show restore and delete permanently options
    if (isTrashed) {
      return [
        {
          key: "restore",
          label: "Restore",
          onClick: (e) => {
            patchFile(file?.id, { trashed: false }).then(() => {
              onRefresh?.();
            });
          }
        },
        { key: "sep-1", type: "separator" },
        {
          key: "delete",
          label: "Delete Permanently",
          danger: true,
          onClick: (e) => {
                                    e.stopPropagation();
            // Call the modal open immediately - the menu will close via handleItemClick
            openDeleteConfirmRef.current?.();
          }
        },
      ];
    }

    return [
      {
        key: "download",
        label: "Download",
        disabled: isFolder,
        onClick: (e) => downloadFile(file?.id),
      },
      {
        key: "rename",
        label: "Rename",
        disabled: !canEdit,
        onClick: (e) => {
          e.stopPropagation();
          openRenameModalRef.current?.();
        },
      },
      {
        key: "share",
        label: "Share",
        disabled: !canShare,
        onClick: (e) => openShareModalRef.current?.(),
      },
      { key: "sep-1", type: "separator" },
      {
        key: "description",
        label: "Description",
        rightArrow: true,
        disabled: !canEdit,
      },
      { key: "sep-2", type: "separator" },
      {
        key: "move",
        label: "Move to folder",
        disabled: !canEdit,
        onClick: (e) => {
          e.stopPropagation();
          openMoveModalRef.current?.();
        },
      },
      {
        key: "bin",
        label: "Move to bin",
        danger: true,
        disabled: !canEdit,
        onClick: (e) => {
          patchFile(file?.id, { trashed: true }).then(() => {
            onRefresh?.();
          });
        }
      },
    ];
  }, [file, onRefresh, currentUserPerms]);

  const handleItemClick = (item, e) => {
    if (item.disabled) return;
    e.preventDefault();
    e.stopPropagation();
    setModalOpening(true);
    setTimeout(() => setModalOpening(false), 100);
    item.onClick?.(e);
    close();
  };

  const row = Children.only(children);

  const enhancedRow = cloneElement(row, {
    onContextMenu,
    onClick,
    className: [row.props.className, open ? "file-actions__row-open" : ""]
      .filter(Boolean)
      .join(" "),
  });

  const openDescPanel = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pad = 8;
    const panelWidth = 280;
    const panelHeight = 140;

    let x = rect.right + pad;
    let y = rect.top;

    if (x + panelWidth + pad > window.innerWidth) {
      x = rect.left - panelWidth - pad;
    }

    y = Math.max(pad, Math.min(y, window.innerHeight - panelHeight - pad));

    setDescPos({ x, y });
    setHoverKey("description");
  };

  const closeDescPanel = () => setHoverKey(null);

  const menuPortal = open
    ? createPortal(
        <>
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

              const isDesc = item.key === "description";

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
                  onClick={(e) => handleItemClick(item, e)}
                  role="menuitem"
                  disabled={item.disabled}
                  onMouseEnter={(e) => {
                    if (isDesc) openDescPanel(e);
                    else setHoverKey(null);
                  }}
                  onMouseLeave={() => {
                    if (!isDesc) return;
                  }}
                >
                  <span className="file-actions__label">{item.label}</span>

                  <span className="file-actions__right">
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

          {hoverKey === "description" && (
            <div
              className="file-actions__desc"
              style={{ left: descPos.x, top: descPos.y }}
              onMouseEnter={() => setHoverKey("description")}
              onMouseLeave={closeDescPanel}
              role="note"
            >
              <div className="file-actions__desc-title">Description</div>
              <div className="file-actions__desc-body">
                {file?.description?.trim()
                  ? file.description
                  : "No description"}
              </div>
            </div>
          )}
        </>,
        document.body
      )
    : null;

  return (
    <>
      <GetText
        title="Rename"
        placeholder="New name"
        submitLabel="Rename"
        onSubmit={async (newName) => {
          await renameFile(file?.id, newName);
          onRefresh?.();
        }}
      >
        {(openRename) => {
          openRenameModalRef.current = openRename;
          return null;
        }}
      </GetText>

      <ShareDialog file={file} onRefresh={onRefresh}>
        {(openShare) => {
          openShareModalRef.current = openShare;
          return null;
        }}
      </ShareDialog>

      <MoveFile
        file={file}
        onSubmit={async (destinationFolderId) => {
          await patchFile(file?.id, { parent: destinationFolderId });
          onRefresh?.();
        }}
      >
        {(openMove) => {
          openMoveModalRef.current = openMove;
          return null;
        }}
      </MoveFile>

      <ConfirmDialog
        title="Delete Permanently?"
        message="Are you sure you want to permanently delete this file? This cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        isDangerous={true}
        onConfirm={async () => {
                    try {
            const res = await fetch(`${process.env.API_BASE_URL || "http://localhost:3300"}/api/files/${file?.id}`, {
              method: "DELETE",
              headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            
            if (!res.ok) {
              const text = await res.text();
              console.error("Failed to delete file:", text);
              alert(`Failed to delete file: ${text}`);
              return;
            }
            
                        onRefresh?.();
          } catch (err) {
            console.error("Error deleting file:", err);
            alert(`Error deleting file: ${err.message}`);
          }
        }}
      >
        {(openDeleteConfirm) => {
                    openDeleteConfirmRef.current = openDeleteConfirm;
          return null;
        }}
      </ConfirmDialog>

      {enhancedRow}
      {menuPortal}
    </>
  );
}
