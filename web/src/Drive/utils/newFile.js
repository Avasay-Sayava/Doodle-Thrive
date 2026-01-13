import { isImage } from "./isImage";

const API_BASE = process.env.API_BASE_URL || "http://localhost:3300";

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(",")[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default async function newFile({
  fileName,
  fileType,
  parentId = null,
  fileObject = null,
}) {
  const jwt = localStorage.getItem("token");
  if (!jwt) throw new Error("Not authenticated");

  let content;

  if (fileObject && fileObject instanceof File) {
    // limit to 10mb
    const MAX_FILE_SIZE = 10 * 1024 * 1024;
    if (fileObject.size > MAX_FILE_SIZE) {
      throw new Error("File size exceeds the 10MB limit");
    }

    // images to base64, other files to text
    if (isImage(fileObject.name)) {
      content = await fileToBase64(fileObject);
    } else {
      content = await fileObject.text();
    }
  } else {
    content = fileType === "folder" ? undefined : "";
  }

  const res = await fetch(`${API_BASE}/api/files`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwt}`,
    },
    body: JSON.stringify({
      name: fileName,
      content,
      parent: parentId,
    }),
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Create file failed (HTTP ${res.status}): ${txt}`);
  }

  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("application/json")) return await res.json();
  return true;
}
