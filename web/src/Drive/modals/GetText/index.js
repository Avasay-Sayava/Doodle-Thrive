import "./style.css";
import { useEffect, useRef, useState, useCallback } from "react";
import IconUser from "../../components/icons/IconUser";
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
  const inputRef = useRef(null);
  const excludeUsernamesRef = useRef(excludeUsernames);
  const [value, setValue] = useState("");
  const [selectValue, setSelectValue] = useState(defaultSelectValue);
  const [userResults, setUserResults] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    excludeUsernamesRef.current = excludeUsernames;
  }, [excludeUsernames]);

  const submit = useCallback(
    (close) => {
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
    },
    [value, selectValue, onSubmit, defaultSelectValue, selectOptions]
  );

  const selectUser = (username) => {
    setValue(username);
    setShowDropdown(false);
    setUserResults([]);
  };

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
          .map(([id, { username }]) => ({ id, username }))
          .filter(
            ({ username }) => !excludeUsernamesRef.current.includes(username)
          )
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

  const handleClose = useCallback(() => {
    setValue("");
    setSelectValue(defaultSelectValue);
    setUserResults([]);
    setShowDropdown(false);
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
              onChange={(e) => setValue(e.target.value)}
              placeholder={placeholder}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !showDropdown) submit(close);
              }}
              onFocus={() => {
                if (showUserSearch && userResults.length > 0) {
                  setShowDropdown(true);
                }
              }}
              autoFocus
            />

            {showUserSearch && showDropdown && (
              <div ref={dropdownRef} className="get-text-modal__dropdown">
                {loadingUsers ? (
                  <div className="get-text-modal__dropdown-message">
                    Searching users...
                  </div>
                ) : userResults.length > 0 ? (
                  userResults.map((user) => (
                    <button
                      key={user.id}
                      type="button"
                      className="get-text-modal__dropdown-item"
                      onClick={() => selectUser(user.username)}
                    >
                      <IconUser />
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
                onClick={() => submit(close)}
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
              >
                {submitLabel}
              </button>
            </div>
          )}

          {extraContent ? (
            <div className="get-text-modal__extra">{extraContent}</div>
          ) : null}

          {!buttonAfterSelect && !buttonAfterInput && (
            <div className="get-text-modal__actions">
              <button
                type="button"
                className="get-text-modal__btn get-text-modal__btn--primary"
                onClick={() => submit(close)}
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
      showUserSearch,
      showDropdown,
      loadingUsers,
      userResults,
      buttonAfterInput,
      submitLabel,
      selectOptions,
      selectLabel,
      selectValue,
      buttonAfterSelect,
      extraContent,
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
