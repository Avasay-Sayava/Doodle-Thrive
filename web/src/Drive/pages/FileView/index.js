import "../style.css";
import FileRow from "../../components/storage/FileRow";
import Filter from "../../components/storage/Filter";
import { Children, useEffect, useMemo, useState } from "react";

const API_BASE = process.env.API_BASE_URL;

function isFolder(file) {
  return file.type === "folder";
}

/**
 * Returns a file view component.
 * @param {{ allFiles: Array }} param0 
 * @returns {JSX.Element} The FileView component.
 */
function FileView({ allFiles = [] }) {
  const [files, setFiles] = useState([...mockItems, ...allFiles]);

  useEffect(() => {
    setFiles([...mockItems, ...allFiles]);
  }, [allFiles]);

  return (
      <div className="file-view__table-wrapper">
        <table className="files-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Owner</th>
              <th>Last modified</th>
              <th>File size</th>
              <th className="col-actions">
                <Filter files={files} setFiles={setFiles} />
              </th>
            </tr>
          </thead>

          <tbody>
            {files.map((file) => (
              <FileRow key={file.id ?? file.name} file={file} />
            ))}
          </tbody>
        </table>
      </div>
  );
}

const mockItems = [
  {
    id: "__folder__1",
    name: "Docs",
    owner: "me",
    lastModified: "2025-06-14",
    created: "2025-05-10",
    size: "-",
    parent: null,
    children: [],
    type: "folder",
    trashed: false,
  },
  {
    id: "__folder__2",
    name: "School",
    owner: "me",
    lastModified: "2025-05-23",
    created: "2025-05-01",
    size: "-",
    parent: null,
    children: [],
    type: "folder",
    trashed: false,
  },
  {
    id: "__folder__3",
    name: "STARTERIM",
    owner: "me",
    lastModified: "2025-09-01",
    created: "2025-08-15",
    size: "-",
    parent: null,
    children: [],
    type: "folder",
    trashed: false,
  },

  {
    id: "__file__1",
    name: "Document1.txt",
    owner: "me",
    lastModified: "2025-06-10",
    created: "2025-05-20",
    size: "15 KB",
    parent: null,
    children: [],
    type: "file",
    trashed: false,
  },
  {
    id: "__file__2",
    name: "Photo.png",
    owner: "me",
    lastModified: "2025-06-12",
    created: "2025-06-01",
    size: "2 MB",
    parent: null,
    children: [],
    type: "file",
    trashed: false,
  },
];


export default FileView;
