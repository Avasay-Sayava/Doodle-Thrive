import "./style.css";
import { useEffect, useRef, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import Card from "../../../components/Card";

/**
 * Modal - Base modal component handling dialog/portal/animation logic
 * @param {string} title - Modal title
 * @param {Function} children - Render prop: (open, close) => JSX for trigger
 * @param {Function} renderBody - Content to render in modal body
 * @param {Function} onClose - Callback when modal closes
 * @param {string} className - CSS class for Card element
 */
export default function Modal({
  title,
  children,
  renderBody,
  onClose = () => {},
  className = "modal",
}) {
  const dialogRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  const open = () => {
    setShouldRender(true);
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
            className="modal__overlay"
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
              <div className="modal__content" role="dialog" aria-modal="true">
                <div className="modal__header">
                  <h2 className="modal__title">{title}</h2>
                  <button
                    className="modal__close"
                    onClick={close}
                    aria-label="Close"
                  >
                    ×
                  </button>
                </div>

                <div className="modal__body">
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
