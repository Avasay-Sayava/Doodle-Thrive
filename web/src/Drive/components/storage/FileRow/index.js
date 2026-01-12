import "./style.css";
import FileSelect from "../FileSelect";
import FileActions from "../FileActions";
import RelativeDate from "../../Date";


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
        <td className="col-modified"><RelativeDate timestamp={modified} /></td>
        <td className="col-size">{getSize({ fileType, content })}</td>
        <td className="col-actions">
          <FileSelect file={{ id, starred }} onRefresh={onRefresh} />
        </td>
      </tr>
    </FileActions>
  );
}

export default FileRow;
