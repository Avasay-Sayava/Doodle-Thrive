import "../style.css";
import FileRow from "../../components/storage/FileRow";
import { useEffect, useState } from "react";

const API_BASE = "http://localhost:5000";

function HomeView({user}) {
  const [files, setFiles] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
  const USERNAME = "USERNAME";
  const PASSWORD = "PASSWORD";

  const USER_CREATED_KEY = `dd_user_created:${USERNAME}`;
  const SEEDED_KEY = `dd_seeded:${USERNAME}`;

  const login = async () => {
    const res = await fetch(`${API_BASE}/api/tokens`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: USERNAME, password: PASSWORD }),
    });

    if (res.status === 404) return null; // user not found

    const text = await res.text();
    if (!res.ok) {
      throw new Error(`Login failed (HTTP ${res.status}): ${text}`);
    }

    const json = text ? JSON.parse(text) : {};
    return json.token;
  };



  const createUserOnce = async () => {
    if (localStorage.getItem(USER_CREATED_KEY) === "1") return;

    const res = await fetch(`${API_BASE}/api/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: USERNAME,
        password: PASSWORD,

        // If your server requires more fields, add them here:
        // name: USERNAME,
        // confirmPassword: PASSWORD,
        // image: "",
      }),
    });

    const text = await res.text();

    if (res.ok) {
      localStorage.setItem(USER_CREATED_KEY, "1");
      return;
    }

    // "already exists" (common patterns)
    if (res.status === 409) {
      localStorage.setItem(USER_CREATED_KEY, "1");
      return;
    }

    throw new Error(`Create user failed (HTTP ${res.status}): ${text}`);
  };


  const seedFilesOnce = async (jwt) => {
    if (localStorage.getItem(SEEDED_KEY) === "1") return;

    // Check if there are already files; if yes, mark seeded and stop
    const filesRes = await fetch(`${API_BASE}/api/files`, {
      method: "GET",
      headers: { Authorization: `Bearer ${jwt}` },
    });

    if (!filesRes.ok) {
      const txt = await filesRes.text();
      throw new Error(`Fetch files failed (HTTP ${filesRes.status}): ${txt}`);
    }

    const files = await filesRes.json();
    if (files.length > 0) {
      localStorage.setItem(SEEDED_KEY, "1");
      return;
    }

    // Seed templates (only once)
    const templates = [
      {
        name: "Welcome.txt",
        content: "Welcome to Doodle-Drive.\n\nThis is your first file.",
        parent: null,
      },
      {
        name: "Getting Started.txt",
        content: "Try creating folders/files, renaming, starring, and searching.\n",
        parent: null,
      },
      {
        name: "Notes.txt",
        content: "Personal notes...\n",
        parent: null,
      },
    ];

    for (const t of templates) {
      const r = await fetch(`${API_BASE}/api/files`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${jwt}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(t),
      });

      if (!r.ok) {
        const txt = await r.text();
        throw new Error(`Seed file failed (HTTP ${r.status}): ${txt}`);
      }
    }

    localStorage.setItem(SEEDED_KEY, "1");
  };

  const run = async () => {
    try {
      // 1) Ensure user exists (only once)
      await createUserOnce();

      // 2) Login (must succeed now)
      const jwt = await login();
      if (!jwt) throw new Error("Login failed");

      // 3) Seed template files (only once)
      await seedFilesOnce(jwt);

      // 4) Fetch files and display root
      const res = await fetch(`${API_BASE}/api/files`, {
        method: "GET",
        headers: { Authorization: `Bearer ${jwt}` },
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`Fetch files failed (HTTP ${res.status}): ${txt}`);
      }

      const allFiles = await res.json();
      const rootFiles = allFiles.filter((f) => f.parent == null);
      setFiles(rootFiles);
    } catch (err) {
      setError(err.message || "Failed to load files");
    }
  };

  run();
}, []);






  return (
    
    <div className="file-view">
      <div className="file-view__header">
        <h1>My Drive</h1>
      </div>

      <div className="file-view__table-wrapper">
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
        </table>)}
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
            <FileRow file={{name: "Document1.txt", owner: "Alice", lastModified: "2024-06-01", size: "15 KB"}}/>
            <FileRow file={{name: "Photo.png", owner: "Bob", lastModified: "2024-05-28", size: "2 MB"}}/>
            <FileRow file={{name: "Presentation.pptx", owner: "Charlie", lastModified: "2024-05-30", size: "5 MB"}}/>
          </tbody>
        </table>

      </div>
    // </div>
  );
}

export default HomeView;
