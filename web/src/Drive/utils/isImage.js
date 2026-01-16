export function isImage(filename) {
  if (!filename) return false;
  const ext = filename.toLowerCase().split(".").pop();
  return ["jpg", "jpeg", "png", "webp"].includes(ext);
}
