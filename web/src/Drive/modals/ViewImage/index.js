import "./style.css";
import { useCallback, useState } from "react";
import Modal from "../Modal";
import getFile from "../../utils/getFile";

/**
 * ViewImage modal - displays image files
 * @param {Object} file - The file to view (must include id and name)
 * @param {Function} children - Render prop function that receives (open) function
 */
export default function ViewImage({ file, children }) {
  const [imageSrc, setImageSrc] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  // Track just data URLs; avoid blob URLs to prevent JSON blobs

  const loadImage = useCallback(async () => {
    if (!file?.id) return;

    setLoading(true);
    setError("");

    try {
      const fileData = await getFile(file.id);
      const base64Content = fileData?.content || "";
      
      if (!base64Content) throw new Error("No image content");
      
      // Content is already base64 from upload
      const mimeType = getMimeType(file?.name);
      const dataUrl = `data:${mimeType};base64,${base64Content}`;
      setImageSrc(dataUrl);
    } catch (err) {
      setError(err?.message || "Failed to load image");
      setImageSrc("");
    } finally {
      setLoading(false);
    }
  }, [file?.id, file?.name]);

  const handleClose = useCallback(() => {
    setImageSrc("");
    setError("");
  }, []);

  const renderBody = useCallback(
    (isOpen, shouldRender, close) => {
      if (!shouldRender) return null;

      return (
        <div className="view-image-modal-content">
          {error && <div className="view-image-modal-error">{error}</div>}

          {loading ? (
            <div className="view-image-modal-loading">Loading image...</div>
          ) : imageSrc ? (
            <img
              src={imageSrc}
              alt={file?.name || "Image"}
              className="view-image-modal-image"
            />
          ) : null}

          <div className="view-image-modal-actions">
            <button
              className="view-image-modal-button view-image-modal-button--close"
              onClick={close}
            >
              Close
            </button>
          </div>
        </div>
      );
    },
    [imageSrc, loading, error, file?.name]
  );

  return (
    <Modal
      title={`View: ${file?.name || "Image"}`}
      renderBody={renderBody}
      onOpen={loadImage}
      onClose={handleClose}
    >
      {children}
    </Modal>
  );
}

// Determine MIME type from filename
function getMimeType(filename) {
  if (!filename) return "image/jpeg";
  const ext = filename.toLowerCase().split(".").pop();
  const mimeTypes = {
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    gif: "image/gif",
    webp: "image/webp",
    svg: "image/svg+xml",
    bmp: "image/bmp",
  };
  return mimeTypes[ext] || "application/octet-stream";
}
