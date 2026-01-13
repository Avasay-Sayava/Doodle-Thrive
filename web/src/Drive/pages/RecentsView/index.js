import "../style.css";
import FileView from "../FileView";
import { useEffect, useState } from "react";
import getUser from "../../utils/getUser";
import { useNavigate } from "react-router-dom";
import { sortFiles } from "../../utils/sortFiles";
import IconRecent from "../../components/icons/IconRecent";

const API_BASE = process.env.API_BASE_URL || "http://localhost:3300";

function RecentsView({ refreshKey, onRefresh }) {
  const [files, setFiles] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const [sortBy, setSortBy] = useState("modified");
  const [sortDir, setSortDir] = useState("asc");
  const [foldersMode, setFoldersMode] = useState("mixed");

  const handleSortChange = ({
    sortBy: newSortBy,
    sortDir: newSortDir,
    foldersMode: newFoldersMode,
  }) => {
    setSortBy(newSortBy);
    setSortDir(newSortDir);
    setFoldersMode(newFoldersMode);
  };

  useEffect(() => {
    (async () => {
      try {
        setError("");

        const jwt = localStorage.getItem("token");
        if (!jwt) {
          localStorage.removeItem("token");
          navigate("/signin", { replace: true });
          return;
        }

        const res = await fetch(`${API_BASE}/api/files`, {
          method: "GET",
          headers: { Authorization: `Bearer ${jwt}` },
        });

        if (!res.ok) {
          if (res.status === 401) {
            localStorage.removeItem("token");
            navigate("/signin", { replace: true });
            return;
          }
          const txt = await res.text();
          throw new Error(`Get files failed (HTTP ${res.status}): ${txt}`);
        }

        const filesObj = await res.json();
        const allFiles = (
          Array.isArray(filesObj) ? filesObj : Object.values(filesObj)
        ).filter((f) => f.trashed !== true);

        for (let i = 0; i < allFiles.length; i++) {
          allFiles[i].ownerUsername = await getUser(allFiles[i].owner);
        }

        setFiles(
          sortFiles(allFiles, sortBy, sortDir, foldersMode).slice(0, 30),
        );
        handleSortChange({ sortBy, sortDir, foldersMode });
      } catch (err) {
        setError(err?.message || "Failed to load files");
      }
    })();
  }, [foldersMode, navigate, refreshKey, sortBy, sortDir]);

  return (
    <div className="file-view">
      <div className="file-view-header">
        <h1 className="view-title">
          <IconRecent
            className="view-title-icon"
            width={24}
            height={24}
            aria-hidden="true"
          />
          <span className="view-title-text">Recents</span>
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

export default RecentsView;
