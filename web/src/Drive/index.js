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
import SearchView from "./pages/SearchView";
import FolderView from "./pages/FolderView";
function Drive({ openSettings, defaultPage }) {
  const [refreshKey, setRefreshKey] = useState(0);
  const onCreated = () => setRefreshKey((k) => k + 1);
  const onRefresh = () => {
    setRefreshKey((k) => k + 1);
  };
  return (
    <div className="app-shell">
            <header className="app-topbar"><Header openSettings={openSettings} /></header>
      <div className="app-body">
        <aside className="app-sidebar">
          <SidePanel onCreated={onCreated} />
        </aside>
        <main className="app-content">
          <Routes>
            <Route path="home" element={<HomeView key={refreshKey} refreshKey={refreshKey} onRefresh={onRefresh} />} />
            <Route path="mydrive" element={<MydriveView key={refreshKey} refreshKey={refreshKey} onRefresh={onRefresh} />} />
            <Route path="folders/:folderId" element={<FolderView key={refreshKey} refreshKey={refreshKey} onRefresh={onRefresh} />} />
            <Route path="search" element={<SearchView key={refreshKey} refreshKey={refreshKey} onRefresh={onRefresh} />} />
            <Route path="starred" element={<StarredView key={refreshKey} refreshKey={refreshKey} onRefresh={onRefresh} />} />
            <Route path="shared" element={<SharedView key={refreshKey} refreshKey={refreshKey} onRefresh={onRefresh} />} />
            <Route path="recent" element={<RecentsView key={refreshKey} refreshKey={refreshKey} onRefresh={onRefresh} />} />
            <Route path="bin" element={<BinView key={refreshKey} refreshKey={refreshKey} onRefresh={onRefresh} />} />
            <Route path="*" element={<Navigate to={`/drive/${defaultPage}`} replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
export default Drive;
