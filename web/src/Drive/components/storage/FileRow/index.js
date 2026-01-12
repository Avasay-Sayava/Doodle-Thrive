import "./style.css";
import { useState, useEffect } from "react";
import FileSelect from "../FileSelect";
import FileActions from "../FileActions";
import RelativeDate from "../../Date";
import IconFolder from "../../icons/IconFolder";
import IconFile from "../../icons/IconFile";
import EditFile from "../../../modals/EditFile";
import { useNavigate } from "react-router-dom";

function getSize({ type, content }) {
  if (type === "folder") return "-";
  let bytes = content?.length || 0;
  if (bytes < 1024) return bytes + " B";
  let kb = bytes / 1024;
  if (kb < 1024) return kb.toFixed(2) + " KB";
  let mb = kb / 1024;
  if (mb < 1024) return mb.toFixed(2) + " MB";
  let gb = mb / 1024;
  return gb.toFixed(2) + " GB";
}

function FileRow({ file, onRefresh }) {
  const navigate = useNavigate();
  const [localFile, setLocalFile] = useState(file);

  // Update local file when prop changes
  useEffect(() => {
    setLocalFile(file);
  }, [file]);

  const { name, modified, content, ownerUsername, type } = localFile;

  const handleFileClick = (e, openEditModal) => {
    if (type === "file") {
      openEditModal();
    }
    else if (type === "folder") {
      navigate(`/drive/folders/${localFile.id}`, { replace: true });
    }
  };

  const handleSave = (updatedData) => {
    // Update local file immediately with new content, size, and modified date
    setLocalFile(prev => ({
      ...prev,
      content: updatedData.content,
      modified: updatedData.modified
    }));
    
    // Still call parent refresh if needed
    onRefresh?.();
  };

  return (
    <EditFile file={localFile} onSave={handleSave}>
      {(openEditModal) => (
        <FileActions
          file={localFile}
          onRefresh={onRefresh}
          onLeftClick={(e) => handleFileClick(e, openEditModal)}
        >
          <tr className="file-row">
            <td className="col-name">
              <span className="file-icon" aria-hidden="true">
                {type === "folder" ? <IconFolder /> : <IconFile />}
              </span>
              {name}
            </td>
            <td className="col-owner">{ownerUsername}</td>
            <td className="col-modified">
              <RelativeDate timestamp={modified} />
            </td>
            <td className="col-size">{getSize({ type, content })}</td>
            <td className="col-actions">
              <FileSelect file={localFile} onRefresh={onRefresh} />
            </td>
          </tr>
        </FileActions>
      )}
    </EditFile>
  );
}

export default FileRow;
