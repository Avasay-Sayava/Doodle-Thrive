import "./style.css";
import FileSelect from "../FileSelect";
import getFile from "../../../utils/getFile";
import Regex from "../../../utils/regex";
import { data } from "react-router-dom";
const API_BASE = process.env.API_BASE_URL || "http://localhost:3300";

function getSize({fileType, content}) {
  if (fileType === "folder") return "-";
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
  if(isNaN(date.getTime())) return "Unknown";
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

  return date.toLocaleDateString();
}



function FileRow({file: {name, modified, content, ownerUsername, fileType, id, starred}, onRefresh}) {
  return (
  <tr className="file-row">
    <td className="col-name">{name}</td>
    <td className="col-owner">{ownerUsername}</td>
    <td className="col-modified">{getDate(modified)}</td>
    <td className="col-size">{getSize({fileType: fileType, content})}</td>
    <td className="col-actions"><FileSelect file={{id, starred}} onRefresh={onRefresh} /></td>
  </tr>
  );
}

export default FileRow;