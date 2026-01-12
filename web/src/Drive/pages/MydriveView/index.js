import "../style.css";
import FileView from "../FileView";
import { useEffect, useState } from "react";
import getUser from "../../utils/getUser";
import { useNavigate } from "react-router-dom";
import New from "../../components/storage/New";
import useUserId from "../../utils/useUserId";

const API_BASE = process.env.API_BASE_URL || "http://localhost:3300";

function MydriveView({ refreshKey, onRefresh}) {
  const [files, setFiles] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const id = useUserId();

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
        const allFiles = (Array.isArray(filesObj) ? filesObj : Object.values(filesObj)).filter((f) => f.trashed !== true);
        const rootFiles = allFiles.filter((f) => f.parent == null && f.owner === id);

        for (let i = 0; i < rootFiles.length; i++) {
          rootFiles[i].ownerUsername = await getUser(rootFiles[i].owner);
        }

        setFiles(rootFiles);
      } catch (err) {
        setError(err?.message || "Failed to load files");
      }
    };

    run();
  }, [navigate, refreshKey, id]);

  return (
    <div className="file-view">
      <div className="file-view__header">
        <New hidden={true}/>
        <div className="file-view__header">
          <h1 className="view-title">
            <svg
              className="view-title__icon"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                fill="currentColor"
                d="M6 2h8l4 6v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Zm8 2H6v16h10V9h-3V4Z"
              />
            </svg>
            <span className="view-title__text">My Drive</span>
          </h1>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}
      <FileView allFiles={files} onRefresh={onRefresh} />
    </div>
  );
}

export default MydriveView;
