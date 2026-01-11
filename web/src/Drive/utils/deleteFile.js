

const API_BASE = process.env.REACT_APP_API_BASE_URL || "http://localhost:3300";

export default async function deleteFile(fileId) {
  const jwt = localStorage.getItem("token");
  if (!jwt) throw new Error("Not authenticated");

  const res = await fetch(`${API_BASE}/api/files/${fileId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Delete file failed (HTTP ${res.status}): ${txt}`);
  }

  return true;
}
