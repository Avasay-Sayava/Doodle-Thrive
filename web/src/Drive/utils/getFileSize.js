/**
 * Get human-readable file size
 * @param {Object} file - File object with type and content
 * @param {string} file.type - 'file' or 'folder'
 * @param {string} file.content - File content
 * @returns {string} Formatted file size
 */
export function getFileSize({ type, content }) {
  if (type === "folder") return "-";
  let bytes = content?.length || 0;
  if (bytes < 1024) return bytes + " B";
  let kb = bytes / 1024;
  if (kb < 1024) return kb.toFixed(2) + " KB";
  let mb = kb / 1024;
  if (mb < 1024) return mb.toFixed(2) + " MB";
  let gb = mb / 1024;
  return gb.toFixed(2) + " GB";
}
