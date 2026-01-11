

const API_BASE = process.env.API_BASE_URL || "http://localhost:3300";

export default async function getFile(fileId) {
  const jwt = localStorage.getItem("token");
  if (!jwt) throw new Error("Not authenticated");

  const res = await fetch(`${API_BASE}/api/files/${fileId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Get file failed (HTTP ${res.status}): ${txt}`);
  }

  return res.json();
}