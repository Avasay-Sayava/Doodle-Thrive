import "../style.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import FileView from "../FileView";

const API_BASE = process.env.API_BASE_URL || "http://localhost:3300";

function SharedView({ refreshKey, onRefresh }) {
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const run = async () => {
      try {
        setError("");
        
        const id = localStorage.getItem("id");
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
        const sharedFiles = allFiles.filter((f) => f.owner !== id);
        setFiles(sharedFiles);
      } catch (err) {
        setError(err?.message || "Failed to load files");
      }
    };

    run();
  }, [navigate, refreshKey]);

  return (
    <div className="file-view">
      <div className="file-view__header">
        <div className="file-view__header">
          <h1>
          <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="currentColor"
              d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7a2.5 2.5 0 0 0 0-1.39l7.02-4.11A2.99 2.99 0 1 0 14 5a2.5 2.5 0 0 0 .04.39L7.02 9.5a3 3 0 1 0 0 5l7.02 4.11c-.03.12-.04.25-.04.39a3 3 0 1 0 3-2.92Z"
            />
          </svg>
          <span className="mydrive-title__text">Shared with me</span>
          </h1>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}
      <FileView allFiles={files} onRefresh={onRefresh} />
    </div>
  );

}

export default SharedView;