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
  const { currentUserPerms, loadShared } = useFilePermissions(
    folderId,
    currentUserId,
  );

  const canWrite = !folderId || (currentUserPerms?.content?.write ?? false);

  useEffect(() => {
    onPermissionsLoad?.(canWrite);
  }, [canWrite, onPermissionsLoad]);

  useEffect(() => {
    if (folderId && currentUserId) {
      loadShared();
    }
  }, [folderId, currentUserId, loadShared]);

  const goRoot = useCallback(
    () => navigate(`/drive/mydrive`, { replace: true }),
    [navigate],
  );
  const goShared = useCallback(
    () => navigate(`/drive/shared`, { replace: true }),
    [navigate],
  );

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

  const isShared =
    currentUserId &&
    path.length > 0 &&
    path[path.length - 1].owner !== currentUserId;

  const showEllipsis = path.length > 3;
  const displayPath = showEllipsis
    ? [path[path.length - 2], path[path.length - 1]]
    : path;

  return (
    <span className="folder-path" ref={menuRef}>
      <div className="folder-path-group">
        {isShared ? (
          <>
            <IconShared
              className="folder-path-icon-shared"
              width={24}
              height={24}
              aria-hidden="true"
            />
            <button onClick={goShared} className="folder-button">
              Shared with me
            </button>
          </>
        ) : (
          <>
            <IconFile width={24} height={24} aria-hidden="true" />
            <button onClick={goRoot} className="folder-button">
              My Drive
            </button>
          </>
        )}
        {!folderId && canWrite && (
          <button
            onClick={(e) => {
              const pos = {
                x: e.currentTarget.getBoundingClientRect().left,
                y: e.currentTarget.getBoundingClientRect().bottom,
              };
              setMenuOpen(!menuOpen);
              setMenuPosition(pos);
            }}
            className="folder-path-create-btn"
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
        <span className="folder-path-separator">
          <span className="folder-path-sep-text">&gt;</span>
          <span className="folder-path-sep-text">...</span>
        </span>
      )}
      {displayPath.map((folder, idx) => {
        const isLast = idx === displayPath.length - 1;
        return (
          <span key={folder.id} className="folder-path-separator">
            <span className="folder-path-sep-text">&gt;</span>
            {isLast ? (
              <div className="folder-path-group">
                <button
                  onClick={() =>
                    navigate(`/drive/folders/${folder.id}`, { replace: true })
                  }
                  className="folder-button"
                >
                  {folder.name}
                </button>
                {canWrite && (
                  <button
                    onClick={(e) => {
                      setMenuOpen(!menuOpen);
                      setMenuPosition({
                        x: e.currentTarget.getBoundingClientRect().left,
                        y: e.currentTarget.getBoundingClientRect().bottom,
                      });
                    }}
                    className="folder-path-create-btn"
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
              <button
                onClick={() =>
                  navigate(`/drive/folders/${folder.id}`, { replace: true })
                }
                className="folder-button"
              >
                {folder.name}
              </button>
            )}
          </span>
        );
      })}
    </span>
  );
}
