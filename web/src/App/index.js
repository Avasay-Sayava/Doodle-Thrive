import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";

import "./style.css";

import Sign from "../Sign";
import Drive from "../Drive";
import SettingsPage from "../panels/Header/pages/SettingsPage";

function App() {
  process.env.REACT_APP_API_BASE_URL = "http://localhost:3300";

  const [currentTheme, setCurrentTheme] = useState(localStorage.getItem("theme") || "pink");

  useEffect(() => {
    document.querySelector(":root").setAttribute("theme", currentTheme);
    localStorage.setItem("theme", currentTheme);
  }, [currentTheme]);

  return (
    <>
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
            path="/drive/*"
            element={
              <Drive />
            }
            />
          <Route
            path="/settings"
            element={
              <SettingsPage currentTheme={currentTheme} setCurrentTheme={setCurrentTheme} onBack={() => window.history.back()}/>
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;