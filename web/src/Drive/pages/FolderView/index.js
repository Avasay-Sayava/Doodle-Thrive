import "../style.css";
import FileView from "../FileView";
import { useEffect, useState } from "react";
import getUser from "../../utils/getUser";
import { useNavigate, useParams } from "react-router-dom";
import { sortFiles } from "../../utils/sortFiles";
import FolderPath from "../../components/storage/FolderPath";

const API_BASE = process.env.API_BASE_URL || "http://localhost:3300";

function FolderView({ refreshKey, onRefresh }) {
    const { folderId } = useParams();
    const [files, setFiles] = useState([]);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const [sortBy, setSortBy] = useState("modified");
    const [sortDir, setSortDir] = useState("asc");
    const [foldersMode, setFoldersMode] = useState("folders-first");
    const [canWrite, setCanWrite] = useState(true);

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

                setFiles(childFiles);
            } catch (err) {
                setError(err?.message || "Failed to load files");
            }
        })();
    }, [navigate, refreshKey, folderId]);

    return (
        <div className="file-view">
            <div className="file-view__header">
                <h1 className="view-title">
                    <FolderPath folderId={folderId} onRefresh={onRefresh} onPermissionsLoad={setCanWrite} />
                </h1>
            </div>

            {error && <div className="error-message">{error}</div>}
            <FileView
                allFiles={sortFiles(files, sortBy, sortDir, foldersMode)}
                onRefresh={onRefresh}
                sortBy={sortBy}
                sortDir={sortDir}
                foldersMode={foldersMode}
                onSortChange={handleSortChange}
                parentId={folderId}
                canWrite={canWrite}
            />
        </div>
    );

}

export default FolderView;