import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";

import "./style.css";

import Sign from "../Sign";
import Drive from "../Drive";
import Settings from "../Drive/modals/Settings";

function App() {
  const [currentTheme, setCurrentTheme] = useState(
    localStorage.getItem("theme") === "soviet" ? "soviet" : "pink",
  );

  const [defaultPage, setDefaultPage] = useState(
    localStorage.getItem("default-page") === "mydrive" ? "mydrive" : "home",
  );

  useEffect(() => {
    document.querySelector(":root").setAttribute("theme", currentTheme);
    localStorage.setItem("theme", currentTheme);
  }, [currentTheme]);

  useEffect(() => {
    localStorage.setItem("default-page", defaultPage);
  }, [defaultPage]);

  return (
    <BrowserRouter>
      <Settings
        currentTheme={currentTheme}
        setCurrentTheme={setCurrentTheme}
        defaultPage={defaultPage}
        setDefaultPage={setDefaultPage}
      >
        {(openSettings) => (
          <Routes>
            <Route path="/signin" element={<Sign mode="signin" />} />
            <Route path="/signup" element={<Sign mode="signup" />} />
            <Route
              path="/drive/*"
              element={
                <Drive openSettings={openSettings} defaultPage={defaultPage} />
              }
            />
            <Route path="*" element={<Sign mode="signin" />} />
          </Routes>
        )}
      </Settings>
    </BrowserRouter>
  );
}

export default App;
