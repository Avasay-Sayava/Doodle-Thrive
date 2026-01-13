import "../style.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import FileView from "../FileView";
import useUserId from "../../utils/useUserId";
import getUser from "../../utils/getUser";
import { sortFiles } from "../../utils/sortFiles";
import IconShared from "../../components/icons/IconShared";

const API_BASE = process.env.API_BASE_URL || "http://localhost:3300";

function SharedView({ refreshKey, onRefresh }) {
  const navigate = useNavigate();
  const id = useUserId();
  const [files, setFiles] = useState([]);
  const [error, setError] = useState("");

  const [sortBy, setSortBy] = useState("name");
  const [sortDir, setSortDir] = useState("asc");
  const [foldersMode, setFoldersMode] = useState("folders-first");

  const handleSortChange = ({ sortBy: newSortBy, sortDir: newSortDir, foldersMode: newFoldersMode }) => {
    setSortBy(newSortBy);
    setSortDir(newSortDir);
    setFoldersMode(newFoldersMode);
  };

  useEffect(() => {
    // Wait for user ID to be available before fetching files
    if (!id) return;

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
        const sharedFiles = allFiles.filter((f) => f.owner !== id);

        for (let i = 0; i < sharedFiles.length; i++) {
          sharedFiles[i].ownerUsername = await getUser(sharedFiles[i].owner);
        }

        setFiles(sharedFiles);
      } catch (err) {
        setError(err?.message || "Failed to load files");
      }
    })();
  }, [navigate, refreshKey, id]);

  return (
    <div className="file-view">
      <div className="file-view-header">
          <h1 className="view-title">
            <IconShared
              className="view-title-icon"
              width={24}
              height={24}
              aria-hidden="true"
              style={{ color: "var(--color-text-primary)" }}
            />
            <span className="view-title-text">Shared with me</span>
          </h1>
      </div>

      {error && <div className="error-message">{error}</div>}
      <FileView 
        allFiles={sortFiles(files, sortBy, sortDir, foldersMode)} 
        onRefresh={onRefresh}
        sortBy={sortBy}
        sortDir={sortDir}
        foldersMode={foldersMode}
        onSortChange={handleSortChange}
      />
    </div>
  );

}

export default SharedView;