import "../style.css";
import FileView from "../FileView";
import { useEffect, useState } from "react";
import getUser from "../../utils/getUser";
import { useNavigate, useParams, Link, replace } from "react-router-dom";
import { sortFiles } from "../../utils/sortFiles";

const API_BASE = process.env.API_BASE_URL || "http://localhost:3300";

function FolderPath({ folderId }) {
    const [path, setPath] = useState([]);
    const [foundBase, setFoundBase] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (!folderId) {
            setPath([]);
            return;
        }

        (async () => {
            const tempPath = [];
            let currId = folderId;

            while (currId) {
                try {
                    const jwt = localStorage.getItem("token");
                    const res = await fetch(`${API_BASE}/api/files/${currId}`, {
                        method: "GET",
                        headers: { Authorization: `Bearer ${jwt}` },
                    });

                    if (!res.ok) break;

                    const folder = await res.json();
                    tempPath.unshift(folder);
                    currId = folder.parent;
                    foundBase || setFoundBase(true);
                } catch {
                    break;
                }
            }
            setPath(tempPath);
        })();
    }, [folderId]);

    const goRoot = () => navigate(`/drive/mydrive`, { replace: true });

    if (!foundBase) {
        goRoot();
    }
    return (
        <span>
             <button onClick={goRoot} className="folder-button">My Drive</button>
             {path.map((folder) => (
                <span style={{ display: "inline-flex", alignItems: "center" }}>
                    <span style={{ fontSize: "14px", color: "var(--color-text-secondary)" }}>&gt;</span>
                    <button onClick={() => navigate(`/drive/folders/${folder.id}`, { replace: true })} className="folder-button">
                        {folder.name}
                    </button>
                </span>
             ))}
        </span>
    );
}

function FolderView({ refreshKey, onRefresh }) {
    const { folderId } = useParams();
    const [files, setFiles] = useState([]);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const [sortBy, setSortBy] = useState("modified");
    const [sortDir, setSortDir] = useState("asc");
    const [foldersMode, setFoldersMode] = useState("folders-first");

    const handleSortChange = ({ sortBy: newSortBy, sortDir: newSortDir, foldersMode: newFoldersMode }) => {
        setSortBy(newSortBy);
        setSortDir(newSortDir);
        setFoldersMode(newFoldersMode);
    };

    useEffect(() => {
        (async () => {
            try {
                setError("");

                const jwt = localStorage.getItem("token");
                if (!jwt) {
                    navigate("/signin", { replace: true });
                    return;
                }

                const res = await fetch(`${API_BASE}/api/files`, {
                    method: "GET",
                    headers: { Authorization: `Bearer ${jwt}` },
                });

                if (!res.ok) {
                    if (res.status === 401) {
                        localStorage.removeItem("token");
                        navigate("/signin", { replace: true });
                        return;
                    }
                    const txt = await res.text();
                    throw new Error(`Get files failed (HTTP ${res.status}): ${txt}`);
                }

                const filesObj = await res.json();
                const allFiles = (Array.isArray(filesObj) ? filesObj : Object.values(filesObj)).filter((f) => f.trashed !== true);
                const childFiles = allFiles.filter((f) => f.parent === folderId);

                for (let i = 0; i < childFiles.length; i++) {
                    childFiles[i].ownerUsername = await getUser(childFiles[i].owner);
                }

                setFiles(sortFiles(childFiles, sortBy, sortDir, foldersMode));
                handleSortChange({ sortBy, sortDir, foldersMode });
            } catch (err) {
                setError(err?.message || "Failed to load files");
            }
        })();
    }, [foldersMode, navigate, refreshKey, sortBy, sortDir, folderId]);

    return (
        <div className="file-view">
            <div className="file-view__header">
                <h1 className="view-title">
                    <FolderPath folderId={folderId} />
                </h1>
            </div>

            {error && <div className="error-message">{error}</div>}
            <FileView
                allFiles={files}
                onRefresh={onRefresh}
                sortBy={sortBy}
                sortDir={sortDir}
                foldersMode={foldersMode}
                onSortChange={handleSortChange}
                parentId={folderId}
            />
        </div>
    );

}

export default FolderView;