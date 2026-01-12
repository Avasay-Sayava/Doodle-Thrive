import "./style.css";
import { useEffect, useRef, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import Card from "../../../components/Card";

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
  onOpen = () => {},
  buttonAfterSelect = false,
  buttonAfterInput = false,
  excludeUsernames = [],
}) {
  const dialogRef = useRef(null);
  const inputRef = useRef(null);
  const onCloseRef = useRef(onClose);
  const excludeUsernamesRef = useRef(excludeUsernames);
  const [isOpen, setIsOpen] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const [value, setValue] = useState("");
  const [selectValue, setSelectValue] = useState(defaultSelectValue);
  const [userResults, setUserResults] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    excludeUsernamesRef.current = excludeUsernames;
  }, [excludeUsernames]);

  const open = () => {
    onOpen();
    setShouldRender(true);
    setTimeout(() => {
      const dialog = dialogRef.current;
      if (dialog && !dialog.open) {
        dialog.showModal();
      }
      setIsOpen(true);
    }, 0);
    setTimeout(() => inputRef.current?.focus(), 50);
  }; 

  const close = useCallback(() => {
    setIsOpen(false);
    setTimeout(() => {
      const dialog = dialogRef.current;
      if (dialog && dialog.open) {
        dialog.close();
      }
      setShouldRender(false);
      setValue("");
      setSelectValue(defaultSelectValue);
      setUserResults([]);
      setShowDropdown(false);
      onCloseRef.current();
    }, 200);
  }, [defaultSelectValue]);

  const submit = () => {
    const trimmed = value.trim();
    if (!trimmed) return;
    
    if (selectOptions) {
      onSubmit(trimmed, selectValue);
    } else {
      onSubmit(trimmed);
    }

    // Keep dialog open; just reset inputs for next action
    setValue("");
    setSelectValue(defaultSelectValue);
    setUserResults([]);
    setShowDropdown(false);
  };

  const selectUser = (username) => {
    setValue(username);
    setShowDropdown(false);
    setUserResults([]);
  };

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        close();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [close, isOpen]);

  // User search effect
  useEffect(() => {
    const trimmed = value.trim();
    if (!showUserSearch || !trimmed) {
      setUserResults([]);
      setShowDropdown(false);
      return undefined;
    }

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setLoadingUsers(true);
      try {
        const jwt = localStorage.getItem("token");
        if (!jwt) {
          setUserResults({});
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
          setUserResults({});
          return;
        }

        const data = await res.json();
        const users = Object.entries(data || {})
          .map(([id, {username}]) => ({ id, username }))
          .filter(({username}) => !excludeUsernamesRef.current.includes(username))
          .slice(0, 5);
        setUserResults(users);
        setShowDropdown(users.length > 0);
      } catch (err) {
        if (err.name !== "AbortError") {
          setUserResults({});
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

  return (
    <>
      {typeof children === "function" && children(open)}

      {shouldRender && createPortal(
        <dialog
          ref={dialogRef}
          className="get-text-modal__overlay"
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
          <Card isOpen={isOpen} className="get-text-modal">
            <div className="get-text-modal__content" role="dialog" aria-modal="true">
              <div className="get-text-modal__header">
                <h2 className="get-text-modal__title">{title}</h2>
                <button
                  type="button"
                  className="get-text-modal__close"
                  aria-label="Close dialog"
                  onClick={close}
                >
                  ×
                </button>
              </div>

              <div className="get-text-modal__input-wrapper">
                <input
                  ref={inputRef}
                  className="get-text-modal__input"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder={placeholder}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !showDropdown) submit();
                  }}
                  onFocus={() => {
                    if (showUserSearch && userResults.length > 0) {
                      setShowDropdown(true);
                    }
                  }}
                />
                
                {showUserSearch && showDropdown && (
                  <div ref={dropdownRef} className="get-text-modal__dropdown">
                    {loadingUsers ? (
                      <div className="get-text-modal__dropdown-message">Searching users...</div>
                    ) : userResults.length > 0 ? (
                      userResults.map((user) => (
                        <button
                          key={user.id}
                          type="button"
                          className="get-text-modal__dropdown-item"
                          onClick={() => selectUser(user.username)}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                          </svg>
                          <span>{user.username}</span>
                        </button>
                      ))
                    ) : null}
                  </div>
                )}
              </div>

              {buttonAfterInput && (
                <div className="get-text-modal__actions">
                  <button
                    type="button"
                    className="get-text-modal__btn get-text-modal__btn--primary"
                    onClick={submit}
                  >
                    {submitLabel}
                  </button>
                </div>
              )}

              {selectOptions && (
                <div className="get-text-modal__select-group">
                  <label className="get-text-modal__select-label">{selectLabel}</label>
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
                    onClick={submit}
                  >
                    {submitLabel}
                  </button>
                </div>
              )}

              {extraContent ? <div className="get-text-modal__extra">{extraContent}</div> : null}

              {!buttonAfterSelect && !buttonAfterInput && (
                <div className="get-text-modal__actions">
                  <button
                    type="button"
                    className="get-text-modal__btn get-text-modal__btn--primary"
                    onClick={submit}
                  >
                    {submitLabel}
                  </button>
                </div>
              )}
            </div>
          </Card>
        </dialog>,
        document.body
      )}
    </>
  );
}
