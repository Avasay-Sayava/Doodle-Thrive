import "../style.css";
import FileRow from "../../components/storage/FileRow";
import { useEffect, useState } from "react";
import FileSelect from "./FileSelect";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";

function HomeView({user}) {
  const [files, setFiles] = useState([]);
  const [error, setError] = useState("");

  // useEffect(() => {
  //   const fetchRootFiles = async () => {
  //     try {
  //       const token = localStorage.getItem("token");
  //       // if (!token) {
  //       //   throw new Error("Not authenticated");
  //       // }
  //       const res = await fetch(`${API_BASE}/api/files`, {
  //         mode: "no-cors",
  //         method: "GET",
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       });
  //       alert("GOT HERE!");

  //       // if (!res.ok) {
  //       //   throw new Error(`HTTP ${res.status}`);
  //       // }

  //       const allFiles = await res.json();

  //       // Filter root files (no parent)
  //       const rootFiles = allFiles.filter(
  //         (file) => file.parent == null
  //       );

  //       setFiles(rootFiles);
  //     } catch (err) {
  //       setError(err.message || "Failed to load files");
  //     }
  //   };

  //   fetchRootFiles();
  // }, []);


  return (
    
    <div className="file-view">
      <div className="file-view__header">
        <h1>My Drive</h1>
      </div>

      {/* <div className="file-view__table-wrapper">
        {error ? 
        <div className="file-view__error">
          {error}
        </div> :
        (<table className="files-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Owner</th>
              <th>Last modified</th>
              <th>File size</th>
            </tr>
          </thead>

          <tbody>
            {files.map((file) => (<FileRow file={file}/>))}
          </tbody>
        </table>)} */}
        <table className="files-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Owner</th>
              <th>Last modified</th>
              <th>File size</th>
            </tr>
          </thead>

          <tbody>
            <FileRow file={{name: "Document1.txt", owner: "Alice", lastModified: "2024-06-01", size: "15 KB"}}/> <FileSelect/>
            <FileRow file={{name: "Photo.png", owner: "Bob", lastModified: "2024-05-28", size: "2 MB"}}/>
            <FileRow file={{name: "Presentation.pptx", owner: "Charlie", lastModified: "2024-05-30", size: "5 MB"}}/>
          </tbody>
        </table>

      </div>
    // </div>
  );
}

export default HomeView;
