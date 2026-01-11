import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";

import "./style.css";

import Sign from "../Sign";
import Drive from "../Drive";

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
    <button onClick={toggleTheme} id="toggle-theme" hidden />
    <BrowserRouter>
      <Routes>
        <Route path="/drive/*" element={
          <Drive />
        } />
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
