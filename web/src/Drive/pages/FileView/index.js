import "../style.css";
import FileRow from "../../components/storage/FileRow";
import Filter from "../../components/storage/Filter";
import { useEffect, useMemo, useState } from "react";

const API_BASE = "http://localhost:5000";

const mockItems = [
  {
    id: "__folder__1",
    name: "Docs",
    owner: "me",
    lastModified: "2025-06-14",
    size: "-",
    parent: null,
    isFolder: true,
    type: "folder",
  },
  {
    id: "__folder__2",
    name: "School",
    owner: "me",
    lastModified: "2025-05-23",
    size: "-",
    parent: null,
    isFolder: true,
    type: "folder",
  },
  {
    id: "__folder__3",
    name: "STARTERIM",
    owner: "me",
    lastModified: "2025-09-01",
    size: "-",
    parent: null,
    isFolder: true,
    type: "folder",
  },

  {
    id: "__file__1",
    name: "Document1.txt",
    owner: "me",
    lastModified: "2025-06-10",
    size: "15 KB",
    parent: null,
    isFolder: false,
    type: "file",
  },
  {
    id: "__file__2",
    name: "Photo.png",
    owner: "me",
    lastModified: "2025-06-12",
    size: "2 MB",
    parent: null,
    isFolder: false,
    type: "file",
  },
];

function isFolder(file) {
  if (typeof file?.isFolder === "boolean") return file.isFolder;
  if (typeof file?.type === "string") return file.type.toLowerCase() === "folder";
  const s = String(file?.size ?? "").trim();
  return s === "" || s === "-" || s === "0 B" || s === "0B";
}

function FileView({ filesObj }) {
  const [files, setFiles] = useState(mockItems);
  const [error, setError] = useState("");
  const [sortBy, setSortBy] = useState("name-asc");
  const [folderPosition, setFolderPosition] = useState("folders-first");

  useEffect(() => {
    const run = async () => {
      try {
        setError("");

        const jwt = localStorage.getItem("token");
        if (!jwt) throw new Error("Not authenticated");

        
        const allFiles = Array.isArray(filesObj) ? filesObj : Object.values(filesObj);
        const rootFiles = allFiles.filter((f) => f.parent == null);
        setFiles([...mockItems, ...rootFiles]);
      } catch (err) {
        setError(err?.message || "Failed to load files");
      }
    };

    run();
  }, []);

  const sortedFiles = useMemo(
    () => applySort(files, sortBy, folderPosition),
    [files, sortBy, folderPosition]
  );

  return (
    <div className="file-view">
      <div className="file-view__header">
        <h1>My Drive</h1>
      </div>

      <div className="file-view__table-wrapper">
        {error && <div className="file-view__error">{error}</div>}

        <table className="files-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Owner</th>
              <th>Last modified</th>
              <th>File size</th>
              <th className="col-actions">
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
            {sortedFiles.map((file) => (
              <FileRow key={file.id ?? file.name} file={file} user={user} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default HomeView;
