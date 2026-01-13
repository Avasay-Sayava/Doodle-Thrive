import "./style.css";
import { useState, useEffect } from "react";
import FileSelect from "../FileSelect";
import FileActions from "../FileActions";
import RelativeDate from "../../Date";
import IconFolder from "../../icons/IconFolder";
import IconFile from "../../icons/IconFile";
import IconImageFile from "../../icons/IconImageFile";
import IconFileLocked from "../../icons/IconFileLocked";
import EditFile from "../../../modals/EditFile";
import ViewFile from "../../../modals/ViewFile";
import ViewImage from "../../../modals/ViewImage";
import useFilePermissions, { roleFromPermissions } from "../../../utils/useFilePermissions";
import useUserId from "../../../utils/useUserId";
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

function isImageFile(filename) {
  if (!filename) return false;
  const ext = filename.toLowerCase().split(".").pop();
  return ["jpg", "jpeg", "png", "webp"].includes(ext);
}

function getFileIcon(type, name, isTrashed, canEdit) {
  if (type === "file" && isImageFile(name)) {
    return <IconImageFile />;
  }

  if (type === "file" && !canEdit) {
    return <IconFileLocked />;
  }

  return type === "folder" ? <IconFolder /> : <IconFile />;
}

function FileRow({ file, onRefresh }) {
  const navigate = useNavigate();
  const [localFile, setLocalFile] = useState(file);
  const [hasLoadedPermissions, setHasLoadedPermissions] = useState(false);
  const currentUserId = useUserId();
  const { currentUserPerms, loadShared, loading } = useFilePermissions(file?.id, currentUserId, onRefresh);

  // Update local file when prop changes
  useEffect(() => {
    setLocalFile(file);
    setHasLoadedPermissions(false);
  }, [file]);

  // Load permissions when file or user changes
  useEffect(() => {
    if (file?.id && currentUserId && (file?.type === "file" || file?.type === "folder")) {
      loadShared().finally(() => {
        setHasLoadedPermissions(true);
      });
    } else {
      setHasLoadedPermissions(true);
    }
  }, [file?.id, file?.type, currentUserId, loadShared]);

  const { name, modified, content, ownerUsername, type } = localFile;

  const isImage = isImageFile(name);
  
  // Get user's role based on permissions
  const userRole = roleFromPermissions(currentUserPerms);
  
  // Check if current user can edit (editor or above)
  const canEdit = ["editor", "admin", "owner"].includes(userRole);

  const handleFileClick = (e, openModal) => {
    // Check if any modal is open (dialog element with open attribute)
    const isAnyModalOpen = document.querySelector('dialog[open]');
    
    if (type === "file") {
      // Don't open file if it's in trash
      if (!loading && !localFile.trashed) {
        openModal();
      }
    }
    else if (type === "folder") {
      // Only navigate to folder if no modal is open
      if (!isAnyModalOpen) {
        navigate(`/drive/folders/${localFile.id}`, { replace: true });
      }
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
      {!hasLoadedPermissions && type === "file" ? (
        <tr className="file-row">
          <td className="col-name" colSpan="5">
            <span style={{ color: "#999" }}>Loading...</span>
          </td>
        </tr>
      ) : isImage ? (
        <ViewImage file={localFile}>
          {(openViewImage) => (
            <FileActions
              file={localFile}
              onRefresh={onRefresh}
              currentUserPerms={currentUserPerms}
              onLeftClick={(e) => handleFileClick(e, openViewImage)}
            >
              <tr className="file-row">
                <td className="col-name">
                  <span className="file-icon" aria-hidden="true">
                    {getFileIcon(type, name, localFile.trashed, canEdit)}
                  </span>
                  {name}
                </td>
                <td className="col-owner">{ownerUsername}</td>
                <td className="col-modified">
                  <RelativeDate timestamp={modified} />
                </td>
                <td className="col-size">{getSize({ type, content })}</td>
                <td className="col-actions">
                  <FileSelect file={localFile} onRefresh={onRefresh} isTrashed={localFile.trashed} />
                </td>
              </tr>
            </FileActions>
          )}
        </ViewImage>
      ) : canEdit ? (
        <EditFile file={localFile} onSave={handleSave}>
          {(openEditModal) => (
            <FileActions
              file={localFile}
              onRefresh={onRefresh}
              currentUserPerms={currentUserPerms}
              onLeftClick={(e) => handleFileClick(e, openEditModal)}
            >
              <tr className="file-row">
                <td className="col-name">
                  <span className="file-icon" aria-hidden="true">
                    {getFileIcon(type, name, localFile.trashed, canEdit)}
                  </span>
                  {name}
                </td>
                <td className="col-owner">{ownerUsername}</td>
                <td className="col-modified">
                  <RelativeDate timestamp={modified} />
                </td>
                <td className="col-size">{getSize({ type, content })}</td>
                <td className="col-actions">
                  <FileSelect file={localFile} onRefresh={onRefresh} isTrashed={localFile.trashed} />
                </td>
              </tr>
            </FileActions>
          )}
        </EditFile>
      ) : (
        <ViewFile file={localFile}>
          {(openViewModal) => (
            <FileActions
              file={localFile}
              onRefresh={onRefresh}
              currentUserPerms={currentUserPerms}
              onLeftClick={(e) => handleFileClick(e, openViewModal)}
            >
              <tr className="file-row">
                <td className="col-name">
                  <span className="file-icon" aria-hidden="true">
                    {getFileIcon(type, name, localFile.trashed, canEdit)}
                  </span>
                  {name}
                </td>
                <td className="col-owner">{ownerUsername}</td>
                <td className="col-modified">
                  <RelativeDate timestamp={modified} />
                </td>
                <td className="col-size">{getSize({ type, content })}</td>
                <td className="col-actions">
                  <FileSelect file={localFile} onRefresh={onRefresh} isTrashed={localFile.trashed} />
                </td>
              </tr>
            </FileActions>
          )}
        </ViewFile>
      )}
    </>
  );
}

export default FileRow;
