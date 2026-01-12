import "../style.css";
import FileView from "../FileView";
import { useEffect, useState } from "react";
import getUser from "../../utils/getUser";
import { useNavigate } from "react-router-dom";
import New from "../../components/storage/New";
import useUserId from "../../utils/useUserId";
import { sortFiles } from "../../utils/sortFiles";
import IconFile from "../../components/icons/IconFile";

const API_BASE = process.env.API_BASE_URL || "http://localhost:3300";

function MydriveView({ refreshKey, onRefresh}) {
  const [files, setFiles] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const id = useUserId();

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
          navigate("/signin", { replace: true });
          return;
        }

        const res = await fetch(`${API_BASE}/api/files`, {
          method: "GET",
          headers: { Authorization: `Bearer ${jwt}` },
        });

        if (!res.ok) {
          if(res.status === 401){
            localStorage.removeItem("token");
            navigate("/signin", { replace: true });
            return;
          }
          const txt = await res.text();
          throw new Error(`Get files failed (HTTP ${res.status}): ${txt}`);
        }

        const filesObj = await res.json();
        const allFiles = (Array.isArray(filesObj) ? filesObj : Object.values(filesObj)).filter((f) => f.trashed !== true);
        const rootFiles = allFiles.filter((f) => f.parent == null && f.owner === id);

        for (let i = 0; i < rootFiles.length; i++) {
          rootFiles[i].ownerUsername = await getUser(rootFiles[i].owner);
        }

        setFiles(sortFiles(rootFiles, sortBy, sortDir, foldersMode));
        handleSortChange({ sortBy, sortDir, foldersMode });
      } catch (err) {
        setError(err?.message || "Failed to load files");
      }
    })();
  }, [navigate, refreshKey, id, sortBy, sortDir, foldersMode]);

  return (
    <div className="file-view">
      <div className="file-view__header">
        <New hidden={true}/>
        <div className="file-view__header">
          <h1 className="view-title">
            <IconFile className="view-title__icon" width={24} height={24} aria-hidden="true" />
            <span className="view-title__text">My Drive</span>
          </h1>
        </div>
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
    </div>
  );
}

export default MydriveView;
