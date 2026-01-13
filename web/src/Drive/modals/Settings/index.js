import "./style.css";
import { useState, useCallback } from "react";
import Modal from "../Modal";

export default function Settings({
  currentTheme,
  setCurrentTheme,
  defaultPage,
  setDefaultPage,
  children,
}) {
  const [showJoke, setShowJoke] = useState(false);

  const handleThemeToggle = useCallback(
    (event) => {
      const themeValue = event.target.checked ? "soviet" : "pink";
      setCurrentTheme(themeValue);
    },
    [setCurrentTheme],
  );

  const handleDefaultPageToggle = useCallback(
    (event) => {
      const pageValue = event.target.value;
      setDefaultPage(pageValue);
    },
    [setDefaultPage],
  );

  const handlePrivacyClick = useCallback(
    (e) => {
      e.preventDefault();
      if (showJoke) return;
      setShowJoke(true);
      setTimeout(() => {
        setShowJoke(false);
      }, 1500);
    },
    [showJoke],
  );

  const renderBody = useCallback(
    (isOpen, shouldRender, close) => {
      if (!shouldRender) return null;

      return (
        <>
          {/* Visuals Section */}
          <section className="settings-group">
            <h3 className="group-title">Visuals</h3>
            <div className="settings-row">
              <div className="settings-info">
                <span className="label-text">Theme Mode</span>
                <span className="sub-text">Switch between Soviet and Pink</span>
              </div>
              <div className="switch-container">
                <input
                  type="checkbox"
                  id="dark-mode-toggle"
                  onChange={handleThemeToggle}
                  checked={currentTheme === "soviet"}
                />
                <label
                  htmlFor="dark-mode-toggle"
                  className="switch-label"
                ></label>
              </div>
            </div>
          </section>

          {/* General Section */}
          <section className="settings-group">
            <h3 className="group-title">General</h3>
            <div className="settings-row">
              <div className="settings-info">
                <span className="label-text">Default Page</span>
                <span className="sub-text">
                  Switch between Home and My Drive
                </span>
              </div>
              <div className="switch-container">
                <select
                  id="default-page-select"
                  className="settings-select"
                  onChange={handleDefaultPageToggle}
                  value={defaultPage}
                >
                  <option value="home">Home</option>
                  <option value="mydrive">My Drive</option>
                </select>
              </div>
            </div>
          </section>

          {/* Privacy Joke Section */}
          <section className="settings-group">
            <h3 className="group-title">Security</h3>
            <div
              className={`settings-row joke-row ${
                showJoke ? "animate-shake" : ""
              }`}
              onClick={handlePrivacyClick}
            >
              <div className="settings-info">
                <span className="label-text">Privacy Mode</span>
                <span className="sub-text">Own your data!</span>
              </div>
              <div className="switch-container">
                <input
                  type="checkbox"
                  id="privacy-toggle"
                  disabled
                  checked={false}
                />
                <label
                  htmlFor="privacy-toggle"
                  className="switch-label disabled-label"
                ></label>
              </div>
              {showJoke && (
                <div className="joke-popup">
                  <span>Already sold to China.</span>
                </div>
              )}
            </div>
          </section>
        </>
      );
    },
    [
      currentTheme,
      defaultPage,
      handlePrivacyClick,
      handleThemeToggle,
      handleDefaultPageToggle,
      showJoke,
    ],
  );

  return (
    <Modal title="Settings" renderBody={renderBody} className="settings-modal">
      {(open) => typeof children === "function" && children(open)}
    </Modal>
  );
}
