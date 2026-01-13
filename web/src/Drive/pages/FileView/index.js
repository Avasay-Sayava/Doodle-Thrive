import "../style.css";
import FileRow from "../../components/storage/FileRow";
import Filter from "../../components/storage/Filter";
import ActionsMenu from "../../components/storage/New/ActionsMenu";
import { useEffect, useState } from "react";

/**
 * Returns a file view component.
 * @param {{ allFiles: Array }} param0 
 * @returns {JSX.Element} The FileView component.
 */ 
function FileView({ 
  allFiles = [], 
  onRefresh, 
  sortBy = "name", 
  sortDir = "asc", 
  foldersMode = "mixed",
  onSortChange,
  parentId = null,
  canWrite = true
}) {
  const [files, setFiles] = useState([...allFiles]);
  const [menuPosition, setMenuPosition] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    // Replace with latest set to avoid stale rows when search results change
    setFiles(allFiles);
  }, [allFiles, sortBy, sortDir]);

  useEffect(() => {
    const onClick = () => setMenuOpen(false);
    window.addEventListener("click", onClick);
    return () => window.removeEventListener("click", onClick);
  }, []);

  const onRightClick = (e) => {
    e.preventDefault();
    if (menuOpen) setMenuOpen(false);
    setTimeout(() => {
      setMenuOpen(true);
      setMenuPosition({ x: e.pageX, y: e.pageY });
    }, 0);
  }

  return (
      <div onContextMenu={canWrite ? onRightClick : undefined} className="file-view__table-wrapper">
        <ActionsMenu
          isOpen={menuOpen}
          onClose={() => setMenuOpen(false)}
          onCreated={onRefresh}
          folderId={parentId}
          anchorPoint={menuPosition}
        />
        <table className="files-table">
          <thead className="files-thead">
            <tr>
              <th>Name</th>
              <th>Owner</th>
              <th>Last modified</th>
              <th>File size</th>
              <th className="col-actions">
                <Filter 
                  files={files} 
                  setFiles={setFiles} 
                  sortBy={sortBy} 
                  sortDir={sortDir} 
                  foldersMode={foldersMode}
                  onSortChange={onSortChange}
                />
              </th>
            </tr>
          </thead>

          <tbody className="tbody">
            {files.length === 0 ? (
              <tr className="no-files-row">
                <td className="no-files" colSpan="5">
                  No files to display
                </td>
              </tr>
            ) : (
              files.map((file) => (
                <FileRow
                  key={file.id}
                  file={file}
                  onRefresh={onRefresh}
                />
              ))
            )}
          </tbody>
        </table>
        </div>
        );
}

export default FileView;
