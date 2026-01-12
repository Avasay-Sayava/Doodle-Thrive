const API_BASE = process.env.API_BASE_URL || "http://localhost:3300";

// Convert image files to base64
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(",")[1]); // Get base64 part only
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Check if file is an image
function isImageExt(filename) {
  if (!filename) return false;
  const ext = filename.toLowerCase().split(".").pop();
  return ["png", "jpg", "jpeg", "webp"].includes(ext);
}

export default async function uploadFile(file) {
  const jwt = localStorage.getItem("token");
  if (!jwt) throw new Error("Not authenticated");

  if (!file || !(file instanceof File)) {
    throw new Error("uploadFile expected a File");
  }

  // Prevent uploading files larger than 10MB
  const MAX_FILE_SIZE = 10 * 1024 * 1024;
  if (file.size > MAX_FILE_SIZE) {
    throw new Error("File size exceeds the 10MB limit");
  }

  // Convert images to base64, other files to text
  let content;
  if (isImageExt(file.name)) {
    content = await fileToBase64(file);
  } else {
    content = await file.text();
  }

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
