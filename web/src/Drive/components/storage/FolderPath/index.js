import "./style.css";
import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import useUserId from "../../../utils/useUserId";
import useFilePermissions from "../../../utils/useFilePermissions";
import IconFile from "../../icons/IconFile";
import IconShared from "../../icons/IconShared";
import ActionsMenu from "../New/ActionsMenu";

const API_BASE = process.env.API_BASE_URL || "http://localhost:3300";

export default function FolderPath({ folderId, onRefresh, onPermissionsLoad }) {
    const [path, setPath] = useState([]);
    const [menuOpen, setMenuOpen] = useState(false);
    const [menuPosition, setMenuPosition] = useState(null);
    const menuRef = useRef(null);
    const navigate = useNavigate();
    const currentUserId = useUserId();
    const { currentUserPerms } = useFilePermissions(folderId, currentUserId);
    
    // For My Drive (null folderId), always allow write. For folders, check if user is owner or has write permission
    const isOwner = folderId && path.length > 0 ? path[path.length - 1].owner === currentUserId : true;
    const canWrite = !folderId || isOwner || (currentUserPerms?.content?.write ?? false);

    useEffect(() => {
        onPermissionsLoad?.(canWrite);
    }, [canWrite, onPermissionsLoad]);

    const goRoot = useCallback(() => navigate(`/drive/mydrive`, { replace: true }), [navigate]);
    const goShared = useCallback(() => navigate(`/drive/shared`, { replace: true }), [navigate]);

    useEffect(() => {
        const onDown = (e) => {
            if (!menuRef.current?.contains(e.target)) setMenuOpen(false);
        };
        document.addEventListener("mousedown", onDown);
        return () => document.removeEventListener("mousedown", onDown);
    }, []);

    useEffect(() => {
        if (!folderId) {
            setPath([]);
            return;
        }

        (async () => {
            const tempPath = [];
            let currId = folderId;

            while (currId) {
                try {
                    const jwt = localStorage.getItem("token");
                    const res = await fetch(`${API_BASE}/api/files/${currId}`, {
                        method: "GET",
                        headers: { Authorization: `Bearer ${jwt}` },
                    });

                    if (!res.ok) {
                        // If we have a path, keep it; only redirect if we couldn't get the initial folder
                        if (tempPath.length === 0) {
                            goRoot();
                        } else {
                            setPath(tempPath);
                        }
                        return;
                    }

                    const folder = await res.json();
                    tempPath.unshift(folder);
                    currId = folder.parent;
                } catch {
                    // If we have a path, keep it; only redirect if we couldn't get the initial folder
                    if (tempPath.length === 0) {
                        goRoot();
                    } else {
                        setPath(tempPath);
                    }
                    return;
                }
            }
            setPath(tempPath);
        })();
    }, [folderId, goRoot]);

    // Check if the current folder is shared (owned by someone else)
    const isShared = currentUserId && path.length > 0 && path[path.length - 1].owner !== currentUserId;
    
    // Show ellipsis if more than 3 folders
    const showEllipsis = path.length > 3;
    const displayPath = showEllipsis ? [path[path.length - 2], path[path.length - 1]] : path;

    return (
        <span style={{ display: "inline-flex", alignItems: "center", gap: "8px", fontSize: "inherit", fontWeight: "inherit" }} ref={menuRef}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "4px", position: "relative" }}>
                {isShared ? (
                    <>
                        <IconShared width={24} height={24} aria-hidden="true" style={{ color: "var(--color-icon-primary)" }} />
                        <button onClick={goShared} className="folder-button" style={{ fontSize: "inherit", fontWeight: "inherit", color: "inherit" }}>Shared with me</button>
                    </>
                ) : (
                    <>
                        <IconFile width={24} height={24} aria-hidden="true" />
                        <button onClick={goRoot} className="folder-button" style={{ fontSize: "inherit", fontWeight: "inherit", color: "inherit" }}>My Drive</button>
                    </>
                )}
                {!folderId && canWrite && (
                    <button 
                        onClick={(e) => {
                            setMenuOpen(!menuOpen);
                            setMenuPosition({ x: e.currentTarget.getBoundingClientRect().left, y: e.currentTarget.getBoundingClientRect().bottom });
                        }}
                        style={{ fontSize: "inherit", fontWeight: "inherit", color: "inherit", background: "none", border: "none", cursor: "pointer", padding: "0 4px" }}
                        title="Create item in this folder"
                    >
                        +
                    </button>
                )}
                <ActionsMenu
                    isOpen={menuOpen}
                    onClose={() => setMenuOpen(false)}
                    onCreated={onRefresh}
                    folderId={folderId}
                    anchorPoint={menuPosition}
                />
            </div>
            {showEllipsis && (
                <span style={{ display: "contents" }}>
                    <span style={{ fontSize: "inherit", color: "var(--color-text-secondary)", margin: "0 4px" }}>&gt;</span>
                    <span style={{ fontSize: "inherit", color: "var(--color-text-secondary)", display: "flex", alignItems: "center" }}>...</span>
                </span>
            )}
             {displayPath.map((folder, idx) => {
                const isLast = idx === displayPath.length - 1;
                return (
                    <span key={folder.id} style={{ display: "contents" }}>
                        <span style={{ fontSize: "inherit", color: "var(--color-text-secondary)", margin: "0 4px" }}>&gt;</span>
                        {isLast ? (
                            <div style={{ display: "inline-flex", alignItems: "center", gap: "4px", position: "relative" }}>
                                <button onClick={() => navigate(`/drive/folders/${folder.id}`, { replace: true })} className="folder-button" style={{ fontSize: "inherit", fontWeight: "inherit", color: "inherit" }}>
                                    {folder.name}
                                </button>
                                {canWrite && (
                                    <button 
                                        onClick={(e) => {
                                            setMenuOpen(!menuOpen);
                                            setMenuPosition({ x: e.currentTarget.getBoundingClientRect().left, y: e.currentTarget.getBoundingClientRect().bottom });
                                        }}
                                        style={{ fontSize: "inherit", fontWeight: "inherit", color: "inherit", background: "none", border: "none", cursor: "pointer", padding: "0 4px" }}
                                        title="Create item in this folder"
                                    >
                                        +
                                    </button>
                                )}
                                <ActionsMenu
                                    isOpen={menuOpen}
                                    onClose={() => setMenuOpen(false)}
                                    onCreated={onRefresh}
                                    folderId={folder.id}
                                    anchorPoint={menuPosition}
                                />
                            </div>
                        ) : (
                            <button onClick={() => navigate(`/drive/folders/${folder.id}`, { replace: true })} className="folder-button" style={{ fontSize: "inherit", fontWeight: "inherit", color: "inherit" }}>
                                {folder.name}
                            </button>
                        )}
                    </span>
                );
             })}
        </span>
    );
}
