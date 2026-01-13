import "../style.css";
import FileView from "../FileView";
import { useEffect, useMemo, useState } from "react";
import getUser from "../../utils/getUser";
import { useSearchParams, useNavigate, useLocation } from "react-router-dom";
import { sortFiles } from "../../utils/sortFiles";
import useUserId from "../../utils/useUserId";
import useFilePermissions, { roleFromPermissions } from "../../utils/useFilePermissions";
import EditFile from "../../modals/EditFile";
import ViewFile from "../../modals/ViewFile";

const API_BASE = process.env.API_BASE_URL || "http://localhost:3300";

function SearchView({ refreshKey, onRefresh }) {
    const [files, setFiles] = useState([]);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const query = searchParams.get("query");
    const [openFileId, setOpenFileId] = useState(() => location.state?.openFileId || null);
    const searchRefreshKey = location.state?.refreshKey || 0;

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
        if (location.state?.openFileId) {
            setOpenFileId(location.state.openFileId);
            setFiles([])
        }
    }, [location.state]);

    // Immediately clear results when query or refreshKey changes (header search triggers refreshKey)
    useEffect(() => {
        setFiles([]);
        setError("");
    }, [query, searchRefreshKey]);

    useEffect(() => {
        (async () => {
            try {
                setError("");
                setFiles([]);

                const jwt = localStorage.getItem("token");
                if (!jwt){
                    localStorage.removeItem("token");
                    navigate("/signin", { replace: true });
                    return;
                }

                const res = await fetch(`${API_BASE}/api/search/${encodeURIComponent(query)}`, {
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
                const allFiles = (Array.isArray(filesObj) ? filesObj : Object.values(filesObj)).filter(f => !f.trashed);

                for (let i = 0; i < allFiles.length; i++) {
                    allFiles[i].ownerUsername = await getUser(allFiles[i].owner);
                }

                const sortedFiles = sortFiles(allFiles, sortBy, sortDir, foldersMode);
                setFiles(sortedFiles);

            } catch (err) {
                if (err?.name !== 'AbortError') {
                    setError(err?.message || "Failed to load files");
                }
            }
        })();
    }, [query, navigate, sortBy, sortDir, foldersMode, searchRefreshKey]);

    // Clear navigation state after initial read to avoid repeated auto-open on reload
    useEffect(() => {
        if (location.state?.openFileId) {
            navigate(location.pathname + location.search, { replace: true });
        }
    }, [location.pathname, location.search, location.state, navigate]);

    const autoOpenFile = useMemo(() => {
        if (!openFileId) return null;
        return files.find((f) => f.id === openFileId) || null;
    }, [files, openFileId]);

    const handleAutoOpenDone = () => setOpenFileId(null);

    function FileAutoOpener({ file, onDone }) {
        const currentUserId = useUserId();
        const { currentUserPerms, loadShared, loading } = useFilePermissions(file?.id, currentUserId);
        const [opened, setOpened] = useState(false);
        const [openFn, setOpenFn] = useState(null);

        useEffect(() => {
            if (file?.id) {
                loadShared().catch(() => {});
            }
        }, [file?.id, loadShared]);

        useEffect(() => {
            if (!openFn || opened || loading) return;
            setOpened(true);
            openFn();
            onDone?.();
        }, [openFn, opened, loading, onDone]);

        const role = roleFromPermissions(currentUserPerms);
        const canEdit = ["editor", "admin", "owner"].includes(role);

        if (canEdit) {
            return (
                <EditFile file={file}>
                    {(open) => {
                        if (!openFn) setOpenFn(() => open);
                        return null;
                    }}
                </EditFile>
            );
        }

        return (
            <ViewFile file={file}>
                {(open) => {
                    if (!openFn) setOpenFn(() => open);
                    return null;
                }}
            </ViewFile>
        );
    }
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
            {autoOpenFile && (
                <FileAutoOpener file={autoOpenFile} onDone={handleAutoOpenDone} />
            )}
        </div>
    );
}

export default SearchView;