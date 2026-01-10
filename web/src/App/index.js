import { BrowserRouter, Routes, Route } from "react-router-dom";

import Header from '../panels/Header';
import "./style.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          <Header></Header>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
