const API_BASE = process.env.REACT_APP_API_BASE_URL || "http://localhost:3300";

export default async function setStarred(id, starred) {
    const jwt = localStorage.getItem("token");
    if (!jwt) throw new Error("Not authenticated");

    const res = await fetch(`${API_BASE}/api/files/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify({ starred: starred }),
    });

    if (!res.ok) {
        const txt = await res.text();
        throw new Error(`Add starred failed (HTTP ${res.status}): ${txt}`);
    }
}