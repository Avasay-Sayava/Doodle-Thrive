/**
 * Check if a file is an image based on its extension
 * @param {string} filename - The filename to check
 * @returns {boolean} True if the file is an image
 */
export function isImageFile(filename) {
  if (!filename) return false;
  const ext = filename.toLowerCase().split(".").pop();
  return ["jpg", "jpeg", "png", "webp"].includes(ext);
}

/**
 * Check if a file extension is an image
 * @param {string} filename - The filename to check
 * @returns {boolean} True if the extension is an image type
 */
export function isImageExt(filename) {
  if (!filename) return false;
  const ext = filename.toLowerCase().split(".").pop();
  return ["jpg", "jpeg", "png", "gif", "webp", "bmp", "svg"].includes(ext);
}
