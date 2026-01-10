import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

import "./style.css";
import SignUp from "../Sign/pages/SignUp";
import SignIn from "../Sign/pages/SignIn";

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
              <SignIn />
            }
          />
          <Route
            path="/signup"
            element={
              <SignUp />
            }
          />
          <Route
            path="/"
            element={
              <Navigate
                to="/signin"
                replace
              />
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
