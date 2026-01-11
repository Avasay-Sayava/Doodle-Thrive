import "../style.css";
import FileView from "../FileView";
import { useEffect, useMemo, useState } from "react";
import getUser from "../../utils/getUser";
import { useNavigate } from "react-router-dom";

const API_BASE = process.env.API_BASE_URL || "http://localhost:3300";


function StarredView({ refreshKey, onRefresh}) {
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [error, setError] = useState("");

  const id = localStorage.getItem("id");

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
        
        const allfiles = Array.isArray(filesObj) ? filesObj : Object.values(filesObj);
        const starred = allfiles.filter((f) => f.starred === true);
        for (let i = 0; i < starred.length; i++) {
          starred[i].ownerUsername = await getUserstarred[i].owner);
        }

        setFiles(starred);
      } catch (err) {
        setError(err?.message || "Failed to load files");
      }
    };

    run();
  }, [refreshKey]);
  return (

    <div className="file-view">
      <div className="file-view__header">
        <h1>Starred</h1>
      </div>

      {error && <div className="error-message">{error}</div>}
      <FileView allFiles={files} onRefresh={onRefresh} />
    </div>
  );
}

export default StarredView;
