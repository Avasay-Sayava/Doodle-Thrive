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

    if (!query) {
        navigate("/drive/home", { replace: true });
    }

    useEffect(() => {
        const run = async () => {
            try {
                setError("");

                const jwt = localStorage.getItem("token");
                if (!jwt) {
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
                const rootFiles = allFiles.filter((f) => f.parent == null);

                for (let i = 0; i < rootFiles.length; i++) {
                    rootFiles[i].ownerUsername = await getUser(rootFiles[i].owner);
                }

                // Sort by name ascending by default
                const sortedFiles = sortFiles(rootFiles, "name", "asc", "mixed");
                setFiles(sortedFiles);
            } catch (err) {
                setError(err?.message || "Failed to load files");
            }
        };

        run();
    }, [query, navigate, refreshKey]);
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
            <FileView allFiles={files} onRefresh={onRefresh} />
        </div>
    );
}

export default SearchView;