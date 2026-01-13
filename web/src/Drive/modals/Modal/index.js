import "./style.css";
import { useEffect, useRef, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import Card from "../../../components/Card";

/**
 * Modal - Base modal component handling dialog/portal/animation logic
 * @param {string} title - Modal title
 * @param {Function} children - Render prop: (open, close) => JSX for trigger
 * @param {Function} renderBody - Content to render in modal body
 * @param {Function} onOpen - Callback when modal opens
 * @param {Function} onClose - Callback when modal closes
 * @param {string} className - CSS class for Card element
 */
export default function Modal({
  title,
  children,
  renderBody,
  onOpen = () => {},
  onClose = () => {},
  className = "modal",
}) {
  const dialogRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const onOpenRef = useRef(onOpen);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onOpenRef.current = onOpen;
  }, [onOpen]);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  const open = () => {
    setShouldRender(true);
    onOpenRef.current();
    setTimeout(() => {
      const dialog = dialogRef.current;
      if (dialog && !dialog.open) {
        dialog.showModal();
      }
      setIsOpen(true);
    }, 0);
  };

  const close = useCallback(() => {
    setIsOpen(false);
    setTimeout(() => {
      const dialog = dialogRef.current;
      if (dialog && dialog.open) {
        dialog.close();
      }
      setShouldRender(false);
      onCloseRef.current();
    }, 200);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e) => {
      if (e.key === "Escape") {
        close();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, close]);

  return (
    <>
      {typeof children === "function" && children(open, close)}

      {shouldRender &&
        createPortal(
          <dialog
            ref={dialogRef}
            className="modal-overlay"
            onClick={(e) => {
              if (e.target === dialogRef.current) {
                close();
              }
            }}
            onCancel={(e) => {
              e.preventDefault();
              close();
            }}
          >
            <Card isOpen={isOpen} className={className}>
              <div 
                className="modal-content" 
                role="dialog" 
                aria-modal="true"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="modal-header">
                  <h2 className="modal-title">{title}</h2>
                  <button
                    className="modal-close"
                    onClick={close}
                    aria-label="Close"
                  >
                    ×
                  </button>
                </div>

                <div className="modal-body">
                  {renderBody ? renderBody(isOpen, shouldRender, close) : null}
                </div>
              </div>
            </Card>
          </dialog>,
          document.body
        )}
    </>
  );
}
