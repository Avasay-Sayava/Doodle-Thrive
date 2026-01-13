import "./style.css";
import { useCallback, useState } from "react";
import Modal from "../Modal";
import getFile from "../../utils/getFile";

/**
 * ViewFile modal - displays file content in read-only mode
 * @param {Object} file - The file to view (must include id and name)
 * @param {Function} children - Render prop function that receives (open) function
 */
export default function ViewFile({ file, children }) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadFile = useCallback(async () => {
    if (!file?.id) return;

    setLoading(true);
    setError("");

    try {
      const fileData = await getFile(file.id);
      const fileContent = fileData?.content || "";

      if (fileContent === undefined) throw new Error("No file content");

      setContent(fileContent);
    } catch (err) {
      setError(err?.message || "Failed to load file");
      setContent("");
    } finally {
      setLoading(false);
    }
  }, [file?.id]);

  const handleClose = useCallback(() => {
    setContent("");
    setError("");
  }, []);

  const renderBody = useCallback(
    (isOpen, shouldRender, close) => {
      if (!shouldRender) return null;

      return (
        <div className="view-file-modal-content">
          {error && <div className="view-file-modal-error">{error}</div>}

          {loading ? (
            <div className="view-file-modal-loading">Loading file...</div>
          ) : (
            <div className="view-file-modal-text-wrapper">
              <pre className="view-file-modal-text">{content}</pre>
            </div>
          )}

          <div className="view-file-modal-actions">
            <button
              className="view-file-modal-button view-file-modal-button-close"
              onClick={close}
            >
              Close
            </button>
          </div>
        </div>
      );
    },
    [content, loading, error]
  );

  return (
    <Modal
      title={`View: ${file?.name || "File"}`}
      renderBody={renderBody}
      onOpen={loadFile}
      onClose={handleClose}
    >
      {children}
    </Modal>
  );
}
