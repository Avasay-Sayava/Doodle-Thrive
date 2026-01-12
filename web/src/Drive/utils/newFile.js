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

export default async function newFile({ fileName, fileType, parentId = null, fileObject = null }) {
  const jwt = localStorage.getItem("token");
  if (!jwt) throw new Error("Not authenticated");

  let content;

  // If fileObject is provided (file upload), process it
  if (fileObject && fileObject instanceof File) {
    // Prevent uploading files larger than 10MB
    const MAX_FILE_SIZE = 10 * 1024 * 1024;
    if (fileObject.size > MAX_FILE_SIZE) {
      throw new Error("File size exceeds the 10MB limit");
    }

    // Convert images to base64, other files to text
    if (isImageExt(fileObject.name)) {
      content = await fileToBase64(fileObject);
    } else {
      content = await fileObject.text();
    }
  } else {
    // Creating a new empty file or folder
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
