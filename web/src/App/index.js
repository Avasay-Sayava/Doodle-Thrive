import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";

import "./style.css";
import Sign from "../Sign";

function App() {
  const [currentTheme, setCurrentTheme] = useState(localStorage.getItem("theme") || "pink");

  useEffect(() => {
    document.querySelector(":root").setAttribute("theme", currentTheme);
    localStorage.setItem("theme", currentTheme);
  }, [currentTheme]);

  const toggleTheme = () => {
    setCurrentTheme((prev) => (prev === "soviet" ? "pink" : "soviet"));
  };

  return (
    <>
      <button id="toggle-theme" hidden onClick={toggleTheme} />
      <BrowserRouter>
        <Routes>
          <Route
            path="/signin"
            element={
              <Sign mode="signin" />
            }
          />
          <Route
            path="/signup"
            element={
              <Sign mode="signup" />
            }
          />
          <Route
            path="/drive/home"
            element={
              <></>
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
