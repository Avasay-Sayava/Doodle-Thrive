import "../style.css";
import FileView from "../FileView";
import { useEffect, useMemo, useState } from "react";

const API_BASE = process.env.REACT_APP_API_BASE_URL;

function StarredView({ user }) {
  
  const [files, setFiles] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const run = async () => {
      try {
        setError("");

        const jwt = localStorage.getItem("token");
        if (!jwt) throw new Error("Not authenticated");

        const starred = user.starred || [];
        setFiles(starred);
      } catch (err) {
        setError(err?.message || "Failed to load files");
      }
    };

    run();
  }, []);
  return (
    
    <div className="file-view">
      <div className="file-view__header">
        <h1>Starred</h1>
      </div>

      {error && <div className="error-message">{error}</div>}
      <FileView allFiles={files} />
    </div>
  );
}

export default StarredView;
