import IconFile from "../components/icons/IconFile";
import IconFolder from "../components/icons/IconFolder";
import IconImageFile from "../components/icons/IconImageFile";
import IconFileLocked from "../components/icons/IconFileLocked";
import { isImageFile } from "./fileHelpers";

/**
 * Get the appropriate icon for a file based on its type and permissions
 * @param {string} type - 'file' or 'folder'
 * @param {string} name - The file name
 * @param {boolean} isTrashed - Whether the file is trashed
 * @param {boolean} canEdit - Whether the user can edit the file
 * @returns {JSX.Element} The appropriate icon component
 */
export function getFileIcon(type, name, isTrashed = false, canEdit = true) {
  if (type === "file" && isImageFile(name)) {
    return <IconImageFile />;
  }

  if (type === "file" && !canEdit) {
    return <IconFileLocked />;
  }

  return type === "folder" ? <IconFolder /> : <IconFile />;
}
