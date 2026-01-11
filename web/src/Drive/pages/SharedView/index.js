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
        <h1>Shared with me</h1>
      </div>

      {error && <div className="error-message">{error}</div>}
      <FileView allFiles={files} onRefresh={onRefresh} />
    </div>
  );

}

export default SharedView;