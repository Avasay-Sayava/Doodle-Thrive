import "../style.css";
import FileRow from "../../components/storage/FileRow";
import Filter from "../../components/storage/Filter";
import { useEffect, useMemo, useState } from "react";

const API_BASE = "http://localhost:5000";

function isFolder(file) {
  if (typeof file?.isFolder === "boolean") return file.isFolder;
  if (typeof file?.type === "string") return file.type.toLowerCase() === "folder";
  const s = String(file?.size ?? "").trim();
  return s === "" || s === "-" || s === "0 B" || s === "0B";
}

function toTimestamp(v) {
  if (!v) return 0;
  const t = new Date(v).getTime();
  return Number.isFinite(t) ? t : 0;
}

function sortComparator(sortBy) {
  switch (sortBy) {
    case "name-asc":
      return (a, b) => String(a.name ?? "").localeCompare(String(b.name ?? ""));
    case "name-desc":
      return (a, b) => String(b.name ?? "").localeCompare(String(a.name ?? ""));
    case "date-newest":
      return (a, b) => toTimestamp(b.lastModified) - toTimestamp(a.lastModified);
    case "date-oldest":
      return (a, b) => toTimestamp(a.lastModified) - toTimestamp(b.lastModified);
    default:
      return () => 0;
  }
}

function applySort(files, sortBy, folderPosition) {
  const cmp = sortComparator(sortBy);
  const arr = [...files];

  if (folderPosition === "folders-first") {
    const folders = arr.filter(isFolder).sort(cmp);
    const regular = arr.filter((f) => !isFolder(f)).sort(cmp);
    return [...folders, ...regular];
  }

  return arr.sort(cmp);
}

function getRecentScore(file) {
  return (
    toTimestamp(file?.openedByMeAt) ||
    toTimestamp(file?.lastOpened) ||
    toTimestamp(file?.lastViewed) ||
    toTimestamp(file?.lastModified)
  );
}

export default function RecentView({ user }) {
  const [files, setFiles] = useState([]);
  const [error, setError] = useState("");
  const [sortBy, setSortBy] = useState("date-newest");
  const [folderPosition, setFolderPosition] = useState("folders-first");

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
        setFiles(allFiles);
      } catch (err) {
        setError(err?.message || "Failed to load files");
      }
    };

    run();
  }, []);

  const visibleFiles = useMemo(() => {

    const scored = [...files].sort((a, b) => getRecentScore(b) - getRecentScore(a));
    const recentTop = scored.slice(0, 50); 
    return applySort(recentTop, sortBy, folderPosition);
  }, [files, sortBy, folderPosition]);

  return (
    <div className="file-view">
      <div className="file-view__header">
        <h1>Recent</h1>
      </div>

      <div className="file-view__table-wrapper">
        {error ? (
          <div className="file-view__error">{error}</div>
        ) : (
          <table className="files-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Owner</th>
                <th>Last modified</th>
                <th>File size</th>
                <th className="sort-header">
                  <Filter
                    sortBy={sortBy}
                    setSortBy={setSortBy}
                    folderPosition={folderPosition}
                    setFolderPosition={setFolderPosition}
                  />
                </th>
              </tr>
            </thead>
            <tbody>
              {visibleFiles.map((file) => (
                <FileRow key={file.id ?? file.name} file={file} user={user} />
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
