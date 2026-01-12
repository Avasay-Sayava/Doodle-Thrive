import "../style.css";
import FileRow from "../../components/storage/FileRow";
import Filter from "../../components/storage/Filter";
import ActionsMenu from "../../components/storage/New/ActionsMenu";
import GetText from "../../modals/GetText";
import newFile from "../../utils/newFile";
import uploadFile from "../../utils/uploadFile";
import { useEffect, useRef, useState } from "react";

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
  parentId = null
}) {
  const [files, setFiles] = useState([...allFiles]);
  const [menuPosition, setMenuPosition] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    // New files always on top
    setFiles((prevFiles) => {
      const existingIds = new Set(prevFiles.map((f) => f.id));
      const newFiles = allFiles.filter((f) => !existingIds.has(f.id));
      return [ ...newFiles, ...prevFiles];
    });
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
      <div onContextMenu={onRightClick} className="file-view__table-wrapper">
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
