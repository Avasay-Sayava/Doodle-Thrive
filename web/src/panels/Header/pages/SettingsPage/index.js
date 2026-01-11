import React, { useState, useEffect } from 'react';
import './style.css';

function SettingsPage({ currentTheme, setCurrentTheme, onBack }) {
  const [showJoke, setShowJoke] = useState(false);

  function handleThemeToggle(event) {
    const themeValue = event.target.checked ? "soviet" : "pink";
    setCurrentTheme(themeValue);
  }

  function handlePrivacyClick(e) {
    e.preventDefault();
    setShowJoke(true);
    setTimeout(function() { 
      setShowJoke(false); 
    }, 1500);
  }

  return (
    <div className="settings-screen-container">
      <div className="settings-card">
        <header className="settings-header">
          <button className="back-button" onClick={onBack}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2.5">
              <path d="M15 18l-6-6 6-6"/>
            </svg>
            Back
          </button>
          <h2>Settings</h2>
        </header>

        <div className="settings-body">
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
                <label htmlFor="dark-mode-toggle"></label>
              </div>
            </div>
          </section>

          {/* Privacy Joke Section */}
          <section className="settings-group">
            <h3 className="group-title">Security</h3>
            <div 
              className={`settings-row joke-row ${showJoke ? 'animate-shake' : ''}`} 
              onClick={handlePrivacyClick}
            >
              <div className="settings-info">
                <span className="label-text">Privacy Mode</span>
                <span className="sub-text">Own your data!</span>
              </div>
              <div className="switch-container">
                <input type="checkbox" id="privacy-toggle" disabled checked={false} />
                <label htmlFor="privacy-toggle" className="disabled-label"></label>
              </div>
              {showJoke && (
                <div className="joke-popup">
                  <span>Nah, sold your data to China</span>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;