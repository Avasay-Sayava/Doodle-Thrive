import "./style.css";
import { useState, useEffect } from "react";
import FileSelect from "../FileSelect";
import FileActions from "../FileActions";
import RelativeDate from "../../Date";
import IconFolder from "../../icons/IconFolder";
import IconFile from "../../icons/IconFile";
import EditFile from "../../../modals/EditFile";
import ViewImage from "../../../modals/ViewImage";

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

function isImageFile(filename) {
  if (!filename) return false;
  const ext = filename.toLowerCase().split(".").pop();
  return ["jpg", "jpeg", "png", "webp"].includes(ext);
}

function FileRow({ file, onRefresh }) {
  const [localFile, setLocalFile] = useState(file);

  // Update local file when prop changes
  useEffect(() => {
    setLocalFile(file);
  }, [file]);

  const { name, modified, content, ownerUsername, type } = localFile;

  const isImage = isImageFile(name);

  const handleFileClick = (e, openModal) => {
    if (type === "file") {
      openModal();
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
    <>
      {isImage ? (
        <ViewImage file={localFile}>
          {(openViewImage) => (
            <FileActions
              file={localFile}
              onRefresh={onRefresh}
              onLeftClick={(e) => handleFileClick(e, openViewImage)}
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
        </ViewImage>
      ) : (
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
      )}
    </>
  );
}

export default FileRow;
