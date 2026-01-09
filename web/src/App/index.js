import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./style.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          <div>Hello, World!</div>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
