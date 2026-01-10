const API_BASE = process.env.REACT_APP_API_BASE_URL || "http://localhost:3300";

export default async function newFile({ fileName, fileType }) {
  const jwt = localStorage.getItem("token");
  if (!jwt) throw new Error("Not authenticated");

  const res = await fetch(`${API_BASE}/api/files`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwt}`,
    },
    body: JSON.stringify({
      name: fileName,
      type: fileType,
    }),
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Create file failed (HTTP ${res.status}): ${txt}`);
  }

  return true;
}