const API_BASE = process.env.API_BASE_URL || "http://localhost:3300";

function triggerDownload(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export default async function downloadFile(id) {
  const jwt = localStorage.getItem("token");
  if (!jwt) throw new Error("Not authenticated");

  const res = await fetch(`${API_BASE}/api/files/${id}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${jwt}` },
  });

  const raw = await res.text();
  if (!res.ok) throw new Error(`Fetch failed (HTTP ${res.status}): ${raw}`);

  const file = JSON.parse(raw);

  if (file.type !== "folder") {
    const blob = new Blob([String(file.content ?? "")], {
      type: "text/plain;charset=utf-8",
    });

    triggerDownload(blob, file.name || "file");
    return;
  }

  for (const childId of file.children || []) {
    await downloadFile(childId);
  }
}
