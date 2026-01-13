import "../style.css";
import FileView from "../FileView";
import { useEffect, useState, useRef } from "react";
import getUser from "../../utils/getUser";
import { useNavigate } from "react-router-dom";
import { sortFiles } from "../../utils/sortFiles";
import IconBin from "../../components/icons/IconBin";
import ConfirmDialog from "../../modals/ConfirmDialog";

const API_BASE = process.env.API_BASE_URL || "http://localhost:3300";

function BinView({ refreshKey, onRefresh}) {
  const [files, setFiles] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const openEmptyTrashConfirmRef = useRef(null);

  const [sortBy, setSortBy] = useState("name");
  const [sortDir, setSortDir] = useState("asc");
  const [foldersMode, setFoldersMode] = useState("folders-first");

  const handleSortChange = ({ sortBy: newSortBy, sortDir: newSortDir, foldersMode: newFoldersMode }) => {
    setSortBy(newSortBy);
    setSortDir(newSortDir);
    setFoldersMode(newFoldersMode);
  };

  useEffect(() => { 
    (async () => {
      try {
        setError("");

        const jwt = localStorage.getItem("token");
        if (!jwt){
          localStorage.removeItem("token");
          navigate("/signin", { replace: true });
          return;
        }

        const res = await fetch(`${API_BASE}/api/files`, {
          method: "GET",
          headers: { Authorization: `Bearer ${jwt}` },
        });

        if (!res.ok) {
          if(res.status === 401) {
            localStorage.removeItem("token");
            navigate("/signin", { replace: true });
            return;
          }
          const txt = await res.text();
          throw new Error(`Get files failed (HTTP ${res.status}): ${txt}`);
        }

        const filesObj = await res.json();
        const allFiles = Array.isArray(filesObj) ? filesObj : Object.values(filesObj);
        // Only show files that are trashed but whose parent is NOT trashed
        const binFiles = allFiles.filter((f) => {
          if (f.trashed !== true) return false;
          // If file has no parent (root level), show it
          if (!f.parent) return true;
          // Check if parent is also trashed
          const parent = allFiles.find(p => p.id === f.parent);
          return !parent || parent.trashed !== true;
        });

        for (let i = 0; i < binFiles.length; i++) {
          binFiles[i].ownerUsername = await getUser(binFiles[i].owner);
        }

        setFiles(sortFiles(binFiles, sortBy, sortDir, foldersMode));
        handleSortChange({ sortBy, sortDir, foldersMode });
      } catch (err) {
        setError(err?.message || "Failed to load files");
      }
    })();
  }, [foldersMode, navigate, refreshKey, sortBy, sortDir]);

  const handleEmptyTrash = async () => {
    try {
      const jwt = localStorage.getItem("token");
      
      // Delete all trashed files
      for (const file of files) {
        const res = await fetch(`${API_BASE}/api/files/${file.id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${jwt}` },
        });
        
        if (!res.ok) {
          const text = await res.text();
          console.error(`Failed to delete file ${file.id}:`, text);
        }
      }

      onRefresh?.();
    } catch (err) {
      console.error("Error emptying trash:", err);
      setError("Failed to empty trash: " + (err?.message || "Unknown error"));
    }
  };

  return (
    <div className="file-view">
      <div className="file-view__header">
        <h1 className="view-title">
          <IconBin className="view-title__icon" width={24} height={24} aria-hidden="true" />
          <span className="view-title__text">Bin</span>
        </h1>
        {files.length > 0 && (
          <button 
            className="btn-empty-trash"
            onClick={() => openEmptyTrashConfirmRef.current?.()}
            title="Empty trash"
          >
            Empty Trash
          </button>
        )}
      </div>

      {error && <div className="error-message">{error}</div>}
      <FileView 
        allFiles={files} 
        onRefresh={onRefresh}
        sortBy={sortBy}
        sortDir={sortDir}
        foldersMode={foldersMode}
        onSortChange={handleSortChange}
      />

      <ConfirmDialog
        title="Empty Trash?"
        message="Are you sure you want to empty the entire trash? All files will be permanently deleted. This cannot be undone."
        confirmLabel="Empty Trash"
        cancelLabel="Cancel"
        isDangerous={true}
        onConfirm={handleEmptyTrash}
      >
        {(openEmptyTrashConfirm) => {
          openEmptyTrashConfirmRef.current = openEmptyTrashConfirm;
          return null;
        }}
      </ConfirmDialog>
    </div>
  );
}

export default BinView;
