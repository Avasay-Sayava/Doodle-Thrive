const API_BASE = process.env.API_BASE_URL || "http://localhost:3300";

export default async function uploadFile(file, parentId = null) {
  const jwt = localStorage.getItem("token");
  if (!jwt) throw new Error("Not authenticated");

  if (!file || !(file instanceof File)) {
    throw new Error("uploadFile expected a File");
  }

  const content = await file.text();

  const res = await fetch(`${API_BASE}/api/files`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwt}`,
    },
    body: JSON.stringify({
      name: file.name,
      type: "file",
      content,
      parentId,
    }),
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Upload failed (HTTP ${res.status}): ${txt}`);
  }

  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("application/json")) return await res.json();
  return true;
}
