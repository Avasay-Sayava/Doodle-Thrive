import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

import "./style.css";

import HomeView from "../Drive/pages/HomeView";
import SidePanel from "../Drive/panels/SidePanel";
import SignIn from "../sign/pages/SignIn";
import SignUp from "../sign/pages/SignUp";
import StarredView from "../Drive/pages/StarredView";

function App() {
  process.env.REACT_APP_API_BASE_URL = "http://localhost:5000";

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/drive/*" element={
          <div className="app-shell">
            <header className="app-topbar">Topbar</header>

            <div className="app-body">
              <aside className="app-sidebar"><SidePanel /></aside>

              <main className="app-content">
                <Routes>
                    <Route index element={<HomeView />} />
                    <Route path="starred" element={<StarredView />} />
                    {/* <Route path="shared" element={<SharedWithMeView />} />
                    <Route path="recent" element={<RecentView />} />
                    <Route path="bin" element={<BinView />} />
                    <Route path="*" element={<Navigate to="/drive" replace />} /> */}
                  </Routes>
              </main>
            </div>

          </div>
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
        <Route path="*" element={<Navigate to="/drive" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
