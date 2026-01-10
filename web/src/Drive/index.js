import "./style.css";

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import HomeView from "./pages/HomeView";
import SidePanel from "./panels/SidePanel";
import StarredView from "./pages/StarredView";
import Header from "../panels/Header";

function Drive() {
  return (
    <div className="app-shell">
            <header className="app-topbar"><Header /></header>

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

          </div>);
}

export default Drive;