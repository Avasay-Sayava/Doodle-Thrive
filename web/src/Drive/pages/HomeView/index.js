import "../style.css";
import FileView from "../FileView";
import { useEffect, useState } from "react";
import getUser from "../../utils/getUser";
import { useNavigate } from "react-router-dom";
import { sortFiles } from "../../utils/sortFiles";
import IconHome from "../../components/icons/IconHome";

const API_BASE = process.env.API_BASE_URL || "http://localhost:3300";

function HomeView({ refreshKey, onRefresh}) {
  const [files, setFiles] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const [sortBy, setSortBy] = useState("modified");
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
        const rootFiles = allFiles.filter((f) => f.parent == null);

        for (let i = 0; i < rootFiles.length; i++) {
          rootFiles[i].ownerUsername = await getUser(rootFiles[i].owner);
        }

        setFiles(sortFiles(rootFiles, sortBy, sortDir, foldersMode));
        handleSortChange({ sortBy, sortDir, foldersMode });
      } catch (err) {
        setError(err?.message || "Failed to load files");
      }
    })();
  }, [foldersMode, navigate, refreshKey, sortBy, sortDir]);

  return (
    <div className="file-view">
      <div className="file-view__header">
        <h1 className="view-title">
          <IconHome className="view-title__icon" width={24} height={24} aria-hidden="true" />
          <span className="view-title__text">Home</span>
        </h1>
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

export default HomeView;
