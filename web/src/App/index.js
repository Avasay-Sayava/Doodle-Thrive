import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";

import "./style.css";

import Sign from "../Sign";
import Drive from "../Drive";
import Settings from "../Drive/modals/Settings";

function App() {
  const [currentTheme, setCurrentTheme] = useState(
    localStorage.getItem("theme") || "pink"
  );

  useEffect(() => {
    document.querySelector(":root").setAttribute("theme", currentTheme);
    localStorage.setItem("theme", currentTheme);
  }, [currentTheme]);

  const toggleTheme = () => {
    setCurrentTheme((prev) => (prev === "pink" ? "dark" : "pink"));
  };

  return (
    <>
      <button hidden onClick={toggleTheme} className="toggle-theme" />
      <BrowserRouter>
        <Settings currentTheme={currentTheme} setCurrentTheme={setCurrentTheme}>
          {(openSettings) => (
            <Routes>
              <Route path="/signin" element={<Sign mode="signin" />} />
              <Route path="/signup" element={<Sign mode="signup" />} />
              <Route path="/drive/*" element={<Drive openSettings={openSettings} />} />
              <Route path="*" element={<Sign mode="signin" />} />
            </Routes>
          )}
        </Settings>
      </BrowserRouter>
    </>
  );
}

export default App;
