import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

import "./style.css";


import SignIn from "../Sign/pages/SignIn";
import SignUp from "../Sign/pages/SignUp";
import Drive from "../Drive";

function App() {
  process.env.API_BASE_URL = "http://localhost:3300";

  const [currentTheme, setCurrentTheme] = useState(localStorage.getItem("theme") || "pink");

  useEffect(() => {
    document.querySelector(":root").setAttribute("theme", currentTheme);
    localStorage.setItem("theme", currentTheme);
  }, [currentTheme]);

  const toggleTheme = () => {
    setCurrentTheme((prev) => (prev === "soviet" ? "pink" : "soviet"));
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/drive/*" element={
          <Drive />
        } />
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
  );
}

export default App;
