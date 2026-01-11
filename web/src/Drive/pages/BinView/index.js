import "../style.css";
import FileView from "../FileView";
import { useEffect, useState } from "react";
import getUser from "../../utils/getUser";
import { useNavigate } from "react-router-dom";

const API_BASE = process.env.API_BASE_URL || "http://localhost:3300";

function BinView({ refreshKey, onRefresh}) {
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
        const binFiles = allFiles.filter((f) => f.trashed === true);

        for (let i = 0; i < binFiles.length; i++) {
          binFiles[i].ownerUsername = await getUser(binFiles[i].owner);
        }

        setFiles(binFiles);
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
          <span className="mydrive-title__text">Bin</span>
          </h1>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}
      <FileView allFiles={files} onRefresh={onRefresh} />
    </div>
  );
}

export default BinView;
