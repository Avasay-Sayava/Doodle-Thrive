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
        const allFiles = (Array.isArray(filesObj) ? filesObj : Object.values(filesObj)).filter((f) => f.trashed !== true);
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
          <h1 className="view-title">
            <svg
              className="view-title__icon"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                fill="var(--color-icon-primary)"
                d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3Zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3Zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5C15 14.17 10.33 13 8 13Zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5Z"
              />
            </svg>

            <span className="view-title__text">Shared with me</span>
          </h1>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}
      <FileView allFiles={files} onRefresh={onRefresh} />
    </div>
  );

}

export default SharedView;