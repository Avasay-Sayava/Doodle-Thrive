import "./style.css";
import { useState, useEffect } from "react";
import FileSelect from "../FileSelect";
import FileActions from "../FileActions";
import RelativeDate from "../../Date";
import EditFile from "../../../modals/EditFile";
import ViewFile from "../../../modals/ViewFile";
import ViewImage from "../../../modals/ViewImage";
import useFilePermissions, {
  roleFromPermissions,
} from "../../../utils/useFilePermissions";
import useUserId from "../../../utils/useUserId";
import { useNavigate } from "react-router-dom";
import { getFileIcon } from "../../../utils/getFileIcon";
import { getFileSize } from "../../../utils/getFileSize";
import { isImage } from "../../../utils/isImage";

function FileRow({ file, onRefresh }) {
  const navigate = useNavigate();
  const [localFile, setLocalFile] = useState(file);
  const [hasLoadedPermissions, setHasLoadedPermissions] = useState(false);
  const currentUserId = useUserId();
  const { currentUserPerms, loadShared, loading } = useFilePermissions(
    file?.id,
    currentUserId,
    onRefresh,
  );

  useEffect(() => {
    setLocalFile(file);
    setHasLoadedPermissions(false);
  }, [file]);

  useEffect(() => {
    if (
      file?.id &&
      currentUserId &&
      (file?.type === "file" || file?.type === "folder")
    ) {
      loadShared().finally(() => {
        setHasLoadedPermissions(true);
      });
    } else {
      setHasLoadedPermissions(true);
    }
  }, [file?.id, file?.type, currentUserId, loadShared]);

  const { name, modified, content, ownerUsername, type } = localFile;

  const isImageFile = isImage(name);

  const userRole = roleFromPermissions(currentUserPerms);

  const canEdit = ["editor", "admin", "owner"].includes(userRole);

  const handleFileClick = (e, openModal) => {
    const isAnyModalOpen = document.querySelector("dialog[open]");

    if (type === "file") {
      if (!loading && !localFile.trashed) {
        openModal();
      }
    } else if (type === "folder") {
      if (!isAnyModalOpen) {
        navigate(`/drive/folders/${localFile.id}`, { replace: true });
      }
    }
  };

  const handleSave = (updatedData) => {
    setLocalFile((prev) => ({
      ...prev,
      content: updatedData.content,
      modified: updatedData.modified,
    }));

    onRefresh?.();
  };

  return (
    <>
      {!hasLoadedPermissions && type === "file" ? (
        <tr className="file-row">
          <td className="col-name" colSpan="5">
            <span className="file-row-loading">Loading...</span>
          </td>
        </tr>
      ) : isImageFile ? (
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
                <td className="col-size">{getFileSize({ type, content })}</td>
                <td className="col-actions">
                  <FileSelect
                    file={localFile}
                    onRefresh={onRefresh}
                    isTrashed={localFile.trashed}
                  />
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
                <td className="col-size">{getFileSize({ type, content })}</td>
                <td className="col-actions">
                  <FileSelect
                    file={localFile}
                    onRefresh={onRefresh}
                    isTrashed={localFile.trashed}
                  />
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
                <td className="col-size">{getFileSize({ type, content })}</td>
                <td className="col-actions">
                  <FileSelect
                    file={localFile}
                    onRefresh={onRefresh}
                    isTrashed={localFile.trashed}
                  />
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
