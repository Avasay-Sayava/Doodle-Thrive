import "./style.css";
import { useRef, useState, useCallback } from "react";
import Modal from "../Modal";

/**
 * GetText modal - a simple popup for user text input with optional dropdown.
 * @param {string} title - modal title
 * @param {string} placeholder - input placeholder
 * @param {string} submitLabel - button label
 * @param {Function} onSubmit - submit callback
 * @param {Function} onClose - close callback
 * @param {Array} selectOptions - dropdown options
 */
export default function GetText({
  title = "Enter text",
  placeholder = "",
  submitLabel = "OK",
  onSubmit = () => {},
  onClose = () => {},
  children,
  selectOptions = null,
  selectLabel = "Select an option",
  defaultSelectValue = "",
  onOpen = () => {},
}) {
  const inputRef = useRef(null);
  const [value, setValue] = useState("");
  const [selectValue, setSelectValue] = useState(defaultSelectValue);

  const submit = useCallback(
    async (close) => {
      const trimmed = value.trim();
      if (!trimmed) return;

      if (selectOptions) {
        await onSubmit(trimmed, selectValue);
      } else {
        await onSubmit(trimmed);
      }

      // Keep dialog open; just reset inputs for next action
      setValue("");
      setSelectValue(defaultSelectValue);
    },
    [value, selectValue, onSubmit, defaultSelectValue, selectOptions]
  );

  const handleClose = useCallback(() => {
    setValue("");
    setSelectValue(defaultSelectValue);
    onClose();
  }, [defaultSelectValue, onClose]);

  const renderBody = useCallback(
    (isOpen, shouldRender, close) => {
      if (!shouldRender) return null;

      return (
        <>
          <div className="get-text-modal__input-wrapper">
            <input
              ref={(el) => {
                inputRef.current = el;
                if (el) el.focus();
              }}
              className="get-text-modal__input"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={placeholder}
              onKeyDown={(e) => {
                if (e.key === "Enter") submit(close);
              }}
              autoFocus
            />
          </div>

          {selectOptions && (
            <div className="get-text-modal__select-group">
              <label className="get-text-modal__select-label">
                {selectLabel}
              </label>
              <select
                className="get-text-modal__select"
                value={selectValue}
                onChange={(e) => setSelectValue(e.target.value)}
              >
                {selectOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="get-text-modal__actions">
            <button
              type="button"
              className="get-text-modal__btn get-text-modal__btn--primary"
              onClick={() => submit(close)}
            >
              {submitLabel}
            </button>
          </div>
        </>
      );
    },
    [value, placeholder, submitLabel, selectOptions, selectLabel, selectValue, submit]
  );

  return (
    <Modal
      title={title}
      onOpen={onOpen}
      onClose={handleClose}
      renderBody={renderBody}
      className="get-text-modal"
    >
      {(open) => typeof children === "function" && children(open)}
    </Modal>
  );
}
