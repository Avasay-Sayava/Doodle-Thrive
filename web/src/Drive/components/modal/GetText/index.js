import "./style.css";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

export default function GetText({
  title = "Enter text",
  placeholder = "",
  submitLabel = "OK",
  onSubmit = () => {},
  onClose = () => {},
  children,
}) {
  const dialogRef = useRef(null);
  const inputRef = useRef(null);
  const [value, setValue] = useState("");

  const open = () => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (!dialog.open) dialog.showModal();

    setTimeout(() => inputRef.current?.focus(), 0);
  }; 

  const close = () => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (dialog.open) dialog.close();

    setValue("");
    onClose();
  };

  const submit = () => {
    const trimmed = value.trim();
    if (!trimmed) return;
    onSubmit(trimmed);
    close();
  };

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleClose = () => {
      setValue("");
      onClose();
    };

    dialog.addEventListener("close", handleClose);
    return () => dialog.removeEventListener("close", handleClose);
  }, [onClose]);


  return (
    <>
      {typeof children === "function" && children(open)}

      {createPortal(
        <dialog
          ref={dialogRef}
          className="get-text-modal__overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) close();
          }}
        >
          <div className="get-text-modal" role="dialog" aria-modal="true">
            <h2 className="get-text-modal__title">{title}</h2>

            <input
              ref={inputRef}
              className="get-text-modal__input"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={placeholder}
              onKeyDown={(e) => {
                if (e.key === "Enter") submit();
              }}
            />

            <div className="get-text-modal__actions">
              <button
                type="button"
                className="get-text-modal__btn get-text-modal__btn--ghost"
                onClick={close}
              >
                Cancel
              </button>

              <button
                type="button"
                className="get-text-modal__btn get-text-modal__btn--primary"
                onClick={submit}
              >
                {submitLabel}
              </button>
            </div>
          </div>
        </dialog>,
        document.body
      )}
    </>
  );
}
