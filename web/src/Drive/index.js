import "./style.css";
import { Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";

import HomeView from "./pages/HomeView";
import MydriveView from "./pages/MydriveView";
import SidePanel from "./panels/SidePanel";
import StarredView from "./pages/StarredView";
import Header from "../panels/Header";
import SharedView from "./pages/SharedView";
import RecentsView from "./pages/RecentsView";
import BinView from "./pages/BinView";

function Drive() {
  const [refreshKey, setRefreshKey] = useState(0);

  const onCreated = () => setRefreshKey((k) => k + 1);
  const onRefresh = () => setRefreshKey((k) => k + 1);

  return (
    <div className="app-shell">
            <header className="app-topbar"><Header /></header>

      <div className="app-body">
        <aside className="app-sidebar">
          <SidePanel onCreated={onCreated} />
        </aside>

        <main className="app-content">
          <Routes>
            <Route index element={<HomeView refreshKey={refreshKey} onRefresh={onRefresh} />} />
            <Route path="mydrive" element={<MydriveView refreshKey={refreshKey} onRefresh={onRefresh} />} />
            <Route path="starred" element={<StarredView refreshKey={refreshKey} onRefresh={onRefresh} />} />
            <Route path="shared" element={<SharedView refreshKey={refreshKey} onRefresh={onRefresh} />} />
            <Route path="recent" element={<RecentsView refreshKey={refreshKey} onRefresh={onRefresh} />} />
            <Route path="bin" element={<BinView refreshKey={refreshKey} onRefresh={onRefresh} />} />
            <Route path="*" element={<Navigate to="/drive" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default Drive;
