import "./style.css";
import { useCallback, useState } from "react";
import Modal from "../Modal";
import getFile from "../../utils/getFile";
import patchFile from "../../utils/patchFile";

/**
 * EditFile modal - allows editing text content of a file
 * @param {Object} file - The file to edit (must include id and name)
 * @param {Function} onSave - Callback after successful save
 * @param {Function} children - Render prop function that receives (open) function
 */
export default function EditFile({ file, onSave = () => {}, children }) {
  const [content, setContent] = useState("");
  const [originalContent, setOriginalContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const loadFileContent = useCallback(async () => {
    if (!file?.id) return;

    setLoading(true);
    setError("");

    try {
      const fileData = await getFile(file.id);
      const fileContent = fileData.content || "";
      setContent(fileContent);
      setOriginalContent(fileContent);
    } catch (err) {
      setError(err?.message || "Failed to load file");
      setContent("");
      setOriginalContent("");
    } finally {
      setLoading(false);
    }
  }, [file?.id]);

  const handleSave = useCallback(
    async (close) => {
      if (!file?.id) return;

      setSaving(true);
      setError("");

      try {
        const newModified = Date.now();
        await patchFile(file.id, { content });
        setOriginalContent(content);
        
        // Pass updated metadata to parent for immediate UI update
        onSave({
          id: file.id,
          content,
          modified: newModified,
          size: content.length
        });
        close();
      } catch (err) {
        setError(err?.message || "Failed to save file");
      } finally {
        setSaving(false);
      }
    },
    [file?.id, content, onSave]
  );

  const handleClose = useCallback(() => {
    setContent(originalContent);
    setError("");
  }, [originalContent]);

  const renderBody = useCallback(
    (isOpen, shouldRender, close) => {
      if (!shouldRender) return null;

      const hasChanges = content !== originalContent;

      return (
        <div className="edit-file-modal__content">
          {error && <div className="edit-file-modal__error">{error}</div>}

          {loading ? (
            <div className="edit-file-modal__loading">Loading file...</div>
          ) : (
            <textarea
              className="edit-file-modal__textarea"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter file content..."
              autoFocus
            />
          )}

          <div className="edit-file-modal__actions">
            <button
              className="edit-file-modal__button edit-file-modal__button--cancel"
              onClick={() => {
                handleClose();
                close();
              }}
              disabled={saving}
            >
              Cancel
            </button>
            <button
              className="edit-file-modal__button edit-file-modal__button--save"
              onClick={() => handleSave(close)}
              disabled={!hasChanges || saving || loading}
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      );
    },
    [content, originalContent, loading, error, saving, handleSave, handleClose]
  );

  return (
    <Modal
      title={`Edit: ${file?.name || "File"}`}
      renderBody={renderBody}
      onOpen={loadFileContent}
      onClose={handleClose}
    >
      {children}
    </Modal>
  );
}
