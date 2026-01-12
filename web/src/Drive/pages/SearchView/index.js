import "../style.css";
import FileView from "../FileView";
import { useEffect, useState } from "react";
import getUser from "../../utils/getUser";
import { useSearchParams, useNavigate } from "react-router-dom";
import { sortFiles } from "../../utils/sortFiles";

const API_BASE = process.env.API_BASE_URL || "http://localhost:3300";

function SearchView({ refreshKey, onRefresh }) {
    const [files, setFiles] = useState([]);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const query = searchParams.get("query");

    const [sortBy, setSortBy] = useState("name");
    const [sortDir, setSortDir] = useState("asc");
    const [foldersMode, setFoldersMode] = useState("mixed");

    const handleSortChange = ({ sortBy: newSortBy, sortDir: newSortDir, foldersMode: newFoldersMode }) => {
        setSortBy(newSortBy);
        setSortDir(newSortDir);
        setFoldersMode(newFoldersMode);
    };

    if (!query) {
        navigate("/drive/home", { replace: true });
    }

    useEffect(() => {
        (async () => {
            try {
                setError("");

                const jwt = localStorage.getItem("token");
                if (!jwt){
                    localStorage.removeItem("token");
                    navigate("/signin", { replace: true });
                    return;
                }

                const res = await fetch(`${API_BASE}/api/search/${query}`, {
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
                const allFiles = Array.isArray(filesObj) ? filesObj : Object.values(filesObj);

                for (let i = 0; i < allFiles.length; i++) {
                    allFiles[i].ownerUsername = await getUser(allFiles[i].owner);
                }

                const sortedFiles = sortFiles(allFiles, sortBy, sortDir, foldersMode);
                setFiles(sortedFiles);
            } catch (err) {
                setError(err?.message || "Failed to load files");
            }
        })();
    }, [query, navigate, refreshKey, sortBy, sortDir, foldersMode]);
    return (
        <div className="file-view">
            <div className="file-view__header">
                <div className="file-view__header">
                    <h1>
                        <span className="mydrive-title__text">Results for "{query}"</span>
                    </h1>
                </div>
            </div>

            {error && <div className="error-message">{error}</div>}
            <FileView 
                allFiles={files} 
                onRefresh={onRefresh}
                sortBy={sortBy}
                sortDir={sortDir}
                foldersMode={foldersMode}
                onSortChange={handleSortChange}
            />
        </div>
    );
}

export default SearchView;