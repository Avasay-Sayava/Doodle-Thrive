import "../style.css";
import FileView from "../FileView";
import { useEffect, useMemo, useState } from "react";

const API_BASE = process.env.REACT_APP_API_BASE_URL;

function HomeView() {
  const [files, setFiles] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const run = async () => {
      try {
        setError("");

        const jwt = localStorage.getItem("token");
        if (!jwt) throw new Error("Not authenticated");

        const res = await fetch(`${API_BASE}/api/files`, {
          method: "GET",
          headers: { Authorization: `Bearer ${jwt}` },
        });

        if (!res.ok) {
          const txt = await res.text();
          throw new Error(`Fetch files failed (HTTP ${res.status}): ${txt}`);
        }

        const filesObj = await res.json();
        const allFiles = Array.isArray(filesObj) ? filesObj : Object.values(filesObj);
        const rootFiles = allFiles.filter((f) => f.parent == null);
        setFiles(rootFiles);
      } catch (err) {
        setError(err?.message || "Failed to load files");
      }
    };

    run();
  }, []);

  return (
    <div className="file-view">
      <div className="file-view__header">
        <h1>My Drive</h1>
      </div>

      {error && <div className="error-message">{error}</div>}
      <FileView allFiles={files} />
    </div>
  );
}

export default HomeView;
