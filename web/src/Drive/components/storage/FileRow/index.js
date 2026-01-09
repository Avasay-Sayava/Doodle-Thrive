import "./style.css";
import FileSelect from "../FileSelect";

function FileRow({file: {name, owner, lastModified, size, content, id}}){
  return (
  <tr className="file-row">
    <td className="col-name">{name}</td>
    <td className="col-owner">{owner}</td>
    <td className="col-modified">{lastModified}</td>
    <td className="col-size">{size}</td>
    <td className="col-actions"><FileSelect /></td>
  </tr>
  );
}

export default FileRow;