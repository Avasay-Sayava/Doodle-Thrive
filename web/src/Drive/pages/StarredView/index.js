import "../style.css";
import FileView from "../FileView";
import { useEffect, useState } from "react";
import getUser from "../../utils/getUser";
import { useNavigate } from "react-router-dom";
import IconStar from "../../components/icons/IconStar";
import { sortFiles } from "../../utils/sortFiles";

const API_BASE = process.env.API_BASE_URL || "http://localhost:3300";

function StarredView({ refreshKey, onRefresh }) {
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [error, setError] = useState("");

  const [sortBy, setSortBy] = useState("name");
  const [sortDir, setSortDir] = useState("asc");
  const [foldersMode, setFoldersMode] = useState("folders-first");

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
        const starred = allFiles.filter((f) => f.starred === true);
        for (let i = 0; i < starred.length; i++) {
          starred[i].ownerUsername = await getUser(starred[i].owner);
        }

        setFiles(sortFiles(starred, sortBy, sortDir, foldersMode));
        handleSortChange({ sortBy, sortDir, foldersMode });
      } catch (err) {
        setError(err?.message || "Failed to load files");
      }
    })();
  }, [navigate, refreshKey, sortBy, sortDir, foldersMode]);

  return (
    <div className="file-view">
      <div className="file-view-header">
        <h1 className="view-title">
          <IconStar
            className="view-title-icon"
            width={24}
            height={24}
            aria-hidden="true"
            style={{ color: "var(--color-icon-starred)" }}
          />
          <span className="view-title-text">Starred</span>
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

export default StarredView;
