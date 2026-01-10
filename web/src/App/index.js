import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Header from '../panels/Header';
import "./style.css";
import SignUp from "../sign/pages/SignUp";
import SignIn from "../sign/pages/SignIn";

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
