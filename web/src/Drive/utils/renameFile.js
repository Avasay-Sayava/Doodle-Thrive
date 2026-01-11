const API_BASE = process.env.API_BASE_URL || "http://localhost:3300";

export default async function renameFile(id, newName) {
    const jwt = localStorage.getItem("token");
    if (!jwt) throw new Error("Not authenticated");

    const res = await fetch(`${API_BASE}/api/files/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify({ name: newName }),
    });
    if (!res.ok) {
        const txt = await res.text();
        throw new Error(`Rename file failed (HTTP ${res.status}): ${txt}`);
    }

    return true;
}