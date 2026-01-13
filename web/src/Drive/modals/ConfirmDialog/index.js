import "./style.css";
import { useRef, useEffect } from "react";
import Modal from "../Modal";

/**
 * ConfirmDialog modal - a popup for user confirmation
 * @param {string} title - modal title
 * @param {string} message - confirmation message
 * @param {string} confirmLabel - confirm button label
 * @param {string} cancelLabel - cancel button label
 * @param {boolean} isDangerous - show as a dangerous action (red styling)
 * @param {Function} onConfirm - callback when user confirms
 * @param {Function} onCancel - callback when user cancels
 * @param {Function} children - render function that receives open function
 */
export default function ConfirmDialog({
  title = "Confirm",
  message = "Are you sure?",
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  isDangerous = false,
  onConfirm = () => {},
  onCancel = () => {},
  children,
}) {
  const modalOpenRef = useRef(null);
  const modalCloseRef = useRef(null);

  console.log("[ConfirmDialog] Render");

  return (
    <>
      <Modal
        title={title}
        renderBody={(isOpen, shouldRender, close) => {
          console.log("[ConfirmDialog] Modal renderBody - isOpen:", isOpen, "shouldRender:", shouldRender);
          return (
            <div className="confirm-dialog">
              <p className="confirm-dialog__message">{message}</p>
              <div className="confirm-dialog__actions">
                <button
                  className="confirm-dialog__button confirm-dialog__button--cancel"
                  onClick={() => {
                    console.log("[ConfirmDialog] Cancel clicked");
                    close();
                    onCancel?.();
                  }}
                >
                  {cancelLabel}
                </button>
                <button
                  className={`confirm-dialog__button confirm-dialog__button--confirm ${
                    isDangerous ? "is-dangerous" : ""
                  }`}
                  onClick={() => {
                    console.log("[ConfirmDialog] Confirm clicked");
                    close();
                    onConfirm?.();
                  }}
                >
                  {confirmLabel}
                </button>
              </div>
            </div>
          );
        }}
      >
        {(open, close) => {
          console.log("[ConfirmDialog] Modal children render function called");
          modalOpenRef.current = open;
          modalCloseRef.current = close;
          return children?.(open);
        }}
      </Modal>
    </>
  );
}
