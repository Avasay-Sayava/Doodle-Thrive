import { Children, cloneElement, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import "./style.css";

import renameFile from "../../../utils/renameFile";
import downloadFile from "../../../utils/downloadFile";
import patchFile from "../../../utils/patchFile";
import GetText from "../../../modals/GetText";
import ShareDialog from "../../../modals/ShareDialog";

export default function FileActions({
    children,
    file,
    onLeftClick = null,
    onRefresh,
    openOnLeftClick = false,
}) {
    const menuRef = useRef(null);

    const openRenameModalRef = useRef(null);
    const openShareModalRef = useRef(null);

    const [hoverKey, setHoverKey] = useState(null);
    const [descPos, setDescPos] = useState({ x: 0, y: 0 });


    const [open, setOpen] = useState(false);
    const [pos, setPos] = useState({ x: 0, y: 0 });

    const close = () => 
    {
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
        if (open) return;

        if (openOnLeftClick) {
        e.preventDefault();
        e.stopPropagation();
        openAt(e.clientX, e.clientY);
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
    }, [open]);

    const items = useMemo(() => {
        const isFolder = file?.fileType === "folder";

        return [
            {
                key: "download",
                label: "Download",
                disabled: isFolder,
                onClick: () => downloadFile(file?.id),
            },
            {
                key: "rename",
                label: "Rename",
                onClick: () => openRenameModalRef.current?.(),
            },
            {
                key: "share",
                label: "Share",
                onClick: () => openShareModalRef.current?.(),
            },
            { key: "sep-1", type: "separator" },
            {
                key: "description",
                label: "Folder description",
                rightArrow: true,
            },
            { key: "sep-2", type: "separator" },
            {
                key: "bin",
                label: "Move to bin",
                danger: true,
                onClick: () => patchFile(file.id, { trashed: true }).then(() => onRefresh?.()),
            },
        ];
    }, [file, onRefresh]);

    const handleItemClick = (item) => {
        if (item.disabled) return;
        item.onClick?.();
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

    const menuPortal =
    open
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
                    onClick={() => handleItemClick(item)}
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
                    {file?.description?.trim() ? file.description : "No description"}
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
                onSubmit={(newName) =>
                    Promise.resolve(renameFile(file?.id, newName)).then(() => onRefresh?.())
                }
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

            {enhancedRow}
            {menuPortal}
        </>
    );
}
