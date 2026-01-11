import "../style.css";
import FileView from "../FileView";
import { useEffect, useMemo, useState } from "react";
import Regex from "../../utils/regex";
import getOwner from "../../utils/getOwner";
import { useNavigate } from "react-router-dom";
import New from "../../components/storage/New";

const API_BASE = process.env.REACT_APP_API_BASE_URL || "http://localhost:3300";

function RecentsView({ refreshKey, onRefresh}) {
  const [files, setFiles] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => { 
    const run = async () => {
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
        const allFiles = Array.isArray(filesObj) ? filesObj : Object.values(filesObj);
        const rootFiles = allFiles.filter((f) => f.parent == null);

        for (let i = 0; i < rootFiles.length; i++) {
          rootFiles[i].ownerUsername = await getOwner(rootFiles[i].owner);
        }

        setFiles(rootFiles);
      } catch (err) {
        setError(err?.message || "Failed to load files");
      }
    };

    run();
  }, [refreshKey]);

  return (
    <div className="file-view">
      <div className="file-view__header">
        <div className="file-view__header">
          <h1>
          <span className="mydrive-title__text">Recents</span>
          </h1>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}
      <FileView allFiles={files} onRefresh={onRefresh} sortBy="modified" />
    </div>
  );
}

export default RecentsView;
