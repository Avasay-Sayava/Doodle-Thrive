import "./style.css";
import { useEffect, useRef, useState, useCallback } from "react";
import Modal from "../Modal";

const API_BASE = process.env.API_BASE_URL || "http://localhost:3300";

/**
 * GetText modal - a popup for user input with optional search.
 * @param {string} title - modal title
 * @param {string} placeholder - input placeholder
 * @param {string} submitLabel - button label
 * @param {Function} onSubmit - submit callback
 * @param {Function} onClose - close callback
 * @param {Array} selectOptions - dropdown options
 * @param {boolean} showUserSearch - enable user search
 * @param {boolean} buttonAfterSelect - show button after select dropdown
 * @param {Array} excludeUsernames - usernames to exclude from search
 * @param {Function} renderExtra - render function for extra content with search state
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
  showUserSearch = false,
  extraContent = null,
  renderExtra = null,
  onOpen = () => {},
  buttonAfterSelect = false,
  buttonAfterInput = false,
  excludeUsernames = [],
  error = null,
  userFound = true,
  onInputChange = () => {},
}) {
  const inputRef = useRef(null);
  const excludeUsernamesRef = useRef(excludeUsernames);
  const [value, setValue] = useState("");
  const [selectValue, setSelectValue] = useState(defaultSelectValue);
  const [userResults, setUserResults] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  useEffect(() => {
    excludeUsernamesRef.current = excludeUsernames;
  }, [excludeUsernames]);

  const submit = useCallback(
    async (close) => {
      const trimmed = value.trim();
      if (!trimmed || !userFound) return;

      if (selectOptions) {
        await onSubmit(trimmed, selectValue);
      } else {
        await onSubmit(trimmed);
      }

      // Keep dialog open; just reset inputs for next action
      setValue("");
      setSelectValue(defaultSelectValue);
      setUserResults([]);
    },
    [value, selectValue, onSubmit, defaultSelectValue, selectOptions, userFound]
  );

  // User search effect
  useEffect(() => {
    const trimmed = value.trim();
    if (!showUserSearch || !trimmed || trimmed.length < 1) {
      setUserResults([]);
      return undefined;
    }

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setLoadingUsers(true);
      try {
        const jwt = localStorage.getItem("token");
        if (!jwt) {
          setUserResults([]);
          return;
        }

        const res = await fetch(`${API_BASE}/api/users`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwt}`,
          },
          body: JSON.stringify({ username: trimmed }),
        });

        if (!res.ok) {
          setUserResults([]);
          return;
        }

        const data = await res.json();
        const users = Object.entries(data || {})
          .map(([id, { username }]) => ({ id, username }))
          .filter(
            ({ username }) => !excludeUsernamesRef.current.includes(username)
          );
        setUserResults(users);
      } catch (err) {
        if (err.name !== "AbortError") {
          setUserResults([]);
        }
      } finally {
        setLoadingUsers(false);
      }
    }, 0);

    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [value, showUserSearch]);

  const handleClose = useCallback(() => {
    setValue("");
    setSelectValue(defaultSelectValue);
    setUserResults([]);
    onClose();
  }, [defaultSelectValue, onClose]);

  const renderBody = useCallback(
    (isOpen, shouldRender, close) => {
      if (!shouldRender) return null;

      return (
        <>
          <div className="get-text-modal__input-wrapper">
            <input
              ref={inputRef}
              className="get-text-modal__input"
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
                onInputChange(e.target.value);
              }}
              placeholder={placeholder}
              onKeyDown={(e) => {
                if (e.key === "Enter") submit(close);
              }}
              autoFocus
            />
          </div>

          {error && <div className="get-text-modal__error">{error}</div>}

          {buttonAfterInput && (
            <div className="get-text-modal__actions">
              <button
                type="button"
                className="get-text-modal__btn get-text-modal__btn--primary"
                onClick={() => submit(close)}
                disabled={!userFound}
              >
                {submitLabel}
              </button>
            </div>
          )}

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

          {buttonAfterSelect && (
            <div className="get-text-modal__actions">
              <button
                type="button"
                className="get-text-modal__btn get-text-modal__btn--primary"
                onClick={() => submit(close)}
                disabled={!userFound}
              >
                {submitLabel}
              </button>
            </div>
          )}

          {renderExtra ? (
            <div className="get-text-modal__extra">
              {renderExtra({ userResults, loadingUsers })}
            </div>
          ) : extraContent ? (
            <div className="get-text-modal__extra">{extraContent}</div>
          ) : null}

          {!buttonAfterSelect && !buttonAfterInput && (
            <div className="get-text-modal__actions">
              <button
                type="button"
                className="get-text-modal__btn get-text-modal__btn--primary"
                onClick={() => submit(close)}
                disabled={!userFound}
              >
                {submitLabel}
              </button>
            </div>
          )}
        </>
      );
    },
    [
      value,
      placeholder,
      error,
      buttonAfterInput,
      userFound,
      submitLabel,
      selectOptions,
      selectLabel,
      selectValue,
      buttonAfterSelect,
      renderExtra,
      userResults,
      loadingUsers,
      extraContent,
      onInputChange,
      submit,
    ]
  );

  return (
    <Modal
      title={title}
      onClose={handleClose}
      renderBody={renderBody}
      className="get-text-modal"
    >
      {(open) => typeof children === "function" && children(open)}
    </Modal>
  );
}
