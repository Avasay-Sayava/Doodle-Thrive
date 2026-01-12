import "../style.css";
import FileRow from "../../components/storage/FileRow";
import Filter from "../../components/storage/Filter";
import { useEffect, useState } from "react";

/**
 * Returns a file view component.
 * @param {{ allFiles: Array }} param0 
 * @returns {JSX.Element} The FileView component.
 */
function FileView({ allFiles = [], onRefresh, sortBy = "name", sortDir = "asc" }) {
  const [files, setFiles] = useState([...allFiles]);

  useEffect(() => {
    setFiles([...allFiles]);
  }, [allFiles]);

  return (
      <div className="file-view__table-wrapper">
        <table className="files-table">
          <thead className="files-thead">
            <tr>
              <th>Name</th>
              <th>Owner</th>
              <th>Last modified</th>
              <th>File size</th>
              <th className="col-actions">
                <Filter files={files} setFiles={setFiles} sortBy={sortBy} sortDir={sortDir} />
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
