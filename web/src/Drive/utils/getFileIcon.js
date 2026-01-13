import IconFile from "../components/icons/IconFile";
import IconFolder from "../components/icons/IconFolder";
import IconImageFile from "../components/icons/IconImageFile";
import IconFileLocked from "../components/icons/IconFileLocked";
import { isImage } from "./isImage";

export function getFileIcon(type, name, isTrashed = false, canEdit = true) {
  if (type === "file" && isImage(name)) {
    return <IconImageFile />;
  }

  if (type === "file" && !canEdit) {
    return <IconFileLocked />;
  }

  return type === "folder" ? <IconFolder /> : <IconFile />;
}
