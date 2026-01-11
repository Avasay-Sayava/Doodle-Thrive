import "./style.css";
import { useEffect, useRef, useState } from "react";

export default function GetText({
  title = "Enter text",
  placeholder = "",
  submitLabel = "OK",
  onSubmit = () => {},
  onClose = () => {},
  children,
}) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const inputRef = useRef(null);

  const close = () => {
    setOpen(false);
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
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [open]);

  const onKeyDown = (e) => {
    if (e.key === "Escape") close();
    if (e.key === "Enter") submit();
  };

  return (
    <>
      {typeof children === "function" && children(() => setOpen(true))}

      {open && (
        <div
          className="get-text-modal__overlay"
          role="presentation"
          onMouseDown={close}
        >
          <div
            className="get-text-modal"
            role="dialog"
            aria-modal="true"
            onMouseDown={(e) => e.stopPropagation()}
            onKeyDown={onKeyDown}
          >
            <h2 className="get-text-modal__title">{title}</h2>

            <input
              ref={inputRef}
              className="get-text-modal__input"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={placeholder}
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
        </div>
      )}
    </>
  );
}
