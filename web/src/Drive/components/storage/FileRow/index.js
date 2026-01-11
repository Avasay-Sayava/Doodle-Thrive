import "./style.css";
import FileSelect from "../FileSelect";
import renameFile from "../../../utils/renameFile";
import FileActions from "../FileActions";


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

function getDate(timestamp) {
  const date = new Date(timestamp);
  if (isNaN(date.getTime())) return "Unknown";
  //if the date is today, return (1 hour/24 minutes/5 seconds) ago
  const now = new Date();
  const diff = Math.abs(now - date);
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  if (hours < 24 && date.getDate() === now.getDate()) {
    if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    return `${seconds} second${seconds > 1 ? "s" : ""} ago`;
  }

  //if the date is yesterday, return "Yesterday"
  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);
  if (date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear()) {
    return "Yesterday";
  }

  //otherwise, return the date in DD/MM/YYYY format
  return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
}

function IconFile() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18">
      <path
        fill="currentColor"
        d="M6 2h8l4 6v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Zm8 2H6v16h10V9h-3V4Z"
      />
    </svg>
  );
}

function IconFolder() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18">
      <path
        fill="currentColor"
        d="M10 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"
      />
    </svg>
  );
}



function FileRow({ file: { name, modified, content, ownerUsername, type, id, starred }, onRefresh }) {
  const file = { name, modified, content, ownerUsername, type, id, starred };
  return (
    <FileActions
      file={file}
      onRefresh={onRefresh}
      onLeftClick={()=>{}}
    >
      <tr className="file-row">
        <td className="col-name">
          <span className="file-icon" aria-hidden="true">
            {type === "folder" ? <IconFolder /> : <IconFile />}
          </span>
          {name}
        </td>
        <td className="col-owner">{ownerUsername}</td>
        <td className="col-modified">{getDate(modified)}</td>
        <td className="col-size">{getSize({ type, content })}</td>
        <td className="col-actions">
          <FileSelect file={{ id, starred }} onRefresh={onRefresh} />
        </td>
      </tr>
    </FileActions>
  );
}

export default FileRow;
